# Максимальний потік — алгоритм Дініца

Алгоритм Дініца розв'язує задачу про максимальний потік за $O(V^2E)$. Задачу про максимальний потік описано в статті [Максимальний потік — Форда-Фалкерсона та Едмондса-Карпа](edmonds_karp.md). Цей алгоритм відкрив Юхим Дініц у 1970 році.

:::tip[Коли підходить цей алгоритм?]
- Задачу можна звести до максимального потоку / мінімального розрізу, а граф великий, щоб виграш від $O(V^2E)$ був відчутним? *(якщо граф малий і потрібна найпростіша реалізація → [Едмондс-Карп](edmonds_karp.md))*
- Це задача про дводольне парування або одиничні пропускні здатності? *(на таких мережах Дініц працює особливо швидко — за $O(E\sqrt{V})$)*
- Потрібен саме максимальний потік без вартостей? *(якщо ребра мають вартість і потрібен потік мінімальної вартості → [Min-cost flow](min_cost_flow.md))*
:::

## Означення \{#definitions}

**Залишкова мережа** $G^R$ мережі $G$ — це мережа, яка містить два ребра для кожного ребра $(v, u)\in G$:<br/>

- $(v, u)$ з пропускною здатністю $c_{vu}^R = c_{vu} - f_{vu}$
- $(u, v)$ з пропускною здатністю $c_{uv}^R = f_{vu}$

**Блокувальний потік** деякої мережі — це такий потік, що кожен шлях зі $s$ до $t$ містить принаймні одне ребро, насичене цим потоком. Зауважимо, що блокувальний потік не обов'язково є максимальним.

**Шарувата мережа** мережі $G$ — це мережа, побудована таким чином. Спершу для кожної вершини $v$ ми обчислюємо $level[v]$ — найкоротший шлях (незважений) зі $s$ до цієї вершини, що використовує лише ребра з додатною пропускною здатністю. Потім ми лишаємо тільки ті ребра $(v, u)$, для яких $level[v] + 1 = level[u]$. Очевидно, що ця мережа є ациклічною.

## Алгоритм \{#algorithm}

Алгоритм складається з кількох фаз. На кожній фазі ми будуємо шарувату мережу залишкової мережі $G$. Потім ми знаходимо довільний блокувальний потік у шаруватій мережі й додаємо його до поточного потоку.

## Доведення коректності \{#proof-of-correctness}

Покажемо, що якщо алгоритм завершується, то він знаходить максимальний потік.

Якщо алгоритм завершився, то він не зміг знайти блокувальний потік у шаруватій мережі. Це означає, що шарувата мережа не має жодного шляху зі $s$ до $t$. Це означає, що залишкова мережа не має жодного шляху зі $s$ до $t$. Це означає, що потік є максимальним.

## Кількість фаз \{#number-of-phases}

Алгоритм завершується менш ніж за $V$ фаз. Щоб це довести, ми спершу маємо довести дві леми.

**Лема 1.** Відстані зі $s$ до кожної вершини не зменшуються після кожної ітерації, тобто $level_{i+1}[v] \ge level_i[v]$.

**Доведення.** Зафіксуймо фазу $i$ і вершину $v$. Розгляньмо будь-який найкоротший шлях $P$ зі $s$ до $v$ у $G_{i+1}^R$. Довжина $P$ дорівнює $level_{i+1}[v]$. Зауважимо, що $G_{i+1}^R$ може містити лише ребра з $G_i^R$ та зворотні ребра для ребер з $G_i^R$. Якщо $P$ не має зворотних ребер для $G_i^R$, то $level_{i+1}[v] \ge level_i[v]$, бо $P$ є також шляхом у $G_i^R$. Тепер припустимо, що $P$ має принаймні одне зворотне ребро. Нехай перше таке ребро — $(u, w)$. Тоді $level_{i+1}[u] \ge level_i[u]$ (через перший випадок). Ребро $(u, w)$ не належить $G_i^R$, тож ребро $(w, u)$ було задіяне блокувальним потоком на попередній ітерації. Це означає, що $level_i[u] = level_i[w] + 1$. Також $level_{i+1}[w] = level_{i+1}[u] + 1$. З цих двох рівностей і $level_{i+1}[u] \ge level_i[u]$ ми отримуємо $level_{i+1}[w] \ge level_i[w] + 2$. Тепер ми можемо використати ту саму ідею для решти шляху.

**Лема 2.** $level_{i+1}[t] > level_i[t]$

**Доведення.** З попередньої леми, $level_{i+1}[t] \ge level_i[t]$. Припустимо, що $level_{i+1}[t] = level_i[t]$. Зауважимо, що $G_{i+1}^R$ може містити лише ребра з $G_i^R$ та зворотні ребра для ребер з $G_i^R$. Це означає, що в $G_i^R$ є найкоротший шлях, який не був заблокований блокувальним потоком. Це суперечність.

З цих двох лем ми робимо висновок, що фаз менше ніж $V$, бо $level[t]$ зростає, але не може бути більшим за $V - 1$.

## Знаходження блокувального потоку \{#finding-blocking-flow}

Щоб знайти блокувальний потік на кожній ітерації, ми можемо просто намагатися проштовхувати потік за допомогою DFS зі $s$ до $t$ у шаруватій мережі, поки його можна проштовхувати. Щоб робити це швидше, ми маємо вилучати ребра, які вже не можна використати для проштовхування. Для цього ми можемо зберігати в кожній вершині вказівник, який вказує на наступне ребро, яке можна використати.

Один запуск DFS займає $O(k+V)$ часу, де $k$ — кількість просувань вказівника на цьому запуску. Підсумовуючи по всіх запусках, кількість просувань вказівника не може перевищити $E$. З іншого боку, загальна кількість запусків не перевищить $E$, бо кожен запуск насичує принаймні одне ребро. У такий спосіб загальний час роботи знаходження блокувального потоку становить $O(VE)$.

## Складність \{#complexity}

Фаз менше ніж $V$, тож загальна складність дорівнює $O(V^2E)$.

## Одиничні мережі \{#unit-networks}

**Одинична мережа** — це мережа, у якій для будь-якої вершини, окрім $s$ і $t$, **або вхідне, або вихідне ребро є єдиним і має одиничну пропускну здатність**. Це саме той випадок із мережею, яку ми будуємо для розв'язання задачі про максимальне парування за допомогою потоків.

На одиничних мережах алгоритм Дініца працює за $O(E\sqrt{V})$. Доведемо це.

По-перше, кожна фаза тепер працює за $O(E)$, бо кожне ребро буде розглянуте щонайбільше один раз.

По-друге, припустимо, що вже відбулося $\sqrt{V}$ фаз. Тоді всі доповнювальні шляхи завдовжки $\le\sqrt{V}$ було знайдено. Нехай $f$ — поточний потік, $f'$ — максимальний потік. Розгляньмо їхню різницю $f' - f$. Це потік у $G^R$ величини $|f'| - |f|$, і на кожному ребрі він дорівнює або $0$, або $1$. Його можна розкласти на $|f'| - |f|$ шляхів зі $s$ до $t$ і, можливо, цикли. Оскільки мережа одинична, вони не можуть мати спільних вершин, тож загальна кількість вершин $\ge (|f'| - |f|)\sqrt{V}$, але вона також $\le V$, тож ще за $\sqrt{V}$ ітерацій ми точно знайдемо максимальний потік.

### Мережі з одиничними пропускними здатностями \{#unit-capacities-networks}

У загальнішому випадку, коли всі ребра мають одиничні пропускні здатності, _але кількість вхідних і вихідних ребер не обмежена_, шляхи не можуть мати спільних ребер, а не спільних вершин. У схожий спосіб це дозволяє довести оцінку $\sqrt E$ на кількість ітерацій, тож час роботи алгоритму Дініца на таких мережах становить щонайбільше $O(E \sqrt E)$.

Нарешті, також можна довести, що кількість фаз на мережах з одиничними пропускними здатностями не перевищує $O(V^{2/3})$, що дає альтернативну оцінку $O(EV^{2/3})$ на мережах з особливо великою кількістю ребер.

## Реалізація \{#implementation}

<CodeTabs>

```cpp
struct FlowEdge {
    int v, u;
    long long cap, flow = 0;
    FlowEdge(int v, int u, long long cap) : v(v), u(u), cap(cap) {}
};

struct Dinic {
    const long long flow_inf = 1e18;
    vector<FlowEdge> edges;
    vector<vector<int>> adj;
    int n, m = 0;
    int s, t;
    vector<int> level, ptr;
    queue<int> q;

    Dinic(int n, int s, int t) : n(n), s(s), t(t) {
        adj.resize(n);
        level.resize(n);
        ptr.resize(n);
    }

    void add_edge(int v, int u, long long cap) {
        edges.emplace_back(v, u, cap);
        edges.emplace_back(u, v, 0);
        adj[v].push_back(m);
        adj[u].push_back(m + 1);
        m += 2;
    }

    bool bfs() {
        while (!q.empty()) {
            int v = q.front();
            q.pop();
            for (int id : adj[v]) {
                if (edges[id].cap == edges[id].flow)
                    continue;
                if (level[edges[id].u] != -1)
                    continue;
                level[edges[id].u] = level[v] + 1;
                q.push(edges[id].u);
            }
        }
        return level[t] != -1;
    }

    long long dfs(int v, long long pushed) {
        if (pushed == 0)
            return 0;
        if (v == t)
            return pushed;
        for (int& cid = ptr[v]; cid < (int)adj[v].size(); cid++) {
            int id = adj[v][cid];
            int u = edges[id].u;
            if (level[v] + 1 != level[u])
                continue;
            long long tr = dfs(u, min(pushed, edges[id].cap - edges[id].flow));
            if (tr == 0)
                continue;
            edges[id].flow += tr;
            edges[id ^ 1].flow -= tr;
            return tr;
        }
        return 0;
    }

    long long flow() {
        long long f = 0;
        while (true) {
            fill(level.begin(), level.end(), -1);
            level[s] = 0;
            q.push(s);
            if (!bfs())
                break;
            fill(ptr.begin(), ptr.end(), 0);
            while (long long pushed = dfs(s, flow_inf)) {
                f += pushed;
            }
        }
        return f;
    }
};
```

```python
from collections import deque


class FlowEdge:
    def __init__(self, v: int, u: int, cap: int):
        self.v = v
        self.u = u
        self.cap = cap
        self.flow = 0


class Dinic:
    FLOW_INF = 10 ** 18

    def __init__(self, n: int, s: int, t: int):
        self.n = n
        self.s = s
        self.t = t
        self.edges: list[FlowEdge] = []
        self.adj: list[list[int]] = [[] for _ in range(n)]
        self.level = [0] * n
        self.ptr = [0] * n

    def add_edge(self, v: int, u: int, cap: int) -> None:
        # Пряме ребро та зворотне з нульовою пропускною здатністю;
        # парні індекси — прямі, непарні — зворотні (id ^ 1)
        self.adj[v].append(len(self.edges))
        self.edges.append(FlowEdge(v, u, cap))
        self.adj[u].append(len(self.edges))
        self.edges.append(FlowEdge(u, v, 0))

    def bfs(self) -> bool:
        # Будуємо рівні (шарувату мережу) лише по ненасичених ребрах
        q = deque([self.s])
        while q:
            v = q.popleft()
            for eid in self.adj[v]:
                e = self.edges[eid]
                if e.cap == e.flow:
                    continue
                if self.level[e.u] != -1:
                    continue
                self.level[e.u] = self.level[v] + 1
                q.append(e.u)
        return self.level[self.t] != -1

    def dfs(self, v: int, pushed: int) -> int:
        if pushed == 0:
            return 0
        if v == self.t:
            return pushed
        # ptr[v] пропускає вже вичерпані ребра в цій фазі
        while self.ptr[v] < len(self.adj[v]):
            eid = self.adj[v][self.ptr[v]]
            e = self.edges[eid]
            u = e.u
            if self.level[v] + 1 != self.level[u]:
                self.ptr[v] += 1
                continue
            tr = self.dfs(u, min(pushed, e.cap - e.flow))
            if tr == 0:
                self.ptr[v] += 1
                continue
            self.edges[eid].flow += tr
            self.edges[eid ^ 1].flow -= tr
            return tr
        return 0

    def flow(self) -> int:
        f = 0
        while True:
            self.level = [-1] * self.n
            self.level[self.s] = 0
            if not self.bfs():
                break
            self.ptr = [0] * self.n
            while True:
                pushed = self.dfs(self.s, self.FLOW_INF)
                if pushed == 0:
                    break
                f += pushed
        return f
```

```typescript
class FlowEdge {
  v: number;
  u: number;
  cap: number;
  flow = 0;
  constructor(v: number, u: number, cap: number) {
    this.v = v;
    this.u = u;
    this.cap = cap;
  }
}

class Dinic {
  // Використовуємо BigInt, щоб уникнути переповнення на великих потоках
  static readonly FLOW_INF = 10n ** 18n;
  n: number;
  s: number;
  t: number;
  edges: FlowEdge[] = [];
  adj: number[][];
  level: number[];
  ptr: number[];

  constructor(n: number, s: number, t: number) {
    this.n = n;
    this.s = s;
    this.t = t;
    this.adj = Array.from({ length: n }, () => []);
    this.level = new Array(n).fill(0);
    this.ptr = new Array(n).fill(0);
  }

  addEdge(v: number, u: number, cap: bigint): void {
    // Парні індекси — прямі ребра, непарні — зворотні (id ^ 1)
    this.adj[v].push(this.edges.length);
    this.edges.push(new FlowEdge(v, u, Number(cap)));
    this.adj[u].push(this.edges.length);
    this.edges.push(new FlowEdge(u, v, 0));
  }

  bfs(): boolean {
    // Будуємо рівні (шарувату мережу) лише по ненасичених ребрах
    const q: number[] = [this.s];
    let head = 0;
    while (head < q.length) {
      const v = q[head++];
      for (const eid of this.adj[v]) {
        const e = this.edges[eid];
        if (e.cap === e.flow) continue;
        if (this.level[e.u] !== -1) continue;
        this.level[e.u] = this.level[v] + 1;
        q.push(e.u);
      }
    }
    return this.level[this.t] !== -1;
  }

  dfs(v: number, pushed: number): number {
    if (pushed === 0) return 0;
    if (v === this.t) return pushed;
    // ptr[v] пропускає вже вичерпані ребра в цій фазі
    while (this.ptr[v] < this.adj[v].length) {
      const eid = this.adj[v][this.ptr[v]];
      const e = this.edges[eid];
      const u = e.u;
      if (this.level[v] + 1 !== this.level[u]) {
        this.ptr[v]++;
        continue;
      }
      const tr = this.dfs(u, Math.min(pushed, e.cap - e.flow));
      if (tr === 0) {
        this.ptr[v]++;
        continue;
      }
      this.edges[eid].flow += tr;
      this.edges[eid ^ 1].flow -= tr;
      return tr;
    }
    return 0;
  }

  flow(): number {
    let f = 0;
    while (true) {
      this.level.fill(-1);
      this.level[this.s] = 0;
      if (!this.bfs()) break;
      this.ptr.fill(0);
      while (true) {
        const pushed = this.dfs(this.s, Number(Dinic.FLOW_INF));
        if (pushed === 0) break;
        f += pushed;
      }
    }
    return f;
  }
}
```

```go
const flowInf int64 = 1e18

type FlowEdge struct {
	v, u      int
	cap, flow int64
}

type Dinic struct {
	edges       []FlowEdge
	adj         [][]int
	n, s, t     int
	level, ptr  []int
}

func NewDinic(n, s, t int) *Dinic {
	return &Dinic{
		adj:   make([][]int, n),
		n:     n,
		s:     s,
		t:     t,
		level: make([]int, n),
		ptr:   make([]int, n),
	}
}

func (d *Dinic) AddEdge(v, u int, cap int64) {
	// Парні індекси — прямі ребра, непарні — зворотні (id ^ 1)
	d.adj[v] = append(d.adj[v], len(d.edges))
	d.edges = append(d.edges, FlowEdge{v: v, u: u, cap: cap})
	d.adj[u] = append(d.adj[u], len(d.edges))
	d.edges = append(d.edges, FlowEdge{v: u, u: v, cap: 0})
}

func (d *Dinic) bfs() bool {
	// Будуємо рівні (шарувату мережу) лише по ненасичених ребрах
	q := []int{d.s}
	for len(q) > 0 {
		v := q[0]
		q = q[1:]
		for _, id := range d.adj[v] {
			e := d.edges[id]
			if e.cap == e.flow {
				continue
			}
			if d.level[e.u] != -1 {
				continue
			}
			d.level[e.u] = d.level[v] + 1
			q = append(q, e.u)
		}
	}
	return d.level[d.t] != -1
}

func (d *Dinic) dfs(v int, pushed int64) int64 {
	if pushed == 0 {
		return 0
	}
	if v == d.t {
		return pushed
	}
	// ptr[v] пропускає вже вичерпані ребра в цій фазі
	for ; d.ptr[v] < len(d.adj[v]); d.ptr[v]++ {
		id := d.adj[v][d.ptr[v]]
		u := d.edges[id].u
		if d.level[v]+1 != d.level[u] {
			continue
		}
		tr := d.dfs(u, min64(pushed, d.edges[id].cap-d.edges[id].flow))
		if tr == 0 {
			continue
		}
		d.edges[id].flow += tr
		d.edges[id^1].flow -= tr
		return tr
	}
	return 0
}

func (d *Dinic) Flow() int64 {
	var f int64 = 0
	for {
		for i := range d.level {
			d.level[i] = -1
		}
		d.level[d.s] = 0
		if !d.bfs() {
			break
		}
		for i := range d.ptr {
			d.ptr[i] = 0
		}
		for {
			pushed := d.dfs(d.s, flowInf)
			if pushed == 0 {
				break
			}
			f += pushed
		}
	}
	return f
}

func min64(a, b int64) int64 {
	if a < b {
		return a
	}
	return b
}
```

</CodeTabs>

## Задачі для практики \{#practice-problems}

* [SPOJ: FASTFLOW](https://www.spoj.com/problems/FASTFLOW/)

## Відеоматеріали \{#video}

<YouTubeEmbed id="M6cm8UeeziI" title="Dinic's Algorithm | Network Flow | Graph Theory — WilliamFiset" />
