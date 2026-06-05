# Числа Фібоначчі

Послідовність Фібоначчі означається так:

$$
F_0 = 0, F_1 = 1, F_n = F_{n-1} + F_{n-2}
$$

Перші елементи послідовності ([OEIS A000045](http://oeis.org/A000045)):

$$
0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, ...
$$

## Властивості \{#properties}

Числа Фібоначчі мають багато цікавих властивостей. Наведемо кілька з них:

* Тотожність Кассіні:
  
$$
F_{n-1} F_{n+1} - F_n^2 = (-1)^n
$$

>Це можна довести за індукцією. Однорядкове доведення Кнута випливає зі взяття визначника матричної форми 2x2, наведеної нижче.

* Правило «додавання»:
  
$$
F_{n+k} = F_k F_{n+1} + F_{k-1} F_n
$$

* Застосувавши попередню тотожність до випадку $k = n$, отримуємо:
  
$$
F_{2n} = F_n (F_{n+1} + F_{n-1})
$$

* Звідси за індукцією можна довести, що для будь-якого додатного цілого $k$ число $F_{nk}$ кратне $F_n$.

* Обернене також справедливе: якщо $F_m$ кратне $F_n$, то $m$ кратне $n$.

* Тотожність для НСД:
  
$$
GCD(F_m, F_n) = F_{GCD(m, n)}
$$

* Числа Фібоначчі є найгіршими можливими вхідними даними для алгоритму Евкліда (див. теорему Ламе в статті [Алгоритм Евкліда](euclid-algorithm.md))

## Кодування Фібоначчі \{#fibonacci-coding}

Цю послідовність можна використати, щоб кодувати додатні цілі числа в двійкові кодові слова. Згідно з теоремою Цекендорфа, будь-яке натуральне число $n$ можна єдиним чином подати як суму чисел Фібоначчі:

$$
N = F_{k_1} + F_{k_2} + \ldots + F_{k_r}
$$

де $k_1 \ge k_2 + 2,\ k_2 \ge k_3 + 2,\  \ldots,\  k_r \ge 2$ (тобто в поданні не можна використовувати два послідовні числа Фібоначчі).

З цього випливає, що будь-яке число можна єдиним чином закодувати в кодуванні Фібоначчі.
А саме подання можна описати двійковими кодами $d_0 d_1 d_2 \dots d_s 1$, де $d_i$ дорівнює $1$, якщо $F_{i+2}$ використовується в поданні.
До коду дописується $1$, щоб позначити кінець кодового слова.
Зауважте, що це єдине місце, де з'являються два послідовні одиничні біти.

$$
\begin{align}
1 &=  1 &=  F_2 &=  (11)_F \\
2 &=  2 &=  F_3 &=  (011)_F \\
6 &=  5 + 1 &=  F_5 + F_2 &=  (10011)_F \\
8 &=  8 &=  F_6 &=  (000011)_F \\
9 &=  8 + 1 &=  F_6 + F_2 &=  (100011)_F \\
19 &=  13 + 5 + 1 &=  F_7 + F_5 + F_2 &=  (1001011)_F
\end{align}
$$

Кодування цілого числа $n$ можна виконати простим жадібним алгоритмом:

1. Перебираємо числа Фібоначчі від найбільшого до найменшого, доки не знайдемо таке, що не перевищує $n$.

2. Нехай це число було $F_i$. Віднімаємо $F_i$ від $n$ і ставимо $1$ у позицію $i-2$ кодового слова (нумерація з 0 від крайнього лівого до крайнього правого біта).

3. Повторюємо, доки не залишиться остачі.

4. Дописуємо в кінці кодового слова $1$, щоб позначити його кінець.

Щоб декодувати кодове слово, спершу прибираємо завершальну $1$. Потім, якщо $i$-й біт встановлено (нумерація з 0 від крайнього лівого до крайнього правого біта), додаємо $F_{i+2}$ до числа.


## Формули для $n$-го числа Фібоначчі \{#data-toc-label}

### Вираз у замкненій формі \{#closed-form-expression}

Існує формула, відома як «формула Біне», хоча вона була відома ще Муавру:

$$
F_n = \frac{\left(\frac{1 + \sqrt{5}}{2}\right)^n - \left(\frac{1 - \sqrt{5}}{2}\right)^n}{\sqrt{5}}
$$

Цю формулу легко довести за індукцією, але її також можна вивести за допомогою поняття твірних функцій або розв'язавши функціональне рівняння.

Можна одразу помітити, що абсолютна величина другого доданка завжди менша за $1$, і вона до того ж дуже швидко (експоненційно) спадає. Тому значення лише першого доданка «майже» дорівнює $F_n$. Це можна записати строго так:

$$
F_n = \left[\frac{\left(\frac{1 + \sqrt{5}}{2}\right)^n}{\sqrt{5}}\right]
$$

де квадратні дужки позначають заокруглення до найближчого цілого.

Оскільки обидві ці формули потребують дуже високої точності під час роботи з дробовими числами, для практичних обчислень вони мало корисні.

### Числа Фібоначчі за лінійний час \{#fibonacci-in-linear-time}

$n$-те число Фібоначчі легко знайти за $O(n)$, обчислюючи числа одне за одним аж до $n$. Однак існують і швидші способи, як ми побачимо далі.

Почнемо з ітеративного підходу, щоб скористатися формулою $F_n = F_{n-1} + F_{n-2}$, тож просто попередньо обчислимо ці значення в масиві. Враховуючи базові випадки для $F_0$ та $F_1$.

<CodeTabs>

```cpp
int fib(int n) {
    int a = 0;
    int b = 1;
    for (int i = 0; i < n; i++) {
        int tmp = a + b;
        a = b;
        b = tmp;
    }
    return a;
}
```

```python
def fib(n):
    a, b = 0, 1
    for _ in range(n):
        # вбудовані цілі Python мають необмежену точність,
        # тож переповнення не загрожує навіть для великих n
        a, b = b, a + b
    return a
```

```typescript
function fib(n: number): number {
  let a = 0;
  let b = 1;
  for (let i = 0; i < n; i++) {
    const tmp = a + b;
    a = b;
    b = tmp;
  }
  return a;
}
```

```go
func fib(n int) int {
    a, b := 0, 1
    for i := 0; i < n; i++ {
        // паралельне присвоєння обчислює праву частину перед присвоєнням
        a, b = b, a+b
    }
    return a
}
```

</CodeTabs>

У такий спосіб ми отримуємо лінійний розв'язок за час $O(n)$, зберігаючи всі значення послідовності до $n$.

### Матрична форма \{#matrix-form}

Щоб перейти від $(F_n, F_{n-1})$ до $(F_{n+1}, F_n)$, ми можемо виразити лінійне рекурентне співвідношення як множення матриць 2x2:

$$
\begin{pmatrix}
1 & 1 \\
1 & 0
\end{pmatrix}
\begin{pmatrix}
F_n \\
F_{n-1}
\end{pmatrix}
=
\begin{pmatrix}
F_n + F_{n-1}  \\
F_{n}
\end{pmatrix}
=
\begin{pmatrix}
F_{n+1}  \\
F_{n}
\end{pmatrix}
$$

Це дозволяє розглядати ітерування рекурентного співвідношення як повторюване множення матриць, що має приємні властивості. Зокрема,

$$
\begin{pmatrix}
1 & 1 \\
1 & 0
\end{pmatrix}^n
\begin{pmatrix}
F_1 \\
F_0
\end{pmatrix}
=
\begin{pmatrix}
F_{n+1}  \\
F_{n}
\end{pmatrix}
$$

де $F_1 = 1, F_0 = 0$. 
Насправді, оскільки 

$$
\begin{pmatrix} 1 & 1 \\ 1 & 0 \end{pmatrix}
= \begin{pmatrix} F_2 & F_1 \\ F_1 & F_0 \end{pmatrix}
$$

ми можемо використати матрицю безпосередньо:

$$
\begin{pmatrix} 1 & 1 \\ 1 & 0 \end{pmatrix}^n
= \begin{pmatrix} F_{n+1} & F_n \\ F_n & F_{n-1} \end{pmatrix}
$$

Отже, щоб знайти $F_n$ за час $O(\log  n)$, ми маємо піднести матрицю до степеня n. (Див. [Бінарне піднесення до степеня](binary-exp.md))

<CodeTabs>

```cpp
struct matrix {
    long long mat[2][2];
    matrix friend operator *(const matrix &a, const matrix &b){
        matrix c;
        for (int i = 0; i < 2; i++) {
          for (int j = 0; j < 2; j++) {
              c.mat[i][j] = 0;
              for (int k = 0; k < 2; k++) {
                  c.mat[i][j] += a.mat[i][k] * b.mat[k][j];
              }
          }
        }
        return c;
    }
};

matrix matpow(matrix base, long long n) {
    matrix ans{ {
      {1, 0},
      {0, 1}
    } };
    while (n) {
        if(n&1)
            ans = ans*base;
        base = base*base;
        n >>= 1;
    }
    return ans;
}

long long fib(int n) {
    matrix base{ {
      {1, 1},
      {1, 0}
    } };
    return matpow(base, n).mat[0][1];
}
```

```python
def mat_mul(a, b):
    # множення матриць 2x2; цілі Python автоматично «ростуть»
    return [
        [a[0][0] * b[0][0] + a[0][1] * b[1][0], a[0][0] * b[0][1] + a[0][1] * b[1][1]],
        [a[1][0] * b[0][0] + a[1][1] * b[1][0], a[1][0] * b[0][1] + a[1][1] * b[1][1]],
    ]


def mat_pow(base, n):
    ans = [[1, 0], [0, 1]]  # одинична матриця
    while n:
        if n & 1:
            ans = mat_mul(ans, base)
        base = mat_mul(base, base)
        n >>= 1
    return ans


def fib(n):
    base = [[1, 1], [1, 0]]
    return mat_pow(base, n)[0][1]
```

```typescript
type Mat = [[number, number], [number, number]];

function matMul(a: Mat, b: Mat): Mat {
  const c: Mat = [[0, 0], [0, 0]];
  for (let i = 0; i < 2; i++)
    for (let j = 0; j < 2; j++)
      for (let k = 0; k < 2; k++)
        c[i][j] += a[i][k] * b[k][j];
  return c;
}

function matPow(base: Mat, n: number): Mat {
  let ans: Mat = [[1, 0], [0, 1]]; // одинична матриця
  while (n) {
    if (n & 1) ans = matMul(ans, base);
    base = matMul(base, base);
    n >>= 1;
  }
  return ans;
}

function fib(n: number): number {
  const base: Mat = [[1, 1], [1, 0]];
  return matPow(base, n)[0][1];
}
```

```go
type matrix [2][2]int64

func mul(a, b matrix) matrix {
    var c matrix
    for i := 0; i < 2; i++ {
        for j := 0; j < 2; j++ {
            for k := 0; k < 2; k++ {
                c[i][j] += a[i][k] * b[k][j]
            }
        }
    }
    return c
}

func matpow(base matrix, n int64) matrix {
    ans := matrix{{1, 0}, {0, 1}} // одинична матриця
    for n > 0 {
        if n&1 == 1 {
            ans = mul(ans, base)
        }
        base = mul(base, base)
        n >>= 1
    }
    return ans
}

func fib(n int64) int64 {
    base := matrix{{1, 1}, {1, 0}}
    return matpow(base, n)[0][1]
}
```

</CodeTabs>

### Метод швидкого подвоєння \{#fast-doubling-method}

Розкривши наведений вище матричний вираз для $n = 2\cdot k$

$$
\begin{pmatrix}
F_{2k+1} & F_{2k}\\
F_{2k} & F_{2k-1}
\end{pmatrix}
=
\begin{pmatrix}
1 & 1\\
1 & 0
\end{pmatrix}^{2k}
=
\begin{pmatrix}
F_{k+1} & F_{k}\\
F_{k} & F_{k-1}
\end{pmatrix}
^2
$$

ми можемо отримати такі простіші рівняння:

$$
\begin{align}
F_{2k+1} &= F_{k+1}^2 + F_{k}^2 \\
F_{2k} &= F_k(F_{k+1}+F_{k-1}) = F_k (2F_{k+1} - F_{k})\\
\end{align}.
$$

Таким чином, використовуючи два наведені вище рівняння, числа Фібоначчі можна легко обчислити за допомогою такого коду:

<CodeTabs>

```cpp
pair<int, int> fib (int n) {
    if (n == 0)
        return {0, 1};

    auto p = fib(n >> 1);
    int c = p.first * (2 * p.second - p.first);
    int d = p.first * p.first + p.second * p.second;
    if (n & 1)
        return {d, c + d};
    else
        return {c, d};
}
```

```python
def fib(n):
    # повертає пару (F_n, F_{n+1}); вбудовані великі цілі Python
    # дозволяють обчислювати величезні числа Фібоначчі без переповнення
    if n == 0:
        return (0, 1)
    a, b = fib(n >> 1)
    c = a * (2 * b - a)
    d = a * a + b * b
    if n & 1:
        return (d, c + d)
    return (c, d)
```

```typescript
// числа Фібоначчі швидко зростають, тож використовуємо bigint,
// щоб уникнути втрати точності при великих n
function fib(n: number): [bigint, bigint] {
  if (n === 0) return [0n, 1n];
  const [a, b] = fib(n >> 1);
  const c = a * (2n * b - a);
  const d = a * a + b * b;
  if (n & 1) return [d, c + d];
  return [c, d];
}
```

```go
import "math/big"

// повертає пару (F_n, F_{n+1}); math/big дає довільну точність
func fib(n int) (*big.Int, *big.Int) {
    if n == 0 {
        return big.NewInt(0), big.NewInt(1)
    }
    a, b := fib(n >> 1)
    t := new(big.Int).Sub(new(big.Int).Lsh(b, 1), a) // 2*b - a
    c := new(big.Int).Mul(a, t)
    d := new(big.Int).Add(new(big.Int).Mul(a, a), new(big.Int).Mul(b, b))
    if n&1 == 1 {
        return d, new(big.Int).Add(c, d)
    }
    return c, d
}
```

</CodeTabs>

Наведений вище код повертає $F_n$ і $F_{n+1}$ як пару.

## Періодичність за модулем p \{#periodicity-modulo-p}

Розглянемо послідовність Фібоначчі за модулем $p$. Ми доведемо, що ця послідовність періодична.

Доведемо це від супротивного. Розглянемо перші $p^2 + 1$ пар чисел Фібоначчі, взятих за модулем $p$:

$$
(F_0,\ F_1),\ (F_1,\ F_2),\ \ldots,\ (F_{p^2},\ F_{p^2 + 1})
$$

За модулем $p$ може бути лише $p$ різних остач, а отже, щонайбільше $p^2$ різних пар остач, тож серед них знайдуться принаймні дві однакові пари. Цього достатньо, щоб довести періодичність послідовності, адже число Фібоначчі однозначно визначається двома своїми попередниками. Отже, якщо дві пари послідовних чисел повторюються, це означало б, що й числа після цієї пари повторюватимуться в той самий спосіб.

Тепер виберемо дві пари однакових остач із найменшими індексами в послідовності. Нехай це пари $(F_a,\ F_{a + 1})$ та $(F_b,\ F_{b + 1})$. Ми доведемо, що $a = 0$. Якби це було не так, то існували б дві попередні пари $(F_{a-1},\ F_a)$ та $(F_{b-1},\ F_b)$, які, за властивістю чисел Фібоначчі, також були б рівні. Однак це суперечить тому, що ми вибрали пари з найменшими індексами, чим і завершується наше доведення того, що передперіоду немає (тобто числа є періодичними починаючи з $F_0$).

## Задачі для практики \{#practice-problems}

* [SPOJ - Euclid Algorithm Revisited](http://www.spoj.com/problems/MAIN74/)
* [SPOJ - Fibonacci Sum](http://www.spoj.com/problems/FIBOSUM/)
* [HackerRank - Is Fibo](https://www.hackerrank.com/challenges/is-fibo/problem)
* [Project Euler - Even Fibonacci numbers](https://www.hackerrank.com/contests/projecteuler/challenges/euler002/problem)
* [DMOJ - Fibonacci Sequence](https://dmoj.ca/problem/fibonacci)
* [DMOJ - Fibonacci Sequence (Harder)](https://dmoj.ca/problem/fibonacci2)
* [DMOJ UCLV - Numbered sequence of pencils](https://dmoj.uclv.edu.cu/problem/secnum)
* [DMOJ UCLV - Fibonacci 2D](https://dmoj.uclv.edu.cu/problem/fibonacci)
* [DMOJ UCLV - fibonacci calculation](https://dmoj.uclv.edu.cu/problem/fibonaccicalculatio)
* [LightOJ -  Number Sequence](https://lightoj.com/problem/number-sequence)
* [Codeforces - C. Fibonacci](https://codeforces.com/problemset/gymProblem/102644/C)
* [Codeforces - A. Hexadecimal's theorem](https://codeforces.com/problemset/problem/199/A)
* [Codeforces - B. Blackboard Fibonacci](https://codeforces.com/problemset/problem/217/B)
* [Codeforces - E. Fibonacci Number](https://codeforces.com/problemset/problem/193/E)

## Відеоматеріали \{#video}

- [One second to compute the largest Fibonacci number I can — Sheafification of G](https://www.youtube.com/watch?v=KzT9I1d-LlQ) (26 хв, англійською)
