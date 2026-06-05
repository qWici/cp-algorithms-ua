# Довга арифметика

Довга арифметика, також відома як «bignum» або просто «арифметика довільної точності» — це набір структур даних та алгоритмів, які дозволяють обробляти значно більші числа, ніж ті, що вміщаються у стандартні типи даних. Нижче наведено кілька різновидів довгої арифметики.

## Класична довга арифметика цілих чисел \{#classical-integer-long-arithmetic}

Основна ідея полягає в тому, що число зберігається як масив його «розрядів» у деякій системі числення. Найчастіше використовують такі основи: десяткову, степені десятки ($10^4$ або $10^9$) та двійкову.

Операції над числами в такому вигляді виконуються за «шкільними» алгоритмами додавання, віднімання, множення та ділення стовпчиком. Також можна застосовувати швидкі алгоритми множення: швидке перетворення Фур'є та алгоритм Карацуби.

Тут ми описуємо довгу арифметику лише для невід'ємних цілих чисел. Щоб поширити ці алгоритми на роботу з від'ємними числами, потрібно ввести й підтримувати додатковий прапорець «від'ємне число» або використовувати представлення цілих чисел у доповняльному коді (two's complement).

### Структура даних \{#data-structure}

Ми зберігатимемо числа як `vector<int>`, у якому кожен елемент — окремий «розряд» числа.

<CodeTabs>

```cpp
typedef vector<int> lnum;
```

```python
# У Python int нативно довгий (необмежена точність), тож окремий тип не потрібен.
# Для навчання відтворюємо представлення зі статті: число — список «розрядів».
lnum = list  # list[int]
```

```typescript
// У TypeScript є вбудований BigInt, але тут заради навчання
// відтворюємо представлення зі статті: число — масив «розрядів».
type Lnum = number[];
```

```go
// У Go є пакет math/big, але тут заради навчання
// відтворюємо представлення зі статті: число — зріз «розрядів».
type Lnum = []int
```

</CodeTabs>

Щоб підвищити швидкодію, ми використаємо $10^9$ як основу, тож кожен «розряд» довгого числа міститиме одразу 9 десяткових цифр.

<CodeTabs>

```cpp
const int base = 1000*1000*1000;
```

```python
base = 1000 * 1000 * 1000
```

```typescript
const base = 1000 * 1000 * 1000;
```

```go
const base = 1000 * 1000 * 1000
```

</CodeTabs>

Розряди зберігатимуться в порядку від молодшого до старшого. Усі операції реалізовані так, що після кожної з них результат не містить жодних провідних нулів, за умови, що операнди теж не мали провідних нулів. Усі операції, які можуть дати число з провідними нулями, мають супроводжуватися кодом, що їх видаляє. Зауважимо, що в такому представленні є два допустимі записи числа нуль: порожній вектор та вектор з єдиним нульовим розрядом.

### Виведення \{#output}

Вивести довге ціле число — найпростіша операція. Спочатку ми виводимо останній елемент вектора (або 0, якщо вектор порожній), а потім решту елементів, доповнених за потреби провідними нулями до рівно 9 цифр.

<CodeTabs>

```cpp
printf ("%d", a.empty() ? 0 : a.back());
for (int i=(int)a.size()-2; i>=0; --i)
	printf ("%09d", a[i]);
```

```python
# Старший розряд — без доповнення, решта — рівно по 9 цифр з провідними нулями.
res = str(a[-1] if a else 0)
for i in range(len(a) - 2, -1, -1):
    res += "%09d" % a[i]
print(res)
```

```typescript
// Старший розряд — без доповнення, решта — рівно по 9 цифр з провідними нулями.
let res = String(a.length ? a[a.length - 1] : 0);
for (let i = a.length - 2; i >= 0; i--) res += String(a[i]).padStart(9, "0");
console.log(res);
```

```go
// Старший розряд — без доповнення, решта — рівно по 9 цифр з провідними нулями.
res := "0"
if len(a) > 0 {
	res = strconv.Itoa(a[len(a)-1])
}
for i := len(a) - 2; i >= 0; i-- {
	res += fmt.Sprintf("%09d", a[i])
}
fmt.Print(res)
```

</CodeTabs>

Зауважимо, що ми зводимо `a.size()` до цілого типу, щоб уникнути недостачі (underflow) беззнакового цілого, якщо вектор містить менше ніж 2 елементи.

### Введення \{#input}

Щоб прочитати довге ціле число, зчитуємо його запис у `string`, а потім перетворюємо його на «розряди»:

<CodeTabs>

```cpp
for (int i=(int)s.length(); i>0; i-=9)
	if (i < 9)
		a.push_back (atoi (s.substr (0, i).c_str()));
	else
		a.push_back (atoi (s.substr (i-9, 9).c_str()));
```

```python
# Ріжемо рядок справа наліво шматками по 9 цифр (молодші розряди — першими).
i = len(s)
while i > 0:
    if i < 9:
        a.append(int(s[0:i]))
    else:
        a.append(int(s[i-9:i]))
    i -= 9
```

```typescript
// Ріжемо рядок справа наліво шматками по 9 цифр (молодші розряди — першими).
for (let i = s.length; i > 0; i -= 9) {
  if (i < 9) a.push(parseInt(s.substring(0, i), 10));
  else a.push(parseInt(s.substring(i - 9, i), 10));
}
```

```go
// Ріжемо рядок справа наліво шматками по 9 цифр (молодші розряди — першими).
for i := len(s); i > 0; i -= 9 {
	var v int
	if i < 9 {
		v, _ = strconv.Atoi(s[0:i])
	} else {
		v, _ = strconv.Atoi(s[i-9 : i])
	}
	a = append(a, v)
}
```

</CodeTabs>

Якщо замість `string` використати масив `char`, код буде ще коротшим:

<CodeTabs>

```cpp
for (int i=(int)strlen(s); i>0; i-=9) {
	s[i] = 0;
	a.push_back (atoi (i>=9 ? s+i-9 : s));
}
```

```python
# У Python немає окремих C-рядків (char*), тому цей трюк зі зрізами
# еквівалентний попередньому варіанту — наведено лише для повноти.
i = len(s)
while i > 0:
    a.append(int(s[max(0, i - 9):i]))
    i -= 9
```

```typescript
// У TypeScript немає C-рядків (char*); зріз рядка дає той самий результат.
for (let i = s.length; i > 0; i -= 9) {
  a.push(parseInt(s.substring(Math.max(0, i - 9), i), 10));
}
```

```go
// У Go немає C-рядків (char*); зріз рядка дає той самий результат.
for i := len(s); i > 0; i -= 9 {
	j := i - 9
	if j < 0 {
		j = 0
	}
	v, _ := strconv.Atoi(s[j:i])
	a = append(a, v)
}
```

</CodeTabs>

Якщо вхідні дані можуть містити провідні нулі, їх можна видалити так:

<CodeTabs>

```cpp
while (a.size() > 1 && a.back() == 0)
	a.pop_back();
```

```python
while len(a) > 1 and a[-1] == 0:
    a.pop()
```

```typescript
while (a.length > 1 && a[a.length - 1] === 0) a.pop();
```

```go
for len(a) > 1 && a[len(a)-1] == 0 {
	a = a[:len(a)-1]
}
```

</CodeTabs>

### Додавання \{#addition}

Збільшуємо довге ціле число $a$ на $b$ і зберігаємо результат у $a$:

<CodeTabs>

```cpp
int carry = 0;
for (size_t i=0; i<max(a.size(),b.size()) || carry; ++i) {
	if (i == a.size())
		a.push_back (0);
	a[i] += carry + (i < b.size() ? b[i] : 0);
	carry = a[i] >= base;
	if (carry)  a[i] -= base;
}
```

```python
# На практиці в Python вистачає a + b; нижче — навчальне додавання «стовпчиком».
carry = 0
i = 0
while i < max(len(a), len(b)) or carry:
    if i == len(a):
        a.append(0)
    a[i] += carry + (b[i] if i < len(b) else 0)
    carry = 1 if a[i] >= base else 0
    if carry:
        a[i] -= base
    i += 1
```

```typescript
let carry = 0;
for (let i = 0; i < Math.max(a.length, b.length) || carry; i++) {
  if (i === a.length) a.push(0);
  a[i] += carry + (i < b.length ? b[i] : 0);
  carry = a[i] >= base ? 1 : 0;
  if (carry) a[i] -= base;
}
```

```go
carry := 0
for i := 0; i < len(a) || i < len(b) || carry != 0; i++ {
	if i == len(a) {
		a = append(a, 0)
	}
	bv := 0
	if i < len(b) {
		bv = b[i]
	}
	a[i] += carry + bv
	if a[i] >= base {
		carry = 1
		a[i] -= base
	} else {
		carry = 0
	}
}
```

</CodeTabs>

### Віднімання \{#subtraction}

Зменшуємо довге ціле число $a$ на $b$ ($a \ge b$) і зберігаємо результат у $a$:

<CodeTabs>

```cpp
int carry = 0;
for (size_t i=0; i<b.size() || carry; ++i) {
	a[i] -= carry + (i < b.size() ? b[i] : 0);
	carry = a[i] < 0;
	if (carry)  a[i] += base;
}
while (a.size() > 1 && a.back() == 0)
	a.pop_back();
```

```python
# Передбачається a >= b. На практиці в Python достатньо a - b.
carry = 0
i = 0
while i < len(b) or carry:
    a[i] -= carry + (b[i] if i < len(b) else 0)
    carry = 1 if a[i] < 0 else 0
    if carry:
        a[i] += base
    i += 1
while len(a) > 1 and a[-1] == 0:
    a.pop()
```

```typescript
// Передбачається a >= b.
let carry = 0;
for (let i = 0; i < b.length || carry; i++) {
  a[i] -= carry + (i < b.length ? b[i] : 0);
  carry = a[i] < 0 ? 1 : 0;
  if (carry) a[i] += base;
}
while (a.length > 1 && a[a.length - 1] === 0) a.pop();
```

```go
// Передбачається a >= b.
carry := 0
for i := 0; i < len(b) || carry != 0; i++ {
	bv := 0
	if i < len(b) {
		bv = b[i]
	}
	a[i] -= carry + bv
	if a[i] < 0 {
		carry = 1
		a[i] += base
	} else {
		carry = 0
	}
}
for len(a) > 1 && a[len(a)-1] == 0 {
	a = a[:len(a)-1]
}
```

</CodeTabs>

Зауважимо, що після виконання віднімання ми видаляємо провідні нулі, щоб дотримуватися умови, за якою наші довгі числа не мають провідних нулів.

### Множення на коротке ціле \{#multiplication-by-short-integer}

Множимо довге ціле число $a$ на коротке ціле $b$ ($b < base$) і зберігаємо результат у $a$:

<CodeTabs>

```cpp
int carry = 0;
for (size_t i=0; i<a.size() || carry; ++i) {
	if (i == a.size())
		a.push_back (0);
	long long cur = carry + a[i] * 1ll * b;
	a[i] = int (cur % base);
	carry = int (cur / base);
}
while (a.size() > 1 && a.back() == 0)
	a.pop_back();
```

```python
# b < base. У Python проміжний добуток не переповнюється — int необмежений.
carry = 0
i = 0
while i < len(a) or carry:
    if i == len(a):
        a.append(0)
    cur = carry + a[i] * b
    a[i] = cur % base
    carry = cur // base
    i += 1
while len(a) > 1 and a[-1] == 0:
    a.pop()
```

```typescript
// b < base. Проміжний добуток може перевищити 2^53, тож рахуємо через BigInt.
let carry = 0;
for (let i = 0; i < a.length || carry; i++) {
  if (i === a.length) a.push(0);
  const cur = BigInt(carry) + BigInt(a[i]) * BigInt(b);
  a[i] = Number(cur % BigInt(base));
  carry = Number(cur / BigInt(base));
}
while (a.length > 1 && a[a.length - 1] === 0) a.pop();
```

```go
// b < base. Проміжний добуток рахуємо в int64, аби не переповнити int32-діапазон.
carry := 0
for i := 0; i < len(a) || carry != 0; i++ {
	if i == len(a) {
		a = append(a, 0)
	}
	cur := int64(carry) + int64(a[i])*int64(b)
	a[i] = int(cur % base)
	carry = int(cur / base)
}
for len(a) > 1 && a[len(a)-1] == 0 {
	a = a[:len(a)-1]
}
```

</CodeTabs>

Додаткова оптимізація: якщо швидкодія надзвичайно важлива, можна спробувати замінити два ділення на одне, знайшовши лише цілий результат ділення (змінну `carry`), а потім використати його для пошуку остачі через множення. Зазвичай це робить код швидшим, хоча й не кардинально.

### Множення на довге ціле \{#multiplication-by-long-integer}

Множимо довгі цілі числа $a$ і $b$ та зберігаємо результат у $c$:

<CodeTabs>

```cpp
lnum c (a.size()+b.size());
for (size_t i=0; i<a.size(); ++i)
	for (int j=0, carry=0; j<(int)b.size() || carry; ++j) {
		long long cur = c[i+j] + a[i] * 1ll * (j < (int)b.size() ? b[j] : 0) + carry;
		c[i+j] = int (cur % base);
		carry = int (cur / base);
	}
while (c.size() > 1 && c.back() == 0)
	c.pop_back();
```

```python
# Множення «стовпчиком». На практиці в Python достатньо a * b.
c = [0] * (len(a) + len(b))
for i in range(len(a)):
    carry = 0
    j = 0
    while j < len(b) or carry:
        cur = c[i + j] + a[i] * (b[j] if j < len(b) else 0) + carry
        c[i + j] = cur % base
        carry = cur // base
        j += 1
while len(c) > 1 and c[-1] == 0:
    c.pop()
```

```typescript
// Проміжні добутки рахуємо через BigInt (можуть перевищити 2^53).
const c: number[] = new Array(a.length + b.length).fill(0);
for (let i = 0; i < a.length; i++) {
  let carry = 0n;
  for (let j = 0; j < b.length || carry; j++) {
    const cur = BigInt(c[i + j]) + BigInt(a[i]) * BigInt(j < b.length ? b[j] : 0) + carry;
    c[i + j] = Number(cur % BigInt(base));
    carry = cur / BigInt(base);
  }
}
while (c.length > 1 && c[c.length - 1] === 0) c.pop();
```

```go
// Проміжні добутки рахуємо в int64.
c := make([]int, len(a)+len(b))
for i := 0; i < len(a); i++ {
	carry := int64(0)
	for j := 0; j < len(b) || carry != 0; j++ {
		bv := int64(0)
		if j < len(b) {
			bv = int64(b[j])
		}
		cur := int64(c[i+j]) + int64(a[i])*bv + carry
		c[i+j] = int(cur % base)
		carry = cur / base
	}
}
for len(c) > 1 && c[len(c)-1] == 0 {
	c = c[:len(c)-1]
}
```

</CodeTabs>

### Ділення на коротке ціле \{#division-by-short-integer}

Ділимо довге ціле число $a$ на коротке ціле $b$ ($b < base$), зберігаємо цілий результат у $a$, а остачу — в `carry`:

<CodeTabs>

```cpp
int carry = 0;
for (int i=(int)a.size()-1; i>=0; --i) {
	long long cur = a[i] + carry * 1ll * base;
	a[i] = int (cur / b);
	carry = int (cur % b);
}
while (a.size() > 1 && a.back() == 0)
	a.pop_back();
```

```python
# b < base. Йдемо від старших розрядів; в кінці carry — остача.
carry = 0
for i in range(len(a) - 1, -1, -1):
    cur = a[i] + carry * base
    a[i] = cur // b
    carry = cur % b
while len(a) > 1 and a[-1] == 0:
    a.pop()
```

```typescript
// b < base. Проміжне cur може перевищити 2^53, тож рахуємо через BigInt.
let carry = 0;
for (let i = a.length - 1; i >= 0; i--) {
  const cur = BigInt(a[i]) + BigInt(carry) * BigInt(base);
  a[i] = Number(cur / BigInt(b));
  carry = Number(cur % BigInt(b));
}
while (a.length > 1 && a[a.length - 1] === 0) a.pop();
```

```go
// b < base. Проміжне cur рахуємо в int64; в кінці carry — остача.
carry := 0
for i := len(a) - 1; i >= 0; i-- {
	cur := int64(a[i]) + int64(carry)*base
	a[i] = int(cur / int64(b))
	carry = int(cur % int64(b))
}
for len(a) > 1 && a[len(a)-1] == 0 {
	a = a[:len(a)-1]
}
```

</CodeTabs>

## Довга арифметика цілих чисел у вигляді розкладу на множники \{#long-integer-arithmetic-for-factorization-representation}

Ідея полягає в тому, щоб зберігати ціле число як його розклад на множники, тобто степені простих чисел, які його ділять.

Цей підхід дуже легко реалізувати, і він дозволяє легко виконувати множення та ділення (асимптотично швидше за класичний метод), але не додавання чи віднімання. Він також дуже економний щодо пам'яті порівняно з класичним підходом.

Цей метод часто використовують для обчислень за модулем непростого числа M; у цьому випадку число зберігається як степені дільників числа M, які його ділять, плюс остача за модулем M.

## Довга арифметика цілих чисел за простими модулями (алгоритм Гарнера) \{#long-integer-arithmetic-in-prime-modulos-garner-algorithm}

Ідея полягає в тому, щоб обрати набір простих чисел (зазвичай досить малих, щоб вони вміщалися у стандартний цілий тип даних) і зберігати ціле число як вектор остач від ділення цього числа на кожне з цих простих чисел.

Китайська теорема про остачі стверджує, що такого представлення достатньо, щоб однозначно відновити будь-яке число від 0 до добутку цих простих чисел мінус один. [Алгоритм Гарнера](garners-algorithm.md) дозволяє відновити число з такого представлення у звичайне ціле.

Цей метод дозволяє заощадити пам'ять порівняно з класичним підходом (хоча економія й не така кардинальна, як у представленні через розклад на множники). Крім того, він дозволяє виконувати швидке додавання, віднімання та множення за час, пропорційний кількості простих чисел, використаних як модулі (реалізацію див. у статті [Китайська теорема про остачі](chinese-remainder-theorem.md)).

Компроміс полягає в тому, що перетворення цілого числа назад у звичайний вигляд доволі трудомістке й вимагає реалізації класичної довгої арифметики з множенням. До того ж цей метод не підтримує ділення.

## Довга арифметика дробів \{#fractional-arbitrary-precision-arithmetic}

Дроби трапляються на змаганнях з програмування рідше за цілі числа, а довгу арифметику набагато складніше реалізувати для дробів, тож на змаганнях з програмування фігурує лише невелика підмножина довгої арифметики дробів.

### Арифметика в нескоротних дробах \{#arithmetic-in-irreducible-fractions}

Число представляється як нескоротний дріб $\frac{a}{b}$, де $a$ і $b$ — цілі числа. Усі операції над дробами можна представити як операції над цілими чисельниками та знаменниками цих дробів. Зазвичай це вимагає використання класичної довгої арифметики для зберігання чисельника та знаменника, але іноді достатньо вбудованого 64-бітного цілого типу даних.

### Зберігання позиції плаваючої коми як окремого типу \{#storing-floating-point-position-as-separate-type}

Іноді задача вимагає роботи з дуже малими або дуже великими числами, не допускаючи переповнення (overflow) чи недостачі (underflow). Вбудований тип даних double використовує 8–10 байтів і допускає значення експоненти в діапазоні $[-308; 308]$, чого іноді може бути недостатньо.

Підхід дуже простий: для зберігання значення експоненти використовується окрема ціла змінна, і після кожної операції число з плаваючою комою нормалізується, тобто повертається до інтервалу $[0.1; 1)$ шляхом відповідного коригування експоненти.

Коли два такі числа множаться або діляться, їхні експоненти слід відповідно додати або відняти. Коли числа додаються або віднімаються, їх спочатку треба звести до спільної експоненти, помноживши одне з них на 10 у степені, що дорівнює різниці значень експонент.

Насамкінець зауважимо, що основа експоненти не обов'язково має дорівнювати 10. З огляду на внутрішнє представлення чисел з плаваючою комою, найдоцільніше використовувати 2 як основу експоненти.

## Задачі для практики \{#practice-problems}


* [UVA - How Many Fibs?](https://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=1124)
* [UVA - Product](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=1047)
* [UVA - Maximum Sub-sequence Product](https://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=728)
* [SPOJ - Fast Multiplication](http://www.spoj.com/problems/MUL/en/)
* [SPOJ - GCD2](http://www.spoj.com/problems/GCD2/)
* [UVA - Division](https://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=1024)
* [UVA - Fibonacci Freeze](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=436)
* [UVA - Krakovia](https://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=1866)
* [UVA - Simplifying Fractions](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=1755)
* [UVA - 500!](https://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=564)
* [Hackerrank - Factorial digit sum](https://www.hackerrank.com/contests/projecteuler/challenges/euler020/problem)
* [UVA - Immortal Rabbits](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=4803)
* [SPOJ - 0110SS](http://www.spoj.com/problems/IWGBS/)
* [Codeforces - Notepad](http://codeforces.com/contest/17/problem/D)
