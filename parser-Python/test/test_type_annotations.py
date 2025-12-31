"""测试 Python typing 模块支持的所有类型注解

根据 Python typing 文档 (PEP 484, 526, 544, 586, 593, 612, 613, 647, 655, 673, 675, 681, 692, 695, 742)
测试以下类型注解场景：

1. 基本类型：int, float, str, bool, None
2. 容器类型：List, Dict, Tuple, Set
3. 特殊类型：Optional, Union, Literal, Any
4. 泛型类型：Generic, TypeVar, 用户定义的泛型类
5. 其他：Callable, Type, NewType, Protocol 等
"""

from __future__ import annotations
from typing import (
    List, Dict, Optional, Union, Tuple, Literal, Generic, TypeVar,
    Set, Any, Callable, Type, NewType, Protocol, TypedDict
)

# ========== 1. 基本类型 (PEP 484) ==========
# 测试：int, float, str, bool, None

def test_int() -> int:
    """测试 int 类型注解"""
    return 1

def test_float() -> float:
    """测试 float 类型注解"""
    return 3.14

def test_str() -> str:
    """测试 str 类型注解"""
    return "hello"

def test_bool() -> bool:
    """测试 bool 类型注解"""
    return True

def test_none() -> None:
    """测试 None 类型注解"""
    pass

# ========== 2. 容器类型 (PEP 484, PEP 585) ==========
# 测试：List[T], Dict[K, V], Tuple[T1, T2, ...], Set[T]

def test_list_int() -> List[int]:
    """测试 List[int] 类型注解"""
    return [1, 2, 3]

def test_list_str() -> List[str]:
    """测试 List[str] 类型注解"""
    return ["a", "b"]

# Python 3.9+ 语法 (PEP 585)
def test_list_int_new() -> list[int]:
    """测试 Python 3.9+ 的 list[int] 语法"""
    return [1, 2, 3]

def test_dict_str_int() -> Dict[str, int]:
    """测试 Dict[str, int] 类型注解"""
    return {"a": 1, "b": 2}

def test_dict_int_str() -> Dict[int, str]:
    """测试 Dict[int, str] 类型注解"""
    return {1: "a", 2: "b"}

# Python 3.9+ 语法 (PEP 585)
def test_dict_str_int_new() -> dict[str, int]:
    """测试 Python 3.9+ 的 dict[str, int] 语法"""
    return {"a": 1}

def test_tuple_int_str() -> Tuple[int, str]:
    """测试 Tuple[int, str] 类型注解"""
    return (1, "hello")

def test_tuple_three() -> Tuple[int, str, bool]:
    """测试 Tuple[int, str, bool] 类型注解"""
    return (1, "a", True)

# Python 3.9+ 语法 (PEP 585)
def test_tuple_new() -> tuple[int, str]:
    """测试 Python 3.9+ 的 tuple[int, str] 语法"""
    return (1, "hello")

def test_tuple_variable_length() -> tuple[int, ...]:
    """测试 tuple[int, ...] 可变长度元组类型注解"""
    return (1, 2, 3, 4, 5)

def test_set_int() -> Set[int]:
    """测试 Set[int] 类型注解"""
    return {1, 2, 3}

# Python 3.9+ 语法 (PEP 585)
def test_set_int_new() -> set[int]:
    """测试 Python 3.9+ 的 set[int] 语法"""
    return {1, 2, 3}

# ========== 3. Optional 类型 (PEP 484) ==========
# 测试：Optional[T] 等价于 Union[T, None]

def test_optional_str() -> Optional[str]:
    """测试 Optional[str] 类型注解"""
    return None

def test_optional_int() -> Optional[int]:
    """测试 Optional[int] 类型注解"""
    return 42

# ========== 4. Union 类型 (PEP 484) ==========
# 测试：Union[T1, T2, ...] 表示 T1 或 T2 类型

def test_union_int_str() -> Union[int, str]:
    """测试 Union[int, str] 类型注解"""
    return 1

def test_union_with_none() -> Union[str, None]:
    """测试 Union[str, None] 类型注解"""
    return None

def test_union_three() -> Union[int, str, bool]:
    """测试 Union[int, str, bool] 类型注解"""
    return True

# Python 3.10+ 语法 (PEP 604)
def test_union_pipe() -> int | str:
    """测试 Python 3.10+ 的 int | str 语法"""
    return 1

# ========== 5. Literal 类型 (PEP 586) ==========
# 测试：Literal["a", "b", ...] 表示字面量值的联合类型

def test_literal_str() -> Literal["success", "error"]:
    """测试 Literal["success", "error"] 类型注解"""
    return "success"

def test_literal_int() -> Literal[1, 2, 3]:
    """测试 Literal[1, 2, 3] 类型注解"""
    return 1

def test_literal_bool() -> Literal[True, False]:
    """测试 Literal[True, False] 类型注解"""
    return True

def test_literal_mixed() -> Literal["a", 1, True]:
    """测试混合类型的 Literal["a", 1, True] 类型注解"""
    return "a"

# ========== 6. Any 类型 (PEP 484) ==========
# 测试：Any 表示任意类型

def test_any() -> Any:
    """测试 Any 类型注解"""
    return "anything"

# ========== 7. 嵌套类型 ==========
# 测试：嵌套的容器类型和特殊类型

def test_list_of_dict() -> List[Dict[str, int]]:
    """测试 List[Dict[str, int]] 嵌套类型注解"""
    return [{"a": 1}]

def test_dict_of_list() -> Dict[str, List[int]]:
    """测试 Dict[str, List[int]] 嵌套类型注解"""
    return {"nums": [1, 2, 3]}

def test_optional_list() -> Optional[List[int]]:
    """测试 Optional[List[int]] 嵌套类型注解"""
    return [1, 2, 3]

def test_union_list() -> Union[List[int], List[str]]:
    """测试 Union[List[int], List[str]] 嵌套类型注解"""
    return [1, 2, 3]

# ========== 8. 用户定义的泛型类型 (PEP 484, PEP 695) ==========
# 测试：Generic[T], TypeVar, 用户定义的泛型类

# 定义类型变量
T = TypeVar('T')

class MyClass(Generic[T]):
    """用户定义的泛型类"""
    pass

def test_custom_type() -> MyClass:
    """测试自定义类型 MyClass 类型注解"""
    return MyClass()

def test_custom_generic() -> MyClass[str]:
    """测试 MyClass[str] 泛型类型注解"""
    return MyClass()

def test_custom_literal() -> MyClass[Literal["test"]]:
    """测试 MyClass[Literal["test"]] 复杂泛型类型注解"""
    return MyClass()

def test_custom_list() -> MyClass[List[str]]:
    """测试 MyClass[List[str]] 嵌套泛型类型注解"""
    return MyClass()

def test_custom_dict() -> MyClass[Dict[str, int]]:
    """测试 MyClass[Dict[str, int]] 嵌套泛型类型注解"""
    return MyClass()

def test_custom_nested() -> MyClass[Optional[List[Dict[str, int]]]]:
    """测试 MyClass[Optional[List[Dict[str, int]]]] 多层嵌套泛型类型注解"""
    return MyClass()

def test_custom_double() -> MyClass[MyClass[str]]:
    """测试 MyClass[MyClass[str]] 双重泛型类型注解"""
    return MyClass()

# ========== 9. Callable 类型 (PEP 484) ==========
# 测试：Callable[[Args], ReturnType] 用于标注可调用对象

def test_callable() -> Callable[[int, str], bool]:
    """测试 Callable[[int, str], bool] 类型注解"""
    def func(x: int, y: str) -> bool:
        return True
    return func

def test_callable_ellipsis() -> Callable[..., str]:
    """测试 Callable[..., str] 类型注解（任意参数）"""
    def func(*args, **kwargs) -> str:
        return "result"
    return func

def test_callable_no_args() -> Callable[[], bool]:
    """测试 Callable[[], bool] 类型注解（无参数）"""
    def func() -> bool:
        return True
    return func

# ========== 10. Type 类型 (PEP 484) ==========
# 测试：Type[C] 用于标注类对象本身

class User:
    pass

def test_type() -> Type[User]:
    """测试 Type[User] 类型注解"""
    return User

def test_type_union() -> Type[User] | Type[str]:
    """测试 Type[User] | Type[str] 类型注解"""
    return User

# ========== 11. NewType (PEP 484) ==========
# 测试：NewType 用于创建独有类型

UserId = NewType('UserId', int)

def test_newtype() -> UserId:
    """测试 NewType UserId 类型注解"""
    return UserId(1)

# ========== 12. Protocol (PEP 544) ==========
# 测试：Protocol 用于结构子类型（静态鸭子类型）

class Drawable(Protocol):
    """Protocol 定义"""
    def draw(self) -> None:
        ...

def test_protocol() -> Drawable:
    """测试 Protocol 类型注解"""
    class Circle:
        def draw(self) -> None:
            pass
    return Circle()

# ========== 13. TypedDict (PEP 589) ==========
# 测试：TypedDict 用于类型化字典

class Movie(TypedDict):
    """TypedDict 定义"""
    title: str
    year: int

def test_typeddict() -> Movie:
    """测试 TypedDict 类型注解"""
    return {"title": "Matrix", "year": 1999}

# ========== 14. 函数参数类型注解 ==========
# 测试：函数参数的类型注解

def test_param_annotations(
    x: int,
    y: str = "default",
    z: Optional[List[int]] = None
) -> Dict[str, int]:
    """测试函数参数的类型注解"""
    return {"result": 1}

# ========== 15. 变量类型注解 (PEP 526) ==========
# 测试：变量声明的类型注解

x: int = 1
y: List[str] = ["a", "b"]
z: Optional[Dict[str, int]] = None

# ========== 16. 复杂组合类型 ==========
# 测试：各种类型的复杂组合

def test_complex_combination() -> Dict[str, List[Union[int, str]]]:
    """测试复杂的组合类型注解"""
    return {"nums": [1, "two", 3]}

def test_literal_in_generic() -> MyClass[Literal["chart_generator", "END"]]:
    """测试泛型中的 Literal 类型"""
    END = "END"
    return MyClass()

def test_union_in_list() -> List[Union[int, str, bool]]:
    """测试 List 中的 Union 类型"""
    return [1, "two", True]

# ========== 17. 无类型注解 ==========
# 测试：没有类型注解的函数

def test_no_annotation():
    """测试无类型注解的函数"""
    return "no type"
