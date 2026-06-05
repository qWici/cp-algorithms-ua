# Пошук мостів у графі за $O(N+M)$

Нам задано неорієнтований граф. Мостом називається таке ребро, видалення якого робить граф незв'язним (точніше кажучи, збільшує кількість компонент зв'язності графа). Завдання полягає в тому, щоб знайти всі мости в заданому графі.

Неформально задачу можна сформулювати так: маємо карту міст, з'єднаних дорогами; потрібно знайти всі «важливі» дороги, тобто такі дороги, видалення яких призводить до зникнення шляху між якоюсь парою міст.

Описаний тут алгоритм ґрунтується на [пошуку в глибину](depth-first-search.md) і має складність $O(N+M)$, де $N$ — кількість вершин, а $M$ — кількість ребер у графі.

Зауважимо, що існує також стаття [Пошук мостів онлайн](bridge-searching-online.md): на відміну від описаного тут офлайн-алгоритму, онлайн-алгоритм здатний підтримувати список усіх мостів у графі, що змінюється (за умови, що єдиний тип змін — це додавання нових ребер).

## Алгоритм \{#algorithm}

Виберемо довільну вершину графа $root$ і запустимо з неї [пошук у глибину](depth-first-search.md). Зауважимо такий факт (який легко довести):

- Нехай ми перебуваємо в DFS і переглядаємо ребра, що виходять з вершини $v$. Поточне ребро $(v, to)$ є мостом тоді й лише тоді, коли ні вершина $to$, ні жоден з її нащадків у дереві обходу DFS не має зворотного ребра до вершини $v$ або до будь-кого з її предків. Справді, ця умова означає, що з $v$ до $to$ немає іншого шляху, крім ребра $(v, to)$.

Тепер нам треба навчитися ефективно перевіряти цей факт для кожної вершини. Ми скористаємося «часом входу до вершини», який обчислюється під час пошуку в глибину.

Отже, нехай $\mathtt{tin}[v]$ позначає час входу до вершини $v$. Введемо масив $\mathtt{low}$, який дозволить нам зберігати найраніший час входу серед вершин, знайдених під час пошуку DFS, до яких вершина $v$ може дістатися за допомогою одного ребра з себе самої або зі своїх нащадків. Значення $\mathtt{low}[v]$ — це мінімум з $\mathtt{tin}[v]$, часів входу $\mathtt{tin}[p]$ для кожної вершини $p$, з'єднаної з вершиною $v$ зворотним ребром $(v, p)$, та значень $\mathtt{low}[to]$ для кожної вершини $to$, яка є безпосереднім нащадком $v$ у дереві DFS:

$$
\mathtt{low}[v] = \min \left\{
    \begin{array}{l}
    \mathtt{tin}[v] \\ 
    \mathtt{tin}[p]  &\text{ для всіх }p\text{, для яких }(v, p)\text{ — зворотне ребро} \\ 
    \mathtt{low}[to] &\text{ для всіх }to\text{, для яких }(v, to)\text{ — деревне ребро}
    \end{array}
\right\}
$$

Тоді зворотне ребро з вершини $v$ або з одного з її нащадків до одного з її предків існує тоді й лише тоді, коли вершина $v$ має такого нащадка $to$, для якого $\mathtt{low}[to] \leq \mathtt{tin}[v]$. Якщо $\mathtt{low}[to] = \mathtt{tin}[v]$, то зворотне ребро веде безпосередньо до $v$, інакше — до одного з предків $v$.

Таким чином, поточне ребро $(v, to)$ у дереві DFS є мостом тоді й лише тоді, коли $\mathtt{low}[to] > \mathtt{tin}[v]$.

## Реалізація \{#implementation}

У реалізації потрібно розрізняти три випадки: коли ми спускаємося вздовж ребра в дереві DFS, коли ми знаходимо зворотне ребро до предка вершини і коли ми повертаємося до батька вершини. Ось ці випадки:

- $\mathtt{visited}[to] = false$ — ребро є частиною дерева DFS;
- $\mathtt{visited}[to] = true$ && $to \neq parent$ — ребро є зворотним ребром до одного з предків;
- $to = parent$ — ребро веде назад до батька в дереві DFS.

Щоб це реалізувати, нам потрібна функція пошуку в глибину, яка приймає батьківську вершину поточної вершини.

Для випадків кратних ребер треба бути обережними, ігноруючи ребро до батька. Щоб розв'язати цю проблему, ми можемо додати прапорець `parent_skipped`, який гарантує, що ми пропустимо батька лише один раз.

<CodeTabs>

```cpp
void IS_BRIDGE(int v,int to); // якась функція для обробки знайденого мосту
int n; // кількість вершин
vector<vector<int>> adj; // список суміжності графа

vector<bool> visited;
vector<int> tin, low;
int timer;
 
void dfs(int v, int p = -1) {
    visited[v] = true;
    tin[v] = low[v] = timer++;
    bool parent_skipped = false;
    for (int to : adj[v]) {
        if (to == p && !parent_skipped) {
            parent_skipped = true;
            continue;
        }
        if (visited[to]) {
            low[v] = min(low[v], tin[to]);
        } else {
            dfs(to, v);
            low[v] = min(low[v], low[to]);
            if (low[to] > tin[v])
                IS_BRIDGE(v, to);
        }
    }
}
 
void find_bridges() {
    timer = 0;
    visited.assign(n, false);
    tin.assign(n, -1);
    low.assign(n, -1);
    for (int i = 0; i < n; ++i) {
        if (!visited[i])
            dfs(i);
    }
}
```

```python
import sys

# DFS рекурсивний, тож піднімаємо ліміт рекурсії під розмір графа,
# щоб уникнути RecursionError на довгих ланцюгах вершин.
sys.setrecursionlimit(300000)


class BridgeFinder:
    def __init__(self, n, adj):
        self.n = n
        self.adj = adj            # список суміжності
        self.visited = [False] * n
        self.tin = [-1] * n       # час входу до вершини
        self.low = [-1] * n       # найраніший досяжний час входу
        self.timer = 0
        self.bridges = []         # знайдені мости (v, to)

    def is_bridge(self, v, to):
        # обробка знайденого мосту — тут просто зберігаємо його
        self.bridges.append((v, to))

    def _dfs(self, v, p):
        self.visited[v] = True
        self.tin[v] = self.low[v] = self.timer
        self.timer += 1
        parent_skipped = False
        for to in self.adj[v]:
            # пропускаємо ребро до батька лише один раз (кратні ребра)
            if to == p and not parent_skipped:
                parent_skipped = True
                continue
            if self.visited[to]:
                self.low[v] = min(self.low[v], self.tin[to])
            else:
                self._dfs(to, v)
                self.low[v] = min(self.low[v], self.low[to])
                if self.low[to] > self.tin[v]:
                    self.is_bridge(v, to)

    def find_bridges(self):
        for i in range(self.n):
            if not self.visited[i]:
                self._dfs(i, -1)
        return self.bridges
```

```typescript
class BridgeFinder {
    private readonly n: number;
    private readonly adj: number[][];      // список суміжності
    private readonly visited: boolean[];
    private readonly tin: number[];        // час входу до вершини
    private readonly low: number[];        // найраніший досяжний час входу
    private timer = 0;
    private readonly bridges: [number, number][] = [];

    constructor(n: number, adj: number[][]) {
        this.n = n;
        this.adj = adj;
        this.visited = new Array(n).fill(false);
        this.tin = new Array(n).fill(-1);
        this.low = new Array(n).fill(-1);
    }

    private isBridge(v: number, to: number): void {
        // обробка знайденого мосту — тут просто зберігаємо його
        this.bridges.push([v, to]);
    }

    private dfs(v: number, p: number): void {
        this.visited[v] = true;
        this.tin[v] = this.low[v] = this.timer++;
        let parentSkipped = false;
        for (const to of this.adj[v]) {
            // пропускаємо ребро до батька лише один раз (кратні ребра)
            if (to === p && !parentSkipped) {
                parentSkipped = true;
                continue;
            }
            if (this.visited[to]) {
                this.low[v] = Math.min(this.low[v], this.tin[to]);
            } else {
                this.dfs(to, v);
                this.low[v] = Math.min(this.low[v], this.low[to]);
                if (this.low[to] > this.tin[v]) {
                    this.isBridge(v, to);
                }
            }
        }
    }

    findBridges(): [number, number][] {
        for (let i = 0; i < this.n; i++) {
            if (!this.visited[i]) {
                this.dfs(i, -1);
            }
        }
        return this.bridges;
    }
}
```

```go
package main

// BridgeFinder інкапсулює стан пошуку мостів у неорієнтованому графі.
type BridgeFinder struct {
	n       int
	adj     [][]int // список суміжності
	visited []bool
	tin     []int // час входу до вершини
	low     []int // найраніший досяжний час входу
	timer   int
	bridges [][2]int // знайдені мости (v, to)
}

func NewBridgeFinder(n int, adj [][]int) *BridgeFinder {
	tin := make([]int, n)
	low := make([]int, n)
	for i := range tin {
		tin[i] = -1
		low[i] = -1
	}
	return &BridgeFinder{
		n:       n,
		adj:     adj,
		visited: make([]bool, n),
		tin:     tin,
		low:     low,
	}
}

func (bf *BridgeFinder) isBridge(v, to int) {
	// обробка знайденого мосту — тут просто зберігаємо його
	bf.bridges = append(bf.bridges, [2]int{v, to})
}

func (bf *BridgeFinder) dfs(v, p int) {
	bf.visited[v] = true
	bf.tin[v] = bf.timer
	bf.low[v] = bf.timer
	bf.timer++
	parentSkipped := false
	for _, to := range bf.adj[v] {
		// пропускаємо ребро до батька лише один раз (кратні ребра)
		if to == p && !parentSkipped {
			parentSkipped = true
			continue
		}
		if bf.visited[to] {
			if bf.tin[to] < bf.low[v] {
				bf.low[v] = bf.tin[to]
			}
		} else {
			bf.dfs(to, v)
			if bf.low[to] < bf.low[v] {
				bf.low[v] = bf.low[to]
			}
			if bf.low[to] > bf.tin[v] {
				bf.isBridge(v, to)
			}
		}
	}
}

func (bf *BridgeFinder) FindBridges() [][2]int {
	for i := 0; i < bf.n; i++ {
		if !bf.visited[i] {
			bf.dfs(i, -1)
		}
	}
	return bf.bridges
}
```

</CodeTabs>

Головна функція — `find_bridges`; вона виконує необхідну ініціалізацію і запускає пошук у глибину в кожній компоненті зв'язності графа.

Функція `IS_BRIDGE(a, b)` — це якась функція, що оброблятиме той факт, що ребро $(a, b)$ є мостом, наприклад, виводитиме його.

Зауважимо, що ця реалізація працює некоректно, якщо в графі є кратні ребра, оскільки вона їх ігнорує. Звісно, кратні ребра ніколи не будуть частиною відповіді, тож `IS_BRIDGE` може додатково перевіряти, що повідомлений міст не є кратним ребром. Як альтернатива, можна передавати у `dfs` індекс ребра, використаного для входу до вершини, замість батьківської вершини (і зберігати індекси всіх вершин).

## Задачі для практики \{#practice-problems}

- [UVA #796 "Critical Links"](http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=737) [difficulty: low]
- [UVA #610 "Street Directions"](http://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=551) [difficulty: medium]
- [Case of the Computer Network (Codeforces Round #310 Div. 1 E)](http://codeforces.com/problemset/problem/555/E) [difficulty: hard]
* [UVA 12363 - Hedge Mazes](https://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=3785)
* [UVA 315 - Network](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=251)
* [GYM - Computer Network (J)](http://codeforces.com/gym/100114)
* [SPOJ - King Graffs Defense](http://www.spoj.com/problems/GRAFFDEF/)
* [SPOJ - Critical Edges](http://www.spoj.com/problems/EC_P/)
* [Codeforces - Break Up](http://codeforces.com/contest/700/problem/C)
* [Codeforces - Tourist Reform](http://codeforces.com/contest/732/problem/F)
* [Codeforces - Non-academic problem](https://codeforces.com/contest/1986/problem/F)

## Відеоматеріали \{#video}

- [G-55. Bridges in Graph - Using Tarjan's Algorithm — take U forward](https://www.youtube.com/watch?v=qrAub5z8FeA) (23 хв, англійською)
