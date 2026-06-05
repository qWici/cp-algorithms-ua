# Максимальний потік — покращений метод push-relabel

Ми модифікуємо [метод push-relabel](push-relabel.md), щоб досягти кращого часу роботи.

## Опис \{#description}

Модифікація надзвичайно проста:
у попередній статті ми обирали вершину з надлишком без жодного особливого правила.
Але виявляється, що якщо ми завжди обиратимемо вершини з **найбільшою висотою** й застосовуватимемо до них операції push і relabel, то складність стане кращою.
Більше того, щоб обрати вершини з найбільшою висотою, нам насправді не потрібні жодні структури даних: ми просто зберігаємо вершини з найбільшою висотою у списку й перераховуємо цей список, щойно всі вони оброблені (тоді до списку додаються вершини вже з меншою висотою), або щоразу, коли з'являється нова вершина з надлишком і більшою висотою (після операції relabel над вершиною).

Попри простоту, ця модифікація значно зменшує складність.
Якщо бути точними, складність отриманого алгоритму дорівнює $O(V E + V^2 \sqrt{E})$, що в найгіршому випадку становить $O(V^3)$.

Цю модифікацію запропонували Cheriyan і Maheshwari у 1989 році.

## Реалізація \{#implementation}

<CodeTabs>

```cpp
const int inf = 1000000000;

int n;
vector<vector<int>> capacity, flow;
vector<int> height, excess;

void push(int u, int v)
{
    int d = min(excess[u], capacity[u][v] - flow[u][v]);
    flow[u][v] += d;
    flow[v][u] -= d;
    excess[u] -= d;
    excess[v] += d;
}

void relabel(int u)
{
    int d = inf;
    for (int i = 0; i < n; i++) {
        if (capacity[u][i] - flow[u][i] > 0)
            d = min(d, height[i]);
    }
    if (d < inf)
        height[u] = d + 1;
}

vector<int> find_max_height_vertices(int s, int t) {
    vector<int> max_height;
    for (int i = 0; i < n; i++) {
        if (i != s && i != t && excess[i] > 0) {
            if (!max_height.empty() && height[i] > height[max_height[0]])
                max_height.clear();
            if (max_height.empty() || height[i] == height[max_height[0]])
                max_height.push_back(i);
        }
    }
    return max_height;
}

int max_flow(int s, int t)
{
    height.assign(n, 0);
    height[s] = n;
    flow.assign(n, vector<int>(n, 0));
    excess.assign(n, 0);
    excess[s] = inf;
    for (int i = 0; i < n; i++) {
        if (i != s)
            push(s, i);
    }

    vector<int> current;
    while (!(current = find_max_height_vertices(s, t)).empty()) {
        for (int i : current) {
            bool pushed = false;
            for (int j = 0; j < n && excess[i]; j++) {
                if (capacity[i][j] - flow[i][j] > 0 && height[i] == height[j] + 1) {
                    push(i, j);
                    pushed = true;
                }
            }
            if (!pushed) {
                relabel(i);
                break;
            }
        }
    }

    return excess[t];
}
```

```python
INF = 10**9

n = 0
capacity = []  # capacity[u][v] — пропускна здатність ребра u→v
flow = []      # flow[u][v] — поточний потік
height = []
excess = []


def push(u: int, v: int) -> None:
    d = min(excess[u], capacity[u][v] - flow[u][v])
    flow[u][v] += d
    flow[v][u] -= d
    excess[u] -= d
    excess[v] += d


def relabel(u: int) -> None:
    d = INF
    for i in range(n):
        if capacity[u][i] - flow[u][i] > 0:
            d = min(d, height[i])
    if d < INF:
        height[u] = d + 1


def find_max_height_vertices(s: int, t: int) -> list[int]:
    max_height: list[int] = []
    for i in range(n):
        if i != s and i != t and excess[i] > 0:
            # Якщо знайшли вищу вершину — скидаємо список
            if max_height and height[i] > height[max_height[0]]:
                max_height.clear()
            if not max_height or height[i] == height[max_height[0]]:
                max_height.append(i)
    return max_height


def max_flow(s: int, t: int) -> int:
    global flow, height, excess
    height = [0] * n
    height[s] = n
    flow = [[0] * n for _ in range(n)]
    excess = [0] * n
    excess[s] = INF
    for i in range(n):
        if i != s:
            push(s, i)

    while True:
        current = find_max_height_vertices(s, t)
        if not current:
            break
        for i in current:
            pushed = False
            j = 0
            while j < n and excess[i]:
                if capacity[i][j] - flow[i][j] > 0 and height[i] == height[j] + 1:
                    push(i, j)
                    pushed = True
                j += 1
            if not pushed:
                relabel(i)
                break

    return excess[t]
```

```typescript
const INF = 1000000000;

let n = 0;
let capacity: number[][] = []; // capacity[u][v] — пропускна здатність ребра u→v
let flow: number[][] = [];     // flow[u][v] — поточний потік
let height: number[] = [];
let excess: number[] = [];

function push(u: number, v: number): void {
  const d = Math.min(excess[u], capacity[u][v] - flow[u][v]);
  flow[u][v] += d;
  flow[v][u] -= d;
  excess[u] -= d;
  excess[v] += d;
}

function relabel(u: number): void {
  let d = INF;
  for (let i = 0; i < n; i++) {
    if (capacity[u][i] - flow[u][i] > 0) {
      d = Math.min(d, height[i]);
    }
  }
  if (d < INF) {
    height[u] = d + 1;
  }
}

function findMaxHeightVertices(s: number, t: number): number[] {
  const maxHeight: number[] = [];
  for (let i = 0; i < n; i++) {
    if (i !== s && i !== t && excess[i] > 0) {
      // Якщо знайшли вищу вершину — скидаємо список
      if (maxHeight.length > 0 && height[i] > height[maxHeight[0]]) {
        maxHeight.length = 0;
      }
      if (maxHeight.length === 0 || height[i] === height[maxHeight[0]]) {
        maxHeight.push(i);
      }
    }
  }
  return maxHeight;
}

function maxFlow(s: number, t: number): number {
  height = new Array(n).fill(0);
  height[s] = n;
  flow = Array.from({ length: n }, () => new Array(n).fill(0));
  excess = new Array(n).fill(0);
  excess[s] = INF;
  for (let i = 0; i < n; i++) {
    if (i !== s) {
      push(s, i);
    }
  }

  let current: number[];
  while ((current = findMaxHeightVertices(s, t)).length > 0) {
    for (const i of current) {
      let pushed = false;
      for (let j = 0; j < n && excess[i]; j++) {
        if (capacity[i][j] - flow[i][j] > 0 && height[i] === height[j] + 1) {
          push(i, j);
          pushed = true;
        }
      }
      if (!pushed) {
        relabel(i);
        break;
      }
    }
  }

  return excess[t];
}
```

```go
const inf = 1000000000

var (
    n        int
    capacity [][]int // capacity[u][v] — пропускна здатність ребра u→v
    flow     [][]int // flow[u][v] — поточний потік
    height   []int
    excess   []int
)

func push(u, v int) {
    d := excess[u]
    if rem := capacity[u][v] - flow[u][v]; rem < d {
        d = rem
    }
    flow[u][v] += d
    flow[v][u] -= d
    excess[u] -= d
    excess[v] += d
}

func relabel(u int) {
    d := inf
    for i := 0; i < n; i++ {
        if capacity[u][i]-flow[u][i] > 0 && height[i] < d {
            d = height[i]
        }
    }
    if d < inf {
        height[u] = d + 1
    }
}

func findMaxHeightVertices(s, t int) []int {
    var maxHeight []int
    for i := 0; i < n; i++ {
        if i != s && i != t && excess[i] > 0 {
            // Якщо знайшли вищу вершину — скидаємо список
            if len(maxHeight) > 0 && height[i] > height[maxHeight[0]] {
                maxHeight = maxHeight[:0]
            }
            if len(maxHeight) == 0 || height[i] == height[maxHeight[0]] {
                maxHeight = append(maxHeight, i)
            }
        }
    }
    return maxHeight
}

func maxFlow(s, t int) int {
    height = make([]int, n)
    height[s] = n
    flow = make([][]int, n)
    for i := range flow {
        flow[i] = make([]int, n)
    }
    excess = make([]int, n)
    excess[s] = inf
    for i := 0; i < n; i++ {
        if i != s {
            push(s, i)
        }
    }

    for {
        current := findMaxHeightVertices(s, t)
        if len(current) == 0 {
            break
        }
        for _, i := range current {
            pushed := false
            for j := 0; j < n && excess[i] != 0; j++ {
                if capacity[i][j]-flow[i][j] > 0 && height[i] == height[j]+1 {
                    push(i, j)
                    pushed = true
                }
            }
            if !pushed {
                relabel(i)
                break
            }
        }
    }

    return excess[t]
}
```

</CodeTabs>

## Відеоматеріали \{#video}

- [A Second Course in Algorithms (Lecture 3: The Push-Relabel Algorithm for Maximum Flow) — Tim Roughgarden Lectures](https://www.youtube.com/watch?v=0hI89H39USg) (76 хв, англійською)
