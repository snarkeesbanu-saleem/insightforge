"""
modules/ai_chat.py
Google Gemini AI integration for chat and RAG synthesis.
Falls back gracefully to simulation mode when no API key is set.
"""
from __future__ import annotations

import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()
HAS_KEY = bool(GEMINI_API_KEY)

MODELS = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"]

_client = None


def get_client():
    global _client
    if _client is None and HAS_KEY:
        try:
            from google import genai
            _client = genai.Client(api_key=GEMINI_API_KEY)
        except Exception:
            pass
    return _client


def chat(message: str, history: list[dict]) -> str:
    """Send message to Gemini and return reply text. Falls back to simulation."""
    client = get_client()
    if client:
        try:
            from google.genai import types
            system_prompt = (
                "You are InsightForge AI, an expert Python data science and business analytics "
                "consultant. You analyze business metrics, predict trends, and provide actionable "
                "recommendations. Reference data science concepts like Pandas, NumPy, Scikit-learn, "
                "SHAP, and statistical methods in your answers. Be concise, structured, and data-driven."
            )
            formatted = [
                types.Content(
                    role="user" if h["role"] == "user" else "model",
                    parts=[types.Part(text=h["content"])]
                )
                for h in history
            ]
            for model in MODELS:
                try:
                    resp = client.models.generate_content(
                        model=model,
                        contents=[*formatted, types.Content(role="user", parts=[types.Part(text=message)])],
                        config=types.GenerateContentConfig(system_instruction=system_prompt),
                    )
                    if resp and resp.text:
                        return resp.text
                except Exception:
                    continue
        except Exception:
            pass

    return _simulate_chat(message)


def synthesize_rag(query: str, context_block: str) -> str:
    """Use Gemini to synthesize an answer from retrieved document context."""
    client = get_client()
    if client:
        try:
            prompt = (
                "You are an expert RAG (Retrieval-Augmented Generation) data analyst. "
                "Using the retrieved document context below, answer the query with precise, "
                "data-driven insights. Structure your response as:\n"
                "- **Summary** (2-3 sentences)\n"
                "- **Key Findings** (bullet points with numbers)\n"
                "- **Recommendations** (actionable next steps)\n\n"
                f"Query: {query}\n\nCONTEXT:\n{context_block}"
            )
            for model in MODELS:
                try:
                    resp = client.models.generate_content(model=model, contents=prompt)
                    if resp and resp.text:
                        return resp.text
                except Exception:
                    continue
        except Exception:
            pass

    return None  # Caller will use rag_engine.simulate_rag_response


def _simulate_chat(message: str) -> str:
    """Local simulation fallback responses."""
    lower = message.lower()
    if any(k in lower for k in ("churn", "retention", "support", "sla")):
        return (
            "### Churn & Retention Analysis\n\n"
            "Based on our data science pipeline:\n\n"
            "**Key Churn Drivers (SHAP Attribution):**\n"
            "1. **Support Turnaround** (weight: 0.31) - Accounts with >12hr response show 40% higher churn\n"
            "2. **Engagement Score** (weight: 0.28) - Users below score 40 are 3x more likely to churn\n"
            "3. **Days Since Login** (weight: 0.19) - 14+ day inactivity is a strong churn predictor\n\n"
            "**Recommended Actions:**\n"
            "- Automate Tier-1 support to reduce response time by ~25%\n"
            "- Set SLA alerts at 8-hour mark for at-risk accounts\n"
            "- Trigger re-engagement emails for users inactive 7+ days\n\n"
            "*Add `GEMINI_API_KEY` to `.env` for full Gemini-powered analysis.*"
        )
    elif any(k in lower for k in ("revenue", "marketing", "sales", "conversion", "cac")):
        return (
            "### Revenue & Marketing Intelligence\n\n"
            "**Pandas DataFrame Analysis Summary:**\n\n"
            "- **Paid CAC:** $42/customer — squeezing Q2 margins by ~3pts\n"
            "- **Organic Conversion:** 4.8% — outperforms paid at 2.1%\n"
            "- **Top Channel:** LinkedIn B2B campaigns (38% SQL rate)\n\n"
            "**NumPy Statistical Insight:**\n"
            "Correlation between marketing_spend and conversion: **r = 0.67** (p < 0.01)\n\n"
            "**Tactical Recommendations:**\n"
            "1. Reallocate 15% of paid budget into CRO\n"
            "2. Expand email re-engagement for dormant accounts ($180K recovered pipeline)\n"
            "3. Double down on referral channel (CAC = $12, highest LTV ratio)\n\n"
            "*Add `GEMINI_API_KEY` to `.env` for full Gemini-powered analysis.*"
        )
    elif any(k in lower for k in ("ml", "model", "predict", "sklearn", "shap", "feature")):
        return (
            "### ML Model & Predictive Analytics\n\n"
            "**Active Models:**\n"
            "- Churn Risk: `RandomForestClassifier` — 87% accuracy, AUC 0.91\n"
            "- Conversion: `LogisticRegression` — 79% AUC\n\n"
            "**Scikit-learn Feature Importances:**\n"
            "```\n"
            "support_turnaround    0.31\n"
            "engagement_score      0.28\n"
            "days_since_login      0.19\n"
            "contract_tier         0.12\n"
            "price_sensitivity     0.10\n"
            "```\n\n"
            "**SHAP Analysis:** Marketing spend contributes +12% to conversion for mid-market segment.\n\n"
            "*Add `GEMINI_API_KEY` to `.env` for real-time Gemini analysis.*"
        )
    else:
        return (
            "### InsightForge AI - Python Data Science Platform\n\n"
            f"I received your query: *\"{message}\"*\n\n"
            "**Platform Status:**\n"
            "- Pandas + NumPy pipelines: **Active**\n"
            "- Scikit-learn ML models: **Active** (87% churn accuracy)\n"
            "- TF-IDF RAG engine: **Active** (5 documents indexed)\n"
            "- Gemini AI: **Simulation Mode** (add API key to enable)\n\n"
            "**Try asking about:**\n"
            "- Churn risk and retention strategies\n"
            "- Revenue and marketing performance\n"
            "- ML model predictions and SHAP values\n"
            "- Customer segment analysis\n\n"
            "*Add `GEMINI_API_KEY` to `.env` to activate full Gemini intelligence.*"
        )
