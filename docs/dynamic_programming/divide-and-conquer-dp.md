# ДП «розділяй і володарюй»

«Розділяй і володарюй» — це оптимізація динамічного програмування.

### Передумови \{#preconditions}
Деякі задачі динамічного програмування мають рекурентне співвідношення такого вигляду:

$$
dp(i, j) = \min_{0 \leq k \leq j} \\{ dp(i - 1, k - 1) + C(k, j) \\}
$$

де $C(k, j)$ — функція вартості, а $dp(i, j) = 0$ при $j \lt 0$.

Нехай $0 \leq i \lt m$ і $0 \leq j \lt n$, а обчислення $C$ займає $O(1)$
часу. Тоді прямолінійне обчислення наведеного рекурентного співвідношення дає $O(m n^2)$. Маємо
$m \times n$ станів і $n$ переходів для кожного стану.

Нехай $opt(i, j)$ — це значення $k$, яке мінімізує наведений вираз. Припускаючи, що
функція вартості задовольняє нерівність чотирикутника, ми можемо показати, що
$opt(i, j) \leq opt(i, j + 1)$ для всіх $i, j$. Це відоме як _умова монотонності_.
Тоді ми можемо застосувати ДП «розділяй і володарюй». Точка оптимального розбиття
для фіксованого $i$ зростає зі зростанням $j$.

Це дозволяє нам обчислити всі стани ефективніше. Нехай ми обчислили $opt(i, j)$
для деяких фіксованих $i$ та $j$. Тоді для будь-якого $j' < j$ ми знаємо, що $opt(i, j') \leq opt(i, j)$.
Це означає, що під час обчислення $opt(i, j')$ нам не доведеться розглядати так багато
точок розбиття!

Щоб мінімізувати час роботи, ми застосуємо ідею «розділяй і володарюй». Спершу
обчислимо $opt(i, n / 2)$. Потім обчислимо $opt(i, n / 4)$, знаючи, що воно менше
або дорівнює $opt(i, n / 2)$, та $opt(i, 3 n / 4)$, знаючи, що воно
більше або дорівнює $opt(i, n / 2)$. Рекурсивно відстежуючи
нижню та верхню межі для $opt$, ми досягаємо часу роботи $O(m n \log n)$.
Деталі реалізації дивіться у коді нижче.

Щоб довести складність «розділяй і володарюй», спершу зауважимо, що
в рекурсії є $O(\log{n})$ рівнів. Ми стверджуємо, що на кожному рівні виконується $O(n)$
кроків. Нехай сумарна довжина інтервалів $\text{opt}$ (позначених
$optl$ та $optr$ у коді) на $k$-му рівні дорівнює $S_k$, і зауважимо, що щоразу,
коли інтервал з рівня $k$ довжини $x$ розбивається, отримані інтервали
мають сумарну довжину щонайбільше $x + 1$. Крім того, на рівні $k$ виконується щонайбільше $2^k$ розбиттів,
тож маємо $S_{k + 1} \leq S_k + 2^k$. Застосовуючи цю оцінку
індуктивно з $S_0 = n$, отримуємо, що для кожного рівня $k$,

$$
S_k < n + 2^k \in O(n).
$$

Таким чином, складність кожного «розділяй і володарюй» — $O(n\log{n})$, а складність
усього обчислення ДП — $O(mn\log{n})$.

## Загальна реалізація \{#generic-implementation}

Хоч реалізація і змінюється залежно від задачі, ось доволі загальний
шаблон.
Функція `compute` обчислює один рядок $i$ станів `dp_cur`, маючи попередній рядок $i-1$ станів `dp_before`.
Її слід викликати як `compute(0, n-1, 0, n-1)`. Функція `solve` обчислює `m` рядків і повертає результат.

<CodeTabs>

```cpp
int m, n;
vector<long long> dp_before, dp_cur;

long long C(int i, int j);

// обчислюємо dp_cur[l], ... dp_cur[r] (включно)
void compute(int l, int r, int optl, int optr) {
    if (l > r)
        return;

    int mid = (l + r) >> 1;
    pair<long long, int> best = {LLONG_MAX, -1};

    for (int k = optl; k <= min(mid, optr); k++) {
        best = min(best, {(k ? dp_before[k - 1] : 0) + C(k, mid), k});
    }

    dp_cur[mid] = best.first;
    int opt = best.second;

    compute(l, mid - 1, optl, opt);
    compute(mid + 1, r, opt, optr);
}

long long solve() {
    dp_before.assign(n,0);
    dp_cur.assign(n,0);

    for (int i = 0; i < n; i++)
        dp_before[i] = C(0, i);

    for (int i = 1; i < m; i++) {
        compute(0, n - 1, 0, n - 1);
        dp_before = dp_cur;
    }

    return dp_before[n - 1];
}
```

```python
import sys

m: int = 0
n: int = 0
dp_before: list[int] = []
dp_cur: list[int] = []


def C(i: int, j: int) -> int:
    ...


# обчислюємо dp_cur[l], ... dp_cur[r] (включно)
def compute(l: int, r: int, optl: int, optr: int) -> None:
    if l > r:
        return

    mid = (l + r) >> 1
    # best тримає пару (вартість, точка розбиття)
    best = (float("inf"), -1)

    for k in range(optl, min(mid, optr) + 1):
        cur = (dp_before[k - 1] if k else 0) + C(k, mid)
        best = min(best, (cur, k))

    dp_cur[mid] = best[0]
    opt = best[1]

    compute(l, mid - 1, optl, opt)
    compute(mid + 1, r, opt, optr)


def solve() -> int:
    global dp_before, dp_cur
    dp_before = [0] * n
    dp_cur = [0] * n

    for i in range(n):
        dp_before[i] = C(0, i)

    for _ in range(1, m):
        # глибина рекурсії compute — лише O(log n) (ділимо інтервал навпіл),
        # тож стандартного ліміту рекурсії Python достатньо
        compute(0, n - 1, 0, n - 1)
        dp_before = dp_cur[:]

    return dp_before[n - 1]
```

```typescript
let m: number, n: number;
let dpBefore: number[] = [];
let dpCur: number[] = [];

function C(i: number, j: number): number {
  // ...
  return 0;
}

// обчислюємо dpCur[l], ... dpCur[r] (включно)
function compute(l: number, r: number, optl: number, optr: number): void {
  if (l > r) return;

  const mid = (l + r) >> 1;
  let bestCost = Infinity;
  let bestK = -1;

  for (let k = optl; k <= Math.min(mid, optr); k++) {
    const cur = (k ? dpBefore[k - 1] : 0) + C(k, mid);
    if (cur < bestCost) {
      bestCost = cur;
      bestK = k;
    }
  }

  dpCur[mid] = bestCost;
  const opt = bestK;

  compute(l, mid - 1, optl, opt);
  compute(mid + 1, r, opt, optr);
}

function solve(): number {
  dpBefore = new Array(n).fill(0);
  dpCur = new Array(n).fill(0);

  for (let i = 0; i < n; i++) dpBefore[i] = C(0, i);

  for (let i = 1; i < m; i++) {
    compute(0, n - 1, 0, n - 1);
    dpBefore = dpCur.slice();
  }

  return dpBefore[n - 1];
}
```

```go
package main

var m, n int
var dpBefore, dpCur []int64

func C(i, j int) int64

// обчислюємо dpCur[l], ... dpCur[r] (включно)
func compute(l, r, optl, optr int) {
	if l > r {
		return
	}

	mid := (l + r) >> 1
	const inf = int64(1) << 62
	bestCost := inf
	bestK := -1

	hi := mid
	if optr < hi {
		hi = optr
	}
	for k := optl; k <= hi; k++ {
		var prev int64
		if k > 0 {
			prev = dpBefore[k-1]
		}
		cur := prev + C(k, mid)
		if cur < bestCost {
			bestCost = cur
			bestK = k
		}
	}

	dpCur[mid] = bestCost
	opt := bestK

	compute(l, mid-1, optl, opt)
	compute(mid+1, r, opt, optr)
}

func solve() int64 {
	dpBefore = make([]int64, n)
	dpCur = make([]int64, n)

	for i := 0; i < n; i++ {
		dpBefore[i] = C(0, i)
	}

	for i := 1; i < m; i++ {
		compute(0, n-1, 0, n-1)
		copy(dpBefore, dpCur)
	}

	return dpBefore[n-1]
}
```

</CodeTabs>

### На що звернути увагу \{#things-to-look-out-for}

Найбільша складність у задачах на ДП «розділяй і володарюй» — це довести
монотонність $opt$. Один окремий випадок, коли вона виконується, — це коли функція вартості задовольняє нерівність чотирикутника, тобто $C(a, c) + C(b, d) \leq C(a, d) + C(b, c)$ для всіх $a \leq b \leq c \leq d$.
Багато задач на ДП «розділяй і володарюй» можна також розв'язати за допомогою трюку з опуклою оболонкою (Convex Hull trick) і навпаки. Корисно знати й розуміти
обидва підходи!

## Задачі для практики \{#practice-problems}
- [AtCoder - Yakiniku Restaurants](https://atcoder.jp/contests/arc067/tasks/arc067_d)
- [CodeForces - Ciel and Gondolas](https://codeforces.com/contest/321/problem/E) (Будьте обережні з введенням/виведенням!)
- [CodeForces - Levels And Regions](https://codeforces.com/problemset/problem/673/E)
- [CodeForces - Partition Game](https://codeforces.com/contest/1527/problem/E)
- [CodeForces - The Bakery](https://codeforces.com/problemset/problem/834/D)
- [CodeForces - Yet Another Minimization Problem](https://codeforces.com/contest/868/problem/F)
- [Codechef - CHEFAOR](https://www.codechef.com/problems/CHEFAOR)
- [CodeForces - GUARDS](https://codeforces.com/gym/103536/problem/A) (Це саме та задача, що розглядається у цій статті.)
- [Hackerrank - Guardians of the Lunatics](https://www.hackerrank.com/contests/ioi-2014-practice-contest-2/challenges/guardians-lunatics-ioi14)
- [Hackerrank - Mining](https://www.hackerrank.com/contests/world-codesprint-5/challenges/mining)
- [Kattis - Money (ACM ICPC World Finals 2017)](https://open.kattis.com/problems/money)
- [SPOJ - ADAMOLD](https://www.spoj.com/problems/ADAMOLD/)
- [SPOJ - LARMY](https://www.spoj.com/problems/LARMY/)
- [SPOJ - NKLEAVES](https://www.spoj.com/problems/NKLEAVES/)
- [Timus - Bicolored Horses](https://acm.timus.ru/problem.aspx?space=1&num=1167)
- [USACO - Circular Barn](https://usaco.org/index.php?page=viewproblem2&cpid=626)
- [UVA - Arranging Heaps](https://onlinejudge.org/external/125/12524.pdf)
- [UVA - Naming Babies](https://onlinejudge.org/external/125/12594.pdf)



## References \{#references}
- [Quora Answer by Michael Levin](https://www.quora.com/What-is-divide-and-conquer-optimization-in-dynamic-programming)
- [Video Tutorial by "Sothe" the Algorithm Wolf](https://www.youtube.com/watch?v=wLXEWuDWnzI)
