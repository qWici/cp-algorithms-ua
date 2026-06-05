# Потік мінімальної вартості — алгоритм послідовних найкоротших шляхів

Задано мережу $G$, що складається з $n$ вершин і $m$ ребер.
Для кожного ребра (взагалі кажучи, орієнтованого, але див. нижче) задано пропускну здатність (невід'ємне ціле число) і вартість одиниці потоку вздовж цього ребра (деяке ціле число).
Також позначено витік $s$ та стік $t$.

Для заданого значення $K$ нам потрібно знайти потік цієї величини, і серед усіх потоків цієї величини обрати потік найменшої вартості.
Ця задача називається **задачею про потік мінімальної вартості**.

Інколи задачу ставлять трохи інакше:
потрібно знайти максимальний потік, і серед усіх максимальних потоків знайти той, що має найменшу вартість.
Це називається **задачею про максимальний потік мінімальної вартості**.

Обидві ці задачі ефективно розв'язуються алгоритмом послідовних найкоротших шляхів.

## Алгоритм \{#algorithm}

Цей алгоритм дуже схожий на [Едмондса-Карпа](edmonds_karp.md) для обчислення максимального потоку.

### Найпростіший випадок \{#simplest-case}

Спочатку розглянемо лише найпростіший випадок, коли граф орієнтований і між будь-якою парою вершин є щонайбільше одне ребро (наприклад, якщо $(i, j)$ є ребром графа, то $(j, i)$ не може також бути його частиною).

Нехай $U_{i j}$ — пропускна здатність ребра $(i, j)$, якщо це ребро існує.
А $C_{i j}$ — вартість одиниці потоку вздовж цього ребра $(i, j)$.
І нарешті, нехай $F_{i, j}$ — потік вздовж ребра $(i, j)$.
Спочатку всі значення потоку дорівнюють нулю.

Ми **модифікуємо** мережу так:
для кожного ребра $(i, j)$ додаємо до мережі **обернене ребро** $(j, i)$ з пропускною здатністю $U_{j i} = 0$ і вартістю $C_{j i} = -C_{i j}$.
Оскільки, згідно з нашими обмеженнями, ребра $(j, i)$ раніше не було в мережі, то ми все ще маємо мережу, що не є мультиграфом (графом із кратними ребрами).
Крім того, протягом усіх кроків алгоритму ми завжди підтримуватимемо умову $F_{j i} = -F_{i j}$.

Ми визначаємо **остаточну мережу** для деякого фіксованого потоку $F$ так (як і в алгоритмі Форда-Фалкерсона):
остаточна мережа містить лише ненасичені ребра (тобто ребра, в яких $F_{i j} < U_{i j}$), а остаточна пропускна здатність кожного такого ребра дорівнює $R_{i j} = U_{i j} - F_{i j}$.

Тепер ми можемо поговорити про **алгоритми** обчислення потоку мінімальної вартості.
На кожній ітерації алгоритму ми знаходимо найкоротший шлях в остаточному графі від $s$ до $t$.
На відміну від Едмондса-Карпа, ми шукаємо найкоротший шлях у термінах вартості шляху, а не кількості ребер.
Якщо шляху більше не існує, то алгоритм завершується, і потік $F$ є шуканим.
Якщо шлях знайдено, ми збільшуємо потік уздовж нього настільки, наскільки це можливо (тобто знаходимо мінімальну остаточну пропускну здатність $R$ шляху, збільшуємо потік на неї та зменшуємо обернені ребра на ту саму величину).
Якщо в якийсь момент потік досягає значення $K$, то ми зупиняємо алгоритм (зауважимо, що на останній ітерації алгоритму потрібно збільшити потік лише на таку величину, щоб підсумкове значення потоку не перевищило $K$).

Неважко бачити, що якщо ми покладемо $K$ рівним нескінченності, то алгоритм знайде максимальний потік мінімальної вартості.
Тож обидва варіанти задачі можна розв'язати тим самим алгоритмом.

### Неорієнтовані графи / мультиграфи \{#undirected-graphs-multigraphs}

Випадок неорієнтованого графа чи мультиграфа концептуально не відрізняється від алгоритму вище.
Алгоритм працюватиме і на цих графах.
Однак реалізувати його стає трохи складніше.

**Неорієнтоване ребро** $(i, j)$ насправді те саме, що й два орієнтовані ребра $(i, j)$ та $(j, i)$ з однаковою пропускною здатністю та значеннями.
Оскільки описаний вище алгоритм потоку мінімальної вартості породжує обернене ребро для кожного орієнтованого ребра, він розщеплює неорієнтоване ребро на $4$ орієнтовані ребра, і ми фактично отримуємо **мультиграф**.

Як нам впоратися з **кратними ребрами**?
По-перше, потік для кожного з кратних ребер потрібно зберігати окремо.
По-друге, під час пошуку найкоротшого шляху необхідно враховувати, що важливо, яке саме з кратних ребер використовується у шляху.
Тож замість звичайного масиву предків ми додатково маємо зберігати разом із предком номер ребра, з якого ми прийшли.
По-третє, оскільки потік уздовж певного ребра збільшується, необхідно зменшити потік уздовж оберненого ребра.
Оскільки в нас є кратні ребра, ми маємо зберігати для кожного ребра номер його оберненого ребра.

Інших перешкод з неорієнтованими графами чи мультиграфами немає.

### Складність \{#complexity}

Цей алгоритм загалом експоненційний за розміром входу. Точніше, у найгіршому випадку він може проштовхувати лише $1$ одиницю потоку на кожній ітерації, потребуючи $O(F)$ ітерацій, щоб знайти потік мінімальної вартості розміру $F$, що дає загальний час роботи $O(F \cdot T)$, де $T$ — час, потрібний для знаходження найкоротшого шляху від витоку до стоку.

Якщо для цього використовується алгоритм [Беллмана-Форда](bellman_ford.md), то час роботи становить $O(F mn)$. Також можна модифікувати [алгоритм Дейкстри](dijkstra.md) так, щоб він потребував $O(nm)$ попередньої обробки як початкового кроку і потім працював за $O(m \log n)$ на ітерацію, що дає загальний час роботи $O(mn + F m \log n)$. [Тут](http://web.archive.org/web/20211009144446/https://min-25.hatenablog.com/entry/2018/03/19/235802) наведено генератор графа, на якому такий алгоритм потребуватиме $O(2^{n/2} n^2 \log n)$ часу.

Модифікований алгоритм Дейкстри використовує так звані потенціали з [алгоритму Джонсона](https://en.wikipedia.org/wiki/Johnson%27s_algorithm). Можна поєднати ідеї цього алгоритму та алгоритму Дініца, щоб зменшити кількість ітерацій з $F$ до $\min(F, nC)$, де $C$ — максимальна вартість серед ребер. Більше про потенціали та їх поєднання з алгоритмом Дініца можна прочитати [тут](https://codeforces.com/blog/entry/105658).

## Реалізація \{#implementation}

Ось реалізація з використанням [алгоритму SPFA](bellman_ford.md) для найпростішого випадку.

<CodeTabs>

```cpp
struct Edge
{
    int from, to, capacity, cost;
};

vector<vector<int>> adj, cost, capacity;

const int INF = 1e9;

void shortest_paths(int n, int v0, vector<int>& d, vector<int>& p) {
    d.assign(n, INF);
    d[v0] = 0;
    vector<bool> inq(n, false);
    queue<int> q;
    q.push(v0);
    p.assign(n, -1);

    while (!q.empty()) {
        int u = q.front();
        q.pop();
        inq[u] = false;
        for (int v : adj[u]) {
            if (capacity[u][v] > 0 && d[v] > d[u] + cost[u][v]) {
                d[v] = d[u] + cost[u][v];
                p[v] = u;
                if (!inq[v]) {
                    inq[v] = true;
                    q.push(v);
                }
            }
        }
    }
}

int min_cost_flow(int N, vector<Edge> edges, int K, int s, int t) {
    adj.assign(N, vector<int>());
    cost.assign(N, vector<int>(N, 0));
    capacity.assign(N, vector<int>(N, 0));
    for (Edge e : edges) {
        adj[e.from].push_back(e.to);
        adj[e.to].push_back(e.from);
        cost[e.from][e.to] = e.cost;
        cost[e.to][e.from] = -e.cost;
        capacity[e.from][e.to] = e.capacity;
    }

    int flow = 0;
    int cost = 0;
    vector<int> d, p;
    while (flow < K) {
        shortest_paths(N, s, d, p);
        if (d[t] == INF)
            break;
        
        // знаходимо максимальний потік на цьому шляху
        int f = K - flow;
        int cur = t;
        while (cur != s) {
            f = min(f, capacity[p[cur]][cur]);
            cur = p[cur];
        }

        // застосовуємо потік
        flow += f;
        cost += f * d[t];
        cur = t;
        while (cur != s) {
            capacity[p[cur]][cur] -= f;
            capacity[cur][p[cur]] += f;
            cur = p[cur];
        }
    }

    if (flow < K)
        return -1;
    else
        return cost;
}
```

```python
from collections import deque

INF = 10**9


def shortest_paths(n, adj, capacity, cost, v0):
    # SPFA: найкоротші шляхи за вартістю в остаточній мережі
    d = [INF] * n
    d[v0] = 0
    inq = [False] * n
    q = deque([v0])
    p = [-1] * n

    while q:
        u = q.popleft()
        inq[u] = False
        for v in adj[u]:
            if capacity[u][v] > 0 and d[v] > d[u] + cost[u][v]:
                d[v] = d[u] + cost[u][v]
                p[v] = u
                if not inq[v]:
                    inq[v] = True
                    q.append(v)
    return d, p


def min_cost_flow(N, edges, K, s, t):
    # edges — список кортежів (from, to, capacity, cost)
    adj = [[] for _ in range(N)]
    cost = [[0] * N for _ in range(N)]
    capacity = [[0] * N for _ in range(N)]
    for frm, to, cap, cst in edges:
        adj[frm].append(to)
        adj[to].append(frm)
        cost[frm][to] = cst
        cost[to][frm] = -cst
        capacity[frm][to] = cap

    flow = 0
    total_cost = 0
    while flow < K:
        d, p = shortest_paths(N, adj, capacity, cost, s)
        if d[t] == INF:
            break

        # знаходимо максимальний потік на цьому шляху
        f = K - flow
        cur = t
        while cur != s:
            f = min(f, capacity[p[cur]][cur])
            cur = p[cur]

        # застосовуємо потік
        flow += f
        total_cost += f * d[t]
        cur = t
        while cur != s:
            capacity[p[cur]][cur] -= f
            capacity[cur][p[cur]] += f
            cur = p[cur]

    if flow < K:
        return -1
    return total_cost
```

```typescript
const INF = 1e9;

interface Edge {
  from: number;
  to: number;
  capacity: number;
  cost: number;
}

function shortestPaths(
  n: number,
  adj: number[][],
  capacity: number[][],
  cost: number[][],
  v0: number,
): { d: number[]; p: number[] } {
  // SPFA: найкоротші шляхи за вартістю в остаточній мережі
  const d = new Array<number>(n).fill(INF);
  d[v0] = 0;
  const inq = new Array<boolean>(n).fill(false);
  const p = new Array<number>(n).fill(-1);
  const q: number[] = [v0];
  let head = 0;

  while (head < q.length) {
    const u = q[head++];
    inq[u] = false;
    for (const v of adj[u]) {
      if (capacity[u][v] > 0 && d[v] > d[u] + cost[u][v]) {
        d[v] = d[u] + cost[u][v];
        p[v] = u;
        if (!inq[v]) {
          inq[v] = true;
          q.push(v);
        }
      }
    }
  }
  return { d, p };
}

function minCostFlow(
  N: number,
  edges: Edge[],
  K: number,
  s: number,
  t: number,
): number {
  const adj: number[][] = Array.from({ length: N }, () => []);
  const cost: number[][] = Array.from({ length: N }, () => new Array<number>(N).fill(0));
  const capacity: number[][] = Array.from({ length: N }, () => new Array<number>(N).fill(0));
  for (const e of edges) {
    adj[e.from].push(e.to);
    adj[e.to].push(e.from);
    cost[e.from][e.to] = e.cost;
    cost[e.to][e.from] = -e.cost;
    capacity[e.from][e.to] = e.capacity;
  }

  let flow = 0;
  let totalCost = 0;
  while (flow < K) {
    const { d, p } = shortestPaths(N, adj, capacity, cost, s);
    if (d[t] === INF) break;

    // знаходимо максимальний потік на цьому шляху
    let f = K - flow;
    let cur = t;
    while (cur !== s) {
      f = Math.min(f, capacity[p[cur]][cur]);
      cur = p[cur];
    }

    // застосовуємо потік
    flow += f;
    totalCost += f * d[t];
    cur = t;
    while (cur !== s) {
      capacity[p[cur]][cur] -= f;
      capacity[cur][p[cur]] += f;
      cur = p[cur];
    }
  }

  return flow < K ? -1 : totalCost;
}
```

```go
const inf = 1e9

type Edge struct {
	from, to, capacity, cost int
}

func shortestPaths(n int, adj [][]int, capacity, cost [][]int, v0 int) ([]int, []int) {
	// SPFA: найкоротші шляхи за вартістю в остаточній мережі
	d := make([]int, n)
	p := make([]int, n)
	inq := make([]bool, n)
	for i := range d {
		d[i] = inf
		p[i] = -1
	}
	d[v0] = 0
	q := []int{v0}

	for len(q) > 0 {
		u := q[0]
		q = q[1:]
		inq[u] = false
		for _, v := range adj[u] {
			if capacity[u][v] > 0 && d[v] > d[u]+cost[u][v] {
				d[v] = d[u] + cost[u][v]
				p[v] = u
				if !inq[v] {
					inq[v] = true
					q = append(q, v)
				}
			}
		}
	}
	return d, p
}

func minCostFlow(N int, edges []Edge, K, s, t int) int {
	adj := make([][]int, N)
	cost := make([][]int, N)
	capacity := make([][]int, N)
	for i := 0; i < N; i++ {
		cost[i] = make([]int, N)
		capacity[i] = make([]int, N)
	}
	for _, e := range edges {
		adj[e.from] = append(adj[e.from], e.to)
		adj[e.to] = append(adj[e.to], e.from)
		cost[e.from][e.to] = e.cost
		cost[e.to][e.from] = -e.cost
		capacity[e.from][e.to] = e.capacity
	}

	flow := 0
	totalCost := 0
	for flow < K {
		d, p := shortestPaths(N, adj, capacity, cost, s)
		if d[t] == inf {
			break
		}

		// знаходимо максимальний потік на цьому шляху
		f := K - flow
		for cur := t; cur != s; cur = p[cur] {
			if capacity[p[cur]][cur] < f {
				f = capacity[p[cur]][cur]
			}
		}

		// застосовуємо потік
		flow += f
		totalCost += f * d[t]
		for cur := t; cur != s; cur = p[cur] {
			capacity[p[cur]][cur] -= f
			capacity[cur][p[cur]] += f
		}
	}

	if flow < K {
		return -1
	}
	return totalCost
}
```

</CodeTabs>

## Задачі для практики \{#practice-problems}

* [CSES - Task Assignment](https://cses.fi/problemset/task/2129)
* [CSES - Grid Puzzle II](https://cses.fi/problemset/task/2131)
* [AtCoder - Dream Team](https://atcoder.jp/contests/abc247/tasks/abc247_g)

## Відеоматеріали \{#video}

<YouTubeEmbed id="0tjpC0MCwY8" title="CSE 550 (2022, Fall): 3.6 The Minimum-Cost-Flow Problem — Joshua J. Daymude" />
