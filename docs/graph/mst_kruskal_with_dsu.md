# Мінімальне кістякове дерево — алгоритм Крускала з системою неперетинних множин

Пояснення задачі про мінімальне кістякове дерево та алгоритму Крускала шукайте в [головній статті про алгоритм Крускала](mst_kruskal.md).

У цій статті ми розглянемо структуру даних ["Система неперетинних множин"](../data_structures/disjoint_set_union.md) для реалізації алгоритму Крускала, що дозволить алгоритму досягти часової складності $O(M \log N)$.

## Опис \{#description}

Так само, як і в простій версії алгоритму Крускала, ми сортуємо всі ребра графа в неспадному порядку ваг.
Потім розміщуємо кожну вершину в її власному дереві (тобто в її множині) за допомогою викликів функції `make_set` — на це загалом піде $O(N)$.
Ми перебираємо всі ребра (у відсортованому порядку) і для кожного ребра визначаємо, чи належать його кінці до різних дерев (двома викликами `find_set`, кожен за $O(1)$).
Нарешті, нам потрібно виконати об'єднання двох дерев (множин), для чого буде викликана функція СНМ `union_sets` — також за $O(1)$.
Отже, ми отримуємо загальну часову складність $O(M \log N + N + M)$ = $O(M \log N)$.

## Реалізація \{#implementation}

Ось реалізація алгоритму Крускала з об'єднанням за рангом.

<CodeTabs>

```cpp
vector<int> parent, rank;

void make_set(int v) {
    parent[v] = v;
    rank[v] = 0;
}

int find_set(int v) {
    if (v == parent[v])
        return v;
    return parent[v] = find_set(parent[v]);
}

void union_sets(int a, int b) {
    a = find_set(a);
    b = find_set(b);
    if (a != b) {
        if (rank[a] < rank[b])
            swap(a, b);
        parent[b] = a;
        if (rank[a] == rank[b])
            rank[a]++;
    }
}

struct Edge {
    int u, v, weight;
    bool operator<(Edge const& other) {
        return weight < other.weight;
    }
};

int n;
vector<Edge> edges;

int cost = 0;
vector<Edge> result;
parent.resize(n);
rank.resize(n);
for (int i = 0; i < n; i++)
    make_set(i);

sort(edges.begin(), edges.end());

for (Edge e : edges) {
    if (find_set(e.u) != find_set(e.v)) {
        cost += e.weight;
        result.push_back(e);
        union_sets(e.u, e.v);
    }
}
```

```python
# Система неперетинних множин з ущільненням шляхів (path compression)
# та об'єднанням за рангом (union by rank).
parent: list[int] = []
rank: list[int] = []


def make_set(v: int) -> None:
    parent[v] = v
    rank[v] = 0


def find_set(v: int) -> int:
    # Ітеративний пошук кореня, щоб уникнути обмеження глибини рекурсії
    # Python (sys.setrecursionlimit) на великих множинах.
    root = v
    while root != parent[root]:
        root = parent[root]
    # Ущільнення шляхів: переспрямовуємо весь шлях напряму до кореня.
    while v != root:
        parent[v], v = root, parent[v]
    return root


def union_sets(a: int, b: int) -> None:
    a = find_set(a)
    b = find_set(b)
    if a != b:
        if rank[a] < rank[b]:
            a, b = b, a
        parent[b] = a
        if rank[a] == rank[b]:
            rank[a] += 1


# Ребро зберігаємо як кортеж (вага, u, v), щоб сортувати за вагою.
n = 0
edges: list[tuple[int, int, int]] = []

cost = 0
result: list[tuple[int, int, int]] = []
parent = [0] * n
rank = [0] * n
for i in range(n):
    make_set(i)

edges.sort()

for weight, u, v in edges:
    if find_set(u) != find_set(v):
        cost += weight
        result.append((weight, u, v))
        union_sets(u, v)
```

```typescript
// Система неперетинних множин з ущільненням шляхів та об'єднанням за рангом.
let parent: number[] = [];
let rank: number[] = [];

function makeSet(v: number): void {
    parent[v] = v;
    rank[v] = 0;
}

function findSet(v: number): number {
    if (v === parent[v])
        return v;
    return parent[v] = findSet(parent[v]);
}

function unionSets(a: number, b: number): void {
    a = findSet(a);
    b = findSet(b);
    if (a !== b) {
        if (rank[a] < rank[b])
            [a, b] = [b, a];
        parent[b] = a;
        if (rank[a] === rank[b])
            rank[a]++;
    }
}

interface Edge {
    u: number;
    v: number;
    weight: number;
}

let n: number = 0;
let edges: Edge[] = [];

let cost = 0;
const result: Edge[] = [];
parent = new Array<number>(n);
rank = new Array<number>(n);
for (let i = 0; i < n; i++)
    makeSet(i);

edges.sort((x, y) => x.weight - y.weight);

for (const e of edges) {
    if (findSet(e.u) !== findSet(e.v)) {
        cost += e.weight;
        result.push(e);
        unionSets(e.u, e.v);
    }
}
```

```go
// Система неперетинних множин з ущільненням шляхів та об'єднанням за рангом.
var parent []int
var rank []int

func makeSet(v int) {
    parent[v] = v
    rank[v] = 0
}

func findSet(v int) int {
    if v == parent[v] {
        return v
    }
    parent[v] = findSet(parent[v])
    return parent[v]
}

func unionSets(a, b int) {
    a = findSet(a)
    b = findSet(b)
    if a != b {
        if rank[a] < rank[b] {
            a, b = b, a
        }
        parent[b] = a
        if rank[a] == rank[b] {
            rank[a]++
        }
    }
}

type Edge struct {
    u, v, weight int
}

var n int
var edges []Edge

func kruskal() {
    cost := 0
    var result []Edge
    parent = make([]int, n)
    rank = make([]int, n)
    for i := 0; i < n; i++ {
        makeSet(i)
    }

    sort.Slice(edges, func(i, j int) bool {
        return edges[i].weight < edges[j].weight
    })

    for _, e := range edges {
        if findSet(e.u) != findSet(e.v) {
            cost += e.weight
            result = append(result, e)
            unionSets(e.u, e.v)
        }
    }
}
```

</CodeTabs>

Зауважимо: оскільки мінімальне кістякове дерево міститиме рівно $N-1$ ребер, ми можемо зупинити цикл for, щойно знайдемо їх стільки.

## Задачі для практики \{#practice-problems}

Список задач для практики на цю тему дивіться в [головній статті про алгоритм Крускала](mst_kruskal.md).

## Відеоматеріали \{#video}

- [Kruskal's Algorithm Visually Explained | Disjoint Sets | Union By Rank | Path Compression — ByteQuest](https://www.youtube.com/watch?v=8HeLu8wuLqo) (9 хв, англійською)
