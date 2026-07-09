"""
data/sample_docs.py
Pre-loaded knowledge base documents for the RAG engine.
"""

SAMPLE_DOCS = [
    {
        "id": "doc-001",
        "title": "Q2 Sales & Channel Acquisition Overview",
        "content": (
            "Q2 revenue reached $2.4M, up 18% quarter-over-quarter driven by organic search and "
            "referral channels. Paid acquisition CAC rose to $42, compressing margins by 3 points. "
            "Organic conversion rate held at 4.8%, outperforming paid at 2.1%. LinkedIn campaigns "
            "delivered highest B2B lead quality with 38% SQL rate. Email re-engagement drove "
            "$180K in recovered pipeline from dormant accounts. Top performing SKUs: Enterprise "
            "Plan (+34% units), Analytics Add-on (+52% attach rate). Regional breakdown: APAC "
            "+28%, EMEA +11%, North America +14%. Churn in Q2 was 3.2%, below 4.5% target."
        ),
    },
    {
        "id": "doc-002",
        "title": "Customer Engagement & Retention Deep Dive",
        "content": (
            "Engagement score analysis reveals a strong correlation between product usage frequency "
            "and long-term retention. Users logging in 5+ times per week show 92% 12-month "
            "retention vs 41% for weekly users. Onboarding completion rate improved to 74% after "
            "guided tour redesign, reducing time-to-value from 14 to 6 days. NPS climbed to 61 "
            "from 48 in Q1. Cohort analysis: March cohort shows 88% retention at 90 days, "
            "best in 18 months. Feature adoption: Advanced Analytics used by 34% of seats, "
            "API access by 28%. High-engagement users generate 3.4x revenue vs low-engagement "
            "segments. Recommended: invest in in-app guidance and proactive CSM outreach."
        ),
    },
    {
        "id": "doc-003",
        "title": "Support Operations Impact & Churn Analysis",
        "content": (
            "Support ticket volume grew 12% in Q2 while team headcount remained flat, increasing "
            "average response time from 4.2 to 7.4 hours. Customers with response times exceeding "
            "12 hours show 40% higher churn probability within 60 days. Priority-1 SLA compliance "
            "dropped to 78% from 91%. Top ticket categories: billing disputes (28%), feature "
            "requests (24%), bugs (21%), onboarding (18%), other (9%). Automating tier-1 password "
            "resets and billing queries could deflect 35% of volume. Recommended action: deploy "
            "AI chatbot for Tier-1, add 2 FTE for Tier-2 escalations, implement SLA alerting "
            "at 8-hour mark to prevent churn triggers. CSAT currently at 3.9/5."
        ),
    },
    {
        "id": "doc-004",
        "title": "ML Model Performance & Predictive Analytics",
        "content": (
            "The churn prediction model (Random Forest, 87% accuracy) identified 340 at-risk "
            "accounts worth $1.2M ARR. Feature importance ranking: support_turnaround (0.31), "
            "engagement_score (0.28), days_since_login (0.19), contract_tier (0.12), "
            "price_sensitivity (0.10). Conversion model (Logistic Regression, 79% AUC) flags "
            "leads with marketing_spend > $1000 and engagement_score > 70 as high-probability. "
            "SHAP analysis shows marketing spend contributes +12% to conversion for mid-market "
            "segment. Recommended re-training frequency: monthly. Data drift detected in "
            "engagement_score distribution — recalibration needed before Q3 deployment."
        ),
    },
    {
        "id": "doc-005",
        "title": "Pricing Strategy & Revenue Optimization",
        "content": (
            "Price elasticity analysis across 3 tiers: Standard ($49/mo, -0.8 elasticity), "
            "Professional ($149/mo, -1.2 elasticity), Enterprise ($399/mo, -0.4 elasticity). "
            "Enterprise segment is highly inelastic — opportunity to increase by 10-15% without "
            "churn impact. Standard tier shows high churn sensitivity to price — hold flat. "
            "Annual plan discount (20%) shows 2.3x LTV vs monthly. Upsell conversion: 22% of "
            "Standard users upgrade within 6 months when proactively engaged. Bundle pricing "
            "pilot for Analytics + API access showed 31% higher ARPU in test cohort. "
            "Recommended: introduce mid-tier at $99/mo to capture the conversion gap."
        ),
    },
]
