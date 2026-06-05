# Суфіксний масив

## Означення \{#definition}

Нехай $s$ — рядок довжини $n$. $i$-й суфікс рядка $s$ — це підрядок $s[i \ldots n - 1]$.

**Суфіксний масив** міститиме цілі числа, що відповідають **початковим індексам** усіх суфіксів заданого рядка після того, як ці суфікси відсортовано.

Як приклад розгляньмо рядок $s = abaab$.
Усі суфікси такі:

$$
\begin{array}{ll}
0. & abaab \\
1. & baab \\
2. & aab \\
3. & ab \\
4. & b
\end{array}
$$

Після сортування цих рядків:

$$
\begin{array}{ll}
2. & aab \\
3. & ab \\
0. & abaab \\
4. & b \\
1. & baab
\end{array}
$$

Отже, суфіксний масив для $s$ буде $(2,~ 3,~ 0,~ 4,~ 1)$.

Як структуру даних його широко застосовують у таких галузях, як стиснення даних, біоінформатика і загалом у будь-якій сфері, що має справу з рядками та задачами пошуку взірця.

## Побудова \{#construction}

### Підхід за $O(n^2 \log n)$ \{#data-toc-label}

Це найбільш наївний підхід.
Беремо всі суфікси й сортуємо їх швидким сортуванням або сортуванням злиттям, водночас зберігаючи їхні початкові індекси.
Сортування використовує $O(n \log n)$ порівнянь, і оскільки порівняння двох рядків додатково займає $O(n)$ часу, ми отримуємо підсумкову складність $O(n^2 \log n)$.

### Підхід за $O(n \log n)$ \{#data-toc-label-1}

Строго кажучи, наведений далі алгоритм сортуватиме не самі суфікси, а циклічні зсуви рядка.
Однак з нього дуже легко вивести алгоритм сортування суфіксів:
достатньо дописати в кінець рядка довільний символ, менший за будь-який символ рядка.
Зазвичай використовують символ \$.
Тоді порядок відсортованих циклічних зсувів збігається з порядком відсортованих суфіксів, як показано тут на прикладі рядка $dabbb$.

$$
\begin{array}{lll}
1. & abbb\$d & abbb \\
4. & b\$dabb & b \\
3. & bb\$dab & bb \\
2. & bbb\$da & bbb \\
0. & dabbb\$ & dabbb
\end{array}
$$

Оскільки ми збираємося сортувати циклічні зсуви, ми розглядатимемо **циклічні підрядки**.
Позначення $s[i \dots j]$ ми вживатимемо для підрядка рядка $s$ навіть тоді, коли $i > j$.
У цьому випадку ми насправді маємо на увазі рядок $s[i \dots n-1] + s[0 \dots j]$.
Крім того, ми братимемо всі індекси за модулем довжини $s$ і для простоти опускатимемо операцію взяття за модулем.

Алгоритм, який ми обговорюємо, виконуватиме $\lceil \log n \rceil + 1$ ітерацій.
На $k$-й ітерації ($k = 0 \dots \lceil \log n \rceil$) ми сортуємо $n$ циклічних підрядків рядка $s$ довжини $2^k$.
Після $\lceil \log n \rceil$-ї ітерації підрядки довжини $2^{\lceil \log n \rceil} \ge n$ будуть відсортовані, а це рівносильно сортуванню самих циклічних зсувів.

На кожній ітерації алгоритму, окрім перестановки $p[0 \dots n-1]$, де $p[i]$ — індекс $i$-го підрядка (що починається в позиції $i$ і має довжину $2^k$) у відсортованому порядку, ми також підтримуватимемо масив $c[0 \dots n-1]$, де $c[i]$ відповідає **класу еквівалентності**, до якого належить підрядок.
Адже деякі підрядки будуть однакові, і алгоритм має поводитися з ними однаково.
Для зручності класи позначатимемо числами, починаючи з нуля.
Крім того, числа $c[i]$ призначатимемо так, щоб вони зберігали інформацію про порядок:
якщо один підрядок менший за інший, то він повинен мати й менший номер класу.
Кількість класів еквівалентності зберігатимемо у змінній $\text{classes}$.

Розгляньмо приклад.
Нехай маємо рядок $s = aaba$.
Циклічні підрядки і відповідні масиви $p[]$ та $c[]$ наведено для кожної ітерації:

$$
\begin{array}{cccc}
0: & (a,~ a,~ b,~ a) & p = (0,~ 1,~ 3,~ 2) & c = (0,~ 0,~ 1,~ 0)\\
1: & (aa,~ ab,~ ba,~ aa) & p = (0,~ 3,~ 1,~ 2) & c = (0,~ 1,~ 2,~ 0)\\
2: & (aaba,~ abaa,~ baaa,~ aaab) & p = (3,~ 0,~ 1,~ 2) & c = (1,~ 2,~ 3,~ 0)\\
\end{array}
$$

Варто зауважити, що значення $p[]$ можуть бути різними.
Наприклад, на $0$-й ітерації масив міг би бути й $p = (3,~ 1,~ 0,~ 2)$ або $p = (3,~ 0,~ 1,~ 2)$.
Усі ці варіанти впорядковують підрядки у відсортований порядок.
Тож усі вони коректні.
Водночас масив $c[]$ фіксований, тут не може бути жодних неоднозначностей.

Зосередьмося тепер на реалізації алгоритму.
Ми напишемо функцію, яка приймає рядок $s$ і повертає перестановку відсортованих циклічних зсувів.

<CodeTabs>

```cpp
vector<int> sort_cyclic_shifts(string const& s) {
    int n = s.size();
    const int alphabet = 256;
```

```python
def sort_cyclic_shifts(s: str) -> list[int]:
    n = len(s)
    alphabet = 256
```

```typescript
function sortCyclicShifts(s: string): number[] {
  const n = s.length;
  const alphabet = 256;
```

```go
func sortCyclicShifts(s string) []int {
    n := len(s)
    const alphabet = 256
```

</CodeTabs>

На початку (на **$0$-й ітерації**) ми маємо відсортувати циклічні підрядки довжини $1$, тобто маємо відсортувати всі символи рядка й поділити їх на класи еквівалентності (однакові символи потрапляють до одного класу).
Це можна зробити тривіально, наприклад, за допомогою **сортування підрахунком**.
Для кожного символа ми підраховуємо, скільки разів він зустрічається в рядку, а потім використовуємо цю інформацію для створення масиву $p[]$.
Після цього проходимо масивом $p[]$ і будуємо $c[]$, порівнюючи сусідні символи.

<CodeTabs>

```cpp
    vector<int> p(n), c(n), cnt(max(alphabet, n), 0);
    for (int i = 0; i < n; i++)
        cnt[s[i]]++;
    for (int i = 1; i < alphabet; i++)
        cnt[i] += cnt[i-1];
    for (int i = 0; i < n; i++)
        p[--cnt[s[i]]] = i;
    c[p[0]] = 0;
    int classes = 1;
    for (int i = 1; i < n; i++) {
        if (s[p[i]] != s[p[i-1]])
            classes++;
        c[p[i]] = classes - 1;
    }
```

```python
    p = [0] * n
    c = [0] * n
    cnt = [0] * max(alphabet, n)
    # Сортування підрахунком символів (підрядки довжини 1)
    for i in range(n):
        cnt[ord(s[i])] += 1
    for i in range(1, alphabet):
        cnt[i] += cnt[i - 1]
    for i in range(n):
        cnt[ord(s[i])] -= 1
        p[cnt[ord(s[i])]] = i
    # Будуємо класи еквівалентності, порівнюючи сусідні символи
    c[p[0]] = 0
    classes = 1
    for i in range(1, n):
        if s[p[i]] != s[p[i - 1]]:
            classes += 1
        c[p[i]] = classes - 1
```

```typescript
  const p: number[] = new Array(n).fill(0);
  // c оголошено через let — на кроці ітерації його обмінюють із cn
  let c: number[] = new Array(n).fill(0);
  const cnt: number[] = new Array(Math.max(alphabet, n)).fill(0);
  // Сортування підрахунком символів (підрядки довжини 1)
  for (let i = 0; i < n; i++) cnt[s.charCodeAt(i)]++;
  for (let i = 1; i < alphabet; i++) cnt[i] += cnt[i - 1];
  for (let i = 0; i < n; i++) p[--cnt[s.charCodeAt(i)]] = i;
  // Будуємо класи еквівалентності, порівнюючи сусідні символи
  c[p[0]] = 0;
  let classes = 1;
  for (let i = 1; i < n; i++) {
    if (s[p[i]] !== s[p[i - 1]]) classes++;
    c[p[i]] = classes - 1;
  }
```

```go
    p := make([]int, n)
    c := make([]int, n)
    cntSize := alphabet
    if n > cntSize {
        cntSize = n
    }
    cnt := make([]int, cntSize)
    // Сортування підрахунком символів (підрядки довжини 1)
    for i := 0; i < n; i++ {
        cnt[s[i]]++
    }
    for i := 1; i < alphabet; i++ {
        cnt[i] += cnt[i-1]
    }
    for i := 0; i < n; i++ {
        cnt[s[i]]--
        p[cnt[s[i]]] = i
    }
    // Будуємо класи еквівалентності, порівнюючи сусідні символи
    c[p[0]] = 0
    classes := 1
    for i := 1; i < n; i++ {
        if s[p[i]] != s[p[i-1]] {
            classes++
        }
        c[p[i]] = classes - 1
    }
```

</CodeTabs>

Тепер поговорімо про крок ітерації.
Припустімо, що ми вже виконали $k-1$-й крок і обчислили для нього значення масивів $p[]$ та $c[]$.
Ми хочемо обчислити значення для $k$-го кроку за $O(n)$ часу.
Оскільки ми виконуємо цей крок $O(\log n)$ разів, увесь алгоритм матиме часову складність $O(n \log n)$.

Для цього зауважимо, що циклічний підрядок довжини $2^k$ складається з двох підрядків довжини $2^{k-1}$, які ми можемо порівняти між собою за $O(1)$, використовуючи інформацію з попередньої фази — значення класів еквівалентності $c[]$.
Отже, для двох підрядків довжини $2^k$, що починаються в позиціях $i$ та $j$, уся необхідна для їх порівняння інформація міститься в парах $(c[i],~ c[i + 2^{k-1}])$ та $(c[j],~ c[j + 2^{k-1}])$.

$$
\dots
\overbrace{
\underbrace{s_i \dots s_{i+2^{k-1}-1}}_{\text{length} = 2^{k-1},~ \text{class} = c[i]}
\quad
\underbrace{s_{i+2^{k-1}} \dots s_{i+2^k-1}}_{\text{length} = 2^{k-1},~ \text{class} = c[i + 2^{k-1}]}
}^{\text{length} = 2^k}
\dots
\overbrace{
\underbrace{s_j \dots s_{j+2^{k-1}-1}}_{\text{length} = 2^{k-1},~ \text{class} = c[j]}
\quad
\underbrace{s_{j+2^{k-1}} \dots s_{j+2^k-1}}_{\text{length} = 2^{k-1},~ \text{class} = c[j + 2^{k-1}]}
}^{\text{length} = 2^k}
\dots
$$

Це дає нам дуже просте розв'язання:
**відсортуємо** підрядки довжини $2^k$ **за цими парами чисел**.
Це дасть нам потрібний порядок $p[]$.
Однак звичайне сортування працює за $O(n \log n)$ часу, що нас не влаштовує.
Так ми отримали б лише алгоритм побудови суфіксного масиву за $O(n \log^2 n)$ часу.

Як же швидко виконати таке сортування пар?
Оскільки елементи пар не перевищують $n$, ми знову можемо скористатися сортуванням підрахунком.
Однак сортувати пари сортуванням підрахунком — не найефективніший шлях.
Щоб отримати кращу приховану константу у складності, ми скористаємося ще одним трюком.

Тут ми використовуємо техніку, на якій ґрунтується **порозрядне сортування**: щоб відсортувати пари, ми спершу сортуємо їх за другим елементом, а потім за першим (стабільним сортуванням, тобто сортуванням, що не порушує відносного порядку рівних елементів).
Однак другі елементи вже були відсортовані на попередній ітерації.
Отже, щоб відсортувати пари за другими елементами, нам достатньо відняти $2^{k-1}$ від індексів у $p[]$ (наприклад, якщо найменший підрядок довжини $2^{k-1}$ починається в позиції $i$, то підрядок довжини $2^k$ з найменшою другою половиною починається в $i - 2^{k-1}$).

Отже, лише простими відніманнями ми можемо відсортувати другі елементи пар у $p[]$.
Тепер нам потрібно виконати стабільне сортування за першими елементами.
Як уже зазначалося, це можна зробити сортуванням підрахунком.

Залишається тільки обчислити класи еквівалентності $c[]$, але, як і раніше, це можна зробити, просто проходячи відсортованою перестановкою $p[]$ і порівнюючи сусідні пари.

Ось решта реалізації.
Ми використовуємо тимчасові масиви $pn[]$ та $cn[]$ для зберігання перестановки за другими елементами та нових номерів класів еквівалентності.

<CodeTabs>

```cpp
    vector<int> pn(n), cn(n);
    for (int h = 0; (1 << h) < n; ++h) {
        for (int i = 0; i < n; i++) {
            pn[i] = p[i] - (1 << h);
            if (pn[i] < 0)
                pn[i] += n;
        }
        fill(cnt.begin(), cnt.begin() + classes, 0);
        for (int i = 0; i < n; i++)
            cnt[c[pn[i]]]++;
        for (int i = 1; i < classes; i++)
            cnt[i] += cnt[i-1];
        for (int i = n-1; i >= 0; i--)
            p[--cnt[c[pn[i]]]] = pn[i];
        cn[p[0]] = 0;
        classes = 1;
        for (int i = 1; i < n; i++) {
            pair<int, int> cur = {c[p[i]], c[(p[i] + (1 << h)) % n]};
            pair<int, int> prev = {c[p[i-1]], c[(p[i-1] + (1 << h)) % n]};
            if (cur != prev)
                ++classes;
            cn[p[i]] = classes - 1;
        }
        c.swap(cn);
    }
    return p;
}
```

```python
    pn = [0] * n
    cn = [0] * n
    h = 0
    while (1 << h) < n:
        # Сортуємо за другим елементом пари: віднімаємо 2^h від індексів
        for i in range(n):
            pn[i] = p[i] - (1 << h)
            if pn[i] < 0:
                pn[i] += n
        # Стабільне сортування підрахунком за першим елементом (класом)
        for i in range(classes):
            cnt[i] = 0
        for i in range(n):
            cnt[c[pn[i]]] += 1
        for i in range(1, classes):
            cnt[i] += cnt[i - 1]
        for i in range(n - 1, -1, -1):
            cnt[c[pn[i]]] -= 1
            p[cnt[c[pn[i]]]] = pn[i]
        # Перераховуємо класи еквівалентності за парами
        cn[p[0]] = 0
        classes = 1
        for i in range(1, n):
            cur = (c[p[i]], c[(p[i] + (1 << h)) % n])
            prev = (c[p[i - 1]], c[(p[i - 1] + (1 << h)) % n])
            if cur != prev:
                classes += 1
            cn[p[i]] = classes - 1
        c, cn = cn, c
        h += 1
    return p
```

```typescript
  const pn: number[] = new Array(n).fill(0);
  let cn: number[] = new Array(n).fill(0);
  for (let h = 0; (1 << h) < n; ++h) {
    // Сортуємо за другим елементом пари: віднімаємо 2^h від індексів
    for (let i = 0; i < n; i++) {
      pn[i] = p[i] - (1 << h);
      if (pn[i] < 0) pn[i] += n;
    }
    // Стабільне сортування підрахунком за першим елементом (класом)
    for (let i = 0; i < classes; i++) cnt[i] = 0;
    for (let i = 0; i < n; i++) cnt[c[pn[i]]]++;
    for (let i = 1; i < classes; i++) cnt[i] += cnt[i - 1];
    for (let i = n - 1; i >= 0; i--) p[--cnt[c[pn[i]]]] = pn[i];
    // Перераховуємо класи еквівалентності за парами
    cn[p[0]] = 0;
    classes = 1;
    for (let i = 1; i < n; i++) {
      const cur0 = c[p[i]];
      const cur1 = c[(p[i] + (1 << h)) % n];
      const prev0 = c[p[i - 1]];
      const prev1 = c[(p[i - 1] + (1 << h)) % n];
      if (cur0 !== prev0 || cur1 !== prev1) ++classes;
      cn[p[i]] = classes - 1;
    }
    // Обмінюємо c та cn (аналог c.swap(cn))
    [c, cn] = [cn, c];
  }
  return p;
}
```

```go
    pn := make([]int, n)
    cn := make([]int, n)
    for h := 0; (1 << h) < n; h++ {
        // Сортуємо за другим елементом пари: віднімаємо 2^h від індексів
        for i := 0; i < n; i++ {
            pn[i] = p[i] - (1 << h)
            if pn[i] < 0 {
                pn[i] += n
            }
        }
        // Стабільне сортування підрахунком за першим елементом (класом)
        for i := 0; i < classes; i++ {
            cnt[i] = 0
        }
        for i := 0; i < n; i++ {
            cnt[c[pn[i]]]++
        }
        for i := 1; i < classes; i++ {
            cnt[i] += cnt[i-1]
        }
        for i := n - 1; i >= 0; i-- {
            cnt[c[pn[i]]]--
            p[cnt[c[pn[i]]]] = pn[i]
        }
        // Перераховуємо класи еквівалентності за парами
        cn[p[0]] = 0
        classes = 1
        for i := 1; i < n; i++ {
            cur0, cur1 := c[p[i]], c[(p[i]+(1<<h))%n]
            prev0, prev1 := c[p[i-1]], c[(p[i-1]+(1<<h))%n]
            if cur0 != prev0 || cur1 != prev1 {
                classes++
            }
            cn[p[i]] = classes - 1
        }
        // Обмінюємо c та cn (аналог c.swap(cn))
        c, cn = cn, c
    }
    return p
}
```

</CodeTabs>
Алгоритм потребує $O(n \log n)$ часу і $O(n)$ пам'яті. Для простоти ми використали як алфавіт увесь діапазон ASCII.

Якщо відомо, що рядок містить лише підмножину символів, наприклад тільки малі літери, то реалізацію можна оптимізувати, але виграш від оптимізації, найімовірніше, буде незначним, оскільки розмір алфавіту має значення тільки на першій ітерації. Кожна інша ітерація залежить від кількості класів еквівалентності, яка може швидко досягти $O(n)$, навіть якщо початково це був рядок над алфавітом розміру $2$.

Також зауважимо, що цей алгоритм сортує лише циклічні зсуви.
Як зазначено на початку цього розділу, ми можемо отримати відсортований порядок суфіксів, дописавши символ, менший за всі інші символи рядка, і відсортувавши отриманий рядок за циклічними зсувами, наприклад, відсортувавши циклічні зсуви $s + \textdollar$.
Це, очевидно, дасть суфіксний масив рядка $s$, однак з доданим спереду $|s|$.

<CodeTabs>

```cpp
vector<int> suffix_array_construction(string s) {
    s += "$";
    vector<int> sorted_shifts = sort_cyclic_shifts(s);
    sorted_shifts.erase(sorted_shifts.begin());
    return sorted_shifts;
}
```

```python
def suffix_array_construction(s: str) -> list[int]:
    s += "$"
    sorted_shifts = sort_cyclic_shifts(s)
    # Перший зсув починається з $ — це сам суфікс довжини 0, відкидаємо його
    return sorted_shifts[1:]
```

```typescript
function suffixArrayConstruction(s: string): number[] {
  s += "$";
  const sortedShifts = sortCyclicShifts(s);
  // Перший зсув починається з $ — це сам суфікс довжини 0, відкидаємо його
  return sortedShifts.slice(1);
}
```

```go
func suffixArrayConstruction(s string) []int {
    s += "$"
    sortedShifts := sortCyclicShifts(s)
    // Перший зсув починається з $ — це сам суфікс довжини 0, відкидаємо його
    return sortedShifts[1:]
}
```

</CodeTabs>

## Застосування \{#applications}

### Пошук найменшого циклічного зсуву \{#finding-the-smallest-cyclic-shift}

Наведений вище алгоритм сортує всі циклічні зсуви (без дописування символа до рядка), а отже, $p[0]$ дає позицію найменшого циклічного зсуву.

### Пошук підрядка в рядку \{#finding-a-substring-in-a-string}

Задача полягає в тому, щоб шукати рядок $s$ всередині деякого тексту $t$ в режимі онлайн — текст $t$ ми знаємо заздалегідь, а рядок $s$ — ні.
Ми можемо побудувати суфіксний масив для тексту $t$ за $O(|t| \log |t|)$ часу.
Тепер ми можемо шукати підрядок $s$ так.
Входження $s$ має бути префіксом якогось суфікса з $t$.
Оскільки ми відсортували всі суфікси, ми можемо виконати бінарний пошук $s$ у $p$.
Порівняння поточного суфікса з підрядком $s$ у межах бінарного пошуку можна зробити за $O(|s|)$ часу, тому складність пошуку підрядка становить $O(|s| \log |t|)$.
Зауважте також, що якщо підрядок зустрічається в $t$ кілька разів, то всі входження будуть розташовані поруч одне з одним у $p$.
Тому кількість входжень можна знайти другим бінарним пошуком, а всі входження легко вивести.

### Порівняння двох підрядків рядка \{#comparing-two-substrings-of-a-string}

Ми хочемо мати змогу порівнювати два підрядки однакової довжини заданого рядка $s$ за $O(1)$ часу, тобто перевіряти, чи перший підрядок менший за другий.

Для цього ми будуємо суфіксний масив за $O(|s| \log |s|)$ часу й зберігаємо всі проміжні результати класів еквівалентності $c[]$.

Використовуючи цю інформацію, ми можемо порівняти будь-які два підрядки, довжина яких дорівнює степеню двійки, за $O(1)$:
для цього достатньо порівняти класи еквівалентності обох підрядків.
Тепер ми хочемо узагальнити цей метод на підрядки довільної довжини.

Порівняймо два підрядки довжини $l$ з початковими індексами $i$ та $j$.
Знаходимо найбільшу довжину блока, що вміщується всередину підрядка такої довжини: найбільше $k$ таке, що $2^k \le l$.
Тоді порівняння двох підрядків можна замінити порівнянням двох блоків довжини $2^k$, що перекриваються:
спершу потрібно порівняти два блоки, що починаються в позиціях $i$ та $j$, а якщо вони рівні — порівняти два блоки, що закінчуються в позиціях $i + l - 1$ та $j + l - 1$:

$$
\dots
\overbrace{\underbrace{s_i \dots s_{i+l-2^k} \dots s_{i+2^k-1}}_{2^k} \dots s_{i+l-1}}^{\text{first}}
\dots
\overbrace{\underbrace{s_j \dots s_{j+l-2^k} \dots s_{j+2^k-1}}_{2^k} \dots s_{j+l-1}}^{\text{second}}
\dots
$$

$$
\dots
\overbrace{s_i \dots \underbrace{s_{i+l-2^k} \dots s_{i+2^k-1} \dots s_{i+l-1}}_{2^k}}^{\text{first}}
\dots
\overbrace{s_j \dots \underbrace{s_{j+l-2^k} \dots s_{j+2^k-1} \dots s_{j+l-1}}_{2^k}}^{\text{second}}
\dots
$$

Ось реалізація порівняння.
Зауважте, що ми вважаємо, ніби функцію викликають із уже обчисленим $k$.
$k$ можна обчислити як $\lfloor \log l \rfloor$, але ефективніше попередньо обчислити всі значення $k$ для кожного $l$.
Дивіться, наприклад, статтю про [розріджену таблицю](../data_structures/sparse-table.md), яка використовує схожу ідею і обчислює всі значення $\log$.

<CodeTabs>

```cpp
int compare(int i, int j, int l, int k) {
    pair<int, int> a = {c[k][i], c[k][(i+l-(1 << k))%n]};
    pair<int, int> b = {c[k][j], c[k][(j+l-(1 << k))%n]};
    return a == b ? 0 : a < b ? -1 : 1;
}
```

```python
def compare(i: int, j: int, l: int, k: int) -> int:
    # c[k] — класи еквівалентності для блоків довжини 2^k
    a = (c[k][i], c[k][(i + l - (1 << k)) % n])
    b = (c[k][j], c[k][(j + l - (1 << k)) % n])
    return 0 if a == b else (-1 if a < b else 1)
```

```typescript
function compare(i: number, j: number, l: number, k: number): number {
  // c[k] — класи еквівалентності для блоків довжини 2^k
  const a: [number, number] = [c[k][i], c[k][(i + l - (1 << k)) % n]];
  const b: [number, number] = [c[k][j], c[k][(j + l - (1 << k)) % n]];
  if (a[0] === b[0] && a[1] === b[1]) return 0;
  if (a[0] < b[0] || (a[0] === b[0] && a[1] < b[1])) return -1;
  return 1;
}
```

```go
func compare(i, j, l, k int) int {
    // c[k] — класи еквівалентності для блоків довжини 2^k
    a0, a1 := c[k][i], c[k][(i+l-(1<<k))%n]
    b0, b1 := c[k][j], c[k][(j+l-(1<<k))%n]
    if a0 == b0 && a1 == b1 {
        return 0
    }
    if a0 < b0 || (a0 == b0 && a1 < b1) {
        return -1
    }
    return 1
}
```

</CodeTabs>

### Найдовший спільний префікс двох підрядків з додатковою пам'яттю \{#longest-common-prefix-of-two-substrings-with-additional-memory}

Для заданого рядка $s$ ми хочемо обчислити найдовший спільний префікс (**LCP**) двох довільних суфіксів з позиціями $i$ та $j$.

Описаний тут метод використовує $O(|s| \log |s|)$ додаткової пам'яті.
Цілком інший підхід, який використовуватиме лише лінійний обсяг пам'яті, описано в наступному розділі.

Ми будуємо суфіксний масив за $O(|s| \log |s|)$ часу і запам'ятовуємо проміжні результати масивів $c[]$ з кожної ітерації.

Обчислімо LCP для двох суфіксів, що починаються в позиціях $i$ та $j$.
Ми можемо порівняти будь-які два підрядки, довжина яких дорівнює степеню двійки, за $O(1)$.
Для цього ми порівнюємо рядки за степенями двійки (від найбільшого степеня до найменшого), і якщо підрядки цієї довжини однакові, то ми додаємо цю довжину до відповіді й продовжуємо перевіряти LCP праворуч від рівної частини, тобто $i$ та $j$ збільшуються на поточний степінь двійки.

<CodeTabs>

```cpp
int lcp(int i, int j) {
    int ans = 0;
    for (int k = log_n; k >= 0; k--) {
        if (c[k][i % n] == c[k][j % n]) {
            ans += 1 << k;
            i += 1 << k;
            j += 1 << k;
        }
    }
    return ans;
}
```

```python
def lcp(i: int, j: int) -> int:
    ans = 0
    # Йдемо від найбільшого степеня двійки до найменшого
    for k in range(log_n, -1, -1):
        if c[k][i % n] == c[k][j % n]:
            ans += 1 << k
            i += 1 << k
            j += 1 << k
    return ans
```

```typescript
function lcp(i: number, j: number): number {
  let ans = 0;
  // Йдемо від найбільшого степеня двійки до найменшого
  for (let k = logN; k >= 0; k--) {
    if (c[k][i % n] === c[k][j % n]) {
      ans += 1 << k;
      i += 1 << k;
      j += 1 << k;
    }
  }
  return ans;
}
```

```go
func lcp(i, j int) int {
    ans := 0
    // Йдемо від найбільшого степеня двійки до найменшого
    for k := logN; k >= 0; k-- {
        if c[k][i%n] == c[k][j%n] {
            ans += 1 << k
            i += 1 << k
            j += 1 << k
        }
    }
    return ans
}
```

</CodeTabs>

Тут `log_n` позначає константу, що дорівнює логарифму $n$ за основою $2$, заокругленому вниз.

### Найдовший спільний префікс двох підрядків без додаткової пам'яті \{#longest-common-prefix-of-two-substrings-without-additional-memory}

Маємо ту саму задачу, що й у попередньому розділі.
Нам треба обчислити найдовший спільний префікс (**LCP**) двох суфіксів рядка $s$.

На відміну від попереднього методу, цей використовуватиме лише $O(|s|)$ пам'яті.
Результатом попередньої обробки буде масив (який сам по собі є важливим джерелом інформації про рядок і тому використовується також для розв'язання інших задач).
На LCP-запити можна відповідати, виконуючи RMQ-запити (запити мінімуму на відрізку) у цьому масиві, тож для різних реалізацій можна досягти логарифмічного й навіть сталого часу запиту.

Основою цього алгоритму є така ідея:
ми обчислимо найдовший спільний префікс для кожної **пари сусідніх суфіксів у відсортованому порядку**.
Іншими словами, ми будуємо масив $\text{lcp}[0 \dots n-2]$, де $\text{lcp}[i]$ дорівнює довжині найдовшого спільного префікса суфіксів, що починаються в позиціях $p[i]$ та $p[i+1]$.
Цей масив даватиме нам відповідь для будь-яких двох сусідніх суфіксів рядка.
Тоді відповідь для довільних двох суфіксів, не обов'язково сусідніх, можна отримати з цього масиву.
Справді, нехай запит полягає в обчисленні LCP суфіксів $p[i]$ та $p[j]$.
Тоді відповіддю на цей запит буде $\min(lcp[i],~ lcp[i+1],~ \dots,~ lcp[j-1])$.

Отже, якщо в нас є такий масив $\text{lcp}$, то задача зводиться до [RMQ](../sequences/rmq.md), що має багато різних розв'язань з різною складністю.

Тож головна задача — **побудувати** цей масив $\text{lcp}$.
Ми скористаємося **алгоритмом Касаї**, який може обчислити цей масив за $O(n)$ часу.

Розгляньмо два сусідніх суфікси у відсортованому порядку (порядку суфіксного масиву).
Нехай їхні початкові позиції — $i$ та $j$, а їхній $\text{lcp}$ дорівнює $k > 0$.
Якщо ми видалимо першу літеру обох суфіксів — тобто візьмемо суфікси $i+1$ та $j+1$ — то має бути очевидно, що $\text{lcp}$ цих двох дорівнює $k - 1$.
Однак ми не можемо використати це значення й записати його в масив $\text{lcp}$, бо ці два суфікси можуть і не стояти поруч у відсортованому порядку.
Суфікс $i+1$, звісно, буде меншим за суфікс $j+1$, але між ними можуть бути ще якісь суфікси.
Однак, оскільки ми знаємо, що LCP між двома суфіксами — це мінімальне значення серед усіх переходів, ми також знаємо, що LCP між будь-якою парою на цьому відрізку має бути щонайменше $k-1$, зокрема й між $i+1$ та наступним суфіксом.
І, можливо, він може бути більшим.

Тепер ми вже можемо реалізувати алгоритм.
Ми проходитимемо суфікси в порядку їхньої довжини. Так ми можемо повторно використати останнє значення $k$, оскільки перехід від суфікса $i$ до суфікса $i+1$ — це те саме, що видалення першої літери.
Нам знадобиться додатковий масив $\text{rank}$, який даватиме нам позицію суфікса у відсортованому списку суфіксів.

<CodeTabs>

```cpp
vector<int> lcp_construction(string const& s, vector<int> const& p) {
    int n = s.size();
    vector<int> rank(n, 0);
    for (int i = 0; i < n; i++)
        rank[p[i]] = i;

    int k = 0;
    vector<int> lcp(n-1, 0);
    for (int i = 0; i < n; i++) {
        if (rank[i] == n - 1) {
            k = 0;
            continue;
        }
        int j = p[rank[i] + 1];
        while (i + k < n && j + k < n && s[i+k] == s[j+k])
            k++;
        lcp[rank[i]] = k;
        if (k)
            k--;
    }
    return lcp;
}
```

```python
def lcp_construction(s: str, p: list[int]) -> list[int]:
    n = len(s)
    # rank[i] — позиція суфікса i у відсортованому списку
    rank = [0] * n
    for i in range(n):
        rank[p[i]] = i

    k = 0
    lcp = [0] * (n - 1)
    # Алгоритм Касаї: проходимо суфікси в порядку їхньої довжини
    for i in range(n):
        if rank[i] == n - 1:
            k = 0
            continue
        j = p[rank[i] + 1]
        while i + k < n and j + k < n and s[i + k] == s[j + k]:
            k += 1
        lcp[rank[i]] = k
        if k:
            k -= 1
    return lcp
```

```typescript
function lcpConstruction(s: string, p: number[]): number[] {
  const n = s.length;
  // rank[i] — позиція суфікса i у відсортованому списку
  const rank: number[] = new Array(n).fill(0);
  for (let i = 0; i < n; i++) rank[p[i]] = i;

  let k = 0;
  const lcp: number[] = new Array(n - 1).fill(0);
  // Алгоритм Касаї: проходимо суфікси в порядку їхньої довжини
  for (let i = 0; i < n; i++) {
    if (rank[i] === n - 1) {
      k = 0;
      continue;
    }
    const j = p[rank[i] + 1];
    while (i + k < n && j + k < n && s[i + k] === s[j + k]) k++;
    lcp[rank[i]] = k;
    if (k) k--;
  }
  return lcp;
}
```

```go
func lcpConstruction(s string, p []int) []int {
    n := len(s)
    // rank[i] — позиція суфікса i у відсортованому списку
    rank := make([]int, n)
    for i := 0; i < n; i++ {
        rank[p[i]] = i
    }

    k := 0
    lcp := make([]int, n-1)
    // Алгоритм Касаї: проходимо суфікси в порядку їхньої довжини
    for i := 0; i < n; i++ {
        if rank[i] == n-1 {
            k = 0
            continue
        }
        j := p[rank[i]+1]
        for i+k < n && j+k < n && s[i+k] == s[j+k] {
            k++
        }
        lcp[rank[i]] = k
        if k > 0 {
            k--
        }
    }
    return lcp
}
```

</CodeTabs>

Легко бачити, що ми зменшуємо $k$ щонайбільше $O(n)$ разів (на кожній ітерації щонайбільше один раз, окрім випадку $\text{rank}[i] == n-1$, де ми безпосередньо скидаємо його до $0$), і оскільки LCP між двома рядками не перевищує $n-1$, ми також збільшуватимемо $k$ лише $O(n)$ разів.
Тому алгоритм працює за $O(n)$ часу.

### Кількість різних підрядків \{#number-of-different-substrings}

Ми попередньо обробляємо рядок $s$, обчислюючи суфіксний масив і масив LCP.
Використовуючи цю інформацію, ми можемо обчислити кількість різних підрядків у рядку.

Для цього ми поміркуємо, які **нові** підрядки починаються в позиції $p[0]$, потім у $p[1]$ і так далі.
Власне, ми беремо суфікси у відсортованому порядку й дивимося, які префікси дають нові підрядки.
Так ми випадково жодного не пропустимо.

Оскільки суфікси відсортовані, зрозуміло, що поточний суфікс $p[i]$ дасть нові підрядки для всіх своїх префіксів, окрім тих префіксів, що збігаються із суфіксом $p[i-1]$.
Тобто всі його префікси, крім перших $\text{lcp}[i-1]$ з них.
Оскільки довжина поточного суфікса дорівнює $n - p[i]$, у позиції $p[i]$ починається $n - p[i] - \text{lcp}[i-1]$ нових префіксів.
Підсумовуючи по всіх суфіксах, отримуємо остаточну відповідь:

$$
\sum_{i=0}^{n-1} (n - p[i]) - \sum_{i=0}^{n-2} \text{lcp}[i] = \frac{n^2 + n}{2} - \sum_{i=0}^{n-2} \text{lcp}[i]
$$

## Задачі для практики \{#practice-problems}

* [Uva 760 - DNA Sequencing](http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&category=24&page=show_problem&problem=701)
* [Uva 1223 - Editor](http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&category=24&page=show_problem&problem=3664)
* [Codechef - Tandem](https://www.codechef.com/problems/TANDEM)
* [Codechef - Substrings and Repetitions](https://www.codechef.com/problems/ANUSAR)
* [Codechef - Entangled Strings](https://www.codechef.com/problems/TANGLED)
* [Codeforces - Martian Strings](http://codeforces.com/problemset/problem/149/E)
* [Codeforces - Little Elephant and Strings](http://codeforces.com/problemset/problem/204/E)
* [SPOJ - Ada and Terramorphing](http://www.spoj.com/problems/ADAPHOTO/)
* [SPOJ - Ada and Substring](http://www.spoj.com/problems/ADASTRNG/)
* [UVA - 1227 - The longest constant gene](https://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=3668)
* [SPOJ - Longest Common Substring](http://www.spoj.com/problems/LCS/en/)
* [UVA 11512 - GATTACA](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=2507)
* [LA 7502 - Suffixes and Palindromes](https://vjudge.net/problem/UVALive-7502)
* [GYM - Por Costel and the Censorship Committee](http://codeforces.com/gym/100923/problem/D)
* [UVA 1254 - Top 10](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=3695)
* [UVA 12191 - File Recover](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=3343)
* [UVA 12206 - Stammering Aliens](https://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=3358)
* [Codechef - Jarvis and LCP](https://www.codechef.com/problems/INSQ16F)
* [LA 3943 - Liking's Letter](https://vjudge.net/problem/UVALive-3943)
* [UVA 11107 - Life Forms](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=2048)
* [UVA 12974 - Exquisite Strings](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&category=862&page=show_problem&problem=4853)
* [UVA 10526 - Intellectual Property](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=1467)
* [UVA 12338 - Anti-Rhyme Pairs](https://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=3760)
* [UVA 12191 - File Recover](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=3343)
* [SPOJ - Suffix Array](http://www.spoj.com/problems/SARRAY/)
* [LA 4513 - Stammering Aliens](https://vjudge.net/problem/UVALive-4513)
* [SPOJ - LCS2](http://www.spoj.com/problems/LCS2/)
* [Codeforces - Fake News (hard)](http://codeforces.com/contest/802/problem/I)
* [SPOJ - Longest Commong Substring](http://www.spoj.com/problems/LONGCS/)
* [SPOJ - Lexicographical Substring Search](http://www.spoj.com/problems/SUBLEX/)
* [Codeforces - Forbidden Indices](http://codeforces.com/contest/873/problem/F)
* [Codeforces - Tricky and Clever Password](http://codeforces.com/contest/30/problem/E)
* [LA 6856 - Circle of digits](https://vjudge.net/problem/UVALive-6856)

## Відеоматеріали \{#video}

- [Advanced Data Structures: Suffix Arrays — Niema Moshiri](https://www.youtube.com/watch?v=IzMxbboPcqQ) (6 хв, англійською)
