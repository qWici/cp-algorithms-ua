# Пошук повторів

Дано рядок $s$ довжини $n$.

**Повтором** (тандемним повтором) називаються два входження одного рядка підряд.
Інакше кажучи, тандемний повтор можна описати парою індексів $i < j$ такою, що підрядок $s[i \dots j]$ складається з двох однакових рядків, записаних один за одним.

Задача полягає в тому, щоб **знайти всі тандемні повтори** в заданому рядку $s$.
Або спрощений варіант: знайти **будь-який** повтор чи знайти **найдовший** повтор.

Описаний тут алгоритм опублікували 1982 року Мейн і Лоренц.

## Приклад \{#example}

Розгляньмо повтори в такому прикладі рядка:

$$
acababaee
$$

Цей рядок містить такі три тандемні повтори:

- $s[2 \dots 5] = abab$
- $s[3 \dots 6] = baba$
- $s[7 \dots 8] = ee$

Ще один приклад:

$$
abaaba
$$

Тут є лише два тандемні повтори

- $s[0 \dots 5] = abaaba$
- $s[2 \dots 3] = aa$

## Кількість повторів \{#number-of-repetitions}

Загалом у рядку довжини $n$ може бути до $O(n^2)$ тандемних повторів.
Очевидний приклад — рядок, що складається з $n$ однакових літер; у цьому випадку будь-який підрядок парної довжини є повтором.
Загалом будь-який періодичний рядок із коротким періодом міститиме багато повторів.

З іншого боку, цей факт не заважає обчислити кількість повторів за час $O(n \log n)$, бо алгоритм може видавати повтори в стиснутому вигляді — групами по кілька штук одразу.

Існує навіть поняття, яке описує групи періодичних підрядків четвірками чисел.
Доведено, що кількість таких груп щонайбільше лінійна відносно довжини рядка.

Також ось іще кілька цікавих результатів, пов'язаних із кількістю повторів:

  - Кількість примітивних повторів (тих, чиї половини самі не є повторами) щонайбільше $O(n \log n)$.
  - Якщо кодувати повтори четвірками чисел (так звані трійки Крошмора) $(i,~ p,~ r)$ (де $i$ — позиція початку, $p$ — довжина повторюваного підрядка, а $r$ — кількість повторень), то всі повтори можна описати за допомогою $O(n \log n)$ таких трійок.
  - Рядки Фібоначчі, означені як 
    
    $$
    \begin{align}
    t_0 &= a, \\\\
    t_1 &= b, \\\\
    t_i &= t_{i-1} + t_{i-2},
    \end{align}
    $$
    
    є «сильно» періодичними.
    Кількість повторів у рядку Фібоначчі $f_i$, навіть стиснута трійками Крошмора, дорівнює $O(f_n \log f_n)$.
    Кількість примітивних повторів також становить $O(f_n \log f_n)$.

## Алгоритм Мейна–Лоренца \{#main-lorentz-algorithm}

В основі алгоритму Мейна–Лоренца лежить ідея **«розділяй і володарюй»**.

Він ділить початковий рядок навпіл і двома рекурсивними викликами обчислює кількість повторів, що цілком лежать у кожній половині.
Далі йде складна частина.
Алгоритм знаходить усі повтори, що починаються в першій половині й закінчуються в другій (називатимемо їх **перехресними повторами**).
Це і є основна частина алгоритму Мейна–Лоренца, яку ми тут детально розглянемо.

Складність алгоритмів за принципом «розділяй і володарюй» добре досліджена.
[Основна теорема](https://en.wikipedia.org/wiki/Master_theorem_(analysis_of_algorithms)) каже, що в підсумку ми отримаємо алгоритм за $O(n \log n)$, якщо зможемо обчислити перехресні повтори за час $O(n)$.

### Пошук перехресних повторів \{#search-for-crossing-repetitions}

Отже, ми хочемо знайти всі такі повтори, що починаються в першій половині рядка, назвімо її $u$, і закінчуються в другій половині, назвімо її $v$:

$$
s = u + v
$$

Їхні довжини приблизно дорівнюють довжині $s$, поділеній навпіл.

Розгляньмо довільний повтор і подивімося на його серединний символ (точніше, на перший символ другої половини повтору).
Тобто якщо повтор — це підрядок $s[i \dots j]$, то серединний символ має позицію $(i + j + 1) / 2$.

Ми називаємо повтор **лівим** або **правим** залежно від того, у якому рядку розташований цей символ — у рядку $u$ чи в рядку $v$.
Інакше кажучи, повтор називається лівим, якщо більша його частина лежить у $u$, інакше називаємо його правим.

Тепер ми обговоримо, як знайти **всі ліві повтори**.
Знаходження всіх правих повторів виконується так само.

Позначмо довжину лівого повтору через $2l$ (тобто кожна половина повтору має довжину $l$).
Розгляньмо перший символ повтору, що потрапляє в рядок $v$ (він стоїть на позиції $|u|$ в рядку $s$).
Він збігається із символом, що стоїть на $l$ позицій раніше; позначмо цю позицію $cntr$.

Ми зафіксуємо цю позицію $cntr$ і **шукатимемо всі повтори в цій позиції** $cntr$.

Наприклад:

$$
c ~ \underset{cntr}{a} ~ c ~ | ~ a ~ d ~ a
$$

Вертикальні риски розділяють дві половини.
Тут ми зафіксували позицію $cntr = 1$, і в цій позиції знаходимо повтор $caca$.

Зрозуміло, що, зафіксувавши позицію $cntr$, ми одночасно фіксуємо довжину можливих повторів: $l = |u| - cntr$.
Щойно ми навчимося знаходити ці повтори, ми проітеруємо по всіх можливих значеннях $cntr$ від $0$ до $|u|-1$ і знайдемо всі ліві перехресні повтори довжини $l = |u|,~ |u|-1,~ \dots, 1$.

### Критерій лівих перехресних повторів \{#criterion-for-left-crossing-repetitions}

Тож як нам знайти всі такі повтори для фіксованого $cntr$?
Пам'ятаймо, що таких повторів усе ще може бути кілька.

Знову подивімося на ілюстрацію, цього разу для повтору $abcabc$:

$$
\overbrace{a}^{l_1} ~ \overbrace{\underset{cntr}{b} ~ c}^{l_2} ~ \overbrace{a}^{l_1} ~ | ~ \overbrace{b ~ c}^{l_2}
$$

Тут ми позначили довжини двох частин повтору через $l_1$ і $l_2$:
$l_1$ — це довжина повтору до позиції $cntr-1$, а $l_2$ — довжина повтору від $cntr$ до кінця половини повтору.
Загальна довжина повтору дорівнює $2l = l_1 + l_2 + l_1 + l_2$.

Сформулюймо **необхідні та достатні** умови такого повтору в позиції $cntr$ довжини $2l = 2(l_1 + l_2) = 2(|u| - cntr)$:

- Нехай $k_1$ — найбільше число таке, що перші $k_1$ символів перед позицією $cntr$ збігаються з останніми $k_1$ символами в рядку $u$:
  
$$
u[cntr - k_1 \dots cntr - 1] = u[|u| - k_1 \dots |u| - 1]
$$
  
- Нехай $k_2$ — найбільше число таке, що $k_2$ символів, починаючи з позиції $cntr$, збігаються з першими $k_2$ символами в рядку $v$:

$$  
  u[cntr \dots cntr + k_2 - 1] = v[0 \dots k_2 - 1]
$$
  
- Тоді ми маємо повтор рівно для будь-якої пари $(l_1,~ l_2)$ з

$$
  \begin{align}
  l_1 &\le k_1, \\\\
  l_2 &\le k_2. \\\\
  \end{align}
$$

Підсумуймо:

- Ми фіксуємо конкретну позицію $cntr$.
- Усі повтори, які ми тепер знайдемо, мають довжину $2l = 2(|u| - cntr)$.
  Таких повторів може бути кілька, вони залежать від довжин $l_1$ та $l_2 = l - l_1$.
- Ми знаходимо $k_1$ та $k_2$, як описано вище.
- Тоді всі підхожі повтори — це ті, для яких довжини частин $l_1$ та $l_2$ задовольняють умови:

$$
  \begin{align}
  l_1 + l_2 &= l = |u| - cntr \\\\
  l_1 &\le k_1, \\\\
  l_2 &\le k_2. \\\\
  \end{align}
$$

Отже, лишається тільки питання, як швидко обчислити значення $k_1$ та $k_2$ для кожної позиції $cntr$.
На щастя, ми можемо обчислити їх за $O(1)$ за допомогою [Z-функції](../string/z-function.md):

- Значення $k_1$ для кожної позиції можна знайти, обчисливши Z-функцію для рядка $\overline{u}$ (тобто оберненого рядка $u$).
  Тоді значення $k_1$ для конкретного $cntr$ дорівнюватиме відповідному значенню масиву Z-функції.
- Щоб попередньо обчислити всі значення $k_2$, обчислюємо Z-функцію для рядка $v + \# + u$ (тобто рядка $u$, з'єднаного з символом-роздільником $\#$ і рядком $v$).
  Знову ж таки, нам потрібно лише знайти відповідне значення в Z-функції, щоб отримати значення $k_2$.

Цього достатньо, щоб знайти всі ліві перехресні повтори.

### Праві перехресні повтори \{#right-crossing-repetitions}

Для обчислення правих перехресних повторів ми діємо аналогічно:
центр $cntr$ ми означуємо як символ, що відповідає останньому символу в рядку $u$.

Тоді довжину $k_1$ означуємо як найбільшу кількість символів перед позицією $cntr$ (включно), які збігаються з останніми символами рядка $u$.
А довжину $k_2$ означуємо як найбільшу кількість символів, починаючи з $cntr + 1$, які збігаються із символами рядка $v$.

Таким чином, ми можемо знайти значення $k_1$ та $k_2$, обчисливши Z-функцію для рядків $\overline{u} + \# + \overline{v}$ та $v$.

Після цього ми можемо знайти повтори, переглянувши всі позиції $cntr$ і застосувавши той самий критерій, який ми мали для лівих перехресних повторів.

### Реалізація \{#implementation}

Реалізація алгоритму Мейна–Лоренца знаходить усі повтори у вигляді специфічних четвірок: $(cntr,~ l,~ k_1,~ k_2)$ за час $O(n \log n)$.
Якщо вам потрібно лише знайти кількість повторів у рядку або знайти лише найдовший повтор у рядку, цієї інформації достатньо, і час роботи все одно становитиме $O(n \log n)$.

Зауважте, що якщо ви захочете розгорнути ці четвірки, щоб отримати початкову та кінцеву позиції кожного повтору, то час роботи становитиме $O(n^2)$ (пам'ятайте, що повторів може бути $O(n^2)$).
У цій реалізації ми так і зробимо й зберігатимемо всі знайдені повтори у векторі пар початкового та кінцевого індексів.

<CodeTabs>

```cpp
vector<int> z_function(string const& s) {
    int n = s.size();
    vector<int> z(n);
    for (int i = 1, l = 0, r = 0; i < n; i++) {
        if (i <= r)
            z[i] = min(r-i+1, z[i-l]);
        while (i + z[i] < n && s[z[i]] == s[i+z[i]])
            z[i]++;
        if (i + z[i] - 1 > r) {
            l = i;
            r = i + z[i] - 1;
        }
    }
    return z;
}

int get_z(vector<int> const& z, int i) {
    if (0 <= i && i < (int)z.size())
        return z[i];
    else
        return 0;
}

vector<pair<int, int>> repetitions;

void convert_to_repetitions(int shift, bool left, int cntr, int l, int k1, int k2) {
    for (int l1 = max(1, l - k2); l1 <= min(l, k1); l1++) {
        if (left && l1 == l) break;
        int l2 = l - l1;
        int pos = shift + (left ? cntr - l1 : cntr - l - l1 + 1);
        repetitions.emplace_back(pos, pos + 2*l - 1);
    }
}

void find_repetitions(string s, int shift = 0) {
    int n = s.size();
    if (n == 1)
        return;

    int nu = n / 2;
    int nv = n - nu;
    string u = s.substr(0, nu);
    string v = s.substr(nu);
    string ru(u.rbegin(), u.rend());
    string rv(v.rbegin(), v.rend());

    find_repetitions(u, shift);
    find_repetitions(v, shift + nu);

    vector<int> z1 = z_function(ru);
    vector<int> z2 = z_function(v + '#' + u);
    vector<int> z3 = z_function(ru + '#' + rv);
    vector<int> z4 = z_function(v);

    for (int cntr = 0; cntr < n; cntr++) {
        int l, k1, k2;
        if (cntr < nu) {
            l = nu - cntr;
            k1 = get_z(z1, nu - cntr);
            k2 = get_z(z2, nv + 1 + cntr);
        } else {
            l = cntr - nu + 1;
            k1 = get_z(z3, nu + 1 + nv - 1 - (cntr - nu));
            k2 = get_z(z4, (cntr - nu) + 1);
        }
        if (k1 + k2 >= l)
            convert_to_repetitions(shift, cntr < nu, cntr, l, k1, k2);
    }
}
```

```python
def z_function(s):
    n = len(s)
    z = [0] * n
    l = r = 0
    for i in range(1, n):
        if i <= r:
            z[i] = min(r - i + 1, z[i - l])
        while i + z[i] < n and s[z[i]] == s[i + z[i]]:
            z[i] += 1
        if i + z[i] - 1 > r:
            l, r = i, i + z[i] - 1
    return z


def get_z(z, i):
    return z[i] if 0 <= i < len(z) else 0


repetitions = []


def convert_to_repetitions(shift, left, cntr, l, k1, k2):
    for l1 in range(max(1, l - k2), min(l, k1) + 1):
        if left and l1 == l:
            break
        l2 = l - l1
        pos = shift + (cntr - l1 if left else cntr - l - l1 + 1)
        repetitions.append((pos, pos + 2 * l - 1))


def find_repetitions(s, shift=0):
    n = len(s)
    if n == 1:
        return

    nu = n // 2
    nv = n - nu
    u = s[:nu]
    v = s[nu:]
    ru = u[::-1]
    rv = v[::-1]

    find_repetitions(u, shift)
    find_repetitions(v, shift + nu)

    z1 = z_function(ru)
    z2 = z_function(v + '#' + u)
    z3 = z_function(ru + '#' + rv)
    z4 = z_function(v)

    for cntr in range(n):
        if cntr < nu:
            l = nu - cntr
            k1 = get_z(z1, nu - cntr)
            k2 = get_z(z2, nv + 1 + cntr)
        else:
            l = cntr - nu + 1
            k1 = get_z(z3, nu + 1 + nv - 1 - (cntr - nu))
            k2 = get_z(z4, (cntr - nu) + 1)
        if k1 + k2 >= l:
            convert_to_repetitions(shift, cntr < nu, cntr, l, k1, k2)
```

```typescript
function z_function(s: string): number[] {
    const n = s.length;
    const z = new Array<number>(n).fill(0);
    for (let i = 1, l = 0, r = 0; i < n; i++) {
        if (i <= r) z[i] = Math.min(r - i + 1, z[i - l]);
        while (i + z[i] < n && s[z[i]] === s[i + z[i]]) z[i]++;
        if (i + z[i] - 1 > r) {
            l = i;
            r = i + z[i] - 1;
        }
    }
    return z;
}

function get_z(z: number[], i: number): number {
    return 0 <= i && i < z.length ? z[i] : 0;
}

let repetitions: [number, number][] = [];

function convert_to_repetitions(shift: number, left: boolean, cntr: number, l: number, k1: number, k2: number): void {
    for (let l1 = Math.max(1, l - k2); l1 <= Math.min(l, k1); l1++) {
        if (left && l1 === l) break;
        const l2 = l - l1;
        const pos = shift + (left ? cntr - l1 : cntr - l - l1 + 1);
        repetitions.push([pos, pos + 2 * l - 1]);
    }
}

function find_repetitions(s: string, shift = 0): void {
    const n = s.length;
    if (n === 1) return;

    const nu = Math.floor(n / 2);
    const nv = n - nu;
    const u = s.slice(0, nu);
    const v = s.slice(nu);
    const ru = [...u].reverse().join("");
    const rv = [...v].reverse().join("");

    find_repetitions(u, shift);
    find_repetitions(v, shift + nu);

    const z1 = z_function(ru);
    const z2 = z_function(v + "#" + u);
    const z3 = z_function(ru + "#" + rv);
    const z4 = z_function(v);

    for (let cntr = 0; cntr < n; cntr++) {
        let l: number, k1: number, k2: number;
        if (cntr < nu) {
            l = nu - cntr;
            k1 = get_z(z1, nu - cntr);
            k2 = get_z(z2, nv + 1 + cntr);
        } else {
            l = cntr - nu + 1;
            k1 = get_z(z3, nu + 1 + nv - 1 - (cntr - nu));
            k2 = get_z(z4, cntr - nu + 1);
        }
        if (k1 + k2 >= l) convert_to_repetitions(shift, cntr < nu, cntr, l, k1, k2);
    }
}
```

```go
func z_function(s string) []int {
    n := len(s)
    z := make([]int, n)
    for i, l, r := 1, 0, 0; i < n; i++ {
        if i <= r {
            z[i] = min(r-i+1, z[i-l])
        }
        for i+z[i] < n && s[z[i]] == s[i+z[i]] {
            z[i]++
        }
        if i+z[i]-1 > r {
            l = i
            r = i + z[i] - 1
        }
    }
    return z
}

func get_z(z []int, i int) int {
    if 0 <= i && i < len(z) {
        return z[i]
    }
    return 0
}

var repetitions [][2]int

func convert_to_repetitions(shift int, left bool, cntr, l, k1, k2 int) {
    for l1 := max(1, l-k2); l1 <= min(l, k1); l1++ {
        if left && l1 == l {
            break
        }
        var pos int
        if left {
            pos = shift + cntr - l1
        } else {
            pos = shift + cntr - l - l1 + 1
        }
        repetitions = append(repetitions, [2]int{pos, pos + 2*l - 1})
    }
}

func find_repetitions(s string, shift int) {
    n := len(s)
    if n == 1 {
        return
    }

    nu := n / 2
    nv := n - nu
    u := s[:nu]
    v := s[nu:]
    // обернені рядки (працюємо з ASCII, як і в C++)
    ru := reverse(u)
    rv := reverse(v)

    find_repetitions(u, shift)
    find_repetitions(v, shift+nu)

    z1 := z_function(ru)
    z2 := z_function(v + "#" + u)
    z3 := z_function(ru + "#" + rv)
    z4 := z_function(v)

    for cntr := 0; cntr < n; cntr++ {
        var l, k1, k2 int
        if cntr < nu {
            l = nu - cntr
            k1 = get_z(z1, nu-cntr)
            k2 = get_z(z2, nv+1+cntr)
        } else {
            l = cntr - nu + 1
            k1 = get_z(z3, nu+1+nv-1-(cntr-nu))
            k2 = get_z(z4, (cntr-nu)+1)
        }
        if k1+k2 >= l {
            convert_to_repetitions(shift, cntr < nu, cntr, l, k1, k2)
        }
    }
}

func reverse(s string) string {
    b := []byte(s)
    for i, j := 0, len(b)-1; i < j; i, j = i+1, j-1 {
        b[i], b[j] = b[j], b[i]
    }
    return string(b)
}
```

</CodeTabs>
