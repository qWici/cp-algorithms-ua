# Розв'язання задачі про призначення за допомогою потоку мінімальної вартості

**Задача про призначення** має два рівносильні формулювання:

   - Дано квадратну матрицю $A[1..N, 1..N]$, потрібно вибрати в ній $N$ елементів так, щоб у кожному рядку та кожному стовпці було вибрано рівно один елемент, а сума значень цих елементів була найменшою.
   - Є $N$ замовлень і $N$ верстатів. Для кожного замовлення відома вартість виготовлення на кожному з верстатів. На кожному верстаті можна виконати лише одне замовлення. Потрібно призначити всі замовлення на верстати так, щоб сумарна вартість була мінімальною.

Тут ми розглянемо розв'язання цієї задачі на основі алгоритму пошуку [потоку мінімальної вартості (min-cost-flow)](min_cost_flow.md), який розв'язує задачу про призначення за $\mathcal{O}(N^3)$.

## Опис \{#description}

Побудуємо двочасткову мережу: є джерело $S$, стік $T$, у першій частці є $N$ вершин (що відповідають рядкам матриці, або замовленням), у другій також є $N$ вершин (що відповідають стовпцям матриці, або верстатам). Між кожною вершиною $i$ першої множини та кожною вершиною $j$ другої множини проведемо ребро з пропускною здатністю 1 і вартістю $A_{ij}$. Із джерела $S$ проведемо ребра до всіх вершин $i$ першої множини з пропускною здатністю 1 і вартістю 0. Із кожної вершини другої множини $j$ проведемо ребро з пропускною здатністю 1 і вартістю 0 до стоку $T$.

У побудованій мережі знаходимо максимальний потік мінімальної вартості. Очевидно, що величина потоку дорівнюватиме $N$. Далі, для кожної вершини $i$ першої частки існує рівно одна вершина $j$ другої частки, така, що потік $F_{ij}$ = 1. Зрештою, це взаємно однозначна відповідність між вершинами першої частки та вершинами другої частки, яка і є розв'язком задачі (оскільки знайдений потік має мінімальну вартість, то сума вартостей вибраних ребер буде найменшою з можливих, що і є критерієм оптимальності).

Складність такого розв'язання задачі про призначення залежить від алгоритму, яким виконується пошук максимального потоку мінімальної вартості. Складність буде $\mathcal{O}(N^3)$ при використанні [Дейкстри](dijkstra.md) або $\mathcal{O}(N^4)$ при використанні [Беллмана-Форда](bellman_ford.md). Це пов'язано з тим, що потік має розмір $O(N)$, і кожна ітерація алгоритму Дейкстри може виконуватися за $O(N^2)$, тоді як для Беллмана-Форда це $O(N^3)$.

## Реалізація \{#implementation}

Наведена тут реалізація доволі громіздка, її напевно можна суттєво скоротити. Вона використовує [алгоритм SPFA](bellman_ford.md) для пошуку найкоротших шляхів.

<CodeTabs>

```cpp
const int INF = 1000 * 1000 * 1000;

vector<int> assignment(vector<vector<int>> a) {
    int n = a.size();
    int m = n * 2 + 2;
    vector<vector<int>> f(m, vector<int>(m));
    int s = m - 2, t = m - 1;
    int cost = 0;
    while (true) {
        vector<int> dist(m, INF);
        vector<int> p(m);
        vector<bool> inq(m, false);
        queue<int> q;
        dist[s] = 0;
        p[s] = -1;
        q.push(s);
        while (!q.empty()) {
            int v = q.front();
            q.pop();
            inq[v] = false;
            if (v == s) {
                for (int i = 0; i < n; ++i) {
                    if (f[s][i] == 0) {
                        dist[i] = 0;
                        p[i] = s;
                        inq[i] = true;
                        q.push(i);
                    }
                }
            } else {
                if (v < n) {
                    for (int j = n; j < n + n; ++j) {
                        if (f[v][j] < 1 && dist[j] > dist[v] + a[v][j - n]) {
                            dist[j] = dist[v] + a[v][j - n];
                            p[j] = v;
                            if (!inq[j]) {
                                q.push(j);
                                inq[j] = true;
                            }
                        }
                    }
                } else {
                    for (int j = 0; j < n; ++j) {
                        if (f[v][j] < 0 && dist[j] > dist[v] - a[j][v - n]) {
                            dist[j] = dist[v] - a[j][v - n];
                            p[j] = v;
                            if (!inq[j]) {
                                q.push(j);
                                inq[j] = true;
                            }
                        }
                    }
                }
            }
        }

        int curcost = INF;
        for (int i = n; i < n + n; ++i) {
            if (f[i][t] == 0 && dist[i] < curcost) {
                curcost = dist[i];
                p[t] = i;
            }
        }
        if (curcost == INF)
            break;
        cost += curcost;
        for (int cur = t; cur != -1; cur = p[cur]) {
            int prev = p[cur];
            if (prev != -1)
                f[cur][prev] = -(f[prev][cur] = 1);
        }
    }

    vector<int> answer(n);
    for (int i = 0; i < n; ++i) {
        for (int j = 0; j < n; ++j) {
            if (f[i][j + n] == 1)
                answer[i] = j;
        }
    }
    return answer;
}
```

```python
from collections import deque

INF = 1000 * 1000 * 1000


def assignment(a: list[list[int]]) -> list[int]:
    n = len(a)
    m = n * 2 + 2            # вершини: 0..n-1 — рядки, n..2n-1 — стовпці
    f = [[0] * m for _ in range(m)]
    s, t = m - 2, m - 1      # джерело та стік
    cost = 0
    while True:
        dist = [INF] * m
        p = [0] * m
        inq = [False] * m
        q = deque()
        dist[s] = 0
        p[s] = -1
        q.append(s)
        # SPFA: пошук найкоротшого шляху від джерела
        while q:
            v = q.popleft()
            inq[v] = False
            if v == s:
                for i in range(n):
                    if f[s][i] == 0:
                        dist[i] = 0
                        p[i] = s
                        inq[i] = True
                        q.append(i)
            else:
                if v < n:
                    # ребро з рядка у стовпець (пряме, вартість A[v][j])
                    for j in range(n, n + n):
                        if f[v][j] < 1 and dist[j] > dist[v] + a[v][j - n]:
                            dist[j] = dist[v] + a[v][j - n]
                            p[j] = v
                            if not inq[j]:
                                q.append(j)
                                inq[j] = True
                else:
                    # зворотне ребро зі стовпця у рядок (вартість -A[j][v])
                    for j in range(n):
                        if f[v][j] < 0 and dist[j] > dist[v] - a[j][v - n]:
                            dist[j] = dist[v] - a[j][v - n]
                            p[j] = v
                            if not inq[j]:
                                q.append(j)
                                inq[j] = True

        # обираємо стовпець з найдешевшим шляхом, ще не з'єднаний зі стоком
        curcost = INF
        for i in range(n, n + n):
            if f[i][t] == 0 and dist[i] < curcost:
                curcost = dist[i]
                p[t] = i
        if curcost == INF:
            break
        cost += curcost
        # пускаємо потік уздовж знайденого шляху
        cur = t
        while cur != -1:
            prev = p[cur]
            if prev != -1:
                f[prev][cur] = 1
                f[cur][prev] = -1
            cur = prev

    answer = [0] * n
    for i in range(n):
        for j in range(n):
            if f[i][j + n] == 1:
                answer[i] = j
    return answer
```

```typescript
const INF = 1000 * 1000 * 1000;

function assignment(a: number[][]): number[] {
    const n = a.length;
    const m = n * 2 + 2;            // вершини: 0..n-1 — рядки, n..2n-1 — стовпці
    const f: number[][] = Array.from({ length: m }, () => new Array(m).fill(0));
    const s = m - 2, t = m - 1;     // джерело та стік
    let cost = 0;
    while (true) {
        const dist = new Array(m).fill(INF);
        const p = new Array(m).fill(0);
        const inq = new Array(m).fill(false);
        const q: number[] = [];
        dist[s] = 0;
        p[s] = -1;
        q.push(s);
        // SPFA: пошук найкоротшого шляху від джерела
        while (q.length > 0) {
            const v = q.shift()!;
            inq[v] = false;
            if (v === s) {
                for (let i = 0; i < n; ++i) {
                    if (f[s][i] === 0) {
                        dist[i] = 0;
                        p[i] = s;
                        inq[i] = true;
                        q.push(i);
                    }
                }
            } else {
                if (v < n) {
                    // ребро з рядка у стовпець (пряме, вартість A[v][j])
                    for (let j = n; j < n + n; ++j) {
                        if (f[v][j] < 1 && dist[j] > dist[v] + a[v][j - n]) {
                            dist[j] = dist[v] + a[v][j - n];
                            p[j] = v;
                            if (!inq[j]) {
                                q.push(j);
                                inq[j] = true;
                            }
                        }
                    }
                } else {
                    // зворотне ребро зі стовпця у рядок (вартість -A[j][v])
                    for (let j = 0; j < n; ++j) {
                        if (f[v][j] < 0 && dist[j] > dist[v] - a[j][v - n]) {
                            dist[j] = dist[v] - a[j][v - n];
                            p[j] = v;
                            if (!inq[j]) {
                                q.push(j);
                                inq[j] = true;
                            }
                        }
                    }
                }
            }
        }

        // обираємо стовпець з найдешевшим шляхом, ще не з'єднаний зі стоком
        let curcost = INF;
        for (let i = n; i < n + n; ++i) {
            if (f[i][t] === 0 && dist[i] < curcost) {
                curcost = dist[i];
                p[t] = i;
            }
        }
        if (curcost === INF)
            break;
        cost += curcost;
        // пускаємо потік уздовж знайденого шляху
        for (let cur = t; cur !== -1; cur = p[cur]) {
            const prev = p[cur];
            if (prev !== -1) {
                f[prev][cur] = 1;
                f[cur][prev] = -1;
            }
        }
    }

    const answer = new Array(n).fill(0);
    for (let i = 0; i < n; ++i) {
        for (let j = 0; j < n; ++j) {
            if (f[i][j + n] === 1)
                answer[i] = j;
        }
    }
    return answer;
}
```

```go
const INF = 1000 * 1000 * 1000

func assignment(a [][]int) []int {
    n := len(a)
    m := n*2 + 2               // вершини: 0..n-1 — рядки, n..2n-1 — стовпці
    f := make([][]int, m)
    for i := range f {
        f[i] = make([]int, m)
    }
    s, t := m-2, m-1           // джерело та стік
    cost := 0
    for {
        dist := make([]int, m)
        p := make([]int, m)
        inq := make([]bool, m)
        for i := range dist {
            dist[i] = INF
        }
        q := []int{}
        dist[s] = 0
        p[s] = -1
        q = append(q, s)
        // SPFA: пошук найкоротшого шляху від джерела
        for len(q) > 0 {
            v := q[0]
            q = q[1:]
            inq[v] = false
            if v == s {
                for i := 0; i < n; i++ {
                    if f[s][i] == 0 {
                        dist[i] = 0
                        p[i] = s
                        inq[i] = true
                        q = append(q, i)
                    }
                }
            } else {
                if v < n {
                    // ребро з рядка у стовпець (пряме, вартість A[v][j])
                    for j := n; j < n+n; j++ {
                        if f[v][j] < 1 && dist[j] > dist[v]+a[v][j-n] {
                            dist[j] = dist[v] + a[v][j-n]
                            p[j] = v
                            if !inq[j] {
                                q = append(q, j)
                                inq[j] = true
                            }
                        }
                    }
                } else {
                    // зворотне ребро зі стовпця у рядок (вартість -A[j][v])
                    for j := 0; j < n; j++ {
                        if f[v][j] < 0 && dist[j] > dist[v]-a[j][v-n] {
                            dist[j] = dist[v] - a[j][v-n]
                            p[j] = v
                            if !inq[j] {
                                q = append(q, j)
                                inq[j] = true
                            }
                        }
                    }
                }
            }
        }

        // обираємо стовпець з найдешевшим шляхом, ще не з'єднаний зі стоком
        curcost := INF
        for i := n; i < n+n; i++ {
            if f[i][t] == 0 && dist[i] < curcost {
                curcost = dist[i]
                p[t] = i
            }
        }
        if curcost == INF {
            break
        }
        cost += curcost
        // пускаємо потік уздовж знайденого шляху
        for cur := t; cur != -1; cur = p[cur] {
            prev := p[cur]
            if prev != -1 {
                f[prev][cur] = 1
                f[cur][prev] = -1
            }
        }
    }

    answer := make([]int, n)
    for i := 0; i < n; i++ {
        for j := 0; j < n; j++ {
            if f[i][j+n] == 1 {
                answer[i] = j
            }
        }
    }
    return answer
}
```

</CodeTabs>

## Відеоматеріали \{#video}

<YouTubeEmbed id="0tjpC0MCwY8" title="CSE 550: 3.6 The Minimum-Cost-Flow Problem — Joshua J. Daymude" />
