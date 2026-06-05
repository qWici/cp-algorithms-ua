# Перевірка належності точки опуклому многокутнику за $O(\log N)$

Розглянемо таку задачу: задано опуклий многокутник із цілочисловими вершинами та багато запитів.
Кожен запит — це точка, для якої треба визначити, лежить вона всередині многокутника, на його межі чи ні.
Припустимо, що вершини многокутника впорядковані проти годинникової стрілки. Ми відповідатимемо на кожен запит за $O(\log n)$ онлайн.

:::tip[Коли підходить цей алгоритм?]
- Многокутник, у якому ви перевіряєте належність, є **опуклим**? *(якщо він довільний/неопуклий → потрібен загальний тест belonging, напр. через перетин променя; цей $O(\log n)$-метод незастосовний)*
- Запитів багато, тож варто один раз підготувати дані й відповідати на кожен запит за $O(\log n)$, а не лінійним обходом?
- Вершини задано в порядку обходу проти годинникової стрілки (або їх можна так упорядкувати) для побудови бінарного пошуку за полярним кутом?
:::

## Алгоритм \{#algorithm}
Виберемо точку з найменшою x-координатою. Якщо таких декілька, виберемо ту, що має найменшу y-координату. Позначимо її як $p_0$.
Тоді всі інші точки $p_1,\dots,p_n$ многокутника впорядковані за полярним кутом відносно вибраної точки (бо вершини многокутника впорядковані проти годинникової стрілки).

Якщо точка належить многокутнику, то вона належить деякому трикутнику $p_0, p_i, p_{i + 1}$ (можливо, більш ніж одному, якщо вона лежить на межі трикутників).
Розглянемо трикутник $p_0, p_i, p_{i + 1}$ такий, що $p$ належить цьому трикутнику і $i$ є максимальним серед усіх таких трикутників.

Є один особливий випадок. $p$ лежить на відрізку $(p_0, p_n)$. Цей випадок ми перевіримо окремо.
Інакше всі точки $p_j$ з $j \le i$ лежать проти годинникової стрілки від $p$ відносно $p_0$, а всі інші точки — ні.
Це означає, що ми можемо застосувати бінарний пошук для точки $p_i$ такої, що $p_i$ не лежить проти годинникової стрілки від $p$ відносно $p_0$, а $i$ є максимальним серед усіх таких точок.
А потім ми перевіряємо, чи точка справді лежить у визначеному трикутнику.

Знак виразу $(a - c) \times (b - c)$ підкаже нам, чи лежить точка $a$ за годинниковою стрілкою, чи проти годинникової стрілки від точки $b$ відносно точки $c$.
Якщо $(a - c) \times (b - c) > 0$, то точка $a$ лежить праворуч від вектора, що йде з $c$ до $b$, тобто за годинниковою стрілкою від $b$ відносно $c$.
А якщо $(a - c) \times (b - c) < 0$, то точка лежить ліворуч, тобто проти годинникової стрілки.
А якщо рівне нулю — то вона лежить точно на прямій між точками $b$ і $c$.

Повернімося до алгоритму.
Розглянемо точку запиту $p$.
Спочатку ми маємо перевірити, чи лежить точка між $p_1$ і $p_n$.
Інакше ми вже знаємо, що вона не може належати многокутнику.
Це можна зробити, перевіривши, чи векторний добуток $(p_1 - p_0)\times(p - p_0)$ дорівнює нулю або має той самий знак, що й $(p_1 - p_0)\times(p_n - p_0)$, і чи $(p_n - p_0)\times(p - p_0)$ дорівнює нулю або має той самий знак, що й $(p_n - p_0)\times(p_1 - p_0)$.
Потім ми обробляємо особливий випадок, коли $p$ лежить на прямій $(p_0, p_1)$.
А далі ми можемо бінарним пошуком знайти останню точку з $p_1,\dots p_n$, яка не лежить проти годинникової стрілки від $p$ відносно $p_0$.
Для окремої точки $p_i$ цю умову можна перевірити, переконавшись, що $(p_i - p_0)\times(p - p_0) \le 0$. Після того, як ми знайшли таку точку $p_i$, треба перевірити, чи лежить $p$ всередині трикутника $p_0, p_i, p_{i + 1}$.
Щоб перевірити, чи належить вона трикутнику, ми можемо просто переконатися, що $|(p_i - p_0)\times(p_{i + 1} - p_0)| = |(p_0 - p)\times(p_i - p)| + |(p_i - p)\times(p_{i + 1} - p)| + |(p_{i + 1} - p)\times(p_0 - p)|$.
Це перевіряє, чи площа трикутника $p_0, p_i, p_{i+1}$ має точно той самий розмір, що й сума площ трикутника $p_0, p_i, p$, трикутника $p_0, p, p_{i+1}$ та трикутника $p_i, p_{i+1}, p$.
Якщо $p$ лежить зовні, то сума цих трьох трикутників буде більшою за площу трикутника.
Якщо ж вона лежить усередині, то буде рівною.

## Реалізація \{#implementation}

Функція `prepare` гарантує, що лексикографічно найменша точка (найменше значення x, а при рівності — найменше значення y) буде $p_0$, та обчислює вектори $p_i - p_0$.
Після цього функція `pointInConvexPolygon` обчислює результат запиту.
Ми додатково запам'ятовуємо точку $p_0$ і зсуваємо на неї всі точки запитів, щоб обчислювати правильну відстань, адже вектори не мають початкової точки.
Зсуваючи точки запитів, ми можемо вважати, що всі вектори починаються в початку координат $(0, 0)$, і спростити обчислення відстаней та довжин.

<CodeTabs>

```cpp
struct pt {
    long long x, y;
    pt() {}
    pt(long long _x, long long _y) : x(_x), y(_y) {}
    pt operator+(const pt &p) const { return pt(x + p.x, y + p.y); }
    pt operator-(const pt &p) const { return pt(x - p.x, y - p.y); }
    long long cross(const pt &p) const { return x * p.y - y * p.x; }
    long long dot(const pt &p) const { return x * p.x + y * p.y; }
    long long cross(const pt &a, const pt &b) const { return (a - *this).cross(b - *this); }
    long long dot(const pt &a, const pt &b) const { return (a - *this).dot(b - *this); }
    long long sqrLen() const { return this->dot(*this); }
};

bool lexComp(const pt &l, const pt &r) {
    return l.x < r.x || (l.x == r.x && l.y < r.y);
}

int sgn(long long val) { return val > 0 ? 1 : (val == 0 ? 0 : -1); }

vector<pt> seq;
pt translation;
int n;

bool pointInTriangle(pt a, pt b, pt c, pt point) {
    long long s1 = abs(a.cross(b, c));
    long long s2 = abs(point.cross(a, b)) + abs(point.cross(b, c)) + abs(point.cross(c, a));
    return s1 == s2;
}

void prepare(vector<pt> &points) {
    n = points.size();
    int pos = 0;
    for (int i = 1; i < n; i++) {
        if (lexComp(points[i], points[pos]))
            pos = i;
    }
    rotate(points.begin(), points.begin() + pos, points.end());

    n--;
    seq.resize(n);
    for (int i = 0; i < n; i++)
        seq[i] = points[i + 1] - points[0];
    translation = points[0];
}

bool pointInConvexPolygon(pt point) {
    point = point - translation;
    if (seq[0].cross(point) != 0 &&
            sgn(seq[0].cross(point)) != sgn(seq[0].cross(seq[n - 1])))
        return false;
    if (seq[n - 1].cross(point) != 0 &&
            sgn(seq[n - 1].cross(point)) != sgn(seq[n - 1].cross(seq[0])))
        return false;

    if (seq[0].cross(point) == 0)
        return seq[0].sqrLen() >= point.sqrLen();

    int l = 0, r = n - 1;
    while (r - l > 1) {
        int mid = (l + r) / 2;
        int pos = mid;
        if (seq[pos].cross(point) >= 0)
            l = mid;
        else
            r = mid;
    }
    int pos = l;
    return pointInTriangle(seq[pos], seq[pos + 1], pt(0, 0), point);
}
```

```python
class Pt:
    __slots__ = ("x", "y")

    def __init__(self, x: int = 0, y: int = 0):
        self.x = x
        self.y = y

    def __add__(self, p: "Pt") -> "Pt":
        return Pt(self.x + p.x, self.y + p.y)

    def __sub__(self, p: "Pt") -> "Pt":
        return Pt(self.x - p.x, self.y - p.y)

    def cross(self, p: "Pt") -> int:
        return self.x * p.y - self.y * p.x

    def dot(self, p: "Pt") -> int:
        return self.x * p.x + self.y * p.y

    # Векторний/скалярний добуток векторів self->a і self->b
    def cross2(self, a: "Pt", b: "Pt") -> int:
        return (a - self).cross(b - self)

    def dot2(self, a: "Pt", b: "Pt") -> int:
        return (a - self).dot(b - self)

    def sqr_len(self) -> int:
        return self.dot(self)


def lex_comp(l: Pt, r: Pt) -> bool:
    return l.x < r.x or (l.x == r.x and l.y < r.y)


def sgn(val: int) -> int:
    return 1 if val > 0 else (0 if val == 0 else -1)


seq: list[Pt] = []
translation = Pt()
n = 0


def point_in_triangle(a: Pt, b: Pt, c: Pt, point: Pt) -> bool:
    s1 = abs(a.cross2(b, c))
    s2 = abs(point.cross2(a, b)) + abs(point.cross2(b, c)) + abs(point.cross2(c, a))
    return s1 == s2


def prepare(points: list[Pt]) -> None:
    global seq, translation, n
    n = len(points)
    pos = 0
    for i in range(1, n):
        if lex_comp(points[i], points[pos]):
            pos = i
    # Циклічно зсуваємо так, щоб лексикографічно найменша точка стала першою
    points[:] = points[pos:] + points[:pos]

    n -= 1
    seq = [points[i + 1] - points[0] for i in range(n)]
    translation = points[0]


def point_in_convex_polygon(point: Pt) -> bool:
    point = point - translation
    if seq[0].cross(point) != 0 and \
            sgn(seq[0].cross(point)) != sgn(seq[0].cross(seq[n - 1])):
        return False
    if seq[n - 1].cross(point) != 0 and \
            sgn(seq[n - 1].cross(point)) != sgn(seq[n - 1].cross(seq[0])):
        return False

    if seq[0].cross(point) == 0:
        return seq[0].sqr_len() >= point.sqr_len()

    l, r = 0, n - 1
    while r - l > 1:
        mid = (l + r) // 2
        pos = mid
        if seq[pos].cross(point) >= 0:
            l = mid
        else:
            r = mid
    pos = l
    return point_in_triangle(seq[pos], seq[pos + 1], Pt(0, 0), point)
```

```typescript
class Pt {
    constructor(public x: number = 0, public y: number = 0) {}

    add(p: Pt): Pt {
        return new Pt(this.x + p.x, this.y + p.y);
    }

    sub(p: Pt): Pt {
        return new Pt(this.x - p.x, this.y - p.y);
    }

    cross(p: Pt): number {
        return this.x * p.y - this.y * p.x;
    }

    dot(p: Pt): number {
        return this.x * p.x + this.y * p.y;
    }

    // Векторний/скалярний добуток векторів this->a і this->b
    cross2(a: Pt, b: Pt): number {
        return a.sub(this).cross(b.sub(this));
    }

    dot2(a: Pt, b: Pt): number {
        return a.sub(this).dot(b.sub(this));
    }

    sqrLen(): number {
        return this.dot(this);
    }
}

function lexComp(l: Pt, r: Pt): boolean {
    return l.x < r.x || (l.x === r.x && l.y < r.y);
}

function sgn(val: number): number {
    return val > 0 ? 1 : val === 0 ? 0 : -1;
}

let seq: Pt[] = [];
let translation = new Pt();
let n = 0;

function pointInTriangle(a: Pt, b: Pt, c: Pt, point: Pt): boolean {
    const s1 = Math.abs(a.cross2(b, c));
    const s2 = Math.abs(point.cross2(a, b)) + Math.abs(point.cross2(b, c)) + Math.abs(point.cross2(c, a));
    return s1 === s2;
}

function prepare(points: Pt[]): void {
    n = points.length;
    let pos = 0;
    for (let i = 1; i < n; i++) {
        if (lexComp(points[i], points[pos])) pos = i;
    }
    // Циклічно зсуваємо так, щоб лексикографічно найменша точка стала першою
    const rotated = points.slice(pos).concat(points.slice(0, pos));
    for (let i = 0; i < n; i++) points[i] = rotated[i];

    n--;
    seq = new Array(n);
    for (let i = 0; i < n; i++) seq[i] = points[i + 1].sub(points[0]);
    translation = points[0];
}

function pointInConvexPolygon(point: Pt): boolean {
    point = point.sub(translation);
    if (seq[0].cross(point) !== 0 &&
            sgn(seq[0].cross(point)) !== sgn(seq[0].cross(seq[n - 1])))
        return false;
    if (seq[n - 1].cross(point) !== 0 &&
            sgn(seq[n - 1].cross(point)) !== sgn(seq[n - 1].cross(seq[0])))
        return false;

    if (seq[0].cross(point) === 0)
        return seq[0].sqrLen() >= point.sqrLen();

    let l = 0, r = n - 1;
    while (r - l > 1) {
        const mid = Math.floor((l + r) / 2);
        const pos = mid;
        if (seq[pos].cross(point) >= 0) l = mid;
        else r = mid;
    }
    const pos = l;
    return pointInTriangle(seq[pos], seq[pos + 1], new Pt(0, 0), point);
}
```

```go
type Pt struct {
    X, Y int64
}

func (a Pt) Add(p Pt) Pt { return Pt{a.X + p.X, a.Y + p.Y} }
func (a Pt) Sub(p Pt) Pt { return Pt{a.X - p.X, a.Y - p.Y} }
func (a Pt) Cross(p Pt) int64 { return a.X*p.Y - a.Y*p.X }
func (a Pt) Dot(p Pt) int64   { return a.X*p.X + a.Y*p.Y }

// Векторний/скалярний добуток векторів a->b і a->c
func (a Pt) Cross2(b, c Pt) int64 { return b.Sub(a).Cross(c.Sub(a)) }
func (a Pt) Dot2(b, c Pt) int64   { return b.Sub(a).Dot(c.Sub(a)) }
func (a Pt) SqrLen() int64        { return a.Dot(a) }

func lexComp(l, r Pt) bool {
    return l.X < r.X || (l.X == r.X && l.Y < r.Y)
}

func sgn(val int64) int {
    if val > 0 {
        return 1
    }
    if val == 0 {
        return 0
    }
    return -1
}

func absI(v int64) int64 {
    if v < 0 {
        return -v
    }
    return v
}

var seq []Pt
var translation Pt
var n int

func pointInTriangle(a, b, c, point Pt) bool {
    s1 := absI(a.Cross2(b, c))
    s2 := absI(point.Cross2(a, b)) + absI(point.Cross2(b, c)) + absI(point.Cross2(c, a))
    return s1 == s2
}

func prepare(points []Pt) {
    n = len(points)
    pos := 0
    for i := 1; i < n; i++ {
        if lexComp(points[i], points[pos]) {
            pos = i
        }
    }
    // Циклічно зсуваємо так, щоб лексикографічно найменша точка стала першою
    rotated := append(append([]Pt{}, points[pos:]...), points[:pos]...)
    copy(points, rotated)

    n--
    seq = make([]Pt, n)
    for i := 0; i < n; i++ {
        seq[i] = points[i+1].Sub(points[0])
    }
    translation = points[0]
}

func pointInConvexPolygon(point Pt) bool {
    point = point.Sub(translation)
    if seq[0].Cross(point) != 0 &&
        sgn(seq[0].Cross(point)) != sgn(seq[0].Cross(seq[n-1])) {
        return false
    }
    if seq[n-1].Cross(point) != 0 &&
        sgn(seq[n-1].Cross(point)) != sgn(seq[n-1].Cross(seq[0])) {
        return false
    }

    if seq[0].Cross(point) == 0 {
        return seq[0].SqrLen() >= point.SqrLen()
    }

    l, r := 0, n-1
    for r-l > 1 {
        mid := (l + r) / 2
        pos := mid
        if seq[pos].Cross(point) >= 0 {
            l = mid
        } else {
            r = mid
        }
    }
    pos := l
    return pointInTriangle(seq[pos], seq[pos+1], Pt{0, 0}, point)
}
```

</CodeTabs>

## Задачі \{#problems}
* [SGU253 Theodore Roosevelt](https://codeforces.com/problemsets/acmsguru/problem/99999/253)
* [Codeforces 55E Very simple problem](https://codeforces.com/contest/55/problem/E)
* [Codeforces 166B Polygons](https://codeforces.com/problemset/problem/166/B)
