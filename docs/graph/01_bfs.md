# 0-1 BFS

Добре відомо, що знайти найкоротші шляхи від однієї стартової вершини до всіх інших можна за $O(|E|)$ за допомогою [пошуку в ширину (BFS)](breadth-first-search.md) у **незваженому графі**, тобто відстань — це мінімальна кількість ребер, які потрібно пройти від джерела до іншої вершини.
Такий граф можна також трактувати як зважений, у якому кожне ребро має вагу $1$.
Якщо ж не всі ребра графа мають однакову вагу, нам потрібен більш загальний алгоритм, як-от [Дейкстри](dijkstra.md), що працює за час $O(|V|^2 + |E|)$ або $O(|E| \log |V|)$.

Проте якщо ваги обмежені сильніше, ми часто можемо досягти кращого результату.
У цій статті ми покажемо, як за допомогою BFS розв'язати задачу SSSP (найкоротший шлях від однієї вершини, single-source shortest path) за $O(|E|)$, якщо вага кожного ребра дорівнює $0$ або $1$.

:::tip[Коли підходить цей алгоритм?]
- Вага кожного ребра дорівнює рівно $0$ або $1$? *(якщо всі ваги однакові → [BFS](breadth-first-search.md); якщо ваги довільні невід'ємні → [Дейкстра](dijkstra.md))*
- Усі ваги невід'ємні (немає від'ємних ребер чи циклів)? *(якщо ні → [Беллман-Форд](bellman_ford.md))*
- Ваги обмежені малою константою $k$, а не лише $\{0,1\}$? *(тоді підходить узагальнення — алгоритм Діала, описаний нижче)*
:::

## Алгоритм \{#algorithm}

Розробити цей алгоритм ми можемо, уважно вивчивши алгоритм Дейкстри й поміркувавши над наслідками, які накладає наш особливий граф.
Загальний вигляд алгоритму Дейкстри такий (тут для <Term tip="Структура даних, з якої завжди дістають елемент з найменшим (або найбільшим) значенням ключа, а не той, що додали першим, як у звичайній черзі.">черги з пріоритетом</Term> використано `set`):

<CodeTabs>

```cpp
d.assign(n, INF);
d[s] = 0;
set<pair<int, int>> q;
q.insert({0, s});
while (!q.empty()) {
    int v = q.begin()->second;
    q.erase(q.begin());

    for (auto edge : adj[v]) {
        int u = edge.first;
        int w = edge.second;

        if (d[v] + w < d[u]) {
            q.erase({d[u], u});
            d[u] = d[v] + w;
            q.insert({d[u], u});
        }
    }
}
```

```python
d = [INF] * n
d[s] = 0
# збалансоване дерево пар (відстань, вершина) як черга з пріоритетом
q = sortedcontainers.SortedList([(0, s)])
while q:
    v = q.pop(0)[1]  # вершина з найменшою відстанню

    for u, w in adj[v]:
        if d[v] + w < d[u]:
            q.discard((d[u], u))
            d[u] = d[v] + w
            q.add((d[u], u))
```

```typescript
const d: number[] = new Array(n).fill(INF);
d[s] = 0;
// впорядкована множина пар (відстань, вершина) як черга з пріоритетом
const q = new SortedSet<[number, number]>([[0, s]]);
while (q.size > 0) {
    const v = q.first()![1]; // вершина з найменшою відстанню
    q.delete(q.first()!);

    for (const [u, w] of adj[v]) {
        if (d[v] + w < d[u]) {
            q.delete([d[u], u]);
            d[u] = d[v] + w;
            q.add([d[u], u]);
        }
    }
}
```

```go
d := make([]int, n)
for i := range d {
    d[i] = INF
}
d[s] = 0
// збалансоване дерево пар (відстань, вершина) як черга з пріоритетом
q := newSortedSet()
q.Insert(pair{0, s})
for q.Len() > 0 {
    v := q.Min().second // вершина з найменшою відстанню
    q.Erase(q.Min())

    for _, edge := range adj[v] {
        u, w := edge.first, edge.second
        if d[v]+w < d[u] {
            q.Erase(pair{d[u], u})
            d[u] = d[v] + w
            q.Insert(pair{d[u], u})
        }
    }
}
```

</CodeTabs>

Ми можемо помітити, що різниця між відстанями від джерела `s` до двох інших вершин у черзі відрізняється щонайбільше на одиницю.
Зокрема, ми знаємо, що $d[v] \le d[u] \le d[v] + 1$ для кожного $u \in Q$.
Причина цього в тому, що під час кожної ітерації ми додаємо до черги лише вершини з рівною відстанню або з відстанню, більшою на одиницю.
Припустимо, що в черзі існує така $u$, що $d[u] - d[v] > 1$; тоді $u$ мала би бути додана до черги через іншу вершину $t$ з $d[t] \ge d[u] - 1 > d[v]$.
Однак це неможливо, оскільки алгоритм Дейкстри перебирає вершини в порядку зростання відстані.

Це означає, що порядок черги виглядає так:

$$
Q = \underbrace{v}_{d[v]}, \dots, \underbrace{u}_{d[v]}, \underbrace{m}_{d[v]+1} \dots \underbrace{n}_{d[v]+1}
$$

Ця структура настільки проста, що нам не потрібна справжня черга з пріоритетом, тобто використання збалансованого бінарного дерева було б надмірністю.
Ми можемо просто скористатися звичайною чергою й додавати нові вершини на початок, якщо відповідне ребро має вагу $0$, тобто якщо $d[u] = d[v]$, або в кінець, якщо ребро має вагу $1$, тобто якщо $d[u] = d[v] + 1$.
У такий спосіб черга весь час залишається відсортованою.

<CodeTabs>

```cpp
vector<int> d(n, INF);
d[s] = 0;
deque<int> q;
q.push_front(s);
while (!q.empty()) {
    int v = q.front();
    q.pop_front();
    for (auto edge : adj[v]) {
        int u = edge.first;
        int w = edge.second;
        if (d[v] + w < d[u]) {
            d[u] = d[v] + w;
            if (w == 1)
                q.push_back(u);
            else
                q.push_front(u);
        }
    }
}
```

```python
d = [INF] * n
d[s] = 0
# collections.deque дає O(1) для обох кінців
q = deque([s])
while q:
    v = q.popleft()
    for u, w in adj[v]:
        if d[v] + w < d[u]:
            d[u] = d[v] + w
            if w == 1:
                q.append(u)      # вага 1 — у кінець
            else:
                q.appendleft(u)  # вага 0 — на початок
```

```typescript
const d: number[] = new Array(n).fill(INF);
d[s] = 0;
// У TypeScript немає вбудованої деки. Масив з head-індексом дає амортизований
// O(1) на видалення з фронту (без O(n)-зсуву, як у Array.prototype.shift),
// але вставку на початок (вага 0) робимо в окремий стек frontStack —
// інакше unshift був би O(n). Спочатку віддаємо елементи з frontStack.
const back: number[] = [s];
let head = 0;            // індекс фронту в back
const frontStack: number[] = [];
while (head < back.length || frontStack.length > 0) {
    const v = frontStack.length > 0 ? frontStack.pop()! : back[head++];
    for (const [u, w] of adj[v]) {
        if (d[v] + w < d[u]) {
            d[u] = d[v] + w;
            if (w === 1)
                back.push(u);        // вага 1 — у кінець, O(1)
            else
                frontStack.push(u);  // вага 0 — на початок, O(1)
        }
    }
}
```

```go
d := make([]int, n)
for i := range d {
    d[i] = INF
}
d[s] = 0
// Дека на кільцевому буфері: O(1) для PushFront/PushBack/PopFront.
q := newDeque()
q.PushFront(s)
for q.Len() > 0 {
    v := q.PopFront()
    for _, edge := range adj[v] {
        u, w := edge.first, edge.second
        if d[v]+w < d[u] {
            d[u] = d[v] + w
            if w == 1 {
                q.PushBack(u) // вага 1 — у кінець
            } else {
                q.PushFront(u) // вага 0 — на початок
            }
        }
    }
}
```

</CodeTabs>

## Алгоритм Діала \{#dials-algorithm}

Ми можемо розширити цей підхід ще далі, якщо дозволимо ребрам мати більші ваги.
Якщо кожне ребро графа має вагу $\le k$, то відстані вершин у черзі відрізнятимуться від відстані $v$ до джерела щонайбільше на $k$.
Тож ми можемо тримати $k + 1$ кошиків для вершин у черзі, і щоразу, коли кошик, що відповідає найменшій відстані, спорожнюється, ми робимо циклічний зсув, щоб отримати кошик з наступною більшою відстанню.
Це розширення називається **алгоритмом Діала**.

## Задачі для практики \{#practice-problems}

- [Labyrinth](https://codeforces.com/contest/1063/problem/B)
- [KATHTHI](http://www.spoj.com/problems/KATHTHI/)
- [DoNotTurn](https://community.topcoder.com/stat?c=problem_statement&pm=10337)
- [Ocean Currents](https://onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=2620)
- [Olya and Energy Drinks](https://codeforces.com/problemset/problem/877/D)
- [Three States](https://codeforces.com/problemset/problem/590/C)
- [Colliding Traffic](https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=2621)
- [CHamber of Secrets](https://codeforces.com/problemset/problem/173/B)
- [Spiral Maximum](https://codeforces.com/problemset/problem/173/C)
- [Minimum Cost to Make at Least One Valid Path in a Grid](https://leetcode.com/problems/minimum-cost-to-make-at-least-one-valid-path-in-a-grid)

## Відеоматеріали \{#video}

<YouTubeEmbed id="oDqjPvD54Ss" title="Breadth First Search Algorithm | Shortest Path | Graph Theory — WilliamFiset" />
