# Розбір виразів

Задано рядок, що містить математичний вираз із числами та різними операторами.
Нам потрібно обчислити його значення за $O(n)$, де $n$ — довжина рядка.

Алгоритм, який ми тут розглянемо, переводить вираз у так званий **зворотний польський запис** (явно або неявно) і обчислює цей вираз.

## Зворотний польський запис \{#reverse-polish-notation}

Зворотний польський запис — це форма запису математичних виразів, у якій оператори розташовані після своїх операндів.
Наприклад, наступний вираз

$$
a + b * c * d + (e - f) * (g * h + i)
$$

можна записати у зворотному польському записі так:

$$
a b c * d * + e f - g h * i + * +
$$

Зворотний польський запис розробив австралійський філософ і фахівець з інформатики Charles Hamblin у середині 1950-х років на основі польського запису, який 1920 року запропонував польський математик Jan Łukasiewicz.

Зручність зворотного польського запису полягає в тому, що вирази в такій формі дуже **легко обчислювати** за лінійний час.
Ми використовуємо стек, який спочатку порожній.
Ми будемо проходити по операндах і операторах виразу у зворотному польському записі.
Якщо поточний елемент — число, то ми кладемо його значення на вершину стека; якщо поточний елемент — оператор, то ми беремо два верхні елементи стека, виконуємо операцію і кладемо результат назад на вершину стека.
Наприкінці в стеку залишиться рівно один елемент, який і буде значенням виразу.

Очевидно, що це просте обчислення працює за час $O(n)$.

## Розбір простих виразів \{#parsing-of-simple-expressions}

Поки що ми розглянемо лише спрощену задачу:
вважаємо, що всі оператори **бінарні** (тобто беруть два аргументи) і всі **ліво-асоціативні** (якщо пріоритети рівні, вони виконуються зліва направо).
Дужки дозволені.

Ми заведемо два стеки: один для чисел і один для операторів та дужок.
Спочатку обидва стеки порожні.
Для другого стека ми будемо підтримувати умову, що всі операції впорядковані за строго спадним пріоритетом.
Якщо в стеку є дужки, то впорядкованим є кожен блок операторів (що відповідає одній парі дужок), а весь стек упорядкованим бути не обов'язково.

Ми будемо проходити по символах виразу зліва направо.
Якщо поточний символ — цифра, то ми кладемо значення цього числа на стек.
Якщо поточний символ — відкривна дужка, то ми кладемо її на стек.
Якщо поточний символ — закривна дужка, то ми виконуємо всі оператори зі стека, доки не дійдемо до відкривної дужки (іншими словами, виконуємо всі операції всередині дужок).
Нарешті, якщо поточний символ — оператор, то поки на вершині стека стоїть оператор з таким самим або вищим пріоритетом, ми виконуємо цю операцію, а потім кладемо новий оператор на стек.

Після того як ми обробили весь рядок, у стеку можуть залишитися деякі оператори, тож ми їх виконуємо.

Ось реалізація цього методу для чотирьох операторів $+$ $-$ $*$ $/$:

<CodeTabs>

```cpp
bool delim(char c) {
    return c == ' ';
}

bool is_op(char c) {
    return c == '+' || c == '-' || c == '*' || c == '/';
}

int priority (char op) {
    if (op == '+' || op == '-')
        return 1;
    if (op == '*' || op == '/')
        return 2;
    return -1;
}

void process_op(stack<int>& st, char op) {
    int r = st.top(); st.pop();
    int l = st.top(); st.pop();
    switch (op) {
        case '+': st.push(l + r); break;
        case '-': st.push(l - r); break;
        case '*': st.push(l * r); break;
        case '/': st.push(l / r); break;
    }
}

int evaluate(string& s) {
    stack<int> st;
    stack<char> op;
    for (int i = 0; i < (int)s.size(); i++) {
        if (delim(s[i]))
            continue;
        
        if (s[i] == '(') {
            op.push('(');
        } else if (s[i] == ')') {
            while (op.top() != '(') {
                process_op(st, op.top());
                op.pop();
            }
            op.pop();
        } else if (is_op(s[i])) {
            char cur_op = s[i];
            while (!op.empty() && priority(op.top()) >= priority(cur_op)) {
                process_op(st, op.top());
                op.pop();
            }
            op.push(cur_op);
        } else {
            int number = 0;
            while (i < (int)s.size() && isalnum(s[i]))
                number = number * 10 + s[i++] - '0';
            --i;
            st.push(number);
        }
    }

    while (!op.empty()) {
        process_op(st, op.top());
        op.pop();
    }
    return st.top();
}
```

```python
def delim(c: str) -> bool:
    return c == ' '


def is_op(c: str) -> bool:
    return c in '+-*/'


def priority(op: str) -> int:
    if op in '+-':
        return 1
    if op in '*/':
        return 2
    return -1


def process_op(st: list[int], op: str) -> None:
    r = st.pop()
    l = st.pop()
    if op == '+':
        st.append(l + r)
    elif op == '-':
        st.append(l - r)
    elif op == '*':
        st.append(l * r)
    elif op == '/':
        # цілочислове ділення з округленням до нуля (як у C++)
        st.append(int(l / r))


def evaluate(s: str) -> int:
    st: list[int] = []   # стек чисел
    op: list[str] = []   # стек операторів та дужок
    i = 0
    while i < len(s):
        if delim(s[i]):
            i += 1
            continue

        if s[i] == '(':
            op.append('(')
        elif s[i] == ')':
            while op[-1] != '(':
                process_op(st, op.pop())
            op.pop()
        elif is_op(s[i]):
            cur_op = s[i]
            # виконуємо всі операції з не меншим пріоритетом
            while op and priority(op[-1]) >= priority(cur_op):
                process_op(st, op.pop())
            op.append(cur_op)
        else:
            number = 0
            while i < len(s) and s[i].isalnum():
                number = number * 10 + int(s[i])
                i += 1
            i -= 1
            st.append(number)
        i += 1

    while op:
        process_op(st, op.pop())
    return st[-1]
```

```typescript
function delim(c: string): boolean {
    return c === ' ';
}

function isOp(c: string): boolean {
    return c === '+' || c === '-' || c === '*' || c === '/';
}

function priority(op: string): number {
    if (op === '+' || op === '-') return 1;
    if (op === '*' || op === '/') return 2;
    return -1;
}

function processOp(st: number[], op: string): void {
    const r = st.pop()!;
    const l = st.pop()!;
    switch (op) {
        case '+': st.push(l + r); break;
        case '-': st.push(l - r); break;
        case '*': st.push(l * r); break;
        // округлення до нуля (як цілочислове ділення в C++)
        case '/': st.push(Math.trunc(l / r)); break;
    }
}

function evaluate(s: string): number {
    const st: number[] = [];   // стек чисел
    const op: string[] = [];   // стек операторів та дужок
    for (let i = 0; i < s.length; i++) {
        if (delim(s[i])) continue;

        if (s[i] === '(') {
            op.push('(');
        } else if (s[i] === ')') {
            while (op[op.length - 1] !== '(') {
                processOp(st, op.pop()!);
            }
            op.pop();
        } else if (isOp(s[i])) {
            const curOp = s[i];
            // виконуємо всі операції з не меншим пріоритетом
            while (op.length > 0 && priority(op[op.length - 1]) >= priority(curOp)) {
                processOp(st, op.pop()!);
            }
            op.push(curOp);
        } else {
            let number = 0;
            while (i < s.length && /[a-zA-Z0-9]/.test(s[i])) {
                number = number * 10 + (s.charCodeAt(i) - 48);
                i++;
            }
            i--;
            st.push(number);
        }
    }

    while (op.length > 0) {
        processOp(st, op.pop()!);
    }
    return st[st.length - 1];
}
```

```go
func delim(c byte) bool {
    return c == ' '
}

func isOp(c byte) bool {
    return c == '+' || c == '-' || c == '*' || c == '/'
}

func priority(op byte) int {
    if op == '+' || op == '-' {
        return 1
    }
    if op == '*' || op == '/' {
        return 2
    }
    return -1
}

func processOp(st *[]int, op byte) {
    r := (*st)[len(*st)-1]
    l := (*st)[len(*st)-2]
    *st = (*st)[:len(*st)-2]
    switch op {
    case '+':
        *st = append(*st, l+r)
    case '-':
        *st = append(*st, l-r)
    case '*':
        *st = append(*st, l*r)
    case '/':
        // ділення цілих у Go округлює до нуля (як у C++)
        *st = append(*st, l/r)
    }
}

func isAlnum(c byte) bool {
    return (c >= '0' && c <= '9') || (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')
}

func evaluate(s string) int {
    st := []int{}    // стек чисел
    op := []byte{}   // стек операторів та дужок
    for i := 0; i < len(s); i++ {
        if delim(s[i]) {
            continue
        }

        if s[i] == '(' {
            op = append(op, '(')
        } else if s[i] == ')' {
            for op[len(op)-1] != '(' {
                processOp(&st, op[len(op)-1])
                op = op[:len(op)-1]
            }
            op = op[:len(op)-1]
        } else if isOp(s[i]) {
            curOp := s[i]
            // виконуємо всі операції з не меншим пріоритетом
            for len(op) > 0 && priority(op[len(op)-1]) >= priority(curOp) {
                processOp(&st, op[len(op)-1])
                op = op[:len(op)-1]
            }
            op = append(op, curOp)
        } else {
            number := 0
            for i < len(s) && isAlnum(s[i]) {
                number = number*10 + int(s[i]-'0')
                i++
            }
            i--
            st = append(st, number)
        }
    }

    for len(op) > 0 {
        processOp(&st, op[len(op)-1])
        op = op[:len(op)-1]
    }
    return st[len(st)-1]
}
```

</CodeTabs>

Так ми навчилися обчислювати значення виразу за $O(n)$, при цьому неявно скориставшись зворотним польським записом.
Трохи змінивши наведену вище реалізацію, можна також отримати вираз у зворотному польському записі в явному вигляді.

## Унарні оператори \{#unary-operators}

Тепер припустимо, що вираз містить також **унарні** оператори (оператори, що беруть один аргумент).
Унарний плюс і унарний мінус — поширені приклади таких операторів.

Одна з відмінностей у цьому випадку полягає в тому, що нам потрібно визначати, є поточний оператор унарним чи бінарним.

Можна помітити, що перед унарним оператором завжди стоїть інший оператор, або відкривна дужка, або взагалі нічого (якщо він стоїть на самому початку виразу).
Навпаки, перед бінарним оператором завжди буде операнд (число) або закривна дужка.
Тож легко позначити, чи може наступний оператор бути унарним. 

Крім того, унарний і бінарний оператори ми маємо виконувати по-різному.
А ще ми маємо обрати пріоритет унарного оператора вищим, ніж у всіх бінарних операторів.

Окрім того, варто зауважити, що деякі унарні оператори (наприклад, унарний плюс і унарний мінус) насправді **право-асоціативні**.

## Право-асоціативність \{#right-associativity}

Право-асоціативність означає, що щоразу, коли пріоритети рівні, оператори мають обчислюватися справа наліво.

Як зазначено вище, унарні оператори зазвичай право-асоціативні.
Іще один приклад право-асоціативного оператора — оператор піднесення до степеня ($a \wedge b \wedge c$ зазвичай сприймається як $a^{b^c}$, а не як $(a^b)^c$).

Яку зміну нам треба зробити, щоб коректно обробляти право-асоціативні оператори?
Виявляється, що зміни дуже мінімальні.
Єдина відмінність буде в тому, що при рівних пріоритетах ми відкладатимемо виконання право-асоціативної операції.

Єдиний рядок, який потрібно замінити, — це
<CodeTabs>

```cpp
while (!op.empty() && priority(op.top()) >= priority(cur_op))
```

```python
while op and priority(op[-1]) >= priority(cur_op):
```

```typescript
while (op.length > 0 && priority(op[op.length - 1]) >= priority(curOp))
```

```go
for len(op) > 0 && priority(op[len(op)-1]) >= priority(curOp) {
```

</CodeTabs>
на
<CodeTabs>

```cpp
while (!op.empty() && (
        (left_assoc(cur_op) && priority(op.top()) >= priority(cur_op)) ||
        (!left_assoc(cur_op) && priority(op.top()) > priority(cur_op))
    ))
```

```python
while op and (
    (left_assoc(cur_op) and priority(op[-1]) >= priority(cur_op)) or
    (not left_assoc(cur_op) and priority(op[-1]) > priority(cur_op))
):
```

```typescript
while (op.length > 0 && (
        (leftAssoc(curOp) && priority(op[op.length - 1]) >= priority(curOp)) ||
        (!leftAssoc(curOp) && priority(op[op.length - 1]) > priority(curOp))
    ))
```

```go
for len(op) > 0 && (
    (leftAssoc(curOp) && priority(op[len(op)-1]) >= priority(curOp)) ||
    (!leftAssoc(curOp) && priority(op[len(op)-1]) > priority(curOp))) {
```

</CodeTabs>
де `left_assoc` — функція, яка визначає, чи є оператор ліво-асоціативним.

Ось реалізація для бінарних операторів $+$ $-$ $*$ $/$ та унарних операторів $+$ і $-$.

<CodeTabs>

```cpp
bool delim(char c) {
    return c == ' ';
}

bool is_op(char c) {
    return c == '+' || c == '-' || c == '*' || c == '/';
}

bool is_unary(char c) {
    return c == '+' || c=='-';
}

int priority (char op) {
    if (op < 0) // унарний оператор
        return 3;
    if (op == '+' || op == '-')
        return 1;
    if (op == '*' || op == '/')
        return 2;
    return -1;
}

void process_op(stack<int>& st, char op) {
    if (op < 0) {
        int l = st.top(); st.pop();
        switch (-op) {
            case '+': st.push(l); break;
            case '-': st.push(-l); break;
        }
    } else {
        int r = st.top(); st.pop();
        int l = st.top(); st.pop();
        switch (op) {
            case '+': st.push(l + r); break;
            case '-': st.push(l - r); break;
            case '*': st.push(l * r); break;
            case '/': st.push(l / r); break;
        }
    }
}

int evaluate(string& s) {
    stack<int> st;
    stack<char> op;
    bool may_be_unary = true;
    for (int i = 0; i < (int)s.size(); i++) {
        if (delim(s[i]))
            continue;
        
        if (s[i] == '(') {
            op.push('(');
            may_be_unary = true;
        } else if (s[i] == ')') {
            while (op.top() != '(') {
                process_op(st, op.top());
                op.pop();
            }
            op.pop();
            may_be_unary = false;
        } else if (is_op(s[i])) {
            char cur_op = s[i];
            if (may_be_unary && is_unary(cur_op))
                cur_op = -cur_op;
            while (!op.empty() && (
                    (cur_op >= 0 && priority(op.top()) >= priority(cur_op)) ||
                    (cur_op < 0 && priority(op.top()) > priority(cur_op))
                )) {
                process_op(st, op.top());
                op.pop();
            }
            op.push(cur_op);
            may_be_unary = true;
        } else {
            int number = 0;
            while (i < (int)s.size() && isalnum(s[i]))
                number = number * 10 + s[i++] - '0';
            --i;
            st.push(number);
            may_be_unary = false;
        }
    }

    while (!op.empty()) {
        process_op(st, op.top());
        op.pop();
    }
    return st.top();
}
```

```python
def delim(c: str) -> bool:
    return c == ' '


def is_op(c: str) -> bool:
    return c in '+-*/'


def is_unary(c: str) -> bool:
    return c in '+-'


# унарні оператори позначаємо префіксом 'u' (наприклад, 'u-')
def priority(op: str) -> int:
    if op.startswith('u'):  # унарний оператор
        return 3
    if op in '+-':
        return 1
    if op in '*/':
        return 2
    return -1


def process_op(st: list[int], op: str) -> None:
    if op.startswith('u'):
        l = st.pop()
        if op == 'u+':
            st.append(l)
        elif op == 'u-':
            st.append(-l)
    else:
        r = st.pop()
        l = st.pop()
        if op == '+':
            st.append(l + r)
        elif op == '-':
            st.append(l - r)
        elif op == '*':
            st.append(l * r)
        elif op == '/':
            st.append(int(l / r))  # округлення до нуля, як у C++


def evaluate(s: str) -> int:
    st: list[int] = []   # стек чисел
    op: list[str] = []   # стек операторів та дужок
    may_be_unary = True
    i = 0
    while i < len(s):
        if delim(s[i]):
            i += 1
            continue

        if s[i] == '(':
            op.append('(')
            may_be_unary = True
        elif s[i] == ')':
            while op[-1] != '(':
                process_op(st, op.pop())
            op.pop()
            may_be_unary = False
        elif is_op(s[i]):
            cur_op = s[i]
            if may_be_unary and is_unary(cur_op):
                cur_op = 'u' + cur_op  # робимо оператор унарним
            is_unary_op = cur_op.startswith('u')
            while op and (
                (not is_unary_op and priority(op[-1]) >= priority(cur_op)) or
                (is_unary_op and priority(op[-1]) > priority(cur_op))
            ):
                process_op(st, op.pop())
            op.append(cur_op)
            may_be_unary = True
        else:
            number = 0
            while i < len(s) and s[i].isalnum():
                number = number * 10 + int(s[i])
                i += 1
            i -= 1
            st.append(number)
            may_be_unary = False
        i += 1

    while op:
        process_op(st, op.pop())
    return st[-1]
```

```typescript
function delim(c: string): boolean {
    return c === ' ';
}

function isOp(c: string): boolean {
    return c === '+' || c === '-' || c === '*' || c === '/';
}

function isUnary(c: string): boolean {
    return c === '+' || c === '-';
}

// унарні оператори позначаємо префіксом 'u' (наприклад, 'u-')
function priority(op: string): number {
    if (op.startsWith('u')) return 3; // унарний оператор
    if (op === '+' || op === '-') return 1;
    if (op === '*' || op === '/') return 2;
    return -1;
}

function processOp(st: number[], op: string): void {
    if (op.startsWith('u')) {
        const l = st.pop()!;
        switch (op) {
            case 'u+': st.push(l); break;
            case 'u-': st.push(-l); break;
        }
    } else {
        const r = st.pop()!;
        const l = st.pop()!;
        switch (op) {
            case '+': st.push(l + r); break;
            case '-': st.push(l - r); break;
            case '*': st.push(l * r); break;
            case '/': st.push(Math.trunc(l / r)); break; // округлення до нуля
        }
    }
}

function evaluate(s: string): number {
    const st: number[] = [];   // стек чисел
    const op: string[] = [];   // стек операторів та дужок
    let mayBeUnary = true;
    for (let i = 0; i < s.length; i++) {
        if (delim(s[i])) continue;

        if (s[i] === '(') {
            op.push('(');
            mayBeUnary = true;
        } else if (s[i] === ')') {
            while (op[op.length - 1] !== '(') {
                processOp(st, op.pop()!);
            }
            op.pop();
            mayBeUnary = false;
        } else if (isOp(s[i])) {
            let curOp = s[i];
            if (mayBeUnary && isUnary(curOp))
                curOp = 'u' + curOp; // робимо оператор унарним
            const isUnaryOp = curOp.startsWith('u');
            while (op.length > 0 && (
                    (!isUnaryOp && priority(op[op.length - 1]) >= priority(curOp)) ||
                    (isUnaryOp && priority(op[op.length - 1]) > priority(curOp))
                )) {
                processOp(st, op.pop()!);
            }
            op.push(curOp);
            mayBeUnary = true;
        } else {
            let number = 0;
            while (i < s.length && /[a-zA-Z0-9]/.test(s[i])) {
                number = number * 10 + (s.charCodeAt(i) - 48);
                i++;
            }
            i--;
            st.push(number);
            mayBeUnary = false;
        }
    }

    while (op.length > 0) {
        processOp(st, op.pop()!);
    }
    return st[st.length - 1];
}
```

```go
func delim(c byte) bool {
    return c == ' '
}

func isOp(c string) bool {
    return c == "+" || c == "-" || c == "*" || c == "/"
}

func isUnary(c string) bool {
    return c == "+" || c == "-"
}

// унарні оператори позначаємо префіксом "u" (наприклад, "u-")
func priority(op string) int {
    if len(op) > 0 && op[0] == 'u' { // унарний оператор
        return 3
    }
    if op == "+" || op == "-" {
        return 1
    }
    if op == "*" || op == "/" {
        return 2
    }
    return -1
}

func processOp(st *[]int, op string) {
    if len(op) > 0 && op[0] == 'u' {
        l := (*st)[len(*st)-1]
        *st = (*st)[:len(*st)-1]
        switch op {
        case "u+":
            *st = append(*st, l)
        case "u-":
            *st = append(*st, -l)
        }
    } else {
        r := (*st)[len(*st)-1]
        l := (*st)[len(*st)-2]
        *st = (*st)[:len(*st)-2]
        switch op {
        case "+":
            *st = append(*st, l+r)
        case "-":
            *st = append(*st, l-r)
        case "*":
            *st = append(*st, l*r)
        case "/":
            *st = append(*st, l/r) // округлення до нуля, як у C++
        }
    }
}

func isAlnum(c byte) bool {
    return (c >= '0' && c <= '9') || (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')
}

func evaluate(s string) int {
    st := []int{}      // стек чисел
    op := []string{}   // стек операторів та дужок
    mayBeUnary := true
    for i := 0; i < len(s); i++ {
        if delim(s[i]) {
            continue
        }

        if s[i] == '(' {
            op = append(op, "(")
            mayBeUnary = true
        } else if s[i] == ')' {
            for op[len(op)-1] != "(" {
                processOp(&st, op[len(op)-1])
                op = op[:len(op)-1]
            }
            op = op[:len(op)-1]
            mayBeUnary = false
        } else if isOp(string(s[i])) {
            curOp := string(s[i])
            if mayBeUnary && isUnary(curOp) {
                curOp = "u" + curOp // робимо оператор унарним
            }
            isUnaryOp := curOp[0] == 'u'
            for len(op) > 0 && ((!isUnaryOp && priority(op[len(op)-1]) >= priority(curOp)) ||
                (isUnaryOp && priority(op[len(op)-1]) > priority(curOp))) {
                processOp(&st, op[len(op)-1])
                op = op[:len(op)-1]
            }
            op = append(op, curOp)
            mayBeUnary = true
        } else {
            number := 0
            for i < len(s) && isAlnum(s[i]) {
                number = number*10 + int(s[i]-'0')
                i++
            }
            i--
            st = append(st, number)
            mayBeUnary = false
        }
    }

    for len(op) > 0 {
        processOp(&st, op[len(op)-1])
        op = op[:len(op)-1]
    }
    return st[len(st)-1]
}
```

</CodeTabs>
