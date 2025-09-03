# app.py
from pathlib import Path
from typing import Any, Dict, List

import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# ------------------------------
# Load model
# ------------------------------
HERE = Path(__file__).resolve().parent
MODEL_FILE = HERE / "final_model_auc.pkl"

try:
    model = joblib.load(MODEL_FILE)
except Exception as e:
    raise RuntimeError(f"❌ Failed to load model {MODEL_FILE}: {e}")

EXPECTED_FEATURES: List[str] = getattr(model, "feature_names_in_", None)

# ------------------------------
# FastAPI app
# ------------------------------
app = FastAPI(
    title="Credit Risk API",
    version="2.0.0",
    description="Predict Probability of Default (PD) and derived credit score.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for dev; restrict in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------
# Schemas
# ------------------------------
class PredictRequest(BaseModel):
    features: Dict[str, Any] = Field(..., description="Feature map for the model")

class PredictResponse(BaseModel):
    probability_of_default: float
    credit_score: int
    used_feature_names: List[str]

# ------------------------------
# Endpoints
# ------------------------------
@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": True, "model_file": MODEL_FILE.name}

@app.get("/meta")
def meta():
    return {"model_file": MODEL_FILE.name, "expected_features": EXPECTED_FEATURES}

@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    try:
        # Convert input dict to DataFrame
        X = pd.DataFrame([req.features])

        # Align columns if known
        if EXPECTED_FEATURES is not None:
            X = X.reindex(columns=EXPECTED_FEATURES)

        # Model outputs PD (probability of default)
        if hasattr(model, "predict_proba"):
            pd_value = float(model.predict_proba(X)[0, 1])
        else:
            pd_value = float(np.ravel(model.predict(X))[0])

        # Derive credit score [300–900]
        credit_score = int(round(900 - pd_value * 600))

        return PredictResponse(
            probability_of_default=pd_value,
            credit_score=credit_score,
            used_feature_names=list(X.columns),
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {e}")