# Фарбування ребер дерева

Це доволі поширена задача. Дано дерево $G$ з $N$ вершинами. Є два типи запитів: перший — пофарбувати ребро, другий — запитати кількість пофарбованих ребер між двома вершинами.

Тут ми опишемо доволі простий розв'язок (з використанням [дерева відрізків](../data_structures/segment_tree.md)), який відповідатиме на кожен запит за час $O(\log N)$.
Крок попередньої обробки займе час $O(N)$.

:::tip[Коли підходить цей алгоритм?]
- Запити стосуються **ребер на шляху між двома вершинами дерева** з оновленнями (пофарбувати ребро / порахувати пофарбовані на шляху)?
- Дерево **статичне** за структурою (змінюються лише кольори ребер), тож вистачає ейлерового обходу + дерева відрізків?
- Запит зведений до пари «предок — нащадок» через [LCA](lca.md)? *(для загальніших запитів на шляхах з оновленнями значень → [важко-легке розбиття (HLD)](hld.md))*
:::

## Алгоритм \{#algorithm}

Спершу нам потрібно знайти [LCA](lca.md), щоб звести кожен запит другого типу $(i,j)$ до двох запитів $(l,i)$ та $(l,j)$, де $l$ — це LCA вершин $i$ та $j$.
Відповіддю на запит $(i,j)$ буде сума обох підзапитів.
Обидва ці запити мають особливу структуру: перша вершина є предком другої.
До кінця статті ми говоритимемо лише про такий особливий вид запитів.

Почнімо з опису кроку **попередньої обробки**.
Запустимо пошук у глибину з кореня дерева й запишемо ейлерів обхід цього пошуку в глибину (кожну вершину додаємо до списку, коли обхід відвідує її вперше, а також щоразу, коли ми повертаємося з одного з її нащадків).
Той самий прийом можна використати під час попередньої обробки для LCA.

Цей список міститиме кожне ребро (у тому сенсі, що якщо $i$ та $j$ — кінці ребра, то у списку знайдеться місце, де $i$ та $j$ є сусідами), причому воно з'явиться рівно двічі: у прямому напрямку (від $i$ до $j$, де вершина $i$ ближча до кореня, ніж вершина $j$) та у зворотному напрямку (від $j$ до $i$).

Для цих ребер ми побудуємо два списки.
Перший зберігатиме кольори всіх ребер у прямому напрямку, а другий — кольори всіх ребер у зворотному напрямку.
Ми використовуватимемо $1$, якщо ребро пофарбоване, і $0$ — інакше.
Над цими двома списками ми побудуємо по дереву відрізків (на суму з одиничною модифікацією); назвемо їх $T1$ та $T2$.

Відповімо на запит виду $(i,j)$, де $i$ є предком $j$.
Нам потрібно визначити, скільки ребер пофарбовано на шляху між $i$ та $j$.
Знайдімо $i$ та $j$ в ейлеровому обході вперше; нехай це будуть позиції $p$ та $q$ (це можна зробити за $O(1)$, якщо обчислити ці позиції заздалегідь під час попередньої обробки).
Тоді **відповіддю** на запит буде сума $T1[p..q-1]$ мінус сума $T2[p..q-1]$.

**Чому?**
Розгляньмо відрізок $[p;q]$ в ейлеровому обході.
Він містить усі ребра потрібного нам шляху від $i$ до $j$, але також містить набір ребер, що лежать на інших шляхах із $i$.
Однак між потрібними нам ребрами та рештою ребер є одна велика відмінність: потрібні нам ребра будуть перелічені лише раз — у прямому напрямку, а всі інші ребра з'являються двічі: один раз у прямому й один раз у зворотному напрямку.
Отже, різниця $T1[p..q-1] - T2[p..q-1]$ дасть нам правильну відповідь (мінус одиниця потрібна, бо інакше ми захопимо зайве ребро, що виходить із вершини $j$).
Запит суми в дереві відрізків виконується за $O(\log N)$.

Відповідь на **запит першого типу** (фарбування ребра) ще простіша — нам потрібно лише оновити $T1$ та $T2$, а саме виконати одну модифікацію елемента, що відповідає нашому ребру (знайти ребро у списку, знову ж таки, можна за $O(1)$, якщо виконати цей пошук під час попередньої обробки).
Одна модифікація в дереві відрізків виконується за $O(\log N)$.

## Реалізація \{#implementation}

Ось повна реалізація розв'язку, включно з обчисленням LCA:

<CodeTabs>

```cpp
const int INF = 1000 * 1000 * 1000;

typedef vector<vector<int>> graph;

vector<int> dfs_list;
vector<int> edges_list;
vector<int> h;

void dfs(int v, const graph& g, const graph& edge_ids, int cur_h = 1) {
    h[v] = cur_h;
    dfs_list.push_back(v);
    for (size_t i = 0; i < g[v].size(); ++i) {
        if (h[g[v][i]] == -1) {
            edges_list.push_back(edge_ids[v][i]);
            dfs(g[v][i], g, edge_ids, cur_h + 1);
            edges_list.push_back(edge_ids[v][i]);
            dfs_list.push_back(v);
        }
    }
}

vector<int> lca_tree;
vector<int> first;

void lca_tree_build(int i, int l, int r) {
    if (l == r) {
        lca_tree[i] = dfs_list[l];
    } else {
        int m = (l + r) >> 1;
        lca_tree_build(i + i, l, m);
        lca_tree_build(i + i + 1, m + 1, r);
        int lt = lca_tree[i + i], rt = lca_tree[i + i + 1];
        lca_tree[i] = h[lt] < h[rt] ? lt : rt;
    }
}

void lca_prepare(int n) {
    lca_tree.assign(dfs_list.size() * 8, -1);
    lca_tree_build(1, 0, (int)dfs_list.size() - 1);

    first.assign(n, -1);
    for (int i = 0; i < (int)dfs_list.size(); ++i) {
        int v = dfs_list[i];
        if (first[v] == -1)
            first[v] = i;
    }
}

int lca_tree_query(int i, int tl, int tr, int l, int r) {
    if (tl == l && tr == r)
        return lca_tree[i];
    int m = (tl + tr) >> 1;
    if (r <= m)
        return lca_tree_query(i + i, tl, m, l, r);
    if (l > m)
        return lca_tree_query(i + i + 1, m + 1, tr, l, r);
    int lt = lca_tree_query(i + i, tl, m, l, m);
    int rt = lca_tree_query(i + i + 1, m + 1, tr, m + 1, r);
    return h[lt] < h[rt] ? lt : rt;
}

int lca(int a, int b) {
    if (first[a] > first[b])
        swap(a, b);
    return lca_tree_query(1, 0, (int)dfs_list.size() - 1, first[a], first[b]);
}

vector<int> first1, first2;
vector<char> edge_used;
vector<int> tree1, tree2;

void query_prepare(int n) {
    first1.resize(n - 1, -1);
    first2.resize(n - 1, -1);
    for (int i = 0; i < (int)edges_list.size(); ++i) {
        int j = edges_list[i];
        if (first1[j] == -1)
            first1[j] = i;
        else
            first2[j] = i;
    }

    edge_used.resize(n - 1);
    tree1.resize(edges_list.size() * 8);
    tree2.resize(edges_list.size() * 8);
}

void sum_tree_update(vector<int>& tree, int i, int l, int r, int j, int delta) {
    tree[i] += delta;
    if (l < r) {
        int m = (l + r) >> 1;
        if (j <= m)
            sum_tree_update(tree, i + i, l, m, j, delta);
        else
            sum_tree_update(tree, i + i + 1, m + 1, r, j, delta);
    }
}

int sum_tree_query(const vector<int>& tree, int i, int tl, int tr, int l, int r) {
    if (l > r || tl > tr)
        return 0;
    if (tl == l && tr == r)
        return tree[i];
    int m = (tl + tr) >> 1;
    if (r <= m)
        return sum_tree_query(tree, i + i, tl, m, l, r);
    if (l > m)
        return sum_tree_query(tree, i + i + 1, m + 1, tr, l, r);
    return sum_tree_query(tree, i + i, tl, m, l, m) +
           sum_tree_query(tree, i + i + 1, m + 1, tr, m + 1, r);
}

int query(int v1, int v2) {
    return sum_tree_query(tree1, 1, 0, (int)edges_list.size() - 1, first[v1], first[v2] - 1) -
           sum_tree_query(tree2, 1, 0, (int)edges_list.size() - 1, first[v1], first[v2] - 1);
}

int main() {
    // зчитування графа
    int n;
    scanf("%d", &n);
    graph g(n), edge_ids(n);
    for (int i = 0; i < n - 1; ++i) {
        int v1, v2;
        scanf("%d%d", &v1, &v2);
        --v1, --v2;
        g[v1].push_back(v2);
        g[v2].push_back(v1);
        edge_ids[v1].push_back(i);
        edge_ids[v2].push_back(i);
    }

    h.assign(n, -1);
    dfs(0, g, edge_ids);
    lca_prepare(n);
    query_prepare(n);

    for (;;) {
        if () {
            // запит на фарбування ребра x;
            // якщо start = true, то ребро фарбується, інакше фарбування
            // знімається
            edge_used[x] = start;
            sum_tree_update(tree1, 1, 0, (int)edges_list.size() - 1, first1[x],
                            start ? 1 : -1);
            sum_tree_update(tree2, 1, 0, (int)edges_list.size() - 1, first2[x],
                            start ? 1 : -1);
        } else {
            // запит кількості пофарбованих ребер на шляху між v1 та v2
            int l = lca(v1, v2);
            int result = query(l, v1) + query(l, v2);
            // result - відповідь на запит
        }
    }
}
```

```python
import sys

# Ейлерів обхід виконується рекурсивним DFS, глибина якого може сягати O(N),
# тож збільшуємо ліміт рекурсії Python.
sys.setrecursionlimit(300000)

INF = 1000 * 1000 * 1000

dfs_list = []    # ейлерів обхід вершин
edges_list = []  # ейлерів обхід ребер (кожне ребро з'являється двічі)
h = []           # глибина кожної вершини


def dfs(v, g, edge_ids, cur_h=1):
    h[v] = cur_h
    dfs_list.append(v)
    for to, eid in zip(g[v], edge_ids[v]):
        if h[to] == -1:
            edges_list.append(eid)
            dfs(to, g, edge_ids, cur_h + 1)
            edges_list.append(eid)
            dfs_list.append(v)


lca_tree = []
first = []


def lca_tree_build(i, l, r):
    if l == r:
        lca_tree[i] = dfs_list[l]
    else:
        m = (l + r) >> 1
        lca_tree_build(i + i, l, m)
        lca_tree_build(i + i + 1, m + 1, r)
        lt, rt = lca_tree[i + i], lca_tree[i + i + 1]
        lca_tree[i] = lt if h[lt] < h[rt] else rt


def lca_prepare(n):
    global lca_tree, first
    lca_tree = [-1] * (len(dfs_list) * 8)
    lca_tree_build(1, 0, len(dfs_list) - 1)

    first = [-1] * n
    for i, v in enumerate(dfs_list):
        if first[v] == -1:
            first[v] = i


def lca_tree_query(i, tl, tr, l, r):
    if tl == l and tr == r:
        return lca_tree[i]
    m = (tl + tr) >> 1
    if r <= m:
        return lca_tree_query(i + i, tl, m, l, r)
    if l > m:
        return lca_tree_query(i + i + 1, m + 1, tr, l, r)
    lt = lca_tree_query(i + i, tl, m, l, m)
    rt = lca_tree_query(i + i + 1, m + 1, tr, m + 1, r)
    return lt if h[lt] < h[rt] else rt


def lca(a, b):
    if first[a] > first[b]:
        a, b = b, a
    return lca_tree_query(1, 0, len(dfs_list) - 1, first[a], first[b])


first1, first2 = [], []
edge_used = []
tree1, tree2 = [], []


def query_prepare(n):
    global first1, first2, edge_used, tree1, tree2
    first1 = [-1] * (n - 1)
    first2 = [-1] * (n - 1)
    for i, j in enumerate(edges_list):
        if first1[j] == -1:
            first1[j] = i
        else:
            first2[j] = i

    edge_used = [0] * (n - 1)
    tree1 = [0] * (len(edges_list) * 8)
    tree2 = [0] * (len(edges_list) * 8)


def sum_tree_update(tree, i, l, r, j, delta):
    tree[i] += delta
    if l < r:
        m = (l + r) >> 1
        if j <= m:
            sum_tree_update(tree, i + i, l, m, j, delta)
        else:
            sum_tree_update(tree, i + i + 1, m + 1, r, j, delta)


def sum_tree_query(tree, i, tl, tr, l, r):
    if l > r or tl > tr:
        return 0
    if tl == l and tr == r:
        return tree[i]
    m = (tl + tr) >> 1
    if r <= m:
        return sum_tree_query(tree, i + i, tl, m, l, r)
    if l > m:
        return sum_tree_query(tree, i + i + 1, m + 1, tr, l, r)
    return (sum_tree_query(tree, i + i, tl, m, l, m) +
            sum_tree_query(tree, i + i + 1, m + 1, tr, m + 1, r))


def query(v1, v2):
    m = len(edges_list) - 1
    return (sum_tree_query(tree1, 1, 0, m, first[v1], first[v2] - 1) -
            sum_tree_query(tree2, 1, 0, m, first[v1], first[v2] - 1))


def main():
    # зчитування графа
    n = int(input())
    g = [[] for _ in range(n)]
    edge_ids = [[] for _ in range(n)]
    for i in range(n - 1):
        v1, v2 = map(int, input().split())
        v1 -= 1
        v2 -= 1
        g[v1].append(v2)
        g[v2].append(v1)
        edge_ids[v1].append(i)
        edge_ids[v2].append(i)

    global h
    h = [-1] * n
    dfs(0, g, edge_ids)
    lca_prepare(n)
    query_prepare(n)

    while True:
        if ...:
            # запит на фарбування ребра x;
            # якщо start = True, то ребро фарбується, інакше фарбування
            # знімається
            edge_used[x] = start
            m = len(edges_list) - 1
            sum_tree_update(tree1, 1, 0, m, first1[x], 1 if start else -1)
            sum_tree_update(tree2, 1, 0, m, first2[x], 1 if start else -1)
        else:
            # запит кількості пофарбованих ребер на шляху між v1 та v2
            l = lca(v1, v2)
            result = query(l, v1) + query(l, v2)
            # result - відповідь на запит
```

```typescript
const INF = 1000 * 1000 * 1000;

let dfsList: number[] = [];    // ейлерів обхід вершин
let edgesList: number[] = [];  // ейлерів обхід ребер (кожне ребро двічі)
let h: number[] = [];          // глибина кожної вершини

function dfs(v: number, g: number[][], edgeIds: number[][], curH = 1): void {
    h[v] = curH;
    dfsList.push(v);
    for (let i = 0; i < g[v].length; ++i) {
        const to = g[v][i];
        if (h[to] === -1) {
            edgesList.push(edgeIds[v][i]);
            dfs(to, g, edgeIds, curH + 1);
            edgesList.push(edgeIds[v][i]);
            dfsList.push(v);
        }
    }
}

let lcaTree: number[] = [];
let first: number[] = [];

function lcaTreeBuild(i: number, l: number, r: number): void {
    if (l === r) {
        lcaTree[i] = dfsList[l];
    } else {
        const m = (l + r) >> 1;
        lcaTreeBuild(i + i, l, m);
        lcaTreeBuild(i + i + 1, m + 1, r);
        const lt = lcaTree[i + i], rt = lcaTree[i + i + 1];
        lcaTree[i] = h[lt] < h[rt] ? lt : rt;
    }
}

function lcaPrepare(n: number): void {
    lcaTree = new Array(dfsList.length * 8).fill(-1);
    lcaTreeBuild(1, 0, dfsList.length - 1);

    first = new Array(n).fill(-1);
    for (let i = 0; i < dfsList.length; ++i) {
        const v = dfsList[i];
        if (first[v] === -1) first[v] = i;
    }
}

function lcaTreeQuery(i: number, tl: number, tr: number, l: number, r: number): number {
    if (tl === l && tr === r) return lcaTree[i];
    const m = (tl + tr) >> 1;
    if (r <= m) return lcaTreeQuery(i + i, tl, m, l, r);
    if (l > m) return lcaTreeQuery(i + i + 1, m + 1, tr, l, r);
    const lt = lcaTreeQuery(i + i, tl, m, l, m);
    const rt = lcaTreeQuery(i + i + 1, m + 1, tr, m + 1, r);
    return h[lt] < h[rt] ? lt : rt;
}

function lca(a: number, b: number): number {
    if (first[a] > first[b]) [a, b] = [b, a];
    return lcaTreeQuery(1, 0, dfsList.length - 1, first[a], first[b]);
}

let first1: number[] = [], first2: number[] = [];
let edgeUsed: number[] = [];
let tree1: number[] = [], tree2: number[] = [];

function queryPrepare(n: number): void {
    first1 = new Array(n - 1).fill(-1);
    first2 = new Array(n - 1).fill(-1);
    for (let i = 0; i < edgesList.length; ++i) {
        const j = edgesList[i];
        if (first1[j] === -1) first1[j] = i;
        else first2[j] = i;
    }

    edgeUsed = new Array(n - 1).fill(0);
    tree1 = new Array(edgesList.length * 8).fill(0);
    tree2 = new Array(edgesList.length * 8).fill(0);
}

function sumTreeUpdate(tree: number[], i: number, l: number, r: number, j: number, delta: number): void {
    tree[i] += delta;
    if (l < r) {
        const m = (l + r) >> 1;
        if (j <= m) sumTreeUpdate(tree, i + i, l, m, j, delta);
        else sumTreeUpdate(tree, i + i + 1, m + 1, r, j, delta);
    }
}

function sumTreeQuery(tree: number[], i: number, tl: number, tr: number, l: number, r: number): number {
    if (l > r || tl > tr) return 0;
    if (tl === l && tr === r) return tree[i];
    const m = (tl + tr) >> 1;
    if (r <= m) return sumTreeQuery(tree, i + i, tl, m, l, r);
    if (l > m) return sumTreeQuery(tree, i + i + 1, m + 1, tr, l, r);
    return sumTreeQuery(tree, i + i, tl, m, l, m) +
           sumTreeQuery(tree, i + i + 1, m + 1, tr, m + 1, r);
}

function query(v1: number, v2: number): number {
    const m = edgesList.length - 1;
    return sumTreeQuery(tree1, 1, 0, m, first[v1], first[v2] - 1) -
           sumTreeQuery(tree2, 1, 0, m, first[v1], first[v2] - 1);
}

function main(): void {
    // зчитування графа
    const input = require("fs").readFileSync(0, "utf8").split(/\s+/).map(Number);
    let ptr = 0;
    const n = input[ptr++];
    const g: number[][] = Array.from({ length: n }, () => []);
    const edgeIds: number[][] = Array.from({ length: n }, () => []);
    for (let i = 0; i < n - 1; ++i) {
        const v1 = input[ptr++] - 1, v2 = input[ptr++] - 1;
        g[v1].push(v2);
        g[v2].push(v1);
        edgeIds[v1].push(i);
        edgeIds[v2].push(i);
    }

    h = new Array(n).fill(-1);
    dfs(0, g, edgeIds);
    lcaPrepare(n);
    queryPrepare(n);

    let x = 0, start = false, v1 = 0, v2 = 0;
    for (;;) {
        if (/* запит першого типу */ false) {
            // запит на фарбування ребра x;
            // якщо start = true, то ребро фарбується, інакше фарбування
            // знімається
            edgeUsed[x] = start ? 1 : 0;
            const m = edgesList.length - 1;
            sumTreeUpdate(tree1, 1, 0, m, first1[x], start ? 1 : -1);
            sumTreeUpdate(tree2, 1, 0, m, first2[x], start ? 1 : -1);
        } else {
            // запит кількості пофарбованих ребер на шляху між v1 та v2
            const l = lca(v1, v2);
            const result = query(l, v1) + query(l, v2);
            // result - відповідь на запит
        }
    }
}
```

```go
package main

import (
	"bufio"
	"fmt"
	"os"
)

const INF = 1000 * 1000 * 1000

var (
	dfsList   []int // ейлерів обхід вершин
	edgesList []int // ейлерів обхід ребер (кожне ребро двічі)
	h         []int // глибина кожної вершини
)

func dfs(v int, g, edgeIds [][]int, curH int) {
	h[v] = curH
	dfsList = append(dfsList, v)
	for i, to := range g[v] {
		if h[to] == -1 {
			edgesList = append(edgesList, edgeIds[v][i])
			dfs(to, g, edgeIds, curH+1)
			edgesList = append(edgesList, edgeIds[v][i])
			dfsList = append(dfsList, v)
		}
	}
}

var (
	lcaTree []int
	first   []int
)

func lcaTreeBuild(i, l, r int) {
	if l == r {
		lcaTree[i] = dfsList[l]
	} else {
		m := (l + r) >> 1
		lcaTreeBuild(i+i, l, m)
		lcaTreeBuild(i+i+1, m+1, r)
		lt, rt := lcaTree[i+i], lcaTree[i+i+1]
		if h[lt] < h[rt] {
			lcaTree[i] = lt
		} else {
			lcaTree[i] = rt
		}
	}
}

func lcaPrepare(n int) {
	lcaTree = make([]int, len(dfsList)*8)
	for i := range lcaTree {
		lcaTree[i] = -1
	}
	lcaTreeBuild(1, 0, len(dfsList)-1)

	first = make([]int, n)
	for i := range first {
		first[i] = -1
	}
	for i, v := range dfsList {
		if first[v] == -1 {
			first[v] = i
		}
	}
}

func lcaTreeQuery(i, tl, tr, l, r int) int {
	if tl == l && tr == r {
		return lcaTree[i]
	}
	m := (tl + tr) >> 1
	if r <= m {
		return lcaTreeQuery(i+i, tl, m, l, r)
	}
	if l > m {
		return lcaTreeQuery(i+i+1, m+1, tr, l, r)
	}
	lt := lcaTreeQuery(i+i, tl, m, l, m)
	rt := lcaTreeQuery(i+i+1, m+1, tr, m+1, r)
	if h[lt] < h[rt] {
		return lt
	}
	return rt
}

func lca(a, b int) int {
	if first[a] > first[b] {
		a, b = b, a
	}
	return lcaTreeQuery(1, 0, len(dfsList)-1, first[a], first[b])
}

var (
	first1, first2 []int
	edgeUsed       []int
	tree1, tree2   []int
)

func queryPrepare(n int) {
	first1 = make([]int, n-1)
	first2 = make([]int, n-1)
	for i := range first1 {
		first1[i] = -1
		first2[i] = -1
	}
	for i, j := range edgesList {
		if first1[j] == -1 {
			first1[j] = i
		} else {
			first2[j] = i
		}
	}

	edgeUsed = make([]int, n-1)
	tree1 = make([]int, len(edgesList)*8)
	tree2 = make([]int, len(edgesList)*8)
}

func sumTreeUpdate(tree []int, i, l, r, j, delta int) {
	tree[i] += delta
	if l < r {
		m := (l + r) >> 1
		if j <= m {
			sumTreeUpdate(tree, i+i, l, m, j, delta)
		} else {
			sumTreeUpdate(tree, i+i+1, m+1, r, j, delta)
		}
	}
}

func sumTreeQuery(tree []int, i, tl, tr, l, r int) int {
	if l > r || tl > tr {
		return 0
	}
	if tl == l && tr == r {
		return tree[i]
	}
	m := (tl + tr) >> 1
	if r <= m {
		return sumTreeQuery(tree, i+i, tl, m, l, r)
	}
	if l > m {
		return sumTreeQuery(tree, i+i+1, m+1, tr, l, r)
	}
	return sumTreeQuery(tree, i+i, tl, m, l, m) +
		sumTreeQuery(tree, i+i+1, m+1, tr, m+1, r)
}

func query(v1, v2 int) int {
	m := len(edgesList) - 1
	return sumTreeQuery(tree1, 1, 0, m, first[v1], first[v2]-1) -
		sumTreeQuery(tree2, 1, 0, m, first[v1], first[v2]-1)
}

func main() {
	// зчитування графа
	reader := bufio.NewReader(os.Stdin)
	var n int
	fmt.Fscan(reader, &n)
	g := make([][]int, n)
	edgeIds := make([][]int, n)
	for i := 0; i < n-1; i++ {
		var v1, v2 int
		fmt.Fscan(reader, &v1, &v2)
		v1--
		v2--
		g[v1] = append(g[v1], v2)
		g[v2] = append(g[v2], v1)
		edgeIds[v1] = append(edgeIds[v1], i)
		edgeIds[v2] = append(edgeIds[v2], i)
	}

	h = make([]int, n)
	for i := range h {
		h[i] = -1
	}
	dfs(0, g, edgeIds, 1)
	lcaPrepare(n)
	queryPrepare(n)

	var x, v1, v2 int
	var start bool
	for {
		if false /* запит першого типу */ {
			// запит на фарбування ребра x;
			// якщо start = true, то ребро фарбується, інакше фарбування
			// знімається
			delta := -1
			if start {
				edgeUsed[x] = 1
				delta = 1
			} else {
				edgeUsed[x] = 0
			}
			m := len(edgesList) - 1
			sumTreeUpdate(tree1, 1, 0, m, first1[x], delta)
			sumTreeUpdate(tree2, 1, 0, m, first2[x], delta)
		} else {
			// запит кількості пофарбованих ребер на шляху між v1 та v2
			l := lca(v1, v2)
			result := query(l, v1) + query(l, v2)
			_ = result
			// result - відповідь на запит
		}
	}
}
```

</CodeTabs>
