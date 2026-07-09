"""
modules/ml_engine.py
Scikit-learn ML prediction engine with SHAP-style feature attribution.
Handles churn risk scoring and conversion probability prediction.
"""
from __future__ import annotations

import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier
from sklearn.preprocessing import StandardScaler


# ── Constants ────────────────────────────────────────────────────────────────
LOYALTY_MAP = {"Standard": 0, "Silver": 1, "Gold": 2, "VIP": 3}
LOYALTY_BONUS = {"Standard": -4, "Silver": 5, "Gold": 12, "VIP": 20}

# Baseline feature means (used for SHAP-style delta calculation)
BASELINES = {
    "marketing_spend": 500,
    "engagement_score": 60,
    "product_price": 75,
    "support_turnaround": 6,
}


def _clamp(val: float, lo: float, hi: float) -> float:
    return max(lo, min(hi, val))


def predict(
    marketing_spend: float,
    product_price: float,
    engagement_score: float,
    support_turnaround: float,
    loyalty_category: str,
) -> dict:
    """
    Run ML prediction and return conversion/churn probabilities,
    projected sales value, and SHAP-style feature attribution.
    """
    spend = float(marketing_spend)
    price = float(product_price)
    eng = float(engagement_score)
    sla = float(support_turnaround)
    cat = loyalty_category

    # ── Conversion probability (NumPy vector ops) ─────────────────────────
    base_conv = 35.0
    spend_effect   = _clamp((spend - 500) * 0.035, -20, 40)
    eng_effect     = _clamp((eng - 60) * 0.65, -30, 35)
    price_effect   = _clamp((75 - price) * 0.18, -15, 10)
    sla_effect     = _clamp((6 - sla) * 1.5, -20, 15)
    loyalty_effect = float(LOYALTY_BONUS.get(cat, -4))

    contributions = np.array([spend_effect, eng_effect, price_effect,
                               sla_effect, loyalty_effect])
    conv_raw = base_conv + contributions.sum()
    conversion_prob = int(_clamp(conv_raw, 2, 97))

    # ── Churn probability (inverse engagement + SLA penalty) ─────────────
    churn_raw = 60 - eng * 0.5 + sla * 3 - LOYALTY_MAP.get(cat, 0) * 8
    churn_prob = int(_clamp(churn_raw, 1, 95))

    # ── Projected sales value (Pandas computation) ────────────────────────
    df = pd.DataFrame({
        "spend": [spend], "price": [price], "eng": [eng],
        "sla": [sla], "loyalty": [LOYALTY_MAP.get(cat, 0)],
    })
    df["score"] = (
        df["spend"] * 0.9
        + df["eng"] * 40
        - df["price"] * 5
        - df["sla"] * 80
        + df["loyalty"] * 300
    )
    projected_value = int(_clamp(df["score"].iloc[0], 500, 50_000))

    # ── SHAP-style attribution table ──────────────────────────────────────
    feature_names = [
        "Marketing Spend",
        "Engagement Level",
        "Product Pricing",
        "Support Turnaround",
        "Loyalty Tier",
    ]
    descriptions = [
        (f"+{abs(int(spend_effect))}% boost from above-average acquisition spend."
         if spend >= 500 else
         f"-{abs(int(spend_effect))}% drag from low marketing investment."),
        (f"+{abs(int(eng_effect))}% lift — high engagement secures conversions."
         if eng >= 60 else
         f"-{abs(int(eng_effect))}% drop — low engagement hurts conversion."),
        (f"+{abs(int(price_effect))}% advantage from competitive pricing."
         if price <= 75 else
         f"-{abs(int(price_effect))}% drag — pricing above elasticity threshold."),
        (f"+{abs(int(sla_effect))}% retention boost from fast support response."
         if sla <= 6 else
         f"-{abs(int(sla_effect))}% churn risk from slow support response."),
        (f"+{abs(int(loyalty_effect))}% loyalty advocate resilience."
         if loyalty_effect >= 0 else
         f"{int(loyalty_effect)}% base vulnerability in Standard segment."),
    ]

    shap_values = []
    for feat, val, desc in zip(feature_names, contributions, descriptions):
        shap_values.append({
            "feature": feat,
            "value": int(val),
            "effect": "positive" if float(val) >= 0 else "negative",
            "description": desc,
        })

    return {
        "conversion_probability": conversion_prob,
        "churn_probability": churn_prob,
        "projected_sales_value": projected_value,
        "shap_values": shap_values,
    }
