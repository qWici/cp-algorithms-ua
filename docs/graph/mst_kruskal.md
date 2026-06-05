# Мінімальне кістякове дерево — алгоритм Крускала

Маємо зважений неорієнтований граф.
Ми хочемо знайти піддерево цього графа, яке з'єднує всі вершини (тобто є кістяковим деревом) і має найменшу вагу (тобто сума ваг усіх ребер мінімальна) серед усіх можливих кістякових дерев.
Таке кістякове дерево називається мінімальним кістяковим деревом.

На лівому зображенні ви бачите зважений неорієнтований граф, а на правому — відповідне мінімальне кістякове дерево.

![Випадковий граф](/img/docs/graph/MST_before.png) ![MST цього графа](/img/docs/graph/MST_after.png)

У цій статті ми розглянемо кілька важливих фактів, пов'язаних із мінімальними кістяковими деревами, а потім наведемо найпростішу реалізацію алгоритму Крускала для пошуку мінімального кістякового дерева.

## Властивості мінімального кістякового дерева \{#properties-of-the-minimum-spanning-tree}

* Мінімальне кістякове дерево графа єдине, якщо ваги всіх ребер різні. Інакше може існувати кілька мінімальних кістякових дерев.
  (Конкретні алгоритми зазвичай видають одне з можливих мінімальних кістякових дерев.)
* Мінімальне кістякове дерево також є деревом із мінімальним добутком ваг ребер.
  (Це легко довести, замінивши ваги всіх ребер їхніми логарифмами.)
* У мінімальному кістяковому дереві графа максимальна вага ребра є мінімально можливою серед усіх можливих кістякових дерев цього графа.
  (Це випливає з коректності алгоритму Крускала.)
* Максимальне кістякове дерево (кістякове дерево з максимальною сумою ваг ребер) графа можна отримати аналогічно до мінімального кістякового дерева, змінивши знаки ваг усіх ребер на протилежні, а потім застосувавши будь-який алгоритм пошуку мінімального кістякового дерева.

## Алгоритм Крускала \{#kruskals-algorithm}

Цей алгоритм описав Joseph Bernard Kruskal, Jr. у 1956 році.

Алгоритм Крускала спочатку розміщує всі вершини вихідного графа ізольовано одна від одної, утворюючи ліс із дерев, що складаються з однієї вершини, а потім поступово зливає ці дерева, об'єднуючи на кожній ітерації будь-які два з усіх дерев якимось ребром вихідного графа. Перед виконанням алгоритму всі ребра сортуються за вагою (у неспадному порядку). Потім починається процес об'єднання: перебираємо всі ребра від першого до останнього (у відсортованому порядку), і якщо кінці поточного ребра належать різним піддеревам, то ці піддерева об'єднуються, а ребро додається до відповіді. Після перебору всіх ребер усі вершини належатимуть одному й тому самому піддереву, і ми отримаємо відповідь.

## Найпростіша реалізація \{#the-simplest-implementation}

Наведений нижче код безпосередньо реалізує описаний вище алгоритм і має часову складність $O(M \log M + N^2)$.
Сортування ребер потребує $O(M \log N)$ (що те саме, що й $O(M \log M)$) операцій.
Інформація про піддерево, якому належить вершина, зберігається за допомогою масиву `tree_id[]` — для кожної вершини `v` значення `tree_id[v]` містить номер дерева, якому належить `v`.
Для кожного ребра можна за $O(1)$ визначити, чи належать його кінці різним деревам.
Нарешті, об'єднання двох дерев виконується за $O(N)$ простим проходом по масиву `tree_id[]`.
Враховуючи, що загальна кількість операцій злиття дорівнює $N-1$, ми отримуємо асимптотику $O(M \log N + N^2)$.

<CodeTabs>
```cpp
struct Edge {
    int u, v, weight;
    bool operator<(Edge const& other) {
        return weight < other.weight;
    }
};

int n;
vector<Edge> edges;

int cost = 0;
vector<int> tree_id(n);
vector<Edge> result;
for (int i = 0; i < n; i++)
    tree_id[i] = i;

sort(edges.begin(), edges.end());
   
for (Edge e : edges) {
    if (tree_id[e.u] != tree_id[e.v]) {
        cost += e.weight;
        result.push_back(e);

        int old_id = tree_id[e.u], new_id = tree_id[e.v];
        for (int i = 0; i < n; i++) {
            if (tree_id[i] == old_id)
                tree_id[i] = new_id;
        }
    }
}
```

```python
from dataclasses import dataclass


@dataclass
class Edge:
    u: int
    v: int
    weight: int


n: int
edges: list[Edge] = []

cost = 0
tree_id = list(range(n))  # спочатку кожна вершина — окреме дерево
result: list[Edge] = []

# сортуємо ребра за вагою (неспадний порядок)
edges.sort(key=lambda e: e.weight)

for e in edges:
    if tree_id[e.u] != tree_id[e.v]:
        cost += e.weight
        result.append(e)

        old_id, new_id = tree_id[e.u], tree_id[e.v]
        # об'єднуємо два дерева простим проходом по масиву tree_id
        for i in range(n):
            if tree_id[i] == old_id:
                tree_id[i] = new_id
```

```typescript
interface Edge {
    u: number;
    v: number;
    weight: number;
}

let n: number;
let edges: Edge[];

let cost = 0;
const treeId: number[] = Array.from({ length: n }, (_, i) => i); // кожна вершина — окреме дерево
const result: Edge[] = [];

// сортуємо ребра за вагою (неспадний порядок)
edges.sort((a, b) => a.weight - b.weight);

for (const e of edges) {
    if (treeId[e.u] !== treeId[e.v]) {
        cost += e.weight;
        result.push(e);

        const oldId = treeId[e.u];
        const newId = treeId[e.v];
        // об'єднуємо два дерева простим проходом по масиву treeId
        for (let i = 0; i < n; i++) {
            if (treeId[i] === oldId) {
                treeId[i] = newId;
            }
        }
    }
}
```

```go
type Edge struct {
    u, v, weight int
}

var n int
var edges []Edge

cost := 0
treeID := make([]int, n)
for i := 0; i < n; i++ {
    treeID[i] = i // спочатку кожна вершина — окреме дерево
}
var result []Edge

// сортуємо ребра за вагою (неспадний порядок)
sort.Slice(edges, func(i, j int) bool {
    return edges[i].weight < edges[j].weight
})

for _, e := range edges {
    if treeID[e.u] != treeID[e.v] {
        cost += e.weight
        result = append(result, e)

        oldID, newID := treeID[e.u], treeID[e.v]
        // об'єднуємо два дерева простим проходом по масиву treeID
        for i := 0; i < n; i++ {
            if treeID[i] == oldID {
                treeID[i] = newID
            }
        }
    }
}
```
</CodeTabs>

## Доведення коректності \{#proof-of-correctness}

Чому алгоритм Крускала дає нам правильний результат?

Якщо вихідний граф був зв'язним, то й результуючий граф буде зв'язним.
Бо інакше існували б дві компоненти, які можна було б з'єднати щонайменше одним ребром. Однак це неможливо, адже Крускал обрав би одне з цих ребер, оскільки ідентифікатори компонент різні.
Також результуючий граф не містить циклів, бо ми явно забороняємо це в алгоритмі.
Отже, алгоритм будує кістякове дерево.

То чому ж цей алгоритм дає нам мінімальне кістякове дерево?

Ми можемо за допомогою індукції показати твердження: «якщо $F$ — множина ребер, обраних алгоритмом на будь-якому етапі, то існує MST, що містить усі ребра з $F$».

На початку твердження, очевидно, істинне: порожня множина є підмножиною будь-якого MST.

Тепер припустимо, що $F$ — деяка множина ребер на якомусь етапі алгоритму, $T$ — MST, що містить $F$, а $e$ — нове ребро, яке ми хочемо додати за Крускалом.

Якщо $e$ утворює цикл, то ми його не додаємо, і тому твердження залишається істинним після цього кроку.

Якщо $T$ уже містить $e$, твердження також істинне після цього кроку.

Якщо ж $T$ не містить ребра $e$, то $T + e$ міститиме цикл $C$.
Цей цикл міститиме щонайменше одне ребро $f$, якого немає в $F$.
Множина ребер $T - f + e$ також буде кістяковим деревом.
Зауважимо, що вага $f$ не може бути меншою за вагу $e$, бо інакше Крускал обрав би $f$ раніше.
Вона також не може мати більшу вагу, оскільки тоді сумарна вага $T - f + e$ була б меншою за сумарну вагу $T$, що неможливо, адже $T$ уже є MST.
Це означає, що вага $e$ має бути такою самою, як вага $f$.
Отже, $T - f + e$ також є MST, і воно містить усі ребра з $F + e$.
Тож і тут твердження залишається виконаним після кроку.

Це доводить твердження.
А це означає, що після перебору всіх ребер результуюча множина ребер буде зв'язною й міститиметься в деякому MST, а отже, вона сама вже має бути MST.

## Покращена реалізація \{#improved-implementation}

Ми можемо використати структуру даних [**Система неперетинних множин** (СНМ)](../data_structures/disjoint_set_union.md), щоб написати швидшу реалізацію алгоритму Крускала з часовою складністю близько $O(M \log N)$. [Ця стаття](mst_kruskal_with_dsu.md) детально описує такий підхід.

## Задачі для практики \{#practice-problems}

* [SPOJ - Koicost](http://www.spoj.com/problems/KOICOST/)
* [SPOJ - MaryBMW](http://www.spoj.com/problems/MARYBMW/)
* [Codechef - Fullmetal Alchemist](https://www.codechef.com/ICL2016/problems/ICL16A)
* [Codeforces - Edges in MST](http://codeforces.com/contest/160/problem/D)
* [UVA 12176 - Bring Your Own Horse](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=3328)
* [UVA 10600 - ACM Contest and Blackout](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=1541)
* [UVA 10724 - Road Construction](https://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=1665)
* [Hackerrank - Roads in HackerLand](https://www.hackerrank.com/contests/june-world-codesprint/challenges/johnland/problem)
* [UVA 11710 - Expensive subway](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=2757)
* [Codechef - Chefland and Electricity](https://www.codechef.com/problems/CHEFELEC)
* [UVA 10307 - Killing Aliens in Borg Maze](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=1248)
* [Codeforces - Flea](http://codeforces.com/problemset/problem/32/C)
* [Codeforces - Igon in Museum](http://codeforces.com/problemset/problem/598/D)
* [Codeforces - Hongcow Builds a Nation](http://codeforces.com/problemset/problem/744/A)
* [UVA - 908 - Re-connecting Computer Sites](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=849)
* [UVA 1208 - Oreon](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=3649)
* [UVA 1235 - Anti Brute Force Lock](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=3676)
* [UVA 10034 - Freckles](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=975)
* [UVA 11228 - Transportation system](https://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=2169)
* [UVA 11631 - Dark roads](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=2678)
* [UVA 11733 - Airports](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=2833)
* [UVA 11747 - Heavy Cycle Edges](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=2847)
* [SPOJ - Blinet](http://www.spoj.com/problems/BLINNET/)
* [SPOJ - Help the Old King](http://www.spoj.com/problems/IITKWPCG/)
* [Codeforces - Hierarchy](http://codeforces.com/contest/17/problem/B)
* [SPOJ - Modems](https://www.spoj.com/problems/EC_MODE/)
* [CSES - Road Reparation](https://cses.fi/problemset/task/1675)
* [CSES - Road Construction](https://cses.fi/problemset/task/1676)

## Відеоматеріали \{#video}

- [Union Find Kruskal's Algorithm — WilliamFiset](https://www.youtube.com/watch?v=JZBQLXgSGfs) (6 хв, англійською)
