# Пошук точок зчленування в графі за $O(N+M)$

Нам задано неорієнтований граф. Точка зчленування (англ. articulation point, або cut vertex) — це вершина, яка при видаленні разом з інцидентними їй ребрами робить граф незв'язним (точніше, збільшує кількість компонент зв'язності в графі). Завдання полягає в тому, щоб знайти всі точки зчленування в заданому графі.

Описаний тут алгоритм спирається на [пошук у глибину](depth-first-search.md) і має складність $O(N+M)$, де $N$ — кількість вершин, а $M$ — кількість ребер у графі.

:::tip[Коли підходить цей алгоритм?]
- Потрібні саме **вершини**, видалення яких роз'єднує граф? *(якщо потрібні **ребра** → [Пошук мостів](bridge-searching.md))*
- Граф неорієнтований і заданий повністю заздалегідь (статичний), достатньо одного проходу [DFS](depth-first-search.md)?
- Потрібен список точок зчленування, а не числова оцінка стійкості графа? *(якщо потрібна мінімальна кількість вершин для роз'єднання → [Вершинна зв'язність](edge_vertex_connectivity.md))*
:::

## Алгоритм \{#algorithm}

Оберемо довільну вершину графа $root$ і запустимо з неї [пошук у глибину](depth-first-search.md). Зауважимо такий факт (який легко довести):

- Припустимо, ми перебуваємо в DFS і переглядаємо ребра, що виходять з вершини $v\ne root$.
Якщо поточне ребро $(v, to)$ таке, що ані вершина $to$, ані жоден з її нащадків у дереві обходу DFS не має зворотного ребра до жодного з предків $v$, то $v$ є точкою зчленування. Інакше $v$ не є точкою зчленування.

- Розглянемо випадок, що залишився, — $v=root$.
Ця вершина буде точкою зчленування тоді й лише тоді, коли вона має більше ніж одного нащадка в дереві DFS.

Тепер нам потрібно навчитися ефективно перевіряти цей факт для кожної вершини. Скористаємося «часом входу у вершину», який обчислюється під час пошуку в глибину.

Отже, нехай $tin[v]$ позначає час входу у вершину $v$. Введемо масив $low[v]$, який дозволить нам перевіряти цей факт для кожної вершини $v$. $low[v]$ — це мінімум з $tin[v]$, часів входу $tin[p]$ для кожної вершини $p$, що з'єднана з вершиною $v$ зворотним ребром $(v, p)$, і значень $low[to]$ для кожної вершини $to$, яка є безпосереднім нащадком $v$ у дереві DFS:

$$
low[v] = \min \begin{cases} tin[v] \\ tin[p] &\text{ для всіх }p\text{, для яких }(v, p)\text{ — зворотне ребро} \\ low[to]& \text{ для всіх }to\text{, для яких }(v, to)\text{ — ребро дерева} \end{cases}
$$

Тепер, зворотне ребро з вершини $v$ або одного з її нащадків до одного з її предків існує тоді й лише тоді, коли вершина $v$ має нащадка $to$, для якого $low[to] < tin[v]$. Якщо $low[to] = tin[v]$, то зворотне ребро веде безпосередньо до $v$, інакше воно веде до одного з предків $v$.

Таким чином, вершина $v$ у дереві DFS є точкою зчленування тоді й лише тоді, коли $low[to] \geq tin[v]$.

## Реалізація \{#implementation}

У реалізації потрібно розрізняти три випадки: коли ми спускаємося ребром дерева DFS, коли ми знаходимо зворотне ребро до предка вершини і коли ми повертаємося до батька вершини. Ось ці випадки:

- $visited[to] = false$ — ребро є частиною дерева DFS;
- $visited[to] = true$ && $to \neq parent$ — ребро є зворотним до одного з предків;
- $to = parent$ — ребро веде назад до батька в дереві DFS.

Щоб це реалізувати, нам потрібна функція пошуку в глибину, яка приймає батьківську вершину поточної вершини.

<CodeTabs>

```cpp
int n; // кількість вершин
vector<vector<int>> adj; // список суміжності графа

vector<bool> visited;
vector<int> tin, low;
int timer;
 
void dfs(int v, int p = -1) {
    visited[v] = true;
    tin[v] = low[v] = timer++;
    int children=0;
    for (int to : adj[v]) {
        if (to == p) continue;
        if (visited[to]) {
            low[v] = min(low[v], tin[to]);
        } else {
            dfs(to, v);
            low[v] = min(low[v], low[to]);
            if (low[to] >= tin[v] && p!=-1)
                IS_CUTPOINT(v);
            ++children;
        }
    }
    if(p == -1 && children > 1)
        IS_CUTPOINT(v);
}
 
void find_cutpoints() {
    timer = 0;
    visited.assign(n, false);
    tin.assign(n, -1);
    low.assign(n, -1);
    for (int i = 0; i < n; ++i) {
        if (!visited[i])
            dfs (i);
    }
}
```

```python
import sys

# Глибока рекурсія DFS може перевищити типовий ліміт Python (~1000),
# тому збільшуємо ліміт стека викликів для великих графів.
sys.setrecursionlimit(300000)

n = 0  # кількість вершин
adj = []  # список суміжності графа

visited = []
tin = []
low = []
timer = 0


def dfs(v, p=-1):
    global timer
    visited[v] = True
    tin[v] = low[v] = timer
    timer += 1
    children = 0
    for to in adj[v]:
        if to == p:
            continue
        if visited[to]:
            low[v] = min(low[v], tin[to])
        else:
            dfs(to, v)
            low[v] = min(low[v], low[to])
            if low[to] >= tin[v] and p != -1:
                is_cutpoint(v)
            children += 1
    if p == -1 and children > 1:
        is_cutpoint(v)


def find_cutpoints():
    global timer, visited, tin, low
    timer = 0
    visited = [False] * n
    tin = [-1] * n
    low = [-1] * n
    for i in range(n):
        if not visited[i]:
            dfs(i)
```

```typescript
let n: number; // кількість вершин
let adj: number[][]; // список суміжності графа

let visited: boolean[];
let tin: number[];
let low: number[];
let timer: number;

function dfs(v: number, p: number = -1): void {
    visited[v] = true;
    tin[v] = low[v] = timer++;
    let children = 0;
    for (const to of adj[v]) {
        if (to === p) continue;
        if (visited[to]) {
            low[v] = Math.min(low[v], tin[to]);
        } else {
            dfs(to, v);
            low[v] = Math.min(low[v], low[to]);
            if (low[to] >= tin[v] && p !== -1)
                isCutpoint(v);
            ++children;
        }
    }
    if (p === -1 && children > 1)
        isCutpoint(v);
}

function findCutpoints(): void {
    timer = 0;
    visited = new Array(n).fill(false);
    tin = new Array(n).fill(-1);
    low = new Array(n).fill(-1);
    for (let i = 0; i < n; ++i) {
        if (!visited[i])
            dfs(i);
    }
}
```

```go
var n int           // кількість вершин
var adj [][]int     // список суміжності графа

var visited []bool
var tin, low []int
var timer int

func dfs(v, p int) {
    visited[v] = true
    tin[v] = timer
    low[v] = timer
    timer++
    children := 0
    for _, to := range adj[v] {
        if to == p {
            continue
        }
        if visited[to] {
            low[v] = min(low[v], tin[to])
        } else {
            dfs(to, v)
            low[v] = min(low[v], low[to])
            if low[to] >= tin[v] && p != -1 {
                isCutpoint(v)
            }
            children++
        }
    }
    if p == -1 && children > 1 {
        isCutpoint(v)
    }
}

func findCutpoints() {
    timer = 0
    visited = make([]bool, n)
    tin = make([]int, n)
    low = make([]int, n)
    for i := range tin {
        tin[i] = -1
        low[i] = -1
    }
    for i := 0; i < n; i++ {
        if !visited[i] {
            dfs(i, -1) // корінь DFS не має батька
        }
    }
}
```

</CodeTabs>

Головна функція — `find_cutpoints`; вона виконує необхідну ініціалізацію і запускає пошук у глибину в кожній компоненті зв'язності графа.

Функція `IS_CUTPOINT(a)` — це деяка функція, яка обробляє той факт, що вершина $a$ є точкою зчленування, наприклад, виводить її (зверніть увагу, що вона може бути викликана для однієї вершини кілька разів).

## Задачі для практики \{#practice-problems}

- [UVA #10199 "Tourist Guide"](http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&category=13&page=show_problem&problem=1140) [difficulty: low]
- [UVA #315 "Network"](http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&category=5&page=show_problem&problem=251) [difficulty: low]
- [SPOJ - Submerging Islands](http://www.spoj.com/problems/SUBMERGE/)
- [Codeforces - Cutting Figure](https://codeforces.com/problemset/problem/193/A)

## Відеоматеріали \{#video}

<YouTubeEmbed id="jFZsDDB0-vo" title="5.2 Articulation Point and Biconnected Components — Abdul Bari" />
