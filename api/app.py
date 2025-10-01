# app.py
from pathlib import Path
from typing import Any, Dict, List, Optional

import math
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

# ------------------------------
# Try to infer expected features
# ------------------------------
def infer_expected_features(m) -> Optional[List[str]]:
    """Infer raw training feature names from common sklearn pipeline patterns."""
    try:
        # 1) Direct attribute (most estimators after fit)
        if hasattr(m, "feature_names_in_"):
            return list(m.feature_names_in_)

        # 2) Pipeline with a ColumnTransformer step commonly named 'preprocessor'/'preprocess'
        if hasattr(m, "named_steps"):
            pre = m.named_steps.get("preprocessor") or m.named_steps.get("preprocess")
            if pre is not None:
                cols: List[str] = []
                if hasattr(pre, "transformers"):
                    # transformers_: List[tuple(name, transformer, columns)]
                    for _, _, sel in pre.transformers:
                        if sel == "drop":
                            continue
                        if isinstance(sel, (list, tuple, np.ndarray, pd.Index)):
                            cols.extend(list(sel))
                # de-dup while preserving order
                seen, out = set(), []
                for c in cols:
                    if c not in seen:
                        seen.add(c)
                        out.append(c)
                if out:
                    return out

        # 3) Sometimes the final estimator inside a pipeline has feature_names_in_
        if hasattr(m, "named_steps"):
            for step in m.named_steps.values():
                if hasattr(step, "feature_names_in_"):
                    return list(step.feature_names_in_)
    except Exception:
        pass
    return None

EXPECTED_FEATURES: Optional[List[str]] = infer_expected_features(model)

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
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],  # * for dev; tighten in prod
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
# Helpers
# ------------------------------
def to_numeric_or_keep(x: Any):
    """Convert to float when safe; keep strings for categorical encoders; use NaN for empty."""
    if x is None:
        return np.nan
    if isinstance(x, (int, float)):
        # guard against nan float already
        return float(x)
    if isinstance(x, str):
        s = x.strip()
        if s == "":
            return np.nan
        # strip common symbols
        s2 = s.replace("%", "").replace(",", "").replace("₹", "").replace("$", "")
        try:
            val = float(s2)
            if math.isfinite(val):
                return val
        except Exception:
            return s  # non-numeric string (categorical)
        return s
    return x

def align_frame(single_row: Dict[str, Any]) -> pd.DataFrame:
    """Build a single-row DataFrame, add any missing expected columns as NaN, and order columns."""
    X = pd.DataFrame([{k: to_numeric_or_keep(v) for k, v in single_row.items()}])
    if EXPECTED_FEATURES:
        # ensure all expected columns exist
        for col in EXPECTED_FEATURES:
            if col not in X.columns:
                X[col] = np.nan
        # keep only expected columns, in order
        X = X.reindex(columns=EXPECTED_FEATURES)
    return X

# ------------------------------
# Endpoints
# ------------------------------
@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": True, "model_file": MODEL_FILE.name}

@app.get("/meta")
def meta():
    # If we couldn't infer, return null so frontend can handle flexibly
    return {"model_file": MODEL_FILE.name, "expected_features": EXPECTED_FEATURES}

@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    try:
        X = align_frame(req.features)

        # Predict PD
        if hasattr(model, "predict_proba"):
            pd_value = float(model.predict_proba(X)[0, 1])
        else:
            raw = np.ravel(model.predict(X)).astype(float)
            # many regressors will output arbitrary range; clip to [0,1] to be safe
            pd_value = float(np.clip(raw[0], 0.0, 1.0))

        # Derive credit score [300–900]; 900 at PD=0, 300 at PD=1
        credit_score = int(round(900 - pd_value * 600))

        return PredictResponse(
            probability_of_default=pd_value,
            credit_score=credit_score,
            used_feature_names=list(X.columns),
        )

    except Exception as e:
        # surface exact model error to caller (helps debug)
        raise HTTPException(status_code=400, detail=f"Model inference failed: {e}")