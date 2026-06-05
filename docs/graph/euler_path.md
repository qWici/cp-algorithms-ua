# Пошук ейлерового шляху за $O(M)$

Ейлерів шлях — це шлях у графі, який проходить через усі його ребра рівно один раз.
Ейлерів цикл — це ейлерів шлях, що є циклом.

Задача полягає в тому, щоб знайти ейлерів шлях у **неорієнтованому мультиграфі з петлями**.

## Алгоритм \{#algorithm}

Спершу ми можемо перевірити, чи існує ейлерів шлях.
Для цього скористаємося такою теоремою. Ейлерів цикл існує тоді й лише тоді, коли степені всіх вершин парні.
А ейлерів шлях існує тоді й лише тоді, коли кількість вершин з непарним степенем дорівнює двом (або нулю — у випадку існування ейлерового циклу).
Крім того, звісно, граф має бути достатньо зв'язним (тобто якщо прибрати з нього всі ізольовані вершини, то має вийти зв'язний граф).

Щоб знайти ейлерів шлях / ейлерів цикл, можемо застосувати таку стратегію:
ми знаходимо всі прості цикли й об'єднуємо їх в один — це і буде ейлерів цикл.
Якщо граф такий, що ейлерів шлях не є циклом, то додамо відсутнє ребро, знайдемо ейлерів цикл, а потім приберемо зайве ребро.

Пошук усіх циклів та їхнє об'єднання можна виконати простою рекурсивною процедурою:

```text
procedure FindEulerPath(V)
  1. iterate through all the edges outgoing from vertex V;
       remove this edge from the graph,
       and call FindEulerPath from the second end of this edge;
  2. add vertex V to the answer.
```

Складність цього алгоритму, очевидно, лінійна відносно кількості ребер.

Але той самий алгоритм ми можемо записати й у нерекурсивній версії:

```text
stack St;
put start vertex in St;
until St is empty
  let V be the value at the top of St;
  if degree(V) = 0, then
    add V to the answer;
    remove V from the top of St;
  otherwise
    find any edge coming out of V;
    remove it from the graph;
    put the second end of this edge in St;
```

Еквівалентність цих двох форм алгоритму легко перевірити. Однак друга форма, очевидно, швидша, і код вийде значно ефективнішим.

## Задача про доміно \{#the-domino-problem}

Наведемо тут класичну задачу на ейлерів цикл — задачу про доміно.

Маємо $N$ кісточок доміно; як відомо, на обох кінцях кісточки записано по одному числу (зазвичай від 1 до 6, але в нашому випадку це не важливо). Потрібно викласти всі кісточки в ряд так, щоб числа на будь-яких двох сусідніх кісточках, записані на їхньому спільному боці, збігалися. Кісточки дозволяється перевертати.

Переформулюємо задачу. Нехай числа, записані на кінцях, будуть вершинами графа, а кісточки доміно — ребрами цього графа (кожна кісточка з числами $(a,b)$ — це ребра $(a,b)$ та $(b, a)$). Тоді наша задача зводиться до задачі пошуку ейлерового шляху в цьому графі.

## Реалізація \{#implementation}

Наведена нижче програма шукає й виводить ейлерів цикл або шлях у графі, або виводить $-1$, якщо такого не існує.

Спершу програма перевіряє степені вершин: якщо немає вершин з непарним степенем, то в графі є ейлерів цикл; якщо є $2$ вершини з непарним степенем, то в графі є лише ейлерів шлях (але немає ейлерового циклу); якщо ж таких вершин більше ніж $2$, то в графі немає ні ейлерового циклу, ні ейлерового шляху.
Щоб знайти ейлерів шлях (а не цикл), зробимо так: якщо $V1$ і $V2$ — дві вершини непарного степеня, то просто додамо ребро $(V1, V2)$, у отриманому графі знайдемо ейлерів цикл (він, очевидно, існуватиме), а потім приберемо «фіктивне» ребро $(V1, V2)$ з відповіді.
Ейлерів цикл ми шукатимемо саме так, як описано вище (нерекурсивна версія), і водночас наприкінці цього алгоритму перевіримо, чи був граф зв'язним (якщо граф не був зв'язним, то в кінці роботи алгоритму в графі залишаться якісь ребра, і в цьому випадку треба вивести $-1$).
Нарешті, програма враховує, що в графі можуть бути ізольовані вершини.

Зверніть увагу, що в цій задачі ми використовуємо матрицю суміжності.
Також ця реалізація шукає наступне ребро повним перебором, що вимагає знову й знову проходити цілий рядок матриці.
Кращим способом було б зберігати граф як список суміжності, видаляти ребра за $O(1)$ і позначати обернені ребра в окремому списку.
Так ми можемо отримати алгоритм складності $O(N)$.

<CodeTabs>

```cpp
int main() {
    int n;
    vector<vector<int>> g(n, vector<int>(n));
    // зчитування графа в матрицю суміжності

    vector<int> deg(n);
    for (int i = 0; i < n; ++i) {
        for (int j = 0; j < n; ++j)
            deg[i] += g[i][j];
    }

    int first = 0;
    while (first < n && !deg[first])
        ++first;
    if (first == n) {
        cout << -1;
        return 0;
    }

    int v1 = -1, v2 = -1;
    bool bad = false;
    for (int i = 0; i < n; ++i) {
        if (deg[i] & 1) {
            if (v1 == -1)
                v1 = i;
            else if (v2 == -1)
                v2 = i;
            else
                bad = true;
        }
    }

    if (v1 != -1)
        ++g[v1][v2], ++g[v2][v1];

    stack<int> st;
    st.push(first);
    vector<int> res;
    while (!st.empty()) {
        int v = st.top();
        int i;
        for (i = 0; i < n; ++i)
            if (g[v][i])
                break;
        if (i == n) {
            res.push_back(v);
            st.pop();
        } else {
            --g[v][i];
            --g[i][v];
            st.push(i);
        }
    }

    if (v1 != -1) {
        for (size_t i = 0; i + 1 < res.size(); ++i) {
            if ((res[i] == v1 && res[i + 1] == v2) ||
                (res[i] == v2 && res[i + 1] == v1)) {
                vector<int> res2;
                for (size_t j = i + 1; j < res.size(); ++j)
                    res2.push_back(res[j]);
                for (size_t j = 1; j <= i; ++j)
                    res2.push_back(res[j]);
                res = res2;
                break;
            }
        }
    }

    for (int i = 0; i < n; ++i) {
        for (int j = 0; j < n; ++j) {
            if (g[i][j])
                bad = true;
        }
    }

    if (bad) {
        cout << -1;
    } else {
        for (int x : res)
            cout << x << " ";
    }
}
```

```python
import sys


def main():
    data = sys.stdin.read().split()
    idx = 0
    n = int(data[idx]); idx += 1
    # зчитування графа в матрицю суміжності
    g = [[0] * n for _ in range(n)]
    for i in range(n):
        for j in range(n):
            g[i][j] = int(data[idx]); idx += 1

    deg = [0] * n
    for i in range(n):
        for j in range(n):
            deg[i] += g[i][j]

    first = 0
    while first < n and not deg[first]:
        first += 1
    if first == n:
        print(-1, end="")
        return

    v1, v2 = -1, -1
    bad = False
    for i in range(n):
        if deg[i] & 1:
            if v1 == -1:
                v1 = i
            elif v2 == -1:
                v2 = i
            else:
                bad = True

    # якщо є дві вершини непарного степеня — додаємо фіктивне ребро
    if v1 != -1:
        g[v1][v2] += 1
        g[v2][v1] += 1

    st = [first]
    res = []
    while st:
        v = st[-1]
        i = 0
        while i < n and not g[v][i]:
            i += 1
        if i == n:
            res.append(v)
            st.pop()
        else:
            g[v][i] -= 1
            g[i][v] -= 1
            st.append(i)

    # прибираємо фіктивне ребро: розрізаємо цикл по ньому
    if v1 != -1:
        for i in range(len(res) - 1):
            if (res[i] == v1 and res[i + 1] == v2) or \
               (res[i] == v2 and res[i + 1] == v1):
                res = res[i + 1:] + res[1:i + 1]
                break

    # якщо залишились ребра — граф був незв'язний
    for i in range(n):
        for j in range(n):
            if g[i][j]:
                bad = True

    if bad:
        print(-1, end="")
    else:
        for x in res:
            print(x, end=" ")


main()
```

```typescript
function main(): void {
    const data = require("fs")
        .readFileSync(0, "utf8")
        .split(/\s+/)
        .filter((s: string) => s.length > 0)
        .map(Number);
    let idx = 0;
    const n = data[idx++];
    // зчитування графа в матрицю суміжності
    const g: number[][] = Array.from({ length: n }, () =>
        new Array<number>(n).fill(0));
    for (let i = 0; i < n; ++i)
        for (let j = 0; j < n; ++j)
            g[i][j] = data[idx++];

    const deg = new Array<number>(n).fill(0);
    for (let i = 0; i < n; ++i)
        for (let j = 0; j < n; ++j)
            deg[i] += g[i][j];

    let first = 0;
    while (first < n && !deg[first])
        ++first;
    if (first === n) {
        process.stdout.write("-1");
        return;
    }

    let v1 = -1, v2 = -1;
    let bad = false;
    for (let i = 0; i < n; ++i) {
        if (deg[i] & 1) {
            if (v1 === -1)
                v1 = i;
            else if (v2 === -1)
                v2 = i;
            else
                bad = true;
        }
    }

    // якщо є дві вершини непарного степеня — додаємо фіктивне ребро
    if (v1 !== -1) {
        ++g[v1][v2];
        ++g[v2][v1];
    }

    const st: number[] = [first];
    let res: number[] = [];
    while (st.length > 0) {
        const v = st[st.length - 1];
        let i = 0;
        while (i < n && !g[v][i])
            ++i;
        if (i === n) {
            res.push(v);
            st.pop();
        } else {
            --g[v][i];
            --g[i][v];
            st.push(i);
        }
    }

    // прибираємо фіктивне ребро: розрізаємо цикл по ньому
    if (v1 !== -1) {
        for (let i = 0; i + 1 < res.length; ++i) {
            if ((res[i] === v1 && res[i + 1] === v2) ||
                (res[i] === v2 && res[i + 1] === v1)) {
                res = res.slice(i + 1).concat(res.slice(1, i + 1));
                break;
            }
        }
    }

    // якщо залишились ребра — граф був незв'язний
    for (let i = 0; i < n; ++i)
        for (let j = 0; j < n; ++j)
            if (g[i][j])
                bad = true;

    if (bad) {
        process.stdout.write("-1");
    } else {
        for (const x of res)
            process.stdout.write(x + " ");
    }
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

func main() {
	reader := bufio.NewReader(os.Stdin)
	readInt := func() int {
		x := 0
		c, _ := reader.ReadByte()
		for c == ' ' || c == '\n' || c == '\r' || c == '\t' {
			c, _ = reader.ReadByte()
		}
		for c >= '0' && c <= '9' {
			x = x*10 + int(c-'0')
			c, _ = reader.ReadByte()
		}
		return x
	}

	n := readInt()
	// зчитування графа в матрицю суміжності
	g := make([][]int, n)
	for i := 0; i < n; i++ {
		g[i] = make([]int, n)
		for j := 0; j < n; j++ {
			g[i][j] = readInt()
		}
	}

	deg := make([]int, n)
	for i := 0; i < n; i++ {
		for j := 0; j < n; j++ {
			deg[i] += g[i][j]
		}
	}

	first := 0
	for first < n && deg[first] == 0 {
		first++
	}
	if first == n {
		fmt.Print(-1)
		return
	}

	v1, v2 := -1, -1
	bad := false
	for i := 0; i < n; i++ {
		if deg[i]&1 == 1 {
			if v1 == -1 {
				v1 = i
			} else if v2 == -1 {
				v2 = i
			} else {
				bad = true
			}
		}
	}

	// якщо є дві вершини непарного степеня — додаємо фіктивне ребро
	if v1 != -1 {
		g[v1][v2]++
		g[v2][v1]++
	}

	st := []int{first}
	res := []int{}
	for len(st) > 0 {
		v := st[len(st)-1]
		i := 0
		for i < n && g[v][i] == 0 {
			i++
		}
		if i == n {
			res = append(res, v)
			st = st[:len(st)-1]
		} else {
			g[v][i]--
			g[i][v]--
			st = append(st, i)
		}
	}

	// прибираємо фіктивне ребро: розрізаємо цикл по ньому
	if v1 != -1 {
		for i := 0; i+1 < len(res); i++ {
			if (res[i] == v1 && res[i+1] == v2) ||
				(res[i] == v2 && res[i+1] == v1) {
				res2 := append([]int(nil), res[i+1:]...)
				res2 = append(res2, res[1:i+1]...)
				res = res2
				break
			}
		}
	}

	// якщо залишились ребра — граф був незв'язний
	for i := 0; i < n; i++ {
		for j := 0; j < n; j++ {
			if g[i][j] != 0 {
				bad = true
			}
		}
	}

	if bad {
		fmt.Print(-1)
	} else {
		for _, x := range res {
			fmt.Print(x, " ")
		}
	}
}
```

</CodeTabs>

### Задачі для практики: \{#practice-problems}

- [CSES : Mail Delivery](https://cses.fi/problemset/task/1691)
- [CSES : Teleporters Path](https://cses.fi/problemset/task/1693)
- [Codeforces - Melody](https://codeforces.com/contest/2110/problem/E)
- [Codeforces - Tanya and Password](https://codeforces.com/contest/508/problem/D)

## Відеоматеріали \{#video}

<YouTubeEmbed id="8MpoO2zA2l4" title="Eulerian Path/Circuit algorithm (Hierholzer's algorithm) | Graph Theory — WilliamFiset" />
