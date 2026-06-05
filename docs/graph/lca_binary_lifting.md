# Найнижчий спільний предок — двійкові підйоми

Нехай $G$ — дерево.
Для кожного запиту виду `(u, v)` ми хочемо знайти найнижчого спільного предка вершин `u` і `v`, тобто хочемо знайти таку вершину `w`, яка лежить на шляху від `u` до кореня й на шляху від `v` до кореня, а якщо таких вершин кілька, то ми обираємо ту, що найдальше від кореня.
Іншими словами, шукана вершина `w` — це найнижчий предок одночасно `u` і `v`.
Зокрема, якщо `u` є предком `v`, то `u` і є їхнім найнижчим спільним предком.

Алгоритм, описаний у цій статті, потребуватиме $O(N \log N)$ на попередню обробку дерева, а потім $O(\log N)$ на кожен запит LCA.

## Алгоритм \{#algorithm}

Для кожної вершини ми наперед обчислимо її предка на один рівень вище, предка на два рівні вище, предка на чотири рівні вище і так далі.
Зберігатимемо їх у масиві `up`, тобто `up[i][j]` — це `2^j`-й предок над вершиною `i`, де `i=1...N`, `j=0...ceil(log(N))`.
Ця інформація дозволяє нам перестрибувати від будь-якої вершини до будь-якого предка над нею за час $O(\log N)$.
Ми можемо обчислити цей масив за допомогою обходу дерева в [глибину (DFS)](depth-first-search.md).

Для кожної вершини ми також запам'ятаємо час першого відвідування цієї вершини (тобто момент, коли DFS відкриває вершину) і час, коли ми її залишили (тобто після того, як відвідали всіх нащадків і вийшли з функції DFS).
Цю інформацію ми можемо використати, щоб за сталий час визначати, чи є одна вершина предком іншої.

Припустімо тепер, що ми отримали запит `(u, v)`.
Ми можемо одразу перевірити, чи є одна вершина предком іншої.
У такому разі ця вершина вже і є LCA.
Якщо `u` не є предком `v`, а `v` не є предком `u`, то ми піднімаємося по предках `u`, доки не знайдемо найвищу (тобто найближчу до кореня) вершину, яка не є предком `v` (тобто таку вершину `x`, що `x` не є предком `v`, а `up[x][0]` — є).
Цю вершину `x` ми можемо знайти за час $O(\log N)$ за допомогою масиву `up`.

Опишемо цей процес детальніше.
Нехай `L = ceil(log(N))`.
Припустімо спочатку, що `i = L`.
Якщо `up[u][i]` не є предком `v`, то ми можемо присвоїти `u = up[u][i]` і зменшити `i`.
Якщо ж `up[u][i]` є предком, то ми просто зменшуємо `i`.
Очевидно, що після виконання цього для всіх невід'ємних `i` вершина `u` буде шуканою — тобто `u` все ще не є предком `v`, а `up[u][0]` — є.

Тепер, очевидно, відповіддю на запит LCA буде `up[u][0]` — тобто найменша вершина серед предків вершини `u`, яка водночас є предком `v`.

Отже, відповідь на запит LCA полягає в тому, що ми перебираємо `i` від `ceil(log(N))` до `0` і на кожній ітерації перевіряємо, чи є одна вершина предком іншої.
Як наслідок, на кожен запит можна відповісти за $O(\log N)$.

## Реалізація \{#implementation}

<CodeTabs>

```cpp
int n, l;
vector<vector<int>> adj;

int timer;
vector<int> tin, tout;
vector<vector<int>> up;

void dfs(int v, int p)
{
    tin[v] = ++timer;
    up[v][0] = p;
    for (int i = 1; i <= l; ++i)
        up[v][i] = up[up[v][i-1]][i-1];

    for (int u : adj[v]) {
        if (u != p)
            dfs(u, v);
    }

    tout[v] = ++timer;
}

bool is_ancestor(int u, int v)
{
    return tin[u] <= tin[v] && tout[u] >= tout[v];
}

int lca(int u, int v)
{
    if (is_ancestor(u, v))
        return u;
    if (is_ancestor(v, u))
        return v;
    for (int i = l; i >= 0; --i) {
        if (!is_ancestor(up[u][i], v))
            u = up[u][i];
    }
    return up[u][0];
}

void preprocess(int root) {
    tin.resize(n);
    tout.resize(n);
    timer = 0;
    l = ceil(log2(n));
    up.assign(n, vector<int>(l + 1));
    dfs(root, root);
}
```

```python
import sys
import math

# DFS рекурсивний, тому збільшуємо ліміт рекурсії,
# інакще глибокі дерева спричинять RecursionError.
sys.setrecursionlimit(300000)

n: int = 0
l: int = 0
adj: list[list[int]] = []

timer: int = 0
tin: list[int] = []
tout: list[int] = []
up: list[list[int]] = []


def dfs(v: int, p: int) -> None:
    global timer
    timer += 1
    tin[v] = timer
    up[v][0] = p
    for i in range(1, l + 1):
        up[v][i] = up[up[v][i - 1]][i - 1]

    for u in adj[v]:
        if u != p:
            dfs(u, v)

    timer += 1
    tout[v] = timer


def is_ancestor(u: int, v: int) -> bool:
    return tin[u] <= tin[v] and tout[u] >= tout[v]


def lca(u: int, v: int) -> int:
    if is_ancestor(u, v):
        return u
    if is_ancestor(v, u):
        return v
    for i in range(l, -1, -1):
        if not is_ancestor(up[u][i], v):
            u = up[u][i]
    return up[u][0]


def preprocess(root: int) -> None:
    global timer, l, tin, tout, up
    tin = [0] * n
    tout = [0] * n
    timer = 0
    # ceil(log2(n)) через bit_length: для n > 1 кількість потрібних рівнів —
    # це позиція старшого біта числа (n - 1).
    l = (n - 1).bit_length() if n > 1 else 0
    up = [[0] * (l + 1) for _ in range(n)]
    dfs(root, root)
```

```typescript
let n = 0;
let l = 0;
let adj: number[][] = [];

let timer = 0;
let tin: number[] = [];
let tout: number[] = [];
let up: number[][] = [];

function dfs(v: number, p: number): void {
  tin[v] = ++timer;
  up[v][0] = p;
  for (let i = 1; i <= l; ++i) {
    up[v][i] = up[up[v][i - 1]][i - 1];
  }

  for (const u of adj[v]) {
    if (u !== p) {
      dfs(u, v);
    }
  }

  tout[v] = ++timer;
}

function isAncestor(u: number, v: number): boolean {
  return tin[u] <= tin[v] && tout[u] >= tout[v];
}

function lca(u: number, v: number): number {
  if (isAncestor(u, v)) {
    return u;
  }
  if (isAncestor(v, u)) {
    return v;
  }
  for (let i = l; i >= 0; --i) {
    if (!isAncestor(up[u][i], v)) {
      u = up[u][i];
    }
  }
  return up[u][0];
}

function preprocess(root: number): void {
  tin = new Array<number>(n).fill(0);
  tout = new Array<number>(n).fill(0);
  timer = 0;
  // ceil(log2(n)) — кількість значущих бітів у (n - 1).
  l = n > 1 ? 32 - Math.clz32(n - 1) : 0;
  up = Array.from({ length: n }, () => new Array<number>(l + 1).fill(0));
  dfs(root, root);
}
```

```go
package main

import "math/bits"

var (
	n   int
	l   int
	adj [][]int

	timer int
	tin   []int
	tout  []int
	up    [][]int
)

func dfs(v, p int) {
	timer++
	tin[v] = timer
	up[v][0] = p
	for i := 1; i <= l; i++ {
		up[v][i] = up[up[v][i-1]][i-1]
	}

	for _, u := range adj[v] {
		if u != p {
			dfs(u, v)
		}
	}

	timer++
	tout[v] = timer
}

func isAncestor(u, v int) bool {
	return tin[u] <= tin[v] && tout[u] >= tout[v]
}

func lca(u, v int) int {
	if isAncestor(u, v) {
		return u
	}
	if isAncestor(v, u) {
		return v
	}
	for i := l; i >= 0; i-- {
		if !isAncestor(up[u][i], v) {
			u = up[u][i]
		}
	}
	return up[u][0]
}

func preprocess(root int) {
	tin = make([]int, n)
	tout = make([]int, n)
	timer = 0
	// ceil(log2(n)) через кількість значущих бітів у (n - 1).
	if n > 1 {
		l = bits.Len(uint(n - 1))
	} else {
		l = 0
	}
	up = make([][]int, n)
	for i := range up {
		up[i] = make([]int, l+1)
	}
	dfs(root, root)
}
```

</CodeTabs>
## Задачі для практики \{#practice-problems}

* [LeetCode -  Kth Ancestor of a Tree Node](https://leetcode.com/problems/kth-ancestor-of-a-tree-node)
* [Codechef - Longest Good Segment](https://www.codechef.com/problems/LGSEG)
* [HackerEarth - Optimal Connectivity](https://www.hackerearth.com/practice/algorithms/graphs/graph-representation/practice-problems/algorithm/optimal-connectivity-c6ae79ca/)

## Відеоматеріали \{#video}

<YouTubeEmbed id="oib-XsjFa-M" title="Binary Lifting (Kth Ancestor of a Tree Node) — Errichto Algorithms" />
