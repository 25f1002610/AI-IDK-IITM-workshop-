"""Unit tests for the Calculator tool."""

import pytest
from personal_assistant.tools.calculator import calculate, calculator_tool


class TestCalculator:
    """Test suite for calculate function and calculator_tool."""

    def test_basic_arithmetic(self):
        assert calculate("1 + 1") == 2
        assert calculate("10 - 4") == 6
        assert calculate("7 * 8") == 56
        assert calculate("20 / 4") == 5
        assert calculate("15 // 4") == 3
        assert calculate("17 % 5") == 2

    def test_workshop_example(self):
        # Workshop requirement: 12500 * 18 / 100 == 2250
        result = calculate("12500 * 18 / 100")
        assert result == 2250
        assert isinstance(result, int)

    def test_gst_scenario_expression(self):
        # 18% GST on 25,000 = 25000 * 18 / 100 == 4500
        assert calculate("25000 * 18 / 100") == 4500
        # 18% of 50,000 = 50000 * 18 / 100 == 9000
        assert calculate("50000 * 18 / 100") == 9000

    def test_parentheses_and_operator_precedence(self):
        assert calculate("(10 + 5) * 2") == 30
        assert calculate("10 + 5 * 2") == 20
        assert calculate("((2 + 3) * (4 + 1)) / 5") == 5

    def test_powers_and_exponents(self):
        assert calculate("2 ** 3") == 8
        assert calculate("2 ^ 3") == 8
        assert calculate("3 ** 4") == 81

    def test_unary_operators(self):
        assert calculate("-5 + 10") == 5
        assert calculate("+7 * -2") == -14
        assert calculate("-(-10)") == 10

    def test_float_calculations(self):
        assert calculate("0.5 + 0.25") == 0.75
        assert calculate("10 / 4") == 2.5

    def test_division_by_zero_raises(self):
        with pytest.raises(ZeroDivisionError):
            calculate("10 / 0")

        with pytest.raises(ZeroDivisionError):
            calculate("10 // 0")

        with pytest.raises(ZeroDivisionError):
            calculate("10 % 0")

    def test_invalid_syntax_raises(self):
        with pytest.raises(ValueError, match="Malformed"):
            calculate("10 +")

        with pytest.raises(ValueError, match="empty"):
            calculate("")

        with pytest.raises(ValueError, match="empty"):
            calculate("   ")

    def test_security_rejection_of_arbitrary_code(self):
        # Must strictly reject function calls, imports, variables, eval, etc.
        with pytest.raises(ValueError):
            calculate("__import__('os').system('dir')")

        with pytest.raises(ValueError):
            calculate("eval('2 + 2')")

        with pytest.raises(ValueError):
            calculate("open('secrets.txt').read()")

        with pytest.raises(ValueError):
            calculate("x + 1")

        with pytest.raises(ValueError):
            calculate("print(5)")

    def test_overflow_protection(self):
        with pytest.raises(OverflowError):
            calculate("2 ** 100000")

    def test_calculator_tool_envelope(self):
        ok_res = calculator_tool("12500 * 18 / 100")
        assert ok_res["status"] == "success"
        assert ok_res["result"] == 2250

        err_div = calculator_tool("100 / 0")
        assert err_div["status"] == "error"
        assert err_div["error_type"] == "ZeroDivisionError"

        err_syn = calculator_tool("import os")
        assert err_syn["status"] == "error"
