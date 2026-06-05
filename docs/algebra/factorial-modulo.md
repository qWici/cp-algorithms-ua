# Факторіал за модулем $p$

У деяких випадках доводиться розглядати складні формули за модулем деякого простого числа $p$, які містять факторіали і в чисельнику, і в знаменнику, як, наприклад, у формулі для біноміальних коефіцієнтів.
Ми розглянемо випадок, коли $p$ відносно невелике.
Ця задача має сенс лише тоді, коли факторіали присутні і в чисельнику, і в знаменнику дробів.
Інакше $p!$ та наступні доданки перетворяться на нуль.
Але в дробах множники $p$ можуть скоротитися, і результат буде ненульовим за модулем $p$.

Отже, формально задача звучить так: ви хочете обчислити $n! \bmod p$, не враховуючи всіх множників, кратних $p$, які з'являються у факторіалі.
Уявіть, що ви виписуєте розклад $n!$ на прості множники, прибираєте всі множники $p$ і обчислюєте добуток за модулем $p$.
Цей *модифікований* факторіал ми позначатимемо як $n!_{\%p}$.
Наприклад, $7!_{\%p} \equiv 1 \cdot 2 \cdot \underbrace{1}_{3} \cdot 4 \cdot 5 \underbrace{2}_{6} \cdot 7 \equiv 2 \bmod 3$.

Уміння ефективно обчислювати цей модифікований факторіал дозволяє нам швидко обчислювати значення різноманітних комбінаторних формул (наприклад, [біноміальних коефіцієнтів](../combinatorics/binomial-coefficients.md)).

## Алгоритм \{#algorithm}
Запишемо цей модифікований факторіал у явному вигляді.

$$
\begin{align}
n!_{\%p} &=  1 \cdot 2 \cdot 3 \cdot \ldots \cdot (p-2) \cdot (p-1) \cdot \underbrace{1}_{p} \cdot (p+1) \cdot (p+2) \cdot \ldots \cdot (2p-1) \cdot \underbrace{2}_{2p} \\\
 & \quad \cdot (2p+1) \cdot \ldots \cdot (p^2-1) \cdot \underbrace{1}_{p^2} \cdot (p^2 +1) \cdot \ldots \cdot n \pmod{p} \\\\
&=  1 \cdot 2 \cdot 3 \cdot \ldots \cdot (p-2) \cdot (p-1) \cdot \underbrace{1}_{p} \cdot 1 \cdot 2 \cdot \ldots \cdot (p-1) \cdot \underbrace{2}_{2p} \cdot 1 \cdot 2 \\\
& \quad \cdot \ldots \cdot (p-1) \cdot \underbrace{1}_{p^2} \cdot 1 \cdot 2 \cdot \ldots \cdot (n \bmod p) \pmod{p}
\end{align}
$$

Чітко видно, що факторіал розбивається на кілька блоків однакової довжини, окрім останнього.

$$
\begin{align}
n!_{\%p}&=  \underbrace{1 \cdot 2 \cdot 3 \cdot \ldots \cdot (p-2) \cdot (p-1) \cdot 1}_{1\text{st}} \cdot \underbrace{1 \cdot 2 \cdot 3 \cdot \ldots \cdot (p-2) \cdot (p-1) \cdot 2}_{2\text{nd}} \cdot \ldots \\\\
&  \cdot \underbrace{1 \cdot 2 \cdot 3 \cdot \ldots \cdot (p-2) \cdot (p-1) \cdot 1}_{p\text{th}} \cdot \ldots \cdot \quad \underbrace{1 \cdot 2 \cdot \cdot \ldots \cdot (n \bmod p)}_{\text{tail}} \pmod{p}.
\end{align}
$$

Основну частину блоків легко порахувати — це просто $(p-1)!\ \mathrm{mod}\ p$.
Ми можемо обчислити це програмно або просто застосувати теорему Вілсона, яка стверджує, що $(p-1)! \bmod p = -1$ для будь-якого простого $p$.

Таких блоків у нас рівно $\lfloor \frac{n}{p} \rfloor$, тому нам потрібно піднести $-1$ до степеня $\lfloor \frac{n}{p} \rfloor$.
Це можна зробити за логарифмічний час за допомогою [бінарного піднесення до степеня](binary-exp.md); проте можна також помітити, що результат чергуватиметься між $-1$ і $1$, тож нам достатньо лише поглянути на парність показника й помножити на $-1$, якщо парність непарна.
А замість множення можна просто відняти поточний результат від $p$.

Значення останнього часткового блока можна обчислити окремо за $O(p)$.


Залишається лише останній елемент кожного блока.
Якщо приховати вже опрацьовані елементи, то можна побачити такий патерн:

$$
n!_{\%p} = \underbrace{ \ldots \cdot 1 } \cdot \underbrace{ \ldots \cdot 2} \cdot \ldots \cdot \underbrace{ \ldots \cdot (p-1)} \cdot \underbrace{ \ldots \cdot 1 } \cdot \underbrace{ \ldots \cdot 1} \cdot \underbrace{ \ldots \cdot 2} \cdots
$$

Це знову *модифікований* факторіал, лише значно меншої розмірності.
Це $\lfloor n / p \rfloor !_{\%p}$.

Отже, під час обчислення *модифікованого* факторіала $n\!_{\%p}$ ми виконали $O(p)$ операцій, і нам залишилося обчислити $\lfloor n / p \rfloor !_{\%p}$.
Маємо рекурентну формулу.
Глибина рекурсії становить $O(\log_p n)$, а отже, повна асимптотична поведінка алгоритму — $O(p \log_p n)$.

Зауважимо, що якщо попередньо обчислити факторіали $0!,~ 1!,~ 2!,~ \dots,~ (p-1)!$ за модулем $p$, то складність становитиме лише $O(\log_p n)$.


## Реалізація \{#implementation}

Нам не потрібна рекурсія, бо це випадок хвостової рекурсії, а отже, її легко реалізувати через ітерацію.
У наведеній нижче реалізації ми попередньо обчислюємо факторіали $0!,~ 1!,~ \dots,~ (p-1)!$, а отже, час роботи становить $O(p + \log_p n)$.
Якщо вам потрібно викликати функцію кілька разів, то попередні обчислення можна винести за межі функції й виконувати обчислення $n!_{\%p}$ за час $O(\log_p n)$.

<CodeTabs>

```cpp
int factmod(int n, int p) {
    vector<int> f(p);
    f[0] = 1;
    for (int i = 1; i < p; i++)
        f[i] = f[i-1] * i % p;

    int res = 1;
    while (n > 1) {
        if ((n/p) % 2)
            res = p - res;
        res = res * f[n%p] % p;
        n /= p;
    }
    return res;
}
```

```python
def factmod(n: int, p: int) -> int:
    # Попередньо обчислюємо 0!, 1!, ..., (p-1)! за модулем p
    f = [1] * p
    for i in range(1, p):
        f[i] = f[i - 1] * i % p

    res = 1
    while n > 1:
        # Знак (-1)^(n//p) за теоремою Вілсона: чергуємо віднімання від p
        if (n // p) % 2:
            res = p - res
        res = res * f[n % p] % p
        n //= p
    return res
```

```typescript
function factmod(n: number, p: number): number {
  // Попередньо обчислюємо 0!, 1!, ..., (p-1)! за модулем p
  const f = new Array<number>(p);
  f[0] = 1;
  for (let i = 1; i < p; i++) {
    f[i] = (f[i - 1] * i) % p;
  }

  let res = 1;
  while (n > 1) {
    // Знак (-1)^(n/p) за теоремою Вілсона: чергуємо віднімання від p
    if (Math.floor(n / p) % 2) {
      res = p - res;
    }
    res = (res * f[n % p]) % p;
    n = Math.floor(n / p);
  }
  return res;
}
```

```go
func factmod(n, p int) int {
    // Попередньо обчислюємо 0!, 1!, ..., (p-1)! за модулем p
    f := make([]int, p)
    f[0] = 1
    for i := 1; i < p; i++ {
        f[i] = f[i-1] * i % p
    }

    res := 1
    for n > 1 {
        // Знак (-1)^(n/p) за теоремою Вілсона: чергуємо віднімання від p
        if (n/p)%2 == 1 {
            res = p - res
        }
        res = res * f[n%p] % p
        n /= p
    }
    return res
}
```

</CodeTabs>

Як альтернатива, якщо у вас обмаль пам'яті й ви не можете дозволити собі зберігати всі факторіали, ви також можете просто запам'ятати ті факторіали, які вам потрібні, відсортувати їх, а потім обчислити їх за один прохід, обчислюючи факторіали $0!,~ 1!,~ 2!,~ \dots,~ (p-1)!$ у циклі без явного їх збереження.

## Кратність $p$ \{#multiplicity-of-p}

Якщо ми хочемо обчислити біноміальний коефіцієнт за модулем $p$, то нам додатково потрібна кратність $p$ у $n$, тобто кількість разів, скільки $p$ зустрічається у розкладі $n$ на прості множники, або кількість разів, скільки ми викреслювали $p$ під час обчислення *модифікованого* факторіала.

[Формула Лежандра](https://en.wikipedia.org/wiki/Legendre%27s_formula) дає нам спосіб обчислити це за час $O(\log_p n)$.
Ця формула дає кратність $\nu_p$ як:

$$
\nu_p(n!) = \sum_{i=1}^{\infty} \left\lfloor \frac{n}{p^i} \right\rfloor
$$

Отже, отримуємо таку реалізацію:

<CodeTabs>

```cpp
int multiplicity_factorial(int n, int p) {
    int count = 0;
    do {
        n /= p;
        count += n;
    } while (n);
    return count;
}
```

```python
def multiplicity_factorial(n: int, p: int) -> int:
    count = 0
    while True:
        n //= p
        count += n
        if not n:  # аналог циклу do-while
            break
    return count
```

```typescript
function multiplicityFactorial(n: number, p: number): number {
  let count = 0;
  do {
    n = Math.floor(n / p);
    count += n;
  } while (n);
  return count;
}
```

```go
func multiplicityFactorial(n, p int) int {
    count := 0
    for { // аналог циклу do-while
        n /= p
        count += n
        if n == 0 {
            break
        }
    }
    return count
}
```

</CodeTabs>

Цю формулу можна дуже легко довести, використовуючи ті самі ідеї, що й у попередніх розділах.
Приберемо всі елементи, які не містять множника $p$.
Залишиться $\lfloor n/p \rfloor$ елементів.
Якщо прибрати множник $p$ з кожного з них, ми отримаємо добуток $1 \cdot 2 \cdots \lfloor n/p \rfloor = \lfloor n/p \rfloor !$, і ми знову маємо рекурсію.

## Відеоматеріали \{#video}

- [Computations Modulo P in Competitive Programming — Errichto Algorithms](https://www.youtube.com/watch?v=-OPohCQqi_E) (18 хв, англійською)
