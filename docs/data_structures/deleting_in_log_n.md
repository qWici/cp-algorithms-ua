# Видалення зі структури даних за $O(T(n)\log n)$

Припустимо, у нас є структура даних, яка дозволяє додавати елементи за **справжній** $O(T(n))$.
У цій статті ми опишемо прийом, який дозволяє виконувати видалення за $O(T(n)\log n)$ в офлайн-режимі.

## Алгоритм \{#algorithm}

Кожен елемент існує у структурі даних протягом певних відрізків часу між додаваннями та видаленнями.
Побудуймо дерево відрізків над запитами.
Кожен відрізок, упродовж якого якийсь елемент «живий», розбивається на $O(\log n)$ вузлів дерева.
Помістімо кожен запит, у якому ми хочемо щось дізнатися про структуру, у відповідний листок.
Тепер, щоб обробити всі запити, ми запустимо DFS по дереву відрізків.
Заходячи у вузол, ми додаватимемо всі елементи, що містяться в цьому вузлі.
Потім ми йтимемо далі до дітей цього вузла або відповідатимемо на запити (якщо вузол є листком).
Виходячи з вузла, ми маємо скасувати додавання.
Зауважимо, що якщо ми змінюємо структуру за $O(T(n))$, то можемо відкотити зміни за $O(T(n))$, зберігаючи стек змін.
Зауважимо, що відкати ламають амортизовану складність.

## Зауваження \{#notes}

Ідея побудови дерева відрізків над відрізками, упродовж яких щось є «живим», може використовуватися не лише в задачах на структури даних.
Див. деякі задачі нижче.

## Реалізація \{#implementation}

Ця реалізація стосується задачі про [динамічну зв'язність](https://en.wikipedia.org/wiki/Dynamic_connectivity).
Вона вміє додавати ребра, видаляти ребра та підраховувати кількість компонент зв'язності.

<CodeTabs>

```cpp
struct dsu_save {
    int v, rnkv, u, rnku;

    dsu_save() {}

    dsu_save(int _v, int _rnkv, int _u, int _rnku)
        : v(_v), rnkv(_rnkv), u(_u), rnku(_rnku) {}
};

struct dsu_with_rollbacks {
    vector<int> p, rnk;
    int comps;
    stack<dsu_save> op;

    dsu_with_rollbacks() {}

    dsu_with_rollbacks(int n) {
        p.resize(n);
        rnk.resize(n);
        for (int i = 0; i < n; i++) {
            p[i] = i;
            rnk[i] = 0;
        }
        comps = n;
    }

    int find_set(int v) {
        return (v == p[v]) ? v : find_set(p[v]);
    }

    bool unite(int v, int u) {
        v = find_set(v);
        u = find_set(u);
        if (v == u)
            return false;
        comps--;
        if (rnk[v] > rnk[u])
            swap(v, u);
        op.push(dsu_save(v, rnk[v], u, rnk[u]));
        p[v] = u;
        if (rnk[u] == rnk[v])
            rnk[u]++;
        return true;
    }

    void rollback() {
        if (op.empty())
            return;
        dsu_save x = op.top();
        op.pop();
        comps++;
        p[x.v] = x.v;
        rnk[x.v] = x.rnkv;
        p[x.u] = x.u;
        rnk[x.u] = x.rnku;
    }
};

struct query {
    int v, u;
    bool united;
    query(int _v, int _u) : v(_v), u(_u) {
    }
};

struct QueryTree {
    vector<vector<query>> t;
    dsu_with_rollbacks dsu;
    int T;

    QueryTree() {}

    QueryTree(int _T, int n) : T(_T) {
        dsu = dsu_with_rollbacks(n);
        t.resize(4 * T + 4);
    }

    void add_to_tree(int v, int l, int r, int ul, int ur, query& q) {
        if (ul > ur)
            return;
        if (l == ul && r == ur) {
            t[v].push_back(q);
            return;
        }
        int mid = (l + r) / 2;
        add_to_tree(2 * v, l, mid, ul, min(ur, mid), q);
        add_to_tree(2 * v + 1, mid + 1, r, max(ul, mid + 1), ur, q);
    }

    void add_query(query q, int l, int r) {
        add_to_tree(1, 0, T - 1, l, r, q);
    }

    void dfs(int v, int l, int r, vector<int>& ans) {
        for (query& q : t[v]) {
            q.united = dsu.unite(q.v, q.u);
        }
        if (l == r)
            ans[l] = dsu.comps;
        else {
            int mid = (l + r) / 2;
            dfs(2 * v, l, mid, ans);
            dfs(2 * v + 1, mid + 1, r, ans);
        }
        for (query q : t[v]) {
            if (q.united)
                dsu.rollback();
        }
    }

    vector<int> solve() {
        vector<int> ans(T);
        dfs(1, 0, T - 1, ans);
        return ans;
    }
};
```

```python
from dataclasses import dataclass


@dataclass
class DsuSave:
    v: int
    rnkv: int
    u: int
    rnku: int


class DsuWithRollbacks:
    def __init__(self, n: int):
        self.p = list(range(n))       # батьки
        self.rnk = [0] * n            # ранги
        self.comps = n                # кількість компонент зв'язності
        self.op: list[DsuSave] = []   # стек операцій для відкату

    def find_set(self, v: int) -> int:
        # Без стиснення шляхів, щоб відкат був коректним.
        while v != self.p[v]:
            v = self.p[v]
        return v

    def unite(self, v: int, u: int) -> bool:
        v = self.find_set(v)
        u = self.find_set(u)
        if v == u:
            return False
        self.comps -= 1
        if self.rnk[v] > self.rnk[u]:
            v, u = u, v
        self.op.append(DsuSave(v, self.rnk[v], u, self.rnk[u]))
        self.p[v] = u
        if self.rnk[u] == self.rnk[v]:
            self.rnk[u] += 1
        return True

    def rollback(self) -> None:
        if not self.op:
            return
        x = self.op.pop()
        self.comps += 1
        self.p[x.v] = x.v
        self.rnk[x.v] = x.rnkv
        self.p[x.u] = x.u
        self.rnk[x.u] = x.rnku


class Query:
    def __init__(self, v: int, u: int):
        self.v = v
        self.u = u
        self.united = False


class QueryTree:
    def __init__(self, T: int, n: int):
        self.T = T
        self.dsu = DsuWithRollbacks(n)
        self.t: list[list[Query]] = [[] for _ in range(4 * T + 4)]

    def add_to_tree(self, v: int, l: int, r: int, ul: int, ur: int, q: Query) -> None:
        if ul > ur:
            return
        if l == ul and r == ur:
            self.t[v].append(q)
            return
        mid = (l + r) // 2
        self.add_to_tree(2 * v, l, mid, ul, min(ur, mid), q)
        self.add_to_tree(2 * v + 1, mid + 1, r, max(ul, mid + 1), ur, q)

    def add_query(self, q: Query, l: int, r: int) -> None:
        self.add_to_tree(1, 0, self.T - 1, l, r, q)

    def dfs(self, v: int, l: int, r: int, ans: list[int]) -> None:
        for q in self.t[v]:
            q.united = self.dsu.unite(q.v, q.u)
        if l == r:
            ans[l] = self.dsu.comps
        else:
            mid = (l + r) // 2
            self.dfs(2 * v, l, mid, ans)
            self.dfs(2 * v + 1, mid + 1, r, ans)
        for q in self.t[v]:
            if q.united:
                self.dsu.rollback()

    def solve(self) -> list[int]:
        ans = [0] * self.T
        self.dfs(1, 0, self.T - 1, ans)
        return ans
```

```typescript
interface DsuSave {
    v: number;
    rnkv: number;
    u: number;
    rnku: number;
}

class DsuWithRollbacks {
    p: number[];          // батьки
    rnk: number[];        // ранги
    comps: number;        // кількість компонент зв'язності
    op: DsuSave[] = [];   // стек операцій для відкату

    constructor(n: number) {
        this.p = Array.from({ length: n }, (_, i) => i);
        this.rnk = new Array(n).fill(0);
        this.comps = n;
    }

    findSet(v: number): number {
        // Без стиснення шляхів, щоб відкат був коректним.
        while (v !== this.p[v]) v = this.p[v];
        return v;
    }

    unite(v: number, u: number): boolean {
        v = this.findSet(v);
        u = this.findSet(u);
        if (v === u) return false;
        this.comps--;
        if (this.rnk[v] > this.rnk[u]) [v, u] = [u, v];
        this.op.push({ v, rnkv: this.rnk[v], u, rnku: this.rnk[u] });
        this.p[v] = u;
        if (this.rnk[u] === this.rnk[v]) this.rnk[u]++;
        return true;
    }

    rollback(): void {
        const x = this.op.pop();
        if (x === undefined) return;
        this.comps++;
        this.p[x.v] = x.v;
        this.rnk[x.v] = x.rnkv;
        this.p[x.u] = x.u;
        this.rnk[x.u] = x.rnku;
    }
}

class Query {
    united = false;
    constructor(public v: number, public u: number) {}
}

class QueryTree {
    T: number;
    dsu: DsuWithRollbacks;
    t: Query[][];

    constructor(T: number, n: number) {
        this.T = T;
        this.dsu = new DsuWithRollbacks(n);
        this.t = Array.from({ length: 4 * T + 4 }, () => []);
    }

    addToTree(v: number, l: number, r: number, ul: number, ur: number, q: Query): void {
        if (ul > ur) return;
        if (l === ul && r === ur) {
            this.t[v].push(q);
            return;
        }
        const mid = (l + r) >> 1;
        this.addToTree(2 * v, l, mid, ul, Math.min(ur, mid), q);
        this.addToTree(2 * v + 1, mid + 1, r, Math.max(ul, mid + 1), ur, q);
    }

    addQuery(q: Query, l: number, r: number): void {
        this.addToTree(1, 0, this.T - 1, l, r, q);
    }

    dfs(v: number, l: number, r: number, ans: number[]): void {
        for (const q of this.t[v]) q.united = this.dsu.unite(q.v, q.u);
        if (l === r) {
            ans[l] = this.dsu.comps;
        } else {
            const mid = (l + r) >> 1;
            this.dfs(2 * v, l, mid, ans);
            this.dfs(2 * v + 1, mid + 1, r, ans);
        }
        for (const q of this.t[v]) if (q.united) this.dsu.rollback();
    }

    solve(): number[] {
        const ans = new Array<number>(this.T).fill(0);
        this.dfs(1, 0, this.T - 1, ans);
        return ans;
    }
}
```

```go
type dsuSave struct {
	v, rnkv, u, rnku int
}

type dsuWithRollbacks struct {
	p, rnk []int     // батьки та ранги
	comps  int       // кількість компонент зв'язності
	op     []dsuSave // стек операцій для відкату
}

func newDSU(n int) *dsuWithRollbacks {
	d := &dsuWithRollbacks{
		p:     make([]int, n),
		rnk:   make([]int, n),
		comps: n,
	}
	for i := 0; i < n; i++ {
		d.p[i] = i
	}
	return d
}

func (d *dsuWithRollbacks) findSet(v int) int {
	// Без стиснення шляхів, щоб відкат був коректним.
	for v != d.p[v] {
		v = d.p[v]
	}
	return v
}

func (d *dsuWithRollbacks) unite(v, u int) bool {
	v = d.findSet(v)
	u = d.findSet(u)
	if v == u {
		return false
	}
	d.comps--
	if d.rnk[v] > d.rnk[u] {
		v, u = u, v
	}
	d.op = append(d.op, dsuSave{v, d.rnk[v], u, d.rnk[u]})
	d.p[v] = u
	if d.rnk[u] == d.rnk[v] {
		d.rnk[u]++
	}
	return true
}

func (d *dsuWithRollbacks) rollback() {
	if len(d.op) == 0 {
		return
	}
	x := d.op[len(d.op)-1]
	d.op = d.op[:len(d.op)-1]
	d.comps++
	d.p[x.v] = x.v
	d.rnk[x.v] = x.rnkv
	d.p[x.u] = x.u
	d.rnk[x.u] = x.rnku
}

type query struct {
	v, u   int
	united bool
}

type queryTree struct {
	t   [][]*query
	dsu *dsuWithRollbacks
	T   int
}

func newQueryTree(T, n int) *queryTree {
	return &queryTree{
		t:   make([][]*query, 4*T+4),
		dsu: newDSU(n),
		T:   T,
	}
}

func (qt *queryTree) addToTree(v, l, r, ul, ur int, q *query) {
	if ul > ur {
		return
	}
	if l == ul && r == ur {
		qt.t[v] = append(qt.t[v], q)
		return
	}
	mid := (l + r) / 2
	qt.addToTree(2*v, l, mid, ul, min(ur, mid), q)
	qt.addToTree(2*v+1, mid+1, r, max(ul, mid+1), ur, q)
}

func (qt *queryTree) addQuery(q *query, l, r int) {
	qt.addToTree(1, 0, qt.T-1, l, r, q)
}

func (qt *queryTree) dfs(v, l, r int, ans []int) {
	for _, q := range qt.t[v] {
		q.united = qt.dsu.unite(q.v, q.u)
	}
	if l == r {
		ans[l] = qt.dsu.comps
	} else {
		mid := (l + r) / 2
		qt.dfs(2*v, l, mid, ans)
		qt.dfs(2*v+1, mid+1, r, ans)
	}
	for _, q := range qt.t[v] {
		if q.united {
			qt.dsu.rollback()
		}
	}
}

func (qt *queryTree) solve() []int {
	ans := make([]int, qt.T)
	qt.dfs(1, 0, qt.T-1, ans)
	return ans
}
```

</CodeTabs>

## Задачі \{#problems}

- [Codeforces - Connect and Disconnect](https://codeforces.com/gym/100551/problem/A)
- [Codeforces - Addition on Segments](https://codeforces.com/contest/981/problem/E)
- [Codeforces - Extending Set of Points](https://codeforces.com/contest/1140/problem/F)
