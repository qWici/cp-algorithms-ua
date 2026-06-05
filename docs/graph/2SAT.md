# 2-SAT 

SAT (задача про виконуваність булевих формул, Boolean satisfiability problem) — це задача про присвоєння булевих значень змінним так, щоб задана булева формула була істинною.
Зазвичай булева формула задається у КНФ (кон'юнктивній нормальній формі) — кон'юнкції кількох диз'юнктів, де кожен диз'юнкт є диз'юнкцією літералів (змінних або їхніх заперечень).
2-SAT (2-виконуваність) — це обмеження задачі SAT, у якому кожен диз'юнкт має рівно два літерали.
Ось приклад такої задачі 2-SAT.
Знайти присвоєння $a, b, c$ таке, щоб наведена формула була істинною:

$$
(a \lor \lnot b) \land (\lnot a \lor b) \land (\lnot a \lor \lnot b) \land (a \lor \lnot c)
$$

SAT є NP-повною задачею, і для неї невідомо жодного ефективного розв'язку.
Однак 2-SAT можна розв'язати ефективно за $O(n + m)$, де $n$ — кількість змінних, а $m$ — кількість диз'юнктів.

:::tip[Коли підходить цей алгоритм?]
- Задачу можна звести до набору булевих обмежень, де кожне обмеження стосується **рівно двох** літералів (диз'юнкт виду $a \lor b$ або імплікація «з $x$ випливає $y$»)?
- Потрібно лише перевірити сумісність і за потреби побудувати **одне** допустиме присвоєння (а не порахувати всі чи знайти оптимальне)?
- Алгоритм спирається на пошук [компонент сильної зв'язності](strongly-connected-components.md) графа імплікацій — ви знайомі з цією технікою?
:::

## Алгоритм: \{#algorithm}

Спершу нам потрібно перетворити задачу до іншого вигляду — так званої імплікативної нормальної форми.
Зауважимо, що вираз $a \lor b$ еквівалентний $\lnot a \Rightarrow b \land \lnot b \Rightarrow a$ (якщо одна з двох змінних хибна, то інша має бути істинною).

Тепер побудуємо орієнтований граф цих імплікацій:
для кожної змінної $x$ буде дві вершини $v_x$ і $v_{\lnot x}$.
Ребра відповідатимуть імплікаціям.

Розгляньмо приклад у формі 2-КНФ:

$$
(a \lor \lnot b) \land (\lnot a \lor b) \land (\lnot a \lor \lnot b) \land (a \lor \lnot c)
$$

Орієнтований граф міститиме такі вершини та ребра:

$$
\begin{array}{cccc}
\lnot a \Rightarrow \lnot b & a \Rightarrow b & a \Rightarrow \lnot b & \lnot a \Rightarrow \lnot c\\
b \Rightarrow a & \lnot b \Rightarrow \lnot a & b \Rightarrow \lnot a & c \Rightarrow a
\end{array}
$$

Граф імплікацій можна побачити на наступному зображенні:

<center> <img src="/img/docs/graph/2SAT.png" alt="Implication Graph of 2-SAT example" /> </center>

Варто звернути увагу на властивість графа імплікацій:
якщо існує ребро $a \Rightarrow b$, то також існує ребро $\lnot b \Rightarrow \lnot a$. 

Також зауважимо, що якщо $x$ досяжна з $\lnot x$, а $\lnot x$ досяжна з $x$, то задача не має розв'язку.
Яке б значення ми не обрали для змінної $x$, воно завжди призведе до суперечності: якщо $x$ буде присвоєно $\text{true}$, то імплікація каже нам, що $\lnot x$ також має бути $\text{true}$, і навпаки.
Виявляється, що ця умова не лише необхідна, а й достатня.
Ми доведемо це у кількох абзацах нижче.
Спершу пригадаємо: якщо одна вершина досяжна з другої, а друга досяжна з першої, то ці дві вершини належать до однієї компоненти сильної зв'язності.
Тому критерій існування розв'язку можна сформулювати так:

Щоб ця задача 2-SAT мала розв'язок, необхідно й достатньо, щоб для будь-якої змінної $x$ вершини $x$ та $\lnot x$ належали до різних компонент сильної зв'язності графа імплікацій.

Цей критерій можна перевірити за $O(n + m)$, знайшовши всі компоненти сильної зв'язності.

На наступному зображенні показано всі компоненти сильної зв'язності для прикладу.
Як легко перевірити, жодна з чотирьох компонент не містить водночас вершини $x$ та її заперечення $\lnot x$, тому приклад має розв'язок.
У наступних абзацах ми навчимося обчислювати коректне присвоєння, а наразі для демонстрації наведемо розв'язок $a = \text{false}$, $b = \text{false}$, $c = \text{false}$.

<center> <img src="/img/docs/graph/2SAT_SCC.png" alt="Strongly Connected Components of the 2-SAT example" /> </center>

Тепер побудуємо алгоритм для знаходження розв'язку задачі 2-SAT за припущення, що розв'язок існує.

Зауважимо, що, попри існування розв'язку, може статися так, що $\lnot x$ досяжна з $x$ у графі імплікацій, або (але не одночасно) що $x$ досяжна з $\lnot x$.
У цьому випадку вибір $\text{true}$ чи $\text{false}$ для $x$ призведе до суперечності, тоді як вибір іншого значення — ні.
Навчимося обирати значення так, щоб не породжувати суперечності.

Відсортуймо компоненти сильної зв'язності в топологічному порядку (тобто $\text{comp}[v] \le \text{comp}[u]$, якщо існує шлях з $v$ до $u$), і нехай $\text{comp}[v]$ позначає індекс компоненти сильної зв'язності, до якої належить вершина $v$.
Тоді, якщо $\text{comp}[x] < \text{comp}[\lnot x]$, ми присвоюємо $x$ значення $\text{false}$, інакше — $\text{true}$.

Доведемо, що з таким присвоєнням змінних ми не приходимо до суперечності.
Припустимо, що $x$ присвоєно $\text{true}$.
Інший випадок можна довести аналогічно.

Спершу доведемо, що вершина $x$ не може досягти вершини $\lnot x$.
Оскільки ми присвоїли $\text{true}$, має виконуватися, що індекс компоненти сильної зв'язності $x$ більший за індекс компоненти $\lnot x$.
Це означає, що $\lnot x$ розташована ліворуч від компоненти, яка містить $x$, а пізніша вершина не може досягти першої.

По-друге, доведемо, що не існує змінної $y$ такої, щоб вершини $y$ та $\lnot y$ обидві були досяжними з $x$ у графі імплікацій.
Це спричинило б суперечність, бо $x = \text{true}$ означає, що $y = \text{true}$ та $\lnot y = \text{true}$.
Доведемо це від супротивного.
Припустимо, що $y$ та $\lnot y$ обидві досяжні з $x$; тоді за властивістю графа імплікацій $\lnot x$ досяжна як з $y$, так і з $\lnot y$.
За транзитивністю звідси випливає, що $\lnot x$ досяжна з $x$, що суперечить припущенню.

Отже, ми побудували алгоритм, який знаходить необхідні значення змінних за припущення, що для будь-якої змінної $x$ вершини $x$ та $\lnot x$ належать до різних компонент сильної зв'язності.
Вище ми показали коректність цього алгоритму.
Як наслідок, ми водночас довели наведений вище критерій існування розв'язку.

## Реалізація: \{#implementation}

Тепер ми можемо реалізувати весь алгоритм.
Спершу будуємо граф імплікацій і знаходимо всі компоненти сильної зв'язності.
Це можна зробити за допомогою алгоритму Косараю за $O(n + m)$.
Під час другого обходу графа алгоритм Косараю відвідує компоненти сильної зв'язності в топологічному порядку, тому легко обчислити $\text{comp}[v]$ для кожної вершини $v$.

Після цього ми можемо обрати присвоєння $x$, порівнюючи $\text{comp}[x]$ та $\text{comp}[\lnot x]$. 
Якщо $\text{comp}[x] = \text{comp}[\lnot x]$, ми повертаємо $\text{false}$, щоб позначити, що не існує коректного присвоєння, яке задовольняє задачу 2-SAT.

Нижче наведено реалізацію розв'язку задачі 2-SAT для вже побудованого графа імплікацій $adj$ та транспонованого графа $adj^{\intercal}$ (у якому напрямок кожного ребра обернено).
У графі вершини з індексами $2k$ та $2k+1$ — це дві вершини, що відповідають змінній $k$, причому $2k+1$ відповідає запереченій змінній.

<CodeTabs>

```cpp
struct TwoSatSolver {
    int n_vars;
    int n_vertices;
    vector<vector<int>> adj, adj_t;
    vector<bool> used;
    vector<int> order, comp;
    vector<bool> assignment;

    TwoSatSolver(int _n_vars) : n_vars(_n_vars), n_vertices(2 * n_vars), adj(n_vertices), adj_t(n_vertices), used(n_vertices), order(), comp(n_vertices, -1), assignment(n_vars) {
        order.reserve(n_vertices);
    }
    void dfs1(int v) {
        used[v] = true;
        for (int u : adj[v]) {
            if (!used[u])
                dfs1(u);
        }
        order.push_back(v);
    }

    void dfs2(int v, int cl) {
        comp[v] = cl;
        for (int u : adj_t[v]) {
            if (comp[u] == -1)
                dfs2(u, cl);
        }
    }

    bool solve_2SAT() {
        order.clear();
        used.assign(n_vertices, false);
        for (int i = 0; i < n_vertices; ++i) {
            if (!used[i])
                dfs1(i);
        }

        comp.assign(n_vertices, -1);
        for (int i = 0, j = 0; i < n_vertices; ++i) {
            int v = order[n_vertices - i - 1];
            if (comp[v] == -1)
                dfs2(v, j++);
        }

        assignment.assign(n_vars, false);
        for (int i = 0; i < n_vertices; i += 2) {
            if (comp[i] == comp[i + 1])
                return false;
            assignment[i / 2] = comp[i] > comp[i + 1];
        }
        return true;
    }

    void add_disjunction(int a, bool na, int b, bool nb) {
        // na та nb позначають, чи треба заперечувати a та b
        a = 2 * a ^ na;
        b = 2 * b ^ nb;
        int neg_a = a ^ 1;
        int neg_b = b ^ 1;
        adj[neg_a].push_back(b);
        adj[neg_b].push_back(a);
        adj_t[b].push_back(neg_a);
        adj_t[a].push_back(neg_b);
    }

    static void example_usage() {
        TwoSatSolver solver(3); // a, b, c
        solver.add_disjunction(0, false, 1, true);  //     a  v  not b
        solver.add_disjunction(0, true, 1, true);   // not a  v  not b
        solver.add_disjunction(1, false, 2, false); //     b  v      c
        solver.add_disjunction(0, false, 0, false); //     a  v      a
        assert(solver.solve_2SAT() == true);
        auto expected = vector<bool>{{true, false, true}};
        assert(solver.assignment == expected);
    }
};
```

```python
import sys

# Алгоритм Косараю використовує рекурсивний DFS. На великих графах
# глибина рекурсії може перевищити стандартний ліміт Python (1000),
# тому піднімаємо його заздалегідь: sys.setrecursionlimit(глибина).
sys.setrecursionlimit(300000)


class TwoSatSolver:
    def __init__(self, n_vars):
        self.n_vars = n_vars
        self.n_vertices = 2 * n_vars
        # adj — граф імплікацій, adj_t — транспонований граф
        self.adj = [[] for _ in range(self.n_vertices)]
        self.adj_t = [[] for _ in range(self.n_vertices)]
        self.used = [False] * self.n_vertices
        self.order = []
        self.comp = [-1] * self.n_vertices
        self.assignment = [False] * n_vars

    def _dfs1(self, v):
        self.used[v] = True
        for u in self.adj[v]:
            if not self.used[u]:
                self._dfs1(u)
        self.order.append(v)

    def _dfs2(self, v, cl):
        self.comp[v] = cl
        for u in self.adj_t[v]:
            if self.comp[u] == -1:
                self._dfs2(u, cl)

    def solve_2SAT(self):
        self.order = []
        self.used = [False] * self.n_vertices
        for i in range(self.n_vertices):
            if not self.used[i]:
                self._dfs1(i)

        self.comp = [-1] * self.n_vertices
        j = 0
        # Другий обхід у зворотному порядку завершення — компоненти
        # нумеруються в топологічному порядку.
        for v in reversed(self.order):
            if self.comp[v] == -1:
                self._dfs2(v, j)
                j += 1

        self.assignment = [False] * self.n_vars
        for i in range(0, self.n_vertices, 2):
            if self.comp[i] == self.comp[i + 1]:
                return False
            self.assignment[i // 2] = self.comp[i] > self.comp[i + 1]
        return True

    def add_disjunction(self, a, na, b, nb):
        # na та nb позначають, чи треба заперечувати a та b
        a = 2 * a ^ na
        b = 2 * b ^ nb
        neg_a = a ^ 1
        neg_b = b ^ 1
        self.adj[neg_a].append(b)
        self.adj[neg_b].append(a)
        self.adj_t[b].append(neg_a)
        self.adj_t[a].append(neg_b)


def example_usage():
    solver = TwoSatSolver(3)  # a, b, c
    solver.add_disjunction(0, False, 1, True)   #     a  v  not b
    solver.add_disjunction(0, True, 1, True)    # not a  v  not b
    solver.add_disjunction(1, False, 2, False)  #     b  v      c
    solver.add_disjunction(0, False, 0, False)  #     a  v      a
    assert solver.solve_2SAT() is True
    assert solver.assignment == [True, False, True]
```

```typescript
class TwoSatSolver {
    nVars: number;
    nVertices: number;
    adj: number[][];      // граф імплікацій
    adjT: number[][];     // транспонований граф
    used: boolean[];
    order: number[];
    comp: number[];
    assignment: boolean[];

    constructor(nVars: number) {
        this.nVars = nVars;
        this.nVertices = 2 * nVars;
        this.adj = Array.from({ length: this.nVertices }, () => []);
        this.adjT = Array.from({ length: this.nVertices }, () => []);
        this.used = new Array(this.nVertices).fill(false);
        this.order = [];
        this.comp = new Array(this.nVertices).fill(-1);
        this.assignment = new Array(nVars).fill(false);
    }

    private dfs1(v: number): void {
        this.used[v] = true;
        for (const u of this.adj[v]) {
            if (!this.used[u]) this.dfs1(u);
        }
        this.order.push(v);
    }

    private dfs2(v: number, cl: number): void {
        this.comp[v] = cl;
        for (const u of this.adjT[v]) {
            if (this.comp[u] === -1) this.dfs2(u, cl);
        }
    }

    solve2SAT(): boolean {
        this.order = [];
        this.used = new Array(this.nVertices).fill(false);
        for (let i = 0; i < this.nVertices; ++i) {
            if (!this.used[i]) this.dfs1(i);
        }

        this.comp = new Array(this.nVertices).fill(-1);
        let j = 0;
        // Обходимо у зворотному порядку завершення — компоненти
        // нумеруються в топологічному порядку.
        for (let i = 0; i < this.nVertices; ++i) {
            const v = this.order[this.nVertices - i - 1];
            if (this.comp[v] === -1) this.dfs2(v, j++);
        }

        this.assignment = new Array(this.nVars).fill(false);
        for (let i = 0; i < this.nVertices; i += 2) {
            if (this.comp[i] === this.comp[i + 1]) return false;
            this.assignment[i / 2] = this.comp[i] > this.comp[i + 1];
        }
        return true;
    }

    addDisjunction(a: number, na: boolean, b: number, nb: boolean): void {
        // na та nb позначають, чи треба заперечувати a та b
        a = 2 * a ^ (na ? 1 : 0);
        b = 2 * b ^ (nb ? 1 : 0);
        const negA = a ^ 1;
        const negB = b ^ 1;
        this.adj[negA].push(b);
        this.adj[negB].push(a);
        this.adjT[b].push(negA);
        this.adjT[a].push(negB);
    }

    static exampleUsage(): void {
        const solver = new TwoSatSolver(3); // a, b, c
        solver.addDisjunction(0, false, 1, true);  //     a  v  not b
        solver.addDisjunction(0, true, 1, true);   // not a  v  not b
        solver.addDisjunction(1, false, 2, false); //     b  v      c
        solver.addDisjunction(0, false, 0, false); //     a  v      a
        console.assert(solver.solve2SAT() === true);
        const expected = [true, false, true];
        console.assert(
            JSON.stringify(solver.assignment) === JSON.stringify(expected)
        );
    }
}
```

```go
type TwoSatSolver struct {
	nVars      int
	nVertices  int
	adj, adjT  [][]int // adj — граф імплікацій, adjT — транспонований
	used       []bool
	order      []int
	comp       []int
	assignment []bool
}

func NewTwoSatSolver(nVars int) *TwoSatSolver {
	nVertices := 2 * nVars
	comp := make([]int, nVertices)
	for i := range comp {
		comp[i] = -1
	}
	return &TwoSatSolver{
		nVars:      nVars,
		nVertices:  nVertices,
		adj:        make([][]int, nVertices),
		adjT:       make([][]int, nVertices),
		used:       make([]bool, nVertices),
		order:      make([]int, 0, nVertices),
		comp:       comp,
		assignment: make([]bool, nVars),
	}
}

func (s *TwoSatSolver) dfs1(v int) {
	s.used[v] = true
	for _, u := range s.adj[v] {
		if !s.used[u] {
			s.dfs1(u)
		}
	}
	s.order = append(s.order, v)
}

func (s *TwoSatSolver) dfs2(v, cl int) {
	s.comp[v] = cl
	for _, u := range s.adjT[v] {
		if s.comp[u] == -1 {
			s.dfs2(u, cl)
		}
	}
}

func (s *TwoSatSolver) Solve2SAT() bool {
	s.order = s.order[:0]
	for i := range s.used {
		s.used[i] = false
	}
	for i := 0; i < s.nVertices; i++ {
		if !s.used[i] {
			s.dfs1(i)
		}
	}

	for i := range s.comp {
		s.comp[i] = -1
	}
	// Обхід у зворотному порядку завершення — компоненти
	// нумеруються в топологічному порядку.
	j := 0
	for i := 0; i < s.nVertices; i++ {
		v := s.order[s.nVertices-i-1]
		if s.comp[v] == -1 {
			s.dfs2(v, j)
			j++
		}
	}

	for i := range s.assignment {
		s.assignment[i] = false
	}
	for i := 0; i < s.nVertices; i += 2 {
		if s.comp[i] == s.comp[i+1] {
			return false
		}
		s.assignment[i/2] = s.comp[i] > s.comp[i+1]
	}
	return true
}

// b2i перетворює булеве значення на 0 або 1 для побітових операцій.
func b2i(b bool) int {
	if b {
		return 1
	}
	return 0
}

func (s *TwoSatSolver) AddDisjunction(a int, na bool, b int, nb bool) {
	// na та nb позначають, чи треба заперечувати a та b
	a = 2*a ^ b2i(na)
	b = 2*b ^ b2i(nb)
	negA := a ^ 1
	negB := b ^ 1
	s.adj[negA] = append(s.adj[negA], b)
	s.adj[negB] = append(s.adj[negB], a)
	s.adjT[b] = append(s.adjT[b], negA)
	s.adjT[a] = append(s.adjT[a], negB)
}

func exampleUsage() {
	solver := NewTwoSatSolver(3) // a, b, c
	solver.AddDisjunction(0, false, 1, true)  //     a  v  not b
	solver.AddDisjunction(0, true, 1, true)   // not a  v  not b
	solver.AddDisjunction(1, false, 2, false) //     b  v      c
	solver.AddDisjunction(0, false, 0, false) //     a  v      a
	if !solver.Solve2SAT() {
		panic("expected satisfiable")
	}
	expected := []bool{true, false, true}
	for i := range expected {
		if solver.assignment[i] != expected[i] {
			panic("wrong assignment")
		}
	}
}
```

</CodeTabs>

## Задачі для практики \{#practice-problems}
 * [Codeforces: The Door Problem](http://codeforces.com/contest/776/problem/D)
 * [Kattis: Illumination](https://open.kattis.com/problems/illumination)
 * [UVA: Rectangles](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=3081)
 * [Codeforces : Radio Stations](https://codeforces.com/problemset/problem/1215/F)
 * [CSES : Giant Pizza](https://cses.fi/problemset/task/1684)
 * [Codeforces: +-1](https://codeforces.com/contest/1971/problem/H)
 * [Gym: (C) Colorful Village](https://codeforces.com/gym/104772/problem/C)
 * [POI: Renovation](https://szkopul.edu.pl/problemset/problem/xNjwUvwdHQoQTFBrmyG8vD1O/site/?key=statement)

## Відеоматеріали \{#video}

<YouTubeEmbed id="Ku-jJ0G4tIc" title="How to solve the 2-SAT problem in POLYNOMIAL TIME? — Inside code" />
