# Стек з мінімумом / черга з мінімумом

У цій статті ми розглянемо три задачі:
спершу ми модифікуємо стек так, щоб можна було знаходити найменший елемент стеку за $O(1)$, потім зробимо те саме з чергою, і нарешті скористаємося цими структурами даних, щоб знаходити мінімум на всіх підмасивах фіксованої довжини в масиві за $O(n)$.

:::tip[Коли підходить цей алгоритм?]
- Чи потрібен мінімум (або максимум) на <Term tip="Відрізок фіксованої довжини, що поступово зсувається масивом: на кожному кроці один елемент додається праворуч, а один зникає ліворуч.">ковзному вікні</Term> фіксованої довжини за сумарний час $O(n)$? *(якщо вікно довільне й змінюється → [дерево відрізків](segment_tree.md) або [розріджена таблиця](sparse-table.md))*
- Чи доступ до елементів відбувається лише з кінців структури за принципом стеку (<Term tip="«Останній прийшов — перший пішов»: дістаємо завжди той елемент, який поклали останнім, як стос тарілок.">LIFO</Term>) або черги (<Term tip="«Перший прийшов — перший пішов»: дістаємо елементи в тому самому порядку, у якому додавали, як черга людей.">FIFO</Term>)?
- Чи достатньо однієї агрегувальної функції ($\min$/$\max$), яку можна підтримувати <Term tip="Оновлювати відповідь поступово, малими крочками: при кожному додаванні чи видаленні одного елемента, не перераховуючи все наново.">інкрементно</Term> при додаванні/видаленні з краю?
:::

## Модифікація стеку \{#stack-modification}

Ми хочемо модифікувати структуру даних «стек» так, щоб можна було знаходити найменший елемент у стеку за час $O(1)$, зберігаючи при цьому ту саму <Term tip="Те, як швидко зростає час роботи зі збільшенням обсягу даних — оцінка швидкості «з точністю до сталих множників», записувана через велике О.">асимптотику</Term> для додавання та видалення елементів зі стеку.
Коротке нагадування: у стеку ми додаємо й видаляємо елементи лише з одного кінця.

Для цього ми зберігатимемо у стеку не лише самі елементи, а зберігатимемо їх парами: сам елемент і мінімум у стеку, починаючи з цього елемента й нижче.

<CodeTabs>

```cpp
stack<pair<int, int>> st;
```

```python
# Стек зберігаємо як звичайний list: append() — додати, pop() — зняти.
# Кожен елемент — кортеж (значення, мінімум від цього елемента й нижче).
st: list[tuple[int, int]] = []
```

```typescript
// У TypeScript стеком слугує масив: push() — додати, pop() — зняти.
// Кожен елемент — пара [значення, мінімум від цього елемента й нижче].
const st: [number, number][] = [];
```

```go
// У Go стек — це слайс: append() — додати, зрізання — зняти.
// Кожен елемент — структура зі значенням та мінімумом від нього й нижче.
type pair struct{ value, min int }
var st []pair
```

</CodeTabs>

Зрозуміло, що знаходження мінімуму в усьому стеку зводиться лише до перегляду значення `stack.top().second`.

Так само очевидно, що додавання чи видалення нового елемента зі стеку можна виконати за сталий час.

Реалізація:

* Додавання елемента:
<CodeTabs>

```cpp
int new_min = st.empty() ? new_elem : min(new_elem, st.top().second);
st.push({new_elem, new_min});
```

```python
new_min = new_elem if not st else min(new_elem, st[-1][1])
st.append((new_elem, new_min))
```

```typescript
const newMin = st.length === 0 ? newElem : Math.min(newElem, st[st.length - 1][1]);
st.push([newElem, newMin]);
```

```go
newMin := newElem
if len(st) > 0 {
	newMin = min(newElem, st[len(st)-1].min)
}
st = append(st, pair{newElem, newMin})
```

</CodeTabs>

* Видалення елемента:
<CodeTabs>

```cpp
int removed_element = st.top().first;
st.pop();
```

```python
removed_element = st[-1][0]
st.pop()
```

```typescript
const removedElement = st[st.length - 1][0];
st.pop();
```

```go
removedElement := st[len(st)-1].value
st = st[:len(st)-1]
```

</CodeTabs>

* Знаходження мінімуму:
<CodeTabs>

```cpp
int minimum = st.top().second;
```

```python
minimum = st[-1][1]
```

```typescript
const minimum = st[st.length - 1][1];
```

```go
minimum := st[len(st)-1].min
```

</CodeTabs>

## Модифікація черги (спосіб 1) \{#queue-modification-method-1}

Тепер ми хочемо досягти тих самих операцій із чергою, тобто ми хочемо додавати елементи в кінець і видаляти їх із початку.

Тут ми розглянемо простий спосіб модифікації черги.
Однак у нього є велика вада, бо модифікована черга насправді не зберігатиме всіх елементів.

Ключова ідея — зберігати в черзі лише ті елементи, які потрібні для визначення мінімуму.
А саме, ми триматимемо чергу в неспадному порядку (тобто найменше значення зберігатиметься на початку) і, звісно, не довільним чином, а так, щоб фактичний мінімум завжди містився в черзі.
У такий спосіб найменший елемент завжди буде на початку черги.
Перед додаванням нового елемента до черги достатньо зробити «зріз»:
ми видалимо всі хвостові елементи черги, які більші за новий елемент, а потім додамо новий елемент до черги.
Так ми не порушуємо порядку черги, а також не втрачаємо поточний елемент, якщо на якомусь наступному кроці він виявиться мінімумом.
Усі елементи, які ми видалили, ніколи не зможуть самі бути мінімумом, тому така операція дозволена.
Коли ми хочемо витягнути елемент з початку, його там насправді може й не бути (бо ми видалили його раніше при додаванні меншого елемента).
Тому при видаленні елемента з черги нам потрібно знати значення цього елемента.
Якщо на початку черги стоїть елемент із таким самим значенням, ми можемо безпечно його видалити, інакше нічого не робимо.

Розгляньмо реалізації наведених вище операцій:

<CodeTabs>

```cpp
deque<int> q;
```

```python
from collections import deque

q: deque[int] = deque()
```

```typescript
// У TypeScript немає вбудованої деки. Використовуємо масив із вказівником head
// на початок: shift() мав би складність O(n), тож натомість зсуваємо head.
// back/pop_back — це q[q.length-1] та q.pop().
const q: number[] = [];
let head = 0;
```

```go
// У Go немає вбудованої деки. Беремо слайс і head-індекс на початок:
// видалення з фронту — це зсув head (без копіювання), додавання/зняття з кінця — append/зрізання.
var q []int
head := 0
```

</CodeTabs>

Зверніть увагу: у Python `collections.deque` дає $O(1)$ для обох кінців, а от у TypeScript та Go вбудованої деки немає — щоб уникнути $O(n)$-зсуву масиву при видаленні з фронту, ми тримаємо окремий індекс `head` на початок «живої» частини.

* Знаходження мінімуму:
<CodeTabs>

```cpp
int minimum = q.front();
```

```python
minimum = q[0]
```

```typescript
const minimum = q[head];
```

```go
minimum := q[head]
```

</CodeTabs>

* Додавання елемента:
<CodeTabs>

```cpp
while (!q.empty() && q.back() > new_element)
    q.pop_back();
q.push_back(new_element);
```

```python
while q and q[-1] > new_element:
    q.pop()
q.append(new_element)
```

```typescript
while (head < q.length && q[q.length - 1] > newElement)
  q.pop();
q.push(newElement);
```

```go
for head < len(q) && q[len(q)-1] > newElement {
	q = q[:len(q)-1]
}
q = append(q, newElement)
```

</CodeTabs>

* Видалення елемента:
<CodeTabs>

```cpp
if (!q.empty() && q.front() == remove_element)
    q.pop_front();
```

```python
if q and q[0] == remove_element:
    q.popleft()
```

```typescript
if (head < q.length && q[head] === removeElement)
  head++;
```

```go
if head < len(q) && q[head] == removeElement {
	head++
}
```

</CodeTabs>

Зрозуміло, що в середньому всі ці операції займають лише $O(1)$ часу (бо кожен елемент може бути доданий і вилучений лише один раз).

## Модифікація черги (спосіб 2) \{#queue-modification-method-2}

Це модифікація способу 1.
Ми хочемо мати змогу видаляти елементи, не знаючи, який саме елемент маємо видалити.
Цього можна досягти, зберігаючи в черзі індекс для кожного елемента.
А ще ми пам'ятаємо, скільки елементів уже додали та видалили.

<CodeTabs>

```cpp
deque<pair<int, int>> q;
int cnt_added = 0;
int cnt_removed = 0;
```

```python
from collections import deque

q: deque[tuple[int, int]] = deque()  # пари (значення, індекс)
cnt_added = 0
cnt_removed = 0
```

```typescript
// Знову масив із head-індексом замість деки; елементи — пари [значення, індекс].
const q: [number, number][] = [];
let head = 0;
let cntAdded = 0;
let cntRemoved = 0;
```

```go
// Слайс пар (значення, індекс) із head-індексом замість деки.
var q []pair // pair{value, index}
head := 0
cntAdded := 0
cntRemoved := 0
```

</CodeTabs>

* Знаходження мінімуму:
<CodeTabs>

```cpp
int minimum = q.front().first;
```

```python
minimum = q[0][0]
```

```typescript
const minimum = q[head][0];
```

```go
minimum := q[head].value
```

</CodeTabs>

* Додавання елемента:
<CodeTabs>

```cpp
while (!q.empty() && q.back().first > new_element)
    q.pop_back();
q.push_back({new_element, cnt_added});
cnt_added++;
```

```python
while q and q[-1][0] > new_element:
    q.pop()
q.append((new_element, cnt_added))
cnt_added += 1
```

```typescript
while (head < q.length && q[q.length - 1][0] > newElement)
  q.pop();
q.push([newElement, cntAdded]);
cntAdded++;
```

```go
for head < len(q) && q[len(q)-1].value > newElement {
	q = q[:len(q)-1]
}
q = append(q, pair{newElement, cntAdded})
cntAdded++
```

</CodeTabs>

* Видалення елемента:
<CodeTabs>

```cpp
if (!q.empty() && q.front().second == cnt_removed) 
    q.pop_front();
cnt_removed++;
```

```python
if q and q[0][1] == cnt_removed:
    q.popleft()
cnt_removed += 1
```

```typescript
if (head < q.length && q[head][1] === cntRemoved)
  head++;
cntRemoved++;
```

```go
if head < len(q) && q[head].index == cntRemoved {
	head++
}
cntRemoved++
```

</CodeTabs>

## Модифікація черги (спосіб 3) \{#queue-modification-method-3}

Тут ми розглянемо ще один спосіб модифікувати чергу, щоб знаходити мінімум за $O(1)$.
Цей спосіб дещо складніший у реалізації, але цього разу ми насправді зберігаємо всі елементи.
А ще ми можемо видаляти елемент із початку, не знаючи його значення.

Ідея полягає в тому, щоб звести задачу до задачі про стеки, яку ми вже розв'язали.
Отже, нам потрібно лише навчитися моделювати чергу за допомогою двох стеків.

Ми створюємо два стеки, `s1` і `s2`.
Звісно, ці стеки будуть у модифікованій формі, щоб ми могли знаходити мінімум за $O(1)$.
Нові елементи ми додаватимемо до стеку `s1`, а видалятимемо елементи зі стеку `s2`.
Якщо в якийсь момент стек `s2` порожній, ми переносимо всі елементи з `s1` до `s2` (що по суті змінює порядок цих елементів на протилежний).
Нарешті, знаходження мінімуму в черзі зводиться просто до знаходження мінімуму обох стеків.

Таким чином, ми виконуємо всі операції в середньому за $O(1)$ (кожен елемент буде один раз доданий до стеку `s1`, один раз перенесений до `s2` й один раз вилучений із `s2`).

Реалізація:

<CodeTabs>

```cpp
stack<pair<int, int>> s1, s2;
```

```python
# Два стеки-списки; кожен елемент — пара (значення, мінімум від нього й нижче).
s1: list[tuple[int, int]] = []
s2: list[tuple[int, int]] = []
```

```typescript
// Два стеки-масиви; елемент — пара [значення, мінімум від нього й нижче].
const s1: [number, number][] = [];
const s2: [number, number][] = [];
```

```go
// Два стеки-слайси; елемент — пара зі значенням і мінімумом від нього й нижче.
var s1, s2 []pair // pair{value, min}
```

</CodeTabs>

* Знаходження мінімуму:
<CodeTabs>

```cpp
if (s1.empty() || s2.empty()) 
    minimum = s1.empty() ? s2.top().second : s1.top().second;
else
    minimum = min(s1.top().second, s2.top().second);
```

```python
if not s1 or not s2:
    minimum = s2[-1][1] if not s1 else s1[-1][1]
else:
    minimum = min(s1[-1][1], s2[-1][1])
```

```typescript
let minimum: number;
if (s1.length === 0 || s2.length === 0)
  minimum = s1.length === 0 ? s2[s2.length - 1][1] : s1[s1.length - 1][1];
else
  minimum = Math.min(s1[s1.length - 1][1], s2[s2.length - 1][1]);
```

```go
var minimum int
if len(s1) == 0 || len(s2) == 0 {
	if len(s1) == 0 {
		minimum = s2[len(s2)-1].min
	} else {
		minimum = s1[len(s1)-1].min
	}
} else {
	minimum = min(s1[len(s1)-1].min, s2[len(s2)-1].min)
}
```

</CodeTabs>

* Додавання елемента:
<CodeTabs>

```cpp
int minimum = s1.empty() ? new_element : min(new_element, s1.top().second);
s1.push({new_element, minimum});
```

```python
minimum = new_element if not s1 else min(new_element, s1[-1][1])
s1.append((new_element, minimum))
```

```typescript
const minimum = s1.length === 0 ? newElement : Math.min(newElement, s1[s1.length - 1][1]);
s1.push([newElement, minimum]);
```

```go
minimum := newElement
if len(s1) > 0 {
	minimum = min(newElement, s1[len(s1)-1].min)
}
s1 = append(s1, pair{newElement, minimum})
```

</CodeTabs>

* Видалення елемента:
<CodeTabs>

```cpp
if (s2.empty()) {
    while (!s1.empty()) {
        int element = s1.top().first;
        s1.pop();
        int minimum = s2.empty() ? element : min(element, s2.top().second);
        s2.push({element, minimum});
    }
}
int remove_element = s2.top().first;
s2.pop();
```

```python
if not s2:
    while s1:
        element = s1[-1][0]
        s1.pop()
        minimum = element if not s2 else min(element, s2[-1][1])
        s2.append((element, minimum))
remove_element = s2[-1][0]
s2.pop()
```

```typescript
if (s2.length === 0) {
  while (s1.length > 0) {
    const element = s1[s1.length - 1][0];
    s1.pop();
    const minimum = s2.length === 0 ? element : Math.min(element, s2[s2.length - 1][1]);
    s2.push([element, minimum]);
  }
}
const removeElement = s2[s2.length - 1][0];
s2.pop();
```

```go
if len(s2) == 0 {
	for len(s1) > 0 {
		element := s1[len(s1)-1].value
		s1 = s1[:len(s1)-1]
		minimum := element
		if len(s2) > 0 {
			minimum = min(element, s2[len(s2)-1].min)
		}
		s2 = append(s2, pair{element, minimum})
	}
}
removeElement := s2[len(s2)-1].value
s2 = s2[:len(s2)-1]
```

</CodeTabs>

## Знаходження мінімуму на всіх підмасивах фіксованої довжини \{#finding-the-minimum-for-all-subarrays-of-fixed-length}

Припустимо, нам дано масив $A$ довжини $N$ і задане $M \le N$.
Нам потрібно знайти мінімум кожного підмасиву довжини $M$ у цьому масиві, тобто нам потрібно знайти:

$$
\min_{0 \le i \le M-1} A[i], \min_{1 \le i \le M} A[i], \min_{2 \le i \le M+1} A[i],~\dots~, \min_{N-M \le i \le N-1} A[i]
$$

Нам потрібно розв'язати цю задачу за лінійний час, тобто $O(n)$.

Для розв'язання задачі ми можемо скористатися будь-якою з трьох модифікованих черг.
Розв'язки мають бути зрозумілими:
ми додаємо перші $M$ елементів масиву, знаходимо й виводимо їхній мінімум, потім додаємо до черги наступний елемент і видаляємо перший елемент масиву, знаходимо й виводимо мінімум і так далі.
Оскільки всі операції з чергою виконуються в середньому за сталий час, складність усього алгоритму буде $O(n)$.

## Задачі для практики \{#practice-problems}
* [Queries with Fixed Length](https://www.hackerrank.com/challenges/queries-with-fixed-length/problem)
* [Sliding Window Minimum](https://cses.fi/problemset/task/3221)
* [Binary Land](https://www.codechef.com/MAY20A/problems/BINLAND)


## Відеоматеріали \{#video}

<YouTubeEmbed id="DfljaUwZsOk" title="Sliding Window Maximum - Monotonic Queue - Leetcode 239 — NeetCode" />
