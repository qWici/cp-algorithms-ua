# Ігри на довільних графах

Нехай два гравці грають у гру на довільному графі $G$.
Тобто поточний стан гри — це певна вершина.
Гравці роблять ходи по черзі й переходять з поточної вершини до суміжної, рухаючись з'єднувальним ребром.
Залежно від гри той, хто не може зробити хід, або програє, або виграє.

Ми розглядаємо найзагальніший випадок — випадок довільного орієнтованого графа з циклами.
Наше завдання — для заданого початкового стану визначити, хто виграє гру, якщо обидва гравці грають за <Term tip="Кожен гравець на кожному ході обирає найкращий для себе хід, не помиляючись. Якщо хтось програє навіть за такої гри — отже, позиція справді програшна.">оптимальними стратегіями</Term>, або встановити, що результатом гри буде нічия.

Ми розв'яжемо цю задачу дуже ефективно.
Ми знайдемо розв'язок для всіх можливих стартових вершин графа за лінійний час відносно кількості ребер: $O(m)$.

:::tip[Коли підходить цей алгоритм?]
- Чи граф станів може містити **цикли**, через що можлива нічия? *(якщо граф ациклічний і незалежні підігри → [Теорема Шпрага–Гранді](sprague-grundy-nim.md))*
- Чи потрібно класифікувати **всі** стартові вершини на виграш / програш / нічию за один прохід?
- Чи можна для кожної вершини наперед визначити <Term tip="Скільки ходів можна зробити з цієї позиції, тобто скільки ребер виходить з вершини графа.">вихідний степінь</Term> і термінальні (без ходів) позиції?
:::

## Опис алгоритму \{#description-of-the-algorithm}

Будемо називати вершину виграшною позицією, якщо гравець, що починає в цьому стані, виграє гру за умови оптимальної гри (незалежно від того, які ходи робить інший гравець).
Аналогічно будемо називати вершину програшною позицією, якщо гравець, що починає в цій вершині, програє гру за умови оптимальної гри суперника.

Для деяких вершин графа ми вже наперед знаємо, що вони є виграшними або програшними позиціями, а саме — для всіх вершин, які не мають вихідних ребер.

Також маємо такі **правила**:

- якщо вершина має вихідне ребро, що веде до програшної позиції, то сама вершина є виграшною позицією.
- якщо всі вихідні ребра певної вершини ведуть до виграшних позицій, то сама вершина є програшною позицією.
- якщо в якийсь момент усе ще залишаються невизначені вершини, і жодна з них не підпадає під перше чи друге правило, то кожна з цих вершин, якщо її взяти за стартову, приведе до нічиєї за умови оптимальної гри обох гравців.

Отже, ми одразу можемо описати алгоритм, що працює за час $O(n m)$.
Ми проходимо по всіх вершинах, намагаємося застосувати перше чи друге правило й повторюємо.

Однак цю процедуру можна пришвидшити й зменшити складність до $O(m)$.

Ми пройдемося по всіх вершинах, для яких від початку знаємо, чи є вони виграшними, чи програшними станами.
Для кожної з них запускаємо [пошук у глибину](../graph/depth-first-search.md).
Цей DFS рухатиметься назад по обернених ребрах.
Передусім він не заходитиме у вершини, які вже визначені як виграшні або програшні позиції.
Крім того, якщо пошук переходить з програшної позиції у невизначену вершину, то ми позначаємо її як виграшну позицію й продовжуємо DFS уже з цієї нової вершини.
Якщо ж ми переходимо з виграшної позиції у невизначену вершину, то маємо перевірити, чи всі ребра з неї ведуть до виграшних позицій.
Цю перевірку можна виконати за $O(1)$, зберігаючи для кожної вершини кількість ребер, що ведуть до виграшної позиції.
Тож якщо ми переходимо з виграшної позиції в невизначену, то збільшуємо лічильник і перевіряємо, чи це число дорівнює кількості вихідних ребер.
Якщо це так, ми можемо позначити цю вершину як програшну позицію й продовжити DFS із неї.
Інакше ми поки що не знаємо, чи ця вершина виграшна, чи програшна, тому продовжувати DFS із неї не має сенсу.

Загалом ми відвідуємо кожну виграшну й кожну програшну вершину рівно один раз (невизначені вершини не відвідуються), а також проходимо по кожному ребру теж щонайбільше один раз.
Отже, складність становить $O(m)$.

## Реалізація \{#implementation}

Ось реалізація такого DFS.
Ми припускаємо, що змінна `adj_rev` зберігає <Term tip="Спосіб зберігати граф: для кожної вершини список вершин, куди з неї можна потрапити по ребру.">список суміжності</Term> графа в **оберненому** вигляді, тобто замість ребра $(i, j)$ графа ми зберігаємо $(j, i)$.
Також для кожної вершини ми припускаємо, що вихідний степінь уже обчислено.

<CodeTabs>

```cpp
vector<vector<int>> adj_rev;

vector<bool> winning;
vector<bool> losing;
vector<bool> visited;
vector<int> degree;

void dfs(int v) {
    visited[v] = true;
    for (int u : adj_rev[v]) {
        if (!visited[u]) {
            if (losing[v])
                winning[u] = true;
            else if (--degree[u] == 0)
                losing[u] = true;
            else
                continue;
            dfs(u);
        }
    }
}
```

```python
adj_rev = []  # обернений список суміжності

winning = []
losing = []
visited = []
degree = []

def dfs(v):
    visited[v] = True
    for u in adj_rev[v]:
        if not visited[u]:
            if losing[v]:
                winning[u] = True
            else:
                degree[u] -= 1
                if degree[u] == 0:
                    losing[u] = True
                else:
                    continue
            dfs(u)
```

```typescript
let adjRev: number[][] = []; // обернений список суміжності

let winning: boolean[] = [];
let losing: boolean[] = [];
let visited: boolean[] = [];
let degree: number[] = [];

function dfs(v: number): void {
    visited[v] = true;
    for (const u of adjRev[v]) {
        if (!visited[u]) {
            if (losing[v]) {
                winning[u] = true;
            } else if (--degree[u] === 0) {
                losing[u] = true;
            } else {
                continue;
            }
            dfs(u);
        }
    }
}
```

```go
var adjRev [][]int // обернений список суміжності

var winning []bool
var losing []bool
var visited []bool
var degree []int

func dfs(v int) {
    visited[v] = true
    for _, u := range adjRev[v] {
        if !visited[u] {
            if losing[v] {
                winning[u] = true
            } else if degree[u]--; degree[u] == 0 {
                losing[u] = true
            } else {
                continue
            }
            dfs(u)
        }
    }
}
```

</CodeTabs>

## Приклад: «Поліцейський і злодій» \{#example-policeman-and-thief}

Ось конкретний приклад такої гри.

Маємо дошку $m \times n$.
У деякі клітинки не можна заходити.
Початкові координати поліцейського й злодія відомі.
Одна з клітинок є виходом.
Якщо поліцейський і злодій у будь-який момент опиняються в одній клітинці, перемагає поліцейський.
Якщо злодій опиняється в клітинці виходу (причому поліцейський не на цій же клітинці), то перемагає злодій.
Поліцейський може ходити в усіх 8 напрямках, злодій — лише в 4 (уздовж координатних осей).
І поліцейський, і злодій ходять по черзі.
Утім, вони також можуть пропустити хід, якщо захочуть.
Перший хід робить поліцейський.

Тепер ми **побудуємо граф**.
Для цього ми маємо формалізувати правила гри.
Поточний стан гри визначається координатами поліцейського $P$, координатами злодія $T$, а також тим, чий зараз хід; назвемо цю змінну $P_{\text{turn}}$ (вона істинна, коли хід поліцейського).
Отже, вершина графа визначається трійкою $(P, T, P_{\text{turn}})$
Граф тоді легко побудувати, просто дотримуючись правил гри.

Далі нам потрібно визначити, які вершини є виграшними, а які — програшними від початку.
Тут є **тонкий момент**.
Виграшні / програшні позиції залежать, окрім координат, ще й від $P_{\text{turn}}$ — чий зараз хід.
Якщо хід поліцейського, то вершина є виграшною позицією, коли координати поліцейського й злодія збігаються, і програшною позицією, якщо вона не виграшна й злодій перебуває у вершині виходу.
Якщо хід злодія, то вершина є програшною позицією, коли координати обох гравців збігаються, і виграшною позицією, якщо вона не програшна й злодій перебуває у вершині виходу.

Єдиний момент перед реалізацією — це те, що вам потрібно вирішити, чи будувати граф **явно**, чи просто конструювати його **<Term tip="Не зберігати весь граф у пам'яті заздалегідь, а обчислювати сусідні стани прямо під час обходу, коли вони знадобляться.">на льоту</Term>**.
З одного боку, будувати граф явно набагато простіше, і є менше шансів припуститися помилок.
З іншого боку, це збільшить обсяг коду, а час роботи буде повільнішим, ніж якщо будувати граф на льоту.

Наведена нижче реалізація будує граф явно:

<CodeTabs>

```cpp
struct State {
    int P, T;
    bool Pstep;
};

vector<State> adj_rev[100][100][2]; // [P][T][Pstep]
bool winning[100][100][2];
bool losing[100][100][2];
bool visited[100][100][2];
int degree[100][100][2];

void dfs(State v) {
    visited[v.P][v.T][v.Pstep] = true;
    for (State u : adj_rev[v.P][v.T][v.Pstep]) {
        if (!visited[u.P][u.T][u.Pstep]) {
            if (losing[v.P][v.T][v.Pstep])
                winning[u.P][u.T][u.Pstep] = true;
            else if (--degree[u.P][u.T][u.Pstep] == 0)
                losing[u.P][u.T][u.Pstep] = true;
            else
                continue;
            dfs(u);
        }
    }
}

int main() {
    int n, m;
    cin >> n >> m;
    vector<string> a(n);
    for (int i = 0; i < n; i++)
        cin >> a[i];

    for (int P = 0; P < n*m; P++) {
        for (int T = 0; T < n*m; T++) {
            for (int Pstep = 0; Pstep <= 1; Pstep++) {
                int Px = P/m, Py = P%m, Tx = T/m, Ty = T%m;
                if (a[Px][Py]=='*' || a[Tx][Ty]=='*')
                    continue;
                
                bool& win = winning[P][T][Pstep];
                bool& lose = losing[P][T][Pstep];
                if (Pstep) {
                    win = Px==Tx && Py==Ty;
                    lose = !win && a[Tx][Ty] == 'E';
                } else {
                    lose = Px==Tx && Py==Ty;
                    win = !lose && a[Tx][Ty] == 'E';
                }
                if (win || lose)
                    continue;

                State st = {P,T,!Pstep};
                adj_rev[P][T][Pstep].push_back(st);
                st.Pstep = Pstep;
                degree[P][T][Pstep]++;
                
                const int dx[] = {-1, 0, 1, 0, -1, -1, 1, 1};
                const int dy[] = {0, 1, 0, -1, -1, 1, -1, 1};
                for (int d = 0; d < (Pstep ? 8 : 4); d++) {
                    int PPx = Px, PPy = Py, TTx = Tx, TTy = Ty;
                    if (Pstep) {
                        PPx += dx[d];
                        PPy += dy[d];
                    } else {
                        TTx += dx[d];
                        TTy += dy[d];
                    }

                    if (PPx >= 0 && PPx < n && PPy >= 0 && PPy < m && a[PPx][PPy] != '*' &&
                        TTx >= 0 && TTx < n && TTy >= 0 && TTy < m && a[TTx][TTy] != '*')
                    {
                        adj_rev[PPx*m+PPy][TTx*m+TTy][!Pstep].push_back(st);
                        ++degree[P][T][Pstep];
                    }
                }
            }
        }
    }

    for (int P = 0; P < n*m; P++) {
        for (int T = 0; T < n*m; T++) {
            for (int Pstep = 0; Pstep <= 1; Pstep++) {
                if ((winning[P][T][Pstep] || losing[P][T][Pstep]) && !visited[P][T][Pstep])
                    dfs({P, T, (bool)Pstep});
            }
        }
    }

    int P_st, T_st;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            if (a[i][j] == 'P')
                P_st = i*m+j;
            else if (a[i][j] == 'T')
                T_st = i*m+j;
        }
    }

    if (winning[P_st][T_st][true]) {
        cout << "Police catches the thief"  << endl;
    } else if (losing[P_st][T_st][true]) {
        cout << "The thief escapes" << endl;
    } else {
        cout << "Draw" << endl;
    }
}
```

```python
import sys
sys.setrecursionlimit(10**7)

class State:
    __slots__ = ("P", "T", "Pstep")
    def __init__(self, P, T, Pstep):
        self.P = P
        self.T = T
        self.Pstep = Pstep

# Тривимірні масиви [P][T][Pstep]
adj_rev = [[[[] for _ in range(2)] for _ in range(100)] for _ in range(100)]
winning = [[[False] * 2 for _ in range(100)] for _ in range(100)]
losing = [[[False] * 2 for _ in range(100)] for _ in range(100)]
visited = [[[False] * 2 for _ in range(100)] for _ in range(100)]
degree = [[[0] * 2 for _ in range(100)] for _ in range(100)]

def dfs(v):
    visited[v.P][v.T][v.Pstep] = True
    for u in adj_rev[v.P][v.T][v.Pstep]:
        if not visited[u.P][u.T][u.Pstep]:
            if losing[v.P][v.T][v.Pstep]:
                winning[u.P][u.T][u.Pstep] = True
            else:
                degree[u.P][u.T][u.Pstep] -= 1
                if degree[u.P][u.T][u.Pstep] == 0:
                    losing[u.P][u.T][u.Pstep] = True
                else:
                    continue
            dfs(u)

def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    m = int(data[1])
    a = [data[2 + i].decode() for i in range(n)]

    dx = [-1, 0, 1, 0, -1, -1, 1, 1]
    dy = [0, 1, 0, -1, -1, 1, -1, 1]

    for P in range(n * m):
        for T in range(n * m):
            for Pstep in range(2):
                Px, Py, Tx, Ty = P // m, P % m, T // m, T % m
                if a[Px][Py] == '*' or a[Tx][Ty] == '*':
                    continue

                if Pstep:
                    win = (Px == Tx and Py == Ty)
                    lose = (not win) and a[Tx][Ty] == 'E'
                else:
                    lose = (Px == Tx and Py == Ty)
                    win = (not lose) and a[Tx][Ty] == 'E'
                winning[P][T][Pstep] = win
                losing[P][T][Pstep] = lose
                if win or lose:
                    continue

                # ребро «пропустити хід» + інкремент степеня
                adj_rev[P][T][Pstep].append(State(P, T, 1 - Pstep))
                st = State(P, T, Pstep)
                degree[P][T][Pstep] += 1

                for d in range(8 if Pstep else 4):
                    PPx, PPy, TTx, TTy = Px, Py, Tx, Ty
                    if Pstep:
                        PPx += dx[d]
                        PPy += dy[d]
                    else:
                        TTx += dx[d]
                        TTy += dy[d]

                    if (0 <= PPx < n and 0 <= PPy < m and a[PPx][PPy] != '*' and
                            0 <= TTx < n and 0 <= TTy < m and a[TTx][TTy] != '*'):
                        adj_rev[PPx * m + PPy][TTx * m + TTy][1 - Pstep].append(st)
                        degree[P][T][Pstep] += 1

    for P in range(n * m):
        for T in range(n * m):
            for Pstep in range(2):
                if (winning[P][T][Pstep] or losing[P][T][Pstep]) and not visited[P][T][Pstep]:
                    dfs(State(P, T, Pstep))

    P_st = T_st = 0
    for i in range(n):
        for j in range(m):
            if a[i][j] == 'P':
                P_st = i * m + j
            elif a[i][j] == 'T':
                T_st = i * m + j

    if winning[P_st][T_st][1]:
        print("Police catches the thief")
    elif losing[P_st][T_st][1]:
        print("The thief escapes")
    else:
        print("Draw")

main()
```

```typescript
interface State {
    P: number;
    T: number;
    Pstep: number;
}

// Тривимірні масиви [P][T][Pstep]
const adjRev: State[][][][] = Array.from({ length: 100 }, () =>
    Array.from({ length: 100 }, () => [[], []] as State[][]),
);
const winning: boolean[][][] = Array.from({ length: 100 }, () =>
    Array.from({ length: 100 }, () => [false, false]),
);
const losing: boolean[][][] = Array.from({ length: 100 }, () =>
    Array.from({ length: 100 }, () => [false, false]),
);
const visited: boolean[][][] = Array.from({ length: 100 }, () =>
    Array.from({ length: 100 }, () => [false, false]),
);
const degree: number[][][] = Array.from({ length: 100 }, () =>
    Array.from({ length: 100 }, () => [0, 0]),
);

function dfs(v: State): void {
    visited[v.P][v.T][v.Pstep] = true;
    for (const u of adjRev[v.P][v.T][v.Pstep]) {
        if (!visited[u.P][u.T][u.Pstep]) {
            if (losing[v.P][v.T][v.Pstep]) {
                winning[u.P][u.T][u.Pstep] = true;
            } else if (--degree[u.P][u.T][u.Pstep] === 0) {
                losing[u.P][u.T][u.Pstep] = true;
            } else {
                continue;
            }
            dfs(u);
        }
    }
}

const input = require("fs")
    .readFileSync(0, "utf8")
    .split(/\s+/)
    .filter((s: string) => s.length > 0);
let ptr = 0;
const n = Number(input[ptr++]);
const m = Number(input[ptr++]);
const a: string[] = [];
for (let i = 0; i < n; i++) a.push(input[ptr++]);

for (let P = 0; P < n * m; P++) {
    for (let T = 0; T < n * m; T++) {
        for (let Pstep = 0; Pstep <= 1; Pstep++) {
            const Px = Math.floor(P / m), Py = P % m;
            const Tx = Math.floor(T / m), Ty = T % m;
            if (a[Px][Py] === "*" || a[Tx][Ty] === "*") continue;

            let win: boolean, lose: boolean;
            if (Pstep) {
                win = Px === Tx && Py === Ty;
                lose = !win && a[Tx][Ty] === "E";
            } else {
                lose = Px === Tx && Py === Ty;
                win = !lose && a[Tx][Ty] === "E";
            }
            winning[P][T][Pstep] = win;
            losing[P][T][Pstep] = lose;
            if (win || lose) continue;

            // ребро «пропустити хід» + інкремент степеня
            adjRev[P][T][Pstep].push({ P, T, Pstep: 1 - Pstep });
            const st: State = { P, T, Pstep };
            degree[P][T][Pstep]++;

            const dx = [-1, 0, 1, 0, -1, -1, 1, 1];
            const dy = [0, 1, 0, -1, -1, 1, -1, 1];
            for (let d = 0; d < (Pstep ? 8 : 4); d++) {
                let PPx = Px, PPy = Py, TTx = Tx, TTy = Ty;
                if (Pstep) {
                    PPx += dx[d];
                    PPy += dy[d];
                } else {
                    TTx += dx[d];
                    TTy += dy[d];
                }

                if (
                    PPx >= 0 && PPx < n && PPy >= 0 && PPy < m && a[PPx][PPy] !== "*" &&
                    TTx >= 0 && TTx < n && TTy >= 0 && TTy < m && a[TTx][TTy] !== "*"
                ) {
                    adjRev[PPx * m + PPy][TTx * m + TTy][1 - Pstep].push(st);
                    degree[P][T][Pstep]++;
                }
            }
        }
    }
}

for (let P = 0; P < n * m; P++) {
    for (let T = 0; T < n * m; T++) {
        for (let Pstep = 0; Pstep <= 1; Pstep++) {
            if ((winning[P][T][Pstep] || losing[P][T][Pstep]) && !visited[P][T][Pstep]) {
                dfs({ P, T, Pstep });
            }
        }
    }
}

let Pst = 0, Tst = 0;
for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
        if (a[i][j] === "P") Pst = i * m + j;
        else if (a[i][j] === "T") Tst = i * m + j;
    }
}

if (winning[Pst][Tst][1]) {
    console.log("Police catches the thief");
} else if (losing[Pst][Tst][1]) {
    console.log("The thief escapes");
} else {
    console.log("Draw");
}
```

```go
package main

import (
    "bufio"
    "fmt"
    "os"
)

type State struct {
    P, T  int
    Pstep int
}

// Тривимірні масиви [P][T][Pstep]
var adjRev [100][100][2][]State
var winning [100][100][2]bool
var losing [100][100][2]bool
var visited [100][100][2]bool
var degree [100][100][2]int

func dfs(v State) {
    visited[v.P][v.T][v.Pstep] = true
    for _, u := range adjRev[v.P][v.T][v.Pstep] {
        if !visited[u.P][u.T][u.Pstep] {
            if losing[v.P][v.T][v.Pstep] {
                winning[u.P][u.T][u.Pstep] = true
            } else if degree[u.P][u.T][u.Pstep]--; degree[u.P][u.T][u.Pstep] == 0 {
                losing[u.P][u.T][u.Pstep] = true
            } else {
                continue
            }
            dfs(u)
        }
    }
}

func main() {
    reader := bufio.NewReader(os.Stdin)
    var n, m int
    fmt.Fscan(reader, &n, &m)
    a := make([]string, n)
    for i := 0; i < n; i++ {
        fmt.Fscan(reader, &a[i])
    }

    dx := []int{-1, 0, 1, 0, -1, -1, 1, 1}
    dy := []int{0, 1, 0, -1, -1, 1, -1, 1}

    for P := 0; P < n*m; P++ {
        for T := 0; T < n*m; T++ {
            for Pstep := 0; Pstep <= 1; Pstep++ {
                Px, Py, Tx, Ty := P/m, P%m, T/m, T%m
                if a[Px][Py] == '*' || a[Tx][Ty] == '*' {
                    continue
                }

                var win, lose bool
                if Pstep == 1 {
                    win = Px == Tx && Py == Ty
                    lose = !win && a[Tx][Ty] == 'E'
                } else {
                    lose = Px == Tx && Py == Ty
                    win = !lose && a[Tx][Ty] == 'E'
                }
                winning[P][T][Pstep] = win
                losing[P][T][Pstep] = lose
                if win || lose {
                    continue
                }

                // ребро «пропустити хід» + інкремент степеня
                adjRev[P][T][Pstep] = append(adjRev[P][T][Pstep], State{P, T, 1 - Pstep})
                st := State{P, T, Pstep}
                degree[P][T][Pstep]++

                cnt := 4
                if Pstep == 1 {
                    cnt = 8
                }
                for d := 0; d < cnt; d++ {
                    PPx, PPy, TTx, TTy := Px, Py, Tx, Ty
                    if Pstep == 1 {
                        PPx += dx[d]
                        PPy += dy[d]
                    } else {
                        TTx += dx[d]
                        TTy += dy[d]
                    }

                    if PPx >= 0 && PPx < n && PPy >= 0 && PPy < m && a[PPx][PPy] != '*' &&
                        TTx >= 0 && TTx < n && TTy >= 0 && TTy < m && a[TTx][TTy] != '*' {
                        adjRev[PPx*m+PPy][TTx*m+TTy][1-Pstep] =
                            append(adjRev[PPx*m+PPy][TTx*m+TTy][1-Pstep], st)
                        degree[P][T][Pstep]++
                    }
                }
            }
        }
    }

    for P := 0; P < n*m; P++ {
        for T := 0; T < n*m; T++ {
            for Pstep := 0; Pstep <= 1; Pstep++ {
                if (winning[P][T][Pstep] || losing[P][T][Pstep]) && !visited[P][T][Pstep] {
                    dfs(State{P, T, Pstep})
                }
            }
        }
    }

    Pst, Tst := 0, 0
    for i := 0; i < n; i++ {
        for j := 0; j < m; j++ {
            if a[i][j] == 'P' {
                Pst = i*m + j
            } else if a[i][j] == 'T' {
                Tst = i*m + j
            }
        }
    }

    if winning[Pst][Tst][1] {
        fmt.Println("Police catches the thief")
    } else if losing[Pst][Tst][1] {
        fmt.Println("The thief escapes")
    } else {
        fmt.Println("Draw")
    }
}
```

</CodeTabs>
