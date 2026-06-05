# Китайська теорема про остачі

Китайську теорему про остачі (далі в цій статті ми позначатимемо її як CRT) відкрив китайський математик Сунь Цзи.

:::tip[Коли підходить цей алгоритм?]
- Чи задача дає систему <Term tip="Рівнянь виду «число дає таку саму остачу, що й a_i, при діленні на m_i». Запис a ≡ b (mod m) читається: a і b мають однакову остачу за модулем m.">конгруенцій</Term> $a \equiv a_i \pmod{m_i}$ і просить знайти $a$ за модулем добутку $m_i$?
- Чи модулі $m_i$ <Term tip="Будь-які два з них не мають спільних дільників, окрім одиниці, тобто їхній найбільший спільний дільник дорівнює 1.">попарно взаємно прості</Term> (інакше потрібен окремий розбір степенів простих, описаний у статті)? *(якщо модуль один і простий → [Лінійне конгруентне рівняння](linear_congruence_equation.md))*
- Чи ви хочете уникнути довгої арифметики, виконуючи обчислення над великим числом через його остачі за кількома малими модулями? *(якщо так, для відновлення числа → [Алгоритм Гарнера](garners-algorithm.md))*
:::

## Формулювання \{#formulation}

Нехай $m = m_1 \cdot m_2 \cdots m_k$, де $m_i$ попарно взаємно прості. Окрім $m_i$, нам також задано систему конгруенцій

$$
\left\{\begin{array}{rcl}
    a & \equiv & a_1 \pmod{m_1} \\
    a & \equiv & a_2 \pmod{m_2} \\
      & \vdots & \\
    a & \equiv & a_k \pmod{m_k}
\end{array}\right.
$$

де $a_i$ — деякі задані константи. Початкове формулювання CRT стверджує, що задана система конгруенцій завжди має *рівно один* розв'язок за модулем $m$.

Наприклад, система конгруенцій

$$
\left\{\begin{array}{rcl}
    a & \equiv & 2 \pmod{3} \\
    a & \equiv & 3 \pmod{5} \\
    a & \equiv & 2 \pmod{7}
\end{array}\right.
$$

має розв'язок $23$ за модулем $105$, бо $23 \bmod{3} = 2$, $23 \bmod{5} = 3$ і $23 \bmod{7} = 2$.
Кожен розв'язок ми можемо записати як $23 + 105\cdot k$ для $k \in \mathbb{Z}$.


### Наслідок \{#corollary}

Наслідком CRT є те, що рівняння

$$
x \equiv a \pmod{m}
$$

еквівалентне системі рівнянь

$$
\left\{\begin{array}{rcl}
    x & \equiv & a_1 \pmod{m_1} \\
      & \vdots & \\
    x & \equiv & a_k \pmod{m_k}
\end{array}\right.
$$

(як і вище, вважаємо, що $m = m_1 m_2 \cdots m_k$, а $m_i$ попарно взаємно прості).

## Розв'язок для двох модулів \{#solution-for-two-moduli}

Розглянемо систему з двох рівнянь для взаємно простих $m_1, m_2$:

$$
\left\{\begin{align}
    a &\equiv a_1 \pmod{m_1} \\
    a &\equiv a_2 \pmod{m_2} \\
\end{align}\right.
$$

Ми хочемо знайти розв'язок для $a \pmod{m_1 m_2}$. За допомогою [розширеного алгоритму Евкліда](extended-euclid-algorithm.md) ми можемо знайти <Term tip="Пару цілих чисел, для якої n_1 множене на m_1 плюс n_2 множене на m_2 дорівнює найбільшому спільному дільнику m_1 і m_2. Їх дає розширений алгоритм Евкліда.">коефіцієнти Безу</Term> $n_1, n_2$ такі, що

$$
n_1 m_1 + n_2 m_2 = 1.
$$

Насправді $n_1$ і $n_2$ — це просто [обернені елементи за модулем](module-inverse.md) для $m_1$ і $m_2$ за модулями $m_2$ і $m_1$.
Маємо $n_1 m_1 \equiv 1 \pmod{m_2}$, отже $n_1 \equiv m_1^{-1} \pmod{m_2}$, і навпаки $n_2 \equiv m_2^{-1} \pmod{m_1}$. 

За допомогою цих двох коефіцієнтів ми можемо задати розв'язок:

$$
a = a_1 n_2 m_2 + a_2 n_1 m_1 \bmod{m_1 m_2}
$$

Легко переконатися, що це справді розв'язок, обчисливши $a \bmod{m_1}$ і $a \bmod{m_2}$.

$$
\begin{array}{rcll}
a & \equiv & a_1 n_2 m_2 + a_2 n_1 m_1 & \pmod{m_1}\\
  & \equiv & a_1 (1 - n_1 m_1) + a_2 n_1 m_1 & \pmod{m_1}\\
  & \equiv & a_1 - a_1 n_1 m_1 + a_2 n_1 m_1 & \pmod{m_1}\\
  & \equiv & a_1 & \pmod{m_1}
\end{array}
$$

Зауважимо, що китайська теорема про остачі також гарантує, що за модулем $m_1 m_2$ існує лише $1$ розв'язок.
Це теж легко довести.

Припустимо, що ми маємо два різні розв'язки $x$ та $y$.
Оскільки $x \equiv a_i \pmod{m_i}$ і $y \equiv a_i \pmod{m_i}$, то звідси випливає, що $x − y \equiv 0 \pmod{m_i}$, а отже $x − y \equiv 0 \pmod{m_1 m_2}$ або, що еквівалентно, $x \equiv y \pmod{m_1 m_2}$.
Тож $x$ та $y$ насправді є одним і тим самим розв'язком.

## Розв'язок для загального випадку \{#solution-for-general-case}

### Індуктивний розв'язок \{#inductive-solution}

Оскільки $m_1 m_2$ взаємно просте з $m_3$, ми можемо індуктивно багаторазово застосовувати розв'язок для двох модулів для будь-якої кількості модулів.
Спочатку, використовуючи перші дві конгруенції, ми обчислюємо $b_2 := a \pmod{m_1 m_2}$,
потім можемо обчислити $b_3 := a \pmod{m_1 m_2 m_3}$ за допомогою конгруенцій $a \equiv b_2 \pmod{m_1 m_2}$ та $a \equiv a_3 \pmod {m_3}$, і так далі.

### Пряма побудова \{#direct-construction}

Можлива пряма побудова, схожа на <Term tip="Спосіб побудувати многочлен, що проходить через задані точки, склавши його як зважену суму базисних доданків. Тут ідея та сама, але для остач.">інтерполяцію Лагранжа</Term>.

Нехай $M_i := \prod_{i \neq j} m_j$ — добуток усіх модулів, крім $m_i$, а $N_i$ — обернені елементи за модулем $N_i := M_i^{-1} \bmod{m_i}$.
Тоді розв'язком системи конгруенцій є:

$$
a \equiv \sum_{i=1}^k a_i M_i N_i \pmod{m_1 m_2 \cdots m_k}
$$

Ми можемо перевірити, що це справді розв'язок, обчисливши $a \bmod{m_i}$ для всіх $i$.
Оскільки $M_j$ є кратним $m_i$ для $i \neq j$, маємо

$$
\begin{array}{rcll}
a & \equiv & \sum_{j=1}^k a_j M_j N_j & \pmod{m_i} \\
  & \equiv & a_i M_i N_i              & \pmod{m_i} \\
  & \equiv & a_i M_i M_i^{-1}         & \pmod{m_i} \\
  & \equiv & a_i                      & \pmod{m_i}
\end{array}
$$

### Реалізація \{#implementation}

<CodeTabs>

```cpp
struct Congruence {
    long long a, m;
};

long long chinese_remainder_theorem(vector<Congruence> const& congruences) {
    long long M = 1;
    for (auto const& congruence : congruences) {
        M *= congruence.m;
    }

    long long solution = 0;
    for (auto const& congruence : congruences) {
        long long a_i = congruence.a;
        long long M_i = M / congruence.m;
        long long N_i = mod_inv(M_i, congruence.m);
        solution = (solution + a_i * M_i % M * N_i) % M;
    }
    return solution;
}
```

```python
# Конгруенцію подаємо як пару (a, m): a ≡ a (mod m)
def chinese_remainder_theorem(congruences):
    M = 1
    for a_i, m_i in congruences:
        M *= m_i

    solution = 0
    for a_i, m_i in congruences:
        M_i = M // m_i
        # У Python є вбудований обернений елемент за модулем: pow(x, -1, mod)
        N_i = pow(M_i, -1, m_i)
        # Цілі числа Python мають довільну точність, тому проміжного
        # переповнення (як з __int128 у C++) тут не виникає
        solution = (solution + a_i * M_i % M * N_i) % M
    return solution
```

```typescript
// Конгруенцію подаємо як пару [a, m]: a ≡ a (mod m).
// Використовуємо bigint, бо добуток a_i * M_i легко переповнює Number
type Congruence = [bigint, bigint];

// обернений елемент за модулем через розширений алгоритм Евкліда
function modInv(a: bigint, m: bigint): bigint {
  let [old_r, r] = [a % m, m];
  let [old_s, s] = [1n, 0n];
  while (r !== 0n) {
    const q = old_r / r;
    [old_r, r] = [r, old_r - q * r];
    [old_s, s] = [s, old_s - q * s];
  }
  return ((old_s % m) + m) % m;
}

function chineseRemainderTheorem(congruences: Congruence[]): bigint {
  let M = 1n;
  for (const [, m_i] of congruences) {
    M *= m_i;
  }

  let solution = 0n;
  for (const [a_i, m_i] of congruences) {
    const M_i = M / m_i;
    const N_i = modInv(M_i, m_i);
    solution = (solution + ((a_i * M_i) % M) * N_i) % M;
  }
  return solution;
}
```

```go
// Конгруенцію подаємо як пару {a, m}: a ≡ a (mod m).
// Використовуємо math/big, бо добуток a_i * M_i легко переповнює int64
import "math/big"

type Congruence struct {
	a, m *big.Int
}

func chineseRemainderTheorem(congruences []Congruence) *big.Int {
	M := big.NewInt(1)
	for _, c := range congruences {
		M.Mul(M, c.m)
	}

	solution := big.NewInt(0)
	for _, c := range congruences {
		Mi := new(big.Int).Div(M, c.m)
		// ModInverse повертає M_i^{-1} mod m
		Ni := new(big.Int).ModInverse(Mi, c.m)
		term := new(big.Int).Mul(c.a, Mi) // a_i * M_i
		term.Mul(term, Ni)                // * N_i
		solution.Add(solution, term)
		solution.Mod(solution, M)
	}
	return solution
}
```

</CodeTabs>

## Розв'язок для не взаємно простих модулів \{#solution-for-not-coprime-moduli}

Як уже згадувалося, наведений вище алгоритм працює лише для взаємно простих модулів $m_1, m_2, \dots m_k$.

У випадку не взаємно простих модулів система конгруенцій має рівно один розв'язок за модулем $\text{lcm}(m_1, m_2, \dots, m_k)$ або не має розв'язку взагалі.

Наприклад, у наведеній нижче системі перша конгруенція означає, що розв'язок непарний, а друга конгруенція означає, що розв'язок парний.
Неможливо, щоб число було одночасно непарним і парним, тому розв'язку, очевидно, немає.

$$
\left\{\begin{align}
    a & \equiv 1 \pmod{4} \\
    a & \equiv 2 \pmod{6}
\end{align}\right.
$$

Визначити, чи має система розв'язок, доволі просто.
А якщо він є, ми можемо застосувати початковий алгоритм для розв'язання трохи зміненої системи конгруенцій.

Одна конгруенція $a \equiv a_i \pmod{m_i}$ еквівалентна системі конгруенцій $a \equiv a_i \pmod{p_j^{n_j}}$, де $p_1^{n_1} p_2^{n_2}\cdots p_k^{n_k}$ — це <Term tip="Єдиний спосіб записати число як добуток простих чисел у відповідних степенях, наприклад 12 = 2 у квадраті, помножене на 3.">розклад на прості множники</Term> числа $m_i$.

Скориставшись цим фактом, ми можемо перетворити систему конгруенцій на систему, в якій модулями є лише степені простих чисел.
Наприклад, наведена вище система конгруенцій еквівалентна:

$$
\left\{\begin{array}{ll}
    a \equiv 1          & \pmod{4} \\
    a \equiv 2 \equiv 0 & \pmod{2} \\
    a \equiv 2          & \pmod{3}
\end{array}\right.
$$

Оскільки спочатку деякі модулі мали спільні множники, ми отримаємо кілька конгруенцій з модулями, що ґрунтуються на тому самому простому числі, але, можливо, з різними степенями цього простого.

Можна помітити, що конгруенція з модулем, який є найвищим степенем простого, буде найсильнішою серед усіх конгруенцій, що ґрунтуються на тому самому простому числі.
Вона або даватиме суперечність з якоюсь іншою конгруенцією, або вже випливатиме з неї всі інші конгруенції.

У нашому випадку перша конгруенція $a \equiv 1 \pmod{4}$ випливає $a \equiv 1 \pmod{2}$, а тому суперечить другій конгруенції $a \equiv 0 \pmod{2}$.
Отже, ця система конгруенцій не має розв'язку.

Якщо суперечностей немає, то система рівнянь має розв'язок.
Ми можемо знехтувати всіма конгруенціями, крім тих, у яких модулі є найвищими степенями простих.
Тепер ці модулі взаємно прості, а тому ми можемо розв'язати таку систему за допомогою алгоритму, обговореного в попередніх розділах.

Наприклад, наведена нижче система має розв'язок за модулем $\text{lcm}(10, 12) = 60$.

$$
\left\{\begin{align}
    a & \equiv 3 \pmod{10} \\
    a & \equiv 5 \pmod{12}
\end{align}\right.
$$

Ця система конгруенцій еквівалентна системі конгруенцій:

$$
\left\{\begin{align}
    a & \equiv 3 \equiv 1 \pmod{2} \\
    a & \equiv 3 \equiv 3 \pmod{5} \\
    a & \equiv 5 \equiv 1 \pmod{4} \\
    a & \equiv 5 \equiv 2 \pmod{3}
\end{align}\right.
$$

Єдині конгруенції з тим самим простим модулем — це $a \equiv 1 \pmod{4}$ та $a \equiv 1 \pmod{2}$.
Перша вже випливає другу, тож ми можемо знехтувати другою і натомість розв'язати таку систему зі взаємно простими модулями:

$$
\left\{\begin{align}
    a & \equiv 3 \equiv 3 \pmod{5} \\
    a & \equiv 5 \equiv 1 \pmod{4} \\
    a & \equiv 5 \equiv 2 \pmod{3}
\end{align}\right.
$$

Вона має розв'язок $53 \pmod{60}$, і справді $53 \bmod{10} = 3$ та $53 \bmod{12} = 5$.

## Алгоритм Гарнера \{#garners-algorithm}

Ще одним наслідком CRT є те, що ми можемо подавати великі числа за допомогою масиву невеликих цілих.

Замість того, щоб виконувати багато обчислень з дуже великими числами, що може бути дорого (уявіть собі ділення з 1000-значними числами), ви можете обрати кілька взаємно простих модулів, подати велике число як систему конгруенцій і виконувати всі операції над цією системою рівнянь.
Будь-яке число $a$, менше за $m_1 m_2 \cdots m_k$, можна подати як масив $a_1, \ldots, a_k$, де $a \equiv a_i \pmod{m_i}$.

Скориставшись наведеним вище алгоритмом, ви можете будь-коли знову відновити велике число, коли воно вам потрібне.

Як альтернатива, ви можете подати число у вигляді **мішаної системи числення** (mixed radix):

$$
a = x_1 + x_2 m_1 + x_3 m_1 m_2 + \ldots + x_k m_1 \cdots m_{k-1} \text{ with }x_i \in [0, m_i)
$$

Алгоритм Гарнера, який обговорюється в окремій статті [Алгоритм Гарнера](garners-algorithm.md), обчислює коефіцієнти $x_i$.
А з цими коефіцієнтами ви можете відновити повне число.

## Задачі для практики: \{#practice-problems}

* [Google Code Jam - Golf Gophers](https://github.com/google/coding-competitions-archive/blob/main/codejam/2019/round_1a/golf_gophers/statement.pdf)
* [Hackerrank - Number of sequences](https://www.hackerrank.com/contests/w22/challenges/number-of-sequences)
* [Codeforces - Remainders Game](http://codeforces.com/problemset/problem/687/B)

## Відеоматеріали \{#video}

<YouTubeEmbed id="EHDEvFuYPRQ" title="Chinese Remainder Theorem, 2-minute Method — Errichto Algorithms" />
