# Мангеттенська відстань
	
## Означення \{#definition}
Для точок $p$ і $q$ на площині ми можемо визначити відстань між ними як суму різниць їхніх координат $x$ та $y$:

$$
d(p,q) = |x_p - x_q| + |y_p - y_q|
$$

Визначена в такий спосіб, відстань відповідає так званій [мангеттенській (таксомоторній) геометрії](https://en.wikipedia.org/wiki/Taxicab_geometry), у якій точки вважаються перехрестями в добре спланованому місті на кшталт Мангеттена, де рухатися можна лише вулицями — горизонтально або вертикально, як показано на зображенні нижче:

<center> <img src="https://upload.wikimedia.org/wikipedia/commons/0/08/Manhattan_distance.svg" alt="Manhattan Distance" /> </center>

Це зображення показує кілька найкоротших шляхів від однієї чорної точки до іншої, і всі вони мають довжину $12$.

Із цією відстанню можна виконувати деякі цікаві трюки та алгоритми, і кілька з них ми покажемо тут.

:::tip[Коли підходить цей алгоритм?]
- Відстані у вашій задачі вимірюються як $|x_p - x_q| + |y_p - y_q|$ (рух лише вздовж осей), а не евклідово? *(якщо потрібна евклідова найближча пара → [Пошук найближчої пари точок](nearest_points.md))*
- Вам потрібен один із трюків саме для $L_1$-метрики: найвіддаленіша пара, перетворення в метрику Чебишова чи мангеттенське MST?
- Для MST: ваги ребер — це мангеттенські відстані між точками, і вам вистачить $O(n \log n)$ кандидатних ребер з наступним [алгоритмом Краскала](/graph/mst_kruskal_with_dsu)?
:::

## Найвіддаленіша пара точок у мангеттенській відстані \{#farthest-pair-of-points-in-manhattan-distance}

Маємо $n$ точок $P$ і хочемо знайти пару точок $p,q$, які <Term tip="серед усіх можливих пар точок шукаємо ту, у якій відстань між точками є найбільшою">найбільш віддалені одна від одної</Term>, тобто максимізувати $|x_p - x_q| + |y_p - y_q|$.

Поміркуймо спершу в одному вимірі, тож $y=0$. Головне спостереження полягає в тому, що ми можемо перебрати, чи дорівнює $|x_p - x_q|$ значенню $x_p - x_q$, чи $-x_p + x_q$, адже якщо ми «промахнемося зі знаком» абсолютної величини, то отримаємо лише менше значення, тому це не може вплинути на відповідь. Більш формально виконується:

$$
|x_p - x_q| = \max(x_p - x_q, -x_p + x_q)
$$

Тож, наприклад, ми можемо спробувати взяти таке $p$, що $x_p$ має знак плюс, і тоді $q$ повинно мати від'ємний знак. У такий спосіб ми хочемо знайти:

$$
\max\limits_{p, q \in P}(x_p + (-x_q)) = \max\limits_{p \in P}(x_p) + \max\limits_{q \in P}( - x_q ).
$$

Зауважимо, що цю ідею можна поширити далі на 2 (або більше!) вимірів. Для $d$ вимірів нам потрібно перебрати $2^d$ можливих значень знаків. Наприклад, якщо ми у $2$ вимірах і перебираємо варіант, коли $p$ має обидва знаки плюс, ми хочемо знайти:

$$
\max\limits_{p, q \in P} [(x_p + (-x_q)) + (y_p + (-y_q))] = \max\limits_{p \in P}(x_p + y_p) + \max\limits_{q \in P}(-x_q - y_q).
$$

Оскільки ми зробили $p$ і $q$ незалежними, тепер легко знайти $p$ і $q$, які максимізують цей вираз.

Код нижче узагальнює це на $d$ вимірів і працює за $O(n \cdot 2^d \cdot d)$.

<CodeTabs>

```cpp
long long ans = 0;
for (int msk = 0; msk < (1 << d); msk++) {
    long long mx = LLONG_MIN, mn = LLONG_MAX;
    for (int i = 0; i < n; i++) {
        long long cur = 0;
        for (int j = 0; j < d; j++) {
            if (msk & (1 << j)) cur += p[i][j];
            else cur -= p[i][j];
        }
        mx = max(mx, cur);
        mn = min(mn, cur);
    }
    ans = max(ans, mx - mn);
}
```

```python
ans = 0
for msk in range(1 << d):
    mx, mn = float("-inf"), float("inf")
    for i in range(n):
        cur = 0
        for j in range(d):
            # Перебираємо знак j-ї координати залежно від біту маски
            if msk & (1 << j):
                cur += p[i][j]
            else:
                cur -= p[i][j]
        mx = max(mx, cur)
        mn = min(mn, cur)
    ans = max(ans, mx - mn)
```

```typescript
let ans = 0;
for (let msk = 0; msk < 1 << d; msk++) {
  let mx = -Infinity, mn = Infinity;
  for (let i = 0; i < n; i++) {
    let cur = 0;
    for (let j = 0; j < d; j++) {
      // Перебираємо знак j-ї координати залежно від біту маски
      if (msk & (1 << j)) cur += p[i][j];
      else cur -= p[i][j];
    }
    mx = Math.max(mx, cur);
    mn = Math.min(mn, cur);
  }
  ans = Math.max(ans, mx - mn);
}
```

```go
ans := int64(0)
for msk := 0; msk < (1 << d); msk++ {
    mx, mn := int64(math.MinInt64), int64(math.MaxInt64)
    for i := 0; i < n; i++ {
        var cur int64
        for j := 0; j < d; j++ {
            // Перебираємо знак j-ї координати залежно від біту маски
            if msk&(1<<j) != 0 {
                cur += p[i][j]
            } else {
                cur -= p[i][j]
            }
        }
        if cur > mx {
            mx = cur
        }
        if cur < mn {
            mn = cur
        }
    }
    if mx-mn > ans {
        ans = mx - mn
    }
}
```

</CodeTabs>

## Поворот точок і відстань Чебишова \{#rotating-the-points-and-chebyshev-distance}

Добре відомо, що для всіх $m, n \in \mathbb{R}$,

$$
|m| + |n| = \text{max}(|m + n|, |m - n|).
$$

Щоб довести це, нам достатньо проаналізувати знаки $m$ і $n$. Це залишаємо як вправу.

Ми можемо застосувати цю рівність до формули мангеттенської відстані й з'ясувати, що

$$
d((x_1, y_1), (x_2, y_2)) = |x_1 - x_2| + |y_1 - y_2| = \text{max}(|(x_1 + y_1) - (x_2 + y_2)|, |(y_1 - x_1) - (y_2 - x_2)|).
$$

Останній вираз у попередній рівності — це [відстань Чебишова](https://en.wikipedia.org/wiki/Chebyshev_distance) точок $(x_1 + y_1, y_1 - x_1)$ і $(x_2 + y_2, y_2 - x_2)$. Це означає, що після застосування перетворення

$$
\alpha : (x, y) \to (x + y, y - x),
$$

мангеттенська відстань між точками $p$ і $q$ перетворюється на відстань Чебишова між $\alpha(p)$ і $\alpha(q)$.

Також ми можемо помітити, що $\alpha$ — це [спіральна подібність](https://en.wikipedia.org/wiki/Spiral_similarity) (поворот площини з наступним розтягуванням відносно центра $O$) з центром $(0, 0)$, кутом повороту $45^{\circ}$ за годинниковою стрілкою та розтягуванням у $\sqrt{2}$ разів.

Ось зображення, яке допоможе уявити це перетворення:

<center> <img src="/img/docs/geometry/chebyshev-transformation.png" alt="Chebyshev transformation" /> </center>

## Мангеттенське мінімальне кістякове дерево \{#manhattan-minimum-spanning-tree}

Задача про мангеттенське MST полягає в тому, щоб для заданих точок на площині знайти ребра, які з'єднують усі точки й мають мінімальну сумарну вагу. Вага ребра, що з'єднує дві точки, — це мангеттенська відстань між ними. Для простоти вважаємо, що всі точки розташовані в різних місцях.
Тут ми показуємо спосіб знайти MST за $O(n \log{n})$, відшукуючи для кожної точки її найближчого сусіда в кожному <Term tip="октант — це одна з восьми однакових кутових частин, на які прямі під кутом 45 градусів ділять площину навколо точки (як вісім скибочок піци)">октанті</Term>, як показано на зображенні нижче. Це дасть нам $O(n)$ кандидатних ребер, які, як ми покажемо нижче, гарантовано містять MST. Останній крок — застосувати якийсь стандартний алгоритм пошуку MST, наприклад, [алгоритм Краскала з використанням системи неперетинних множин](/graph/mst_kruskal_with_dsu).

<center> <img src="/img/docs/geometry/manhattan-mst-octants.png" alt="8 octants picture" /> *8 октантів відносно точки S* </center>

Наведений тут алгоритм уперше було представлено в статті [H. Zhou, N. Shenoy, and W. Nichollos (2002)](https://ieeexplore.ieee.org/document/913303). Існує також інший відомий алгоритм, який використовує підхід «розділяй і володарюй» від [J. Stolfi](https://www.academia.edu/15667173/On_computing_all_north_east_nearest_neighbors_in_the_L1_metric), і він теж дуже цікавий та відрізняється лише способом пошуку найближчого сусіда в кожному октанті. Обидва мають однакову складність, але наведений тут простіше реалізувати, і він має менший константний множник.

Спершу зрозуміймо, чому достатньо розглядати лише найближчого сусіда в кожному октанті. Ідея полягає в тому, щоб показати, що для точки $s$ і будь-яких двох інших точок $p$ і $q$ в тому самому октанті виконується $d(p, q) < \max(d(s, p), d(s, q))$. Це важливо, бо показує, що якби існувало MST, у якому $s$ з'єднана й з $p$, і з $q$, ми могли б видалити одне з цих ребер і додати ребро $(p,q)$, що зменшило б сумарну вартість. Щоб довести це, без втрати загальності припустимо, що $p$ і $q$ лежать в октанті $R_1$, який визначається умовами: $x_s \leq x$ і $x_s - y_s > x -  y$, а далі розглянемо кілька випадків. Зображення нижче дає певну інтуїцію щодо того, чому це правда.

<center> <img src="/img/docs/geometry/manhattan-mst-uniqueness.png" alt="unique nearest neighbor" /> *Інтуїтивно, обмеженість октанта робить неможливим, щоб $p$ і $q$ були обидва ближчі до $s$, ніж одна до одної* </center>


Отже, головне питання — як знайти найближчого сусіда в кожному октанті для кожної з $n$ точок.

## Найближчий сусід у кожному октанті за O(n log n) \{#nearest-neighbor-in-each-octant-in-on-log-n}

Для простоти зосередимося на октанті NNE ($R_1$ на зображенні вище). Усі інші напрямки можна знайти тим самим алгоритмом, повертаючи вхідні дані.

Ми застосуємо підхід із <Term tip="уявна пряма, яка повільно «замітає» площину в одному напрямку; точки та події обробляють у тому порядку, у якому ця пряма їх проходить">замітальною прямою</Term>. Ми обробляємо точки з південного заходу на північний схід, тобто за неспадним $x + y$. Ми також тримаємо множину точок, які ще не мають свого найближчого сусіда, і називаємо її «активною множиною». Нижче ми додаємо зображення, які допоможуть уявити алгоритм.

<center> <img src="/img/docs/geometry/manhattan-mst-sweep-line-1.png" alt="manhattan-mst-sweep" /> *Чорним зі стрілкою показано напрямок замітальної прямої. Усі точки нижче цієї лінії — в активній множині, а точки вище ще не оброблено. Зеленим позначено точки, які лежать в октанті обробленої точки. Червоним — точки, які не лежать у шуканому октанті.* </center>

<center> <img src="/img/docs/geometry/manhattan-mst-sweep-line-2.png" alt="manhattan-mst-sweep" /> *На цьому зображенні ми бачимо активну множину після обробки точки $p$. Зауважте, що $2$ зелені точки з попереднього зображення мали $p$ у своєму північно-північно-східному октанті й більше не належать до активної множини, бо вже знайшли свого найближчого сусіда.* </center>

Коли ми додаємо нову точку $p$, для кожної точки $s$, яка має її у своєму октанті, ми можемо безпечно призначити $p$ найближчим сусідом. Це правда, бо їхня відстань дорівнює $d(p,s) = |x_p - x_s| + |y_p - y_s| = (x_p + y_p) - (x_s + y_s)$, оскільки $p$ лежить у північно-північно-східному октанті. Оскільки всі наступні точки не матимуть меншого значення $x + y$ через крок сортування, $p$ гарантовано має найменшу відстань. Тоді ми можемо вилучити всі такі точки з активної множини, і нарешті додати $p$ до активної множини.

Наступне питання — як ефективно знайти, які точки $s$ мають $p$ у своєму північно-північно-східному октанті. Тобто які точки $s$ задовольняють:

- $x_s \leq x_p$
- $x_p - y_p < x_s - y_s$

Оскільки жодна точка в активній множині не лежить в області $R_1$ іншої, ми також маємо, що для двох точок $q_1$ і $q_2$ в активній множині $x_{q_1} \neq x_{q_2}$, і їхнє впорядкування означає $x_{q_1} < x_{q_2} \implies x_{q_1} - y_{q_1} \leq x_{q_2} - y_{q_2}$.

Ви можете спробувати уявити це на зображеннях вище, думаючи про впорядкування за $x - y$ як про «замітальну пряму», яка йде з північного заходу на південний схід, тобто перпендикулярно до намальованої.

Це означає, що якщо ми тримаємо активну множину впорядкованою за $x$, кандидати $s$ розташовані поспіль. Тоді ми можемо знайти найбільший $x_s \leq x_p$ і обробляти точки в порядку спадання $x$, доки не порушиться друга умова $x_p - y_p < x_s - y_s$ (насправді ми можемо дозволити, щоб $x_p - y_p = x_s - y_s$, і це опрацьовує випадок точок з однаковими координатами). Зауважте, що оскільки ми вилучаємо з множини одразу після обробки, це даватиме <Term tip="усереднена складність за весь алгоритм: окремий крок може бути повільним, але загальна кількість операцій усе одно вкладається в цю оцінку">амортизовану складність</Term> $O(n \log(n))$.
	Тепер, коли ми маємо найближчу точку в північно-східному напрямку, ми повертаємо точки й повторюємо. Можна показати, що насправді в такий спосіб ми також знаходимо найближчу точку в південно-західному напрямку, тож можна повторювати лише 4 рази замість 8.

Підсумовуючи, ми:

- Сортуємо точки за $x + y$ у неспадному порядку;
- Для кожної точки ми проходимо активну множину, починаючи з точки з найбільшим $x$ таким, що $x \leq x_p$, і перериваємо цикл, якщо $x_p - y_p \geq x_s - y_s$. Для кожної допустимої точки $s$ ми додаємо ребро $(s,p, d(s,p))$ до нашого списку;
- Додаємо точку $p$ до активної множини;
- Повертаємо точки й повторюємо, доки не пройдемо всі октанти.
- Застосовуємо алгоритм Краскала до списку ребер, щоб отримати MST.

Нижче ви можете знайти реалізацію, засновану на тій, що з [KACTL](https://github.com/kth-competitive-programming/kactl/blob/main/content/geometry/ManhattanMST.h).

<CodeTabs>

```cpp
struct point {
    long long x, y;
};

// Повертає список ребер у форматі (вага, u, v).
// Передача цього списку до алгоритму Краскала дасть мангеттенське MST.
vector<tuple<long long, int, int>> manhattan_mst_edges(vector<point> ps) {
    vector<int> ids(ps.size());
    iota(ids.begin(), ids.end(), 0);
    vector<tuple<long long, int, int>> edges;
    for (int rot = 0; rot < 4; rot++) { // для кожного повороту
        sort(ids.begin(), ids.end(), [&](int i, int j){
            return (ps[i].x + ps[i].y) < (ps[j].x + ps[j].y);
        });
        map<int, int, greater<int>> active; // (xs, id)
        for (auto i : ids) {
            for (auto it = active.lower_bound(ps[i].x); it != active.end();
            active.erase(it++)) {
                int j = it->second;
                if (ps[i].x - ps[i].y > ps[j].x - ps[j].y) break;
                assert(ps[i].x >= ps[j].x && ps[i].y >= ps[j].y);
                edges.push_back({(ps[i].x - ps[j].x) + (ps[i].y - ps[j].y), i, j});
            }
            active[ps[i].x] = i;
        }
        for (auto &p : ps) { // поворот
            if (rot & 1) p.x *= -1;
            else swap(p.x, p.y);
        }
    }
    return edges;
}
```

```python
import bisect


# Повертає список ребер у форматі (вага, u, v).
# Передача цього списку до алгоритму Краскала дасть мангеттенське MST.
def manhattan_mst_edges(ps: list[tuple[int, int]]) -> list[tuple[int, int, int]]:
    ps = [list(p) for p in ps]  # робимо копію, щоб обертати локально
    n = len(ps)
    ids = list(range(n))
    edges: list[tuple[int, int, int]] = []
    for rot in range(4):  # для кожного повороту
        ids.sort(key=lambda i: ps[i][0] + ps[i][1])
        # Активна множина, впорядкована за спаданням x: тримаємо ключі x та id
        xs: list[int] = []  # x у зростаючому порядку для bisect
        ids_by_x: list[int] = []
        for i in ids:
            xi, yi = ps[i]
            # Кандидати — точки з x <= xi, перебираємо їх від найбільшого x
            pos = bisect.bisect_right(xs, xi)
            k = pos - 1
            while k >= 0:
                j = ids_by_x[k]
                if xi - yi > ps[j][0] - ps[j][1]:
                    break
                assert xi >= ps[j][0] and yi >= ps[j][1]
                edges.append(((xi - ps[j][0]) + (yi - ps[j][1]), i, j))
                # Вилучаємо точку з активної множини
                xs.pop(k)
                ids_by_x.pop(k)
                k -= 1
            # Додаємо поточну точку до активної множини
            pos = bisect.bisect_left(xs, xi)
            xs.insert(pos, xi)
            ids_by_x.insert(pos, i)
        for p in ps:  # поворот
            if rot & 1:
                p[0] *= -1
            else:
                p[0], p[1] = p[1], p[0]
    return edges
```

```typescript
// Повертає список ребер у форматі [вага, u, v].
// Передача цього списку до алгоритму Краскала дасть мангеттенське MST.
function manhattanMstEdges(input: [number, number][]): [number, number, number][] {
  const ps = input.map((p) => [p[0], p[1]]); // копія, щоб обертати локально
  const n = ps.length;
  const ids = Array.from({ length: n }, (_, i) => i);
  const edges: [number, number, number][] = [];
  for (let rot = 0; rot < 4; rot++) { // для кожного повороту
    ids.sort((a, b) => ps[a][0] + ps[a][1] - (ps[b][0] + ps[b][1]));
    // Активна множина, впорядкована за зростанням x
    const xs: number[] = [];
    const idsByX: number[] = [];
    // Знаходимо першу позицію з xs[pos] > value (bisect_right)
    const upperBound = (value: number): number => {
      let lo = 0, hi = xs.length;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (xs[mid] <= value) lo = mid + 1;
        else hi = mid;
      }
      return lo;
    };
    for (const i of ids) {
      const xi = ps[i][0], yi = ps[i][1];
      // Кандидати — точки з x <= xi, перебираємо їх від найбільшого x
      let k = upperBound(xi) - 1;
      while (k >= 0) {
        const j = idsByX[k];
        if (xi - yi > ps[j][0] - ps[j][1]) break;
        edges.push([(xi - ps[j][0]) + (yi - ps[j][1]), i, j]);
        // Вилучаємо точку з активної множини
        xs.splice(k, 1);
        idsByX.splice(k, 1);
        k--;
      }
      // Додаємо поточну точку до активної множини
      const pos = upperBound(xi);
      xs.splice(pos, 0, xi);
      idsByX.splice(pos, 0, i);
    }
    for (const p of ps) { // поворот
      if (rot & 1) p[0] *= -1;
      else [p[0], p[1]] = [p[1], p[0]];
    }
  }
  return edges;
}
```

```go
import "sort"

// Edge — ребро у форматі (вага, u, v).
type Edge struct {
    W, U, V int64
}

// manhattanMSTEdges повертає список ребер.
// Передача цього списку до алгоритму Краскала дасть мангеттенське MST.
func manhattanMSTEdges(input [][2]int64) []Edge {
    ps := make([][2]int64, len(input))
    copy(ps, input) // копія, щоб обертати локально
    n := len(ps)
    ids := make([]int, n)
    for i := range ids {
        ids[i] = i
    }
    var edges []Edge
    for rot := 0; rot < 4; rot++ { // для кожного повороту
        sort.Slice(ids, func(a, b int) bool {
            return ps[ids[a]][0]+ps[ids[a]][1] < ps[ids[b]][0]+ps[ids[b]][1]
        })
        // Активна множина, впорядкована за зростанням x
        var xs []int64
        var idsByX []int
        for _, i := range ids {
            xi, yi := ps[i][0], ps[i][1]
            // Кандидати — точки з x <= xi, перебираємо їх від найбільшого x
            k := sort.Search(len(xs), func(t int) bool { return xs[t] > xi }) - 1
            for k >= 0 {
                j := idsByX[k]
                if xi-yi > ps[j][0]-ps[j][1] {
                    break
                }
                edges = append(edges, Edge{(xi - ps[j][0]) + (yi - ps[j][1]), int64(i), int64(j)})
                // Вилучаємо точку з активної множини
                xs = append(xs[:k], xs[k+1:]...)
                idsByX = append(idsByX[:k], idsByX[k+1:]...)
                k--
            }
            // Додаємо поточну точку до активної множини
            pos := sort.Search(len(xs), func(t int) bool { return xs[t] > xi })
            xs = append(xs, 0)
            copy(xs[pos+1:], xs[pos:])
            xs[pos] = xi
            idsByX = append(idsByX, 0)
            copy(idsByX[pos+1:], idsByX[pos:])
            idsByX[pos] = i
        }
        for idx := range ps { // поворот
            if rot&1 != 0 {
                ps[idx][0] *= -1
            } else {
                ps[idx][0], ps[idx][1] = ps[idx][1], ps[idx][0]
            }
        }
    }
    return edges
}
```

</CodeTabs>

## Задачі \{#problems}
 * [AtCoder Beginner Contest 178E - Dist Max](https://atcoder.jp/contests/abc178/tasks/abc178_e)
 * [CodeForces 1093G - Multidimensional Queries](https://codeforces.com/contest/1093/problem/G)
 * [CodeForces 944F - Game with Tokens](https://codeforces.com/contest/944/problem/F)
 * [AtCoder Code Festival 2017D - Four Coloring](https://atcoder.jp/contests/code-festival-2017-quala/tasks/code_festival_2017_quala_d)
 * [The 2023 ICPC Asia EC Regionals Online Contest (I) - J. Minimum Manhattan Distance](https://codeforces.com/gym/104639/problem/J)
 * [Petrozavodsk Winter Training Camp 2016 Contest 4 - B. Airports](https://codeforces.com/group/eqgxxTNwgd/contest/100959/attachments)
