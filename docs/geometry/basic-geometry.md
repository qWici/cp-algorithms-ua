# Базова геометрія

У цій статті ми розглянемо базові операції над точками в евклідовому просторі, які лежать в основі всієї аналітичної геометрії.
Для кожної точки $\mathbf r$ ми розглядатимемо вектор $\vec{\mathbf r}$, спрямований із $\mathbf 0$ у $\mathbf r$.
Надалі ми не розрізнятимемо $\mathbf r$ і $\vec{\mathbf r}$ та вживатимемо термін **точка** як синонім до **вектора**.

## Лінійні операції \{#linear-operations}

Як двовимірні, так і тривимірні точки утворюють лінійний простір, а це означає, що для них визначені сума точок та множення точки на деяке число. Ось ці базові реалізації для 2D:

<CodeTabs>

```cpp
struct point2d {
    ftype x, y;
    point2d() {}
    point2d(ftype x, ftype y): x(x), y(y) {}
    point2d& operator+=(const point2d &t) {
        x += t.x;
        y += t.y;
        return *this;
    }
    point2d& operator-=(const point2d &t) {
        x -= t.x;
        y -= t.y;
        return *this;
    }
    point2d& operator*=(ftype t) {
        x *= t;
        y *= t;
        return *this;
    }
    point2d& operator/=(ftype t) {
        x /= t;
        y /= t;
        return *this;
    }
    point2d operator+(const point2d &t) const {
        return point2d(*this) += t;
    }
    point2d operator-(const point2d &t) const {
        return point2d(*this) -= t;
    }
    point2d operator*(ftype t) const {
        return point2d(*this) *= t;
    }
    point2d operator/(ftype t) const {
        return point2d(*this) /= t;
    }
};
point2d operator*(ftype a, point2d b) {
    return b * a;
}
```

```python
from dataclasses import dataclass


# ftype — це тип координат (float або int).
# У Python зручно перевантажувати оператори, що є прямим
# відповідником C++-перевантаженням +, -, *, /.
@dataclass
class Point2d:
    x: float
    y: float

    def __add__(self, t: "Point2d") -> "Point2d":
        return Point2d(self.x + t.x, self.y + t.y)

    def __sub__(self, t: "Point2d") -> "Point2d":
        return Point2d(self.x - t.x, self.y - t.y)

    def __mul__(self, t: float) -> "Point2d":
        return Point2d(self.x * t, self.y * t)

    # дозволяє писати a * point — симетрично до C++ operator*(ftype, point2d)
    def __rmul__(self, t: float) -> "Point2d":
        return self * t

    def __truediv__(self, t: float) -> "Point2d":
        return Point2d(self.x / t, self.y / t)
```

```typescript
// У TypeScript немає перевантаження операторів, тому
// лінійні операції реалізуємо явними методами add/sub/mul/div.
class Point2d {
  constructor(public x: number, public y: number) {}

  add(t: Point2d): Point2d {
    return new Point2d(this.x + t.x, this.y + t.y);
  }
  sub(t: Point2d): Point2d {
    return new Point2d(this.x - t.x, this.y - t.y);
  }
  mul(t: number): Point2d {
    return new Point2d(this.x * t, this.y * t);
  }
  div(t: number): Point2d {
    return new Point2d(this.x / t, this.y / t);
  }
}
```

```go
// У Go теж немає перевантаження операторів — лінійні операції
// реалізуємо методами на struct, що повертають нову точку.
type Point2d struct {
	X, Y float64
}

func (a Point2d) Add(t Point2d) Point2d {
	return Point2d{a.X + t.X, a.Y + t.Y}
}
func (a Point2d) Sub(t Point2d) Point2d {
	return Point2d{a.X - t.X, a.Y - t.Y}
}
func (a Point2d) Mul(t float64) Point2d {
	return Point2d{a.X * t, a.Y * t}
}
func (a Point2d) Div(t float64) Point2d {
	return Point2d{a.X / t, a.Y / t}
}
```

</CodeTabs>

А також для 3D точок:

<CodeTabs>

```cpp
struct point3d {
    ftype x, y, z;
    point3d() {}
    point3d(ftype x, ftype y, ftype z): x(x), y(y), z(z) {}
    point3d& operator+=(const point3d &t) {
        x += t.x;
        y += t.y;
        z += t.z;
        return *this;
    }
    point3d& operator-=(const point3d &t) {
        x -= t.x;
        y -= t.y;
        z -= t.z;
        return *this;
    }
    point3d& operator*=(ftype t) {
        x *= t;
        y *= t;
        z *= t;
        return *this;
    }
    point3d& operator/=(ftype t) {
        x /= t;
        y /= t;
        z /= t;
        return *this;
    }
    point3d operator+(const point3d &t) const {
        return point3d(*this) += t;
    }
    point3d operator-(const point3d &t) const {
        return point3d(*this) -= t;
    }
    point3d operator*(ftype t) const {
        return point3d(*this) *= t;
    }
    point3d operator/(ftype t) const {
        return point3d(*this) /= t;
    }
};
point3d operator*(ftype a, point3d b) {
    return b * a;
}
```

```python
@dataclass
class Point3d:
    x: float
    y: float
    z: float

    def __add__(self, t: "Point3d") -> "Point3d":
        return Point3d(self.x + t.x, self.y + t.y, self.z + t.z)

    def __sub__(self, t: "Point3d") -> "Point3d":
        return Point3d(self.x - t.x, self.y - t.y, self.z - t.z)

    def __mul__(self, t: float) -> "Point3d":
        return Point3d(self.x * t, self.y * t, self.z * t)

    def __rmul__(self, t: float) -> "Point3d":
        return self * t

    def __truediv__(self, t: float) -> "Point3d":
        return Point3d(self.x / t, self.y / t, self.z / t)
```

```typescript
class Point3d {
  constructor(public x: number, public y: number, public z: number) {}

  add(t: Point3d): Point3d {
    return new Point3d(this.x + t.x, this.y + t.y, this.z + t.z);
  }
  sub(t: Point3d): Point3d {
    return new Point3d(this.x - t.x, this.y - t.y, this.z - t.z);
  }
  mul(t: number): Point3d {
    return new Point3d(this.x * t, this.y * t, this.z * t);
  }
  div(t: number): Point3d {
    return new Point3d(this.x / t, this.y / t, this.z / t);
  }
}
```

```go
type Point3d struct {
	X, Y, Z float64
}

func (a Point3d) Add(t Point3d) Point3d {
	return Point3d{a.X + t.X, a.Y + t.Y, a.Z + t.Z}
}
func (a Point3d) Sub(t Point3d) Point3d {
	return Point3d{a.X - t.X, a.Y - t.Y, a.Z - t.Z}
}
func (a Point3d) Mul(t float64) Point3d {
	return Point3d{a.X * t, a.Y * t, a.Z * t}
}
func (a Point3d) Div(t float64) Point3d {
	return Point3d{a.X / t, a.Y / t, a.Z / t}
}
```

</CodeTabs>

Тут `ftype` — це деякий тип, що використовується для координат, зазвичай `int`, `double` або `long long`.

## Скалярний добуток \{#dot-product}

### Означення \{#definition}
Скалярний добуток $\mathbf a \cdot \mathbf b$ векторів $\mathbf a$ та $\mathbf b$ можна означити двома еквівалентними способами.
Геометрично це добуток довжини першого вектора на довжину проєкції другого вектора на перший.
Як видно із зображення нижче, ця проєкція — це не що інше, як $|\mathbf a| \cos \theta$, де $\theta$ — кут між $\mathbf a$ та $\mathbf b$. Отже, $\mathbf a\cdot  \mathbf b = |\mathbf a| \cos \theta \cdot |\mathbf b|$.

<center> <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Dot_Product.svg/300px-Dot_Product.svg.png" alt="" /> </center>

Скалярний добуток має кілька важливих властивостей:

1. $\mathbf a \cdot \mathbf b = \mathbf b \cdot \mathbf a$
2. $(\alpha \cdot \mathbf a)\cdot \mathbf b = \alpha \cdot (\mathbf a \cdot \mathbf b)$
3. $(\mathbf a + \mathbf b)\cdot \mathbf c = \mathbf a \cdot \mathbf c + \mathbf b \cdot \mathbf c$

Тобто це комутативна функція, лінійна за обома аргументами.
Позначимо одиничні вектори як

$$
\mathbf e_x = \begin{pmatrix} 1 \\ 0 \\ 0 \end{pmatrix}, \mathbf e_y = \begin{pmatrix} 0 \\ 1 \\ 0 \end{pmatrix}, \mathbf e_z = \begin{pmatrix} 0 \\ 0 \\ 1 \end{pmatrix}.
$$

З цим позначенням ми можемо записати вектор $\mathbf r = (x;y;z)$ як $r = x \cdot \mathbf e_x + y \cdot \mathbf e_y + z \cdot \mathbf e_z$.
А оскільки для одиничних векторів

$$
\mathbf e_x\cdot \mathbf e_x = \mathbf e_y\cdot \mathbf e_y = \mathbf e_z\cdot \mathbf e_z = 1,\\
\mathbf e_x\cdot \mathbf e_y = \mathbf e_y\cdot \mathbf e_z = \mathbf e_z\cdot \mathbf e_x = 0
$$

ми бачимо, що в координатах для $\mathbf a = (x_1;y_1;z_1)$ та $\mathbf b = (x_2;y_2;z_2)$ виконується

$$
\mathbf a\cdot \mathbf b = (x_1 \cdot \mathbf e_x + y_1 \cdot\mathbf e_y + z_1 \cdot\mathbf e_z)\cdot( x_2 \cdot\mathbf e_x + y_2 \cdot\mathbf e_y + z_2 \cdot\mathbf e_z) = x_1 x_2 + y_1 y_2 + z_1 z_2
$$

Це також є алгебраїчним означенням скалярного добутку.
Звідси ми можемо записати функції, які його обчислюють.

<CodeTabs>

```cpp
ftype dot(point2d a, point2d b) {
    return a.x * b.x + a.y * b.y;
}
ftype dot(point3d a, point3d b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
}
```

```python
def dot2d(a: Point2d, b: Point2d) -> float:
    return a.x * b.x + a.y * b.y


def dot3d(a: Point3d, b: Point3d) -> float:
    return a.x * b.x + a.y * b.y + a.z * b.z
```

```typescript
// У TypeScript нема перевантаження за типом аргументів,
// тому даємо двом версіям різні імена (dot2d / dot3d).
function dot2d(a: Point2d, b: Point2d): number {
  return a.x * b.x + a.y * b.y;
}
function dot3d(a: Point3d, b: Point3d): number {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}
```

```go
// Go не має перевантаження функцій, тому окремі імена для 2D/3D.
func Dot2d(a, b Point2d) float64 {
	return a.X*b.X + a.Y*b.Y
}
func Dot3d(a, b Point3d) float64 {
	return a.X*b.X + a.Y*b.Y + a.Z*b.Z
}
```

</CodeTabs>

Розв'язуючи задачі, для обчислення скалярних добутків варто користуватися алгебраїчним означенням, але тримати в голові геометричне означення та властивості, щоб ним користуватися.

### Властивості \{#properties}

За допомогою скалярного добутку ми можемо визначити багато геометричних властивостей.
Наприклад

1. Норма $\mathbf a$ (квадрат довжини): $|\mathbf a|^2 = \mathbf a\cdot \mathbf a$
2. Довжина $\mathbf a$: $|\mathbf a| = \sqrt{\mathbf a\cdot \mathbf a}$
3. Проєкція $\mathbf a$ на $\mathbf b$: $\dfrac{\mathbf a\cdot\mathbf b}{|\mathbf b|}$
4. Кут між векторами: $\arccos \left(\dfrac{\mathbf a\cdot \mathbf b}{|\mathbf a| \cdot |\mathbf b|}\right)$
5. З попереднього пункту видно, що скалярний добуток додатний, якщо кут між векторами гострий, від'ємний, якщо кут тупий, і дорівнює нулю, якщо вектори ортогональні, тобто утворюють прямий кут.

Зауважимо, що всі ці функції не залежать від кількості вимірів, а отже, вони будуть однаковими для випадків 2D та 3D:

<CodeTabs>

```cpp
ftype norm(point2d a) {
    return dot(a, a);
}
double abs(point2d a) {
    return sqrt(norm(a));
}
double proj(point2d a, point2d b) {
    return dot(a, b) / abs(b);
}
double angle(point2d a, point2d b) {
    return acos(dot(a, b) / abs(a) / abs(b));
}
```

```python
import math


def norm(a: Point2d) -> float:
    return dot2d(a, a)


def abs_(a: Point2d) -> float:  # abs — вбудована назва, тому abs_
    return math.sqrt(norm(a))


def proj(a: Point2d, b: Point2d) -> float:
    return dot2d(a, b) / abs_(b)


def angle(a: Point2d, b: Point2d) -> float:
    return math.acos(dot2d(a, b) / abs_(a) / abs_(b))
```

```typescript
function norm(a: Point2d): number {
  return dot2d(a, a);
}
function abs(a: Point2d): number {
  return Math.sqrt(norm(a));
}
function proj(a: Point2d, b: Point2d): number {
  return dot2d(a, b) / abs(b);
}
function angle(a: Point2d, b: Point2d): number {
  return Math.acos(dot2d(a, b) / abs(a) / abs(b));
}
```

```go
import "math"

func Norm(a Point2d) float64 {
	return Dot2d(a, a)
}
func Abs(a Point2d) float64 {
	return math.Sqrt(Norm(a))
}
func Proj(a, b Point2d) float64 {
	return Dot2d(a, b) / Abs(b)
}
func Angle(a, b Point2d) float64 {
	return math.Acos(Dot2d(a, b) / Abs(a) / Abs(b))
}
```

</CodeTabs>

Щоб побачити наступну важливу властивість, розгляньмо множину точок $\mathbf r$, для яких $\mathbf r\cdot \mathbf a = C$ для деякої фіксованої сталої $C$.
Можна побачити, що ця множина точок — це саме множина точок, для яких проєкція на $\mathbf a$ є точкою $C \cdot \dfrac{\mathbf a}{|\mathbf a| ^ 2}$, і вони утворюють гіперплощину, ортогональну до $\mathbf a$.
На зображенні нижче ви можете побачити вектор $\mathbf a$ разом із кількома такими векторами, що мають із ним однаковий скалярний добуток у 2D:

<center> <img src="https://i.imgur.com/eyO7St4.png" alt="Vectors having same dot product with a" /> </center>

У 2D ці вектори утворять пряму, у 3D — площину.
Зауважимо, що цей результат дозволяє нам означити пряму в 2D як $\mathbf r\cdot \mathbf n=C$ або $(\mathbf r - \mathbf r_0)\cdot \mathbf n=0$, де $\mathbf n$ — вектор, ортогональний до прямої, $\mathbf r_0$ — будь-який вектор, що вже лежить на прямій, а $C = \mathbf r_0\cdot \mathbf n$.
Так само можна означити й площину в 3D.

## Векторний добуток \{#cross-product}

### Означення \{#definition-1}

Припустимо, у вас є три вектори $\mathbf a$, $\mathbf b$ та $\mathbf c$ у тривимірному просторі, об'єднані в паралелепіпед, як на зображенні нижче:
<center> <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Parallelepiped_volume.svg/250px-Parallelepiped_volume.svg.png" alt="Three vectors" /> </center>

Як би ви обчислили його об'єм?
Зі школи ми знаємо, що треба помножити площу основи на висоту, якою є проєкція $\mathbf a$ на напрямок, ортогональний до основи.
Це означає, що якщо ми означимо $\mathbf b \times \mathbf c$ як вектор, ортогональний одночасно до $\mathbf b$ та $\mathbf c$, довжина якого дорівнює площі паралелограма, утвореного $\mathbf b$ та $\mathbf c$, то $|\mathbf a\cdot (\mathbf b\times\mathbf c)|$ дорівнюватиме об'єму паралелепіпеда.
Для цілісності будемо вважати, що $\mathbf b\times \mathbf c$ завжди спрямований так, щоб поворот від вектора $\mathbf b$ до вектора $\mathbf c$, якщо дивитися з боку $\mathbf b\times \mathbf c$, завжди був проти годинникової стрілки (див. зображення нижче).

<center> <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Cross_product_vector.svg/250px-Cross_product_vector.svg.png" alt="cross product" /> </center>

Це означує векторний добуток $\mathbf b\times \mathbf c$ векторів $\mathbf b$ та $\mathbf c$, а також мішаний добуток $\mathbf a\cdot(\mathbf b\times \mathbf c)$ векторів $\mathbf a$, $\mathbf b$ та $\mathbf c$.

Деякі важливі властивості векторного та мішаного добутків:

1.  $\mathbf a\times \mathbf b = -\mathbf b\times \mathbf a$
2.  $(\alpha \cdot \mathbf a)\times \mathbf b = \alpha \cdot (\mathbf a\times \mathbf b)$
3.  Для будь-яких $\mathbf b$ та $\mathbf c$ існує рівно один вектор $\mathbf r$ такий, що $\mathbf a\cdot (\mathbf b\times \mathbf c) = \mathbf a\cdot\mathbf r$ для будь-якого вектора $\mathbf a$. <br/>Справді, якщо існують два таких вектори $\mathbf r_1$ та $\mathbf r_2$, то $\mathbf a\cdot (\mathbf r_1 - \mathbf r_2)=0$ для всіх векторів $\mathbf a$, що можливо лише тоді, коли $\mathbf r_1 = \mathbf r_2$.
4.  $\mathbf a\cdot (\mathbf b\times \mathbf c) = \mathbf b\cdot (\mathbf c\times \mathbf a) = -\mathbf a\cdot( \mathbf c\times \mathbf b)$
5.  $(\mathbf a + \mathbf b)\times \mathbf c = \mathbf a\times \mathbf c + \mathbf b\times \mathbf c$.
    Справді, для всіх векторів $\mathbf r$ виконується ланцюжок рівностей:

    $$
    \mathbf r\cdot( (\mathbf a + \mathbf b)\times \mathbf c) = (\mathbf a + \mathbf b) \cdot (\mathbf c\times \mathbf r) =  \mathbf a \cdot(\mathbf c\times \mathbf r) + \mathbf b\cdot(\mathbf c\times \mathbf r) = \mathbf r\cdot (\mathbf a\times \mathbf c) + \mathbf r\cdot(\mathbf b\times \mathbf c) = \mathbf r\cdot(\mathbf a\times \mathbf c + \mathbf b\times \mathbf c)
    $$

    Що доводить $(\mathbf a + \mathbf b)\times \mathbf c = \mathbf a\times \mathbf c + \mathbf b\times \mathbf c$ завдяки пункту 3.

6.  $|\mathbf a\times \mathbf b|=|\mathbf a| \cdot |\mathbf b| \sin \theta$, де $\theta$ — кут між $\mathbf a$ та $\mathbf b$, оскільки $|\mathbf a\times \mathbf b|$ дорівнює площі паралелограма, утвореного $\mathbf a$ та $\mathbf b$.

З урахуванням усього цього та того, що для одиничних векторів виконується рівність

$$
\mathbf e_x\times \mathbf e_x = \mathbf e_y\times \mathbf e_y = \mathbf e_z\times \mathbf e_z = \mathbf 0,\\
\mathbf e_x\times \mathbf e_y = \mathbf e_z,~\mathbf e_y\times \mathbf e_z = \mathbf e_x,~\mathbf e_z\times \mathbf e_x = \mathbf e_y
$$

ми можемо обчислити векторний добуток $\mathbf a = (x_1;y_1;z_1)$ та $\mathbf b = (x_2;y_2;z_2)$ у координатній формі:

$$
\mathbf a\times \mathbf b = (x_1 \cdot \mathbf e_x + y_1 \cdot \mathbf e_y + z_1 \cdot \mathbf e_z)\times (x_2 \cdot \mathbf e_x + y_2 \cdot \mathbf e_y + z_2 \cdot \mathbf e_z) =
$$

$$
(y_1 z_2 - z_1 y_2)\mathbf e_x  + (z_1 x_2 - x_1 z_2)\mathbf e_y + (x_1 y_2 - y_1 x_2)\mathbf e_z
$$

Що також можна записати в елегантнішій формі:

$$
\mathbf a\times \mathbf b = \begin{vmatrix}\mathbf e_x & \mathbf e_y & \mathbf e_z \\ x_1 & y_1 & z_1 \\ x_2 & y_2 & z_2 \end{vmatrix},~a\cdot(b\times c) = \begin{vmatrix} x_1 & y_1 & z_1 \\ x_2 & y_2 & z_2 \\ x_3 & y_3 & z_3 \end{vmatrix}
$$

Тут $| \cdot |$ позначає визначник матриці.

Деякий аналог векторного добутку (а саме псевдоскалярний добуток) можна реалізувати й у двовимірному випадку.
Якщо ми хочемо обчислити площу паралелограма, утвореного векторами $\mathbf a$ та $\mathbf b$, ми обчислили б $|\mathbf e_z\cdot(\mathbf a\times \mathbf b)| = |x_1 y_2 - y_1 x_2|$.
Інший спосіб отримати той самий результат — помножити $|\mathbf a|$ (основу паралелограма) на висоту, якою є проєкція вектора $\mathbf b$ на вектор $\mathbf a$, повернутий на $90^\circ$, що, своєю чергою, дорівнює $\widehat{\mathbf a}=(-y_1;x_1)$.
Тобто обчислити $|\widehat{\mathbf a}\cdot\mathbf b|=|x_1y_2 - y_1 x_2|$.

Якщо враховувати знак, то площа буде додатною, якщо поворот від $\mathbf a$ до $\mathbf b$ (тобто з боку точки $\mathbf e_z$) відбувається проти годинникової стрілки, і від'ємною інакше.
Це означує псевдоскалярний добуток.
Зауважимо, що він також дорівнює $|\mathbf a| \cdot |\mathbf b| \sin \theta$, де $\theta$ — кут від $\mathbf a$ до $\mathbf b$, відлічуваний проти годинникової стрілки (і від'ємний, якщо поворот за годинниковою стрілкою).

Реалізуймо все це!

<CodeTabs>

```cpp
point3d cross(point3d a, point3d b) {
    return point3d(a.y * b.z - a.z * b.y,
                   a.z * b.x - a.x * b.z,
                   a.x * b.y - a.y * b.x);
}
ftype triple(point3d a, point3d b, point3d c) {
    return dot(a, cross(b, c));
}
ftype cross(point2d a, point2d b) {
    return a.x * b.y - a.y * b.x;
}
```

```python
def cross3d(a: Point3d, b: Point3d) -> Point3d:
    return Point3d(a.y * b.z - a.z * b.y,
                   a.z * b.x - a.x * b.z,
                   a.x * b.y - a.y * b.x)


def triple(a: Point3d, b: Point3d, c: Point3d) -> float:
    return dot3d(a, cross3d(b, c))


# у 2D векторний добуток — це скаляр (псевдоскалярний добуток)
def cross2d(a: Point2d, b: Point2d) -> float:
    return a.x * b.y - a.y * b.x
```

```typescript
function cross3d(a: Point3d, b: Point3d): Point3d {
  return new Point3d(
    a.y * b.z - a.z * b.y,
    a.z * b.x - a.x * b.z,
    a.x * b.y - a.y * b.x,
  );
}
function triple(a: Point3d, b: Point3d, c: Point3d): number {
  return dot3d(a, cross3d(b, c));
}
// у 2D повертаємо скаляр (псевдоскалярний добуток)
function cross2d(a: Point2d, b: Point2d): number {
  return a.x * b.y - a.y * b.x;
}
```

```go
func Cross3d(a, b Point3d) Point3d {
	return Point3d{
		a.Y*b.Z - a.Z*b.Y,
		a.Z*b.X - a.X*b.Z,
		a.X*b.Y - a.Y*b.X,
	}
}
func Triple(a, b, c Point3d) float64 {
	return Dot3d(a, Cross3d(b, c))
}

// у 2D повертаємо скаляр (псевдоскалярний добуток)
func Cross2d(a, b Point2d) float64 {
	return a.X*b.Y - a.Y*b.X
}
```

</CodeTabs>

### Властивості \{#properties-1}

Щодо векторного добутку, то він дорівнює нульовому вектору тоді й лише тоді, коли вектори $\mathbf a$ та $\mathbf b$ колінеарні (лежать на одній прямій, тобто паралельні).
Те саме виконується для мішаного добутку: він дорівнює нулю тоді й лише тоді, коли вектори $\mathbf a$, $\mathbf b$ та $\mathbf c$ компланарні (лежать в одній площині).

Звідси ми можемо отримати універсальні рівняння, що задають прямі та площини.
Пряму можна задати через її напрямний вектор $\mathbf d$ та початкову точку $\mathbf r_0$ або через дві точки $\mathbf a$ та $\mathbf b$.
Вона задається як $(\mathbf r - \mathbf r_0)\times\mathbf d=0$ або як $(\mathbf r - \mathbf a)\times (\mathbf b - \mathbf a) = 0$.
Щодо площин, то площину можна задати трьома точками $\mathbf a$, $\mathbf b$ та $\mathbf c$ як $(\mathbf r - \mathbf a)\cdot((\mathbf b - \mathbf a)\times (\mathbf c - \mathbf a))=0$ або початковою точкою $\mathbf r_0$ та двома напрямними векторами, що лежать у цій площині, $\mathbf d_1$ та $\mathbf d_2$: $(\mathbf r - \mathbf r_0)\cdot(\mathbf d_1\times \mathbf d_2)=0$.

У 2D псевдоскалярний добуток також можна використати, щоб перевірити взаємну орієнтацію двох векторів, бо він додатний, якщо поворот від першого до другого вектора відбувається проти годинникової стрілки, і від'ємний інакше.
І, звісно, його можна використовувати для обчислення площ многокутників, що описано в окремій статті.
Мішаний добуток можна використати з тією самою метою в тривимірному просторі.

## Вправи \{#exercises}

### Перетин прямих \{#line-intersection}

Існує багато способів задати пряму в 2D, і не варто вагатися їх комбінувати.
Наприклад, у нас є дві прямі, і ми хочемо знайти точки їхнього перетину.
Можна сказати, що всі точки першої прямої можна параметризувати як $\mathbf r = \mathbf a_1 + t \cdot \mathbf d_1$, де $\mathbf a_1$ — початкова точка, $\mathbf d_1$ — напрямок, а $t$ — деякий дійсний параметр.
Щодо другої прямої, то всі її точки мають задовольняти $(\mathbf r - \mathbf a_2)\times \mathbf d_2=0$. Звідси ми легко знаходимо параметр $t$:

$$
(\mathbf a_1 + t \cdot \mathbf d_1 - \mathbf a_2)\times \mathbf d_2=0 \quad\Rightarrow\quad t = \dfrac{(\mathbf a_2 - \mathbf a_1)\times\mathbf d_2}{\mathbf d_1\times \mathbf d_2}
$$

Реалізуймо функцію перетину двох прямих.

<CodeTabs>

```cpp
point2d intersect(point2d a1, point2d d1, point2d a2, point2d d2) {
    return a1 + cross(a2 - a1, d2) / cross(d1, d2) * d1;
}
```

```python
def intersect_lines(a1: Point2d, d1: Point2d,
                    a2: Point2d, d2: Point2d) -> Point2d:
    t = cross2d(a2 - a1, d2) / cross2d(d1, d2)
    return a1 + d1 * t
```

```typescript
function intersectLines(
  a1: Point2d, d1: Point2d,
  a2: Point2d, d2: Point2d,
): Point2d {
  const t = cross2d(a2.sub(a1), d2) / cross2d(d1, d2);
  return a1.add(d1.mul(t));
}
```

```go
func IntersectLines(a1, d1, a2, d2 Point2d) Point2d {
	t := Cross2d(a2.Sub(a1), d2) / Cross2d(d1, d2)
	return a1.Add(d1.Mul(t))
}
```

</CodeTabs>

### Перетин площин \{#planes-intersection}

Однак іноді скористатися геометричними міркуваннями буває важко.
Наприклад, вам задано три площини через початкові точки $\mathbf a_i$ та напрямки $\mathbf d_i$, і ви хочете знайти точку їхнього перетину.
Можна помітити, що достатньо просто розв'язати систему рівнянь:

$$
\begin{cases}\mathbf r\cdot \mathbf n_1 = \mathbf a_1\cdot \mathbf n_1, \\ \mathbf r\cdot \mathbf n_2 = \mathbf a_2\cdot \mathbf n_2, \\ \mathbf r\cdot \mathbf n_3 = \mathbf a_3\cdot \mathbf n_3\end{cases}
$$

Замість того щоб думати над геометричним підходом, можна виробити алгебраїчний, який отримуємо одразу.
Наприклад, якщо ви вже реалізували клас точки, вам буде легко розв'язати цю систему за допомогою правила Крамера, бо мішаний добуток — це просто визначник матриці, отриманої з векторів, що є її стовпцями:

<CodeTabs>

```cpp
point3d intersect(point3d a1, point3d n1, point3d a2, point3d n2, point3d a3, point3d n3) {
    point3d x(n1.x, n2.x, n3.x);
    point3d y(n1.y, n2.y, n3.y);
    point3d z(n1.z, n2.z, n3.z); 
    point3d d(dot(a1, n1), dot(a2, n2), dot(a3, n3));
    return point3d(triple(d, y, z),
                   triple(x, d, z),
                   triple(x, y, d)) / triple(n1, n2, n3);
}
```

```python
def intersect_planes(a1: Point3d, n1: Point3d,
                     a2: Point3d, n2: Point3d,
                     a3: Point3d, n3: Point3d) -> Point3d:
    x = Point3d(n1.x, n2.x, n3.x)
    y = Point3d(n1.y, n2.y, n3.y)
    z = Point3d(n1.z, n2.z, n3.z)
    d = Point3d(dot3d(a1, n1), dot3d(a2, n2), dot3d(a3, n3))
    return Point3d(triple(d, y, z),
                   triple(x, d, z),
                   triple(x, y, d)) / triple(n1, n2, n3)
```

```typescript
function intersectPlanes(
  a1: Point3d, n1: Point3d,
  a2: Point3d, n2: Point3d,
  a3: Point3d, n3: Point3d,
): Point3d {
  const x = new Point3d(n1.x, n2.x, n3.x);
  const y = new Point3d(n1.y, n2.y, n3.y);
  const z = new Point3d(n1.z, n2.z, n3.z);
  const d = new Point3d(dot3d(a1, n1), dot3d(a2, n2), dot3d(a3, n3));
  return new Point3d(
    triple(d, y, z),
    triple(x, d, z),
    triple(x, y, d),
  ).div(triple(n1, n2, n3));
}
```

```go
func IntersectPlanes(a1, n1, a2, n2, a3, n3 Point3d) Point3d {
	x := Point3d{n1.X, n2.X, n3.X}
	y := Point3d{n1.Y, n2.Y, n3.Y}
	z := Point3d{n1.Z, n2.Z, n3.Z}
	d := Point3d{Dot3d(a1, n1), Dot3d(a2, n2), Dot3d(a3, n3)}
	return Point3d{
		Triple(d, y, z),
		Triple(x, d, z),
		Triple(x, y, d),
	}.Div(Triple(n1, n2, n3))
}
```

</CodeTabs>

Тепер ви можете спробувати самостійно знайти підходи до поширених геометричних операцій, щоб звикнути до всього цього.
