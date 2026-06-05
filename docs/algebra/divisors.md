# Кількість дільників / сума дільників

У цій статті ми обговоримо, як обчислити кількість дільників $d(n)$ та суму дільників $\sigma(n)$ заданого числа $n$.

## Кількість дільників \{#number-of-divisors}

Має бути очевидно, що розклад на прості множники дільника $d$ є підмножиною розкладу на прості множники числа $n$, наприклад $6 = 2 \cdot 3$ є дільником $60 = 2^2 \cdot 3 \cdot 5$.
Тож нам потрібно лише знайти всі різні підмножини розкладу на прості множники числа $n$.

Зазвичай кількість підмножин дорівнює $2^x$ для множини з $x$ елементів.
Проте це вже не так, якщо у множині є повторювані елементи. У нашому випадку деякі прості множники можуть з'являтися кілька разів у розкладі на прості множники числа $n$.

Якщо простий множник $p$ з'являється $e$ разів у розкладі на прості множники числа $n$, то ми можемо використати множник $p$ до $e$ разів у підмножині.
Це означає, що ми маємо $e+1$ варіантів вибору.

Тому якщо розклад на прості множники числа $n$ має вигляд $p_1^{e_1} \cdot p_2^{e_2} \cdots p_k^{e_k}$, де $p_i$ — різні прості числа, то кількість дільників дорівнює:

$$
d(n) = (e_1 + 1) \cdot (e_2 + 1) \cdots (e_k + 1)
$$

Про це можна думати в такий спосіб:

* Якщо є лише один різний простий дільник $n = p_1^{e_1}$, то очевидно, що дільників $e_1 + 1$ ($1, p_1, p_1^2, \dots, p_1^{e_1}$).

* Якщо є два різних простих дільники $n = p_1^{e_1} \cdot p_2^{e_2}$, то всі дільники можна розташувати у вигляді таблиці.

$$
\begin{array}{c|ccccc}
& 1 & p_2 & p_2^2 & \dots & p_2^{e_2} \\\\\hline
1 & 1 & p_2 & p_2^2 & \dots & p_2^{e_2} \\\\
p_1 & p_1 & p_1 \cdot p_2 & p_1 \cdot p_2^2 & \dots & p_1 \cdot p_2^{e_2} \\\\
p_1^2 & p_1^2 & p_1^2 \cdot p_2 & p_1^2 \cdot p_2^2 & \dots & p_1^2 \cdot p_2^{e_2} \\\\
\vdots & \vdots & \vdots & \vdots & \ddots & \vdots \\\\
p_1^{e_1} & p_1^{e_1} & p_1^{e_1} \cdot p_2 & p_1^{e_1} \cdot p_2^2 & \dots & p_1^{e_1} \cdot p_2^{e_2} \\\\
\end{array}
$$

Тож кількість дільників тривіально дорівнює $(e_1 + 1) \cdot (e_2 + 1)$.

* Подібне міркування можна провести, якщо різних простих множників більше ніж два.


<CodeTabs>

```cpp
long long numberOfDivisors(long long num) {
    long long total = 1;
    for (int i = 2; (long long)i * i <= num; i++) {
        if (num % i == 0) {
            int e = 0;
            do {
                e++;
                num /= i;
            } while (num % i == 0);
            total *= e + 1;
        }
    }
    if (num > 1) {
        total *= 2;
    }
    return total;
}
```

```python
def number_of_divisors(num: int) -> int:
    total = 1
    i = 2
    while i * i <= num:
        if num % i == 0:
            e = 0
            # Підраховуємо степінь простого множника i
            while num % i == 0:
                e += 1
                num //= i
            total *= e + 1
        i += 1
    if num > 1:
        # Залишок — простий множник у першому степені
        total *= 2
    return total
```

```typescript
function numberOfDivisors(num: bigint): bigint {
    let total = 1n;
    for (let i = 2n; i * i <= num; i++) {
        if (num % i === 0n) {
            let e = 0n;
            // Підраховуємо степінь простого множника i
            do {
                e++;
                num /= i;
            } while (num % i === 0n);
            total *= e + 1n;
        }
    }
    if (num > 1n) {
        // Залишок — простий множник у першому степені
        total *= 2n;
    }
    return total;
}
```

```go
func numberOfDivisors(num int64) int64 {
    var total int64 = 1
    for i := int64(2); i*i <= num; i++ {
        if num%i == 0 {
            var e int64 = 0
            // Підраховуємо степінь простого множника i
            for num%i == 0 {
                e++
                num /= i
            }
            total *= e + 1
        }
    }
    if num > 1 {
        // Залишок — простий множник у першому степені
        total *= 2
    }
    return total
}
```

</CodeTabs>

## Сума дільників \{#sum-of-divisors}

Ми можемо скористатися тим самим міркуванням, що й у попередньому розділі.

* Якщо є лише один різний простий дільник $n = p_1^{e_1}$, то сума дорівнює:

$$
1 + p_1 + p_1^2 + \dots + p_1^{e_1} = \frac{p_1^{e_1 + 1} - 1}{p_1 - 1}
$$

* Якщо є два різних простих дільники $n = p_1^{e_1} \cdot p_2^{e_2}$, то ми можемо скласти ту саму таблицю, що й раніше.
  Єдина відмінність полягає в тому, що тепер ми хочемо обчислити суму, а не підрахувати кількість елементів.
  Легко бачити, що суму всіх комбінацій можна виразити як:

$$
\left(1 + p_1 + p_1^2 + \dots + p_1^{e_1}\right) \cdot \left(1 + p_2 + p_2^2 + \dots + p_2^{e_2}\right)
$$

$$
= \frac{p_1^{e_1 + 1} - 1}{p_1 - 1} \cdot \frac{p_2^{e_2 + 1} - 1}{p_2 - 1}
$$

* У загальному випадку для $n = p_1^{e_1} \cdot p_2^{e_2} \cdots p_k^{e_k}$ ми отримуємо формулу:

$$
\sigma(n) = \frac{p_1^{e_1 + 1} - 1}{p_1 - 1} \cdot \frac{p_2^{e_2 + 1} - 1}{p_2 - 1} \cdots \frac{p_k^{e_k + 1} - 1}{p_k - 1}
$$

<CodeTabs>

```cpp
long long SumOfDivisors(long long num) {
    long long total = 1;

    for (int i = 2; (long long)i * i <= num; i++) {
        if (num % i == 0) {
            int e = 0;
            do {
                e++;
                num /= i;
            } while (num % i == 0);

            long long sum = 0, pow = 1;
            do {
                sum += pow;
                pow *= i;
            } while (e-- > 0);
            total *= sum;
        }
    }
    if (num > 1) {
        total *= (1 + num);
    }
    return total;
}
```

```python
def sum_of_divisors(num: int) -> int:
    total = 1
    i = 2
    while i * i <= num:
        if num % i == 0:
            e = 0
            # Підраховуємо степінь простого множника i
            while num % i == 0:
                e += 1
                num //= i

            # Сума геометричної прогресії 1 + i + i^2 + ... + i^e
            s, pw = 0, 1
            for _ in range(e + 1):
                s += pw
                pw *= i
            total *= s
        i += 1
    if num > 1:
        # Залишок — простий множник у першому степені: 1 + num
        total *= 1 + num
    return total
```

```typescript
function sumOfDivisors(num: bigint): bigint {
    let total = 1n;
    for (let i = 2n; i * i <= num; i++) {
        if (num % i === 0n) {
            let e = 0n;
            // Підраховуємо степінь простого множника i
            do {
                e++;
                num /= i;
            } while (num % i === 0n);

            // Сума геометричної прогресії 1 + i + i^2 + ... + i^e
            let sum = 0n,
                pow = 1n;
            for (let k = 0n; k <= e; k++) {
                sum += pow;
                pow *= i;
            }
            total *= sum;
        }
    }
    if (num > 1n) {
        // Залишок — простий множник у першому степені: 1 + num
        total *= 1n + num;
    }
    return total;
}
```

```go
func sumOfDivisors(num int64) int64 {
    var total int64 = 1
    for i := int64(2); i*i <= num; i++ {
        if num%i == 0 {
            var e int64 = 0
            // Підраховуємо степінь простого множника i
            for num%i == 0 {
                e++
                num /= i
            }

            // Сума геометричної прогресії 1 + i + i^2 + ... + i^e
            var sum, pow int64 = 0, 1
            for k := int64(0); k <= e; k++ {
                sum += pow
                pow *= i
            }
            total *= sum
        }
    }
    if num > 1 {
        // Залишок — простий множник у першому степені: 1 + num
        total *= 1 + num
    }
    return total
}
```

</CodeTabs>

## Мультиплікативні функції \{#multiplicative-functions}

Мультиплікативна функція — це функція $f(x)$, яка задовольняє

$$
f(a \cdot b) = f(a) \cdot f(b)
$$

якщо $a$ і $b$ взаємно прості.

І $d(n)$, і $\sigma(n)$ є мультиплікативними функціями.

Мультиплікативні функції мають величезне розмаїття цікавих властивостей, які можуть бути дуже корисними у задачах теорії чисел.
Наприклад, згортка Діріхле двох мультиплікативних функцій також є мультиплікативною.

## Задачі для практики \{#practice-problems}

  - [SPOJ - COMDIV](https://www.spoj.com/problems/COMDIV/)
  - [SPOJ - DIVSUM](https://www.spoj.com/problems/DIVSUM/)
  - [SPOJ - DIVSUM2](https://www.spoj.com/problems/DIVSUM2/)

## Відеоматеріали \{#video}

- [L2. Print all Divisors of a Number — take U forward](https://www.youtube.com/watch?v=Ae_Ag_saG9s) (9 хв, англійською)
