# Пошук граней планарного графа

Розглянемо граф $G$ з $n$ вершинами та $m$ ребрами, який можна намалювати на площині так, щоб два ребра перетиналися лише у спільній вершині (якщо вона існує).
Такі графи називають **планарними**. Тепер припустимо, що нам дано планарний граф разом з його прямолінійним вкладенням, тобто для кожної вершини $v$ ми маємо відповідну точку $(x, y)$, і всі ребра намальовані як відрізки прямих між цими точками без перетинів (таке вкладення завжди існує). Ці відрізки розбивають площину на кілька областей, які називають гранями. Рівно одна з граней є необмеженою. Цю грань називають **зовнішньою**, а інші грані — **внутрішніми**.

У цій статті ми будемо займатися пошуком як внутрішніх, так і зовнішньої граней планарного графа. Ми вважатимемо, що граф є зв'язним.

## Деякі факти про планарні графи \{#some-facts-about-planar-graphs}

У цьому розділі ми наводимо кілька фактів про планарні графи без доведення. Читачам, які цікавляться доведеннями, варто звернутися до [Graph Theory by R. Diestel](https://www.math.uni-hamburg.de/home/diestel/books/graph.theory/preview/Ch4.pdf) (див. також [відеолекції про планарність](https://www.youtube.com/@DiestelGraphTheory) на основі цієї книги) чи до якоїсь іншої книги.

### Теорема Ейлера \{#eulers-theorem}
Теорема Ейлера стверджує, що будь-яке коректне вкладення зв'язного планарного графа з $n$ вершинами, $m$ ребрами та $f$ гранями задовольняє рівність:

$$
n - m + f = 2
$$

А в загальнішому випадку кожен планарний граф з $k$ компонентами зв'язності задовольняє:

$$
n - m + f = 1 + k
$$

### Кількість ребер планарного графа. \{#number-of-edges-of-a-planar-graph}
Якщо $n \ge 3$, то максимальна кількість ребер планарного графа з $n$ вершинами дорівнює $3n - 6$. Це число досягається для будь-якого зв'язного планарного графа, у якому кожна грань обмежена трикутником. У термінах складності цей факт означає, що $m = O(n)$ для будь-якого планарного графа.

### Кількість граней планарного графа. \{#number-of-faces-of-a-planar-graph}
Як прямий наслідок наведеного вище факту, якщо $n \ge 3$, то максимальна кількість граней планарного графа з $n$ вершинами дорівнює $2n - 4$.

### Мінімальний степінь вершини в планарному графі. \{#minimum-vertex-degree-in-a-planar-graph}
Кожен планарний граф має вершину степеня 5 або менше.

## Алгоритм \{#the-algorithm}

Спершу відсортуємо суміжні ребра для кожної вершини за полярним кутом.
Тепер обходитимемо граф у такий спосіб. Припустимо, що ми зайшли у вершину $u$ через ребро $(v, u)$, і $(u, w)$ — це наступне ребро після $(v, u)$ у відсортованому списку суміжності вершини $u$. Тоді наступною вершиною буде $w$. Виявляється, що якщо ми почнемо цей обхід з деякого ребра $(v, u)$, то обійдемо рівно одну з граней, суміжних з $(v, u)$, причому конкретна грань залежить від того, чи перший наш крок іде з $u$ до $v$, чи з $v$ до $u$.

Тепер алгоритм цілком очевидний. Ми маємо перебрати всі ребра графа і запустити обхід для кожного ребра, яке не було відвідане жодним з попередніх обходів. У такий спосіб ми знайдемо кожну грань рівно один раз, і кожне ребро буде пройдено двічі (по разу в кожному напрямку).

### Пошук наступного ребра \{#finding-the-next-edge}
Під час обходу нам потрібно знаходити наступне ребро в порядку проти годинникової стрілки. Найочевидніший спосіб знайти наступне ребро — бінарний пошук за кутом. Однак, маючи порядок суміжних ребер проти годинникової стрілки для кожної вершини, ми можемо заздалегідь обчислити наступні ребра і зберегти їх у хеш-таблиці. Якщо ребра вже відсортовані за кутом, то складність пошуку всіх граней у цьому разі стає лінійною.

### Пошук зовнішньої грані \{#finding-the-outer-face}
Неважко бачити, що алгоритм обходить кожну внутрішню грань за годинниковою стрілкою, а зовнішню — проти годинникової стрілки, тож зовнішню грань можна знайти, перевіривши порядок обходу кожної грані.

### Складність \{#complexity}
Цілком зрозуміло, що складність алгоритму становить $O(m \log m)$ через сортування, а оскільки $m = O(n)$, то насправді вона дорівнює $O(n \log n)$. Як було сказано раніше, без сортування складність стає $O(n)$.

## Що, якщо граф не є зв'язним? \{#what-if-the-graph-isnt-connected}

На перший погляд може здатися, що пошук граней незв'язного графа не набагато складніший, адже ми можемо запустити той самий алгоритм для кожної компоненти зв'язності. Однак компоненти можуть бути намальовані вкладено одна в одну, утворюючи **дірки** (див. зображення нижче). У цьому разі внутрішня грань однієї компоненти стає зовнішньою гранню для деяких інших компонент і має складну незв'язну межу. Працювати з такими випадками доволі важко; один з можливих підходів — виявляти вкладені компоненти за допомогою алгоритмів [локалізації точки](point-location.md).

<center> <img src="/img/docs/geometry/planar_hole.png" alt="Planar graph with holes" /> </center>

## Реалізація \{#implementation}
Наведена нижче реалізація повертає вектор вершин для кожної грані, причому зовнішня грань іде першою.
Внутрішні грані повертаються в порядку проти годинникової стрілки, а зовнішня грань — за годинниковою стрілкою.

Для простоти ми знаходимо наступне ребро бінарним пошуком за кутом.

<CodeTabs>

```cpp
struct Point {
    int64_t x, y;

    Point(int64_t x_, int64_t y_): x(x_), y(y_) {}

    Point operator - (const Point & p) const {
        return Point(x - p.x, y - p.y);
    }

    int64_t cross (const Point & p) const {
        return x * p.y - y * p.x;
    }

    int64_t cross (const Point & p, const Point & q) const {
        return (p - *this).cross(q - *this);
    }

    int half () const {
        return int(y < 0 || (y == 0 && x < 0));
    }
};

std::vector<std::vector<size_t>> find_faces(std::vector<Point> vertices, std::vector<std::vector<size_t>> adj) {
    size_t n = vertices.size();
    std::vector<std::vector<char>> used(n);
    for (size_t i = 0; i < n; i++) {
        used[i].resize(adj[i].size());
        used[i].assign(adj[i].size(), 0);
        auto compare = [&](size_t l, size_t r) {
            Point pl = vertices[l] - vertices[i];
            Point pr = vertices[r] - vertices[i];
            if (pl.half() != pr.half())
                return pl.half() < pr.half();
            return pl.cross(pr) > 0;
        };
        std::sort(adj[i].begin(), adj[i].end(), compare);
    }
    std::vector<std::vector<size_t>> faces;
    for (size_t i = 0; i < n; i++) {
        for (size_t edge_id = 0; edge_id < adj[i].size(); edge_id++) {
            if (used[i][edge_id]) {
                continue;
            }
            std::vector<size_t> face;
            size_t v = i;
            size_t e = edge_id;
            while (!used[v][e]) {
                used[v][e] = true;
                face.push_back(v);
                size_t u = adj[v][e];
                size_t e1 = std::lower_bound(adj[u].begin(), adj[u].end(), v, [&](size_t l, size_t r) {
                    Point pl = vertices[l] - vertices[u];
                    Point pr = vertices[r] - vertices[u];
                    if (pl.half() != pr.half())
                        return pl.half() < pr.half();
                    return pl.cross(pr) > 0;
                }) - adj[u].begin() + 1;
                if (e1 == adj[u].size()) {
                    e1 = 0;
                }
                v = u;
                e = e1;
            }
            std::reverse(face.begin(), face.end());
            Point p1 = vertices[face[0]];
            __int128 sum = 0;
            for (int j = 0; j < face.size(); ++j) {
                Point p2 = vertices[face[j]];
                Point p3 = vertices[face[(j + 1) % face.size()]];
                sum += (p2 - p1).cross(p3 - p2);
            }
            if (sum <= 0) {
                faces.insert(faces.begin(), face);
            } else {
                faces.emplace_back(face);
            }
        }
    }
    return faces;
}
```

```python
import functools


class Point:
    def __init__(self, x: int, y: int):
        self.x = x
        self.y = y

    def __sub__(self, p: "Point") -> "Point":
        return Point(self.x - p.x, self.y - p.y)

    def cross(self, p: "Point") -> int:
        return self.x * p.y - self.y * p.x

    # векторний добуток (p - self) x (q - self)
    def cross2(self, p: "Point", q: "Point") -> int:
        return (p - self).cross(q - self)

    def half(self) -> int:
        return int(self.y < 0 or (self.y == 0 and self.x < 0))


def find_faces(vertices: list[Point], adj: list[list[int]]) -> list[list[int]]:
    n = len(vertices)
    used = [[False] * len(adj[i]) for i in range(n)]
    for i in range(n):
        # Сортуємо суміжні ребра за полярним кутом навколо вершини i:
        # спершу за півплощиною, далі за знаком векторного добутку.
        def compare(l: int, r: int, i: int = i) -> int:
            pl = vertices[l] - vertices[i]
            pr = vertices[r] - vertices[i]
            if pl.half() != pr.half():
                return -1 if pl.half() < pr.half() else 1
            c = pl.cross(pr)
            return -1 if c > 0 else (1 if c < 0 else 0)

        adj[i].sort(key=functools.cmp_to_key(compare))

    faces: list[list[int]] = []
    for i in range(n):
        for edge_id in range(len(adj[i])):
            if used[i][edge_id]:
                continue
            face: list[int] = []
            v, e = i, edge_id
            while not used[v][e]:
                used[v][e] = True
                face.append(v)
                u = adj[v][e]
                au = adj[u]
                # lower_bound за тим самим кутовим порядком навколо u:
                # знаходимо позицію ребра (u, v) і беремо наступне за ним.
                lo, hi = 0, len(au)
                while lo < hi:
                    mid = (lo + hi) // 2
                    pl = vertices[au[mid]] - vertices[u]
                    pr = vertices[v] - vertices[u]
                    if pl.half() != pr.half():
                        less = pl.half() < pr.half()
                    else:
                        less = pl.cross(pr) > 0
                    if less:
                        lo = mid + 1
                    else:
                        hi = mid
                e1 = lo + 1
                if e1 == len(au):
                    e1 = 0
                v, e = u, e1
            face.reverse()
            p1 = vertices[face[0]]
            # Python має необмежені цілі, тож переповнення (на відміну від
            # C++) тут не загрожує — додаткового __int128 не потрібно.
            total = 0
            m = len(face)
            for j in range(m):
                p2 = vertices[face[j]]
                p3 = vertices[face[(j + 1) % m]]
                total += (p2 - p1).cross(p3 - p2)
            if total <= 0:
                faces.insert(0, face)
            else:
                faces.append(face)
    return faces
```

```typescript
class Point {
  constructor(public x: number, public y: number) {}

  sub(p: Point): Point {
    return new Point(this.x - p.x, this.y - p.y);
  }

  cross(p: Point): number {
    return this.x * p.y - this.y * p.x;
  }

  // векторний добуток (p - this) x (q - this)
  cross2(p: Point, q: Point): number {
    return p.sub(this).cross(q.sub(this));
  }

  half(): number {
    return this.y < 0 || (this.y === 0 && this.x < 0) ? 1 : 0;
  }
}

function findFaces(vertices: Point[], adj: number[][]): number[][] {
  const n = vertices.length;
  const used: boolean[][] = vertices.map((_, i) => new Array(adj[i].length).fill(false));
  for (let i = 0; i < n; i++) {
    // Сортуємо суміжні ребра за полярним кутом навколо вершини i:
    // спершу за півплощиною, далі за знаком векторного добутку.
    adj[i].sort((l, r) => {
      const pl = vertices[l].sub(vertices[i]);
      const pr = vertices[r].sub(vertices[i]);
      if (pl.half() !== pr.half()) return pl.half() - pr.half();
      const c = pl.cross(pr);
      return c > 0 ? -1 : c < 0 ? 1 : 0;
    });
  }

  const faces: number[][] = [];
  for (let i = 0; i < n; i++) {
    for (let edgeId = 0; edgeId < adj[i].length; edgeId++) {
      if (used[i][edgeId]) continue;
      const face: number[] = [];
      let v = i;
      let e = edgeId;
      while (!used[v][e]) {
        used[v][e] = true;
        face.push(v);
        const u = adj[v][e];
        const au = adj[u];
        // lower_bound за тим самим кутовим порядком навколо u:
        // знаходимо позицію ребра (u, v) і беремо наступне за ним.
        let lo = 0;
        let hi = au.length;
        while (lo < hi) {
          const mid = (lo + hi) >> 1;
          const pl = vertices[au[mid]].sub(vertices[u]);
          const pr = vertices[v].sub(vertices[u]);
          const less = pl.half() !== pr.half() ? pl.half() < pr.half() : pl.cross(pr) > 0;
          if (less) lo = mid + 1;
          else hi = mid;
        }
        let e1 = lo + 1;
        if (e1 === au.length) e1 = 0;
        v = u;
        e = e1;
      }
      face.reverse();
      const p1 = vertices[face[0]];
      // BigInt — аналог __int128 з оригіналу: захищає від переповнення
      // при сумуванні подвоєних орієнтованих площ.
      let sum = 0n;
      const m = face.length;
      for (let j = 0; j < m; j++) {
        const a = vertices[face[j]].sub(p1);
        const b = vertices[face[(j + 1) % m]].sub(vertices[face[j]]);
        sum += BigInt(a.x) * BigInt(b.y) - BigInt(a.y) * BigInt(b.x);
      }
      if (sum <= 0n) faces.unshift(face);
      else faces.push(face);
    }
  }
  return faces;
}
```

```go
package main

import (
	"math/big"
	"sort"
)

type Point struct {
	X, Y int64
}

func (a Point) Sub(p Point) Point {
	return Point{a.X - p.X, a.Y - p.Y}
}

func (a Point) Cross(p Point) int64 {
	return a.X*p.Y - a.Y*p.X
}

// векторний добуток (p - a) x (q - a)
func (a Point) Cross2(p, q Point) int64 {
	return p.Sub(a).Cross(q.Sub(a))
}

func (a Point) Half() int {
	if a.Y < 0 || (a.Y == 0 && a.X < 0) {
		return 1
	}
	return 0
}

func findFaces(vertices []Point, adj [][]int) [][]int {
	n := len(vertices)
	used := make([][]bool, n)
	for i := 0; i < n; i++ {
		used[i] = make([]bool, len(adj[i]))
		// Сортуємо суміжні ребра за полярним кутом навколо вершини i:
		// спершу за півплощиною, далі за знаком векторного добутку.
		i := i
		sort.SliceStable(adj[i], func(a, b int) bool {
			pl := vertices[adj[i][a]].Sub(vertices[i])
			pr := vertices[adj[i][b]].Sub(vertices[i])
			if pl.Half() != pr.Half() {
				return pl.Half() < pr.Half()
			}
			return pl.Cross(pr) > 0
		})
	}

	faces := [][]int{}
	for i := 0; i < n; i++ {
		for edgeID := 0; edgeID < len(adj[i]); edgeID++ {
			if used[i][edgeID] {
				continue
			}
			face := []int{}
			v, e := i, edgeID
			for !used[v][e] {
				used[v][e] = true
				face = append(face, v)
				u := adj[v][e]
				au := adj[u]
				// lower_bound за тим самим кутовим порядком навколо u:
				// знаходимо позицію ребра (u, v) і беремо наступне за ним.
				lo, hi := 0, len(au)
				for lo < hi {
					mid := (lo + hi) / 2
					pl := vertices[au[mid]].Sub(vertices[u])
					pr := vertices[v].Sub(vertices[u])
					var less bool
					if pl.Half() != pr.Half() {
						less = pl.Half() < pr.Half()
					} else {
						less = pl.Cross(pr) > 0
					}
					if less {
						lo = mid + 1
					} else {
						hi = mid
					}
				}
				e1 := lo + 1
				if e1 == len(au) {
					e1 = 0
				}
				v, e = u, e1
			}
			for l, r := 0, len(face)-1; l < r; l, r = l+1, r-1 {
				face[l], face[r] = face[r], face[l]
			}
			p1 := vertices[face[0]]
			// big.Int — прямий аналог __int128 з оригіналу: уникаємо
			// переповнення при сумуванні подвоєних орієнтованих площ.
			sum := new(big.Int)
			m := len(face)
			for j := 0; j < m; j++ {
				p2 := vertices[face[j]]
				p3 := vertices[face[(j+1)%m]]
				sum.Add(sum, big.NewInt(p2.Sub(p1).Cross(p3.Sub(p2))))
			}
			if sum.Sign() <= 0 {
				faces = append([][]int{face}, faces...)
			} else {
				faces = append(faces, face)
			}
		}
	}
	return faces
}
```

</CodeTabs>

## Побудова планарного графа з відрізків \{#building-planar-graph-from-line-segments}

Іноді граф задають не явно, а як набір відрізків на площині, причому сам граф утворюється за рахунок перетинів цих відрізків, як показано на зображенні нижче. У цьому разі граф доводиться будувати вручну. Найпростіший спосіб зробити це такий. Зафіксуємо відрізок і перетнемо його з усіма іншими відрізками. Потім відсортуємо всі точки перетину разом з двома кінцями відрізка лексикографічно і додамо їх до графа як вершини. Також з'єднаємо ребром кожні дві сусідні вершини в лексикографічному порядку. Виконавши цю процедуру для всіх ребер, ми отримаємо граф. Звісно, ми маємо подбати про те, щоб двом однаковим точкам перетину завжди відповідала одна й та сама вершина. Найпростіше зробити це, зберігаючи точки у відображенні (map) за їхніми координатами, вважаючи рівними точки, координати яких відрізняються на мале число (скажімо, менше за $10^{-9}$). Цей алгоритм працює за $O(n^2 \log n)$.

<center> <img src="/img/docs/geometry/planar_implicit.png" alt="Implicitly defined graph" /> </center>

## Реалізація \{#implementation-1}

<CodeTabs>

```cpp
using dbl = long double;

const dbl eps = 1e-9;

struct Point {
    dbl x, y;

    Point(){}
    Point(dbl x_, dbl y_): x(x_), y(y_) {}

    Point operator * (dbl d) const {
        return Point(x * d, y * d);
    }

    Point operator + (const Point & p) const {
        return Point(x + p.x, y + p.y);
    }

    Point operator - (const Point & p) const {
        return Point(x - p.x, y - p.y);
    }

    dbl cross (const Point & p) const {
        return x * p.y - y * p.x;
    }

    dbl cross (const Point & p, const Point & q) const {
        return (p - *this).cross(q - *this);
    }

    dbl dot (const Point & p) const {
        return x * p.x + y * p.y;
    }

    dbl dot (const Point & p, const Point & q) const {
        return (p - *this).dot(q - *this);
    }

    bool operator < (const Point & p) const {
        if (fabs(x - p.x) < eps) {
            if (fabs(y - p.y) < eps) {
                return false;
            } else {
                return y < p.y;
            }
        } else {
            return x < p.x;
        }
    }

    bool operator == (const Point & p) const {
        return fabs(x - p.x) < eps && fabs(y - p.y) < eps;
    }

    bool operator >= (const Point & p) const {
        return !(*this < p);
    }
};

struct Line{
	Point p[2];

	Line(Point l, Point r){p[0] = l; p[1] = r;}
	Point& operator [](const int & i){return p[i];}
	const Point& operator[](const int & i)const{return p[i];}
	Line(const Line & l){
		p[0] = l.p[0]; p[1] = l.p[1];
	}
	Point getOrth()const{
		return Point(p[1].y - p[0].y, p[0].x - p[1].x);
	}
	bool hasPointLine(const Point & t)const{
		return std::fabs(p[0].cross(p[1], t)) < eps;
	}
	bool hasPointSeg(const Point & t)const{
		return hasPointLine(t) && t.dot(p[0], p[1]) < eps;
	}
};

std::vector<Point> interLineLine(Line l1, Line l2){
	if(std::fabs(l1.getOrth().cross(l2.getOrth())) < eps){
		if(l1.hasPointLine(l2[0]))return {l1[0], l1[1]};
		else return {};
	}
	Point u = l2[1] - l2[0];
	Point v = l1[1] - l1[0];
	dbl s = u.cross(l2[0] - l1[0])/u.cross(v);
	return {Point(l1[0] + v * s)};
}

std::vector<Point> interSegSeg(Line l1, Line l2){
	if (l1[0] == l1[1]) {
		if (l2[0] == l2[1]) {
			if (l1[0] == l2[0])
                return {l1[0]};
			else 
                return {};
		} else {
			if (l2.hasPointSeg(l1[0]))
                return {l1[0]};
			else
                return {};
		}
	}
	if (l2[0] == l2[1]) {
		if (l1.hasPointSeg(l2[0]))
            return {l2[0]};
		else 
            return {};
	}
	auto li = interLineLine(l1, l2);
	if (li.empty())
        return li;
	if (li.size() == 2) {
		if (l1[0] >= l1[1])
            std::swap(l1[0], l1[1]);
		if (l2[0] >= l2[1])
            std::swap(l2[0], l2[1]);
        std::vector<Point> res(2);
		if (l1[0] < l2[0])
            res[0] = l2[0];
        else
            res[0] = l1[0];
		if (l1[1] < l2[1])
            res[1] = l1[1];
        else
            res[1] = l2[1];
		if (res[0] == res[1])
            res.pop_back();
		if (res.size() == 2u && res[1] < res[0])
            return {};
		else 
            return res;
	}
	Point cand = li[0];
	if (l1.hasPointSeg(cand) && l2.hasPointSeg(cand))
        return {cand};
	else 
        return {};
}

std::pair<std::vector<Point>, std::vector<std::vector<size_t>>> build_graph(std::vector<Line> segments) {
    std::vector<Point> p;
    std::vector<std::vector<size_t>> adj;
    std::map<std::pair<int64_t, int64_t>, size_t> point_id;
    auto get_point_id = [&](Point pt) {
        auto repr = std::make_pair(
            int64_t(std::round(pt.x * 1000000000) + 1e-6),
            int64_t(std::round(pt.y * 1000000000) + 1e-6)
        );
        if (!point_id.count(repr)) {
            adj.emplace_back();
            size_t id = point_id.size();
            point_id[repr] = id;
            p.push_back(pt);
            return id;
        } else {
            return point_id[repr];
        }
    };
    for (size_t i = 0; i < segments.size(); i++) {
        std::vector<size_t> curr = {
            get_point_id(segments[i][0]),
            get_point_id(segments[i][1])
        };
        for (size_t j = 0; j < segments.size(); j++) {
            if (i == j)
                continue;
            auto inter = interSegSeg(segments[i], segments[j]);
            for (auto pt: inter) {
                curr.push_back(get_point_id(pt));
            }
        }
        std::sort(curr.begin(), curr.end(), [&](size_t l, size_t r) { return p[l] < p[r]; });
        curr.erase(std::unique(curr.begin(), curr.end()), curr.end());
        for (size_t j = 0; j + 1 < curr.size(); j++) {
            adj[curr[j]].push_back(curr[j + 1]);
            adj[curr[j + 1]].push_back(curr[j]);
        }
    }
    for (size_t i = 0; i < adj.size(); i++) {
        std::sort(adj[i].begin(), adj[i].end());
        // видаляємо ребра, що були додані кілька разів
        adj[i].erase(std::unique(adj[i].begin(), adj[i].end()), adj[i].end());
    }
    return {p, adj};
}
```

```python
import functools
import math

EPS = 1e-9


class Point:
    def __init__(self, x: float = 0.0, y: float = 0.0):
        self.x = x
        self.y = y

    def __mul__(self, d: float) -> "Point":
        return Point(self.x * d, self.y * d)

    def __add__(self, p: "Point") -> "Point":
        return Point(self.x + p.x, self.y + p.y)

    def __sub__(self, p: "Point") -> "Point":
        return Point(self.x - p.x, self.y - p.y)

    def cross(self, p: "Point") -> float:
        return self.x * p.y - self.y * p.x

    def cross2(self, p: "Point", q: "Point") -> float:
        return (p - self).cross(q - self)

    def dot(self, p: "Point") -> float:
        return self.x * p.x + self.y * p.y

    def dot2(self, p: "Point", q: "Point") -> float:
        return (p - self).dot(q - self)

    def __lt__(self, p: "Point") -> bool:
        if abs(self.x - p.x) < EPS:
            if abs(self.y - p.y) < EPS:
                return False
            return self.y < p.y
        return self.x < p.x

    def __eq__(self, p: "Point") -> bool:
        return abs(self.x - p.x) < EPS and abs(self.y - p.y) < EPS

    def __ge__(self, p: "Point") -> bool:
        return not (self < p)


class Line:
    def __init__(self, l: Point, r: Point):
        self.p = [l, r]

    def __getitem__(self, i: int) -> Point:
        return self.p[i]

    def __setitem__(self, i: int, v: Point) -> None:
        self.p[i] = v

    def get_orth(self) -> Point:
        return Point(self.p[1].y - self.p[0].y, self.p[0].x - self.p[1].x)

    def has_point_line(self, t: Point) -> bool:
        return abs(self.p[0].cross2(self.p[1], t)) < EPS

    def has_point_seg(self, t: Point) -> bool:
        return self.has_point_line(t) and t.dot2(self.p[0], self.p[1]) < EPS


def inter_line_line(l1: Line, l2: Line) -> list[Point]:
    if abs(l1.get_orth().cross(l2.get_orth())) < EPS:
        if l1.has_point_line(l2[0]):
            return [l1[0], l1[1]]
        return []
    u = l2[1] - l2[0]
    v = l1[1] - l1[0]
    s = u.cross(l2[0] - l1[0]) / u.cross(v)
    return [l1[0] + v * s]


def inter_seg_seg(l1: Line, l2: Line) -> list[Point]:
    if l1[0] == l1[1]:
        if l2[0] == l2[1]:
            return [l1[0]] if l1[0] == l2[0] else []
        return [l1[0]] if l2.has_point_seg(l1[0]) else []
    if l2[0] == l2[1]:
        return [l2[0]] if l1.has_point_seg(l2[0]) else []
    li = inter_line_line(l1, l2)
    if not li:
        return li
    if len(li) == 2:
        if l1[0] >= l1[1]:
            l1[0], l1[1] = l1[1], l1[0]
        if l2[0] >= l2[1]:
            l2[0], l2[1] = l2[1], l2[0]
        res = [l2[0] if l1[0] < l2[0] else l1[0],
               l1[1] if l1[1] < l2[1] else l2[1]]
        if res[0] == res[1]:
            res.pop()
        if len(res) == 2 and res[1] < res[0]:
            return []
        return res
    cand = li[0]
    if l1.has_point_seg(cand) and l2.has_point_seg(cand):
        return [cand]
    return []


def build_graph(segments: list[Line]) -> tuple[list[Point], list[list[int]]]:
    p: list[Point] = []
    adj: list[list[int]] = []
    point_id: dict[tuple[int, int], int] = {}

    def get_point_id(pt: Point) -> int:
        repr_ = (
            int(round(pt.x * 1000000000) + 1e-6),
            int(round(pt.y * 1000000000) + 1e-6),
        )
        if repr_ not in point_id:
            adj.append([])
            idx = len(point_id)
            point_id[repr_] = idx
            p.append(pt)
            return idx
        return point_id[repr_]

    for i in range(len(segments)):
        curr = [get_point_id(segments[i][0]), get_point_id(segments[i][1])]
        for j in range(len(segments)):
            if i == j:
                continue
            for pt in inter_seg_seg(segments[i], segments[j]):
                curr.append(get_point_id(pt))
        curr.sort(key=functools.cmp_to_key(
            lambda l, r: -1 if p[l] < p[r] else (1 if p[r] < p[l] else 0)))
        # видаляємо однакові сусідні вершини (аналог std::unique)
        dedup: list[int] = []
        for x in curr:
            if not dedup or dedup[-1] != x:
                dedup.append(x)
        for j in range(len(dedup) - 1):
            adj[dedup[j]].append(dedup[j + 1])
            adj[dedup[j + 1]].append(dedup[j])

    for i in range(len(adj)):
        # видаляємо ребра, що були додані кілька разів
        adj[i] = sorted(set(adj[i]))
    return p, adj
```

```typescript
const EPS = 1e-9;

class Point {
  constructor(public x = 0, public y = 0) {}

  mul(d: number): Point {
    return new Point(this.x * d, this.y * d);
  }
  add(p: Point): Point {
    return new Point(this.x + p.x, this.y + p.y);
  }
  sub(p: Point): Point {
    return new Point(this.x - p.x, this.y - p.y);
  }
  cross(p: Point): number {
    return this.x * p.y - this.y * p.x;
  }
  cross2(p: Point, q: Point): number {
    return p.sub(this).cross(q.sub(this));
  }
  dot(p: Point): number {
    return this.x * p.x + this.y * p.y;
  }
  dot2(p: Point, q: Point): number {
    return p.sub(this).dot(q.sub(this));
  }
  // У TypeScript немає перевантаження операторів, тому порівняння
  // < та == реалізуємо явними методами lt/eq/ge.
  lt(p: Point): boolean {
    if (Math.abs(this.x - p.x) < EPS) {
      if (Math.abs(this.y - p.y) < EPS) return false;
      return this.y < p.y;
    }
    return this.x < p.x;
  }
  eq(p: Point): boolean {
    return Math.abs(this.x - p.x) < EPS && Math.abs(this.y - p.y) < EPS;
  }
  ge(p: Point): boolean {
    return !this.lt(p);
  }
}

class Line {
  p: [Point, Point];
  constructor(l: Point, r: Point) {
    this.p = [l, r];
  }
  getOrth(): Point {
    return new Point(this.p[1].y - this.p[0].y, this.p[0].x - this.p[1].x);
  }
  hasPointLine(t: Point): boolean {
    return Math.abs(this.p[0].cross2(this.p[1], t)) < EPS;
  }
  hasPointSeg(t: Point): boolean {
    return this.hasPointLine(t) && t.dot2(this.p[0], this.p[1]) < EPS;
  }
}

function interLineLine(l1: Line, l2: Line): Point[] {
  if (Math.abs(l1.getOrth().cross(l2.getOrth())) < EPS) {
    if (l1.hasPointLine(l2.p[0])) return [l1.p[0], l1.p[1]];
    return [];
  }
  const u = l2.p[1].sub(l2.p[0]);
  const v = l1.p[1].sub(l1.p[0]);
  const s = u.cross(l2.p[0].sub(l1.p[0])) / u.cross(v);
  return [l1.p[0].add(v.mul(s))];
}

function interSegSeg(l1: Line, l2: Line): Point[] {
  if (l1.p[0].eq(l1.p[1])) {
    if (l2.p[0].eq(l2.p[1])) return l1.p[0].eq(l2.p[0]) ? [l1.p[0]] : [];
    return l2.hasPointSeg(l1.p[0]) ? [l1.p[0]] : [];
  }
  if (l2.p[0].eq(l2.p[1])) {
    return l1.hasPointSeg(l2.p[0]) ? [l2.p[0]] : [];
  }
  const li = interLineLine(l1, l2);
  if (li.length === 0) return li;
  if (li.length === 2) {
    if (l1.p[0].ge(l1.p[1])) [l1.p[0], l1.p[1]] = [l1.p[1], l1.p[0]];
    if (l2.p[0].ge(l2.p[1])) [l2.p[0], l2.p[1]] = [l2.p[1], l2.p[0]];
    const res: Point[] = [];
    res.push(l1.p[0].lt(l2.p[0]) ? l2.p[0] : l1.p[0]);
    res.push(l1.p[1].lt(l2.p[1]) ? l1.p[1] : l2.p[1]);
    if (res[0].eq(res[1])) res.pop();
    if (res.length === 2 && res[1].lt(res[0])) return [];
    return res;
  }
  const cand = li[0];
  if (l1.hasPointSeg(cand) && l2.hasPointSeg(cand)) return [cand];
  return [];
}

function buildGraph(segments: Line[]): [Point[], number[][]] {
  const p: Point[] = [];
  const adj: number[][] = [];
  const pointId = new Map<string, number>();

  const getPointId = (pt: Point): number => {
    const rx = Math.trunc(Math.round(pt.x * 1000000000) + 1e-6);
    const ry = Math.trunc(Math.round(pt.y * 1000000000) + 1e-6);
    const key = `${rx},${ry}`;
    if (!pointId.has(key)) {
      adj.push([]);
      const id = pointId.size;
      pointId.set(key, id);
      p.push(pt);
      return id;
    }
    return pointId.get(key)!;
  };

  for (let i = 0; i < segments.length; i++) {
    const curr: number[] = [getPointId(segments[i].p[0]), getPointId(segments[i].p[1])];
    for (let j = 0; j < segments.length; j++) {
      if (i === j) continue;
      for (const pt of interSegSeg(segments[i], segments[j])) curr.push(getPointId(pt));
    }
    curr.sort((l, r) => (p[l].lt(p[r]) ? -1 : p[r].lt(p[l]) ? 1 : 0));
    // видаляємо однакові сусідні вершини (аналог std::unique)
    const dedup: number[] = [];
    for (const x of curr) if (dedup.length === 0 || dedup[dedup.length - 1] !== x) dedup.push(x);
    for (let j = 0; j + 1 < dedup.length; j++) {
      adj[dedup[j]].push(dedup[j + 1]);
      adj[dedup[j + 1]].push(dedup[j]);
    }
  }

  for (let i = 0; i < adj.length; i++) {
    // видаляємо ребра, що були додані кілька разів
    adj[i] = [...new Set(adj[i])].sort((a, b) => a - b);
  }
  return [p, adj];
}
```

```go
package main

import (
	"math"
	"sort"
)

const eps = 1e-9

type Point struct {
	X, Y float64
}

func (a Point) Mul(d float64) Point {
	return Point{a.X * d, a.Y * d}
}

func (a Point) Add(p Point) Point {
	return Point{a.X + p.X, a.Y + p.Y}
}

func (a Point) Sub(p Point) Point {
	return Point{a.X - p.X, a.Y - p.Y}
}

func (a Point) Cross(p Point) float64 {
	return a.X*p.Y - a.Y*p.X
}

func (a Point) Cross2(p, q Point) float64 {
	return p.Sub(a).Cross(q.Sub(a))
}

func (a Point) Dot(p Point) float64 {
	return a.X*p.X + a.Y*p.Y
}

func (a Point) Dot2(p, q Point) float64 {
	return p.Sub(a).Dot(q.Sub(a))
}

// У Go немає перевантаження операторів — порівняння < та ==
// реалізуємо методами Less/Equal/GreaterEqual.
func (a Point) Less(p Point) bool {
	if math.Abs(a.X-p.X) < eps {
		if math.Abs(a.Y-p.Y) < eps {
			return false
		}
		return a.Y < p.Y
	}
	return a.X < p.X
}

func (a Point) Equal(p Point) bool {
	return math.Abs(a.X-p.X) < eps && math.Abs(a.Y-p.Y) < eps
}

func (a Point) GreaterEqual(p Point) bool {
	return !a.Less(p)
}

type Line struct {
	P [2]Point
}

func NewLine(l, r Point) Line {
	return Line{P: [2]Point{l, r}}
}

func (l Line) GetOrth() Point {
	return Point{l.P[1].Y - l.P[0].Y, l.P[0].X - l.P[1].X}
}

func (l Line) HasPointLine(t Point) bool {
	return math.Abs(l.P[0].Cross2(l.P[1], t)) < eps
}

func (l Line) HasPointSeg(t Point) bool {
	return l.HasPointLine(t) && t.Dot2(l.P[0], l.P[1]) < eps
}

func interLineLine(l1, l2 Line) []Point {
	if math.Abs(l1.GetOrth().Cross(l2.GetOrth())) < eps {
		if l1.HasPointLine(l2.P[0]) {
			return []Point{l1.P[0], l1.P[1]}
		}
		return []Point{}
	}
	u := l2.P[1].Sub(l2.P[0])
	v := l1.P[1].Sub(l1.P[0])
	s := u.Cross(l2.P[0].Sub(l1.P[0])) / u.Cross(v)
	return []Point{l1.P[0].Add(v.Mul(s))}
}

func interSegSeg(l1, l2 Line) []Point {
	if l1.P[0].Equal(l1.P[1]) {
		if l2.P[0].Equal(l2.P[1]) {
			if l1.P[0].Equal(l2.P[0]) {
				return []Point{l1.P[0]}
			}
			return []Point{}
		}
		if l2.HasPointSeg(l1.P[0]) {
			return []Point{l1.P[0]}
		}
		return []Point{}
	}
	if l2.P[0].Equal(l2.P[1]) {
		if l1.HasPointSeg(l2.P[0]) {
			return []Point{l2.P[0]}
		}
		return []Point{}
	}
	li := interLineLine(l1, l2)
	if len(li) == 0 {
		return li
	}
	if len(li) == 2 {
		if l1.P[0].GreaterEqual(l1.P[1]) {
			l1.P[0], l1.P[1] = l1.P[1], l1.P[0]
		}
		if l2.P[0].GreaterEqual(l2.P[1]) {
			l2.P[0], l2.P[1] = l2.P[1], l2.P[0]
		}
		res := make([]Point, 2)
		if l1.P[0].Less(l2.P[0]) {
			res[0] = l2.P[0]
		} else {
			res[0] = l1.P[0]
		}
		if l1.P[1].Less(l2.P[1]) {
			res[1] = l1.P[1]
		} else {
			res[1] = l2.P[1]
		}
		if res[0].Equal(res[1]) {
			res = res[:1]
		}
		if len(res) == 2 && res[1].Less(res[0]) {
			return []Point{}
		}
		return res
	}
	cand := li[0]
	if l1.HasPointSeg(cand) && l2.HasPointSeg(cand) {
		return []Point{cand}
	}
	return []Point{}
}

func buildGraph(segments []Line) ([]Point, [][]int) {
	p := []Point{}
	adj := [][]int{}
	pointID := map[[2]int64]int{}

	getPointID := func(pt Point) int {
		repr := [2]int64{
			int64(math.Round(pt.X*1000000000) + 1e-6),
			int64(math.Round(pt.Y*1000000000) + 1e-6),
		}
		if id, ok := pointID[repr]; ok {
			return id
		}
		adj = append(adj, []int{})
		id := len(pointID)
		pointID[repr] = id
		p = append(p, pt)
		return id
	}

	for i := 0; i < len(segments); i++ {
		curr := []int{getPointID(segments[i].P[0]), getPointID(segments[i].P[1])}
		for j := 0; j < len(segments); j++ {
			if i == j {
				continue
			}
			for _, pt := range interSegSeg(segments[i], segments[j]) {
				curr = append(curr, getPointID(pt))
			}
		}
		sort.SliceStable(curr, func(a, b int) bool { return p[curr[a]].Less(p[curr[b]]) })
		// видаляємо однакові сусідні вершини (аналог std::unique)
		dedup := curr[:0:0]
		for _, x := range curr {
			if len(dedup) == 0 || dedup[len(dedup)-1] != x {
				dedup = append(dedup, x)
			}
		}
		for j := 0; j+1 < len(dedup); j++ {
			adj[dedup[j]] = append(adj[dedup[j]], dedup[j+1])
			adj[dedup[j+1]] = append(adj[dedup[j+1]], dedup[j])
		}
	}

	for i := 0; i < len(adj); i++ {
		sort.Ints(adj[i])
		// видаляємо ребра, що були додані кілька разів
		uniq := adj[i][:0:0]
		for _, x := range adj[i] {
			if len(uniq) == 0 || uniq[len(uniq)-1] != x {
				uniq = append(uniq, x)
			}
		}
		adj[i] = uniq
	}
	return p, adj
}
```

</CodeTabs>

## Задачі \{#problems}
 * [TIMUS 1664 Pipeline Transportation](https://acm.timus.ru/problem.aspx?space=1&num=1664)
 * [TIMUS 1681 Brother Bear's Garden](https://acm.timus.ru/problem.aspx?space=1&num=1681)
