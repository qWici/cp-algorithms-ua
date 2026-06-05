# Пошук компонент зв'язності у графі

Дано неорієнтований граф $G$ з $n$ вершинами та $m$ ребрами. Нам потрібно знайти в ньому всі компоненти зв'язності, тобто кілька груп вершин таких, що в межах однієї групи кожну вершину можна досягти з будь-якої іншої, а між різними групами жодного шляху не існує.

:::tip[Коли підходить цей алгоритм?]
- Граф **неорієнтований**, і потрібно розбити вершини на групи взаємно досяжних? *(якщо граф орієнтований і потрібна взаємна досяжність в обидва боки → [компоненти сильної зв'язності](strongly-connected-components.md))*
- Граф **статичний** і обхід (DFS/BFS) робиться один раз? *(якщо компоненти змінюються при поступовому додаванні ребер → [Система неперетинних множин](../data_structures/disjoint_set_union.md))*
:::

## Алгоритм розв'язання задачі \{#an-algorithm-for-solving-the-problem}

* Щоб розв'язати цю задачу, ми можемо використати <Term tip="обхід графа, який заглиблюється якомога далі вздовж кожної гілки, перш ніж повертатися назад.">пошук у глибину (DFS)</Term> або <Term tip="обхід графа, який досліджує вершини шарами — спершу всіх сусідів, потім сусідів сусідів і так далі.">пошук у ширину (BFS)</Term>.

* Насправді ми будемо виконувати серію запусків DFS: перший запуск розпочнеться з першої вершини, і всі вершини першої компоненти зв'язності будуть обійдені (знайдені). Потім ми знаходимо першу невідвідану вершину серед решти вершин і запускаємо з неї пошук у глибину, знаходячи таким чином другу компоненту зв'язності. І так далі, доки всі вершини не будуть відвідані.

* Загальна асимптотична складність цього алгоритму — $O(n + m)$: насправді цей алгоритм не запуститься на одній і тій самій вершині двічі, а отже, кожне ребро буде розглянуто рівно двічі (з одного кінця та з іншого).

## Реалізація \{#implementation}

<CodeTabs>

```cpp
int n;
vector<vector<int>> adj;
vector<bool> used;
vector<int> comp;

void dfs(int v) {
    used[v] = true;
    comp.push_back(v);
    for (int u : adj[v]) {
        if (!used[u])
            dfs(u);
    }
}

void find_comps() {
    used.assign(n, false);
    for (int v = 0; v < n; ++v) {
        if (!used[v]) {
            comp.clear();
            dfs(v);
            cout << "Component:" ;
            for (int u : comp)
                cout << ' ' << u;
            cout << endl ;
        }
    }
}
```

```python
import sys

# Збільшуємо ліміт рекурсії, бо глибина DFS може сягати n.
sys.setrecursionlimit(1 << 20)

n = 0
adj: list[list[int]] = []
used: list[bool] = []
comp: list[int] = []


def dfs(v: int) -> None:
    used[v] = True
    comp.append(v)
    for u in adj[v]:
        if not used[u]:
            dfs(u)


def find_comps() -> None:
    global used, comp
    used = [False] * n
    for v in range(n):
        if not used[v]:
            comp = []
            dfs(v)
            print("Component:", *comp)
```

```typescript
let n: number;
let adj: number[][];
let used: boolean[];
let comp: number[];

function dfs(v: number): void {
    used[v] = true;
    comp.push(v);
    for (const u of adj[v]) {
        if (!used[u])
            dfs(u);
    }
}

function findComps(): void {
    used = new Array<boolean>(n).fill(false);
    for (let v = 0; v < n; ++v) {
        if (!used[v]) {
            comp = [];
            dfs(v);
            console.log("Component:", ...comp);
        }
    }
}
```

```go
var n int
var adj [][]int
var used []bool
var comp []int

func dfs(v int) {
    used[v] = true
    comp = append(comp, v)
    for _, u := range adj[v] {
        if !used[u] {
            dfs(u)
        }
    }
}

func findComps() {
    used = make([]bool, n)
    for v := 0; v < n; v++ {
        if !used[v] {
            comp = comp[:0]
            dfs(v)
            fmt.Print("Component:")
            for _, u := range comp {
                fmt.Print(" ", u)
            }
            fmt.Println()
        }
    }
}
```

</CodeTabs>

* Найважливіша функція, яку ми використовуємо, — це `find_comps()`, що знаходить і виводить компоненти зв'язності графа.

* Граф зберігається у вигляді <Term tip="спосіб задати граф: для кожної вершини зберігаємо перелік вершин, з якими вона з'єднана ребром.">списку суміжності</Term>, тобто `adj[v]` містить список вершин, до яких є ребра з вершини `v`.

* Вектор `comp` містить список вершин поточної компоненти зв'язності.

## Ітеративна реалізація коду \{#iterative-implementation-of-the-code}

Глибоко рекурсивні функції загалом погані.
Кожен окремий рекурсивний виклик потребує трохи пам'яті у стеку, а за замовчуванням програми мають лише обмежений обсяг стекового простору.
Тож коли ви виконуєте рекурсивний DFS на зв'язному графі з мільйонами вершин, ви можете натрапити на переповнення стека.

Рекурсивну програму завжди можна перетворити на ітеративну, вручну підтримуючи структуру даних «стек».
Оскільки ця структура даних розміщується в купі, переповнення стека не станеться.

<CodeTabs>

```cpp
int n;
vector<vector<int>> adj;
vector<bool> used;
vector<int> comp;

void dfs(int v) {
    stack<int> st;
    st.push(v);
    
    while (!st.empty()) {
        int curr = st.top();
        st.pop();
        if (!used[curr]) {
            used[curr] = true;
            comp.push_back(curr);
            for (int i = adj[curr].size() - 1; i >= 0; i--) {
                st.push(adj[curr][i]);
            }
        }
    }
}

void find_comps() {
    used.assign(n, false);
    for (int v = 0; v < n ; ++v) {
        if (!used[v]) {
            comp.clear();
            dfs(v);
            cout << "Component:" ;
            for (int u : comp)
                cout << ' ' << u;
            cout << endl ;
        }
    }
}
```

```python
n = 0
adj: list[list[int]] = []
used: list[bool] = []
comp: list[int] = []


def dfs(v: int) -> None:
    # Підтримуємо стек вручну, тож переповнення стека викликів не станеться.
    st = [v]
    while st:
        curr = st.pop()
        if not used[curr]:
            used[curr] = True
            comp.append(curr)
            # Кладемо сусідів у зворотному порядку, щоб обхід збігся з рекурсивним.
            for i in range(len(adj[curr]) - 1, -1, -1):
                st.append(adj[curr][i])


def find_comps() -> None:
    global used, comp
    used = [False] * n
    for v in range(n):
        if not used[v]:
            comp = []
            dfs(v)
            print("Component:", *comp)
```

```typescript
let n: number;
let adj: number[][];
let used: boolean[];
let comp: number[];

function dfs(v: number): void {
    // Підтримуємо стек вручну, тож переповнення стека викликів не станеться.
    const st: number[] = [v];
    while (st.length > 0) {
        const curr = st.pop()!;
        if (!used[curr]) {
            used[curr] = true;
            comp.push(curr);
            // Кладемо сусідів у зворотному порядку, щоб обхід збігся з рекурсивним.
            for (let i = adj[curr].length - 1; i >= 0; i--) {
                st.push(adj[curr][i]);
            }
        }
    }
}

function findComps(): void {
    used = new Array<boolean>(n).fill(false);
    for (let v = 0; v < n; ++v) {
        if (!used[v]) {
            comp = [];
            dfs(v);
            console.log("Component:", ...comp);
        }
    }
}
```

```go
var n int
var adj [][]int
var used []bool
var comp []int

func dfs(v int) {
    // Підтримуємо стек вручну, тож переповнення стека викликів не станеться.
    st := []int{v}
    for len(st) > 0 {
        curr := st[len(st)-1]
        st = st[:len(st)-1]
        if !used[curr] {
            used[curr] = true
            comp = append(comp, curr)
            // Кладемо сусідів у зворотному порядку, щоб обхід збігся з рекурсивним.
            for i := len(adj[curr]) - 1; i >= 0; i-- {
                st = append(st, adj[curr][i])
            }
        }
    }
}

func findComps() {
    used = make([]bool, n)
    for v := 0; v < n; v++ {
        if !used[v] {
            comp = comp[:0]
            dfs(v)
            fmt.Print("Component:")
            for _, u := range comp {
                fmt.Print(" ", u)
            }
            fmt.Println()
        }
    }
}
```

</CodeTabs>

## Задачі для практики \{#practice-problems}
 - [SPOJ: CT23E](http://www.spoj.com/problems/CT23E/)
 - [CODECHEF: GERALD07](https://www.codechef.com/MARCH14/problems/GERALD07)
 - [CSES : Building Roads](https://cses.fi/problemset/task/1666)

## Відеоматеріали \{#video}

<YouTubeEmbed id="8f1XPm4WOUc" title="Number of Connected Components in an Undirected Graph - Union Find - Leetcode 323 - Python — NeetCode" />
