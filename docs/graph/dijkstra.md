# Алгоритм Дейкстри

Нам задано орієнтований або неорієнтований зважений граф з $n$ вершинами та $m$ ребрами. Ваги всіх ребер невід'ємні. Також задано початкову вершину $s$. У цій статті ми розглянемо, як знайти довжини найкоротших шляхів від початкової вершини $s$ до всіх інших вершин, а також вивести самі найкоротші шляхи.

Цю задачу також називають **задачею про найкоротші шляхи з однієї вершини** (single-source shortest paths problem).

## Алгоритм \{#algorithm}

Ось алгоритм, описаний нідерландським комп'ютерним науковцем Едсгером В. Дейкстрою у 1959 році.

Створимо масив $d[]$, у якому для кожної вершини $v$ зберігатимемо поточну довжину найкоротшого шляху від $s$ до $v$ у $d[v]$.
Спочатку $d[s] = 0$, а для всіх інших вершин ця довжина дорівнює нескінченності.
У реалізації за нескінченність обирають достатньо велике число (яке гарантовано більше за будь-яку можливу довжину шляху).

$$
d[v] = \infty,~ v \ne s
$$

Окрім того, ми підтримуємо булів масив $u[]$, у якому для кожної вершини $v$ зберігається, чи вона позначена. Спочатку всі вершини непозначені:

$$
u[v] = {\rm false}
$$

Алгоритм Дейкстри виконується протягом $n$ ітерацій. На кожній ітерації як вершина $v$ обирається непозначена вершина, що має найменше значення $d[v]$:

Очевидно, що на першій ітерації буде обрано початкову вершину $s$.

Обрана вершина $v$ позначається. Далі з вершини $v$ виконуються **релаксації**: розглядаються всі ребра виду $(v,\text{to})$, і для кожної вершини $\text{to}$ алгоритм намагається покращити значення $d[\text{to}]$. Якщо довжина поточного ребра дорівнює $len$, то код релаксації має вигляд:

$$
d[\text{to}] = \min (d[\text{to}], d[v] + len)
$$

Після того як усі такі ребра розглянуто, поточна ітерація завершується. Нарешті, після $n$ ітерацій усі вершини будуть позначені, і алгоритм завершується. Ми стверджуємо, що знайдені значення $d[v]$ є довжинами найкоротших шляхів від $s$ до всіх вершин $v$.

Зауважимо, що якщо деякі вершини недосяжні з початкової вершини $s$, то значення $d[v]$ для них залишаться нескінченними. Очевидно, що на кількох останніх ітераціях алгоритм обиратиме саме ці вершини, але жодної корисної роботи для них зроблено не буде. Тому алгоритм можна зупинити, щойно обрана вершина має нескінченну відстань до неї.

### Відновлення найкоротших шляхів \{#restoring-shortest-paths}

Зазвичай потрібно знати не лише довжини найкоротших шляхів, а й самі найкоротші шляхи. Подивимося, як підтримувати достатньо інформації, щоб відновити найкоротший шлях від $s$ до будь-якої вершини. Ми підтримуватимемо масив попередників $p[]$, у якому для кожної вершини $v \ne s$ значення $p[v]$ — це передостання вершина в найкоротшому шляху від $s$ до $v$. Тут ми використовуємо той факт, що якщо взяти найкоротший шлях до деякої вершини $v$ і прибрати з цього шляху $v$, то отримаємо шлях, що закінчується у вершині $p[v]$, і цей шлях буде найкоротшим для вершини $p[v]$. Цей масив попередників можна використати для відновлення найкоротшого шляху до будь-якої вершини: починаючи з $v$, ми повторно беремо попередника поточної вершини, доки не дійдемо до початкової вершини $s$, і отримуємо потрібний найкоротший шлях із вершинами, перерахованими у зворотному порядку. Отже, найкоротший шлях $P$ до вершини $v$ дорівнює:

$$
P = (s, \ldots, p[p[p[v]]], p[p[v]], p[v], v)
$$

Побудувати цей масив попередників дуже просто: при кожній успішній релаксації, тобто коли для деякої обраної вершини $v$ відбувається покращення відстані до деякої вершини $\text{to}$, ми оновлюємо вершину-попередника для $\text{to}$ вершиною $v$:

$$
p[\text{to}] = v
$$

## Доведення \{#proof}

Основне твердження, на якому ґрунтується коректність алгоритму Дейкстри, таке:

**Після того як будь-яка вершина $v$ стає позначеною, поточна відстань до неї $d[v]$ є найкоротшою і більше не змінюватиметься.**

Доведення проводиться методом індукції. Для першої ітерації це твердження очевидне: єдина позначена вершина — це $s$, і відстань до неї $d[s] = 0$ справді є довжиною найкоротшого шляху до $s$. Тепер припустимо, що це твердження істинне для всіх попередніх ітерацій, тобто для всіх уже позначених вершин; доведемо, що воно не порушується після завершення поточної ітерації. Нехай $v$ — вершина, обрана на поточній ітерації, тобто $v$ — це вершина, яку алгоритм позначить. Тепер нам треба довести, що $d[v]$ справді дорівнює довжині найкоротшого шляху до неї $l[v]$.

Розглянемо найкоротший шлях $P$ до вершини $v$. Цей шлях можна розбити на дві частини: $P_1$, яка складається лише з позначених вершин (принаймні початкова вершина $s$ є частиною $P_1$), і решту шляху $P_2$ (вона може містити позначену вершину, але завжди починається з непозначеної вершини). Позначимо першу вершину шляху $P_2$ як $p$, а останню вершину шляху $P_1$ як $q$.

Спочатку доведемо наше твердження для вершини $p$, тобто доведемо, що $d[p] = l[p]$.
Це майже очевидно: на одній з попередніх ітерацій ми обрали вершину $q$ і виконали з неї релаксацію.
Оскільки (через вибір вершини $p$) найкоротший шлях до $p$ — це найкоротший шлях до $q$ плюс ребро $(p,q)$, релаксація з $q$ встановила значення $d[p]$ рівним довжині найкоротшого шляху $l[p]$.

Оскільки ваги ребер невід'ємні, довжина найкоротшого шляху $l[p]$ (яку ми щойно довели рівною $d[p]$) не перевищує довжину $l[v]$ найкоротшого шляху до вершини $v$. З огляду на те, що $l[v] \le d[v]$ (бо алгоритм Дейкстри не міг знайти коротшого шляху, ніж найкоротший можливий), отримуємо нерівність:

$$
d[p] = l[p] \le l[v] \le d[v]
$$

З іншого боку, оскільки обидві вершини $p$ і $v$ непозначені, і на поточній ітерації було обрано вершину $v$, а не $p$, отримуємо ще одну нерівність:

$$
d[p] \ge d[v]
$$

З цих двох нерівностей робимо висновок, що $d[p] = d[v]$, а тоді з раніше знайдених рівностей отримуємо:

$$
d[v] = l[v]
$$

Що й треба було довести.

## Реалізація \{#implementation}

Алгоритм Дейкстри виконує $n$ ітерацій. На кожній ітерації він обирає непозначену вершину $v$ з найменшим значенням $d[v]$, позначає її та перевіряє всі ребра $(v, \text{to})$, намагаючись покращити значення $d[\text{to}]$.

Час роботи алгоритму складається з:

* $n$ пошуків вершини з найменшим значенням $d[v]$ серед $O(n)$ непозначених вершин
* $m$ спроб релаксації

Для найпростішої реалізації цих операцій на кожній ітерації пошук вершини потребує $O(n)$ операцій, а кожну релаксацію можна виконати за $O(1)$. Отже, підсумкова асимптотика алгоритму:

$$
O(n^2+m)
$$

Ця складність оптимальна для щільного графа, тобто коли $m \approx n^2$.
Однак у розріджених графах, коли $m$ значно менше за максимальну кількість ребер $n^2$, задачу можна розв'язати зі складністю $O(n \log n + m)$. Алгоритм і реалізацію можна знайти у статті [Алгоритм Дейкстри на розріджених графах](dijkstra_sparse.md).


<CodeTabs>

```cpp
const int INF = 1000000000;
vector<vector<pair<int, int>>> adj;

void dijkstra(int s, vector<int> & d, vector<int> & p) {
    int n = adj.size();
    d.assign(n, INF);
    p.assign(n, -1);
    vector<bool> u(n, false);

    d[s] = 0;
    for (int i = 0; i < n; i++) {
        int v = -1;
        for (int j = 0; j < n; j++) {
            if (!u[j] && (v == -1 || d[j] < d[v]))
                v = j;
        }
        
        if (d[v] == INF)
            break;
        
        u[v] = true;
        for (auto edge : adj[v]) {
            int to = edge.first;
            int len = edge.second;
            
            if (d[v] + len < d[to]) {
                d[to] = d[v] + len;
                p[to] = v;
            }
        }
    }
}
```

```python
INF = 1000000000

# adj — список суміжності: adj[v] містить пари (to, len)
def dijkstra(s: int, adj: list[list[tuple[int, int]]]) -> tuple[list[int], list[int]]:
    n = len(adj)
    d = [INF] * n              # відстані від s
    p = [-1] * n               # попередники
    u = [False] * n            # позначені вершини

    d[s] = 0
    for _ in range(n):
        # обираємо непозначену вершину з найменшою відстанню
        v = -1
        for j in range(n):
            if not u[j] and (v == -1 or d[j] < d[v]):
                v = j

        if d[v] == INF:
            break

        u[v] = True
        for to, length in adj[v]:
            # релаксація ребра (v, to)
            if d[v] + length < d[to]:
                d[to] = d[v] + length
                p[to] = v

    return d, p
```

```typescript
const INF = 1000000000;

// adj — список суміжності: adj[v] містить пари [to, len]
function dijkstra(
    s: number,
    adj: [number, number][][],
): { d: number[]; p: number[] } {
    const n = adj.length;
    const d: number[] = new Array(n).fill(INF); // відстані від s
    const p: number[] = new Array(n).fill(-1);  // попередники
    const u: boolean[] = new Array(n).fill(false); // позначені вершини

    d[s] = 0;
    for (let i = 0; i < n; i++) {
        // обираємо непозначену вершину з найменшою відстанню
        let v = -1;
        for (let j = 0; j < n; j++) {
            if (!u[j] && (v === -1 || d[j] < d[v])) {
                v = j;
            }
        }

        if (d[v] === INF) {
            break;
        }

        u[v] = true;
        for (const [to, len] of adj[v]) {
            // релаксація ребра (v, to)
            if (d[v] + len < d[to]) {
                d[to] = d[v] + len;
                p[to] = v;
            }
        }
    }

    return { d, p };
}
```

```go
const INF = 1000000000

// adj — список суміжності: adj[v] містить пари {to, len}
func dijkstra(s int, adj [][][2]int) (d, p []int) {
    n := len(adj)
    d = make([]int, n) // відстані від s
    p = make([]int, n) // попередники
    u := make([]bool, n) // позначені вершини
    for i := range d {
        d[i] = INF
        p[i] = -1
    }

    d[s] = 0
    for i := 0; i < n; i++ {
        // обираємо непозначену вершину з найменшою відстанню
        v := -1
        for j := 0; j < n; j++ {
            if !u[j] && (v == -1 || d[j] < d[v]) {
                v = j
            }
        }

        if d[v] == INF {
            break
        }

        u[v] = true
        for _, edge := range adj[v] {
            to, length := edge[0], edge[1]
            // релаксація ребра (v, to)
            if d[v]+length < d[to] {
                d[to] = d[v] + length
                p[to] = v
            }
        }
    }

    return d, p
}
```

</CodeTabs>

Тут граф $\text{adj}$ зберігається як список суміжності: для кожної вершини $v$ значення $\text{adj}[v]$ містить список ребер, що виходять з цієї вершини, тобто список `pair<int,int>`, де перший елемент пари — це вершина на іншому кінці ребра, а другий елемент — вага ребра.

Функція приймає початкову вершину $s$ і два вектори, які будуть використані як значення, що повертаються.

Найперше код ініціалізує масиви: відстаней $d[]$, позначок $u[]$ і попередників $p[]$. Потім він виконує $n$ ітерацій. На кожній ітерації обирається вершина $v$, яка має найменшу відстань $d[v]$ серед усіх непозначених вершин. Якщо відстань до обраної вершини $v$ дорівнює нескінченності, алгоритм зупиняється. Інакше вершина позначається, і перевіряються всі ребра, що виходять з цієї вершини. Якщо релаксація вздовж ребра можлива (тобто відстань $d[\text{to}]$ можна покращити), то відстань $d[\text{to}]$ і попередник $p[\text{to}]$ оновлюються.

Після виконання всіх ітерацій масив $d[]$ зберігає довжини найкоротших шляхів до всіх вершин, а масив $p[]$ зберігає попередників усіх вершин (крім початкової вершини $s$). Шлях до будь-якої вершини $t$ можна відновити так:

<CodeTabs>

```cpp
vector<int> restore_path(int s, int t, vector<int> const& p) {
    vector<int> path;

    for (int v = t; v != s; v = p[v])
        path.push_back(v);
    path.push_back(s);

    reverse(path.begin(), path.end());
    return path;
}
```

```python
def restore_path(s: int, t: int, p: list[int]) -> list[int]:
    path = []

    # йдемо від t назад по попередниках, доки не дійдемо до s
    v = t
    while v != s:
        path.append(v)
        v = p[v]
    path.append(s)

    path.reverse()  # розвертаємо, щоб шлях ішов від s до t
    return path
```

```typescript
function restorePath(s: number, t: number, p: number[]): number[] {
    const path: number[] = [];

    // йдемо від t назад по попередниках, доки не дійдемо до s
    for (let v = t; v !== s; v = p[v]) {
        path.push(v);
    }
    path.push(s);

    path.reverse(); // розвертаємо, щоб шлях ішов від s до t
    return path;
}
```

```go
func restorePath(s, t int, p []int) []int {
    path := []int{}

    // йдемо від t назад по попередниках, доки не дійдемо до s
    for v := t; v != s; v = p[v] {
        path = append(path, v)
    }
    path = append(path, s)

    // розвертаємо, щоб шлях ішов від s до t
    for i, j := 0, len(path)-1; i < j; i, j = i+1, j-1 {
        path[i], path[j] = path[j], path[i]
    }
    return path
}
```

</CodeTabs>

## Джерела \{#references}

* Edsger Dijkstra. A note on two problems in connexion with graphs [1959]
* Thomas Cormen, Charles Leiserson, Ronald Rivest, Clifford Stein. Introduction to Algorithms [2005]

## Задачі для практики \{#practice-problems}
* [Timus - Ivan's Car](http://acm.timus.ru/problem.aspx?space=1&num=1930) [Difficulty:Medium]
* [Timus - Sightseeing Trip](http://acm.timus.ru/problem.aspx?space=1&num=1004)
* [SPOJ - SHPATH](http://www.spoj.com/problems/SHPATH/) [Difficulty:Easy]
* [Codeforces - Dijkstra?](http://codeforces.com/problemset/problem/20/C) [Difficulty:Easy]
* [Codeforces - Shortest Path](http://codeforces.com/problemset/problem/59/E)
* [Codeforces - Jzzhu and Cities](http://codeforces.com/problemset/problem/449/B)
* [Codeforces - The Classic Problem](http://codeforces.com/problemset/problem/464/E)
* [Codeforces - President and Roads](http://codeforces.com/problemset/problem/567/E)
* [Codeforces - Complete The Graph](http://codeforces.com/problemset/problem/715/B)
* [TopCoder - SkiResorts](https://community.topcoder.com/stat?c=problem_statement&pm=12468)
* [TopCoder - MaliciousPath](https://community.topcoder.com/stat?c=problem_statement&pm=13596)
* [SPOJ - Ada and Trip](http://www.spoj.com/problems/ADATRIP/)
* [LA - 3850 - Here We Go(relians) Again](https://vjudge.net/problem/UVALive-3850)
* [GYM - Destination Unknown (D)](http://codeforces.com/gym/100625)
* [UVA 12950 - Even Obsession](https://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=4829)
* [GYM - Journey to Grece (A)](http://codeforces.com/gym/100753)
* [UVA 13030 - Brain Fry](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&category=866&page=show_problem&problem=4918)
* [UVA 1027 - Toll](https://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=3468)
* [UVA 11377 - Airport Setup](https://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=2372)
* [Codeforces - Dynamic Shortest Path](http://codeforces.com/problemset/problem/843/D)
* [UVA 11813 - Shopping](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=2913)
* [UVA 11833 - Route Change](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&category=226&page=show_problem&problem=2933)
* [SPOJ - Easy Dijkstra Problem](http://www.spoj.com/problems/EZDIJKST/en/)
* [LA - 2819 - Cave Raider](https://vjudge.net/problem/UVALive-2819)
* [UVA 12144 - Almost Shortest Path](https://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=3296)
* [UVA 12047 - Highest Paid Toll](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=3198)
* [UVA 11514 - Batman](https://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=2509)
* [Codeforces - Team Rocket Rises Again](http://codeforces.com/contest/757/problem/F)
* [UVA - 11338 - Minefield](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=2313)
* [UVA 11374 - Airport Express](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=2369)
* [UVA 11097 - Poor My Problem](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=2038)
* [UVA 13172 - The music teacher](https://uva.onlinejudge.org/index.php?option=onlinejudge&Itemid=8&page=show_problem&problem=5083)
* [Codeforces - Dirty Arkady's Kitchen](http://codeforces.com/contest/827/problem/F)
* [SPOJ - Delivery Route](http://www.spoj.com/problems/DELIVER/)
* [SPOJ - Costly Chess](http://www.spoj.com/problems/CCHESS/)
* [CSES - Shortest Routes 1](https://cses.fi/problemset/task/1671)
* [CSES - Flight Discount](https://cses.fi/problemset/task/1195)
* [CSES - Flight Routes](https://cses.fi/problemset/task/1196)

## Відеоматеріали \{#video}

<YouTubeEmbed id="GazC3A4OQTE" title="Dijkstra's Algorithm - Computerphile — Computerphile" />
