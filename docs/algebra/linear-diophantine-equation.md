# Лінійне діофантове рівняння

Лінійне діофантове рівняння (з двома змінними) — це рівняння загального вигляду:

$$
ax + by = c
$$

де $a$, $b$, $c$ — задані цілі числа, а $x$, $y$ — невідомі цілі числа.

У цій статті ми розглянемо кілька класичних задач про такі рівняння:

* знаходження одного розв'язку
* знаходження всіх розв'язків
* знаходження кількості розв'язків і самих розв'язків на заданому проміжку
* знаходження розв'язку з мінімальним значенням $x + y$

## Вироджений випадок \{#the-degenerate-case}

Вироджений випадок, про який треба подбати, — це коли $a = b = 0$. Легко бачити, що ми або не маємо розв'язків, або маємо їх нескінченно багато, залежно від того, чи $c = 0$, чи ні. У решті статті ми ігноруватимемо цей випадок.

## Аналітичний розв'язок \{#analytic-solution}

Коли $a \neq 0$ та $b \neq 0$, рівняння $ax+by=c$ можна еквівалентно розглядати як будь-яке з наступних:

\begin\{align\}
ax &\equiv c \pmod b \\
by &\equiv c \pmod a
\end\{align\}

Без втрати загальності припустимо, що $b \neq 0$, і розглянемо перше рівняння. Коли $a$ і $b$ взаємно прості, його розв'язок задається як

$$
x \equiv ca^{-1} \pmod b,
$$

де $a^{-1}$ — це [обернений елемент за модулем](module-inverse.md) для $a$ за модулем $b$.

Коли $a$ і $b$ не взаємно прості, значення $ax$ за модулем $b$ для всіх цілих $x$ діляться на $g=\gcd(a, b)$, тож розв'язок існує лише тоді, коли $c$ ділиться на $g$. У цьому випадку один із розв'язків можна знайти, скоротивши рівняння на $g$:

$$
(a/g) x \equiv (c/g) \pmod{b/g}.
$$

За означенням $g$, числа $a/g$ і $b/g$ взаємно прості, тож розв'язок задається явно як

$$
\begin{cases}
x \equiv (c/g)(a/g)^{-1}\pmod{b/g},\\
y = \frac{c-ax}{b}.
\end{cases}
$$

## Алгоритмічний розв'язок \{#algorithmic-solution}

**Лема Безу** (також відома як тотожність Безу) — корисний результат, який допоможе зрозуміти наведений нижче розв'язок.

> Нехай $g = \gcd(a,b)$. Тоді існують цілі числа $x,y$ такі, що $ax + by = g$.
> 
> Більше того, $g$ — найменше таке додатне ціле число, яке можна записати у вигляді $ax + by$; усі цілі числа вигляду $ax + by$ є кратними $g$.

Щоб знайти один розв'язок діофантового рівняння з 2 невідомими, можна скористатися [розширеним алгоритмом Евкліда](extended-euclid-algorithm.md). Спочатку припустимо, що $a$ і $b$ невід'ємні. Коли ми застосовуємо розширений алгоритм Евкліда для $a$ і $b$, ми можемо знайти їхній найбільший спільний дільник $g$ і 2 числа $x_g$ та $y_g$ такі, що:

$$
a x_g + b y_g = g
$$

Якщо $c$ ділиться на $g = \gcd(a, b)$, то задане діофантове рівняння має розв'язок, інакше воно не має жодного розв'язку. Доведення прямолінійне: лінійна комбінація двох чисел ділиться на їхній спільний дільник.

Тепер припустимо, що $c$ ділиться на $g$, тоді маємо:

$$
a \cdot x_g \cdot \frac{c}{g} + b \cdot y_g \cdot \frac{c}{g} = c
$$

Отже, одним із розв'язків діофантового рівняння є:

$$
x_0 = x_g \cdot \frac{c}{g},
$$

$$
y_0 = y_g \cdot \frac{c}{g}.
$$

Наведена ідея все ще працює, коли $a$ або $b$, або обидва вони від'ємні. Нам потрібно лише змінювати знак $x_0$ і $y_0$ за потреби.

Зрештою, ми можемо реалізувати цю ідею так (зауважте, що цей код не враховує випадок $a = b = 0$):

<CodeTabs>

```cpp
int gcd(int a, int b, int& x, int& y) {
    if (b == 0) {
        x = 1;
        y = 0;
        return a;
    }
    int x1, y1;
    int d = gcd(b, a % b, x1, y1);
    x = y1;
    y = x1 - y1 * (a / b);
    return d;
}

bool find_any_solution(int a, int b, int c, int &x0, int &y0, int &g) {
    g = gcd(abs(a), abs(b), x0, y0);
    if (c % g) {
        return false;
    }

    x0 *= c / g;
    y0 *= c / g;
    if (a < 0) x0 = -x0;
    if (b < 0) y0 = -y0;
    return true;
}
```

```python
from typing import Tuple


# Розширений алгоритм Евкліда: повертає (g, x, y), де a*x + b*y = g.
def gcd(a: int, b: int) -> Tuple[int, int, int]:
    if b == 0:
        return a, 1, 0
    d, x1, y1 = gcd(b, a % b)
    x = y1
    y = x1 - y1 * (a // b)
    return d, x, y


# Шукає будь-який розв'язок рівняння a*x + b*y = c.
# Повертає (True, x0, y0, g) або (False, 0, 0, 0), якщо розв'язку немає.
def find_any_solution(a: int, b: int, c: int) -> Tuple[bool, int, int, int]:
    g, x0, y0 = gcd(abs(a), abs(b))
    if c % g != 0:
        return False, 0, 0, 0
    x0 *= c // g
    y0 *= c // g
    if a < 0:
        x0 = -x0
    if b < 0:
        y0 = -y0
    return True, x0, y0, g
```

```typescript
// Розширений алгоритм Евкліда: повертає [g, x, y], де a*x + b*y = g.
function gcd(a: number, b: number): [number, number, number] {
    if (b === 0) {
        return [a, 1, 0];
    }
    const [d, x1, y1] = gcd(b, a % b);
    return [d, y1, x1 - y1 * Math.trunc(a / b)];
}

// Шукає будь-який розв'язок рівняння a*x + b*y = c.
// Повертає { ok, x, y, g }.
function findAnySolution(
    a: number,
    b: number,
    c: number,
): { ok: boolean; x: number; y: number; g: number } {
    let [g, x0, y0] = gcd(Math.abs(a), Math.abs(b));
    if (c % g !== 0) {
        return { ok: false, x: 0, y: 0, g: 0 };
    }
    x0 *= c / g;
    y0 *= c / g;
    if (a < 0) x0 = -x0;
    if (b < 0) y0 = -y0;
    return { ok: true, x: x0, y: y0, g };
}
```

```go
func abs(a int) int {
    if a < 0 {
        return -a
    }
    return a
}

// Розширений алгоритм Евкліда: повертає (g, x, y), де a*x + b*y = g.
func gcd(a, b int) (g, x, y int) {
    if b == 0 {
        return a, 1, 0
    }
    d, x1, y1 := gcd(b, a%b)
    return d, y1, x1 - y1*(a/b)
}

// Шукає будь-який розв'язок рівняння a*x + b*y = c.
// Повертає (ok, x0, y0, g).
func findAnySolution(a, b, c int) (ok bool, x0, y0, g int) {
    g, x0, y0 = gcd(abs(a), abs(b))
    if c%g != 0 {
        return false, 0, 0, 0
    }
    x0 *= c / g
    y0 *= c / g
    if a < 0 {
        x0 = -x0
    }
    if b < 0 {
        y0 = -y0
    }
    return true, x0, y0, g
}
```

</CodeTabs>

## Отримання всіх розв'язків \{#getting-all-solutions}

З одного розв'язку $(x_0, y_0)$ ми можемо отримати всі розв'язки заданого рівняння.

Нехай $g = \gcd(a, b)$ і нехай $x_0, y_0$ — цілі числа, які задовольняють таке:

$$
a \cdot x_0 + b \cdot y_0 = c
$$

Тепер ми побачимо, що додавання $b / g$ до $x_0$ і водночас віднімання $a / g$ від $y_0$ не порушить рівність:

$$
a \cdot \left(x_0 + \frac{b}{g}\right) + b \cdot \left(y_0 - \frac{a}{g}\right) = a \cdot x_0 + b \cdot y_0 + a \cdot \frac{b}{g} - b \cdot \frac{a}{g} = c
$$

Очевидно, цей процес можна повторювати знову, тож усі числа вигляду:

$$
x = x_0 + k \cdot \frac{b}{g}
$$

$$
y = y_0 - k \cdot \frac{a}{g}
$$

є розв'язками заданого діофантового рівняння.

Оскільки рівняння лінійне, усі розв'язки лежать на одній прямій, і за означенням $g$ це і є множина всіх можливих розв'язків заданого діофантового рівняння.

## Знаходження кількості розв'язків і розв'язків на заданому проміжку \{#finding-the-number-of-solutions-and-the-solutions-in-a-given-interval}

З попереднього розділу має бути зрозуміло, що якщо ми не накладаємо жодних обмежень на розв'язки, то їх буде нескінченно багато. Тож у цьому розділі ми додаємо деякі обмеження на проміжок $x$ і $y$ та спробуємо порахувати й перелічити всі розв'язки.

Нехай задано два проміжки: $[min_x; max_x]$ і $[min_y; max_y]$, і скажімо, що ми хочемо знайти лише розв'язки на цих двох проміжках.

Зауважте, що якщо $a$ або $b$ дорівнює $0$, то задача має лише один розв'язок. Ми не розглядаємо цей випадок тут.

Спочатку ми можемо знайти розв'язок, який має мінімальне значення $x$ таке, що $x \ge min_x$. Щоб це зробити, ми спершу знаходимо будь-який розв'язок діофантового рівняння. Потім ми зсуваємо цей розв'язок, щоб отримати $x \ge min_x$ (використовуючи те, що ми знаємо про множину всіх розв'язків з попереднього розділу). Це можна зробити за $O(1)$.
Позначимо це мінімальне значення $x$ через $l_{x1}$.

Аналогічно ми можемо знайти максимальне значення $x$, яке задовольняє $x \le max_x$. Позначимо це максимальне значення $x$ через $r_{x1}$.

Аналогічно ми можемо знайти мінімальне значення $y$ $(y \ge min_y)$ і максимальне значення $y$ $(y \le max_y)$. Позначимо відповідні значення $x$ через $l_{x2}$ і $r_{x2}$.

Остаточним розв'язком є всі розв'язки з x у перетині $[l_{x1}, r_{x1}]$ і $[l_{x2}, r_{x2}]$. Позначимо цей перетин через $[l_x, r_x]$.

Нижче наведено код, що реалізує цю ідею.
Зверніть увагу, що на початку ми ділимо $a$ і $b$ на $g$.
Оскільки рівняння $a x + b y = c$ еквівалентне рівнянню $\frac{a}{g} x + \frac{b}{g} y = \frac{c}{g}$, ми можемо використати останнє замість нього і мати $\gcd(\frac{a}{g}, \frac{b}{g}) = 1$, що спрощує формули.

<CodeTabs>

```cpp
void shift_solution(int & x, int & y, int a, int b, int cnt) {
    x += cnt * b;
    y -= cnt * a;
}

int find_all_solutions(int a, int b, int c, int minx, int maxx, int miny, int maxy) {
    int x, y, g;
    if (!find_any_solution(a, b, c, x, y, g))
        return 0;
    a /= g;
    b /= g;

    int sign_a = a > 0 ? +1 : -1;
    int sign_b = b > 0 ? +1 : -1;

    shift_solution(x, y, a, b, (minx - x) / b);
    if (x < minx)
        shift_solution(x, y, a, b, sign_b);
    if (x > maxx)
        return 0;
    int lx1 = x;

    shift_solution(x, y, a, b, (maxx - x) / b);
    if (x > maxx)
        shift_solution(x, y, a, b, -sign_b);
    int rx1 = x;

    shift_solution(x, y, a, b, -(miny - y) / a);
    if (y < miny)
        shift_solution(x, y, a, b, -sign_a);
    if (y > maxy)
        return 0;
    int lx2 = x;

    shift_solution(x, y, a, b, -(maxy - y) / a);
    if (y > maxy)
        shift_solution(x, y, a, b, sign_a);
    int rx2 = x;

    if (lx2 > rx2)
        swap(lx2, rx2);
    int lx = max(lx1, lx2);
    int rx = min(rx1, rx2);

    if (lx > rx)
        return 0;
    return (rx - lx) / abs(b) + 1;
}
```

```python
from typing import Tuple


# Зсуває розв'язок на cnt кроків уздовж прямої розв'язків.
def shift_solution(x: int, y: int, a: int, b: int, cnt: int) -> Tuple[int, int]:
    return x + cnt * b, y - cnt * a


# Рахує кількість розв'язків a*x + b*y = c з x у [minx, maxx] та y у [miny, maxy].
def find_all_solutions(a: int, b: int, c: int,
                       minx: int, maxx: int, miny: int, maxy: int) -> int:
    ok, x, y, g = find_any_solution(a, b, c)
    if not ok:
        return 0
    a //= g
    b //= g

    sign_a = 1 if a > 0 else -1
    sign_b = 1 if b > 0 else -1

    x, y = shift_solution(x, y, a, b, (minx - x) // b)
    if x < minx:
        x, y = shift_solution(x, y, a, b, sign_b)
    if x > maxx:
        return 0
    lx1 = x

    x, y = shift_solution(x, y, a, b, (maxx - x) // b)
    if x > maxx:
        x, y = shift_solution(x, y, a, b, -sign_b)
    rx1 = x

    x, y = shift_solution(x, y, a, b, -(miny - y) // a)
    if y < miny:
        x, y = shift_solution(x, y, a, b, -sign_a)
    if y > maxy:
        return 0
    lx2 = x

    x, y = shift_solution(x, y, a, b, -(maxy - y) // a)
    if y > maxy:
        x, y = shift_solution(x, y, a, b, sign_a)
    rx2 = x

    if lx2 > rx2:
        lx2, rx2 = rx2, lx2
    lx = max(lx1, lx2)
    rx = min(rx1, rx2)

    if lx > rx:
        return 0
    return (rx - lx) // abs(b) + 1
```

```typescript
// Цілочисельне ділення з відкиданням дробової частини (як у C++), для від'ємних теж.
function idiv(a: number, b: number): number {
    return Math.trunc(a / b);
}

// Зсуває розв'язок на cnt кроків уздовж прямої розв'язків.
function shiftSolution(
    x: number, y: number, a: number, b: number, cnt: number,
): [number, number] {
    return [x + cnt * b, y - cnt * a];
}

// Рахує кількість розв'язків a*x + b*y = c з x у [minx, maxx] та y у [miny, maxy].
function findAllSolutions(
    a: number, b: number, c: number,
    minx: number, maxx: number, miny: number, maxy: number,
): number {
    const sol = findAnySolution(a, b, c);
    if (!sol.ok) return 0;
    let { x, y } = sol;
    a = idiv(a, sol.g);
    b = idiv(b, sol.g);

    const signA = a > 0 ? 1 : -1;
    const signB = b > 0 ? 1 : -1;

    [x, y] = shiftSolution(x, y, a, b, idiv(minx - x, b));
    if (x < minx) [x, y] = shiftSolution(x, y, a, b, signB);
    if (x > maxx) return 0;
    const lx1 = x;

    [x, y] = shiftSolution(x, y, a, b, idiv(maxx - x, b));
    if (x > maxx) [x, y] = shiftSolution(x, y, a, b, -signB);
    const rx1 = x;

    [x, y] = shiftSolution(x, y, a, b, -idiv(miny - y, a));
    if (y < miny) [x, y] = shiftSolution(x, y, a, b, -signA);
    if (y > maxy) return 0;
    const lx2 = x;

    [x, y] = shiftSolution(x, y, a, b, -idiv(maxy - y, a));
    if (y > maxy) [x, y] = shiftSolution(x, y, a, b, signA);
    let rx2 = x;

    let lo2 = lx2;
    if (lo2 > rx2) [lo2, rx2] = [rx2, lo2];
    const lx = Math.max(lx1, lo2);
    const rx = Math.min(rx1, rx2);

    if (lx > rx) return 0;
    return idiv(rx - lx, Math.abs(b)) + 1;
}
```

```go
// Зсуває розв'язок на cnt кроків уздовж прямої розв'язків.
func shiftSolution(x, y *int, a, b, cnt int) {
    *x += cnt * b
    *y -= cnt * a
}

// Рахує кількість розв'язків a*x + b*y = c з x у [minx, maxx] та y у [miny, maxy].
func findAllSolutions(a, b, c, minx, maxx, miny, maxy int) int {
    ok, x, y, g := findAnySolution(a, b, c)
    if !ok {
        return 0
    }
    a /= g
    b /= g

    signA := 1
    if a <= 0 {
        signA = -1
    }
    signB := 1
    if b <= 0 {
        signB = -1
    }

    shiftSolution(&x, &y, a, b, (minx-x)/b)
    if x < minx {
        shiftSolution(&x, &y, a, b, signB)
    }
    if x > maxx {
        return 0
    }
    lx1 := x

    shiftSolution(&x, &y, a, b, (maxx-x)/b)
    if x > maxx {
        shiftSolution(&x, &y, a, b, -signB)
    }
    rx1 := x

    shiftSolution(&x, &y, a, b, -(miny-y)/a)
    if y < miny {
        shiftSolution(&x, &y, a, b, -signA)
    }
    if y > maxy {
        return 0
    }
    lx2 := x

    shiftSolution(&x, &y, a, b, -(maxy-y)/a)
    if y > maxy {
        shiftSolution(&x, &y, a, b, signA)
    }
    rx2 := x

    if lx2 > rx2 {
        lx2, rx2 = rx2, lx2
    }
    lx := lx1
    if lx2 > lx {
        lx = lx2
    }
    rx := rx1
    if rx2 < rx {
        rx = rx2
    }

    if lx > rx {
        return 0
    }
    return (rx-lx)/abs(b) + 1
}
```

</CodeTabs>

Щойно ми маємо $l_x$ і $r_x$, перелічити всі розв'язки теж просто. Достатньо проходити через $x = l_x + k \cdot \frac{b}{g}$ для всіх $k \ge 0$, доки $x = r_x$, і знаходити відповідні значення $y$ за допомогою рівняння $a x + b y = c$.

## Знаходження розв'язку з мінімальним значенням $x + y$ \{#data-toc-label}

Тут $x$ і $y$ також потрібно накласти деяке обмеження, інакше відповідь може стати мінус нескінченністю.

Ідея схожа на попередній розділ: ми знаходимо будь-який розв'язок діофантового рівняння, а потім зсуваємо розв'язок, щоб задовольнити деякі умови.

Зрештою, скористаємося знанням про множину всіх розв'язків, щоб знайти мінімум:

$$
x' = x + k \cdot \frac{b}{g},
$$

$$
y' = y - k \cdot \frac{a}{g}.
$$

Зауважте, що $x + y$ змінюється так:

$$
x' + y' = x + y + k \cdot \left(\frac{b}{g} - \frac{a}{g}\right) = x + y + k \cdot \frac{b-a}{g}
$$

Якщо $a < b$, нам потрібно вибрати найменше можливе значення $k$. Якщо $a > b$, нам потрібно вибрати найбільше можливе значення $k$. Якщо $a = b$, усі розв'язки матимуть однакову суму $x + y$.

## Задачі для практики \{#practice-problems}

* [Spoj - Crucial Equation](http://www.spoj.com/problems/CEQU/)
* [SGU 106](http://codeforces.com/problemsets/acmsguru/problem/99999/106)
* [Codeforces - Ebony and Ivory](http://codeforces.com/contest/633/problem/A)
* [Codechef - Get AC in one go](https://www.codechef.com/problems/COPR16G)
* [LightOj - Solutions to an equation](http://www.lightoj.com/volume_showproblem.php?problem=1306)
* [Atcoder - F - S = 1](https://atcoder.jp/contests/abc340/tasks/abc340_f)

## Відеоматеріали \{#video}

- [Diophantine Equation: ax+by=gcd(a,b) ← Number Theory — Socratica](https://www.youtube.com/watch?v=FjliV5u2IVw) (10 хв, англійською)
