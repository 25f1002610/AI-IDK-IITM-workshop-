# Task 1: Personal AI Assistant Using Google ADK

A complete, production-grade implementation of the **Personal AI Assistant** built with the official **Google Agent Development Kit (ADK)** for the workshop certification assignment.

The assistant is named `personal_assistant` and is registered with three specialized tools to intelligently handle natural-language user requests, including single-tool and multi-tool scenarios:
1. **Google Search**: Built-in Google ADK web search grounding tool (`google_search`).
2. **Calculator**: Safe Python arithmetic evaluator using AST validation (`calculator_tool`).
3. **Text Analyzer**: Deterministic rule-based text metrics tool (`text_analyzer_tool`).

---

## Architecture and Project Structure

```
task1_personal_assistant/
│
├── personal_assistant/                # Core agent package
│   ├── __init__.py                    # Package export for root_agent and tools
│   ├── agent.py                       # Root agent definition & Google ADK registration
│   └── tools/                         # Modular tool implementations
│       ├── __init__.py                # Tool exports
│       ├── calculator.py              # Safe AST arithmetic parser & calculator tool
│       └── text_analyzer.py           # Deterministic text metric counter
│
├── tests/                             # Automated test suite (28 test cases)
│   ├── __init__.py
│   ├── test_agent.py                  # Agent initialization, tool registration & scenarios
│   ├── test_calculator.py             # Arithmetic, safety rejection & edge case tests
│   └── test_text_analyzer.py          # Word, sentence, character & punctuation tests
│
├── .env.example                       # Template for API keys and configuration
├── .gitignore                         # Strict exclusion for secrets, cache, and logs
├── pyproject.toml                     # Modern Python project configuration
├── requirements.txt                   # Dependency lock with verified versions
└── README.md                          # Documentation and runbook
```

---

## Tool Specifications

### 1. Google Search (`google_search`)
- **Source**: Built-in Google ADK tool (`google.adk.tools.google_search_tool.GoogleSearchTool`).
- **Capability**: Retrieves live external information and current knowledge using Gemini model web grounding.
- **Multi-Tool Compatibility**: Initialized with `bypass_multi_tools_limit=True` to seamlessly coexist with custom Python function declarations on the same root agent.

### 2. Calculator (`calculator_tool`)
- **Input**: `expression: str`
- **Output**: Numeric evaluation result or explicit error payload.
- **Safety Guarantees**:
  - Implements a recursive Abstract Syntax Tree (`ast.parse(mode='eval')`) evaluator.
  - **No `eval()`**: Arbitrary code execution, built-in functions, variable access, and imports are strictly rejected.
  - Supports: `+`, `-`, `*`, `/`, `//`, `%`, `**` (powers), and `^` (exponentiation alias).
  - Handles parentheses, unary signs, floating-point math, and division by zero.
  - Protects against Denial-of-Service with exponent magnitude limits (`MAX_EXPONENT = 10,000`).

### 3. Text Analyzer (`text_analyzer_tool`)
- **Input**: `text: str`
- **Output**: Dictionary containing:
  - `characters`: Total Unicode character count (`len(text)`).
  - `characters_no_spaces`: Non-whitespace character count.
  - `words`: Count of tokens containing alphanumeric characters or contractions (e.g. `state-of-the-art`, `it's`). Pure punctuation sequences (`---`, `...`) are excluded.
  - `sentences`: Count of valid sentences segmented on terminators (`.`, `!`, `?`). Segments without punctuation but containing words count as 1 sentence. Empty or whitespace-only strings evaluate to 0.

---

## Prerequisites

- **Python**: 3.10+ (Tested on Python 3.10.11)
- **Google Gemini API Key**: Obtain a free API key from [Google AI Studio](https://aistudio.google.com/).

---

## Installation & Environment Setup

1. **Clone or navigate to the project directory:**
   ```bash
   cd task1_personal_assistant
   ```

2. **Create and activate a virtual environment (optional but recommended):**
   ```bash
   # Windows (PowerShell)
   python -m venv venv
   .\venv\Scripts\Activate.ps1

   # Linux / macOS
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**
   Copy `.env.example` to `.env`:
   ```bash
   # Windows (PowerShell)
   Copy-Item .env.example .env

   # Linux / macOS
   cp .env.example .env
   ```
   Open `.env` and insert your Gemini API key:
   ```env
   GEMINI_API_KEY=AIzaSy...your_actual_key_here
   GEMINI_MODEL=gemini-2.5-flash
   ```

---

## Launching the Google ADK Web UI

The official Google ADK Web UI provides an interactive chat interface, live agent inspector, event history, and trace visualization.

Run the following command from the `task1_personal_assistant` directory:
```bash
adk web --port 8000 .
```

Open your browser at:
```
http://127.0.0.1:8000
```

Select `personal_assistant` from the top agent dropdown and begin chatting!

---

## Running Automated Tests

Run the full automated test suite (28 tests across calculator, text analyzer, and agent configuration):
```bash
python -m pytest tests -v
```

Expected output:
```
tests/test_agent.py::TestAgentConfiguration::test_agent_instance PASSED
tests/test_agent.py::TestAgentConfiguration::test_agent_metadata PASSED
tests/test_agent.py::TestAgentConfiguration::test_agent_tools_registration PASSED
tests/test_agent.py::TestAgentConfiguration::test_tool_types PASSED
tests/test_agent.py::TestAgentConfiguration::test_registered_calculator_invocation PASSED
tests/test_agent.py::TestAgentConfiguration::test_registered_text_analyzer_invocation PASSED
tests/test_agent.py::TestAgentConfiguration::test_scenarios_intent_tool_matching PASSED
tests/test_calculator.py::TestCalculator::test_basic_arithmetic PASSED
tests/test_calculator.py::TestCalculator::test_workshop_example PASSED
tests/test_calculator.py::TestCalculator::test_gst_scenario_expression PASSED
tests/test_calculator.py::TestCalculator::test_parentheses_and_operator_precedence PASSED
tests/test_calculator.py::TestCalculator::test_powers_and_exponents PASSED
tests/test_calculator.py::TestCalculator::test_unary_operators PASSED
tests/test_calculator.py::TestCalculator::test_float_calculations PASSED
tests/test_calculator.py::TestCalculator::test_division_by_zero_raises PASSED
tests/test_calculator.py::TestCalculator::test_invalid_syntax_raises PASSED
tests/test_calculator.py::TestCalculator::test_security_rejection_of_arbitrary_code PASSED
tests/test_calculator.py::TestCalculator::test_overflow_protection PASSED
tests/test_calculator.py::TestCalculator::test_calculator_tool_envelope PASSED
tests/test_text_analyzer.py::TestTextAnalyzer::test_single_sentence_example PASSED
tests/test_text_analyzer.py::TestTextAnalyzer::test_example_with_trailing_space PASSED
tests/test_text_analyzer.py::TestTextAnalyzer::test_empty_string PASSED
tests/test_text_analyzer.py::TestTextAnalyzer::test_whitespace_only PASSED
tests/test_text_analyzer.py::TestTextAnalyzer::test_punctuation_only PASSED
tests/test_text_analyzer.py::TestTextAnalyzer::test_multiple_sentences PASSED
tests/test_text_analyzer.py::TestTextAnalyzer::test_sentence_without_trailing_period PASSED
tests/test_text_analyzer.py::TestTextAnalyzer::test_hyphenated_and_contracted_words PASSED
tests/test_text_analyzer.py::TestTextAnalyzer::test_text_analyzer_tool_envelope PASSED

======================== 28 passed in 1.79s ========================
```

---

## Example User Scenarios

Try these prompts in the ADK Web UI:

### Scenario A: Search
> **Prompt**: `"Search for the latest developments in AI agents."`  
> **Agent Action**: Calls `google_search` to query recent articles and announcements, then presents a concise summary with citations.

### Scenario B: Calculation
> **Prompt**: `"Calculate 18% GST on ₹25,000."`  
> **Agent Action**: Calls `calculator_tool` with `25000 * 18 / 100`, returning:  
> `Result: 4500 (Total with GST: ₹29,500)`.

### Scenario C: Text Analysis
> **Prompt**: `"Analyze this paragraph and tell me its word and sentence count: Google ADK helps developers build AI agents."`  
> **Agent Action**: Calls `text_analyzer_tool` and reports:  
> - Characters: 44  
> - Words: 7  
> - Sentences: 1  

### Scenario D: Combined Multi-Tool Request
> **Prompt**: `"Search for information about Google ADK and calculate 18% of ₹50,000."`  
> **Agent Action**: Intelligently invokes both `google_search` and `calculator_tool` (evaluating `50000 * 18 / 100` = 9000), synthesizing both results in a single, well-structured answer.

---

## UI Integration Architecture & Options

As required, this project maintains clean separation between backend agent logic and frontend presentation:

1. **Official ADK Web UI (`adk web`)**:
   - Ready out-of-the-box for instant interactive testing, inspection, trace trees, and submission screenshots.
   - Served via FastAPI at `http://127.0.0.1:8000`.

2. **Custom Frontend Integration (Phase 6 Ready)**:
   - The ADK Web server automatically exposes standard REST and streaming endpoints:
     - `POST /run`: Synchronous agent turn execution.
     - `POST /run_sse`: Server-Sent Events (SSE) streaming for real-time token and tool activity streaming.
     - `GET /apps/{app_name}/app-info`: Tool and agent schemas.
     - `GET /apps/{app_name}/users/{user_id}/sessions`: Session management and history.
   - When the custom frontend library list is provided, a dedicated modern UI can connect directly to these streaming endpoints.

---

## Submission & Credential-Safety Checklist

- [x] `.env` is listed in `.gitignore` and never committed or included in archives.
- [x] `.env.example` contains only non-sensitive placeholders.
- [x] No hardcoded API keys or secrets in any source file or docstring.
- [x] Safe expression parser uses `ast` and strictly prohibits `eval()`.
- [x] All 3 tools registered with the single `personal_assistant` root agent.
- [x] 28 unit tests passing across all components.
- [x] ADK Web UI verified running on `http://127.0.0.1:8000` with active agent discovery.
- [x] Clean ZIP package generation supported.
