"""Unit tests for the Text Analyzer tool."""

from personal_assistant.tools.text_analyzer import analyze_text, text_analyzer_tool


class TestTextAnalyzer:
    """Test suite for analyze_text function and text_analyzer_tool."""

    def test_single_sentence_example(self):
        # Workshop text: "Google ADK helps developers build AI agents."
        text = "Google ADK helps developers build AI agents."
        res = analyze_text(text)
        assert res["status"] == "success"
        assert res["characters"] == 44
        assert res["words"] == 7
        assert res["sentences"] == 1

    def test_example_with_trailing_space(self):
        # Text with 45 characters as in prompt example
        text = "Google ADK helps developers build AI agents. "
        res = analyze_text(text)
        assert res["characters"] == 45
        assert res["words"] == 7
        assert res["sentences"] == 1

    def test_empty_string(self):
        res = analyze_text("")
        assert res["characters"] == 0
        assert res["words"] == 0
        assert res["sentences"] == 0

    def test_whitespace_only(self):
        res = analyze_text("   \n\t  ")
        assert res["characters"] == 7
        assert res["words"] == 0
        assert res["sentences"] == 0

    def test_punctuation_only(self):
        res = analyze_text("... ??? !!! ---")
        assert res["words"] == 0
        assert res["sentences"] == 0

    def test_multiple_sentences(self):
        text = "First sentence here. Second sentence starts now! Is this the third sentence? Yes."
        res = analyze_text(text)
        assert res["sentences"] == 4
        assert res["words"] == 13

    def test_sentence_without_trailing_period(self):
        text = "This is a single sentence without punctuation"
        res = analyze_text(text)
        assert res["words"] == 7
        assert res["sentences"] == 1

    def test_hyphenated_and_contracted_words(self):
        text = "State-of-the-art AI tools shouldn't fail."
        res = analyze_text(text)
        # "State-of-the-art", "AI", "tools", "shouldn't", "fail." -> 5 words
        assert res["words"] == 5
        assert res["sentences"] == 1

    def test_text_analyzer_tool_envelope(self):
        res = text_analyzer_tool("Hello world! How are you?")
        assert res["status"] == "success"
        assert res["words"] == 5
        assert res["sentences"] == 2
        assert res["characters"] == 25
