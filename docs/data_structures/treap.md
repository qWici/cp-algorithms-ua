# Декартове дерево (treap, Cartesian tree)

Декартове дерево (treap) — це структура даних, яка поєднує бінарне дерево й бінарну купу (звідси й назва: tree + heap $\Rightarrow$ Treap).

Точніше, декартове дерево — це структура даних, яка зберігає пари $(X, Y)$ у бінарному дереві так, що воно є бінарним деревом пошуку за $X$ і бінарною купою за $Y$.
Якщо деякий вузол дерева містить значення $(X_0, Y_0)$, то всі вузли в лівому піддереві мають $X \leq X_0$, усі вузли в правому піддереві мають $X_0 \leq X$, а всі вузли і в лівому, і в правому піддеревах мають $Y \leq Y_0$.

Декартове дерево часто називають «декартовим деревом» саме тому, що його легко вкласти в декартову площину:

<center> <img src="https://upload.wikimedia.org/wikipedia/commons/e/e4/Treap.svg" width="350px" /> </center>

Декартове дерево запропонували Raimund Siedel і Cecilia Aragon у 1989 році.

## Переваги такої організації даних \{#advantages-of-such-data-organisation}

У такій реалізації значення $X$ є ключами (і водночас значеннями, що зберігаються в трипі), а значення $Y$ називають **пріоритетами**. Без пріоритетів декартове дерево було б звичайним бінарним деревом пошуку за $X$, і одному набору значень $X$ могло б відповідати багато різних дерев, деякі з яких вироджені (наприклад, у вигляді зв'язного списку), а отже надзвичайно повільні (основні операції мали б складність $O(N)$).

Водночас **пріоритети** (коли вони унікальні) дозволяють **однозначно** задати дерево, яке буде побудоване (і, звісно, воно не залежить від порядку, у якому додавалися значення), що можна довести за допомогою відповідної теореми. Очевидно, що якщо **обирати пріоритети випадково**, то в середньому ми отримуватимемо невироджені дерева, що забезпечить складність $O(\log N)$ для основних операцій. Звідси й інша назва цієї структури даних — **рандомізоване бінарне дерево пошуку**.

## Операції \{#operations}

Декартове дерево надає такі операції:

- **Insert (X,Y)** за $O(\log N)$.  
  Додає новий вузол у дерево. Один з можливих варіантів — передавати лише $X$, а $Y$ генерувати випадково всередині операції.
- **Search (X)** за $O(\log N)$.  
  Шукає вузол із заданим значенням ключа $X$. Реалізація така сама, як і для звичайного бінарного дерева пошуку.
- **Erase (X)** за $O(\log N)$.  
  Шукає вузол із заданим значенням ключа $X$ і видаляє його з дерева.
- **Build ($X_1$, ..., $X_N$)** за $O(N)$.  
  Будує дерево зі списку значень. Це можна зробити за лінійний час (за умови, що $X_1, ..., X_N$ відсортовані).
- **Union ($T_1$, $T_2$)** за $O(M \log (N/M))$.  
  Зливає два дерева, припускаючи, що всі елементи різні. Тієї самої складності можна досягти й тоді, коли під час злиття потрібно вилучати дублікати.
- **Intersect ($T_1$, $T_2$)** за $O(M \log (N/M))$.  
  Знаходить перетин двох дерев (тобто їхні спільні елементи). Реалізацію цієї операції ми тут не розглядатимемо.

Крім того, оскільки декартове дерево є бінарним деревом пошуку, у ньому можна реалізувати й інші операції, наприклад знаходження $K$-го за величиною елемента або знаходження індексу елемента.

## Опис реалізації \{#implementation-description}

З точки зору реалізації, кожен вузол містить $X$, $Y$ і вказівники на лівого ($L$) та правого ($R$) нащадків.

Усі потрібні операції ми реалізуємо за допомогою лише двох допоміжних операцій: розділення (Split) і злиття (Merge).

### Розділення (Split) \{#split}

<center> <img src="https://upload.wikimedia.org/wikipedia/commons/6/69/Treap_split.svg" width="450px" /> </center>

**Split ($T$, $X$)** розбиває дерево $T$ на 2 піддерева $L$ і $R$ (які є значеннями, що повертаються розділенням) так, що $L$ містить усі елементи з ключем $X_L \le X$, а $R$ містить усі елементи з ключем $X_R > X$. Ця операція має складність $O (\log N)$ і реалізується чистою рекурсією:

1. Якщо значення кореневого вузла (R) $\le X$, то `L` міститиме принаймні `R->L` і `R`. Тоді ми викликаємо розділення на `R->R` і позначаємо результат його розділення як `L'` і `R'`. Зрештою, `L` також міститиме `L'`, тоді як `R = R'`.
2. Якщо значення кореневого вузла (R) $> X$, то `R` міститиме принаймні `R` і `R->R`. Тоді ми викликаємо розділення на `R->L` і позначаємо результат його розділення як `L'` і `R'`. Зрештою, `L=L'`, тоді як `R` також міститиме `R'`.

Отже, алгоритм розділення такий:

1. визначити, до якого піддерева належатиме кореневий вузол (лівого чи правого)
2. рекурсивно викликати розділення на одному з його нащадків
3. сформувати остаточний результат, повторно використавши рекурсивний виклик розділення.

### Злиття (Merge) \{#merge}

<center> <img src="https://upload.wikimedia.org/wikipedia/commons/a/a8/Treap_merge.svg" width="500px" /> </center>

**Merge ($T_1$, $T_2$)** об'єднує два піддерева $T_1$ і $T_2$ та повертає нове дерево. Ця операція також має складність $O (\log N)$. Вона працює за припущення, що $T_1$ і $T_2$ впорядковані (усі ключі $X$ у $T_1$ менші за ключі в $T_2$). Тож нам потрібно об'єднати ці дерева, не порушуючи порядку пріоритетів $Y$. Для цього ми обираємо коренем те дерево, яке має більший пріоритет $Y$ у кореневому вузлі, і рекурсивно викликаємо Merge для іншого дерева та відповідного піддерева обраного кореневого вузла.

### Вставка (Insert) \{#insert}

<center> <img src="https://upload.wikimedia.org/wikipedia/commons/3/35/Treap_insert.svg" width="500px" /> </center>

Тепер реалізація операції **Insert ($X$, $Y$)** стає очевидною. Спершу ми спускаємося деревом (як у звичайному бінарному дереві пошуку за X) і зупиняємося на першому вузлі, у якому значення пріоритету менше за $Y$. Ми знайшли місце, куди вставимо новий елемент. Далі ми викликаємо **Split (T, X)** на піддереві, що починається зі знайденого вузла, і використовуємо повернуті піддерева $L$ і $R$ як лівого та правого нащадків нового вузла.

Як альтернатива, вставку можна виконати, розділивши початкове декартове дерево за $X$ і зробивши $2$ злиття з новим вузлом (див. рисунок).


### Видалення (Erase) \{#erase}

<center> <img src="https://upload.wikimedia.org/wikipedia/commons/6/62/Treap_erase.svg" width="500px" /> </center>

Реалізація операції **Erase ($X$)** теж зрозуміла. Спершу ми спускаємося деревом (як у звичайному бінарному дереві пошуку за $X$), шукаючи елемент, який хочемо видалити. Щойно вузол знайдено, ми викликаємо **Merge** для його нащадків і ставимо повернуте значення операції на місце елемента, який видаляємо.

Як альтернатива, ми можемо виокремити піддерево, що містить $X$, за допомогою $2$ операцій розділення та злити решту дерев (див. рисунок).

### Побудова (Build) \{#build}

Операцію **Build** ми реалізуємо зі складністю $O (N \log N)$ за допомогою $N$ викликів **Insert**.

### Об'єднання (Union) \{#union}

**Union ($T_1$, $T_2$)** має теоретичну складність $O (M \log (N / M))$, але на практиці працює дуже добре, імовірно, з дуже малою прихованою константою. Припустимо без втрати загальності, що $T_1 \rightarrow Y > T_2 \rightarrow Y$, тобто корінь $T_1$ буде коренем результату. Щоб отримати результат, нам потрібно злити дерева $T_1 \rightarrow L$, $T_1 \rightarrow R$ і $T_2$ у два дерева, які могли б бути нащадками кореня $T_1$. Для цього ми викликаємо Split ($T_2$, $T_1\rightarrow X$), розбиваючи $T_2$ на дві частини L і R, які потім рекурсивно об'єднуємо з нащадками $T_1$: Union ($T_1 \rightarrow L$, $L$) і Union ($T_1 \rightarrow R$, $R$), отримуючи таким чином ліве й праве піддерева результату.

## Реалізація \{#implementation}

<CodeTabs>

```cpp
struct item {
	int key, prior;
	item *l, *r;
	item () { }
	item (int key) : key(key), prior(rand()), l(NULL), r(NULL) { }
	item (int key, int prior) : key(key), prior(prior), l(NULL), r(NULL) { }
};
typedef item* pitem;
```

```python
import random


class Item:
    def __init__(self, key: int, prior: "int | None" = None):
        # ключ для BST та пріоритет для купи
        self.key = key
        # якщо пріоритет не задано — генеруємо випадковий
        self.prior = prior if prior is not None else random.randint(0, 1 << 30)
        self.l: "Item | None" = None  # лівий нащадок
        self.r: "Item | None" = None  # правий нащадок
```

```typescript
class Item {
  key: number; // ключ для BST
  prior: number; // пріоритет для купи
  l: Item | null = null; // лівий нащадок
  r: Item | null = null; // правий нащадок

  constructor(key: number, prior?: number) {
    this.key = key;
    // якщо пріоритет не задано — генеруємо випадковий
    this.prior = prior ?? Math.floor(Math.random() * (1 << 30));
  }
}
```

```go
type Item struct {
	key   int // ключ для BST
	prior int // пріоритет для купи
	l, r  *Item // лівий та правий нащадки
}

func newItem(key int) *Item {
	// пріоритет генерується випадково
	return &Item{key: key, prior: rand.Int()}
}

func newItemWithPrior(key, prior int) *Item {
	return &Item{key: key, prior: prior}
}
```

</CodeTabs>

Це означення нашого елемента. Зверніть увагу, що тут є два вказівники на нащадків, цілочисловий ключ (для BST) і цілочисловий пріоритет (для купи). Пріоритет призначається за допомогою генератора випадкових чисел.

<CodeTabs>

```cpp
void split (pitem t, int key, pitem & l, pitem & r) {
	if (!t)
		l = r = NULL;
	else if (t->key <= key)
        split (t->r, key, t->r, r),  l = t;
	else
        split (t->l, key, l, t->l),  r = t;
}
```

```python
# Через брак передачі за посиланням у Python повертаємо пару (l, r)
def split(t: "Item | None", key: int) -> "tuple[Item | None, Item | None]":
    if t is None:
        return None, None
    if t.key <= key:
        # корінь та його ліве піддерево йдуть ліворуч
        left, right = split(t.r, key)
        t.r = left
        return t, right
    else:
        # корінь та його праве піддерево йдуть праворуч
        left, right = split(t.l, key)
        t.l = right
        return left, t
```

```typescript
// Повертаємо пару [l, r], бо в TS немає передачі за посиланням
function split(t: Item | null, key: number): [Item | null, Item | null] {
  if (t === null) return [null, null];
  if (t.key <= key) {
    // корінь та його ліве піддерево йдуть ліворуч
    const [left, right] = split(t.r, key);
    t.r = left;
    return [t, right];
  } else {
    // корінь та його праве піддерево йдуть праворуч
    const [left, right] = split(t.l, key);
    t.l = right;
    return [left, t];
  }
}
```

```go
// Повертаємо пару (l, r), бо в Go зручніше повертати значення
func split(t *Item, key int) (l, r *Item) {
	if t == nil {
		return nil, nil
	}
	if t.key <= key {
		// корінь та його ліве піддерево йдуть ліворуч
		left, right := split(t.r, key)
		t.r = left
		return t, right
	}
	// корінь та його праве піддерево йдуть праворуч
	left, right := split(t.l, key)
	t.l = right
	return left, t
}
```

</CodeTabs>

`t` — це декартове дерево, яке треба розділити, а `key` — значення BST, за яким розділяти. Зверніть увагу, що ми ніде не повертаємо (`return`) результуючі значення, натомість просто використовуємо їх так:

<CodeTabs>

```cpp
pitem l = nullptr, r = nullptr;
split(t, 5, l, r);
if (l) cout << "Left subtree size: " << (l->size) << endl;
if (r) cout << "Right subtree size: " << (r->size) << endl;
```

```python
# split повертає пару, тож просто розпаковуємо результат
l, r = split(t, 5)
if l:
    print("Left subtree size:", l.size)
if r:
    print("Right subtree size:", r.size)
```

```typescript
// split повертає пару, тож просто розпаковуємо результат
const [l, r] = split(t, 5);
if (l) console.log("Left subtree size:", l.size);
if (r) console.log("Right subtree size:", r.size);
```

```go
// split повертає пару, тож просто розпаковуємо результат
l, r := split(t, 5)
if l != nil {
	fmt.Println("Left subtree size:", l.size)
}
if r != nil {
	fmt.Println("Right subtree size:", r.size)
}
```

</CodeTabs>

Цю функцію `split` буває непросто зрозуміти, оскільки в ній є і вказівники (`pitem`), і посилання на ці вказівники (`pitem &l`). Розгляньмо словами, що означає виклик функції `split(t, k, l, r)`: «розділити декартове дерево `t` за значенням `k` на два дерева й зберегти ліве дерево в `l`, а праве — в `r`». Чудово! Тепер застосуймо це означення до двох рекурсивних викликів, скориставшись розбором випадків з попереднього розділу: (Перша умова if — це тривіальний базовий випадок для порожнього дерева)

1. Коли значення кореневого вузла $\le$ key, ми викликаємо `split (t->r, key, t->r, r)`, що означає: «розділити декартове дерево `t->r` (праве піддерево `t`) за значенням `key` і зберегти ліве піддерево в `t->r`, а праве — в `r`». Після цього ми присвоюємо `l = t`. Зверніть увагу, що тепер результуюче значення `l` містить `t->l`, `t`, а також `t->r` (який є результатом зробленого нами рекурсивного виклику) — і все вже злите в правильному порядку! Варто зупинитися й переконатися, що цей результат `l` і `r` точно відповідає тому, що ми обговорювали раніше в розділі «Опис реалізації».
2. Коли значення кореневого вузла більше за key, ми викликаємо `split (t->l, key, l, t->l)`, що означає: «розділити декартове дерево `t->l` (ліве піддерево `t`) за значенням `key` і зберегти ліве піддерево в `l`, а праве — в `t->l`». Після цього ми присвоюємо `r = t`. Зверніть увагу, що тепер результуюче значення `r` містить `t->l` (який є результатом зробленого нами рекурсивного виклику), `t`, а також `t->r` — і все вже злите в правильному порядку! Варто зупинитися й переконатися, що цей результат `l` і `r` точно відповідає тому, що ми обговорювали раніше в розділі «Опис реалізації».

Якщо вам усе ще важко зрозуміти реалізацію, варто поглянути на неї _індуктивно_, тобто: *не* намагайтеся розкладати рекурсивні виклики знову й знову. Припустіть, що реалізація розділення коректно працює на порожньому дереві, потім спробуйте запустити її для дерева з одного вузла, потім з двох вузлів і так далі, щоразу спираючись на знання, що розділення на менших деревах працює.

<CodeTabs>

```cpp
void insert (pitem & t, pitem it) {
	if (!t)
		t = it;
	else if (it->prior > t->prior)
		split (t, it->key, it->l, it->r),  t = it;
	else
		insert (t->key <= it->key ? t->r : t->l, it);
}

void merge (pitem & t, pitem l, pitem r) {
	if (!l || !r)
		t = l ? l : r;
	else if (l->prior > r->prior)
		merge (l->r, l->r, r),  t = l;
	else
		merge (r->l, l, r->l),  t = r;
}

void erase (pitem & t, int key) {
	if (t->key == key) {
		pitem th = t;
		merge (t, t->l, t->r);
		delete th;
	}
	else
		erase (key < t->key ? t->l : t->r, key);
}

pitem unite (pitem l, pitem r) {
	if (!l || !r)  return l ? l : r;
	if (l->prior < r->prior)  swap (l, r);
	pitem lt, rt;
	split (r, l->key, lt, rt);
	l->l = unite (l->l, lt);
	l->r = unite (l->r, rt);
	return l;
}
```

```python
# Treap не гарантовано збалансований, але очікувана глибина — O(log n).
# Для дуже великих n за потреби: import sys; sys.setrecursionlimit(1 << 20)


# Повертаємо новий корінь, бо немає передачі за посиланням
def insert(t: "Item | None", it: Item) -> Item:
    if t is None:
        return it
    if it.prior > t.prior:
        # новий вузол стає коренем: розділяємо t за його ключем
        it.l, it.r = split(t, it.key)
        return it
    if t.key <= it.key:
        t.r = insert(t.r, it)
    else:
        t.l = insert(t.l, it)
    return t


def merge(l: "Item | None", r: "Item | None") -> "Item | None":
    if l is None or r is None:
        return l if l is not None else r
    if l.prior > r.prior:
        l.r = merge(l.r, r)
        return l
    r.l = merge(l, r.l)
    return r


def erase(t: "Item | None", key: int) -> "Item | None":
    if t is None:
        return None
    if t.key == key:
        # зливаємо нащадків замість вузла, що видаляється
        return merge(t.l, t.r)
    if key < t.key:
        t.l = erase(t.l, key)
    else:
        t.r = erase(t.r, key)
    return t


def unite(l: "Item | None", r: "Item | None") -> "Item | None":
    if l is None or r is None:
        return l if l is not None else r
    if l.prior < r.prior:
        l, r = r, l
    lt, rt = split(r, l.key)
    l.l = unite(l.l, lt)
    l.r = unite(l.r, rt)
    return l
```

```typescript
// Повертаємо новий корінь, бо немає передачі за посиланням
function insert(t: Item | null, it: Item): Item {
  if (t === null) return it;
  if (it.prior > t.prior) {
    // новий вузол стає коренем: розділяємо t за його ключем
    [it.l, it.r] = split(t, it.key);
    return it;
  }
  if (t.key <= it.key) {
    t.r = insert(t.r, it);
  } else {
    t.l = insert(t.l, it);
  }
  return t;
}

function merge(l: Item | null, r: Item | null): Item | null {
  if (l === null || r === null) return l ?? r;
  if (l.prior > r.prior) {
    l.r = merge(l.r, r);
    return l;
  }
  r.l = merge(l, r.l);
  return r;
}

function erase(t: Item | null, key: number): Item | null {
  if (t === null) return null;
  if (t.key === key) {
    // зливаємо нащадків замість вузла, що видаляється
    return merge(t.l, t.r);
  }
  if (key < t.key) {
    t.l = erase(t.l, key);
  } else {
    t.r = erase(t.r, key);
  }
  return t;
}

function unite(l: Item | null, r: Item | null): Item | null {
  if (l === null || r === null) return l ?? r;
  if (l.prior < r.prior) {
    [l, r] = [r, l];
  }
  const [lt, rt] = split(r, l.key);
  l.l = unite(l.l, lt);
  l.r = unite(l.r, rt);
  return l;
}
```

```go
// Повертаємо новий корінь, бо немає передачі за посиланням
func insert(t, it *Item) *Item {
	if t == nil {
		return it
	}
	if it.prior > t.prior {
		// новий вузол стає коренем: розділяємо t за його ключем
		it.l, it.r = split(t, it.key)
		return it
	}
	if t.key <= it.key {
		t.r = insert(t.r, it)
	} else {
		t.l = insert(t.l, it)
	}
	return t
}

func merge(l, r *Item) *Item {
	if l == nil || r == nil {
		if l != nil {
			return l
		}
		return r
	}
	if l.prior > r.prior {
		l.r = merge(l.r, r)
		return l
	}
	r.l = merge(l, r.l)
	return r
}

func erase(t *Item, key int) *Item {
	if t == nil {
		return nil
	}
	if t.key == key {
		// зливаємо нащадків замість вузла, що видаляється
		return merge(t.l, t.r)
	}
	if key < t.key {
		t.l = erase(t.l, key)
	} else {
		t.r = erase(t.r, key)
	}
	return t
}

func unite(l, r *Item) *Item {
	if l == nil || r == nil {
		if l != nil {
			return l
		}
		return r
	}
	if l.prior < r.prior {
		l, r = r, l
	}
	lt, rt := split(r, l.key)
	l.l = unite(l.l, lt)
	l.r = unite(l.r, rt)
	return l
}
```

</CodeTabs>

## Підтримання розмірів піддерев \{#maintaining-the-sizes-of-subtrees}

Щоб розширити функціональність декартового дерева, часто потрібно зберігати кількість вузлів у піддереві кожного вузла — поле `int cnt` у структурі `item`. Наприклад, його можна використати для знаходження $K$-го за величиною елемента дерева за $O (\log N)$ або для знаходження індексу елемента у відсортованому списку з тією самою складністю. Реалізація цих операцій буде такою самою, як і для звичайного бінарного дерева пошуку.

Коли дерево змінюється (додаються чи видаляються вузли тощо), значення `cnt` деяких вузлів треба відповідно оновити. Створимо дві функції: `cnt()` повертатиме поточне значення `cnt` або 0, якщо вузла не існує, а `upd_cnt()` оновлюватиме значення `cnt` для цього вузла за припущення, що для його нащадків L і R значення `cnt` вже оновлені. Очевидно, достатньо додати виклики `upd_cnt()` у кінці `insert`, `erase`, `split` і `merge`, щоб значення `cnt` лишалися актуальними.

<CodeTabs>

```cpp
int cnt (pitem t) {
	return t ? t->cnt : 0;
}

void upd_cnt (pitem t) {
	if (t)
		t->cnt = 1 + cnt(t->l) + cnt (t->r);
}
```

```python
def cnt(t: "Item | None") -> int:
    # розмір піддерева або 0 для відсутнього вузла
    return t.cnt if t is not None else 0


def upd_cnt(t: "Item | None") -> None:
    # оновлюємо розмір за вже актуальними розмірами нащадків
    if t is not None:
        t.cnt = 1 + cnt(t.l) + cnt(t.r)
```

```typescript
function cnt(t: Item | null): number {
  // розмір піддерева або 0 для відсутнього вузла
  return t !== null ? t.cnt : 0;
}

function updCnt(t: Item | null): void {
  // оновлюємо розмір за вже актуальними розмірами нащадків
  if (t !== null) {
    t.cnt = 1 + cnt(t.l) + cnt(t.r);
  }
}
```

```go
func cnt(t *Item) int {
	// розмір піддерева або 0 для відсутнього вузла
	if t != nil {
		return t.cnt
	}
	return 0
}

func updCnt(t *Item) {
	// оновлюємо розмір за вже актуальними розмірами нащадків
	if t != nil {
		t.cnt = 1 + cnt(t.l) + cnt(t.r)
	}
}
```

</CodeTabs>

## Побудова декартового дерева за $O (N)$ в офлайн-режимі \{#data-toc-label}

Маючи відсортований список ключів, декартове дерево можна побудувати швидше, ніж вставляючи ключі по одному, що займає $O(N \log N)$. Оскільки ключі відсортовані, збалансоване бінарне дерево пошуку легко побудувати за лінійний час. Значення купи $Y$ ініціалізуються випадково, а потім із них можна незалежно від ключів $X$ зробити купу ([heapify](https://en.wikipedia.org/wiki/Binary_heap#Building_a_heap)) за $O(N)$.

<CodeTabs>

```cpp
void heapify (pitem t) {
	if (!t) return;
	pitem max = t;
	if (t->l != NULL && t->l->prior > max->prior)
		max = t->l;
	if (t->r != NULL && t->r->prior > max->prior)
		max = t->r;
	if (max != t) {
		swap (t->prior, max->prior);
		heapify (max);
	}
}

pitem build (int * a, int n) {
	// Будуємо декартове дерево на значеннях {a[0], a[1], ..., a[n - 1]}
	if (n == 0) return NULL;
	int mid = n / 2;
	pitem t = new item (a[mid], rand ());
	t->l = build (a, mid);
	t->r = build (a + mid + 1, n - mid - 1);
	heapify (t);
	upd_cnt(t)
	return t;
}
```

```python
def heapify(t: "Item | None") -> None:
    if t is None:
        return
    mx = t
    if t.l is not None and t.l.prior > mx.prior:
        mx = t.l
    if t.r is not None and t.r.prior > mx.prior:
        mx = t.r
    if mx is not t:
        # проштовхуємо більший пріоритет угору й рекурсивно відновлюємо купу
        t.prior, mx.prior = mx.prior, t.prior
        heapify(mx)


def build(a: "list[int]", lo: int = 0, hi: "int | None" = None) -> "Item | None":
    # Будуємо декартове дерево на значеннях a[lo:hi]
    if hi is None:
        hi = len(a)
    if lo >= hi:
        return None
    mid = (lo + hi) // 2
    t = Item(a[mid], random.randint(0, 1 << 30))
    t.l = build(a, lo, mid)
    t.r = build(a, mid + 1, hi)
    heapify(t)
    upd_cnt(t)  # потрібно лише, якщо потрібні розміри піддерев
    return t
```

```typescript
function heapify(t: Item | null): void {
  if (t === null) return;
  let mx = t;
  if (t.l !== null && t.l.prior > mx.prior) mx = t.l;
  if (t.r !== null && t.r.prior > mx.prior) mx = t.r;
  if (mx !== t) {
    // проштовхуємо більший пріоритет угору й рекурсивно відновлюємо купу
    [t.prior, mx.prior] = [mx.prior, t.prior];
    heapify(mx);
  }
}

function build(a: number[], lo = 0, hi: number = a.length): Item | null {
  // Будуємо декартове дерево на значеннях a[lo..hi)
  if (lo >= hi) return null;
  const mid = (lo + hi) >> 1;
  const t = new Item(a[mid], Math.floor(Math.random() * (1 << 30)));
  t.l = build(a, lo, mid);
  t.r = build(a, mid + 1, hi);
  heapify(t);
  updCnt(t); // потрібно лише, якщо потрібні розміри піддерев
  return t;
}
```

```go
func heapify(t *Item) {
	if t == nil {
		return
	}
	mx := t
	if t.l != nil && t.l.prior > mx.prior {
		mx = t.l
	}
	if t.r != nil && t.r.prior > mx.prior {
		mx = t.r
	}
	if mx != t {
		// проштовхуємо більший пріоритет угору й рекурсивно відновлюємо купу
		t.prior, mx.prior = mx.prior, t.prior
		heapify(mx)
	}
}

func build(a []int) *Item {
	// Будуємо декартове дерево на значеннях a[0..len(a))
	if len(a) == 0 {
		return nil
	}
	mid := len(a) / 2
	t := &Item{key: a[mid], prior: rand.Int()}
	t.l = build(a[:mid])
	t.r = build(a[mid+1:])
	heapify(t)
	updCnt(t) // потрібно лише, якщо потрібні розміри піддерев
	return t
}
```

</CodeTabs>

Зауваження: виклик `upd_cnt(t)` потрібен лише тоді, коли вам потрібні розміри піддерев.

Наведений вище підхід завжди дає ідеально збалансоване дерево, що загалом добре для практичних потреб, але ціною того, що не зберігаються пріоритети, які початково були призначені кожному вузлу. Тому цей підхід не годиться для розв'язання такої задачі:

:::info
**[acmsguru - Cartesian Tree](https://codeforces.com/problemsets/acmsguru/problem/99999/155)**

Дано послідовність пар $(x_i, y_i)$; потрібно побудувати на них декартове дерево. Усі $x_i$ і всі $y_i$ унікальні.
:::

Зверніть увагу, що в цій задачі пріоритети не випадкові, тож проста вставка вершин по одній могла б дати квадратичний розв'язок.

Один з можливих розв'язків тут — знайти для кожного елемента найближчі елементи зліва й справа, які мають менший пріоритет, ніж цей елемент. Серед цих двох елементів той, що має більший пріоритет, має бути батьком поточного елемента.

Ця задача розв'язується за допомогою модифікації [стека з мінімумом](./stack_queue_modification.md) за лінійний час:

<CodeTabs>

```cpp
void connect(auto from, auto to) {
    vector<pitem> st;
    for(auto it: ranges::subrange(from, to)) {
        while(!st.empty() && st.back()->prior > it->prior) {
            st.pop_back();
        }
        if(!st.empty()) {
            if(!it->p || it->p->prior < st.back()->prior) {
                it->p = st.back();
            }
        }
        st.push_back(it);
    }
}

pitem build(int *x, int *y, int n) {
    vector<pitem> nodes(n);
    for(int i = 0; i < n; i++) {
        nodes[i] = new item(x[i], y[i]);
    }
    connect(nodes.begin(), nodes.end());
    connect(nodes.rbegin(), nodes.rend());
    for(int i = 0; i < n; i++) {
        if(nodes[i]->p) {
            if(nodes[i]->p->key < nodes[i]->key) {
                nodes[i]->p->r = nodes[i];
            } else {
                nodes[i]->p->l = nodes[i];
            }
        }
    }
    return nodes[min_element(y, y + n) - y];
}
```

```python
# Тут вузлам потрібне поле p (батько); вважаємо, що Item його має.
# nodes — список вузлів у порядку зростання x.
def connect(nodes: "list[Item]") -> None:
    st: "list[Item]" = []  # стек з мінімумом за пріоритетом
    for it in nodes:
        while st and st[-1].prior > it.prior:
            st.pop()
        if st:
            if it.p is None or it.p.prior < st[-1].prior:
                it.p = st[-1]
        st.append(it)


def build_from_pairs(x: "list[int]", y: "list[int]") -> "Item | None":
    n = len(x)
    nodes = [Item(x[i], y[i]) for i in range(n)]
    for nd in nodes:
        nd.p = None
    connect(nodes)               # прохід зліва направо
    connect(list(reversed(nodes)))  # прохід справа наліво
    for nd in nodes:
        if nd.p is not None:
            if nd.p.key < nd.key:
                nd.p.r = nd
            else:
                nd.p.l = nd
    # корінь — вузол з найменшим пріоритетом y
    return min(nodes, key=lambda nd: nd.prior)
```

```typescript
// Тут вузлам потрібне поле p (батько); вважаємо, що Item його має.
// nodes — масив вузлів у порядку зростання x.
function connect(nodes: Item[]): void {
  const st: Item[] = []; // стек з мінімумом за пріоритетом
  for (const it of nodes) {
    while (st.length > 0 && st[st.length - 1].prior > it.prior) {
      st.pop();
    }
    if (st.length > 0) {
      const top = st[st.length - 1];
      if (it.p === null || it.p.prior < top.prior) {
        it.p = top;
      }
    }
    st.push(it);
  }
}

function buildFromPairs(x: number[], y: number[]): Item | null {
  const n = x.length;
  const nodes: Item[] = [];
  for (let i = 0; i < n; i++) nodes.push(new Item(x[i], y[i]));
  for (const nd of nodes) nd.p = null;
  connect(nodes); // прохід зліва направо
  connect([...nodes].reverse()); // прохід справа наліво
  for (const nd of nodes) {
    if (nd.p !== null) {
      if (nd.p.key < nd.key) nd.p.r = nd;
      else nd.p.l = nd;
    }
  }
  // корінь — вузол з найменшим пріоритетом y
  let root = nodes[0];
  for (const nd of nodes) if (nd.prior < root.prior) root = nd;
  return root;
}
```

```go
// Тут вузлам потрібне поле p (батько); вважаємо, що Item його має.
// nodes — зріз вузлів у порядку зростання x.
func connect(nodes []*Item) {
	st := []*Item{} // стек з мінімумом за пріоритетом
	for _, it := range nodes {
		for len(st) > 0 && st[len(st)-1].prior > it.prior {
			st = st[:len(st)-1]
		}
		if len(st) > 0 {
			top := st[len(st)-1]
			if it.p == nil || it.p.prior < top.prior {
				it.p = top
			}
		}
		st = append(st, it)
	}
}

func buildFromPairs(x, y []int) *Item {
	n := len(x)
	nodes := make([]*Item, n)
	for i := 0; i < n; i++ {
		nodes[i] = &Item{key: x[i], prior: y[i]}
	}
	connect(nodes) // прохід зліва направо
	rev := make([]*Item, n)
	for i := 0; i < n; i++ {
		rev[i] = nodes[n-1-i]
	}
	connect(rev) // прохід справа наліво
	for _, nd := range nodes {
		if nd.p != nil {
			if nd.p.key < nd.key {
				nd.p.r = nd
			} else {
				nd.p.l = nd
			}
		}
	}
	// корінь — вузол з найменшим пріоритетом y
	root := nodes[0]
	for _, nd := range nodes {
		if nd.prior < root.prior {
			root = nd
		}
	}
	return root
}
```

</CodeTabs>

## Декартові дерева за неявним ключем (Implicit Treaps) \{#implicit-treaps}

Декартове дерево за неявним ключем — це проста модифікація звичайного декартового дерева, яка є дуже потужною структурою даних. Фактично декартове дерево за неявним ключем можна розглядати як масив з такими реалізованими процедурами (усі за $O (\log N)$ в онлайн-режимі):

- Вставка елемента в масив у будь-яке місце
- Видалення довільного елемента
- Знаходження суми, мінімального / максимального елемента тощо на довільному інтервалі
- Додавання, «зафарбовування» на довільному інтервалі
- Обернення елементів на довільному інтервалі

Ідея в тому, що ключами мають бути **індекси** елементів у масиві, що відлічуються від нуля. Але ми не зберігатимемо ці значення явно (інакше, наприклад, вставка елемента спричинила б зміну ключа в $O (N)$ вузлах дерева).

Зверніть увагу, що ключ вузла — це кількість вузлів, менших за нього (такі вузли можуть бути не лише в його лівому піддереві, а й у лівих піддеревах його предків).
Точніше, **неявний ключ** для деякого вузла T — це кількість вершин $cnt (T \rightarrow L)$ у лівому піддереві цього вузла плюс аналогічні значення $cnt (P \rightarrow L) + 1$ для кожного предка P вузла T, якщо T міститься в правому піддереві P.

Тепер зрозуміло, як швидко обчислити неявний ключ поточного вузла. Оскільки в усіх операціях ми приходимо до будь-якого вузла, спускаючись деревом, ми можемо просто накопичувати цю суму й передавати її у функцію. Якщо ми йдемо в ліве піддерево, накопичена сума не змінюється; якщо йдемо в праве піддерево, вона збільшується на $cnt (T \rightarrow L) +1$.

Ось нові реалізації операцій **Split** і **Merge**:

<CodeTabs>

```cpp
void merge (pitem & t, pitem l, pitem r) {
	if (!l || !r)
		t = l ? l : r;
	else if (l->prior > r->prior)
		merge (l->r, l->r, r),  t = l;
	else
		merge (r->l, l, r->l),  t = r;
	upd_cnt (t);
}

void split (pitem t, pitem & l, pitem & r, int key, int add = 0) {
	if (!t)
		return void( l = r = 0 );
	int cur_key = add + cnt(t->l); //неявний ключ
	if (key <= cur_key)
		split (t->l, l, t->l, key, add),  r = t;
	else
		split (t->r, t->r, r, key, add + 1 + cnt(t->l)),  l = t;
	upd_cnt (t);
}
```

```python
# Неявний treap: ключем є позиція в масиві (обчислюється через розміри).
def merge(l: "Item | None", r: "Item | None") -> "Item | None":
    if l is None or r is None:
        t = l if l is not None else r
    elif l.prior > r.prior:
        l.r = merge(l.r, r)
        t = l
    else:
        r.l = merge(l, r.l)
        t = r
    upd_cnt(t)
    return t


# split за позицією key: ліворуч ідуть перші key елементів
def split(t: "Item | None", key: int, add: int = 0) -> "tuple[Item | None, Item | None]":
    if t is None:
        return None, None
    cur_key = add + cnt(t.l)  # неявний ключ
    if key <= cur_key:
        l, t.l = split(t.l, key, add)
        r = t
    else:
        t.r, r = split(t.r, key, add + 1 + cnt(t.l))
        l = t
    upd_cnt(t)
    return l, r
```

```typescript
// Неявний treap: ключем є позиція в масиві (обчислюється через розміри).
function merge(l: Item | null, r: Item | null): Item | null {
  let t: Item | null;
  if (l === null || r === null) {
    t = l ?? r;
  } else if (l.prior > r.prior) {
    l.r = merge(l.r, r);
    t = l;
  } else {
    r.l = merge(l, r.l);
    t = r;
  }
  updCnt(t);
  return t;
}

// split за позицією key: ліворуч ідуть перші key елементів
function split(
  t: Item | null,
  key: number,
  add = 0,
): [Item | null, Item | null] {
  if (t === null) return [null, null];
  const curKey = add + cnt(t.l); // неявний ключ
  let l: Item | null, r: Item | null;
  if (key <= curKey) {
    [l, t.l] = split(t.l, key, add);
    r = t;
  } else {
    [t.r, r] = split(t.r, key, add + 1 + cnt(t.l));
    l = t;
  }
  updCnt(t);
  return [l, r];
}
```

```go
// Неявний treap: ключем є позиція в масиві (обчислюється через розміри).
func merge(l, r *Item) *Item {
	var t *Item
	if l == nil || r == nil {
		if l != nil {
			t = l
		} else {
			t = r
		}
	} else if l.prior > r.prior {
		l.r = merge(l.r, r)
		t = l
	} else {
		r.l = merge(l, r.l)
		t = r
	}
	updCnt(t)
	return t
}

// split за позицією key: ліворуч ідуть перші key елементів
func split(t *Item, key, add int) (l, r *Item) {
	if t == nil {
		return nil, nil
	}
	curKey := add + cnt(t.l) // неявний ключ
	if key <= curKey {
		l, t.l = split(t.l, key, add)
		r = t
	} else {
		t.r, r = split(t.r, key, add+1+cnt(t.l))
		l = t
	}
	updCnt(t)
	return l, r
}
```

</CodeTabs>

У наведеній вище реалізації після виклику $split(T, T_1, T_2, k)$ дерево $T_1$ складатиметься з перших $k$ елементів $T$ (тобто з елементів, неявний ключ яких менший за $k$), а $T_2$ складатиметься з усіх інших.

Тепер розгляньмо реалізацію різних операцій на декартових деревах за неявним ключем:

- **Вставка елемента**.  
  Припустимо, нам потрібно вставити елемент у позицію $pos$. Ми ділимо декартове дерево на дві частини, які відповідають масивам $[0..pos-1]$ і $[pos..sz]$; для цього викликаємо $split(T, T_1, T_2, pos)$. Тоді ми можемо об'єднати дерево $T_1$ з новою вершиною, викликавши $merge(T_1, T_1, \text{new item})$ (легко бачити, що всі передумови виконуються). Нарешті, ми об'єднуємо дерева $T_1$ і $T_2$ назад у $T$, викликавши $merge(T, T_1, T_2)$.
- **Видалення елемента**.  
 Ця операція ще простіша: знаходимо елемент, який треба видалити, $T$, виконуємо злиття його нащадків $L$ і $R$ та замінюємо елемент $T$ результатом злиття. Фактично видалення елемента в декартовому дереві за неявним ключем точно таке саме, як і у звичайному декартовому дереві.
- Знаходження **суми / мінімуму** тощо на інтервалі.  
 По-перше, створюємо в структурі `item` додаткове поле $F$ для зберігання значення цільової функції для піддерева цього вузла. Це поле легко підтримувати так само, як і розміри піддерев: створюємо функцію, яка обчислює це значення для вузла на основі значень для його нащадків, і додаємо виклики цієї функції в кінці всіх функцій, що модифікують дерево.  
 По-друге, нам потрібно навчитися обробляти запит для довільного інтервалу $[A; B]$.  
 Щоб отримати частину дерева, яка відповідає інтервалу $[A; B]$, нам потрібно викликати $split(T, T_2, T_3, B+1)$, а потім $split(T_2, T_1, T_2, A)$: після цього $T_2$ складатиметься з усіх елементів інтервалу $[A; B]$, і лише з них. Тому відповідь на запит зберігатиметься в полі $F$ кореня $T_2$. Після того, як на запит відповіли, дерево потрібно відновити, викликавши $merge(T, T_1, T_2)$ і $merge(T, T, T_3)$.
- **Додавання / зафарбовування** на інтервалі.  
 Діємо аналогічно до попереднього абзацу, але замість поля F зберігатимемо поле `add`, яке міститиме додане значення для піддерева (або значення, яким зафарбовується піддерево). Перед виконанням будь-якої операції ми маємо коректно «проштовхнути» (push) це значення — тобто змінити $T \rightarrow L \rightarrow add$ і $T \rightarrow R \rightarrow add$ та очистити `add` у батьківському вузлі. Так після будь-яких змін у дереві інформація не втратиться.
- **Обернення** на інтервалі.  
 Це знову схоже на попередню операцію: нам потрібно додати булевий прапорець `rev` і встановлювати його в true, коли піддерево поточного вузла треба обернути. «Проштовхування» (push) цього значення трохи складніше — ми міняємо місцями нащадків цього вузла й встановлюємо цей прапорець у true для них.

Ось приклад реалізації декартового дерева за неявним ключем з оберненням на інтервалі. Для кожного вузла ми зберігаємо поле `value`, яке є фактичним значенням елемента масиву в поточній позиції. Також ми наводимо реалізацію функції `output()`, яка виводить масив, що відповідає поточному стану декартового дерева за неявним ключем.

<CodeTabs>

```cpp
typedef struct item * pitem;
struct item {
	int prior, value, cnt;
	bool rev;
	pitem l, r;
};

int cnt (pitem it) {
	return it ? it->cnt : 0;
}

void upd_cnt (pitem it) {
	if (it)
		it->cnt = cnt(it->l) + cnt(it->r) + 1;
}

void push (pitem it) {
	if (it && it->rev) {
		it->rev = false;
		swap (it->l, it->r);
		if (it->l)  it->l->rev ^= true;
		if (it->r)  it->r->rev ^= true;
	}
}

void merge (pitem & t, pitem l, pitem r) {
	push (l);
	push (r);
	if (!l || !r)
		t = l ? l : r;
	else if (l->prior > r->prior)
		merge (l->r, l->r, r),  t = l;
	else
		merge (r->l, l, r->l),  t = r;
	upd_cnt (t);
}

void split (pitem t, pitem & l, pitem & r, int key, int add = 0) {
	if (!t)
		return void( l = r = 0 );
	push (t);
	int cur_key = add + cnt(t->l);
	if (key <= cur_key)
		split (t->l, l, t->l, key, add),  r = t;
	else
		split (t->r, t->r, r, key, add + 1 + cnt(t->l)),  l = t;
	upd_cnt (t);
}

void reverse (pitem t, int l, int r) {
	pitem t1, t2, t3;
	split (t, t1, t2, l);
	split (t2, t2, t3, r-l+1);
	t2->rev ^= true;
	merge (t, t1, t2);
	merge (t, t, t3);
}

void output (pitem t) {
	if (!t)  return;
	push (t);
	output (t->l);
	printf ("%d ", t->value);
	output (t->r);
}
```

```python
class Node:
    def __init__(self, value: int, prior: "int | None" = None):
        self.prior = prior if prior is not None else random.randint(0, 1 << 30)
        self.value = value
        self.cnt = 1
        self.rev = False  # відкладений прапорець обернення
        self.l: "Node | None" = None
        self.r: "Node | None" = None


def cnt(it: "Node | None") -> int:
    return it.cnt if it is not None else 0


def upd_cnt(it: "Node | None") -> None:
    if it is not None:
        it.cnt = cnt(it.l) + cnt(it.r) + 1


def push(it: "Node | None") -> None:
    # проштовхуємо відкладене обернення до нащадків
    if it is not None and it.rev:
        it.rev = False
        it.l, it.r = it.r, it.l
        if it.l is not None:
            it.l.rev ^= True
        if it.r is not None:
            it.r.rev ^= True


def merge(l: "Node | None", r: "Node | None") -> "Node | None":
    push(l)
    push(r)
    if l is None or r is None:
        t = l if l is not None else r
    elif l.prior > r.prior:
        l.r = merge(l.r, r)
        t = l
    else:
        r.l = merge(l, r.l)
        t = r
    upd_cnt(t)
    return t


def split(t: "Node | None", key: int, add: int = 0) -> "tuple[Node | None, Node | None]":
    if t is None:
        return None, None
    push(t)
    cur_key = add + cnt(t.l)
    if key <= cur_key:
        l, t.l = split(t.l, key, add)
        r = t
    else:
        t.r, r = split(t.r, key, add + 1 + cnt(t.l))
        l = t
    upd_cnt(t)
    return l, r


def reverse(t: "Node | None", lo: int, hi: int) -> "Node | None":
    # обертаємо інтервал [lo, hi]
    t1, t2 = split(t, lo)
    t2, t3 = split(t2, hi - lo + 1)
    if t2 is not None:
        t2.rev ^= True
    t = merge(t1, t2)
    t = merge(t, t3)
    return t


def output(t: "Node | None", acc: "list[int]") -> None:
    if t is None:
        return
    push(t)
    output(t.l, acc)
    acc.append(t.value)
    output(t.r, acc)
```

```typescript
class Node {
  prior: number;
  value: number;
  cnt = 1;
  rev = false; // відкладений прапорець обернення
  l: Node | null = null;
  r: Node | null = null;

  constructor(value: number, prior?: number) {
    this.value = value;
    this.prior = prior ?? Math.floor(Math.random() * (1 << 30));
  }
}

function cnt(it: Node | null): number {
  return it !== null ? it.cnt : 0;
}

function updCnt(it: Node | null): void {
  if (it !== null) it.cnt = cnt(it.l) + cnt(it.r) + 1;
}

function push(it: Node | null): void {
  // проштовхуємо відкладене обернення до нащадків
  if (it !== null && it.rev) {
    it.rev = false;
    [it.l, it.r] = [it.r, it.l];
    if (it.l !== null) it.l.rev = !it.l.rev;
    if (it.r !== null) it.r.rev = !it.r.rev;
  }
}

function merge(l: Node | null, r: Node | null): Node | null {
  push(l);
  push(r);
  let t: Node | null;
  if (l === null || r === null) {
    t = l ?? r;
  } else if (l.prior > r.prior) {
    l.r = merge(l.r, r);
    t = l;
  } else {
    r.l = merge(l, r.l);
    t = r;
  }
  updCnt(t);
  return t;
}

function split(
  t: Node | null,
  key: number,
  add = 0,
): [Node | null, Node | null] {
  if (t === null) return [null, null];
  push(t);
  const curKey = add + cnt(t.l);
  let l: Node | null, r: Node | null;
  if (key <= curKey) {
    [l, t.l] = split(t.l, key, add);
    r = t;
  } else {
    [t.r, r] = split(t.r, key, add + 1 + cnt(t.l));
    l = t;
  }
  updCnt(t);
  return [l, r];
}

function reverse(t: Node | null, lo: number, hi: number): Node | null {
  // обертаємо інтервал [lo, hi]
  let [t1, t2] = split(t, lo);
  let t3: Node | null;
  [t2, t3] = split(t2, hi - lo + 1);
  if (t2 !== null) t2.rev = !t2.rev;
  t = merge(t1, t2);
  t = merge(t, t3);
  return t;
}

function output(t: Node | null, acc: number[]): void {
  if (t === null) return;
  push(t);
  output(t.l, acc);
  acc.push(t.value);
  output(t.r, acc);
}
```

```go
type Node struct {
	prior, value, cnt int
	rev               bool // відкладений прапорець обернення
	l, r              *Node
}

func newNode(value int) *Node {
	return &Node{prior: rand.Int(), value: value, cnt: 1}
}

func cnt(it *Node) int {
	if it != nil {
		return it.cnt
	}
	return 0
}

func updCnt(it *Node) {
	if it != nil {
		it.cnt = cnt(it.l) + cnt(it.r) + 1
	}
}

func push(it *Node) {
	// проштовхуємо відкладене обернення до нащадків
	if it != nil && it.rev {
		it.rev = false
		it.l, it.r = it.r, it.l
		if it.l != nil {
			it.l.rev = !it.l.rev
		}
		if it.r != nil {
			it.r.rev = !it.r.rev
		}
	}
}

func merge(l, r *Node) *Node {
	push(l)
	push(r)
	var t *Node
	if l == nil || r == nil {
		if l != nil {
			t = l
		} else {
			t = r
		}
	} else if l.prior > r.prior {
		l.r = merge(l.r, r)
		t = l
	} else {
		r.l = merge(l, r.l)
		t = r
	}
	updCnt(t)
	return t
}

func split(t *Node, key, add int) (l, r *Node) {
	if t == nil {
		return nil, nil
	}
	push(t)
	curKey := add + cnt(t.l)
	if key <= curKey {
		l, t.l = split(t.l, key, add)
		r = t
	} else {
		t.r, r = split(t.r, key, add+1+cnt(t.l))
		l = t
	}
	updCnt(t)
	return l, r
}

func reverse(t *Node, lo, hi int) *Node {
	// обертаємо інтервал [lo, hi]
	t1, t2 := split(t, lo, 0)
	var t3 *Node
	t2, t3 = split(t2, hi-lo+1, 0)
	if t2 != nil {
		t2.rev = !t2.rev
	}
	t = merge(t1, t2)
	t = merge(t, t3)
	return t
}

func output(t *Node, acc *[]int) {
	if t == nil {
		return
	}
	push(t)
	output(t.l, acc)
	*acc = append(*acc, t.value)
	output(t.r, acc)
}
```

</CodeTabs>

## Література \{#literature}

* [Blelloch, Reid-Miller "Fast Set Operations Using Treaps"](https://www.cs.cmu.edu/~scandal/papers/treaps-spaa98.pdf)

## Задачі для практики \{#practice-problems}

* [SPOJ - Ada and Aphids](http://www.spoj.com/problems/ADAAPHID/)
* [SPOJ - Ada and Harvest](http://www.spoj.com/problems/ADACROP/)
* [Codeforces - Radio Stations](http://codeforces.com/contest/762/problem/E)
* [SPOJ - Ghost Town](http://www.spoj.com/problems/COUNT1IT/)
* [SPOJ - Arrangement Validity](http://www.spoj.com/problems/IITWPC4D/)
* [SPOJ - All in One](http://www.spoj.com/problems/ALLIN1/)
* [Codeforces - Dog Show](http://codeforces.com/contest/847/problem/D)
* [Codeforces - Yet Another Array Queries Problem](http://codeforces.com/contest/863/problem/D)
* [SPOJ - Mean of Array](http://www.spoj.com/problems/MEANARR/)
* [SPOJ - TWIST](http://www.spoj.com/problems/TWIST/)
* [SPOJ - KOILINE](http://www.spoj.com/problems/KOILINE/)
* [CodeChef - The Prestige](https://www.codechef.com/problems/PRESTIGE)
* [Codeforces - T-Shirts](https://codeforces.com/contest/702/problem/F)
* [Codeforces - Wizards and Roads](https://codeforces.com/problemset/problem/167/D)
* [Codeforces - Yaroslav and Points](https://codeforces.com/contest/295/problem/E)

## Відеоматеріали \{#video}

- [AlgorithmsThread 9: Treaps! — SecondThread](https://www.youtube.com/watch?v=6x0UlIBLRsc) (44 хв, англійською)
