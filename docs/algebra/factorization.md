# Факторизація цілих чисел

У цій статті ми розглянемо кілька алгоритмів факторизації цілих чисел, кожен з яких може бути або швидким, або повільним різною мірою залежно від вхідних даних.

Зауважимо: якщо число, яке ви хочете розкласти на множники, насправді є простим, більшість алгоритмів працюватимуть дуже повільно. Особливо це стосується методу Ферма, методу Полларда p−1 та ро-алгоритму Полларда.
Тому має сенс спершу виконати ймовірнісний (або швидкий детермінований) [тест на простоту](primality_tests.md), перш ніж намагатися розкласти число на множники.

## Пробне ділення \{#trial-division}

Це найбазовіший алгоритм для пошуку розкладу на прості множники.

Ми ділимо число на кожен можливий дільник $d$.
Можна помітити, що неможливо, щоб усі прості множники складеного числа $n$ були більшими за $\sqrt{n}$.
Тому нам достатньо перевірити лише дільники $2 \le d \le \sqrt{n}$, що дає нам розклад на прості множники за $O(\sqrt{n})$.
(Це [псевдополіноміальний час](https://en.wikipedia.org/wiki/Pseudo-polynomial_time), тобто поліноміальний відносно значення входу, але експоненційний відносно кількості бітів входу.)

Найменший дільник обов'язково є простим числом.
Ми прибираємо знайдений множник і продовжуємо процес.
Якщо ми не можемо знайти жодного дільника в діапазоні $[2; \sqrt{n}]$, то саме число має бути простим.

<CodeTabs>

```cpp
vector<long long> trial_division1(long long n) {
    vector<long long> factorization;
    for (long long d = 2; d * d <= n; d++) {
        while (n % d == 0) {
            factorization.push_back(d);
            n /= d;
        }
    }
    if (n > 1)
        factorization.push_back(n);
    return factorization;
}
```

```python
def trial_division1(n: int) -> list[int]:
    factorization: list[int] = []
    d = 2
    while d * d <= n:
        while n % d == 0:  # виносимо множник d стільки разів, скільки можемо
            factorization.append(d)
            n //= d
        d += 1
    if n > 1:  # залишок — це простий множник
        factorization.append(n)
    return factorization
```

```typescript
// для n у межах Number.MAX_SAFE_INTEGER (< 2^53)
function trialDivision1(n: number): number[] {
  const factorization: number[] = [];
  for (let d = 2; d * d <= n; d++) {
    while (n % d === 0) { // виносимо множник d стільки разів, скільки можемо
      factorization.push(d);
      n /= d;
    }
  }
  if (n > 1) factorization.push(n); // залишок — це простий множник
  return factorization;
}
```

```go
func trialDivision1(n int64) []int64 {
    var factorization []int64
    for d := int64(2); d*d <= n; d++ {
        for n%d == 0 { // виносимо множник d стільки разів, скільки можемо
            factorization = append(factorization, d)
            n /= d
        }
    }
    if n > 1 { // залишок — це простий множник
        factorization = append(factorization, n)
    }
    return factorization
}
```

</CodeTabs>

### Факторизація з колесом \{#wheel-factorization}

Це оптимізація пробного ділення.
Коли ми вже знаємо, що число не ділиться на 2, нам не потрібно перевіряти інші парні числа.
Це залишає нам лише $50\%$ чисел для перевірки.
Після того як ми винесли 2 й отримали непарне число, ми можемо просто почати з 3 і враховувати лише інші непарні числа.

<CodeTabs>

```cpp
vector<long long> trial_division2(long long n) {
    vector<long long> factorization;
    while (n % 2 == 0) {
        factorization.push_back(2);
        n /= 2;
    }
    for (long long d = 3; d * d <= n; d += 2) {
        while (n % d == 0) {
            factorization.push_back(d);
            n /= d;
        }
    }
    if (n > 1)
        factorization.push_back(n);
    return factorization;
}
```

```python
def trial_division2(n: int) -> list[int]:
    factorization: list[int] = []
    while n % 2 == 0:  # спершу виносимо всі двійки
        factorization.append(2)
        n //= 2
    d = 3
    while d * d <= n:  # далі перевіряємо лише непарні дільники
        while n % d == 0:
            factorization.append(d)
            n //= d
        d += 2
    if n > 1:
        factorization.append(n)
    return factorization
```

```typescript
function trialDivision2(n: number): number[] {
  const factorization: number[] = [];
  while (n % 2 === 0) { // спершу виносимо всі двійки
    factorization.push(2);
    n /= 2;
  }
  for (let d = 3; d * d <= n; d += 2) { // далі лише непарні дільники
    while (n % d === 0) {
      factorization.push(d);
      n /= d;
    }
  }
  if (n > 1) factorization.push(n);
  return factorization;
}
```

```go
func trialDivision2(n int64) []int64 {
    var factorization []int64
    for n%2 == 0 { // спершу виносимо всі двійки
        factorization = append(factorization, 2)
        n /= 2
    }
    for d := int64(3); d*d <= n; d += 2 { // далі лише непарні дільники
        for n%d == 0 {
            factorization = append(factorization, d)
            n /= d
        }
    }
    if n > 1 {
        factorization = append(factorization, n)
    }
    return factorization
}
```

</CodeTabs>

Цей метод можна розширити далі.
Якщо число не ділиться на 3, ми також можемо ігнорувати всі інші кратні 3 в подальших обчисленнях.
Отже, нам потрібно перевіряти лише числа $5, 7, 11, 13, 17, 19, 23, \dots$.
Ми можемо помітити закономірність у цих числах, що залишилися.
Нам потрібно перевіряти всі числа з $d \bmod 6 = 1$ та $d \bmod 6 = 5$.
Отже, це залишає нам лише $33.3\%$ відсотків чисел для перевірки.
Ми можемо це реалізувати, спершу винісши прості множники 2 і 3, після чого починаємо з 5 і враховуємо лише остачі $1$ та $5$ за модулем $6$.

Ось реалізація для простих чисел 2, 3 і 5.
Зручно зберігати кроки пропуску в масиві.

<CodeTabs>

```cpp
vector<long long> trial_division3(long long n) {
    vector<long long> factorization;
    for (int d : {2, 3, 5}) {
        while (n % d == 0) {
            factorization.push_back(d);
            n /= d;
        }
    }
    static array<int, 8> increments = {4, 2, 4, 2, 4, 6, 2, 6};
    int i = 0;
    for (long long d = 7; d * d <= n; d += increments[i++]) {
        while (n % d == 0) {
            factorization.push_back(d);
            n /= d;
        }
        if (i == 8)
            i = 0;
    }
    if (n > 1)
        factorization.push_back(n);
    return factorization;
}
```

```python
def trial_division3(n: int) -> list[int]:
    factorization: list[int] = []
    for d in (2, 3, 5):  # виносимо прості з колеса 2*3*5
        while n % d == 0:
            factorization.append(d)
            n //= d
    increments = (4, 2, 4, 2, 4, 6, 2, 6)  # кроки колеса по модулю 30
    i = 0
    d = 7
    while d * d <= n:
        while n % d == 0:
            factorization.append(d)
            n //= d
        d += increments[i]
        i += 1
        if i == 8:
            i = 0
    if n > 1:
        factorization.append(n)
    return factorization
```

```typescript
function trialDivision3(n: number): number[] {
  const factorization: number[] = [];
  for (const d of [2, 3, 5]) { // виносимо прості з колеса 2*3*5
    while (n % d === 0) {
      factorization.push(d);
      n /= d;
    }
  }
  const increments = [4, 2, 4, 2, 4, 6, 2, 6]; // кроки колеса по модулю 30
  let i = 0;
  for (let d = 7; d * d <= n; d += increments[i++]) {
    while (n % d === 0) {
      factorization.push(d);
      n /= d;
    }
    if (i === 8) i = 0;
  }
  if (n > 1) factorization.push(n);
  return factorization;
}
```

```go
func trialDivision3(n int64) []int64 {
    var factorization []int64
    for _, d := range []int64{2, 3, 5} { // виносимо прості з колеса 2*3*5
        for n%d == 0 {
            factorization = append(factorization, d)
            n /= d
        }
    }
    increments := [8]int64{4, 2, 4, 2, 4, 6, 2, 6} // кроки колеса по модулю 30
    i := 0
    for d := int64(7); d*d <= n; {
        for n%d == 0 {
            factorization = append(factorization, d)
            n /= d
        }
        d += increments[i]
        i++
        if i == 8 {
            i = 0
        }
    }
    if n > 1 {
        factorization = append(factorization, n)
    }
    return factorization
}
```

</CodeTabs>

Якщо ми продовжимо розширювати цей метод, додаючи ще більше простих чисел, можна досягти кращих відсотків, але списки пропусків ставатимуть більшими.

### Попередньо обчислені прості числа \{#precomputed-primes}

Розширюючи метод факторизації з колесом нескінченно, ми зрештою залишимося лише з простими числами для перевірки.
Хороший спосіб це зробити — попередньо обчислити всі прості числа за допомогою [решета Ератосфена](sieve-of-eratosthenes.md) до $\sqrt{n}$ і перевіряти їх по черзі.

<CodeTabs>

```cpp
vector<long long> primes;

vector<long long> trial_division4(long long n) {
    vector<long long> factorization;
    for (long long d : primes) {
        if (d * d > n)
            break;
        while (n % d == 0) {
            factorization.push_back(d);
            n /= d;
        }
    }
    if (n > 1)
        factorization.push_back(n);
    return factorization;
}
```

```python
# primes — список заздалегідь обчислених простих (наприклад, решетом Ератосфена)
primes: list[int] = []

def trial_division4(n: int) -> list[int]:
    factorization: list[int] = []
    for d in primes:
        if d * d > n:
            break
        while n % d == 0:
            factorization.append(d)
            n //= d
    if n > 1:
        factorization.append(n)
    return factorization
```

```typescript
// primes — масив заздалегідь обчислених простих (наприклад, решетом Ератосфена)
const primes: number[] = [];

function trialDivision4(n: number): number[] {
  const factorization: number[] = [];
  for (const d of primes) {
    if (d * d > n) break;
    while (n % d === 0) {
      factorization.push(d);
      n /= d;
    }
  }
  if (n > 1) factorization.push(n);
  return factorization;
}
```

```go
// primes — зріз заздалегідь обчислених простих (наприклад, решетом Ератосфена)
var primes []int64

func trialDivision4(n int64) []int64 {
    var factorization []int64
    for _, d := range primes {
        if d*d > n {
            break
        }
        for n%d == 0 {
            factorization = append(factorization, d)
            n /= d
        }
    }
    if n > 1 {
        factorization = append(factorization, n)
    }
    return factorization
}
```

</CodeTabs>

## Метод факторизації Ферма \{#fermats-factorization-method}

Ми можемо записати непарне складене число $n = p \cdot q$ як різницю двох квадратів $n = a^2 - b^2$:

$$
n = \left(\frac{p + q}{2}\right)^2 - \left(\frac{p - q}{2}\right)^2
$$

Метод факторизації Ферма намагається використати цей факт, вгадуючи перший квадрат $a^2$ і перевіряючи, чи є квадратом і друга частина, $b^2 = a^2 - n$.
Якщо так, то ми знайшли множники $a - b$ та $a + b$ числа $n$.

<CodeTabs>

```cpp
int fermat(int n) {
    int a = ceil(sqrt(n));
    int b2 = a*a - n;
    int b = round(sqrt(b2));
    while (b * b != b2) {
        a = a + 1;
        b2 = a*a - n;
        b = round(sqrt(b2));
    }
    return a - b;
}
```

```python
from math import isqrt

def fermat(n: int) -> int:
    a = isqrt(n)
    if a * a < n:  # ceil(sqrt(n)) через цілий корінь — без похибок float
        a += 1
    b2 = a * a - n
    b = isqrt(b2)
    while b * b != b2:  # шукаємо a, для якого a^2 - n є точним квадратом
        a += 1
        b2 = a * a - n
        b = isqrt(b2)
    return a - b
```

```typescript
function fermat(n: number): number {
  let a = Math.ceil(Math.sqrt(n));
  let b2 = a * a - n;
  let b = Math.round(Math.sqrt(b2));
  while (b * b !== b2) { // шукаємо a, для якого a^2 - n є точним квадратом
    a += 1;
    b2 = a * a - n;
    b = Math.round(Math.sqrt(b2));
  }
  return a - b;
}
```

```go
func fermat(n int64) int64 {
    a := int64(math.Ceil(math.Sqrt(float64(n))))
    b2 := a*a - n
    b := int64(math.Round(math.Sqrt(float64(b2))))
    for b*b != b2 { // шукаємо a, для якого a^2 - n є точним квадратом
        a++
        b2 = a*a - n
        b = int64(math.Round(math.Sqrt(float64(b2))))
    }
    return a - b
}
```

</CodeTabs>

Цей метод факторизації може бути дуже швидким, якщо різниця між двома множниками $p$ та $q$ мала.
Алгоритм працює за час $O(|p - q|)$.
Проте на практиці цей метод використовують рідко. Щойно множники віддаляються один від одного, він стає вкрай повільним.

Однак щодо цього підходу все ще існує велика кількість варіантів оптимізації.
Розглядаючи квадрати $a^2$ за модулем фіксованого малого числа, можна помітити, що певні значення $a$ не потрібно розглядати, оскільки вони не можуть дати квадрат $a^2 - n$.


## Метод Полларда $p - 1$ \{#data-toc-label}

Дуже ймовірно, що число $n$ має принаймні один простий множник $p$ такий, що $p - 1$ є $\mathrm{B}$**-степенево-гладким** для малого $\mathrm{B}$. Кажуть, що ціле число $m$ є $\mathrm{B}$-степенево-гладким, якщо кожен простий степінь, що ділить $m$, не перевищує $\mathrm{B}$. Формально, нехай $\mathrm{B} \geqslant 1$ і нехай $m$ — довільне додатне ціле число. Припустимо, що розклад $m$ на прості множники є $m = \prod {q_i}^{e_i}$, де кожне $q_i$ — просте число, а $e_i \geqslant 1$. Тоді $m$ є $\mathrm{B}$-степенево-гладким, якщо для всіх $i$ виконується ${q_i}^{e_i} \leqslant \mathrm{B}$.
Наприклад, розклад числа $4817191$ на прості множники — це $1303 \cdot 3697$.
А значення $1303 - 1$ та $3697 - 1$ є відповідно $31$-степенево-гладким і $16$-степенево-гладким, оскільки $1303 - 1 = 2 \cdot 3 \cdot 7 \cdot 31$ та $3697 - 1 = 2^4 \cdot 3 \cdot 7 \cdot 11$.
У 1974 році Джон Поллард винайшов метод для виділення зі складеного числа множників $p$ таких, що $p-1$ є $\mathrm{B}$-степенево-гладким.

Ідея походить із [малої теореми Ферма](phi-function.md#application).
Нехай розклад $n$ буде $n = p \cdot q$.
Вона стверджує, що якщо $a$ взаємно просте з $p$, то виконується таке твердження:

$$
a^{p - 1} \equiv 1 \pmod{p}
$$

Це також означає, що

$$
{\left(a^{(p - 1)}\right)}^k \equiv a^{k \cdot (p - 1)} \equiv 1 \pmod{p}.
$$

Отже, для будь-якого $M$ з $p - 1 ~|~ M$ ми знаємо, що $a^M \equiv 1$.
Це означає, що $a^M - 1 = p \cdot r$, а через це також $p ~|~ \gcd(a^M - 1, n)$.

Тому, якщо $p - 1$ для множника $p$ числа $n$ ділить $M$, ми можемо виділити множник за допомогою [алгоритму Евкліда](euclid-algorithm.md).

Зрозуміло, що найменше $M$, яке є кратним кожному $\mathrm{B}$-степенево-гладкому числу, — це $\text{lcm}(1,~2~,3~,4~,~\dots,~B)$.
Або, як альтернатива:

$$
M = \prod_{\text{prime } q \le B} q^{\lfloor \log_q B \rfloor}
$$

Зауважимо: якщо $p-1$ ділить $M$ для всіх простих множників $p$ числа $n$, то $\gcd(a^M - 1, n)$ просто дорівнюватиме $n$.
У цьому випадку ми не отримуємо множника.
Тому ми намагатимемося виконувати $\gcd$ кілька разів, поки обчислюємо $M$.

Деякі складені числа не мають множників $p$ таких, що $p-1$ є $\mathrm{B}$-степенево-гладким для малого $\mathrm{B}$.
Наприклад, для складеного числа $100~000~000~000~000~493 = 763~013 \cdot 131~059~365~961$ значення $p-1$ є відповідно $190~753$-степенево-гладким і $1~092~161~383$-степенево-гладким.
Нам доведеться обрати $B \geq 190~753$, щоб розкласти це число на множники.

У наведеній нижче реалізації ми починаємо з $\mathrm{B} = 10$ і збільшуємо $\mathrm{B}$ після кожної ітерації.

<CodeTabs>

```cpp
long long pollards_p_minus_1(long long n) {
    int B = 10;
    long long g = 1;
    while (B <= 1000000 && g < n) {
        long long a = 2 + rand() %  (n - 3);
        g = gcd(a, n);
        if (g > 1)
            return g;

        // обчислюємо a^M
        for (int p : primes) {
            if (p >= B)
                continue;
            long long p_power = 1;
            while (p_power * p <= B)
                p_power *= p;
            a = power(a, p_power, n);

            g = gcd(a - 1, n);
            if (g > 1 && g < n)
                return g;
        }
        B *= 2;
    }
    return 1;
}
```

```python
import random
from math import gcd

# primes — список заздалегідь обчислених простих
# Python оперує великими числами нативно, тож переповнення немає,
# а вбудований pow(a, e, n) — це швидке модулярне піднесення до степеня.
def pollards_p_minus_1(n: int) -> int:
    B = 10
    g = 1
    while B <= 1_000_000 and g < n:
        a = 2 + random.randint(0, n - 4)  # випадкове a з [2, n-2]
        g = gcd(a, n)
        if g > 1:
            return g
        # обчислюємо a^M
        for p in primes:
            if p >= B:
                continue
            p_power = 1
            while p_power * p <= B:
                p_power *= p
            a = pow(a, p_power, n)
            g = gcd(a - 1, n)
            if 1 < g < n:
                return g
        B *= 2
    return 1
```

```typescript
// bigint обов'язковий: a^M mod n переповнює звичайний number (> 2^53)
const primes: bigint[] = []; // заздалегідь обчислені прості

function gcd(a: bigint, b: bigint): bigint {
  while (b) [a, b] = [b, a % b];
  return a < 0n ? -a : a;
}

function powMod(a: bigint, e: bigint, mod: bigint): bigint {
  let res = 1n;
  a %= mod;
  while (e > 0n) {
    if (e & 1n) res = (res * a) % mod;
    a = (a * a) % mod;
    e >>= 1n;
  }
  return res;
}

function pollardsPMinus1(n: bigint): bigint {
  let B = 10n;
  let g = 1n;
  while (B <= 1_000_000n && g < n) {
    // випадкове a з [2, n-2]
    const a0 = 2n + BigInt(Math.floor(Math.random() * 1e15)) % (n - 3n);
    let a = a0;
    g = gcd(a, n);
    if (g > 1n) return g;
    // обчислюємо a^M
    for (const p of primes) {
      if (p >= B) continue;
      let pPower = 1n;
      while (pPower * p <= B) pPower *= p;
      a = powMod(a, pPower, n);
      g = gcd(a - 1n, n);
      if (g > 1n && g < n) return g;
    }
    B *= 2n;
  }
  return 1n;
}
```

```go
import (
    "math/big"
    "math/rand"
)

// При n до 1e18 множення a*a переповнює uint64, тому беремо math/big.
// (як альтернатива — mulmod через math/bits.Mul64 + ділення, але це складніше.)
var primes []int64 // заздалегідь обчислені прості

func pollardsPMinus1(n *big.Int) *big.Int {
    B := int64(10)
    g := big.NewInt(1)
    one := big.NewInt(1)
    for B <= 1_000_000 && g.Cmp(n) < 0 {
        // випадкове a з [2, n-2]
        r := new(big.Int).Rand(rand.New(rand.NewSource(1)), new(big.Int).Sub(n, big.NewInt(3)))
        a := new(big.Int).Add(r, big.NewInt(2))
        g = new(big.Int).GCD(nil, nil, a, n)
        if g.Cmp(one) > 0 {
            return g
        }
        // обчислюємо a^M
        for _, p := range primes {
            if p >= B {
                continue
            }
            pPower := int64(1)
            for pPower*p <= B {
                pPower *= p
            }
            a.Exp(a, big.NewInt(pPower), n) // швидке модулярне піднесення до степеня
            g = new(big.Int).GCD(nil, nil, new(big.Int).Sub(a, one), n)
            if g.Cmp(one) > 0 && g.Cmp(n) < 0 {
                return g
            }
        }
        B *= 2
    }
    return big.NewInt(1)
}
```

</CodeTabs>

Зауважте, що це ймовірнісний алгоритм.
Наслідком цього є те, що існує можливість того, що алгоритм узагалі не зможе знайти множник.

Складність становить $O(B \log B \log^2 n)$ на одну ітерацію.

## Ро-алгоритм Полларда \{#pollards-rho-algorithm}

Ро-алгоритм Полларда — це ще один алгоритм факторизації від Джона Полларда.

Нехай розклад числа на прості множники буде $n = p q$.
Алгоритм розглядає псевдовипадкову послідовність $\{x_i\} = \{x_0,~f(x_0),~f(f(x_0)),~\dots\}$, де $f$ — поліноміальна функція; зазвичай обирають $f(x) = (x^2 + c) \bmod n$ з $c = 1$.

У цьому випадку нас цікавить не сама послідовність $\{x_i\}$.
Нас більше цікавить послідовність $\{x_i \bmod p\}$.
Оскільки $f$ — поліноміальна функція, а всі значення лежать у діапазоні $[0;~p)$, ця послідовність зрештою зійдеться в цикл.
**Парадокс днів народження** насправді підказує, що очікувана кількість елементів до початку повторення становить $O(\sqrt{p})$.
Якщо $p$ менше за $\sqrt{n}$, повторення, ймовірно, почнеться за $O(\sqrt[4]{n})$.

Ось візуалізація такої послідовності $\{x_i \bmod p\}$ з $n = 2206637$, $p = 317$, $x_0 = 2$ та $f(x) = x^2 + 1$.
З форми послідовності ви можете дуже чітко побачити, чому алгоритм названо ро-алгоритмом Полларда ($\rho$).

<center> <img src="/img/docs/algebra/pollard_rho.png" alt="Pollard's rho visualization" /> </center>

Проте все ще залишається відкрите питання.
Як ми можемо скористатися властивостями послідовності $\{x_i \bmod p\}$ на свою користь, навіть не знаючи самого числа $p$?

Насправді це досить просто.
У послідовності $\{x_i \bmod p\}_{i \le j}$ є цикл тоді й лише тоді, коли існують два індекси $s, t \le j$ такі, що $x_s \equiv x_t \bmod p$.
Це рівняння можна переписати як $x_s - x_t \equiv 0 \bmod p$, що те саме, що й $p ~|~ \gcd(x_s - x_t, n)$.

Тому, якщо ми знайдемо два індекси $s$ та $t$ з $g = \gcd(x_s - x_t, n) > 1$, ми знайшли цикл, а також множник $g$ числа $n$.
Можливо, що $g = n$.
У цьому випадку ми не знайшли власного множника, тож маємо повторити алгоритм з іншим параметром (інше початкове значення $x_0$, інша константа $c$ у поліноміальній функції $f$).

Щоб знайти цикл, ми можемо використати будь-який поширений алгоритм виявлення циклів.

### Алгоритм пошуку циклу Флойда \{#floyds-cycle-finding-algorithm}

Цей алгоритм знаходить цикл, використовуючи два вказівники, що рухаються по послідовності з різними швидкостями.
Під час кожної ітерації перший вказівник просувається на один елемент уперед, тоді як другий вказівник просувається через кожен другий елемент.
Використовуючи цю ідею, легко помітити, що якщо цикл існує, то в певний момент під час проходження циклу другий вказівник наздожене перший.
Якщо довжина циклу дорівнює $\lambda$, а $\mu$ — це перший індекс, на якому цикл починається, то алгоритм працюватиме за час $O(\lambda + \mu)$.

Цей алгоритм також відомий як [алгоритм «черепаха і заєць»](../others/tortoise_and_hare.md), за казкою, в якій черепаха (повільний вказівник) і заєць (швидший вказівник) змагаються в забігу.

За допомогою цього алгоритму насправді можна визначити параметри $\lambda$ та $\mu$ (також за час $O(\lambda + \mu)$ і пам'ять $O(1)$).
Коли цикл виявлено, алгоритм поверне 'True'.
Якщо послідовність не має циклу, то функція зациклиться нескінченно.
Однак, використовуючи ро-алгоритм Полларда, цього можна уникнути.

```text
function floyd(f, x0):
    tortoise = x0
    hare = f(x0)
    while tortoise != hare:
        tortoise = f(tortoise)
        hare = f(f(hare))
    return true
```

### Реалізація \{#implementation}

Спершу наведемо реалізацію за допомогою **алгоритму пошуку циклу Флойда**.
Алгоритм загалом працює за час $O(\sqrt[4]{n} \log(n))$.

<CodeTabs>

```cpp
long long mult(long long a, long long b, long long mod) {
    return (__int128)a * b % mod;
}

long long f(long long x, long long c, long long mod) {
    return (mult(x, x, mod) + c) % mod;
}

long long rho(long long n, long long x0=2, long long c=1) {
    long long x = x0;
    long long y = x0;
    long long g = 1;
    while (g == 1) {
        x = f(x, c, n);
        y = f(y, c, n);
        y = f(y, c, n);
        g = gcd(abs(x - y), n);
    }
    return g;
}
```

```python
from math import gcd

# Python оперує великими числами нативно, тож x*x % n не переповнюється —
# окрема функція mult не потрібна.
def f(x: int, c: int, mod: int) -> int:
    return (x * x + c) % mod

def rho(n: int, x0: int = 2, c: int = 1) -> int:
    x = x0
    y = x0
    g = 1
    while g == 1:
        x = f(x, c, n)        # черепаха — один крок
        y = f(f(y, c, n), c, n)  # заєць — два кроки
        g = gcd(abs(x - y), n)
    return g
```

```typescript
// bigint: x*x для n до 1e18 переповнює number, окрема mult не потрібна
function gcd(a: bigint, b: bigint): bigint {
  while (b) [a, b] = [b, a % b];
  return a < 0n ? -a : a;
}

function f(x: bigint, c: bigint, mod: bigint): bigint {
  return (x * x + c) % mod;
}

function rho(n: bigint, x0 = 2n, c = 1n): bigint {
  let x = x0;
  let y = x0;
  let g = 1n;
  while (g === 1n) {
    x = f(x, c, n);       // черепаха — один крок
    y = f(f(y, c, n), c, n); // заєць — два кроки
    const d = x - y;
    g = gcd(d < 0n ? -d : d, n);
  }
  return g;
}
```

```go
import "math/big"

// math/big уникає переповнення при множенні x*x для n до 1e18.
func f(x, c, mod *big.Int) *big.Int {
    r := new(big.Int).Mul(x, x)
    r.Add(r, c)
    return r.Mod(r, mod)
}

func rho(n *big.Int, x0, c int64) *big.Int {
    x := big.NewInt(x0)
    y := big.NewInt(x0)
    cc := big.NewInt(c)
    g := big.NewInt(1)
    one := big.NewInt(1)
    for g.Cmp(one) == 0 {
        x = f(x, cc, n)        // черепаха — один крок
        y = f(f(y, cc, n), cc, n) // заєць — два кроки
        diff := new(big.Int).Abs(new(big.Int).Sub(x, y))
        g = new(big.Int).GCD(nil, nil, diff, n)
    }
    return g
}
```

</CodeTabs>

Наведена нижче таблиця показує значення $x$ та $y$ під час роботи алгоритму для $n = 2206637$, $x_0 = 2$ та $c = 1$.

$$
\newcommand\T{\Rule{0pt}{1em}{.3em}}
\begin{array}{|l|l|l|l|l|l|}
\hline
i & x_i \bmod n & x_{2i} \bmod n & x_i \bmod 317 & x_{2i} \bmod 317 & \gcd(x_i - x_{2i}, n) \\
\hline
0   & 2       & 2       & 2       & 2       & -   \\
1   & 5       & 26      & 5       & 26      & 1   \\
2   & 26      & 458330  & 26      & 265     & 1   \\
3   & 677     & 1671573 & 43      & 32      & 1   \\
4   & 458330  & 641379  & 265     & 88      & 1   \\
5   & 1166412 & 351937  & 169     & 67      & 1   \\
6   & 1671573 & 1264682 & 32      & 169     & 1   \\
7   & 2193080 & 2088470 & 74      & 74      & 317 \\
\hline
\end{array}
$$

Реалізація використовує функцію `mult`, яка множить два цілих числа $\le 10^{18}$ без переповнення, застосовуючи тип `__int128` з GCC для 128-бітних цілих.
Якщо GCC недоступний, ви можете скористатися ідеєю, подібною до [бінарного піднесення до степеня](binary-exp.md).

<CodeTabs>

```cpp
long long mult(long long a, long long b, long long mod) {
    long long result = 0;
    while (b) {
        if (b & 1)
            result = (result + a) % mod;
        a = (a + a) % mod;
        b >>= 1;
    }
    return result;
}
```

```python
def mult(a: int, b: int, mod: int) -> int:
    # У Python a * b % mod ніколи не переповнюється, тож ця версія потрібна лише
    # для ілюстрації ідеї «множення подвоєнням», аналогічної бінарному степеню.
    result = 0
    a %= mod
    while b:
        if b & 1:
            result = (result + a) % mod
        a = (a + a) % mod
        b >>= 1
    return result
```

```typescript
function mult(a: bigint, b: bigint, mod: bigint): bigint {
  // У bigint a * b % mod уже коректне; ця версія ілюструє множення подвоєнням.
  let result = 0n;
  a %= mod;
  while (b) {
    if (b & 1n) result = (result + a) % mod;
    a = (a + a) % mod;
    b >>= 1n;
  }
  return result;
}
```

```go
// uint64-варіант множення за модулем без переповнення (множення подвоєнням),
// корисний, якщо не хочеться залежати від math/big.
func mult(a, b, mod uint64) uint64 {
    var result uint64 = 0
    a %= mod
    for b > 0 {
        if b&1 == 1 {
            result = (result + a) % mod
        }
        a = (a + a) % mod
        b >>= 1
    }
    return result
}
```

</CodeTabs>

Як альтернатива, ви також можете реалізувати [множення Монтгомері](montgomery_multiplication.md).

Як зазначено раніше, якщо $n$ складене, а алгоритм повертає $n$ як множник, вам доведеться повторити процедуру з іншими параметрами $x_0$ та $c$.
Наприклад, вибір $x_0 = c = 1$ не розкладе $25 = 5 \cdot 5$.
Алгоритм поверне $25$.
Однак вибір $x_0 = 1$, $c = 2$ розкладе його.

### Алгоритм Брента \{#brents-algorithm}

Брент реалізує метод, подібний до методу Флойда, використовуючи два вказівники.
Різниця полягає в тому, що замість просування вказівників відповідно на одну й дві позиції, їх просувають на степені двійки.
Щойно $2^i$ стане більшим за $\lambda$ та $\mu$, ми знайдемо цикл.

```text
function floyd(f, x0):
    tortoise = x0
    hare = f(x0)
    l = 1
    while tortoise != hare:
        tortoise = hare
        repeat l times:
            hare = f(hare)
            if tortoise == hare:
                return true
        l *= 2
    return true
```

Алгоритм Брента також працює за лінійний час, але загалом швидший за алгоритм Флойда, оскільки використовує менше обчислень функції $f$.

### Реалізація \{#implementation-1}

Прямолінійну реалізацію алгоритму Брента можна прискорити, опускаючи члени $x_l - x_k$, якщо $k < \frac{3 \cdot l}{2}$.
Крім того, замість обчислення $\gcd$ на кожному кроці, ми перемножуємо члени й фактично перевіряємо $\gcd$ лише раз на кілька кроків, відкочуючись назад, якщо перестрибнули.

<CodeTabs>

```cpp
long long brent(long long n, long long x0=2, long long c=1) {
    long long x = x0;
    long long g = 1;
    long long q = 1;
    long long xs, y;

    int m = 128;
    int l = 1;
    while (g == 1) {
        y = x;
        for (int i = 1; i < l; i++)
            x = f(x, c, n);
        int k = 0;
        while (k < l && g == 1) {
            xs = x;
            for (int i = 0; i < m && i < l - k; i++) {
                x = f(x, c, n);
                q = mult(q, abs(y - x), n);
            }
            g = gcd(q, n);
            k += m;
        }
        l *= 2;
    }
    if (g == n) {
        do {
            xs = f(xs, c, n);
            g = gcd(abs(xs - y), n);
        } while (g == 1);
    }
    return g;
}
```

```python
from math import gcd

def brent(n: int, x0: int = 2, c: int = 1) -> int:
    x = x0
    g = 1
    q = 1
    xs = y = 0
    m = 128
    l = 1
    while g == 1:
        y = x
        for _ in range(1, l):
            x = f(x, c, n)
        k = 0
        while k < l and g == 1:
            xs = x
            # накопичуємо добуток різниць і рахуємо gcd рідше (раз на m кроків)
            for _ in range(min(m, l - k)):
                x = f(x, c, n)
                q = q * abs(y - x) % n
            g = gcd(q, n)
            k += m
        l *= 2
    if g == n:  # перестрибнули — відкочуємось по одному кроку
        while True:
            xs = f(xs, c, n)
            g = gcd(abs(xs - y), n)
            if g != 1:
                break
    return g
```

```typescript
function brent(n: bigint, x0 = 2n, c = 1n): bigint {
  let x = x0;
  let g = 1n;
  let q = 1n;
  let xs = 0n;
  let y = 0n;
  const m = 128;
  let l = 1;
  while (g === 1n) {
    y = x;
    for (let i = 1; i < l; i++) x = f(x, c, n);
    let k = 0;
    while (k < l && g === 1n) {
      xs = x;
      // накопичуємо добуток різниць і рахуємо gcd рідше (раз на m кроків)
      for (let i = 0; i < m && i < l - k; i++) {
        x = f(x, c, n);
        const d = y - x;
        q = (q * (d < 0n ? -d : d)) % n;
      }
      g = gcd(q, n);
      k += m;
    }
    l *= 2;
  }
  if (g === n) { // перестрибнули — відкочуємось по одному кроку
    do {
      xs = f(xs, c, n);
      const d = xs - y;
      g = gcd(d < 0n ? -d : d, n);
    } while (g === 1n);
  }
  return g;
}
```

```go
import "math/big"

func brent(n *big.Int, x0, c int64) *big.Int {
    x := big.NewInt(x0)
    cc := big.NewInt(c)
    g := big.NewInt(1)
    q := big.NewInt(1)
    one := big.NewInt(1)
    xs := big.NewInt(0)
    y := big.NewInt(0)
    m := 128
    l := 1
    for g.Cmp(one) == 0 {
        y = new(big.Int).Set(x)
        for i := 1; i < l; i++ {
            x = f(x, cc, n)
        }
        k := 0
        for k < l && g.Cmp(one) == 0 {
            xs = new(big.Int).Set(x)
            // накопичуємо добуток різниць і рахуємо gcd рідше (раз на m кроків)
            for i := 0; i < m && i < l-k; i++ {
                x = f(x, cc, n)
                diff := new(big.Int).Abs(new(big.Int).Sub(y, x))
                q.Mul(q, diff)
                q.Mod(q, n)
            }
            g = new(big.Int).GCD(nil, nil, q, n)
            k += m
        }
        l *= 2
    }
    if g.Cmp(n) == 0 { // перестрибнули — відкочуємось по одному кроку
        for {
            xs = f(xs, cc, n)
            diff := new(big.Int).Abs(new(big.Int).Sub(xs, y))
            g = new(big.Int).GCD(nil, nil, diff, n)
            if g.Cmp(one) != 0 {
                break
            }
        }
    }
    return g
}
```

</CodeTabs>

Поєднання пробного ділення для малих простих чисел разом із версією Брента ро-алгоритму Полларда дає дуже потужний алгоритм факторизації.

## Задачі для практики \{#practice-problems}

- [SPOJ - FACT0](https://www.spoj.com/problems/FACT0/)
- [SPOJ - FACT1](https://www.spoj.com/problems/FACT1/)
- [SPOJ - FACT2](https://www.spoj.com/problems/FACT2/)
- [GCPC 15 - Divisions](https://codeforces.com/gym/100753)
