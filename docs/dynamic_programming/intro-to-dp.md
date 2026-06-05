# Вступ до динамічного програмування

Суть динамічного програмування полягає в тому, щоб уникати повторних обчислень. Часто задачі динамічного програмування природно розв'язуються через рекурсію. У таких випадках найпростіше написати рекурсивний розв'язок, а потім зберігати повторювані стани в таблиці попередніх обчислень. Цей процес відомий як динамічне програмування згори вниз із мемоїзацією. Читається саме «мемоїзація» (так, наче ми пишемо в записничку — memo), а не «меморизація».

:::tip[Чи задача взагалі на динамічне програмування?]
- Чи має задача перекривні підзадачі — тобто наївна рекурсія раз за разом перераховує ті самі стани (як $f(n-1) + f(n-2)$ для Фібоначчі)?
- Чи виконується оптимальна підструктура — оптимальний розв'язок будується з оптимальних розв'язків підзадач?
- Чи кількість унікальних станів поліноміальна (досить мала), щоб усі їх можна було зберегти в таблиці й обчислити кожен один раз?
:::

Один із найбазовіших, класичних прикладів цього процесу — послідовність Фібоначчі. Її рекурсивне формулювання: $f(n) = f(n-1) + f(n-2)$, де $n \ge 2$, $f(0)=0$ і $f(1)=1$

<CodeTabs>

```cpp
int f(int n) {
    if (n == 0) return 0;
    if (n == 1) return 1;
    return f(n - 1) + f(n - 2);
}
```

```python
def f(n: int) -> int:
    if n == 0:
        return 0
    if n == 1:
        return 1
    return f(n - 1) + f(n - 2)
```

```typescript
function f(n: number): number {
  if (n === 0) return 0;
  if (n === 1) return 1;
  return f(n - 1) + f(n - 2);
}
```

```go
func f(n int) int {
	if n == 0 {
		return 0
	}
	if n == 1 {
		return 1
	}
	return f(n-1) + f(n-2)
}
```

</CodeTabs>

Час роботи цієї рекурсивної функції експоненційний — приблизно $O(2^n)$, оскільки один виклик функції ( $f(n)$ ) породжує 2 виклики приблизно такого ж розміру ($f(n-1)$ та $f(n-2)$ ).

## Прискорення Фібоначчі за допомогою динамічного програмування (мемоїзації) \{#speeding-up-fibonacci-with-dynamic-programming-memoization}

Наразі наша рекурсивна функція розв'язує Фібоначчі за експоненційний час. Це означає, що ми можемо обробляти лише невеликі вхідні значення, поки задача не стане надто складною. Наприклад, $f(29)$ породжує *понад 1 мільйон* викликів функції!

Щоб пришвидшити роботу, ми зауважимо, що кількість підзадач становить лише $O(n)$. Тобто, щоб обчислити $f(n)$, нам потрібно знати тільки $f(n-1),f(n-2), \dots ,f(0)$. Тому замість того, щоб перераховувати ці підзадачі, ми розв'язуємо їх один раз, а потім зберігаємо результат у таблиці попередніх обчислень. Подальші виклики використовуватимуть цю таблицю й одразу повертатимуть результат, тим самим прибираючи експоненційну роботу!

Кожен рекурсивний виклик перевірятиме таблицю попередніх обчислень, щоб дізнатися, чи значення вже було обчислене. Це робиться за час $O(1)$. Якщо ми вже обчислили його, повертаємо результат, інакше — обчислюємо функцію звичайним чином. Загальний час роботи становить $O(n)$. Це величезне покращення порівняно з нашим попереднім алгоритмом експоненційного часу!

<CodeTabs>

```cpp
const int MAXN = 100;
bool found[MAXN];
int memo[MAXN];

int f(int n) {
    if (found[n]) return memo[n];
    if (n == 0) return 0;
    if (n == 1) return 1;

    found[n] = true;
    return memo[n] = f(n - 1) + f(n - 2);
}
```

```python
from functools import cache


# @cache автоматично запам'ятовує результати для кожного n,
# тож рекурсію не потрібно обвішувати таблицею вручну.
@cache
def f(n: int) -> int:
    if n == 0:
        return 0
    if n == 1:
        return 1
    return f(n - 1) + f(n - 2)
```

```typescript
const MAXN = 100;
const memo: number[] = new Array(MAXN).fill(-1); // -1 означає «ще не обчислено»

function f(n: number): number {
  if (memo[n] !== -1) return memo[n];
  if (n === 0) return 0;
  if (n === 1) return 1;

  return (memo[n] = f(n - 1) + f(n - 2));
}
```

```go
const MAXN = 100

var (
	found [MAXN]bool
	memo  [MAXN]int
)

func f(n int) int {
	if found[n] {
		return memo[n]
	}
	if n == 0 {
		return 0
	}
	if n == 1 {
		return 1
	}

	found[n] = true
	memo[n] = f(n-1) + f(n-2)
	return memo[n]
}
```

</CodeTabs>

З нашою новою мемоїзованою рекурсивною функцією $f(29)$, яка раніше породжувала *понад 1 мільйон викликів*, тепер призводить *лише до 57* викликів — майже *у 20 000 разів* менше викликів функції! За іронією, тепер нас обмежує наш тип даних. $f(46)$ — це останнє число Фібоначчі, яке вміщається в знаковий 32-бітний цілий тип.

Зазвичай ми намагаємося зберігати стани в масивах, якщо це можливо, оскільки час доступу становить $O(1)$ з мінімальними накладними витратами. Утім, більш узагальнено, ми можемо зберігати стани в будь-який зручний для нас спосіб. Серед інших прикладів — бінарні дерева пошуку (`map` у C++) чи хеш-таблиці (`unordered_map` у C++).

Приклад цього міг би виглядати так:

<CodeTabs>

```cpp
unordered_map<int, int> memo;
int f(int n) {
    if (memo.count(n)) return memo[n];
    if (n == 0) return 0;
    if (n == 1) return 1;

    return memo[n] = f(n - 1) + f(n - 2);
}
```

```python
# Звичайний dict — це і є хеш-таблиця (аналог unordered_map у C++).
memo: dict[int, int] = {}


def f(n: int) -> int:
    if n in memo:
        return memo[n]
    if n == 0:
        return 0
    if n == 1:
        return 1

    memo[n] = f(n - 1) + f(n - 2)
    return memo[n]
```

```typescript
// Map у JS/TS — це хеш-таблиця (аналог unordered_map у C++).
const memo = new Map<number, number>();

function f(n: number): number {
  if (memo.has(n)) return memo.get(n)!;
  if (n === 0) return 0;
  if (n === 1) return 1;

  const res = f(n - 1) + f(n - 2);
  memo.set(n, res);
  return res;
}
```

```go
// map у Go — це хеш-таблиця (аналог unordered_map у C++).
var memo = map[int]int{}

func f(n int) int {
	if v, ok := memo[n]; ok {
		return v
	}
	if n == 0 {
		return 0
	}
	if n == 1 {
		return 1
	}

	memo[n] = f(n-1) + f(n-2)
	return memo[n]
}
```

</CodeTabs>

Або аналогічно:

<CodeTabs>

```cpp
map<int, int> memo;
int f(int n) {
    if (memo.count(n)) return memo[n];
    if (n == 0) return 0;
    if (n == 1) return 1;

    return memo[n] = f(n - 1) + f(n - 2);
}
```

```python
# Python не має вбудованого впорядкованого словника зі складністю O(log n),
# тож тут використовуємо OrderedDict як концептуальний аналог map у C++.
from collections import OrderedDict

memo: "OrderedDict[int, int]" = OrderedDict()


def f(n: int) -> int:
    if n in memo:
        return memo[n]
    if n == 0:
        return 0
    if n == 1:
        return 1

    memo[n] = f(n - 1) + f(n - 2)
    return memo[n]
```

```typescript
// У JS/TS немає впорядкованого дерева пошуку в стандартній бібліотеці,
// тож Map тут грає роль концептуального аналога map у C++.
const memo = new Map<number, number>();

function f(n: number): number {
  if (memo.has(n)) return memo.get(n)!;
  if (n === 0) return 0;
  if (n === 1) return 1;

  const res = f(n - 1) + f(n - 2);
  memo.set(n, res);
  return res;
}
```

```go
// У стандартній бібліотеці Go немає впорядкованого дерева,
// тож звичайний map грає роль аналога map у C++.
var memo = map[int]int{}

func f(n int) int {
	if v, ok := memo[n]; ok {
		return v
	}
	if n == 0 {
		return 0
	}
	if n == 1 {
		return 1
	}

	memo[n] = f(n-1) + f(n-2)
	return memo[n]
}
```

</CodeTabs>

Обидва ці варіанти майже завжди будуть повільнішими за варіант на основі масиву для звичайної мемоїзованої рекурсивної функції.
Ці альтернативні способи збереження стану корисні насамперед тоді, коли в простір станів входять вектори або рядки.

Простий, «на пальцях», спосіб аналізу часу роботи мемоїзованої рекурсивної функції такий:

$$
\text{робота на одну підзадачу} * \text{кількість підзадач}
$$

Використання бінарного дерева пошуку (map у C++) для збереження станів технічно дасть $O(n \log n)$, оскільки кожен пошук та вставка займатимуть $O(\log n)$ роботи, а з $O(n)$ унікальними підзадачами ми отримуємо час $O(n \log n)$.

Цей підхід називається згори вниз, оскільки ми можемо викликати функцію зі значенням-запитом, і обчислення починає рухатися згори (запитаного значення) вниз (до базових випадків рекурсії), роблячи по дорозі скорочення через мемоїзацію.

## Динамічне програмування знизу вгору \{#bottom-up-dynamic-programming}

Досі ви бачили лише динамічне програмування згори вниз із мемоїзацією. Однак ми також можемо розв'язувати задачі динамічним програмуванням знизу вгору.
Знизу вгору — це точна протилежність підходу згори вниз: ви починаєте знизу (з базових випадків рекурсії) і розширюєте його на дедалі більше значень.

Щоб створити підхід знизу вгору для чисел Фібоначчі, ми ініціалізуємо базові випадки в масиві. Потім ми просто застосовуємо рекурсивне означення до масиву:

<CodeTabs>

```cpp
const int MAXN = 100;
int fib[MAXN];

int f(int n) {
    fib[0] = 0;
    fib[1] = 1;
    for (int i = 2; i <= n; i++) fib[i] = fib[i - 1] + fib[i - 2];

    return fib[n];
}
```

```python
def f(n: int) -> int:
    fib = [0] * (n + 1)
    fib[0] = 0
    if n >= 1:
        fib[1] = 1
    for i in range(2, n + 1):
        fib[i] = fib[i - 1] + fib[i - 2]

    return fib[n]
```

```typescript
function f(n: number): number {
  const fib: number[] = new Array(n + 1).fill(0);
  fib[0] = 0;
  if (n >= 1) fib[1] = 1;
  for (let i = 2; i <= n; i++) fib[i] = fib[i - 1] + fib[i - 2];

  return fib[n];
}
```

```go
func f(n int) int {
	fib := make([]int, n+1)
	fib[0] = 0
	if n >= 1 {
		fib[1] = 1
	}
	for i := 2; i <= n; i++ {
		fib[i] = fib[i-1] + fib[i-2]
	}

	return fib[n]
}
```

</CodeTabs>

Звісно, у такому вигляді це трохи безглуздо з двох причин:
По-перше, ми виконуємо повторну роботу, якщо викликаємо функцію більше одного разу.
По-друге, для обчислення поточного елемента нам потрібно використати лише два попередні значення. Тому ми можемо зменшити витрати пам'яті з $O(n)$ до $O(1)$.

Приклад розв'язку для Фібоначчі за допомогою динамічного програмування знизу вгору, який використовує $O(1)$ пам'яті, міг би виглядати так:

<CodeTabs>

```cpp
const int MAX_SAVE = 3;
int fib[MAX_SAVE];

int f(int n) {
    fib[0] = 0;
    fib[1] = 1;
    for (int i = 2; i <= n; i++)
        fib[i % MAX_SAVE] = fib[(i - 1) % MAX_SAVE] + fib[(i - 2) % MAX_SAVE];

    return fib[n % MAX_SAVE];
}
```

```python
MAX_SAVE = 3


def f(n: int) -> int:
    fib = [0] * MAX_SAVE
    fib[0] = 0
    fib[1] = 1
    for i in range(2, n + 1):
        fib[i % MAX_SAVE] = fib[(i - 1) % MAX_SAVE] + fib[(i - 2) % MAX_SAVE]

    return fib[n % MAX_SAVE]
```

```typescript
const MAX_SAVE = 3;

function f(n: number): number {
  const fib: number[] = new Array(MAX_SAVE).fill(0);
  fib[0] = 0;
  fib[1] = 1;
  for (let i = 2; i <= n; i++)
    fib[i % MAX_SAVE] = fib[(i - 1) % MAX_SAVE] + fib[(i - 2) % MAX_SAVE];

  return fib[n % MAX_SAVE];
}
```

```go
const MaxSave = 3

func f(n int) int {
	var fib [MaxSave]int
	fib[0] = 0
	fib[1] = 1
	for i := 2; i <= n; i++ {
		fib[i%MaxSave] = fib[(i-1)%MaxSave] + fib[(i-2)%MaxSave]
	}

	return fib[n%MaxSave]
}
```

</CodeTabs>

Зверніть увагу, що ми змінили константу з `MAXN` на `MAX_SAVE`. Це тому, що загальна кількість елементів, до яких нам потрібен доступ, дорівнює лише 3. Вона більше не масштабується з розміром вхідних даних і, за означенням, є $O(1)$ пам'яті. Крім того, ми використовуємо поширений трюк (за допомогою операції остачі від ділення), зберігаючи лише ті значення, які нам потрібні.

Ось і все. Це і є основи динамічного програмування: не повторюй роботу, яку ти вже зробив.

Один зі способів стати кращим у динамічному програмуванні — вивчити деякі класичні приклади.

## Класичні задачі динамічного програмування \{#classic-dynamic-programming-problems}
| Назва                                          | Опис/Приклад                                                                                                                                                                                                            |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [0-1 Knapsack](../dynamic_programming/knapsack.md)                                   | Дано $N$ предметів із вагами $w_i$ та цінностями $v_i$ і максимальну вагу $W$. Яким є максимальне значення $\sum_{i=1}^{k} v_i$ для кожної підмножини предметів розміру $k$ ($1 \le k \le N$) за умови, що $\sum_{i=1}^{k} w_i \le W$?                  |
| Subset Sum                                     | Дано $N$ цілих чисел та $T$. Визначити, чи існує підмножина даної множини, елементи якої в сумі дають $T$.                                                                                                         |
| [Longest Increasing Subsequence (LIS)](../dynamic_programming/longest_increasing_subsequence.md)           | Вам дано масив із $N$ цілих чисел. Ваше завдання — визначити LIS у масиві, тобто підпослідовність, у якій кожен елемент більший за попередній.                                                       |
| Counting Paths in a 2D Array                   | Дано $N$ та $M$. Підрахувати всі можливі різні шляхи з $(1,1)$ до $(N, M)$, де кожен крок — це або з $(i,j)$ до $(i+1,j)$, або до $(i,j+1)$.                                                                               |
| Longest Common Subsequence                     | Вам дано рядки $s$ та $t$. Знайти довжину найдовшого рядка, що є підпослідовністю одночасно для $s$ і $t$.                                                                                                            |
| Longest Path in a Directed Acyclic Graph (DAG) | Пошук найдовшого шляху в орієнтованому ациклічному графі (DAG).                                                                                                                                                                      |
| Longest Palindromic Subsequence                | Пошук найдовшої паліндромної підпослідовності (LPS) заданого рядка.                                                                                                                                                           |
| Rod Cutting                                    | Дано стрижень довжиною $n$ одиниць. Дано цілочисловий масив cuts, де cuts[i] позначає позицію, у якій слід виконати розріз. Вартість одного розрізу дорівнює довжині стрижня, який розрізають. Якою є мінімальна сумарна вартість розрізів? |
| Edit Distance                                  | Відстань редагування між двома рядками — це мінімальна кількість операцій, потрібних, щоб перетворити один рядок на інший. Операції — це ["Add", "Remove", "Replace"]                                                         |

## Пов'язані теми \{#related-topics}
* [Bitmask Dynamic Programming](../dynamic_programming/profile-dynamics.md)
* Digit Dynamic Programming
* Dynamic Programming on Trees

Звісно, найважливіший трюк — це практика.

## Задачі для практики \{#practice-problems}
* [LeetCode - 1137. N-th Tribonacci Number](https://leetcode.com/problems/n-th-tribonacci-number/description/)
* [LeetCode - 118. Pascal's Triangle](https://leetcode.com/problems/pascals-triangle/description/)
* [LeetCode - 1025. Divisor Game](https://leetcode.com/problems/divisor-game/description/)
* [Codeforces - Vacations](https://codeforces.com/problemset/problem/699/C)
* [Codeforces - Hard problem](https://codeforces.com/problemset/problem/706/C)
* [Codeforces - Zuma](https://codeforces.com/problemset/problem/607/b)
* [LeetCode - 221. Maximal Square](https://leetcode.com/problems/maximal-square/description/)
* [LeetCode - 1039. Minimum Score Triangulation of Polygon](https://leetcode.com/problems/minimum-score-triangulation-of-polygon/description/)

## Контести з ДП \{#dp-contests}
* [Atcoder - Educational DP Contest](https://atcoder.jp/contests/dp/tasks)
* [CSES - Dynamic Programming](https://cses.fi/problemset/list/)

## Відеоматеріали \{#video}

<YouTubeEmbed id="aPQY__2H3tE" title="5 Simple Steps for Solving Dynamic Programming Problems — Reducible" />
