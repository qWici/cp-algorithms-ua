# Вертикальна декомпозиція

## Огляд \{#overview}
Вертикальна декомпозиція — це потужна техніка, яку застосовують у різноманітних геометричних задачах. Загальна ідея полягає в тому, щоб розрізати площину на кілька вертикальних смуг
з певними «хорошими» властивостями і розв'язати задачу для цих смуг незалежно. Проілюструємо цю ідею на кількох прикладах.

## Площа об'єднання трикутників \{#area-of-the-union-of-triangles}
Припустимо, що на площині задано $n$ трикутників і нам потрібно знайти площу їх об'єднання. Задача була б легкою, якби трикутники не перетиналися, тому
позбудьмося цих перетинів, розбивши площину на вертикальні смуги шляхом проведення вертикальних прямих через усі вершини й усі точки перетину
сторін різних трикутників. Таких прямих може бути $O(n^2)$, тож ми отримали $O(n^2)$ смуг. Тепер розглянемо деяку вертикальну смугу. Кожен невертикальний відрізок або перетинає її зліва направо, або не перетинає взагалі.
Крім того, жодні два відрізки не перетинаються строго всередині смуги. Це означає, що частина об'єднання трикутників, яка лежить усередині цієї смуги, складається з неперетинних трапецій, основи яких лежать на сторонах смуги.
Ця властивість дозволяє нам обчислити площу всередині кожної смуги за допомогою такого scanline-алгоритму. Кожен відрізок, що перетинає смугу, є або верхнім, або нижнім, залежно від того, чи лежить внутрішня область відповідного трикутника
вище чи нижче від відрізка. Ми можемо уявити кожен верхній відрізок як відкриваючу дужку, а кожен нижній відрізок — як закриваючу дужку, і декомпозувати смугу на трапеції, розбиваючи дужкову послідовність на менші правильні дужкові послідовності. Цей алгоритм потребує $O(n^3\log n)$ часу і $O(n^2)$ пам'яті.
### Оптимізація 1 \{#optimization-1}
Спершу ми зменшимо час роботи до $O(n^2\log n)$. Замість того щоб генерувати трапеції для кожної смуги, зафіксуймо деяку сторону трикутника (відрізок $s = (s_0, s_1)$) і знайдімо множину смуг, де цей відрізок є стороною деякої трапеції. Зауважимо, що в цьому випадку нам потрібно лише знайти смуги, де баланс дужок під (або над, у випадку нижнього відрізка) $s$ дорівнює нулю. Це означає, що замість запуску вертикальної замітальної прямої для кожної смуги ми можемо запустити горизонтальну замітальну пряму для всіх частин інших відрізків, які впливають на баланс дужок відносно $s$.
Для простоти ми покажемо, як це зробити для верхнього відрізка; алгоритм для нижніх відрізків аналогічний. Розгляньмо деякий інший невертикальний відрізок $t = (t_0, t_1)$ і знайдімо перетин $[x_1, x_2]$ проєкцій $s$ і $t$ на $Ox$. Якщо цей перетин порожній або складається з однієї точки, $t$ можна відкинути, оскільки $s$ і $t$ не перетинають внутрішню область однієї і тієї ж смуги. Інакше розгляньмо перетин $I$ відрізків $s$ і $t$. Є три випадки.

1.  $I = \varnothing$

    У цьому випадку $t$ лежить або вище, або нижче від $s$ на $[x_1, x_2]$. Якщо $t$ лежить вище, це не впливає на те, чи є $s$ стороною деякої трапеції.
    Якщо $t$ лежить нижче від $s$, ми маємо додати $1$ або $-1$ до балансу дужкових послідовностей для всіх смуг на $[x_1, x_2]$, залежно від того, чи є $t$ верхнім, чи нижнім.

2.  $I$ складається з єдиної точки $p$

    Цей випадок можна звести до попереднього, розбивши $[x_1, x_2]$ на $[x_1, p_x]$ і $[p_x, x_2]$.

3.  $I$ — деякий відрізок $l$

    Цей випадок означає, що частини $s$ і $t$ для $x\in[x_1, x_2]$ збігаються. Якщо $t$ нижній, $s$ очевидно не є стороною трапеції.
    Інакше може статися, що і $s$, і $t$ можуть розглядатися як сторона деякої трапеції. Щоб розв'язати цю неоднозначність, ми можемо
    вирішити, що стороною слід вважати лише відрізок з найменшим індексом (тут ми припускаємо, що сторони трикутників якимось чином пронумеровані). Отже, якщо $index(s) < index(t)$, цей випадок слід проігнорувати,
    інакше нам слід позначити, що $s$ ніколи не може бути стороною на $[x_1, x_2]$ (наприклад, додавши відповідну подію з балансом $-2$).

Ось графічне зображення цих трьох випадків.

<center> <img src="/img/docs/geometry/triangle_union.png" alt="Visual" /> </center>

Насамкінець варто зауважити щодо обробки всіх додавань $1$ або $-1$ на всіх смугах у $[x_1, x_2]$. Для кожного додавання $w$ на $[x_1, x_2]$ ми можемо створити події $(x_1, w),\ (x_2, -w)$
й обробити всі ці події замітальною прямою.

### Оптимізація 2 \{#optimization-2}
Зауважимо, що якщо ми застосуємо попередню оптимізацію, нам більше не потрібно явно знаходити всі смуги. Це зменшує споживання пам'яті до $O(n)$.

## Перетин опуклих многокутників \{#intersection-of-convex-polygons}
Інше застосування вертикальної декомпозиції — обчислення перетину двох опуклих многокутників за лінійний час. Припустимо, що площину розбито на вертикальні смуги вертикальними прямими, які проходять через кожну
вершину кожного многокутника. Тоді, якщо ми розглянемо один із вхідних многокутників і деяку смугу, їхній перетин є або трапецією, або трикутником, або точкою. Тому ми можемо просто перетнути ці фігури для кожної вертикальної смуги і об'єднати ці перетини в єдиний многокутник.

## Реалізація \{#implementation}

Нижче наведено код, який обчислює площу об'єднання набору трикутників за $O(n^2\log n)$ часу і $O(n)$ пам'яті.

<CodeTabs>

```cpp
typedef double dbl;

const dbl eps = 1e-9;
 
inline bool eq(dbl x, dbl y){
    return fabs(x - y) < eps;
}
 
inline bool lt(dbl x, dbl y){
    return x < y - eps;
}
 
inline bool gt(dbl x, dbl y){
    return x > y + eps;
}
 
inline bool le(dbl x, dbl y){
    return x < y + eps;
}
 
inline bool ge(dbl x, dbl y){
    return x > y - eps;
}
 
struct pt{
    dbl x, y;
    inline pt operator - (const pt & p)const{
        return pt{x - p.x, y - p.y};
    }
    inline pt operator + (const pt & p)const{
        return pt{x + p.x, y + p.y};
    }
    inline pt operator * (dbl a)const{
        return pt{x * a, y * a};
    }
    inline dbl cross(const pt & p)const{
        return x * p.y - y * p.x;
    }
    inline dbl dot(const pt & p)const{
        return x * p.x + y * p.y;
    }
    inline bool operator == (const pt & p)const{
        return eq(x, p.x) && eq(y, p.y);
    }
};
 
struct Line{
    pt p[2];
    Line(){}
    Line(pt a, pt b):p{a, b}{}
    pt vec()const{
        return p[1] - p[0];
    }
    pt& operator [](size_t i){
        return p[i];
    }
};
 
inline bool lexComp(const pt & l, const pt & r){
	if(fabs(l.x - r.x) > eps){
		return l.x < r.x;
	}
	else return l.y < r.y;
}
 
vector<pt> interSegSeg(Line l1, Line l2){
    if(eq(l1.vec().cross(l2.vec()), 0)){
        if(!eq(l1.vec().cross(l2[0] - l1[0]), 0))
            return {};
        if(!lexComp(l1[0], l1[1]))
            swap(l1[0], l1[1]);
        if(!lexComp(l2[0], l2[1]))
            swap(l2[0], l2[1]);
        pt l = lexComp(l1[0], l2[0]) ? l2[0] : l1[0];
        pt r = lexComp(l1[1], l2[1]) ? l1[1] : l2[1];
        if(l == r)
            return {l};
        else return lexComp(l, r) ? vector<pt>{l, r} : vector<pt>();
    }
    else{
        dbl s = (l2[0] - l1[0]).cross(l2.vec()) / l1.vec().cross(l2.vec());
        pt inter = l1[0] + l1.vec() * s;
        if(ge(s, 0) && le(s, 1) && le((l2[0] - inter).dot(l2[1] - inter), 0))
            return {inter};
        else
            return {};
    }
}
inline char get_segtype(Line segment, pt other_point){
    if(eq(segment[0].x, segment[1].x))
        return 0;
    if(!lexComp(segment[0], segment[1]))
        swap(segment[0], segment[1]);
    return (segment[1] - segment[0]).cross(other_point - segment[0]) > 0 ? 1 : -1;
}
 
dbl union_area(vector<tuple<pt, pt, pt> > triangles){
    vector<Line> segments(3 * triangles.size());
    vector<char> segtype(segments.size());
    for(size_t i = 0; i < triangles.size(); i++){
        pt a, b, c;
        tie(a, b, c) = triangles[i];
        segments[3 * i] = lexComp(a, b) ? Line(a, b) : Line(b, a);
        segtype[3 * i] = get_segtype(segments[3 * i], c);
        segments[3 * i + 1] = lexComp(b, c) ? Line(b, c) : Line(c, b);
        segtype[3 * i + 1] = get_segtype(segments[3 * i + 1], a);
        segments[3 * i + 2] = lexComp(c, a) ? Line(c, a) : Line(a, c);
        segtype[3 * i + 2] = get_segtype(segments[3 * i + 2], b);
    }
    vector<dbl> k(segments.size()), b(segments.size());
    for(size_t i = 0; i < segments.size(); i++){
        if(segtype[i]){
            k[i] = (segments[i][1].y - segments[i][0].y) / (segments[i][1].x - segments[i][0].x);
            b[i] = segments[i][0].y - k[i] * segments[i][0].x;
        }
    }
    dbl ans = 0;
    for(size_t i = 0; i < segments.size(); i++){
        if(!segtype[i])
            continue;
        dbl l = segments[i][0].x, r = segments[i][1].x;
        vector<pair<dbl, int> > evts;
        for(size_t j = 0; j < segments.size(); j++){
            if(!segtype[j] || i == j)
                continue;
            dbl l1 = segments[j][0].x, r1 = segments[j][1].x;
            if(ge(l1, r) || ge(l, r1))
                continue;
            dbl common_l = max(l, l1), common_r = min(r, r1);
            auto pts = interSegSeg(segments[i], segments[j]);
            if(pts.empty()){
                dbl yl1 = k[j] * common_l + b[j];
                dbl yl = k[i] * common_l + b[i];
                if(lt(yl1, yl) == (segtype[i] == 1)){
                    int evt_type = -segtype[i] * segtype[j];
                    evts.emplace_back(common_l, evt_type);
                    evts.emplace_back(common_r, -evt_type);
                }
            }
            else if(pts.size() == 1u){
                dbl yl = k[i] * common_l + b[i], yl1 = k[j] * common_l + b[j];
                int evt_type = -segtype[i] * segtype[j];
                if(lt(yl1, yl) == (segtype[i] == 1)){
                    evts.emplace_back(common_l, evt_type);
                    evts.emplace_back(pts[0].x, -evt_type);
                }
                yl = k[i] * common_r + b[i], yl1 = k[j] * common_r + b[j];
                if(lt(yl1, yl) == (segtype[i] == 1)){
                    evts.emplace_back(pts[0].x, evt_type);
                    evts.emplace_back(common_r, -evt_type);
                }
            }
            else{
                if(segtype[j] != segtype[i] || j > i){
                    evts.emplace_back(common_l, -2);
                    evts.emplace_back(common_r, 2);
                }
            }
        }
        evts.emplace_back(l, 0);
        sort(evts.begin(), evts.end());
        size_t j = 0;
        int balance = 0;
        while(j < evts.size()){
            size_t ptr = j;
            while(ptr < evts.size() && eq(evts[j].first, evts[ptr].first)){
                balance += evts[ptr].second;
                ++ptr;
            }
            if(!balance && !eq(evts[j].first, r)){
                dbl next_x = ptr == evts.size() ? r : evts[ptr].first;
                ans -= segtype[i] * (k[i] * (next_x + evts[j].first) + 2 * b[i]) * (next_x - evts[j].first);
            }
            j = ptr;
        }
    }
    return ans/2;
}

```

```python
from math import fabs

EPS = 1e-9


def eq(x, y):
    return fabs(x - y) < EPS


def lt(x, y):
    return x < y - EPS


def le(x, y):
    return x < y + EPS


def ge(x, y):
    return x > y - EPS


class Pt:
    __slots__ = ("x", "y")

    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __sub__(self, p):
        return Pt(self.x - p.x, self.y - p.y)

    def __add__(self, p):
        return Pt(self.x + p.x, self.y + p.y)

    def mul(self, a):
        return Pt(self.x * a, self.y * a)

    def cross(self, p):
        return self.x * p.y - self.y * p.x

    def dot(self, p):
        return self.x * p.x + self.y * p.y

    def eqp(self, p):
        return eq(self.x, p.x) and eq(self.y, p.y)


def vec(line):
    # напрямний вектор відрізка
    return line[1] - line[0]


def lex_comp(l, r):
    if fabs(l.x - r.x) > EPS:
        return l.x < r.x
    return l.y < r.y


def inter_seg_seg(l1, l2):
    # перетин двох відрізків: повертає список з 0, 1 або 2 точок
    l1 = [l1[0], l1[1]]
    l2 = [l2[0], l2[1]]
    if eq(vec(l1).cross(vec(l2)), 0):
        if not eq(vec(l1).cross(l2[0] - l1[0]), 0):
            return []
        if not lex_comp(l1[0], l1[1]):
            l1[0], l1[1] = l1[1], l1[0]
        if not lex_comp(l2[0], l2[1]):
            l2[0], l2[1] = l2[1], l2[0]
        l = l2[0] if lex_comp(l1[0], l2[0]) else l1[0]
        r = l1[1] if lex_comp(l1[1], l2[1]) else l2[1]
        if l.eqp(r):
            return [l]
        return [l, r] if lex_comp(l, r) else []
    else:
        s = (l2[0] - l1[0]).cross(vec(l2)) / vec(l1).cross(vec(l2))
        inter = l1[0] + vec(l1).mul(s)
        if ge(s, 0) and le(s, 1) and le((l2[0] - inter).dot(l2[1] - inter), 0):
            return [inter]
        return []


def get_segtype(segment, other_point):
    # 0 — вертикальний; 1 — внутрішня область вище; -1 — нижче
    seg = [segment[0], segment[1]]
    if eq(seg[0].x, seg[1].x):
        return 0
    if not lex_comp(seg[0], seg[1]):
        seg[0], seg[1] = seg[1], seg[0]
    return 1 if (seg[1] - seg[0]).cross(other_point - seg[0]) > 0 else -1


def union_area(triangles):
    n = len(triangles)
    segments = [None] * (3 * n)
    segtype = [0] * (3 * n)
    for i in range(n):
        a, b, c = triangles[i]
        segments[3 * i] = [a, b] if lex_comp(a, b) else [b, a]
        segtype[3 * i] = get_segtype(segments[3 * i], c)
        segments[3 * i + 1] = [b, c] if lex_comp(b, c) else [c, b]
        segtype[3 * i + 1] = get_segtype(segments[3 * i + 1], a)
        segments[3 * i + 2] = [c, a] if lex_comp(c, a) else [a, c]
        segtype[3 * i + 2] = get_segtype(segments[3 * i + 2], b)
    m = len(segments)
    k = [0.0] * m
    b = [0.0] * m
    for i in range(m):
        if segtype[i]:
            k[i] = (segments[i][1].y - segments[i][0].y) / (segments[i][1].x - segments[i][0].x)
            b[i] = segments[i][0].y - k[i] * segments[i][0].x
    ans = 0.0
    for i in range(m):
        if not segtype[i]:
            continue
        l = segments[i][0].x
        r = segments[i][1].x
        evts = []
        for j in range(m):
            if not segtype[j] or i == j:
                continue
            l1 = segments[j][0].x
            r1 = segments[j][1].x
            if ge(l1, r) or ge(l, r1):
                continue
            common_l = max(l, l1)
            common_r = min(r, r1)
            pts = inter_seg_seg(segments[i], segments[j])
            if not pts:
                yl1 = k[j] * common_l + b[j]
                yl = k[i] * common_l + b[i]
                if lt(yl1, yl) == (segtype[i] == 1):
                    evt_type = -segtype[i] * segtype[j]
                    evts.append((common_l, evt_type))
                    evts.append((common_r, -evt_type))
            elif len(pts) == 1:
                yl = k[i] * common_l + b[i]
                yl1 = k[j] * common_l + b[j]
                evt_type = -segtype[i] * segtype[j]
                if lt(yl1, yl) == (segtype[i] == 1):
                    evts.append((common_l, evt_type))
                    evts.append((pts[0].x, -evt_type))
                yl = k[i] * common_r + b[i]
                yl1 = k[j] * common_r + b[j]
                if lt(yl1, yl) == (segtype[i] == 1):
                    evts.append((pts[0].x, evt_type))
                    evts.append((common_r, -evt_type))
            else:
                if segtype[j] != segtype[i] or j > i:
                    evts.append((common_l, -2))
                    evts.append((common_r, 2))
        evts.append((l, 0))
        evts.sort()
        j = 0
        balance = 0
        while j < len(evts):
            ptr = j
            while ptr < len(evts) and eq(evts[j][0], evts[ptr][0]):
                balance += evts[ptr][1]
                ptr += 1
            if not balance and not eq(evts[j][0], r):
                next_x = r if ptr == len(evts) else evts[ptr][0]
                ans -= segtype[i] * (k[i] * (next_x + evts[j][0]) + 2 * b[i]) * (next_x - evts[j][0])
            j = ptr
    return ans / 2
```

```typescript
const EPS = 1e-9;

function eq(x: number, y: number): boolean {
    return Math.abs(x - y) < EPS;
}

function lt(x: number, y: number): boolean {
    return x < y - EPS;
}

function le(x: number, y: number): boolean {
    return x < y + EPS;
}

function ge(x: number, y: number): boolean {
    return x > y - EPS;
}

class Pt {
    constructor(public x: number, public y: number) {}

    sub(p: Pt): Pt {
        return new Pt(this.x - p.x, this.y - p.y);
    }

    add(p: Pt): Pt {
        return new Pt(this.x + p.x, this.y + p.y);
    }

    mul(a: number): Pt {
        return new Pt(this.x * a, this.y * a);
    }

    cross(p: Pt): number {
        return this.x * p.y - this.y * p.x;
    }

    dot(p: Pt): number {
        return this.x * p.x + this.y * p.y;
    }

    eqp(p: Pt): boolean {
        return eq(this.x, p.x) && eq(this.y, p.y);
    }
}

type Line = [Pt, Pt];

function vec(line: Line): Pt {
    // напрямний вектор відрізка
    return line[1].sub(line[0]);
}

function lexComp(l: Pt, r: Pt): boolean {
    if (Math.abs(l.x - r.x) > EPS) {
        return l.x < r.x;
    }
    return l.y < r.y;
}

function interSegSeg(a: Line, b: Line): Pt[] {
    // перетин двох відрізків: 0, 1 або 2 точки
    const l1: Line = [a[0], a[1]];
    const l2: Line = [b[0], b[1]];
    if (eq(vec(l1).cross(vec(l2)), 0)) {
        if (!eq(vec(l1).cross(l2[0].sub(l1[0])), 0)) {
            return [];
        }
        if (!lexComp(l1[0], l1[1])) {
            [l1[0], l1[1]] = [l1[1], l1[0]];
        }
        if (!lexComp(l2[0], l2[1])) {
            [l2[0], l2[1]] = [l2[1], l2[0]];
        }
        const l = lexComp(l1[0], l2[0]) ? l2[0] : l1[0];
        const r = lexComp(l1[1], l2[1]) ? l1[1] : l2[1];
        if (l.eqp(r)) {
            return [l];
        }
        return lexComp(l, r) ? [l, r] : [];
    } else {
        const s = l2[0].sub(l1[0]).cross(vec(l2)) / vec(l1).cross(vec(l2));
        const inter = l1[0].add(vec(l1).mul(s));
        if (ge(s, 0) && le(s, 1) && le(l2[0].sub(inter).dot(l2[1].sub(inter)), 0)) {
            return [inter];
        }
        return [];
    }
}

function getSegtype(segment: Line, otherPoint: Pt): number {
    // 0 — вертикальний; 1 — внутрішня область вище; -1 — нижче
    const seg: Line = [segment[0], segment[1]];
    if (eq(seg[0].x, seg[1].x)) {
        return 0;
    }
    if (!lexComp(seg[0], seg[1])) {
        [seg[0], seg[1]] = [seg[1], seg[0]];
    }
    return seg[1].sub(seg[0]).cross(otherPoint.sub(seg[0])) > 0 ? 1 : -1;
}

function unionArea(triangles: [Pt, Pt, Pt][]): number {
    const n = triangles.length;
    const segments: Line[] = new Array(3 * n);
    const segtype: number[] = new Array(3 * n).fill(0);
    for (let i = 0; i < n; i++) {
        const [a, b, c] = triangles[i];
        segments[3 * i] = lexComp(a, b) ? [a, b] : [b, a];
        segtype[3 * i] = getSegtype(segments[3 * i], c);
        segments[3 * i + 1] = lexComp(b, c) ? [b, c] : [c, b];
        segtype[3 * i + 1] = getSegtype(segments[3 * i + 1], a);
        segments[3 * i + 2] = lexComp(c, a) ? [c, a] : [a, c];
        segtype[3 * i + 2] = getSegtype(segments[3 * i + 2], b);
    }
    const m = segments.length;
    const k: number[] = new Array(m).fill(0);
    const b: number[] = new Array(m).fill(0);
    for (let i = 0; i < m; i++) {
        if (segtype[i]) {
            k[i] = (segments[i][1].y - segments[i][0].y) / (segments[i][1].x - segments[i][0].x);
            b[i] = segments[i][0].y - k[i] * segments[i][0].x;
        }
    }
    let ans = 0;
    for (let i = 0; i < m; i++) {
        if (!segtype[i]) {
            continue;
        }
        const l = segments[i][0].x;
        const r = segments[i][1].x;
        const evts: [number, number][] = [];
        for (let j = 0; j < m; j++) {
            if (!segtype[j] || i === j) {
                continue;
            }
            const l1 = segments[j][0].x;
            const r1 = segments[j][1].x;
            if (ge(l1, r) || ge(l, r1)) {
                continue;
            }
            const commonL = Math.max(l, l1);
            const commonR = Math.min(r, r1);
            const pts = interSegSeg(segments[i], segments[j]);
            if (pts.length === 0) {
                const yl1 = k[j] * commonL + b[j];
                const yl = k[i] * commonL + b[i];
                if (lt(yl1, yl) === (segtype[i] === 1)) {
                    const evtType = -segtype[i] * segtype[j];
                    evts.push([commonL, evtType]);
                    evts.push([commonR, -evtType]);
                }
            } else if (pts.length === 1) {
                let yl = k[i] * commonL + b[i];
                let yl1 = k[j] * commonL + b[j];
                const evtType = -segtype[i] * segtype[j];
                if (lt(yl1, yl) === (segtype[i] === 1)) {
                    evts.push([commonL, evtType]);
                    evts.push([pts[0].x, -evtType]);
                }
                yl = k[i] * commonR + b[i];
                yl1 = k[j] * commonR + b[j];
                if (lt(yl1, yl) === (segtype[i] === 1)) {
                    evts.push([pts[0].x, evtType]);
                    evts.push([commonR, -evtType]);
                }
            } else {
                if (segtype[j] !== segtype[i] || j > i) {
                    evts.push([commonL, -2]);
                    evts.push([commonR, 2]);
                }
            }
        }
        evts.push([l, 0]);
        evts.sort((p, q) => (p[0] !== q[0] ? p[0] - q[0] : p[1] - q[1]));
        let j = 0;
        let balance = 0;
        while (j < evts.length) {
            let ptr = j;
            while (ptr < evts.length && eq(evts[j][0], evts[ptr][0])) {
                balance += evts[ptr][1];
                ptr++;
            }
            if (!balance && !eq(evts[j][0], r)) {
                const nextX = ptr === evts.length ? r : evts[ptr][0];
                ans -= segtype[i] * (k[i] * (nextX + evts[j][0]) + 2 * b[i]) * (nextX - evts[j][0]);
            }
            j = ptr;
        }
    }
    return ans / 2;
}
```

```go
package main

import (
	"math"
	"sort"
)

const eps = 1e-9

func eq(x, y float64) bool {
	return math.Abs(x-y) < eps
}

func lt(x, y float64) bool {
	return x < y-eps
}

func le(x, y float64) bool {
	return x < y+eps
}

func ge(x, y float64) bool {
	return x > y-eps
}

type Pt struct {
	x, y float64
}

func (p Pt) sub(q Pt) Pt {
	return Pt{p.x - q.x, p.y - q.y}
}

func (p Pt) add(q Pt) Pt {
	return Pt{p.x + q.x, p.y + q.y}
}

func (p Pt) mul(a float64) Pt {
	return Pt{p.x * a, p.y * a}
}

func (p Pt) cross(q Pt) float64 {
	return p.x*q.y - p.y*q.x
}

func (p Pt) dot(q Pt) float64 {
	return p.x*q.x + p.y*q.y
}

func (p Pt) eqp(q Pt) bool {
	return eq(p.x, q.x) && eq(p.y, q.y)
}

// Line — відрізок, заданий двома точками
type Line [2]Pt

func (l Line) vec() Pt {
	return l[1].sub(l[0])
}

func lexComp(l, r Pt) bool {
	if math.Abs(l.x-r.x) > eps {
		return l.x < r.x
	}
	return l.y < r.y
}

func interSegSeg(a, b Line) []Pt {
	// перетин двох відрізків: 0, 1 або 2 точки
	l1 := a
	l2 := b
	if eq(l1.vec().cross(l2.vec()), 0) {
		if !eq(l1.vec().cross(l2[0].sub(l1[0])), 0) {
			return nil
		}
		if !lexComp(l1[0], l1[1]) {
			l1[0], l1[1] = l1[1], l1[0]
		}
		if !lexComp(l2[0], l2[1]) {
			l2[0], l2[1] = l2[1], l2[0]
		}
		var l Pt
		if lexComp(l1[0], l2[0]) {
			l = l2[0]
		} else {
			l = l1[0]
		}
		var r Pt
		if lexComp(l1[1], l2[1]) {
			r = l1[1]
		} else {
			r = l2[1]
		}
		if l.eqp(r) {
			return []Pt{l}
		}
		if lexComp(l, r) {
			return []Pt{l, r}
		}
		return nil
	}
	s := l2[0].sub(l1[0]).cross(l2.vec()) / l1.vec().cross(l2.vec())
	inter := l1[0].add(l1.vec().mul(s))
	if ge(s, 0) && le(s, 1) && le(l2[0].sub(inter).dot(l2[1].sub(inter)), 0) {
		return []Pt{inter}
	}
	return nil
}

func getSegtype(segment Line, otherPoint Pt) int {
	// 0 — вертикальний; 1 — внутрішня область вище; -1 — нижче
	seg := segment
	if eq(seg[0].x, seg[1].x) {
		return 0
	}
	if !lexComp(seg[0], seg[1]) {
		seg[0], seg[1] = seg[1], seg[0]
	}
	if seg[1].sub(seg[0]).cross(otherPoint.sub(seg[0])) > 0 {
		return 1
	}
	return -1
}

type evt struct {
	x float64
	t int
}

func unionArea(triangles [][3]Pt) float64 {
	n := len(triangles)
	segments := make([]Line, 3*n)
	segtype := make([]int, 3*n)
	for i := 0; i < n; i++ {
		a, b, c := triangles[i][0], triangles[i][1], triangles[i][2]
		if lexComp(a, b) {
			segments[3*i] = Line{a, b}
		} else {
			segments[3*i] = Line{b, a}
		}
		segtype[3*i] = getSegtype(segments[3*i], c)
		if lexComp(b, c) {
			segments[3*i+1] = Line{b, c}
		} else {
			segments[3*i+1] = Line{c, b}
		}
		segtype[3*i+1] = getSegtype(segments[3*i+1], a)
		if lexComp(c, a) {
			segments[3*i+2] = Line{c, a}
		} else {
			segments[3*i+2] = Line{a, c}
		}
		segtype[3*i+2] = getSegtype(segments[3*i+2], b)
	}
	m := len(segments)
	k := make([]float64, m)
	bb := make([]float64, m)
	for i := 0; i < m; i++ {
		if segtype[i] != 0 {
			k[i] = (segments[i][1].y - segments[i][0].y) / (segments[i][1].x - segments[i][0].x)
			bb[i] = segments[i][0].y - k[i]*segments[i][0].x
		}
	}
	ans := 0.0
	for i := 0; i < m; i++ {
		if segtype[i] == 0 {
			continue
		}
		l := segments[i][0].x
		r := segments[i][1].x
		var evts []evt
		for j := 0; j < m; j++ {
			if segtype[j] == 0 || i == j {
				continue
			}
			l1 := segments[j][0].x
			r1 := segments[j][1].x
			if ge(l1, r) || ge(l, r1) {
				continue
			}
			commonL := math.Max(l, l1)
			commonR := math.Min(r, r1)
			pts := interSegSeg(segments[i], segments[j])
			if len(pts) == 0 {
				yl1 := k[j]*commonL + bb[j]
				yl := k[i]*commonL + bb[i]
				if lt(yl1, yl) == (segtype[i] == 1) {
					evtType := -segtype[i] * segtype[j]
					evts = append(evts, evt{commonL, evtType})
					evts = append(evts, evt{commonR, -evtType})
				}
			} else if len(pts) == 1 {
				yl := k[i]*commonL + bb[i]
				yl1 := k[j]*commonL + bb[j]
				evtType := -segtype[i] * segtype[j]
				if lt(yl1, yl) == (segtype[i] == 1) {
					evts = append(evts, evt{commonL, evtType})
					evts = append(evts, evt{pts[0].x, -evtType})
				}
				yl = k[i]*commonR + bb[i]
				yl1 = k[j]*commonR + bb[j]
				if lt(yl1, yl) == (segtype[i] == 1) {
					evts = append(evts, evt{pts[0].x, evtType})
					evts = append(evts, evt{commonR, -evtType})
				}
			} else {
				if segtype[j] != segtype[i] || j > i {
					evts = append(evts, evt{commonL, -2})
					evts = append(evts, evt{commonR, 2})
				}
			}
		}
		evts = append(evts, evt{l, 0})
		sort.Slice(evts, func(a, b int) bool {
			if evts[a].x != evts[b].x {
				return evts[a].x < evts[b].x
			}
			return evts[a].t < evts[b].t
		})
		j := 0
		balance := 0
		for j < len(evts) {
			ptr := j
			for ptr < len(evts) && eq(evts[j].x, evts[ptr].x) {
				balance += evts[ptr].t
				ptr++
			}
			if balance == 0 && !eq(evts[j].x, r) {
				nextX := r
				if ptr != len(evts) {
					nextX = evts[ptr].x
				}
				ans -= float64(segtype[i]) * (k[i]*(nextX+evts[j].x) + 2*bb[i]) * (nextX - evts[j].x)
			}
			j = ptr
		}
	}
	return ans / 2
}
```

</CodeTabs>

## Задачі \{#problems}
 * [Codeforces 62C Inquisition](https://codeforces.com/contest/62/problem/C)
 * [Codeforces 107E Darts](https://codeforces.com/contest/107/problem/E)
