# Знаходження перетину двох відрізків

Нам задано два відрізки AB і CD, описані парами своїх кінців. Кожен відрізок може бути окремою точкою, якщо його кінці збігаються.
Потрібно знайти перетин цих відрізків, який може бути порожнім (якщо відрізки не перетинаються), окремою точкою або відрізком (якщо задані відрізки перекриваються).

## Розв'язок \{#solution}

Знайти точку перетину відрізків ми можемо так само, як і [перетин прямих](lines-intersection.md):
відновити рівняння прямих за кінцями відрізків і перевірити, чи вони паралельні.

Якщо прямі не паралельні, нам потрібно знайти їхню точку перетину й перевірити, чи належить вона обом відрізкам
(для цього достатньо перевірити, що точка перетину належить кожному відрізку, спроєктованому на осі X та Y).
У цьому випадку відповіддю буде або «немає перетину», або єдина точка перетину прямих.

Випадок паралельних прямих дещо складніший (сюди ж належить і випадок, коли один або кілька відрізків є окремою точкою).
У цьому випадку нам потрібно перевірити, що обидва відрізки належать одній прямій.
Якщо ні, відповідь — «немає перетину».
Якщо так, то відповіддю є перетин відрізків, що лежать на одній прямій, який отримуємо,
впорядкувавши кінці обох відрізків за зростанням певної координати і взявши найправіший із лівих кінців та найлівіший із правих кінців.

Якщо обидва відрізки є окремими точками, ці точки мають бути однаковими, і цю перевірку має сенс виконати окремо.

На початку алгоритму додамо перевірку обмежувального прямокутника (bounding box) — вона необхідна для випадку, коли відрізки належать одній прямій,
і (будучи легкою перевіркою) дозволяє алгоритму працювати в середньому швидше на випадкових тестах.


## Реалізація \{#implementation}

Ось реалізація, що включає всі допоміжні функції для обробки прямих і відрізків.

Головна функція `intersect` повертає true, якщо відрізки мають непорожній перетин,
і зберігає кінці відрізка перетину в аргументах `left` та `right`.
Якщо відповіддю є окрема точка, значення, записані в `left` та `right`, будуть однаковими.

<CodeTabs>

```cpp
const double EPS = 1E-9;

struct pt {
    double x, y;

    bool operator<(const pt& p) const
    {
        return x < p.x - EPS || (abs(x - p.x) < EPS && y < p.y - EPS);
    }
};

struct line {
    double a, b, c;

    line() {}
    line(pt p, pt q)
    {
        a = p.y - q.y;
        b = q.x - p.x;
        c = -a * p.x - b * p.y;
        norm();
    }

    void norm()
    {
        double z = sqrt(a * a + b * b);
        if (abs(z) > EPS)
            a /= z, b /= z, c /= z;
    }

    double dist(pt p) const { return a * p.x + b * p.y + c; }
};

double det(double a, double b, double c, double d)
{
    return a * d - b * c;
}

inline bool betw(double l, double r, double x)
{
    return min(l, r) <= x + EPS && x <= max(l, r) + EPS;
}

inline bool intersect_1d(double a, double b, double c, double d)
{
    if (a > b)
        swap(a, b);
    if (c > d)
        swap(c, d);
    return max(a, c) <= min(b, d) + EPS;
}

bool intersect(pt a, pt b, pt c, pt d, pt& left, pt& right)
{
    if (!intersect_1d(a.x, b.x, c.x, d.x) || !intersect_1d(a.y, b.y, c.y, d.y))
        return false;
    line m(a, b);
    line n(c, d);
    double zn = det(m.a, m.b, n.a, n.b);
    if (abs(zn) < EPS) {
        if (abs(m.dist(c)) > EPS || abs(n.dist(a)) > EPS)
            return false;
        if (b < a)
            swap(a, b);
        if (d < c)
            swap(c, d);
        left = max(a, c);
        right = min(b, d);
        return true;
    } else {
        left.x = right.x = -det(m.c, m.b, n.c, n.b) / zn;
        left.y = right.y = -det(m.a, m.c, n.a, n.c) / zn;
        return betw(a.x, b.x, left.x) && betw(a.y, b.y, left.y) &&
               betw(c.x, d.x, left.x) && betw(c.y, d.y, left.y);
    }
}
```

```python
EPS = 1e-9


class Pt:
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y

    # лексикографічне порівняння з допуском EPS
    def __lt__(self, p: "Pt") -> bool:
        return self.x < p.x - EPS or (abs(self.x - p.x) < EPS and self.y < p.y - EPS)


class Line:
    def __init__(self, p: Pt = None, q: Pt = None):
        if p is None:
            self.a = self.b = self.c = 0.0
            return
        self.a = p.y - q.y
        self.b = q.x - p.x
        self.c = -self.a * p.x - self.b * p.y
        self.norm()

    def norm(self) -> None:
        z = (self.a * self.a + self.b * self.b) ** 0.5
        if abs(z) > EPS:
            self.a /= z
            self.b /= z
            self.c /= z

    def dist(self, p: Pt) -> float:
        return self.a * p.x + self.b * p.y + self.c


def det(a: float, b: float, c: float, d: float) -> float:
    return a * d - b * c


def betw(l: float, r: float, x: float) -> bool:
    return min(l, r) <= x + EPS and x <= max(l, r) + EPS


def intersect_1d(a: float, b: float, c: float, d: float) -> bool:
    if a > b:
        a, b = b, a
    if c > d:
        c, d = d, c
    return max(a, c) <= min(b, d) + EPS


# повертає (False, None, None), якщо перетину немає,
# інакше (True, left, right) — кінці відрізка перетину
def intersect(a: Pt, b: Pt, c: Pt, d: Pt):
    if not intersect_1d(a.x, b.x, c.x, d.x) or not intersect_1d(a.y, b.y, c.y, d.y):
        return False, None, None
    m = Line(a, b)
    n = Line(c, d)
    zn = det(m.a, m.b, n.a, n.b)
    if abs(zn) < EPS:
        if abs(m.dist(c)) > EPS or abs(n.dist(a)) > EPS:
            return False, None, None
        if b < a:
            a, b = b, a
        if d < c:
            c, d = d, c
        left = max(a, c)   # використовує Pt.__lt__
        right = min(b, d)
        return True, left, right
    else:
        x = -det(m.c, m.b, n.c, n.b) / zn
        y = -det(m.a, m.c, n.a, n.c) / zn
        left = Pt(x, y)
        right = Pt(x, y)
        ok = (betw(a.x, b.x, x) and betw(a.y, b.y, y) and
              betw(c.x, d.x, x) and betw(c.y, d.y, y))
        return (True, left, right) if ok else (False, None, None)
```

```typescript
const EPS = 1e-9;

class Pt {
    constructor(public x: number, public y: number) {}

    // лексикографічне порівняння з допуском EPS
    less(p: Pt): boolean {
        return this.x < p.x - EPS || (Math.abs(this.x - p.x) < EPS && this.y < p.y - EPS);
    }
}

class Line {
    a = 0;
    b = 0;
    c = 0;

    constructor(p?: Pt, q?: Pt) {
        if (p === undefined || q === undefined) return;
        this.a = p.y - q.y;
        this.b = q.x - p.x;
        this.c = -this.a * p.x - this.b * p.y;
        this.norm();
    }

    norm(): void {
        const z = Math.sqrt(this.a * this.a + this.b * this.b);
        if (Math.abs(z) > EPS) {
            this.a /= z;
            this.b /= z;
            this.c /= z;
        }
    }

    dist(p: Pt): number {
        return this.a * p.x + this.b * p.y + this.c;
    }
}

function det(a: number, b: number, c: number, d: number): number {
    return a * d - b * c;
}

function betw(l: number, r: number, x: number): boolean {
    return Math.min(l, r) <= x + EPS && x <= Math.max(l, r) + EPS;
}

function intersect1d(a: number, b: number, c: number, d: number): boolean {
    if (a > b) [a, b] = [b, a];
    if (c > d) [c, d] = [d, c];
    return Math.max(a, c) <= Math.min(b, d) + EPS;
}

// повертає null, якщо перетину немає,
// інакше [left, right] — кінці відрізка перетину
function intersect(a: Pt, b: Pt, c: Pt, d: Pt): [Pt, Pt] | null {
    if (!intersect1d(a.x, b.x, c.x, d.x) || !intersect1d(a.y, b.y, c.y, d.y))
        return null;
    const m = new Line(a, b);
    const n = new Line(c, d);
    const zn = det(m.a, m.b, n.a, n.b);
    if (Math.abs(zn) < EPS) {
        if (Math.abs(m.dist(c)) > EPS || Math.abs(n.dist(a)) > EPS)
            return null;
        if (b.less(a)) [a, b] = [b, a];
        if (d.less(c)) [c, d] = [d, c];
        // найправіший із лівих кінців і найлівіший із правих кінців
        const left = a.less(c) ? c : a;
        const right = b.less(d) ? b : d;
        return [left, right];
    } else {
        const x = -det(m.c, m.b, n.c, n.b) / zn;
        const y = -det(m.a, m.c, n.a, n.c) / zn;
        const p = new Pt(x, y);
        const ok = betw(a.x, b.x, x) && betw(a.y, b.y, y) &&
                   betw(c.x, d.x, x) && betw(c.y, d.y, y);
        return ok ? [p, p] : null;
    }
}
```

```go
const EPS = 1e-9

type Pt struct {
    x, y float64
}

// лексикографічне порівняння з допуском EPS
func (p Pt) Less(q Pt) bool {
    return p.x < q.x-EPS || (math.Abs(p.x-q.x) < EPS && p.y < q.y-EPS)
}

type Line struct {
    a, b, c float64
}

func newLine(p, q Pt) Line {
    l := Line{a: p.y - q.y, b: q.x - p.x}
    l.c = -l.a*p.x - l.b*p.y
    l.norm()
    return l
}

func (l *Line) norm() {
    z := math.Sqrt(l.a*l.a + l.b*l.b)
    if math.Abs(z) > EPS {
        l.a /= z
        l.b /= z
        l.c /= z
    }
}

func (l Line) dist(p Pt) float64 {
    return l.a*p.x + l.b*p.y + l.c
}

func det(a, b, c, d float64) float64 {
    return a*d - b*c
}

func betw(l, r, x float64) bool {
    return math.Min(l, r) <= x+EPS && x <= math.Max(l, r)+EPS
}

func intersect1d(a, b, c, d float64) bool {
    if a > b {
        a, b = b, a
    }
    if c > d {
        c, d = d, c
    }
    return math.Max(a, c) <= math.Min(b, d)+EPS
}

func maxPt(a, b Pt) Pt {
    if a.Less(b) {
        return b
    }
    return a
}

func minPt(a, b Pt) Pt {
    if a.Less(b) {
        return a
    }
    return b
}

// повертає (false, _, _), якщо перетину немає,
// інакше (true, left, right) — кінці відрізка перетину
func intersect(a, b, c, d Pt) (bool, Pt, Pt) {
    if !intersect1d(a.x, b.x, c.x, d.x) || !intersect1d(a.y, b.y, c.y, d.y) {
        return false, Pt{}, Pt{}
    }
    m := newLine(a, b)
    n := newLine(c, d)
    zn := det(m.a, m.b, n.a, n.b)
    if math.Abs(zn) < EPS {
        if math.Abs(m.dist(c)) > EPS || math.Abs(n.dist(a)) > EPS {
            return false, Pt{}, Pt{}
        }
        if b.Less(a) {
            a, b = b, a
        }
        if d.Less(c) {
            c, d = d, c
        }
        return true, maxPt(a, c), minPt(b, d)
    }
    x := -det(m.c, m.b, n.c, n.b) / zn
    y := -det(m.a, m.c, n.a, n.c) / zn
    p := Pt{x, y}
    ok := betw(a.x, b.x, x) && betw(a.y, b.y, y) &&
        betw(c.x, d.x, x) && betw(c.y, d.y, y)
    if ok {
        return true, p, p
    }
    return false, Pt{}, Pt{}
}
```

</CodeTabs>

## Відеоматеріали \{#video}

- [Check if two line segments intersect — Techdose](https://www.youtube.com/watch?v=bbTqI0oqL5U) (12 хв, англійською)
