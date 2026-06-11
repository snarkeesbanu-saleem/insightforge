# InsightForge AI Analytics Suite

InsightForge is an elite, full-stack business growth decision engine and analytics suite. It enables organizations to simulate pricing models, analyze customer retention mechanics, query dynamic vector databases in a localized search network, and leverage secure artificial intelligence solvers for growth optimization.

---

## 🚀 Key Features

### 1. Conversational Co-Analyst
An interactive, responsive chat workspace to explore dynamic business concepts.
- **Strategic Advisory**: Built to unpack customer acquisition cost (CAC) dynamics, conversion funnels, and churn probability.
- **Dynamic Predefined Directives**: Quick-launch chips suggest analytical paths such as SLA turnaround analysis and sales pricing curves.
- **Resilient AI Failover Integration**: Fully decoupled architecture that leverages state-of-the-art backend models, with immediate graceful fallback to custom diagnostic rules if network latency occurs.

### 2. Live Decision Sandbox
An interactive parameter laboratory modeling customer decisions under varying conditions.
- **Variable Fine-Tuning**: Real-time adjustment of operational sliders mapping:
  - **Marketing Budgets (CAC bounds)**
  - **Subscription Prices**
  - **Customer SLA Support Turnaround Timelines**
- **Attribution Vectors (SHAP)**: Rich visualizations utilizing game-theoretic force charts to describe which sandbox factors drive risk higher (+) or lower (-).

### 3. Vector Corpus Reference (RAG Simulation)
A localized RAG (Retrieval-Augmented Generation) document database.
- **Interactive Indexing**: Authors can input documents, titles, and text paragraphs.
- **Immediate Contextual Injection**: Search queries parse references dynamically and inject them directly into synthesized business briefs.

### 4. High-Fidelity Interactive Data Suite
Advanced and beautifully styled data widgets displaying metrics:
- **Pricing Elasticity Curve**: Map conversion rates vs. overall revenue multipliers.
- **Support Turnaround Trends vs. Subscriber Retention**: Track the impact of support speed on client retainment.
- **Attribution Breakdown Gauges**: Real-time conversion speedometers, ARR expectancy dashboards, and customer lifetime value trackers.

---

## 🛠️ Architecture & Technologies

The system is built on a resilient, high-speed, modern full-stack web structure:

- **Frontend Core**: **React 18** and **TypeScript** configured over **Vite** for optimized, high-fidelity browser execution.
- **Visual styling**: Utilizes utility-first **Tailwind CSS** with cohesive display palettes, deep charcoal canvases, subtle neon highlights, custom glassmorphic grids, and elegant typography.
- **Micro-Animations**: Framed in **Motion** (Framer Motion) for smooth tab shifts, interactive drawers, and hover feedback.
- **Data Engineering Charts**: Powered by **Recharts** combining bar, line, and composed chart assets.
- **Scalable Server**: Powered by an **Express** web server in TypeScript with built-in asset pipelining for development and optimized bundlers for compiled production.

---

## 💻 Local Setup & Development Guide

Follow these simple steps to run the InsightForge workspace locally:

### 1. Clone & Setup Workspace
Ensure you have [Node.js](https://nodejs.org) (v18 or higher recommended) installed.

```bash
# Install package dependencies
npm install
```

### 2. Configure Environment Variables
Copy the `.env.example` file to `.env` and configure your API credentials:

```bash
cp .env.example .env
```

Define any keys securely on the backend. The server accesses them natively, ensuring zero exposure of sensitive client credentials to the web browser.

### 3. Spin Up Development Servers
Boot the unified backend-controlled dev instance:

```bash
npm run dev
```
The server will start on port `3000`. Open `http://localhost:3000` to interact with your live local system.

### 4. Build and Compile for Production
To optimize the build for production hosting environments:

```bash
# Build frontend assets and bundle the TS server
npm run build

# Start the compiled single-bundle standalone server
npm run start
```

---

## 🛡️ Best Practices & Quality Control

- **Server-Defined Ingress**: The Express server is strictly bound to host `0.0.0.0` and port `3000` to ensure proper routing across modern virtual machines and containers.
- **Modular Component Design**: Interactive modules (Sandbox control grids, Chat drawers, Corpus list cards) are strictly decoupled to maintain clean state isolation.
- **Strict Linting Standards**: Code is automatically validated with ESLint and TypeScript compilation checkers to ensure reliable, error-free runtime deployments.
