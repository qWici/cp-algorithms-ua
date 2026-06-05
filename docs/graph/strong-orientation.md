# Сильна орієнтація

**Сильна орієнтація** неорієнтованого графа — це призначення напрямку кожному ребру так, щоб граф став [сильно зв'язним](strongly-connected-components.md).
Тобто після *орієнтації* ми маємо бути спроможні потрапити з будь-якої вершини в будь-яку іншу, рухаючись уздовж орієнтованих ребер.

:::tip[Коли підходить цей алгоритм?]
- Треба **спрямувати ребра** неорієнтованого графа так, щоб граф став сильно зв'язним?
- Граф зв'язний і **без мостів** (за теоремою Роббінса лише такі графи мають сильну орієнтацію)? *(спершу знайди [мости](bridge-searching.md))*
- Потрібна орієнтація з **мінімальною** кількістю компонент сильної зв'язності? *(тоді знадобиться розбиття на [SCC](strongly-connected-components.md))*
:::

## Розв'язок \{#solution}

Зрозуміло, що це можливо не для *кожного* графа.
Розглянемо [міст](bridge-searching.md) у графі.
Ми мусимо призначити йому напрямок, і цим робимо цей міст «прохідним» лише в одному напрямку. Це означає, що ми не можемо потрапити з одного кінця моста в інший, а отже, не можемо зробити граф сильно зв'язним.

Тепер розглянемо [DFS](depth-first-search.md) у зв'язному графі без мостів.
Очевидно, що ми відвідаємо кожну вершину.
А оскільки мостів немає, ми можемо видалити будь-яке ребро <Term tip="дерево з ребер, по яких пошук у глибину вперше заходив у нові вершини; решта ребер графа в нього не входять.">дерева DFS</Term> і все одно зможемо потрапити
з-під цього ребра в точку над ним, скориставшись шляхом, що містить принаймні одне <Term tip="ребро, яке під час DFS веде з вершини назад до її предка вже відвіданою частиною дерева.">зворотне ребро</Term>.
Звідси випливає, що з будь-якої вершини ми можемо дістатися кореня дерева DFS.
Так само з кореня дерева DFS ми можемо відвідати будь-яку обрану вершину.
Ми знайшли сильну орієнтацію!

Іншими словами, щоб сильно орієнтувати зв'язний граф без мостів,
запускаємо на ньому DFS і спрямовуємо ребра дерева DFS від кореня DFS, а
всі інші ребра — від нащадка до предка в дереві DFS.

Твердження про те, що зв'язні графи без мостів — це і є саме ті графи, які мають сильну орієнтацію, називається **теоремою Роббінса**.

## Розширення задачі \{#problem-extension}

Розгляньмо задачу пошуку такої орієнтації графа, щоб кількість <Term tip="у орієнтованому графі — групи вершин, де з кожної можна дійти до будь-якої іншої тієї ж групи і повернутися назад.">компонент сильної зв'язності (SCC)</Term> була мінімальною.

Зрозуміло, що кожну компоненту графа можна розглядати окремо.
Тепер, оскільки сильно орієнтувати можна лише графи без мостів, тимчасово видалимо всі мости.
У результаті ми отримаємо певну кількість компонент без мостів
(а саме *скільки було компонент на початку* + *скільки було мостів*),
і ми знаємо, що кожну з них можна сильно орієнтувати.

Нам дозволено лише орієнтувати ребра, а не видаляти їх, але виявляється, що мости можна орієнтувати довільно.
Звичайно, найпростіший спосіб їх орієнтувати — запустити описаний вище алгоритм без жодних змін на кожній вихідній компоненті зв'язності.

### Реалізація \{#implementation}

Тут на вхід подається *n* — кількість вершин, *m* — кількість ребер, а далі *m* рядків з описом ребер.

На виході в першому рядку — мінімальна кількість SCC, а в другому рядку —
рядок з *m* символів,
де `>` — означає, що відповідне ребро з входу
орієнтоване від лівої вершини до правої (як у вхідних даних),
а `<` — навпаки.

Це алгоритм пошуку мостів, модифікований так, щоб також орієнтувати ребра;
ви так само можете спочатку орієнтувати ребра, а другим кроком підрахувати SCC на орієнтованому графі.

<CodeTabs>

```cpp
vector<vector<pair<int, int>>> adj; // список суміжності - пари вершина і ребро
vector<pair<int, int>> edges;

vector<int> tin, low;
int bridge_cnt;
string orient;
vector<bool> edge_used;
void find_bridges(int v) {
	static int time = 0;
	low[v] = tin[v] = time++;
	for (auto p : adj[v]) {
		if (edge_used[p.second]) continue;
		edge_used[p.second] = true;
		orient[p.second] = v == edges[p.second].first ? '>' : '<';
		int nv = p.first;
		if (tin[nv] == -1) { // якщо nv ще не відвідана
			find_bridges(nv);
			low[v] = min(low[v], low[nv]);
			if (low[nv] > tin[v]) {
				// міст між v і nv
				bridge_cnt++;
			}
		} else {
			low[v] = min(low[v], tin[nv]);
		}
	}
}

int main() {
	int n, m;
	scanf("%d %d", &n, &m);
	adj.resize(n);
	tin.resize(n, -1);
	low.resize(n, -1);
	orient.resize(m);
	edges.resize(m);
	edge_used.resize(m);
	for (int i = 0; i < m; i++) {
		int a, b;
		scanf("%d %d", &a, &b);
		a--; b--;
		adj[a].push_back({b, i});
		adj[b].push_back({a, i});
		edges[i] = {a, b};
	}
	int comp_cnt = 0;
	for (int v = 0; v < n; v++) {
		if (tin[v] == -1) {
			comp_cnt++;
			find_bridges(v);
		}
	}
	printf("%d\n%s\n", comp_cnt + bridge_cnt, orient.c_str());
}
```

```python
import sys


def main() -> None:
    # Глибина рекурсії DFS може сягати кількості вершин, тому піднімаємо
    # ліміт рекурсії Python (типово ~1000), інакше глибокий ланцюг впаде.
    sys.setrecursionlimit(300000)

    data = sys.stdin.buffer.read().split()
    idx = 0
    n = int(data[idx]); idx += 1
    m = int(data[idx]); idx += 1

    adj: list[list[tuple[int, int]]] = [[] for _ in range(n)]  # пари (вершина, ребро)
    edges: list[tuple[int, int]] = []
    for i in range(m):
        a = int(data[idx]) - 1; idx += 1
        b = int(data[idx]) - 1; idx += 1
        adj[a].append((b, i))
        adj[b].append((a, i))
        edges.append((a, b))

    tin = [-1] * n
    low = [-1] * n
    orient = ['?'] * m
    edge_used = [False] * m
    timer = 0
    bridge_cnt = 0

    def find_bridges(v: int) -> None:
        nonlocal timer, bridge_cnt
        low[v] = tin[v] = timer
        timer += 1
        for nv, ei in adj[v]:
            if edge_used[ei]:
                continue
            edge_used[ei] = True
            orient[ei] = '>' if v == edges[ei][0] else '<'
            if tin[nv] == -1:  # якщо nv ще не відвідана
                find_bridges(nv)
                low[v] = min(low[v], low[nv])
                if low[nv] > tin[v]:
                    # міст між v і nv
                    bridge_cnt += 1
            else:
                low[v] = min(low[v], tin[nv])

    comp_cnt = 0
    for v in range(n):
        if tin[v] == -1:
            comp_cnt += 1
            find_bridges(v)

    print(comp_cnt + bridge_cnt)
    print(''.join(orient))


if __name__ == "__main__":
    main()
```

```typescript
// Зчитуємо весь вхід зі stdin і розбиваємо на числа
const tokens = require("fs")
  .readFileSync(0, "utf8")
  .split(/\s+/)
  .filter((s: string) => s.length > 0);
let pos = 0;
const next = (): number => Number(tokens[pos++]);

const n = next();
const m = next();

const adj: Array<Array<[number, number]>> = Array.from({ length: n }, () => []); // пари [вершина, ребро]
const edges: Array<[number, number]> = [];
for (let i = 0; i < m; i++) {
  const a = next() - 1;
  const b = next() - 1;
  adj[a].push([b, i]);
  adj[b].push([a, i]);
  edges.push([a, b]);
}

const tin = new Array<number>(n).fill(-1);
const low = new Array<number>(n).fill(-1);
const orient = new Array<string>(m).fill("?");
const edgeUsed = new Array<boolean>(m).fill(false);
let timer = 0;
let bridgeCnt = 0;

function findBridges(v: number): void {
  low[v] = tin[v] = timer++;
  for (const [nv, ei] of adj[v]) {
    if (edgeUsed[ei]) continue;
    edgeUsed[ei] = true;
    orient[ei] = v === edges[ei][0] ? ">" : "<";
    if (tin[nv] === -1) { // якщо nv ще не відвідана
      findBridges(nv);
      low[v] = Math.min(low[v], low[nv]);
      if (low[nv] > tin[v]) {
        // міст між v і nv
        bridgeCnt++;
      }
    } else {
      low[v] = Math.min(low[v], tin[nv]);
    }
  }
}

let compCnt = 0;
for (let v = 0; v < n; v++) {
  if (tin[v] === -1) {
    compCnt++;
    findBridges(v);
  }
}

console.log(compCnt + bridgeCnt);
console.log(orient.join(""));
```

```go
package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

type pair struct {
	to, edge int // вершина і ребро
}

var (
	adj       [][]pair
	edges     [][2]int
	tin, low  []int
	orient    []byte
	edgeUsed  []bool
	timer     int
	bridgeCnt int
)

func findBridges(v int) {
	low[v] = timer
	tin[v] = timer
	timer++
	for _, p := range adj[v] {
		if edgeUsed[p.edge] {
			continue
		}
		edgeUsed[p.edge] = true
		if v == edges[p.edge][0] {
			orient[p.edge] = '>'
		} else {
			orient[p.edge] = '<'
		}
		nv := p.to
		if tin[nv] == -1 { // якщо nv ще не відвідана
			findBridges(nv)
			if low[nv] < low[v] {
				low[v] = low[nv]
			}
			if low[nv] > tin[v] {
				// міст між v і nv
				bridgeCnt++
			}
		} else if tin[nv] < low[v] {
			low[v] = tin[nv]
		}
	}
}

func main() {
	reader := bufio.NewReader(os.Stdin)
	var n, m int
	fmt.Fscan(reader, &n, &m)

	adj = make([][]pair, n)
	edges = make([][2]int, m)
	tin = make([]int, n)
	low = make([]int, n)
	orient = make([]byte, m)
	edgeUsed = make([]bool, m)
	for i := range tin {
		tin[i] = -1
		low[i] = -1
	}
	for i := 0; i < m; i++ {
		var a, b int
		fmt.Fscan(reader, &a, &b)
		a--
		b--
		adj[a] = append(adj[a], pair{b, i})
		adj[b] = append(adj[b], pair{a, i})
		edges[i] = [2]int{a, b}
	}

	compCnt := 0
	for v := 0; v < n; v++ {
		if tin[v] == -1 {
			compCnt++
			findBridges(v)
		}
	}

	var sb strings.Builder
	sb.WriteString(fmt.Sprintf("%d\n", compCnt+bridgeCnt))
	sb.Write(orient)
	sb.WriteByte('\n')
	fmt.Print(sb.String())
}
```

</CodeTabs>

## Задачі для практики \{#practice-problems}

* [26th Polish OI - Osiedla](https://szkopul.edu.pl/problemset/problem/nldsb4EW1YuZykBlf4lcZL1Y/site/)
