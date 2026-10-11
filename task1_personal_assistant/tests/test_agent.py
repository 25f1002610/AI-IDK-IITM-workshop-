"""Unit tests for the personal_assistant root agent configuration and tool registration."""

import pytest
from google.adk.agents import Agent
from google.adk.tools.base_tool import BaseTool
from personal_assistant.agent import root_agent
from personal_assistant.tools.calculator import calculator_tool
from personal_assistant.tools.text_analyzer import text_analyzer_tool


class TestAgentConfiguration:
    """Test suite verifying root agent setup and tool registration."""

    def test_agent_instance(self):
        assert isinstance(root_agent, Agent)

    def test_agent_metadata(self):
        assert root_agent.name == "personal_assistant"
        assert len(root_agent.description) > 0
        assert "personal assistant" in root_agent.description.lower()
        assert len(root_agent.instruction) > 0
        assert "google_search" in root_agent.instruction
        assert "calculator_tool" in root_agent.instruction
        assert "text_analyzer_tool" in root_agent.instruction

    def test_agent_tools_registration(self):
        # Must register all 3 tools on the single root agent
        assert len(root_agent.tools) == 3

        tool_names = [
            getattr(t, "name", getattr(t, "__name__", None))
            for t in root_agent.tools
        ]
        assert "google_search" in tool_names
        assert "calculator_tool" in tool_names
        assert "text_analyzer_tool" in tool_names

    def test_tool_types(self):
        # 1 BaseTool (GoogleSearchTool) and 2 Callables
        base_tools = [t for t in root_agent.tools if isinstance(t, BaseTool)]
        callable_tools = [t for t in root_agent.tools if callable(t) and not isinstance(t, BaseTool)]

        assert len(base_tools) == 1
        assert base_tools[0].name == "google_search"
        assert len(callable_tools) == 2

    def test_registered_calculator_invocation(self):
        # Find calculator tool from root_agent.tools
        calc_tool = next(
            t for t in root_agent.tools
            if getattr(t, "__name__", None) == "calculator_tool"
        )
        res = calc_tool("12500 * 18 / 100")
        assert res["status"] == "success"
        assert res["result"] == 2250

    def test_registered_text_analyzer_invocation(self):
        # Find text analyzer tool from root_agent.tools
        analyzer_tool = next(
            t for t in root_agent.tools
            if getattr(t, "__name__", None) == "text_analyzer_tool"
        )
        sample = "Google ADK helps developers build AI agents."
        res = analyzer_tool(sample)
        assert res["status"] == "success"
        assert res["characters"] == 44
        assert res["words"] == 7
        assert res["sentences"] == 1

    def test_scenarios_intent_tool_matching(self):
        """Simulate intent analysis for the required workshop scenarios."""
        # Scenario A: Search
        query_a = "Search for the latest developments in AI agents."
        assert any(k in query_a.lower() for k in ["search", "latest", "developments"])

        # Scenario B: Calculation
        query_b = "Calculate 18% GST on ₹25,000."
        assert any(k in query_b.lower() for k in ["calculate", "gst", "%"])
        # Arithmetic mapping: 25000 * 18 / 100
        calc_res = calculator_tool("25000 * 18 / 100")
        assert calc_res["result"] == 4500

        # Scenario C: Text analysis
        sample_c = "Analyze this paragraph and tell me its word and sentence count."
        analysis_res = text_analyzer_tool(sample_c)
        assert analysis_res["words"] == 11
        assert analysis_res["sentences"] == 1

        # Scenario D: Combined
        calc_d = calculator_tool("50000 * 18 / 100")
        assert calc_d["result"] == 9000
