# Найнижчий спільний предок — офлайн-алгоритм Тар'яна для LCA

Маємо дерево $G$ з $n$ вершинами та $m$ запитів вигляду $(u, v)$.
Для кожного запиту $(u, v)$ ми хочемо знайти найнижчого спільного предка вершин $u$ та $v$, тобто вершину, яка є предком як $u$, так і $v$, і має найбільшу глибину в дереві.
Вершина $v$ також є предком самої себе, тож LCA може бути й однією з цих двох вершин.

У цій статті ми розв'яжемо задачу офлайн, тобто вважаємо, що всі запити відомі заздалегідь, і тому можемо відповідати на них у будь-якому зручному для нас порядку.
Наведений алгоритм дозволяє відповісти на всі $m$ запитів за сумарний час $O(n + m)$, тобто для достатньо великого $m$ за $O(1)$ на кожен запит.

## Алгоритм \{#algorithm}

Алгоритм названо на честь Роберта Тар'яна, який відкрив його у 1979 році, а також зробив багато інших внесків у структуру даних [система неперетинних множин](../data_structures/disjoint_set_union.md), яку ми активно використовуватимемо в цьому алгоритмі.

Алгоритм відповідає на всі запити за один обхід дерева [DFS](depth-first-search.md).
А саме, на запит $(u, v)$ ми відповідаємо у вершині $u$, якщо вершину $v$ вже було відвідано раніше, або навпаки.

Тож припустимо, що ми зараз перебуваємо у вершині $v$, вже зробили рекурсивні виклики DFS, а також вже відвідали другу вершину $u$ із запиту $(u, v)$.
Навчимося знаходити LCA цих двох вершин.

Зауважимо, що $\text{LCA}(u, v)$ — це або вершина $v$, або один із її предків.
Отже, нам потрібно знайти найнижчу вершину серед предків $v$ (включно з $v$), для якої вершина $u$ є нащадком.
Зауважимо також, що для фіксованої $v$ відвідані вершини дерева розбиваються на сукупність неперетинних множин.
Кожен предок $p$ вершини $v$ має власну множину, що містить цю вершину та всі піддерева з коренями в тих її дітях, які не належать шляху від $v$ до кореня дерева.
Множина, яка містить вершину $u$, визначає $\text{LCA}(u, v)$:
LCA — це представник множини, а саме та вершина, яка лежить на шляху між $v$ і коренем дерева.

Нам залишається лише навчитися ефективно підтримувати всі ці множини.
Для цього ми застосовуємо структуру даних СНМ.
Щоб мати змогу застосовувати об'єднання за рангом, ми зберігаємо справжнього представника (значення на шляху між $v$ і коренем дерева) кожної множини в масиві `ancestor`.

Обговорімо реалізацію DFS.
Припустимо, що ми зараз відвідуємо вершину $v$.
Ми поміщаємо цю вершину в нову множину в СНМ: `ancestor[v] = v`.
Як зазвичай, ми обробляємо всіх дітей $v$.
Для цього ми спершу маємо рекурсивно викликати DFS з тієї вершини, а потім додати цю вершину разом з усім її піддеревом до множини $v$.
Це можна зробити за допомогою функції `union_sets` і наступного присвоєння `ancestor[find_set(v)] = v` (воно необхідне, бо `union_sets` може змінити представника множини).

Нарешті, після обробки всіх дітей ми можемо відповісти на всі запити вигляду $(u, v)$, для яких $u$ вже було відвідано.
Відповіддю на запит, тобто LCA вершин $u$ і $v$, буде вершина `ancestor[find_set(u)]`.
Легко бачити, що на кожен запит буде дано відповідь лише один раз.

Визначмо часову складність цього алгоритму.
По-перше, ми маємо $O(n)$ через DFS.
По-друге, ми маємо виклики функції `union_sets`, яких відбувається $n$ разів, що також дає $O(n)$.
По-третє, ми маємо виклики `find_set` для кожного запиту, що дає $O(m)$.
Отже, сумарна часова складність становить $O(n + m)$, а це означає, що для достатньо великого $m$ це відповідає $O(1)$ на відповідь на один запит.

## Реалізація \{#implementation}

Ось реалізація цього алгоритму.
Реалізацію СНМ не наведено, оскільки її можна використати без жодних змін.

<CodeTabs>

```cpp
vector<vector<int>> adj;
vector<vector<int>> queries;
vector<int> ancestor;
vector<bool> visited;

void dfs(int v)
{
    visited[v] = true;
    ancestor[v] = v;
    for (int u : adj[v]) {
        if (!visited[u]) {
            dfs(u);
            union_sets(v, u);
            ancestor[find_set(v)] = v;
        }
    }
    for (int other_node : queries[v]) {
        if (visited[other_node])
            cout << "LCA of " << v << " and " << other_node
                 << " is " << ancestor[find_set(other_node)] << ".\n";
    }
}

void compute_LCAs() {
    // ініціалізуємо n, adj і СНМ
    // for (кожен запит (u, v)) {
    //    queries[u].push_back(v);
    //    queries[v].push_back(u);
    // }

    ancestor.resize(n);
    visited.assign(n, false);
    dfs(0);
}
```

```python
import sys

# Глибока рекурсія DFS може перевищити стандартний ліміт Python (1000),
# тому піднімаємо його під розмір дерева (для глибоких/ланцюгових дерев).
sys.setrecursionlimit(300000)

n: int
adj: list[list[int]]
queries: list[list[int]]
ancestor: list[int]
visited: list[bool]

# СНМ (об'єднання за рангом + стиснення шляхів)
parent: list[int]
rank_: list[int]

def make_set(v: int) -> None:
    parent[v] = v
    rank_[v] = 0

def find_set(v: int) -> int:
    if v == parent[v]:
        return v
    parent[v] = find_set(parent[v])  # стиснення шляхів
    return parent[v]

def union_sets(a: int, b: int) -> None:
    a = find_set(a)
    b = find_set(b)
    if a != b:
        if rank_[a] < rank_[b]:
            a, b = b, a
        parent[b] = a
        if rank_[a] == rank_[b]:
            rank_[a] += 1

def dfs(v: int) -> None:
    visited[v] = True
    ancestor[v] = v
    for u in adj[v]:
        if not visited[u]:
            dfs(u)
            union_sets(v, u)
            # union_sets міг змінити представника множини
            ancestor[find_set(v)] = v
    for other_node in queries[v]:
        if visited[other_node]:
            print(f"LCA of {v} and {other_node} "
                  f"is {ancestor[find_set(other_node)]}.")

def compute_LCAs() -> None:
    # ініціалізуємо n, adj і СНМ
    # for (кожен запит (u, v)):
    #     queries[u].append(v)
    #     queries[v].append(u)

    global ancestor, visited
    ancestor = [0] * n
    visited = [False] * n
    dfs(0)
```

```typescript
let n: number;
let adj: number[][];
let queries: number[][];
let ancestor: number[];
let visited: boolean[];

// СНМ (об'єднання за рангом + стиснення шляхів)
let parent: number[];
let rank_: number[];

function makeSet(v: number): void {
    parent[v] = v;
    rank_[v] = 0;
}

function findSet(v: number): number {
    if (v === parent[v]) {
        return v;
    }
    parent[v] = findSet(parent[v]); // стиснення шляхів
    return parent[v];
}

function unionSets(a: number, b: number): void {
    a = findSet(a);
    b = findSet(b);
    if (a !== b) {
        if (rank_[a] < rank_[b]) {
            [a, b] = [b, a];
        }
        parent[b] = a;
        if (rank_[a] === rank_[b]) {
            rank_[a]++;
        }
    }
}

function dfs(v: number): void {
    visited[v] = true;
    ancestor[v] = v;
    for (const u of adj[v]) {
        if (!visited[u]) {
            dfs(u);
            unionSets(v, u);
            // unionSets міг змінити представника множини
            ancestor[findSet(v)] = v;
        }
    }
    for (const otherNode of queries[v]) {
        if (visited[otherNode]) {
            console.log(
                `LCA of ${v} and ${otherNode} ` +
                `is ${ancestor[findSet(otherNode)]}.`,
            );
        }
    }
}

function computeLCAs(): void {
    // ініціалізуємо n, adj і СНМ
    // for (кожен запит (u, v)) {
    //     queries[u].push(v);
    //     queries[v].push(u);
    // }

    ancestor = new Array<number>(n).fill(0);
    visited = new Array<boolean>(n).fill(false);
    dfs(0);
}
```

```go
package main

import "fmt"

var (
	n        int
	adj      [][]int
	queries  [][]int
	ancestor []int
	visited  []bool

	// СНМ (об'єднання за рангом + стиснення шляхів)
	parent []int
	rank_  []int
)

func makeSet(v int) {
	parent[v] = v
	rank_[v] = 0
}

func findSet(v int) int {
	if v == parent[v] {
		return v
	}
	parent[v] = findSet(parent[v]) // стиснення шляхів
	return parent[v]
}

func unionSets(a, b int) {
	a = findSet(a)
	b = findSet(b)
	if a != b {
		if rank_[a] < rank_[b] {
			a, b = b, a
		}
		parent[b] = a
		if rank_[a] == rank_[b] {
			rank_[a]++
		}
	}
}

func dfs(v int) {
	visited[v] = true
	ancestor[v] = v
	for _, u := range adj[v] {
		if !visited[u] {
			dfs(u)
			unionSets(v, u)
			// unionSets міг змінити представника множини
			ancestor[findSet(v)] = v
		}
	}
	for _, otherNode := range queries[v] {
		if visited[otherNode] {
			fmt.Printf("LCA of %d and %d is %d.\n",
				v, otherNode, ancestor[findSet(otherNode)])
		}
	}
}

func computeLCAs() {
	// ініціалізуємо n, adj і СНМ
	// for (кожен запит (u, v)) {
	//     queries[u] = append(queries[u], v)
	//     queries[v] = append(queries[v], u)
	// }

	ancestor = make([]int, n)
	visited = make([]bool, n)
	dfs(0)
}
```

</CodeTabs>
