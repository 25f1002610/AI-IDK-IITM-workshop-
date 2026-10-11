"""Calculator tool for safe arithmetic expression evaluation.

This module provides a secure mathematical expression evaluator using Python's
Abstract Syntax Tree (ast). It strictly limits operations to safe arithmetic
and rejects arbitrary code execution, functions, attributes, and variables.
"""

from __future__ import annotations

import ast
import operator
from typing import Any, Union


# Mapping of supported AST binary operators to their python operator implementations
SAFE_BINARY_OPERATORS: dict[type[ast.operator], Any] = {
    ast.Add: operator.add,
    ast.Sub: operator.sub,
    ast.Mult: operator.mul,
    ast.Div: operator.truediv,
    ast.FloorDiv: operator.floordiv,
    ast.Mod: operator.mod,
    ast.Pow: operator.pow,
    ast.BitXor: operator.pow,  # Support '^' as exponentiation (common user notation)
}

# Mapping of supported AST unary operators
SAFE_UNARY_OPERATORS: dict[type[ast.unaryop], Any] = {
    ast.UAdd: operator.pos,
    ast.USub: operator.neg,
}

# Maximum allowed exponent to prevent CPU/memory exhaustion attacks (e.g., 9**999999)
MAX_EXPONENT = 10_000


def _safe_eval_node(node: ast.AST) -> Union[int, float]:
    """Recursively evaluate an AST node restricting to safe mathematical operations.

    Args:
        node: An AST node from parsed expression.

    Returns:
        The numerical result (int or float).

    Raises:
        ValueError: If node type is not allowed or expression is invalid.
        ZeroDivisionError: If division or modulo by zero occurs.
        OverflowError: If calculation exceeds numeric limits.
    """
    if isinstance(node, ast.Constant):  # Python 3.8+ numeric/literal constant
        if isinstance(node.value, (int, float)):
            return node.value
        raise ValueError(f"Unsupported constant type: {type(node.value).__name__}. Only numbers are allowed.")

    if isinstance(node, ast.BinOp):
        left_val = _safe_eval_node(node.left)
        right_val = _safe_eval_node(node.right)
        op_type = type(node.op)

        if op_type not in SAFE_BINARY_OPERATORS:
            raise ValueError(f"Unsupported operation: {op_type.__name__}")

        if op_type in (ast.Div, ast.FloorDiv, ast.Mod):
            if right_val == 0:
                raise ZeroDivisionError("Division or modulo by zero is undefined.")

        if op_type in (ast.Pow, ast.BitXor):
            # Guard against massive exponentiation DOS attacks
            if isinstance(right_val, (int, float)) and abs(right_val) > MAX_EXPONENT:
                raise OverflowError(f"Exponent {right_val} exceeds maximum allowed limit ({MAX_EXPONENT}).")

        op_func = SAFE_BINARY_OPERATORS[op_type]
        result = op_func(left_val, right_val)

        # Handle complex numbers if power produces them
        if isinstance(result, complex):
            raise ValueError("Calculations producing complex numbers are not supported.")
        return result

    if isinstance(node, ast.UnaryOp):
        operand_val = _safe_eval_node(node.operand)
        op_type = type(node.op)

        if op_type not in SAFE_UNARY_OPERATORS:
            raise ValueError(f"Unsupported unary operator: {op_type.__name__}")

        op_func = SAFE_UNARY_OPERATORS[op_type]
        return op_func(operand_val)

    raise ValueError(f"Unsupported expression component: {type(node).__name__}")


def calculate(expression: str) -> Union[int, float]:
    """Safely evaluates a mathematical expression and returns the numerical result.

    Supports addition (+), subtraction (-), multiplication (*), division (/),
    integer division (//), modulo (%), and exponentiation (** or ^), along with
    parentheses and unary signs. Does not allow variable access, function calls,
    or arbitrary code execution.

    Args:
        expression: A mathematical expression string, e.g. '12500 * 18 / 100'.

    Returns:
        The numerical result as an int or float.

    Raises:
        ValueError: If expression is empty, malformed, or contains disallowed syntax.
        ZeroDivisionError: If expression attempts division by zero.
        OverflowError: If expression exceeds numeric safety limits.

    Examples:
        >>> calculate("12500 * 18 / 100")
        2250
        >>> calculate("2 ** 8")
        256
        >>> calculate("(10 + 5) * 2")
        30
    """
    if not isinstance(expression, str):
        raise ValueError(f"Expression must be a string, got {type(expression).__name__}")

    cleaned = expression.strip()
    if not cleaned:
        raise ValueError("Expression cannot be empty.")

    # Parse into an AST expression node
    try:
        parsed = ast.parse(cleaned, mode="eval")
    except SyntaxError as e:
        raise ValueError(f"Malformed mathematical expression '{cleaned}': {e.msg}") from e

    # Evaluate using the safe recursive AST walker
    result = _safe_eval_node(parsed.body)

    # Format cleanly: if result is float with integer value (e.g. 2250.0), return int
    if isinstance(result, float) and result.is_integer():
        return int(result)

    return result


def calculator_tool(expression: str) -> dict[str, Any]:
    """Tool function registered with the agent to evaluate mathematical expressions.

    Args:
        expression: The mathematical expression to compute, e.g., '12500 * 18 / 100'.

    Returns:
        A dictionary containing the calculated result or error status.
    """
    try:
        result = calculate(expression)
        return {
            "status": "success",
            "expression": expression,
            "result": result,
        }
    except ZeroDivisionError as err:
        return {
            "status": "error",
            "expression": expression,
            "error_type": "ZeroDivisionError",
            "message": str(err),
        }
    except (ValueError, OverflowError) as err:
        return {
            "status": "error",
            "expression": expression,
            "error_type": type(err).__name__,
            "message": str(err),
        }
    except Exception as err:
        return {
            "status": "error",
            "expression": expression,
            "error_type": "EvaluationError",
            "message": f"Unexpected error evaluating expression: {err}",
        }
