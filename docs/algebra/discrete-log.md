# Дискретний логарифм

Дискретний логарифм — це ціле число $x$, що задовольняє рівняння

$$
a^x \equiv b \pmod m
$$

для заданих цілих чисел $a$, $b$ і $m$.

Дискретний логарифм існує не завжди, наприклад, рівняння $2^x \equiv 3 \pmod 7$ не має розв'язку. Простої умови, яка б визначала, чи існує дискретний логарифм, немає.

У цій статті ми опишемо алгоритм «крок немовляти — крок велетня» (baby-step giant-step), запропонований Шенксом у 1971 році для обчислення дискретного логарифма, який має часову складність $O(\sqrt{m})$. Це алгоритм типу **«зустріч посередині» (meet-in-the-middle)**, оскільки він використовує прийом розбиття задачі навпіл.

## Алгоритм \{#algorithm}

Розглянемо рівняння:

$$
a^x \equiv b \pmod m,
$$

де $a$ і $m$ взаємно прості.

Нехай $x = np - q$, де $n$ — деяка наперед обрана стала (як її обирати, ми розповімо згодом). $p$ називають **кроком велетня** (giant step), оскільки збільшення його на одиницю збільшує $x$ на $n$. Аналогічно, $q$ називають **кроком немовляти** (baby step).

Очевидно, будь-яке число $x$ з проміжку $[0; m)$ можна подати в такій формі, де $p \in [1; \lceil \frac{m}{n} \rceil ]$ і $q \in [0; n]$.

Тоді рівняння набуває вигляду:

$$
a^{np - q} \equiv b \pmod m.
$$

Користуючись тим, що $a$ і $m$ взаємно прості, отримуємо:

$$
a^{np} \equiv ba^q \pmod m
$$

Це нове рівняння можна переписати у спрощеній формі:

$$
f_1(p) = f_2(q).
$$

Цю задачу можна розв'язати методом «зустріч посередині» так:

* Обчислити $f_1$ для всіх можливих аргументів $p$. Відсортувати масив пар «значення — аргумент».
* Для всіх можливих аргументів $q$ обчислити $f_2$ і шукати відповідний $p$ у відсортованому масиві за допомогою бінарного пошуку.

## Складність \{#complexity}

Ми можемо обчислити $f_1(p)$ за $O(\log m)$ за допомогою [алгоритму бінарного піднесення до степеня](binary-exp.md). Аналогічно і для $f_2(q)$.

На першому кроці алгоритму нам потрібно обчислити $f_1$ для кожного можливого аргументу $p$, а потім відсортувати значення. Отже, цей крок має складність:

$$
O\left(\left\lceil \frac{m}{n} \right\rceil \left(\log m + \log \left\lceil \frac{m}{n} \right\rceil \right)\right) = O\left( \left\lceil \frac {m}{n} \right\rceil \log m\right)
$$

На другому кроці алгоритму нам потрібно обчислити $f_2(q)$ для кожного можливого аргументу $q$, а потім виконати бінарний пошук у масиві значень $f_1$, тож цей крок має складність:

$$
O\left(n \left(\log m + \log \frac{m}{n} \right) \right) = O\left(n \log m\right).
$$

Тепер, коли ми додаємо ці дві складності, отримуємо $\log m$, помножений на суму $n$ і $m/n$, яка є мінімальною за $n = m/n$, тобто, щоб досягти оптимальної швидкодії, $n$ слід обирати так, щоб:

$$
n = \sqrt{m}.
$$

Тоді складність алгоритму стає:

$$
O(\sqrt {m} \log m).
$$

## Реалізація \{#implementation}

### Найпростіша реалізація \{#the-simplest-implementation}

У наведеному нижче коді функція `powmod` обчислює $a^b \pmod m$, а функція `solve` дає коректний розв'язок задачі.
Вона повертає $-1$, якщо розв'язку немає, і повертає один із можливих розв'язків в іншому разі.

<CodeTabs>

```cpp
int powmod(int a, int b, int m) {
    int res = 1;
    while (b > 0) {
        if (b & 1) {
            res = (res * 1ll * a) % m;
        }
        a = (a * 1ll * a) % m;
        b >>= 1;
    }
    return res;
}

int solve(int a, int b, int m) {
    a %= m, b %= m;
    int n = sqrt(m) + 1;
    map<int, int> vals;
    for (int p = 1; p <= n; ++p)
        vals[powmod(a, p * n, m)] = p;
    for (int q = 0; q <= n; ++q) {
        int cur = (powmod(a, q, m) * 1ll * b) % m;
        if (vals.count(cur)) {
            int ans = vals[cur] * n - q;
            return ans;
        }
    }
    return -1;
}
```

```python
def powmod(a, b, m):
    res = 1
    while b > 0:
        if b & 1:
            res = res * a % m
        a = a * a % m
        b >>= 1
    return res


def solve(a, b, m):
    a %= m
    b %= m
    n = int(m ** 0.5) + 1
    vals = {}  # dict замінює map<int, int>
    for p in range(1, n + 1):
        vals[powmod(a, p * n, m)] = p
    for q in range(0, n + 1):
        cur = powmod(a, q, m) * b % m
        if cur in vals:
            return vals[cur] * n - q
    return -1
```

```typescript
// Множення йде за модулем m; для m до ~3*10^9 проміжок a*a може перевищити
// безпечне ціле number (2^53), тому використовуємо BigInt у powmod.
function powmod(a: number, b: number, m: number): number {
  let res = 1n;
  let base = BigInt(a) % BigInt(m);
  let e = b;
  const mod = BigInt(m);
  while (e > 0) {
    if (e & 1) {
      res = (res * base) % mod;
    }
    base = (base * base) % mod;
    e >>= 1;
  }
  return Number(res);
}

function solve(a: number, b: number, m: number): number {
  a %= m;
  b %= m;
  const n = Math.floor(Math.sqrt(m)) + 1;
  const vals = new Map<number, number>(); // Map замінює map<int, int>
  for (let p = 1; p <= n; ++p) {
    vals.set(powmod(a, p * n, m), p);
  }
  for (let q = 0; q <= n; ++q) {
    const cur = Number((BigInt(powmod(a, q, m)) * BigInt(b)) % BigInt(m));
    if (vals.has(cur)) {
      return vals.get(cur)! * n - q;
    }
  }
  return -1;
}
```

```go
func powmod(a, b, m int) int {
	res := 1
	a %= m
	for b > 0 {
		if b&1 == 1 {
			res = res * a % m
		}
		a = a * a % m
		b >>= 1
	}
	return res
}

func solve(a, b, m int) int {
	a %= m
	b %= m
	n := int(math.Sqrt(float64(m))) + 1
	vals := map[int]int{} // map замінює map<int, int>
	for p := 1; p <= n; p++ {
		vals[powmod(a, p*n, m)] = p
	}
	for q := 0; q <= n; q++ {
		cur := powmod(a, q, m) * b % m
		if p, ok := vals[cur]; ok {
			return p*n - q
		}
	}
	return -1
}
```

</CodeTabs>

У цьому коді ми використали `map` зі стандартної бібліотеки C++ для зберігання значень $f_1$.
Усередині `map` використовує червоно-чорне дерево для зберігання значень.
Тож цей код трохи повільніший, ніж якби ми використали масив і бінарний пошук, але його значно простіше написати.

Зауважте, що наш код припускає $0^0 = 1$, тобто код обчислить $0$ як розв'язок рівняння $0^x \equiv 1 \pmod m$, а також як розв'язок $0^x \equiv 0 \pmod 1$.
Це часто вживана угода в алгебрі, але вона не є загальноприйнятою в усіх галузях.
Іноді $0^0$ просто вважають невизначеним.
Якщо вам не подобається наша угода, тоді вам потрібно обробити випадок $a=0$ окремо:

<CodeTabs>

```cpp
    if (a == 0)
        return b == 0 ? 1 : -1;
```

```python
    if a == 0:
        return 1 if b == 0 else -1
```

```typescript
  if (a === 0) {
    return b === 0 ? 1 : -1;
  }
```

```go
	if a == 0 {
		if b == 0 {
			return 1
		}
		return -1
	}
```

</CodeTabs>

Ще одна річ, на яку варто звернути увагу: якщо є кілька аргументів $p$, що відображаються в одне й те саме значення $f_1$, ми зберігаємо лише один такий аргумент.
У цьому випадку це працює, бо ми хочемо повернути лише один можливий розв'язок.
Якщо ж нам потрібно повернути всі можливі розв'язки, ми маємо змінити `map<int, int>` на, скажімо, `map<int, vector<int>>`.
Також нам потрібно відповідно змінити другий крок.

## Покращена реалізація \{#improved-implementation}

Можливе покращення — позбутися бінарного піднесення до степеня.
Це можна зробити, тримаючи змінну, яку множимо на $a$ щоразу, коли збільшуємо $q$, і змінну, яку множимо на $a^n$ щоразу, коли збільшуємо $p$.
З цією зміною складність алгоритму залишається тією самою, але тепер множник $\log$ припадає лише на `map`.
Замість `map` ми можемо також використати хеш-таблицю (`unordered_map` у C++), яка має середню часову складність $O(1)$ для вставки та пошуку.

Задачі часто просять знайти мінімальне $x$, що задовольняє розв'язок.  
Можна отримати всі відповіді й узяти мінімум, або зменшити першу знайдену відповідь за допомогою [теореми Ейлера](phi-function.md#application), але ми можемо діяти розумніше з порядком, у якому обчислюємо значення, і гарантувати, що перша знайдена відповідь буде мінімальною.

<CodeTabs>

```cpp
// Повертає мінімальне x, для якого a ^ x % m = b % m, де a і m взаємно прості.
int solve(int a, int b, int m) {
    a %= m, b %= m;
    int n = sqrt(m) + 1;

    int an = 1;
    for (int i = 0; i < n; ++i)
        an = (an * 1ll * a) % m;

    unordered_map<int, int> vals;
    for (int q = 0, cur = b; q <= n; ++q) {
        vals[cur] = q;
        cur = (cur * 1ll * a) % m;
    }

    for (int p = 1, cur = 1; p <= n; ++p) {
        cur = (cur * 1ll * an) % m;
        if (vals.count(cur)) {
            int ans = n * p - vals[cur];
            return ans;
        }
    }
    return -1;
}
```

```python
# Повертає мінімальне x, для якого a ^ x % m = b % m, де a і m взаємно прості.
def solve(a, b, m):
    a %= m
    b %= m
    n = int(m ** 0.5) + 1

    an = 1
    for _ in range(n):
        an = an * a % m

    vals = {}  # dict замінює unordered_map<int, int>
    cur = b
    for q in range(0, n + 1):
        vals[cur] = q
        cur = cur * a % m

    cur = 1
    for p in range(1, n + 1):
        cur = cur * an % m
        if cur in vals:
            return n * p - vals[cur]
    return -1
```

```typescript
// Повертає мінімальне x, для якого a ^ x % m = b % m, де a і m взаємно прості.
// Множення за модулем виконуємо в BigInt, щоб уникнути переповнення number (2^53).
function solve(a: number, b: number, m: number): number {
  const mod = BigInt(m);
  a %= m;
  b %= m;
  const n = Math.floor(Math.sqrt(m)) + 1;

  let an = 1n;
  const aBig = BigInt(a);
  for (let i = 0; i < n; ++i) {
    an = (an * aBig) % mod;
  }

  const vals = new Map<number, number>(); // Map замінює unordered_map<int, int>
  let cur = BigInt(b);
  for (let q = 0; q <= n; ++q) {
    vals.set(Number(cur), q);
    cur = (cur * aBig) % mod;
  }

  cur = 1n;
  for (let p = 1; p <= n; ++p) {
    cur = (cur * an) % mod;
    const key = Number(cur);
    if (vals.has(key)) {
      return n * p - vals.get(key)!;
    }
  }
  return -1;
}
```

```go
// Повертає мінімальне x, для якого a ^ x % m = b % m, де a і m взаємно прості.
func solve(a, b, m int) int {
	a %= m
	b %= m
	n := int(math.Sqrt(float64(m))) + 1

	an := 1
	for i := 0; i < n; i++ {
		an = an * a % m
	}

	vals := map[int]int{} // map замінює unordered_map<int, int>
	cur := b
	for q := 0; q <= n; q++ {
		vals[cur] = q
		cur = cur * a % m
	}

	cur = 1
	for p := 1; p <= n; p++ {
		cur = cur * an % m
		if q, ok := vals[cur]; ok {
			return n*p - q
		}
	}
	return -1
}
```

</CodeTabs>

Складність дорівнює $O(\sqrt{m})$ при використанні `unordered_map`.

## Коли $a$ і $m$ не взаємно прості \{#data-toc-label}
Нехай $g = \gcd(a, m)$, і $g > 1$. Очевидно, $a^x \bmod m$ для кожного $x \ge 1$ буде ділитися на $g$.

Якщо $g \nmid b$, то розв'язку для $x$ немає.

Якщо $g \mid b$, нехай $a = g \alpha, b = g \beta, m = g \nu$.

$$
\begin{aligned}
a^x & \equiv b \mod m \\\
(g \alpha) a^{x - 1} & \equiv g \beta \mod g \nu \\\
\alpha a^{x-1} & \equiv \beta \mod \nu
\end{aligned}
$$

Алгоритм «крок немовляти — крок велетня» (BSGS) можна легко розширити, щоб розв'язувати $ka^{x} \equiv b \pmod m$ відносно $x$.

<CodeTabs>

```cpp
// Повертає мінімальне x, для якого a ^ x % m = b % m.
int solve(int a, int b, int m) {
    a %= m, b %= m;
    int k = 1, add = 0, g;
    while ((g = gcd(a, m)) > 1) {
        if (b == k)
            return add;
        if (b % g)
            return -1;
        b /= g, m /= g, ++add;
        k = (k * 1ll * a / g) % m;
    }

    int n = sqrt(m) + 1;
    int an = 1;
    for (int i = 0; i < n; ++i)
        an = (an * 1ll * a) % m;

    unordered_map<int, int> vals;
    for (int q = 0, cur = b; q <= n; ++q) {
        vals[cur] = q;
        cur = (cur * 1ll * a) % m;
    }

    for (int p = 1, cur = k; p <= n; ++p) {
        cur = (cur * 1ll * an) % m;
        if (vals.count(cur)) {
            int ans = n * p - vals[cur] + add;
            return ans;
        }
    }
    return -1;
}
```

```python
from math import gcd


# Повертає мінімальне x, для якого a ^ x % m = b % m.
def solve(a, b, m):
    a %= m
    b %= m
    k, add = 1, 0
    g = gcd(a, m)
    while g > 1:
        if b == k:
            return add
        if b % g:
            return -1
        b //= g
        m //= g
        add += 1
        k = k * (a // g) % m
        g = gcd(a, m)

    n = int(m ** 0.5) + 1
    an = 1
    for _ in range(n):
        an = an * a % m

    vals = {}  # dict замінює unordered_map<int, int>
    cur = b
    for q in range(0, n + 1):
        vals[cur] = q
        cur = cur * a % m

    cur = k
    for p in range(1, n + 1):
        cur = cur * an % m
        if cur in vals:
            return n * p - vals[cur] + add
    return -1
```

```typescript
function gcd(a: number, b: number): number {
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

// Повертає мінімальне x, для якого a ^ x % m = b % m.
// Множення за модулем виконуємо в BigInt, щоб уникнути переповнення number (2^53).
function solve(a: number, b: number, m: number): number {
  a %= m;
  b %= m;
  let k = 1;
  let add = 0;
  let g = gcd(a, m);
  while (g > 1) {
    if (b === k) {
      return add;
    }
    if (b % g) {
      return -1;
    }
    b = Math.floor(b / g);
    m = Math.floor(m / g);
    ++add;
    k = Number((BigInt(k) * BigInt(Math.floor(a / g))) % BigInt(m));
    g = gcd(a, m);
  }

  const mod = BigInt(m);
  const aBig = BigInt(a);
  const n = Math.floor(Math.sqrt(m)) + 1;
  let an = 1n;
  for (let i = 0; i < n; ++i) {
    an = (an * aBig) % mod;
  }

  const vals = new Map<number, number>(); // Map замінює unordered_map<int, int>
  let cur = BigInt(b);
  for (let q = 0; q <= n; ++q) {
    vals.set(Number(cur), q);
    cur = (cur * aBig) % mod;
  }

  cur = BigInt(k);
  for (let p = 1; p <= n; ++p) {
    cur = (cur * an) % mod;
    const key = Number(cur);
    if (vals.has(key)) {
      return n * p - vals.get(key)! + add;
    }
  }
  return -1;
}
```

```go
func gcd(a, b int) int {
	for b != 0 {
		a, b = b, a%b
	}
	return a
}

// Повертає мінімальне x, для якого a ^ x % m = b % m.
func solve(a, b, m int) int {
	a %= m
	b %= m
	k, add := 1, 0
	for g := gcd(a, m); g > 1; g = gcd(a, m) {
		if b == k {
			return add
		}
		if b%g != 0 {
			return -1
		}
		b /= g
		m /= g
		add++
		k = k * (a / g) % m
	}

	n := int(math.Sqrt(float64(m))) + 1
	an := 1
	for i := 0; i < n; i++ {
		an = an * a % m
	}

	vals := map[int]int{} // map замінює unordered_map<int, int>
	cur := b
	for q := 0; q <= n; q++ {
		vals[cur] = q
		cur = cur * a % m
	}

	cur = k
	for p := 1; p <= n; p++ {
		cur = cur * an % m
		if q, ok := vals[cur]; ok {
			return n*p - q + add
		}
	}
	return -1
}
```

</CodeTabs>

Часова складність залишається $O(\sqrt{m})$, як і раніше, оскільки початкове зведення до взаємно простих $a$ і $m$ виконується за $O(\log^2 m)$.

## Задачі для практики \{#practice-problems}
* [Spoj - Power Modulo Inverted](http://www.spoj.com/problems/MOD/)
* [Topcoder - SplittingFoxes3](https://community.topcoder.com/stat?c=problem_statement&pm=14386&rd=16801)
* [CodeChef - Inverse of a Function](https://www.codechef.com/problems/INVXOR/)
* [Hard Equation](https://codeforces.com/gym/101853/problem/G) (вважайте, що $0^0$ є невизначеним)
* [CodeChef - Chef and Modular Sequence](https://www.codechef.com/problems/CHEFMOD)

## Джерела \{#references}
* [Wikipedia - Baby-step giant-step](https://en.wikipedia.org/wiki/Baby-step_giant-step)
* [Answer by Zander on Mathematics StackExchange](https://math.stackexchange.com/a/133054)
