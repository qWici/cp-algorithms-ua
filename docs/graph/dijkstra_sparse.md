# Алгоритм Дейкстри на розріджених графах

Постановку задачі, сам алгоритм разом із реалізацією та доведенням можна знайти у статті [Алгоритм Дейкстри](dijkstra.md).

## Алгоритм \{#algorithm}

Пригадаймо, що при виведенні складності алгоритму Дейкстри ми використовували два чинники:
час на пошук непозначеної вершини з найменшою відстанню $d[v]$ та час релаксації, тобто час зміни значень $d[\text{to}]$.

У найпростішій реалізації ці операції потребують $O(n)$ та $O(1)$ часу.
Отже, оскільки першу операцію ми виконуємо $O(n)$ разів, а другу — $O(m)$ разів, ми отримали складність $O(n^2 + m)$.

Зрозуміло, що така складність є оптимальною для щільного графа, тобто коли $m \approx n^2$.
Проте у розріджених графах, коли $m$ значно менше за максимальну кількість ребер $n^2$, складність стає менш оптимальною через перший доданок.
Тому необхідно покращити час виконання першої операції (і, звісно, не зіпсувавши при цьому суттєво час другої).

Щоб цього досягти, ми можемо скористатися різними допоміжними структурами даних.
Найефективнішою є **фібоначчієва купа**, яка дозволяє виконувати першу операцію за $O(\log n)$, а другу — за $O(1)$.
Тоді ми отримаємо для алгоритму Дейкстри складність $O(n \log n + m)$, що є також теоретичним мінімумом для задачі пошуку найкоротшого шляху.
Тому цей алгоритм працює оптимально, а фібоначчієві купи є оптимальною структурою даних.
Не існує жодної структури даних, яка могла б виконувати обидві операції за $O(1)$, бо це дозволило б також відсортувати список випадкових чисел за лінійний час, що неможливо.
Цікаво, що існує алгоритм Торупа (Thorup), який знаходить найкоротший шлях за $O(m)$ часу, проте він працює лише для цілочисельних ваг і використовує цілком іншу ідею.
Тож це не призводить до жодних суперечностей.
Фібоначчієві купи забезпечують оптимальну складність для цієї задачі.
Однак їх досить складно реалізувати, до того ж вони мають доволі велику приховану константу.

Як компроміс можна використати структури даних, які виконують обидва типи операцій (видобування мінімуму та оновлення елемента) за $O(\log n)$.
Тоді складність алгоритму Дейкстри становить $O(n \log n + m \log n) = O(m \log n)$.

C++ надає дві такі структури даних: `set` та `priority_queue`.
Перша базується на червоно-чорних деревах, а друга — на купах.
Тому `priority_queue` має меншу приховану константу, але також має недолік:
вона не підтримує операцію видалення елемента.
Через це нам доведеться вдатися до «обхідного шляху», який насправді призводить до дещо гіршого множника $\log m$ замість $\log n$ (хоча з погляду складності вони однакові).

## Реалізація \{#implementation}

### set \{#set}

Почнімо з контейнера `set`.
Оскільки нам потрібно зберігати вершини, впорядковані за їхніми значеннями $d[]$, зручно зберігати власне пари: відстань та індекс вершини.
У результаті в `set` пари автоматично сортуються за своїми відстанями.

<CodeTabs>

```cpp
const int INF = 1000000000;
vector<vector<pair<int, int>>> adj;

void dijkstra(int s, vector<int> & d, vector<int> & p) {
    int n = adj.size();
    d.assign(n, INF);
    p.assign(n, -1);

    d[s] = 0;
    set<pair<int, int>> q;
    q.insert({0, s});
    while (!q.empty()) {
        int v = q.begin()->second;
        q.erase(q.begin());

        for (auto edge : adj[v]) {
            int to = edge.first;
            int len = edge.second;
            
            if (d[v] + len < d[to]) {
                q.erase({d[to], to});
                d[to] = d[v] + len;
                p[to] = v;
                q.insert({d[to], to});
            }
        }
    }
}
```

```python
INF = 1000000000
adj: list[list[tuple[int, int]]] = []  # adj[v] = список пар (to, len)


def dijkstra(s: int) -> tuple[list[int], list[int]]:
    n = len(adj)
    d = [INF] * n
    p = [-1] * n

    d[s] = 0
    # У Python немає вбудованого впорядкованого множинного контейнера (аналога
    # C++ std::set), який давав би і мінімум, і видалення довільного елемента
    # за O(log n). Точний відповідник — SortedList із пакета sortedcontainers
    # (sl.add((d, v)) / sl.remove((d, v)) / sl[0]); тут моделюємо ту саму
    # семантику звичайним set + min(), щоб обійтися лише стандартною бібліотекою.
    q: set[tuple[int, int]] = set()
    q.add((0, s))
    while q:
        d_v, v = min(q)  # пара з найменшою відстанню
        q.discard((d_v, v))

        for to, length in adj[v]:
            if d[v] + length < d[to]:
                q.discard((d[to], to))  # видаляємо стару пару
                d[to] = d[v] + length
                p[to] = v
                q.add((d[to], to))      # вставляємо нову
    return d, p
```

```typescript
const INF = 1000000000;
let adj: Array<Array<[number, number]>>; // adj[v] = масив пар [to, len]

function dijkstra(s: number): { d: number[]; p: number[] } {
    const n = adj.length;
    const d = new Array<number>(n).fill(INF);
    const p = new Array<number>(n).fill(-1);

    d[s] = 0;
    // У TypeScript/JavaScript немає впорядкованої множини на кшталт C++ std::set,
    // тому моделюємо її через Set<string> із ключем "dist,vertex" та лінійним
    // пошуком мінімуму. Для навчальних цілей цього достатньо; у реальному коді
    // варто скористатися варіантом з купою (нижче) або збалансованим деревом.
    const q = new Set<string>();
    const key = (dist: number, v: number) => `${dist},${v}`;
    q.add(key(0, s));
    while (q.size > 0) {
        // знаходимо ключ із найменшою відстанню
        let bestV = -1;
        let bestD = Infinity;
        let bestKey = "";
        for (const k of q) {
            const comma = k.indexOf(",");
            const dist = Number(k.slice(0, comma));
            const v = Number(k.slice(comma + 1));
            if (dist < bestD || (dist === bestD && v < bestV)) {
                bestD = dist;
                bestV = v;
                bestKey = k;
            }
        }
        q.delete(bestKey);
        const v = bestV;

        for (const [to, len] of adj[v]) {
            if (d[v] + len < d[to]) {
                q.delete(key(d[to], to)); // видаляємо стару пару
                d[to] = d[v] + len;
                p[to] = v;
                q.add(key(d[to], to));    // вставляємо нову
            }
        }
    }
    return { d, p };
}
```

```go
const INF = 1000000000

var adj [][][2]int // adj[v] = список пар {to, len}

// У Go немає впорядкованої множини зі стандартної бібліотеки. Тут моделюємо
// семантику C++ std::set звичайним map[[2]int]bool із лінійним пошуком
// мінімуму, щоб тримати приклад у межах стандартної бібліотеки. Для робочого
// коду краще скористатися варіантом із container/heap (нижче).
func dijkstra(s int) (d []int, p []int) {
    n := len(adj)
    d = make([]int, n)
    p = make([]int, n)
    for i := range d {
        d[i] = INF
        p[i] = -1
    }

    d[s] = 0
    q := map[[2]int]bool{{0, s}: true}
    for len(q) > 0 {
        // знаходимо пару {dist, v} з найменшою відстанню
        best := [2]int{INF + 1, -1}
        for pair := range q {
            if pair[0] < best[0] || (pair[0] == best[0] && pair[1] < best[1]) {
                best = pair
            }
        }
        delete(q, best)
        v := best[1]

        for _, edge := range adj[v] {
            to, length := edge[0], edge[1]
            if d[v]+length < d[to] {
                delete(q, [2]int{d[to], to}) // видаляємо стару пару
                d[to] = d[v] + length
                p[to] = v
                q[[2]int{d[to], to}] = true  // вставляємо нову
            }
        }
    }
    return d, p
}
```

</CodeTabs>

Масив $u[]$ зі звичайної реалізації алгоритму Дейкстри нам більше не потрібен.
Ми використовуватимемо `set`, щоб зберігати цю інформацію, а також щоб знаходити з його допомогою вершину з найменшою відстанню.
Він певною мірою діє як черга.
Головний цикл виконується доти, доки в множині/черзі ще залишаються вершини.
Вершина з найменшою відстанню видобувається, і для кожної успішної релаксації ми спочатку видаляємо стару пару, а потім, після релаксації, додаємо до черги нову пару.

### priority_queue \{#priority_queue}

Головна відмінність від реалізації зі `set` полягає в тому, що в багатьох мовах, зокрема в C++, ми не можемо видаляти елементи з `priority_queue` (хоча купи теоретично можуть підтримувати таку операцію).
Тому нам доведеться скористатися обхідним шляхом:
ми просто не видаляємо стару пару з черги.
Як наслідок, одна вершина може водночас з'являтися в черзі кілька разів з різними відстанями.
Серед цих пар нас цікавлять лише ті, у яких перший елемент дорівнює відповідному значенню в $d[]$; усі інші пари — застарілі.
Тому нам потрібно зробити невелику модифікацію:
на початку кожної ітерації, після видобування чергової пари, ми перевіряємо, чи це важлива пара, чи це вже застаріла й опрацьована пара.
Ця перевірка важлива, інакше складність може зрости аж до $O(n m)$.

За замовчуванням `priority_queue` сортує елементи за спаданням.
Щоб змусити її сортувати елементи за зростанням, ми можемо або зберігати в ній від'ємні відстані, або передати їй іншу функцію сортування.
Ми оберемо другий варіант.

<CodeTabs>

```cpp
const int INF = 1000000000;
vector<vector<pair<int, int>>> adj;

void dijkstra(int s, vector<int> & d, vector<int> & p) {
    int n = adj.size();
    d.assign(n, INF);
    p.assign(n, -1);

    d[s] = 0;
    using pii = pair<int, int>;
    priority_queue<pii, vector<pii>, greater<pii>> q;
    q.push({0, s});
    while (!q.empty()) {
        int v = q.top().second;
        int d_v = q.top().first;
        q.pop();
        if (d_v != d[v])
            continue;

        for (auto edge : adj[v]) {
            int to = edge.first;
            int len = edge.second;
            
            if (d[v] + len < d[to]) {
                d[to] = d[v] + len;
                p[to] = v;
                q.push({d[to], to});
            }
        }
    }
}
```

```python
import heapq

INF = 1000000000
adj: list[list[tuple[int, int]]] = []  # adj[v] = список пар (to, len)


def dijkstra(s: int) -> tuple[list[int], list[int]]:
    n = len(adj)
    d = [INF] * n
    p = [-1] * n

    d[s] = 0
    # heapq — це min-купа, тому пари (відстань, вершина) видобуваються в
    # порядку зростання відстані; додаткова функція порівняння не потрібна.
    # Видалення довільного елемента heapq не підтримує (як і C++ priority_queue),
    # тож застосовуємо ту саму «лінь»: стару пару не видаляємо, а застарілі
    # пари відсіюємо перевіркою d_v != d[v] після видобування.
    q: list[tuple[int, int]] = [(0, s)]
    while q:
        d_v, v = heapq.heappop(q)
        if d_v != d[v]:
            continue

        for to, length in adj[v]:
            if d[v] + length < d[to]:
                d[to] = d[v] + length
                p[to] = v
                heapq.heappush(q, (d[to], to))
    return d, p
```

```typescript
const INF = 1000000000;
let adj: Array<Array<[number, number]>>; // adj[v] = масив пар [to, len]

// У стандартній бібліотеці TypeScript/JavaScript немає купи, тому реалізуємо
// компактну бінарну min-купу пар [відстань, вершина], впорядкованих за
// відстанню. Видалення довільного елемента не підтримуємо — використовуємо
// «ліниву» схему (застарілі пари відсіюються в самому алгоритмі).
class MinHeap {
    private a: Array<[number, number]> = [];
    get size(): number {
        return this.a.length;
    }
    push(item: [number, number]): void {
        const a = this.a;
        a.push(item);
        let i = a.length - 1;
        while (i > 0) {
            const parent = (i - 1) >> 1;
            if (a[parent][0] <= a[i][0]) break;
            [a[parent], a[i]] = [a[i], a[parent]];
            i = parent;
        }
    }
    pop(): [number, number] {
        const a = this.a;
        const top = a[0];
        const last = a.pop()!;
        if (a.length > 0) {
            a[0] = last;
            let i = 0;
            const n = a.length;
            for (;;) {
                const l = 2 * i + 1;
                const r = 2 * i + 2;
                let smallest = i;
                if (l < n && a[l][0] < a[smallest][0]) smallest = l;
                if (r < n && a[r][0] < a[smallest][0]) smallest = r;
                if (smallest === i) break;
                [a[smallest], a[i]] = [a[i], a[smallest]];
                i = smallest;
            }
        }
        return top;
    }
}

function dijkstra(s: number): { d: number[]; p: number[] } {
    const n = adj.length;
    const d = new Array<number>(n).fill(INF);
    const p = new Array<number>(n).fill(-1);

    d[s] = 0;
    const q = new MinHeap();
    q.push([0, s]);
    while (q.size > 0) {
        const [dV, v] = q.pop();
        if (dV !== d[v]) continue; // застаріла пара

        for (const [to, len] of adj[v]) {
            if (d[v] + len < d[to]) {
                d[to] = d[v] + len;
                p[to] = v;
                q.push([d[to], to]);
            }
        }
    }
    return { d, p };
}
```

```go
import "container/heap"

const INF = 1000000000

var adj [][][2]int // adj[v] = список пар {to, len}

// Реалізуємо купу через інтерфейс heap.Interface зі стандартного пакета
// container/heap. Елемент — пара {відстань, вершина}; Less упорядковує за
// відстанню, тому Pop повертає мінімум. Видалення довільного елемента не
// застосовуємо — користуємося «лінивою» схемою, як у C++ priority_queue.
type pq [][2]int

func (h pq) Len() int            { return len(h) }
func (h pq) Less(i, j int) bool  { return h[i][0] < h[j][0] }
func (h pq) Swap(i, j int)       { h[i], h[j] = h[j], h[i] }
func (h *pq) Push(x interface{}) { *h = append(*h, x.([2]int)) }
func (h *pq) Pop() interface{} {
    old := *h
    n := len(old)
    item := old[n-1]
    *h = old[:n-1]
    return item
}

func dijkstra(s int) (d []int, p []int) {
    n := len(adj)
    d = make([]int, n)
    p = make([]int, n)
    for i := range d {
        d[i] = INF
        p[i] = -1
    }

    d[s] = 0
    q := &pq{{0, s}}
    heap.Init(q)
    for q.Len() > 0 {
        top := heap.Pop(q).([2]int)
        dV, v := top[0], top[1]
        if dV != d[v] {
            continue // застаріла пара
        }

        for _, edge := range adj[v] {
            to, length := edge[0], edge[1]
            if d[v]+length < d[to] {
                d[to] = d[v] + length
                p[to] = v
                heap.Push(q, [2]int{d[to], to})
            }
        }
    }
    return d, p
}
```

</CodeTabs>

На практиці версія з `priority_queue` трохи швидша за версію зі `set`.

Цікаво, що в [технічному звіті 2007 року](https://www3.cs.stonybrook.edu/~rezaul/papers/TR-07-54.pdf) дійшли висновку, що варіант алгоритму без операцій зменшення ключа (decrease-key) працював швидше за варіант із такими операціями, причому розрив у швидкодії був більшим для розріджених графів.

### Позбуваємося пар \{#getting-rid-of-pairs}

Можна ще трохи покращити швидкодію, якщо зберігати в контейнерах не пари, а лише індекси вершин.
У цьому випадку нам потрібно перевантажити оператор порівняння:
він має порівнювати дві вершини, використовуючи відстані, що зберігаються в $d[]$.

Унаслідок релаксації відстань до деяких вершин зміниться.
Проте структура даних не пересортує себе автоматично.
Насправді зміна відстаней до вершин у черзі може зруйнувати структуру даних.
Як і раніше, нам потрібно видалити вершину перед тим, як її релаксувати, а потім знову вставити її.

Оскільки видаляти ми можемо лише зі `set`, ця оптимізація застосовна лише до методу зі `set` і не працює з реалізацією на `priority_queue`.
На практиці це суттєво підвищує швидкодію, особливо коли для зберігання відстаней використовуються більші типи даних, як-от `long long` чи `double`.

## Відеоматеріали \{#video}

- [Implementing Dijkstra's Algorithm with a Priority Queue — Mary Elaine Califf](https://www.youtube.com/watch?v=CerlT7tTZfY) (11 хв, англійською)
