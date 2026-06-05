# Обернений елемент за модулем

## Означення \{#definition}

[Обернений елемент за модулем](http://en.wikipedia.org/wiki/Modular_multiplicative_inverse) для цілого числа $a$ — це таке ціле число $x$, що $a \cdot x$ конгруентне $1$ за деяким модулем $m$.
Формально: ми хочемо знайти таке ціле число $x$, що

$$
a \cdot x \equiv 1 \mod m.
$$

Ми також будемо позначати $x$ просто як $a^{-1}$.

Зауважимо, що обернений елемент за модулем існує не завжди. Наприклад, нехай $m = 4$, $a = 2$.
Перебравши всі можливі значення за модулем $m$, легко переконатися, що ми не можемо знайти $a^{-1}$, яке задовольняє наведене рівняння.
Можна довести, що обернений елемент за модулем існує тоді й лише тоді, коли $a$ та $m$ взаємно прості (тобто $\gcd(a, m) = 1$).

У цій статті ми наведемо два методи знаходження оберненого елемента за модулем у випадку, коли він існує, і один метод знаходження оберненого елемента для всіх чисел за лінійний час.

## Знаходження оберненого елемента за модулем за допомогою розширеного алгоритму Евкліда \{#finding-the-modular-inverse-using-extended-euclidean-algorithm}

Розглянемо таке рівняння (з невідомими $x$ та $y$):

$$
a \cdot x + m \cdot y = 1
$$

Це [лінійне діофантове рівняння з двома змінними](linear-diophantine-equation.md).
Як показано у статті за посиланням, коли $\gcd(a, m) = 1$, рівняння має розв'язок, який можна знайти за допомогою [розширеного алгоритму Евкліда](extended-euclid-algorithm.md).
Зауважимо, що $\gcd(a, m) = 1$ — це також умова існування оберненого елемента за модулем.

Тепер, якщо взяти обидві частини за модулем $m$, ми можемо позбутися $m \cdot y$, і рівняння набуває вигляду:

$$
a \cdot x \equiv 1 \mod m
$$

Отже, оберненим елементом для $a$ є $x$.

Реалізація виглядає так:

<CodeTabs>

```cpp
int x, y;
int g = extended_euclidean(a, m, x, y);
if (g != 1) {
    cout << "No solution!";
}
else {
    x = (x % m + m) % m;
    cout << x << endl;
}
```

```python
# extended_euclidean повертає (g, x, y) таке, що a*x + m*y = g
g, x, y = extended_euclidean(a, m)
if g != 1:
    print("Немає розв'язку!")
else:
    # x може бути від'ємним, тому зводимо у діапазон [0, m)
    x = (x % m + m) % m
    print(x)
    # Підказка: у Python є вбудований обернений елемент: pow(a, -1, m)
```

```typescript
// для модульної арифметики з множенням використовуємо bigint
// extendedEuclidean повертає [g, x, y] таке, що a*x + m*y = g
const [g, x, y] = extendedEuclidean(a, m);
if (g !== 1n) {
  console.log("Немає розв'язку!");
} else {
  // x може бути від'ємним, тому зводимо у діапазон [0, m)
  const inv = ((x % m) + m) % m;
  console.log(inv.toString());
}
```

```go
// extendedEuclidean повертає (g, x, y) таке, що a*x + m*y = g
g, x, _ := extendedEuclidean(a, m)
if g != 1 {
	fmt.Println("Немає розв'язку!")
} else {
	// x може бути від'ємним, тому зводимо у діапазон [0, m)
	x = (x%m + m) % m
	fmt.Println(x)
}
```

</CodeTabs>

Зверніть увагу на те, як ми змінюємо `x`.
Отримане з розширеного алгоритму Евкліда значення `x` може бути від'ємним, тому `x % m` також може бути від'ємним, і нам спочатку доводиться додати `m`, щоб зробити його додатним.

## Знаходження оберненого елемента за модулем за допомогою бінарного піднесення до степеня \{#fermat-euler}

Інший метод знаходження оберненого елемента за модулем — використати теорему Ейлера, яка стверджує, що наступна конгруенція виконується, якщо $a$ та $m$ взаємно прості:

$$
a^{\phi (m)} \equiv 1 \mod m
$$

$\phi$ — це [функція Ейлера](phi-function.md).
Знову ж таки, зауважимо, що взаємна простота $a$ та $m$ була також умовою існування оберненого елемента за модулем.

Якщо $m$ — просте число, це спрощується до [малої теореми Ферма](http://en.wikipedia.org/wiki/Fermat's_little_theorem):

$$
a^{m - 1} \equiv 1 \mod m
$$

Помножимо обидві частини наведених рівнянь на $a^{-1}$, і отримаємо:

* Для довільного (але взаємно простого) модуля $m$: $a ^ {\phi (m) - 1} \equiv a ^{-1} \mod m$
* Для простого модуля $m$: $a ^ {m - 2} \equiv a ^ {-1} \mod m$

З цих результатів ми можемо легко знайти обернений елемент за модулем за допомогою [алгоритму бінарного піднесення до степеня](binary-exp.md), який працює за час $O(\log m)$.

Хоча цей метод простіший для розуміння, ніж метод, описаний у попередньому абзаці, у випадку, коли $m$ не є простим числом, нам потрібно обчислити функцію Ейлера $\phi$, що передбачає факторизацію $m$, яка може бути дуже складною. Якщо розклад $m$ на прості множники відомий, то складність цього методу становить $O(\log m)$.

## Знаходження оберненого елемента за модулем для простих модулів за допомогою ділення з остачею \{#finding-the-modular-inverse-using-euclidean-division}

Нехай дано простий модуль $m > a$ (або ми можемо застосувати модуль, щоб зменшити число за один крок); згідно з [діленням з остачею](https://en.wikipedia.org/wiki/Euclidean_division)

$$
m = k \cdot a + r
$$

де $k = \left\lfloor \frac{m}{a} \right\rfloor$ та $r = m \bmod a$, тоді

$$
\begin{align*}
& \implies & 0          & \equiv k \cdot a + r   & \mod m \\
& \iff & r              & \equiv -k \cdot a      & \mod m \\
& \iff & r \cdot a^{-1} & \equiv -k              & \mod m \\
& \iff & a^{-1}         & \equiv -k \cdot r^{-1} & \mod m
\end{align*}
$$

Зауважимо, що це міркування не виконується, якщо $m$ не є простим, оскільки існування $a^{-1}$ у загальному випадку не означає існування $r^{-1}$.
Щоб це побачити, спробуймо обчислити $5^{-1}$ за модулем $12$ за наведеною формулою. Ми хотіли б отримати $5$,
оскільки $5 \cdot 5 \equiv 1 \bmod 12$. Однак $12 = 2 \cdot 5 + 2$, і ми маємо $k=2$ та $r=2$, причому $2$ не є оборотним за модулем $12$.

Проте якщо модуль простий, то всі $a$ з $0 < a < m$ є оборотними за модулем $m$, і ми можемо записати таку рекурсивну функцію для обчислення оберненого елемента за модулем для числа $a$ відносно $m$

<CodeTabs>

```cpp
int inv(int a) {
  return a <= 1 ? a : m - (long long)(m/a) * inv(m % a) % m;
}
```

```python
# m — простий модуль; обернений елемент для a у діапазоні [1, m)
def inv(a: int) -> int:
    return a if a <= 1 else m - (m // a) * inv(m % a) % m
    # Підказка: у Python той самий результат дає pow(a, -1, m)
```

```typescript
// для модульної арифметики з множенням використовуємо bigint
// m — простий модуль; обернений елемент для a у діапазоні [1, m)
function inv(a: bigint): bigint {
  return a <= 1n ? a : m - ((m / a) * inv(m % a)) % m;
}
```

```go
// m — простий модуль; обернений елемент для a у діапазоні [1, m)
func inv(a int64) int64 {
	if a <= 1 {
		return a
	}
	return m - (m/a)*inv(m%a)%m
}
```

</CodeTabs>

Точна часова складність цієї рекурсії невідома. Вона десь між $O(\frac{\log m}{\log\log m})$ та $O(m^{\frac{1}{3} - \frac{2}{177} + \epsilon})$.
Див. [On the length of Pierce expansions](https://arxiv.org/abs/2211.08374).
На практиці ця реалізація швидка, наприклад, для модуля $10^9 + 7$ вона завжди завершиться менш ніж за 50 ітерацій.

### Обернений елемент для кожного числа за модулем $m$ \{#mod-inv-all-num}

Застосувавши цю формулу, ми також можемо попередньо обчислити обернений елемент за модулем для кожного числа з діапазону $[1, m-1]$ за $O(m)$.

<CodeTabs>

```cpp
inv[1] = 1;
for(int a = 2; a < m; ++a)
    inv[a] = m - (long long)(m/a) * inv[m%a] % m;
```

```python
# inv[a] — обернений елемент для a за простим модулем m, для всіх a з [1, m)
inv = [0] * m
inv[1] = 1
for a in range(2, m):
    inv[a] = m - (m // a) * inv[m % a] % m
```

```typescript
// для модульної арифметики з множенням використовуємо bigint
// inv[a] — обернений елемент для a за простим модулем m, для всіх a з [1, m)
const inv: bigint[] = new Array(Number(m)).fill(0n);
inv[1] = 1n;
for (let a = 2n; a < m; a++) {
  inv[Number(a)] = m - ((m / a) * inv[Number(m % a)]) % m;
}
```

```go
// inv[a] — обернений елемент для a за простим модулем m, для всіх a з [1, m)
inv := make([]int64, m)
inv[1] = 1
for a := int64(2); a < m; a++ {
	inv[a] = m - (m/a)*inv[m%a]%m
}
```

</CodeTabs>

## Знаходження оберненого елемента за модулем $m$ для масиву чисел \{#finding-the-modular-inverse-for-array-of-numbers-modulo-m}

Припустимо, нам дано масив, і ми хочемо знайти обернений елемент за модулем для всіх чисел у ньому (усі вони оборотні).
Замість того щоб обчислювати обернений елемент для кожного числа, ми можемо розширити дріб префіксним добутком (не включаючи саме число) та суфіксним добутком (не включаючи саме число), і в результаті обчислити лише один обернений елемент.

$$
\begin{align}
x_i^{-1} &= \frac{1}{x_i} = \frac{\overbrace{x_1 \cdot x_2 \cdots x_{i-1}}^{\text{prefix}_{i-1}} \cdot ~1~ \cdot \overbrace{x_{i+1} \cdot x_{i+2} \cdots x_n}^{\text{suffix}_{i+1}}}{x_1 \cdot x_2 \cdots x_{i-1} \cdot x_i \cdot x_{i+1} \cdot x_{i+2} \cdots x_n} \\
&= \text{prefix}_{i-1} \cdot \text{suffix}_{i+1} \cdot \left(x_1 \cdot x_2 \cdots x_n\right)^{-1}
\end{align}
$$

У коді ми можемо просто побудувати масив префіксних добутків (не включаючи саме число, починаючи з нейтрального елемента), обчислити обернений елемент за модулем для добутку всіх чисел, а потім помножити його на префіксний та суфіксний добутки (не включаючи саме число).
Суфіксний добуток обчислюється ітеруванням з кінця до початку.

<CodeTabs>

```cpp
std::vector<int> invs(const std::vector<int> &a, int m) {
    int n = a.size();
    if (n == 0) return {};
    std::vector<int> b(n);
    int v = 1;
    for (int i = 0; i != n; ++i) {
        b[i] = v;
        v = static_cast<long long>(v) * a[i] % m;
    }
    int x, y;
    extended_euclidean(v, m, x, y);
    x = (x % m + m) % m;
    for (int i = n - 1; i >= 0; --i) {
        b[i] = static_cast<long long>(x) * b[i] % m;
        x = static_cast<long long>(x) * a[i] % m;
    }
    return b;
}
```

```python
def invs(a: list[int], m: int) -> list[int]:
    n = len(a)
    if n == 0:
        return []
    b = [0] * n
    # b[i] = префіксний добуток a[0..i-1]
    v = 1
    for i in range(n):
        b[i] = v
        v = v * a[i] % m
    # обернений елемент для добутку всіх чисел (можна й x = pow(v, -1, m))
    g, x, _ = extended_euclidean(v, m)
    x = (x % m + m) % m
    # ідемо з кінця, домножуючи на суфіксний добуток
    for i in range(n - 1, -1, -1):
        b[i] = x * b[i] % m
        x = x * a[i] % m
    return b
```

```typescript
// для модульної арифметики з множенням використовуємо bigint
function invs(a: bigint[], m: bigint): bigint[] {
  const n = a.length;
  if (n === 0) return [];
  const b: bigint[] = new Array(n).fill(0n);
  // b[i] = префіксний добуток a[0..i-1]
  let v = 1n;
  for (let i = 0; i < n; i++) {
    b[i] = v;
    v = (v * a[i]) % m;
  }
  // обернений елемент для добутку всіх чисел
  const [, gx] = extendedEuclidean(v, m);
  let x = ((gx % m) + m) % m;
  // ідемо з кінця, домножуючи на суфіксний добуток
  for (let i = n - 1; i >= 0; i--) {
    b[i] = (x * b[i]) % m;
    x = (x * a[i]) % m;
  }
  return b;
}
```

```go
func invs(a []int64, m int64) []int64 {
	n := len(a)
	if n == 0 {
		return []int64{}
	}
	b := make([]int64, n)
	// b[i] = префіксний добуток a[0..i-1]
	var v int64 = 1
	for i := 0; i < n; i++ {
		b[i] = v
		v = v * a[i] % m
	}
	// обернений елемент для добутку всіх чисел
	_, x, _ := extendedEuclidean(v, m)
	x = (x%m + m) % m
	// ідемо з кінця, домножуючи на суфіксний добуток
	for i := n - 1; i >= 0; i-- {
		b[i] = x * b[i] % m
		x = x * a[i] % m
	}
	return b
}
```

</CodeTabs>

## Задачі для практики \{#practice-problems}

* [UVa 11904 - One Unit Machine](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=3055)
* [Hackerrank - Longest Increasing Subsequence Arrays](https://www.hackerrank.com/contests/world-codesprint-5/challenges/longest-increasing-subsequence-arrays)
* [Codeforces 300C - Beautiful Numbers](http://codeforces.com/problemset/problem/300/C)
* [Codeforces 622F - The Sum of the k-th Powers](http://codeforces.com/problemset/problem/622/F)
* [Codeforces 717A - Festival Organization](http://codeforces.com/problemset/problem/717/A)
* [Codeforces 896D - Nephren Runs a Cinema](http://codeforces.com/problemset/problem/896/D)

## Відеоматеріали \{#video}

<YouTubeEmbed id="YwaQ4m1eHQo" title="Multiplicative Inverse — Neso Academy" />
