# Перевірка, чи є граф дводольним

Дводольний граф — це граф, вершини якого можна розбити на дві неперетинні множини так, щоб кожне ребро з'єднувало дві вершини з різних множин (тобто немає ребер, які з'єднують вершини з однієї і тієї ж множини). Ці множини зазвичай називають частками.

Нам задано <Term tip="Граф, у якому ребра не мають напрямку: якщо вершини з'єднані, переходити між ними можна в обидва боки.">неорієнтований граф</Term>. Потрібно перевірити, чи є він дводольним, і якщо так — вивести його частки.

:::tip[Коли підходить цей алгоритм?]
- Потрібно лише перевірити, чи граф дводольний (розфарбовний у 2 кольори / без циклів непарної довжини), і за потреби отримати розбиття на частки?
- Граф уже відомий цілком (офлайн), щоб обійти його [пошуком у ширину](breadth-first-search.md) за $O(n+m)$?
- Після перевірки потрібно знайти максимальне парування в дводольному графі? *(тоді → [алгоритм Куна](kuhn_maximum_bipartite_matching.md))*
:::

## Алгоритм \{#algorithm}

Існує теорема, яка стверджує, що граф є дводольним тоді й лише тоді, коли всі його <Term tip="Цикл — це замкнений маршрут, що повертається у вихідну вершину. Парна довжина означає, що він складається з парної кількості ребер.">цикли мають парну довжину</Term>. Проте на практиці зручніше користуватися іншим формулюванням означення: граф є дводольним тоді й лише тоді, коли його можна розфарбувати у два кольори (2-розфарбування).

Скористаємося серією [пошуків у ширину](breadth-first-search.md), стартуючи з кожної вершини, яку ще не відвідали. У кожному пошуку призначаємо вершину, з якої починаємо, частці 1. Щоразу, коли ми відвідуємо ще не відвіданого сусіда вершини, призначеної одній частці, ми призначаємо його іншій частці. Коли ми намагаємося перейти до вже відвіданого сусіда вершини, призначеної одній частці, ми перевіряємо, що його було призначено іншій частці; якщо ж його було призначено тій самій частці, ми робимо висновок, що граф не є дводольним. Щойно ми відвідали всі вершини й успішно призначили їх часткам, ми знаємо, що граф є дводольним і що ми побудували його розбиття.

## Реалізація \{#implementation}

<CodeTabs>

```cpp
int n;
vector<vector<int>> adj;

vector<int> side(n, -1);
bool is_bipartite = true;
queue<int> q;
for (int st = 0; st < n; ++st) {
    if (side[st] == -1) {
        q.push(st);
        side[st] = 0;
        while (!q.empty()) {
            int v = q.front();
            q.pop();
            for (int u : adj[v]) {
                if (side[u] == -1) {
                    side[u] = side[v] ^ 1;
                    q.push(u);
                } else {
                    is_bipartite &= side[u] != side[v];
                }
            }
        }
    }
}

cout << (is_bipartite ? "YES" : "NO") << endl;
```

```python
from collections import deque

# n — кількість вершин, adj — список суміжності
side = [-1] * n           # частка кожної вершини: -1 (не відвідана), 0 або 1
is_bipartite = True
for st in range(n):
    if side[st] == -1:
        q = deque([st])
        side[st] = 0
        while q:
            v = q.popleft()
            for u in adj[v]:
                if side[u] == -1:
                    side[u] = side[v] ^ 1  # сусіду — протилежна частка
                    q.append(u)
                else:
                    # сусід уже відвіданий: частки мають відрізнятися
                    is_bipartite &= side[u] != side[v]

print("YES" if is_bipartite else "NO")
```

```typescript
// n — кількість вершин, adj — список суміжності
const side: number[] = new Array(n).fill(-1); // -1 (не відвідана), 0 або 1
let isBipartite = true;
for (let st = 0; st < n; ++st) {
    if (side[st] === -1) {
        // черга на масиві з індексом голови — без затратного shift()
        const q: number[] = [st];
        let head = 0;
        side[st] = 0;
        while (head < q.length) {
            const v = q[head++];
            for (const u of adj[v]) {
                if (side[u] === -1) {
                    side[u] = side[v] ^ 1; // сусіду — протилежна частка
                    q.push(u);
                } else {
                    // сусід уже відвіданий: частки мають відрізнятися
                    isBipartite &&= side[u] !== side[v];
                }
            }
        }
    }
}

console.log(isBipartite ? "YES" : "NO");
```

```go
// n — кількість вершин, adj — список суміжності
side := make([]int, n)
for i := range side {
    side[i] = -1 // -1 (не відвідана), 0 або 1
}
isBipartite := true
for st := 0; st < n; st++ {
    if side[st] == -1 {
        q := []int{st} // черга-слайс
        side[st] = 0
        for len(q) > 0 {
            v := q[0]
            q = q[1:]
            for _, u := range adj[v] {
                if side[u] == -1 {
                    side[u] = side[v] ^ 1 // сусіду — протилежна частка
                    q = append(q, u)
                } else if side[u] == side[v] {
                    // сусід уже відвіданий і в тій самій частці
                    isBipartite = false
                }
            }
        }
    }
}

if isBipartite {
    fmt.Println("YES")
} else {
    fmt.Println("NO")
}
```

</CodeTabs>

### Задачі для практики: \{#practice-problems}

- [SPOJ - BUGLIFE](http://www.spoj.com/problems/BUGLIFE/)
- [Codeforces - Graph Without Long Directed Paths](https://codeforces.com/contest/1144/problem/F)
- [Codeforces - String Coloring (easy version)](https://codeforces.com/contest/1296/problem/E1)
- [CSES : Building Teams](https://cses.fi/problemset/task/1668)
- [Codeforces - Alternating Path](https://codeforces.com/contest/2204/problem/D)

## Відеоматеріали \{#video}

<YouTubeEmbed id="bZBmN7I7GNQ" title="How to Tell if Graph is Bipartite (by hand) | Graph Theory — Wrath of Math" />
