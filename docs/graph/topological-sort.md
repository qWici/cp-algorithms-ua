# Топологічне сортування

Нам задано орієнтований граф з $n$ вершинами та $m$ ребрами.
Потрібно знайти **порядок вершин** такий, щоб кожне ребро вело від вершини з меншим індексом до вершини з більшим.

Іншими словами, ми хочемо знайти перестановку вершин (**топологічний порядок**), яка відповідає порядку, заданому всіма ребрами графа.

Ось приклад заданого графа разом із його топологічним порядком:

<center> <img src="/img/docs/graph/topological_1.png" alt="example directed graph" /> <img src="/img/docs/graph/topological_2.png" alt="one topological order" /> </center>

Топологічний порядок може бути **неоднозначним** (наприклад, якщо існують три вершини $a$, $b$, $c$, для яких є шляхи з $a$ до $b$ і з $a$ до $c$, але немає шляхів з $b$ до $c$ чи з $c$ до $b$).
Граф у прикладі також має кілька топологічних порядків, ось другий топологічний порядок:
<center> <img src="/img/docs/graph/topological_3.png" alt="second topological order" /> </center>

Топологічний порядок може й **не існувати** взагалі.
Він існує лише тоді, коли орієнтований граф не містить циклів.
Інакше виникає суперечність: якщо є цикл, що містить вершини $a$ і $b$, то $a$ має мати менший індекс, ніж $b$ (оскільки з $a$ можна дістатися до $b$), і водночас більший (оскільки з $b$ можна дістатися до $a$).
Алгоритм, описаний у цій статті, також показує конструктивно, що кожен ациклічний орієнтований граф містить щонайменше один топологічний порядок.

Поширена задача, у якій виникає топологічне сортування, така. Є $n$ змінних з невідомими значеннями. Для деяких змінних відомо, що одна з них менша за іншу. Потрібно перевірити, чи не суперечливі ці обмеження, і якщо ні — вивести змінні у зростаючому порядку (якщо можливих відповідей кілька, вивести будь-яку з них). Легко помітити, що це саме задача про знаходження топологічного порядку графа з $n$ вершинами.

## Алгоритм \{#the-algorithm}

Щоб розв'язати цю задачу, ми скористаємося [пошуком у глибину](depth-first-search.md).

Припустимо, що граф ациклічний. Що робить пошук у глибину?

Стартуючи з деякої вершини $v$, DFS намагається пройти вздовж усіх ребер, що виходять з $v$.
Він зупиняється на тих ребрах, кінці яких уже були відвідані раніше, і проходить вздовж решти ребер, рекурсивно продовжуючи з їхніх кінців.

Таким чином, до моменту, коли виклик функції $\text{dfs}(v)$ завершився, усі вершини, досяжні з $v$, були відвідані пошуком безпосередньо (через одне ребро) або опосередковано.

Додаваймо вершину $v$ до списку, коли завершуємо $\text{dfs}(v)$. Оскільки всі досяжні вершини вже відвідані, вони вже будуть у списку на момент, коли ми додаємо $v$.
Зробімо це для кожної вершини графа за допомогою одного або кількох запусків пошуку у глибину.
Для кожного орієнтованого ребра $v \rightarrow u$ у графі $u$ з'явиться в цьому списку раніше за $v$, бо $u$ досяжна з $v$.
Отже, якщо ми просто позначимо вершини в цьому списку числами $n-1, n-2, \dots, 1, 0$, то знайдемо топологічний порядок графа.
Іншими словами, цей список представляє обернений топологічний порядок.

Ці пояснення можна також подати в термінах часів виходу алгоритму DFS.
Час виходу для вершини $v$ — це момент, у який завершився виклик функції $\text{dfs}(v)$ (часи можна нумерувати від $0$ до $n-1$).
Легко зрозуміти, що час виходу будь-якої вершини $v$ завжди більший за час виходу будь-якої досяжної з неї вершини (оскільки вони були відвідані або перед викликом $\text{dfs}(v)$, або під час нього). Отже, шуканим топологічним порядком є вершини у спадному порядку їхніх часів виходу.

## Реалізація \{#implementation}

Ось реалізація, яка припускає, що граф ациклічний, тобто шуканий топологічний порядок існує. За потреби ви легко можете перевірити, що граф ациклічний, як описано в статті про [пошук у глибину](depth-first-search.md).

<CodeTabs>

```cpp
int n; // кількість вершин
vector<vector<int>> adj; // список суміжності графа
vector<bool> visited;
vector<int> ans;

void dfs(int v) {
    visited[v] = true;
    for (int u : adj[v]) {
        if (!visited[u]) {
            dfs(u);
        }
    }
    ans.push_back(v);
}

void topological_sort() {
    visited.assign(n, false);
    ans.clear();
    for (int i = 0; i < n; ++i) {
        if (!visited[i]) {
            dfs(i);
        }
    }
    reverse(ans.begin(), ans.end());
}
```

```python
import sys

n: int  # кількість вершин
adj: list[list[int]]  # список суміжності графа
visited: list[bool]
ans: list[int]


def dfs(v: int) -> None:
    visited[v] = True
    for u in adj[v]:
        if not visited[u]:
            dfs(u)
    ans.append(v)


def topological_sort() -> None:
    # для великих графів варто збільшити ліміт рекурсії:
    # sys.setrecursionlimit(n + 10)
    global visited, ans
    visited = [False] * n
    ans = []
    for i in range(n):
        if not visited[i]:
            dfs(i)
    ans.reverse()
```

```typescript
let n: number; // кількість вершин
let adj: number[][]; // список суміжності графа
let visited: boolean[];
let ans: number[];

function dfs(v: number): void {
  visited[v] = true;
  for (const u of adj[v]) {
    if (!visited[u]) {
      dfs(u);
    }
  }
  ans.push(v);
}

function topologicalSort(): void {
  visited = new Array<boolean>(n).fill(false);
  ans = [];
  for (let i = 0; i < n; ++i) {
    if (!visited[i]) {
      dfs(i);
    }
  }
  ans.reverse();
}
```

```go
var n int // кількість вершин
var adj [][]int // список суміжності графа
var visited []bool
var ans []int

func dfs(v int) {
	visited[v] = true
	for _, u := range adj[v] {
		if !visited[u] {
			dfs(u)
		}
	}
	ans = append(ans, v)
}

func topologicalSort() {
	visited = make([]bool, n)
	ans = ans[:0]
	for i := 0; i < n; i++ {
		if !visited[i] {
			dfs(i)
		}
	}
	// розвертаємо ans, щоб отримати топологічний порядок
	for i, j := 0, len(ans)-1; i < j; i, j = i+1, j-1 {
		ans[i], ans[j] = ans[j], ans[i]
	}
}
```

</CodeTabs>

Головна функція розв'язку — `topological_sort`, яка ініціалізує змінні DFS, запускає DFS і отримує відповідь у векторі `ans`. Варто зауважити, що коли граф не ациклічний, результат `topological_sort` усе одно буде певною мірою осмисленим у тому сенсі, що якщо вершина $u$ досяжна з вершини $v$, але не навпаки, то вершина $v$ завжди стоятиме першою в результуючому масиві. Ця властивість наведеної реалізації використовується в [алгоритмі Косарайю](./strongly-connected-components.md) для виокремлення компонент сильної зв'язності та їх топологічного сортування в орієнтованому графі з циклами.

## Задачі для практики \{#practice-problems}

- [SPOJ TOPOSORT - Topological Sorting [difficulty: easy]](http://www.spoj.com/problems/TOPOSORT/)
- [UVA 10305 - Ordering Tasks [difficulty: easy]](https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=1246)
- [UVA 124 - Following Orders [difficulty: easy]](https://onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=60)
- [UVA 200 - Rare Order [difficulty: easy]](https://onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=136)
- [Codeforces 510C - Fox and Names [difficulty: easy]](http://codeforces.com/problemset/problem/510/C)
- [SPOJ RPLA - Answer the boss!](https://www.spoj.com/problems/RPLA/)
- [CSES - Course Schedule](https://cses.fi/problemset/task/1679)
- [CSES - Longest Flight Route](https://cses.fi/problemset/task/1680)
- [CSES - Game Routes](https://cses.fi/problemset/task/1681)

## Відеоматеріали \{#video}

<YouTubeEmbed id="eL-KzMXSXXI" title="Topological Sort Algorithm | Graph Theory — WilliamFiset" />
