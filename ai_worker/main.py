import os
import re
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from pymongo import MongoClient

# ── Ultra-light stack: no torch, no transformers, no sentence-transformers ──
import onnxruntime as ort
from tokenizers import Tokenizer
from huggingface_hub import hf_hub_download

# ─── CONFIGURATION ──────────────────────────────────────────────────────────
MONGO_URI   = os.environ.get("MONGO_URI", "mongodb://127.0.0.1:27017/inacad-fusion")
MODEL_REPO  = "optimum/all-MiniLM-L6-v2"   # Only the ONNX file (~90MB) is downloaded
TOKENIZER_REPO = "sentence-transformers/all-MiniLM-L6-v2"
MAX_SEQ_LEN = 128

app = FastAPI(title="InAcadFusion AI Recommendation Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── STATE ──────────────────────────────────────────────────────────────────
tokenizer        = None   # HuggingFace fast tokenizer (Rust, <5 MB)
ort_session      = None   # ONNX Runtime session (~35 MB)
project_embeddings = None # numpy (N, 384)
projects_meta    = []     # plain Python list – no pandas
student_embeddings = None # numpy (M, 384)
students_meta    = []     # plain Python list

# ─── UTILS ──────────────────────────────────────────────────────────────────
def clean_text(text: str) -> str:
    if not text:
        return ""
    text = str(text).lower()
    text = re.sub(r"[^a-z0-9+# ]", "", text)
    return " ".join(text.split())


def encode_texts(texts: list) -> np.ndarray:
    """Tokenize + ONNX inference + mean-pool + L2-normalise."""
    encodings = tokenizer.encode_batch(texts)

    input_ids      = np.array([e.ids            for e in encodings], dtype=np.int64)
    attention_mask = np.array([e.attention_mask  for e in encodings], dtype=np.int64)
    token_type_ids = np.zeros_like(input_ids, dtype=np.int64)

    outputs = ort_session.run(None, {
        "input_ids":      input_ids,
        "attention_mask": attention_mask,
        "token_type_ids": token_type_ids,
    })

    token_embeddings = outputs[0]                                   # (B, seq, 384)
    mask = attention_mask[:, :, np.newaxis].astype(np.float32)
    summed  = np.sum(token_embeddings * mask, axis=1)               # (B, 384)
    counts  = np.clip(mask.sum(axis=1), 1e-9, None)
    pooled  = summed / counts

    norms = np.linalg.norm(pooled, axis=1, keepdims=True)
    return pooled / np.clip(norms, 1e-9, None)                      # L2-normalised


# ─── DB LOADER ──────────────────────────────────────────────────────────────
def load_data_from_db():
    global projects_meta, project_embeddings, students_meta, student_embeddings
    try:
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
        
        # 1. Load Projects
        raw_projects = list(client["inacad-fusion"]["projects"].find({"status": "active"}))
        if raw_projects:
            texts, metas = [], []
            for p in raw_projects:
                skills = " ".join(p.get("requiredSkills", []) or [])
                combined = (
                    f"Domain: {p.get('domain', '')} | "
                    f"Title: {p.get('title', '')} | "
                    f"Description: {p.get('description', '')} | "
                    f"Skills: {skills}"
                )
                texts.append(clean_text(combined))
                metas.append({
                    "id":          str(p["_id"]),
                    "title":       p.get("title", ""),
                    "domain":      p.get("domain", ""),
                    "description": p.get("description", ""),
                    "type":        p.get("type", ""),
                })
            print(f"Embedding {len(texts)} projects with ONNX Runtime...")
            project_embeddings = encode_texts(texts)
            projects_meta = metas
            print("✅ Project embeddings ready.")
        
        # 2. Load Students
        raw_users = list(client["inacad-fusion"]["users"].find({"role": "student"}))
        if raw_users:
            s_texts, s_metas = [], []
            for s in raw_users:
                pd = s.get("profileDetails", {})
                skills = " ".join(pd.get("skills", []) or [])
                combined = (
                    f"Name: {s.get('name', '')} | "
                    f"Background: {pd.get('academicBackground', '')} | "
                    f"Domain: {pd.get('industryDomain', '')} | "
                    f"Description: {pd.get('description', '')} | "
                    f"Skills: {skills}"
                )
                s_texts.append(clean_text(combined))
                s_metas.append({
                    "_id": str(s["_id"]),
                    "name": s.get("name", ""),
                    "email": s.get("email", ""),
                    "profileDetails": pd
                })
            print(f"Embedding {len(s_texts)} students with ONNX Runtime...")
            student_embeddings = encode_texts(s_texts)
            students_meta = s_metas
            print("✅ Student embeddings ready.")
            
    except Exception as e:
        print(f"❌ Error loading data: {e}")


# ─── STARTUP ────────────────────────────────────────────────────────────────
@app.on_event("startup")
def startup_event():
    import threading

    def _init():
        global tokenizer, ort_session
        try:
            print("Downloading tokenizer (fast Rust tokenizer)...")
            tok = Tokenizer.from_pretrained(TOKENIZER_REPO)
            tok.enable_padding(pad_id=0, pad_token="[PAD]", length=MAX_SEQ_LEN)
            tok.enable_truncation(max_length=MAX_SEQ_LEN)
            tokenizer = tok
            print("✅ Tokenizer loaded.")

            print(f"Downloading ONNX model from {MODEL_REPO} ...")
            model_path = hf_hub_download(repo_id=MODEL_REPO, filename="model.onnx")
            sess_opts = ort.SessionOptions()
            sess_opts.intra_op_num_threads = 1   # single-core on free tier
            sess_opts.inter_op_num_threads = 1
            ort_session = ort.InferenceSession(
                model_path,
                sess_options=sess_opts,
                providers=["CPUExecutionProvider"],
            )
            print("✅ ONNX model loaded.")

            load_data_from_db()
        except Exception as e:
            print(f"❌ Initialisation error: {e}")

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
        "model_loaded": ort_session is not None,
        "projects_indexed": len(projects_meta),
    }


@app.post("/recommend")
async def recommend(request: QueryRequest):
    if ort_session is None:
        raise HTTPException(status_code=503, detail="AI model still initialising – retry shortly.")
    if project_embeddings is None or len(projects_meta) == 0:
        return {"data": []}

    try:
        query_vec = encode_texts([clean_text(request.query)])[0]        # (384,)
        scores    = project_embeddings @ query_vec                       # (N,) cosine sim

        top_n   = min(request.top_n, len(projects_meta))
        top_idx = np.argsort(scores)[::-1][:top_n]

        results = []
        for idx in top_idx:
            m = projects_meta[idx]
            results.append({**m, "confidence": round(float(scores[idx]) * 100, 2)})

        return {"data": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/recommend_students")
async def recommend_students(request: QueryRequest):
    if ort_session is None:
        raise HTTPException(status_code=503, detail="AI model still initialising – retry shortly.")
    if student_embeddings is None or len(students_meta) == 0:
        return {"data": []}

    try:
        query_vec = encode_texts([clean_text(request.query)])[0]        # (384,)
        scores    = student_embeddings @ query_vec                       # (M,) cosine sim

        top_n   = min(request.top_n, len(students_meta))
        top_idx = np.argsort(scores)[::-1][:top_n]

        results = []
        for idx in top_idx:
            m = students_meta[idx]
            results.append({**m, "confidence": round(float(scores[idx]) * 100, 2)})

        return {"data": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/refresh")
def refresh():
    """Reload embeddings after new project is uploaded."""
    if ort_session is None:
        raise HTTPException(status_code=503, detail="Model not ready yet.")
    load_data_from_db()
    return {"status": "success", "projects_indexed": len(projects_meta)}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
