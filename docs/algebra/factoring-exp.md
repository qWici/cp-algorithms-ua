# Бінарне піднесення до степеня через факторизацію

Розглянемо задачу обчислення $ax^y \pmod{2^d}$ за заданими цілими числами $a$, $x$, $y$ та $d \geq 3$, де $x$ непарне.

Наведений нижче алгоритм дозволяє розв'язати цю задачу за $O(d)$ додавань і бітових операцій та одне множення на $y$.

:::tip[Коли підходить цей алгоритм?]
- Чи модуль є саме степенем двійки $2^d$ (з $d \geq 3$), а основа $x$ — **непарна**? *(якщо модуль довільний → [Бінарне піднесення до степеня](binary-exp.md))*
- Чи критично прибрати множник $\log$ і обчислити $ax^y \bmod 2^d$ за $O(d)$ замість $O(d \log y)$ звичайного бінарного степеня?
- Чи ви готові попередньо обчислити таблицю логарифмів за основою $5$ (метод спирається на структуру мультиплікативної групи за модулем $2^d$)?
:::

Завдяки структурі мультиплікативної групи за модулем $2^d$ будь-яке число $x$ таке, що $x \equiv 1 \pmod 4$, можна подати у вигляді

$$
x \equiv b^{L(x)} \pmod{2^d},
$$

де $b \equiv 5 \pmod 8$. Без втрати загальності припускаємо, що $x \equiv 1 \pmod 4$, оскільки випадок $x \equiv 3 \pmod 4$ можна звести до $x \equiv 1 \pmod 4$ заміною $x \mapsto -x$ та $a \mapsto (-1)^{y} a$. У цьому позначенні $ax^y$ подається як

$$
a x^y \equiv a b^{yL(x)} \pmod{2^d}.
$$

Основна ідея алгоритму полягає в тому, щоб спростити обчислення $L(x)$ та $b^{y L(x)}$, користуючись тим, що ми працюємо за модулем $2^d$. З причин, які стануть зрозумілими далі, ми працюватимемо з $4L(x)$, а не з $L(x)$, але взятим за модулем $2^d$ замість $2^{d-2}$.

У цій статті ми розглянемо реалізацію для $32$-бітних цілих чисел. Нехай

* `mbin_log_32(r, x)` — функція, що обчислює $r+4L(x) \pmod{2^d}$;
* `mbin_exp_32(r, x)` — функція, що обчислює $r b^{\frac{x}{4}} \pmod{2^d}$;
* `mbin_power_odd_32(a, x, y)` — функція, що обчислює $ax^y \pmod{2^d}$.

Тоді `mbin_power_odd_32` реалізується так:

<CodeTabs>

```cpp
uint32_t mbin_power_odd_32(uint32_t rem, uint32_t base, uint32_t exp) {
    if (base & 2) {
        /* дільник вважаємо від'ємним */
        base = -base;
        /* перевіряємо, чи результат має бути від'ємним */
        if (exp & 1) {
            rem = -rem;
        }
    }
    return (mbin_exp_32(rem, mbin_log_32(0, base) * exp));
}
```

```python
def mbin_power_odd_32(rem: int, base: int, exp: int) -> int:
    if base & 2:
        # дільник вважаємо від'ємним (заперечення за модулем 2^32)
        base = (-base) & 0xFFFFFFFF
        # перевіряємо, чи результат має бути від'ємним
        if exp & 1:
            rem = (-rem) & 0xFFFFFFFF
    # множення на exp також беремо за модулем 2^32
    return mbin_exp_32(rem, (mbin_log_32(0, base) * exp) & 0xFFFFFFFF)
```

```typescript
// Усі обчислення виконуємо в BigInt і маскуємо до 32 бітів (0xFFFFFFFF),
// щоб точно відтворити поведінку беззнакового uint32 з C++.
function mbinPowerOdd32(rem: bigint, base: bigint, exp: bigint): bigint {
  if (base & 2n) {
    // дільник вважаємо від'ємним (заперечення за модулем 2^32)
    base = -base & 0xFFFFFFFFn;
    // перевіряємо, чи результат має бути від'ємним
    if (exp & 1n) {
      rem = -rem & 0xFFFFFFFFn;
    }
  }
  // множення на exp також беремо за модулем 2^32
  return mbinExp32(rem, (mbinLog32(0n, base) * exp) & 0xFFFFFFFFn);
}
```

```go
// uint32 у Go переповнюється за модулем 2^32 автоматично,
// тож додаткове маскування не потрібне.
func mbinPowerOdd32(rem, base, exp uint32) uint32 {
	if base&2 != 0 {
		// дільник вважаємо від'ємним
		base = -base
		// перевіряємо, чи результат має бути від'ємним
		if exp&1 != 0 {
			rem = -rem
		}
	}
	return mbinExp32(rem, mbinLog32(0, base)*exp)
}
```

</CodeTabs>

## Обчислення 4L(x) за x \{#computing-4lx-from-x}

Нехай $x$ — непарне число таке, що $x \equiv 1 \pmod 4$. Його можна подати у вигляді

$$
x \equiv (2^{a_1}+1)\dots(2^{a_k}+1) \pmod{2^d},
$$

де $1 < a_1 < \dots < a_k < d$. Тут $L(\cdot)$ коректно визначене для кожного множника, оскільки всі вони дорівнюють $1$ за модулем $4$. Отже,

$$
4L(x) \equiv 4L(2^{a_1}+1)+\dots+4L(2^{a_k}+1) \pmod{2^{d}}.
$$

Таким чином, якщо ми попередньо обчислимо $t_k = 4L(2^n+1)$ для всіх $1 < k < d$, то зможемо обчислити $4L(x)$ для будь-якого числа $x$.

Для 32-бітних цілих чисел можна скористатися такою таблицею:

<CodeTabs>

```cpp
const uint32_t mbin_log_32_table[32] = {
    0x00000000, 0x00000000, 0xd3cfd984, 0x9ee62e18,
    0xe83d9070, 0xb59e81e0, 0xa17407c0, 0xce601f80,
    0xf4807f00, 0xe701fe00, 0xbe07fc00, 0xfc1ff800,
    0xf87ff000, 0xf1ffe000, 0xe7ffc000, 0xdfff8000,
    0xffff0000, 0xfffe0000, 0xfffc0000, 0xfff80000,
    0xfff00000, 0xffe00000, 0xffc00000, 0xff800000,
    0xff000000, 0xfe000000, 0xfc000000, 0xf8000000,
    0xf0000000, 0xe0000000, 0xc0000000, 0x80000000,
};
```

```python
mbin_log_32_table = [
    0x00000000, 0x00000000, 0xd3cfd984, 0x9ee62e18,
    0xe83d9070, 0xb59e81e0, 0xa17407c0, 0xce601f80,
    0xf4807f00, 0xe701fe00, 0xbe07fc00, 0xfc1ff800,
    0xf87ff000, 0xf1ffe000, 0xe7ffc000, 0xdfff8000,
    0xffff0000, 0xfffe0000, 0xfffc0000, 0xfff80000,
    0xfff00000, 0xffe00000, 0xffc00000, 0xff800000,
    0xff000000, 0xfe000000, 0xfc000000, 0xf8000000,
    0xf0000000, 0xe0000000, 0xc0000000, 0x80000000,
]
```

```typescript
const mbinLog32Table: bigint[] = [
  0x00000000n, 0x00000000n, 0xd3cfd984n, 0x9ee62e18n,
  0xe83d9070n, 0xb59e81e0n, 0xa17407c0n, 0xce601f80n,
  0xf4807f00n, 0xe701fe00n, 0xbe07fc00n, 0xfc1ff800n,
  0xf87ff000n, 0xf1ffe000n, 0xe7ffc000n, 0xdfff8000n,
  0xffff0000n, 0xfffe0000n, 0xfffc0000n, 0xfff80000n,
  0xfff00000n, 0xffe00000n, 0xffc00000n, 0xff800000n,
  0xff000000n, 0xfe000000n, 0xfc000000n, 0xf8000000n,
  0xf0000000n, 0xe0000000n, 0xc0000000n, 0x80000000n,
];
```

```go
var mbinLog32Table = [32]uint32{
	0x00000000, 0x00000000, 0xd3cfd984, 0x9ee62e18,
	0xe83d9070, 0xb59e81e0, 0xa17407c0, 0xce601f80,
	0xf4807f00, 0xe701fe00, 0xbe07fc00, 0xfc1ff800,
	0xf87ff000, 0xf1ffe000, 0xe7ffc000, 0xdfff8000,
	0xffff0000, 0xfffe0000, 0xfffc0000, 0xfff80000,
	0xfff00000, 0xffe00000, 0xffc00000, 0xff800000,
	0xff000000, 0xfe000000, 0xfc000000, 0xf8000000,
	0xf0000000, 0xe0000000, 0xc0000000, 0x80000000,
}
```

</CodeTabs>

На практиці використовується дещо інший підхід, ніж описаний вище. Замість того щоб шукати факторизацію для $x$, ми послідовно множитимемо $x$ на $2^n+1$, доки не перетворимо його на $1$ за модулем $2^d$. Таким чином ми знайдемо подання $x^{-1}$, тобто

$$
x (2^{a_1}+1)\dots(2^{a_k}+1) \equiv 1 \pmod {2^d}.
$$

Для цього ми перебираємо $n$ такі, що $1 < n < d$. Якщо в поточного $x$ встановлено $n$-й біт, ми множимо $x$ на $2^n+1$, що зручно записується в C++ як `x = x + (x << n)`. Це не змінить бітів, нижчих за $n$, але занулить $n$-й біт, оскільки $x$ непарне.

Враховуючи все це, функція `mbin_log_32(r, x)` реалізується так:

<CodeTabs>

```cpp
uint32_t mbin_log_32(uint32_t r, uint32_t x) {
    uint8_t n;

    for (n = 2; n < 32; n++) {
        if (x & (1 << n)) {
            x = x + (x << n);
            r -= mbin_log_32_table[n];
        }
    }

    return r;
}
```

```python
def mbin_log_32(r: int, x: int) -> int:
    for n in range(2, 32):
        if x & (1 << n):
            # усе тримаємо в межах 32 бітів
            x = (x + (x << n)) & 0xFFFFFFFF
            r = (r - mbin_log_32_table[n]) & 0xFFFFFFFF
    return r
```

```typescript
function mbinLog32(r: bigint, x: bigint): bigint {
  for (let n = 2n; n < 32n; n++) {
    if (x & (1n << n)) {
      // усе тримаємо в межах 32 бітів
      x = (x + (x << n)) & 0xFFFFFFFFn;
      r = (r - mbinLog32Table[Number(n)]) & 0xFFFFFFFFn;
    }
  }
  return r;
}
```

```go
func mbinLog32(r, x uint32) uint32 {
	for n := uint(2); n < 32; n++ {
		if x&(1<<n) != 0 {
			x = x + (x << n)
			r -= mbinLog32Table[n]
		}
	}
	return r
}
```

</CodeTabs>

Зауважимо, що $4L(x) = -4L(x^{-1})$, тому замість того щоб додавати $4L(2^n+1)$, ми віднімаємо його від $r$, яке спочатку дорівнює $0$.

## Обчислення x за 4L(x) \{#computing-x-from-4lx}

Зауважимо, що для $k \geq 1$ виконується

$$
(a 2^{k}+1)^2 = a^2 2^{2k} +a 2^{k+1}+1 = b2^{k+1}+1,
$$

звідки (послідовним піднесенням до квадрата) можна вивести, що

$$
(2^a+1)^{2^b} \equiv 1 \pmod{2^{a+b}}.
$$

Застосувавши цей результат до $a=2^n+1$ та $b=d-k$, дістаємо, що мультиплікативний порядок числа $2^n+1$ є дільником $2^{d-n}$.

Це, своєю чергою, означає, що $L(2^n+1)$ має ділитися на $2^{n}$, оскільки порядок $b$ дорівнює $2^{d-2}$, а порядок $b^y$ дорівнює $2^{d-2-v}$, де $2^v$ — найвищий степінь $2$, що ділить $y$, тож нам потрібно

$$
2^{d-k} \equiv 0 \pmod{2^{d-2-v}},
$$

отже, $v$ має бути більшим або рівним за $k-2$. Це дещо незручно, і щоб цьому зарадити, ми на початку домовилися множити $L(x)$ на $4$. Тепер, якщо ми знаємо $4L(x)$, ми можемо однозначно розкласти його на суму $4L(2^n+1)$, послідовно перевіряючи біти у $4L(x)$. Якщо $n$-й біт встановлено в $1$, ми множитимемо результат на $2^n+1$ та зменшуватимемо поточне $4L(x)$ на $4L(2^n+1)$.

Таким чином, `mbin_exp_32` реалізується так:

<CodeTabs>

```cpp
uint32_t mbin_exp_32(uint32_t r, uint32_t x) {
    uint8_t n;

    for (n = 2; n < 32; n++) {
        if (x & (1 << n)) {
            r = r + (r << n);
            x -= mbin_log_32_table[n];
        }
    }

    return r;
}
```

```python
def mbin_exp_32(r: int, x: int) -> int:
    for n in range(2, 32):
        if x & (1 << n):
            # усе тримаємо в межах 32 бітів
            r = (r + (r << n)) & 0xFFFFFFFF
            x = (x - mbin_log_32_table[n]) & 0xFFFFFFFF
    return r
```

```typescript
function mbinExp32(r: bigint, x: bigint): bigint {
  for (let n = 2n; n < 32n; n++) {
    if (x & (1n << n)) {
      // усе тримаємо в межах 32 бітів
      r = (r + (r << n)) & 0xFFFFFFFFn;
      x = (x - mbinLog32Table[Number(n)]) & 0xFFFFFFFFn;
    }
  }
  return r;
}
```

```go
func mbinExp32(r, x uint32) uint32 {
	for n := uint(2); n < 32; n++ {
		if x&(1<<n) != 0 {
			r = r + (r << n)
			x -= mbinLog32Table[n]
		}
	}
	return r
}
```

</CodeTabs>

## Подальші оптимізації \{#further-optimizations}

Кількість ітерацій можна вдвічі зменшити, якщо помітити, що $4L(2^{d-1}+1)=2^{d-1}$ і що для $2k \geq d$ виконується

$$
(2^n+1)^2 \equiv 2^{2n} + 2^{n+1}+1 \equiv 2^{n+1}+1 \pmod{2^d},
$$

звідки можна вивести, що $4L(2^n+1)=2^n$ для $2n \geq d$. Отже, можна спростити алгоритм, проходячи лише до $\frac{d}{2}$, а потім скористатися наведеним вище фактом, щоб обчислити решту частини бітовими операціями:

<CodeTabs>

```cpp
uint32_t mbin_log_32(uint32_t r, uint32_t x) {
    uint8_t n;

    for (n = 2; n != 16; n++) {
        if (x & (1 << n)) {
            x = x + (x << n);
            r -= mbin_log_32_table[n];
        }
    }

    r -= (x & 0xFFFF0000);

    return r;
}

uint32_t mbin_exp_32(uint32_t r, uint32_t x) {
    uint8_t n;

    for (n = 2; n != 16; n++) {
        if (x & (1 << n)) {
            r = r + (r << n);
            x -= mbin_log_32_table[n];
        }
    }

    r *= 1 - (x & 0xFFFF0000);

    return r;
}
```

```python
def mbin_log_32(r: int, x: int) -> int:
    for n in range(2, 16):
        if x & (1 << n):
            x = (x + (x << n)) & 0xFFFFFFFF
            r = (r - mbin_log_32_table[n]) & 0xFFFFFFFF
    r = (r - (x & 0xFFFF0000)) & 0xFFFFFFFF
    return r


def mbin_exp_32(r: int, x: int) -> int:
    for n in range(2, 16):
        if x & (1 << n):
            r = (r + (r << n)) & 0xFFFFFFFF
            x = (x - mbin_log_32_table[n]) & 0xFFFFFFFF
    # множення також тримаємо в межах 32 бітів
    r = (r * ((1 - (x & 0xFFFF0000)) & 0xFFFFFFFF)) & 0xFFFFFFFF
    return r
```

```typescript
function mbinLog32(r: bigint, x: bigint): bigint {
  for (let n = 2n; n < 16n; n++) {
    if (x & (1n << n)) {
      x = (x + (x << n)) & 0xFFFFFFFFn;
      r = (r - mbinLog32Table[Number(n)]) & 0xFFFFFFFFn;
    }
  }
  r = (r - (x & 0xFFFF0000n)) & 0xFFFFFFFFn;
  return r;
}

function mbinExp32(r: bigint, x: bigint): bigint {
  for (let n = 2n; n < 16n; n++) {
    if (x & (1n << n)) {
      r = (r + (r << n)) & 0xFFFFFFFFn;
      x = (x - mbinLog32Table[Number(n)]) & 0xFFFFFFFFn;
    }
  }
  // множення також тримаємо в межах 32 бітів
  r = (r * ((1n - (x & 0xFFFF0000n)) & 0xFFFFFFFFn)) & 0xFFFFFFFFn;
  return r;
}
```

```go
func mbinLog32(r, x uint32) uint32 {
	for n := uint(2); n != 16; n++ {
		if x&(1<<n) != 0 {
			x = x + (x << n)
			r -= mbinLog32Table[n]
		}
	}
	r -= x & 0xFFFF0000
	return r
}

func mbinExp32(r, x uint32) uint32 {
	for n := uint(2); n != 16; n++ {
		if x&(1<<n) != 0 {
			r = r + (r << n)
			x -= mbinLog32Table[n]
		}
	}
	r *= 1 - (x & 0xFFFF0000)
	return r
}
```

</CodeTabs>

## Обчислення таблиці логарифмів \{#computing-logarithm-table}

Щоб обчислити таблицю логарифмів, можна модифікувати [алгоритм Поліга–Геллмана](https://en.wikipedia.org/wiki/Pohlig–Hellman_algorithm) для випадку, коли модуль є степенем $2$.

Наше головне завдання тут — обчислити $x$ таке, що $g^x \equiv y \pmod{2^d}$, де $g=5$, а $y$ — число вигляду $2^n+1$.

Підносячи обидві частини до квадрата $k$ разів, дістаємо

$$
g^{2^k x} \equiv y^{2^k} \pmod{2^d}.
$$

Зауважимо, що порядок $g$ не перевищує $2^{d}$ (насправді $2^{d-2}$, але для зручності триматимемося $2^d$), тож, узявши $k=d-1$, ми матимемо в лівій частині або $g^1$, або $g^0$, що дозволяє визначити найменший біт $x$, порівнявши $y^{2^k}$ з $g$. Тепер припустимо, що $x=x_0 + 2^k x_1$, де $x_0$ — відома частина, а $x_1$ ще невідома. Тоді

$$
g^{x_0+2^k x_1} \equiv y \pmod{2^d}.
$$

Помноживши обидві частини на $g^{-x_0}$, дістаємо

$$
g^{2^k x_1} \equiv (g^{-x_0} y) \pmod{2^d}.
$$

Тепер, підносячи обидві частини до квадрата $d-k-1$ разів, ми можемо отримати наступний біт $x$, зрештою відновивши всі його біти.

## Джерела \{#references}

* [M30, Hans Petter Selasky, 2009](https://ia601602.us.archive.org/29/items/B-001-001-251/B-001-001-251.pdf#page=640)
