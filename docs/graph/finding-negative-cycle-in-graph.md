# Пошук циклу від'ємної ваги у графі

Нам задано орієнтований зважений граф $G$ з $N$ вершинами та $M$ ребрами. Потрібно знайти в ньому будь-який цикл від'ємної ваги, якщо такий цикл існує.

В іншому формулюванні задачі потрібно знайти всі пари вершин, між якими існує шлях скільки завгодно малої ваги.

Для розв'язання цих двох варіацій задачі зручно використовувати різні алгоритми, тож тут ми розглянемо обидва.

:::tip[Коли підходить цей алгоритм?]
- Граф зважений і потрібно знайти цикл саме **від'ємної ваги**? *(якщо шукають будь-який цикл у незваженому графі → [Пошук циклу](finding-cycle.md))*
- Достатньо знайти один від'ємний цикл (досяжний з джерела чи будь-де)? *(використовуйте [Беллман-Форд](bellman_ford.md))*
- Потрібні **всі** пари вершин зі шляхом скільки завгодно малої ваги? *(тоді → варіант на основі [Флойда-Воршелла](all-pair-shortest-path-floyd-warshall.md) нижче)*
:::

## Використання алгоритму Беллмана-Форда \{#using-bellman-ford-algorithm}

Алгоритм Беллмана-Форда дозволяє перевірити, чи існує у графі цикл від'ємної ваги, і, якщо такий існує, знайти один із цих циклів.

Подробиці алгоритму описано у статті про алгоритм [Беллмана-Форда](bellman_ford.md).
Тут ми опишемо лише його застосування до цієї задачі.

Стандартна реалізація алгоритму Беллмана-Форда шукає цикл від'ємної ваги, досяжний з деякої стартової вершини $v$; однак алгоритм можна модифікувати так, щоб він шукав просто будь-який цикл від'ємної ваги у графі.
Для цього нам потрібно встановити всі відстані $d[i]$ рівними нулю, а не нескінченності — ніби ми шукаємо найкоротший шлях одночасно з усіх вершин; на коректність виявлення циклу від'ємної ваги це не впливає.

Виконаємо $N$ ітерацій алгоритму Беллмана-Форда. Якщо на останній ітерації не було жодних змін, то у графі немає циклу від'ємної ваги. В іншому разі візьмемо вершину, відстань до якої змінилася, і будемо рухатися від неї через її предків, доки не знайдемо цикл. Цей цикл і буде шуканим циклом від'ємної ваги.

### Реалізація \{#implementation}

<CodeTabs>

```cpp
struct Edge {
    int a, b, cost;
};
 
int n;
vector<Edge> edges;
const int INF = 1000000000;
 
void solve() {
    vector<int> d(n, 0);
    vector<int> p(n, -1);
    int x;
 
    for (int i = 0; i < n; ++i) {
        x = -1;
        for (Edge e : edges) {
            if (d[e.a] + e.cost < d[e.b]) {
                d[e.b] = max(-INF, d[e.a] + e.cost);
                p[e.b] = e.a;
                x = e.b;
            }
        }
    }
 
    if (x == -1) {
        cout << "No negative cycle found.";
    } else {
        for (int i = 0; i < n; ++i)
            x = p[x];
 
        vector<int> cycle;
        for (int v = x;; v = p[v]) {
            cycle.push_back(v);
            if (v == x && cycle.size() > 1)
                break;
        }
        reverse(cycle.begin(), cycle.end());
 
        cout << "Negative cycle: ";
        for (int v : cycle)
            cout << v << ' ';
        cout << endl;
    }
}
```

```python
from dataclasses import dataclass

INF = 1000000000


@dataclass
class Edge:
    a: int
    b: int
    cost: int


n = 0
edges: list[Edge] = []


def solve() -> None:
    d = [0] * n
    p = [-1] * n
    x = -1

    # N ітерацій Беллмана-Форда; усі d[i] = 0 (пошук циклу з будь-якої вершини).
    for _ in range(n):
        x = -1
        for e in edges:
            if d[e.a] + e.cost < d[e.b]:
                d[e.b] = max(-INF, d[e.a] + e.cost)
                p[e.b] = e.a
                x = e.b

    if x == -1:
        print("No negative cycle found.", end="")
    else:
        # Зміщуємося на N кроків назад по предках, щоб гарантовано
        # потрапити всередину циклу.
        for _ in range(n):
            x = p[x]

        cycle: list[int] = []
        v = x
        while True:
            cycle.append(v)
            if v == x and len(cycle) > 1:
                break
            v = p[v]
        cycle.reverse()

        print("Negative cycle: ", end="")
        for v in cycle:
            print(v, end=" ")
        print()
```

```typescript
interface Edge {
    a: number;
    b: number;
    cost: number;
}

const INF = 1000000000;

let n = 0;
let edges: Edge[] = [];

function solve(): void {
    const d: number[] = new Array(n).fill(0);
    const p: number[] = new Array(n).fill(-1);
    let x = -1;

    // N ітерацій Беллмана-Форда; усі d[i] = 0 (пошук циклу з будь-якої вершини).
    for (let i = 0; i < n; ++i) {
        x = -1;
        for (const e of edges) {
            if (d[e.a] + e.cost < d[e.b]) {
                d[e.b] = Math.max(-INF, d[e.a] + e.cost);
                p[e.b] = e.a;
                x = e.b;
            }
        }
    }

    if (x === -1) {
        process.stdout.write("No negative cycle found.");
    } else {
        // Зміщуємося на N кроків назад по предках, щоб гарантовано
        // потрапити всередину циклу.
        for (let i = 0; i < n; ++i)
            x = p[x];

        const cycle: number[] = [];
        for (let v = x; ; v = p[v]) {
            cycle.push(v);
            if (v === x && cycle.length > 1)
                break;
        }
        cycle.reverse();

        process.stdout.write("Negative cycle: ");
        for (const v of cycle)
            process.stdout.write(v + " ");
        process.stdout.write("\n");
    }
}
```

```go
package main

import "fmt"

const INF = 1000000000

type Edge struct {
	a, b, cost int
}

var (
	n     int
	edges []Edge
)

func solve() {
	d := make([]int, n)
	p := make([]int, n)
	for i := range p {
		p[i] = -1
	}
	x := -1

	// N ітерацій Беллмана-Форда; усі d[i] = 0 (пошук циклу з будь-якої вершини).
	for i := 0; i < n; i++ {
		x = -1
		for _, e := range edges {
			if d[e.a]+e.cost < d[e.b] {
				d[e.b] = max(-INF, d[e.a]+e.cost)
				p[e.b] = e.a
				x = e.b
			}
		}
	}

	if x == -1 {
		fmt.Print("No negative cycle found.")
	} else {
		// Зміщуємося на N кроків назад по предках, щоб гарантовано
		// потрапити всередину циклу.
		for i := 0; i < n; i++ {
			x = p[x]
		}

		var cycle []int
		for v := x; ; v = p[v] {
			cycle = append(cycle, v)
			if v == x && len(cycle) > 1 {
				break
			}
		}
		for i, j := 0, len(cycle)-1; i < j; i, j = i+1, j-1 {
			cycle[i], cycle[j] = cycle[j], cycle[i]
		}

		fmt.Print("Negative cycle: ")
		for _, v := range cycle {
			fmt.Print(v, " ")
		}
		fmt.Println()
	}
}
```

</CodeTabs>

## Використання алгоритму Флойда-Воршелла \{#using-floyd-warshall-algorithm}

Алгоритм Флойда-Воршелла дозволяє розв'язати другу варіацію задачі — знайти всі пари вершин $(i, j)$, між якими немає найкоротшого шляху (тобто існує шлях скільки завгодно малої ваги).

Знову ж таки, подробиці можна знайти у статті про [Флойда-Воршелла](all-pair-shortest-path-floyd-warshall.md), а тут ми опишемо лише його застосування.

Запустимо алгоритм Флойда-Воршелла на графі.
Спочатку $d[v][v] = 0$ для кожної $v$.
Але після виконання алгоритму $d[v][v]$ стане меншим за $0$, якщо існує шлях від'ємної довжини з $v$ до $v$.
Це можна використати, щоб також знайти всі пари вершин, між якими немає найкоротшого шляху.
Ми перебираємо всі пари вершин $(i, j)$ і для кожної пари перевіряємо, чи існує між ними найкоротший шлях.
Для цього перебираємо всі можливості для проміжної вершини $t$.
Пара $(i, j)$ не має найкоротшого шляху, якщо для однієї з проміжних вершин $t$ виконується $d[t][t] < 0$ (тобто $t$ є частиною циклу від'ємної ваги), $t$ досяжна з $i$, а $j$ досяжна з $t$.
Тоді шлях від $i$ до $j$ може мати скільки завгодно малу вагу.
Ми будемо позначати це як `-INF`.

### Реалізація \{#implementation-1}

<CodeTabs>

```cpp
for (int i = 0; i < n; ++i) {
    for (int j = 0; j < n; ++j) {
        for (int t = 0; t < n; ++t) {
            if (d[i][t] < INF && d[t][t] < 0 && d[t][j] < INF)
                d[i][j] = - INF; 
        }
    }
}
```

```python
# Якщо t лежить на циклі від'ємної ваги (d[t][t] < 0), досяжна з i
# та з неї досяжна j, то шлях i -> j може бути скільки завгодно малим.
for i in range(n):
    for j in range(n):
        for t in range(n):
            if d[i][t] < INF and d[t][t] < 0 and d[t][j] < INF:
                d[i][j] = -INF
```

```typescript
// Якщо t лежить на циклі від'ємної ваги (d[t][t] < 0), досяжна з i
// та з неї досяжна j, то шлях i -> j може бути скільки завгодно малим.
for (let i = 0; i < n; ++i) {
    for (let j = 0; j < n; ++j) {
        for (let t = 0; t < n; ++t) {
            if (d[i][t] < INF && d[t][t] < 0 && d[t][j] < INF)
                d[i][j] = -INF;
        }
    }
}
```

```go
// Якщо t лежить на циклі від'ємної ваги (d[t][t] < 0), досяжна з i
// та з неї досяжна j, то шлях i -> j може бути скільки завгодно малим.
for i := 0; i < n; i++ {
	for j := 0; j < n; j++ {
		for t := 0; t < n; t++ {
			if d[i][t] < INF && d[t][t] < 0 && d[t][j] < INF {
				d[i][j] = -INF
			}
		}
	}
}
```

</CodeTabs>

## Задачі для практики \{#practice-problems}

- [UVA: Wormholes](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=499)
- [SPOJ: Alice in Amsterdam, I mean Wonderland](http://www.spoj.com/problems/UCV2013B/)
- [SPOJ: Johnsons Algorithm](http://www.spoj.com/problems/JHNSN/)

## Відеоматеріали \{#video}

<YouTubeEmbed id="lyw4FaxrwHg" title="Bellman Ford Algorithm | Shortest path & Negative cycles | Graph Theory — WilliamFiset" />
