"""
modules/charts.py
Plotly interactive chart builders for the Streamlit dashboard.
"""
from __future__ import annotations

import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots

# ── Color palette ─────────────────────────────────────────────────────────────
PRIMARY    = "#6366f1"   # Indigo
SECONDARY  = "#22d3ee"   # Cyan
ACCENT     = "#f59e0b"   # Amber
SUCCESS    = "#10b981"   # Emerald
DANGER     = "#ef4444"   # Red
BG         = "#0f172a"   # Slate-900
CARD_BG    = "#1e293b"   # Slate-800
TEXT       = "#f1f5f9"   # Slate-100
MUTED      = "#94a3b8"   # Slate-400

CHART_LAYOUT = dict(
    paper_bgcolor=CARD_BG,
    plot_bgcolor=CARD_BG,
    font=dict(color=TEXT, family="Inter, sans-serif", size=12),
    margin=dict(l=16, r=16, t=40, b=16),
)


def revenue_trend_chart(df: pd.DataFrame) -> go.Figure:
    fig = go.Figure()
    fig.add_trace(go.Scatter(
        x=df["Month"], y=df["Actual"], name="Actual Revenue",
        line=dict(color=PRIMARY, width=3), fill="tozeroy",
        fillcolor="rgba(99,102,241,0.15)", mode="lines+markers",
        marker=dict(size=7, color=PRIMARY),
    ))
    fig.add_trace(go.Scatter(
        x=df["Month"], y=df["Target"], name="Target",
        line=dict(color=MUTED, width=2, dash="dash"), mode="lines",
    ))
    fig.add_trace(go.Bar(
        x=df["Month"], y=df["Organic"], name="Organic",
        marker_color="rgba(34,211,238,0.5)", yaxis="y2",
    ))
    fig.update_layout(
        **CHART_LAYOUT,
        title=dict(text="Revenue Trend & Channel Mix", font=dict(size=16)),
        yaxis=dict(title="Revenue ($)", gridcolor="#334155"),
        yaxis2=dict(title="Organic Revenue", overlaying="y", side="right",
                    gridcolor="#334155"),
        legend=dict(bgcolor="rgba(0,0,0,0)", orientation="h", y=1.1),
        hovermode="x unified",
    )
    return fig


def channel_pie_chart(df: pd.DataFrame) -> go.Figure:
    fig = px.pie(
        df, names="Channel", values="Revenue",
        color_discrete_sequence=[PRIMARY, SECONDARY, ACCENT, SUCCESS, DANGER, "#a855f7"],
        hole=0.45,
    )
    fig.update_traces(textinfo="percent+label", textfont_size=11)
    fig.update_layout(
        **CHART_LAYOUT,
        title=dict(text="Revenue by Channel", font=dict(size=16)),
        showlegend=True,
    )
    return fig


def channel_conversion_chart(df: pd.DataFrame) -> go.Figure:
    fig = px.bar(
        df.sort_values("Conversion_Rate", ascending=True),
        x="Conversion_Rate", y="Channel", orientation="h",
        color="Conversion_Rate",
        color_continuous_scale=["#334155", PRIMARY, SECONDARY],
        text="Conversion_Rate",
    )
    fig.update_traces(texttemplate="%{text:.1f}%", textposition="outside")
    fig.update_layout(
        **CHART_LAYOUT,
        title=dict(text="Conversion Rate by Channel (%)", font=dict(size=16)),
        xaxis=dict(title="Conversion Rate (%)", gridcolor="#334155"),
        yaxis=dict(title=""),
        coloraxis_showscale=False,
    )
    return fig


def segment_distribution_chart(df: pd.DataFrame) -> go.Figure:
    counts = df.groupby(["Tier", "Churn_Risk"]).size().reset_index(name="Count")
    color_map = {"High": DANGER, "Medium": ACCENT, "Low": SUCCESS}
    fig = px.bar(
        counts, x="Tier", y="Count", color="Churn_Risk",
        color_discrete_map=color_map,
        category_orders={"Tier": ["Standard", "Silver", "Gold", "VIP"]},
        barmode="stack",
    )
    fig.update_layout(
        **CHART_LAYOUT,
        title=dict(text="Customer Segments & Churn Risk", font=dict(size=16)),
        xaxis=dict(title="Loyalty Tier"),
        yaxis=dict(title="Customer Count", gridcolor="#334155"),
        legend=dict(bgcolor="rgba(0,0,0,0)"),
    )
    return fig


def engagement_scatter_chart(df: pd.DataFrame) -> go.Figure:
    color_map = {"High": DANGER, "Medium": ACCENT, "Low": SUCCESS}
    fig = px.scatter(
        df, x="Engagement_Score", y="MRR",
        color="Churn_Risk", color_discrete_map=color_map,
        symbol="Tier", opacity=0.75,
        hover_data=["Tier", "Engagement_Score", "MRR", "Churn_Risk"],
    )
    fig.update_layout(
        **CHART_LAYOUT,
        title=dict(text="Engagement Score vs MRR", font=dict(size=16)),
        xaxis=dict(title="Engagement Score", gridcolor="#334155"),
        yaxis=dict(title="Monthly Recurring Revenue ($)", gridcolor="#334155"),
        legend=dict(bgcolor="rgba(0,0,0,0)"),
    )
    return fig


def shap_waterfall_chart(shap_values: list[dict], base: int) -> go.Figure:
    features = [s["feature"] for s in shap_values]
    values   = [s["value"] for s in shap_values]
    colors   = [SUCCESS if s["effect"] == "positive" else DANGER for s in shap_values]

    fig = go.Figure(go.Bar(
        x=values, y=features, orientation="h",
        marker_color=colors,
        text=[f"{'+' if v >= 0 else ''}{v}%" for v in values],
        textposition="outside",
    ))
    fig.update_layout(
        **CHART_LAYOUT,
        title=dict(text=f"SHAP Feature Attribution (Base: {base}%)", font=dict(size=16)),
        xaxis=dict(title="Contribution (%)", gridcolor="#334155", zeroline=True,
                   zerolinecolor="#475569"),
        yaxis=dict(title=""),
        height=300,
    )
    return fig


def gauge_chart(value: int, title: str, color: str, max_val: int = 100) -> go.Figure:
    fig = go.Figure(go.Indicator(
        mode="gauge+number",
        value=value,
        title=dict(text=title, font=dict(size=14, color=TEXT)),
        number=dict(suffix="%", font=dict(size=32, color=TEXT)),
        gauge=dict(
            axis=dict(range=[0, max_val], tickcolor=MUTED),
            bar=dict(color=color),
            bgcolor=BG,
            borderwidth=0,
            steps=[
                dict(range=[0, max_val * 0.33], color="#1e293b"),
                dict(range=[max_val * 0.33, max_val * 0.66], color="#1e293b"),
                dict(range=[max_val * 0.66, max_val], color="#1e293b"),
            ],
            threshold=dict(
                line=dict(color=ACCENT, width=3),
                thickness=0.8,
                value=max_val * 0.5,
            ),
        ),
    ))
    fig.update_layout(
        paper_bgcolor=CARD_BG, font=dict(color=TEXT),
        margin=dict(l=20, r=20, t=50, b=20), height=220,
    )
    return fig
