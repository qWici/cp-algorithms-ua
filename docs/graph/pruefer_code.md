# Код Прюфера

У цій статті ми розглянемо так званий **код Прюфера** (або послідовність Прюфера) — спосіб однозначно закодувати позначене дерево у вигляді послідовності чисел.

За допомогою коду Прюфера ми доведемо **формулу Келі** (яка задає кількість кістякових дерев у повному графі).
Також ми покажемо розв'язок задачі про підрахунок кількості способів додати ребра до графа, щоб зробити його зв'язним.

**Зауважимо**, що ми не розглядатимемо дерева, які складаються з єдиної вершини — це окремий випадок, у якому кілька тверджень суперечать одне одному.

## Код Прюфера \{#prüfer-code-1}

Код Прюфера — це спосіб закодувати позначене дерево з $n$ вершинами за допомогою послідовності з $n - 2$ цілих чисел з проміжку $[0; n-1]$.
Таке кодування також задає **бієкцію** між усіма кістяковими деревами повного графа і числовими послідовностями.

Хоча використовувати код Прюфера для зберігання дерев та операцій над ними недоцільно через особливості цього представлення, коди Прюфера застосовують доволі часто: переважно при розв'язуванні комбінаторних задач.

Винахідник — Хайнц Прюфер — запропонував цей код у 1918 році як доведення формули Келі.

### Побудова коду Прюфера для заданого дерева \{#building-the-prüfer-code-for-a-given-tree}

Код Прюфера будується так.
Ми повторюємо таку процедуру $n - 2$ рази:
ми вибираємо листок дерева з найменшим номером, видаляємо його з дерева і записуємо номер вершини, яка була з ним з'єднана.
Після $n - 2$ ітерацій залишиться лише $2$ вершини, і алгоритм завершується.

Отже, код Прюфера для заданого дерева — це послідовність з $n - 2$ чисел, де кожне число є номером з'єднаної вершини, тобто це число лежить у проміжку $[0, n-1]$.

Алгоритм обчислення коду Прюфера легко реалізувати з часовою складністю $O(n \log n)$, просто використавши структуру даних для вилучення мінімуму (наприклад, `set` або `priority_queue` в C++), яка містить список усіх поточних листків.

<CodeTabs>

```cpp
vector<vector<int>> adj;

vector<int> pruefer_code() {
    int n = adj.size();
    set<int> leafs;
    vector<int> degree(n);
    vector<bool> killed(n, false);
    for (int i = 0; i < n; i++) {
        degree[i] = adj[i].size();
        if (degree[i] == 1)
            leafs.insert(i);
    }

    vector<int> code(n - 2);
    for (int i = 0; i < n - 2; i++) {
        int leaf = *leafs.begin();
        leafs.erase(leafs.begin());
        killed[leaf] = true;

        int v;
        for (int u : adj[leaf]) {
            if (!killed[u])
                v = u;
        }

        code[i] = v;
        if (--degree[v] == 1)
            leafs.insert(v);
    }

    return code;
}
```

```python
adj: list[list[int]] = []


def pruefer_code() -> list[int]:
    n = len(adj)
    degree = [len(adj[i]) for i in range(n)]
    killed = [False] * n
    # Відсортована множина поточних листків (мінімум на початку)
    from sortedcontainers import SortedList
    leafs = SortedList(i for i in range(n) if degree[i] == 1)

    code = [0] * (n - 2)
    for i in range(n - 2):
        leaf = leafs.pop(0)  # листок з найменшим номером
        killed[leaf] = True

        # Єдиний сусід, який ще не видалений
        v = next(u for u in adj[leaf] if not killed[u])

        code[i] = v
        degree[v] -= 1
        if degree[v] == 1:
            leafs.add(v)

    return code
```

```typescript
let adj: number[][] = [];

function prueferCode(): number[] {
  const n = adj.length;
  const degree = adj.map((row) => row.length);
  const killed = new Array<boolean>(n).fill(false);
  // Множина поточних листків; мінімум шукаємо лінійно
  const leafs = new Set<number>();
  for (let i = 0; i < n; i++) {
    if (degree[i] === 1) leafs.add(i);
  }

  const code = new Array<number>(n - 2);
  for (let i = 0; i < n - 2; i++) {
    // Листок з найменшим номером
    let leaf = Infinity;
    for (const x of leafs) if (x < leaf) leaf = x;
    leafs.delete(leaf);
    killed[leaf] = true;

    // Єдиний сусід, який ще не видалений
    let v = -1;
    for (const u of adj[leaf]) if (!killed[u]) v = u;

    code[i] = v;
    if (--degree[v] === 1) leafs.add(v);
  }

  return code;
}
```

```go
var adj [][]int

func prueferCode() []int {
    n := len(adj)
    degree := make([]int, n)
    killed := make([]bool, n)
    // Множина поточних листків; мінімум шукаємо лінійно
    leafs := make(map[int]bool)
    for i := 0; i < n; i++ {
        degree[i] = len(adj[i])
        if degree[i] == 1 {
            leafs[i] = true
        }
    }

    code := make([]int, n-2)
    for i := 0; i < n-2; i++ {
        // Листок з найменшим номером
        leaf := math.MaxInt
        for x := range leafs {
            if x < leaf {
                leaf = x
            }
        }
        delete(leafs, leaf)
        killed[leaf] = true

        // Єдиний сусід, який ще не видалений
        v := -1
        for _, u := range adj[leaf] {
            if !killed[u] {
                v = u
            }
        }

        code[i] = v
        degree[v]--
        if degree[v] == 1 {
            leafs[v] = true
        }
    }

    return code
}
```

</CodeTabs>

Однак побудову можна реалізувати і за лінійний час.
Такий підхід описано в наступному розділі.

### Побудова коду Прюфера для заданого дерева за лінійний час \{#building-the-prüfer-code-for-a-given-tree-in-linear-time}

Суть алгоритму — використати **рухомий вказівник**, який завжди вказуватиме на поточну вершину-листок, яку ми хочемо видалити.

На перший погляд це здається неможливим, бо під час побудови коду Прюфера номер листка може як збільшуватися, так і зменшуватися.
Проте, придивившись уважніше, бачимо, що насправді це не так.
Кількість листків не збільшується. Або кількість зменшується на одиницю (ми видаляємо одну вершину-листок і не отримуємо нової), або вона лишається тією самою (ми видаляємо одну вершину-листок і отримуємо іншу).
У першому випадку немає іншого виходу, окрім як шукати наступну вершину-листок з найменшим номером.
У другому ж випадку ми можемо за $O(1)$ вирішити, чи можемо продовжити з вершиною, яка щойно стала листком, чи нам доведеться шукати наступну вершину-листок з найменшим номером.
І доволі часто ми можемо продовжувати з новою вершиною-листком.

Для цього ми використаємо змінну $\text{ptr}$, яка вказуватиме, що серед вершин від $0$ до $\text{ptr}$ є щонайбільше одна вершина-листок, а саме поточна.
Усі інші вершини в цьому діапазоні або вже видалені з дерева, або мають ще більше ніж одну суміжну вершину.
Водночас ми вважаємо, що ми ще не видаляли жодної вершини-листка з номером, більшим за $\text{ptr}$.

Ця змінна дуже корисна вже в першому випадку.
Після видалення поточного листка ми знаємо, що між $0$ і $\text{ptr}$ не може бути листка, тому ми можемо починати пошук наступного одразу з $\text{ptr} + 1$, і нам не доведеться повертатися до пошуку від вершини $0$.
А в другому випадку можна виокремити ще два випадки:
або щойно отримана вершина-листок менша за $\text{ptr}$, і тоді саме вона має бути наступним листком, оскільки ми знаємо, що інших вершин, менших за $\text{ptr}$, немає.
Або щойно отримана вершина-листок більша.
Але тоді ми також знаємо, що вона має бути більшою за $\text{ptr}$, і можемо знову починати пошук з $\text{ptr} + 1$.

Хоча нам, можливо, доведеться виконувати кілька лінійних пошуків наступної вершини-листка, вказівник $\text{ptr}$ лише зростає, а тому загальна часова складність становить $O(n)$.

<CodeTabs>

```cpp
vector<vector<int>> adj;
vector<int> parent;

void dfs(int v) {
    for (int u : adj[v]) {
        if (u != parent[v]) {
            parent[u] = v;
            dfs(u);
        }
    }
}

vector<int> pruefer_code() {
    int n = adj.size();
    parent.resize(n);
    parent[n-1] = -1;
    dfs(n-1);

    int ptr = -1;
    vector<int> degree(n);
    for (int i = 0; i < n; i++) {
        degree[i] = adj[i].size();
        if (degree[i] == 1 && ptr == -1)
            ptr = i;
    }

    vector<int> code(n - 2);
    int leaf = ptr;
    for (int i = 0; i < n - 2; i++) {
        int next = parent[leaf];
        code[i] = next;
        if (--degree[next] == 1 && next < ptr) {
            leaf = next;
        } else {
            ptr++;
            while (degree[ptr] != 1)
                ptr++;
            leaf = ptr;
        }
    }

    return code;
}
```

```python
adj: list[list[int]] = []
parent: list[int] = []


def dfs(v: int) -> None:
    # Ітеративний обхід, щоб уникнути обмеження глибини рекурсії
    stack = [v]
    while stack:
        x = stack.pop()
        for u in adj[x]:
            if u != parent[x]:
                parent[u] = x
                stack.append(u)


def pruefer_code() -> list[int]:
    global parent
    n = len(adj)
    parent = [0] * n
    parent[n - 1] = -1
    dfs(n - 1)

    degree = [0] * n
    ptr = -1
    for i in range(n):
        degree[i] = len(adj[i])
        if degree[i] == 1 and ptr == -1:
            ptr = i  # перший (найменший) листок

    code = [0] * (n - 2)
    leaf = ptr
    for i in range(n - 2):
        nxt = parent[leaf]
        code[i] = nxt
        degree[nxt] -= 1
        if degree[nxt] == 1 and nxt < ptr:
            leaf = nxt  # новий листок менший за ptr — продовжуємо з ним
        else:
            ptr += 1
            while degree[ptr] != 1:
                ptr += 1
            leaf = ptr

    return code
```

```typescript
let adj: number[][] = [];
let parent: number[] = [];

function dfs(v: number): void {
  // Ітеративний обхід замість рекурсії
  const stack = [v];
  while (stack.length > 0) {
    const x = stack.pop()!;
    for (const u of adj[x]) {
      if (u !== parent[x]) {
        parent[u] = x;
        stack.push(u);
      }
    }
  }
}

function prueferCode(): number[] {
  const n = adj.length;
  parent = new Array<number>(n).fill(0);
  parent[n - 1] = -1;
  dfs(n - 1);

  const degree = new Array<number>(n).fill(0);
  let ptr = -1;
  for (let i = 0; i < n; i++) {
    degree[i] = adj[i].length;
    if (degree[i] === 1 && ptr === -1) ptr = i; // перший (найменший) листок
  }

  const code = new Array<number>(n - 2);
  let leaf = ptr;
  for (let i = 0; i < n - 2; i++) {
    const next = parent[leaf];
    code[i] = next;
    if (--degree[next] === 1 && next < ptr) {
      leaf = next; // новий листок менший за ptr — продовжуємо з ним
    } else {
      ptr++;
      while (degree[ptr] !== 1) ptr++;
      leaf = ptr;
    }
  }

  return code;
}
```

```go
var adj [][]int
var parent []int

func dfs(v int) {
    // Ітеративний обхід замість рекурсії
    stack := []int{v}
    for len(stack) > 0 {
        x := stack[len(stack)-1]
        stack = stack[:len(stack)-1]
        for _, u := range adj[x] {
            if u != parent[x] {
                parent[u] = x
                stack = append(stack, u)
            }
        }
    }
}

func prueferCode() []int {
    n := len(adj)
    parent = make([]int, n)
    parent[n-1] = -1
    dfs(n - 1)

    degree := make([]int, n)
    ptr := -1
    for i := 0; i < n; i++ {
        degree[i] = len(adj[i])
        if degree[i] == 1 && ptr == -1 {
            ptr = i // перший (найменший) листок
        }
    }

    code := make([]int, n-2)
    leaf := ptr
    for i := 0; i < n-2; i++ {
        next := parent[leaf]
        code[i] = next
        degree[next]--
        if degree[next] == 1 && next < ptr {
            leaf = next // новий листок менший за ptr — продовжуємо з ним
        } else {
            ptr++
            for degree[ptr] != 1 {
                ptr++
            }
            leaf = ptr
        }
    }

    return code
}
```

</CodeTabs>

У коді ми спочатку знаходимо для кожної вершини її предка `parent[i]`, тобто того предка, якого ця вершина матиме, коли ми видалятимемо її з дерева.
Цього предка можна знайти, підвісивши дерево за вершину $n-1$.
Це можливо, бо вершина $n-1$ ніколи не буде видалена з дерева.
Ми також обчислюємо степінь кожної вершини.
`ptr` — це вказівник, який показує мінімальний номер серед решти вершин-листків (окрім поточної `leaf`).
Ми або призначимо поточною вершиною-листком `next`, якщо вона теж є листком і менша за `ptr`, або починаємо лінійний пошук вершини-листка з найменшим номером, збільшуючи вказівник.

Легко бачити, що цей код має складність $O(n)$.

### Деякі властивості коду Прюфера \{#some-properties-of-the-prüfer-code}

- Після побудови коду Прюфера залишаться дві вершини.
  Одна з них — вершина з найбільшим номером $n-1$, але про іншу нічого певного сказати не можна.
- Кожна вершина з'являється в коді Прюфера рівно фіксовану кількість разів — на одиницю менше за свій степінь.
  Це легко перевірити, оскільки степінь зменшується щоразу, коли ми записуємо її номер у код, і ми видаляємо її, коли степінь стає рівним $1$.
  Для двох вершин, що залишилися, цей факт також виконується.

### Відновлення дерева за кодом Прюфера \{#restoring-the-tree-using-the-prüfer-code}

Щоб відновити дерево, достатньо зосередитися лише на властивості, яку ми обговорили в попередньому розділі.
Ми вже знаємо степінь усіх вершин шуканого дерева.
Тому ми можемо знайти всі вершини-листки, а також перший листок, який було видалено на першому кроці (це має бути листок з найменшим номером).
Ця вершина-листок була з'єднана з вершиною, що відповідає числу в першій комірці коду Прюфера.

Отже, ми знайшли перше ребро, видалене під час побудови коду Прюфера.
Ми можемо додати це ребро до відповіді й зменшити степені на обох кінцях ребра.

Ми повторюватимемо цю операцію, доки не використаємо всі числа коду Прюфера:
ми шукаємо вершину з найменшим номером і степенем, рівним $1$, з'єднуємо її з наступною вершиною з коду Прюфера і зменшуємо степінь.

Урешті в нас залишається лише дві вершини зі степенем, рівним $1$.
Це ті вершини, які не було видалено під час процесу побудови коду Прюфера.
Ми з'єднуємо їх, отримуючи останнє ребро дерева.
Одна з них завжди буде вершиною $n-1$.

Цей алгоритм легко **реалізувати** за $O(n \log n)$: ми використовуємо структуру даних, що підтримує вилучення мінімуму (наприклад, `set<>` або `priority_queue<>` в C++), щоб зберігати всі вершини-листки.

Наступна реалізація повертає список ребер, що відповідають дереву.

<CodeTabs>

```cpp
vector<pair<int, int>> pruefer_decode(vector<int> const& code) {
    int n = code.size() + 2;
    vector<int> degree(n, 1);
    for (int i : code)
        degree[i]++;

    set<int> leaves;
    for (int i = 0; i < n; i++) {
        if (degree[i] == 1)
            leaves.insert(i);
    }

    vector<pair<int, int>> edges;
    for (int v : code) {
        int leaf = *leaves.begin();
        leaves.erase(leaves.begin());

        edges.emplace_back(leaf, v);
        if (--degree[v] == 1)
            leaves.insert(v);
    }
    edges.emplace_back(*leaves.begin(), n-1);
    return edges;
}
```

```python
def pruefer_decode(code: list[int]) -> list[tuple[int, int]]:
    n = len(code) + 2
    degree = [1] * n
    for i in code:
        degree[i] += 1

    from sortedcontainers import SortedList
    leaves = SortedList(i for i in range(n) if degree[i] == 1)

    edges: list[tuple[int, int]] = []
    for v in code:
        leaf = leaves.pop(0)  # листок з найменшим номером
        edges.append((leaf, v))
        degree[v] -= 1
        if degree[v] == 1:
            leaves.add(v)

    # Два вузли, що лишилися, з'єднуємо останнім ребром
    edges.append((leaves[0], n - 1))
    return edges
```

```typescript
function prueferDecode(code: number[]): [number, number][] {
  const n = code.length + 2;
  const degree = new Array<number>(n).fill(1);
  for (const i of code) degree[i]++;

  const leaves = new Set<number>();
  for (let i = 0; i < n; i++) {
    if (degree[i] === 1) leaves.add(i);
  }

  const edges: [number, number][] = [];
  for (const v of code) {
    // Листок з найменшим номером
    let leaf = Infinity;
    for (const x of leaves) if (x < leaf) leaf = x;
    leaves.delete(leaf);

    edges.push([leaf, v]);
    if (--degree[v] === 1) leaves.add(v);
  }

  // Останнє ребро з'єднує два вузли, що лишилися
  let last = Infinity;
  for (const x of leaves) if (x < last) last = x;
  edges.push([last, n - 1]);
  return edges;
}
```

```go
func prueferDecode(code []int) [][2]int {
    n := len(code) + 2
    degree := make([]int, n)
    for i := range degree {
        degree[i] = 1
    }
    for _, i := range code {
        degree[i]++
    }

    leaves := make(map[int]bool)
    for i := 0; i < n; i++ {
        if degree[i] == 1 {
            leaves[i] = true
        }
    }

    edges := make([][2]int, 0, n-1)
    for _, v := range code {
        // Листок з найменшим номером
        leaf := math.MaxInt
        for x := range leaves {
            if x < leaf {
                leaf = x
            }
        }
        delete(leaves, leaf)

        edges = append(edges, [2]int{leaf, v})
        degree[v]--
        if degree[v] == 1 {
            leaves[v] = true
        }
    }

    // Останнє ребро з'єднує два вузли, що лишилися
    last := math.MaxInt
    for x := range leaves {
        if x < last {
            last = x
        }
    }
    edges = append(edges, [2]int{last, n - 1})
    return edges
}
```

</CodeTabs>

### Відновлення дерева за кодом Прюфера за лінійний час \{#restoring-the-tree-using-the-prüfer-code-in-linear-time}

Щоб отримати дерево за лінійний час, ми можемо застосувати ту саму техніку, яку використовували для отримання коду Прюфера за лінійний час.

Нам не потрібна структура даних для вилучення мінімуму.
Натомість ми можемо помітити, що після обробки поточного ребра листком стає лише одна вершина.
Тому ми можемо або продовжити з цією вершиною, або знайти меншу за допомогою лінійного пошуку, рухаючи вказівник.

<CodeTabs>

```cpp
vector<pair<int, int>> pruefer_decode(vector<int> const& code) {
    int n = code.size() + 2;
    vector<int> degree(n, 1);
    for (int i : code)
        degree[i]++;

    int ptr = 0;
    while (degree[ptr] != 1)
        ptr++;
    int leaf = ptr;

    vector<pair<int, int>> edges;
    for (int v : code) {
        edges.emplace_back(leaf, v);
        if (--degree[v] == 1 && v < ptr) {
            leaf = v;
        } else {
            ptr++;
            while (degree[ptr] != 1)
                ptr++;
            leaf = ptr;
        }
    }
    edges.emplace_back(leaf, n-1);
    return edges;
}
```

```python
def pruefer_decode(code: list[int]) -> list[tuple[int, int]]:
    n = len(code) + 2
    degree = [1] * n
    for i in code:
        degree[i] += 1

    ptr = 0
    while degree[ptr] != 1:
        ptr += 1
    leaf = ptr

    edges: list[tuple[int, int]] = []
    for v in code:
        edges.append((leaf, v))
        degree[v] -= 1
        if degree[v] == 1 and v < ptr:
            leaf = v  # новий листок менший за ptr — продовжуємо з ним
        else:
            ptr += 1
            while degree[ptr] != 1:
                ptr += 1
            leaf = ptr

    edges.append((leaf, n - 1))
    return edges
```

```typescript
function prueferDecode(code: number[]): [number, number][] {
  const n = code.length + 2;
  const degree = new Array<number>(n).fill(1);
  for (const i of code) degree[i]++;

  let ptr = 0;
  while (degree[ptr] !== 1) ptr++;
  let leaf = ptr;

  const edges: [number, number][] = [];
  for (const v of code) {
    edges.push([leaf, v]);
    if (--degree[v] === 1 && v < ptr) {
      leaf = v; // новий листок менший за ptr — продовжуємо з ним
    } else {
      ptr++;
      while (degree[ptr] !== 1) ptr++;
      leaf = ptr;
    }
  }
  edges.push([leaf, n - 1]);
  return edges;
}
```

```go
func prueferDecode(code []int) [][2]int {
    n := len(code) + 2
    degree := make([]int, n)
    for i := range degree {
        degree[i] = 1
    }
    for _, i := range code {
        degree[i]++
    }

    ptr := 0
    for degree[ptr] != 1 {
        ptr++
    }
    leaf := ptr

    edges := make([][2]int, 0, n-1)
    for _, v := range code {
        edges = append(edges, [2]int{leaf, v})
        degree[v]--
        if degree[v] == 1 && v < ptr {
            leaf = v // новий листок менший за ptr — продовжуємо з ним
        } else {
            ptr++
            for degree[ptr] != 1 {
                ptr++
            }
            leaf = ptr
        }
    }
    edges = append(edges, [2]int{leaf, n - 1})
    return edges
}
```

</CodeTabs>

### Бієкція між деревами та кодами Прюфера \{#bijection-between-trees-and-prüfer-codes}

Для кожного дерева існує відповідний йому код Прюфера.
І для кожного коду Прюфера ми можемо відновити вихідне дерево.

Звідси випливає, що й кожен код Прюфера (тобто послідовність з $n-2$ чисел у діапазоні $[0; n - 1]$) відповідає якомусь дереву.

Отже, всі дерева й усі коди Прюфера утворюють бієкцію (**взаємно однозначну відповідність**).

## Формула Келі \{#cayleys-formula}

Формула Келі стверджує, що **кількість кістякових дерев у повному позначеному графі** з $n$ вершинами дорівнює:

$$
n^{n-2}
$$

Існує кілька доведень цієї формули.
З огляду на поняття коду Прюфера це твердження не викликає жодного подиву.

Справді, будь-який код Прюфера з $n-2$ чисел з проміжку $[0; n-1]$ відповідає якомусь дереву з $n$ вершинами.
Отже, ми маємо $n^{n-2}$ різних таких кодів Прюфера.
Оскільки кожне таке дерево є кістяковим деревом повного графа з $n$ вершинами, кількість таких кістякових дерев теж дорівнює $n^{n-2}$.

## Кількість способів зробити граф зв'язним \{#number-of-ways-to-make-a-graph-connected}

Поняття коду Прюфера ще потужніше.
Воно дозволяє створювати набагато загальніші формули, ніж формула Келі.

У цій задачі нам дано граф з $n$ вершинами та $m$ ребрами.
Наразі граф має $k$ компонент.
Ми хочемо обчислити кількість способів додати $k-1$ ребер так, щоб граф став зв'язним (очевидно, що $k-1$ — це мінімальна кількість ребер, необхідна, щоб зробити граф зв'язним).

Виведемо формулу для розв'язання цієї задачі.

Позначимо через $s_1, \dots, s_k$ розміри компонент зв'язності графа.
Ми не можемо додавати ребра всередині компоненти зв'язності.
Тому виявляється, що ця задача дуже схожа на пошук кількості кістякових дерев повного графа з $k$ вершинами.
Єдина відмінність у тому, що кожна вершина насправді має розмір $s_i$: кожне ребро, що з'єднує вершину $i$, фактично домножує відповідь на $s_i$.

Отже, щоб обчислити кількість можливих способів, важливо порахувати, як часто кожна з $k$ вершин використовується у з'єднувальному дереві.
Щоб отримати формулу для задачі, необхідно просумувати відповідь за всіма можливими степенями.

Нехай $d_1, \dots, d_k$ — степені вершин у дереві після з'єднання вершин.
Сума степенів дорівнює подвоєній кількості ребер:

$$
\sum_{i=1}^k d_i = 2k - 2
$$

Якщо вершина $i$ має степінь $d_i$, то вона з'являється $d_i - 1$ разів у коді Прюфера.
Код Прюфера для дерева з $k$ вершинами має довжину $k-2$.
Отже, кількість способів вибрати код з $k-2$ чисел, де число $i$ з'являється рівно $d_i - 1$ разів, дорівнює **поліноміальному коефіцієнту**

$$
\binom{k-2}{d_1-1, d_2-1, \dots, d_k-1} = \frac{(k-2)!}{(d_1-1)! (d_2-1)! \cdots (d_k-1)!}.
$$

З урахуванням того, що кожне ребро, суміжне з вершиною $i$, домножує відповідь на $s_i$, ми отримуємо відповідь за умови, що степені вершин дорівнюють $d_1, \dots, d_k$:

$$
s_1^{d_1} \cdot s_2^{d_2} \cdots s_k^{d_k} \cdot \binom{k-2}{d_1-1, d_2-1, \dots, d_k-1}
$$

Щоб отримати остаточну відповідь, нам потрібно просумувати це за всіма можливими способами вибору степенів:

$$
\sum_{\substack{d_i \ge 1 \\\\ \sum_{i=1}^k d_i = 2k -2}} s_1^{d_1} \cdot s_2^{d_2} \cdots s_k^{d_k} \cdot \binom{k-2}{d_1-1, d_2-1, \dots, d_k-1}
$$

Наразі це виглядає як справді жахлива відповідь, однак ми можемо скористатися **поліноміальною теоремою**, яка стверджує:

$$
(x_1 + \dots + x_m)^p = \sum_{\substack{c_i \ge 0 \\\\ \sum_{i=1}^m c_i = p}} x_1^{c_1} \cdot x_2^{c_2} \cdots x_m^{c_m} \cdot \binom{p}{c_1, c_2, \dots c_m}
$$

Це вже виглядає доволі схоже.
Щоб скористатися нею, нам потрібно лише зробити підстановку $e_i = d_i - 1$:

$$
\sum_{\substack{e_i \ge 0 \\\\ \sum_{i=1}^k e_i = k - 2}} s_1^{e_1+1} \cdot s_2^{e_2+1} \cdots s_k^{e_k+1} \cdot \binom{k-2}{e_1, e_2, \dots, e_k}
$$

Застосувавши поліноміальну теорему, ми отримуємо **відповідь до задачі**:

$$
s_1 \cdot s_2 \cdots s_k \cdot (s_1 + s_2 + \dots + s_k)^{k-2} = s_1 \cdot s_2 \cdots s_k \cdot n^{k-2}
$$

Між іншим, ця формула також справджується для $k = 1$.

## Задачі для практики \{#practice-problems}

- [UVA #10843 - Anne's game](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&category=20&page=show_problem&problem=1784)
- [Timus #1069 - Prufer Code](http://acm.timus.ru/problem.aspx?space=1&num=1069)
- [Codeforces - Clues](http://codeforces.com/contest/156/problem/D)
- [Topcoder - TheCitiesAndRoadsDivTwo](https://community.topcoder.com/stat?c=problem_statement&pm=10774&rd=14146)

## Відеоматеріали \{#video}

<YouTubeEmbed id="Ve447EOW8ww" title="Graph Theory: 40. Cayley's Formula and Prufer Seqences part 1/2 — Sarada Herke" />
