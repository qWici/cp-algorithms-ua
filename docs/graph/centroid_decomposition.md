# Центроїдна декомпозиція

Необхідні попередні знання: [Пошук у глибину (DFS)](./depth-first-search.md), [«Розділяй і володарюй»](https://en.wikipedia.org/wiki/Divide-and-conquer_algorithm), [Дерева](<https://en.wikipedia.org/wiki/Tree_(graph_theory)>).

## Вступ \{#introduction}

**Центроїдна декомпозиція** — це техніка «розділяй і володарюй» на деревах. Її застосовують для розв'язання різноманітних задач, пов'язаних зі шляхами в дереві: підрахунку шляхів із певними властивостями, знаходження відстаней чи відповідей на запити щодо шляхів у дереві.

Ключова ідея полягає в тому, щоб рекурсивно декомпозувати дерево, знаходячи його **центроїд**. Ця особлива вершина при видаленні розбиває дерево на компоненти, кожна з яких містить щонайбільше половину вершин початкового дерева. Це гарантує логарифмічну глибину рекурсії, що приводить до ефективних алгоритмів.

:::tip[Коли підходить цей алгоритм?]
- Задача стосується **шляхів у дереві** (підрахунок шляхів із заданою властивістю, відстані, запити «розділяй і володарюй» по всіх парах вершин)?
- Дерево статичне за структурою (декомпозицію будують один раз)?
- Запити стосуються шляхів між довільними парами вершин, а не агрегатів на одному фіксованому шляху? *(якщо потрібні саме оновлення/запити на шляху $a \to b$ → [важко-легка декомпозиція](hld.md))*
:::

## Властивості та означення центроїда \{#properties-and-definition-of-a-centroid}

Спершу розберемося, що таке центроїд. **Центроїд** дерева — це вершина, після видалення якої жодне піддерево не містить більш ніж $\frac{N}{2}$ вершин, де $N$ — загальна кількість вершин у дереві.

<center> <img src="/img/docs/graph/centroid-definition.png" alt="Centroid Tree" /> </center>

Для будь-якого заданого дерева з $N$ вершин існує один або два центроїди. Якщо центроїдів два, то вони обов'язково суміжні.

### Існування та єдиність \{#existence-and-uniqueness}

**Теорема**: Кожне дерево має щонайменше один центроїд і щонайбільше два центроїди. Якщо центроїдів два, то вони суміжні.

<details>
<summary>Доведення</summary>


_Існування_: Почнемо з будь-якої вершини й рухатимемося до того нащадка, чиє піддерево найбільше. Зупинимося, коли жоден нащадок не матиме більш ніж $\frac{N}{2}$ вершин. У цей момент поточна вершина $v$ є центроїдом, тому що (1) жодне піддерево нащадка не містить більш ніж $\frac{N}{2}$ вершин (за умовою зупинки) (2) «батьківська частина» (усі вершини, окрім піддерева $v$, коли $v$ була нащадком) містить щонайбільше $\frac{N}{2}$ вершин (інакше ми б не перейшли до $v$ від її батька).

Легко бачити, що цей процес завжди завершується, що й доводить існування щонайменше одного центроїда.

_Єдиність_: Припустимо, що є два центроїди $u$ і $v$. Розглянемо шлях між ними. Коли ми видаляємо $u$, вершина $v$ має лежати в компоненті з щонайбільше $\frac{N}{2}$ вершинами. Аналогічно, коли ми видаляємо $v$, вершина $u$ має лежати в компоненті з щонайбільше $\frac{N}{2}$ вершинами. Це можливо лише тоді, коли $u$ і $v$ суміжні; інакше видалення будь-якої з них помістило б іншу в компоненту з більш ніж $\frac{N}{2}$ вершинами. Це суперечить нашому початковому твердженню, що обидва центроїди лежать у компоненті з щонайбільше $\frac{N}{2}$ вершинами. Більше того, якщо існують два центроїди, вони мають розбивати дерево на дві компоненти рівно по $\frac{N}{2}$ вершин у кожній, що можливо лише тоді, коли $N$ парне.

</details>

## Властивості та означення центроїдної декомпозиції \{#properties-and-definition-of-centroid-decomposition}

«Декомпозиція» дерева по суті означає рекурсивне знаходження центроїдів і розбиття дерева на піддерева відповідно до компонент центроїда. Така рекурсивна декомпозиція дерева на його компоненти породжує унікальний набір властивостей:

1. **Глибина декомпозиції**: Глибина дорівнює $O(\log N)$, оскільки кожен рівень принаймні вдвічі зменшує розмір компоненти.
2. **Покриття шляхів**: Кожен шлях у дереві проходить через центроїд якоїсь компоненти в декомпозиції.

### Глибина декомпозиції \{#decomposition-depth}

**Теорема**: Глибина, або кількість кроків, при застосуванні центроїдної декомпозиції до будь-якого дерева дорівнює $O(\log N)$.

<details>
<summary>Доведення</summary>


Розглянемо довільну вершину $v$ у початковому дереві. Простежимо, скільки разів $v$ може бути частиною компоненти протягом процесу декомпозиції.

На першому рівні $v$ перебуває в компоненті розміру $N$. Коли ми видаляємо центроїд цієї компоненти, $v$ опиняється в компоненті розміру щонайбільше $\frac{N}{2}$ (за властивістю збалансованості).

На другому рівні $v$ перебуває в компоненті розміру щонайбільше $\frac{N}{2}$. Видалення центроїда цієї компоненти поміщає $v$ у компоненту розміру щонайбільше $\frac{N}{4}$.

Продовжуючи за цією схемою, на $k$-му рівні $v$ перебуває в компоненті розміру щонайбільше $\frac{N}{2^{k-1}}$.

Декомпозиція зупиняється, коли розміри компонент сягають 1. Це відбувається, коли $\frac{N}{2^{k-1}} \leq 1$, звідки $k \leq \log_2 N + 1$.

Отже, максимальна глибина дерева центроїдної декомпозиції дорівнює $O(\log N)$.

</details>

**Наслідок**: Оскільки кожна вершина бере участь щонайбільше в $O(\log N)$ рівнях декомпозиції, і ми обробляємо кожну вершину один раз на кожному рівні, алгоритми, що використовують центроїдну декомпозицію, зазвичай мають у часовій складності множник $O(\log N)$, помножений на обсяг роботи, виконуваної на одну вершину на одному рівні.

### Покриття шляхів \{#path-coverage}

**Теорема**: Кожен шлях у початковому дереві проходить через центроїд якоїсь компоненти в декомпозиції.

<details>
<summary>Доведення</summary>


Розглянемо довільний шлях $P$ від вершини $u$ до вершини $v$ у початковому дереві. Нам потрібно показати, що цей шлях проходить принаймні через один центроїд, обраний під час процесу декомпозиції.

Доведемо це індукцією за процесом декомпозиції.

_База індукції_: На першому рівні декомпозиції ми вибираємо центроїд $c_1$ всього дерева. Якщо шлях $P$ проходить через $c_1$, то все доведено.

_Крок індукції_: Припустимо, що шлях $P$ не проходить через $c_1$. Коли ми видаляємо $c_1$, дерево розпадається на кілька компонент. Оскільки $P$ — це зв'язний шлях, то обидві вершини $u$ та $v$ мають лежати в одній і тій самій компоненті $C$ після видалення $c_1$ (інакше $P$ мусив би проходити через $c_1$, щоб їх з'єднати, що суперечить нашому припущенню).

Тепер ми рекурсивно декомпозуємо компоненту $C$. За припущенням індукції, застосованим до компоненти $C$, шлях $P$ (який повністю міститься в $C$) має проходити через центроїд якоїсь компоненти в декомпозиції $C$.

Цей процес триває, доки ми не знайдемо центроїд, через який проходить $P$. Процес обов'язково завершиться, бо на кожному рівні компонента, що містить $P$, стає строго меншою (за властивістю збалансованості) й зрештою зводиться до єдиного ребра або вершини.

</details>

**Наслідок**: Ця властивість є фундаментальною для коректності алгоритмів центроїдної декомпозиції. Вона гарантує, що коли ми обробляємо всі шляхи через кожен центроїд, ми покриваємо всі можливі шляхи в дереві рівно один раз на якомусь рівні декомпозиції. Саме тому центроїдна декомпозиція може ефективно розв'язувати задачі, пов'язані зі шляхами: кожен шлях розглядається рівно один раз — на тому рівні, де він уперше зустрічає центроїд.

## Знаходження центроїда \{#finding-a-centroid}

Щоб ефективно знайти центроїд дерева:

1. Обчислюємо розміри піддерев для всіх вершин за допомогою пошуку в глибину (DFS)
2. Починаємо з будь-якої вершини
3. Знаходимо нащадка $v$, чиє піддерево містить більш ніж $\frac{N}{2}$ вершин
4. Переходимо до $v$ і повторюємо крок 3
5. Якщо такого нащадка немає, то поточна вершина і є центроїдом

Часова складність: $O(N)$.

Просторова складність: $O(N)$.

## Опис алгоритму \{#algorithm-description}

При використанні центроїдної декомпозиції загальний хід дій такий:

1. **Знаходимо центроїд** поточного дерева/компоненти
2. **Обробляємо** всі шляхи, що проходять через цей центроїд, і виконуємо будь-які потрібні обчислення
3. **Видаляємо** центроїд (позначаємо його як використаний)
4. **Рекурсивно декомпозуємо** кожне отримане піддерево

Це породжує **дерево центроїдів**. Кожен вузол цього дерева відповідає центроїду з якогось етапу декомпозиції. Це означає, що батьком центроїда (будь-якого заданого вузла) є той центроїд, який було знайдено в більшій компоненті, що його містила. Висота цього дерева дорівнює $O(\log N)$, як доведено раніше.

<center> <img src="/img/docs/graph/CentroidTree.png" alt="Centroid Tree" /> </center>

Наприклад, на зображенні вище зображено дерево центроїдів. Кожен вузол на кожному рівні дерева є центроїдом відповідної компоненти (наприклад, корінь — це центроїд усього дерева, найлівіший нащадок кореня — це центроїд найлівішого піддерева кореня тощо).

## Реалізація \{#implementation}

Ось реалізація центроїдної декомпозиції, що розв'язує конкретну задачу: **підрахунок усіх шляхів у дереві з довжиною рівно $K$**.

У цій задачі нам задано дерево з $N$ вершин і потрібно підрахувати, скільки шляхів мають рівно $K$ ребер. Шлях визначається двома різними вершинами.

<CodeTabs>

```cpp
const int MAXN = 1e5;
vector<int> adj[MAXN];
bool removed[MAXN];
int subtree_size[MAXN];
int K;  // Цільова довжина шляху
long long answer = 0;  // Кількість шляхів довжини K

int get_subtree_size(int v, int p = -1) {
    subtree_size[v] = 1;
    for (int u : adj[v]) {
        if (u == p || removed[u]) continue;
        subtree_size[v] += get_subtree_size(u, v);
    }
    return subtree_size[v];
}

int get_centroid(int v, int tree_size, int p = -1) {
    for (int u : adj[v]) {
        if (u == p || removed[u]) continue;
        if (subtree_size[u] * 2 > tree_size)
            return get_centroid(u, tree_size, v);
    }
    return v;
}

void get_distances(int v, int p, int dist, vector<int>& distances) {
    if (dist > K) return;
    distances.push_back(dist);
    for (int u : adj[v]) {
        if (u == p || removed[u]) continue;
        get_distances(u, v, dist + 1, distances);
    }
}

void process_centroid(int centroid) {
    unordered_map<int, int> all_distances;
    all_distances[0] = 1;

    for (int u : adj[centroid]) {
        if (removed[u])
            continue;

        vector<int> current_distances;
        get_distances(u, centroid, 1, current_distances);

        for (int d : current_distances) {
            if (K - d >= 0) {
                answer += (all_distances[K - d] ? all_distances[K - d] : 0);
            }
        }

        for (int d : current_distances) {
            if (all_distances.find(d) == all_distances.end())
                all_distances[d] = 0;
            all_distances[d]++;
        }
    }
}

void decompose(int v) {
    int tree_size = get_subtree_size(v);
    int centroid = get_centroid(v, tree_size);

    process_centroid(centroid);

    removed[centroid] = true;

    for (int u : adj[centroid]) {
        if (!removed[u]) {
            decompose(u);
        }
    }
}
```

```python
import sys
from collections import defaultdict

# Центроїдна декомпозиція рекурсивна; для великих дерев (до ~1e5 вершин)
# глибина DFS може перевищити стандартний ліміт Python, тому збільшуємо його.
sys.setrecursionlimit(300000)

MAXN = 10**5
adj = [[] for _ in range(MAXN)]
removed = [False] * MAXN
subtree_size = [0] * MAXN
K = 0           # Цільова довжина шляху
answer = 0      # Кількість шляхів довжини K


def get_subtree_size(v, p=-1):
    subtree_size[v] = 1
    for u in adj[v]:
        if u == p or removed[u]:
            continue
        subtree_size[v] += get_subtree_size(u, v)
    return subtree_size[v]


def get_centroid(v, tree_size, p=-1):
    for u in adj[v]:
        if u == p or removed[u]:
            continue
        if subtree_size[u] * 2 > tree_size:
            return get_centroid(u, tree_size, v)
    return v


def get_distances(v, p, dist, distances):
    if dist > K:
        return
    distances.append(dist)
    for u in adj[v]:
        if u == p or removed[u]:
            continue
        get_distances(u, v, dist + 1, distances)


def process_centroid(centroid):
    global answer
    all_distances = defaultdict(int)
    all_distances[0] = 1

    for u in adj[centroid]:
        if removed[u]:
            continue

        current_distances = []
        get_distances(u, centroid, 1, current_distances)

        for d in current_distances:
            if K - d >= 0:
                answer += all_distances[K - d]

        for d in current_distances:
            all_distances[d] += 1


def decompose(v):
    tree_size = get_subtree_size(v)
    centroid = get_centroid(v, tree_size)

    process_centroid(centroid)

    removed[centroid] = True

    for u in adj[centroid]:
        if not removed[u]:
            decompose(u)
```

```typescript
const MAXN = 1e5;
const adj: number[][] = Array.from({ length: MAXN }, () => []);
const removed: boolean[] = new Array(MAXN).fill(false);
const subtreeSize: number[] = new Array(MAXN).fill(0);
let K = 0;              // Цільова довжина шляху
let answer = 0n;        // Кількість шляхів довжини K (bigint, бо їх може бути багато)

function getSubtreeSize(v: number, p: number = -1): number {
    subtreeSize[v] = 1;
    for (const u of adj[v]) {
        if (u === p || removed[u]) continue;
        subtreeSize[v] += getSubtreeSize(u, v);
    }
    return subtreeSize[v];
}

function getCentroid(v: number, treeSize: number, p: number = -1): number {
    for (const u of adj[v]) {
        if (u === p || removed[u]) continue;
        if (subtreeSize[u] * 2 > treeSize)
            return getCentroid(u, treeSize, v);
    }
    return v;
}

function getDistances(v: number, p: number, dist: number, distances: number[]): void {
    if (dist > K) return;
    distances.push(dist);
    for (const u of adj[v]) {
        if (u === p || removed[u]) continue;
        getDistances(u, v, dist + 1, distances);
    }
}

function processCentroid(centroid: number): void {
    const allDistances = new Map<number, number>();
    allDistances.set(0, 1);

    for (const u of adj[centroid]) {
        if (removed[u]) continue;

        const currentDistances: number[] = [];
        getDistances(u, centroid, 1, currentDistances);

        for (const d of currentDistances) {
            if (K - d >= 0) {
                answer += BigInt(allDistances.get(K - d) ?? 0);
            }
        }

        for (const d of currentDistances) {
            allDistances.set(d, (allDistances.get(d) ?? 0) + 1);
        }
    }
}

function decompose(v: number): void {
    const treeSize = getSubtreeSize(v);
    const centroid = getCentroid(v, treeSize);

    processCentroid(centroid);

    removed[centroid] = true;

    for (const u of adj[centroid]) {
        if (!removed[u]) {
            decompose(u);
        }
    }
}
```

```go
const MAXN = 1e5

var (
	adj         [MAXN][]int
	removed     [MAXN]bool
	subtreeSize [MAXN]int
	K           int   // Цільова довжина шляху
	answer      int64 // Кількість шляхів довжини K
)

func getSubtreeSize(v, p int) int {
	subtreeSize[v] = 1
	for _, u := range adj[v] {
		if u == p || removed[u] {
			continue
		}
		subtreeSize[v] += getSubtreeSize(u, v)
	}
	return subtreeSize[v]
}

func getCentroid(v, treeSize, p int) int {
	for _, u := range adj[v] {
		if u == p || removed[u] {
			continue
		}
		if subtreeSize[u]*2 > treeSize {
			return getCentroid(u, treeSize, v)
		}
	}
	return v
}

func getDistances(v, p, dist int, distances *[]int) {
	if dist > K {
		return
	}
	*distances = append(*distances, dist)
	for _, u := range adj[v] {
		if u == p || removed[u] {
			continue
		}
		getDistances(u, v, dist+1, distances)
	}
}

func processCentroid(centroid int) {
	allDistances := map[int]int{0: 1}

	for _, u := range adj[centroid] {
		if removed[u] {
			continue
		}

		var currentDistances []int
		getDistances(u, centroid, 1, &currentDistances)

		for _, d := range currentDistances {
			if K-d >= 0 {
				answer += int64(allDistances[K-d])
			}
		}

		for _, d := range currentDistances {
			allDistances[d]++
		}
	}
}

func decompose(v int) {
	treeSize := getSubtreeSize(v, -1)
	centroid := getCentroid(v, treeSize, -1)

	processCentroid(centroid)

	removed[centroid] = true

	for _, u := range adj[centroid] {
		if !removed[u] {
			decompose(u)
		}
	}
}
```

</CodeTabs>

Цей шаблон можна адаптувати для розв'язання різних задач за допомогою центроїдної декомпозиції. У цьому конкретному випадку він розв'язує задачу підрахунку всіх шляхів довжини $K$. Стратегія така: для кожного центроїда підраховуємо шляхи, що проходять через нього, знаходячи пари вершин у різних піддеревах на відстанях $d_1$ і $d_2$, сума яких дорівнює $K$ (тобто шлях, що проходить через центроїд, складається з вершини в одному піддереві на відстані $d_1$ від центроїда та вершини в іншому піддереві на відстані $d_2$, де $d_1 + d_2 = K$). Для кожної відстані $d$ у поточному піддереві код підраховує, скільки вершин лежать на відстані $K - d$ у попередніх піддеревах. Оптимізація пропускає відстані, більші за $K$, щоб уникнути зайвої рекурсії.

### Побудова дерева центроїдів \{#building-the-centroid-tree}

Якщо вам потрібно побудувати явну структуру дерева центроїдів (корисно для відповідей на запити):

<CodeTabs>

```cpp
int centroid_parent[MAXN];

int decompose(int v, int p = -1) {
    int tree_size = get_subtree_size(v);
    int centroid = get_centroid(v, tree_size);

    centroid_parent[centroid] = p;
    removed[centroid] = true;

    for (int u : adj[centroid]) {
        if (!removed[u]) {
            decompose(u, centroid);
        }
    }

    return centroid;
}
```

```python
centroid_parent = [-1] * MAXN


def decompose(v, p=-1):
    tree_size = get_subtree_size(v)
    centroid = get_centroid(v, tree_size)

    centroid_parent[centroid] = p
    removed[centroid] = True

    for u in adj[centroid]:
        if not removed[u]:
            decompose(u, centroid)

    return centroid
```

```typescript
const centroidParent: number[] = new Array(MAXN).fill(-1);

function decompose(v: number, p: number = -1): number {
    const treeSize = getSubtreeSize(v);
    const centroid = getCentroid(v, treeSize);

    centroidParent[centroid] = p;
    removed[centroid] = true;

    for (const u of adj[centroid]) {
        if (!removed[u]) {
            decompose(u, centroid);
        }
    }

    return centroid;
}
```

```go
var centroidParent [MAXN]int

func decompose(v, p int) int {
	treeSize := getSubtreeSize(v, -1)
	centroid := getCentroid(v, treeSize, -1)

	centroidParent[centroid] = p
	removed[centroid] = true

	for _, u := range adj[centroid] {
		if !removed[u] {
			decompose(u, centroid)
		}
	}

	return centroid
}
```

</CodeTabs>

## Задачі для практики \{#practice-problems}

- [CSES - Finding a Centroid](https://cses.fi/problemset/task/2079) [difficulty: easy]
- [CSES - Fixed-Length Paths II](https://cses.fi/problemset/task/2081) [difficulty: easy]
- [Codeforces - Xenia and Tree](http://codeforces.com/problemset/problem/342/E) [difficulty: medium]
- [Codeforces - Digit Tree](http://codeforces.com/contest/716/problem/E) [difficulty: medium]
- [OJ - Race](https://oj.uz/problem/view/IOI11_race) [difficulty: medium]
- [SPOJ - QTREE5](http://www.spoj.com/problems/QTREE5/) [difficulty: hard]

## Відеоматеріали \{#video}

<YouTubeEmbed id="-DmMLQCmz94" title="Hybrid Tutorial #-2: Centroid Decomposition — Colin Galen" />
