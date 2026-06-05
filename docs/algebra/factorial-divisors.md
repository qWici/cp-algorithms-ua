# Знаходження степеня дільника факторіала

Задано два числа $n$ і $k$. Знайти найбільше ціле $x$, таке що $k^x$ ділить $n!$.

## Просте $k$ \{#data-toc-label}

Спочатку розглянемо випадок простого $k$. Явний вираз для факторіала має вигляд

$$
n! = 1 \cdot 2 \cdot 3 \ldots (n-1) \cdot n
$$

Зауважимо, що кожен $k$-тий елемент добутку ділиться на $k$, тобто додає $+1$ до відповіді; кількість таких елементів дорівнює $\Bigl\lfloor\dfrac{n}{k}\Bigr\rfloor$.

Далі, кожен $k^2$-тий елемент ділиться на $k^2$, тобто додає ще $+1$ до відповіді (перший степінь $k$ ми вже врахували в попередньому абзаці). Кількість таких елементів дорівнює $\Bigl\lfloor\dfrac{n}{k^2}\Bigr\rfloor$.

І так далі: для кожного $i$ кожен $k^i$-тий елемент додає ще $+1$ до відповіді, і таких елементів є $\Bigl\lfloor\dfrac{n}{k^i}\Bigr\rfloor$.

Остаточна відповідь дорівнює

$$
\Bigl\lfloor\dfrac{n}{k}\Bigr\rfloor + \Bigl\lfloor\dfrac{n}{k^2}\Bigr\rfloor + \ldots + \Bigl\lfloor\dfrac{n}{k^i}\Bigr\rfloor + \ldots
$$

Цей результат також відомий як [формула Лежандра](https://en.wikipedia.org/wiki/Legendre%27s_formula).
Сума, звісно, скінченна, бо лише приблизно перші $\log_k n$ доданків не є нулями. Отже, час роботи цього алгоритму становить $O(\log_k n)$.

### Реалізація \{#implementation}

<CodeTabs>

```cpp

int fact_pow (int n, int k) {
	int res = 0;
	while (n) {
		n /= k;
		res += n;
	}
	return res;
}

```

```python
def fact_pow(n: int, k: int) -> int:
    res = 0
    while n:
        n //= k          # цілочисельне ділення
        res += n
    return res
```

```typescript
function factPow(n: number, k: number): number {
    let res = 0;
    while (n) {
        n = Math.floor(n / k);  // цілочисельне ділення
        res += n;
    }
    return res;
}
```

```go
func factPow(n, k int) int {
	res := 0
	for n != 0 {
		n /= k // цілочисельне ділення для int
		res += n
	}
	return res
}
```

</CodeTabs>

## Складене $k$ \{#data-toc-label-1}

Цю саму ідею не можна застосувати безпосередньо. Натомість ми можемо розкласти $k$ на множники, подавши його у вигляді $k = k_1^{p_1} \cdot \ldots \cdot k_m^{p_m}$. Для кожного $k_i$ ми знаходимо, скільки разів він входить у $n!$, за допомогою описаного вище алгоритму — назвемо це значення $a_i$. Відповідь для складеного $k$ буде

$$
\min_ {i=1 \ldots m} \dfrac{a_i}{p_i}
$$
