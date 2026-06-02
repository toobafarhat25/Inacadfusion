import os
import re
import json
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from pymongo import MongoClient

# ─── Use ONNX Runtime instead of PyTorch (~80MB vs ~700MB) ──────────────────
from optimum.onnxruntime import ORTModelForFeatureExtraction
from transformers import AutoTokenizer

# ─── CONFIGURATION ──────────────────────────────────────────────────────────
MONGO_URI = os.environ.get("MONGO_URI", "mongodb://127.0.0.1:27017/inacad-fusion")
MODEL_NAME = "optimum/all-MiniLM-L6-v2"   # Pre-exported ONNX version (no PyTorch!)
MAX_SEQ_LEN = 128                           # MiniLM native max; keep it small

app = FastAPI(title="InAcadFusion AI Recommendation Engine")

# Allow CORS from the frontend / Node backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── STATE ──────────────────────────────────────────────────────────────────
tokenizer = None
ort_model = None
project_embeddings = None   # numpy array  (N, 384)
projects_meta = []          # plain Python list of dicts – no pandas needed

# ─── UTILS ──────────────────────────────────────────────────────────────────
def clean_text(text: str) -> str:
    if not text:
        return ""
    text = str(text).lower()
    text = re.sub(r"[^a-z0-9+# ]", "", text)
    return " ".join(text.split())


def mean_pooling(model_output, attention_mask):
    """Average token embeddings weighted by attention mask."""
    token_embeddings = model_output[0]  # shape: (batch, seq, hidden)
    mask_expanded = attention_mask[:, :, np.newaxis].astype(np.float32)
    summed = np.sum(token_embeddings * mask_expanded, axis=1)
    counts = np.clip(mask_expanded.sum(axis=1), a_min=1e-9, a_max=None)
    return summed / counts


def encode_texts(texts: list[str]) -> np.ndarray:
    """Tokenize and embed a list of texts. Returns (N, 384) float32 array."""
    encoded = tokenizer(
        texts,
        padding=True,
        truncation=True,
        max_length=MAX_SEQ_LEN,
        return_tensors="np",   # numpy – no torch dependency
    )
    outputs = ort_model(
        input_ids=encoded["input_ids"],
        attention_mask=encoded["attention_mask"],
    )
    embeddings = mean_pooling(outputs, encoded["attention_mask"])
    # L2 normalise for cosine similarity via dot product
    norms = np.linalg.norm(embeddings, axis=1, keepdims=True)
    return embeddings / np.clip(norms, 1e-9, None)


def cosine_similarity_matrix(query_vec: np.ndarray, corpus: np.ndarray) -> np.ndarray:
    """query_vec: (384,) | corpus: (N, 384) → scores: (N,)"""
    return corpus @ query_vec


# ─── DB LOADER ──────────────────────────────────────────────────────────────
def load_data_from_db():
    global projects_meta, project_embeddings
    try:
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
        db = client["inacad-fusion"]
        raw = list(db["projects"].find({"status": "active"}))
        if not raw:
            print("No active projects found.")
            return

        texts, metas = [], []
        for p in raw:
            skills = " ".join(p.get("requiredSkills", []) or [])
            combined = (
                f"Domain: {p.get('domain', '')} | "
                f"Title: {p.get('title', '')} | "
                f"Description: {p.get('description', '')} | "
                f"Skills: {skills}"
            )
            texts.append(clean_text(combined))
            metas.append({
                "id": str(p["_id"]),
                "title": p.get("title", ""),
                "domain": p.get("domain", ""),
                "description": p.get("description", ""),
                "type": p.get("type", ""),
            })

        print(f"Embedding {len(texts)} projects with ONNX Runtime...")
        project_embeddings = encode_texts(texts)   # (N, 384)
        projects_meta = metas
        print("✅ Embeddings ready.")
    except Exception as e:
        print(f"❌ Error loading data: {e}")


# ─── STARTUP ────────────────────────────────────────────────────────────────
@app.on_event("startup")
def startup_event():
    global tokenizer, ort_model
    import threading

    def _init():
        global tokenizer, ort_model
        print(f"Loading ONNX model: {MODEL_NAME} ...")
        tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
        ort_model = ORTModelForFeatureExtraction.from_pretrained(MODEL_NAME)
        print("✅ ONNX model loaded.")
        load_data_from_db()

    threading.Thread(target=_init, daemon=True).start()


# ─── SCHEMAS ────────────────────────────────────────────────────────────────
class QueryRequest(BaseModel):
    query: str
    top_n: Optional[int] = 5


# ─── ENDPOINTS ──────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {
        "status": "online",
        "projects_indexed": len(projects_meta),
        "model_loaded": ort_model is not None,
    }


@app.post("/recommend")
async def recommend(request: QueryRequest):
    if ort_model is None:
        raise HTTPException(status_code=503, detail="AI model still initialising – try again shortly.")
    if project_embeddings is None or len(projects_meta) == 0:
        return {"data": []}

    try:
        query_vec = encode_texts([clean_text(request.query)])[0]   # (384,)
        scores = cosine_similarity_matrix(query_vec, project_embeddings)

        top_n = min(request.top_n, len(projects_meta))
        top_indices = np.argsort(scores)[::-1][:top_n]

        results = []
        for idx in top_indices:
            m = projects_meta[idx]
            results.append({**m, "confidence": round(float(scores[idx]) * 100, 2)})

        return {"data": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/refresh")
def refresh():
    """Manually reload project embeddings (call after a new project upload)."""
    load_data_from_db()
    return {"status": "success", "projects_indexed": len(projects_meta)}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
