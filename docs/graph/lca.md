# Найнижчий спільний предок — $O(\sqrt{N})$ та $O(\log N)$ з попередньою обробкою за $O(N)$

Дано дерево $G$. Дано запити виду $(v_1, v_2)$; для кожного запиту потрібно знайти найнижчий спільний предок (LCA), тобто таку вершину $v$, яка лежить і на шляху від кореня до $v_1$, і на шляху від кореня до $v_2$, причому ця вершина має бути найнижчою. Іншими словами, шукана вершина $v$ — це найнижчий предок вершин $v_1$ і $v_2$. Очевидно, що їхній найнижчий спільний предок лежить на найкоротшому шляху між $v_1$ і $v_2$. Крім того, якщо $v_1$ є предком $v_2$, то $v_1$ і є їхнім найнижчим спільним предком.

### Ідея алгоритму \{#the-idea-of-the-algorithm}

Перш ніж відповідати на запити, нам потрібно виконати **попередню обробку** дерева.
Ми робимо обхід у глибину ([DFS](depth-first-search.md)), починаючи з кореня, і будуємо список $\text{euler}$, який зберігає порядок вершин, які ми відвідуємо (вершина додається до списку тоді, коли ми вперше її відвідуємо, а також після повернення обходів DFS до її дітей).
Це також називають ейлеровим обходом дерева.
Зрозуміло, що розмір цього списку буде $O(N)$.
Нам також потрібно побудувати масив $\text{first}[0..N-1]$, який зберігає для кожної вершини $i$ її перше входження у $\text{euler}$.
Тобто першу позицію в $\text{euler}$ таку, що $\text{euler}[\text{first}[i]] = i$.
Крім того, за допомогою DFS ми можемо знайти висоту кожного вузла (відстань від кореня до нього) і зберегти її в масиві $\text{height}[0..N-1]$.

То як же нам відповідати на запити за допомогою ейлерового обходу та двох додаткових масивів?
Припустимо, що запит — це пара $v_1$ і $v_2$.
Розглянемо вершини, які ми відвідуємо в ейлеровому обході між першим відвідуванням $v_1$ і першим відвідуванням $v_2$.
Легко бачити, що $\text{LCA}(v_1, v_2)$ — це вершина з найменшою висотою на цьому шляху.
Ми вже зауважили, що LCA має бути частиною найкоротшого шляху між $v_1$ і $v_2$.
Очевидно, що вона також має бути вершиною з найменшою висотою.
А в ейлеровому обході ми, по суті, використовуємо найкоротший шлях, окрім того, що додатково відвідуємо всі піддерева, які трапляються нам на шляху.
Але всі вершини в цих піддеревах розташовані нижче в дереві, ніж LCA, а отже, мають більшу висоту.
Тож $\text{LCA}(v_1, v_2)$ можна однозначно визначити, знайшовши вершину з найменшою висотою в ейлеровому обході між $\text{first}(v_1)$ і $\text{first}(v_2)$.

Проілюструймо цю ідею.
Розглянемо такий граф і ейлерів обхід з відповідними висотами:
<center> <img src="/img/docs/graph/LCA_Euler.png" alt="LCA_Euler_Tour" /> </center>

$$
\begin{array}{|l|c|c|c|c|c|c|c|c|c|c|c|c|c|}
\hline
\text{Vertices:}   & 1 & 2 & 5 & 2 & 6 & 2 & 1 & 3 & 1 & 4 & 7 & 4 & 1 \\ \hline
\text{Heights:} & 1 & 2 & 3 & 2 & 3 & 2 & 1 & 2 & 1 & 2 & 3 & 2 & 1 \\ \hline
\end{array}
$$

В обході, що починається у вершині $6$ і закінчується у $4$, ми відвідуємо вершини $[6, 2, 1, 3, 1, 4]$.
Серед цих вершин вершина $1$ має найменшу висоту, тому $\text{LCA(6, 4) = 1}$.

Підсумуємо:
щоб відповісти на запит, нам просто потрібно **знайти вершину з найменшою висотою** в масиві $\text{euler}$ на відрізку від $\text{first}[v_1]$ до $\text{first}[v_2]$.
Отже, **задача LCA зводиться до задачі RMQ** (задачі знаходження мінімуму на відрізку).

Використовуючи [кореневе розбиття](../data_structures/sqrt_decomposition.md), можна отримати розв'язок, який відповідає на кожен запит за $O(\sqrt{N})$ з попередньою обробкою за час $O(N)$.

Використовуючи [дерево відрізків](../data_structures/segment_tree.md), можна відповідати на кожен запит за $O(\log N)$ з попередньою обробкою за час $O(N)$.

Оскільки збережені значення майже ніколи не оновлюватимуться, кращим вибором може бути [розріджена таблиця](../data_structures/sparse-table.md), яка дозволяє відповідати на запит за $O(1)$ з часом побудови $O(N\log N)$.

### Реалізація \{#implementation}

У наведеній нижче реалізації алгоритму LCA використовується дерево відрізків.

<CodeTabs>

```cpp
struct LCA {
    vector<int> height, euler, first, segtree;
    vector<bool> visited;
    int n;

    LCA(vector<vector<int>> &adj, int root = 0) {
        n = adj.size();
        height.resize(n);
        first.resize(n);
        euler.reserve(n * 2);
        visited.assign(n, false);
        dfs(adj, root);
        int m = euler.size();
        segtree.resize(m * 4);
        build(1, 0, m - 1);
    }

    void dfs(vector<vector<int>> &adj, int node, int h = 0) {
        visited[node] = true;
        height[node] = h;
        first[node] = euler.size();
        euler.push_back(node);
        for (auto to : adj[node]) {
            if (!visited[to]) {
                dfs(adj, to, h + 1);
                euler.push_back(node);
            }
        }
    }

    void build(int node, int b, int e) {
        if (b == e) {
            segtree[node] = euler[b];
        } else {
            int mid = (b + e) / 2;
            build(node << 1, b, mid);
            build(node << 1 | 1, mid + 1, e);
            int l = segtree[node << 1], r = segtree[node << 1 | 1];
            segtree[node] = (height[l] < height[r]) ? l : r;
        }
    }

    int query(int node, int b, int e, int L, int R) {
        if (b > R || e < L)
            return -1;
        if (b >= L && e <= R)
            return segtree[node];
        int mid = (b + e) >> 1;

        int left = query(node << 1, b, mid, L, R);
        int right = query(node << 1 | 1, mid + 1, e, L, R);
        if (left == -1) return right;
        if (right == -1) return left;
        return height[left] < height[right] ? left : right;
    }

    int lca(int u, int v) {
        int left = first[u], right = first[v];
        if (left > right)
            swap(left, right);
        return query(1, 0, euler.size() - 1, left, right);
    }
};

```

```python
import sys


class LCA:
    def __init__(self, adj, root=0):
        self.n = len(adj)
        self.height = [0] * self.n
        self.first = [0] * self.n
        self.euler = []
        self.visited = [False] * self.n
        # Глибина рекурсії DFS може сягати O(N), тому піднімаємо ліміт.
        sys.setrecursionlimit(max(10**6, self.n * 2 + 10))
        self.dfs(adj, root)
        m = len(self.euler)
        self.segtree = [0] * (m * 4)
        self.build(1, 0, m - 1)

    def dfs(self, adj, node, h=0):
        self.visited[node] = True
        self.height[node] = h
        self.first[node] = len(self.euler)
        self.euler.append(node)
        for to in adj[node]:
            if not self.visited[to]:
                self.dfs(adj, to, h + 1)
                self.euler.append(node)

    def build(self, node, b, e):
        if b == e:
            self.segtree[node] = self.euler[b]
        else:
            mid = (b + e) // 2
            self.build(node << 1, b, mid)
            self.build(node << 1 | 1, mid + 1, e)
            l = self.segtree[node << 1]
            r = self.segtree[node << 1 | 1]
            self.segtree[node] = l if self.height[l] < self.height[r] else r

    def query(self, node, b, e, L, R):
        if b > R or e < L:
            return -1
        if b >= L and e <= R:
            return self.segtree[node]
        mid = (b + e) >> 1
        left = self.query(node << 1, b, mid, L, R)
        right = self.query(node << 1 | 1, mid + 1, e, L, R)
        if left == -1:
            return right
        if right == -1:
            return left
        return left if self.height[left] < self.height[right] else right

    def lca(self, u, v):
        left, right = self.first[u], self.first[v]
        if left > right:
            left, right = right, left
        return self.query(1, 0, len(self.euler) - 1, left, right)
```

```typescript
class LCA {
  height: number[];
  euler: number[];
  first: number[];
  segtree: number[];
  visited: boolean[];
  n: number;

  constructor(adj: number[][], root = 0) {
    this.n = adj.length;
    this.height = new Array(this.n).fill(0);
    this.first = new Array(this.n).fill(0);
    this.euler = [];
    this.visited = new Array(this.n).fill(false);
    this.dfs(adj, root, 0);
    const m = this.euler.length;
    this.segtree = new Array(m * 4).fill(0);
    this.build(1, 0, m - 1);
  }

  dfs(adj: number[][], node: number, h: number): void {
    this.visited[node] = true;
    this.height[node] = h;
    this.first[node] = this.euler.length;
    this.euler.push(node);
    for (const to of adj[node]) {
      if (!this.visited[to]) {
        this.dfs(adj, to, h + 1);
        this.euler.push(node);
      }
    }
  }

  build(node: number, b: number, e: number): void {
    if (b === e) {
      this.segtree[node] = this.euler[b];
    } else {
      const mid = (b + e) >> 1;
      this.build(node << 1, b, mid);
      this.build((node << 1) | 1, mid + 1, e);
      const l = this.segtree[node << 1];
      const r = this.segtree[(node << 1) | 1];
      this.segtree[node] = this.height[l] < this.height[r] ? l : r;
    }
  }

  query(node: number, b: number, e: number, L: number, R: number): number {
    if (b > R || e < L) return -1;
    if (b >= L && e <= R) return this.segtree[node];
    const mid = (b + e) >> 1;
    const left = this.query(node << 1, b, mid, L, R);
    const right = this.query((node << 1) | 1, mid + 1, e, L, R);
    if (left === -1) return right;
    if (right === -1) return left;
    return this.height[left] < this.height[right] ? left : right;
  }

  lca(u: number, v: number): number {
    let left = this.first[u];
    let right = this.first[v];
    if (left > right) [left, right] = [right, left];
    return this.query(1, 0, this.euler.length - 1, left, right);
  }
}
```

```go
type LCA struct {
	height, euler, first, segtree []int
	visited                       []bool
	n                             int
}

func NewLCA(adj [][]int, root int) *LCA {
	l := &LCA{n: len(adj)}
	l.height = make([]int, l.n)
	l.first = make([]int, l.n)
	l.euler = make([]int, 0, l.n*2)
	l.visited = make([]bool, l.n)
	l.dfs(adj, root, 0)
	m := len(l.euler)
	l.segtree = make([]int, m*4)
	l.build(1, 0, m-1)
	return l
}

func (l *LCA) dfs(adj [][]int, node, h int) {
	l.visited[node] = true
	l.height[node] = h
	l.first[node] = len(l.euler)
	l.euler = append(l.euler, node)
	for _, to := range adj[node] {
		if !l.visited[to] {
			l.dfs(adj, to, h+1)
			l.euler = append(l.euler, node)
		}
	}
}

func (l *LCA) build(node, b, e int) {
	if b == e {
		l.segtree[node] = l.euler[b]
	} else {
		mid := (b + e) / 2
		l.build(node<<1, b, mid)
		l.build(node<<1|1, mid+1, e)
		left, right := l.segtree[node<<1], l.segtree[node<<1|1]
		if l.height[left] < l.height[right] {
			l.segtree[node] = left
		} else {
			l.segtree[node] = right
		}
	}
}

func (l *LCA) query(node, b, e, L, R int) int {
	if b > R || e < L {
		return -1
	}
	if b >= L && e <= R {
		return l.segtree[node]
	}
	mid := (b + e) >> 1
	left := l.query(node<<1, b, mid, L, R)
	right := l.query(node<<1|1, mid+1, e, L, R)
	if left == -1 {
		return right
	}
	if right == -1 {
		return left
	}
	if l.height[left] < l.height[right] {
		return left
	}
	return right
}

func (l *LCA) lca(u, v int) int {
	left, right := l.first[u], l.first[v]
	if left > right {
		left, right = right, left
	}
	return l.query(1, 0, len(l.euler)-1, left, right)
}
```

</CodeTabs>

## Задачі для практики \{#practice-problems}
 - [SPOJ: LCA](http://www.spoj.com/problems/LCA/)
 - [SPOJ: DISQUERY](http://www.spoj.com/problems/DISQUERY/)
 - [TIMUS: 1471. Distance in the Tree](http://acm.timus.ru/problem.aspx?space=1&num=1471)
 - [CODEFORCES: Design Tutorial: Inverse the Problem](http://codeforces.com/problemset/problem/472/D)
 - [CODECHEF: Lowest Common Ancestor](https://www.codechef.com/problems/TALCA)
 * [SPOJ - Lowest Common Ancestor](http://www.spoj.com/problems/LCASQ/)
 * [SPOJ - Ada and Orange Tree](http://www.spoj.com/problems/ADAORANG/)
 * [DevSkill - Motoku (archived)](http://web.archive.org/web/20200922005503/https://devskill.com/CodingProblems/ViewProblem/141)
 * [UVA 12655 - Trucks](https://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=4384)
 * [Codechef - Pishty and Tree](https://www.codechef.com/problems/PSHTTR)
 * [UVA - 12533 - Joining Couples](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&category=441&page=show_problem&problem=3978)
 * [Codechef - So close yet So Far](https://www.codechef.com/problems/CLOSEFAR)
 * [Codeforces - Drivers Dissatisfaction](http://codeforces.com/contest/733/problem/F)
 * [UVA 11354 - Bond](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=2339)
 * [SPOJ - Querry on a tree II](http://www.spoj.com/problems/QTREE2/)
 * [Codeforces - Best Edge Weight](http://codeforces.com/contest/828/problem/F)
 * [Codeforces - Misha, Grisha and Underground](http://codeforces.com/contest/832/problem/D)
 * [SPOJ - Nlogonian Tickets](http://www.spoj.com/problems/NTICKETS/)
 * [Codeforces - Rowena Rawenclaws Diadem](http://codeforces.com/contest/855/problem/D)

## Відеоматеріали \{#video}

<YouTubeEmbed id="sD1IoalFomA" title="Lowest Common Ancestor (LCA) Problem | Eulerian path method — WilliamFiset" />
