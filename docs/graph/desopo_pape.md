# Алгоритм Д'Есопо–Папе

Дано граф із $n$ вершинами та $m$ ребрами з вагами $w_i$, а також початкову вершину $v_0$.
Потрібно знайти найкоротший шлях від вершини $v_0$ до кожної іншої вершини.

У більшості випадків алгоритм Д'Есопо–Папе працює швидше за [алгоритм Дейкстри](dijkstra.md) та [алгоритм Беллмана–Форда](bellman_ford.md), і до того ж він працює з від'ємними ребрами.
Проте він не працює з від'ємними циклами.

:::tip[Коли підходить цей алгоритм?]
- Потрібні найкоротші шляхи з однієї вершини, і граф може містити ребра від'ємної ваги (але без від'ємних циклів)? *(якщо всі ваги невід'ємні → надійніший [Дейкстра](dijkstra.md))*
- Граф «дружній» (не спеціально побудований як контрприклад), бо на зловмисних входах алгоритм може деградувати до експоненційного часу? *(якщо потрібна гарантована оцінка часу на від'ємних вагах → [Беллман-Форд](bellman_ford.md))*
- У графі немає від'ємних циклів? *(для їх пошуку → [Пошук від'ємного циклу](finding-negative-cycle-in-graph.md))*
:::

## Опис \{#description}

Нехай масив $d$ містить довжини найкоротших шляхів, тобто $d_i$ — це поточна довжина найкоротшого шляху від вершини $v_0$ до вершини $i$.
Спочатку цей масив заповнено нескінченністю для кожної вершини, окрім $d_{v_0} = 0$.
Після завершення алгоритму цей масив міститиме найкоротші відстані.

Нехай масив $p$ містить поточних предків, тобто $p_i$ — це безпосередній предок вершини $i$ на поточному найкоротшому шляху від $v_0$ до $i$.
Так само як і масив $d$, масив $p$ поступово змінюється протягом роботи алгоритму, а наприкінці набуває своїх остаточних значень.

Тепер перейдемо до самого алгоритму.
На кожному кроці підтримуються три множини вершин:

- $M_0$ — вершини, для яких відстань уже обчислено (хоча вона може й не бути остаточною)
- $M_1$ — вершини, для яких відстань обчислюється зараз
- $M_2$ — вершини, для яких відстань ще не обчислено

Вершини з множини $M_1$ зберігаються у двосторонній черзі (деку).

На кожному кроці алгоритму ми беремо вершину з множини $M_1$ (з початку черги).
Нехай $u$ — обрана вершина.
Ми поміщаємо цю вершину $u$ до множини $M_0$.
Потім перебираємо всі ребра, що виходять із цієї вершини.
Нехай $v$ — другий кінець поточного ребра, а $w$ — його вага.

- Якщо $v$ належить до $M_2$, то $v$ вставляється до множини $M_1$ шляхом додавання її в кінець черги.
$d_v$ встановлюється рівним $d_u + w$.
- Якщо $v$ належить до $M_1$, то ми намагаємось покращити значення $d_v$: $d_v = \min(d_v, d_u + w)$.
Оскільки $v$ уже є в $M_1$, нам не потрібно вставляти її до $M_1$ та черги.
- Якщо $v$ належить до $M_0$ і якщо $d_v$ можна покращити $d_v > d_u + w$, то ми покращуємо $d_v$ і вставляємо вершину $v$ назад до множини $M_1$, розміщуючи її на початку черги.

І, звісно, з кожним оновленням у масиві $d$ ми також маємо оновлювати відповідний елемент у масиві $p$.

## Реалізація \{#implementation}

Ми використовуватимемо масив $m$, щоб зберігати, у якій множині наразі перебуває кожна вершина.

<CodeTabs>

```cpp
struct Edge {
    int to, w;
};

int n;
vector<vector<Edge>> adj;

const int INF = 1e9;

void shortest_paths(int v0, vector<int>& d, vector<int>& p) {
    d.assign(n, INF);
    d[v0] = 0;
    vector<int> m(n, 2);
    deque<int> q;
    q.push_back(v0);
    p.assign(n, -1);

    while (!q.empty()) {
        int u = q.front();
        q.pop_front();
        m[u] = 0;
        for (Edge e : adj[u]) {
            if (d[e.to] > d[u] + e.w) {
                d[e.to] = d[u] + e.w;
                p[e.to] = u;
                if (m[e.to] == 2) {
                    m[e.to] = 1;
                    q.push_back(e.to);
                } else if (m[e.to] == 0) {
                    m[e.to] = 1;
                    q.push_front(e.to);
                }
            }
        }
    }
}
```

```python
from collections import deque

INF = 10**9

# adj — список суміжності: adj[u] містить пари (to, w)
def shortest_paths(n: int, adj: list[list[tuple[int, int]]],
                   v0: int) -> tuple[list[int], list[int]]:
    d = [INF] * n
    d[v0] = 0
    m = [2] * n          # множина кожної вершини: 0 = M0, 1 = M1, 2 = M2
    p = [-1] * n
    q = deque([v0])      # дека — collections.deque дає O(1) з обох кінців

    while q:
        u = q.popleft()
        m[u] = 0
        for to, w in adj[u]:
            if d[to] > d[u] + w:
                d[to] = d[u] + w
                p[to] = u
                if m[to] == 2:
                    m[to] = 1
                    q.append(to)        # у кінець черги
                elif m[to] == 0:
                    m[to] = 1
                    q.appendleft(to)    # на початок черги
    return d, p
```

```typescript
const INF = 1e9;

// У TypeScript/JavaScript немає вбудованої деки: Array.shift() — це O(n),
// тому використовуємо кільцевий буфер із амортизованим O(1) для обох кінців.
class Deque<T> {
    private buf: (T | undefined)[];
    private head = 0;
    private tail = 0; // індекс наступного вільного місця в кінці
    private size = 0;

    constructor() {
        this.buf = new Array<T | undefined>(8);
    }

    private grow(): void {
        const n = this.buf.length;
        const nb = new Array<T | undefined>(n * 2);
        for (let i = 0; i < this.size; i++) {
            nb[i] = this.buf[(this.head + i) % n];
        }
        this.buf = nb;
        this.head = 0;
        this.tail = this.size;
    }

    pushBack(x: T): void {
        if (this.size === this.buf.length) this.grow();
        this.buf[this.tail] = x;
        this.tail = (this.tail + 1) % this.buf.length;
        this.size++;
    }

    pushFront(x: T): void {
        if (this.size === this.buf.length) this.grow();
        this.head = (this.head - 1 + this.buf.length) % this.buf.length;
        this.buf[this.head] = x;
        this.size++;
    }

    popFront(): T {
        const x = this.buf[this.head] as T;
        this.buf[this.head] = undefined;
        this.head = (this.head + 1) % this.buf.length;
        this.size--;
        return x;
    }

    get length(): number {
        return this.size;
    }
}

interface Edge {
    to: number;
    w: number;
}

function shortestPaths(
    n: number,
    adj: Edge[][],
    v0: number,
): { d: number[]; p: number[] } {
    const d: number[] = new Array(n).fill(INF);
    d[v0] = 0;
    const m: number[] = new Array(n).fill(2); // 0 = M0, 1 = M1, 2 = M2
    const p: number[] = new Array(n).fill(-1);
    const q = new Deque<number>();
    q.pushBack(v0);

    while (q.length > 0) {
        const u = q.popFront();
        m[u] = 0;
        for (const e of adj[u]) {
            if (d[e.to] > d[u] + e.w) {
                d[e.to] = d[u] + e.w;
                p[e.to] = u;
                if (m[e.to] === 2) {
                    m[e.to] = 1;
                    q.pushBack(e.to); // у кінець черги
                } else if (m[e.to] === 0) {
                    m[e.to] = 1;
                    q.pushFront(e.to); // на початок черги
                }
            }
        }
    }
    return { d, p };
}
```

```go
const INF = 1e9

type Edge struct {
    to, w int
}

// Власна дека на кільцевому буфері: вставка/вилучення з обох кінців за O(1).
type deque struct {
    buf        []int
    head, size int
}

func newDeque() *deque {
    return &deque{buf: make([]int, 8)}
}

func (q *deque) grow() {
    nb := make([]int, len(q.buf)*2)
    for i := 0; i < q.size; i++ {
        nb[i] = q.buf[(q.head+i)%len(q.buf)]
    }
    q.buf = nb
    q.head = 0
}

func (q *deque) pushBack(x int) {
    if q.size == len(q.buf) {
        q.grow()
    }
    q.buf[(q.head+q.size)%len(q.buf)] = x
    q.size++
}

func (q *deque) pushFront(x int) {
    if q.size == len(q.buf) {
        q.grow()
    }
    q.head = (q.head - 1 + len(q.buf)) % len(q.buf)
    q.buf[q.head] = x
    q.size++
}

func (q *deque) popFront() int {
    x := q.buf[q.head]
    q.head = (q.head + 1) % len(q.buf)
    q.size--
    return x
}

// adj — список суміжності: adj[u] містить ребра, що виходять із u
func shortestPaths(n int, adj [][]Edge, v0 int) (d, p []int) {
    d = make([]int, n)
    for i := range d {
        d[i] = INF
    }
    d[v0] = 0
    m := make([]int, n) // 0 = M0, 1 = M1, 2 = M2; за замовчуванням 0
    for i := range m {
        m[i] = 2
    }
    p = make([]int, n)
    for i := range p {
        p[i] = -1
    }
    q := newDeque()
    q.pushBack(v0)

    for q.size > 0 {
        u := q.popFront()
        m[u] = 0
        for _, e := range adj[u] {
            if d[e.to] > d[u]+e.w {
                d[e.to] = d[u] + e.w
                p[e.to] = u
                if m[e.to] == 2 {
                    m[e.to] = 1
                    q.pushBack(e.to) // у кінець черги
                } else if m[e.to] == 0 {
                    m[e.to] = 1
                    q.pushFront(e.to) // на початок черги
                }
            }
        }
    }
    return d, p
}
```

</CodeTabs>

## Складність \{#complexity}

Зазвичай алгоритм працює досить швидко — у більшості випадків навіть швидше за алгоритм Дейкстри.
Проте існують випадки, для яких алгоритм виконується експоненційний час, що робить його непридатним у найгіршому випадку. Для довідки див. обговорення на [Stack Overflow](https://stackoverflow.com/a/67642821) та [Codeforces](https://codeforces.com/blog/entry/3793).
