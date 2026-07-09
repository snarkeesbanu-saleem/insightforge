"""Quick module integration test."""
from modules.data_generator import get_kpi_summary, get_revenue_trend, get_customer_segments
from modules.ml_engine import predict
from modules.rag_engine import rank_documents
from data.sample_docs import SAMPLE_DOCS
import ast

# Test data generator
kpi = get_kpi_summary()
assert kpi["total_revenue"] > 0
rev = get_revenue_trend()
assert len(rev) == 12
seg = get_customer_segments()
assert len(seg) > 0
print("data_generator: OK")

# Test ML engine
r = predict(2000, 85, 72, 4, "Gold")
assert 0 < r["conversion_probability"] <= 100
assert len(r["shap_values"]) == 5
conv = r["conversion_probability"]
churn = r["churn_probability"]
print(f"ml_engine: OK (conv={conv}% churn={churn}%)")

# Test RAG engine
matched = rank_documents("churn support SLA", SAMPLE_DOCS, top_k=3)
assert len(matched) > 0
print(f"rag_engine: OK ({len(matched)} docs matched - top: {matched[0]['title'][:40]})")

# Check app.py syntax
with open("app.py", "r", encoding="utf-8") as f:
    src = f.read()
ast.parse(src)
print("app.py syntax: OK")

print()
print("ALL CHECKS PASSED - Ready to run!")
print("  Start with:  streamlit run app.py")
