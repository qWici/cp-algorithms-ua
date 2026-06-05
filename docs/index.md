---
slug: /
title: Головна
description: Український переклад cp-algorithms — 162 статті про алгоритми змагального програмування з прикладами на C++, Python, TypeScript і Go.
---

# Алгоритми для змагального програмування

Український переклад [cp-algorithms.com](https://cp-algorithms.com) — однієї з найповніших збірок алгоритмів для змагального програмування.

- **162 статті** — від бінарного піднесення до степеня до суфіксних автоматів і потоків
- **4 мови прикладів** — кожен фрагмент коду доступний на C++, Python, TypeScript і Go
- **Перевірений код** — усі приклади запускалися й звірялися з оригінальною реалізацією

## Обери свою мову \{#choose-language}

Перемкни вкладку нижче — вибір збережеться і застосується до **всіх** статей сайту:

<CodeTabs>

```cpp
long long binpow(long long a, long long b) {
    long long res = 1;
    while (b > 0) {
        if (b & 1)
            res = res * a;
        a = a * a;
        b >>= 1;
    }
    return res;
}
```

```python
def binpow(a: int, b: int) -> int:
    res = 1
    while b > 0:
        if b & 1:
            res *= a
        a *= a
        b >>= 1
    return res
```

```typescript
function binpow(a: bigint, b: bigint): bigint {
  let res = 1n;
  while (b > 0n) {
    if (b & 1n) res *= a;
    a *= a;
    b >>= 1n;
  }
  return res;
}
```

```go
func binpow(a, b int64) int64 {
	var res int64 = 1
	for b > 0 {
		if b&1 == 1 {
			res *= a
		}
		a *= a
		b >>= 1
	}
	return res
}
```

</CodeTabs>

## Розділи \{#sections}

| Розділ | Що всередині |
|---|---|
| **Алгебра** | [Бінарне піднесення до степеня](algebra/binary-exp.md), [решето Ератосфена](algebra/sieve-of-eratosthenes.md), модульна арифметика, [FFT](algebra/fft.md), довга арифметика |
| **Структури даних** | [Дерево Фенвіка](data_structures/fenwick.md), [дерево відрізків](data_structures/segment_tree.md), [СНМ](data_structures/disjoint_set_union.md), розріджена таблиця, декартове дерево |
| **Динамічне програмування** | [Вступ до ДП](dynamic_programming/intro-to-dp.md), [рюкзак](dynamic_programming/knapsack.md), [НЗП](dynamic_programming/longest_increasing_subsequence.md), оптимізації Кнута та «розділяй і володарюй» |
| **Графи** | [BFS](graph/breadth-first-search.md), [DFS](graph/depth-first-search.md), [Дейкстра](graph/dijkstra.md), MST, LCA, мости й точки зчленування, потоки, парування |
| **Обробка рядків** | [Хешування](string/string-hashing.md), [префікс-функція](string/prefix-function.md), [Z-функція](string/z-function.md), суфіксні масив/автомат/дерево, Ахо-Корасік |
| **Комбінаторика** | [Біноміальні коефіцієнти](combinatorics/binomial-coefficients.md), [числа Каталана](combinatorics/catalan-numbers.md), включення-виключення, лема Бернсайда |
| **Геометрія** | [Базові операції з векторами](geometry/basic-geometry.md), [опукла оболонка](geometry/convex-hull.md), перетини, замітаюча пряма, Делоне |
| **Лінійна алгебра** | [Метод Гауса](linear_algebra/linear-system-gauss.md), ранг матриці, визначник |
| **Чисельні методи** | [Бінарний](num_methods/binary_search.md) і [тернарний](num_methods/ternary_search.md) пошук, метод Ньютона, інтегрування |
| **Інше** | [Теорія ігор](game_theory/games_on_graphs.md), [задача Йосипа](others/josephus_problem.md), розклади, послідовності |

Повний перелік — у бічній панелі **«Статті»**, а добірка найуживаніших інструментів з підказками «коли що брати» — на сторінці [Найпопулярніші алгоритми](popular-algorithms.md).

## З чого почати \{#getting-started}

Якщо ти новачок у змагальному програмуванні, радимо такий маршрут:

1. [Бінарне піднесення до степеня](algebra/binary-exp.md) — класичний перший алгоритм
2. [Алгоритм Евкліда](algebra/euclid-algorithm.md) — НСД за $O(\log n)$
3. [Решето Ератосфена](algebra/sieve-of-eratosthenes.md) — усі прості до $n$
4. [Бінарний пошук](num_methods/binary_search.md) — фундамент половини задач
5. [BFS](graph/breadth-first-search.md) і [DFS](graph/depth-first-search.md) — обходи графів
6. [Вступ до динамічного програмування](dynamic_programming/intro-to-dp.md)
7. [Дерево Фенвіка](data_structures/fenwick.md) — перша «серйозна» структура даних

## Про проєкт \{#about}

Це неофіційний переклад [cp-algorithms.com](https://cp-algorithms.com). Оригінальні статті поширюються за ліцензією CC BY-SA 4.0; переклад зберігає структуру, формули та C++-код оригіналу, додаючи українську термінологію і приклади на Python, TypeScript та Go.

Знайшли помилку в перекладі чи коді? Напишіть нам — а поки сайт молодий, найкраща допомога — поділитися ним із тими, хто вчить алгоритми.
