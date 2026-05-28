import os
import torch
import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from pymongo import MongoClient
from sentence_transformers import SentenceTransformer, util
import re

# ─── CONFIGURATION ──────────────────────────────────────────────────────────
# Force CPU since user has no GPU
torch.set_num_threads(4) 
DEVICE = "cpu"
MONGO_URI = os.environ.get("MONGO_URI", "mongodb://127.0.0.1:27017/inacad-fusion")
MODEL_NAME = 'all-MiniLM-L6-v2'

app = FastAPI(title="InAcadFusion AI Recommendation Engine")

# ─── STATE ──────────────────────────────────────────────────────────────────
model = None
project_embeddings = None
projects_df = None

# ─── UTILS ──────────────────────────────────────────────────────────────────
def clean_text(text):
    if not text: return ""
    text = str(text).lower()
    text = re.sub(r'[^a-z0-9+# ]', '', text)
    return " ".join(text.split())

def load_data_from_db():
    global projects_df, project_embeddings
    try:
        client = MongoClient(MONGO_URI)
        db = client['inacad-fusion']
        projects_collection = db['projects']
        
        # Fetch active projects
        raw_projects = list(projects_collection.find({"status": "active"}))
        if not raw_projects:
            print("No active projects found in DB.")
            return

        df = pd.DataFrame(raw_projects)
        
        # Feature Engineering (Same as Colab logic)
        df['combined_features'] = (
            "Domain: " + df['domain'].astype(str) + " | " +
            "Title: " + df['title'].astype(str) + " | " +
            "Description: " + df['description'].astype(str) + " | " +
            "Skills: " + df['requiredSkills'].apply(lambda x: " ".join(x) if isinstance(x, list) else str(x))
        ).apply(clean_text)

        # Generate Embeddings
        print(f"Embedding {len(df)} projects...")
        embeddings = model.encode(df['combined_features'].tolist(), convert_to_tensor=True, device=DEVICE)
        
        projects_df = df
        project_embeddings = embeddings
        print("Embeddings ready.")
    except Exception as e:
        print(f"Error loading data: {e}")

def initialize_ai():
    global model
    try:
        print(f"Loading AI Model: {MODEL_NAME}...")
        model = SentenceTransformer(MODEL_NAME, device=DEVICE)
        load_data_from_db()
    except Exception as e:
        print(f"Error during AI initialization: {e}")

# ─── STARTUP ────────────────────────────────────────────────────────────────
@app.on_event("startup")
def startup_event():
    import threading
    threading.Thread(target=initialize_ai, daemon=True).start()

# ─── API ENDPOINTS ──────────────────────────────────────────────────────────
class QueryRequest(BaseModel):
    query: str
    top_n: Optional[int] = 5

@app.get("/health")
def health():
    return {"status": "online", "projects_indexed": len(projects_df) if projects_df is not None else 0}

@app.post("/recommend")
async def recommend(request: QueryRequest):
    if model is None:
        raise HTTPException(status_code=503, detail="AI Model not initialized.")
    if project_embeddings is None or projects_df is None or len(projects_df) == 0:
        return {"matches": []}

    try:
        # Encode student query
        query_vector = model.encode(clean_text(request.query), convert_to_tensor=True, device=DEVICE)

        # Calculate Cosine Similarity
        cosine_scores = util.cos_sim(query_vector, project_embeddings)[0]

        # Get Top N results
        top_n = min(request.top_n, len(projects_df))
        top_results = torch.topk(cosine_scores, k=top_n)

        results = []
        for score, idx in zip(top_results.values, top_results.indices):
            row = projects_df.iloc[idx.item()]
            results.append({
                "id": str(row['_id']),
                "title": row['title'],
                "domain": row['domain'],
                "description": row['description'],
                "confidence": round(float(score) * 100, 2),
                "type": row['type']
            })

        return {"matches": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/refresh")
def refresh():
    """Manually trigger a data reload (e.g. after a project upload)"""
    load_data_from_db()
    return {"status": "success", "projects_indexed": len(projects_df) if projects_df is not None else 0}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
