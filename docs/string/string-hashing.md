# Хешування рядків

Алгоритми хешування допомагають розв'язувати багато задач.

Ми хочемо ефективно розв'язати задачу порівняння рядків.
Спосіб «в лоб» — це просто порівняти літери обох рядків, що має часову складність $O(\min(n_1, n_2))$, якщо $n_1$ і $n_2$ — розміри двох рядків.
Ми хочемо краще.
Ідея хешування рядків полягає в наступному: ми відображаємо кожен рядок у ціле число і порівнюємо ці числа замість самих рядків.
Це дозволяє нам скоротити час порівняння рядків до $O(1)$.

:::tip[Коли підходить цей алгоритм?]
- Потрібно **порівнювати довільні підрядки за $O(1)$** або рахувати кількість різних підрядків простіше, ніж суфіксними структурами? *(якщо потрібні лексикографічні запити на суфіксах → [Суфіксний масив](suffix-array.md))*
- Прийнятна **ймовірнісна** відповідь (рідкісні колізії хешів допустимі)? *(якщо потрібна детермінована відповідь для одного взірця → [КМП](prefix-function.md))*
- Шукаєте взірець у тексті саме через хеші ковзним вікном? *(тоді див. конкретну реалізацію → [Рабін–Карп](rabin-karp.md))*
:::

Для такого перетворення нам потрібна так звана **хеш-функція**.
Її мета — перетворити рядок на ціле число, так званий **хеш** рядка.
Має виконуватися така умова: якщо два рядки $s$ і $t$ рівні ($s = t$), то їхні хеші також мають бути рівними ($\text{hash}(s) = \text{hash}(t)$).
Інакше ми не зможемо порівнювати рядки.

Зауважимо, що зворотний напрямок виконуватися не зобов'язаний.
Якщо хеші рівні ($\text{hash}(s) = \text{hash}(t)$), то рядки не обов'язково мають бути рівними.
Наприклад, коректною хеш-функцією була б проста $\text{hash}(s) = 0$ для кожного $s$.
Звісно, це просто безглуздий приклад, бо така функція буде абсолютно некорисною, але вона є коректною хеш-функцією.
Причина, чому зворотний напрямок виконуватися не зобов'язаний, полягає в тому, що рядків експоненційно багато.
Якщо ми хочемо, щоб ця хеш-функція розрізняла лише всі рядки з малих літер довжиною менше за 15, то вже хеш не вмістився б у 64-бітне ціле число (наприклад, unsigned long long), бо їх так багато.
І, звісно, ми не хочемо порівнювати довільно довгі цілі числа, бо це також матиме складність $O(n)$.

Тож зазвичай ми хочемо, щоб хеш-функція відображала рядки на числа з фіксованого діапазону $[0, m)$, тоді порівняння рядків — це просто порівняння двох цілих чисел фіксованої довжини.
І, звісно, ми хочемо, щоб $\text{hash}(s) \neq \text{hash}(t)$ було дуже ймовірним, якщо $s \neq t$.

Це важлива частина, яку ви маєте тримати в голові.
Використання хешування не буде на 100% детерміновано правильним, бо два цілком різні рядки можуть мати однаковий хеш (хеші колізують).
Однак у переважній більшості задач це можна спокійно ігнорувати, оскільки ймовірність того, що хеші двох різних рядків зколізують, усе одно дуже мала.
А ще в цій статті ми обговоримо деякі техніки, як тримати ймовірність колізій дуже низькою.

## Обчислення хешу рядка \{#calculation-of-the-hash-of-a-string}

Хороший і широко вживаний спосіб означити хеш рядка $s$ довжини $n$ — це

$$
\begin{align}
\text{hash}(s) &= s[0] + s[1] \cdot p + s[2] \cdot p^2 + ... + s[n-1] \cdot p^{n-1} \mod m \\
&= \sum_{i=0}^{n-1} s[i] \cdot p^i \mod m,
\end{align}
$$

де $p$ і $m$ — деякі обрані додатні числа.
Це називають **поліноміальним хешем** (polynomial rolling hash function).

Розумно обрати $p$ простим числом, приблизно рівним кількості символів у вхідному алфавіті.
Наприклад, якщо вхід складається лише з малих літер англійського алфавіту, то $p = 31$ — хороший вибір.
Якщо вхід може містити як великі, так і малі літери, то можливим вибором є $p = 53$.
Код у цій статті використовуватиме $p = 31$.

Очевидно, $m$ має бути великим числом, оскільки ймовірність колізії двох випадкових рядків становить приблизно $\approx \frac{1}{m}$.
Інколи обирають $m = 2^{64}$, бо тоді переповнення 64-бітних цілих працює точно так само, як операція за модулем.
Однак існує метод, який генерує колізуючі рядки (і він працює незалежно від вибору $p$).
Тож на практиці $m = 2^{64}$ не рекомендується.
Хорошим вибором для $m$ є деяке велике просте число.
Код у цій статті просто використовуватиме $m = 10^9+9$.
Це велике число, але водночас достатньо мале, щоб ми могли виконувати множення двох значень за допомогою 64-бітних цілих.

Ось приклад обчислення хешу рядка $s$, який містить лише малі літери.
Ми перетворюємо кожен символ $s$ на ціле число.
Тут ми використовуємо перетворення $a \rightarrow 1$, $b \rightarrow 2$, $\dots$, $z \rightarrow 26$.
Перетворення $a \rightarrow 0$ — не дуже хороша ідея, бо тоді хеші рядків $a$, $aa$, $aaa$, $\dots$ усі дорівнюватимуть $0$.

<CodeTabs>

```cpp
long long compute_hash(string const& s) {
    const int p = 31;
    const int m = 1e9 + 9;
    long long hash_value = 0;
    long long p_pow = 1;
    for (char c : s) {
        hash_value = (hash_value + (c - 'a' + 1) * p_pow) % m;
        p_pow = (p_pow * p) % m;
    }
    return hash_value;
}
```

```python
def compute_hash(s: str) -> int:
    p = 31
    m = 10**9 + 9
    hash_value = 0
    p_pow = 1
    for c in s:
        # Python має необмежені цілі, тож переповнення немає
        hash_value = (hash_value + (ord(c) - ord('a') + 1) * p_pow) % m
        p_pow = (p_pow * p) % m
    return hash_value
```

```typescript
function computeHash(s: string): bigint {
  const p = 31n;
  const m = 1000000009n;
  // Використовуємо BigInt: добуток двох ~1e9 значень (~1e18)
  // переповнює звичайний number (надійний лише до 2^53)
  let hashValue = 0n;
  let pPow = 1n;
  for (const c of s) {
    const code = BigInt(c.charCodeAt(0) - 'a'.charCodeAt(0) + 1);
    hashValue = (hashValue + code * pPow) % m;
    pPow = (pPow * p) % m;
  }
  return hashValue;
}
```

```go
func computeHash(s string) int64 {
    const p int64 = 31
    const m int64 = 1e9 + 9
    var hashValue int64 = 0
    var pPow int64 = 1
    for _, c := range s {
        // int64 (до ~9.2e18) достатньо: добуток < 1e9 * 1e9 = 1e18
        hashValue = (hashValue + (int64(c)-int64('a')+1)*pPow) % m
        pPow = (pPow * p) % m
    }
    return hashValue
}
```

</CodeTabs>

Попереднє обчислення степенів $p$ може дати приріст продуктивності.

## Приклади задач \{#example-tasks}

### Пошук дублікатів рядків у масиві рядків \{#search-for-duplicate-strings-in-an-array-of-strings}

Задача: дано список з $n$ рядків $s_i$, кожен не довший за $m$ символів; знайти всі дублікати рядків і розбити їх на групи.

З очевидного алгоритму, що передбачає сортування рядків, ми отримали б часову складність $O(n m \log n)$, де сортування потребує $O(n \log n)$ порівнянь, а кожне порівняння займає $O(m)$ часу.
Однак, використовуючи хеші, ми зменшуємо час порівняння до $O(1)$, що дає нам алгоритм, який працює за $O(n m + n \log n)$ час.

Ми обчислюємо хеш для кожного рядка, сортуємо хеші разом з індексами, а потім групуємо індекси за однаковими хешами.

<CodeTabs>

```cpp
vector<vector<int>> group_identical_strings(vector<string> const& s) {
    int n = s.size();
    vector<pair<long long, int>> hashes(n);
    for (int i = 0; i < n; i++)
        hashes[i] = {compute_hash(s[i]), i};

    sort(hashes.begin(), hashes.end());

    vector<vector<int>> groups;
    for (int i = 0; i < n; i++) {
        if (i == 0 || hashes[i].first != hashes[i-1].first)
            groups.emplace_back();
        groups.back().push_back(hashes[i].second);
    }
    return groups;
}
```

```python
def group_identical_strings(s: list[str]) -> list[list[int]]:
    n = len(s)
    # Пари (хеш, індекс), відсортовані за хешем
    hashes = sorted((compute_hash(s[i]), i) for i in range(n))

    groups: list[list[int]] = []
    for i in range(n):
        if i == 0 or hashes[i][0] != hashes[i - 1][0]:
            groups.append([])
        groups[-1].append(hashes[i][1])
    return groups
```

```typescript
function groupIdenticalStrings(s: string[]): number[][] {
  const n = s.length;
  // Пари [хеш, індекс]
  const hashes: [bigint, number][] = s.map((str, i) => [computeHash(str), i]);
  // Сортуємо за хешем (BigInt порівнюємо через віднімання)
  hashes.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));

  const groups: number[][] = [];
  for (let i = 0; i < n; i++) {
    if (i === 0 || hashes[i][0] !== hashes[i - 1][0]) {
      groups.push([]);
    }
    groups[groups.length - 1].push(hashes[i][1]);
  }
  return groups;
}
```

```go
func groupIdenticalStrings(s []string) [][]int {
    n := len(s)
    type pair struct {
        hash int64
        idx  int
    }
    hashes := make([]pair, n)
    for i := 0; i < n; i++ {
        hashes[i] = pair{computeHash(s[i]), i}
    }

    sort.Slice(hashes, func(i, j int) bool {
        return hashes[i].hash < hashes[j].hash
    })

    var groups [][]int
    for i := 0; i < n; i++ {
        if i == 0 || hashes[i].hash != hashes[i-1].hash {
            groups = append(groups, []int{})
        }
        groups[len(groups)-1] = append(groups[len(groups)-1], hashes[i].idx)
    }
    return groups
}
```

</CodeTabs>

### Швидке обчислення хешів підрядків заданого рядка \{#fast-hash-calculation-of-substrings-of-given-string}

Задача: дано рядок $s$ та індекси $i$ і $j$; знайти хеш підрядка $s [i \dots j]$.

За означенням маємо:

$$
\text{hash}(s[i \dots j]) = \sum_{k = i}^j s[k] \cdot p^{k-i} \mod m
$$

Множення на $p^i$ дає:

$$
\begin{align}
\text{hash}(s[i \dots j]) \cdot p^i &= \sum_{k = i}^j s[k] \cdot p^k \mod m \\
&= \text{hash}(s[0 \dots j]) - \text{hash}(s[0 \dots i-1]) \mod m
\end{align}
$$

Отже, знаючи значення хешу кожного префікса рядка $s$, ми можемо обчислити хеш будь-якого підрядка напряму за цією формулою.
Єдина проблема, з якою ми стикаємося під час обчислення, — це те, що ми маємо вміти ділити $\text{hash}(s[0 \dots j]) - \text{hash}(s[0 \dots i-1])$ на $p^i$.
Тому нам потрібно знайти [обернений елемент за модулем](../algebra/module-inverse.md) до $p^i$, а потім виконати множення на цей обернений елемент.
Ми можемо попередньо обчислити обернений елемент до кожного $p^i$, що дозволяє обчислювати хеш будь-якого підрядка $s$ за $O(1)$ час.

Однак існує простіший спосіб.
У більшості випадків, замість того щоб обчислювати хеші підрядків точно, достатньо обчислити хеш, помножений на деякий степінь $p$.
Припустімо, ми маємо два хеші двох підрядків: один помножений на $p^i$, а інший — на $p^j$.
Якщо $i < j$, то ми множимо перший хеш на $p^{j-i}$, інакше множимо другий хеш на $p^{i-j}$.
Зробивши це, ми отримуємо обидва хеші, помножені на той самий степінь $p$ (який дорівнює максимуму з $i$ та $j$), і тепер ці хеші можна легко порівнювати без потреби в будь-якому діленні.

## Застосування хешування \{#applications-of-hashing}

Ось деякі типові застосування хешування:

* [Алгоритм Рабіна — Карпа](rabin-karp.md) для пошуку взірця в рядку за $O(n)$ час
* Підрахунок кількості різних підрядків рядка за $O(n^2)$ (див. нижче)
* Підрахунок кількості паліндромних підрядків у рядку.

### Визначення кількості різних підрядків у рядку \{#determine-the-number-of-different-substrings-in-a-string}

Задача: дано рядок $s$ довжини $n$, що складається лише з малих англійських літер; знайти кількість різних підрядків у цьому рядку.

Щоб розв'язати цю задачу, ми перебираємо всі довжини підрядків $l = 1 \dots n$.
Для кожної довжини підрядка $l$ ми будуємо масив хешів усіх підрядків довжини $l$, помножених на той самий степінь $p$.
Кількість різних елементів у масиві дорівнює кількості різних підрядків довжини $l$ у рядку.
Це число додається до підсумкової відповіді.

Для зручності ми використовуватимемо $h[i]$ як хеш префікса з $i$ символів і визначимо $h[0] = 0$.

<CodeTabs>

```cpp
int count_unique_substrings(string const& s) {
    int n = s.size();
    
    const int p = 31;
    const int m = 1e9 + 9;
    vector<long long> p_pow(n);
    p_pow[0] = 1;
    for (int i = 1; i < n; i++)
        p_pow[i] = (p_pow[i-1] * p) % m;

    vector<long long> h(n + 1, 0);
    for (int i = 0; i < n; i++)
        h[i+1] = (h[i] + (s[i] - 'a' + 1) * p_pow[i]) % m;

    int cnt = 0;
    for (int l = 1; l <= n; l++) {
        unordered_set<long long> hs;
        for (int i = 0; i <= n - l; i++) {
            long long cur_h = (h[i + l] + m - h[i]) % m;
            cur_h = (cur_h * p_pow[n-i-1]) % m;
            hs.insert(cur_h);
        }
        cnt += hs.size();
    }
    return cnt;
}
```

```python
def count_unique_substrings(s: str) -> int:
    n = len(s)

    p = 31
    m = 10**9 + 9
    p_pow = [1] * n
    for i in range(1, n):
        p_pow[i] = (p_pow[i - 1] * p) % m

    # h[i] — хеш префікса з i символів, h[0] = 0
    h = [0] * (n + 1)
    for i in range(n):
        h[i + 1] = (h[i] + (ord(s[i]) - ord('a') + 1) * p_pow[i]) % m

    cnt = 0
    for length in range(1, n + 1):
        hs = set()
        for i in range(n - length + 1):
            # Хеш підрядка, помножений на спільний степінь p
            cur_h = (h[i + length] - h[i]) % m
            cur_h = (cur_h * p_pow[n - i - 1]) % m
            hs.add(cur_h)
        cnt += len(hs)
    return cnt
```

```typescript
function countUniqueSubstrings(s: string): number {
  const n = s.length;

  const p = 31n;
  const m = 1000000009n;
  // BigInt обов'язковий: добутки ~1e18 переповнюють number
  const pPow: bigint[] = new Array(n).fill(1n);
  for (let i = 1; i < n; i++) {
    pPow[i] = (pPow[i - 1] * p) % m;
  }

  // h[i] — хеш префікса з i символів, h[0] = 0
  const h: bigint[] = new Array(n + 1).fill(0n);
  for (let i = 0; i < n; i++) {
    const code = BigInt(s.charCodeAt(i) - 'a'.charCodeAt(0) + 1);
    h[i + 1] = (h[i] + code * pPow[i]) % m;
  }

  let cnt = 0;
  for (let len = 1; len <= n; len++) {
    const hs = new Set<bigint>();
    for (let i = 0; i <= n - len; i++) {
      // Додаємо m, щоб уникнути від'ємного значення
      let curH = (h[i + len] + m - h[i]) % m;
      curH = (curH * pPow[n - i - 1]) % m;
      hs.add(curH);
    }
    cnt += hs.size;
  }
  return cnt;
}
```

```go
func countUniqueSubstrings(s string) int {
    n := len(s)

    const p int64 = 31
    const m int64 = 1e9 + 9
    pPow := make([]int64, n)
    if n > 0 {
        pPow[0] = 1
    }
    for i := 1; i < n; i++ {
        pPow[i] = (pPow[i-1] * p) % m
    }

    // h[i] — хеш префікса з i символів, h[0] = 0
    h := make([]int64, n+1)
    for i := 0; i < n; i++ {
        h[i+1] = (h[i] + (int64(s[i])-int64('a')+1)*pPow[i]) % m
    }

    cnt := 0
    for length := 1; length <= n; length++ {
        hs := make(map[int64]struct{})
        for i := 0; i <= n-length; i++ {
            // Додаємо m, щоб уникнути від'ємного значення
            curH := (h[i+length] + m - h[i]) % m
            curH = (curH * pPow[n-i-1]) % m
            hs[curH] = struct{}{}
        }
        cnt += len(hs)
    }
    return cnt
}
```

</CodeTabs>

Зауважимо, що $O(n^2)$ — не найкраща можлива часова складність для цієї задачі.
Розв'язок зі складністю $O(n \log n)$ описано у статті про [суфіксні масиви](suffix-array.md), і його навіть можна обчислити за $O(n)$ за допомогою [суфіксного дерева](./suffix-tree-ukkonen.md) або [суфіксного автомата](./suffix-automaton.md).

## Покращення ймовірності відсутності колізій \{#improve-no-collision-probability}

Доволі часто згаданого вище поліноміального хешу цілком достатньо, і жодних колізій під час тестів не станеться.
Пам'ятайте, що ймовірність того, що станеться колізія, становить лише $\approx \frac{1}{m}$.
Для $m = 10^9 + 9$ ймовірність становить $\approx 10^{-9}$, що доволі мало.
Але зауважте, що ми зробили лише одне порівняння.
Що, якщо ми порівнювали рядок $s$ з $10^6$ різними рядками.
Імовірність того, що станеться хоча б одна колізія, тепер становить $\approx 10^{-3}$.
А якщо ми хочемо порівняти $10^6$ різних рядків між собою (наприклад, підрахувавши, скільки існує унікальних рядків), то ймовірність того, що станеться хоча б одна колізія, уже становить $\approx 1$.
Майже гарантовано, що ця задача завершиться колізією і поверне неправильний результат.

Є справді простий прийом, щоб отримати кращі ймовірності.
Ми можемо просто обчислити для кожного рядка два різні хеші (використавши два різні $p$ та/або різні $m$) і порівнювати ці пари замість окремих хешів.
Якщо $m$ для кожної з двох хеш-функцій становить близько $10^9$, то це більш-менш еквівалентно одній хеш-функції з $m \approx 10^{18}$.
Коли ми порівнюємо $10^6$ рядків між собою, ймовірність того, що станеться хоча б одна колізія, тепер зменшується до $\approx 10^{-6}$.

## Задачі для практики \{#practice-problems}
* [Good Substrings - Codeforces](https://codeforces.com/contest/271/problem/D)
* [A Needle in the Haystack - SPOJ](http://www.spoj.com/problems/NHAY/)
* [String Hashing - Kattis](https://open.kattis.com/problems/hashing)
* [Double Profiles - Codeforces](http://codeforces.com/problemset/problem/154/C)
* [Password - Codeforces](http://codeforces.com/problemset/problem/126/B)
* [SUB_PROB - SPOJ](http://www.spoj.com/problems/SUB_PROB/)
* [INSQ15_A](https://www.codechef.com/problems/INSQ15_A)
* [SPOJ - Ada and Spring Cleaning](http://www.spoj.com/problems/ADACLEAN/)
* [GYM - Text Editor](http://codeforces.com/gym/101466/problem/E)
* [12012 - Detection of Extraterrestrial](https://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=3163)
* [Codeforces - Games on a CD](http://codeforces.com/contest/727/problem/E)
* [UVA 11855 - Buzzwords](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=2955)
* [Codeforces - Santa Claus and a Palindrome](http://codeforces.com/contest/752/problem/D)
* [Codeforces - String Compression](http://codeforces.com/contest/825/problem/F)
* [Codeforces - Palindromic Characteristics](http://codeforces.com/contest/835/problem/D)
* [SPOJ - Test](http://www.spoj.com/problems/CF25E/)
* [Codeforces - Palindrome Degree](http://codeforces.com/contest/7/problem/D)
* [Codeforces - Deletion of Repeats](http://codeforces.com/contest/19/problem/C)
* [HackerRank - Gift Boxes](https://www.hackerrank.com/contests/womens-codesprint-5/challenges/gift-boxes)

## Відеоматеріали \{#video}

<YouTubeEmbed id="eeiSPXCzUiE" title="L03 : Polynomial Rolling Hash — CodeNCode" />
