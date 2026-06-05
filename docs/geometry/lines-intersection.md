# Точка перетину прямих

Нам задано дві прямі, описані рівняннями $a_1 x + b_1 y + c_1 = 0$ та  $a_2 x + b_2 y + c_2 = 0$.
Потрібно знайти точку перетину цих прямих або визначити, що прямі паралельні.

## Розв'язок \{#solution}

Якщо дві прямі не паралельні, то вони перетинаються.
Щоб знайти їхню точку перетину, нам треба розв'язати таку систему лінійних рівнянь:

$$
\begin{cases} a_1 x + b_1 y + c_1 = 0 \\
a_2 x + b_2 y + c_2 = 0
\end{cases}
$$

Скориставшись правилом Крамера, ми можемо одразу виписати розв'язок системи, який дасть нам шукану точку перетину прямих:

$$
x = - \frac{\begin{vmatrix}c_1 & b_1 \cr c_2 & b_2\end{vmatrix}}{\begin{vmatrix}a_1 & b_1 \cr a_2 & b_2\end{vmatrix} } = - \frac{c_1 b_2 - c_2 b_1}{a_1 b_2 - a_2 b_1},
$$

$$
y = - \frac{\begin{vmatrix}a_1 & c_1 \cr a_2 & c_2\end{vmatrix}}{\begin{vmatrix}a_1 & b_1 \cr a_2 & b_2\end{vmatrix}} = - \frac{a_1 c_2 - a_2 c_1}{a_1 b_2 - a_2 b_1}.
$$

Якщо знаменник дорівнює $0$, тобто

$$
\begin{vmatrix}a_1 & b_1 \cr a_2 & b_2\end{vmatrix} = a_1 b_2 - a_2 b_1 = 0
$$

то або система не має розв'язків (прямі паралельні й різні), або розв'язків нескінченно багато (прямі збігаються).
Якщо нам треба розрізнити ці два випадки, ми маємо перевірити, чи коефіцієнти $c$ пропорційні з тим самим відношенням, що й коефіцієнти $a$ і $b$.
Для цього достатньо обчислити такі визначники, і якщо вони обидва дорівнюють $0$, то прямі збігаються:

$$
\begin{vmatrix}a_1 & c_1 \cr a_2 & c_2\end{vmatrix}, \begin{vmatrix}b_1 & c_1 \cr b_2 & c_2\end{vmatrix}
$$

Зауважимо, що інший підхід до обчислення точки перетину пояснюється у статті [Основи геометрії](basic-geometry.md).

## Реалізація \{#implementation}

<CodeTabs>

```cpp
struct pt {
    double x, y;
};

struct line {
    double a, b, c;
};

const double EPS = 1e-9;

double det(double a, double b, double c, double d) {
    return a*d - b*c;
}

bool intersect(line m, line n, pt & res) {
    double zn = det(m.a, m.b, n.a, n.b);
    if (abs(zn) < EPS)
        return false;
    res.x = -det(m.c, m.b, n.c, n.b) / zn;
    res.y = -det(m.a, m.c, n.a, n.c) / zn;
    return true;
}

bool parallel(line m, line n) {
    return abs(det(m.a, m.b, n.a, n.b)) < EPS;
}

bool equivalent(line m, line n) {
    return abs(det(m.a, m.b, n.a, n.b)) < EPS
        && abs(det(m.a, m.c, n.a, n.c)) < EPS
        && abs(det(m.b, m.c, n.b, n.c)) < EPS;
}
```

```python
from dataclasses import dataclass

EPS = 1e-9


@dataclass
class Pt:
    x: float
    y: float


@dataclass
class Line:
    a: float
    b: float
    c: float


def det(a: float, b: float, c: float, d: float) -> float:
    return a * d - b * c


def intersect(m: Line, n: Line) -> Pt | None:
    # Знаменник — визначник системи; якщо він нульовий, прямі паралельні
    zn = det(m.a, m.b, n.a, n.b)
    if abs(zn) < EPS:
        return None
    # За правилом Крамера повертаємо точку перетину
    x = -det(m.c, m.b, n.c, n.b) / zn
    y = -det(m.a, m.c, n.a, n.c) / zn
    return Pt(x, y)


def parallel(m: Line, n: Line) -> bool:
    return abs(det(m.a, m.b, n.a, n.b)) < EPS


def equivalent(m: Line, n: Line) -> bool:
    return (abs(det(m.a, m.b, n.a, n.b)) < EPS
            and abs(det(m.a, m.c, n.a, n.c)) < EPS
            and abs(det(m.b, m.c, n.b, n.c)) < EPS)
```

```typescript
const EPS = 1e-9;

interface Pt {
    x: number;
    y: number;
}

interface Line {
    a: number;
    b: number;
    c: number;
}

function det(a: number, b: number, c: number, d: number): number {
    return a * d - b * c;
}

// Повертає точку перетину або null, якщо прямі паралельні
function intersect(m: Line, n: Line): Pt | null {
    const zn = det(m.a, m.b, n.a, n.b);
    if (Math.abs(zn) < EPS) return null;
    // Правило Крамера
    const x = -det(m.c, m.b, n.c, n.b) / zn;
    const y = -det(m.a, m.c, n.a, n.c) / zn;
    return { x, y };
}

function parallel(m: Line, n: Line): boolean {
    return Math.abs(det(m.a, m.b, n.a, n.b)) < EPS;
}

function equivalent(m: Line, n: Line): boolean {
    return Math.abs(det(m.a, m.b, n.a, n.b)) < EPS
        && Math.abs(det(m.a, m.c, n.a, n.c)) < EPS
        && Math.abs(det(m.b, m.c, n.b, n.c)) < EPS;
}
```

```go
package main

import "math"

const EPS = 1e-9

type Pt struct {
    X, Y float64
}

type Line struct {
    A, B, C float64
}

func det(a, b, c, d float64) float64 {
    return a*d - b*c
}

// intersect повертає точку перетину та true; якщо прямі паралельні — false
func intersect(m, n Line) (Pt, bool) {
    // Знаменник — визначник системи
    zn := det(m.A, m.B, n.A, n.B)
    if math.Abs(zn) < EPS {
        return Pt{}, false
    }
    // Правило Крамера
    x := -det(m.C, m.B, n.C, n.B) / zn
    y := -det(m.A, m.C, n.A, n.C) / zn
    return Pt{x, y}, true
}

func parallel(m, n Line) bool {
    return math.Abs(det(m.A, m.B, n.A, n.B)) < EPS
}

func equivalent(m, n Line) bool {
    return math.Abs(det(m.A, m.B, n.A, n.B)) < EPS &&
        math.Abs(det(m.A, m.C, n.A, n.C)) < EPS &&
        math.Abs(det(m.B, m.C, n.B, n.C)) < EPS
}
```

</CodeTabs>
