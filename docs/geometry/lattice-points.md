# Цілочислові точки всередині нецілочислового многокутника

Для цілочислових многокутників існує формула Піка, яка дозволяє підрахувати кількість цілочислових точок усередині многокутника.
А що робити з многокутниками, вершини яких довільні?

:::tip[Коли підходить цей алгоритм?]
- Потрібно підрахувати цілочислові точки всередині многокутника з **нецілочисловими** (довільними) вершинами?
- Вершини многокутника цілочислові? Тоді задача розв'язується простіше. *(якщо так → [Теорема Піка](picks-theorem.md))*
- Готовий рахувати суму $\sum \lfloor kx + b \rfloor$ під кожним ребром (підхід у дусі алгоритму Евкліда) для кожного ребра окремо?
:::

Опрацюймо кожне ребро многокутника окремо, а після цього зможемо просумувати кількості цілочислових точок під кожним ребром, враховуючи його орієнтацію для вибору знака (так само, як при обчисленні площі многокутника через трапеції).

Насамперед зауважимо, що якщо поточне ребро має кінці в точках $A=(x_1;y_1)$ і $B=(x_2;y_2)$, то його можна подати як лінійну функцію:

$$
y=y_1+(y_2-y_1) \cdot \dfrac{x-x_1}{x_2-x_1}=\left(\dfrac{y_2-y_1}{x_2-x_1}\right)\cdot x + \left(\dfrac{y_1x_2-x_1y_2}{x_2-x_1}\right)
$$

$$
y = k \cdot x + b,~k = \dfrac{y_2-y_1}{x_2-x_1},~b = \dfrac{y_1x_2-x_1y_2}{x_2-x_1}
$$

Тепер виконаємо заміну $x=x'+\lceil x_1 \rceil$, так що $b' = b + k \cdot \lceil x_1 \rceil$.
Це дозволяє нам працювати з $x_1'=0$ та $x_2'=x_2 - \lceil x_1 \rceil$.
Позначимо $n = \lfloor x_2' \rfloor$.

Ми не сумуватимемо точки при $x = n$ і на $y = 0$ задля цілісності алгоритму.
Їх можна додати вручну згодом.
Отже, нам треба просумувати $\sum\limits_{x'=0}^{n - 1} \lfloor k' \cdot x' + b'\rfloor$. Також припускаємо, що $k' \geq 0$ і $b'\geq 0$.
Інакше слід зробити заміну $x'=-t$ і додати $\lceil|b'|\rceil$ до $b'$.

Обговорімо, як можна обчислити суму $\sum\limits_{x=0}^{n - 1} \lfloor k \cdot x + b\rfloor$.
Маємо два випадки:

  - $k \geq 1$ або $b \geq 1$.
  
    Тоді нам слід почати із сумування точок під $y=\lfloor k \rfloor \cdot x + \lfloor b \rfloor$. Їхня кількість дорівнює
    
    $$
    \sum\limits_{x=0}^{n - 1} \lfloor k \rfloor \cdot x + \lfloor b \rfloor=\dfrac{(\lfloor k \rfloor(n-1)+2\lfloor b \rfloor) n}{2}.
    $$
    
    Тепер нас цікавлять лише точки $(x;y)$ такі, що $\lfloor k \rfloor \cdot x + \lfloor b \rfloor < y \leq k\cdot x + b$.
    Ця кількість збігається з кількістю точок таких, що $0 < y \leq (k - \lfloor k \rfloor) \cdot x + (b - \lfloor b \rfloor)$.
    Отже, ми звели нашу задачу до $k'= k - \lfloor k \rfloor$, $b' = b - \lfloor b \rfloor$, де тепер і $k'$, і $b'$ менші за $1$.
    Ось малюнок: ми щойно просумували сині точки і відняли синю лінійну функцію від чорної, щоб звести задачу до менших значень $k$ і $b$:
    <center> <img src="/img/docs/geometry/lattice.png" alt="Subtracting floored linear function" /> </center>

  - $k < 1$ і $b < 1$.

    Якщо $\lfloor k \cdot n + b\rfloor$ дорівнює $0$, ми можемо безпечно повернути $0$.
    Якщо ж це не так, то можна стверджувати, що немає цілочислових точок таких, що $x < 0$ і $0 < y \leq k \cdot x + b$.
    Це означає, що ми отримаємо ту саму відповідь, якщо розглянемо нову систему відліку, у якій $O'=(n;\lfloor k\cdot n + b\rfloor)$, вісь $x'$ напрямлена вниз, а вісь $y'$ напрямлена ліворуч.
    Для цієї системи відліку нас цікавлять цілочислові точки на множині
    
    $$
    \left\{(x;y)~\bigg|~0 \leq x < \lfloor k \cdot n + b\rfloor,~ 0 < y \leq \dfrac{x+(k\cdot n+b)-\lfloor k\cdot n + b \rfloor}{k}\right\}
    $$
    
    що повертає нас назад до випадку $k>1$.
    Нову точку відліку $O'$ та осі $X'$ і $Y'$ можна побачити на малюнку нижче:
    <center> <img src="/img/docs/geometry/mirror.png" alt="New reference and axes" /> </center>
    Як бачите, у новій системі відліку лінійна функція матиме коефіцієнт $\tfrac 1 k$, а її нуль буде в точці $\lfloor k\cdot n + b \rfloor-(k\cdot n+b)$, що робить наведену вище формулу правильною.

## Аналіз складності \{#complexity-analysis}

Нам треба підрахувати щонайбільше $\dfrac{(k(n-1)+2b)n}{2}$ точок.
Серед них на найпершому кроці ми підрахуємо $\dfrac{\lfloor k \rfloor (n-1)+2\lfloor b \rfloor}{2}$.
Можемо вважати, що $b$ є знехтувано малим, оскільки на початку ми можемо зробити його меншим за $1$.
У такому разі можна сказати, що ми підраховуємо приблизно $\dfrac{\lfloor k \rfloor}{k} \geq \dfrac 1 2$ усіх точок.
Отже, ми завершимо за $O(\log n)$ кроків.

## Реалізація \{#implementation}

Ось проста функція, яка обчислює кількість цілочислових точок $(x;y)$ таких, що $0 \leq x < n$ та $0 < y \leq \lfloor k x+b\rfloor$:

<CodeTabs>

```cpp
int count_lattices(Fraction k, Fraction b, long long n) {
    auto fk = k.floor();
    auto fb = b.floor();
    auto cnt = 0LL;
    if (k >= 1 || b >= 1) {
        cnt += (fk * (n - 1) + 2 * fb) * n / 2;
        k -= fk;
        b -= fb;
    }
    auto t = k * n + b;
    auto ft = t.floor();
    if (ft >= 1) {
        cnt += count_lattices(1 / k, (t - t.floor()) / k, t.floor());
    }
    return cnt;
}
```

```python
from fractions import Fraction
from math import floor


# Кількість цілих точок (x; y): 0 <= x < n та 0 < y <= floor(k*x + b)
def count_lattices(k: Fraction, b: Fraction, n: int) -> int:
    fk = floor(k)
    fb = floor(b)
    cnt = 0
    if k >= 1 or b >= 1:
        cnt += (fk * (n - 1) + 2 * fb) * n // 2
        k -= fk
        b -= fb
    t = k * n + b
    ft = floor(t)
    if ft >= 1:
        # Дзеркалимо систему координат: коефіцієнт стає 1/k
        cnt += count_lattices(1 / k, (t - floor(t)) / k, ft)
    return cnt
```

```typescript
// Раціональний дріб на BigInt: знаменник завжди додатний.
class Fraction {
  num: bigint;
  den: bigint;

  constructor(num: bigint, den: bigint = 1n) {
    if (den < 0n) {
      num = -num;
      den = -den;
    }
    const a = num < 0n ? -num : num;
    let g = Fraction.gcd(a, den);
    if (g === 0n) g = 1n;
    this.num = num / g;
    this.den = den / g;
  }

  static gcd(a: bigint, b: bigint): bigint {
    while (b) {
      [a, b] = [b, a % b];
    }
    return a;
  }

  // Округлення вниз до цілого
  floor(): bigint {
    let q = this.num / this.den;
    if (this.num % this.den !== 0n && this.num < 0n) q -= 1n;
    return q;
  }

  add(o: Fraction): Fraction {
    return new Fraction(this.num * o.den + o.num * this.den, this.den * o.den);
  }

  subBigInt(v: bigint): Fraction {
    return new Fraction(this.num - v * this.den, this.den);
  }

  mulBigInt(v: bigint): Fraction {
    return new Fraction(this.num * v, this.den);
  }

  inv(): Fraction {
    return new Fraction(this.den, this.num);
  }

  div(o: Fraction): Fraction {
    return new Fraction(this.num * o.den, this.den * o.num);
  }

  geBigInt(v: bigint): boolean {
    return this.num >= v * this.den;
  }
}

// Кількість цілих точок (x; y): 0 <= x < n та 0 < y <= floor(k*x + b)
function countLattices(k: Fraction, b: Fraction, n: bigint): bigint {
  const fk = k.floor();
  const fb = b.floor();
  let cnt = 0n;
  if (k.geBigInt(1n) || b.geBigInt(1n)) {
    cnt += ((fk * (n - 1n) + 2n * fb) * n) / 2n;
    k = k.subBigInt(fk);
    b = b.subBigInt(fb);
  }
  const t = k.mulBigInt(n).add(b);
  const ft = t.floor();
  if (ft >= 1n) {
    // Дзеркалимо систему координат: коефіцієнт стає 1/k
    cnt += countLattices(k.inv(), t.subBigInt(ft).div(k), ft);
  }
  return cnt;
}
```

```go
// floorRat повертає floor(x) для раціонального x як int64.
func floorRat(x *big.Rat) int64 {
    q := new(big.Int)
    q.Div(x.Num(), x.Denom()) // big.Int.Div округлює до нижнього (євклідове ділення)
    return q.Int64()
}

// countLattices рахує цілі точки (x; y): 0 <= x < n та 0 < y <= floor(k*x + b).
func countLattices(k, b *big.Rat, n int64) int64 {
    fk := floorRat(k)
    fb := floorRat(b)
    var cnt int64
    if k.Cmp(big.NewRat(1, 1)) >= 0 || b.Cmp(big.NewRat(1, 1)) >= 0 {
        cnt += (fk*(n-1) + 2*fb) * n / 2
        k = new(big.Rat).Sub(k, big.NewRat(fk, 1))
        b = new(big.Rat).Sub(b, big.NewRat(fb, 1))
    }
    t := new(big.Rat).Add(new(big.Rat).Mul(k, big.NewRat(n, 1)), b)
    ft := floorRat(t)
    if ft >= 1 {
        // Дзеркалимо систему координат: коефіцієнт стає 1/k
        invK := new(big.Rat).Inv(k)
        tFrac := new(big.Rat).Sub(t, big.NewRat(ft, 1))
        newB := new(big.Rat).Quo(tFrac, k)
        cnt += countLattices(invK, newB, ft)
    }
    return cnt
}
```

</CodeTabs>

Тут `Fraction` — це деякий клас для роботи з раціональними числами.
На практиці виявляється, що якщо всі знаменники й чисельники за абсолютною величиною не перевищують $C$, то в рекурсивних викликах вони будуть не більшими за $C^2$, якщо ви постійно ділите чисельники й знаменники на їхній найбільший спільний дільник.
За цього припущення можна сказати, що допустимо використовувати `double` і вимагати точності $\varepsilon^2$, де $\varepsilon$ — це точність, з якою задано $k$ і $b$.
Це означає, що під час заокруглення вниз числа слід вважати цілими, якщо вони відрізняються від цілого не більш ніж на $\varepsilon^2$.
