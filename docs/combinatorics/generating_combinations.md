# Генерування всіх $K$-комбінацій

У цій статті ми обговоримо задачу генерування всіх $K$-комбінацій.
Дано натуральні числа $N$ і $K$, і розглядаємо множину чисел від $1$ до $N$.
Потрібно отримати всі **підмножини розміру $K$**.

## Генерування наступної комбінації в лексикографічному порядку \{#data-toc-label}

Спершу ми згенеруємо їх у лексикографічному порядку.
Алгоритм для цього простий. Першою комбінацією буде ${1, 2, ..., K}$. Тепер подивимося, як
знайти комбінацію, що йде безпосередньо за нею в лексикографічному порядку. Для цього розглянемо нашу
поточну комбінацію і знайдемо найправіший елемент, який ще не досяг свого найбільшого можливого значення. Знайшовши
цей елемент, ми збільшуємо його на $1$ і присвоюємо всім наступним
елементам найменші допустимі значення.

<CodeTabs>

```cpp
bool next_combination(vector<int>& a, int n) {
    int k = (int)a.size();
    for (int i = k - 1; i >= 0; i--) {
        if (a[i] < n - k + i + 1) {
            a[i]++;
            for (int j = i + 1; j < k; j++)
                a[j] = a[j - 1] + 1;
            return true;
        }
    }
    return false;
}
```

```python
# Нюанс: для готового рішення можна було б скористатися itertools.combinations,
# але тут ми відтворюємо сам алгоритм переходу до наступної комбінації.
def next_combination(a: list[int], n: int) -> bool:
    k = len(a)
    for i in range(k - 1, -1, -1):
        if a[i] < n - k + i + 1:
            a[i] += 1
            for j in range(i + 1, k):
                a[j] = a[j - 1] + 1
            return True
    return False
```

```typescript
function next_combination(a: number[], n: number): boolean {
    const k = a.length;
    for (let i = k - 1; i >= 0; i--) {
        if (a[i] < n - k + i + 1) {
            a[i]++;
            for (let j = i + 1; j < k; j++)
                a[j] = a[j - 1] + 1;
            return true;
        }
    }
    return false;
}
```

```go
func nextCombination(a []int, n int) bool {
    k := len(a)
    for i := k - 1; i >= 0; i-- {
        if a[i] < n-k+i+1 {
            a[i]++
            for j := i + 1; j < k; j++ {
                a[j] = a[j-1] + 1
            }
            return true
        }
    }
    return false
}
```

</CodeTabs>

## Генерування всіх $K$-комбінацій так, щоб сусідні комбінації відрізнялися одним елементом \{#data-toc-label-1}

Цього разу ми хочемо згенерувати всі $K$-комбінації в такому
порядку, щоб сусідні комбінації відрізнялися рівно одним елементом.

Це можна розв'язати за допомогою [коду Грея](../algebra/gray-code.md):
якщо ми зіставимо кожній підмножині бітову маску, то, генеруючи й перебираючи ці бітові маски за допомогою кодів Грея, можемо отримати нашу відповідь.

Задачу генерування $K$-комбінацій також можна розв'язати за допомогою кодів Грея іншим способом:
згенеруємо коди Грея для чисел від $0$ до $2^N - 1$ і залишимо лише ті коди, що містять $K$ одиниць.
Дивовижний факт полягає в тому, що в отриманій послідовності з $K$ одиничних бітів будь-які дві сусідні маски (включно з
першою й останньою маскою — сусідніми в циклічному сенсі) — відрізнятимуться рівно двома бітами, що і є нашою метою (вилучити
число, додати число).

Доведемо це:

Для доведення пригадаємо той факт, що послідовність $G(N)$ (яка представляє $N$<sup>й</sup> код Грея) можна
отримати так:

$$
G(N) = 0G(N-1) \cup 1G(N-1)^\text{R}
$$

Тобто розглянемо послідовність кодів Грея для $N-1$ і допишемо $0$ перед кожним членом. А також розглянемо
обернену послідовність кодів Грея для $N-1$, допишемо $1$ перед кожною маскою і
сконкатенуємо ці дві послідовності.

Тепер ми можемо навести наше доведення.

Спершу доведемо, що перша й остання маски відрізняються рівно двома бітами. Для цього достатньо зауважити,
що перша маска послідовності $G(N)$ матиме вигляд: $N-K$ нулів, після яких іде $K$ одиниць. Оскільки
перший біт встановлено як $0$, після чого йдуть $(N-K-1)$ нулів, після чого йдуть $K$ одиничних бітів, а остання маска матиме вигляд: $1$, потім $(N-K)$ нулів, потім $K-1$ одиниць.
Застосовуючи принцип математичної індукції і використовуючи формулу для $G(N)$, завершуємо доведення.

Тепер наше завдання — показати, що будь-які два сусідні коди також відрізняються рівно двома бітами; ми можемо зробити це, розглянувши наше рекурсивне рівняння для генерування кодів Грея. Припустимо, що для вмісту двох половин, утворених із $G(N-1)$, твердження істинне. Тепер нам потрібно довести, що нова послідовна пара, утворена на стику (через конкатенацію цих двох половин), теж є допустимою, тобто вони відрізняються рівно двома бітами.

Це можна зробити, оскільки ми знаємо останню маску першої половини і першу маску другої половини. Остання маска першої половини мала б вигляд $1$, потім $(N-K-1)$ нулів, потім $K-1$ одиниць. А перша маска другої половини мала б вигляд $0$, потім ішли б $(N-K-2)$ нулів, а потім $K$ одиниць. Отже, порівнюючи дві маски, ми знаходимо рівно два біти, що відрізняються.

Нижче наведено наївну реалізацію, що працює шляхом генерування всіх $2^{n}$ можливих підмножин і знаходження підмножин розміру
$K$.

<CodeTabs>

```cpp
int gray_code (int n) {
    return n ^ (n >> 1);
}

int count_bits (int n) {
    int res = 0;
    for (; n; n >>= 1)
        res += n & 1;
    return res;
}

void all_combinations (int n, int k) {
    for (int i = 0; i < (1 << n); i++) {
        int cur = gray_code (i);
        if (count_bits(cur) == k) {
            for (int j = 0; j < n; j++) {
                if (cur & (1 << j))
                    cout << j + 1;
            }
            cout << "\n";
        }
    }
}
```

```python
def gray_code(n: int) -> int:
    return n ^ (n >> 1)

def count_bits(n: int) -> int:
    res = 0
    while n:
        res += n & 1
        n >>= 1
    return res

def all_combinations(n: int, k: int) -> None:
    for i in range(1 << n):
        cur = gray_code(i)
        if count_bits(cur) == k:
            line = ""
            for j in range(n):
                if cur & (1 << j):
                    line += str(j + 1)
            print(line)
```

```typescript
function gray_code(n: number): number {
    return n ^ (n >> 1);
}

function count_bits(n: number): number {
    let res = 0;
    for (; n; n >>= 1)
        res += n & 1;
    return res;
}

function all_combinations(n: number, k: number): void {
    for (let i = 0; i < (1 << n); i++) {
        const cur = gray_code(i);
        if (count_bits(cur) === k) {
            let line = "";
            for (let j = 0; j < n; j++) {
                if (cur & (1 << j))
                    line += (j + 1).toString();
            }
            console.log(line);
        }
    }
}
```

```go
func grayCode(n int) int {
    return n ^ (n >> 1)
}

func countBits(n int) int {
    res := 0
    for ; n != 0; n >>= 1 {
        res += n & 1
    }
    return res
}

func allCombinations(n, k int) {
    for i := 0; i < (1 << n); i++ {
        cur := grayCode(i)
        if countBits(cur) == k {
            line := ""
            for j := 0; j < n; j++ {
                if cur&(1<<j) != 0 {
                    line += strconv.Itoa(j + 1)
                }
            }
            fmt.Println(line)
        }
    }
}
```

</CodeTabs>

Варто згадати, що існує ефективніша реалізація, яка вдається лише до побудови допустимих комбінацій і тому
працює за $O\left(N \cdot \binom{N}{K}\right)$; однак вона є рекурсивною за своєю природою, і для менших значень $N$ вона, ймовірно, має більшу константу,
ніж попередній розв'язок.

Реалізація виводиться з формули:

$$
G(N, K) = 0G(N-1, K) \cup 1G(N-1, K-1)^\text{R}
$$

Ця формула отримується модифікацією загального рівняння для визначення коду Грея і працює, обираючи
підпослідовність із відповідних елементів.

Її реалізація така:

<CodeTabs>

```cpp
vector<int> ans;

void gen(int n, int k, int idx, bool rev) {
    if (k > n || k < 0)
        return;

    if (!n) {
        for (int i = 0; i < idx; ++i) {
            if (ans[i])
                cout << i + 1;
        }
        cout << "\n";
        return;
    }

    ans[idx] = rev;
    gen(n - 1, k - rev, idx + 1, false);
    ans[idx] = !rev;
    gen(n - 1, k - !rev, idx + 1, true);
}

void all_combinations(int n, int k) {
    ans.resize(n);
    gen(n, k, 0, false);
}
```

```python
ans: list[int] = []

def gen(n: int, k: int, idx: int, rev: bool) -> None:
    if k > n or k < 0:
        return

    if not n:
        line = ""
        for i in range(idx):
            if ans[i]:
                line += str(i + 1)
        print(line)
        return

    ans[idx] = int(rev)
    gen(n - 1, k - int(rev), idx + 1, False)
    ans[idx] = int(not rev)
    gen(n - 1, k - int(not rev), idx + 1, True)

def all_combinations(n: int, k: int) -> None:
    global ans
    ans = [0] * n
    gen(n, k, 0, False)
```

```typescript
let ans: number[] = [];

function gen(n: number, k: number, idx: number, rev: boolean): void {
    if (k > n || k < 0)
        return;

    if (!n) {
        let line = "";
        for (let i = 0; i < idx; ++i) {
            if (ans[i])
                line += (i + 1).toString();
        }
        console.log(line);
        return;
    }

    ans[idx] = rev ? 1 : 0;
    gen(n - 1, k - (rev ? 1 : 0), idx + 1, false);
    ans[idx] = rev ? 0 : 1;
    gen(n - 1, k - (rev ? 0 : 1), idx + 1, true);
}

function all_combinations(n: number, k: number): void {
    ans = new Array(n).fill(0);
    gen(n, k, 0, false);
}
```

```go
var ans []int

func b2i(b bool) int {
    if b {
        return 1
    }
    return 0
}

func gen(n, k, idx int, rev bool) {
    if k > n || k < 0 {
        return
    }

    if n == 0 {
        line := ""
        for i := 0; i < idx; i++ {
            if ans[i] != 0 {
                line += strconv.Itoa(i + 1)
            }
        }
        fmt.Println(line)
        return
    }

    ans[idx] = b2i(rev)
    gen(n-1, k-b2i(rev), idx+1, false)
    ans[idx] = b2i(!rev)
    gen(n-1, k-b2i(!rev), idx+1, true)
}

func allCombinations(n, k int) {
    ans = make([]int, n)
    gen(n, k, 0, false)
}
```

</CodeTabs>

## Відеоматеріали \{#video}

<YouTubeEmbed id="q0s6m7AiM7o" title="Combinations - Leetcode 77 - Python — NeetCode" />
