"""
modules/data_generator.py
Generates sample business data using Pandas and NumPy.
Provides KPI metrics, revenue trends, and channel breakdowns.
"""
from __future__ import annotations

import numpy as np
import pandas as pd


# ── Reproducible seed ────────────────────────────────────────────────────────
RNG = np.random.default_rng(42)


def get_revenue_trend() -> pd.DataFrame:
    """12-month monthly revenue breakdown (actual, target, organic, paid)."""
    months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ]
    base = np.linspace(180_000, 280_000, 12)
    noise = RNG.normal(0, 8_000, 12)
    actual = (base + noise).clip(min=0).astype(int)
    target = (base * 1.05).astype(int)
    organic_pct = RNG.uniform(0.55, 0.65, 12)
    organic = (actual * organic_pct).astype(int)
    paid = actual - organic

    return pd.DataFrame({
        "Month": months,
        "Actual": actual,
        "Target": target,
        "Organic": organic,
        "Paid": paid,
    })


def get_channel_metrics() -> pd.DataFrame:
    """Marketing channel performance data."""
    channels = ["Organic Search", "Paid Search", "Email", "Referral", "Social", "Direct"]
    revenue = [680_000, 420_000, 310_000, 280_000, 175_000, 135_000]
    conversion = [4.8, 2.1, 3.6, 5.2, 1.9, 3.1]
    cac = [0, 42, 8, 12, 31, 0]
    return pd.DataFrame({
        "Channel": channels,
        "Revenue": revenue,
        "Conversion_Rate": conversion,
        "CAC": cac,
    })


def get_customer_segments() -> pd.DataFrame:
    """Customer segment distribution and health metrics."""
    n = 500
    tiers = RNG.choice(["Standard", "Silver", "Gold", "VIP"], n,
                       p=[0.45, 0.30, 0.17, 0.08])
    engagement = RNG.beta(3, 2, n) * 100
    spend = {"Standard": 49, "Silver": 99, "Gold": 149, "VIP": 399}
    mrr = np.array([spend[t] for t in tiers]) * RNG.uniform(0.9, 1.1, n)
    churn_risk = np.where(engagement < 40, "High", np.where(engagement < 65, "Medium", "Low"))

    return pd.DataFrame({
        "Tier": tiers,
        "Engagement_Score": engagement.round(1),
        "MRR": mrr.round(2),
        "Churn_Risk": churn_risk,
    })


def get_kpi_summary() -> dict:
    """High-level KPI metrics for the dashboard."""
    rev = get_revenue_trend()
    seg = get_customer_segments()
    ch = get_channel_metrics()

    total_rev = int(rev["Actual"].sum())
    prev_rev = int(total_rev * 0.847)
    rev_change = round((total_rev - prev_rev) / prev_rev * 100, 1)

    high_risk = (seg["Churn_Risk"] == "High").sum()
    churn_rate = round(high_risk / len(seg) * 100, 1)

    top_conv = ch["Conversion_Rate"].max()
    avg_conv = round(ch["Conversion_Rate"].mean(), 1)

    nps = 61
    prev_nps = 48

    return {
        "total_revenue": total_rev,
        "revenue_change": rev_change,
        "churn_rate": churn_rate,
        "churn_change": -1.3,
        "avg_conversion": avg_conv,
        "conversion_change": 0.7,
        "nps": nps,
        "nps_change": nps - prev_nps,
        "total_customers": len(seg),
        "high_risk_customers": int(high_risk),
    }
