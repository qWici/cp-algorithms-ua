# Трюк опуклої оболонки (Convex Hull Trick) і дерево Лі Чао

Розглянемо таку задачу. Є $n$ міст. Ми хочемо доїхати на машині з міста $1$ до міста $n$. Для цього потрібно купувати бензин. Відомо, що літр бензину коштує $cost_k$ у $k$-му місті. Спочатку наш бак порожній, і ми витрачаємо один літр бензину на кілометр. Міста розташовані на одній прямій у порядку зростання, причому $k$-те місто має координату $x_k$. Крім того, за в'їзд у $k$-те місто доводиться платити $toll_k$. Наше завдання — здійснити поїздку з мінімально можливою вартістю. Очевидно, що розв'язок можна обчислити за допомогою динамічного програмування:

$$
dp_i = toll_i+\min\limits_{j<i}(cost_j \cdot (x_i - x_j)+dp_j)
$$

Наївний підхід дасть нам складність $O(n^2)$, яку можна покращити до $O(n \log n)$ або $O(n \log [C \varepsilon^{-1}])$, де $C$ — найбільше можливе $|x_i|$, а $\varepsilon$ — точність, з якою розглядаються $x_i$ ($\varepsilon = 1$ для цілих чисел, що зазвичай і є нашим випадком). Для цього варто зауважити, що задача зводиться до додавання лінійних функцій $k \cdot x + b$ до множини та знаходження мінімального значення цих функцій у деякій конкретній точці $x$. Тут можна застосувати два основні підходи.

:::tip[Коли підходить цей алгоритм?]
- Переходи ДП мають вигляд $dp_i = \min_j(k_j \cdot x_i + b_j) + \text{const}$, тобто оптимізуєш мінімум лінійних функцій у точці?
- Тобі справді потрібна оптимізація ДП, а не опукла оболонка множини точок? *(якщо ні → [Побудова опуклої оболонки](convex-hull.md))*
- Запити онлайн або кутові коефіцієнти не монотонні? Тоді бери дерево Лі Чао замість самого трюку.
:::

## Трюк опуклої оболонки (Convex Hull Trick) \{#convex-hull-trick}

Ідея цього підходу полягає в тому, щоб підтримувати <Term tip="Нижня опукла оболонка — це «нижня межа» набору прямих: для кожної точки x вона дає найменше значення серед усіх прямих. Саме там і лежить шуканий мінімум.">нижню опуклу оболонку</Term> лінійних функцій.
Насправді буде трохи зручніше розглядати їх не як лінійні функції, а як точки $(k;b)$ на площині, так що нам доведеться знаходити точку, яка має найменший скалярний добуток із заданою точкою $(x;1)$, тобто для цієї точки $kx+b$ мінімізується, що те саме, що й вихідна задача.
Такий мінімум обов'язково лежатиме на нижній опуклій огинаючій цих точок, як видно нижче:

<center> <img src="/img/docs/geometry/convex_hull_trick.png" alt="lower convex hull" /> </center>

Потрібно зберігати точки опуклої оболонки та <Term tip="Вектор нормалі до ребра — це вектор, перпендикулярний до цього ребра. За його напрямком зручно швидко знаходити, яке ребро дає мінімум для конкретного запиту.">вектори нормалей</Term> до її ребер.
Коли надходить запит $(x;1)$, доведеться знайти вектор нормалі, найближчий до нього за кутом між ними, тоді оптимальна лінійна функція відповідатиме одному з його кінців.
Щоб це побачити, варто зауважити, що точки, які мають сталий скалярний добуток із $(x;1)$, лежать на прямій, ортогональній до $(x;1)$, тож оптимальною лінійною функцією буде та, у якій дотична до опуклої оболонки, колінеарна нормалі до $(x;1)$, торкається оболонки.
Це така точка, що нормалі ребер, які лежать ліворуч і праворуч від неї, спрямовані в різні боки від $(x;1)$.

Цей підхід корисний, коли запити на додавання лінійних функцій <Term tip="Монотонні означає, що коефіцієнт k у нових прямих лише зростає (або лише спадає), а не стрибає туди-сюди. Це дозволяє додавати прямі без переупорядкування.">монотонні</Term> щодо $k$ або якщо ми працюємо офлайн, тобто можемо спочатку додати всі лінійні функції, а вже потім відповідати на запити.
Тож ми не можемо розв'язати задачу про міста/бензин у такий спосіб.
Це вимагало б обробки <Term tip="Онлайн-запити надходять по одному, і на кожен треба відповісти одразу, не знаючи майбутніх запитів. Протилежне — офлайн, коли всі запити відомі наперед.">онлайн-запитів</Term>.
Однак, коли йдеться про обробку онлайн-запитів, усе стає складніше, і доведеться скористатися якоюсь множинною структурою даних, щоб реалізувати належну опуклу оболонку.
Проте онлайн-підхід не розглядатиметься в цій статті через його складність і тому, що другий підхід (а саме дерево Лі Чао) дозволяє розв'язати задачу значно простіше.
Варто згадати, що цей підхід все ж можна використовувати онлайн без ускладнень за допомогою кореневого розбиття.
Тобто перебудовувати опуклу оболонку з нуля кожні $\sqrt n$ нових прямих.

Щоб реалізувати цей підхід, слід почати з деяких геометричних допоміжних функцій, тут ми пропонуємо використати тип комплексних чисел із C++.

<CodeTabs>

```cpp
typedef int ftype;
typedef complex<ftype> point;
#define x real
#define y imag
 
ftype dot(point a, point b) {
	return (conj(a) * b).x();
}
 
ftype cross(point a, point b) {
	return (conj(a) * b).y();
}
```

```python
# Точку (k; b) зберігаємо як кортеж (k, b) замість комплексного числа.
# dot(a, b) = a.x * b.x + a.y * b.y; cross(a, b) = a.x * b.y - a.y * b.x.
def dot(a, b):
    return a[0] * b[0] + a[1] * b[1]


def cross(a, b):
    return a[0] * b[1] - a[1] * b[0]
```

```typescript
// Точку (k; b) подаємо як [number, number].
// dot — скалярний добуток, cross — псевдоскалярний (z-компонента).
type Point = [number, number];

function dot(a: Point, b: Point): number {
    return a[0] * b[0] + a[1] * b[1];
}

function cross(a: Point, b: Point): number {
    return a[0] * b[1] - a[1] * b[0];
}
```

```go
// Точку (k; b) подаємо структурою Point.
type Point struct{ x, y int }

func dot(a, b Point) int {
	return a.x*b.x + a.y*b.y
}

func cross(a, b Point) int {
	return a.x*b.y - a.y*b.x
}
```

</CodeTabs>

Тут ми вважатимемо, що при додаванні лінійних функцій їхній $k$ лише зростає, і ми хочемо знаходити мінімальні значення.
Точки зберігатимемо у векторі $hull$, а вектори нормалей — у векторі $vecs$.
Коли ми додаємо нову точку, треба подивитися на кут, утворений між останнім ребром опуклої оболонки та вектором від останньої точки оболонки до нової точки.
Цей кут має бути спрямований проти годинникової стрілки, тобто скалярний добуток останнього вектора нормалі в оболонці (спрямованого всередину оболонки) та вектора від останньої точки до нової має бути невід'ємним.
Доки це не виконується, ми маємо видаляти останню точку опуклої оболонки разом із відповідним ребром.

<CodeTabs>

```cpp
vector<point> hull, vecs;
 
void add_line(ftype k, ftype b) {
    point nw = {k, b};
    while(!vecs.empty() && dot(vecs.back(), nw - hull.back()) < 0) {
        hull.pop_back();
        vecs.pop_back();
    }
    if(!hull.empty()) {
        vecs.push_back(1i * (nw - hull.back()));
    }
    hull.push_back(nw);
}
 
```

```python
hull = []  # точки опуклої оболонки
vecs = []  # вектори нормалей до ребер


def add_line(k, b):
    nw = (k, b)
    # nw - hull[-1] — вектор від останньої точки до нової
    while vecs and dot(vecs[-1], (nw[0] - hull[-1][0], nw[1] - hull[-1][1])) < 0:
        hull.pop()
        vecs.pop()
    if hull:
        # множення на уявну одиницю i повертає вектор на 90° проти годинникової:
        # i * (dx + dy*i) = -dy + dx*i, тобто (dx, dy) -> (-dy, dx)
        dx = nw[0] - hull[-1][0]
        dy = nw[1] - hull[-1][1]
        vecs.append((-dy, dx))
    hull.append(nw)
```

```typescript
const hull: Point[] = []; // точки опуклої оболонки
const vecs: Point[] = []; // вектори нормалей до ребер

function addLine(k: number, b: number): void {
    const nw: Point = [k, b];
    while (
        vecs.length > 0 &&
        dot(vecs[vecs.length - 1], [
            nw[0] - hull[hull.length - 1][0],
            nw[1] - hull[hull.length - 1][1],
        ]) < 0
    ) {
        hull.pop();
        vecs.pop();
    }
    if (hull.length > 0) {
        // множення на уявну одиницю i: (dx, dy) -> (-dy, dx)
        const dx = nw[0] - hull[hull.length - 1][0];
        const dy = nw[1] - hull[hull.length - 1][1];
        vecs.push([-dy, dx]);
    }
    hull.push(nw);
}
```

```go
var hull, vecs []Point // точки оболонки та вектори нормалей до ребер

func addLine(k, b int) {
	nw := Point{k, b}
	for len(vecs) > 0 {
		last := hull[len(hull)-1]
		if dot(vecs[len(vecs)-1], Point{nw.x - last.x, nw.y - last.y}) >= 0 {
			break
		}
		hull = hull[:len(hull)-1]
		vecs = vecs[:len(vecs)-1]
	}
	if len(hull) > 0 {
		// множення на уявну одиницю i: (dx, dy) -> (-dy, dx)
		last := hull[len(hull)-1]
		dx, dy := nw.x-last.x, nw.y-last.y
		vecs = append(vecs, Point{-dy, dx})
	}
	hull = append(hull, nw)
}
```

</CodeTabs>
Тепер, щоб отримати мінімальне значення в деякій точці, ми знайдемо перший вектор нормалі в опуклій оболонці, спрямований проти годинникової стрілки від $(x;1)$. Лівий кінець такого ребра і буде відповіддю. Щоб перевірити, чи вектор $a$ не спрямований проти годинникової стрілки від вектора $b$, слід перевірити, чи їхній векторний добуток $[a,b]$ додатний.
<CodeTabs>

```cpp
int get(ftype x) {
    point query = {x, 1};
    auto it = lower_bound(vecs.begin(), vecs.end(), query, [](point a, point b) {
        return cross(a, b) > 0;
    });
    return dot(query, hull[it - vecs.begin()]);
}
```

```python
from bisect import bisect_left


def get(x):
    query = (x, 1)
    # lower_bound із компаратором cross(a, b) > 0: шукаємо перший vec,
    # для якого cross(vec, query) НЕ > 0, тобто cross(vec, query) <= 0.
    lo, hi = 0, len(vecs)
    while lo < hi:
        mid = (lo + hi) // 2
        if cross(vecs[mid], query) > 0:
            lo = mid + 1
        else:
            hi = mid
    return dot(query, hull[lo])
```

```typescript
function get(x: number): number {
    const query: Point = [x, 1];
    // Еквівалент lower_bound із компаратором cross(a, b) > 0:
    // перший vec, для якого cross(vec, query) <= 0.
    let lo = 0;
    let hi = vecs.length;
    while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (cross(vecs[mid], query) > 0) {
            lo = mid + 1;
        } else {
            hi = mid;
        }
    }
    return dot(query, hull[lo]);
}
```

```go
func get(x int) int {
	query := Point{x, 1}
	// Еквівалент lower_bound із компаратором cross(a, b) > 0:
	// перший vec, для якого cross(vec, query) <= 0.
	lo, hi := 0, len(vecs)
	for lo < hi {
		mid := (lo + hi) / 2
		if cross(vecs[mid], query) > 0 {
			lo = mid + 1
		} else {
			hi = mid
		}
	}
	return dot(query, hull[lo])
}
```

</CodeTabs>

## Дерево Лі Чао \{#li-chao-tree}

Припустимо, нам дано множину функцій, таких, що кожні дві з них перетинаються щонайбільше один раз. Зберігатимемо в кожній вершині дерева відрізків деяку функцію так, щоб, рухаючись від кореня до листка, ми гарантовано зустріли одну з функцій на шляху, яка дає мінімальне значення в цьому листку. Подивімося, як це побудувати.

Припустимо, ми перебуваємо в деякій вершині, що відповідає напіввідрізку $[l,r)$, і там зберігається функція $f_{old}$, а ми додаємо функцію $f_{new}$. Тоді точка перетину буде або в $[l;m)$, або в $[m;r)$, де $m=\left\lfloor\tfrac{l+r}{2}\right\rfloor$. Ми можемо ефективно це з'ясувати, порівнявши значення функцій у точках $l$ та $m$. Якщо домінуюча функція змінюється, то перетин у $[l;m)$, інакше — у $[m;r)$. Тепер для тієї половини відрізка, де перетину немає, ми оберемо нижню функцію та запишемо її в поточну вершину. Можна бачити, що це завжди буде та функція, яка нижча в точці $m$. Після цього ми рекурсивно переходимо до іншої половини відрізка з функцією, що була верхньою. Як бачите, це збереже коректність на першій половині відрізка, а в іншій коректність буде підтримана під час рекурсивного виклику. Отже, ми можемо додавати функції та перевіряти мінімальне значення в точці за $O(\log [C\varepsilon^{-1}])$.

Ось ілюстрація того, що відбувається у вершині, коли ми додаємо нову функцію:

<center> <img src="/img/docs/geometry/li_chao_vertex.png" alt="Li Chao Tree vertex" /> </center>

Перейдімо тепер до реалізації. Знову ж таки, для зберігання лінійних функцій ми скористаємося комплексними числами.

<CodeTabs>

```cpp
typedef long long ftype;
typedef complex<ftype> point;
#define x real
#define y imag
 
ftype dot(point a, point b) {
    return (conj(a) * b).x();
}
 
ftype f(point a,  ftype x) {
    return dot(a, {x, 1});
}
```

```python
# Пряму (k; b) зберігаємо як кортеж (k, b). Python має необмежені цілі,
# тому переповнення (на відміну від C++ long long) тут не загрожує.
def dot(a, b):
    return a[0] * b[0] + a[1] * b[1]


def f(a, x):
    return dot(a, (x, 1))
```

```typescript
// Пряму (k; b) подаємо як [bigint, bigint]. Значення f можуть досягати
// k * x, що легко виходить за межі 2^53, тож використовуємо BigInt,
// аби відтворити поведінку C++ long long без втрати точності.
type Line = [bigint, bigint];

function dot(a: Line, b: Line): bigint {
    return a[0] * b[0] + a[1] * b[1];
}

function f(a: Line, x: bigint): bigint {
    return dot(a, [x, 1n]);
}
```

```go
// Пряму (k; b) подаємо структурою Line з полями int64,
// що відповідає C++ long long.
type Line struct{ k, b int64 }

func dot(a, b Line) int64 {
	return a.k*b.k + a.b*b.b
}

func f(a Line, x int64) int64 {
	return dot(a, Line{x, 1})
}
```

</CodeTabs>
Функції зберігатимемо в масиві $line$ та використовуватимемо бінарну індексацію дерева відрізків. Якщо ви хочете застосувати це до великих чисел або чисел з рухомою комою, слід використати динамічне дерево відрізків.
Дерево відрізків має бути ініціалізоване значеннями за замовчуванням, наприклад, прямими $0x + \infty$.

<CodeTabs>

```cpp
const int maxn = 2e5;
 
point line[4 * maxn];
 
void add_line(point nw, int v = 1, int l = 0, int r = maxn) {
    int m = (l + r) / 2;
    bool lef = f(nw, l) < f(line[v], l);
    bool mid = f(nw, m) < f(line[v], m);
    if(mid) {
        swap(line[v], nw);
    }
    if(r - l == 1) {
        return;
    } else if(lef != mid) {
        add_line(nw, 2 * v, l, m);
    } else {
        add_line(nw, 2 * v + 1, m, r);
    }
}
```

```python
maxn = 200000

# Дерево ініціалізоване прямими 0*x + INF (значення за замовчуванням).
INF = float("inf")
line = [(0, INF)] * (4 * maxn)


def add_line(nw, v=1, l=0, r=maxn):
    m = (l + r) // 2
    lef = f(nw, l) < f(line[v], l)
    mid = f(nw, m) < f(line[v], m)
    if mid:
        line[v], nw = nw, line[v]
    if r - l == 1:
        return
    elif lef != mid:
        add_line(nw, 2 * v, l, m)
    else:
        add_line(nw, 2 * v + 1, m, r)
```

```typescript
const maxn = 200000;

// Велике значення на роль +нескінченності (INF) у межах BigInt.
const INF = 1n << 62n;
const line: Line[] = new Array(4 * maxn).fill(0).map(() => [0n, INF] as Line);

function addLine(nw: Line, v = 1, l = 0n, r = BigInt(maxn)): void {
    const m = (l + r) / 2n;
    const lef = f(nw, l) < f(line[v], l);
    const mid = f(nw, m) < f(line[v], m);
    if (mid) {
        [line[v], nw] = [nw, line[v]];
    }
    if (r - l === 1n) {
        return;
    } else if (lef !== mid) {
        addLine(nw, 2 * v, l, m);
    } else {
        addLine(nw, 2 * v + 1, m, r);
    }
}
```

```go
const maxn = 200000

// INF на роль +нескінченності; line ініціалізується прямими 0*x + INF.
const INF int64 = 1 << 62

var line [4 * maxn]Line

func initTree() {
	for i := range line {
		line[i] = Line{0, INF}
	}
}

func addLine(nw Line, v int, l, r int64) {
	m := (l + r) / 2
	lef := f(nw, l) < f(line[v], l)
	mid := f(nw, m) < f(line[v], m)
	if mid {
		line[v], nw = nw, line[v]
	}
	if r-l == 1 {
		return
	} else if lef != mid {
		addLine(nw, 2*v, l, m)
	} else {
		addLine(nw, 2*v+1, m, r)
	}
}
```

</CodeTabs>
Тепер, щоб отримати мінімум у деякій точці $x$, ми просто обираємо мінімальне значення вздовж шляху до цієї точки.
<CodeTabs>

```cpp
ftype get(int x, int v = 1, int l = 0, int r = maxn) {
    int m = (l + r) / 2;
    if(r - l == 1) {
        return f(line[v], x);
    } else if(x < m) {
        return min(f(line[v], x), get(x, 2 * v, l, m));
    } else {
        return min(f(line[v], x), get(x, 2 * v + 1, m, r));
    }
}
```

```python
def get(x, v=1, l=0, r=maxn):
    m = (l + r) // 2
    if r - l == 1:
        return f(line[v], x)
    elif x < m:
        return min(f(line[v], x), get(x, 2 * v, l, m))
    else:
        return min(f(line[v], x), get(x, 2 * v + 1, m, r))
```

```typescript
function get(x: bigint, v = 1, l = 0n, r = BigInt(maxn)): bigint {
    const m = (l + r) / 2n;
    if (r - l === 1n) {
        return f(line[v], x);
    } else if (x < m) {
        const left = get(x, 2 * v, l, m);
        const cur = f(line[v], x);
        return cur < left ? cur : left;
    } else {
        const right = get(x, 2 * v + 1, m, r);
        const cur = f(line[v], x);
        return cur < right ? cur : right;
    }
}
```

```go
func get(x int64, v int, l, r int64) int64 {
	m := (l + r) / 2
	cur := f(line[v], x)
	if r-l == 1 {
		return cur
	}
	var sub int64
	if x < m {
		sub = get(x, 2*v, l, m)
	} else {
		sub = get(x, 2*v+1, m, r)
	}
	if cur < sub {
		return cur
	}
	return sub
}
```

</CodeTabs>

## Задачі \{#problems}

* [Codebreaker - TROUBLES](https://codeforces.com/gym/103536/problem/B) (просте застосування трюку опуклої оболонки після кількох спостережень)
* [CS Academy - Squared Ends](https://csacademy.com/contest/archive/task/squared-ends)
* [Codeforces - Escape Through Leaf](http://codeforces.com/contest/932/problem/F)
* [CodeChef - Polynomials](https://www.codechef.com/NOV17/problems/POLY)
* [Codeforces - Kalila and Dimna in the Logging Industry](https://codeforces.com/problemset/problem/319/C)
* [Codeforces - Product Sum](https://codeforces.com/problemset/problem/631/E)
* [Codeforces - Bear and Bowling 4](https://codeforces.com/problemset/problem/660/F)
* [APIO 2010 - Commando](https://dmoj.ca/problem/apio10p1)
