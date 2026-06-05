# Побудова опуклої оболонки

У цій статті ми розглянемо задачу побудови опуклої оболонки за заданою множиною точок.

Нехай на площині задано $N$ точок, і наша мета — побудувати опуклу оболонку, тобто найменший
опуклий многокутник, що містить усі задані точки.

Ми розглянемо алгоритм **обходу Грема** (Graham's scan), опублікований 1972 року Гремом, а
також алгоритм **монотонного ланцюга** (Monotone chain), опублікований 1979 року Ендрю. Обидва
мають складність $\mathcal{O}(N \log N)$ і є асимптотично оптимальними (адже доведено, що
не існує асимптотично кращого алгоритму), за винятком кількох задач, де йдеться про
паралельну або онлайн-обробку.

## Алгоритм обходу Грема \{#grahams-scan-algorithm}
Спершу алгоритм знаходить найнижчу точку $P_0$. Якщо є кілька точок
з однаковою координатою Y, береться та, що має меншу координату X. Цей
крок виконується за $\mathcal{O}(N)$.

Далі всі інші точки сортуються за полярним кутом за годинниковою стрілкою.
Якщо полярний кут між двома або більше точками однаковий, нічию розв'язуємо за відстанню від $P_0$ у порядку зростання.

Потім ми по черзі проходимо кожну точку й переконуємося, що поточна
точка та дві перед нею утворюють поворот за годинниковою стрілкою, інакше попередню
точку відкидаємо, бо вона утворила б неопуклу фігуру. Перевірити, чи поворот за годинниковою стрілкою, чи проти,
можна за допомогою [орієнтації](oriented-triangle-area.md).

Ми використовуємо стек для зберігання точок, і щойно ми повертаємося до початкової точки $P_0$,
алгоритм завершено, і ми повертаємо стек, що містить усі точки
опуклої оболонки в порядку за годинниковою стрілкою.

Якщо під час обходу Грема потрібно врахувати колінеарні точки, знадобиться
ще один крок після сортування. Потрібно взяти точки, що мають найбільшу
полярну відстань від $P_0$ (вони мають бути в кінці відсортованого вектора) і є колінеарними.
Точки на цій прямій слід розвернути, щоб ми могли вивести всі
колінеарні точки, інакше алгоритм узяв би найближчу точку на цій
прямій і зупинився б. Цей крок не слід включати в неколінеарну версію
алгоритму, інакше ми не отримаємо найменшу опуклу оболонку.

### Реалізація \{#implementation}

<CodeTabs>

```cpp
struct pt {
    double x, y;
    bool operator == (pt const& t) const {
        return x == t.x && y == t.y;
    }
};

int orientation(pt a, pt b, pt c) {
    double v = a.x*(b.y-c.y)+b.x*(c.y-a.y)+c.x*(a.y-b.y);
    if (v < 0) return -1; // за годинниковою стрілкою
    if (v > 0) return +1; // проти годинникової стрілки
    return 0;
}

bool cw(pt a, pt b, pt c, bool include_collinear) {
    int o = orientation(a, b, c);
    return o < 0 || (include_collinear && o == 0);
}
bool collinear(pt a, pt b, pt c) { return orientation(a, b, c) == 0; }

void convex_hull(vector<pt>& a, bool include_collinear = false) {
    pt p0 = *min_element(a.begin(), a.end(), [](pt a, pt b) {
        return make_pair(a.y, a.x) < make_pair(b.y, b.x);
    });
    sort(a.begin(), a.end(), [&p0](const pt& a, const pt& b) {
        int o = orientation(p0, a, b);
        if (o == 0)
            return (p0.x-a.x)*(p0.x-a.x) + (p0.y-a.y)*(p0.y-a.y)
                < (p0.x-b.x)*(p0.x-b.x) + (p0.y-b.y)*(p0.y-b.y);
        return o < 0;
    });
    if (include_collinear) {
        int i = (int)a.size()-1;
        while (i >= 0 && collinear(p0, a[i], a.back())) i--;
        reverse(a.begin()+i+1, a.end());
    }

    vector<pt> st;
    for (int i = 0; i < (int)a.size(); i++) {
        while (st.size() > 1 && !cw(st[st.size()-2], st.back(), a[i], include_collinear))
            st.pop_back();
        st.push_back(a[i]);
    }

    if (include_collinear == false && st.size() == 2 && st[0] == st[1])
        st.pop_back();

    a = st;
}
```

```python
from functools import cmp_to_key


class pt:
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y

    def __eq__(self, t) -> bool:
        return self.x == t.x and self.y == t.y


def orientation(a: pt, b: pt, c: pt) -> int:
    v = a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y)
    if v < 0:
        return -1  # за годинниковою стрілкою
    if v > 0:
        return +1  # проти годинникової стрілки
    return 0


def cw(a: pt, b: pt, c: pt, include_collinear: bool) -> bool:
    o = orientation(a, b, c)
    return o < 0 or (include_collinear and o == 0)


def collinear(a: pt, b: pt, c: pt) -> bool:
    return orientation(a, b, c) == 0


def convex_hull(a: list[pt], include_collinear: bool = False) -> None:
    p0 = min(a, key=lambda p: (p.y, p.x))

    # сортуємо за полярним кутом навколо p0; нічию розв'язуємо за відстанню
    def cmp(u: pt, v: pt) -> int:
        o = orientation(p0, u, v)
        if o == 0:
            du = (p0.x - u.x) ** 2 + (p0.y - u.y) ** 2
            dv = (p0.x - v.x) ** 2 + (p0.y - v.y) ** 2
            return -1 if du < dv else (1 if du > dv else 0)
        return -1 if o < 0 else 1

    a.sort(key=cmp_to_key(cmp))
    if include_collinear:
        i = len(a) - 1
        while i >= 0 and collinear(p0, a[i], a[-1]):
            i -= 1
        a[i + 1:] = a[i + 1:][::-1]

    st: list[pt] = []
    for i in range(len(a)):
        while len(st) > 1 and not cw(st[-2], st[-1], a[i], include_collinear):
            st.pop()
        st.append(a[i])

    if include_collinear is False and len(st) == 2 and st[0] == st[1]:
        st.pop()

    a[:] = st
```

```typescript
class pt {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  equals(t: pt): boolean {
    return this.x === t.x && this.y === t.y;
  }
}

function orientation(a: pt, b: pt, c: pt): number {
  const v = a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y);
  if (v < 0) return -1; // за годинниковою стрілкою
  if (v > 0) return +1; // проти годинникової стрілки
  return 0;
}

function cw(a: pt, b: pt, c: pt, includeCollinear: boolean): boolean {
  const o = orientation(a, b, c);
  return o < 0 || (includeCollinear && o === 0);
}

function collinear(a: pt, b: pt, c: pt): boolean {
  return orientation(a, b, c) === 0;
}

function convexHull(a: pt[], includeCollinear: boolean = false): void {
  let p0 = a[0];
  for (const p of a)
    if (p.y < p0.y || (p.y === p0.y && p.x < p0.x)) p0 = p;

  // сортуємо за полярним кутом навколо p0; нічию розв'язуємо за відстанню
  a.sort((u, v) => {
    const o = orientation(p0, u, v);
    if (o === 0) {
      const du = (p0.x - u.x) ** 2 + (p0.y - u.y) ** 2;
      const dv = (p0.x - v.x) ** 2 + (p0.y - v.y) ** 2;
      return du < dv ? -1 : du > dv ? 1 : 0;
    }
    return o < 0 ? -1 : 1;
  });

  if (includeCollinear) {
    let i = a.length - 1;
    while (i >= 0 && collinear(p0, a[i], a[a.length - 1])) i--;
    // розвертаємо хвіст колінеарних точок
    const tail = a.slice(i + 1).reverse();
    for (let j = 0; j < tail.length; j++) a[i + 1 + j] = tail[j];
  }

  const st: pt[] = [];
  for (let i = 0; i < a.length; i++) {
    while (st.length > 1 && !cw(st[st.length - 2], st[st.length - 1], a[i], includeCollinear))
      st.pop();
    st.push(a[i]);
  }

  if (includeCollinear === false && st.length === 2 && st[0].equals(st[1]))
    st.pop();

  a.length = 0;
  a.push(...st);
}
```

```go
type pt struct {
    x, y float64
}

func equal(a, t pt) bool {
    return a.x == t.x && a.y == t.y
}

func orientation(a, b, c pt) int {
    v := a.x*(b.y-c.y) + b.x*(c.y-a.y) + c.x*(a.y-b.y)
    if v < 0 {
        return -1 // за годинниковою стрілкою
    }
    if v > 0 {
        return +1 // проти годинникової стрілки
    }
    return 0
}

func cw(a, b, c pt, includeCollinear bool) bool {
    o := orientation(a, b, c)
    return o < 0 || (includeCollinear && o == 0)
}

func collinear(a, b, c pt) bool {
    return orientation(a, b, c) == 0
}

func convexHull(a *[]pt, includeCollinear bool) {
    pts := *a
    p0 := pts[0]
    for _, p := range pts {
        if p.y < p0.y || (p.y == p0.y && p.x < p0.x) {
            p0 = p
        }
    }
    // сортуємо за полярним кутом навколо p0; нічию розв'язуємо за відстанню
    sort.Slice(pts, func(i, j int) bool {
        o := orientation(p0, pts[i], pts[j])
        if o == 0 {
            di := (p0.x-pts[i].x)*(p0.x-pts[i].x) + (p0.y-pts[i].y)*(p0.y-pts[i].y)
            dj := (p0.x-pts[j].x)*(p0.x-pts[j].x) + (p0.y-pts[j].y)*(p0.y-pts[j].y)
            return di < dj
        }
        return o < 0
    })
    if includeCollinear {
        i := len(pts) - 1
        for i >= 0 && collinear(p0, pts[i], pts[len(pts)-1]) {
            i--
        }
        // розвертаємо хвіст колінеарних точок
        for l, r := i+1, len(pts)-1; l < r; l, r = l+1, r-1 {
            pts[l], pts[r] = pts[r], pts[l]
        }
    }

    st := []pt{}
    for i := 0; i < len(pts); i++ {
        for len(st) > 1 && !cw(st[len(st)-2], st[len(st)-1], pts[i], includeCollinear) {
            st = st[:len(st)-1]
        }
        st = append(st, pts[i])
    }

    if includeCollinear == false && len(st) == 2 && equal(st[0], st[1]) {
        st = st[:len(st)-1]
    }

    *a = st
}
```

</CodeTabs>

## Алгоритм монотонного ланцюга \{#monotone-chain-algorithm}
Спершу алгоритм знаходить найлівішу та найправішу точки A і B. Якщо таких точок кілька,
найнижчу серед лівих (з найменшою координатою Y) беремо за A, а найвищу серед правих (з найбільшою координатою Y)
беремо за B. Очевидно, що і A, і B мають належати опуклій оболонці, оскільки вони найдальші й не можуть бути всередині
жодної прямої, утвореної парою серед заданих точок.

Тепер проведемо пряму через AB. Вона ділить усі інші точки на дві множини, S1 і S2, де S1 містить усі точки
над прямою, що сполучає A і B, а S2 містить усі точки під прямою, що з'єднує A і B. Точки, що лежать на
прямій, яка з'єднує A і B, можуть належати будь-якій із множин. Точки A і B належать обом множинам. Тепер алгоритм
будує верхню множину S1 і нижню множину S2, а потім об'єднує їх, щоб отримати відповідь.

Щоб отримати верхню множину, ми сортуємо всі точки за координатою x. Для кожної точки перевіряємо, чи виконується одне з двох — чи поточна точка є останньою
(яку ми визначили як B), чи орієнтація між прямою від A до поточної точки та прямою від поточної точки до B є за годинниковою стрілкою. У цих випадках
поточна точка належить верхній множині S1. Перевірити, чи поворот за годинниковою стрілкою, чи проти, можна за допомогою [орієнтації](oriented-triangle-area.md).

Якщо задана точка належить верхній множині, ми перевіряємо кут, утворений прямою, що сполучає передостанню точку та останню точку у верхній опуклій оболонці,
з прямою, що сполучає останню точку у верхній опуклій оболонці й поточну точку. Якщо кут не за годинниковою стрілкою, ми видаляємо найновішу додану
точку у верхній опуклій оболонці, оскільки поточна точка зможе охопити попередню точку, щойно її буде додано до опуклої
оболонки.

Та сама логіка застосовується до нижньої множини S2. Якщо виконується одне з двох — поточна точка є B, або орієнтація прямих, утворених A і
поточною точкою та поточною точкою і B, є проти годинникової стрілки — тоді вона належить S2.

Якщо задана точка належить нижній множині, ми діємо так само, як і для точки з верхньої множини, тільки перевіряємо орієнтацію проти годинникової
стрілки замість орієнтації за годинниковою стрілкою. Отже, якщо кут, утворений прямою, що сполучає передостанню точку та останню точку в нижній опуклій оболонці,
з прямою, що сполучає останню точку в нижній опуклій оболонці й поточну точку, не є проти годинникової стрілки, ми видаляємо найновішу додану точку в нижній опуклій оболонці, оскільки поточна точка зможе охопити
попередню точку, щойно її буде додано до оболонки.

Остаточна опукла оболонка отримується з об'єднання верхньої та нижньої опуклих оболонок, утворюючи оболонку за годинниковою стрілкою, а реалізація така.

Якщо вам потрібні колінеарні точки, достатньо перевіряти їх у процедурах cw/ccw.
Однак це допускає вироджений випадок, коли всі вхідні точки колінеарні на одній прямій, і алгоритм видав би повторювані точки.
Щоб це розв'язати, ми перевіряємо, чи верхня оболонка містить усі точки, і якщо так, ми просто повертаємо точки у зворотному порядку, бо саме це
повернула б реалізація Грема в цьому випадку.

### Реалізація \{#implementation-1}

<CodeTabs>

```cpp
struct pt {
    double x, y;
};

int orientation(pt a, pt b, pt c) {
    double v = a.x*(b.y-c.y)+b.x*(c.y-a.y)+c.x*(a.y-b.y);
    if (v < 0) return -1; // за годинниковою стрілкою
    if (v > 0) return +1; // проти годинникової стрілки
    return 0;
}

bool cw(pt a, pt b, pt c, bool include_collinear) {
    int o = orientation(a, b, c);
    return o < 0 || (include_collinear && o == 0);
}
bool ccw(pt a, pt b, pt c, bool include_collinear) {
    int o = orientation(a, b, c);
    return o > 0 || (include_collinear && o == 0);
}

void convex_hull(vector<pt>& a, bool include_collinear = false) {
    if (a.size() == 1)
        return;

    sort(a.begin(), a.end(), [](pt a, pt b) {
        return make_pair(a.x, a.y) < make_pair(b.x, b.y);
    });
    pt p1 = a[0], p2 = a.back();
    vector<pt> up, down;
    up.push_back(p1);
    down.push_back(p1);
    for (int i = 1; i < (int)a.size(); i++) {
        if (i == a.size() - 1 || cw(p1, a[i], p2, include_collinear)) {
            while (up.size() >= 2 && !cw(up[up.size()-2], up[up.size()-1], a[i], include_collinear))
                up.pop_back();
            up.push_back(a[i]);
        }
        if (i == a.size() - 1 || ccw(p1, a[i], p2, include_collinear)) {
            while (down.size() >= 2 && !ccw(down[down.size()-2], down[down.size()-1], a[i], include_collinear))
                down.pop_back();
            down.push_back(a[i]);
        }
    }

    if (include_collinear && up.size() == a.size()) {
        reverse(a.begin(), a.end());
        return;
    }
    a.clear();
    for (int i = 0; i < (int)up.size(); i++)
        a.push_back(up[i]);
    for (int i = down.size() - 2; i > 0; i--)
        a.push_back(down[i]);
}
```

```python
class pt:
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y


def orientation(a: pt, b: pt, c: pt) -> int:
    v = a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y)
    if v < 0:
        return -1  # за годинниковою стрілкою
    if v > 0:
        return +1  # проти годинникової стрілки
    return 0


def cw(a: pt, b: pt, c: pt, include_collinear: bool) -> bool:
    o = orientation(a, b, c)
    return o < 0 or (include_collinear and o == 0)


def ccw(a: pt, b: pt, c: pt, include_collinear: bool) -> bool:
    o = orientation(a, b, c)
    return o > 0 or (include_collinear and o == 0)


def convex_hull(a: list[pt], include_collinear: bool = False) -> None:
    if len(a) == 1:
        return

    a.sort(key=lambda p: (p.x, p.y))
    p1, p2 = a[0], a[-1]
    up: list[pt] = []
    down: list[pt] = []
    up.append(p1)
    down.append(p1)
    for i in range(1, len(a)):
        if i == len(a) - 1 or cw(p1, a[i], p2, include_collinear):
            while len(up) >= 2 and not cw(up[-2], up[-1], a[i], include_collinear):
                up.pop()
            up.append(a[i])
        if i == len(a) - 1 or ccw(p1, a[i], p2, include_collinear):
            while len(down) >= 2 and not ccw(down[-2], down[-1], a[i], include_collinear):
                down.pop()
            down.append(a[i])

    if include_collinear and len(up) == len(a):
        a.reverse()
        return
    a.clear()
    for i in range(len(up)):
        a.append(up[i])
    for i in range(len(down) - 2, 0, -1):
        a.append(down[i])
```

```typescript
class pt {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

function orientation(a: pt, b: pt, c: pt): number {
  const v = a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y);
  if (v < 0) return -1; // за годинниковою стрілкою
  if (v > 0) return +1; // проти годинникової стрілки
  return 0;
}

function cw(a: pt, b: pt, c: pt, includeCollinear: boolean): boolean {
  const o = orientation(a, b, c);
  return o < 0 || (includeCollinear && o === 0);
}

function ccw(a: pt, b: pt, c: pt, includeCollinear: boolean): boolean {
  const o = orientation(a, b, c);
  return o > 0 || (includeCollinear && o === 0);
}

function convexHull(a: pt[], includeCollinear: boolean = false): void {
  if (a.length === 1) return;

  a.sort((u, v) => (u.x !== v.x ? u.x - v.x : u.y - v.y));
  const p1 = a[0];
  const p2 = a[a.length - 1];
  const up: pt[] = [];
  const down: pt[] = [];
  up.push(p1);
  down.push(p1);
  for (let i = 1; i < a.length; i++) {
    if (i === a.length - 1 || cw(p1, a[i], p2, includeCollinear)) {
      while (up.length >= 2 && !cw(up[up.length - 2], up[up.length - 1], a[i], includeCollinear))
        up.pop();
      up.push(a[i]);
    }
    if (i === a.length - 1 || ccw(p1, a[i], p2, includeCollinear)) {
      while (down.length >= 2 && !ccw(down[down.length - 2], down[down.length - 1], a[i], includeCollinear))
        down.pop();
      down.push(a[i]);
    }
  }

  if (includeCollinear && up.length === a.length) {
    a.reverse();
    return;
  }
  a.length = 0;
  for (let i = 0; i < up.length; i++) a.push(up[i]);
  for (let i = down.length - 2; i > 0; i--) a.push(down[i]);
}
```

```go
type pt struct {
    x, y float64
}

func orientation(a, b, c pt) int {
    v := a.x*(b.y-c.y) + b.x*(c.y-a.y) + c.x*(a.y-b.y)
    if v < 0 {
        return -1 // за годинниковою стрілкою
    }
    if v > 0 {
        return +1 // проти годинникової стрілки
    }
    return 0
}

func cw(a, b, c pt, includeCollinear bool) bool {
    o := orientation(a, b, c)
    return o < 0 || (includeCollinear && o == 0)
}

func ccw(a, b, c pt, includeCollinear bool) bool {
    o := orientation(a, b, c)
    return o > 0 || (includeCollinear && o == 0)
}

func convexHull(a *[]pt, includeCollinear bool) {
    pts := *a
    if len(pts) == 1 {
        return
    }

    sort.Slice(pts, func(i, j int) bool {
        if pts[i].x != pts[j].x {
            return pts[i].x < pts[j].x
        }
        return pts[i].y < pts[j].y
    })
    p1, p2 := pts[0], pts[len(pts)-1]
    up := []pt{}
    down := []pt{}
    up = append(up, p1)
    down = append(down, p1)
    for i := 1; i < len(pts); i++ {
        if i == len(pts)-1 || cw(p1, pts[i], p2, includeCollinear) {
            for len(up) >= 2 && !cw(up[len(up)-2], up[len(up)-1], pts[i], includeCollinear) {
                up = up[:len(up)-1]
            }
            up = append(up, pts[i])
        }
        if i == len(pts)-1 || ccw(p1, pts[i], p2, includeCollinear) {
            for len(down) >= 2 && !ccw(down[len(down)-2], down[len(down)-1], pts[i], includeCollinear) {
                down = down[:len(down)-1]
            }
            down = append(down, pts[i])
        }
    }

    if includeCollinear && len(up) == len(pts) {
        for l, r := 0, len(pts)-1; l < r; l, r = l+1, r-1 {
            pts[l], pts[r] = pts[r], pts[l]
        }
        return
    }
    res := []pt{}
    for i := 0; i < len(up); i++ {
        res = append(res, up[i])
    }
    for i := len(down) - 2; i > 0; i-- {
        res = append(res, down[i])
    }
    *a = res
}
```

</CodeTabs>

## Задачі для практики \{#practice-problems}

* [Kattis - Convex Hull](https://open.kattis.com/problems/convexhull)
* [Kattis - Keep the Parade Safe](https://open.kattis.com/problems/parade)
* [Codeforces - I. Birthday](https://codeforces.com/contest/2172/problem/I)
* [Latin American Regionals 2006 - Onion Layers](https://matcomgrader.com/problem/9413/onion-layers/)
* [Timus 1185: Wall](http://acm.timus.ru/problem.aspx?space=1&num=1185)
* [Usaco 2014 January Contest, Gold - Cow Curling](http://usaco.org/index.php?page=viewproblem2&cpid=382)

## Відеоматеріали \{#video}

- [Convex Hull Algorithm - Graham Scan and Jarvis March tutorial — Stable Sort](https://www.youtube.com/watch?v=B2AJoQSZf4M) (7 хв, англійською)
