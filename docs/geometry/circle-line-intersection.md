# Перетин кола і прямої

Задано координати центра кола та його радіус, а також рівняння прямої. Потрібно знайти точки їх перетину.

## Розв'язок \{#solution}

Замість того щоб розв'язувати систему з двох рівнянь, ми підійдемо до задачі геометрично. У такий спосіб ми отримаємо точніший розв'язок з погляду чисельної стійкості.

Без втрати загальності вважаємо, що коло має центр у початку координат. Якщо це не так, ми переносимо його туди й коригуємо сталу $C$ у рівнянні прямої. Отже, маємо коло з центром у точці $(0,0)$ радіуса $r$ і пряму з рівнянням $Ax+By+C=0$.

Почнемо з того, що знайдемо точку на прямій, найближчу до початку координат, $(x_0, y_0)$. По-перше, вона має лежати на відстані

$$
d_0 = \frac{|C|}{\sqrt{A^2+B^2}}
$$

По-друге, оскільки вектор $(A, B)$ перпендикулярний до прямої, координати точки мають бути пропорційними координатам цього вектора. Оскільки ми знаємо відстань точки до початку координат, нам достатньо відмасштабувати вектор $(A, B)$ до цієї довжини, і ми отримаємо:

$$
\begin{align}
x_0 &= - \frac{AC}{A^2 + B^2} \\
y_0 &= - \frac{BC}{A^2 + B^2} 
\end{align}
$$

Знаки мінус не очевидні, але їх легко перевірити, підставивши $x_0$ та $y_0$ у рівняння прямої.

На цьому етапі ми можемо визначити кількість точок перетину і навіть знайти розв'язок, коли таких точок одна чи жодної. Справді, якщо відстань від $(x_0, y_0)$ до початку координат $d_0$ більша за радіус $r$, відповідь — **нуль точок**. Якщо $d_0=r$, відповідь — **одна точка** $(x_0, y_0)$. Якщо ж $d_0<r$, то точок перетину дві, і тепер нам треба знайти їхні координати.

Отже, ми знаємо, що точка $(x_0, y_0)$ лежить усередині кола. Дві точки перетину, $(a_x, a_y)$ та $(b_x, b_y)$, мають належати прямій $Ax+By+C=0$ і лежати на однаковій відстані $d$ від $(x_0, y_0)$, а цю відстань легко знайти:

$$
d = \sqrt{r^2 - \frac{C^2}{A^2 + B^2}}
$$

Зауважимо, що вектор $(-B, A)$ колінеарний прямій, а отже, ми можемо знайти шукані точки, додаючи й віднімаючи до точки $(x_0, y_0)$ вектор $(-B,A)$, відмасштабований до довжини $d$.

Нарешті, рівняння двох точок перетину такі:

$$
\begin{align}
m &= \sqrt{\frac{d^2}{A^2 + B^2}} \\
a_x &= x_0 + B \cdot m, a_y = y_0 - A \cdot m \\
b_x &= x_0 - B \cdot m, b_y = y_0 + A \cdot m
\end{align}
$$

Якби ми розв'язували початкову систему рівнянь алгебраїчними методами, то найімовірніше отримали б відповідь в іншому вигляді й з більшою похибкою. Описаний тут геометричний метод наочніший і точніший.

## Реалізація \{#implementation}

Як зазначено на початку, ми вважаємо, що коло має центр у початку координат, а тому на вхід програмі подаються радіус $r$ кола та параметри $A$, $B$ і $C$ рівняння прямої.

<CodeTabs>

```cpp
double r, a, b, c; // подаються на вхід
double x0 = -a*c/(a*a+b*b), y0 = -b*c/(a*a+b*b);
if (c*c > r*r*(a*a+b*b)+EPS)
    puts ("no points");
else if (abs (c*c - r*r*(a*a+b*b)) < EPS) {
    puts ("1 point");
    cout << x0 << ' ' << y0 << '\n';
}
else {
    double d = r*r - c*c/(a*a+b*b);
    double mult = sqrt (d / (a*a+b*b));
    double ax, ay, bx, by;
    ax = x0 + b * mult;
    bx = x0 - b * mult;
    ay = y0 - a * mult;
    by = y0 + a * mult;
    puts ("2 points");
    cout << ax << ' ' << ay << '\n' << bx << ' ' << by << '\n';
}
```

```python
r, a, b, c = ...  # подаються на вхід
x0, y0 = -a * c / (a * a + b * b), -b * c / (a * a + b * b)
if c * c > r * r * (a * a + b * b) + EPS:
    print("no points")
elif abs(c * c - r * r * (a * a + b * b)) < EPS:
    print("1 point")
    print(x0, y0)
else:
    d = r * r - c * c / (a * a + b * b)
    mult = math.sqrt(d / (a * a + b * b))
    ax = x0 + b * mult
    bx = x0 - b * mult
    ay = y0 - a * mult
    by = y0 + a * mult
    print("2 points")
    print(ax, ay)
    print(bx, by)
```

```typescript
let r: number, a: number, b: number, c: number; // подаються на вхід
const x0 = (-a * c) / (a * a + b * b);
const y0 = (-b * c) / (a * a + b * b);
if (c * c > r * r * (a * a + b * b) + EPS) {
    console.log("no points");
} else if (Math.abs(c * c - r * r * (a * a + b * b)) < EPS) {
    console.log("1 point");
    console.log(x0, y0);
} else {
    const d = r * r - (c * c) / (a * a + b * b);
    const mult = Math.sqrt(d / (a * a + b * b));
    const ax = x0 + b * mult;
    const bx = x0 - b * mult;
    const ay = y0 - a * mult;
    const by = y0 + a * mult;
    console.log("2 points");
    console.log(ax, ay);
    console.log(bx, by);
}
```

```go
var r, a, b, c float64 // подаються на вхід
x0, y0 := -a*c/(a*a+b*b), -b*c/(a*a+b*b)
if c*c > r*r*(a*a+b*b)+EPS {
    fmt.Println("no points")
} else if math.Abs(c*c-r*r*(a*a+b*b)) < EPS {
    fmt.Println("1 point")
    fmt.Println(x0, y0)
} else {
    d := r*r - c*c/(a*a+b*b)
    mult := math.Sqrt(d / (a*a + b*b))
    ax := x0 + b*mult
    bx := x0 - b*mult
    ay := y0 - a*mult
    by := y0 + a*mult
    fmt.Println("2 points")
    fmt.Println(ax, ay)
    fmt.Println(bx, by)
}
```

</CodeTabs>

## Задачі для практики \{#practice-problems}

- [CODECHEF: ANDOOR](https://www.codechef.com/problems/ANDOOR)

## Відеоматеріали \{#video}

- [Intersection Between Line and Circle | 2D Segment Collision Algorithm — Ghost Telepathy](https://www.youtube.com/watch?v=_3dRFu3k8Nw) (30 хв, англійською)
