"""Text Analyzer tool for counting characters, words, and sentences.

This module provides deterministic, rule-based text metrics according to
explicitly documented parsing rules.
"""

from __future__ import annotations

import re
from typing import Any


def analyze_text(text: str) -> dict[str, Any]:
    """Analyzes a text string and returns character, word, and sentence counts.

    Counting Rules:
    1. Characters:
       - Total count of all characters in the string, including whitespace,
         punctuation, and newlines (`len(text)`).
       - Also provides `characters_no_spaces` for convenient reference.

    2. Words:
       - Extracted using whitespace segmentation and word-boundary tokens.
       - A word is any contiguous non-whitespace sequence that contains
         alphanumeric characters or contractions (e.g. "don't", "state-of-the-art").
       - Pure punctuation symbols (e.g. "---", "...") without alphanumeric characters
         are not counted as words.
       - For empty or whitespace-only inputs, word count is 0.

    3. Sentences:
       - Sentences are delimited by terminal punctuation marks ('.', '!', '?')
         optionally followed by whitespace or quotes.
       - Consecutive delimiters (e.g., '...', '?!') are treated as a single delimiter.
       - If the text contains words but ends without a terminating punctuation mark,
         that trailing segment is counted as a valid sentence.
       - Empty strings or strings containing only whitespace and punctuation have 0 sentences.

    Args:
        text: The input text to analyze.

    Returns:
        A dictionary with character, word, and sentence counts:
        {
            "characters": int,
            "words": int,
            "sentences": int,
            "characters_no_spaces": int,
            "status": "success"
        }
    """
    if not isinstance(text, str):
        return {
            "status": "error",
            "message": f"Input text must be a string, got {type(text).__name__}",
            "characters": 0,
            "words": 0,
            "sentences": 0,
            "characters_no_spaces": 0,
        }

    # 1. Character count (exact unicode length)
    char_count = len(text)
    char_no_spaces = len("".join(text.split()))

    # Empty or whitespace only
    stripped = text.strip()
    if not stripped:
        return {
            "status": "success",
            "characters": char_count,
            "words": 0,
            "sentences": 0,
            "characters_no_spaces": 0,
        }

    # 2. Word count: extract words containing alphanumeric characters
    # Matches words with hyphens and apostrophes, e.g. "AI-driven", "it's"
    raw_tokens = text.split()
    # Filter out tokens that are purely punctuation (e.g. "--", "@#$")
    words = [t for t in raw_tokens if re.search(r"[\w]", t)]
    word_count = len(words)

    # 3. Sentence count:
    # Split on sentence boundaries: periods, exclamation marks, question marks
    # followed by whitespace, end-of-string, or quotes.
    sentence_candidates = re.split(r"[.!?]+(?:\s+|$)", stripped)
    # Count non-empty segments that contain at least one alphanumeric word character
    valid_sentences = [s for s in sentence_candidates if re.search(r"[\w]", s)]
    sentence_count = len(valid_sentences)

    # Fallback: if text had words but didn't trigger delimiter match
    if sentence_count == 0 and word_count > 0:
        sentence_count = 1

    return {
        "status": "success",
        "characters": char_count,
        "words": word_count,
        "sentences": sentence_count,
        "characters_no_spaces": char_no_spaces,
    }


def text_analyzer_tool(text: str) -> dict[str, Any]:
    """Tool function registered with the agent to analyze text metrics.

    Args:
        text: The text to analyze for character, word, and sentence counts.

    Returns:
        A dictionary containing characters, words, and sentences metrics.
    """
    return analyze_text(text)
