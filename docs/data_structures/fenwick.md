# Дерево Фенвіка

Нехай $f$ — деяка групова операція (бінарна асоціативна функція над множиною з нейтральним елементом та оберненими елементами), а $A$ — масив цілих чисел довжини $N$.
Позначимо інфіксний запис $f$ через $*$; тобто $f(x,y) = x*y$ для довільних цілих $x,y$.
(Оскільки операція асоціативна, при інфіксному записі ми опускатимемо дужки, що задають порядок застосування $f$.)

Дерево Фенвіка — це структура даних, яка:

* обчислює значення функції $f$ на заданому відрізку $[l, r]$ (тобто $A_l * A_{l+1} * \dots * A_r$) за $O(\log N)$ часу
* оновлює значення елемента масиву $A$ за $O(\log N)$ часу
* потребує $O(N)$ пам'яті (стільки ж, скільки й сам масив $A$)
* проста у використанні та програмуванні, особливо у випадку багатовимірних масивів

Найпоширеніше застосування дерева Фенвіка — _обчислення суми на відрізку_.
Наприклад, якщо взяти за групову операцію додавання над множиною цілих чисел, тобто $f(x,y) = x + y$: тоді бінарна операція $*$ — це $+$, тож $A_l * A_{l+1} * \dots * A_r = A_l + A_{l+1} + \dots + A_{r}$.

Дерево Фенвіка також називають **двійковим індексованим деревом** (BIT).
Уперше його описали в роботі під назвою "A new data structure for cumulative frequency tables" (Peter M. Fenwick, 1994).

## Опис \{#description}

### Огляд \{#overview}

Для простоти вважатимемо, що функція $f$ задана як $f(x,y) = x + y$ над цілими числами.

Нехай нам дано масив цілих чисел $A[0 \dots N-1]$.
(Зауважимо, що ми використовуємо нумерацію з нуля.)
Дерево Фенвіка — це просто масив $T[0 \dots N-1]$, де кожен елемент дорівнює сумі елементів масиву $A$ на деякому відрізку $[g(i), i]$:

$$
T_i = \sum_{j = g(i)}^{i}{A_j}
$$

де $g$ — деяка функція, що задовольняє умову $0 \le g(i) \le i$.
Функцію $g$ ми означимо в наступних кількох абзацах.

Цю структуру даних називають деревом, бо її можна гарно зобразити у вигляді дерева, хоча нам і не потрібно будувати справжнє дерево з вершинами та ребрами.
Для обробки всіх запитів нам достатньо підтримувати лише масив $T$.

**Зауваження:** Подане тут дерево Фенвіка використовує нумерацію з нуля.
Багато хто користується варіантом дерева Фенвіка з нумерацією з одиниці.
Тому в розділі про реалізацію ви також знайдете альтернативну реалізацію з нумерацією з одиниці.
Обидві версії еквівалентні за часовою та просторовою складністю.

Тепер ми можемо записати псевдокод для двох згаданих вище операцій.
Нижче ми отримуємо суму елементів масиву $A$ на відрізку $[0, r]$ та оновлюємо (збільшуємо) деякий елемент $A_i$:

```python
def sum(int r):
    res = 0
    while (r >= 0):
        res += t[r]
        r = g(r) - 1
    return res

def increase(int i, int delta):
    for all j with g(j) <= i <= j:
        t[j] += delta
```

Функція `sum` працює так:

1. Спершу вона додає до `result` суму на відрізку $[g(r), r]$ (тобто $T[r]$).
2. Потім вона «перестрибує» до відрізка $[g(g(r)-1), g(r)-1]$ і додає до `result` суму цього відрізка.
3. Це триває доти, доки вона не «перестрибне» з $[0, g(g( \dots g(r)-1 \dots -1)-1)]$ до $[g(-1), -1]$; на цьому функція `sum` припиняє стрибати.

Функція `increase` працює за тією самою аналогією, але «стрибає» в напрямку зростання індексів:

1. Сума для кожного відрізка вигляду $[g(j), j]$, що задовольняє умову $g(j) \le i \le j$, збільшується на `delta`; тобто `t[j] += delta`.
Отже, оновлюються всі елементи $T$, що відповідають відрізкам, у яких лежить $A_i$.

Складність обох функцій `sum` та `increase` залежить від функції $g$.
Існує багато способів обрати функцію $g$ так, щоб $0 \le g(i) \le i$ для всіх $i$.
Наприклад, підходить функція $g(i) = i$, що дає $T = A$ (у такому разі запити на суму повільні).
Можна було б також узяти функцію $g(i) = 0$.
Це відповідало б масивам префіксних сум (у такому разі знаходження суми на відрізку $[0, i]$ потребуватиме лише сталого часу; проте оновлення будуть повільними).
Хитрість алгоритму дерев Фенвіка полягає в тому, що він використовує особливе означення функції $g$, яке дозволяє виконувати обидві операції за $O(\log N)$ часу.

### Означення $g(i)$ \{#data-toc-label}

Обчислення $g(i)$ задається такою простою операцією:
ми замінюємо всі завершальні біти $1$ у двійковому записі числа $i$ на біти $0$.

Іншими словами, якщо наймолодший двійковий розряд числа $i$ дорівнює $0$, то $g(i) = i$.
А інакше наймолодший розряд дорівнює $1$, і тоді ми беремо цю $1$ та всі інші завершальні одиниці й перевертаємо їх.

Наприклад, ми отримуємо

$$
\begin{align}
g(11) = g(1011_2) = 1000_2 &= 8 \\\\
g(12) = g(1100_2) = 1100_2 &= 12 \\\\
g(13) = g(1101_2) = 1100_2 &= 12 \\\\
g(14) = g(1110_2) = 1110_2 &= 14 \\\\
g(15) = g(1111_2) = 0000_2 &= 0 \\\\
\end{align}
$$

Для описаної вище нетривіальної операції існує проста реалізація через бітові операції:

$$
g(i) = i ~\&~ (i+1),
$$

де $\&$ — оператор побітового І. Неважко переконатися, що це рішення робить те саме, що й описана вище операція.

Тепер нам лише потрібно знайти спосіб перебрати всі $j$ такі, що $g(j) \le i \le j$.

Легко бачити, що ми можемо знайти всі такі $j$, починаючи з $i$ та перевертаючи останній невстановлений біт.
Цю операцію ми назвемо $h(j)$.
Наприклад, для $i = 10$ маємо:

$$
\begin{align}
10 &= 0001010_2 \\\\
h(10) = 11 &= 0001011_2 \\\\
h(11) = 15 &= 0001111_2 \\\\
h(15) = 31 &= 0011111_2 \\\\
h(31) = 63 &= 0111111_2 \\\\
\vdots &
\end{align}
$$

Як і слід було очікувати, операцію $h$ теж можна просто виконати через бітові операції:

$$
h(j) = j ~|~ (j+1),
$$

де $|$ — оператор побітового АБО.

На наступному зображенні показано один із можливих способів інтерпретації дерева Фенвіка як дерева.
Вершини дерева показують відрізки, які вони покривають.

<center> <img src="/img/docs/data_structures/binary_indexed_tree.png" alt="Binary Indexed Tree" /> </center>

## Реалізація \{#implementation}

### Знаходження суми в одновимірному масиві \{#finding-sum-in-one-dimensional-array}

Тут ми наводимо реалізацію дерева Фенвіка для запитів на суму та оновлень одного елемента.

Звичайне дерево Фенвіка вміє відповідати лише на запити на суму вигляду $[0, r]$ за допомогою `sum(int r)`, однак ми можемо відповідати й на інші запити вигляду $[l, r]$, обчисливши дві суми $[0, r]$ та $[0, l-1]$ і віднявши їх.
Це реалізовано в методі `sum(int l, int r)`.

Також ця реалізація підтримує два конструктори.
Ви можете створити дерево Фенвіка, ініціалізоване нулями, або перетворити наявний масив на форму дерева Фенвіка.


<CodeTabs>

```cpp
struct FenwickTree {
    vector<int> bit;  // двійкове індексоване дерево
    int n;

    FenwickTree(int n) {
        this->n = n;
        bit.assign(n, 0);
    }

    FenwickTree(vector<int> const &a) : FenwickTree(a.size()) {
        for (size_t i = 0; i < a.size(); i++)
            add(i, a[i]);
    }

    int sum(int r) {
        int ret = 0;
        for (; r >= 0; r = (r & (r + 1)) - 1)
            ret += bit[r];
        return ret;
    }

    int sum(int l, int r) {
        return sum(r) - sum(l - 1);
    }

    void add(int idx, int delta) {
        for (; idx < n; idx = idx | (idx + 1))
            bit[idx] += delta;
    }
};
```

```python
class FenwickTree:
    def __init__(self, n):
        self.n = n
        self.bit = [0] * n  # двійкове індексоване дерево

    @classmethod
    def from_array(cls, a):
        # перетворюємо наявний масив на форму дерева Фенвіка
        ft = cls(len(a))
        for i, x in enumerate(a):
            ft.add(i, x)
        return ft

    def sum_prefix(self, r):
        # сума на відрізку [0, r]
        res = 0
        while r >= 0:
            res += self.bit[r]
            r = (r & (r + 1)) - 1
        return res

    def sum_range(self, l, r):
        # сума на відрізку [l, r]
        return self.sum_prefix(r) - self.sum_prefix(l - 1)

    def add(self, idx, delta):
        while idx < self.n:
            self.bit[idx] += delta
            idx |= idx + 1
```

```typescript
class FenwickTree {
  private bit: number[]; // двійкове індексоване дерево
  private n: number;

  constructor(n: number) {
    this.n = n;
    this.bit = new Array(n).fill(0);
  }

  // перетворюємо наявний масив на форму дерева Фенвіка
  static fromArray(a: number[]): FenwickTree {
    const ft = new FenwickTree(a.length);
    a.forEach((x, i) => ft.add(i, x));
    return ft;
  }

  // сума на відрізку [0, r]
  sumPrefix(r: number): number {
    let res = 0;
    for (; r >= 0; r = (r & (r + 1)) - 1) res += this.bit[r];
    return res;
  }

  // сума на відрізку [l, r]
  sumRange(l: number, r: number): number {
    return this.sumPrefix(r) - this.sumPrefix(l - 1);
  }

  add(idx: number, delta: number): void {
    for (; idx < this.n; idx = idx | (idx + 1)) this.bit[idx] += delta;
  }
}
```

```go
type FenwickTree struct {
	bit []int // двійкове індексоване дерево
	n   int
}

func NewFenwickTree(n int) *FenwickTree {
	return &FenwickTree{bit: make([]int, n), n: n}
}

// перетворюємо наявний масив на форму дерева Фенвіка
func NewFenwickTreeFromArray(a []int) *FenwickTree {
	ft := NewFenwickTree(len(a))
	for i, x := range a {
		ft.Add(i, x)
	}
	return ft
}

// сума на відрізку [0, r]
func (ft *FenwickTree) SumPrefix(r int) int {
	res := 0
	for ; r >= 0; r = (r & (r + 1)) - 1 {
		res += ft.bit[r]
	}
	return res
}

// сума на відрізку [l, r]
func (ft *FenwickTree) SumRange(l, r int) int {
	return ft.SumPrefix(r) - ft.SumPrefix(l-1)
}

func (ft *FenwickTree) Add(idx, delta int) {
	for ; idx < ft.n; idx = idx | (idx + 1) {
		ft.bit[idx] += delta
	}
}
```

</CodeTabs>

### Лінійна побудова \{#linear-construction}

Наведена вище реалізація потребує $O(N \log N)$ часу.
Її можна покращити до $O(N)$ часу.

Ідея полягає в тому, що число $a[i]$ за індексом $i$ робить внесок у відрізок, що зберігається в $bit[i]$, та в усі відрізки, у які робить внесок індекс $i | (i + 1)$.
Тож, додаючи числа по порядку, вам потрібно лише проштовхнути поточну суму далі до наступного відрізка, де вона потім буде проштовхнута далі до наступного відрізка, і так далі.

<CodeTabs>

```cpp
FenwickTree(vector<int> const &a) : FenwickTree(a.size()){
    for (int i = 0; i < n; i++) {
        bit[i] += a[i];
        int r = i | (i + 1);
        if (r < n) bit[r] += bit[i];
    }
}
```

```python
@classmethod
def from_array(cls, a):
    ft = cls(len(a))
    for i in range(ft.n):
        ft.bit[i] += a[i]
        r = i | (i + 1)
        if r < ft.n:
            ft.bit[r] += ft.bit[i]
    return ft
```

```typescript
static fromArray(a: number[]): FenwickTree {
  const ft = new FenwickTree(a.length);
  for (let i = 0; i < ft.n; i++) {
    ft.bit[i] += a[i];
    const r = i | (i + 1);
    if (r < ft.n) ft.bit[r] += ft.bit[i];
  }
  return ft;
}
```

```go
func NewFenwickTreeFromArray(a []int) *FenwickTree {
	ft := NewFenwickTree(len(a))
	for i := 0; i < ft.n; i++ {
		ft.bit[i] += a[i]
		r := i | (i + 1)
		if r < ft.n {
			ft.bit[r] += ft.bit[i]
		}
	}
	return ft
}
```

</CodeTabs>

### Знаходження мінімуму на $[0, r]$ в одновимірному масиві \{#data-toc-label-1}

Очевидно, що не існує простого способу знайти мінімум на відрізку $[l, r]$ за допомогою дерева Фенвіка, оскільки дерево Фенвіка вміє відповідати лише на запити вигляду $[0, r]$.
Крім того, щоразу під час оновлення (`update`) значення нове значення має бути меншим за поточне.
Обидва ці суттєві обмеження виникають тому, що операція $min$ разом із множиною цілих чисел не утворює групи, бо немає обернених елементів.

<CodeTabs>

```cpp
struct FenwickTreeMin {
    vector<int> bit;
    int n;
    const int INF = (int)1e9;

    FenwickTreeMin(int n) {
        this->n = n;
        bit.assign(n, INF);
    }

    FenwickTreeMin(vector<int> a) : FenwickTreeMin(a.size()) {
        for (size_t i = 0; i < a.size(); i++)
            update(i, a[i]);
    }

    int getmin(int r) {
        int ret = INF;
        for (; r >= 0; r = (r & (r + 1)) - 1)
            ret = min(ret, bit[r]);
        return ret;
    }

    void update(int idx, int val) {
        for (; idx < n; idx = idx | (idx + 1))
            bit[idx] = min(bit[idx], val);
    }
};
```

```python
class FenwickTreeMin:
    INF = 10**9

    def __init__(self, n):
        self.n = n
        self.bit = [self.INF] * n

    @classmethod
    def from_array(cls, a):
        ft = cls(len(a))
        for i, x in enumerate(a):
            ft.update(i, x)
        return ft

    def getmin(self, r):
        # мінімум на відрізку [0, r]
        res = self.INF
        while r >= 0:
            res = min(res, self.bit[r])
            r = (r & (r + 1)) - 1
        return res

    def update(self, idx, val):
        # нове значення має бути меншим за поточне
        while idx < self.n:
            self.bit[idx] = min(self.bit[idx], val)
            idx |= idx + 1
```

```typescript
class FenwickTreeMin {
  private bit: number[];
  private n: number;
  private static readonly INF = 1e9;

  constructor(n: number) {
    this.n = n;
    this.bit = new Array(n).fill(FenwickTreeMin.INF);
  }

  static fromArray(a: number[]): FenwickTreeMin {
    const ft = new FenwickTreeMin(a.length);
    a.forEach((x, i) => ft.update(i, x));
    return ft;
  }

  // мінімум на відрізку [0, r]
  getmin(r: number): number {
    let res = FenwickTreeMin.INF;
    for (; r >= 0; r = (r & (r + 1)) - 1) res = Math.min(res, this.bit[r]);
    return res;
  }

  // нове значення має бути меншим за поточне
  update(idx: number, val: number): void {
    for (; idx < this.n; idx = idx | (idx + 1))
      this.bit[idx] = Math.min(this.bit[idx], val);
  }
}
```

```go
const inf = int(1e9)

type FenwickTreeMin struct {
	bit []int
	n   int
}

func NewFenwickTreeMin(n int) *FenwickTreeMin {
	bit := make([]int, n)
	for i := range bit {
		bit[i] = inf
	}
	return &FenwickTreeMin{bit: bit, n: n}
}

func NewFenwickTreeMinFromArray(a []int) *FenwickTreeMin {
	ft := NewFenwickTreeMin(len(a))
	for i, x := range a {
		ft.Update(i, x)
	}
	return ft
}

// мінімум на відрізку [0, r]
func (ft *FenwickTreeMin) GetMin(r int) int {
	res := inf
	for ; r >= 0; r = (r & (r + 1)) - 1 {
		res = min(res, ft.bit[r])
	}
	return res
}

// нове значення має бути меншим за поточне
func (ft *FenwickTreeMin) Update(idx, val int) {
	for ; idx < ft.n; idx = idx | (idx + 1) {
		ft.bit[idx] = min(ft.bit[idx], val)
	}
}
```

</CodeTabs>

Зауваження: можна реалізувати дерево Фенвіка, яке вміє обробляти довільні запити на мінімум на відрізку та довільні оновлення.
У роботі [Efficient Range Minimum Queries using Binary Indexed Trees](http://ioinformatics.org/oi/pdf/v9_2015_39_44.pdf) описано такий підхід.
Однак за цього підходу вам потрібно підтримувати над даними друге двійкове індексоване дерево зі трохи іншою структурою, оскільки одного дерева недостатньо, щоб зберегти значення всіх елементів масиву.
Реалізація також значно складніша порівняно зі звичайною реалізацією для сум.

### Знаходження суми у двовимірному масиві \{#finding-sum-in-two-dimensional-array}

Як уже зазначалося, дерево Фенвіка дуже легко реалізувати для багатовимірного масиву.

<CodeTabs>

```cpp
struct FenwickTree2D {
    vector<vector<int>> bit;
    int n, m;

    // init(...) { ... }

    int sum(int x, int y) {
        int ret = 0;
        for (int i = x; i >= 0; i = (i & (i + 1)) - 1)
            for (int j = y; j >= 0; j = (j & (j + 1)) - 1)
                ret += bit[i][j];
        return ret;
    }

    void add(int x, int y, int delta) {
        for (int i = x; i < n; i = i | (i + 1))
            for (int j = y; j < m; j = j | (j + 1))
                bit[i][j] += delta;
    }
};
```

```python
class FenwickTree2D:
    def __init__(self, n, m):
        self.n = n
        self.m = m
        self.bit = [[0] * m for _ in range(n)]

    def sum(self, x, y):
        res = 0
        i = x
        while i >= 0:
            j = y
            while j >= 0:
                res += self.bit[i][j]
                j = (j & (j + 1)) - 1
            i = (i & (i + 1)) - 1
        return res

    def add(self, x, y, delta):
        i = x
        while i < self.n:
            j = y
            while j < self.m:
                self.bit[i][j] += delta
                j |= j + 1
            i |= i + 1
```

```typescript
class FenwickTree2D {
  private bit: number[][];
  private n: number;
  private m: number;

  constructor(n: number, m: number) {
    this.n = n;
    this.m = m;
    this.bit = Array.from({ length: n }, () => new Array(m).fill(0));
  }

  sum(x: number, y: number): number {
    let res = 0;
    for (let i = x; i >= 0; i = (i & (i + 1)) - 1)
      for (let j = y; j >= 0; j = (j & (j + 1)) - 1) res += this.bit[i][j];
    return res;
  }

  add(x: number, y: number, delta: number): void {
    for (let i = x; i < this.n; i = i | (i + 1))
      for (let j = y; j < this.m; j = j | (j + 1)) this.bit[i][j] += delta;
  }
}
```

```go
type FenwickTree2D struct {
	bit  [][]int
	n, m int
}

func NewFenwickTree2D(n, m int) *FenwickTree2D {
	bit := make([][]int, n)
	for i := range bit {
		bit[i] = make([]int, m)
	}
	return &FenwickTree2D{bit: bit, n: n, m: m}
}

func (ft *FenwickTree2D) Sum(x, y int) int {
	res := 0
	for i := x; i >= 0; i = (i & (i + 1)) - 1 {
		for j := y; j >= 0; j = (j & (j + 1)) - 1 {
			res += ft.bit[i][j]
		}
	}
	return res
}

func (ft *FenwickTree2D) Add(x, y, delta int) {
	for i := x; i < ft.n; i = i | (i + 1) {
		for j := y; j < ft.m; j = j | (j + 1) {
			ft.bit[i][j] += delta
		}
	}
}
```

</CodeTabs>

### Підхід із нумерацією з одиниці \{#one-based-indexing-approach}

Для цього підходу ми трохи змінюємо вимоги та означення для $T[]$ і $g()$.
Ми хочемо, щоб $T[i]$ зберігало суму на $[g(i)+1; i]$.
Це трохи змінює реалізацію та дозволяє аналогічно гарно означити $g(i)$:

```python
def sum(int r):
    res = 0
    while (r > 0):
        res += t[r]
        r = g(r)
    return res

def increase(int i, int delta):
    for all j with g(j) < i <= j:
        t[j] += delta
```

Обчислення $g(i)$ задається так:
скидання останнього встановленого біта $1$ у двійковому записі числа $i$.

$$
\begin{align}
g(7) = g(111_2) = 110_2 &= 6 \\\\
g(6) = g(110_2) = 100_2 &= 4 \\\\
g(4) = g(100_2) = 000_2 &= 0 \\\\
\end{align}
$$

Останній встановлений біт можна виділити за допомогою $i ~\&~ (-i)$, тож операцію можна виразити так:

$$
g(i) = i - (i ~\&~ (-i)).
$$

І неважко бачити, що для оновлення $A[j]$ вам потрібно змінити всі значення $T[j]$ у послідовності $i,~ h(i),~ h(h(i)),~ \dots$, де $h(i)$ означено як:

$$
h(i) = i + (i ~\&~ (-i)).
$$

Як бачите, головна перевага цього підходу полягає в тому, що бітові операції дуже гарно доповнюють одна одну.

Наведену нижче реалізацію можна використовувати так само, як і інші реалізації, проте всередині вона використовує нумерацію з одиниці.

<CodeTabs>

```cpp
struct FenwickTreeOneBasedIndexing {
    vector<int> bit;  // двійкове індексоване дерево
    int n;

    FenwickTreeOneBasedIndexing(int n) {
        this->n = n + 1;
        bit.assign(n + 1, 0);
    }

    FenwickTreeOneBasedIndexing(vector<int> a)
        : FenwickTreeOneBasedIndexing(a.size()) {
        for (size_t i = 0; i < a.size(); i++)
            add(i, a[i]);
    }

    int sum(int idx) {
        int ret = 0;
        for (++idx; idx > 0; idx -= idx & -idx)
            ret += bit[idx];
        return ret;
    }

    int sum(int l, int r) {
        return sum(r) - sum(l - 1);
    }

    void add(int idx, int delta) {
        for (++idx; idx < n; idx += idx & -idx)
            bit[idx] += delta;
    }
};
```

```python
class FenwickTreeOneBasedIndexing:
    def __init__(self, n):
        self.n = n + 1
        self.bit = [0] * (n + 1)  # двійкове індексоване дерево

    @classmethod
    def from_array(cls, a):
        ft = cls(len(a))
        for i, x in enumerate(a):
            ft.add(i, x)
        return ft

    def sum_prefix(self, idx):
        res = 0
        idx += 1
        while idx > 0:
            res += self.bit[idx]
            idx -= idx & -idx
        return res

    def sum_range(self, l, r):
        return self.sum_prefix(r) - self.sum_prefix(l - 1)

    def add(self, idx, delta):
        idx += 1
        while idx < self.n:
            self.bit[idx] += delta
            idx += idx & -idx
```

```typescript
class FenwickTreeOneBasedIndexing {
  private bit: number[]; // двійкове індексоване дерево
  private n: number;

  constructor(n: number) {
    this.n = n + 1;
    this.bit = new Array(n + 1).fill(0);
  }

  static fromArray(a: number[]): FenwickTreeOneBasedIndexing {
    const ft = new FenwickTreeOneBasedIndexing(a.length);
    a.forEach((x, i) => ft.add(i, x));
    return ft;
  }

  sumPrefix(idx: number): number {
    let res = 0;
    for (++idx; idx > 0; idx -= idx & -idx) res += this.bit[idx];
    return res;
  }

  sumRange(l: number, r: number): number {
    return this.sumPrefix(r) - this.sumPrefix(l - 1);
  }

  add(idx: number, delta: number): void {
    for (++idx; idx < this.n; idx += idx & -idx) this.bit[idx] += delta;
  }
}
```

```go
type FenwickTreeOneBased struct {
	bit []int // двійкове індексоване дерево
	n   int
}

func NewFenwickTreeOneBased(n int) *FenwickTreeOneBased {
	return &FenwickTreeOneBased{bit: make([]int, n+1), n: n + 1}
}

func NewFenwickTreeOneBasedFromArray(a []int) *FenwickTreeOneBased {
	ft := NewFenwickTreeOneBased(len(a))
	for i, x := range a {
		ft.Add(i, x)
	}
	return ft
}

func (ft *FenwickTreeOneBased) SumPrefix(idx int) int {
	res := 0
	for idx++; idx > 0; idx -= idx & -idx {
		res += ft.bit[idx]
	}
	return res
}

func (ft *FenwickTreeOneBased) SumRange(l, r int) int {
	return ft.SumPrefix(r) - ft.SumPrefix(l-1)
}

func (ft *FenwickTreeOneBased) Add(idx, delta int) {
	for idx++; idx < ft.n; idx += idx & -idx {
		ft.bit[idx] += delta
	}
}
```

</CodeTabs>

## Операції на відрізку \{#range-operations}

Дерево Фенвіка може підтримувати такі операції на відрізку:

1. Оновлення в точці та запит на відрізку
2. Оновлення на відрізку та запит у точці
3. Оновлення на відрізку та запит на відрізку

### 1. Оновлення в точці та запит на відрізку \{#1-point-update-and-range-query}

Це просто звичайне дерево Фенвіка, описане вище.

### 2. Оновлення на відрізку та запит у точці \{#2-range-update-and-point-query}

За допомогою простих прийомів ми можемо виконувати й обернені операції: збільшувати значення на відрізках та запитувати окремі значення.

Нехай дерево Фенвіка ініціалізоване нулями.
Припустимо, що ми хочемо збільшити відрізок $[l, r]$ на $x$.
Ми виконуємо дві операції оновлення в точці над деревом Фенвіка, а саме `add(l, x)` та `add(r+1, -x)`.

Якщо ми хочемо отримати значення $A[i]$, нам просто потрібно взяти префіксну суму звичайним методом суми на відрізку.
Щоб зрозуміти, чому це справді так, знову зосередимося на попередній операції збільшення.
Якщо $i < l$, то обидві операції оновлення не впливають на запит, і ми отримуємо суму $0$.
Якщо $i \in [l, r]$, то ми отримуємо відповідь $x$ завдяки першій операції оновлення.
А якщо $i > r$, то друга операція оновлення скасує вплив першої.

Наведена нижче реалізація використовує нумерацію з одиниці.

<CodeTabs>

```cpp
void add(int idx, int val) {
    for (++idx; idx < n; idx += idx & -idx)
        bit[idx] += val;
}

void range_add(int l, int r, int val) {
    add(l, val);
    add(r + 1, -val);
}

int point_query(int idx) {
    int ret = 0;
    for (++idx; idx > 0; idx -= idx & -idx)
        ret += bit[idx];
    return ret;
}
```

```python
def add(self, idx, val):
    idx += 1
    while idx < self.n:
        self.bit[idx] += val
        idx += idx & -idx

def range_add(self, l, r, val):
    self.add(l, val)
    self.add(r + 1, -val)

def point_query(self, idx):
    res = 0
    idx += 1
    while idx > 0:
        res += self.bit[idx]
        idx -= idx & -idx
    return res
```

```typescript
add(idx: number, val: number): void {
  for (++idx; idx < this.n; idx += idx & -idx) this.bit[idx] += val;
}

rangeAdd(l: number, r: number, val: number): void {
  this.add(l, val);
  this.add(r + 1, -val);
}

pointQuery(idx: number): number {
  let res = 0;
  for (++idx; idx > 0; idx -= idx & -idx) res += this.bit[idx];
  return res;
}
```

```go
func (ft *FenwickTree) Add(idx, val int) {
	for idx++; idx < ft.n; idx += idx & -idx {
		ft.bit[idx] += val
	}
}

func (ft *FenwickTree) RangeAdd(l, r, val int) {
	ft.Add(l, val)
	ft.Add(r+1, -val)
}

func (ft *FenwickTree) PointQuery(idx int) int {
	res := 0
	for idx++; idx > 0; idx -= idx & -idx {
		res += ft.bit[idx]
	}
	return res
}
```

</CodeTabs>

Зауваження: звісно, можна також збільшити окрему точку $A[i]$ за допомогою `range_add(i, i, val)`.

### 3. Оновлення на відрізку та запит на відрізку \{#3-range-update-and-range-query}

Щоб підтримувати і оновлення на відрізку, і запити на відрізку, ми використаємо два BIT, а саме $B_1[]$ та $B_2[]$, ініціалізовані нулями.

Припустимо, що ми хочемо збільшити відрізок $[l, r]$ на значення $x$.
Аналогічно до попереднього методу, ми виконуємо два оновлення в точці над $B_1$: `add(B1, l, x)` та `add(B1, r+1, -x)`.
А також оновлюємо $B_2$. Подробиці будуть пояснені пізніше.

```python
def range_add(l, r, x):
    add(B1, l, x)
    add(B1, r+1, -x)
    add(B2, l, x*(l-1))
    add(B2, r+1, -x*r))
```
Після оновлення на відрізку $(l, r, x)$ запит на суму на відрізку має повертати такі значення:

$$
sum[0, i]=
\begin{cases}
0 & i < l \\\\
x \cdot (i-(l-1)) & l \le i \le r \\\\
x \cdot (r-l+1) & i > r \\\\
\end{cases}
$$

Ми можемо записати суму на відрізку як різницю двох доданків, де для першого доданка використовуємо $B_1$, а для другого — $B_2$.
Різниця запитів дасть нам префіксну суму на $[0, i]$.

$$
\begin{align}
sum[0, i] &= sum(B_1, i) \cdot i - sum(B_2, i) \\\\
&= \begin{cases}
0 \cdot i - 0 & i < l\\\\
x \cdot i - x \cdot (l-1) & l \le i \le r \\\\
0 \cdot i - (x \cdot (l-1) - x \cdot r) & i > r \\\\
\end{cases}
\end{align}
$$

Останній вираз точно дорівнює потрібним доданкам.
Отже, ми можемо використовувати $B_2$ для відсікання зайвих доданків, коли множимо $B_1[i]\times i$.

Ми можемо знаходити довільні суми на відрізку, обчисливши префіксні суми для $l-1$ та $r$ і знову взявши їхню різницю.

```python
def add(b, idx, x):
    while idx <= N:
        b[idx] += x
        idx += idx & -idx

def range_add(l,r,x):
    add(B1, l, x)
    add(B1, r+1, -x)
    add(B2, l, x*(l-1))
    add(B2, r+1, -x*r)

def sum(b, idx):
    total = 0
    while idx > 0:
        total += b[idx]
        idx -= idx & -idx
    return total

def prefix_sum(idx):
    return sum(B1, idx)*idx -  sum(B2, idx)

def range_sum(l, r):
    return prefix_sum(r) - prefix_sum(l-1)
```

## Задачі для практики \{#practice-problems}

* [UVA 12086 - Potentiometers](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&category=24&page=show_problem&problem=3238)
* [LOJ 1112 - Curious Robin Hood](http://www.lightoj.com/volume_showproblem.php?problem=1112)
* [LOJ 1266 - Points in Rectangle](http://www.lightoj.com/volume_showproblem.php?problem=1266 "2D Fenwick Tree")
* [Codechef - SPREAD](http://www.codechef.com/problems/SPREAD)
* [SPOJ - CTRICK](http://www.spoj.com/problems/CTRICK/)
* [SPOJ - MATSUM](http://www.spoj.com/problems/MATSUM/)
* [SPOJ - DQUERY](http://www.spoj.com/problems/DQUERY/)
* [SPOJ - NKTEAM](http://www.spoj.com/problems/NKTEAM/)
* [SPOJ - YODANESS](http://www.spoj.com/problems/YODANESS/)
* [SRM 310 - FloatingMedian](https://community.topcoder.com/stat?c=problem_statement&pm=6551&rd=9990)
* [SPOJ - Ada and Behives](http://www.spoj.com/problems/ADABEHIVE/)
* [Hackerearth - Counting in Byteland](https://www.hackerearth.com/practice/data-structures/advanced-data-structures/fenwick-binary-indexed-trees/practice-problems/algorithm/counting-in-byteland/)
* [DevSkill - Shan and String (archived)](http://web.archive.org/web/20210322010617/https://devskill.com/CodingProblems/ViewProblem/300)
* [Codeforces - Little Artem and Time Machine](http://codeforces.com/contest/669/problem/E)
* [Codeforces - Hanoi Factory](http://codeforces.com/contest/777/problem/E)
* [SPOJ - Tulip and Numbers](http://www.spoj.com/problems/TULIPNUM/)
* [SPOJ - SUMSUM](http://www.spoj.com/problems/SUMSUM/)
* [SPOJ - Sabir and Gifts](http://www.spoj.com/problems/SGIFT/)
* [SPOJ - The Permutation Game Again](http://www.spoj.com/problems/TPGA/)
* [SPOJ - Zig when you Zag](http://www.spoj.com/problems/ZIGZAG2/)
* [SPOJ - Cryon](http://www.spoj.com/problems/CRAYON/)
* [SPOJ - Weird Points](http://www.spoj.com/problems/DCEPC705/)
* [SPOJ - Its a Murder](http://www.spoj.com/problems/DCEPC206/)
* [SPOJ - Bored of Suffixes and Prefixes](http://www.spoj.com/problems/KOPC12G/)
* [SPOJ - Mega Inversions](http://www.spoj.com/problems/TRIPINV/)
* [Codeforces - Subsequences](http://codeforces.com/contest/597/problem/C)
* [Codeforces - Ball](http://codeforces.com/contest/12/problem/D)
* [GYM - The Kamphaeng Phet's Chedis](http://codeforces.com/gym/101047/problem/J)
* [Codeforces - Garlands](http://codeforces.com/contest/707/problem/E)
* [Codeforces - Inversions after Shuffle](http://codeforces.com/contest/749/problem/E)
* [GYM - Cairo Market](http://codeforces.com/problemset/gymProblem/101055/D)
* [Codeforces - Goodbye Souvenir](http://codeforces.com/contest/849/problem/E)
* [SPOJ - Ada and Species](http://www.spoj.com/problems/ADACABAA/)
* [Codeforces - Thor](https://codeforces.com/problemset/problem/704/A)
* [CSES - Forest Queries II](https://cses.fi/problemset/task/1739/)
* [Latin American Regionals 2017 - Fundraising](http://matcomgrader.com/problem/9346/fundraising/)

## Інші джерела \{#other-sources}

* [Fenwick tree on Wikipedia](http://en.wikipedia.org/wiki/Fenwick_tree)
* [Binary indexed trees tutorial on TopCoder](https://www.topcoder.com/community/data-science/data-science-tutorials/binary-indexed-trees/)
* [Range updates and queries ](https://programmingcontests.quora.com/Tutorial-Range-Updates-in-Fenwick-Tree)

## Відеоматеріали \{#video}

- [Fenwick Tree or Binary Indexed Tree — Tushar Roy - Coding Made Simple](https://www.youtube.com/watch?v=CWDQJGaN1gY) (23 хв, англійською)
