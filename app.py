"""
app.py — InsightForge AI | Pure Python Data Science Platform
Run with: streamlit run app.py
"""
import streamlit as st
import pandas as pd
import numpy as np

from modules import data_generator as dg
from modules import ml_engine
from modules import rag_engine
from modules import ai_chat
from modules import charts
from data.sample_docs import SAMPLE_DOCS

# ── Page config ───────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="InsightForge AI",
    page_icon="assets/logo.png" if __import__("pathlib").Path("assets/logo.png").exists() else ":bar_chart:",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ── Global CSS ────────────────────────────────────────────────────────────────
st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

html, body, [class*="css"] {
    font-family: 'Inter', sans-serif;
    background-color: #0f172a;
    color: #f1f5f9;
}
[data-testid="stSidebar"] {
    background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
    border-right: 1px solid #334155;
}
[data-testid="stSidebar"] .stRadio label {
    color: #cbd5e1;
    font-size: 0.9rem;
    padding: 6px 0;
}
[data-testid="stSidebar"] h1 {
    font-size: 1.2rem;
    color: #6366f1;
}
.kpi-card {
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    border: 1px solid #334155;
    border-radius: 14px;
    padding: 20px 24px;
    text-align: center;
    transition: border-color 0.2s;
}
.kpi-card:hover { border-color: #6366f1; }
.kpi-value { font-size: 2rem; font-weight: 700; color: #f1f5f9; line-height: 1.2; }
.kpi-label { font-size: 0.8rem; color: #94a3b8; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.08em; }
.kpi-delta-pos { font-size: 0.85rem; color: #10b981; font-weight: 600; }
.kpi-delta-neg { font-size: 0.85rem; color: #ef4444; font-weight: 600; }

.chat-user {
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    border-radius: 18px 18px 4px 18px;
    padding: 12px 18px;
    margin: 6px 0 6px 15%;
    color: #f1f5f9;
}
.chat-ai {
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 18px 18px 18px 4px;
    padding: 12px 18px;
    margin: 6px 15% 6px 0;
    color: #f1f5f9;
}
.doc-card {
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 12px;
    cursor: pointer;
    transition: border-color 0.2s;
}
.doc-card:hover { border-color: #6366f1; }
.doc-title { font-size: 0.95rem; font-weight: 600; color: #e2e8f0; }
.doc-snippet { font-size: 0.8rem; color: #94a3b8; margin-top: 6px; }
.badge-high   { background: rgba(239,68,68,0.15);  color: #ef4444;  border: 1px solid #ef4444;  padding: 2px 10px; border-radius: 99px; font-size: 0.75rem; }
.badge-medium { background: rgba(245,158,11,0.15); color: #f59e0b; border: 1px solid #f59e0b; padding: 2px 10px; border-radius: 99px; font-size: 0.75rem; }
.badge-low    { background: rgba(16,185,129,0.15); color: #10b981; border: 1px solid #10b981; padding: 2px 10px; border-radius: 99px; font-size: 0.75rem; }
.section-title {
    font-size: 1.4rem; font-weight: 700; color: #f1f5f9;
    margin: 1.2rem 0 0.6rem;
    padding-bottom: 8px;
    border-bottom: 2px solid #334155;
}
.stButton>button {
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    color: white; border: none; border-radius: 8px;
    padding: 10px 24px; font-weight: 600;
    transition: opacity 0.2s;
}
.stButton>button:hover { opacity: 0.85; }
.status-pill {
    display: inline-block; padding: 3px 12px;
    border-radius: 99px; font-size: 0.75rem; font-weight: 600;
}
.status-active { background: rgba(16,185,129,0.15); color: #10b981; border: 1px solid #10b981; }
.status-sim    { background: rgba(245,158,11,0.15); color: #f59e0b; border: 1px solid #f59e0b; }
</style>
""", unsafe_allow_html=True)


# ── Session state init ────────────────────────────────────────────────────────
if "chat_history" not in st.session_state:
    st.session_state.chat_history = []
if "rag_docs" not in st.session_state:
    st.session_state.rag_docs = list(SAMPLE_DOCS)
if "rag_results" not in st.session_state:
    st.session_state.rag_results = []
if "rag_answer" not in st.session_state:
    st.session_state.rag_answer = ""


# ── Sidebar ───────────────────────────────────────────────────────────────────
with st.sidebar:
    st.markdown("## InsightForge AI")
    st.markdown("---")
    page = st.radio(
        "Navigation",
        ["Dashboard", "AI Chat Agent", "RAG Document Search",
         "ML Predictive Sandbox", "Data Explorer"],
        label_visibility="collapsed",
    )


# ═══════════════════════════════════════════════════════════════════════════════
# PAGE 1 — DASHBOARD
# ═══════════════════════════════════════════════════════════════════════════════
if page == "Dashboard":
    st.image("assets/images/dashboard_hero.jpg", use_column_width=True)
    st.markdown('<h1 style="color:#f1f5f9;font-size:2rem;font-weight:800;margin-top:16px;">InsightForge AI Dashboard</h1>', unsafe_allow_html=True)

    kpi = dg.get_kpi_summary()
    rev_df = dg.get_revenue_trend()
    ch_df  = dg.get_channel_metrics()
    seg_df = dg.get_customer_segments()

    # KPI row
    c1, c2, c3, c4 = st.columns(4)
    def delta_cls(v): return "kpi-delta-pos" if v >= 0 else "kpi-delta-neg"
    def delta_arrow(v): return f"▲ +{abs(v)}" if v >= 0 else f"▼ -{abs(v)}"

    c1.markdown(f"""
    <div class="kpi-card">
      <div class="kpi-value">${kpi['total_revenue']:,.0f}</div>
      <div class="kpi-label">Annual Revenue</div>
      <div class="{delta_cls(kpi['revenue_change'])}">{delta_arrow(kpi['revenue_change'])}% vs last year</div>
    </div>""", unsafe_allow_html=True)

    c2.markdown(f"""
    <div class="kpi-card">
      <div class="kpi-value">{kpi['churn_rate']}%</div>
      <div class="kpi-label">Churn Rate</div>
      <div class="{delta_cls(-kpi['churn_change'])}">{delta_arrow(kpi['churn_change'])}% vs last quarter</div>
    </div>""", unsafe_allow_html=True)

    c3.markdown(f"""
    <div class="kpi-card">
      <div class="kpi-value">{kpi['avg_conversion']}%</div>
      <div class="kpi-label">Avg Conversion</div>
      <div class="{delta_cls(kpi['conversion_change'])}">{delta_arrow(kpi['conversion_change'])}% vs last quarter</div>
    </div>""", unsafe_allow_html=True)

    c4.markdown(f"""
    <div class="kpi-card">
      <div class="kpi-value">{kpi['nps']}</div>
      <div class="kpi-label">Net Promoter Score</div>
      <div class="{delta_cls(kpi['nps_change'])}">{delta_arrow(kpi['nps_change'])} pts vs last quarter</div>
    </div>""", unsafe_allow_html=True)

    st.markdown("<br>", unsafe_allow_html=True)

    # Row 2: Revenue trend + channel pie
    col_a, col_b = st.columns([3, 2])
    with col_a:
        st.plotly_chart(charts.revenue_trend_chart(rev_df), use_container_width=True)
    with col_b:
        st.plotly_chart(charts.channel_pie_chart(ch_df), use_container_width=True)

    # Row 3: Channel conversion + segment distribution
    col_c, col_d = st.columns(2)
    with col_c:
        st.plotly_chart(charts.channel_conversion_chart(ch_df), use_container_width=True)
    with col_d:
        st.plotly_chart(charts.segment_distribution_chart(seg_df), use_container_width=True)

    # At-risk summary
    st.markdown('<div class="section-title">At-Risk Accounts</div>', unsafe_allow_html=True)
    high_risk = seg_df[seg_df["Churn_Risk"] == "High"].head(8).copy()
    high_risk["Engagement_Score"] = high_risk["Engagement_Score"].round(1)
    high_risk["MRR"] = high_risk["MRR"].apply(lambda x: f"${x:,.0f}")
    high_risk["Churn_Risk"] = high_risk["Churn_Risk"].apply(
        lambda x: f'<span class="badge-{x.lower()}">{x}</span>'
    )
    st.markdown(high_risk.to_html(escape=False, index=False), unsafe_allow_html=True)


# ═══════════════════════════════════════════════════════════════════════════════
# PAGE 2 — AI CHAT AGENT
# ═══════════════════════════════════════════════════════════════════════════════
elif page == "AI Chat Agent":
    st.image("assets/images/ai_chat_banner.jpg", use_column_width=True)
    st.markdown('<h1 style="color:#f1f5f9;font-size:2rem;font-weight:800;margin-top:16px;">AI Growth Agent</h1>', unsafe_allow_html=True)

    # Starter chips
    st.markdown("**Quick prompts:**")
    chips = [
        "Analyze churn risk factors",
        "What drives conversion?",
        "Explain SHAP feature importance",
        "Revenue growth strategies",
    ]
    cols = st.columns(len(chips))
    for i, chip in enumerate(chips):
        if cols[i].button(chip, key=f"chip_{i}"):
            with st.spinner("Analyzing..."):
                reply = ai_chat.chat(chip, st.session_state.chat_history)
            st.session_state.chat_history.append({"role": "user", "content": chip})
            st.session_state.chat_history.append({"role": "assistant", "content": reply})
            st.rerun()

    # Chat history
    st.markdown('<div class="section-title">Conversation</div>', unsafe_allow_html=True)
    chat_container = st.container()
    with chat_container:
        for msg in st.session_state.chat_history:
            if msg["role"] == "user":
                st.markdown(f'<div class="chat-user"><strong>You</strong><br>{msg["content"]}</div>', unsafe_allow_html=True)
            else:
                st.markdown(f'<div class="chat-ai"><strong>InsightForge AI</strong></div>', unsafe_allow_html=True)
                st.markdown(msg["content"])

    # Input
    with st.form("chat_form", clear_on_submit=True):
        user_input = st.text_input("Ask InsightForge AI...", placeholder="e.g. What is driving churn this quarter?", label_visibility="collapsed")
        send = st.form_submit_button("Send")
        if send and user_input.strip():
            with st.spinner("Generating response..."):
                reply = ai_chat.chat(user_input.strip(), st.session_state.chat_history)
            st.session_state.chat_history.append({"role": "user", "content": user_input.strip()})
            st.session_state.chat_history.append({"role": "assistant", "content": reply})
            st.rerun()

    if st.button("Clear History"):
        st.session_state.chat_history = []
        st.rerun()


# ═══════════════════════════════════════════════════════════════════════════════
# PAGE 3 — RAG DOCUMENT SEARCH
# ═══════════════════════════════════════════════════════════════════════════════
elif page == "RAG Document Search":
    st.image("assets/images/rag_search_banner.jpg", use_column_width=True)
    st.markdown('<h1 style="color:#f1f5f9;font-size:2rem;font-weight:800;margin-top:16px;">RAG Document Search</h1>', unsafe_allow_html=True)

    col_left, col_right = st.columns([2, 3])

    with col_left:
        st.markdown('<div class="section-title">Document Library</div>', unsafe_allow_html=True)
        for doc in st.session_state.rag_docs:
            st.markdown(f"""
            <div class="doc-card">
              <div class="doc-title">{doc['title']}</div>
              <div class="doc-snippet">{doc['content'][:100]}...</div>
            </div>""", unsafe_allow_html=True)

        # Upload new doc
        st.markdown('<div class="section-title">Add Document</div>', unsafe_allow_html=True)
        with st.form("add_doc"):
            new_title   = st.text_input("Title")
            new_content = st.text_area("Content", height=100)
            if st.form_submit_button("Add to Library"):
                if new_title.strip() and new_content.strip():
                    import uuid
                    st.session_state.rag_docs.append({
                        "id": f"doc-{uuid.uuid4().hex[:8]}",
                        "title": new_title.strip(),
                        "content": new_content.strip(),
                    })
                    st.success(f"Added: {new_title.strip()}")
                    st.rerun()
                else:
                    st.warning("Please fill in both fields.")

        # Upload text file
        uploaded = st.file_uploader("Or upload a .txt file", type=["txt"])
        if uploaded:
            import uuid
            text = uploaded.read().decode("utf-8", errors="ignore")
            title = uploaded.name.replace(".txt", "")
            st.session_state.rag_docs.append({
                "id": f"doc-{uuid.uuid4().hex[:8]}",
                "title": title,
                "content": text,
            })
            st.success(f"Uploaded: {title}")
            st.rerun()

    with col_right:
        st.markdown('<div class="section-title">Search & Synthesize</div>', unsafe_allow_html=True)
        with st.form("rag_form"):
            query = st.text_input("Search query", placeholder="e.g. churn risk support SLA impact")
            top_k = st.slider("Number of documents to retrieve", 1, 5, 3)
            search = st.form_submit_button("Search & Generate Insight")

        if search and query.strip():
            with st.spinner("Running TF-IDF retrieval..."):
                matched = rag_engine.rank_documents(query.strip(), st.session_state.rag_docs, top_k=top_k)
            with st.spinner("Synthesizing insight..."):
                context = rag_engine.build_context_block(matched)
                answer = ai_chat.synthesize_rag(query.strip(), context)
                if not answer:
                    answer = rag_engine.simulate_rag_response(query.strip(), matched)
            st.session_state.rag_results = matched
            st.session_state.rag_answer  = answer

        if st.session_state.rag_results:
            # Match scores
            st.markdown("**Retrieved Documents:**")
            for doc in st.session_state.rag_results:
                score = doc.get("similarity_score", 0)
                pct   = int(score * 100)
                st.markdown(f"""
                <div style="background:#1e293b;border:1px solid #334155;border-radius:10px;padding:12px 16px;margin-bottom:8px;">
                  <div style="font-weight:600;color:#e2e8f0;">{doc['title']}</div>
                  <div style="font-size:0.8rem;color:#94a3b8;margin-top:4px;">{doc['content'][:160]}...</div>
                  <div style="margin-top:8px;">
                    <div style="height:6px;background:#0f172a;border-radius:99px;overflow:hidden;">
                      <div style="height:100%;width:{pct}%;background:linear-gradient(90deg,#6366f1,#22d3ee);border-radius:99px;"></div>
                    </div>
                    <div style="font-size:0.75rem;color:#94a3b8;margin-top:4px;">Relevance: {score:.3f}</div>
                  </div>
                </div>""", unsafe_allow_html=True)

            st.markdown("---")
            st.markdown("**AI Synthesized Insight:**")
            st.markdown(st.session_state.rag_answer)


# ═══════════════════════════════════════════════════════════════════════════════
# PAGE 4 — ML PREDICTIVE SANDBOX
# ═══════════════════════════════════════════════════════════════════════════════
elif page == "ML Predictive Sandbox":
    st.image("assets/images/ml_sandbox_banner.jpg", use_column_width=True)
    st.markdown('<h1 style="color:#f1f5f9;font-size:2rem;font-weight:800;margin-top:16px;">ML Predictive Sandbox</h1>', unsafe_allow_html=True)

    col_ctrl, col_result = st.columns([2, 3])

    with col_ctrl:
        st.markdown('<div class="section-title">Input Parameters</div>', unsafe_allow_html=True)
        marketing_spend    = st.slider("Marketing Spend ($)", 0, 5000, 2000, step=50)
        product_price      = st.slider("Product Price ($)", 10, 200, 85, step=5)
        engagement_score   = st.slider("Engagement Score", 0, 100, 72)
        support_turnaround = st.slider("Support Turnaround (hours)", 1, 48, 4)
        loyalty_category   = st.selectbox("Loyalty Tier", ["Standard", "Silver", "Gold", "VIP"])

        predict_btn = st.button("Run Prediction", use_container_width=True)

    with col_result:
        result = ml_engine.predict(
            marketing_spend, product_price, engagement_score,
            support_turnaround, loyalty_category,
        )
        conv  = result["conversion_probability"]
        churn = result["churn_probability"]
        rev   = result["projected_sales_value"]
        shap  = result["shap_values"]

        st.markdown('<div class="section-title">Prediction Results</div>', unsafe_allow_html=True)

        # Gauges
        g1, g2 = st.columns(2)
        g1.plotly_chart(charts.gauge_chart(conv, "Conversion Probability", "#10b981"), use_container_width=True)
        g2.plotly_chart(charts.gauge_chart(churn, "Churn Risk", "#ef4444"), use_container_width=True)

        # Revenue
        st.markdown(f"""
        <div class="kpi-card" style="margin:12px 0;">
          <div class="kpi-value">${rev:,}</div>
          <div class="kpi-label">Projected Revenue Value</div>
        </div>""", unsafe_allow_html=True)

        # SHAP waterfall
        st.plotly_chart(charts.shap_waterfall_chart(shap, base=35), use_container_width=True)

        # SHAP table
        st.markdown("**Feature Attribution Details:**")
        for s in shap:
            badge = "kpi-delta-pos" if s["effect"] == "positive" else "kpi-delta-neg"
            sign = "+" if s["value"] >= 0 else ""
            st.markdown(f"""
            <div style="display:flex;align-items:flex-start;gap:12px;padding:8px 0;border-bottom:1px solid #1e293b;">
              <span class="{badge}" style="min-width:60px;text-align:right;font-weight:700;">{sign}{s['value']}%</span>
              <div>
                <div style="font-weight:600;color:#e2e8f0;">{s['feature']}</div>
                <div style="font-size:0.8rem;color:#94a3b8;">{s['description']}</div>
              </div>
            </div>""", unsafe_allow_html=True)


# ═══════════════════════════════════════════════════════════════════════════════
# PAGE 5 — DATA EXPLORER
# ═══════════════════════════════════════════════════════════════════════════════
elif page == "Data Explorer":
    st.markdown('<h1 style="color:#f1f5f9;font-size:2rem;font-weight:800;">Data Explorer</h1>', unsafe_allow_html=True)
    st.markdown('<p style="color:#94a3b8;">Pandas DataFrames, descriptive statistics, and exportable reports</p>', unsafe_allow_html=True)

    tab1, tab2, tab3 = st.tabs(["Customer Segments", "Revenue Trend", "Channel Metrics"])

    with tab1:
        seg_df = dg.get_customer_segments()
        st.markdown('<div class="section-title">Customer Segment DataFrame</div>', unsafe_allow_html=True)

        # Filters
        fc1, fc2, fc3 = st.columns(3)
        tier_filter  = fc1.multiselect("Tier", seg_df["Tier"].unique(), default=seg_df["Tier"].unique())
        risk_filter  = fc2.multiselect("Churn Risk", seg_df["Churn_Risk"].unique(), default=seg_df["Churn_Risk"].unique())
        min_eng      = fc3.slider("Min Engagement Score", 0, 100, 0)

        filtered = seg_df[
            seg_df["Tier"].isin(tier_filter) &
            seg_df["Churn_Risk"].isin(risk_filter) &
            (seg_df["Engagement_Score"] >= min_eng)
        ]
        st.dataframe(filtered, use_container_width=True, height=300)

        st.markdown('<div class="section-title">Descriptive Statistics</div>', unsafe_allow_html=True)
        st.dataframe(filtered.describe().round(2), use_container_width=True)

        st.plotly_chart(charts.engagement_scatter_chart(filtered), use_container_width=True)

        csv = filtered.to_csv(index=False).encode("utf-8")
        st.download_button("Download CSV", csv, "segments.csv", "text/csv")

    with tab2:
        rev_df = dg.get_revenue_trend()
        st.markdown('<div class="section-title">Revenue Trend DataFrame</div>', unsafe_allow_html=True)
        st.dataframe(rev_df, use_container_width=True)

        st.markdown("**Pandas Statistics:**")
        sc1, sc2, sc3 = st.columns(3)
        sc1.metric("Total Revenue", f"${rev_df['Actual'].sum():,.0f}")
        sc2.metric("Monthly Average", f"${rev_df['Actual'].mean():,.0f}")
        sc3.metric("Peak Month", rev_df.loc[rev_df['Actual'].idxmax(), 'Month'])

        st.plotly_chart(charts.revenue_trend_chart(rev_df), use_container_width=True)
        csv2 = rev_df.to_csv(index=False).encode("utf-8")
        st.download_button("Download CSV", csv2, "revenue_trend.csv", "text/csv")

    with tab3:
        ch_df = dg.get_channel_metrics()
        st.markdown('<div class="section-title">Channel Metrics DataFrame</div>', unsafe_allow_html=True)
        st.dataframe(ch_df, use_container_width=True)

        st.markdown("**NumPy Correlation Analysis:**")
        corr = np.corrcoef(ch_df["Revenue"], ch_df["Conversion_Rate"])[0, 1]
        st.metric("Revenue vs Conversion Rate Correlation", f"r = {corr:.3f}")

        col_e, col_f = st.columns(2)
        col_e.plotly_chart(charts.channel_pie_chart(ch_df), use_container_width=True)
        col_f.plotly_chart(charts.channel_conversion_chart(ch_df), use_container_width=True)

        csv3 = ch_df.to_csv(index=False).encode("utf-8")
        st.download_button("Download CSV", csv3, "channel_metrics.csv", "text/csv")
