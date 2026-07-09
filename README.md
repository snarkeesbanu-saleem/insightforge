# InsightForge AI — Python Data Science Platform

[![Streamlit App](https://static.streamlit.io/badges/streamlit_badge_black_white.svg)](https://insightforge-lsqzqorwjxdmfc3nxi6dcp.streamlit.app/)

A fully Python-based AI data science platform.

⚡ **Live Demo:** [insightforge-lsqzqorwjxdmfc3nxi6dcp.streamlit.app](https://insightforge-lsqzqorwjxdmfc3nxi6dcp.streamlit.app/)

---

### Tech Stack & Tools Used

![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![Streamlit](https://img.shields.io/badge/Streamlit-FF4B4B?style=for-the-badge&logo=Streamlit&logoColor=white)
![Pandas](https://img.shields.io/badge/pandas-%23150458.svg?style=for-the-badge&logo=pandas&logoColor=white)
![NumPy](https://img.shields.io/badge/numpy-%23013243.svg?style=for-the-badge&logo=numpy&logoColor=white)
![scikit-learn](https://img.shields.io/badge/scikit--learn-%23F7931E.svg?style=for-the-badge&logo=scikit-learn&logoColor=white)
![Plotly](https://img.shields.io/badge/Plotly-%233F4F75.svg?style=for-the-badge&logo=plotly&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75C2?style=for-the-badge&logo=googlegemini&logoColor=white)

---

## Setup & Run

### 1. Install dependencies
```bash
pip install -r requirements.txt
```

### 2. (Optional) Add your Gemini API key
Create a `.env` file in the project root:
```
GEMINI_API_KEY=your_key_here
```

### 3. Launch the app
```bash
streamlit run app.py
```

Then open your browser at: **http://localhost:8501**

---

## Features

| Page | Technology |
|------|-----------|
| **Dashboard** | Pandas KPIs + Plotly charts |
| **AI Chat Agent** | Google Gemini + simulation fallback |
| **RAG Document Search** | Scikit-learn TF-IDF cosine similarity |
| **ML Predictive Sandbox** | NumPy ML engine + SHAP attribution |
| **Data Explorer** | Pandas DataFrames + CSV export |

## Project Structure

```
insightforge/
├── app.py                  # Main Streamlit entrypoint
├── modules/
│   ├── ai_chat.py          # Gemini AI + simulation
│   ├── charts.py           # Plotly visualizations
│   ├── data_generator.py   # Pandas/NumPy data pipelines
│   ├── ml_engine.py        # ML prediction + SHAP
│   └── rag_engine.py       # TF-IDF RAG retrieval
├── data/
│   └── sample_docs.py      # Pre-loaded knowledge base
└── requirements.txt
```
