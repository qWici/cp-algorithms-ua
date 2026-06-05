# Тріангуляція Делоне та діаграма Вороного

Розглянемо множину $\{p_i\}$ точок на площині.
**Діаграма Вороного** $V(\{p_i\})$ множини $\{p_i\}$ — це розбиття площини на $n$ областей $V_i$, де $V_i = \{p\in\mathbb{R}^2;\ \rho(p, p_i) = \min\ \rho(p, p_k)\}$.
Комірки діаграми Вороного — це многокутники (можливо, нескінченні).
**Тріангуляція Делоне** $D(\{p_i\})$ множини $\{p_i\}$ — це така тріангуляція, у якій кожна точка $p_i$ лежить поза <Term tip="Описане коло трикутника — це коло, що проходить через усі три його вершини; для будь-якого трикутника воно єдине.">описаним колом</Term> будь-якого трикутника $T \in D(\{p_i\})$ або на його межі.

Є один неприємний <Term tip="Особлива крайня ситуація, що випадає із загального правила і потребує окремої обробки; тут — коли всі точки лежать на одній прямій.">вироджений випадок</Term>, коли діаграма Вороного не є зв'язною, а тріангуляція Делоне не існує. Це трапляється тоді, коли всі точки <Term tip="Колінеарні точки лежать на одній прямій; тоді трикутників побудувати не можна й тріангуляції не існує.">колінеарні</Term>.

:::tip[Коли підходить цей алгоритм?]
- Потрібна тріангуляція множини точок із максимально «товстими» трикутниками (максимізується мінімальний кут) або двоїста їй діаграма Вороного?
- Тобі потрібне саме розбиття площини / найближчі сусіди, а не лише опукла межа множини? *(якщо ні → [Побудова опуклої оболонки](convex-hull.md))*
- Вхідні точки **не всі колінеарні** (інакше тріангуляція не існує і випадок треба обробляти окремо)?
:::

## Властивості \{#properties}

Тріангуляція Делоне максимізує мінімальний кут серед усіх можливих тріангуляцій.

<Term tip="Це найкоротша мережа відрізків, що з'єднує всі точки між собою без циклів, де довжини рахуються за звичайною (евклідовою) відстанню.">Мінімальне евклідове кістякове дерево</Term> множини точок є підмножиною ребер її тріангуляції Делоне.

## Двоїстість \{#duality}

Припустимо, що точки $\{p_i\}$ не колінеарні й серед $\{p_i\}$ немає чотирьох точок, що лежать на одному колі. Тоді $V(\{p_i\})$ і $D(\{p_i\})$ <Term tip="Двоїсті означає, що ці дві структури взаємно однозначно пов'язані: знаючи одну, можна швидко відновити іншу.">двоїсті</Term>, тож якщо ми отримали одне з них, то можемо отримати інше за $O(n)$. Що робити, якщо це не так? Колінеарний випадок легко обробити окремо. В іншому разі двоїстими є $V$ і $D'$, де $D'$ отримується з $D$ видаленням усіх ребер, для яких два трикутники на цьому ребрі мають спільне описане коло.

## Побудова Делоне та Вороного \{#building-delaunay-and-voronoi}

Завдяки двоїстості нам потрібен швидкий алгоритм для обчислення лише одного з $V$ і $D$. Ми опишемо, як побудувати $D(\{p_i\})$ за $O(n\log n)$. Тріангуляцію будуватимемо за алгоритмом «розділяй і володарюй» Гібаса та Столфі (Guibas, Stolfi).

## Структура даних quad-edge \{#quad-edge-data-structure}

Під час роботи алгоритму $D$ зберігатиметься у структурі даних quad-edge (структура «чотириребро»). Цю структуру зображено на рисунку:
<center> <img src="/img/docs/geometry/quad-edge.png" alt="Quad-Edge" /> </center>

В алгоритмі ми використовуватимемо такі функції над ребрами:

  1. `make_edge(a, b)`<br/>
    Ця функція створює ізольоване ребро з точки `a` у точку `b` разом із оберненим до нього ребром і обома двоїстими ребрами.
  2. `splice(a, b)`<br/>
    Це ключова функція алгоритму. Вона міняє місцями `a->Onext` з `b->Onext` та `a->Onext->Rot->Onext` з `b->Onext->Rot->Onext`.
  3. `delete_edge(e)`<br/>
    Ця функція видаляє e з тріангуляції. Щоб видалити `e`, ми можемо просто викликати `splice(e, e->Oprev)` і `splice(e->Rev, e->Rev->Oprev)`.
  4. `connect(a, b)`<br/>
    Ця функція створює нове ребро `e` з `a->Dest` у `b->Org` так, щоб `a`, `b`, `e` мали одну й ту саму ліву грань. Для цього ми викликаємо `e = make_edge(a->Dest, b->Org)`, `splice(e, a->Lnext)` і `splice(e->Rev, b)`.

## Алгоритм \{#algorithm}

Алгоритм обчислить тріангуляцію й поверне два quad-edge: ребро опуклої оболонки проти годинникової стрілки, що виходить із найлівішої вершини, і ребро опуклої оболонки за годинниковою стрілкою, що виходить із найправішої вершини.

Відсортуймо всі точки за x, а якщо $x_1 = x_2$ — то за y. Розв'яжемо задачу для деякого відрізка $(l, r)$ (початково $(l, r) = (0, n - 1)$). Якщо $r - l + 1 = 2$, ми додамо ребро $(p[l], p[r])$ і повернемо результат. Якщо $r - l + 1 = 3$, то спочатку додамо ребра $(p[l], p[l + 1])$ та $(p[l + 1], p[r])$. Також ми маємо з'єднати їх за допомогою `splice(a->Rev, b)`. Тепер потрібно замкнути трикутник. Наша наступна дія залежатиме від орієнтації точок $p[l], p[l + 1], p[r]$. Якщо вони колінеарні, ми не можемо утворити трикутник, тож просто повертаємо `(a, b->Rev)`. Інакше ми створюємо нове ребро `c`, викликаючи `connect(b, a)`. Якщо точки орієнтовані проти годинникової стрілки, повертаємо `(a, b->Rev)`. Інакше повертаємо `(c->Rev, c)`.

Тепер припустимо, що $r - l + 1 \ge 4$. Спочатку рекурсивно розв'яжемо $L = (l, \frac{l + r}{2})$ та $R = (\frac{l + r}{2} + 1, r)$. Тепер нам потрібно злити ці тріангуляції в одну. Зауважимо, що наші точки відсортовані, тож під час злиття ми додаватимемо ребра з L до R (так звані _перехресні_ ребра) і видалятимемо деякі ребра з L до L та з R до R.
Яка структура перехресних ребер? Усі ці ребра мають перетинати пряму, паралельну осі y та проведену через значення x, за яким відбувається розбиття. Це задає лінійний порядок на перехресних ребрах, тож ми можемо говорити про послідовні перехресні ребра, найнижче перехресне ребро тощо. Алгоритм додаватиме перехресні ребра у порядку зростання. Зауважимо, що будь-які два сусідні перехресні ребра матимуть спільний кінець, а третя сторона трикутника, який вони визначають, іде з L до L або з R до R. Назвімо поточне перехресне ребро базовим (base). Наступник базового ребра іде або з лівого кінця базового до одного з R-сусідів правого кінця, або навпаки.
Розглянемо описане коло базового та попереднього перехресного ребра.
Припустимо, що це коло перетворюється на інші кола, які мають базове ребро своєю хордою, але лежать далі в напрямку осі Oy.
Наше коло якийсь час підійматиметься вгору, але якщо базове ребро не є верхньою дотичною до L і R, ми натрапимо на точку, що належить або L, або R, і вона породить новий трикутник без жодної точки в його описаному колі.
Нове L-R ребро цього трикутника і є наступним доданим перехресним ребром.
Щоб робити це ефективно, ми обчислюємо два ребра `lcand` і `rcand` так, щоб `lcand` указувало на першу точку з L, на яку ми натрапимо в цьому процесі, а `rcand` — на першу точку з R.
Потім ми вибираємо ту з них, на яку натрапимо першою. Початково базове ребро вказує на нижню дотичну до L і R.

## Реалізація \{#implementation}

Зауважимо, що реалізація функції in_circle є специфічною для GCC.

<CodeTabs>

```cpp
typedef long long ll;

bool ge(const ll& a, const ll& b) { return a >= b; }
bool le(const ll& a, const ll& b) { return a <= b; }
bool eq(const ll& a, const ll& b) { return a == b; }
bool gt(const ll& a, const ll& b) { return a > b; }
bool lt(const ll& a, const ll& b) { return a < b; }
int sgn(const ll& a) { return a >= 0 ? a ? 1 : 0 : -1; }

struct pt {
    ll x, y;
    pt() { }
    pt(ll _x, ll _y) : x(_x), y(_y) { }
    pt operator-(const pt& p) const {
        return pt(x - p.x, y - p.y);
    }
    ll cross(const pt& p) const {
        return x * p.y - y * p.x;
    }
    ll cross(const pt& a, const pt& b) const {
        return (a - *this).cross(b - *this);
    }
    ll dot(const pt& p) const {
        return x * p.x + y * p.y;
    }
    ll dot(const pt& a, const pt& b) const {
        return (a - *this).dot(b - *this);
    }
    ll sqrLength() const {
        return this->dot(*this);
    }
    bool operator==(const pt& p) const {
        return eq(x, p.x) && eq(y, p.y);
    }
};

const pt inf_pt = pt(1e18, 1e18);

struct QuadEdge {
    pt origin;
    QuadEdge* rot = nullptr;
    QuadEdge* onext = nullptr;
    bool used = false;
    QuadEdge* rev() const {
        return rot->rot;
    }
    QuadEdge* lnext() const {
        return rot->rev()->onext->rot;
    }
    QuadEdge* oprev() const {
        return rot->onext->rot;
    }
    pt dest() const {
        return rev()->origin;
    }
};

QuadEdge* make_edge(pt from, pt to) {
    QuadEdge* e1 = new QuadEdge;
    QuadEdge* e2 = new QuadEdge;
    QuadEdge* e3 = new QuadEdge;
    QuadEdge* e4 = new QuadEdge;
    e1->origin = from;
    e2->origin = to;
    e3->origin = e4->origin = inf_pt;
    e1->rot = e3;
    e2->rot = e4;
    e3->rot = e2;
    e4->rot = e1;
    e1->onext = e1;
    e2->onext = e2;
    e3->onext = e4;
    e4->onext = e3;
    return e1;
}

void splice(QuadEdge* a, QuadEdge* b) {
    swap(a->onext->rot->onext, b->onext->rot->onext);
    swap(a->onext, b->onext);
}

void delete_edge(QuadEdge* e) {
    splice(e, e->oprev());
    splice(e->rev(), e->rev()->oprev());
    delete e->rev()->rot;
    delete e->rev();
    delete e->rot;
    delete e;
}

QuadEdge* connect(QuadEdge* a, QuadEdge* b) {
    QuadEdge* e = make_edge(a->dest(), b->origin);
    splice(e, a->lnext());
    splice(e->rev(), b);
    return e;
}

bool left_of(pt p, QuadEdge* e) {
    return gt(p.cross(e->origin, e->dest()), 0);
}

bool right_of(pt p, QuadEdge* e) {
    return lt(p.cross(e->origin, e->dest()), 0);
}

template <class T>
T det3(T a1, T a2, T a3, T b1, T b2, T b3, T c1, T c2, T c3) {
    return a1 * (b2 * c3 - c2 * b3) - a2 * (b1 * c3 - c1 * b3) +
           a3 * (b1 * c2 - c1 * b2);
}

bool in_circle(pt a, pt b, pt c, pt d) {
// Якщо є __int128, обчислюємо напряму.
// Інакше обчислюємо кути.
#if defined(__LP64__) || defined(_WIN64)
    __int128 det = -det3<__int128>(b.x, b.y, b.sqrLength(), c.x, c.y,
                                   c.sqrLength(), d.x, d.y, d.sqrLength());
    det += det3<__int128>(a.x, a.y, a.sqrLength(), c.x, c.y, c.sqrLength(), d.x,
                          d.y, d.sqrLength());
    det -= det3<__int128>(a.x, a.y, a.sqrLength(), b.x, b.y, b.sqrLength(), d.x,
                          d.y, d.sqrLength());
    det += det3<__int128>(a.x, a.y, a.sqrLength(), b.x, b.y, b.sqrLength(), c.x,
                          c.y, c.sqrLength());
    return det > 0;
#else
    auto ang = [](pt l, pt mid, pt r) {
        ll x = mid.dot(l, r);
        ll y = mid.cross(l, r);
        long double res = atan2((long double)x, (long double)y);
        return res;
    };
    long double kek = ang(a, b, c) + ang(c, d, a) - ang(b, c, d) - ang(d, a, b);
    if (kek > 1e-8)
        return true;
    else
        return false;
#endif
}

pair<QuadEdge*, QuadEdge*> build_tr(int l, int r, vector<pt>& p) {
    if (r - l + 1 == 2) {
        QuadEdge* res = make_edge(p[l], p[r]);
        return make_pair(res, res->rev());
    }
    if (r - l + 1 == 3) {
        QuadEdge *a = make_edge(p[l], p[l + 1]), *b = make_edge(p[l + 1], p[r]);
        splice(a->rev(), b);
        int sg = sgn(p[l].cross(p[l + 1], p[r]));
        if (sg == 0)
            return make_pair(a, b->rev());
        QuadEdge* c = connect(b, a);
        if (sg == 1)
            return make_pair(a, b->rev());
        else
            return make_pair(c->rev(), c);
    }
    int mid = (l + r) / 2;
    QuadEdge *ldo, *ldi, *rdo, *rdi;
    tie(ldo, ldi) = build_tr(l, mid, p);
    tie(rdi, rdo) = build_tr(mid + 1, r, p);
    while (true) {
        if (left_of(rdi->origin, ldi)) {
            ldi = ldi->lnext();
            continue;
        }
        if (right_of(ldi->origin, rdi)) {
            rdi = rdi->rev()->onext;
            continue;
        }
        break;
    }
    QuadEdge* basel = connect(rdi->rev(), ldi);
    auto valid = [&basel](QuadEdge* e) { return right_of(e->dest(), basel); };
    if (ldi->origin == ldo->origin)
        ldo = basel->rev();
    if (rdi->origin == rdo->origin)
        rdo = basel;
    while (true) {
        QuadEdge* lcand = basel->rev()->onext;
        if (valid(lcand)) {
            while (in_circle(basel->dest(), basel->origin, lcand->dest(),
                             lcand->onext->dest())) {
                QuadEdge* t = lcand->onext;
                delete_edge(lcand);
                lcand = t;
            }
        }
        QuadEdge* rcand = basel->oprev();
        if (valid(rcand)) {
            while (in_circle(basel->dest(), basel->origin, rcand->dest(),
                             rcand->oprev()->dest())) {
                QuadEdge* t = rcand->oprev();
                delete_edge(rcand);
                rcand = t;
            }
        }
        if (!valid(lcand) && !valid(rcand))
            break;
        if (!valid(lcand) ||
            (valid(rcand) && in_circle(lcand->dest(), lcand->origin,
                                       rcand->origin, rcand->dest())))
            basel = connect(rcand, basel->rev());
        else
            basel = connect(basel->rev(), lcand->rev());
    }
    return make_pair(ldo, rdo);
}

vector<tuple<pt, pt, pt>> delaunay(vector<pt> p) {
    sort(p.begin(), p.end(), [](const pt& a, const pt& b) {
        return lt(a.x, b.x) || (eq(a.x, b.x) && lt(a.y, b.y));
    });
    auto res = build_tr(0, (int)p.size() - 1, p);
    QuadEdge* e = res.first;
    vector<QuadEdge*> edges = {e};
    while (lt(e->onext->dest().cross(e->dest(), e->origin), 0))
        e = e->onext;
    auto add = [&p, &e, &edges]() {
        QuadEdge* curr = e;
        do {
            curr->used = true;
            p.push_back(curr->origin);
            edges.push_back(curr->rev());
            curr = curr->lnext();
        } while (curr != e);
    };
    add();
    p.clear();
    int kek = 0;
    while (kek < (int)edges.size()) {
        if (!(e = edges[kek++])->used)
            add();
    }
    vector<tuple<pt, pt, pt>> ans;
    for (int i = 0; i < (int)p.size(); i += 3) {
        ans.push_back(make_tuple(p[i], p[i + 1], p[i + 2]));
    }
    return ans;
}
```

```python
from typing import Optional


class Point:
    def __init__(self, x: int, y: int) -> None:
        self.x = x
        self.y = y

    def __sub__(self, p: "Point") -> "Point":
        return Point(self.x - p.x, self.y - p.y)

    def cross(self, p: "Point") -> int:
        return self.x * p.y - self.y * p.x

    def cross3(self, a: "Point", b: "Point") -> int:
        return (a - self).cross(b - self)

    def dot(self, p: "Point") -> int:
        return self.x * p.x + self.y * p.y

    def dot3(self, a: "Point", b: "Point") -> int:
        return (a - self).dot(b - self)

    def sqr_length(self) -> int:
        return self.dot(self)

    def __eq__(self, p: object) -> bool:
        return isinstance(p, Point) and self.x == p.x and self.y == p.y


INF_PT = Point(10 ** 18, 10 ** 18)


class QuadEdge:
    def __init__(self) -> None:
        self.origin: Point = INF_PT
        self.rot: Optional["QuadEdge"] = None
        self.onext: Optional["QuadEdge"] = None
        self.used = False

    def rev(self) -> "QuadEdge":
        return self.rot.rot

    def lnext(self) -> "QuadEdge":
        return self.rot.rev().onext.rot

    def oprev(self) -> "QuadEdge":
        return self.rot.onext.rot

    def dest(self) -> Point:
        return self.rev().origin


def make_edge(frm: Point, to: Point) -> QuadEdge:
    e1, e2, e3, e4 = QuadEdge(), QuadEdge(), QuadEdge(), QuadEdge()
    e1.origin = frm
    e2.origin = to
    e3.origin = e4.origin = INF_PT
    e1.rot, e2.rot, e3.rot, e4.rot = e3, e4, e2, e1
    e1.onext, e2.onext = e1, e2
    e3.onext, e4.onext = e4, e3
    return e1


def splice(a: QuadEdge, b: QuadEdge) -> None:
    # Міняємо місцями onext у двох парах ребер (у Python переставляємо
    # самі посилання на об'єкти, а не поля за вказівником, як у C++).
    a.onext.rot.onext, b.onext.rot.onext = b.onext.rot.onext, a.onext.rot.onext
    a.onext, b.onext = b.onext, a.onext


def delete_edge(e: QuadEdge) -> None:
    splice(e, e.oprev())
    splice(e.rev(), e.rev().oprev())
    # Пам'ять звільняє збирач сміття — явного delete немає.


def connect(a: QuadEdge, b: QuadEdge) -> QuadEdge:
    e = make_edge(a.dest(), b.origin)
    splice(e, a.lnext())
    splice(e.rev(), b)
    return e


def left_of(p: Point, e: QuadEdge) -> bool:
    return p.cross3(e.origin, e.dest()) > 0


def right_of(p: Point, e: QuadEdge) -> bool:
    return p.cross3(e.origin, e.dest()) < 0


def det3(a1, a2, a3, b1, b2, b3, c1, c2, c3):
    return (a1 * (b2 * c3 - c2 * b3) - a2 * (b1 * c3 - c1 * b3)
            + a3 * (b1 * c2 - c1 * b2))


def in_circle(a: Point, b: Point, c: Point, d: Point) -> bool:
    # Цілі в Python мають необмежену точність, тож предикат точний без
    # __int128 чи обчислення кутів (на відміну від спеціальних гілок у C++).
    det = -det3(b.x, b.y, b.sqr_length(), c.x, c.y, c.sqr_length(),
                d.x, d.y, d.sqr_length())
    det += det3(a.x, a.y, a.sqr_length(), c.x, c.y, c.sqr_length(),
                d.x, d.y, d.sqr_length())
    det -= det3(a.x, a.y, a.sqr_length(), b.x, b.y, b.sqr_length(),
                d.x, d.y, d.sqr_length())
    det += det3(a.x, a.y, a.sqr_length(), b.x, b.y, b.sqr_length(),
                c.x, c.y, c.sqr_length())
    return det > 0


def sgn(a: int) -> int:
    return (a > 0) - (a < 0)


def build_tr(l: int, r: int, p: list) -> tuple:
    if r - l + 1 == 2:
        res = make_edge(p[l], p[r])
        return res, res.rev()
    if r - l + 1 == 3:
        a = make_edge(p[l], p[l + 1])
        b = make_edge(p[l + 1], p[r])
        splice(a.rev(), b)
        sg = sgn(p[l].cross3(p[l + 1], p[r]))
        if sg == 0:
            return a, b.rev()
        c = connect(b, a)
        if sg == 1:
            return a, b.rev()
        return c.rev(), c
    mid = (l + r) // 2
    ldo, ldi = build_tr(l, mid, p)
    rdi, rdo = build_tr(mid + 1, r, p)
    while True:
        if left_of(rdi.origin, ldi):
            ldi = ldi.lnext()
            continue
        if right_of(ldi.origin, rdi):
            rdi = rdi.rev().onext
            continue
        break
    basel = connect(rdi.rev(), ldi)

    def valid(e: QuadEdge) -> bool:
        return right_of(e.dest(), basel)

    if ldi.origin == ldo.origin:
        ldo = basel.rev()
    if rdi.origin == rdo.origin:
        rdo = basel
    while True:
        lcand = basel.rev().onext
        if valid(lcand):
            while in_circle(basel.dest(), basel.origin, lcand.dest(),
                            lcand.onext.dest()):
                t = lcand.onext
                delete_edge(lcand)
                lcand = t
        rcand = basel.oprev()
        if valid(rcand):
            while in_circle(basel.dest(), basel.origin, rcand.dest(),
                            rcand.oprev().dest()):
                t = rcand.oprev()
                delete_edge(rcand)
                rcand = t
        if not valid(lcand) and not valid(rcand):
            break
        if (not valid(lcand)
                or (valid(rcand) and in_circle(lcand.dest(), lcand.origin,
                                               rcand.origin, rcand.dest()))):
            basel = connect(rcand, basel.rev())
        else:
            basel = connect(basel.rev(), lcand.rev())
    return ldo, rdo


def delaunay(p: list) -> list:
    p = sorted(p, key=lambda a: (a.x, a.y))
    res = build_tr(0, len(p) - 1, p)
    e = res[0]
    edges = [e]
    while e.onext.dest().cross3(e.dest(), e.origin) < 0:
        e = e.onext
    pts: list = []

    def add() -> None:
        nonlocal e
        curr = e
        while True:
            curr.used = True
            pts.append(curr.origin)
            edges.append(curr.rev())
            curr = curr.lnext()
            if curr == e:
                break

    add()
    pts.clear()
    kek = 0
    while kek < len(edges):
        e = edges[kek]
        kek += 1
        if not e.used:
            add()
    ans = []
    for i in range(0, len(pts), 3):
        ans.append((pts[i], pts[i + 1], pts[i + 2]))
    return ans
```

```typescript
// Координати — bigint, бо проміжний визначник предиката in_circle
// перевищує 64 біти (аналог гілки з __int128 у C++).

class Pt {
  constructor(public x: bigint, public y: bigint) {}

  sub(p: Pt): Pt {
    return new Pt(this.x - p.x, this.y - p.y);
  }
  cross(p: Pt): bigint {
    return this.x * p.y - this.y * p.x;
  }
  cross3(a: Pt, b: Pt): bigint {
    return a.sub(this).cross(b.sub(this));
  }
  dot(p: Pt): bigint {
    return this.x * p.x + this.y * p.y;
  }
  dot3(a: Pt, b: Pt): bigint {
    return a.sub(this).dot(b.sub(this));
  }
  sqrLength(): bigint {
    return this.dot(this);
  }
  eq(p: Pt): boolean {
    return this.x === p.x && this.y === p.y;
  }
}

const INF_PT = new Pt(10n ** 18n, 10n ** 18n);

class QuadEdge {
  origin: Pt = INF_PT;
  rot!: QuadEdge;
  onext!: QuadEdge;
  used = false;

  rev(): QuadEdge {
    return this.rot.rot;
  }
  lnext(): QuadEdge {
    return this.rot.rev().onext.rot;
  }
  oprev(): QuadEdge {
    return this.rot.onext.rot;
  }
  dest(): Pt {
    return this.rev().origin;
  }
}

function makeEdge(from: Pt, to: Pt): QuadEdge {
  const e1 = new QuadEdge();
  const e2 = new QuadEdge();
  const e3 = new QuadEdge();
  const e4 = new QuadEdge();
  e1.origin = from;
  e2.origin = to;
  e3.origin = e4.origin = INF_PT;
  e1.rot = e3;
  e2.rot = e4;
  e3.rot = e2;
  e4.rot = e1;
  e1.onext = e1;
  e2.onext = e2;
  e3.onext = e4;
  e4.onext = e3;
  return e1;
}

function splice(a: QuadEdge, b: QuadEdge): void {
  const ar = a.onext.rot;
  const br = b.onext.rot;
  [ar.onext, br.onext] = [br.onext, ar.onext];
  [a.onext, b.onext] = [b.onext, a.onext];
}

function deleteEdge(e: QuadEdge): void {
  splice(e, e.oprev());
  splice(e.rev(), e.rev().oprev());
  // Збирач сміття звільнить ребра — явного delete немає.
}

function connect(a: QuadEdge, b: QuadEdge): QuadEdge {
  const e = makeEdge(a.dest(), b.origin);
  splice(e, a.lnext());
  splice(e.rev(), b);
  return e;
}

function leftOf(p: Pt, e: QuadEdge): boolean {
  return p.cross3(e.origin, e.dest()) > 0n;
}

function rightOf(p: Pt, e: QuadEdge): boolean {
  return p.cross3(e.origin, e.dest()) < 0n;
}

function det3(
  a1: bigint, a2: bigint, a3: bigint,
  b1: bigint, b2: bigint, b3: bigint,
  c1: bigint, c2: bigint, c3: bigint,
): bigint {
  return a1 * (b2 * c3 - c2 * b3) - a2 * (b1 * c3 - c1 * b3) +
    a3 * (b1 * c2 - c1 * b2);
}

function inCircle(a: Pt, b: Pt, c: Pt, d: Pt): boolean {
  // BigInt дає точну арифметику — еквівалент гілки з __int128 у C++.
  let det = -det3(b.x, b.y, b.sqrLength(), c.x, c.y, c.sqrLength(),
    d.x, d.y, d.sqrLength());
  det += det3(a.x, a.y, a.sqrLength(), c.x, c.y, c.sqrLength(),
    d.x, d.y, d.sqrLength());
  det -= det3(a.x, a.y, a.sqrLength(), b.x, b.y, b.sqrLength(),
    d.x, d.y, d.sqrLength());
  det += det3(a.x, a.y, a.sqrLength(), b.x, b.y, b.sqrLength(),
    c.x, c.y, c.sqrLength());
  return det > 0n;
}

function sgn(a: bigint): number {
  return a > 0n ? 1 : a < 0n ? -1 : 0;
}

function buildTr(l: number, r: number, p: Pt[]): [QuadEdge, QuadEdge] {
  if (r - l + 1 === 2) {
    const res = makeEdge(p[l], p[r]);
    return [res, res.rev()];
  }
  if (r - l + 1 === 3) {
    const a = makeEdge(p[l], p[l + 1]);
    const b = makeEdge(p[l + 1], p[r]);
    splice(a.rev(), b);
    const sg = sgn(p[l].cross3(p[l + 1], p[r]));
    if (sg === 0) return [a, b.rev()];
    const c = connect(b, a);
    if (sg === 1) return [a, b.rev()];
    return [c.rev(), c];
  }
  const mid = (l + r) >> 1;
  let [ldo, ldi] = buildTr(l, mid, p);
  let [rdi, rdo] = buildTr(mid + 1, r, p);
  while (true) {
    if (leftOf(rdi.origin, ldi)) {
      ldi = ldi.lnext();
      continue;
    }
    if (rightOf(ldi.origin, rdi)) {
      rdi = rdi.rev().onext;
      continue;
    }
    break;
  }
  let basel = connect(rdi.rev(), ldi);
  const valid = (e: QuadEdge): boolean => rightOf(e.dest(), basel);
  if (ldi.origin.eq(ldo.origin)) ldo = basel.rev();
  if (rdi.origin.eq(rdo.origin)) rdo = basel;
  while (true) {
    let lcand = basel.rev().onext;
    if (valid(lcand)) {
      while (inCircle(basel.dest(), basel.origin, lcand.dest(),
        lcand.onext.dest())) {
        const t = lcand.onext;
        deleteEdge(lcand);
        lcand = t;
      }
    }
    let rcand = basel.oprev();
    if (valid(rcand)) {
      while (inCircle(basel.dest(), basel.origin, rcand.dest(),
        rcand.oprev().dest())) {
        const t = rcand.oprev();
        deleteEdge(rcand);
        rcand = t;
      }
    }
    if (!valid(lcand) && !valid(rcand)) break;
    if (!valid(lcand) ||
      (valid(rcand) && inCircle(lcand.dest(), lcand.origin,
        rcand.origin, rcand.dest()))) {
      basel = connect(rcand, basel.rev());
    } else {
      basel = connect(basel.rev(), lcand.rev());
    }
  }
  return [ldo, rdo];
}

function delaunay(input: Pt[]): [Pt, Pt, Pt][] {
  const p = [...input].sort((a, b) =>
    a.x < b.x ? -1 : a.x > b.x ? 1 : a.y < b.y ? -1 : a.y > b.y ? 1 : 0);
  const res = buildTr(0, p.length - 1, p);
  let e = res[0];
  const edges: QuadEdge[] = [e];
  while (e.onext.dest().cross3(e.dest(), e.origin) < 0n) {
    e = e.onext;
  }
  const pts: Pt[] = [];
  const add = (): void => {
    let curr = e;
    do {
      curr.used = true;
      pts.push(curr.origin);
      edges.push(curr.rev());
      curr = curr.lnext();
    } while (curr !== e);
  };
  add();
  pts.length = 0;
  let kek = 0;
  while (kek < edges.length) {
    e = edges[kek++];
    if (!e.used) add();
  }
  const ans: [Pt, Pt, Pt][] = [];
  for (let i = 0; i < pts.length; i += 3) {
    ans.push([pts[i], pts[i + 1], pts[i + 2]]);
  }
  return ans;
}
```

```go
// Координати — int64; предикат in_circle обчислюється через math/big.Int,
// бо проміжний визначник перевищує 64 біти (аналог __int128 у C++).

import (
	"math/big"
	"sort"
)

type Pt struct {
	x, y int64
}

func (p Pt) sub(q Pt) Pt {
	return Pt{p.x - q.x, p.y - q.y}
}
func (p Pt) cross(q Pt) int64 {
	return p.x*q.y - p.y*q.x
}
func (p Pt) cross3(a, b Pt) int64 {
	return a.sub(p).cross(b.sub(p))
}
func (p Pt) dot(q Pt) int64 {
	return p.x*q.x + p.y*q.y
}
func (p Pt) dot3(a, b Pt) int64 {
	return a.sub(p).dot(b.sub(p))
}
func (p Pt) sqrLength() int64 {
	return p.dot(p)
}
func (p Pt) eq(q Pt) bool {
	return p.x == q.x && p.y == q.y
}

var infPt = Pt{1_000_000_000_000_000_000, 1_000_000_000_000_000_000}

// QuadEdge — вузол структури «чотириребро»; зв'язки тримаємо через вказівники.
type QuadEdge struct {
	origin Pt
	rot    *QuadEdge
	onext  *QuadEdge
	used   bool
}

func (e *QuadEdge) rev() *QuadEdge {
	return e.rot.rot
}
func (e *QuadEdge) lnext() *QuadEdge {
	return e.rot.rev().onext.rot
}
func (e *QuadEdge) oprev() *QuadEdge {
	return e.rot.onext.rot
}
func (e *QuadEdge) dest() Pt {
	return e.rev().origin
}

func makeEdge(from, to Pt) *QuadEdge {
	e1, e2, e3, e4 := &QuadEdge{}, &QuadEdge{}, &QuadEdge{}, &QuadEdge{}
	e1.origin = from
	e2.origin = to
	e3.origin, e4.origin = infPt, infPt
	e1.rot, e2.rot, e3.rot, e4.rot = e3, e4, e2, e1
	e1.onext, e2.onext = e1, e2
	e3.onext, e4.onext = e4, e3
	return e1
}

func splice(a, b *QuadEdge) {
	ar := a.onext.rot
	br := b.onext.rot
	ar.onext, br.onext = br.onext, ar.onext
	a.onext, b.onext = b.onext, a.onext
}

func deleteEdge(e *QuadEdge) {
	splice(e, e.oprev())
	splice(e.rev(), e.rev().oprev())
	// Збирач сміття Go звільнить ребра — явного delete немає.
}

func connect(a, b *QuadEdge) *QuadEdge {
	e := makeEdge(a.dest(), b.origin)
	splice(e, a.lnext())
	splice(e.rev(), b)
	return e
}

func leftOf(p Pt, e *QuadEdge) bool {
	return p.cross3(e.origin, e.dest()) > 0
}

func rightOf(p Pt, e *QuadEdge) bool {
	return p.cross3(e.origin, e.dest()) < 0
}

// det3big — визначник 3×3 у big.Int (усі аргументи теж big.Int).
func det3big(a1, a2, a3, b1, b2, b3, c1, c2, c3 *big.Int) *big.Int {
	mul := func(x, y *big.Int) *big.Int { return new(big.Int).Mul(x, y) }
	sub := func(x, y *big.Int) *big.Int { return new(big.Int).Sub(x, y) }
	add := func(x, y *big.Int) *big.Int { return new(big.Int).Add(x, y) }
	m1 := mul(a1, sub(mul(b2, c3), mul(c2, b3)))
	m2 := mul(a2, sub(mul(b1, c3), mul(c1, b3)))
	m3 := mul(a3, sub(mul(b1, c2), mul(c1, b2)))
	return add(sub(m1, m2), m3)
}

func bi(v int64) *big.Int { return big.NewInt(v) }

func inCircle(a, b, c, d Pt) bool {
	det := new(big.Int)
	det.Sub(det, det3big(bi(b.x), bi(b.y), bi(b.sqrLength()),
		bi(c.x), bi(c.y), bi(c.sqrLength()),
		bi(d.x), bi(d.y), bi(d.sqrLength())))
	det.Add(det, det3big(bi(a.x), bi(a.y), bi(a.sqrLength()),
		bi(c.x), bi(c.y), bi(c.sqrLength()),
		bi(d.x), bi(d.y), bi(d.sqrLength())))
	det.Sub(det, det3big(bi(a.x), bi(a.y), bi(a.sqrLength()),
		bi(b.x), bi(b.y), bi(b.sqrLength()),
		bi(d.x), bi(d.y), bi(d.sqrLength())))
	det.Add(det, det3big(bi(a.x), bi(a.y), bi(a.sqrLength()),
		bi(b.x), bi(b.y), bi(b.sqrLength()),
		bi(c.x), bi(c.y), bi(c.sqrLength())))
	return det.Sign() > 0
}

func sgn(a int64) int {
	if a > 0 {
		return 1
	}
	if a < 0 {
		return -1
	}
	return 0
}

func buildTr(l, r int, p []Pt) (*QuadEdge, *QuadEdge) {
	if r-l+1 == 2 {
		res := makeEdge(p[l], p[r])
		return res, res.rev()
	}
	if r-l+1 == 3 {
		a := makeEdge(p[l], p[l+1])
		b := makeEdge(p[l+1], p[r])
		splice(a.rev(), b)
		sg := sgn(p[l].cross3(p[l+1], p[r]))
		if sg == 0 {
			return a, b.rev()
		}
		c := connect(b, a)
		if sg == 1 {
			return a, b.rev()
		}
		return c.rev(), c
	}
	mid := (l + r) / 2
	ldo, ldi := buildTr(l, mid, p)
	rdi, rdo := buildTr(mid+1, r, p)
	for {
		if leftOf(rdi.origin, ldi) {
			ldi = ldi.lnext()
			continue
		}
		if rightOf(ldi.origin, rdi) {
			rdi = rdi.rev().onext
			continue
		}
		break
	}
	basel := connect(rdi.rev(), ldi)
	valid := func(e *QuadEdge) bool { return rightOf(e.dest(), basel) }
	if ldi.origin.eq(ldo.origin) {
		ldo = basel.rev()
	}
	if rdi.origin.eq(rdo.origin) {
		rdo = basel
	}
	for {
		lcand := basel.rev().onext
		if valid(lcand) {
			for inCircle(basel.dest(), basel.origin, lcand.dest(),
				lcand.onext.dest()) {
				t := lcand.onext
				deleteEdge(lcand)
				lcand = t
			}
		}
		rcand := basel.oprev()
		if valid(rcand) {
			for inCircle(basel.dest(), basel.origin, rcand.dest(),
				rcand.oprev().dest()) {
				t := rcand.oprev()
				deleteEdge(rcand)
				rcand = t
			}
		}
		if !valid(lcand) && !valid(rcand) {
			break
		}
		if !valid(lcand) ||
			(valid(rcand) && inCircle(lcand.dest(), lcand.origin,
				rcand.origin, rcand.dest())) {
			basel = connect(rcand, basel.rev())
		} else {
			basel = connect(basel.rev(), lcand.rev())
		}
	}
	return ldo, rdo
}

func delaunay(input []Pt) [][3]Pt {
	p := make([]Pt, len(input))
	copy(p, input)
	sort.Slice(p, func(i, j int) bool {
		if p[i].x != p[j].x {
			return p[i].x < p[j].x
		}
		return p[i].y < p[j].y
	})
	first, _ := buildTr(0, len(p)-1, p)
	e := first
	edges := []*QuadEdge{e}
	for e.onext.dest().cross3(e.dest(), e.origin) < 0 {
		e = e.onext
	}
	var pts []Pt
	add := func() {
		curr := e
		for {
			curr.used = true
			pts = append(pts, curr.origin)
			edges = append(edges, curr.rev())
			curr = curr.lnext()
			if curr == e {
				break
			}
		}
	}
	add()
	pts = pts[:0]
	kek := 0
	for kek < len(edges) {
		e = edges[kek]
		kek++
		if !e.used {
			add()
		}
	}
	var ans [][3]Pt
	for i := 0; i < len(pts); i += 3 {
		ans = append(ans, [3]Pt{pts[i], pts[i+1], pts[i+2]})
	}
	return ans
}
```

</CodeTabs>

## Задачі \{#problems}
 * [TIMUS 1504 Good Manners](http://acm.timus.ru/problem.aspx?space=1&num=1504)
 * [TIMUS 1520 Empire Strikes Back](http://acm.timus.ru/problem.aspx?space=1&num=1520)
 * [SGU 383 Caravans](https://codeforces.com/problemsets/acmsguru/problem/99999/383)

## Відеоматеріали \{#video}

<YouTubeEmbed id="6UsdvbiJx54" title="Delaunay Triangulation (1/5) | Computational Geometry - Lecture 08 — Philipp Kindermann" />
