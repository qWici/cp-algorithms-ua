# Біноміальні коефіцієнти

Біноміальні коефіцієнти $\binom n k$ — це кількість способів вибрати множину з $k$ елементів серед $n$ різних елементів без урахування порядку розташування цих елементів (тобто кількість невпорядкованих множин).

Біноміальні коефіцієнти також є коефіцієнтами в розкладі $(a + b) ^ n$ (так звана біноміальна теорема):

$$
(a+b)^n = \binom n 0 a^n + \binom n 1 a^{n-1} b + \binom n 2 a^{n-2} b^2 + \cdots + \binom n k a^{n-k} b^k + \cdots + \binom n n b^n
$$

Вважають, що цю формулу, а також трикутник, який дозволяє ефективно обчислювати коефіцієнти, відкрив Блез Паскаль у XVII столітті. Проте вона була відома китайському математику Ян Хуею, який жив у XIII столітті. Можливо, її відкрив перський учений Омар Хайям. Більше того, індійський математик Пінгала, який жив раніше, у III ст. до н. е., отримав схожі результати. Заслуга Ньютона полягає в тому, що він узагальнив цю формулу на показники степеня, які не є натуральними.

:::tip[Коли підходить цей алгоритм?]
- Чи треба порахувати кількість способів вибрати $k$ об'єктів з $n$ *без урахування порядку* (підмножини, сполучення)?
- Чи відповідь — комбінаторний підрахунок за модулем простого числа, де потрібні факторіали й обернені елементи?
- Чи об'єкти однакові й розподіляються по «скриньках»? *(якщо так → [Зірки і смуги](stars_and_bars.md); а для підрахунку з обмеженнями-перетинами → [Принцип включення-виключення](inclusion-exclusion.md))*
:::

## Обчислення \{#calculation}

**Аналітична формула** для обчислення:

$$
\binom n k = \frac {n!} {k!(n-k)!}
$$

Цю формулу легко вивести із задачі про впорядковане розташування (кількість способів вибрати $k$ різних елементів серед $n$ різних елементів). Спочатку порахуймо кількість впорядкованих виборів $k$ елементів. Є $n$ способів вибрати перший елемент, $n-1$ спосіб вибрати другий елемент, $n-2$ способи вибрати третій елемент і так далі. У результаті отримуємо формулу для кількості впорядкованих розташувань: $n (n-1) (n-2) \cdots (n - k + 1) = \frac {n!} {(n-k)!}$. Ми легко переходимо до невпорядкованих розташувань, помітивши, що кожному невпорядкованому розташуванню відповідає рівно $k!$ впорядкованих ($k!$ — це кількість можливих перестановок $k$ елементів). Остаточну формулу отримуємо, поділивши $\frac {n!} {(n-k)!}$ на $k!$.

**Рекурентна формула** (яка пов'язана зі знаменитим «трикутником Паскаля»):

$$
\binom n k = \binom {n-1} {k-1} + \binom {n-1} k
$$

Її легко вивести за допомогою аналітичної формули.

Зауважимо, що для $n \lt k$ значення $\binom n k$ вважається рівним нулю.

## Властивості \{#properties}

Біноміальні коефіцієнти мають багато різних властивостей. Ось найпростіші з них:

*   Правило симетрії:

    $$
    \binom n k = \binom n {n-k}
    $$

*   Винесення множника:

    $$
    \binom n k = \frac n k \binom {n-1} {k-1}
    $$

*   Сума за $k$:

    $$
    \sum_{k = 0}^n \binom n k = 2 ^ n
    $$

*   Сума за $n$:

    $$
    \sum_{m = 0}^n \binom m k = \binom {n + 1} {k + 1}
    $$

*   Сума за $n$ і $k$:

    $$
    \sum_{k = 0}^m  \binom {n + k} k = \binom {n + m + 1} m
    $$

*   Сума квадратів:

    $$
    {\binom n 0}^2 + {\binom n 1}^2 + \cdots + {\binom n n}^2 = \binom {2n} n
    $$

*   Зважена сума:

    $$
    1 \binom n 1 + 2 \binom n 2 + \cdots + n \binom n n = n 2^{n-1}
    $$

*   Зв'язок із [числами Фібоначчі](../algebra/fibonacci-numbers.md):

    $$
    \binom n 0 + \binom {n-1} 1 + \cdots + \binom {n-k} k + \cdots + \binom 0 n = F_{n+1}
    $$

## Обчислення \{#calculation-1}

### Пряме обчислення за аналітичною формулою \{#straightforward-calculation-using-analytical-formula}

Першу, пряму формулу дуже легко закодувати, але цей метод, найімовірніше, призведе до переповнення навіть для відносно невеликих значень $n$ і $k$ (навіть якщо відповідь повністю вміщується в якийсь тип даних, обчислення проміжних факторіалів може спричинити переповнення). Тому цей метод часто можна застосовувати лише з [довгою арифметикою](../algebra/big-integer.md):

<CodeTabs>

```cpp
int C(int n, int k) {
    int res = 1;
    for (int i = n - k + 1; i <= n; ++i)
        res *= i;
    for (int i = 2; i <= k; ++i)
        res /= i;
    return res;
}
```

```python
def C(n: int, k: int) -> int:
    # У стандартній бібліотеці є math.comb(n, k); тут відтворюємо алгоритм.
    res = 1
    for i in range(n - k + 1, n + 1):
        res *= i
    for i in range(2, k + 1):
        res //= i  # цілочислове ділення — проміжний результат завжди ділиться націло
    return res
```

```typescript
// Python-цілі необмежені, тож для відповідності використовуємо BigInt,
// бо проміжні факторіали швидко переповнюють number.
function C(n: bigint, k: bigint): bigint {
  let res = 1n;
  for (let i = n - k + 1n; i <= n; i++) res *= i;
  for (let i = 2n; i <= k; i++) res /= i;
  return res;
}
```

```go
func C(n, k int64) int64 {
	var res int64 = 1
	for i := n - k + 1; i <= n; i++ {
		res *= i
	}
	for i := int64(2); i <= k; i++ {
		res /= i
	}
	return res
}
```

</CodeTabs>

### Покращена реалізація \{#improved-implementation}

Зауважимо, що в наведеній вище реалізації чисельник і знаменник мають однакову кількість множників ($k$), кожен з яких більший або рівний 1. Тому ми можемо замінити наш дріб на добуток $k$ дробів, кожен з яких є дійсним числом. Проте на кожному кроці після множення поточної відповіді на кожен з наступних дробів відповідь усе одно залишатиметься цілою (це випливає з властивості винесення множника).

Реалізація на C++:

<CodeTabs>

```cpp
int C(int n, int k) {
    double res = 1;
    for (int i = 1; i <= k; ++i)
        res = res * (n - k + i) / i;
    return (int)(res + 0.01);
}
```

```python
def C(n: int, k: int) -> int:
    res = 1.0
    for i in range(1, k + 1):
        res = res * (n - k + i) / i
    # Додаємо 0.01 для компенсації накопиченої похибки чисел з рухомою комою.
    return int(res + 0.01)
```

```typescript
function C(n: number, k: number): number {
  let res = 1;
  for (let i = 1; i <= k; i++) res = (res * (n - k + i)) / i;
  // 0.01 компенсує накопичену похибку чисел з рухомою комою.
  return Math.trunc(res + 0.01);
}
```

```go
func C(n, k int) int {
	res := 1.0
	for i := 1; i <= k; i++ {
		res = res * float64(n-k+i) / float64(i)
	}
	// 0.01 компенсує накопичену похибку чисел з рухомою комою.
	return int(res + 0.01)
}
```

</CodeTabs>

Тут ми обережно зводимо число з рухомою комою до цілого, враховуючи, що через накопичені похибки воно може бути трохи меншим за справжнє значення (наприклад, $2.99999$ замість $3$).

### Трикутник Паскаля \{#pascals-triangle}

Використовуючи рекурентне співвідношення, ми можемо побудувати таблицю біноміальних коефіцієнтів (трикутник Паскаля) і брати результат із неї. Перевага цього методу в тому, що проміжні результати ніколи не перевищують відповідь, а обчислення кожного нового елемента таблиці потребує лише одного додавання. Недолік — повільне виконання для великих $n$ і $k$, якщо вам потрібне лише одне значення, а не вся таблиця (адже щоб обчислити $\binom n k$, вам доведеться побудувати таблицю всіх $\binom i j, 1 \le i \le n, 1 \le j \le n$, або принаймні до $1 \le j \le \min (i, 2k)$). Часову складність можна вважати рівною $\mathcal{O}(n^2)$.

Реалізація на C++:

<CodeTabs>

```cpp
const int maxn = ...;
int C[maxn + 1][maxn + 1];
C[0][0] = 1;
for (int n = 1; n <= maxn; ++n) {
    C[n][0] = C[n][n] = 1;
    for (int k = 1; k < n; ++k)
        C[n][k] = C[n - 1][k - 1] + C[n - 1][k];
}
```

```python
maxn = ...
C = [[0] * (maxn + 1) for _ in range(maxn + 1)]
C[0][0] = 1
for n in range(1, maxn + 1):
    C[n][0] = C[n][n] = 1
    for k in range(1, n):
        C[n][k] = C[n - 1][k - 1] + C[n - 1][k]
```

```typescript
const maxn = /* ... */ 0;
const C: bigint[][] = Array.from({ length: maxn + 1 }, () =>
  new Array<bigint>(maxn + 1).fill(0n)
);
C[0][0] = 1n;
for (let n = 1; n <= maxn; n++) {
  C[n][0] = C[n][n] = 1n;
  for (let k = 1; k < n; k++) C[n][k] = C[n - 1][k - 1] + C[n - 1][k];
}
```

```go
const maxn = ... // ...
var C [maxn + 1][maxn + 1]int64
C[0][0] = 1
for n := 1; n <= maxn; n++ {
	C[n][0], C[n][n] = 1, 1
	for k := 1; k < n; k++ {
		C[n][k] = C[n-1][k-1] + C[n-1][k]
	}
}
```

</CodeTabs>

Якщо вся таблиця значень не потрібна, достатньо зберігати лише два її останні рядки (поточний $n$-й рядок і попередній $n-1$-й).

### Обчислення за $O(1)$ \{#data-toc-label}

Нарешті, у деяких ситуаціях вигідно заздалегідь обчислити всі факторіали, щоб згодом отримувати будь-який потрібний біноміальний коефіцієнт лише двома діленнями. Це може бути корисним під час використання [довгої арифметики](../algebra/big-integer.md), коли пам'ять не дозволяє попередньо обчислити весь трикутник Паскаля.


## Обчислення біноміальних коефіцієнтів за модулем $m$ \{#data-toc-label-1}

Доволі часто трапляється задача обчислення біноміальних коефіцієнтів за деяким модулем $m$.

### Біноміальний коефіцієнт для малих $n$ \{#data-toc-label-2}

Раніше розглянутий підхід із трикутником Паскаля можна застосувати для обчислення всіх значень $\binom{n}{k} \bmod m$ для досить малих $n$, оскільки він потребує часової складності $\mathcal{O}(n^2)$. Цей підхід працює з будь-яким модулем, бо використовуються лише операції додавання.


### Біноміальний коефіцієнт за великим простим модулем \{#binomial-coefficient-modulo-large-prime}

Формула для біноміальних коефіцієнтів така:

$$
\binom n k = \frac {n!} {k!(n-k)!},
$$

тож якщо ми хочемо обчислити її за деяким простим модулем $m > n$, то отримуємо

$$
\binom n k \equiv n! \cdot (k!)^{-1} \cdot ((n-k)!)^{-1} \mod m.
$$

Спершу ми попередньо обчислюємо всі факторіали за модулем $m$ аж до $\text{MAXN}!$ за час $O(\text{MAXN})$.

<CodeTabs>

```cpp
factorial[0] = 1;
for (int i = 1; i <= MAXN; i++) {
    factorial[i] = factorial[i - 1] * i % m;
}
```

```python
factorial = [0] * (MAXN + 1)
factorial[0] = 1
for i in range(1, MAXN + 1):
    factorial[i] = factorial[i - 1] * i % m
```

```typescript
const factorial: bigint[] = new Array<bigint>(MAXN + 1).fill(0n);
factorial[0] = 1n;
for (let i = 1; i <= MAXN; i++) {
  factorial[i] = (factorial[i - 1] * BigInt(i)) % m;
}
```

```go
factorial := make([]int64, MAXN+1)
factorial[0] = 1
for i := int64(1); i <= MAXN; i++ {
	factorial[i] = factorial[i-1] * i % m
}
```

</CodeTabs>

А потім ми можемо обчислити біноміальний коефіцієнт за час $O(\log m)$.

<CodeTabs>

```cpp
long long binomial_coefficient(int n, int k) {
    return factorial[n] * inverse(factorial[k] * factorial[n - k] % m) % m;
}
```

```python
def binomial_coefficient(n: int, k: int) -> int:
    return factorial[n] * inverse(factorial[k] * factorial[n - k] % m) % m
```

```typescript
function binomial_coefficient(n: number, k: number): bigint {
  return (
    (factorial[n] * inverse((factorial[k] * factorial[n - k]) % m)) % m
  );
}
```

```go
func binomial_coefficient(n, k int) int64 {
	return factorial[n] * inverse(factorial[k]*factorial[n-k]%m) % m
}
```

</CodeTabs>

Ми навіть можемо обчислити біноміальний коефіцієнт за час $O(1)$, якщо попередньо обчислимо обернені елементи всіх факторіалів за $O(\text{MAXN} \log m)$ звичайним методом обчислення оберненого елемента, або навіть за час $O(\text{MAXN})$, використовуючи конгруенцію $(x!)^{-1} \equiv ((x-1)!)^{-1} \cdot x^{-1}$ та метод [обчислення всіх обернених елементів](../algebra/module-inverse.md#mod-inv-all-num) за $O(n)$.

<CodeTabs>

```cpp
long long binomial_coefficient(int n, int k) {
    return factorial[n] * inverse_factorial[k] % m * inverse_factorial[n - k] % m;
}
```

```python
def binomial_coefficient(n: int, k: int) -> int:
    return factorial[n] * inverse_factorial[k] % m * inverse_factorial[n - k] % m
```

```typescript
function binomial_coefficient(n: number, k: number): bigint {
  return (
    (((factorial[n] * inverse_factorial[k]) % m) * inverse_factorial[n - k]) % m
  );
}
```

```go
func binomial_coefficient(n, k int) int64 {
	return factorial[n] * inverse_factorial[k] % m * inverse_factorial[n-k] % m
}
```

</CodeTabs>

### Біноміальний коефіцієнт за модулем степеня простого числа \{#mod-prime-pow}

Тут ми хочемо обчислити біноміальний коефіцієнт за модулем деякого степеня простого числа, тобто $m = p^b$ для деякого простого $p$.
Якщо $p > \max(k, n-k)$, то ми можемо застосувати той самий метод, що описаний у попередньому розділі.
Але якщо $p \le \max(k, n-k)$, то принаймні один з факторіалів $k!$ і $(n-k)!$ не є взаємно простим з $m$, а тому ми не можемо обчислити обернені елементи — вони не існують.
Проте біноміальний коефіцієнт ми обчислити можемо.

Ідея така:
Для кожного $x!$ ми обчислюємо найбільший показник степеня $c$ такий, що $p^c$ ділить $x!$, тобто $p^c ~|~ x!$.
Нехай $c(x)$ — це число.
І нехай $g(x) := \frac{x!}{p^{c(x)}}$.
Тоді ми можемо записати біноміальний коефіцієнт так:

$$
\binom n k = \frac {g(n) p^{c(n)}} {g(k) p^{c(k)} g(n-k) p^{c(n-k)}} = \frac {g(n)} {g(k) g(n-k)}p^{c(n) - c(k) - c(n-k)}
$$

Цікаво те, що $g(x)$ тепер вільне від простого дільника $p$.
Тому $g(x)$ взаємно просте з m, і ми можемо обчислити обернені елементи за модулем для $g(k)$ та $g(n-k)$.

Після попереднього обчислення всіх значень для $g$ і $c$, що можна зробити ефективно за допомогою динамічного програмування за $\mathcal{O}(n)$, ми можемо обчислити біноміальний коефіцієнт за час $O(\log m)$.
Або попередньо обчислити всі обернені елементи та всі степені $p$, і тоді обчислювати біноміальний коефіцієнт за $O(1)$.

Зауважимо: якщо $c(n) - c(k) - c(n-k) \ge b$, то $p^b ~|~ p^{c(n) - c(k) - c(n-k)}$, і біноміальний коефіцієнт дорівнює $0$.

### Біноміальний коефіцієнт за довільним модулем \{#binomial-coefficient-modulo-an-arbitrary-number}

Тепер обчислимо біноміальний коефіцієнт за деяким довільним модулем $m$.

Нехай розклад на прості множники числа $m$ має вигляд $m = p_1^{e_1} p_2^{e_2} \cdots p_h^{e_h}$.
Ми можемо обчислити біноміальний коефіцієнт за модулем $p_i^{e_i}$ для кожного $i$.
Це дає нам $h$ різних конгруенцій.
Оскільки всі модулі $p_i^{e_i}$ взаємно прості, ми можемо застосувати [китайську теорему про остачі](../algebra/chinese-remainder-theorem.md), щоб обчислити біноміальний коефіцієнт за модулем добутку модулів, що і є шуканим біноміальним коефіцієнтом за модулем $m$.

### Біноміальний коефіцієнт для великих $n$ та малого модуля \{#data-toc-label-3}

Коли $n$ занадто велике, розглянуті вище алгоритми зі складністю $\mathcal{O}(n)$ стають непрактичними. Проте якщо модуль $m$ малий, усе одно є способи обчислити $\binom{n}{k} \bmod m$.

Коли модуль $m$ простий, є 2 варіанти:

* Можна застосувати [теорему Люка](https://en.wikipedia.org/wiki/Lucas's_theorem), яка розбиває задачу обчислення $\binom{n}{k} \bmod m$ на $\log_m n$ задач вигляду $\binom{x_i}{y_i} \bmod m$, де $x_i, y_i < m$. Якщо кожен зведений коефіцієнт обчислювати за допомогою попередньо обчислених факторіалів та обернених факторіалів, складність становить $\mathcal{O}(m + \log_m n)$.
* Можна використати метод обчислення [факторіала за модулем P](../algebra/factorial-modulo.md), щоб отримати потрібні значення $g$ і $c$ та використати їх, як описано в розділі про [модуль — степінь простого числа](#mod-prime-pow). Це займає $\mathcal{O}(m \log_m n)$.

Коли $m$ не просте, але вільне від квадратів, можна отримати прості множники $m$, обчислити коефіцієнт за модулем кожного простого множника одним із наведених вище методів, а загальну відповідь отримати за китайською теоремою про остачі.

Коли $m$ не вільне від квадратів, замість теореми Люка можна застосувати [узагальнення теореми Люка для степенів простих чисел](https://web.archive.org/web/20170202003812/http://www.dms.umontreal.ca/~andrew/PDF/BinCoeff.pdf).


## Задачі для практики \{#practice-problems}
* [Codechef - Number of ways](https://www.codechef.com/LTIME24/problems/NWAYS/)
* [Codeforces - Curious Array](http://codeforces.com/problemset/problem/407/C)
* [LightOj - Necklaces](http://www.lightoj.com/volume_showproblem.php?problem=1419)
* [HACKEREARTH: Binomial Coefficient](https://www.hackerearth.com/problem/algorithm/binomial-coefficient-1/description/)
* [SPOJ - Ada and Teams](http://www.spoj.com/problems/ADATEAMS/)
* [SPOJ - Greedy Walking](http://www.spoj.com/problems/UCV2013E/)
* [UVa 13214 - The Robot's Grid](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=5137)
* [SPOJ - Good Predictions](http://www.spoj.com/problems/GOODB/)
* [SPOJ - Card Game](http://www.spoj.com/problems/HC12/)
* [SPOJ - Topper Rama Rao](http://www.spoj.com/problems/HLP_RAMS/)
* [UVa 13184 - Counting Edges and Graphs](https://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=5095)
* [Codeforces - Anton and School 2](http://codeforces.com/contest/785/problem/D)
* [Codeforces - Bacterial Melee](http://codeforces.com/contest/760/problem/F)
* [Codeforces - Points, Lines and Ready-made Titles](http://codeforces.com/contest/872/problem/E)
* [SPOJ - The Ultimate Riddle](https://www.spoj.com/problems/DCEPC13D/)
* [CodeChef - Long Sandwich](https://www.codechef.com/MAY17/problems/SANDWICH/)
* [Codeforces - Placing Jinas](https://codeforces.com/problemset/problem/1696/E)

## References \{#references}
* [Blog fishi.devtail.io](https://fishi.devtail.io/weblog/2015/06/25/computing-large-binomial-coefficients-modulo-prime-non-prime/)
* [Question on Mathematics StackExchange](https://math.stackexchange.com/questions/95491/n-choose-k-bmod-m-using-chinese-remainder-theorem)
* [Question on CodeChef Discuss](https://discuss.codechef.com/questions/98129/your-approach-to-solve-sandwich)

## Відеоматеріали \{#video}

<YouTubeEmbed id="EKN51vLKves" title="How To Evaluate Binomial Coefficients — The Organic Chemistry Tutor" />
