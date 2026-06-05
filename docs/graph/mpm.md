# Максимальний потік — алгоритм MPM

Алгоритм MPM (Malhotra, Pramodh-Kumar and Maheshwari) розв'язує задачу про максимальний потік за $O(V^3)$. Цей алгоритм схожий на [алгоритм Дініца](dinic.md).

:::tip[Коли підходить цей алгоритм?]
- Потрібен **максимальний потік** у **щільному** графі, де $V^3$ вигідніше за оцінку Дініца $O(V^2 E)$? *(у загальному випадку зазвичай простіше брати [Дініц](dinic.md))*
- Граф **без вартостей** на ребрах (інакше це задача про потік мінімальної вартості → [потік мінімальної вартості](min_cost_flow.md))?
:::

## Алгоритм \{#algorithm}

Подібно до алгоритму Дініца, MPM працює фазами, і протягом кожної фази ми знаходимо блокуючий потік у шаруватій мережі залишкової мережі графа $G$.
Головна відмінність від Дініца — у тому, як ми знаходимо блокуючий потік.
Розгляньмо шаруватую мережу $L$.
Для кожної вершини означимо її _вхідний потенціал_ та _вихідний потенціал_ так:

$$
\begin{align}
p_{in}(v) &= \sum\limits_{(u, v)\in L}(c(u, v) - f(u, v)) \\\\
p_{out}(v) &= \sum\limits_{(v, u)\in L}(c(v, u) - f(v, u))
\end{align}
$$

Також покладемо $p_{in}(s) = p_{out}(t) = \infty$.
Маючи $p_{in}$ та $p_{out}$, означимо _потенціал_ як $p(v) = min(p_{in}(v), p_{out}(v))$.
Вершину $r$ називаємо _опорною вершиною_, якщо $p(r) = min\{p(v)\}$.
Розгляньмо опорну вершину $r$.
Стверджуємо, що потік можна збільшити на $p(r)$ так, щоб $p(r)$ стало рівним $0$.
Це справедливо, бо $L$ ациклічна, тож ми можемо проштовхнути потік із $r$ вихідними ребрами, і він досягне $t$, оскільки кожна вершина має достатній вихідний потенціал, щоб проштовхнути потік далі, коли він до неї дійде.
Аналогічно ми можемо притягнути потік із $s$.
Побудова блокуючого потоку ґрунтується на цьому факті.
На кожній ітерації ми знаходимо опорну вершину і проштовхуємо потік від $s$ до $t$ через $r$.
Цей процес можна змоделювати за допомогою BFS.
Усі повністю насичені дуги можна видалити з $L$, оскільки вони все одно не використовуватимуться далі в цій фазі.
Так само можна видалити всі вершини, відмінні від $s$ та $t$, у яких немає вихідних або вхідних дуг.

Кожна фаза працює за $O(V^2)$, бо є щонайбільше $V$ ітерацій (адже принаймні обрана опорна вершина видаляється), і на кожній ітерації ми видаляємо всі ребра, через які пройшли, окрім щонайбільше $V$.
Підсумовуючи, отримуємо $O(V^2 + E) = O(V^2)$.
Оскільки фаз менш ніж $V$ (див. доведення [тут](dinic.md)), MPM працює загалом за $O(V^3)$.

## Реалізація \{#implementation}

<CodeTabs>

```cpp
struct MPM{
    struct FlowEdge{
        int v, u;
        long long cap, flow;
        FlowEdge(){}
        FlowEdge(int _v, int _u, long long _cap, long long _flow)
            : v(_v), u(_u), cap(_cap), flow(_flow){}
        FlowEdge(int _v, int _u, long long _cap)
            : v(_v), u(_u), cap(_cap), flow(0ll){}
    };
    const long long flow_inf = 1e18;
    vector<FlowEdge> edges;
    vector<char> alive;
    vector<long long> pin, pout;
    vector<list<int> > in, out;
    vector<vector<int> > adj;
    vector<long long> ex;
    int n, m = 0;
    int s, t;
    vector<int> level;
    vector<int> q;
    int qh, qt;
    void resize(int _n){
        n = _n;
        ex.resize(n);
        q.resize(n);
        pin.resize(n);
        pout.resize(n);
        adj.resize(n);
        level.resize(n);
        in.resize(n);
        out.resize(n);
    }
    MPM(){}
    MPM(int _n, int _s, int _t){resize(_n); s = _s; t = _t;}
    void add_edge(int v, int u, long long cap){
        edges.push_back(FlowEdge(v, u, cap));
        edges.push_back(FlowEdge(u, v, 0));
        adj[v].push_back(m);
        adj[u].push_back(m + 1);
        m += 2;
    }
    bool bfs(){
        while(qh < qt){
            int v = q[qh++];
            for(int id : adj[v]){
                if(edges[id].cap - edges[id].flow < 1)continue;
                if(level[edges[id].u] != -1)continue;
                level[edges[id].u] = level[v] + 1;
                q[qt++] = edges[id].u;
            }
        }
        return level[t] != -1;
    }
    long long pot(int v){
        return min(pin[v], pout[v]);
    }
    void remove_node(int v){
        for(int i : in[v]){
            int u = edges[i].v;
            auto it = find(out[u].begin(), out[u].end(), i);
            out[u].erase(it);
            pout[u] -= edges[i].cap - edges[i].flow;
        }
        for(int i : out[v]){
            int u = edges[i].u;
            auto it = find(in[u].begin(), in[u].end(), i);
            in[u].erase(it);
            pin[u] -= edges[i].cap - edges[i].flow;
        }
    }
    void push(int from, int to, long long f, bool forw){
        qh = qt = 0;
        ex.assign(n, 0);
        ex[from] = f;
        q[qt++] = from;
        while(qh < qt){
            int v = q[qh++];
            if(v == to)
                break;
            long long must = ex[v];
            auto it = forw ? out[v].begin() : in[v].begin();
            while(true){
                int u = forw ? edges[*it].u : edges[*it].v;
                long long pushed = min(must, edges[*it].cap - edges[*it].flow);
                if(pushed == 0)break;
                if(forw){
                    pout[v] -= pushed;
                    pin[u] -= pushed;
                }
                else{
                    pin[v] -= pushed;
                    pout[u] -= pushed;
                }
                if(ex[u] == 0)
                    q[qt++] = u;
                ex[u] += pushed;
                edges[*it].flow += pushed;
                edges[(*it)^1].flow -= pushed;
                must -= pushed;
                if(edges[*it].cap - edges[*it].flow == 0){
                    auto jt = it;
                    ++jt;
                    if(forw){
                        in[u].erase(find(in[u].begin(), in[u].end(), *it));
                        out[v].erase(it);
                    }
                    else{
                        out[u].erase(find(out[u].begin(), out[u].end(), *it));
                        in[v].erase(it);
                    }
                    it = jt;
                }
                else break;
                if(!must)break;
            }
        }
    }
    long long flow(){
        long long ans = 0;
        while(true){
            pin.assign(n, 0);
            pout.assign(n, 0);
            level.assign(n, -1);
            alive.assign(n, true);
            level[s] = 0;
            qh = 0; qt = 1;
            q[0] = s;
            if(!bfs())
                break;
            for(int i = 0; i < n; i++){
                out[i].clear();
                in[i].clear();
            }
            for(int i = 0; i < m; i++){
                if(edges[i].cap - edges[i].flow == 0)
                    continue;
                int v = edges[i].v, u = edges[i].u;
                if(level[v] + 1 == level[u] && (level[u] < level[t] || u == t)){
                    in[u].push_back(i);
                    out[v].push_back(i);
                    pin[u] += edges[i].cap - edges[i].flow;
                    pout[v] += edges[i].cap - edges[i].flow;
                }
            }
            pin[s] = pout[t] = flow_inf;
            while(true){
                int v = -1;
                for(int i = 0; i < n; i++){
                    if(!alive[i])continue;
                    if(v == -1 || pot(i) < pot(v))
                        v = i;
                }
                if(v == -1)
                    break;
                if(pot(v) == 0){
                    alive[v] = false;
                    remove_node(v);
                    continue;
                }
                long long f = pot(v);
                ans += f;
                push(v, s, f, false);
                push(v, t, f, true);
                alive[v] = false;
                remove_node(v);
            }
        }
        return ans;
    }
};
```

```python
from collections import deque


class MPM:
    # Ребро потоку: v -> u, пропускна здатність cap, поточний потік flow
    class FlowEdge:
        __slots__ = ("v", "u", "cap", "flow")

        def __init__(self, v, u, cap, flow=0):
            self.v = v
            self.u = u
            self.cap = cap
            self.flow = flow

    def __init__(self, n, s, t):
        self.flow_inf = 10 ** 18
        self.n = n
        self.s = s
        self.t = t
        self.m = 0
        self.edges = []                      # список ребер (парні/непарні — пряме/зворотне)
        self.adj = [[] for _ in range(n)]    # списки суміжності за id ребер
        # in/out — списки id ребер шаруватої мережі; C++ list<int> -> deque
        self.in_ = [deque() for _ in range(n)]
        self.out = [deque() for _ in range(n)]
        self.pin = [0] * n                   # вхідний потенціал
        self.pout = [0] * n                  # вихідний потенціал
        self.level = [-1] * n
        self.alive = [True] * n
        self.ex = [0] * n                    # надлишок під час проштовхування
        self.q = []                          # черга BFS

    def add_edge(self, v, u, cap):
        self.edges.append(MPM.FlowEdge(v, u, cap))
        self.edges.append(MPM.FlowEdge(u, v, 0))
        self.adj[v].append(self.m)
        self.adj[u].append(self.m + 1)
        self.m += 2

    def bfs(self):
        # пошук у ширину для побудови шарів залишкової мережі
        qh = 0
        while qh < len(self.q):
            v = self.q[qh]
            qh += 1
            for idx in self.adj[v]:
                e = self.edges[idx]
                if e.cap - e.flow < 1:
                    continue
                if self.level[e.u] != -1:
                    continue
                self.level[e.u] = self.level[v] + 1
                self.q.append(e.u)
        return self.level[self.t] != -1

    def pot(self, v):
        return min(self.pin[v], self.pout[v])

    def remove_node(self, v):
        # видаляємо вершину з шаруватої мережі, оновлюючи потенціали сусідів
        for i in self.in_[v]:
            u = self.edges[i].v
            self.out[u].remove(i)
            self.pout[u] -= self.edges[i].cap - self.edges[i].flow
        for i in self.out[v]:
            u = self.edges[i].u
            self.in_[u].remove(i)
            self.pin[u] -= self.edges[i].cap - self.edges[i].flow

    def push(self, frm, to, f, forw):
        # проштовхування f одиниць потоку (forw=True — вперед до t, інакше назад до s)
        self.ex = [0] * self.n
        self.ex[frm] = f
        self.q = [frm]
        qh = 0
        while qh < len(self.q):
            v = self.q[qh]
            qh += 1
            if v == to:
                break
            must = self.ex[v]
            lst = self.out[v] if forw else self.in_[v]
            while True:
                if not lst:
                    break
                idx = lst[0]
                e = self.edges[idx]
                u = e.u if forw else e.v
                pushed = min(must, e.cap - e.flow)
                if pushed == 0:
                    break
                if forw:
                    self.pout[v] -= pushed
                    self.pin[u] -= pushed
                else:
                    self.pin[v] -= pushed
                    self.pout[u] -= pushed
                if self.ex[u] == 0:
                    self.q.append(u)
                self.ex[u] += pushed
                e.flow += pushed
                self.edges[idx ^ 1].flow -= pushed
                must -= pushed
                if e.cap - e.flow == 0:
                    # ребро насичене — видаляємо його з обох списків
                    if forw:
                        self.in_[u].remove(idx)
                        lst.popleft()
                    else:
                        self.out[u].remove(idx)
                        lst.popleft()
                else:
                    break
                if must == 0:
                    break

    def flow(self):
        ans = 0
        while True:
            self.pin = [0] * self.n
            self.pout = [0] * self.n
            self.level = [-1] * self.n
            self.alive = [True] * self.n
            self.level[self.s] = 0
            self.q = [self.s]
            if not self.bfs():
                break
            for i in range(self.n):
                self.out[i].clear()
                self.in_[i].clear()
            for i in range(self.m):
                e = self.edges[i]
                if e.cap - e.flow == 0:
                    continue
                v, u = e.v, e.u
                if self.level[v] + 1 == self.level[u] and (self.level[u] < self.level[self.t] or u == self.t):
                    self.in_[u].append(i)
                    self.out[v].append(i)
                    self.pin[u] += e.cap - e.flow
                    self.pout[v] += e.cap - e.flow
            self.pin[self.s] = self.pout[self.t] = self.flow_inf
            while True:
                v = -1
                for i in range(self.n):
                    if not self.alive[i]:
                        continue
                    if v == -1 or self.pot(i) < self.pot(v):
                        v = i
                if v == -1:
                    break
                if self.pot(v) == 0:
                    self.alive[v] = False
                    self.remove_node(v)
                    continue
                f = self.pot(v)
                ans += f
                self.push(v, self.s, f, False)
                self.push(v, self.t, f, True)
                self.alive[v] = False
                self.remove_node(v)
        return ans
```

```typescript
// Ребро потоку: v -> u, пропускна здатність cap, поточний потік flow
class FlowEdge {
  constructor(
    public v: number,
    public u: number,
    public cap: bigint,
    public flow: bigint = 0n,
  ) {}
}

class MPM {
  flowInf = 1000000000000000000n;
  n: number;
  s: number;
  t: number;
  m = 0;
  edges: FlowEdge[] = [];
  adj: number[][];
  // in/out — списки id ребер шаруватої мережі; C++ list<int> -> власні масиви
  inE: number[][];
  out: number[][];
  pin: bigint[];
  pout: bigint[];
  level: number[];
  alive: boolean[];
  ex: bigint[];
  q: number[] = [];

  constructor(n: number, s: number, t: number) {
    this.n = n;
    this.s = s;
    this.t = t;
    this.adj = Array.from({ length: n }, () => []);
    this.inE = Array.from({ length: n }, () => []);
    this.out = Array.from({ length: n }, () => []);
    this.pin = new Array(n).fill(0n);
    this.pout = new Array(n).fill(0n);
    this.level = new Array(n).fill(-1);
    this.alive = new Array(n).fill(true);
    this.ex = new Array(n).fill(0n);
  }

  addEdge(v: number, u: number, cap: bigint): void {
    this.edges.push(new FlowEdge(v, u, cap));
    this.edges.push(new FlowEdge(u, v, 0n));
    this.adj[v].push(this.m);
    this.adj[u].push(this.m + 1);
    this.m += 2;
  }

  bfs(): boolean {
    // пошук у ширину для побудови шарів залишкової мережі
    let qh = 0;
    while (qh < this.q.length) {
      const v = this.q[qh++];
      for (const idx of this.adj[v]) {
        const e = this.edges[idx];
        if (e.cap - e.flow < 1n) continue;
        if (this.level[e.u] !== -1) continue;
        this.level[e.u] = this.level[v] + 1;
        this.q.push(e.u);
      }
    }
    return this.level[this.t] !== -1;
  }

  pot(v: number): bigint {
    return this.pin[v] < this.pout[v] ? this.pin[v] : this.pout[v];
  }

  private erase(arr: number[], value: number): void {
    const i = arr.indexOf(value);
    if (i !== -1) arr.splice(i, 1);
  }

  removeNode(v: number): void {
    // видаляємо вершину з шаруватої мережі, оновлюючи потенціали сусідів
    for (const i of this.inE[v]) {
      const u = this.edges[i].v;
      this.erase(this.out[u], i);
      this.pout[u] -= this.edges[i].cap - this.edges[i].flow;
    }
    for (const i of this.out[v]) {
      const u = this.edges[i].u;
      this.erase(this.inE[u], i);
      this.pin[u] -= this.edges[i].cap - this.edges[i].flow;
    }
  }

  push(frm: number, to: number, f: bigint, forw: boolean): void {
    // проштовхування f одиниць потоку (forw=true — вперед до t, інакше назад до s)
    this.ex = new Array(this.n).fill(0n);
    this.ex[frm] = f;
    this.q = [frm];
    let qh = 0;
    while (qh < this.q.length) {
      const v = this.q[qh++];
      if (v === to) break;
      let must = this.ex[v];
      const lst = forw ? this.out[v] : this.inE[v];
      while (true) {
        if (lst.length === 0) break;
        const idx = lst[0];
        const e = this.edges[idx];
        const u = forw ? e.u : e.v;
        const cur = e.cap - e.flow;
        const pushed = must < cur ? must : cur;
        if (pushed === 0n) break;
        if (forw) {
          this.pout[v] -= pushed;
          this.pin[u] -= pushed;
        } else {
          this.pin[v] -= pushed;
          this.pout[u] -= pushed;
        }
        if (this.ex[u] === 0n) this.q.push(u);
        this.ex[u] += pushed;
        e.flow += pushed;
        this.edges[idx ^ 1].flow -= pushed;
        must -= pushed;
        if (e.cap - e.flow === 0n) {
          // ребро насичене — видаляємо його з обох списків
          if (forw) {
            this.erase(this.inE[u], idx);
            lst.shift();
          } else {
            this.erase(this.out[u], idx);
            lst.shift();
          }
        } else break;
        if (must === 0n) break;
      }
    }
  }

  flow(): bigint {
    let ans = 0n;
    while (true) {
      this.pin = new Array(this.n).fill(0n);
      this.pout = new Array(this.n).fill(0n);
      this.level = new Array(this.n).fill(-1);
      this.alive = new Array(this.n).fill(true);
      this.level[this.s] = 0;
      this.q = [this.s];
      if (!this.bfs()) break;
      for (let i = 0; i < this.n; i++) {
        this.out[i] = [];
        this.inE[i] = [];
      }
      for (let i = 0; i < this.m; i++) {
        const e = this.edges[i];
        if (e.cap - e.flow === 0n) continue;
        const v = e.v;
        const u = e.u;
        if (
          this.level[v] + 1 === this.level[u] &&
          (this.level[u] < this.level[this.t] || u === this.t)
        ) {
          this.inE[u].push(i);
          this.out[v].push(i);
          this.pin[u] += e.cap - e.flow;
          this.pout[v] += e.cap - e.flow;
        }
      }
      this.pin[this.s] = this.flowInf;
      this.pout[this.t] = this.flowInf;
      while (true) {
        let v = -1;
        for (let i = 0; i < this.n; i++) {
          if (!this.alive[i]) continue;
          if (v === -1 || this.pot(i) < this.pot(v)) v = i;
        }
        if (v === -1) break;
        if (this.pot(v) === 0n) {
          this.alive[v] = false;
          this.removeNode(v);
          continue;
        }
        const f = this.pot(v);
        ans += f;
        this.push(v, this.s, f, false);
        this.push(v, this.t, f, true);
        this.alive[v] = false;
        this.removeNode(v);
      }
    }
    return ans;
  }
}
```

```go
// FlowEdge — ребро потоку: v -> u, пропускна здатність cap, поточний потік flow
type FlowEdge struct {
	v, u      int
	cap, flow int64
}

type MPM struct {
	flowInf    int64
	n, s, t, m int
	edges      []FlowEdge
	adj        [][]int
	// inE/out — списки id ребер шаруватої мережі; C++ list<int> -> слайси
	inE   [][]int
	out   [][]int
	pin   []int64
	pout  []int64
	level []int
	alive []bool
	ex    []int64
	q     []int
}

func NewMPM(n, s, t int) *MPM {
	return &MPM{
		flowInf: 1000000000000000000,
		n:       n, s: s, t: t,
		adj:   make([][]int, n),
		inE:   make([][]int, n),
		out:   make([][]int, n),
		pin:   make([]int64, n),
		pout:  make([]int64, n),
		level: make([]int, n),
		alive: make([]bool, n),
		ex:    make([]int64, n),
	}
}

func (g *MPM) addEdge(v, u int, cap int64) {
	g.edges = append(g.edges, FlowEdge{v, u, cap, 0})
	g.edges = append(g.edges, FlowEdge{u, v, 0, 0})
	g.adj[v] = append(g.adj[v], g.m)
	g.adj[u] = append(g.adj[u], g.m+1)
	g.m += 2
}

func (g *MPM) bfs() bool {
	// пошук у ширину для побудови шарів залишкової мережі
	qh := 0
	for qh < len(g.q) {
		v := g.q[qh]
		qh++
		for _, idx := range g.adj[v] {
			e := &g.edges[idx]
			if e.cap-e.flow < 1 {
				continue
			}
			if g.level[e.u] != -1 {
				continue
			}
			g.level[e.u] = g.level[v] + 1
			g.q = append(g.q, e.u)
		}
	}
	return g.level[g.t] != -1
}

func (g *MPM) pot(v int) int64 {
	if g.pin[v] < g.pout[v] {
		return g.pin[v]
	}
	return g.pout[v]
}

// eraseVal видаляє перше входження value зі слайсу
func eraseVal(s []int, value int) []int {
	for i, x := range s {
		if x == value {
			return append(s[:i], s[i+1:]...)
		}
	}
	return s
}

func (g *MPM) removeNode(v int) {
	// видаляємо вершину з шаруватої мережі, оновлюючи потенціали сусідів
	for _, i := range g.inE[v] {
		u := g.edges[i].v
		g.out[u] = eraseVal(g.out[u], i)
		g.pout[u] -= g.edges[i].cap - g.edges[i].flow
	}
	for _, i := range g.out[v] {
		u := g.edges[i].u
		g.inE[u] = eraseVal(g.inE[u], i)
		g.pin[u] -= g.edges[i].cap - g.edges[i].flow
	}
}

func (g *MPM) push(frm, to int, f int64, forw bool) {
	// проштовхування f одиниць потоку (forw=true — вперед до t, інакше назад до s)
	for i := range g.ex {
		g.ex[i] = 0
	}
	g.ex[frm] = f
	g.q = []int{frm}
	qh := 0
	for qh < len(g.q) {
		v := g.q[qh]
		qh++
		if v == to {
			break
		}
		must := g.ex[v]
		for {
			var lst []int
			if forw {
				lst = g.out[v]
			} else {
				lst = g.inE[v]
			}
			if len(lst) == 0 {
				break
			}
			idx := lst[0]
			e := &g.edges[idx]
			var u int
			if forw {
				u = e.u
			} else {
				u = e.v
			}
			pushed := must
			if cur := e.cap - e.flow; cur < pushed {
				pushed = cur
			}
			if pushed == 0 {
				break
			}
			if forw {
				g.pout[v] -= pushed
				g.pin[u] -= pushed
			} else {
				g.pin[v] -= pushed
				g.pout[u] -= pushed
			}
			if g.ex[u] == 0 {
				g.q = append(g.q, u)
			}
			g.ex[u] += pushed
			e.flow += pushed
			g.edges[idx^1].flow -= pushed
			must -= pushed
			if e.cap-e.flow == 0 {
				// ребро насичене — видаляємо його з обох списків
				if forw {
					g.inE[u] = eraseVal(g.inE[u], idx)
					g.out[v] = g.out[v][1:]
				} else {
					g.out[u] = eraseVal(g.out[u], idx)
					g.inE[v] = g.inE[v][1:]
				}
			} else {
				break
			}
			if must == 0 {
				break
			}
		}
	}
}

func (g *MPM) flow() int64 {
	var ans int64 = 0
	for {
		for i := 0; i < g.n; i++ {
			g.pin[i] = 0
			g.pout[i] = 0
			g.level[i] = -1
			g.alive[i] = true
		}
		g.level[g.s] = 0
		g.q = []int{g.s}
		if !g.bfs() {
			break
		}
		for i := 0; i < g.n; i++ {
			g.out[i] = nil
			g.inE[i] = nil
		}
		for i := 0; i < g.m; i++ {
			e := &g.edges[i]
			if e.cap-e.flow == 0 {
				continue
			}
			v, u := e.v, e.u
			if g.level[v]+1 == g.level[u] && (g.level[u] < g.level[g.t] || u == g.t) {
				g.inE[u] = append(g.inE[u], i)
				g.out[v] = append(g.out[v], i)
				g.pin[u] += e.cap - e.flow
				g.pout[v] += e.cap - e.flow
			}
		}
		g.pin[g.s] = g.flowInf
		g.pout[g.t] = g.flowInf
		for {
			v := -1
			for i := 0; i < g.n; i++ {
				if !g.alive[i] {
					continue
				}
				if v == -1 || g.pot(i) < g.pot(v) {
					v = i
				}
			}
			if v == -1 {
				break
			}
			if g.pot(v) == 0 {
				g.alive[v] = false
				g.removeNode(v)
				continue
			}
			f := g.pot(v)
			ans += f
			g.push(v, g.s, f, false)
			g.push(v, g.t, f, true)
			g.alive[v] = false
			g.removeNode(v)
		}
	}
	return ans
}
```

</CodeTabs>
