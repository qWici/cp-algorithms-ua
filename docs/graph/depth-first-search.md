# Пошук у глибину (DFS)

Пошук у глибину (DFS) — один із основних алгоритмів на графах.

Пошук у глибину знаходить лексикографічно перший шлях у графі від початкової вершини $u$ до кожної вершини.
Пошук у глибину також знаходить найкоротші шляхи в дереві (бо там існує лише один простий шлях), але для довільних графів це вже не так.

Алгоритм працює за час $O(m + n)$, де $n$ — кількість вершин, а $m$ — кількість ребер.

## Опис алгоритму \{#description-of-the-algorithm}

Ідея DFS полягає в тому, щоб заходити в граф якомога глибше, і повертатися назад, щойно ми опиняємося у вершині, де немає невідвіданих сусідніх вершин.

Алгоритм дуже легко описати / реалізувати рекурсивно:
Ми починаємо пошук в одній вершині.
Відвідавши вершину, ми далі виконуємо DFS для кожної сусідньої вершини, яку ще не відвідували.
Так ми відвідуємо всі вершини, досяжні зі стартової вершини.

Подробиці дивіться в реалізації.

## Застосування пошуку у глибину \{#applications-of-depth-first-search}

  * Знайти будь-який шлях у графі від початкової вершини $u$ до всіх вершин.
  
  * Знайти лексикографічно перший шлях у графі від початкової вершини $u$ до всіх вершин.
  
  * Перевірити, чи є вершина в дереві предком якоїсь іншої вершини:
  
    На початку та в кінці кожного виклику пошуку ми запам'ятовуємо «час» входу та виходу для кожної вершини.
    Тепер можна знайти відповідь для будь-якої пари вершин $(i, j)$ за $O(1)$:
    вершина $i$ є предком вершини $j$ тоді й лише тоді, коли $\text{entry}[i] < \text{entry}[j]$ і $\text{exit}[i] > \text{exit}[j]$.
  
  * Знайти найнижчого спільного предка (LCA) двох вершин.
  
  * Топологічне сортування:
  
    Запускаємо серію пошуків у глибину так, щоб відвідати кожну вершину рівно один раз за час $O(n + m)$.
    Потрібний топологічний порядок — це вершини, відсортовані за спаданням часу виходу.
  
  
  * Перевірити, чи є заданий граф ациклічним, і знайти цикли в графі. (Як зазначено нижче — підрахувавши зворотні ребра в кожній компоненті зв'язності.)
  
  * Знайти компоненти сильної зв'язності в орієнтованому графі:
  
    Спочатку робимо топологічне сортування графа.
    Потім транспонуємо граф і запускаємо ще одну серію пошуків у глибину в порядку, заданому топологічним сортуванням. Для кожного виклику DFS компонента, яку він створює, є компонентою сильної зв'язності.
  
  * Знайти мости в неорієнтованому графі:
  
    Спочатку перетворюємо заданий граф на орієнтований, запустивши серію пошуків у глибину та орієнтуючи кожне ребро в міру проходження через нього — у тому напрямку, в якому ми йшли. По-друге, знаходимо компоненти сильної зв'язності в цьому орієнтованому графі. Мости — це ребра, кінці яких належать різним компонентам сильної зв'язності.

## Класифікація ребер графа \{#classification-of-edges-of-a-graph}

Ми можемо класифікувати ребра графа $G$, використовуючи час входу та виходу кінцевих вершин $u$ і $v$ ребер $(u,v)$.
Ці класифікації часто застосовують у задачах на кшталт [пошуку мостів](bridge-searching.md) та [пошуку точок зчленування](cutpoints.md).

Ми виконуємо DFS і класифікуємо ребра, що трапляються, за такими правилами:

Якщо $v$ не відвідано:

* Деревне ребро — Якщо $v$ відвідано після $u$, то ребро $(u,v)$ називається деревним ребром. Іншими словами, якщо $v$ відвідується вперше, а $u$ відвідується зараз, то $(u,v)$ називається деревним ребром.
Ці ребра утворюють дерево DFS — звідси й назва «деревні ребра».

Якщо $v$ відвідано раніше за $u$:

* Зворотні ребра — Якщо $v$ є предком $u$, то ребро $(u,v)$ є зворотним ребром. $v$ є предком саме тоді, коли ми вже увійшли у $v$, але ще не вийшли з нього. Зворотні ребра замикають цикл, бо існує шлях від предка $v$ до нащадка $u$ (у рекурсії DFS) і ребро від нащадка $u$ до предка $v$ (зворотне ребро), отже, утворюється цикл. Цикли можна виявляти за допомогою зворотних ребер.

* Прямі ребра — Якщо $v$ є нащадком $u$, то ребро $(u, v)$ є прямим ребром. Іншими словами, якщо ми вже відвідали $v$ і вийшли з нього, і $\text{entry}[u] < \text{entry}[v]$, то ребро $(u,v)$ утворює пряме ребро.
* Перехресні ребра: якщо $v$ не є ні предком, ні нащадком $u$, то ребро $(u, v)$ є перехресним ребром. Іншими словами, якщо ми вже відвідали $v$ і вийшли з нього, і $\text{entry}[u] > \text{entry}[v]$, то $(u,v)$ є перехресним ребром.

**Теорема**. Нехай $G$ — неорієнтований граф. Тоді виконання DFS на $G$ класифікує кожне ребро, що трапляється, або як деревне ребро, або як зворотне ребро, тобто прямі та перехресні ребра існують лише в орієнтованих графах.

Припустимо, що $(u,v)$ — довільне ребро графа $G$, і, без втрати загальності, $u$ відвідано раніше за $v$, тобто $\text{entry}[u] < \text{entry}[v]$. Оскільки DFS обробляє ребра лише один раз, існує тільки два способи, якими ми можемо обробити ребро $(u,v)$ і тим самим класифікувати його:

* Уперше ми досліджуємо ребро $(u,v)$ у напрямку від $u$ до $v$. Оскільки $\text{entry}[u] < \text{entry}[v]$, рекурсивна природа DFS означає, що вершина $v$ буде повністю досліджена, а отже, з неї вийдуть, перш ніж ми зможемо «піднятися назад стеком викликів», щоб вийти з вершини $u$. Тому вершина $v$ має бути невідвіданою, коли DFS уперше досліджує ребро $(u,v)$ від $u$ до $v$, бо інакше пошук дослідив би $(u,v)$ від $v$ до $u$ ще до виходу з вершини $v$, оскільки вершини $u$ і $v$ є сусідами. Отже, ребро $(u,v)$ є деревним ребром.

* Уперше ми досліджуємо ребро $(u,v)$ у напрямку від $v$ до $u$. Оскільки ми виявили вершину $u$ раніше за вершину $v$, а ребра обробляємо лише один раз, єдиний спосіб дослідити ребро $(u,v)$ у напрямку від $v$ до $u$ — це якщо існує інший шлях від $u$ до $v$, який не використовує ребро $(u,v)$, що робить $u$ предком $v$. Тоді ребро $(u,v)$ замикає цикл, бо йде від нащадка $v$ до предка $u$, з якого ми ще не вийшли. Отже, ребро $(u,v)$ є зворотним ребром.

Оскільки існує лише два способи обробити ребро $(u,v)$ — з двома випадками та відповідними їм класифікаціями, описаними вище, — виконання DFS на $G$ класифікує кожне ребро, що трапляється, або як деревне ребро, або як зворотне ребро, тобто прямі та перехресні ребра існують лише в орієнтованих графах. Це завершує доведення.

## Реалізація \{#implementation}

<CodeTabs>

```cpp
vector<vector<int>> adj; // граф, представлений списком суміжності
int n; // кількість вершин

vector<bool> visited;

void dfs(int v) {
	visited[v] = true;
	for (int u : adj[v]) {
		if (!visited[u])
			dfs(u);
    }
}
```

```python
import sys

# Рекурсивний DFS на глибокому графі може впертися в стандартний ліміт
# рекурсії Python (~1000), що спричинить RecursionError. Збільшуємо його.
sys.setrecursionlimit(1_000_000)

adj: list[list[int]] = []  # граф: список списків суміжності
n: int = 0                 # кількість вершин

visited: list[bool] = []


def dfs(v: int) -> None:
    visited[v] = True
    for u in adj[v]:
        if not visited[u]:
            dfs(u)
```

```typescript
let adj: number[][] = []; // граф: масив списків суміжності
let n = 0;                // кількість вершин

let visited: boolean[] = [];

function dfs(v: number): void {
    visited[v] = true;
    for (const u of adj[v]) {
        if (!visited[u]) dfs(u);
    }
}
```

```go
var adj [][]int // граф: слайс слайсів суміжності
var n int       // кількість вершин

var visited []bool

func dfs(v int) {
	visited[v] = true
	for _, u := range adj[v] {
		if !visited[u] {
			dfs(u)
		}
	}
}
```

</CodeTabs>

Це найпростіша реалізація пошуку у глибину.
Як описано в застосуваннях, може бути корисно також обчислювати час входу та виходу й колір вершини.
Ми будемо фарбувати всі вершини кольором 0, якщо ми їх не відвідували, кольором 1, якщо ми їх відвідали, і кольором 2, якщо ми з вершини вже вийшли.

Ось узагальнена реалізація, яка додатково обчислює це:

<CodeTabs>

```cpp
vector<vector<int>> adj; // граф, представлений списком суміжності
int n; // кількість вершин

vector<int> color;

vector<int> time_in, time_out;
int dfs_timer = 0;

void dfs(int v) {
	time_in[v] = dfs_timer++;
	color[v] = 1;
	for (int u : adj[v])
		if (color[u] == 0)
			dfs(u);
	color[v] = 2;
	time_out[v] = dfs_timer++;
}
```

```python
import sys

# Глибока рекурсія -> збільшуємо ліміт, щоб уникнути RecursionError.
sys.setrecursionlimit(1_000_000)

adj: list[list[int]] = []  # граф: список списків суміжності
n: int = 0                 # кількість вершин

color: list[int] = []

time_in: list[int] = []
time_out: list[int] = []
dfs_timer = 0


def dfs(v: int) -> None:
    global dfs_timer
    time_in[v] = dfs_timer
    dfs_timer += 1
    color[v] = 1
    for u in adj[v]:
        if color[u] == 0:
            dfs(u)
    color[v] = 2
    time_out[v] = dfs_timer
    dfs_timer += 1
```

```typescript
let adj: number[][] = []; // граф: масив списків суміжності
let n = 0;                // кількість вершин

let color: number[] = [];

let timeIn: number[] = [];
let timeOut: number[] = [];
let dfsTimer = 0;

function dfs(v: number): void {
    timeIn[v] = dfsTimer++;
    color[v] = 1;
    for (const u of adj[v]) {
        if (color[u] === 0) dfs(u);
    }
    color[v] = 2;
    timeOut[v] = dfsTimer++;
}
```

```go
var adj [][]int // граф: слайс слайсів суміжності
var n int       // кількість вершин

var color []int

var timeIn []int
var timeOut []int
var dfsTimer int

func dfs(v int) {
	timeIn[v] = dfsTimer
	dfsTimer++
	color[v] = 1
	for _, u := range adj[v] {
		if color[u] == 0 {
			dfs(u)
		}
	}
	color[v] = 2
	timeOut[v] = dfsTimer
	dfsTimer++
}
```

</CodeTabs>

## Задачі для практики \{#practice-problems}

* [SPOJ: ABCPATH](http://www.spoj.com/problems/ABCPATH/)
* [SPOJ: EAGLE1](http://www.spoj.com/problems/EAGLE1/)
* [Codeforces: Kefa and Park](http://codeforces.com/problemset/problem/580/C)
* [Timus:Werewolf](http://acm.timus.ru/problem.aspx?space=1&num=1242)
* [Timus:Penguin Avia](http://acm.timus.ru/problem.aspx?space=1&num=1709)
* [Timus:Two Teams](http://acm.timus.ru/problem.aspx?space=1&num=1106)
* [SPOJ - Ada and Island](http://www.spoj.com/problems/ADASEA/)
* [UVA 657 - The die is cast](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=598)
* [SPOJ - Sheep](http://www.spoj.com/problems/KOZE/)
* [SPOJ - Path of the Rightenous Man](http://www.spoj.com/problems/RIOI_2_3/)
* [SPOJ - Validate the Maze](http://www.spoj.com/problems/MAKEMAZE/)
* [SPOJ - Ghosts having Fun](http://www.spoj.com/problems/GHOSTS/)
* [Codeforces - Underground Lab](http://codeforces.com/contest/781/problem/C)
* [DevSkill - Maze Tester (archived)](http://web.archive.org/web/20200319103915/https://www.devskill.com/CodingProblems/ViewProblem/3)
* [DevSkill - Tourist (archived)](http://web.archive.org/web/20190426175135/https://devskill.com/CodingProblems/ViewProblem/17)
* [Codeforces - Anton and Tree](http://codeforces.com/contest/734/problem/E)
* [Codeforces - Transformation: From A to B](http://codeforces.com/contest/727/problem/A)
* [Codeforces - One Way Reform](http://codeforces.com/contest/723/problem/E)
* [Codeforces - Centroids](http://codeforces.com/contest/709/problem/E)
* [Codeforces - Generate a String](http://codeforces.com/contest/710/problem/E)
* [Codeforces - Broken Tree](http://codeforces.com/contest/758/problem/E)
* [Codeforces - Dasha and Puzzle](http://codeforces.com/contest/761/problem/E)
* [Codeforces - Making genome In Berland](http://codeforces.com/contest/638/problem/B)
* [Codeforces - Road Improvement](http://codeforces.com/contest/638/problem/C)
* [Codeforces - Garland](http://codeforces.com/contest/767/problem/C)
* [Codeforces - Labeling Cities](http://codeforces.com/contest/794/problem/D)
* [Codeforces - Send the Fool Futher!](http://codeforces.com/contest/802/problem/K)
* [Codeforces - The tag Game](http://codeforces.com/contest/813/problem/C)
* [Codeforces - Leha and Another game about graphs](http://codeforces.com/contest/841/problem/D)
* [Codeforces - Shortest path problem](http://codeforces.com/contest/845/problem/G)
* [Codeforces - Upgrading Tree](http://codeforces.com/contest/844/problem/E)
* [Codeforces - From Y to Y](http://codeforces.com/contest/849/problem/C)
* [Codeforces - Chemistry in Berland](http://codeforces.com/contest/846/problem/E)
* [Codeforces - Wizards Tour](http://codeforces.com/contest/861/problem/F)
* [Codeforces - Ring Road](http://codeforces.com/contest/24/problem/A)
* [Codeforces - Mail Stamps](http://codeforces.com/contest/29/problem/C)
* [Codeforces - Ant on the Tree](http://codeforces.com/contest/29/problem/D)
* [SPOJ - Cactus](http://www.spoj.com/problems/CAC/)
* [SPOJ - Mixing Chemicals](http://www.spoj.com/problems/AMR10J/)

## Відеоматеріали \{#video}

<YouTubeEmbed id="PMMc4VsIacU" title="Depth First Search (DFS) Explained: Algorithm, Examples, and Code — Reducible" />
