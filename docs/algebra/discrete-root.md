# Дискретний корінь

Задача знаходження дискретного кореня формулюється так. Дано просте число $n$ і два цілих числа $a$ та $k$; потрібно знайти всі $x$, для яких:

$x^k \equiv a \pmod n$

:::tip[Коли підходить цей алгоритм?]
- Чи задача просить знайти основу $x$ у рівнянні $x^k \equiv a \pmod n$? *(якщо натомість невідомий показник → [Дискретний логарифм](discrete-log.md))*
- Чи модуль $n$ **простий** (метод спирається на існування <Term tip="Таке число g, що його степені за модулем n по черзі дають усі ненульові остачі від 1 до n-1, перш ніж почати повторюватися.">первісного кореня</Term>)? *(якщо ні → потрібні узагальнення через первісний корінь за степенем простого; див. [Первісний корінь](primitive-root.md))*
- Чи модуль $n$ достатньо малий, щоб вкладений крок дискретного логарифма $O(\sqrt{n}\log n)$ був прийнятним?
:::

## Алгоритм \{#the-algorithm}

Ми розв'яжемо цю задачу, звівши її до [задачі дискретного логарифма](discrete-log.md).

Скористаймося поняттям [первісного кореня](primitive-root.md) за модулем $n$. Нехай $g$ — первісний корінь за модулем $n$. Зауважимо, що оскільки $n$ просте, він обов'язково існує, і його можна знайти за $O(Ans \cdot \log \phi (n) \cdot \log n) = O(Ans \cdot \log^2 n)$ плюс час на <Term tip="Розклад числа на прості множники, тобто пошук простих чисел, добуток яких дає це число.">факторизацію</Term> $\phi (n)$.

Випадок $a = 0$ легко відкинути. У цьому випадку відповідь, очевидно, єдина: $x = 0$.

Оскільки ми знаємо, що $n$ просте, і будь-яке число від 1 до $n-1$ можна подати як степінь первісного кореня, ми можемо переписати задачу про дискретний корінь так:

$(g^y)^k \equiv a \pmod n$

де

$x \equiv g^y \pmod n$

Це, своєю чергою, можна переписати як

$(g^k)^y \equiv a \pmod n$

Тепер ми маємо одне невідоме $y$, а це задача дискретного логарифма. Розв'язок можна знайти за допомогою алгоритму великих і малих кроків Шенкса (baby-step giant-step) за $O(\sqrt {n} \log n)$ (або переконатися, що розв'язків немає).

Знайшовши один розв'язок $y_0$, одним із розв'язків задачі про дискретний корінь буде $x_0 = g^{y_0} \pmod n$.

## Знаходження всіх розв'язків з одного відомого \{#finding-all-solutions-from-one-known-solution}

Щоб розв'язати поставлену задачу повністю, нам потрібно знайти всі розв'язки, знаючи один із них: $x_0 = g^{y_0} \pmod n$.

Пригадаймо, що первісний корінь завжди має <Term tip="Порядок числа за модулем — це найменший додатний степінь, у якому це число дає остачу 1.">порядок</Term> $\phi (n)$, тобто найменший степінь $g$, який дає 1, — це $\phi (n)$. Тому якщо ми додамо до показника доданок $\phi (n)$, то отримаємо те саме значення:

$x^k \equiv g^{ y_0 \cdot k + l \cdot \phi (n)} \equiv a \pmod n \forall l \in Z$

Отже, усі розв'язки мають вигляд:

$x = g^{y_0 + \frac {l \cdot \phi (n)}{k}} \pmod n \forall l \in Z$.

де $l$ обрано так, щоб дріб був цілим числом. Аби це виконувалося, чисельник має ділитися на <Term tip="Найменше додатне число, що ділиться націло на кожне із заданих чисел.">найменше спільне кратне</Term> $\phi (n)$ і $k$. Пам'ятаючи, що найменше спільне кратне двох чисел $lcm(a, b) = \frac{a \cdot b}{gcd(a, b)}$, отримаємо

$x = g^{y_0 + i \frac {\phi (n)}{gcd(k, \phi (n))}} \pmod n \forall i \in Z$.

Це остаточна формула для всіх розв'язків задачі про дискретний корінь.

## Реалізація \{#implementation}

Нижче наведено повну реалізацію, що включає процедури знаходження первісного кореня, дискретного логарифма, а також знаходження та виведення всіх розв'язків.

<CodeTabs>

```cpp
int gcd(int a, int b) {
	return a ? gcd(b % a, a) : b;
}
 
int powmod(int a, int b, int p) {
	int res = 1;
	while (b > 0) {
		if (b & 1) {
			res = res * a % p;
		}
		a = a * a % p;
		b >>= 1;
	}
	return res;
}
 
// Знаходить первісний корінь за модулем p
int generator(int p) {
	vector<int> fact;
	int phi = p-1, n = phi;
	for (int i = 2; i * i <= n; ++i) {
		if (n % i == 0) {
			fact.push_back(i);
			while (n % i == 0)
				n /= i;
		}
	}
	if (n > 1)
		fact.push_back(n);
 
	for (int res = 2; res <= p; ++res) {
		bool ok = true;
		for (int factor : fact) {
			if (powmod(res, phi / factor, p) == 1) {
				ok = false;
				break;
			}
		}
		if (ok) return res;
	}
	return -1;
}
 
// Ця програма знаходить усі числа x такі, що x^k = a (mod n)
int main() {
	int n, k, a;
	scanf("%d %d %d", &n, &k, &a);
	if (a == 0) {
		puts("1\n0");
		return 0;
	}
 
	int g = generator(n);
 
	// Алгоритм дискретного логарифма великих і малих кроків (baby-step giant-step)
	int sq = (int) sqrt (n + .0) + 1;
	vector<pair<int, int>> dec(sq);
	for (int i = 1; i <= sq; ++i)
		dec[i-1] = {powmod(g, i * sq * k % (n - 1), n), i};
	sort(dec.begin(), dec.end());
	int any_ans = -1;
	for (int i = 0; i < sq; ++i) {
		int my = powmod(g, i * k % (n - 1), n) * a % n;
		auto it = lower_bound(dec.begin(), dec.end(), make_pair(my, 0));
		if (it != dec.end() && it->first == my) {
			any_ans = it->second * sq - i;
			break;
		}
	}
	if (any_ans == -1) {
		puts("0");
		return 0;
	}
 
	// Виводимо всі можливі відповіді
	int delta = (n-1) / gcd(k, n-1);
	vector<int> ans;
	for (int cur = any_ans % delta; cur < n-1; cur += delta)
		ans.push_back(powmod(g, cur, n));
	sort(ans.begin(), ans.end());
	printf("%d\n", ans.size());
	for (int answer : ans)
		printf("%d ", answer);
}
```

```python
import sys
from math import isqrt, gcd


def powmod(a: int, b: int, p: int) -> int:
    # піднесення до степеня за модулем; у Python є вбудоване pow(a, b, p)
    return pow(a, b, p)


# Знаходить первісний корінь за модулем p
def generator(p: int) -> int:
    fact = []
    phi = p - 1
    n = phi
    i = 2
    while i * i <= n:
        if n % i == 0:
            fact.append(i)
            while n % i == 0:
                n //= i
        i += 1
    if n > 1:
        fact.append(n)

    for res in range(2, p + 1):
        if all(powmod(res, phi // factor, p) != 1 for factor in fact):
            return res
    return -1


# Знаходить усі числа x такі, що x^k = a (mod n)
def main() -> None:
    n, k, a = map(int, sys.stdin.read().split())
    if a == 0:
        print("1")
        print("0")
        return

    g = generator(n)

    # Алгоритм дискретного логарифма великих і малих кроків (baby-step giant-step)
    sq = isqrt(n) + 1
    # dec[значення] = найбільший i (як у C++ після сортування за value, i зростає)
    dec = {}
    for i in range(1, sq + 1):
        dec[powmod(g, i * sq * k % (n - 1), n)] = i

    any_ans = -1
    for i in range(sq):
        my = powmod(g, i * k % (n - 1), n) * a % n
        if my in dec:
            any_ans = dec[my] * sq - i
            break

    if any_ans == -1:
        print("0")
        return

    # Виводимо всі можливі відповіді
    delta = (n - 1) // gcd(k, n - 1)
    ans = []
    cur = any_ans % delta
    while cur < n - 1:
        ans.append(powmod(g, cur, n))
        cur += delta
    ans.sort()
    print(len(ans))
    print(" ".join(map(str, ans)))


main()
```

```typescript
// для модульної арифметики з множенням використовуємо bigint,
// щоб уникнути переповнення при a * a та i * sq * k

function powmod(a: bigint, b: bigint, p: bigint): bigint {
  let res = 1n;
  a %= p;
  while (b > 0n) {
    if (b & 1n) res = (res * a) % p;
    a = (a * a) % p;
    b >>= 1n;
  }
  return res;
}

function gcd(a: bigint, b: bigint): bigint {
  return a ? gcd(b % a, a) : b;
}

// Знаходить первісний корінь за модулем p
function generator(p: bigint): bigint {
  const fact: bigint[] = [];
  const phi = p - 1n;
  let n = phi;
  for (let i = 2n; i * i <= n; ++i) {
    if (n % i === 0n) {
      fact.push(i);
      while (n % i === 0n) n /= i;
    }
  }
  if (n > 1n) fact.push(n);

  for (let res = 2n; res <= p; ++res) {
    let ok = true;
    for (const factor of fact) {
      if (powmod(res, phi / factor, p) === 1n) {
        ok = false;
        break;
      }
    }
    if (ok) return res;
  }
  return -1n;
}

// Знаходить усі числа x такі, що x^k = a (mod n)
function discreteRoot(n: bigint, k: bigint, a: bigint): bigint[] | null {
  if (a === 0n) return [0n];

  const g = generator(n);

  // Алгоритм дискретного логарифма великих і малих кроків (baby-step giant-step)
  const sq = BigInt(Math.floor(Math.sqrt(Number(n)))) + 1n;
  // dec[значення] = i (перебираємо i зростаюче, тож зберігаємо найбільший)
  const dec = new Map<bigint, bigint>();
  for (let i = 1n; i <= sq; ++i) {
    dec.set(powmod(g, (i * sq * k) % (n - 1n), n), i);
  }

  let anyAns = -1n;
  for (let i = 0n; i < sq; ++i) {
    const my = (powmod(g, (i * k) % (n - 1n), n) * a) % n;
    const found = dec.get(my);
    if (found !== undefined) {
      anyAns = found * sq - i;
      break;
    }
  }

  if (anyAns === -1n) return null;

  // Збираємо всі можливі відповіді
  const delta = (n - 1n) / gcd(k, n - 1n);
  const ans: bigint[] = [];
  for (let cur = anyAns % delta; cur < n - 1n; cur += delta) {
    ans.push(powmod(g, cur, n));
  }
  ans.sort((x, y) => (x < y ? -1 : x > y ? 1 : 0));
  return ans;
}
```

```go
package main

import (
	"fmt"
	"math"
	"sort"
)

func gcd(a, b int) int {
	if a != 0 {
		return gcd(b%a, a)
	}
	return b
}

func powmod(a, b, p int) int {
	res := 1
	a %= p
	for b > 0 {
		if b&1 == 1 {
			res = res * a % p
		}
		a = a * a % p
		b >>= 1
	}
	return res
}

// Знаходить первісний корінь за модулем p
func generator(p int) int {
	var fact []int
	phi := p - 1
	n := phi
	for i := 2; i*i <= n; i++ {
		if n%i == 0 {
			fact = append(fact, i)
			for n%i == 0 {
				n /= i
			}
		}
	}
	if n > 1 {
		fact = append(fact, n)
	}

	for res := 2; res <= p; res++ {
		ok := true
		for _, factor := range fact {
			if powmod(res, phi/factor, p) == 1 {
				ok = false
				break
			}
		}
		if ok {
			return res
		}
	}
	return -1
}

// Знаходить усі числа x такі, що x^k = a (mod n)
func main() {
	var n, k, a int
	fmt.Scan(&n, &k, &a)
	if a == 0 {
		fmt.Println("1")
		fmt.Println("0")
		return
	}

	g := generator(n)

	// Алгоритм дискретного логарифма великих і малих кроків (baby-step giant-step)
	sq := int(math.Sqrt(float64(n))) + 1
	// dec[значення] = i (перебираємо i зростаюче, тож зберігаємо найбільший)
	dec := make(map[int]int)
	for i := 1; i <= sq; i++ {
		dec[powmod(g, i*sq*k%(n-1), n)] = i
	}

	anyAns := -1
	for i := 0; i < sq; i++ {
		my := powmod(g, i*k%(n-1), n) * a % n
		if found, ok := dec[my]; ok {
			anyAns = found*sq - i
			break
		}
	}

	if anyAns == -1 {
		fmt.Println("0")
		return
	}

	// Виводимо всі можливі відповіді
	delta := (n - 1) / gcd(k, n-1)
	var ans []int
	for cur := anyAns % delta; cur < n-1; cur += delta {
		ans = append(ans, powmod(g, cur, n))
	}
	sort.Ints(ans)
	fmt.Println(len(ans))
	for _, answer := range ans {
		fmt.Printf("%d ", answer)
	}
	fmt.Println()
}
```

</CodeTabs>

## Задачі для практики \{#practice-problems}

* [Codeforces - Lunar New Year and a Recursive Sequence](https://codeforces.com/contest/1106/problem/F)
