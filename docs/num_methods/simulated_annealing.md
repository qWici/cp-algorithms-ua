# Імітація відпалу

**Імітація відпалу (Simulated Annealing, SA)** — це рандомізований алгоритм, який наближено знаходить глобальний оптимум функції. Його називають рандомізованим, бо в процесі пошуку він використовує певну частку випадковості, а отже його результат для одного й того самого входу може відрізнятися.

:::tip[Коли підходить цей алгоритм?]
- Простір станів великий і дискретний, а цільова функція має багато локальних мінімумів, через що жадібний/точний перебір не працює?
- Достатньо наближеного (не обов'язково оптимального) розв'язку, а є запас часу на багато ітерацій?
- Цільова функція **унімодальна** на неперервному відрізку? *(якщо так → [Тернарний пошук](ternary_search.md))*
:::

## Задача \{#the-problem}

Нам задано функцію $E(s)$, яка обчислює енергію стану $s$. Наше завдання — знайти стан $s_{best}$, у якому $E(s)$ мінімізується. **SA** добре підходить для задач, де стани дискретні, а $E(s)$ має кілька локальних мінімумів. Розглянемо приклад [задачі комівояжера (TSP)](https://en.wikipedia.org/wiki/Travelling_salesman_problem).

### Задача комівояжера (TSP) \{#travelling-salesman-problem-tsp}

Вам задано набір вершин у двовимірному просторі. Кожна вершина характеризується своїми координатами $x$ і $y$. Ваше завдання — знайти такий порядок обходу вершин, який мінімізує сумарну відстань, що проходиться під час відвідування цих вершин у цьому порядку.

## Мотивація \{#motivation}
Відпал — це металургійний процес, у якому матеріал нагрівають, а потім дають охолонути, щоб атоми всередині перебудувалися в розташування з мінімальною внутрішньою енергією, що, своєю чергою, надає матеріалу інших властивостей. Станом тут є розташування атомів, а внутрішня енергія — це функція, яку ми мінімізуємо. Початковий стан атомів можна розглядати як локальний мінімум внутрішньої енергії. Щоб матеріал перебудував свої атоми, нам потрібно змотивувати його пройти через область, де його внутрішня енергія не є мінімальною, аби досягти глобального мінімуму. Цю мотивацію забезпечує нагрівання матеріалу до вищої температури.

Імітація відпалу буквально імітує цей процес. Ми починаємо з деякого випадкового стану (матеріалу) і задаємо високу температуру (нагріваємо його). Тепер алгоритм готовий приймати стани, що мають вищу енергію, ніж поточний стан, бо його мотивує висока температура. Це не дає алгоритму застрягнути в локальних мінімумах і змушує його рухатися до глобального мінімуму. З плином часу алгоритм охолоджується, відмовляється приймати стани з вищою енергією і переходить до найближчого знайденого мінімуму.

### Функція енергії E(s) \{#the-energy-function-es}

$E(s)$ — це функція, яку потрібно мінімізувати (або максимізувати). Вона відображає кожен стан у дійсне число. У випадку TSP $E(s)$ повертає відстань повного оберту по колу в тому порядку вершин, що задано станом.

### Стан \{#state}

Простір станів — це область визначення функції енергії $E(s)$, а стан — це будь-який елемент, що належить простору станів. У випадку TSP усі можливі шляхи, якими ми можемо відвідати всі вершини, утворюють простір станів, а будь-який окремий такий шлях можна вважати станом.

### Сусідній стан \{#neighbouring-state}

Це стан у просторі станів, близький до попереднього стану. Зазвичай це означає, що ми можемо отримати сусідній стан з вихідного за допомогою простого перетворення. У випадку задачі комівояжера сусідній стан отримують, випадково обираючи 2 вершини й міняючи їхні позиції в поточному стані місцями.

## Алгоритм \{#algorithm}

Ми починаємо з випадкового стану $s$. На кожному кроці ми обираємо сусідній стан $s_{next}$ поточного стану $s$. Якщо $E(s_{next}) < E(s)$, то ми оновлюємо $s = s_{next}$. Інакше ми використовуємо функцію ймовірності прийняття $P(E(s),E(s_{next}),T)$, яка вирішує, чи слід нам перейти до $s_{next}$, чи лишитися в $s$. Тут $T$ — це температура, яку спочатку задають високою і яка повільно спадає з кожним кроком. Що вища температура, то ймовірніше перейти до $s_{next}$.
Водночас ми також відстежуємо найкращий стан $s_{best}$ серед усіх ітерацій. Продовжуємо, поки не настане збіжність або не закінчиться час.


<center> <img src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Hill_Climbing_with_Simulated_Annealing.gif" width="800px" /> <br/> <i>Візуальне зображення імітації відпалу під час пошуку максимуму цієї функції з кількома локальними максимумами.</i> <br/> </center>

### Температура (T) і спад (u) \{#temperaturet-and-decayu}

Температура системи кількісно визначає готовність алгоритму прийняти стан з вищою енергією. Спад — це константа, що кількісно задає «швидкість охолодження» алгоритму. Відомо, що повільна швидкість охолодження (більше значення $u$) дає кращі результати.

## Функція ймовірності прийняття (PAF) \{#probability-acceptance-functionpaf}

$P(E,E_{next},T) = 
    \begin{cases}
       \text{True} &\quad\text{if }  \mathcal{U}_{[0,1]} \le \exp(-\frac{E_{next}-E}{T}) \\
       \text{False} &\quad\text{otherwise}\\
     \end{cases}$

Тут $\mathcal{U}_{[0,1]}$ — це неперервна рівномірно розподілена випадкова величина на $[0,1]$. Ця функція приймає поточний стан, наступний стан і температуру та повертає булеве значення, яке повідомляє нашому пошуку, чи слід йому перейти до $s_{next}$, чи лишитися в $s$. Зауважимо, що для $E_{next} < E$ ця функція завжди повертатиме True, інакше ж вона все одно може зробити перехід з імовірністю $\exp(-\frac{E_{next}-E}{T})$, що відповідає [мірі Гіббса](https://en.wikipedia.org/wiki/Gibbs_measure).

<CodeTabs>

```cpp
bool P(double E,double E_next,double T,mt19937 rng){
    double prob =  exp(-(E_next-E)/T);
    if(prob > 1) return true;
    else{
        bernoulli_distribution d(prob); 
        return d(rng);
    }
}
```

```python
import math
import random


def P(E: float, E_next: float, T: float) -> bool:
    prob = math.exp(-(E_next - E) / T)
    if prob > 1:
        return True
    # Випробування Бернуллі: True з імовірністю prob
    return random.random() < prob
```

```typescript
function P(E: number, E_next: number, T: number): boolean {
  const prob = Math.exp(-(E_next - E) / T);
  if (prob > 1) return true;
  // Випробування Бернуллі: true з імовірністю prob
  return Math.random() < prob;
}
```

```go
import (
    "math"
    "math/rand"
)

func P(E, ENext, T float64) bool {
    prob := math.Exp(-(ENext - E) / T)
    if prob > 1 {
        return true
    }
    // Випробування Бернуллі: true з імовірністю prob
    return rand.Float64() < prob
}
```

</CodeTabs>

## Шаблон коду \{#code-template}

<CodeTabs>

```cpp
class state {
    public:
    state() {
        // Генеруємо початковий стан
    }
    state next() {
        state s_next;
        // Змінюємо s_next на випадковий сусідній стан
        return s_next;
    }
    double E() {
        // Реалізуйте тут функцію енергії
    };
};


pair<double, state> simAnneal() {
    state s = state();
    state best = s;
    double T = 10000; // Початкова температура
    double u = 0.995; // швидкість спаду
    double E = s.E();
    double E_next;
    double E_best = E;
    mt19937 rng(chrono::steady_clock::now().time_since_epoch().count());
    while (T > 1) {
        state next = s.next();
        E_next = next.E();
        if (P(E, E_next, T, rng)) {
            s = next;
            if (E_next < E_best) {
                best = s;
                E_best = E_next;
            }
            E = E_next;
        }
        T *= u;
    }
    return {E_best, best};
}

```

```python
import copy


class State:
    def __init__(self):
        # Генеруємо початковий стан
        pass

    def next(self) -> "State":
        s_next = copy.deepcopy(self)
        # Змінюємо s_next на випадковий сусідній стан
        return s_next

    def E(self) -> float:
        # Реалізуйте тут функцію енергії
        ...


def sim_anneal() -> tuple[float, State]:
    s = State()
    best = s
    T = 10000.0  # Початкова температура
    u = 0.995    # швидкість спаду
    E = s.E()
    E_best = E
    while T > 1:
        nxt = s.next()
        E_next = nxt.E()
        if P(E, E_next, T):
            s = nxt
            if E_next < E_best:
                best = s
                E_best = E_next
            E = E_next
        T *= u
    return E_best, best
```

```typescript
interface State {
  next(): State;
  E(): number;
}

function simAnneal(makeInitial: () => State): [number, State] {
  let s = makeInitial();
  let best = s;
  let T = 10000; // Початкова температура
  const u = 0.995; // швидкість спаду
  let E = s.E();
  let E_best = E;
  while (T > 1) {
    const next = s.next();
    const E_next = next.E();
    if (P(E, E_next, T)) {
      s = next;
      if (E_next < E_best) {
        best = s;
        E_best = E_next;
      }
      E = E_next;
    }
    T *= u;
  }
  return [E_best, best];
}
```

```go
type State interface {
    Next() State
    E() float64
}

func simAnneal(initial State) (float64, State) {
    s := initial
    best := s
    T := 10000.0 // Початкова температура
    u := 0.995   // швидкість спаду
    E := s.E()
    EBest := E
    for T > 1 {
        next := s.Next()
        ENext := next.E()
        if P(E, ENext, T) {
            s = next
            if ENext < EBest {
                best = s
                EBest = ENext
            }
            E = ENext
        }
        T *= u
    }
    return EBest, best
}
```

</CodeTabs>

## Як цим користуватися: \{#how-to-use}
Заповніть функції класу state відповідним чином. Якщо ви намагаєтеся знайти глобальний максимум, а не мінімум, переконайтеся, що функція $E()$ повертає функцію, яку ви максимізуєте, зі знаком мінус, і виведіть $-E_{best}$ наприкінці. Задайте наведені нижче параметри відповідно до своїх потреб.

### Параметри \{#parameters}
- $T$ : Початкова температура. Задайте їй більше значення, якщо хочете, щоб пошук тривав довше.
- $u$ : Спад. Визначає швидкість охолодження. Повільніша швидкість охолодження (більше значення u) зазвичай дає кращі результати ціною довшого часу роботи. Переконайтеся, що $u < 1$.

Кількість ітерацій, яку виконає цикл, задається виразом

$N =   \lceil -\log_{u}{T} \rceil$ 

Поради щодо вибору $T$ і $u$ : Якщо локальних мінімумів багато й простір станів широкий, задайте $u = 0.999$ для повільної швидкості охолодження, що дасть алгоритму змогу дослідити більше можливостей. З іншого боку, якщо простір станів вужчий, має вистачити $u = 0.99$. Якщо ви не впевнені, перестрахуйтеся, задавши $u = 0.998$ або вище. Обчисліть часову складність однієї ітерації алгоритму й скористайтеся нею, щоб приблизно оцінити таке значення $N$, яке запобіжить TLE, а потім скористайтеся наведеною нижче формулою, щоб отримати $T$.

$T = u^{-N}$

### Приклад реалізації для TSP \{#example-implementation-for-tsp}
<CodeTabs>

```cpp

class state {
    public:
    vector<pair<int, int>> points;
	std::mt19937 mt{ static_cast<std::mt19937::result_type>(
		std::chrono::steady_clock::now().time_since_epoch().count()
		) };
    state() {
        points = {%raw%} {{0,0},{2,2},{0,2},{2,0},{0,1},{1,2},{2,1},{1,0}} {%endraw%};
    }
    state next() {
        state s_next;
        s_next.points = points;
        uniform_int_distribution<> choose(0, points.size()-1);
        int a = choose(mt);
        int b = choose(mt);
        s_next.points[a].swap(s_next.points[b]);
        return s_next;
    }

    double euclidean(pair<int, int> a, pair<int, int> b) {
        return hypot(a.first - b.first, a.second - b.second);
    }
    
    double E() {
        double dist = 0;
        int n = points.size();
        for (int i = 0;i < n; i++)
            dist += euclidean(points[i], points[(i+1)%n]);
        return dist;
    };
};

int main() {
    pair<double, state> res;
    res = simAnneal();
    double E_best = res.first;
    state best = res.second;
    cout << "Lenght of shortest path found : " << E_best << "\n";
    cout << "Order of points in shortest path : \n";
    for(auto x: best.points) {
        cout << x.first << " " << x.second << "\n";
    }
}
```

```python
import copy
import math
import random


class TSPState(State):
    def __init__(self, points=None):
        if points is None:
            points = [(0, 0), (2, 2), (0, 2), (2, 0),
                      (0, 1), (1, 2), (2, 1), (1, 0)]
        self.points = list(points)

    def next(self) -> "TSPState":
        s_next = TSPState(self.points)
        # Випадково обираємо дві вершини й міняємо їх місцями
        a = random.randrange(len(self.points))
        b = random.randrange(len(self.points))
        s_next.points[a], s_next.points[b] = s_next.points[b], s_next.points[a]
        return s_next

    @staticmethod
    def euclidean(a, b) -> float:
        return math.hypot(a[0] - b[0], a[1] - b[1])

    def E(self) -> float:
        dist = 0.0
        n = len(self.points)
        for i in range(n):
            dist += self.euclidean(self.points[i], self.points[(i + 1) % n])
        return dist


if __name__ == "__main__":
    E_best, best = sim_anneal_tsp()
    print(f"Lenght of shortest path found : {E_best}")
    print("Order of points in shortest path :")
    for x in best.points:
        print(x[0], x[1])
```

```typescript
type Point = [number, number];

class TSPState implements State {
  points: Point[];

  constructor(points?: Point[]) {
    this.points = points
      ? points.map((p) => [...p] as Point)
      : [[0, 0], [2, 2], [0, 2], [2, 0], [0, 1], [1, 2], [2, 1], [1, 0]];
  }

  next(): TSPState {
    const sNext = new TSPState(this.points);
    // Випадково обираємо дві вершини й міняємо їх місцями
    const a = Math.floor(Math.random() * this.points.length);
    const b = Math.floor(Math.random() * this.points.length);
    [sNext.points[a], sNext.points[b]] = [sNext.points[b], sNext.points[a]];
    return sNext;
  }

  static euclidean(a: Point, b: Point): number {
    return Math.hypot(a[0] - b[0], a[1] - b[1]);
  }

  E(): number {
    let dist = 0;
    const n = this.points.length;
    for (let i = 0; i < n; i++)
      dist += TSPState.euclidean(this.points[i], this.points[(i + 1) % n]);
    return dist;
  }
}

const [E_best, best] = simAnneal(() => new TSPState());
console.log(`Lenght of shortest path found : ${E_best}`);
console.log("Order of points in shortest path :");
for (const x of (best as TSPState).points) {
  console.log(x[0], x[1]);
}
```

```go
import (
    "fmt"
    "math"
    "math/rand"
)

type point struct{ x, y int }

type tspState struct {
    points []point
}

func newTSPState() *tspState {
    return &tspState{points: []point{
        {0, 0}, {2, 2}, {0, 2}, {2, 0}, {0, 1}, {1, 2}, {2, 1}, {1, 0},
    }}
}

func (s *tspState) Next() State {
    sNext := &tspState{points: make([]point, len(s.points))}
    copy(sNext.points, s.points)
    // Випадково обираємо дві вершини й міняємо їх місцями
    a := rand.Intn(len(s.points))
    b := rand.Intn(len(s.points))
    sNext.points[a], sNext.points[b] = sNext.points[b], sNext.points[a]
    return sNext
}

func euclidean(a, b point) float64 {
    return math.Hypot(float64(a.x-b.x), float64(a.y-b.y))
}

func (s *tspState) E() float64 {
    dist := 0.0
    n := len(s.points)
    for i := 0; i < n; i++ {
        dist += euclidean(s.points[i], s.points[(i+1)%n])
    }
    return dist
}

func main() {
    EBest, best := simAnneal(newTSPState())
    fmt.Printf("Lenght of shortest path found : %v\n", EBest)
    fmt.Println("Order of points in shortest path :")
    for _, x := range best.(*tspState).points {
        fmt.Println(x.x, x.y)
    }
}
```

</CodeTabs>

## Подальші модифікації алгоритму: \{#further-modifications-to-the-algorithm}

- Додайте до циклу while умову виходу за часом, щоб запобігти TLE
- Реалізований вище спад — це експоненційний спад. Ви завжди можете замінити його на функцію спаду відповідно до своїх потреб.
- Наведена вище функція ймовірності прийняття надає перевагу прийняттю станів з нижчою енергією через множник $E_{next} - E$ у чисельнику показника степеня. Ви можете просто прибрати цей множник, щоб зробити PAF незалежною від різниці енергій.
- Вплив різниці енергій $E_{next} - E$ на PAF можна збільшувати/зменшувати, збільшуючи/зменшуючи основу степеня, як показано нижче:
<CodeTabs>

```cpp
bool P(double E, double E_next, double T, mt19937 rng) {
    double e = 2; // задайте e будь-яким дійсним числом, більшим за 1
    double prob =  pow(e,-(E_next-E)/T);
    if (prob > 1)
        return true;
    else {
        bernoulli_distribution d(prob); 
        return d(rng);
    }
}
```

```python
import random


def P(E: float, E_next: float, T: float) -> bool:
    e = 2  # задайте e будь-яким дійсним числом, більшим за 1
    prob = e ** (-(E_next - E) / T)
    if prob > 1:
        return True
    return random.random() < prob
```

```typescript
function P(E: number, E_next: number, T: number): boolean {
  const e = 2; // задайте e будь-яким дійсним числом, більшим за 1
  const prob = e ** (-(E_next - E) / T);
  if (prob > 1) return true;
  return Math.random() < prob;
}
```

```go
import (
    "math"
    "math/rand"
)

func P(E, ENext, T float64) bool {
    e := 2.0 // задайте e будь-яким дійсним числом, більшим за 1
    prob := math.Pow(e, -(ENext-E)/T)
    if prob > 1 {
        return true
    }
    return rand.Float64() < prob
}
```

</CodeTabs>

## Задачі \{#problems}

- [USACO Jan 2017 - Subsequence Reversal](https://usaco.org/index.php?page=viewproblem2&cpid=698)
- [Deltix Summer 2021 - DIY Tree](https://codeforces.com/contest/1556/problem/H)
- [AtCoder Contest Scheduling](https://atcoder.jp/contests/intro-heuristics/tasks/intro_heuristics_a)

## Відеоматеріали \{#video}

<YouTubeEmbed id="eBmU1ONJ-os" title="The simulated annealing algorithm explained with an analogy to a toy — Badri Adhikari" />
