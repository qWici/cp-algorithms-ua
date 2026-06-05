# Функція Ейлера

Функція Ейлера, також відома як **phi-функція** $\phi (n)$, підраховує кількість цілих чисел від 1 до $n$ включно, які взаємно прості з $n$. Два числа є взаємно простими, якщо їхній найбільший спільний дільник дорівнює $1$ ($1$ вважається взаємно простим з будь-яким числом).

Ось значення $\phi(n)$ для перших кількох додатних цілих чисел:

$$
\begin{array}{|c|c|c|c|c|c|c|c|c|c|c|c|c|c|c|c|c|c|c|c|c|c|}
\hline
n & 1 & 2 & 3 & 4 & 5 & 6 & 7 & 8 & 9 & 10 & 11 & 12 & 13 & 14 & 15 & 16 & 17 & 18 & 19 & 20 & 21 \\\\ \hline
\phi(n) & 1 & 1 & 2 & 2 & 4 & 2 & 6 & 4 & 6 & 4 & 10 & 4 & 12 & 6 & 8 & 8 & 16 & 6 & 18 & 8 & 12 \\\\ \hline
\end{array}
$$

## Властивості \{#properties}

Наведених нижче властивостей функції Ейлера достатньо, щоб обчислити її для будь-якого числа:

  - Якщо $p$ — просте число, то $\gcd(p, q) = 1$ для всіх $1 \le q < p$. Тому маємо:
  
$$
\phi (p) = p - 1.
$$

  - Якщо $p$ — просте число і $k \ge 1$, то між $1$ і $p^k$ є рівно $p^k / p$ чисел, що діляться на $p$.
    Звідси отримуємо:
    
$$
\phi(p^k) = p^k - p^{k-1}.
$$

  - Якщо $a$ і $b$ взаємно прості, то:
    
    $$
    \phi(a b) = \phi(a) \cdot \phi(b).
    $$
    
    Це співвідношення не очевидне. Воно випливає з [китайської теореми про остачі](chinese-remainder-theorem.md). Китайська теорема про остачі гарантує, що для кожного $0 \le x < a$ і кожного $0 \le y < b$ існує єдине $0 \le z < a b$ таке, що $z \equiv x \pmod{a}$ і $z \equiv y \pmod{b}$. Неважко показати, що $z$ взаємно просте з $a b$ тоді й лише тоді, коли $x$ взаємно просте з $a$, а $y$ взаємно просте з $b$. Тому кількість цілих чисел, взаємно простих з $a b$, дорівнює добутку відповідних кількостей для $a$ і $b$.

  - У загальному випадку, для не взаємно простих $a$ і $b$, виконується рівність

    $$
    \phi(ab) = \phi(a) \cdot \phi(b) \cdot \dfrac{d}{\phi(d)}
    $$

    де $d = \gcd(a, b)$.

Отже, користуючись першими трьома властивостями, ми можемо обчислити $\phi(n)$ через факторизацію числа $n$ (розклад $n$ на добуток його простих множників).
Якщо $n = {p_1}^{a_1} \cdot {p_2}^{a_2} \cdots {p_k}^{a_k}$, де $p_i$ — прості множники $n$, то

$$
\begin{align}
\phi (n) &= \phi ({p_1}^{a_1}) \cdot \phi ({p_2}^{a_2}) \cdots  \phi ({p_k}^{a_k}) \\\\
&= \left({p_1}^{a_1} - {p_1}^{a_1 - 1}\right) \cdot \left({p_2}^{a_2} - {p_2}^{a_2 - 1}\right) \cdots \left({p_k}^{a_k} - {p_k}^{a_k - 1}\right) \\\\
&= p_1^{a_1} \cdot \left(1 - \frac{1}{p_1}\right) \cdot p_2^{a_2} \cdot \left(1 - \frac{1}{p_2}\right) \cdots p_k^{a_k} \cdot \left(1 - \frac{1}{p_k}\right) \\\\
&= n \cdot \left(1 - \frac{1}{p_1}\right) \cdot \left(1 - \frac{1}{p_2}\right) \cdots \left(1 - \frac{1}{p_k}\right)
\end{align}
$$

## Реалізація \{#implementation}

Ось реалізація, що використовує факторизацію за $O(\sqrt{n})$:

<CodeTabs>

```cpp
int phi(int n) {
    int result = n;
    for (int i = 2; i * i <= n; i++) {
        if (n % i == 0) {
            while (n % i == 0)
                n /= i;
            result -= result / i;
        }
    }
    if (n > 1)
        result -= result / n;
    return result;
}
```

```python
def phi(n):
    result = n
    i = 2
    while i * i <= n:
        if n % i == 0:
            # Прибираємо всі входження простого множника i
            while n % i == 0:
                n //= i
            result -= result // i
        i += 1
    # Якщо лишилася частина > 1, це останній простий множник
    if n > 1:
        result -= result // n
    return result
```

```typescript
function phi(n: number): number {
  let result = n;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) {
      // Прибираємо всі входження простого множника i
      while (n % i === 0) n = Math.floor(n / i);
      result -= Math.floor(result / i);
    }
  }
  // Якщо лишилася частина > 1, це останній простий множник
  if (n > 1) result -= Math.floor(result / n);
  return result;
}
```

```go
func phi(n int) int {
    result := n
    for i := 2; i*i <= n; i++ {
        if n%i == 0 {
            // Прибираємо всі входження простого множника i
            for n%i == 0 {
                n /= i
            }
            result -= result / i
        }
    }
    // Якщо лишилася частина > 1, це останній простий множник
    if n > 1 {
        result -= result / n
    }
    return result
}
```

</CodeTabs>

## Функція Ейлера від $1$ до $n$ за $O(n \log\log{n})$ \{#etf_1_to_n}

Якщо нам потрібні значення функції Ейлера для всіх чисел від $1$ до $n$, то факторизувати всі $n$ чисел неефективно.
Можна скористатися тією ж ідеєю, що й у [решеті Ератосфена](sieve-of-eratosthenes.md).
Вона так само спирається на показану вище властивість, але замість того, щоб оновлювати проміжний результат для кожного простого множника кожного числа, ми знаходимо всі прості числа і для кожного з них оновлюємо проміжні результати всіх чисел, які діляться на це просте число.

Оскільки цей підхід по суті ідентичний решету Ератосфена, складність буде такою ж: $O(n \log \log n)$

<CodeTabs>

```cpp
void phi_1_to_n(int n) {
    vector<int> phi(n + 1);
    for (int i = 0; i <= n; i++)
        phi[i] = i;
    
    for (int i = 2; i <= n; i++) {
        if (phi[i] == i) {
            for (int j = i; j <= n; j += i)
                phi[j] -= phi[j] / i;
        }
    }
}
```

```python
def phi_1_to_n(n):
    phi = list(range(n + 1))
    for i in range(2, n + 1):
        # Якщо phi[i] == i, то i ще не оброблялося, отже воно просте
        if phi[i] == i:
            for j in range(i, n + 1, i):
                phi[j] -= phi[j] // i
    return phi
```

```typescript
function phi1ToN(n: number): number[] {
  const phi: number[] = new Array(n + 1);
  for (let i = 0; i <= n; i++) phi[i] = i;

  for (let i = 2; i <= n; i++) {
    // Якщо phi[i] === i, то i ще не оброблялося, отже воно просте
    if (phi[i] === i) {
      for (let j = i; j <= n; j += i) phi[j] -= Math.floor(phi[j] / i);
    }
  }
  return phi;
}
```

```go
func phi1ToN(n int) []int {
    phi := make([]int, n+1)
    for i := 0; i <= n; i++ {
        phi[i] = i
    }

    for i := 2; i <= n; i++ {
        // Якщо phi[i] == i, то i ще не оброблялося, отже воно просте
        if phi[i] == i {
            for j := i; j <= n; j += i {
                phi[j] -= phi[j] / i
            }
        }
    }
    return phi
}
```

</CodeTabs>

### Знаходження функції Ейлера від $L$ до $R$ за допомогою [сегментованого решета](sieve-of-eratosthenes.md#segmented-sieve) \{#data-toc-label}

Якщо нам потрібні значення функції Ейлера для всіх чисел від $L$ до $R$, ми можемо застосувати підхід [сегментованого решета](sieve-of-eratosthenes.md#segmented-sieve).

Спочатку алгоритм попередньо обчислює всі прості числа до $\sqrt{R}$ за допомогою [лінійного решета](prime-sieve-linear.md) за час і пам'ять $O(\sqrt{R})$. Потім для кожного числа з відрізка $[L, R]$ він застосовує формулу для $\phi$ на основі факторизації, перебираючи ці прості числа. Ми підтримуємо масив остач, щоб відстежувати нерозкладену частину кожного числа. Якщо після обробки всіх малих простих чисел остача все ще більша за 1, це означає наявність великого простого множника, більшого за $\sqrt{R}$, який обробляється на завершальному проході. Загальна складність обчислення для відрізка становить $O((R - L + 1) \log \log R) + \sqrt{R}$.


```cpp
const long long MAX_RANGE = 1e6 + 6;
vector<long long> primes;
long long phi[MAX_RANGE], rem[MAX_RANGE];

vector<int> linear_sieve(int n) { 
    vector<bool> composite(n + 1, 0);
    vector<int> prime;

    // 0 і 1 не є складеними (як і простими)
    composite[0] = composite[1] = 1;

    for(int i = 2; i <= n; i++) {
        if(!composite[i]) prime.push_back(i);
        for(int j = 0; j < prime.size() && i * prime[j] <= n; j++) {
            composite[i * prime[j]] = true;
            if(i % prime[j] == 0) break;
        }
    }
    return prime;
}

// Щоб отримати значення phi(x) для L <= x <= R, використовуйте phi[x - L].
void segmented_phi(long long L, long long R) { 
    for(long long i = L; i <= R; i++) {
        rem[i - L] = i;
        phi[i - L] = i;
    }

    for(long long i : primes) {
        for(long long j = max(i * i, (L + i - 1) / i * i); j <= R; j += i) {
            phi[j - L] -= phi[j - L] / i;
            while(rem[j - L] % i == 0) rem[j - L] /= i;
        }
    }

    for(long long i = 0; i < R - L + 1; i++) {
        if(rem[i] > 1) phi[i] -= phi[i] / rem[i];
    }
}
```

## Властивість суми за дільниками \{#divsum}

Цю цікаву властивість встановив Гаусс:

$$
\sum_{d|n} \phi{(d)} = n
$$

Тут сума береться по всіх додатних дільниках $d$ числа $n$.

Наприклад, дільниками числа 10 є 1, 2, 5 і 10.
Тому $\phi{(1)} + \phi{(2)} + \phi{(5)} + \phi{(10)} = 1 + 1 + 4 + 4 = 10$.

### Знаходження функції Ейлера від 1 до $n$ за допомогою властивості суми за дільниками \{#data-toc-label-1}

Властивість суми за дільниками також дозволяє нам обчислити функцію Ейлера для всіх чисел від 1 до $n$.
Ця реалізація трохи простіша за попередню, що ґрунтувалася на решеті Ератосфена, проте має дещо гіршу складність: $O(n \log n)$

<CodeTabs>

```cpp
void phi_1_to_n(int n) {
    vector<int> phi(n + 1);
    phi[0] = 0;
    phi[1] = 1;
    for (int i = 2; i <= n; i++)
        phi[i] = i - 1;
    
    for (int i = 2; i <= n; i++)
        for (int j = 2 * i; j <= n; j += i)
              phi[j] -= phi[i];
}
```

```python
def phi_1_to_n(n):
    phi = [0] * (n + 1)
    phi[0] = 0
    phi[1] = 1
    for i in range(2, n + 1):
        phi[i] = i - 1

    # Віднімаємо внесок phi[i] від усіх кратних i (власних дільників)
    for i in range(2, n + 1):
        for j in range(2 * i, n + 1, i):
            phi[j] -= phi[i]
    return phi
```

```typescript
function phi1ToN(n: number): number[] {
  const phi: number[] = new Array(n + 1).fill(0);
  phi[0] = 0;
  phi[1] = 1;
  for (let i = 2; i <= n; i++) phi[i] = i - 1;

  // Віднімаємо внесок phi[i] від усіх кратних i (власних дільників)
  for (let i = 2; i <= n; i++) {
    for (let j = 2 * i; j <= n; j += i) phi[j] -= phi[i];
  }
  return phi;
}
```

```go
func phi1ToN(n int) []int {
    phi := make([]int, n+1)
    phi[0] = 0
    phi[1] = 1
    for i := 2; i <= n; i++ {
        phi[i] = i - 1
    }

    // Віднімаємо внесок phi[i] від усіх кратних i (власних дільників)
    for i := 2; i <= n; i++ {
        for j := 2 * i; j <= n; j += i {
            phi[j] -= phi[i]
        }
    }
    return phi
}
```

</CodeTabs>

## Застосування у теоремі Ейлера \{#application}

Найвідоміша і найважливіша властивість функції Ейлера виражається в **<Term tip="a у степені функції Ейлера від m дає остачу 1 при діленні на m, якщо a та m взаємно прості.">теоремі Ейлера</Term>**: 

$$
a^{\phi(m)} \equiv 1 \pmod m \quad \text{якщо } a \text{ і } m \text{ взаємно прості.}
$$

В окремому випадку, коли $m$ просте, теорема Ейлера перетворюється на **<Term tip="Для простого m: a у степені m мінус один дає остачу 1 при діленні на m (якщо a не кратне m).">малу теорему Ферма</Term>**:

$$
a^{m - 1} \equiv 1 \pmod m
$$

Теорема Ейлера та функція Ейлера досить часто трапляються у практичних застосуваннях, наприклад, обидві використовуються для обчислення [оберненого елемента за модулем](module-inverse.md).

Як безпосередній наслідок, ми також отримуємо еквівалентність:

$$
a^n \equiv a^{n \bmod \phi(m)} \pmod m
$$

Це дозволяє обчислювати $x^n \bmod m$ для дуже великих $n$, особливо якщо $n$ є результатом іншого обчислення, оскільки дає змогу обчислювати $n$ за модулем.

### Теорія груп \{#group-theory}
$\phi(n)$ — це [порядок мультиплікативної групи за модулем n](https://en.wikipedia.org/wiki/Multiplicative_group_of_integers_modulo_n) $(\mathbb Z / n\mathbb Z)^\times$, тобто групи оборотних елементів (елементів, що мають обернений за множенням). Елементи, що мають обернений за множенням, — це саме ті, що взаємно прості з $n$.

[Мультиплікативний порядок](https://en.wikipedia.org/wiki/Multiplicative_order) елемента $a$ за модулем $n$, позначається $\operatorname{ord}_n(a)$, — це найменше $k>0$ таке, що $a^k \equiv 1 \pmod m$. $\operatorname{ord}_n(a)$ — це розмір підгрупи, породженої елементом $a$, тож за <Term tip="У теорії груп: розмір будь-якої підгрупи завжди ділить розмір усієї групи.">теоремою Лагранжа</Term> <Term tip="Найменший додатний степінь, у який треба піднести a, щоб отримати 1 за модулем n.">мультиплікативний порядок</Term> будь-якого $a$ має ділити $\phi(n)$. Якщо мультиплікативний порядок $a$ дорівнює $\phi(n)$, тобто є найбільшим можливим, то $a$ є [первісним коренем](primitive-root.md), і група за означенням є циклічною. 

## Узагальнення \{#generalization}

Існує менш відома версія останньої еквівалентності, яка дозволяє ефективно обчислювати $x^n \bmod m$ для не взаємно простих $x$ і $m$.
Для довільних $x, m$ і $n \geq \log_2 m$:

$$
x^{n}\equiv x^{\phi(m)+[n \bmod \phi(m)]} \mod m
$$

Доведення:

Нехай $p_1, \dots, p_t$ — спільні прості дільники $x$ і $m$, а $k_i$ — їхні показники степеня в $m$.
За їх допомогою визначимо $a = p_1^{k_1} \dots p_t^{k_t}$, що робить $\frac{m}{a}$ взаємно простим з $x$.
І нехай $k$ — найменше число, для якого $a$ ділить $x^k$.
За припущення $n \ge k$ можемо записати:

$$
\begin{align}x^n \bmod m &= \frac{x^k}{a}ax^{n-k}\bmod m \\
&= \frac{x^k}{a}\left(ax^{n-k}\bmod m\right) \bmod m \\
&= \frac{x^k}{a}\left(ax^{n-k}\bmod a \frac{m}{a}\right) \bmod m \\
&=\frac{x^k}{a} a \left(x^{n-k} \bmod \frac{m}{a}\right)\bmod m \\
&= x^k\left(x^{n-k} \bmod \frac{m}{a}\right)\bmod m
\end{align}
$$

Еквівалентність між третім і четвертим рядками випливає з того факту, що $ab \bmod ac = a(b \bmod c)$.
Дійсно, якщо $b = cd + r$ з $r < c$, то $ab = acd + ar$ з $ar < ac$.

Оскільки $x$ і $\frac{m}{a}$ взаємно прості, ми можемо застосувати теорему Ейлера й отримати ефективну (оскільки $k$ дуже мале; насправді $k \le \log_2 m$) формулу:

$$
x^n \bmod m = x^k\left(x^{n-k \bmod \phi(\frac{m}{a})} \bmod \frac{m}{a}\right)\bmod m.
$$

Цю формулу важко застосувати, але ми можемо скористатися нею для аналізу поведінки $x^n \bmod m$. Можна побачити, що послідовність степенів $(x^1 \bmod m, x^2 \bmod m, x^3 \bmod m, \dots)$ входить у цикл довжини $\phi\left(\frac{m}{a}\right)$ після перших $k$ (або менше) елементів. 
$\phi\left(\frac{m}{a}\right)$ ділить $\phi(m)$ (оскільки $a$ і $\frac{m}{a}$ взаємно прості, маємо $\phi(a) \cdot \phi\left(\frac{m}{a}\right) = \phi(m)$), тому ми також можемо сказати, що період має довжину $\phi(m)$.
А оскільки $\phi(m) \ge \log_2 m \ge k$, ми можемо зробити висновок про бажану, значно простішу формулу:

$$
x^n \equiv x^{\phi(m)} x^{(n - \phi(m)) \bmod \phi(m)} \bmod m \equiv x^{\phi(m)+[n \bmod \phi(m)]} \mod m.
$$

## Задачі для практики \{#practice-problems}

* [SPOJ #4141 "Euler Totient Function" [Difficulty: CakeWalk]](http://www.spoj.com/problems/ETF/)
* [UVA #10179 "Irreducible Basic Fractions" [Difficulty: Easy]](http://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=1120)
* [UVA #10299 "Relatives" [Difficulty: Easy]](http://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=1240)
* [UVA #11327 "Enumerating Rational Numbers" [Difficulty: Medium]](http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=2302)
* [TIMUS #1673 "Admission to Exam" [Difficulty: High]](http://acm.timus.ru/problem.aspx?space=1&num=1673)
* [UVA 10990 - Another New Function](https://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=1931)
* [Codechef - Golu and Sweetness](https://www.codechef.com/problems/COZIE)
* [SPOJ - LCM Sum](http://www.spoj.com/problems/LCMSUM/)
* [GYM - Simple Calculations  (F)](http://codeforces.com/gym/100975)
* [UVA 13132 - Laser Mirrors](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=5043)
* [SPOJ - GCDEX](http://www.spoj.com/problems/GCDEX/)
* [UVA 12995 - Farey Sequence](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=4878)
* [SPOJ - Totient in Permutation (easy)](http://www.spoj.com/problems/TIP1/)
* [LOJ - Mathematically Hard](http://lightoj.com/volume_showproblem.php?problem=1007)
* [SPOJ - Totient Extreme](http://www.spoj.com/problems/DCEPCA03/)
* [SPOJ - Playing with GCD](http://www.spoj.com/problems/NAJPWG/)
* [SPOJ - G Force](http://www.spoj.com/problems/DCEPC12G/)
* [SPOJ - Smallest Inverse Euler Totient Function](http://www.spoj.com/problems/INVPHI/)
* [Codeforces - Power Tower](http://codeforces.com/problemset/problem/906/D)
* [Kattis - Exponial](https://open.kattis.com/problems/exponial)
* [LeetCode - 372. Super Pow](https://leetcode.com/problems/super-pow/)
* [Codeforces - The Holmes Children](http://codeforces.com/problemset/problem/776/E)
* [Codeforces - Small GCD](https://codeforces.com/contest/1900/problem/D)

## Відеоматеріали \{#video}

<YouTubeEmbed id="DwQ7-k9LkJ4" title="Euler’s Totient Function (Phi Function) — Neso Academy" />
