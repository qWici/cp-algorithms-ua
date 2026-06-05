# Перевірка графа на ацикличність і пошук циклу за $O(M)$

Розглянемо орієнтований або неорієнтований граф без петель і кратних ребер. Нам потрібно перевірити, чи є він ациклічним, і якщо ні, то знайти будь-який цикл.

Цю задачу ми можемо розв'язати за допомогою [пошуку в глибину](depth-first-search.md) за $O(M)$, де $M$ — кількість ребер.

## Алгоритм \{#algorithm}

Ми запустимо серію обходів DFS у графі. Спочатку всі вершини пофарбовані в білий колір (0). З кожної невідвіданої (білої) вершини запускаємо DFS, фарбуємо її в сірий колір (1) під час входу і в чорний колір (2) під час виходу. Якщо DFS переходить у сіру вершину, то ми знайшли цикл (якщо граф неорієнтований, ребро до батька не враховується).
Сам цикл можна відновити за допомогою масиву батьків.

## Реалізація \{#implementation}

Ось реалізація для орієнтованого графа.

<CodeTabs>

```cpp
int n;
vector<vector<int>> adj;
vector<char> color;
vector<int> parent;
int cycle_start, cycle_end;

bool dfs(int v) {
    color[v] = 1;
    for (int u : adj[v]) {
        if (color[u] == 0) {
            parent[u] = v;
            if (dfs(u))
                return true;
        } else if (color[u] == 1) {
            cycle_end = v;
            cycle_start = u;
            return true;
        }
    }
    color[v] = 2;
    return false;
}

void find_cycle() {
    color.assign(n, 0);
    parent.assign(n, -1);
    cycle_start = -1;

    for (int v = 0; v < n; v++) {
        if (color[v] == 0 && dfs(v))
            break;
    }

    if (cycle_start == -1) {
        cout << "Acyclic" << endl;
    } else {
        vector<int> cycle;
        cycle.push_back(cycle_start);
        for (int v = cycle_end; v != cycle_start; v = parent[v])
            cycle.push_back(v);
        cycle.push_back(cycle_start);
        reverse(cycle.begin(), cycle.end());

        cout << "Cycle found: ";
        for (int v : cycle)
            cout << v << " ";
        cout << endl;
    }
}
```

```python
import sys

# DFS на великих графах може перевищити стандартний ліміт рекурсії (1000),
# тому за потреби його варто підняти: sys.setrecursionlimit(глибина).
sys.setrecursionlimit(300000)

n = 0
adj: list[list[int]] = []
color: list[int] = []      # 0 — білий, 1 — сірий, 2 — чорний
parent: list[int] = []
cycle_start = 0
cycle_end = 0


def dfs(v: int) -> bool:
    global cycle_start, cycle_end
    color[v] = 1
    for u in adj[v]:
        if color[u] == 0:
            parent[u] = v
            if dfs(u):
                return True
        elif color[u] == 1:
            cycle_end = v
            cycle_start = u
            return True
    color[v] = 2
    return False


def find_cycle() -> None:
    global color, parent, cycle_start
    color = [0] * n
    parent = [-1] * n
    cycle_start = -1

    for v in range(n):
        if color[v] == 0 and dfs(v):
            break

    if cycle_start == -1:
        print("Acyclic")
    else:
        cycle = [cycle_start]
        v = cycle_end
        while v != cycle_start:
            cycle.append(v)
            v = parent[v]
        cycle.append(cycle_start)
        cycle.reverse()

        print("Cycle found: " + " ".join(map(str, cycle)) + " ")
```

```typescript
let n = 0;
let adj: number[][] = [];
let color: number[] = []; // 0 — білий, 1 — сірий, 2 — чорний
let parent: number[] = [];
let cycleStart = 0;
let cycleEnd = 0;

function dfs(v: number): boolean {
    color[v] = 1;
    for (const u of adj[v]) {
        if (color[u] === 0) {
            parent[u] = v;
            if (dfs(u))
                return true;
        } else if (color[u] === 1) {
            cycleEnd = v;
            cycleStart = u;
            return true;
        }
    }
    color[v] = 2;
    return false;
}

function findCycle(): void {
    color = new Array(n).fill(0);
    parent = new Array(n).fill(-1);
    cycleStart = -1;

    for (let v = 0; v < n; v++) {
        if (color[v] === 0 && dfs(v))
            break;
    }

    if (cycleStart === -1) {
        console.log("Acyclic");
    } else {
        const cycle: number[] = [];
        cycle.push(cycleStart);
        for (let v = cycleEnd; v !== cycleStart; v = parent[v])
            cycle.push(v);
        cycle.push(cycleStart);
        cycle.reverse();

        console.log("Cycle found: " + cycle.join(" ") + " ");
    }
}
```

```go
var (
	n          int
	adj        [][]int
	color      []byte // 0 — білий, 1 — сірий, 2 — чорний
	parent     []int
	cycleStart int
	cycleEnd   int
)

func dfs(v int) bool {
	color[v] = 1
	for _, u := range adj[v] {
		if color[u] == 0 {
			parent[u] = v
			if dfs(u) {
				return true
			}
		} else if color[u] == 1 {
			cycleEnd = v
			cycleStart = u
			return true
		}
	}
	color[v] = 2
	return false
}

func findCycle() {
	color = make([]byte, n)
	parent = make([]int, n)
	for i := range parent {
		parent[i] = -1
	}
	cycleStart = -1

	for v := 0; v < n; v++ {
		if color[v] == 0 && dfs(v) {
			break
		}
	}

	if cycleStart == -1 {
		fmt.Println("Acyclic")
	} else {
		cycle := []int{cycleStart}
		for v := cycleEnd; v != cycleStart; v = parent[v] {
			cycle = append(cycle, v)
		}
		cycle = append(cycle, cycleStart)
		// розгортаємо цикл, щоб він ішов від cycle_start
		for i, j := 0, len(cycle)-1; i < j; i, j = i+1, j-1 {
			cycle[i], cycle[j] = cycle[j], cycle[i]
		}

		fmt.Print("Cycle found: ")
		for _, v := range cycle {
			fmt.Printf("%d ", v)
		}
		fmt.Println()
	}
}
```

</CodeTabs>

Ось реалізація для неорієнтованого графа.
Зауважимо, що в неорієнтованій версії, якщо вершина `v` стає чорною, DFS більше ніколи її не відвідає.
Це тому, що ми вже дослідили всі суміжні ребра `v`, коли відвідали її вперше.
Компонента зв'язності, що містить `v` (після видалення ребра між `v` та її батьком), має бути деревом, якщо DFS завершив обробку `v`, не знайшовши циклу.
Тож нам навіть не потрібно розрізняти сірий і чорний стани.
Таким чином, ми можемо перетворити char-вектор `color` на булевий вектор `visited`.

<CodeTabs>

```cpp
int n;
vector<vector<int>> adj;
vector<bool> visited;
vector<int> parent;
int cycle_start, cycle_end;

bool dfs(int v, int par) { // передаємо вершину та її батьківську вершину
    visited[v] = true;
    for (int u : adj[v]) {
        if(u == par) continue; // пропускаємо ребро до батьківської вершини
        if (visited[u]) {
            cycle_end = v;
            cycle_start = u;
            return true;
        }
        parent[u] = v;
        if (dfs(u, parent[u]))
            return true;
    }
    return false;
}

void find_cycle() {
    visited.assign(n, false);
    parent.assign(n, -1);
    cycle_start = -1;

    for (int v = 0; v < n; v++) {
        if (!visited[v] && dfs(v, parent[v]))
            break;
    }

    if (cycle_start == -1) {
        cout << "Acyclic" << endl;
    } else {
        vector<int> cycle;
        cycle.push_back(cycle_start);
        for (int v = cycle_end; v != cycle_start; v = parent[v])
            cycle.push_back(v);
        cycle.push_back(cycle_start);

        cout << "Cycle found: ";
        for (int v : cycle)
            cout << v << " ";
        cout << endl;
    }
}
```

```python
n = 0
adj: list[list[int]] = []
visited: list[bool] = []
parent: list[int] = []
cycle_start = 0
cycle_end = 0

# Як і для орієнтованого випадку, глибока рекурсія DFS може впертися в ліміт;
# за потреби викличте sys.setrecursionlimit(...) на старті програми.


def dfs(v: int, par: int) -> bool:  # передаємо вершину та її батьківську вершину
    global cycle_start, cycle_end
    visited[v] = True
    for u in adj[v]:
        if u == par:  # пропускаємо ребро до батьківської вершини
            continue
        if visited[u]:
            cycle_end = v
            cycle_start = u
            return True
        parent[u] = v
        if dfs(u, parent[u]):
            return True
    return False


def find_cycle() -> None:
    global visited, parent, cycle_start
    visited = [False] * n
    parent = [-1] * n
    cycle_start = -1

    for v in range(n):
        if not visited[v] and dfs(v, parent[v]):
            break

    if cycle_start == -1:
        print("Acyclic")
    else:
        cycle = [cycle_start]
        v = cycle_end
        while v != cycle_start:
            cycle.append(v)
            v = parent[v]
        cycle.append(cycle_start)

        print("Cycle found: " + " ".join(map(str, cycle)) + " ")
```

```typescript
let n = 0;
let adj: number[][] = [];
let visited: boolean[] = [];
let parent: number[] = [];
let cycleStart = 0;
let cycleEnd = 0;

function dfs(v: number, par: number): boolean { // передаємо вершину та її батьківську вершину
    visited[v] = true;
    for (const u of adj[v]) {
        if (u === par) continue; // пропускаємо ребро до батьківської вершини
        if (visited[u]) {
            cycleEnd = v;
            cycleStart = u;
            return true;
        }
        parent[u] = v;
        if (dfs(u, parent[u]))
            return true;
    }
    return false;
}

function findCycle(): void {
    visited = new Array(n).fill(false);
    parent = new Array(n).fill(-1);
    cycleStart = -1;

    for (let v = 0; v < n; v++) {
        if (!visited[v] && dfs(v, parent[v]))
            break;
    }

    if (cycleStart === -1) {
        console.log("Acyclic");
    } else {
        const cycle: number[] = [];
        cycle.push(cycleStart);
        for (let v = cycleEnd; v !== cycleStart; v = parent[v])
            cycle.push(v);
        cycle.push(cycleStart);

        console.log("Cycle found: " + cycle.join(" ") + " ");
    }
}
```

```go
var (
	n          int
	adj        [][]int
	visited    []bool
	parent     []int
	cycleStart int
	cycleEnd   int
)

func dfs(v, par int) bool { // передаємо вершину та її батьківську вершину
	visited[v] = true
	for _, u := range adj[v] {
		if u == par { // пропускаємо ребро до батьківської вершини
			continue
		}
		if visited[u] {
			cycleEnd = v
			cycleStart = u
			return true
		}
		parent[u] = v
		if dfs(u, parent[u]) {
			return true
		}
	}
	return false
}

func findCycle() {
	visited = make([]bool, n)
	parent = make([]int, n)
	for i := range parent {
		parent[i] = -1
	}
	cycleStart = -1

	for v := 0; v < n; v++ {
		if !visited[v] && dfs(v, parent[v]) {
			break
		}
	}

	if cycleStart == -1 {
		fmt.Println("Acyclic")
	} else {
		cycle := []int{cycleStart}
		for v := cycleEnd; v != cycleStart; v = parent[v] {
			cycle = append(cycle, v)
		}
		cycle = append(cycle, cycleStart)

		fmt.Print("Cycle found: ")
		for _, v := range cycle {
			fmt.Printf("%d ", v)
		}
		fmt.Println()
	}
}
```

</CodeTabs>

### Задачі для практики: \{#practice-problems}

- [AtCoder : Reachability in Functional Graph](https://atcoder.jp/contests/abc357/tasks/abc357_e)
- [CSES : Round Trip](https://cses.fi/problemset/task/1669)
- [CSES : Round Trip II](https://cses.fi/problemset/task/1678/)

## Відеоматеріали \{#video}

- [Detect Cycle in Directed Graph Algorithm — Tushar Roy](https://www.youtube.com/watch?v=rKQaZuoUR4M) (11 хв, англійською)
