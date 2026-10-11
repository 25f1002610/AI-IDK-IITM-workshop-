# Aster AI - Personal AI Assistant with Google ADK

An intelligent, multi-tool Personal AI Assistant built with the **Google Agent Development Kit (ADK)** and paired with an interactive, animated web interface referencing the **Disordered Grid** design system.

---

## 🌟 Key Capabilities

Aster AI is powered by a single Google ADK root agent (`personal_assistant`) registered with three specialized tools:

1. 🌐 **Google Search (`google_search`)**: Native Google ADK web search grounding for real-time information, research, and fact retrieval.
2. 🧮 **Calculator (`calculator_tool`)**: Safe Python arithmetic evaluator using AST validation (no `eval()`), supporting arithmetic, powers, percentages, and taxes (e.g., GST).
3. 📝 **Text Analyzer (`text_analyzer_tool`)**: Deterministic text metric counter computing character counts (with and without spaces), word counts, and sentence counts.
4. ⚡ **Multi-Tool Execution**: Supports complex turns requiring multiple tools simultaneously (e.g., researching a topic and computing financial percentages in a single turn).

---

## 📁 Repository Structure

```
├── task1_personal_assistant/         # Core Google ADK Backend Package
│   ├── personal_assistant/           # Agent and tools module
│   │   ├── agent.py                  # Root agent definition & Google ADK registration
│   │   └── tools/
│   │       ├── calculator.py         # AST safe calculator implementation
│   │       └── text_analyzer.py      # Text metrics implementation
│   ├── tests/                        # 28 passing pytest test cases
│   ├── api_server.py                 # FastAPI bridge with CORS support
│   ├── pyproject.toml                # Project packaging configuration
│   ├── requirements.txt              # Python dependencies
│   ├── .env.example                  # Environment template
│   └── README.md                     # Backend-specific documentation
│
├── frontend/                         # Aster AI React + TypeScript Web App
│   ├── src/
│   │   ├── components/               # Header, Sidebar, WelcomeView, ChatMessage, ToolCards
│   │   ├── App.tsx                   # Main state & conversation manager
│   │   └── index.css                 # Custom design tokens & grid styling
│   ├── package.json                  # Frontend dependencies
│   └── vite.config.ts                # Vite build configuration
│
├── .env.example                      # Root environment template
├── .gitignore                        # Strict rules excluding secrets, node_modules, and caches
└── README.md                         # Main documentation
```

---

## 🚀 Quickstart Guide

### 1. Environment Setup

Clone this repository and configure your environment:

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and paste your Google Gemini API key
# GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Backend Setup & Run

In the `task1_personal_assistant/` directory:

```bash
cd task1_personal_assistant

# Install Python dependencies
pip install -r requirements.txt

# Run the automated test suite (28/28 tests passing)
pytest tests -v

# Option A: Start the official Google ADK Web UI
adk web --port 8000 .

# Option B: Start the Aster AI API server bridge
python -m uvicorn api_server:app --port 8001 --host 127.0.0.1
```

### 3. Frontend Setup & Run

In the `frontend/` directory:

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit **http://localhost:5173** to chat with Aster AI.

---

## 🔒 Security & Privacy

- **API Keys**: Secrets are managed strictly via `.env` and are excluded from git history via `.gitignore`.
- **AST Calculator**: Employs Python's `ast` module in `mode='eval'` with strict node whitelisting; arbitrary code execution (`eval()`, `exec()`, system calls) is prohibited.
- **Dependencies**: Verified compatible with `google-adk >= 2.11.0` and Python 3.10+.
