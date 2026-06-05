# Сума Мінковського опуклих многокутників

## Означення \{#definition}
Розглянемо дві множини точок $A$ і $B$ на площині. Сума Мінковського $A + B$ означається як $\{a + b| a \in A, b \in B\}$.
Тут ми розглядатимемо випадок, коли $A$ і $B$ складаються з опуклих многокутників $P$ і $Q$ разом з їхніми внутрішніми областями.
Упродовж цієї статті ми ототожнюватимемо многокутники з упорядкованими послідовностями їхніх вершин, щоб позначення на кшталт $|P|$ чи
$P_i$ мали сенс.
Виявляється, що сума опуклих многокутників $P$ і $Q$ є опуклим многокутником, який має щонайбільше $|P| + |Q|$ вершин.

## Алгоритм \{#algorithm}

Тут ми вважаємо, що вершини многокутників пронумеровані циклічно, тобто $P_{|P|} = P_0,\ Q_{|Q|} = Q_0$ і так далі.

Оскільки розмір суми лінійно залежить від розмірів початкових многокутників, ми маємо прагнути знайти алгоритм лінійного часу.
Припустимо, що обидва многокутники впорядковані проти годинникової стрілки. Розглянемо послідовності ребер $\{\overrightarrow{P_iP_{i+1}}\}$
і $\{\overrightarrow{Q_jQ_{j+1}}\}$, упорядковані за полярним кутом. Ми стверджуємо, що послідовність ребер $P + Q$ можна отримати, злиявши
ці дві послідовності зі збереженням порядку за полярним кутом і замінивши послідовні співнапрямлені вектори на їхню суму. Прямолінійне застосування цієї ідеї дає
алгоритм лінійного часу, проте відновлення вершин $P + Q$ з послідовності сторін потребує багаторазового додавання векторів,
що може спричинити небажані проблеми з точністю, якщо ми працюємо з координатами у форматі з рухомою комою, тому ми опишемо невелику
модифікацію цієї ідеї.


Спершу ми маємо переупорядкувати вершини так, щоб перша вершина
кожного многокутника мала найменшу y-координату (якщо таких вершин декілька, оберемо ту, що має найменшу x-координату). Після цього сторони обох многокутників
стануть відсортованими за полярним кутом, тож сортувати їх вручну не потрібно.
Тепер ми створюємо два вказівники $i$ (вказує на вершину $P$) і $j$ (вказує на вершину $Q$), обидва спочатку дорівнюють 0.
Ми повторюємо наступні кроки, доки $i < |P|$ або $j < |Q|$.

1. Додаємо $P_i + Q_j$ до $P + Q$.

2. Порівнюємо полярні кути $\overrightarrow{P_iP_{i + 1}}$ і $\overrightarrow{Q_jQ_{j+1}}$.

3. Збільшуємо вказівник, який відповідає меншому куту (якщо кути рівні, збільшуємо обидва).

## Візуалізація \{#visualization}

Ось гарна візуалізація, яка може допомогти вам зрозуміти, що відбувається.

<center> <img src="/img/docs/geometry/minkowski.gif" alt="Visual" /> </center>

## Відстань між двома многокутниками \{#distance-between-two-polygons}
Одне з найпоширеніших застосувань суми Мінковського — обчислення відстані між двома опуклими многокутниками (або просто перевірка того, чи вони перетинаються).
Відстань між двома опуклими многокутниками $P$ і $Q$ означається як $\min\limits_{a \in P, b \in Q} ||a - b||$. Можна зауважити, що
відстань завжди досягається між двома вершинами або вершиною та ребром, тож ми можемо легко знайти відстань за $O(|P||Q|)$. Проте
завдяки кмітливому використанню суми Мінковського ми можемо зменшити складність до $O(|P| + |Q|)$.

Якщо ми відобразимо $Q$ відносно точки $(0, 0)$, отримавши многокутник $-Q$, задача зводиться до знаходження найменшої відстані між точкою з
$P + (-Q)$ і $(0, 0)$. Ми можемо знайти цю відстань за лінійний час за допомогою наступної ідеї.
Якщо $(0, 0)$ лежить усередині многокутника або на його межі, відстань дорівнює $0$, інакше відстань досягається між $(0, 0)$ і деякою вершиною або ребром многокутника.
Оскільки суму Мінковського можна обчислити
за лінійний час, ми отримуємо алгоритм лінійного часу для знаходження відстані між двома опуклими многокутниками.

## Реалізація \{#implementation}
Нижче наведено реалізацію суми Мінковського для многокутників з цілочисловими точками. Зауважте, що в цьому випадку всі обчислення можна виконувати в цілих числах, оскільки
замість обчислення полярних кутів і безпосереднього їх порівняння ми можемо дивитися на знак векторного добутку двох векторів.

<CodeTabs>

```cpp
struct pt{
    long long x, y;
    pt operator + (const pt & p) const {
        return pt{x + p.x, y + p.y};
    }
    pt operator - (const pt & p) const {
        return pt{x - p.x, y - p.y};
    }
    long long cross(const pt & p) const {
        return x * p.y - y * p.x;
    }
};

void reorder_polygon(vector<pt> & P){
    size_t pos = 0;
    for(size_t i = 1; i < P.size(); i++){
        if(P[i].y < P[pos].y || (P[i].y == P[pos].y && P[i].x < P[pos].x))
            pos = i;
    }
    rotate(P.begin(), P.begin() + pos, P.end());
}

vector<pt> minkowski(vector<pt> P, vector<pt> Q){
    // перша вершина має бути найнижчою
    reorder_polygon(P);
    reorder_polygon(Q);
    // ми маємо забезпечити циклічну індексацію
    P.push_back(P[0]);
    P.push_back(P[1]);
    Q.push_back(Q[0]);
    Q.push_back(Q[1]);
    // основна частина
    vector<pt> result;
    size_t i = 0, j = 0;
    while(i < P.size() - 2 || j < Q.size() - 2){
        result.push_back(P[i] + Q[j]);
        auto cross = (P[i + 1] - P[i]).cross(Q[j + 1] - Q[j]);
        if(cross >= 0 && i < P.size() - 2)
            ++i;
        if(cross <= 0 && j < Q.size() - 2)
            ++j;
    }
    return result;
}

```

```python
class Pt:
    __slots__ = ("x", "y")

    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __add__(self, p):
        return Pt(self.x + p.x, self.y + p.y)

    def __sub__(self, p):
        return Pt(self.x - p.x, self.y - p.y)

    def cross(self, p):
        return self.x * p.y - self.y * p.x


def reorder_polygon(P):
    pos = 0
    for i in range(1, len(P)):
        if P[i].y < P[pos].y or (P[i].y == P[pos].y and P[i].x < P[pos].x):
            pos = i
    # обертаємо так, щоб найнижча вершина стала першою
    P[:] = P[pos:] + P[:pos]


def minkowski(P, Q):
    # працюємо з копіями, щоб не псувати вхідні дані
    P = list(P)
    Q = list(Q)
    # перша вершина має бути найнижчою
    reorder_polygon(P)
    reorder_polygon(Q)
    # ми маємо забезпечити циклічну індексацію
    P.append(P[0])
    P.append(P[1])
    Q.append(Q[0])
    Q.append(Q[1])
    # основна частина
    result = []
    i = j = 0
    while i < len(P) - 2 or j < len(Q) - 2:
        result.append(P[i] + Q[j])
        cross = (P[i + 1] - P[i]).cross(Q[j + 1] - Q[j])
        if cross >= 0 and i < len(P) - 2:
            i += 1
        if cross <= 0 and j < len(Q) - 2:
            j += 1
    return result
```

```typescript
class Pt {
    constructor(public x: bigint, public y: bigint) {}

    add(p: Pt): Pt {
        return new Pt(this.x + p.x, this.y + p.y);
    }

    sub(p: Pt): Pt {
        return new Pt(this.x - p.x, this.y - p.y);
    }

    cross(p: Pt): bigint {
        return this.x * p.y - this.y * p.x;
    }
}

function reorderPolygon(P: Pt[]): void {
    let pos = 0;
    for (let i = 1; i < P.length; i++) {
        if (P[i].y < P[pos].y || (P[i].y === P[pos].y && P[i].x < P[pos].x)) {
            pos = i;
        }
    }
    // обертаємо так, щоб найнижча вершина стала першою
    P.unshift(...P.splice(pos, P.length - pos));
}

function minkowski(Pin: Pt[], Qin: Pt[]): Pt[] {
    // працюємо з копіями, щоб не псувати вхідні дані
    const P = [...Pin];
    const Q = [...Qin];
    // перша вершина має бути найнижчою
    reorderPolygon(P);
    reorderPolygon(Q);
    // ми маємо забезпечити циклічну індексацію
    P.push(P[0]);
    P.push(P[1]);
    Q.push(Q[0]);
    Q.push(Q[1]);
    // основна частина
    const result: Pt[] = [];
    let i = 0, j = 0;
    while (i < P.length - 2 || j < Q.length - 2) {
        result.push(P[i].add(Q[j]));
        const cross = P[i + 1].sub(P[i]).cross(Q[j + 1].sub(Q[j]));
        if (cross >= 0n && i < P.length - 2) {
            ++i;
        }
        if (cross <= 0n && j < Q.length - 2) {
            ++j;
        }
    }
    return result;
}
```

```go
type Pt struct {
    x, y int64
}

func (a Pt) Add(b Pt) Pt {
    return Pt{a.x + b.x, a.y + b.y}
}

func (a Pt) Sub(b Pt) Pt {
    return Pt{a.x - b.x, a.y - b.y}
}

func (a Pt) Cross(b Pt) int64 {
    return a.x*b.y - a.y*b.x
}

func reorderPolygon(P []Pt) {
    pos := 0
    for i := 1; i < len(P); i++ {
        if P[i].y < P[pos].y || (P[i].y == P[pos].y && P[i].x < P[pos].x) {
            pos = i
        }
    }
    // обертаємо так, щоб найнижча вершина стала першою
    rotated := append(append([]Pt{}, P[pos:]...), P[:pos]...)
    copy(P, rotated)
}

func minkowski(Pin, Qin []Pt) []Pt {
    // працюємо з копіями, щоб не псувати вхідні дані
    P := append([]Pt{}, Pin...)
    Q := append([]Pt{}, Qin...)
    // перша вершина має бути найнижчою
    reorderPolygon(P)
    reorderPolygon(Q)
    // ми маємо забезпечити циклічну індексацію
    P = append(P, P[0])
    P = append(P, P[1])
    Q = append(Q, Q[0])
    Q = append(Q, Q[1])
    // основна частина
    result := []Pt{}
    i, j := 0, 0
    for i < len(P)-2 || j < len(Q)-2 {
        result = append(result, P[i].Add(Q[j]))
        cross := P[i+1].Sub(P[i]).Cross(Q[j+1].Sub(Q[j]))
        if cross >= 0 && i < len(P)-2 {
            i++
        }
        if cross <= 0 && j < len(Q)-2 {
            j++
        }
    }
    return result
}
```

</CodeTabs>

## Задачі \{#problems}
 * [Codeforces 87E Mogohu-Rea Idol](https://codeforces.com/problemset/problem/87/E)
 * [Codeforces 1195F Geometers Anonymous Club](https://codeforces.com/contest/1195/problem/F)
 * [TIMUS 1894 Non-Flying Weather](https://acm.timus.ru/problem.aspx?space=1&num=1894)
