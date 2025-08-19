import os

print(5 < 10 <= 20 < 30)

a, b = 1, 2

a = "hello"

a = b = 3

class Instruction:
    def __init__(self) -> None:
        pass

    def add(x, y) -> int:
        return x + y


class VariableDeclaration(Instruction):
    def __init__(self, var_id, varType, init, variableParam) -> None: #self = thisExpression
        super().__init__()  #object:callee: superExpression
        self.var_id = var_id
        self.varType = varType
        self.init = init
        self.variableParam = variableParam


def add(x, y):
    return x + y


# def sub(x, y):
#     return x - y


if a > 1:
    x = "_"

if 1 < a <= 3:
    f = 1
else:
    f = input(a)

for i in range(10):
    b = i


g = add(add(f, 2), 2)

os.system(g)
