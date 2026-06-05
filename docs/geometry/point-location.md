# Локалізація точки за $O(log n)$

Розгляньмо таку задачу: задано [планарне розбиття](https://en.wikipedia.org/wiki/Planar_straight-line_graph) без жодної вершини степеня один чи нуль, а також багато запитів.
Кожен запит — це точка, для якої ми маємо визначити, якій грані розбиття вона належить.
Ми відповідатимемо на кожен запит за $O(\log n)$ офлайн.<br/>
Ця задача може виникнути, коли потрібно локалізувати деякі точки в діаграмі Вороного або в якомусь простому многокутнику.

## Алгоритм \{#algorithm}

Спочатку для кожної точки запиту $p\ (x_0, y_0)$ ми хочемо знайти таке ребро, що якщо точка належить хоч якомусь ребру, то вона лежить саме на знайденому ребрі; інакше це ребро має перетинати пряму $x = x_0$ у деякій єдиній точці $(x_0, y)$, де $y < y_0$, причому це $y$ є максимальним серед усіх таких ребер.
Наступне зображення показує обидва випадки.

<center> <img src="/img/docs/geometry/point_location_goal.png" alt="Image of Goal" /> </center>

Ми розв'яжемо цю задачу офлайн за допомогою алгоритму замітальної прямої. Перебиратимемо x-координати точок запитів і кінців ребер у порядку зростання та підтримуватимемо множину ребер $s$. Для кожної x-координати ми заздалегідь додамо деякі події.

Події будуть чотирьох типів: _add_, _remove_, _vertical_, _get_.
Для кожного вертикального ребра (обидва кінці мають однакову x-координату) ми додамо одну подію _vertical_ для відповідної x-координати.
Для кожного іншого ребра ми додамо одну подію _add_ для мінімуму x-координат кінців і одну подію _remove_ для максимуму x-координат кінців.
Нарешті, для кожної точки запиту ми додамо одну подію _get_ для її x-координати.

Для кожної x-координати ми відсортуємо події за їхніми типами в порядку (_vertical_, _get_, _remove_, _add_).
Наступне зображення показує всі події у відсортованому порядку для кожної x-координати.

<center> <img src="/img/docs/geometry/point_location_events.png" alt="Image of Events" /> </center>

Під час процесу замітальної прямої ми підтримуватимемо дві множини.
Множину $t$ для всіх невертикальних ребер і окрему множину $vert$ спеціально для вертикальних.
Ми очищатимемо множину $vert$ на початку обробки кожної x-координати.

Тепер обробімо події для фіксованої x-координати.

 - Якщо ми отримали подію _vertical_, ми просто вставимо мінімальну y-координату кінців відповідного ребра до $vert$.
 - Якщо ми отримали подію _remove_ або _add_, ми видалимо відповідне ребро з $t$ або додамо його до $t$.
 - Нарешті, для кожної події _get_ ми маємо перевірити, чи лежить точка на якомусь вертикальному ребрі, виконавши бінарний пошук у $vert$.
Якщо точка не лежить на жодному вертикальному ребрі, ми маємо знайти відповідь для цього запиту в $t$.
Для цього ми знову робимо бінарний пошук.
Щоб обробити деякі вироджені випадки (наприклад, у випадку трикутника $(0,~0)$, $(0,~2)$, $(1, 1)$, коли ми запитуємо точку $(0,~0)$), ми маємо відповісти на всі події _get_ ще раз після того, як обробили всі події для цієї x-координати, і обрати кращу з двох відповідей.

Тепер оберімо компаратор для множини $t$.
Цей компаратор має перевіряти, чи не лежить одне ребро вище за інше для кожної x-координати, яку вони обидва покривають. Припустимо, що ми маємо два ребра $(a, b)$ і $(c, d)$. Тоді компаратор такий (у псевдокоді):<br/>

$val = sgn((b - a)\times(c - a)) + sgn((b - a)\times(d - a))$<br/>
<b>if</b> $val \neq 0$<br/>
<b>then return</b> $val > 0$<br/>
$val = sgn((d - c)\times(a - c)) + sgn((d - c)\times(b - c))$<br/>
<b>return</b> $val < 0$<br/>

Тепер для кожного запиту ми маємо відповідне ребро.
Як знайти грань?
Якщо ми не змогли знайти ребро, це означає, що точка лежить у зовнішній грані.
Якщо точка належить знайденому ребру, грань не єдина.
Інакше є два кандидати — грані, які обмежені цим ребром.
Як перевірити, котра з них є відповіддю? Зауважимо, що ребро невертикальне.
Тоді відповіддю є грань, яка лежить над цим ребром.
Знайдімо таку грань для кожного невертикального ребра.
Розгляньмо обхід кожної грані проти годинникової стрілки.
Якщо під час цього обходу ми збільшили x-координату, проходячи через ребро, то ця грань і є гранню, яку нам потрібно знайти для цього ребра.

## Зауваження \{#notes}

Насправді, за допомогою персистентних дерев цей підхід можна використати, щоб відповідати на запити онлайн.

## Реалізація \{#implementation}

Наступний код реалізовано для цілих чисел, але його легко змінити, щоб він працював з числами типу double (змінивши методи порівняння та тип точки).
Ця реалізація припускає, що розбиття коректно зберігається всередині [DCEL](https://en.wikipedia.org/wiki/Doubly_connected_edge_list), а зовнішня грань має номер $-1$.<br/>
Для кожного запиту повертається пара $(1, i)$, якщо точка лежить строго всередині грані з номером $i$, і пара $(0, i)$, якщо точка лежить на ребрі з номером $i$.

<CodeTabs>

```cpp
typedef long long ll;

bool ge(const ll& a, const ll& b) { return a >= b; }
bool le(const ll& a, const ll& b) { return a <= b; }
bool eq(const ll& a, const ll& b) { return a == b; }
bool gt(const ll& a, const ll& b) { return a > b; }
bool lt(const ll& a, const ll& b) { return a < b; }
int sgn(const ll& x) { return le(x, 0) ? eq(x, 0) ? 0 : -1 : 1; }

struct pt {
    ll x, y;
    pt() {}
    pt(ll _x, ll _y) : x(_x), y(_y) {}
    pt operator-(const pt& a) const { return pt(x - a.x, y - a.y); }
    ll dot(const pt& a) const { return x * a.x + y * a.y; }
    ll dot(const pt& a, const pt& b) const { return (a - *this).dot(b - *this); }
    ll cross(const pt& a) const { return x * a.y - y * a.x; }
    ll cross(const pt& a, const pt& b) const { return (a - *this).cross(b - *this); }
    bool operator==(const pt& a) const { return a.x == x && a.y == y; }
};

struct Edge {
    pt l, r;
};

bool edge_cmp(Edge* edge1, Edge* edge2)
{
    const pt a = edge1->l, b = edge1->r;
    const pt c = edge2->l, d = edge2->r;
    int val = sgn(a.cross(b, c)) + sgn(a.cross(b, d));
    if (val != 0)
        return val > 0;
    val = sgn(c.cross(d, a)) + sgn(c.cross(d, b));
    return val < 0;
}

enum EventType { DEL = 2, ADD = 3, GET = 1, VERT = 0 };

struct Event {
    EventType type;
    int pos;
    bool operator<(const Event& event) const { return type < event.type; }
};

vector<Edge*> sweepline(vector<Edge*> planar, vector<pt> queries)
{
    using pt_type = decltype(pt::x);

    // збираємо всі x-координати
    auto s =
        set<pt_type, std::function<bool(const pt_type&, const pt_type&)>>(lt);
    for (pt p : queries)
        s.insert(p.x);
    for (Edge* e : planar) {
        s.insert(e->l.x);
        s.insert(e->r.x);
    }

    // зіставляємо всі x-координати з ідентифікаторами
    int cid = 0;
    auto id =
        map<pt_type, int, std::function<bool(const pt_type&, const pt_type&)>>(
            lt);
    for (auto x : s)
        id[x] = cid++;

    // створюємо події
    auto t = set<Edge*, decltype(*edge_cmp)>(edge_cmp);
    auto vert_cmp = [](const pair<pt_type, int>& l,
                       const pair<pt_type, int>& r) {
        if (!eq(l.first, r.first))
            return lt(l.first, r.first);
        return l.second < r.second;
    };
    auto vert = set<pair<pt_type, int>, decltype(vert_cmp)>(vert_cmp);
    vector<vector<Event>> events(cid);
    for (int i = 0; i < (int)queries.size(); i++) {
        int x = id[queries[i].x];
        events[x].push_back(Event{GET, i});
    }
    for (int i = 0; i < (int)planar.size(); i++) {
        int lx = id[planar[i]->l.x], rx = id[planar[i]->r.x];
        if (lx > rx) {
            swap(lx, rx);
            swap(planar[i]->l, planar[i]->r);
        }
        if (lx == rx) {
            events[lx].push_back(Event{VERT, i});
        } else {
            events[lx].push_back(Event{ADD, i});
            events[rx].push_back(Event{DEL, i});
        }
    }

    // виконуємо алгоритм замітальної прямої
    vector<Edge*> ans(queries.size(), nullptr);
    for (int x = 0; x < cid; x++) {
        sort(events[x].begin(), events[x].end());
        vert.clear();
        for (Event event : events[x]) {
            if (event.type == DEL) {
                t.erase(planar[event.pos]);
            }
            if (event.type == VERT) {
                vert.insert(make_pair(
                    min(planar[event.pos]->l.y, planar[event.pos]->r.y),
                    event.pos));
            }
            if (event.type == ADD) {
                t.insert(planar[event.pos]);
            }
            if (event.type == GET) {
                auto jt = vert.upper_bound(
                    make_pair(queries[event.pos].y, planar.size()));
                if (jt != vert.begin()) {
                    --jt;
                    int i = jt->second;
                    if (ge(max(planar[i]->l.y, planar[i]->r.y),
                           queries[event.pos].y)) {
                        ans[event.pos] = planar[i];
                        continue;
                    }
                }
                Edge* e = new Edge;
                e->l = e->r = queries[event.pos];
                auto it = t.upper_bound(e);
                if (it != t.begin())
                    ans[event.pos] = *(--it);
                delete e;
            }
        }

        for (Event event : events[x]) {
            if (event.type != GET)
                continue;
            if (ans[event.pos] != nullptr &&
                eq(ans[event.pos]->l.x, ans[event.pos]->r.x))
                continue;

            Edge* e = new Edge;
            e->l = e->r = queries[event.pos];
            auto it = t.upper_bound(e);
            delete e;
            if (it == t.begin())
                e = nullptr;
            else
                e = *(--it);
            if (ans[event.pos] == nullptr) {
                ans[event.pos] = e;
                continue;
            }
            if (e == nullptr)
                continue;
            if (e == ans[event.pos])
                continue;
            if (id[ans[event.pos]->r.x] == x) {
                if (id[e->l.x] == x) {
                    if (gt(e->l.y, ans[event.pos]->r.y))
                        ans[event.pos] = e;
                }
            } else {
                ans[event.pos] = e;
            }
        }
    }
    return ans;
}

struct DCEL {
    struct Edge {
        pt origin;
        Edge* nxt = nullptr;
        Edge* twin = nullptr;
        int face;
    };
    vector<Edge*> body;
};

vector<pair<int, int>> point_location(DCEL planar, vector<pt> queries)
{
    vector<pair<int, int>> ans(queries.size());
    vector<Edge*> planar2;
    map<intptr_t, int> pos;
    map<intptr_t, int> added_on;
    int n = planar.body.size();
    for (int i = 0; i < n; i++) {
        if (planar.body[i]->face > planar.body[i]->twin->face)
            continue;
        Edge* e = new Edge;
        e->l = planar.body[i]->origin;
        e->r = planar.body[i]->twin->origin;
        added_on[(intptr_t)e] = i;
        pos[(intptr_t)e] =
            lt(planar.body[i]->origin.x, planar.body[i]->twin->origin.x)
                ? planar.body[i]->face
                : planar.body[i]->twin->face;
        planar2.push_back(e);
    }
    auto res = sweepline(planar2, queries);
    for (int i = 0; i < (int)queries.size(); i++) {
        if (res[i] == nullptr) {
            ans[i] = make_pair(1, -1);
            continue;
        }
        pt p = queries[i];
        pt l = res[i]->l, r = res[i]->r;
        if (eq(p.cross(l, r), 0) && le(p.dot(l, r), 0)) {
            ans[i] = make_pair(0, added_on[(intptr_t)res[i]]);
            continue;
        }
        ans[i] = make_pair(1, pos[(intptr_t)res[i]]);
    }
    for (auto e : planar2)
        delete e;
    return ans;
}
```

```python
from functools import cmp_to_key


def ge(a: int, b: int) -> bool:
    return a >= b


def le(a: int, b: int) -> bool:
    return a <= b


def eq(a: int, b: int) -> bool:
    return a == b


def gt(a: int, b: int) -> bool:
    return a > b


def lt(a: int, b: int) -> bool:
    return a < b


def sgn(x: int) -> int:
    return (0 if eq(x, 0) else -1) if le(x, 0) else 1


class Pt:
    def __init__(self, x: int = 0, y: int = 0):
        self.x = x
        self.y = y

    def sub(self, a: "Pt") -> "Pt":
        return Pt(self.x - a.x, self.y - a.y)

    def cross(self, a: "Pt", b: "Pt | None" = None) -> int:
        if b is None:
            return self.x * a.y - self.y * a.x
        u = a.sub(self)
        v = b.sub(self)
        return u.x * v.y - u.y * v.x

    def dot(self, a: "Pt", b: "Pt | None" = None) -> int:
        if b is None:
            return self.x * a.x + self.y * a.y
        u = a.sub(self)
        v = b.sub(self)
        return u.x * v.x + u.y * v.y

    def __eq__(self, a) -> bool:
        return self.x == a.x and self.y == a.y


class Edge:
    def __init__(self, l: Pt = None, r: Pt = None):
        self.l = l if l is not None else Pt()
        self.r = r if r is not None else Pt()


def edge_cmp(edge1: Edge, edge2: Edge) -> bool:
    # чи лежить edge1 нижче за edge2 (аналог operator< у std::set)
    a, b = edge1.l, edge1.r
    c, d = edge2.l, edge2.r
    val = sgn(a.cross(b, c)) + sgn(a.cross(b, d))
    if val != 0:
        return val > 0
    val = sgn(c.cross(d, a)) + sgn(c.cross(d, b))
    return val < 0


# Типи подій. Менше значення обробляється раніше при однаковій x-координаті.
VERT, GET, DEL, ADD = 0, 1, 2, 3


# Примітка щодо структури даних:
# у C++ множина `t` — це std::set з компаратором edge_cmp, який «ковзний»
# (залежить від поточної x-координати), а пошук відповіді — це upper_bound.
# У stdlib Python немає збалансованого дерева з довільним компаратором, тому
# тримаємо звичайний список `t`, відсортований за edge_cmp, і робимо
# upper_bound бінарним пошуком. Вставка/вилучення за індексом — O(n), отже
# загальна складність стає O(n^2 + n*q); логіка алгоритму збережена байт-у-байт.
def sweepline(planar: list[Edge], queries: list[Pt]) -> list[Edge]:
    # збираємо всі x-координати
    xs = set()
    for p in queries:
        xs.add(p.x)
    for e in planar:
        xs.add(e.l.x)
        xs.add(e.r.x)

    # зіставляємо всі x-координати з ідентифікаторами
    sorted_x = sorted(xs)
    cid = len(sorted_x)
    idx = {x: i for i, x in enumerate(sorted_x)}

    # `t` — список ребер, відсортований за edge_cmp (аналог std::set)
    t: list[Edge] = []
    # `vert` — список пар (min_y, pos), відсортований лексикографічно
    vert: list[tuple[int, int]] = []

    events: list[list[tuple[int, int]]] = [[] for _ in range(cid)]
    for i in range(len(queries)):
        x = idx[queries[i].x]
        events[x].append((GET, i))
    for i in range(len(planar)):
        lx, rx = idx[planar[i].l.x], idx[planar[i].r.x]
        if lx > rx:
            lx, rx = rx, lx
            planar[i].l, planar[i].r = planar[i].r, planar[i].l
        if lx == rx:
            events[lx].append((VERT, i))
        else:
            events[lx].append((ADD, i))
            events[rx].append((DEL, i))

    def t_lower_bound(e: Edge) -> int:
        # перший індекс, де НЕ edge_cmp(t[i], e) — тобто межа upper/lower
        lo, hi = 0, len(t)
        while lo < hi:
            mid = (lo + hi) // 2
            if edge_cmp(t[mid], e):
                lo = mid + 1
            else:
                hi = mid
        return lo

    def t_upper_bound(e: Edge) -> int:
        # перший індекс, де edge_cmp(e, t[i]) (строго більший за e)
        lo, hi = 0, len(t)
        while lo < hi:
            mid = (lo + hi) // 2
            if edge_cmp(e, t[mid]):
                hi = mid
            else:
                lo = mid + 1
        return lo

    def vert_upper_bound(key: tuple[int, int]) -> int:
        lo, hi = 0, len(vert)
        while lo < hi:
            mid = (lo + hi) // 2
            if vert[mid] <= key:
                lo = mid + 1
            else:
                hi = mid
        return lo

    # виконуємо алгоритм замітальної прямої
    ans: list[Edge | None] = [None] * len(queries)
    for x in range(cid):
        events[x].sort(key=lambda ev: ev[0])
        vert = []
        for typ, pos in events[x]:
            if typ == DEL:
                # видаляємо ребро planar[pos] з відсортованого списку t
                i = t_lower_bound(planar[pos])
                while i < len(t) and t[i] is not planar[pos]:
                    i += 1
                if i < len(t):
                    t.pop(i)
            if typ == VERT:
                key = (min(planar[pos].l.y, planar[pos].r.y), pos)
                j = vert_upper_bound(key)
                vert.insert(j, key)
            if typ == ADD:
                i = t_upper_bound(planar[pos])
                t.insert(i, planar[pos])
            if typ == GET:
                j = vert_upper_bound((queries[pos].y, len(planar)))
                if j != 0:
                    i = vert[j - 1][1]
                    if ge(max(planar[i].l.y, planar[i].r.y), queries[pos].y):
                        ans[pos] = planar[i]
                        continue
                e = Edge(queries[pos], queries[pos])
                it = t_upper_bound(e)
                if it != 0:
                    ans[pos] = t[it - 1]

        for typ, pos in events[x]:
            if typ != GET:
                continue
            if ans[pos] is not None and eq(ans[pos].l.x, ans[pos].r.x):
                continue

            e = Edge(queries[pos], queries[pos])
            it = t_upper_bound(e)
            cand = None if it == 0 else t[it - 1]
            if ans[pos] is None:
                ans[pos] = cand
                continue
            if cand is None:
                continue
            if cand is ans[pos]:
                continue
            if idx[ans[pos].r.x] == x:
                if idx[cand.l.x] == x:
                    if gt(cand.l.y, ans[pos].r.y):
                        ans[pos] = cand
            else:
                ans[pos] = cand
    return ans


class DCELEdge:
    def __init__(self, origin: Pt, face: int):
        self.origin = origin
        self.nxt: "DCELEdge | None" = None
        self.twin: "DCELEdge | None" = None
        self.face = face


class DCEL:
    def __init__(self):
        self.body: list[DCELEdge] = []


def point_location(planar: DCEL, queries: list[Pt]) -> list[tuple[int, int]]:
    ans: list[tuple[int, int]] = [(0, 0)] * len(queries)
    planar2: list[Edge] = []
    pos: dict[int, int] = {}       # грань над невертикальним ребром
    added_on: dict[int, int] = {}  # індекс ребра DCEL, з якого створено Edge
    n = len(planar.body)
    for i in range(n):
        if planar.body[i].face > planar.body[i].twin.face:
            continue
        e = Edge(planar.body[i].origin, planar.body[i].twin.origin)
        added_on[id(e)] = i
        pos[id(e)] = (
            planar.body[i].face
            if lt(planar.body[i].origin.x, planar.body[i].twin.origin.x)
            else planar.body[i].twin.face
        )
        planar2.append(e)
    res = sweepline(planar2, queries)
    for i in range(len(queries)):
        if res[i] is None:
            ans[i] = (1, -1)
            continue
        p = queries[i]
        l, r = res[i].l, res[i].r
        if eq(p.cross(l, r), 0) and le(p.dot(l, r), 0):
            ans[i] = (0, added_on[id(res[i])])
            continue
        ans[i] = (1, pos[id(res[i])])
    return ans
```

```typescript
function ge(a: bigint, b: bigint): boolean {
  return a >= b;
}
function le(a: bigint, b: bigint): boolean {
  return a <= b;
}
function eq(a: bigint, b: bigint): boolean {
  return a === b;
}
function gt(a: bigint, b: bigint): boolean {
  return a > b;
}
function lt(a: bigint, b: bigint): boolean {
  return a < b;
}
function sgn(x: bigint): number {
  return le(x, 0n) ? (eq(x, 0n) ? 0 : -1) : 1;
}

class Pt {
  constructor(public x: bigint = 0n, public y: bigint = 0n) {}
  sub(a: Pt): Pt {
    return new Pt(this.x - a.x, this.y - a.y);
  }
  cross(a: Pt, b?: Pt): bigint {
    if (b === undefined) return this.x * a.y - this.y * a.x;
    const u = a.sub(this);
    const v = b.sub(this);
    return u.x * v.y - u.y * v.x;
  }
  dot(a: Pt, b?: Pt): bigint {
    if (b === undefined) return this.x * a.x + this.y * a.y;
    const u = a.sub(this);
    const v = b.sub(this);
    return u.x * v.x + u.y * v.y;
  }
  equals(a: Pt): boolean {
    return this.x === a.x && this.y === a.y;
  }
}

class Edge {
  constructor(public l: Pt = new Pt(), public r: Pt = new Pt()) {}
}

// чи лежить edge1 нижче за edge2 (аналог operator< у std::set)
function edgeCmp(edge1: Edge, edge2: Edge): boolean {
  const a = edge1.l;
  const b = edge1.r;
  const c = edge2.l;
  const d = edge2.r;
  let val = sgn(a.cross(b, c)) + sgn(a.cross(b, d));
  if (val !== 0) return val > 0;
  val = sgn(c.cross(d, a)) + sgn(c.cross(d, b));
  return val < 0;
}

// Типи подій. Менше значення обробляється раніше при однаковій x-координаті.
const VERT = 0;
const GET = 1;
const DEL = 2;
const ADD = 3;

// Примітка щодо структури даних:
// у C++ множина `t` — це std::set з компаратором edgeCmp, який «ковзний»
// (залежить від поточної x-координати), а пошук відповіді — це upper_bound.
// У стандартній бібліотеці TS немає збалансованого дерева з довільним
// компаратором, тому тримаємо масив `t`, відсортований за edgeCmp, і робимо
// upper_bound бінарним пошуком. Вставка/вилучення за індексом — O(n), отже
// загальна складність стає O(n^2 + n*q); логіка алгоритму збережена.
function sweepline(planar: Edge[], queries: Pt[]): (Edge | null)[] {
  // збираємо всі x-координати
  const xsSet = new Set<bigint>();
  for (const p of queries) xsSet.add(p.x);
  for (const e of planar) {
    xsSet.add(e.l.x);
    xsSet.add(e.r.x);
  }

  // зіставляємо всі x-координати з ідентифікаторами
  const sortedX = [...xsSet].sort((u, v) => (lt(u, v) ? -1 : eq(u, v) ? 0 : 1));
  const cid = sortedX.length;
  const idx = new Map<bigint, number>();
  sortedX.forEach((v, i) => idx.set(v, i));

  const t: Edge[] = []; // ребра, відсортовані за edgeCmp
  let vert: [bigint, number][] = []; // пари (min_y, pos), відсортовані лексикографічно

  const events: [number, number][][] = Array.from({ length: cid }, () => []);
  for (let i = 0; i < queries.length; i++) {
    events[idx.get(queries[i].x)!].push([GET, i]);
  }
  for (let i = 0; i < planar.length; i++) {
    let lx = idx.get(planar[i].l.x)!;
    let rx = idx.get(planar[i].r.x)!;
    if (lx > rx) {
      [lx, rx] = [rx, lx];
      [planar[i].l, planar[i].r] = [planar[i].r, planar[i].l];
    }
    if (lx === rx) {
      events[lx].push([VERT, i]);
    } else {
      events[lx].push([ADD, i]);
      events[rx].push([DEL, i]);
    }
  }

  const tLowerBound = (e: Edge): number => {
    let lo = 0;
    let hi = t.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (edgeCmp(t[mid], e)) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  };
  const tUpperBound = (e: Edge): number => {
    let lo = 0;
    let hi = t.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (edgeCmp(e, t[mid])) hi = mid;
      else lo = mid + 1;
    }
    return lo;
  };
  // лексикографічний upper_bound у `vert` за ключем (y, pos)
  const vertUpperBound = (ky: bigint, kp: number): number => {
    let lo = 0;
    let hi = vert.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      const leKey = vert[mid][0] < ky || (vert[mid][0] === ky && vert[mid][1] <= kp);
      if (leKey) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  };

  // виконуємо алгоритм замітальної прямої
  const ans: (Edge | null)[] = new Array(queries.length).fill(null);
  for (let x = 0; x < cid; x++) {
    events[x].sort((e1, e2) => e1[0] - e2[0]);
    vert = [];
    for (const [typ, pos] of events[x]) {
      if (typ === DEL) {
        let i = tLowerBound(planar[pos]);
        while (i < t.length && t[i] !== planar[pos]) i++;
        if (i < t.length) t.splice(i, 1);
      }
      if (typ === VERT) {
        const minY = planar[pos].l.y < planar[pos].r.y ? planar[pos].l.y : planar[pos].r.y;
        const j = vertUpperBound(minY, pos);
        vert.splice(j, 0, [minY, pos]);
      }
      if (typ === ADD) {
        const i = tUpperBound(planar[pos]);
        t.splice(i, 0, planar[pos]);
      }
      if (typ === GET) {
        const j = vertUpperBound(queries[pos].y, planar.length);
        if (j !== 0) {
          const i = vert[j - 1][1];
          const maxY = planar[i].l.y > planar[i].r.y ? planar[i].l.y : planar[i].r.y;
          if (ge(maxY, queries[pos].y)) {
            ans[pos] = planar[i];
            continue;
          }
        }
        const e = new Edge(queries[pos], queries[pos]);
        const it = tUpperBound(e);
        if (it !== 0) ans[pos] = t[it - 1];
      }
    }

    for (const [typ, pos] of events[x]) {
      if (typ !== GET) continue;
      if (ans[pos] !== null && eq(ans[pos]!.l.x, ans[pos]!.r.x)) continue;

      const e = new Edge(queries[pos], queries[pos]);
      const it = tUpperBound(e);
      const cand: Edge | null = it === 0 ? null : t[it - 1];
      if (ans[pos] === null) {
        ans[pos] = cand;
        continue;
      }
      if (cand === null) continue;
      if (cand === ans[pos]) continue;
      if (idx.get(ans[pos]!.r.x) === x) {
        if (idx.get(cand.l.x) === x) {
          if (gt(cand.l.y, ans[pos]!.r.y)) ans[pos] = cand;
        }
      } else {
        ans[pos] = cand;
      }
    }
  }
  return ans;
}

class DCELEdge {
  nxt: DCELEdge | null = null;
  twin: DCELEdge | null = null;
  constructor(public origin: Pt, public face: number) {}
}

class DCEL {
  body: DCELEdge[] = [];
}

function pointLocation(planar: DCEL, queries: Pt[]): [number, number][] {
  const ans: [number, number][] = new Array(queries.length);
  const planar2: Edge[] = [];
  const pos = new Map<Edge, number>(); // грань над невертикальним ребром
  const addedOn = new Map<Edge, number>(); // індекс ребра DCEL, з якого створено Edge
  const n = planar.body.length;
  for (let i = 0; i < n; i++) {
    if (planar.body[i].face > planar.body[i].twin!.face) continue;
    const e = new Edge(planar.body[i].origin, planar.body[i].twin!.origin);
    addedOn.set(e, i);
    pos.set(
      e,
      lt(planar.body[i].origin.x, planar.body[i].twin!.origin.x)
        ? planar.body[i].face
        : planar.body[i].twin!.face,
    );
    planar2.push(e);
  }
  const res = sweepline(planar2, queries);
  for (let i = 0; i < queries.length; i++) {
    if (res[i] === null) {
      ans[i] = [1, -1];
      continue;
    }
    const p = queries[i];
    const l = res[i]!.l;
    const r = res[i]!.r;
    if (eq(p.cross(l, r), 0n) && le(p.dot(l, r), 0n)) {
      ans[i] = [0, addedOn.get(res[i]!)!];
      continue;
    }
    ans[i] = [1, pos.get(res[i]!)!];
  }
  return ans;
}
```

```go
package main

import "sort"

func ge(a, b int64) bool { return a >= b }
func le(a, b int64) bool { return a <= b }
func eq(a, b int64) bool { return a == b }
func gt(a, b int64) bool { return a > b }
func lt(a, b int64) bool { return a < b }

func sgn(x int64) int {
	if le(x, 0) {
		if eq(x, 0) {
			return 0
		}
		return -1
	}
	return 1
}

type Pt struct {
	x, y int64
}

func (p Pt) sub(a Pt) Pt { return Pt{p.x - a.x, p.y - a.y} }

// cross2: векторний добуток p->a і p->b
func (p Pt) cross2(a, b Pt) int64 {
	u := a.sub(p)
	v := b.sub(p)
	return u.x*v.y - u.y*v.x
}

// dot2: скалярний добуток p->a і p->b
func (p Pt) dot2(a, b Pt) int64 {
	u := a.sub(p)
	v := b.sub(p)
	return u.x*v.x + u.y*v.y
}

type Edge struct {
	l, r Pt
}

// чи лежить edge1 нижче за edge2 (аналог operator< у std::set)
func edgeCmp(edge1, edge2 *Edge) bool {
	a, b := edge1.l, edge1.r
	c, d := edge2.l, edge2.r
	val := sgn(a.cross2(b, c)) + sgn(a.cross2(b, d))
	if val != 0 {
		return val > 0
	}
	val = sgn(c.cross2(d, a)) + sgn(c.cross2(d, b))
	return val < 0
}

// Типи подій. Менше значення обробляється раніше при однаковій x-координаті.
const (
	vertEv = 0
	getEv  = 1
	delEv  = 2
	addEv  = 3
)

// Примітка щодо структури даних:
// у C++ множина `t` — це std::set з компаратором edgeCmp, який «ковзний»
// (залежить від поточної x-координати), а пошук відповіді — це upper_bound.
// У stdlib Go немає збалансованого дерева з довільним компаратором, тому
// тримаємо зріз `t`, відсортований за edgeCmp, і робимо upper_bound бінарним
// пошуком. Вставка/вилучення за індексом — O(n), отже загальна складність
// стає O(n^2 + n*q); логіка алгоритму збережена.
func sweepline(planar []*Edge, queries []Pt) []*Edge {
	// збираємо всі x-координати
	xsSet := map[int64]bool{}
	for _, p := range queries {
		xsSet[p.x] = true
	}
	for _, e := range planar {
		xsSet[e.l.x] = true
		xsSet[e.r.x] = true
	}

	// зіставляємо всі x-координати з ідентифікаторами
	sortedX := make([]int64, 0, len(xsSet))
	for x := range xsSet {
		sortedX = append(sortedX, x)
	}
	sort.Slice(sortedX, func(i, j int) bool { return lt(sortedX[i], sortedX[j]) })
	cid := len(sortedX)
	idx := make(map[int64]int, cid)
	for i, x := range sortedX {
		idx[x] = i
	}

	t := []*Edge{}             // ребра, відсортовані за edgeCmp
	vert := [][2]int64{}       // пари (min_y, pos), відсортовані лексикографічно

	type event struct{ typ, pos int }
	events := make([][]event, cid)
	for i := range queries {
		x := idx[queries[i].x]
		events[x] = append(events[x], event{getEv, i})
	}
	for i := range planar {
		lx, rx := idx[planar[i].l.x], idx[planar[i].r.x]
		if lx > rx {
			lx, rx = rx, lx
			planar[i].l, planar[i].r = planar[i].r, planar[i].l
		}
		if lx == rx {
			events[lx] = append(events[lx], event{vertEv, i})
		} else {
			events[lx] = append(events[lx], event{addEv, i})
			events[rx] = append(events[rx], event{delEv, i})
		}
	}

	tLowerBound := func(e *Edge) int {
		lo, hi := 0, len(t)
		for lo < hi {
			mid := (lo + hi) / 2
			if edgeCmp(t[mid], e) {
				lo = mid + 1
			} else {
				hi = mid
			}
		}
		return lo
	}
	tUpperBound := func(e *Edge) int {
		lo, hi := 0, len(t)
		for lo < hi {
			mid := (lo + hi) / 2
			if edgeCmp(e, t[mid]) {
				hi = mid
			} else {
				lo = mid + 1
			}
		}
		return lo
	}
	// лексикографічний upper_bound у `vert` за ключем (ky, kp)
	vertUpperBound := func(ky int64, kp int) int {
		lo, hi := 0, len(vert)
		for lo < hi {
			mid := (lo + hi) / 2
			leKey := vert[mid][0] < ky || (vert[mid][0] == ky && vert[mid][1] <= int64(kp))
			if leKey {
				lo = mid + 1
			} else {
				hi = mid
			}
		}
		return lo
	}

	// виконуємо алгоритм замітальної прямої
	ans := make([]*Edge, len(queries))
	for x := 0; x < cid; x++ {
		sort.SliceStable(events[x], func(i, j int) bool { return events[x][i].typ < events[x][j].typ })
		vert = vert[:0]
		for _, ev := range events[x] {
			switch ev.typ {
			case delEv:
				i := tLowerBound(planar[ev.pos])
				for i < len(t) && t[i] != planar[ev.pos] {
					i++
				}
				if i < len(t) {
					t = append(t[:i], t[i+1:]...)
				}
			case vertEv:
				minY := planar[ev.pos].l.y
				if planar[ev.pos].r.y < minY {
					minY = planar[ev.pos].r.y
				}
				j := vertUpperBound(minY, ev.pos)
				vert = append(vert, [2]int64{})
				copy(vert[j+1:], vert[j:])
				vert[j] = [2]int64{minY, int64(ev.pos)}
			case addEv:
				i := tUpperBound(planar[ev.pos])
				t = append(t, nil)
				copy(t[i+1:], t[i:])
				t[i] = planar[ev.pos]
			case getEv:
				j := vertUpperBound(queries[ev.pos].y, len(planar))
				if j != 0 {
					i := int(vert[j-1][1])
					maxY := planar[i].l.y
					if planar[i].r.y > maxY {
						maxY = planar[i].r.y
					}
					if ge(maxY, queries[ev.pos].y) {
						ans[ev.pos] = planar[i]
						continue
					}
				}
				e := &Edge{queries[ev.pos], queries[ev.pos]}
				it := tUpperBound(e)
				if it != 0 {
					ans[ev.pos] = t[it-1]
				}
			}
		}

		for _, ev := range events[x] {
			if ev.typ != getEv {
				continue
			}
			if ans[ev.pos] != nil && eq(ans[ev.pos].l.x, ans[ev.pos].r.x) {
				continue
			}

			e := &Edge{queries[ev.pos], queries[ev.pos]}
			it := tUpperBound(e)
			var cand *Edge
			if it != 0 {
				cand = t[it-1]
			}
			if ans[ev.pos] == nil {
				ans[ev.pos] = cand
				continue
			}
			if cand == nil {
				continue
			}
			if cand == ans[ev.pos] {
				continue
			}
			if idx[ans[ev.pos].r.x] == x {
				if idx[cand.l.x] == x {
					if gt(cand.l.y, ans[ev.pos].r.y) {
						ans[ev.pos] = cand
					}
				}
			} else {
				ans[ev.pos] = cand
			}
		}
	}
	return ans
}

type DCELEdge struct {
	origin Pt
	nxt    *DCELEdge
	twin   *DCELEdge
	face   int
}

type DCEL struct {
	body []*DCELEdge
}

func pointLocation(planar DCEL, queries []Pt) [][2]int {
	ans := make([][2]int, len(queries))
	planar2 := []*Edge{}
	pos := map[*Edge]int{}      // грань над невертикальним ребром
	addedOn := map[*Edge]int{}  // індекс ребра DCEL, з якого створено Edge
	n := len(planar.body)
	for i := 0; i < n; i++ {
		if planar.body[i].face > planar.body[i].twin.face {
			continue
		}
		e := &Edge{planar.body[i].origin, planar.body[i].twin.origin}
		addedOn[e] = i
		if lt(planar.body[i].origin.x, planar.body[i].twin.origin.x) {
			pos[e] = planar.body[i].face
		} else {
			pos[e] = planar.body[i].twin.face
		}
		planar2 = append(planar2, e)
	}
	res := sweepline(planar2, queries)
	for i := range queries {
		if res[i] == nil {
			ans[i] = [2]int{1, -1}
			continue
		}
		p := queries[i]
		l, r := res[i].l, res[i].r
		if eq(p.cross2(l, r), 0) && le(p.dot2(l, r), 0) {
			ans[i] = [2]int{0, addedOn[res[i]]}
			continue
		}
		ans[i] = [2]int{1, pos[res[i]]}
	}
	return ans
}
```

</CodeTabs>

## Задачі \{#problems}
 * [TIMUS 1848 Fly Hunt](http://acm.timus.ru/problem.aspx?space=1&num=1848&locale=en)
 * [UVA 12310 Point Location](https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&category=297&page=show_problem&problem=3732)
