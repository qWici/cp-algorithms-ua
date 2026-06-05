# Динамічне програмування за зламаним профілем. Задача «Паркет»

До типових задач, які розв'язують за допомогою <Term tip="Прийом, коли ґратку заповнюють клітинка за клітинкою, а стан описує лише нерівну межу («профіль») між уже заповненою і ще порожньою частиною.">ДП за зламаним профілем</Term>, належать:

- знаходження кількості способів повністю заповнити певну область (наприклад, шахову дошку чи ґратку) деякими фігурами (наприклад, доміно)
- знаходження способу заповнити область мінімальною кількістю фігур
- знаходження часткового заповнення з мінімальною кількістю незаповненого простору (або клітинок, якщо йдеться про ґратку)
- знаходження часткового заповнення з мінімальною кількістю фігур таким чином, щоб додати ще хоча б одну фігуру було вже неможливо

:::tip[Коли підходить цей алгоритм?]
- Чи потрібно замостити/заповнити ґратку фігурами (доміно, тримі тощо) і підрахувати способи або оптимізувати заповнення?
- Чи одна зі сторін ґратки $M$ мала (зазвичай $M \lesssim 15..20$), щоб <Term tip="Рядок ґратки, закодований числом: кожен біт відповідає одній клітинці, а 1 або 0 показує, заповнена вона чи ні.">маска рядка</Term> з $2^M$ станів вмістилася в пам'ять і час?
- Чи стан рядка повністю визначається межею («профілем») із попереднім рядком, а не глобальною конфігурацією всієї ґратки? *(якщо $M$ велике й обидві сторони великі → задача стає значно складнішою і потребує інших методів)*
:::

## Задача «Паркет» \{#problem-parquet}

**Опис задачі.** Задано ґратку розміру $N \times M$. Знайдіть кількість способів заповнити цю ґратку фігурами розміру $2 \times 1$ (жодна клітинка не повинна лишитися незаповненою, і фігури не повинні перекриватися).

Нехай стан ДП буде таким: $dp[i, mask]$, де $i = 1, \ldots N$ і $mask = 0, \ldots 2^M - 1$.

$i$ позначає кількість рядків у поточній ґратці, а $mask$ — це стан останнього рядка поточної ґратки. Якщо $j$-й біт маски $mask$ дорівнює $0$, то відповідна клітинка заповнена, інакше вона незаповнена.

Очевидно, що відповіддю до задачі буде $dp[N, 0]$.

Ми будуватимемо стан ДП, перебираючи кожне $i = 1, \cdots N$ і кожну маску $mask = 0, \ldots 2^M - 1$, і для кожної маски $mask$ ми робитимемо <Term tip="Спосіб обчислення, коли від поточного стану ми оновлюємо наступні стани (а не збираємо відповідь із попередніх). Тут це означає, що ми додаємо фігури вперед по ґратці.">переходи лише вперед</Term>, тобто ми _додаватимемо_ фігури до поточної ґратки.

### Реалізація \{#implementation}

<CodeTabs>

```cpp
int n, m;
vector < vector<long long> > dp;


void calc (int x = 0, int y = 0, int mask = 0, int next_mask = 0)
{
	if (x == n)
		return;
	if (y >= m)
		dp[x+1][next_mask] += dp[x][mask];
	else
	{
		int my_mask = 1 << y;
		if (mask & my_mask)
			calc (x, y+1, mask, next_mask);
		else
		{
			calc (x, y+1, mask, next_mask | my_mask);
			if (y+1 < m && ! (mask & my_mask) && ! (mask & (my_mask << 1)))
				calc (x, y+2, mask, next_mask);
		}
	}
}


int main()
{
	cin >> n >> m;

	dp.resize (n+1, vector<long long> (1<<m));
	dp[0][0] = 1;
	for (int x=0; x<n; ++x)
		for (int mask=0; mask<(1<<m); ++mask)
			calc (x, 0, mask, 0);

	cout << dp[n][0];

}
```

```python
import sys

n: int
m: int
# Цілі числа Python мають довільну точність, тож переповнення тут неможливе.
dp: list[list[int]]


def calc(x: int = 0, y: int = 0, mask: int = 0, next_mask: int = 0) -> None:
    if x == n:
        return
    if y >= m:
        dp[x + 1][next_mask] += dp[x][mask]
    else:
        my_mask = 1 << y
        if mask & my_mask:
            calc(x, y + 1, mask, next_mask)
        else:
            calc(x, y + 1, mask, next_mask | my_mask)
            if y + 1 < m and not (mask & my_mask) and not (mask & (my_mask << 1)):
                calc(x, y + 2, mask, next_mask)


def main() -> None:
    global n, m, dp
    data = sys.stdin.read().split()
    n, m = int(data[0]), int(data[1])

    # Збільшуємо ліміт рекурсії, бо calc рекурсивно проходить по всіх клітинках рядка.
    sys.setrecursionlimit(10000)
    dp = [[0] * (1 << m) for _ in range(n + 1)]
    dp[0][0] = 1
    for x in range(n):
        for mask in range(1 << m):
            calc(x, 0, mask, 0)

    print(dp[n][0])


if __name__ == "__main__":
    main()
```

```typescript
// number у TypeScript безпечно тримає цілі до 2^53 − 1; для типових розмірів
// ґратки цього вистачає. За потреби більших значень слід узяти bigint.
let n: number;
let m: number;
let dp: number[][];

function calc(x = 0, y = 0, mask = 0, nextMask = 0): void {
  if (x === n) return;
  if (y >= m) {
    dp[x + 1][nextMask] += dp[x][mask];
  } else {
    const myMask = 1 << y;
    if (mask & myMask) {
      calc(x, y + 1, mask, nextMask);
    } else {
      calc(x, y + 1, mask, nextMask | myMask);
      if (y + 1 < m && !(mask & myMask) && !(mask & (myMask << 1))) {
        calc(x, y + 2, mask, nextMask);
      }
    }
  }
}

function main(): void {
  const data = require("fs").readFileSync(0, "utf8").trim().split(/\s+/);
  n = Number(data[0]);
  m = Number(data[1]);

  dp = Array.from({ length: n + 1 }, () => new Array<number>(1 << m).fill(0));
  dp[0][0] = 1;
  for (let x = 0; x < n; x++) {
    for (let mask = 0; mask < (1 << m); mask++) {
      calc(x, 0, mask, 0);
    }
  }

  console.log(dp[n][0]);
}

main();
```

```go
package main

import (
	"bufio"
	"fmt"
	"os"
)

var (
	n, m int
	// int64 вистачає для типових розмірів ґратки; кількість замощень
	// росте швидко, тож для дуже великих N×M потрібен math/big.
	dp [][]int64
)

func calc(x, y, mask, nextMask int) {
	if x == n {
		return
	}
	if y >= m {
		dp[x+1][nextMask] += dp[x][mask]
	} else {
		myMask := 1 << y
		if mask&myMask != 0 {
			calc(x, y+1, mask, nextMask)
		} else {
			calc(x, y+1, mask, nextMask|myMask)
			if y+1 < m && mask&myMask == 0 && mask&(myMask<<1) == 0 {
				calc(x, y+2, mask, nextMask)
			}
		}
	}
}

func main() {
	reader := bufio.NewReader(os.Stdin)
	fmt.Fscan(reader, &n, &m)

	dp = make([][]int64, n+1)
	for i := range dp {
		dp[i] = make([]int64, 1<<m)
	}
	dp[0][0] = 1
	for x := 0; x < n; x++ {
		for mask := 0; mask < (1 << m); mask++ {
			calc(x, 0, mask, 0)
		}
	}

	fmt.Println(dp[n][0])
}
```

</CodeTabs>

## Задачі для практики \{#practice-problems}

- [UVA 10359 - Tiling](https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=1300)
- [UVA 10918 - Tri Tiling](https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=1859)
- [SPOJ GNY07H (Four Tiling)](https://www.spoj.com/problems/GNY07H/)
- [SPOJ M5TILE (Five Tiling)](https://www.spoj.com/problems/M5TILE/)
- [SPOJ MNTILE (MxN Tiling)](https://www.spoj.com/problems/MNTILE/)
- [SPOJ DOJ1](https://www.spoj.com/problems/DOJ1/)
- [SPOJ DOJ2](https://www.spoj.com/problems/DOJ2/)
- [SPOJ BTCODE_J](https://www.spoj.com/problems/BTCODE_J/)
- [SPOJ PBOARD](https://www.spoj.com/problems/PBOARD/)
- [ACM HDU 4285 - Circuits](http://acm.hdu.edu.cn/showproblem.php?pid=4285)
- [LiveArchive 4608 - Mosaic](https://vjudge.net/problem/UVALive-4608)
- [Timus 1519 - Formula 1](https://acm.timus.ru/problem.aspx?space=1&num=1519)
- [Codeforces Parquet](https://codeforces.com/problemset/problem/26/C)

## Джерела \{#references}

- [Blog by EvilBunny](https://web.archive.org/web/20180712171735/https://blog.evilbuggy.com/2018/05/broken-profile-dynamic-programming.html)
- [TopCoder Recipe by "syg96"](https://apps.topcoder.com/forums/?module=Thread&start=0&threadID=697369)
- [Blogpost by sk765](http://sk765.blogspot.com/2012/02/dynamic-programming-with-profile.html)
