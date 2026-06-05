# Алгоритм Беллмана–Форда

**Найкоротші шляхи з однієї вершини за наявності ребер від'ємної ваги**

Припустимо, нам дано зважений орієнтований граф $G$ з $n$ вершинами та $m$ ребрами, а також деяку задану вершину $v$. Ми хочемо знайти довжини найкоротших шляхів від вершини $v$ до всіх інших вершин.

На відміну від алгоритму Дейкстри, цей алгоритм можна застосовувати й до графів, що містять ребра від'ємної ваги. Однак якщо граф містить цикл від'ємної ваги, то, очевидно, найкоротшого шляху до деяких вершин може й не існувати (адже вага найкоротшого шляху має дорівнювати мінус нескінченності); проте цей алгоритм можна модифікувати так, щоб він сигналізував про наявність циклу від'ємної ваги або навіть відновлював цей цикл.

Алгоритм носить імена двох американських науковців: Річарда Беллмана та Лестера Форда. Насправді Форд винайшов цей алгоритм у 1956 році під час дослідження іншої математичної задачі, яка зрештою звелася до підзадачі пошуку найкоротших шляхів у графі, і Форд накидав схему алгоритму для розв'язання цієї задачі. Беллман у 1958 році опублікував статтю, присвячену безпосередньо задачі пошуку найкоротшого шляху, і в цій статті він чітко сформулював алгоритм у тому вигляді, у якому він відомий нам зараз.

## Опис алгоритму \{#description-of-the-algorithm}

Припустимо, що граф не містить циклів від'ємної ваги. Випадок наявності циклу від'ємної ваги ми обговоримо нижче в окремому розділі.

Ми створимо масив відстаней $d[0 \ldots n-1]$, який після виконання алгоритму міститиме відповідь на задачу. На початку заповнюємо його так: $d[v] = 0$, а всі інші елементи $d[ ]$ дорівнюють нескінченності $\infty$.

Алгоритм складається з кількох фаз. Кожна фаза проходить по всіх ребрах графа, і алгоритм намагається виконати **релаксацію** вздовж кожного ребра $(a,b)$ з вагою $c$. Релаксація вздовж ребра — це спроба покращити значення $d[b]$ за допомогою значення $d[a] + c$. Фактично це означає, що ми намагаємося покращити відповідь для цієї вершини, використовуючи ребро $(a,b)$ та поточну відповідь для вершини $a$.

Стверджується, що $n-1$ фаз алгоритму достатньо, щоб правильно обчислити довжини всіх найкоротших шляхів у графі (знову ж таки, ми вважаємо, що циклів від'ємної ваги не існує). Для недосяжних вершин відстань $d[ ]$ залишиться рівною нескінченності $\infty$.

## Реалізація \{#implementation}

На відміну від багатьох інших графових алгоритмів, для алгоритму Беллмана–Форда зручніше представляти граф за допомогою єдиного списку всіх ребер (замість $n$ списків ребер — ребер з кожної вершини). Ми починаємо реалізацію зі структури $\rm edge$ для представлення ребер. На вхід алгоритму подаються числа $n$, $m$, список $e$ ребер та початкова вершина $v$. Усі вершини пронумеровані від $0$ до $n - 1$.

### Найпростіша реалізація \{#the-simplest-implementation}

Константа $\rm INF$ позначає число «нескінченність» — її слід обрати так, щоб вона була більшою за всі можливі довжини шляхів.

<CodeTabs>

```cpp
struct Edge {
    int a, b, cost;
};

int n, m, v;
vector<Edge> edges;
const int INF = 1000000000;

void solve()
{
    vector<int> d(n, INF);
    d[v] = 0;
    for (int i = 0; i < n - 1; ++i)
        for (Edge e : edges)
            if (d[e.a] < INF)
                d[e.b] = min(d[e.b], d[e.a] + e.cost);
    // виводимо d, наприклад, на екран
}
```

```python
from dataclasses import dataclass

@dataclass
class Edge:
    a: int
    b: int
    cost: int

INF = 1000000000

def solve(n: int, v: int, edges: list[Edge]) -> list[int]:
    d = [INF] * n
    d[v] = 0
    for _ in range(n - 1):
        for e in edges:
            # релаксуємо лише з вершин, до яких уже знайдено шлях,
            # інакше з'явилися б некоректні відстані виду INF - 1
            if d[e.a] < INF:
                d[e.b] = min(d[e.b], d[e.a] + e.cost)
    return d  # масив відстаней
```

```typescript
interface Edge {
    a: number;
    b: number;
    cost: number;
}

const INF = 1000000000;

function solve(n: number, v: number, edges: Edge[]): number[] {
    const d: number[] = new Array(n).fill(INF);
    d[v] = 0;
    for (let i = 0; i < n - 1; ++i) {
        for (const e of edges) {
            // релаксуємо лише з вершин, до яких уже знайдено шлях,
            // інакше з'явилися б некоректні відстані виду INF - 1
            if (d[e.a] < INF) {
                d[e.b] = Math.min(d[e.b], d[e.a] + e.cost);
            }
        }
    }
    return d; // масив відстаней
}
```

```go
type Edge struct {
    a, b, cost int
}

const INF = 1000000000

func solve(n, v int, edges []Edge) []int {
    d := make([]int, n)
    for i := range d {
        d[i] = INF
    }
    d[v] = 0
    for i := 0; i < n-1; i++ {
        for _, e := range edges {
            // релаксуємо лише з вершин, до яких уже знайдено шлях,
            // інакше з'явилися б некоректні відстані виду INF - 1
            if d[e.a] < INF && d[e.a]+e.cost < d[e.b] {
                d[e.b] = d[e.a] + e.cost
            }
        }
    }
    return d // масив відстаней
}
```

</CodeTabs>

Перевірка `if (d[e.a] < INF)` потрібна лише тоді, коли граф містить ребра від'ємної ваги: без такої перевірки відбувалася б релаксація з вершин, шляхи до яких ще не знайдено, і з'являлися б некоректні відстані виду $\infty - 1$, $\infty - 2$ тощо.

### Краща реалізація \{#a-better-implementation}

Цей алгоритм можна дещо пришвидшити: часто ми вже отримуємо відповідь за кілька фаз, а в решті фаз ніякої корисної роботи не виконується — це лише марний прохід по всіх ребрах. Тож зберігаймо прапорець, який вказує, чи змінилося щось у поточній фазі, і якщо в якійсь фазі нічого не змінилося, алгоритм можна зупинити. (Ця оптимізація не покращує асимптотичну поведінку, тобто для деяких графів усе одно знадобляться всі $n-1$ фаз, але значно прискорює роботу алгоритму «в середньому», тобто на випадкових графах.)

З цією оптимізацією зазвичай немає потреби вручну обмежувати кількість фаз алгоритму числом $n-1$ — алгоритм зупиниться після потрібної кількості фаз.

<CodeTabs>

```cpp
void solve()
{
    vector<int> d(n, INF);
    d[v] = 0;
    for (;;) {
        bool any = false;

        for (Edge e : edges)
            if (d[e.a] < INF)
                if (d[e.b] > d[e.a] + e.cost) {
                    d[e.b] = d[e.a] + e.cost;
                    any = true;
                }

        if (!any)
            break;
    }
    // виводимо d, наприклад, на екран
}
```

```python
def solve(n: int, v: int, edges: list[Edge]) -> list[int]:
    d = [INF] * n
    d[v] = 0
    while True:
        any_changed = False  # чи покращилося щось у цій фазі
        for e in edges:
            if d[e.a] < INF:
                if d[e.b] > d[e.a] + e.cost:
                    d[e.b] = d[e.a] + e.cost
                    any_changed = True
        if not any_changed:  # фаза без змін — зупиняємось
            break
    return d
```

```typescript
function solve(n: number, v: number, edges: Edge[]): number[] {
    const d: number[] = new Array(n).fill(INF);
    d[v] = 0;
    for (;;) {
        let anyChanged = false; // чи покращилося щось у цій фазі
        for (const e of edges) {
            if (d[e.a] < INF) {
                if (d[e.b] > d[e.a] + e.cost) {
                    d[e.b] = d[e.a] + e.cost;
                    anyChanged = true;
                }
            }
        }
        if (!anyChanged) { // фаза без змін — зупиняємось
            break;
        }
    }
    return d;
}
```

```go
func solve(n, v int, edges []Edge) []int {
    d := make([]int, n)
    for i := range d {
        d[i] = INF
    }
    d[v] = 0
    for {
        anyChanged := false // чи покращилося щось у цій фазі
        for _, e := range edges {
            if d[e.a] < INF {
                if d[e.b] > d[e.a]+e.cost {
                    d[e.b] = d[e.a] + e.cost
                    anyChanged = true
                }
            }
        }
        if !anyChanged { // фаза без змін — зупиняємось
            break
        }
    }
    return d
}
```

</CodeTabs>

### Відновлення шляху \{#retrieving-path}

Розгляньмо тепер, як модифікувати алгоритм так, щоб він не лише знаходив довжину найкоротших шляхів, але й дозволяв відновити самі найкоротші шляхи.

Для цього створимо ще один масив $p[0 \ldots n-1]$, де для кожної вершини зберігатимемо її «попередника», тобто передостанню вершину на найкоротшому шляху, що веде до неї. Фактично найкоротший шлях до будь-якої вершини $a$ — це найкоротший шлях до деякої вершини $p[a]$, до якого ми додали $a$ в кінці шляху.

Зауважимо, що алгоритм працює за тією самою логікою: він вважає, що найкоротша відстань до однієї вершини вже обчислена, і намагається покращити найкоротшу відстань до інших вершин з цієї вершини. Тому в момент покращення нам потрібно лише запам'ятати $p[ ]$, тобто вершину, з якої відбулося це покращення.

Нижче наведено реалізацію алгоритму Беллмана–Форда з відновленням найкоротшого шляху до заданої вершини $t$:

<CodeTabs>

```cpp
void solve()
{
    vector<int> d(n, INF);
    d[v] = 0;
    vector<int> p(n, -1);

    for (;;) {
        bool any = false;
        for (Edge e : edges)
            if (d[e.a] < INF)
                if (d[e.b] > d[e.a] + e.cost) {
                    d[e.b] = d[e.a] + e.cost;
                    p[e.b] = e.a;
                    any = true;
                }
        if (!any)
            break;
    }

    if (d[t] == INF)
        cout << "No path from " << v << " to " << t << ".";
    else {
        vector<int> path;
        for (int cur = t; cur != -1; cur = p[cur])
            path.push_back(cur);
        reverse(path.begin(), path.end());

        cout << "Path from " << v << " to " << t << ": ";
        for (int u : path)
            cout << u << ' ';
    }
}
```

```python
def solve(n: int, v: int, t: int, edges: list[Edge]) -> None:
    d = [INF] * n
    d[v] = 0
    p = [-1] * n  # попередник кожної вершини на найкоротшому шляху

    while True:
        any_changed = False
        for e in edges:
            if d[e.a] < INF:
                if d[e.b] > d[e.a] + e.cost:
                    d[e.b] = d[e.a] + e.cost
                    p[e.b] = e.a  # запам'ятовуємо, звідки прийшли
                    any_changed = True
        if not any_changed:
            break

    if d[t] == INF:
        print(f"No path from {v} to {t}.")
    else:
        path = []
        cur = t
        while cur != -1:  # ідемо по попередниках до старту
            path.append(cur)
            cur = p[cur]
        path.reverse()
        print(f"Path from {v} to {t}: " + " ".join(map(str, path)))
```

```typescript
function solve(n: number, v: number, t: number, edges: Edge[]): void {
    const d: number[] = new Array(n).fill(INF);
    d[v] = 0;
    const p: number[] = new Array(n).fill(-1); // попередник кожної вершини

    for (;;) {
        let anyChanged = false;
        for (const e of edges) {
            if (d[e.a] < INF) {
                if (d[e.b] > d[e.a] + e.cost) {
                    d[e.b] = d[e.a] + e.cost;
                    p[e.b] = e.a; // запам'ятовуємо, звідки прийшли
                    anyChanged = true;
                }
            }
        }
        if (!anyChanged) {
            break;
        }
    }

    if (d[t] === INF) {
        console.log(`No path from ${v} to ${t}.`);
    } else {
        const path: number[] = [];
        for (let cur = t; cur !== -1; cur = p[cur]) { // йдемо по попередниках
            path.push(cur);
        }
        path.reverse();
        console.log(`Path from ${v} to ${t}: ` + path.join(" "));
    }
}
```

```go
func solve(n, v, t int, edges []Edge) {
    d := make([]int, n)
    for i := range d {
        d[i] = INF
    }
    d[v] = 0
    p := make([]int, n) // попередник кожної вершини
    for i := range p {
        p[i] = -1
    }

    for {
        anyChanged := false
        for _, e := range edges {
            if d[e.a] < INF {
                if d[e.b] > d[e.a]+e.cost {
                    d[e.b] = d[e.a] + e.cost
                    p[e.b] = e.a // запам'ятовуємо, звідки прийшли
                    anyChanged = true
                }
            }
        }
        if !anyChanged {
            break
        }
    }

    if d[t] == INF {
        fmt.Printf("No path from %d to %d.", v, t)
    } else {
        var path []int
        for cur := t; cur != -1; cur = p[cur] { // йдемо по попередниках
            path = append(path, cur)
        }
        for i, j := 0, len(path)-1; i < j; i, j = i+1, j-1 {
            path[i], path[j] = path[j], path[i]
        }
        fmt.Printf("Path from %d to %d: ", v, t)
        for _, u := range path {
            fmt.Printf("%d ", u)
        }
    }
}
```

</CodeTabs>

Тут, починаючи з вершини $t$, ми йдемо по попередниках, доки не дійдемо до початкової вершини, яка не має попередника, і зберігаємо всі вершини шляху в списку $\rm path$. Цей список є найкоротшим шляхом від $v$ до $t$, але у зворотному порядку, тому ми викликаємо функцію $\rm reverse()$ над $\rm path$, а потім виводимо шлях.

## Доведення алгоритму \{#the-proof-of-the-algorithm}

Спершу зауважимо, що для всіх недосяжних вершин $u$ алгоритм працюватиме коректно: позначка $d[u]$ залишиться рівною нескінченності (адже алгоритм Беллмана–Форда знайде якийсь шлях до всіх вершин, досяжних з початкової вершини $v$, а релаксація для всіх інших вершин ніколи не відбудеться).

Доведімо тепер таке твердження: після виконання $i$-ї фази алгоритм Беллмана–Форда правильно знаходить усі найкоротші шляхи, кількість ребер у яких не перевищує $i$.

Іншими словами, для будь-якої вершини $a$ позначимо через $k$ кількість ребер у найкоротшому шляху до неї (якщо таких шляхів декілька, можна взяти будь-який). Згідно з цим твердженням, алгоритм гарантує, що після $k$-ї фази найкоротший шлях для вершини $a$ буде знайдено.

**Доведення**:
Розгляньмо довільну вершину $a$, до якої існує шлях від початкової вершини $v$, і розгляньмо найкоротший шлях до неї $(p_0=v, p_1, \ldots, p_k=a)$. Перед першою фазою найкоротший шлях до вершини $p_0 = v$ було знайдено правильно. Під час першої фази алгоритм перевірив ребро $(p_0,p_1)$, а отже, відстань до вершини $p_1$ була правильно обчислена після першої фази. Повторивши це твердження $k$ разів, ми бачимо, що після $k$-ї фази відстань до вершини $p_k = a$ обчислюється правильно, що ми й хотіли довести.

Останнє, що варто зауважити, — будь-який найкоротший шлях не може мати більше ніж $n - 1$ ребер. Тому алгоритму достатньо дійти до $(n-1)$-ї фази. Після цього гарантується, що жодна релаксація не покращить відстань до жодної вершини.

## Випадок циклу від'ємної ваги \{#the-case-of-a-negative-cycle}

Усюди вище ми вважали, що в графі немає циклу від'ємної ваги (точніше, нас цікавить цикл від'ємної ваги, досяжний з початкової вершини $v$, бо для недосяжних циклів в описаному вище алгоритмі нічого не змінюється). За наявності циклу (циклів) від'ємної ваги виникають додаткові ускладнення, пов'язані з тим, що відстані до всіх вершин у цьому циклі, а також відстані до вершин, досяжних із цього циклу, не визначені — вони мали б дорівнювати мінус нескінченності $(- \infty)$.

Легко бачити, що алгоритм Беллмана–Форда може нескінченно виконувати релаксацію серед усіх вершин цього циклу та вершин, досяжних із нього. Тому якщо не обмежити кількість фаз числом $n - 1$, алгоритм працюватиме нескінченно, постійно покращуючи відстань від цих вершин.

Звідси отримуємо **критерій наявності циклу від'ємної ваги, досяжного з початкової вершини $v$**: після $(n-1)$-ї фази, якщо ми запустимо алгоритм ще на одну фазу і він виконає принаймні ще одну релаксацію, то граф містить цикл від'ємної ваги, досяжний з $v$; інакше такого циклу не існує.

Більше того, якщо такий цикл знайдено, алгоритм Беллмана–Форда можна модифікувати так, щоб він відновлював цей цикл як послідовність вершин, що до нього входять. Для цього достатньо запам'ятати останню вершину $x$, для якої відбулася релаксація в $n$-й фазі. Ця вершина або лежить на циклі від'ємної ваги, або досяжна з нього. Щоб отримати вершини, які гарантовано лежать на циклі від'ємної ваги, починаючи з вершини $x$, пройдемо по попередниках $n$ разів. Так ми потрапимо у вершину $y$, яка гарантовано лежить на циклі від'ємної ваги. Нам потрібно йти з цієї вершини по попередниках, доки не повернемося до тієї самої вершини $y$ (а це станеться, бо релаксація в циклі від'ємної ваги відбувається по колу).

### Реалізація: \{#implementation-1}

<CodeTabs>

```cpp
void solve()
{
    vector<int> d(n, INF);
    d[v] = 0;
    vector<int> p(n, -1);
    int x;
    for (int i = 0; i < n; ++i) {
        x = -1;
        for (Edge e : edges)
            if (d[e.a] < INF)
                if (d[e.b] > d[e.a] + e.cost) {
                    d[e.b] = max(-INF, d[e.a] + e.cost);
                    p[e.b] = e.a;
                    x = e.b;
                }
    }

    if (x == -1)
        cout << "No negative cycle from " << v;
    else {
        int y = x;
        for (int i = 0; i < n; ++i)
            y = p[y];

        vector<int> path;
        for (int cur = y;; cur = p[cur]) {
            path.push_back(cur);
            if (cur == y && path.size() > 1)
                break;
        }
        reverse(path.begin(), path.end());

        cout << "Negative cycle: ";
        for (int u : path)
            cout << u << ' ';
    }
}
```

```python
def solve(n: int, v: int, edges: list[Edge]) -> None:
    d = [INF] * n
    d[v] = 0
    p = [-1] * n
    x = -1
    for _ in range(n):  # n-та фаза слугує детектором циклу
        x = -1
        for e in edges:
            if d[e.a] < INF:
                if d[e.b] > d[e.a] + e.cost:
                    # обмежуємо знизу, щоб уникнути виходу далеко в мінус
                    d[e.b] = max(-INF, d[e.a] + e.cost)
                    p[e.b] = e.a
                    x = e.b  # вершина, релаксована в цій фазі

    if x == -1:  # на n-й фазі релаксацій не було — циклу немає
        print(f"No negative cycle from {v}")
    else:
        y = x
        for _ in range(n):  # n кроків углиб гарантовано приводять на цикл
            y = p[y]

        path = []
        cur = y
        while True:  # обходимо цикл, доки не повернемось у y
            path.append(cur)
            if cur == y and len(path) > 1:
                break
            cur = p[cur]
        path.reverse()
        print("Negative cycle: " + " ".join(map(str, path)))
```

```typescript
function solve(n: number, v: number, edges: Edge[]): void {
    const d: number[] = new Array(n).fill(INF);
    d[v] = 0;
    const p: number[] = new Array(n).fill(-1);
    let x = -1;
    for (let i = 0; i < n; ++i) { // n-та фаза слугує детектором циклу
        x = -1;
        for (const e of edges) {
            if (d[e.a] < INF) {
                if (d[e.b] > d[e.a] + e.cost) {
                    // обмежуємо знизу, щоб уникнути виходу далеко в мінус
                    d[e.b] = Math.max(-INF, d[e.a] + e.cost);
                    p[e.b] = e.a;
                    x = e.b; // вершина, релаксована в цій фазі
                }
            }
        }
    }

    if (x === -1) { // на n-й фазі релаксацій не було — циклу немає
        console.log(`No negative cycle from ${v}`);
    } else {
        let y = x;
        for (let i = 0; i < n; ++i) { // n кроків углиб приводять на цикл
            y = p[y];
        }

        const path: number[] = [];
        for (let cur = y; ; cur = p[cur]) { // обходимо цикл, доки не повернемось у y
            path.push(cur);
            if (cur === y && path.length > 1) {
                break;
            }
        }
        path.reverse();
        console.log("Negative cycle: " + path.join(" "));
    }
}
```

```go
func solve(n, v int, edges []Edge) {
    d := make([]int, n)
    for i := range d {
        d[i] = INF
    }
    d[v] = 0
    p := make([]int, n)
    for i := range p {
        p[i] = -1
    }
    x := -1
    for i := 0; i < n; i++ { // n-та фаза слугує детектором циклу
        x = -1
        for _, e := range edges {
            if d[e.a] < INF {
                if d[e.b] > d[e.a]+e.cost {
                    // обмежуємо знизу, щоб уникнути виходу далеко в мінус
                    d[e.b] = max(-INF, d[e.a]+e.cost)
                    p[e.b] = e.a
                    x = e.b // вершина, релаксована в цій фазі
                }
            }
        }
    }

    if x == -1 { // на n-й фазі релаксацій не було — циклу немає
        fmt.Printf("No negative cycle from %d", v)
    } else {
        y := x
        for i := 0; i < n; i++ { // n кроків углиб приводять на цикл
            y = p[y]
        }

        var path []int
        for cur := y; ; cur = p[cur] { // обходимо цикл, доки не повернемось у y
            path = append(path, cur)
            if cur == y && len(path) > 1 {
                break
            }
        }
        for i, j := 0, len(path)-1; i < j; i, j = i+1, j-1 {
            path[i], path[j] = path[j], path[i]
        }
        fmt.Print("Negative cycle: ")
        for _, u := range path {
            fmt.Printf("%d ", u)
        }
    }
}
```

</CodeTabs>

Через наявність циклу від'ємної ваги за $n$ ітерацій алгоритму відстані можуть піти далеко в область від'ємних значень (до від'ємних чисел порядку $-n m W$, де $W$ — максимальне абсолютне значення ваги в графі). Тому в коді ми вжили додаткових заходів проти цілочисельного переповнення:

<CodeTabs>

```cpp
d[e.b] = max(-INF, d[e.a] + e.cost);
```

```python
d[e.b] = max(-INF, d[e.a] + e.cost)
```

```typescript
d[e.b] = Math.max(-INF, d[e.a] + e.cost);
```

```go
d[e.b] = max(-INF, d[e.a]+e.cost)
```

</CodeTabs>

Наведена вище реалізація шукає цикл від'ємної ваги, досяжний з деякої початкової вершини $v$; однак алгоритм можна модифікувати так, щоб він просто шукав будь-який цикл від'ємної ваги в графі. Для цього нам потрібно покласти всі відстані $d[i]$ рівними нулю, а не нескінченності — ніби ми шукаємо найкоротший шлях з усіх вершин одночасно; на коректність виявлення циклу від'ємної ваги це не впливає.

Докладніше на цю тему — див. окрему статтю [Пошук циклу від'ємної ваги в графі](finding-negative-cycle-in-graph.md).

## Алгоритм найшвидшого найкоротшого шляху (SPFA) \{#shortest-path-faster-algorithm-spfa}

SPFA — це покращення алгоритму Беллмана–Форда, яке користується тим фактом, що не всі спроби релаксації спрацюють.
Основна ідея полягає в тому, щоб створити чергу, що містить лише ті вершини, які були релаксовані, але які все ще можуть далі релаксувати своїх сусідів.
І щоразу, коли можна релаксувати якогось сусіда, його слід покласти в чергу. Цей алгоритм також можна використовувати для виявлення циклів від'ємної ваги, як і алгоритм Беллмана–Форда.

Найгірший випадок цього алгоритму дорівнює $O(n m)$ алгоритму Беллмана–Форда, але на практиці він працює значно швидше, і [дехто стверджує, що в середньому він працює навіть за $O(m)$](https://en.wikipedia.org/wiki/Shortest_Path_Faster_Algorithm#Average-case_performance). Однак будьте обережні, адже цей алгоритм детермінований, і легко створити контрприклади, які змушують алгоритм працювати за $O(n m)$.

У реалізації слід подбати про деякі деталі, наприклад про те, що алгоритм працюватиме нескінченно, якщо в графі є цикл від'ємної ваги.
Щоб цього уникнути, можна створити лічильник, який зберігає, скільки разів вершину було релаксовано, і зупинити алгоритм, щойно якусь вершину буде релаксовано $n$-й раз.
Зауважте також, що немає сенсу класти вершину в чергу, якщо вона вже там.

<CodeTabs>

```cpp
const int INF = 1000000000;
vector<vector<pair<int, int>>> adj;

bool spfa(int s, vector<int>& d) {
    int n = adj.size();
    d.assign(n, INF);
    vector<int> cnt(n, 0);
    vector<bool> inqueue(n, false);
    queue<int> q;

    d[s] = 0;
    q.push(s);
    inqueue[s] = true;
    while (!q.empty()) {
        int v = q.front();
        q.pop();
        inqueue[v] = false;

        for (auto edge : adj[v]) {
            int to = edge.first;
            int len = edge.second;

            if (d[v] + len < d[to]) {
                d[to] = d[v] + len;
                if (!inqueue[to]) {
                    q.push(to);
                    inqueue[to] = true;
                    cnt[to]++;
                    if (cnt[to] > n)
                        return false;  // цикл від'ємної ваги
                }
            }
        }
    }
    return true;
}
```

```python
from collections import deque

INF = 1000000000

# adj — список суміжності: adj[v] = [(to, len), ...]
# повертає (ok, d): ok=False, якщо знайдено цикл від'ємної ваги
def spfa(adj: list[list[tuple[int, int]]], s: int) -> tuple[bool, list[int]]:
    n = len(adj)
    d = [INF] * n
    cnt = [0] * n              # скільки разів вершину релаксовано
    inqueue = [False] * n      # чи вже у черзі
    q = deque()

    d[s] = 0
    q.append(s)
    inqueue[s] = True
    while q:
        v = q.popleft()
        inqueue[v] = False

        for to, length in adj[v]:
            if d[v] + length < d[to]:
                d[to] = d[v] + length
                if not inqueue[to]:
                    q.append(to)
                    inqueue[to] = True
                    cnt[to] += 1
                    if cnt[to] > n:
                        return False, d  # цикл від'ємної ваги
    return True, d
```

```typescript
const INF = 1000000000;

// adj — список суміжності: adj[v] = [[to, len], ...]
// повертає null, якщо знайдено цикл від'ємної ваги, інакше масив відстаней
function spfa(adj: [number, number][][], s: number): number[] | null {
    const n = adj.length;
    const d: number[] = new Array(n).fill(INF);
    const cnt: number[] = new Array(n).fill(0);      // скільки разів релаксовано
    const inqueue: boolean[] = new Array(n).fill(false);
    // черга на масиві з індексом голови — без затратного shift()
    const q: number[] = [];
    let head = 0;

    d[s] = 0;
    q.push(s);
    inqueue[s] = true;
    while (head < q.length) {
        const v = q[head++];
        inqueue[v] = false;

        for (const [to, len] of adj[v]) {
            if (d[v] + len < d[to]) {
                d[to] = d[v] + len;
                if (!inqueue[to]) {
                    q.push(to);
                    inqueue[to] = true;
                    cnt[to]++;
                    if (cnt[to] > n) {
                        return null; // цикл від'ємної ваги
                    }
                }
            }
        }
    }
    return d;
}
```

```go
const INF = 1000000000

// adj — список суміжності: adj[v] = [][2]int{{to, len}, ...}
// повертає (ok, d): ok=false, якщо знайдено цикл від'ємної ваги
func spfa(adj [][][2]int, s int) (bool, []int) {
    n := len(adj)
    d := make([]int, n)
    for i := range d {
        d[i] = INF
    }
    cnt := make([]int, n)     // скільки разів вершину релаксовано
    inqueue := make([]bool, n) // чи вже у черзі
    q := []int{}

    d[s] = 0
    q = append(q, s)
    inqueue[s] = true
    for len(q) > 0 {
        v := q[0]
        q = q[1:]
        inqueue[v] = false

        for _, edge := range adj[v] {
            to, length := edge[0], edge[1]
            if d[v]+length < d[to] {
                d[to] = d[v] + length
                if !inqueue[to] {
                    q = append(q, to)
                    inqueue[to] = true
                    cnt[to]++
                    if cnt[to] > n {
                        return false, d // цикл від'ємної ваги
                    }
                }
            }
        }
    }
    return true, d
}
```

</CodeTabs>


## Споріднені задачі в онлайн-суддях \{#related-problems-in-online-judges}

Список задач, які можна розв'язати за допомогою алгоритму Беллмана–Форда:

* [E-OLYMP #1453 "Ford-Bellman" [difficulty: low]](https://www.e-olymp.com/en/problems/1453)
* [UVA #423 "MPI Maelstrom" [difficulty: low]](http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=364)
* [UVA #534 "Frogger" [difficulty: medium]](http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&category=7&page=show_problem&problem=475)
* [UVA #10099 "The Tourist Guide" [difficulty: medium]](http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&category=12&page=show_problem&problem=1040)
* [UVA #515 "King" [difficulty: medium]](http://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=456)
* [UVA 12519 - The Farnsworth Parabox](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=3964)

Дивіться також список задач у статті [Пошук циклу від'ємної ваги в графі](finding-negative-cycle-in-graph.md).
* [CSES - High Score](https://cses.fi/problemset/task/1673)
* [CSES - Cycle Finding](https://cses.fi/problemset/task/1197)

## Відеоматеріали \{#video}

- [Bellman Ford Algorithm | Shortest path & Negative cycles | Graph Theory — WilliamFiset](https://www.youtube.com/watch?v=lyw4FaxrwHg) (15 хв, англійською)
