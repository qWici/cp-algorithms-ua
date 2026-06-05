# Тести простоти

У цій статті описано кілька алгоритмів, що дозволяють визначити, чи є число простим.

## Пробні ділення \{#trial-division}

За означенням просте число не має жодних дільників, окрім $1$ і самого себе.
Складене число має принаймні один додатковий дільник, назвемо його $d$.
Природно, що $\frac{n}{d}$ також є дільником $n$.
Легко бачити, що або $d \le \sqrt{n}$, або $\frac{n}{d} \le \sqrt{n}$, а отже один із дільників $d$ і $\frac{n}{d}$ не перевищує $\sqrt{n}$.
Цю інформацію ми можемо використати для перевірки простоти.

Ми намагаємося знайти нетривіальний дільник, перевіряючи, чи є якесь із чисел від $2$ до $\sqrt{n}$ дільником $n$.
Якщо це дільник, то $n$ точно не є простим, інакше є.

<CodeTabs>

```cpp
bool isPrime(int x) {
    for (int d = 2; d * d <= x; d++) {
        if (x % d == 0)
            return false;
    }
    return x >= 2;
}
```

```python
def is_prime(x: int) -> bool:
    d = 2
    while d * d <= x:
        if x % d == 0:
            return False
        d += 1
    return x >= 2
```

```typescript
function isPrime(x: number): boolean {
  for (let d = 2; d * d <= x; d++) {
    if (x % d === 0) return false;
  }
  return x >= 2;
}
```

```go
func isPrime(x int) bool {
	for d := 2; d*d <= x; d++ {
		if x%d == 0 {
			return false
		}
	}
	return x >= 2
}
```

</CodeTabs>

Це найпростіша форма перевірки на простоту.
Цю функцію можна суттєво оптимізувати, наприклад перевіряючи в циклі лише непарні числа, оскільки єдине парне просте число — це 2.
Кілька таких оптимізацій описано в статті про [факторизацію цілих чисел](factorization.md).

## Тест Ферма \{#fermat-primality-test}

Це ймовірнісний тест.

Мала теорема Ферма (див. також [функцію Ейлера](phi-function.md)) стверджує, що для простого числа $p$ і взаємно простого з ним цілого $a$ виконується така рівність:

$$
a^{p-1} \equiv 1 \bmod p
$$

У загальному випадку для складених чисел ця теорема не виконується.

Це можна використати для побудови тесту простоти.
Ми обираємо ціле $2 \le a \le p - 2$ і перевіряємо, чи виконується рівність.
Якщо вона не виконується, тобто $a^{p-1} \not\equiv 1 \bmod p$, то ми знаємо, що $p$ не може бути простим числом.
У цьому випадку ми називаємо основу $a$ *свідком Ферма* складеності $p$.

Однак можливо й так, що рівність виконується для складеного числа.
Тож якщо рівність виконується, ми не маємо доведення простоти.
Ми можемо лише сказати, що $p$ *ймовірно просте*.
Якщо виявиться, що число насправді складене, ми називаємо основу $a$ *брехуном Ферма*.

Виконавши тест для всіх можливих основ $a$, ми справді можемо довести, що число просте.
Однак на практиці так не роблять, оскільки це значно витратніше, ніж просто виконати *пробні ділення*.
Натомість тест повторюють кілька разів з випадковим вибором $a$.
Якщо ми не знаходимо жодного свідка складеності, то дуже ймовірно, що число насправді просте.

<CodeTabs>

```cpp
bool probablyPrimeFermat(int n, int iter=5) {
    if (n < 4)
        return n == 2 || n == 3;

    for (int i = 0; i < iter; i++) {
        int a = 2 + rand() % (n - 3);
        if (binpower(a, n - 1, n) != 1)
            return false;
    }
    return true;
}
```

```python
import random


# бінарне піднесення за модулем; великі числа в Python рідні, переповнення немає
def binpower(base: int, e: int, mod: int) -> int:
    result = 1
    base %= mod
    while e:
        if e & 1:
            result = result * base % mod
        base = base * base % mod
        e >>= 1
    return result


def probably_prime_fermat(n: int, iter: int = 5) -> bool:
    if n < 4:
        return n == 2 or n == 3

    for _ in range(iter):
        a = 2 + random.randint(0, n - 4)  # 2 <= a <= n-2
        if binpower(a, n - 1, n) != 1:
            return False
    return True
```

```typescript
// бінарне піднесення за модулем; bigint захищає від переповнення при множенні
function binpower(base: bigint, e: bigint, mod: bigint): bigint {
  let result = 1n;
  base %= mod;
  while (e > 0n) {
    if (e & 1n) result = (result * base) % mod;
    base = (base * base) % mod;
    e >>= 1n;
  }
  return result;
}

function probablyPrimeFermat(n: bigint, iter = 5): boolean {
  if (n < 4n) return n === 2n || n === 3n;

  for (let i = 0; i < iter; i++) {
    // 2 <= a <= n-2
    const a = 2n + BigInt(Math.floor(Math.random() * Number(n - 3n)));
    if (binpower(a, n - 1n, n) !== 1n) return false;
  }
  return true;
}
```

```go
import (
	"math/bits"
	"math/rand"
)

// mulmod = (a*b) % mod без переповнення.
// Аналог __uint128_t із C++: bits.Mul64 дає повний 128-бітний добуток, а bits.Div64 — остачу.
func mulmod(a, b, mod uint64) uint64 {
	hi, lo := bits.Mul64(a, b)
	_, rem := bits.Div64(hi, lo, mod) // вимагає hi < mod, що гарантовано при a, b < mod
	return rem
}

func binpower(base, e, mod uint64) uint64 {
	result := uint64(1)
	base %= mod
	for e > 0 {
		if e&1 == 1 {
			result = mulmod(result, base, mod)
		}
		base = mulmod(base, base, mod)
		e >>= 1
	}
	return result
}

func probablyPrimeFermat(n uint64, iter int) bool {
	if n < 4 {
		return n == 2 || n == 3
	}

	for i := 0; i < iter; i++ {
		a := 2 + uint64(rand.Int63n(int64(n-3))) // 2 <= a <= n-2
		if binpower(a, n-1, n) != 1 {
			return false
		}
	}
	return true
}
```

</CodeTabs>

Для ефективного обчислення степеня $a^{p-1}$ ми використовуємо [бінарне піднесення до степеня](binary-exp.md).

Однак є одна погана новина:
існують складені числа, для яких $a^{n-1} \equiv 1 \bmod n$ виконується для всіх $a$, взаємно простих з $n$, наприклад для числа $561 = 3 \cdot 11 \cdot 17$.
Такі числа називають *числами Кармайкла*.
Тест Ферма може виявити ці числа лише в тому випадку, якщо нам неймовірно пощастить і ми оберемо основу $a$ з $\gcd(a, n) \ne 1$.

Тест Ферма все ще використовують на практиці, оскільки він дуже швидкий, а числа Кармайкла трапляються дуже рідко.
Наприклад, нижче від $10^9$ існує лише 646 таких чисел.

## Тест Міллера–Рабіна \{#miller-rabin-primality-test}

Тест Міллера–Рабіна розвиває ідеї тесту Ферма.

Для непарного числа $n$ значення $n-1$ є парним, і ми можемо винести всі степені двійки.
Можемо записати:

$$
n - 1 = 2^s \cdot d,~\text{де}~d~\text{непарне}.
$$

Це дозволяє нам розкласти на множники рівність із малої теореми Ферма:

$$
\begin{array}{rl}
a^{n-1} \equiv 1 \bmod n &\Longleftrightarrow a^{2^s d} - 1 \equiv 0 \bmod n \\\\
&\Longleftrightarrow (a^{2^{s-1} d} + 1) (a^{2^{s-1} d} - 1) \equiv 0 \bmod n \\\\
&\Longleftrightarrow (a^{2^{s-1} d} + 1) (a^{2^{s-2} d} + 1) (a^{2^{s-2} d} - 1) \equiv 0 \bmod n \\\\
&\quad\vdots \\\\
&\Longleftrightarrow (a^{2^{s-1} d} + 1) (a^{2^{s-2} d} + 1) \cdots (a^{d} + 1) (a^{d} - 1) \equiv 0 \bmod n \\\\
\end{array}
$$

Якщо $n$ просте, то $n$ має ділити один із цих множників.
Саме це твердження ми й перевіряємо в тесті Міллера–Рабіна, і воно є суворішою версією твердження тесту Ферма.
Для основи $2 \le a \le n-2$ ми перевіряємо, чи виконується або

$$
a^d \equiv 1 \bmod n
$$

або

$$
a^{2^r d} \equiv -1 \bmod n
$$

для деякого $0 \le r \le s - 1$.

Якщо ми знайшли основу $a$, яка не задовольняє жодну з наведених рівностей, то ми знайшли *свідка* складеності $n$.
У цьому випадку ми довели, що $n$ не є простим числом.

Подібно до тесту Ферма, можливо й так, що набір рівнянь задовольняється для складеного числа.
У цьому випадку основу $a$ називають *сильним брехуном*.
Якщо основа $a$ задовольняє рівняння (одне з них), то $n$ лише *сильно ймовірно просте*.
Однак немає чисел на кшталт чисел Кармайкла, для яких брешуть усі нетривіальні основи.
Насправді можна показати, що сильними брехунами можуть бути щонайбільше $\frac{1}{4}$ основ.
Якщо $n$ складене, то з імовірністю $\ge 75\%$ випадкова основа повідомить нам, що воно складене.
Виконавши кілька ітерацій з різними випадковими основами, ми можемо з дуже високою ймовірністю сказати, чи число справді просте, чи воно складене.

Ось реалізація для 64-бітних цілих чисел.

<CodeTabs>

```cpp
using u64 = uint64_t;
using u128 = __uint128_t;

u64 binpower(u64 base, u64 e, u64 mod) {
    u64 result = 1;
    base %= mod;
    while (e) {
        if (e & 1)
            result = (u128)result * base % mod;
        base = (u128)base * base % mod;
        e >>= 1;
    }
    return result;
}

bool check_composite(u64 n, u64 a, u64 d, int s) {
    u64 x = binpower(a, d, n);
    if (x == 1 || x == n - 1)
        return false;
    for (int r = 1; r < s; r++) {
        x = (u128)x * x % n;
        if (x == n - 1)
            return false;
    }
    return true;
};

bool MillerRabin(u64 n, int iter=5) { // повертає true, якщо n ймовірно просте, інакше повертає false.
    if (n < 4)
        return n == 2 || n == 3;

    int s = 0;
    u64 d = n - 1;
    while ((d & 1) == 0) {
        d >>= 1;
        s++;
    }

    for (int i = 0; i < iter; i++) {
        int a = 2 + rand() % (n - 3);
        if (check_composite(n, a, d, s))
            return false;
    }
    return true;
}
```

```python
import random


# великі числа в Python рідні, тож множення за модулем не переповнюється
def binpower(base: int, e: int, mod: int) -> int:
    result = 1
    base %= mod
    while e:
        if e & 1:
            result = result * base % mod
        base = base * base % mod
        e >>= 1
    return result


def check_composite(n: int, a: int, d: int, s: int) -> bool:
    x = binpower(a, d, n)
    if x == 1 or x == n - 1:
        return False
    for _ in range(1, s):
        x = x * x % n
        if x == n - 1:
            return False
    return True


def miller_rabin(n: int, iter: int = 5) -> bool:  # повертає True, якщо n ймовірно просте
    if n < 4:
        return n == 2 or n == 3

    s = 0
    d = n - 1
    while (d & 1) == 0:
        d >>= 1
        s += 1

    for _ in range(iter):
        a = 2 + random.randint(0, n - 4)
        if check_composite(n, a, d, s):
            return False
    return True
```

```typescript
// bigint забезпечує точну арифметику для 64-бітних чисел без переповнення
function binpower(base: bigint, e: bigint, mod: bigint): bigint {
  let result = 1n;
  base %= mod;
  while (e > 0n) {
    if (e & 1n) result = (result * base) % mod;
    base = (base * base) % mod;
    e >>= 1n;
  }
  return result;
}

function checkComposite(n: bigint, a: bigint, d: bigint, s: number): boolean {
  let x = binpower(a, d, n);
  if (x === 1n || x === n - 1n) return false;
  for (let r = 1; r < s; r++) {
    x = (x * x) % n;
    if (x === n - 1n) return false;
  }
  return true;
}

// повертає true, якщо n ймовірно просте, інакше false
function millerRabin(n: bigint, iter = 5): boolean {
  if (n < 4n) return n === 2n || n === 3n;

  let s = 0;
  let d = n - 1n;
  while ((d & 1n) === 0n) {
    d >>= 1n;
    s++;
  }

  for (let i = 0; i < iter; i++) {
    const a = 2n + BigInt(Math.floor(Math.random() * Number(n - 3n)));
    if (checkComposite(n, a, d, s)) return false;
  }
  return true;
}
```

```go
import (
	"math/bits"
	"math/rand"
)

// mulmod = (a*b) % mod без переповнення.
// Аналог __uint128_t із C++: bits.Mul64 дає повний 128-бітний добуток, а bits.Div64 — остачу.
func mulmod(a, b, mod uint64) uint64 {
	hi, lo := bits.Mul64(a, b)
	_, rem := bits.Div64(hi, lo, mod) // вимагає hi < mod, що гарантовано при a, b < mod
	return rem
}

func binpower(base, e, mod uint64) uint64 {
	result := uint64(1)
	base %= mod
	for e > 0 {
		if e&1 == 1 {
			result = mulmod(result, base, mod)
		}
		base = mulmod(base, base, mod)
		e >>= 1
	}
	return result
}

func checkComposite(n, a, d uint64, s int) bool {
	x := binpower(a, d, n)
	if x == 1 || x == n-1 {
		return false
	}
	for r := 1; r < s; r++ {
		x = mulmod(x, x, n)
		if x == n-1 {
			return false
		}
	}
	return true
}

// повертає true, якщо n ймовірно просте, інакше false
func MillerRabin(n uint64, iter int) bool {
	if n < 4 {
		return n == 2 || n == 3
	}

	s := 0
	d := n - 1
	for d&1 == 0 {
		d >>= 1
		s++
	}

	for i := 0; i < iter; i++ {
		a := 2 + uint64(rand.Int63n(int64(n-3)))
		if checkComposite(n, a, d, s) {
			return false
		}
	}
	return true
}
```

</CodeTabs>

Перед тестом Міллера–Рабіна можна додатково перевірити, чи не є якесь із перших кількох простих чисел дільником.
Це може значно пришвидшити тест, оскільки більшість складених чисел мають дуже малі прості дільники.
Наприклад, $88\%$ усіх чисел мають простий множник, менший за $100$.

### Детермінований варіант \{#deterministic-version}

Міллер показав, що алгоритм можна зробити детермінованим, перевіряючи лише всі основи $\le O((\ln n)^2)$.
Пізніше Бах дав конкретну межу: достатньо перевірити всі основи $a \le 2 \ln(n)^2$.

Це все ще доволі велика кількість основ.
Тому люди вклали чимало обчислювальної потужності в пошук нижчих меж.
Виявляється, для перевірки 32-бітного цілого достатньо перевірити перші 4 прості основи: 2, 3, 5 і 7.
Найменше складене число, що проходить цей тест помилково, — це $3,215,031,751 = 151 \cdot 751 \cdot 28351$.
А для перевірки 64-бітного цілого достатньо перевірити перші 12 простих основ: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31 і 37.

Це дає таку детерміновану реалізацію:

<CodeTabs>

```cpp
bool MillerRabin(u64 n) { // повертає true, якщо n просте, інакше повертає false.
    if (n < 2)
        return false;

    int r = 0;
    u64 d = n - 1;
    while ((d & 1) == 0) {
        d >>= 1;
        r++;
    }

    for (int a : {2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37}) {
        if (n == a)
            return true;
        if (check_composite(n, a, d, r))
            return false;
    }
    return true;
}
```

```python
# використовує check_composite та binpower із попередньої реалізації
def miller_rabin_det(n: int) -> bool:  # повертає True, якщо n просте, інакше False
    if n < 2:
        return False

    r = 0
    d = n - 1
    while (d & 1) == 0:
        d >>= 1
        r += 1

    for a in (2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37):
        if n == a:
            return True
        if check_composite(n, a, d, r):
            return False
    return True
```

```typescript
// використовує checkComposite та binpower із попередньої реалізації
// повертає true, якщо n просте, інакше false
function millerRabinDet(n: bigint): boolean {
  if (n < 2n) return false;

  let r = 0;
  let d = n - 1n;
  while ((d & 1n) === 0n) {
    d >>= 1n;
    r++;
  }

  for (const a of [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n]) {
    if (n === a) return true;
    if (checkComposite(n, a, d, r)) return false;
  }
  return true;
}
```

```go
// використовує checkComposite та binpower із попередньої реалізації
// повертає true, якщо n просте, інакше false
func MillerRabinDeterministic(n uint64) bool {
	if n < 2 {
		return false
	}

	r := 0
	d := n - 1
	for d&1 == 0 {
		d >>= 1
		r++
	}

	for _, a := range []uint64{2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37} {
		if n == a {
			return true
		}
		if checkComposite(n, a, d, r) {
			return false
		}
	}
	return true
}
```

</CodeTabs>

Перевірку також можна виконати лише з 7 основами: 2, 325, 9375, 28178, 450775, 9780504 і 1795265022.
Однак, оскільки ці числа (окрім 2) не прості, потрібно додатково перевірити, чи не дорівнює число, яке ви перевіряєте, якомусь простому дільнику цих основ: 2, 3, 5, 13, 19, 73, 193, 407521, 299210837.

## Задачі для практики \{#practice-problems}

- [SPOJ - Prime or Not](https://www.spoj.com/problems/PON/)
- [Project euler - Investigating a Prime Pattern](https://projecteuler.net/problem=146)

## Відеоматеріали \{#video}

<YouTubeEmbed id="8i0UnX7Snkc" title="Testing for Primality (Miller-Rabin Test) — Neso Academy" />
