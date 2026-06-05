# Пошук у ширину (BFS)

Пошук у ширину — один з базових і фундаментальних алгоритмів пошуку на графах.

Завдяки тому, як працює цей алгоритм, шлях, який пошук у ширину знаходить до будь-якої вершини, є найкоротшим шляхом до цієї вершини, тобто шляхом, що містить найменшу кількість ребер у <Term tip="Граф, у якому всі ребра рівноцінні: вони не мають ваги (довжини, вартості) — важлива лише наявність з'єднання між вершинами.">незважених графах</Term>.

Алгоритм працює за час $O(n + m)$, де $n$ — кількість вершин, а $m$ — кількість ребер.

:::tip[Коли підходить цей алгоритм?]
- Граф незважений (або всі ребра мають однакову вагу), а потрібен найкоротший шлях / мінімальна кількість кроків? *(якщо ваги лише $0$ та $1$ → [0-1 BFS](01_bfs.md); якщо ваги довільні невід'ємні → [Дейкстра](dijkstra.md))*
- Задачу можна подати як граф станів, де перехід між сусідніми станами «коштує» один крок (сітки, головоломки, ходи фігури)?
- Достатньо обходу в порядку зростання відстані від джерела (компоненти зв'язності, найкоротший цикл), а не лексикографічного обходу вглиб? *(якщо потрібен саме обхід вглиб → [DFS](depth-first-search.md))*
:::

## Опис алгоритму \{#description-of-the-algorithm}

На вхід алгоритм отримує незважений граф та номер початкової вершини $s$. Вхідний граф може бути <Term tip="В орієнтованому графі кожне ребро має напрямок (вулиці з одностороннім рухом); у неорієнтованому ребром можна йти в обидва боки.">орієнтованим або неорієнтованим</Term> — для алгоритму це не має значення.

Алгоритм можна уявити як поширення вогню графом: на нульовому кроці горить лише початкова вершина $s$. На кожному кроці вогонь, що горить у кожній вершині, поширюється на всіх її сусідів. За одну ітерацію алгоритму «кільце вогню» розширюється у ширину на одну одиницю (звідси й назва алгоритму).

Точніше алгоритм можна сформулювати так: створимо чергу $q$, яка міститиме вершини для обробки, та булевий масив $used[]$, що для кожної вершини вказує, чи її вже запалили (відвідали), чи ні.

Спочатку додаємо початкову вершину $s$ до черги та встановлюємо $used[s] = true$, а для всіх інших вершин $v$ встановлюємо $used[v] = false$. Потім виконуємо цикл, доки черга не спорожніє, і на кожній ітерації витягуємо вершину з початку черги. Перебираємо всі ребра, що виходять з цієї вершини, і якщо деякі з цих ребер ведуть до вершин, які ще не запалені, запалюємо їх і додаємо до черги.

У результаті, коли черга спорожніє, «кільце вогню» міститиме всі вершини, досяжні з початкової вершини $s$, причому кожна вершина досягається найкоротшим можливим шляхом. Можна також обчислити довжини найкоротших шляхів (для цього достатньо підтримувати масив довжин шляхів $d[]$), а також зберегти інформацію для відновлення всіх цих найкоротших шляхів (для цього необхідно підтримувати масив «батьків» $p[]$, який для кожної вершини зберігає вершину, з якої ми до неї дісталися).

## Реалізація \{#implementation}

Напишемо код описаного алгоритму на C++ та Java.

<CodeTabs>

```cpp
vector<vector<int>> adj;  // представлення у вигляді списку суміжності
int n; // кількість вершин
int s; // початкова вершина

queue<int> q;
vector<bool> used(n);
vector<int> d(n), p(n);

q.push(s);
used[s] = true;
p[s] = -1;
while (!q.empty()) {
    int v = q.front();
    q.pop();
    for (int u : adj[v]) {
        if (!used[u]) {
            used[u] = true;
            q.push(u);
            d[u] = d[v] + 1;
            p[u] = v;
        }
    }
}
```

```python
from collections import deque

adj = []  # представлення у вигляді списку суміжності
n = 0  # кількість вершин
s = 0  # початкова вершина

# collections.deque дає O(1) на popleft; list.pop(0) був би O(n)
q = deque()
used = [False] * n
d = [0] * n
p = [0] * n

q.append(s)
used[s] = True
p[s] = -1
while q:
    v = q.popleft()
    for u in adj[v]:
        if not used[u]:
            used[u] = True
            q.append(u)
            d[u] = d[v] + 1
            p[u] = v
```

```typescript
let adj: number[][] = []; // представлення у вигляді списку суміжності
let n = 0; // кількість вершин
let s = 0; // початкова вершина

// Замість Array.shift() (O(n)) тримаємо масив і індекс голови head — O(1) на вилучення
const q: number[] = [];
let head = 0;
const used: boolean[] = new Array(n).fill(false);
const d: number[] = new Array(n).fill(0);
const p: number[] = new Array(n).fill(0);

q.push(s);
used[s] = true;
p[s] = -1;
while (head < q.length) {
  const v = q[head++];
  for (const u of adj[v]) {
    if (!used[u]) {
      used[u] = true;
      q.push(u);
      d[u] = d[v] + 1;
      p[u] = v;
    }
  }
}
```

```go
var adj [][]int // представлення у вигляді списку суміжності
var n int       // кількість вершин
var s int       // початкова вершина

// Слайс як черга: q[0] — голова, q = q[1:] зсуває голову вперед
q := []int{}
used := make([]bool, n)
d := make([]int, n)
p := make([]int, n)

q = append(q, s)
used[s] = true
p[s] = -1
for len(q) > 0 {
    v := q[0]
    q = q[1:]
    for _, u := range adj[v] {
        if !used[u] {
            used[u] = true
            q = append(q, u)
            d[u] = d[v] + 1
            p[u] = v
        }
    }
}
```

```java
ArrayList<ArrayList<Integer>> adj = new ArrayList<>(); // представлення у вигляді списку суміжності

int n; // кількість вершин
int s; // початкова вершина


LinkedList<Integer> q = new LinkedList<Integer>();
boolean used[] = new boolean[n];
int d[] = new int[n];
int p[] = new int[n];

q.push(s);
used[s] = true;
p[s] = -1;
while (!q.isEmpty()) {
    int v = q.pop();
    for (int u : adj.get(v)) {
        if (!used[u]) {
            used[u] = true;
            q.push(u);
            d[u] = d[v] + 1;
            p[u] = v;
        }
    }
}
```

</CodeTabs>
    
Якщо нам потрібно відновити та вивести найкоротший шлях від початкової вершини до деякої вершини $u$, це можна зробити так:
    
<CodeTabs>

```cpp
if (!used[u]) {
    cout << "No path!";
} else {
    vector<int> path;
    for (int v = u; v != -1; v = p[v])
        path.push_back(v);
    reverse(path.begin(), path.end());
    cout << "Path: ";
    for (int v : path)
        cout << v << " ";
}
```

```python
if not used[u]:
    print("No path!")
else:
    path = []
    v = u
    while v != -1:
        path.append(v)
        v = p[v]
    path.reverse()
    print("Path:", *path)
```

```typescript
if (!used[u]) {
  console.log("No path!");
} else {
  const path: number[] = [];
  for (let v = u; v !== -1; v = p[v]) {
    path.push(v);
  }
  path.reverse();
  console.log("Path: " + path.join(" "));
}
```

```go
if !used[u] {
    fmt.Print("No path!")
} else {
    path := []int{}
    for v := u; v != -1; v = p[v] {
        path = append(path, v)
    }
    // Розвертаємо шлях на місці
    for i, j := 0, len(path)-1; i < j; i, j = i+1, j-1 {
        path[i], path[j] = path[j], path[i]
    }
    fmt.Print("Path: ")
    for _, v := range path {
        fmt.Print(v, " ")
    }
}
```

```java
if (!used[u]) {
    System.out.println("No path!");
} else {
    ArrayList<Integer> path = new ArrayList<Integer>();
    for (int v = u; v != -1; v = p[v])
        path.add(v);
    Collections.reverse(path);
    for(int v : path)
        System.out.println(v);
}
```

</CodeTabs>
    
## Застосування BFS \{#applications-of-bfs}

* Знайти найкоротший шлях від початкової вершини до інших вершин у незваженому графі.

* Знайти всі <Term tip="Компонента зв'язності — це максимальна група вершин, у якій від будь-якої вершини можна дістатися до будь-якої іншої; граф може розпадатися на кілька таких незалежних груп.">компоненти зв'язності</Term> в неорієнтованому графі за час $O(n + m)$:
Для цього ми просто запускаємо BFS, починаючи з кожної вершини, окрім вершин, які вже були відвідані під час попередніх запусків.
Таким чином, ми виконуємо звичайний BFS з кожної вершини, але не скидаємо масив $used[]$ щоразу, коли отримуємо нову компоненту зв'язності, і загальний час роботи все одно становитиме $O(n + m)$ (виконання кількох BFS на графі без обнулення масиву $used []$ називається серією пошуків у ширину).

* Пошук розв'язку задачі або гри з найменшою кількістю ходів, якщо кожен стан гри можна подати вершиною графа, а переходи з одного стану в інший — ребрами графа.

* Пошук найкоротшого шляху в графі з вагами 0 або 1:
Для цього потрібна лише невелика модифікація звичайного пошуку у ширину: замість того щоб підтримувати масив $used[]$, ми тепер перевіряємо, чи відстань до вершини менша за поточну знайдену відстань, і тоді, якщо поточне ребро має нульову вагу, додаємо його на початок черги, інакше — в кінець черги. Ця модифікація детальніше описана в статті [0-1 BFS](01_bfs.md).

* Пошук найкоротшого циклу в орієнтованому незваженому графі:
Запускаємо пошук у ширину з кожної вершини.
Щойно ми спробуємо перейти з поточної вершини назад до початкової вершини, ми знайшли найкоротший цикл, що містить початкову вершину.
У цей момент ми можемо зупинити BFS і почати новий BFS з наступної вершини.
З усіх таких циклів (щонайбільше по одному з кожного BFS) вибираємо найкоротший.

* Знайти всі ребра, що лежать на якомусь найкоротшому шляху між заданою парою вершин $(a, b)$.
Для цього запускаємо два пошуки у ширину:
один з $a$ і один з $b$.
Нехай $d_a []$ — масив, що містить найкоротші відстані, отримані з першого BFS (з $a$), а $d_b []$ — масив, що містить найкоротші відстані, отримані з другого BFS з $b$.
Тепер для кожного ребра $(u, v)$ легко перевірити, чи лежить це ребро на якомусь найкоротшому шляху між $a$ і $b$:
критерієм є умова $d_a [u] + 1 + d_b [v] = d_a [b]$.

* Знайти всі вершини, що лежать на якомусь найкоротшому шляху між заданою парою вершин $(a, b)$.
Щоб це зробити, запускаємо два пошуки у ширину:
один з $a$ і один з $b$.
Нехай $d_a []$ — масив, що містить найкоротші відстані, отримані з першого BFS (з $a$), а $d_b []$ — масив, що містить найкоротші відстані, отримані з другого BFS (з $b$).
Тепер для кожної вершини легко перевірити, чи лежить вона на якомусь найкоротшому шляху між $a$ і $b$:
критерієм є умова $d_a [v] + d_b [v] = d_a [b]$.

* Знайти найкоротший прохід парної довжини від початкової вершини $s$ до цільової вершини $t$ у незваженому графі:
Для цього ми маємо побудувати допоміжний граф, вершинами якого є стани $(v, c)$, де $v$ — поточна вершина, $c = 0$ або $c = 1$ — поточна парність.
Будь-яке ребро $(u, v)$ вихідного графа в цьому новому графі перетвориться на два ребра $((u, 0), (v, 1))$ та $((u, 1), (v, 0))$.
Після цього ми запускаємо BFS, щоб знайти найкоротший прохід від початкової вершини $(s, 0)$ до кінцевої вершини $(t, 0)$.<br/>**Зауваження**: у цьому пункті недарма використано термін «_прохід_», а не «_шлях_», адже вершини в знайденому проході потенційно можуть повторюватися, щоб зробити його довжину парною. Задача пошуку найкоротшого _шляху_ парної довжини є NP-повною в орієнтованих графах і [розв'язною за лінійний час](https://onlinelibrary.wiley.com/doi/abs/10.1002/net.3230140403) у неорієнтованих графах, але зі значно складнішим підходом.

## Задачі для практики \{#practice-problems}

* [SPOJ: AKBAR](http://spoj.com/problems/AKBAR)
* [SPOJ: NAKANJ](http://www.spoj.com/problems/NAKANJ/)
* [SPOJ: WATER](http://www.spoj.com/problems/WATER)
* [SPOJ: MICE AND MAZE](http://www.spoj.com/problems/MICEMAZE/)
* [Timus: Caravans](http://acm.timus.ru/problem.aspx?space=1&num=2034)
* [DevSkill - Holloween Party (archived)](http://web.archive.org/web/20200930162803/http://www.devskill.com/CodingProblems/ViewProblem/60)
* [DevSkill - Ohani And The Link Cut Tree (archived)](http://web.archive.org/web/20170216192002/http://devskill.com:80/CodingProblems/ViewProblem/150)
* [SPOJ - Spiky Mazes](http://www.spoj.com/problems/SPIKES/)
* [SPOJ - Four Chips (hard)](http://www.spoj.com/problems/ADV04F1/)
* [SPOJ - Inversion Sort](http://www.spoj.com/problems/INVESORT/)
* [Codeforces - Shortest Path](http://codeforces.com/contest/59/problem/E)
* [SPOJ - Yet Another Multiple Problem](http://www.spoj.com/problems/MULTII/)
* [UVA 11392 - Binary 3xType Multiple](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=2387)
* [UVA 10968 - KuPellaKeS](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=1909)
* [Codeforces - Police Stations](http://codeforces.com/contest/796/problem/D)
* [Codeforces - Okabe and City](http://codeforces.com/contest/821/problem/D)
* [SPOJ - Find the Treasure](http://www.spoj.com/problems/DIGOKEYS/)
* [Codeforces - Bear and Forgotten Tree 2](http://codeforces.com/contest/653/problem/E)
* [Codeforces - Cycle in Maze](http://codeforces.com/contest/769/problem/C)
* [UVA - 11312 - Flipping Frustration](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=2287)
* [SPOJ - Ada and Cycle](http://www.spoj.com/problems/ADACYCLE/)
* [CSES - Labyrinth](https://cses.fi/problemset/task/1193)
* [CSES - Message Route](https://cses.fi/problemset/task/1667/)
* [CSES - Monsters](https://cses.fi/problemset/task/1194)

## Відеоматеріали \{#video}

<YouTubeEmbed id="xlVX7dXLS64" title="Breadth First Search (BFS): Visualized and Explained — Reducible" />
