# Розріджена таблиця

Розріджена таблиця — це структура даних, яка дозволяє відповідати на запити на відрізках.
Вона може відповідати на більшість запитів на відрізках за $O(\log n)$, але її справжня сила — у відповідях на запити мінімуму на відрізку (або еквівалентні запити максимуму на відрізку).
Для таких запитів вона обчислює відповідь за $O(1)$.

Єдиний недолік цієї структури даних — її можна використовувати лише на _незмінних_ масивах.
Це означає, що масив не можна змінювати між двома запитами.
Якщо хоч один елемент масиву змінюється, всю структуру даних доводиться перераховувати наново.

:::tip[Коли підходить цей алгоритм?]
- Чи масив **незмінний** між запитами (немає оновлень елементів)? *(якщо потрібні оновлення → [дерево відрізків](segment_tree.md) або [дерево Фенвіка](fenwick.md))*
- Чи це <Term tip="Операція, для якої повторне врахування того самого елемента нічого не змінює: мінімум від мінімуму — це той самий мінімум. Тому відрізки можна брати з перекриттям.">ідемпотентна операція</Term> (на кшталт $\min$/$\max$/$\gcd$), для якої потрібна відповідь за $O(1)$ при перекритті відрізків?
- Якщо операція не ідемпотентна (наприклад, сума), чи влаштовує відповідь за $O(\log n)$, або ж потрібна $O(1)$ для <Term tip="Операція, у якій не важливе розставлення дужок: (a*b)*c дорівнює a*(b*c). Тому шматки можна об'єднувати в будь-якому порядку.">асоціативної операції</Term>? *(для $O(1)$ → [Sqrt-дерево](sqrt-tree.md))*
:::

## Інтуїція \{#intuition}

Будь-яке невід'ємне число можна однозначно подати як суму спадних степенів двійки.
Це просто варіант двійкового представлення числа.
Наприклад, $13 = (1101)_2 = 8 + 4 + 1$.
Для числа $x$ буде щонайбільше $\lceil \log_2 x \rceil$ доданків.

За тими ж міркуваннями будь-який інтервал можна однозначно подати як об'єднання інтервалів, довжини яких є спадними степенями двійки.
Наприклад, $[2, 14] = [2, 9] \cup [10, 13] \cup [14, 14]$, де весь інтервал має довжину 13, а окремі інтервали мають довжини 8, 4 і 1 відповідно.
І тут також об'єднання складається щонайбільше з $\lceil \log_2(\text{довжина інтервалу}) \rceil$ інтервалів.

Основна ідея розріджених таблиць — заздалегідь обчислити всі відповіді для запитів на відрізках, довжина яких є степенем двійки.
Після цього інший запит на відрізку можна обробити, розбивши відрізок на відрізки з довжинами-степенями двійки, звернувшись до попередньо обчислених відповідей і скомбінувавши їх, щоб отримати повну відповідь.

## Попередні обчислення \{#precomputation}

Для зберігання відповідей на попередньо обчислені запити ми використаємо двовимірний масив.
$\text{st}[i][j]$ зберігатиме відповідь для відрізка $[j, j + 2^i - 1]$ довжини $2^i$.
Розмір двовимірного масиву буде $(K + 1) \times \text{MAXN}$, де $\text{MAXN}$ — найбільша можлива довжина масиву.
$\text{K}$ має задовольняти $\text{K} \ge \lfloor \log_2 \text{MAXN} \rfloor$, бо $2^{\lfloor \log_2 \text{MAXN} \rfloor}$ — найбільший відрізок-степінь двійки, який нам потрібно підтримувати.
Для масивів розумної довжини ($\le 10^7$ елементів) $K = 25$ — хороше значення.

Вимір $\text{MAXN}$ стоїть другим, щоб дозволити (<Term tip="Звернення до сусідніх комірок пам'яті поспіль, що дозволяє процесору швидко читати дані з кешу й працювати помітно швидше.">дружні до кешу</Term>) послідовні звернення до пам'яті.

<CodeTabs>

```cpp
int st[K + 1][MAXN];
```

```python
# st[i][j] зберігає відповідь для відрізка [j, j + 2**i - 1]
st = [[0] * MAXN for _ in range(K + 1)]
```

```typescript
// st[i][j] зберігає відповідь для відрізка [j, j + 2**i - 1]
const st: number[][] = Array.from({ length: K + 1 }, () => new Array(MAXN).fill(0));
```

```go
// st[i][j] зберігає відповідь для відрізка [j, j + 2**i - 1]
var st [K + 1][MAXN]int
```

</CodeTabs>

Оскільки відрізок $[j, j + 2^i - 1]$ довжини $2^i$ гарно розбивається на відрізки $[j, j + 2^{i - 1} - 1]$ та $[j + 2^{i - 1}, j + 2^i - 1]$, обидва довжини $2^{i - 1}$, ми можемо ефективно згенерувати таблицю за допомогою <Term tip="Підхід, коли відповідь для більшого випадку будується з уже обчислених відповідей для менших: тут довший відрізок збирається з двох коротших, які ми порахували раніше.">динамічного програмування</Term>:

<CodeTabs>

```cpp
std::copy(array.begin(), array.end(), st[0]);

for (int i = 1; i <= K; i++)
    for (int j = 0; j + (1 << i) <= N; j++)
        st[i][j] = f(st[i - 1][j], st[i - 1][j + (1 << (i - 1))]);
```

```python
st[0][:N] = array

for i in range(1, K + 1):
    j = 0
    while j + (1 << i) <= N:
        st[i][j] = f(st[i - 1][j], st[i - 1][j + (1 << (i - 1))])
        j += 1
```

```typescript
for (let j = 0; j < N; j++) st[0][j] = array[j];

for (let i = 1; i <= K; i++)
  for (let j = 0; j + (1 << i) <= N; j++)
    st[i][j] = f(st[i - 1][j], st[i - 1][j + (1 << (i - 1))]);
```

```go
copy(st[0][:], array)

for i := 1; i <= K; i++ {
    for j := 0; j+(1<<i) <= N; j++ {
        st[i][j] = f(st[i-1][j], st[i-1][j+(1<<(i-1))])
    }
}
```

</CodeTabs>

Функція $f$ залежатиме від типу запиту.
Для запитів суми на відрізку вона обчислюватиме суму, для запитів мінімуму на відрізку — мінімум.

Часова складність попередніх обчислень становить $O(\text{N} \log \text{N})$.

## Запити суми на відрізку \{#range-sum-queries}

Для цього типу запитів ми хочемо знайти суму всіх значень на відрізку.
Тому природним означенням функції $f$ є $f(x, y) = x + y$.
Ми можемо побудувати структуру даних так:

<CodeTabs>

```cpp
long long st[K + 1][MAXN];

std::copy(array.begin(), array.end(), st[0]);

for (int i = 1; i <= K; i++)
    for (int j = 0; j + (1 << i) <= N; j++)
        st[i][j] = st[i - 1][j] + st[i - 1][j + (1 << (i - 1))];
```

```python
st = [[0] * MAXN for _ in range(K + 1)]
st[0][:N] = array

for i in range(1, K + 1):
    j = 0
    while j + (1 << i) <= N:
        st[i][j] = st[i - 1][j] + st[i - 1][j + (1 << (i - 1))]
        j += 1
```

```typescript
// сума може перевищити 2**53 — використовуємо bigint
const st: bigint[][] = Array.from({ length: K + 1 }, () => new Array(MAXN).fill(0n));
for (let j = 0; j < N; j++) st[0][j] = BigInt(array[j]);

for (let i = 1; i <= K; i++)
  for (let j = 0; j + (1 << i) <= N; j++)
    st[i][j] = st[i - 1][j] + st[i - 1][j + (1 << (i - 1))];
```

```go
var st [K + 1][MAXN]int64

for j := 0; j < N; j++ {
    st[0][j] = int64(array[j])
}

for i := 1; i <= K; i++ {
    for j := 0; j+(1<<i) <= N; j++ {
        st[i][j] = st[i-1][j] + st[i-1][j+(1<<(i-1))]
    }
}
```

</CodeTabs>

Щоб відповісти на запит суми для відрізка $[L, R]$, ми перебираємо всі степені двійки, починаючи з найбільшого.
Щойно степінь двійки $2^i$ стає меншим або рівним за довжину відрізка ($= R - L + 1$), ми обробляємо першу частину відрізка $[L, L + 2^i - 1]$ і продовжуємо з рештою відрізка $[L + 2^i, R]$.

<CodeTabs>

```cpp
long long sum = 0;
for (int i = K; i >= 0; i--) {
    if ((1 << i) <= R - L + 1) {
        sum += st[i][L];
        L += 1 << i;
    }
}
```

```python
total = 0
for i in range(K, -1, -1):
    if (1 << i) <= R - L + 1:
        total += st[i][L]
        L += 1 << i
```

```typescript
let sum = 0n;
for (let i = K; i >= 0; i--) {
  if (1 << i <= R - L + 1) {
    sum += st[i][L];
    L += 1 << i;
  }
}
```

```go
var sum int64 = 0
for i := K; i >= 0; i-- {
    if (1 << i) <= R-L+1 {
        sum += st[i][L]
        L += 1 << i
    }
}
```

</CodeTabs>

Часова складність запиту суми на відрізку становить $O(K) = O(\log \text{MAXN})$.

## Запити мінімуму на відрізку (RMQ) \{#range-minimum-queries-rmq}

Це ті запити, у яких розріджена таблиця сяє.
Під час обчислення мінімуму на відрізку немає значення, чи обробляємо ми значення з відрізка один раз чи двічі.
Тому замість розбиття відрізка на кілька відрізків ми можемо розбити його лише на два відрізки-степені двійки, що перекриваються.
Наприклад, ми можемо розбити відрізок $[1, 6]$ на відрізки $[1, 4]$ та $[3, 6]$.
Мінімум на відрізку $[1, 6]$ очевидно дорівнює мінімуму з мінімуму на відрізку $[1, 4]$ та мінімуму на відрізку $[3, 6]$.
Отже, ми можемо обчислити мінімум на відрізку $[L, R]$ так:

$$
\min(\text{st}[i][L], \text{st}[i][R - 2^i + 1]) \quad \text{ де } i = \log_2(R - L + 1)
$$

Це вимагає, щоб ми вміли швидко обчислювати $\log_2(R - L + 1)$.
Цього можна досягти, попередньо обчисливши всі логарифми:

<CodeTabs>

```cpp
int lg[MAXN+1];
lg[1] = 0;
for (int i = 2; i <= MAXN; i++)
    lg[i] = lg[i/2] + 1;
```

```python
lg = [0] * (MAXN + 1)
for i in range(2, MAXN + 1):
    lg[i] = lg[i // 2] + 1
```

```typescript
const lg = new Array(MAXN + 1).fill(0);
for (let i = 2; i <= MAXN; i++) lg[i] = lg[i >> 1] + 1;
```

```go
var lg [MAXN + 1]int
for i := 2; i <= MAXN; i++ {
    lg[i] = lg[i/2] + 1
}
```

</CodeTabs>

Як альтернатива, логарифм можна обчислювати на льоту за сталий час і сталу пам'ять:
<CodeTabs>

```cpp
// C++20
#include <bit>
int log2_floor(unsigned long i) {
    return std::bit_width(i) - 1;
}

// до C++20
int log2_floor(unsigned long long i) {
    return i ? __builtin_clzll(1) - __builtin_clzll(i) : -1;
}
```

```python
# int.bit_length() повертає кількість бітів числа, тож floor(log2(i)) = i.bit_length() - 1
def log2_floor(i: int) -> int:
    return i.bit_length() - 1 if i else -1
```

```typescript
// Math.clz32(x) — кількість провідних нулів у 32-бітному поданні,
// тож floor(log2(i)) = 31 - Math.clz32(i)
function log2Floor(i: number): number {
  return i ? 31 - Math.clz32(i) : -1;
}
```

```go
import "math/bits"

// bits.Len повертає кількість значущих бітів, тож floor(log2(i)) = bits.Len(i) - 1
func log2Floor(i uint) int {
    return bits.Len(i) - 1
}
```

</CodeTabs>

[Цей замір швидкодії](https://quick-bench.com/q/Zghbdj_TEkmw4XG2nqOpD3tsJ8U) показує, що використання масиву `lg` повільніше через промахи кешу.

Після цього нам потрібно попередньо обчислити структуру розрідженої таблиці. Цього разу ми означимо $f$ як $f(x, y) = \min(x, y)$.

<CodeTabs>

```cpp
int st[K + 1][MAXN];

std::copy(array.begin(), array.end(), st[0]);

for (int i = 1; i <= K; i++)
    for (int j = 0; j + (1 << i) <= N; j++)
        st[i][j] = min(st[i - 1][j], st[i - 1][j + (1 << (i - 1))]);
```

```python
st = [[0] * MAXN for _ in range(K + 1)]
st[0][:N] = array

for i in range(1, K + 1):
    j = 0
    while j + (1 << i) <= N:
        st[i][j] = min(st[i - 1][j], st[i - 1][j + (1 << (i - 1))])
        j += 1
```

```typescript
const st: number[][] = Array.from({ length: K + 1 }, () => new Array(MAXN).fill(0));
for (let j = 0; j < N; j++) st[0][j] = array[j];

for (let i = 1; i <= K; i++)
  for (let j = 0; j + (1 << i) <= N; j++)
    st[i][j] = Math.min(st[i - 1][j], st[i - 1][j + (1 << (i - 1))]);
```

```go
var st [K + 1][MAXN]int
copy(st[0][:], array)

for i := 1; i <= K; i++ {
    for j := 0; j+(1<<i) <= N; j++ {
        st[i][j] = min(st[i-1][j], st[i-1][j+(1<<(i-1))])
    }
}
```

</CodeTabs>

А мінімум на відрізку $[L, R]$ можна обчислити так:

<CodeTabs>

```cpp
int i = lg[R - L + 1];
int minimum = min(st[i][L], st[i][R - (1 << i) + 1]);
```

```python
i = lg[R - L + 1]
minimum = min(st[i][L], st[i][R - (1 << i) + 1])
```

```typescript
const i = lg[R - L + 1];
const minimum = Math.min(st[i][L], st[i][R - (1 << i) + 1]);
```

```go
i := lg[R-L+1]
minimum := min(st[i][L], st[i][R-(1<<i)+1])
```

</CodeTabs>

Часова складність запиту мінімуму на відрізку становить $O(1)$.

## Подібні структури даних, що підтримують більше типів запитів \{#similar-data-structures-supporting-more-types-of-queries}

Одна з основних слабкостей підходу з $O(1)$, обговореного в попередньому розділі, полягає в тому, що цей підхід підтримує лише запити [ідемпотентних функцій](https://en.wikipedia.org/wiki/Idempotence).
Тобто він чудово працює для запитів мінімуму на відрізку, але відповісти на запити суми на відрізку цим підходом неможливо.

Існують подібні структури даних, які можуть обробляти будь-який тип асоціативних функцій і відповідати на запити на відрізках за $O(1)$.
Одна з них називається [Disjoint Sparse Table](https://discuss.codechef.com/questions/117696/tutorial-disjoint-sparse-table).
Інша — це [Sqrt Tree](sqrt-tree.md).

## Задачі для практики \{#practice-problems}

* [SPOJ - RMQSQ](http://www.spoj.com/problems/RMQSQ/)
* [SPOJ - THRBL](http://www.spoj.com/problems/THRBL/)
* [Codechef - MSTICK](https://www.codechef.com/problems/MSTICK)
* [Codechef - SEAD](https://www.codechef.com/problems/SEAD)
* [Codeforces - CGCDSSQ](http://codeforces.com/contest/475/problem/D)
* [Codeforces - R2D2 and Droid Army](http://codeforces.com/problemset/problem/514/D)
* [Codeforces - Maximum of Maximums of Minimums](http://codeforces.com/problemset/problem/872/B)
* [SPOJ - Miraculous](http://www.spoj.com/problems/TNVFC1M/)
* [DevSkill - Multiplication Interval (archived)](http://web.archive.org/web/20200922003506/https://devskill.com/CodingProblems/ViewProblem/19)
* [Codeforces - Animals and Puzzles](http://codeforces.com/contest/713/problem/D)
* [Codeforces - Trains and Statistics](http://codeforces.com/contest/675/problem/E)
* [SPOJ - Postering](http://www.spoj.com/problems/POSTERIN/)
* [SPOJ - Negative Score](http://www.spoj.com/problems/RPLN/)
* [SPOJ - A Famous City](http://www.spoj.com/problems/CITY2/)
* [SPOJ - Diferencija](http://www.spoj.com/problems/DIFERENC/)
* [Codeforces - Turn off the TV](http://codeforces.com/contest/863/problem/E)
* [Codeforces - Map](http://codeforces.com/contest/15/problem/D)
* [Codeforces - Awards for Contestants](http://codeforces.com/contest/873/problem/E)
* [Codeforces - Longest Regular Bracket Sequence](http://codeforces.com/contest/5/problem/C)
* [CSES - Static Range Minimum Queries](https://cses.fi/problemset/task/1647)
* [Codeforces - Array Stabilization (GCD version)](http://codeforces.com/problemset/problem/1547/F)

## Відеоматеріали \{#video}

<YouTubeEmbed id="0jWeUdxrGm4" title="Sparse Table & RMQ (Range Minimum Query) — Errichto Algorithms" />
