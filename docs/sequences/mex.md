# MEX (мінімальне виключене значення) послідовності

Дано масив $A$ розміру $N$. Потрібно знайти найменший невід'ємний елемент, якого немає в масиві. Це число зазвичай називають **MEX** (мінімальне виключене значення).

$$
\begin{align}
\text{mex}(\{0, 1, 2, 4, 5\}) &= 3 \\
\text{mex}(\{0, 1, 2, 3, 4\}) &= 5 \\
\text{mex}(\{1, 2, 3, 4, 5\}) &= 0 \\
\end{align}
$$

Зауважимо, що MEX масиву розміру $N$ ніколи не може бути більшим за саме $N$.

Найпростіший підхід — створити множину всіх елементів масиву $A$, щоб ми могли швидко перевіряти, чи входить число до масиву, чи ні.
Тоді ми можемо перебрати всі числа від $0$ до $N$ і повернути перше, якого немає в множині.

## Реалізація \{#implementation}

Наведений нижче алгоритм працює за час $O(N \log N)$.

<CodeTabs>

```cpp
int mex(vector<int> const& A) {
    set<int> b(A.begin(), A.end());

    int result = 0;
    while (b.count(result))
        ++result;
    return result;
}
```

```python
def mex(a: list[int]) -> int:
    b = set(a)

    result = 0
    while result in b:
        result += 1
    return result
```

```typescript
function mex(a: number[]): number {
  const b = new Set(a);

  let result = 0;
  while (b.has(result)) {
    result++;
  }
  return result;
}
```

```go
func mex(a []int) int {
    b := make(map[int]struct{}, len(a))
    for _, x := range a {
        b[x] = struct{}{}
    }

    result := 0
    for {
        if _, ok := b[result]; !ok {
            break
        }
        result++
    }
    return result
}
```

</CodeTabs>

Якщо алгоритму потрібне обчислення MEX за $O(N)$, цього можна досягти, використавши булевий вектор замість множини.
Зауважимо, що масив має бути таким великим, як максимально можливий розмір масиву.


<CodeTabs>

```cpp
int mex(vector<int> const& A) {
    static bool used[MAX_N+1] = { 0 };

    // позначаємо задані числа
    for (int x : A) {
        if (x <= MAX_N)
            used[x] = true;
    }

    // знаходимо mex
    int result = 0;
    while (used[result])
        ++result;
 
    // знову очищаємо масив
    for (int x : A) {
        if (x <= MAX_N)
            used[x] = false;
    }

    return result;
}
```

```python
MAX_N = 10**6
used = [False] * (MAX_N + 1)


def mex(a: list[int]) -> int:
    # позначаємо задані числа
    for x in a:
        if x <= MAX_N:
            used[x] = True

    # знаходимо mex
    result = 0
    while used[result]:
        result += 1

    # знову очищаємо масив
    for x in a:
        if x <= MAX_N:
            used[x] = False

    return result
```

```typescript
const MAX_N = 1_000_000;
const used = new Uint8Array(MAX_N + 1);

function mex(a: number[]): number {
  // позначаємо задані числа
  for (const x of a) {
    if (x <= MAX_N) {
      used[x] = 1;
    }
  }

  // знаходимо mex
  let result = 0;
  while (used[result]) {
    result++;
  }

  // знову очищаємо масив
  for (const x of a) {
    if (x <= MAX_N) {
      used[x] = 0;
    }
  }

  return result;
}
```

```go
const maxN = 1_000_000

var used [maxN + 1]bool

func mex(a []int) int {
    // позначаємо задані числа
    for _, x := range a {
        if x <= maxN {
            used[x] = true
        }
    }

    // знаходимо mex
    result := 0
    for used[result] {
        result++
    }

    // знову очищаємо масив
    for _, x := range a {
        if x <= maxN {
            used[x] = false
        }
    }

    return result
}
```

</CodeTabs>

Цей підхід швидкий, але добре працює лише тоді, коли MEX потрібно обчислити один раз.
Якщо ж його потрібно обчислювати знову й знову, наприклад тому, що масив постійно змінюється, то він неефективний.
Для цього нам потрібно щось краще.

## MEX з оновленнями масиву \{#mex-with-array-updates}

У цій задачі потрібно змінювати окремі числа в масиві й обчислювати новий MEX масиву після кожного такого оновлення.

Тут потрібна краща структура даних, яка ефективно обробляє такі запити.

Один із підходів — узяти частоту кожного числа від $0$ до $N$ і побудувати над нею деревоподібну структуру даних.
Наприклад, дерево відрізків або декартове дерево.
Кожна вершина представляє діапазон чисел, і разом із загальною частотою на цьому діапазоні ми додатково зберігаємо кількість різних чисел у цьому діапазоні.
Таку структуру даних можна оновлювати за час $O(\log N)$, а також знаходити MEX за час $O(\log N)$, виконуючи бінарний пошук MEX.
Якщо вершина, що представляє діапазон $[0, \lfloor N/2 \rfloor)$, не містить $\lfloor N/2 \rfloor$ різних чисел, то одного бракує, MEX менший за $\lfloor N/2 \rfloor$ і можна рекурсивно перейти в ліву гілку дерева. Інакше він не менший за $\lfloor N/2 \rfloor$ і можна рекурсивно перейти в праву гілку дерева.

Також можна скористатися структурами даних `map` і `set` зі стандартної бібліотеки (на основі підходу, поясненого [тут](https://codeforces.com/blog/entry/81287?#comment-677837)).
За допомогою `map` ми будемо запам'ятовувати частоту кожного числа, а за допомогою `set` представлятимемо числа, яких наразі немає в масиві.
Оскільки `set` упорядкований, `*set.begin()` буде MEX.
Загалом нам потрібно $O(N \log N)$ на попередні обчислення, після чого MEX можна обчислити за $O(1)$, а оновлення можна виконати за $O(\log N)$.

<CodeTabs>

```cpp
class Mex {
private:
    map<int, int> frequency;
    set<int> missing_numbers;
    vector<int> A;

public:
    Mex(vector<int> const& A) : A(A) {
        for (int i = 0; i <= A.size(); i++)
            missing_numbers.insert(i);

        for (int x : A) {
            ++frequency[x];
            missing_numbers.erase(x);
        }
    }

    int mex() {
        return *missing_numbers.begin();
    }

    void update(int idx, int new_value) {
        if (--frequency[A[idx]] == 0)
            missing_numbers.insert(A[idx]);
        A[idx] = new_value;
        ++frequency[new_value];
        missing_numbers.erase(new_value);
    }
};
```

```python
from sortedcontainers import SortedList


class Mex:
    def __init__(self, a: list[int]) -> None:
        self.a = list(a)
        self.frequency: dict[int, int] = {}
        # числа, яких наразі немає в масиві (підтримуємо у відсортованому порядку)
        self.missing_numbers = SortedList(range(len(a) + 1))

        for x in a:
            self.frequency[x] = self.frequency.get(x, 0) + 1
            if x in self.missing_numbers:
                self.missing_numbers.remove(x)

    def mex(self) -> int:
        return self.missing_numbers[0]

    def update(self, idx: int, new_value: int) -> None:
        old = self.a[idx]
        self.frequency[old] -= 1
        if self.frequency[old] == 0:
            self.missing_numbers.add(old)
        self.a[idx] = new_value
        self.frequency[new_value] = self.frequency.get(new_value, 0) + 1
        if new_value in self.missing_numbers:
            self.missing_numbers.remove(new_value)
```

```typescript
// Збалансоване дерево відсутніх чисел. Для стислості використовуємо
// відсортований масив із бінарним пошуком (O(N) на оновлення); у проді
// варто взяти збалансоване BST/Fenwick для O(log N).
class Mex {
  private a: number[];
  private frequency = new Map<number, number>();
  private missing: number[]; // відсортований масив відсутніх чисел

  constructor(a: number[]) {
    this.a = [...a];
    this.missing = Array.from({ length: a.length + 1 }, (_, i) => i);
    for (const x of a) {
      this.frequency.set(x, (this.frequency.get(x) ?? 0) + 1);
      this.removeMissing(x);
    }
  }

  mex(): number {
    return this.missing[0];
  }

  update(idx: number, newValue: number): void {
    const old = this.a[idx];
    const f = (this.frequency.get(old) ?? 0) - 1;
    this.frequency.set(old, f);
    if (f === 0) {
      this.addMissing(old);
    }
    this.a[idx] = newValue;
    this.frequency.set(newValue, (this.frequency.get(newValue) ?? 0) + 1);
    this.removeMissing(newValue);
  }

  // Знаходить позицію value у відсортованому масиві missing (lower_bound)
  private lowerBound(value: number): number {
    let lo = 0;
    let hi = this.missing.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (this.missing[mid] < value) {
        lo = mid + 1;
      } else {
        hi = mid;
      }
    }
    return lo;
  }

  private addMissing(value: number): void {
    const pos = this.lowerBound(value);
    if (this.missing[pos] !== value) {
      this.missing.splice(pos, 0, value);
    }
  }

  private removeMissing(value: number): void {
    const pos = this.lowerBound(value);
    if (this.missing[pos] === value) {
      this.missing.splice(pos, 1);
    }
  }
}
```

```go
import "github.com/emirpasic/gods/v2/trees/redblacktree"

type Mex struct {
    a         []int
    frequency map[int]int
    // числа, яких наразі немає в масиві (червоно-чорне дерево як set)
    missing *redblacktree.Tree[int, struct{}]
}

func NewMex(a []int) *Mex {
    m := &Mex{
        a:         append([]int(nil), a...),
        frequency: make(map[int]int),
        missing:   redblacktree.New[int, struct{}](),
    }
    for i := 0; i <= len(a); i++ {
        m.missing.Put(i, struct{}{})
    }
    for _, x := range a {
        m.frequency[x]++
        m.missing.Remove(x)
    }
    return m
}

func (m *Mex) Mex() int {
    return m.missing.Left().Key
}

func (m *Mex) Update(idx, newValue int) {
    old := m.a[idx]
    m.frequency[old]--
    if m.frequency[old] == 0 {
        m.missing.Put(old, struct{}{})
    }
    m.a[idx] = newValue
    m.frequency[newValue]++
    m.missing.Remove(newValue)
}
```

</CodeTabs>

## Задачі для практики \{#practice-problems}

- [AtCoder: Neq Min](https://atcoder.jp/contests/hhkb2020/tasks/hhkb2020_c)
- [Codeforces: Informatics in MAC](https://codeforces.com/contest/1935/problem/B)
- [Codeforces: Replace by MEX](https://codeforces.com/contest/1375/problem/D)
- [Codeforces: Vitya and Strange Lesson](https://codeforces.com/problemset/problem/842/D)
- [Codeforces: MEX Queries](https://codeforces.com/contest/817/problem/F)

## Відеоматеріали \{#video}

<YouTubeEmbed id="JDuVLyKn7Yw" title="Everything you need to know about MEX operation — peltorator" />
