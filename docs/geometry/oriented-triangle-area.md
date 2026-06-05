# Орієнтована площа трикутника

Маючи три точки $p_1$, $p_2$ і $p_3$, обчислимо орієнтовану (зі знаком) площу трикутника, утвореного ними. Знак площі визначається так: уявімо, що ми стоїмо в площині в точці $p_1$ і дивимося в напрямку $p_2$. Ми йдемо до $p_2$, і якщо $p_3$ опиняється праворуч від нас (тоді кажемо, що три вектори повертають «за годинниковою стрілкою»), то знак площі від'ємний, інакше — додатний. Якщо три точки лежать на одній прямій, площа дорівнює нулю.

Використовуючи цю площу зі знаком, ми можемо отримати як звичайну площу без знака (як абсолютне значення площі зі знаком), так і визначити, чи лежать точки за годинниковою стрілкою, чи проти годинникової стрілки в заданому порядку (що корисно, наприклад, в алгоритмах побудови опуклої оболонки).


## Обчислення \{#calculation}
Ми можемо скористатися тим фактом, що визначник матриці $2\times 2$ дорівнює площі зі знаком паралелограма, натягнутого на вектори-стовпці (або вектори-рядки) цієї матриці.
Це аналогічно означенню векторного добутку в 2D (див. [Базова геометрія](basic-geometry.md)).
Поділивши цю площу на два, ми отримаємо площу трикутника, яка нас цікавить.
Ми використаємо $\vec{p_1p_2}$ і $\vec{p_2p_3}$ як вектори-стовпці й обчислимо визначник $2\times 2$:

$$
2S=\left|\begin{matrix}x_2-x_1 & x_3-x_2\\y_2-y_1 & y_3-y_2\end{matrix}\right|=(x_2-x_1)(y_3-y_2)-(x_3-x_2)(y_2-y_1)
$$

## Реалізація \{#implementation}

<CodeTabs>

```cpp
int signed_area_parallelogram(point2d p1, point2d p2, point2d p3) {
    return cross(p2 - p1, p3 - p2);
}

double triangle_area(point2d p1, point2d p2, point2d p3) {
    return abs(signed_area_parallelogram(p1, p2, p3)) / 2.0;
}

bool clockwise(point2d p1, point2d p2, point2d p3) {
    return signed_area_parallelogram(p1, p2, p3) < 0;
}

bool counter_clockwise(point2d p1, point2d p2, point2d p3) {
    return signed_area_parallelogram(p1, p2, p3) > 0;
}
```

```python
Point2D = tuple[int, int]


def signed_area_parallelogram(p1: Point2D, p2: Point2D, p3: Point2D) -> int:
    # Векторний добуток векторів p1p2 і p2p3 у 2D
    ax, ay = p2[0] - p1[0], p2[1] - p1[1]
    bx, by = p3[0] - p2[0], p3[1] - p2[1]
    return ax * by - ay * bx


def triangle_area(p1: Point2D, p2: Point2D, p3: Point2D) -> float:
    return abs(signed_area_parallelogram(p1, p2, p3)) / 2.0


def clockwise(p1: Point2D, p2: Point2D, p3: Point2D) -> bool:
    return signed_area_parallelogram(p1, p2, p3) < 0


def counter_clockwise(p1: Point2D, p2: Point2D, p3: Point2D) -> bool:
    return signed_area_parallelogram(p1, p2, p3) > 0
```

```typescript
type Point2D = { x: number; y: number };

function signedAreaParallelogram(p1: Point2D, p2: Point2D, p3: Point2D): number {
    // Векторний добуток векторів p1p2 і p2p3 у 2D
    const ax = p2.x - p1.x, ay = p2.y - p1.y;
    const bx = p3.x - p2.x, by = p3.y - p2.y;
    return ax * by - ay * bx;
}

function triangleArea(p1: Point2D, p2: Point2D, p3: Point2D): number {
    return Math.abs(signedAreaParallelogram(p1, p2, p3)) / 2.0;
}

function clockwise(p1: Point2D, p2: Point2D, p3: Point2D): boolean {
    return signedAreaParallelogram(p1, p2, p3) < 0;
}

function counterClockwise(p1: Point2D, p2: Point2D, p3: Point2D): boolean {
    return signedAreaParallelogram(p1, p2, p3) > 0;
}
```

```go
type Point2D struct {
    X, Y int
}

func signedAreaParallelogram(p1, p2, p3 Point2D) int {
    // Векторний добуток векторів p1p2 і p2p3 у 2D
    ax, ay := p2.X-p1.X, p2.Y-p1.Y
    bx, by := p3.X-p2.X, p3.Y-p2.Y
    return ax*by - ay*bx
}

func triangleArea(p1, p2, p3 Point2D) float64 {
    a := signedAreaParallelogram(p1, p2, p3)
    if a < 0 {
        a = -a
    }
    return float64(a) / 2.0
}

func clockwise(p1, p2, p3 Point2D) bool {
    return signedAreaParallelogram(p1, p2, p3) < 0
}

func counterClockwise(p1, p2, p3 Point2D) bool {
    return signedAreaParallelogram(p1, p2, p3) > 0
}
```

</CodeTabs>

## Задачі для практики \{#practice-problems}
* [Codechef - Chef and Polygons](https://www.codechef.com/problems/CHEFPOLY)

## Відеоматеріали \{#video}

<YouTubeEmbed id="eu6i7WJeinw" title="Cross products | Essence of linear algebra — 3Blue1Brown" />
