# Швидке перетворення Фур'є

У цій статті ми розглянемо алгоритм, який дозволяє перемножити два многочлени довжини $n$ за час $O(n \log n)$, що краще за тривіальне множення, яке потребує $O(n^2)$ часу.
Очевидно, що множення двох довгих чисел також можна звести до множення многочленів, тому й два довгих числа можна перемножити за час $O(n \log n)$ (де $n$ — кількість цифр у числах).

Відкриття **швидкого перетворення Фур'є (ШПФ, англ. FFT)** приписують Кулі та Тьюкі, які опублікували алгоритм у 1965 році.
Але насправді FFT відкривали неодноразово й раніше, проте до появи сучасних комп'ютерів його важливість не усвідомлювали.
Деякі дослідники приписують відкриття FFT Рунге та Кеніґу в 1924 році.
Та насправді Гаусс розробив такий метод іще в 1805 році, але ніколи його не публікував.

Зауважте, що наведений тут алгоритм FFT працює за час $O(n \log n)$, але він не годиться для множення довільно великих многочленів із довільно великими коефіцієнтами або для множення довільно великих цілих чисел.
Він легко справляється з многочленами розміру $10^5$ з невеликими коефіцієнтами або з множенням двох чисел розміру $10^6$, чого зазвичай достатньо для розв'язання задач зі змагального програмування. За межами множення чисел із $10^6$ бітами діапазону та точності чисел з рухомою комою, що використовуються під час обчислень, не вистачить, щоб дати точні кінцеві результати, хоча існують складніші варіації, здатні виконувати множення довільно великих многочленів чи цілих чисел.
Наприклад, у 1971 році Шенгаґе та Штрассен розробили варіацію для множення довільно великих чисел, яка рекурсивно застосовує FFT у кільцевих структурах і працює за $O(n \log n \log \log n)$.
А нещодавно (у 2019 році) Гарві та ван дер Говен опублікували алгоритм, який працює за справжній $O(n \log n)$.

## Дискретне перетворення Фур'є \{#discrete-fourier-transform}

Нехай маємо многочлен степеня $n - 1$:

$$
A(x) = a_0 x^0 + a_1 x^1 + \dots + a_{n-1} x^{n-1}
$$

Без втрати загальності припустимо, що $n$ — кількість коефіцієнтів — є степенем $2$.
Якщо $n$ не є степенем $2$, то ми просто додаємо відсутні члени $a_i x^i$ і встановлюємо коефіцієнти $a_i$ рівними $0$.

Теорія комплексних чисел каже нам, що рівняння $x^n = 1$ має $n$ комплексних розв'язків (їх називають $n$-ми коренями з одиниці), і ці розв'язки мають вигляд $w_{n, k} = e^{\frac{2 k \pi i}{n}}$ при $k = 0 \dots n-1$.
Крім того, ці комплексні числа мають деякі дуже цікаві властивості:
наприклад, головний $n$-й корінь $w_n = w_{n, 1} = e^{\frac{2 \pi i}{n}}$ можна використати, щоб описати всі інші $n$-ті корені: $w_{n, k} = (w_n)^k$.

**Дискретне перетворення Фур'є (DFT)** многочлена $A(x)$ (або, що те саме, вектора коефіцієнтів $(a_0, a_1, \dots, a_{n-1})$) означується як значення многочлена в точках $x = w_{n, k}$, тобто це вектор:

$$
\begin{align}
\text{DFT}(a_0, a_1, \dots, a_{n-1}) &= (y_0, y_1, \dots, y_{n-1}) \\
&= (A(w_{n, 0}), A(w_{n, 1}), \dots, A(w_{n, n-1})) \\
&= (A(w_n^0), A(w_n^1), \dots, A(w_n^{n-1}))
\end{align}
$$

Аналогічно означується **обернене дискретне перетворення Фур'є**:
обернене DFT значень многочлена $(y_0, y_1, \dots, y_{n-1})$ — це коефіцієнти многочлена $(a_0, a_1, \dots, a_{n-1})$.

$$
\text{InverseDFT}(y_0, y_1, \dots, y_{n-1}) = (a_0, a_1, \dots, a_{n-1})
$$

Отже, якщо пряме DFT обчислює значення многочлена в точках, що є $n$-ми коренями, то обернене DFT може відновити коефіцієнти многочлена за цими значеннями.

### Застосування DFT: швидке множення многочленів \{#application-of-the-dft-fast-multiplication-of-polynomials}

Нехай маємо два многочлени $A$ і $B$.
Обчислимо DFT для кожного з них: $\text{DFT}(A)$ і $\text{DFT}(B)$.

Що станеться, якщо ми перемножимо ці многочлени?
Очевидно, що в кожній точці значення просто перемножуються, тобто

$$
(A \cdot B)(x) = A(x) \cdot B(x).
$$

Це означає, що якщо ми перемножимо вектори $\text{DFT}(A)$ і $\text{DFT}(B)$ — перемноживши кожен елемент одного вектора на відповідний елемент іншого, — то ми отримаємо не що інше, як DFT многочлена $\text{DFT}(A \cdot B)$:

$$
\text{DFT}(A \cdot B) = \text{DFT}(A) \cdot \text{DFT}(B)
$$

Нарешті, застосувавши обернене DFT, отримаємо:

$$
A \cdot B = \text{InverseDFT}(\text{DFT}(A) \cdot \text{DFT}(B))
$$

Справа під добутком двох DFT ми розуміємо поелементний добуток елементів векторів.
Його можна обчислити за час $O(n)$.
Якщо ми вміємо обчислювати DFT та обернене DFT за $O(n \log n)$, то ми можемо обчислити добуток двох многочленів (а отже, і двох довгих чисел) з тією самою часовою складністю.

Слід зауважити, що обидва многочлени повинні мати однаковий степінь.
Інакше два результуючі вектори DFT матимуть різну довжину.
Цього можна досягти, додавши коефіцієнти зі значенням $0$.

А також, оскільки результатом добутку двох многочленів є многочлен степеня $2 (n - 1)$, нам доводиться подвоїти степені кожного многочлена (знову ж таки, доповнивши $0$).
З вектора з $n$ значень ми не можемо відновити бажаний многочлен із $2n - 1$ коефіцієнтами.

### Швидке перетворення Фур'є \{#fast-fourier-transform-1}

**Швидке перетворення Фур'є** — це метод, який дозволяє обчислити DFT за час $O(n \log n)$.
Основна ідея FFT — застосувати «розділяй і володарюй».
Ми ділимо вектор коефіцієнтів многочлена на два вектори, рекурсивно обчислюємо DFT для кожного з них і комбінуємо результати, щоб обчислити DFT повного многочлена.

Отже, нехай маємо многочлен $A(x)$ степеня $n - 1$, де $n$ — степінь $2$ і $n > 1$:

$$
A(x) = a_0 x^0 + a_1 x^1 + \dots + a_{n-1} x^{n-1}
$$

Поділимо його на два менші многочлени: один містить лише коефіцієнти на парних позиціях, а інший — коефіцієнти на непарних позиціях:

$$
\begin{align}
A_0(x) &= a_0 x^0 + a_2 x^1 + \dots + a_{n-2} x^{\frac{n}{2}-1} \\
A_1(x) &= a_1 x^0 + a_3 x^1 + \dots + a_{n-1} x^{\frac{n}{2}-1}
\end{align}
$$

Легко бачити, що

$$
A(x) = A_0(x^2) + x A_1(x^2).
$$

Многочлени $A_0$ і $A_1$ мають удвічі менше коефіцієнтів, ніж многочлен $A$.
Якщо ми вміємо обчислити $\text{DFT}(A)$ за лінійний час, використовуючи $\text{DFT}(A_0)$ і $\text{DFT}(A_1)$, то для часової складності отримаємо рекурентне співвідношення $T_{\text{DFT}}(n) = 2 T_{\text{DFT}}\left(\frac{n}{2}\right) + O(n)$, що за **основною теоремою** дає $T_{\text{DFT}}(n) = O(n \log n)$.

Навчимося, як цього досягти.

Припустимо, що ми обчислили вектори $\left(y_k^0\right)_{k=0}^{n/2-1} = \text{DFT}(A_0)$ і $\left(y_k^1\right)_{k=0}^{n/2-1} = \text{DFT}(A_1)$.
Знайдемо вираз для $\left(y_k\right)_{k=0}^{n-1} = \text{DFT}(A)$.

Для перших $\frac{n}{2}$ значень ми можемо просто скористатися зазначеним раніше рівнянням $A(x) = A_0(x^2) + x A_1(x^2)$:

$$
y_k = y_k^0 + w_n^k y_k^1, \quad k = 0 \dots \frac{n}{2} - 1.
$$

Однак для других $\frac{n}{2}$ значень потрібно знайти дещо інший вираз:

$$
\begin{align}
y_{k+n/2} &= A\left(w_n^{k+n/2}\right) \\
&= A_0\left(w_n^{2k+n}\right) + w_n^{k + n/2} A_1\left(w_n^{2k+n}\right) \\
&= A_0\left(w_n^{2k} w_n^n\right) + w_n^k w_n^{n/2} A_1\left(w_n^{2k} w_n^n\right) \\
&= A_0\left(w_n^{2k}\right) - w_n^k A_1\left(w_n^{2k}\right) \\
&= y_k^0 - w_n^k y_k^1
\end{align}
$$

Тут ми знову скористалися $A(x) = A_0(x^2) + x A_1(x^2)$ і двома тотожностями $w_n^n = 1$ та $w_n^{n/2} = -1$.

Отже, ми отримуємо бажані формули для обчислення всього вектора $(y_k)$:

$$
\begin{align}
y_k &= y_k^0 + w_n^k y_k^1, &\quad k = 0 \dots \frac{n}{2} - 1, \\
y_{k+n/2} &= y_k^0 - w_n^k y_k^1, &\quad k = 0 \dots \frac{n}{2} - 1.
\end{align}
$$

(Цей шаблон $a + b$ та $a - b$ іноді називають **метеликом**.)

Таким чином, ми навчилися обчислювати DFT за час $O(n \log n)$.

### Обернене перетворення FFT \{#inverse-fft}

Нехай дано вектор $(y_0, y_1, \dots y_{n-1})$ — значення многочлена $A$ степеня $n - 1$ у точках $x = w_n^k$.
Ми хочемо відновити коефіцієнти $(a_0, a_1, \dots, a_{n-1})$ многочлена.
Ця відома задача називається **інтерполяцією**, і для її розв'язання існують загальні алгоритми.
Але в цьому окремому випадку (оскільки ми знаємо значення в точках, що є коренями з одиниці) можна отримати значно простіший алгоритм (фактично той самий, що й пряме FFT).

Запишемо DFT, згідно з його означенням, у матричній формі:

$$
\begin{pmatrix}
w_n^0 & w_n^0 & w_n^0 & w_n^0 & \cdots & w_n^0 \\
w_n^0 & w_n^1 & w_n^2 & w_n^3 & \cdots & w_n^{n-1} \\
w_n^0 & w_n^2 & w_n^4 & w_n^6 & \cdots & w_n^{2(n-1)} \\
w_n^0 & w_n^3 & w_n^6 & w_n^9 & \cdots & w_n^{3(n-1)} \\
\vdots & \vdots & \vdots & \vdots & \ddots & \vdots \\
w_n^0 & w_n^{n-1} & w_n^{2(n-1)} & w_n^{3(n-1)} & \cdots & w_n^{(n-1)(n-1)}
\end{pmatrix} \begin{pmatrix}
a_0 \\ a_1 \\ a_2 \\ a_3 \\ \vdots \\ a_{n-1}
\end{pmatrix} = \begin{pmatrix}
y_0 \\ y_1 \\ y_2 \\ y_3 \\ \vdots \\ y_{n-1}
\end{pmatrix}
$$

Ця матриця називається **матрицею Вандермонда**.

Таким чином, ми можемо обчислити вектор $(a_0, a_1, \dots, a_{n-1})$, помноживши вектор $(y_0, y_1, \dots y_{n-1})$ зліва на обернену матрицю:

$$
\begin{pmatrix}
a_0 \\ a_1 \\ a_2 \\ a_3 \\ \vdots \\ a_{n-1}
\end{pmatrix} = \begin{pmatrix}
w_n^0 & w_n^0 & w_n^0 & w_n^0 & \cdots & w_n^0 \\
w_n^0 & w_n^1 & w_n^2 & w_n^3 & \cdots & w_n^{n-1} \\
w_n^0 & w_n^2 & w_n^4 & w_n^6 & \cdots & w_n^{2(n-1)} \\
w_n^0 & w_n^3 & w_n^6 & w_n^9 & \cdots & w_n^{3(n-1)} \\
\vdots & \vdots & \vdots & \vdots & \ddots & \vdots \\
w_n^0 & w_n^{n-1} & w_n^{2(n-1)} & w_n^{3(n-1)} & \cdots & w_n^{(n-1)(n-1)}
\end{pmatrix}^{-1} \begin{pmatrix}
y_0 \\ y_1 \\ y_2 \\ y_3 \\ \vdots \\ y_{n-1}
\end{pmatrix}
$$

Швидка перевірка може підтвердити, що обернена матриця має такий вигляд:

$$
\frac{1}{n}
\begin{pmatrix}
w_n^0 & w_n^0 & w_n^0 & w_n^0 & \cdots & w_n^0 \\
w_n^0 & w_n^{-1} & w_n^{-2} & w_n^{-3} & \cdots & w_n^{-(n-1)} \\
w_n^0 & w_n^{-2} & w_n^{-4} & w_n^{-6} & \cdots & w_n^{-2(n-1)} \\
w_n^0 & w_n^{-3} & w_n^{-6} & w_n^{-9} & \cdots & w_n^{-3(n-1)} \\
\vdots & \vdots & \vdots & \vdots & \ddots & \vdots \\
w_n^0 & w_n^{-(n-1)} & w_n^{-2(n-1)} & w_n^{-3(n-1)} & \cdots & w_n^{-(n-1)(n-1)}
\end{pmatrix}
$$

Таким чином, ми отримуємо формулу:

$$
a_k = \frac{1}{n} \sum_{j=0}^{n-1} y_j w_n^{-k j}
$$

Порівнюючи це з формулою для $y_k$

$$
y_k = \sum_{j=0}^{n-1} a_j w_n^{k j},
$$

ми помічаємо, що ці задачі майже однакові, тож коефіцієнти $a_k$ можна знайти тим самим алгоритмом «розділяй і володарюй», що й пряме FFT, тільки замість $w_n^k$ нам доведеться використати $w_n^{-k}$, а наприкінці потрібно поділити отримані коефіцієнти на $n$.

Таким чином, обчислення оберненого DFT майже таке саме, як і обчислення прямого DFT, і його також можна виконати за час $O(n \log n)$.

### Реалізація \{#implementation}

Тут ми наведемо просту рекурсивну **реалізацію FFT** та оберненого FFT, обидва в одній функції, оскільки різниця між прямим та оберненим FFT настільки мінімальна.
Для зберігання комплексних чисел ми використовуємо тип complex зі стандартної бібліотеки C++ STL.

<CodeTabs>

```cpp
using cd = complex<double>;
const double PI = acos(-1);

void fft(vector<cd> & a, bool invert) {
    int n = a.size();
    if (n == 1)
        return;

    vector<cd> a0(n / 2), a1(n / 2);
    for (int i = 0; 2 * i < n; i++) {
        a0[i] = a[2*i];
        a1[i] = a[2*i+1];
    }
    fft(a0, invert);
    fft(a1, invert);

    double ang = 2 * PI / n * (invert ? -1 : 1);
    cd w(1), wn(cos(ang), sin(ang));
    for (int i = 0; 2 * i < n; i++) {
        a[i] = a0[i] + w * a1[i];
        a[i + n/2] = a0[i] - w * a1[i];
        if (invert) {
            a[i] /= 2;
            a[i + n/2] /= 2;
        }
        w *= wn;
    }
}
```

```python
import math

PI = math.acos(-1)

# У Python комплексні числа вбудовані (тип complex), тому DFT записується
# майже один-в-один з C++. Вектор a змінюється на місці.
def fft(a: list[complex], invert: bool) -> None:
    n = len(a)
    if n == 1:
        return

    a0 = [a[2 * i] for i in range(n // 2)]
    a1 = [a[2 * i + 1] for i in range(n // 2)]
    fft(a0, invert)
    fft(a1, invert)

    ang = 2 * PI / n * (-1 if invert else 1)
    w = complex(1)
    wn = complex(math.cos(ang), math.sin(ang))
    for i in range(n // 2):
        a[i] = a0[i] + w * a1[i]
        a[i + n // 2] = a0[i] - w * a1[i]
        if invert:
            a[i] /= 2
            a[i + n // 2] /= 2
        w *= wn
```

```typescript
// У TypeScript немає вбудованого комплексного типу, тому комплексний вектор
// зберігаємо як дві паралельні масиви: re (дійсні частини) та im (уявні).
const PI = Math.acos(-1);

function fft(re: number[], im: number[], invert: boolean): void {
  const n = re.length;
  if (n === 1) return;

  const re0: number[] = [], im0: number[] = [];
  const re1: number[] = [], im1: number[] = [];
  for (let i = 0; 2 * i < n; i++) {
    re0.push(re[2 * i]); im0.push(im[2 * i]);
    re1.push(re[2 * i + 1]); im1.push(im[2 * i + 1]);
  }
  fft(re0, im0, invert);
  fft(re1, im1, invert);

  const ang = (2 * PI) / n * (invert ? -1 : 1);
  let wr = 1, wi = 0;                       // поточний степінь w
  const wnr = Math.cos(ang), wni = Math.sin(ang);
  for (let i = 0; 2 * i < n; i++) {
    // v = w * a1[i] (комплексне множення вручну)
    const tr = wr * re1[i] - wi * im1[i];
    const ti = wr * im1[i] + wi * re1[i];
    re[i] = re0[i] + tr;
    im[i] = im0[i] + ti;
    re[i + n / 2] = re0[i] - tr;
    im[i + n / 2] = im0[i] - ti;
    if (invert) {
      re[i] /= 2; im[i] /= 2;
      re[i + n / 2] /= 2; im[i + n / 2] /= 2;
    }
    // w *= wn
    const nwr = wr * wnr - wi * wni;
    const nwi = wr * wni + wi * wnr;
    wr = nwr; wi = nwi;
  }
}
```

```go
// У Go комплексні числа вбудовані (тип complex128), тому DFT майже не
// відрізняється від C++. Зріз a змінюється на місці.
var pi = math.Acos(-1)

func fft(a []complex128, invert bool) {
	n := len(a)
	if n == 1 {
		return
	}

	a0 := make([]complex128, n/2)
	a1 := make([]complex128, n/2)
	for i := 0; 2*i < n; i++ {
		a0[i] = a[2*i]
		a1[i] = a[2*i+1]
	}
	fft(a0, invert)
	fft(a1, invert)

	sign := 1.0
	if invert {
		sign = -1.0
	}
	ang := 2 * pi / float64(n) * sign
	w := complex(1, 0)
	wn := complex(math.Cos(ang), math.Sin(ang))
	for i := 0; 2*i < n; i++ {
		a[i] = a0[i] + w*a1[i]
		a[i+n/2] = a0[i] - w*a1[i]
		if invert {
			a[i] /= 2
			a[i+n/2] /= 2
		}
		w *= wn
	}
}
```

</CodeTabs>

Функції передається вектор коефіцієнтів, і вона обчислює DFT або обернене DFT та знову зберігає результат у цьому ж векторі.
Аргумент $\text{invert}$ показує, чи слід обчислювати пряме, чи обернене DFT.
Усередині функції ми спершу перевіряємо, чи довжина вектора дорівнює одиниці, і якщо так, то нам нічого не потрібно робити.
Інакше ми ділимо вектор $a$ на два вектори $a0$ і $a1$ та рекурсивно обчислюємо DFT для обох.
Потім ми ініціалізуємо значення $wn$ та змінну $w$, яка міститиме поточний степінь $wn$.
Потім за наведеними вище формулами обчислюються значення результуючого DFT.

Якщо прапорець $\text{invert}$ встановлено, то ми замінюємо $wn$ на $wn^{-1}$, і кожне зі значень результату ділиться на $2$ (оскільки це робитиметься на кожному рівні рекурсії, у підсумку кінцеві значення поділяться на $n$).

Використовуючи цю функцію, ми можемо створити функцію для **множення двох многочленів**:

<CodeTabs>

```cpp
vector<int> multiply(vector<int> const& a, vector<int> const& b) {
    vector<cd> fa(a.begin(), a.end()), fb(b.begin(), b.end());
    int n = 1;
    while (n < a.size() + b.size()) 
        n <<= 1;
    fa.resize(n);
    fb.resize(n);

    fft(fa, false);
    fft(fb, false);
    for (int i = 0; i < n; i++)
        fa[i] *= fb[i];
    fft(fa, true);

    vector<int> result(n);
    for (int i = 0; i < n; i++)
        result[i] = round(fa[i].real());
    return result;
}
```

```python
def multiply(a: list[int], b: list[int]) -> list[int]:
    fa = [complex(x) for x in a]
    fb = [complex(x) for x in b]
    n = 1
    while n < len(a) + len(b):
        n <<= 1
    fa += [complex(0)] * (n - len(fa))
    fb += [complex(0)] * (n - len(fb))

    fft(fa, False)
    fft(fb, False)
    for i in range(n):
        fa[i] *= fb[i]
    fft(fa, True)

    # після обернення комплексні похибки округлюємо до цілих
    return [round(fa[i].real) for i in range(n)]
```

```typescript
function multiply(a: number[], b: number[]): number[] {
  let n = 1;
  while (n < a.length + b.length) n <<= 1;
  const far = new Array<number>(n).fill(0);
  const fai = new Array<number>(n).fill(0);
  const fbr = new Array<number>(n).fill(0);
  const fbi = new Array<number>(n).fill(0);
  for (let i = 0; i < a.length; i++) far[i] = a[i];
  for (let i = 0; i < b.length; i++) fbr[i] = b[i];

  fft(far, fai, false);
  fft(fbr, fbi, false);
  for (let i = 0; i < n; i++) {
    // far[i] *= fb[i]
    const r = far[i] * fbr[i] - fai[i] * fbi[i];
    const im = far[i] * fbi[i] + fai[i] * fbr[i];
    far[i] = r; fai[i] = im;
  }
  fft(far, fai, true);

  const result = new Array<number>(n);
  for (let i = 0; i < n; i++) result[i] = Math.round(far[i]);
  return result;
}
```

```go
func multiply(a, b []int) []int {
	n := 1
	for n < len(a)+len(b) {
		n <<= 1
	}
	fa := make([]complex128, n)
	fb := make([]complex128, n)
	for i, x := range a {
		fa[i] = complex(float64(x), 0)
	}
	for i, x := range b {
		fb[i] = complex(float64(x), 0)
	}

	fft(fa, false)
	fft(fb, false)
	for i := 0; i < n; i++ {
		fa[i] *= fb[i]
	}
	fft(fa, true)

	result := make([]int, n)
	for i := 0; i < n; i++ {
		// після обернення комплексні похибки округлюємо до цілих
		result[i] = int(math.Round(real(fa[i])))
	}
	return result
}
```

</CodeTabs>

Ця функція працює з многочленами з цілими коефіцієнтами, проте її можна налаштувати й для роботи з іншими типами.
Оскільки під час роботи з комплексними числами виникає певна похибка, нам потрібно наприкінці заокруглити отримані коефіцієнти.

Нарешті, функція для **множення** двох довгих чисел практично не відрізняється від функції для множення многочленів.
Єдине, що нам потрібно зробити після цього, — це нормалізувати число:

<CodeTabs>

```cpp
    int carry = 0;
    for (int i = 0; i < n; i++)
        result[i] += carry;
        carry = result[i] / 10;
        result[i] %= 10;
    }
```

```python
    carry = 0
    for i in range(n):
        result[i] += carry
        carry = result[i] // 10
        result[i] %= 10
```

```typescript
  let carry = 0;
  for (let i = 0; i < n; i++) {
    result[i] += carry;
    carry = Math.floor(result[i] / 10);
    result[i] %= 10;
  }
```

```go
	carry := 0
	for i := 0; i < n; i++ {
		result[i] += carry
		carry = result[i] / 10
		result[i] %= 10
	}
```

</CodeTabs>

Оскільки довжина добутку двох чисел ніколи не перевищує сумарної довжини обох чисел, розміру вектора достатньо, щоб виконати всі операції перенесення.

### Покращена реалізація: обчислення на місці \{#improved-implementation-in-place-computation}

Щоб підвищити ефективність, ми перейдемо від рекурсивної реалізації до ітеративної.
У наведеній вище рекурсивній реалізації ми явно розділяли вектор $a$ на два вектори — елементи на парних позиціях присвоювалися одному тимчасовому вектору, а елементи на непарних позиціях — іншому.
Однак якщо ми переупорядкуємо елементи певним чином, нам не потрібно створювати ці тимчасові вектори (тобто всі обчислення можна виконати «на місці», прямо в самому векторі $A$).

Зауважте, що на першому рівні рекурсії елементи, у яких молодший біт позиції дорівнював нулю, присвоювалися вектору $a_0$, а ті, у яких молодший біт позиції дорівнював одиниці, — вектору $a_1$.
На другому рівні рекурсії відбувається те саме, але вже з другим молодшим бітом, і т. д.
Тому якщо ми обернемо біти позиції кожного коефіцієнта й відсортуємо їх за цими оберненими значеннями, ми отримаємо бажаний порядок (його називають перестановкою з оберненням бітів, bit-reversal permutation).

Наприклад, бажаний порядок для $n = 8$ має вигляд:

$$
a = \bigg\{ \Big[ (a_0, a_4), (a_2, a_6) \Big], \Big[ (a_1, a_5), (a_3, a_7) \Big] \bigg\}
$$

Дійсно, на першому рівні рекурсії (обведеному фігурними дужками) вектор ділиться на дві частини $[a_0, a_2, a_4, a_6]$ та $[a_1, a_3, a_5, a_7]$.
Як ми бачимо, у перестановці з оберненням бітів це відповідає простому поділу вектора на дві половини: перші $\frac{n}{2}$ елементів та останні $\frac{n}{2}$ елементів.
Потім для кожної половини відбувається рекурсивний виклик.
Нехай отримане для кожної з них DFT повертається на місце самих елементів (тобто в першу половину та другу половину вектора $a$ відповідно).

$$
a = \bigg\{ \Big[y_0^0, y_1^0, y_2^0, y_3^0\Big], \Big[y_0^1, y_1^1, y_2^1, y_3^1 \Big] \bigg\}
$$

Тепер ми хочемо об'єднати два DFT в одне для повного вектора.
Порядок елементів ідеальний, і об'єднання ми також можемо виконати прямо в цьому векторі.
Можемо взяти елементи $y_0^0$ та $y_0^1$ і виконати перетворення метелика.
Місце двох отриманих значень те саме, що й місце двох початкових значень, тож ми отримуємо:

$$
a = \bigg\{ \Big[y_0^0 + w_n^0 y_0^1, y_1^0, y_2^0, y_3^0\Big], \Big[y_0^0 - w_n^0 y_0^1, y_1^1, y_2^1, y_3^1\Big] \bigg\}
$$

Аналогічно можемо обчислити перетворення метелика для $y_1^0$ та $y_1^1$ і покласти результати на їхнє місце, і так далі.
У результаті отримуємо:

$$
a = \bigg\{ \Big[y_0^0 + w_n^0 y_0^1, y_1^0 + w_n^1 y_1^1, y_2^0 + w_n^2 y_2^1, y_3^0 + w_n^3 y_3^1\Big], \Big[y_0^0 - w_n^0 y_0^1, y_1^0 - w_n^1 y_1^1, y_2^0 - w_n^2 y_2^1, y_3^0 - w_n^3 y_3^1\Big] \bigg\}
$$

Таким чином, ми обчислили потрібне DFT з вектора $a$.

Тут ми описали процес обчислення DFT лише на першому рівні рекурсії, але те саме, очевидно, працює й для всіх інших рівнів.
Отже, застосувавши перестановку з оберненням бітів, ми можемо обчислити DFT на місці, без жодної додаткової пам'яті.

Це додатково дозволяє нам позбутися рекурсії.
Ми просто починаємо з найнижчого рівня, тобто ділимо вектор на пари та застосовуємо до них перетворення метелика.
У результаті отримуємо вектор $a$ з виконаною роботою останнього рівня.
На наступному кроці ми ділимо вектор на вектори розміру $4$ і знову застосовуємо перетворення метелика, що дає нам DFT для кожного блоку розміру $4$.
І так далі.
Нарешті, на останньому кроці ми отримали результат DFT обох половин $a$, і, застосувавши перетворення метелика, отримуємо DFT для повного вектора $a$.

<CodeTabs>

```cpp
using cd = complex<double>;
const double PI = acos(-1);

int reverse(int num, int lg_n) {
    int res = 0;
    for (int i = 0; i < lg_n; i++) {
        if (num & (1 << i))
            res |= 1 << (lg_n - 1 - i);
    }
    return res;
}

void fft(vector<cd> & a, bool invert) {
    int n = a.size();
    int lg_n = 0;
    while ((1 << lg_n) < n)
        lg_n++;

    for (int i = 0; i < n; i++) {
        if (i < reverse(i, lg_n))
            swap(a[i], a[reverse(i, lg_n)]);
    }

    for (int len = 2; len <= n; len <<= 1) {
        double ang = 2 * PI / len * (invert ? -1 : 1);
        cd wlen(cos(ang), sin(ang));
        for (int i = 0; i < n; i += len) {
            cd w(1);
            for (int j = 0; j < len / 2; j++) {
                cd u = a[i+j], v = a[i+j+len/2] * w;
                a[i+j] = u + v;
                a[i+j+len/2] = u - v;
                w *= wlen;
            }
        }
    }

    if (invert) {
        for (cd & x : a)
            x /= n;
    }
}
```

```python
def reverse(num: int, lg_n: int) -> int:
    res = 0
    for i in range(lg_n):
        if num & (1 << i):
            res |= 1 << (lg_n - 1 - i)
    return res


def fft(a: list[complex], invert: bool) -> None:
    n = len(a)
    lg_n = 0
    while (1 << lg_n) < n:
        lg_n += 1

    for i in range(n):
        if i < reverse(i, lg_n):
            a[i], a[reverse(i, lg_n)] = a[reverse(i, lg_n)], a[i]

    length = 2
    while length <= n:
        ang = 2 * PI / length * (-1 if invert else 1)
        wlen = complex(math.cos(ang), math.sin(ang))
        for i in range(0, n, length):
            w = complex(1)
            for j in range(length // 2):
                u = a[i + j]
                v = a[i + j + length // 2] * w
                a[i + j] = u + v
                a[i + j + length // 2] = u - v
                w *= wlen
        length <<= 1

    if invert:
        for i in range(n):
            a[i] /= n
```

```typescript
function reverse(num: number, lg_n: number): number {
  let res = 0;
  for (let i = 0; i < lg_n; i++) {
    if (num & (1 << i)) res |= 1 << (lg_n - 1 - i);
  }
  return res;
}

function fft(re: number[], im: number[], invert: boolean): void {
  const n = re.length;
  let lg_n = 0;
  while ((1 << lg_n) < n) lg_n++;

  for (let i = 0; i < n; i++) {
    const r = reverse(i, lg_n);
    if (i < r) {
      [re[i], re[r]] = [re[r], re[i]];
      [im[i], im[r]] = [im[r], im[i]];
    }
  }

  for (let len = 2; len <= n; len <<= 1) {
    const ang = (2 * PI) / len * (invert ? -1 : 1);
    const wlr = Math.cos(ang), wli = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let wr = 1, wi = 0;
      for (let j = 0; j < len / 2; j++) {
        const ur = re[i + j], ui = im[i + j];
        // v = a[i+j+len/2] * w
        const vr = re[i + j + len / 2] * wr - im[i + j + len / 2] * wi;
        const vi = re[i + j + len / 2] * wi + im[i + j + len / 2] * wr;
        re[i + j] = ur + vr; im[i + j] = ui + vi;
        re[i + j + len / 2] = ur - vr; im[i + j + len / 2] = ui - vi;
        // w *= wlen
        const nwr = wr * wlr - wi * wli;
        const nwi = wr * wli + wi * wlr;
        wr = nwr; wi = nwi;
      }
    }
  }

  if (invert) {
    for (let i = 0; i < n; i++) { re[i] /= n; im[i] /= n; }
  }
}
```

```go
func reverseBits(num, lgN int) int {
	res := 0
	for i := 0; i < lgN; i++ {
		if num&(1<<i) != 0 {
			res |= 1 << (lgN - 1 - i)
		}
	}
	return res
}

func fft(a []complex128, invert bool) {
	n := len(a)
	lgN := 0
	for (1 << lgN) < n {
		lgN++
	}

	for i := 0; i < n; i++ {
		if r := reverseBits(i, lgN); i < r {
			a[i], a[r] = a[r], a[i]
		}
	}

	for length := 2; length <= n; length <<= 1 {
		sign := 1.0
		if invert {
			sign = -1.0
		}
		ang := 2 * pi / float64(length) * sign
		wlen := complex(math.Cos(ang), math.Sin(ang))
		for i := 0; i < n; i += length {
			w := complex(1, 0)
			for j := 0; j < length/2; j++ {
				u := a[i+j]
				v := a[i+j+length/2] * w
				a[i+j] = u + v
				a[i+j+length/2] = u - v
				w *= wlen
			}
		}
	}

	if invert {
		for i := range a {
			a[i] /= complex(float64(n), 0)
		}
	}
}
```

</CodeTabs>

Спершу ми застосовуємо перестановку з оберненням бітів, обмінюючи кожен елемент з елементом на оберненій позиції.
Потім на $\log n - 1$ станах алгоритму ми обчислюємо DFT для кожного блоку відповідного розміру $\text{len}$.
Для всіх цих блоків ми маємо той самий корінь з одиниці $\text{wlen}$.
Ми проходимо всі блоки й виконуємо для кожного з них перетворення метелика.

Ми можемо ще додатково оптимізувати обернення бітів.
У попередній реалізації ми проходили всі біти індексу й створювали побітово обернений індекс.
Однак біти можна обернути в інший спосіб.

Припустимо, що $j$ уже містить обернення $i$.
Тоді, щоб перейти до $i + 1$, нам потрібно збільшити $i$, а також збільшити $j$, але в «оберненій» системі числення.
Додавання одиниці у звичайній двійковій системі еквівалентне перетворенню всіх хвостових одиниць на нулі та перетворенню нуля безпосередньо перед ними на одиницю.
Так само в «оберненій» системі числення ми перетворюємо всі провідні одиниці, а також наступний нуль.

Таким чином, ми отримуємо таку реалізацію:

<CodeTabs>

```cpp
using cd = complex<double>;
const double PI = acos(-1);

void fft(vector<cd> & a, bool invert) {
    int n = a.size();

    for (int i = 1, j = 0; i < n; i++) {
        int bit = n >> 1;
        for (; j & bit; bit >>= 1)
            j ^= bit;
        j ^= bit;

        if (i < j)
            swap(a[i], a[j]);
    }

    for (int len = 2; len <= n; len <<= 1) {
        double ang = 2 * PI / len * (invert ? -1 : 1);
        cd wlen(cos(ang), sin(ang));
        for (int i = 0; i < n; i += len) {
            cd w(1);
            for (int j = 0; j < len / 2; j++) {
                cd u = a[i+j], v = a[i+j+len/2] * w;
                a[i+j] = u + v;
                a[i+j+len/2] = u - v;
                w *= wlen;
            }
        }
    }

    if (invert) {
        for (cd & x : a)
            x /= n;
    }
}
```

```python
def fft(a: list[complex], invert: bool) -> None:
    n = len(a)

    j = 0
    for i in range(1, n):
        bit = n >> 1
        while j & bit:
            j ^= bit
            bit >>= 1
        j ^= bit

        if i < j:
            a[i], a[j] = a[j], a[i]

    length = 2
    while length <= n:
        ang = 2 * PI / length * (-1 if invert else 1)
        wlen = complex(math.cos(ang), math.sin(ang))
        for i in range(0, n, length):
            w = complex(1)
            for k in range(length // 2):
                u = a[i + k]
                v = a[i + k + length // 2] * w
                a[i + k] = u + v
                a[i + k + length // 2] = u - v
                w *= wlen
        length <<= 1

    if invert:
        for i in range(n):
            a[i] /= n
```

```typescript
function fft(re: number[], im: number[], invert: boolean): void {
  const n = re.length;

  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;

    if (i < j) {
      [re[i], re[j]] = [re[j], re[i]];
      [im[i], im[j]] = [im[j], im[i]];
    }
  }

  for (let len = 2; len <= n; len <<= 1) {
    const ang = (2 * PI) / len * (invert ? -1 : 1);
    const wlr = Math.cos(ang), wli = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let wr = 1, wi = 0;
      for (let j = 0; j < len / 2; j++) {
        const ur = re[i + j], ui = im[i + j];
        const vr = re[i + j + len / 2] * wr - im[i + j + len / 2] * wi;
        const vi = re[i + j + len / 2] * wi + im[i + j + len / 2] * wr;
        re[i + j] = ur + vr; im[i + j] = ui + vi;
        re[i + j + len / 2] = ur - vr; im[i + j + len / 2] = ui - vi;
        const nwr = wr * wlr - wi * wli;
        const nwi = wr * wli + wi * wlr;
        wr = nwr; wi = nwi;
      }
    }
  }

  if (invert) {
    for (let i = 0; i < n; i++) { re[i] /= n; im[i] /= n; }
  }
}
```

```go
func fft(a []complex128, invert bool) {
	n := len(a)

	for i, j := 1, 0; i < n; i++ {
		bit := n >> 1
		for ; j&bit != 0; bit >>= 1 {
			j ^= bit
		}
		j ^= bit

		if i < j {
			a[i], a[j] = a[j], a[i]
		}
	}

	for length := 2; length <= n; length <<= 1 {
		sign := 1.0
		if invert {
			sign = -1.0
		}
		ang := 2 * pi / float64(length) * sign
		wlen := complex(math.Cos(ang), math.Sin(ang))
		for i := 0; i < n; i += length {
			w := complex(1, 0)
			for j := 0; j < length/2; j++ {
				u := a[i+j]
				v := a[i+j+length/2] * w
				a[i+j] = u + v
				a[i+j+length/2] = u - v
				w *= wlen
			}
		}
	}

	if invert {
		for i := range a {
			a[i] /= complex(float64(n), 0)
		}
	}
}
```

</CodeTabs>

Додатково ми можемо обчислити перестановку з оберненням бітів заздалегідь.
Це особливо корисно, коли розмір $n$ однаковий для всіх викликів.
Але навіть коли ми маємо лише три виклики (які необхідні для множення двох многочленів), ефект помітний.
Також ми можемо заздалегідь обчислити всі корені з одиниці та їхні степені.

## Теоретико-числове перетворення \{#number-theoretic-transform}

Тепер трохи змінимо мету.
Ми все ще хочемо перемножити два многочлени за час $O(n \log n)$, але цього разу хочемо обчислити коефіцієнти за модулем деякого простого числа $p$.
Звісно, для цього завдання ми можемо використати звичайне DFT і застосувати операцію взяття за модулем до результату.
Однак це може призвести до похибок заокруглення, особливо коли йдеться про великі числа.
**Теоретико-числове перетворення (NTT)** має ту перевагу, що воно працює лише з цілими числами, тому результат гарантовано буде правильним.
 
Дискретне перетворення Фур'є базується на комплексних числах і $n$-х коренях з одиниці.
Щоб ефективно його обчислити, ми активно використовуємо властивості коренів (наприклад, те, що існує один корінь, який породжує всі інші корені піднесенням до степеня).

Але ті самі властивості виконуються й для $n$-х коренів з одиниці в модульній арифметиці.
$n$-й корінь з одиниці над простим полем — це таке число $w_n$, що задовольняє:

$$
\begin{align}
(w_n)^n &= 1 \pmod{p}, \\
(w_n)^k &\ne 1 \pmod{p}, \quad 1 \le k < n.
\end{align}
$$

Інші $n-1$ коренів можна отримати як степені кореня $w_n$.

Щоб застосувати це в алгоритмі швидкого перетворення Фур'є, нам потрібно, щоб корінь існував для деякого $n$, що є степенем $2$, а також для всіх менших степенів.
Можемо помітити таку цікаву властивість:

$$
\begin{align}
(w_n^2)^m = w_n^n &= 1 \pmod{p}, \quad \text{з } m = \frac{n}{2}\\
(w_n^2)^k = w_n^{2k} &\ne 1 \pmod{p}, \quad 1 \le k < m.
\end{align}
$$

Отже, якщо $w_n$ — це $n$-й корінь з одиниці, то $w_n^2$ — це $\frac{n}{2}$-й корінь з одиниці.
А отже, для всіх менших степенів двійки існують корені потрібного степеня, і їх можна обчислити за допомогою $w_n$.

Для обчислення оберненого DFT нам потрібен обернений елемент $w_n^{-1}$ до $w_n$.
Але для простого модуля обернений завжди існує.

Таким чином, усі властивості, які нам потрібні від комплексних коренів, доступні й у модульній арифметиці за умови, що ми маємо достатньо великий модуль $p$, для якого існує $n$-й корінь з одиниці.

Наприклад, ми можемо взяти такі значення: модуль $p = 7340033$, $w_{2^{20}} = 5$.
Якщо цього модуля недостатньо, нам потрібно знайти іншу пару.
Ми можемо скористатися тим фактом, що для модулів вигляду $p = c 2^k + 1$ (і $p$ — просте) завжди існує $2^k$-й корінь з одиниці.
Можна показати, що $g^c$ — це такий $2^k$-й корінь з одиниці, де $g$ — [первісний корінь](primitive-root.md) числа $p$.

<CodeTabs>

```cpp
const int mod = 7340033;
const int root = 5;
const int root_1 = 4404020;
const int root_pw = 1 << 20;

void fft(vector<int> & a, bool invert) {
    int n = a.size();

    for (int i = 1, j = 0; i < n; i++) {
        int bit = n >> 1;
        for (; j & bit; bit >>= 1)
            j ^= bit;
        j ^= bit;

        if (i < j)
            swap(a[i], a[j]);
    }

    for (int len = 2; len <= n; len <<= 1) {
        int wlen = invert ? root_1 : root;
        for (int i = len; i < root_pw; i <<= 1)
            wlen = (int)(1LL * wlen * wlen % mod);

        for (int i = 0; i < n; i += len) {
            int w = 1;
            for (int j = 0; j < len / 2; j++) {
                int u = a[i+j], v = (int)(1LL * a[i+j+len/2] * w % mod);
                a[i+j] = u + v < mod ? u + v : u + v - mod;
                a[i+j+len/2] = u - v >= 0 ? u - v : u - v + mod;
                w = (int)(1LL * w * wlen % mod);
            }
        }
    }

    if (invert) {
        int n_1 = inverse(n, mod);
        for (int & x : a)
            x = (int)(1LL * x * n_1 % mod);
    }
}
```

```python
mod = 7340033
root = 5
root_1 = 4404020
root_pw = 1 << 20

# У Python цілі необмеженого розміру, тому переповнення немає і явні
# приведення типів (1LL * ...) не потрібні.
def fft(a: list[int], invert: bool) -> None:
    n = len(a)

    j = 0
    for i in range(1, n):
        bit = n >> 1
        while j & bit:
            j ^= bit
            bit >>= 1
        j ^= bit

        if i < j:
            a[i], a[j] = a[j], a[i]

    length = 2
    while length <= n:
        wlen = root_1 if invert else root
        i = length
        while i < root_pw:
            wlen = wlen * wlen % mod
            i <<= 1

        for i in range(0, n, length):
            w = 1
            for k in range(length // 2):
                u = a[i + k]
                v = a[i + k + length // 2] * w % mod
                a[i + k] = u + v if u + v < mod else u + v - mod
                a[i + k + length // 2] = u - v if u - v >= 0 else u - v + mod
                w = w * wlen % mod
        length <<= 1

    if invert:
        n_1 = pow(n, mod - 2, mod)  # обернений до n за простим модулем
        for i in range(n):
            a[i] = a[i] * n_1 % mod
```

```typescript
const mod = 7340033;
const root = 5;
const root_1 = 4404020;
const root_pw = 1 << 20;

// number зберігає цілі точно лише до 2^53, а mod * mod ≈ 5.4e13 переповнює
// цю межу, тому проміжне множення за модулем виконуємо через bigint.
function mulmod(a: number, b: number): number {
  return Number((BigInt(a) * BigInt(b)) % BigInt(mod));
}

function powmod(a: number, e: number): number {
  let res = 1, base = a % mod;
  while (e > 0) {
    if (e & 1) res = mulmod(res, base);
    base = mulmod(base, base);
    e >>= 1;
  }
  return res;
}

function fft(a: number[], invert: boolean): void {
  const n = a.length;

  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;

    if (i < j) [a[i], a[j]] = [a[j], a[i]];
  }

  for (let len = 2; len <= n; len <<= 1) {
    let wlen = invert ? root_1 : root;
    for (let i = len; i < root_pw; i <<= 1) wlen = mulmod(wlen, wlen);

    for (let i = 0; i < n; i += len) {
      let w = 1;
      for (let j = 0; j < len / 2; j++) {
        const u = a[i + j];
        const v = mulmod(a[i + j + len / 2], w);
        a[i + j] = u + v < mod ? u + v : u + v - mod;
        a[i + j + len / 2] = u - v >= 0 ? u - v : u - v + mod;
        w = mulmod(w, wlen);
      }
    }
  }

  if (invert) {
    const n_1 = powmod(n, mod - 2); // обернений до n за простим модулем
    for (let i = 0; i < n; i++) a[i] = mulmod(a[i], n_1);
  }
}
```

```go
const (
	mod    = 7340033
	root   = 5
	root1  = 4404020
	rootPw = 1 << 20
)

// inverse обчислює обернений елемент за простим модулем через малу теорему Ферма.
func inverse(a, p int) int {
	res, base, e := 1, a%p, p-2
	for e > 0 {
		if e&1 == 1 {
			res = int(int64(res) * int64(base) % int64(p))
		}
		base = int(int64(base) * int64(base) % int64(p))
		e >>= 1
	}
	return res
}

func fft(a []int, invert bool) {
	n := len(a)

	for i, j := 1, 0; i < n; i++ {
		bit := n >> 1
		for ; j&bit != 0; bit >>= 1 {
			j ^= bit
		}
		j ^= bit

		if i < j {
			a[i], a[j] = a[j], a[i]
		}
	}

	for length := 2; length <= n; length <<= 1 {
		wlen := root
		if invert {
			wlen = root1
		}
		for i := length; i < rootPw; i <<= 1 {
			wlen = int(int64(wlen) * int64(wlen) % mod)
		}

		for i := 0; i < n; i += length {
			w := 1
			for j := 0; j < length/2; j++ {
				u := a[i+j]
				v := int(int64(a[i+j+length/2]) * int64(w) % mod)
				if u+v < mod {
					a[i+j] = u + v
				} else {
					a[i+j] = u + v - mod
				}
				if u-v >= 0 {
					a[i+j+length/2] = u - v
				} else {
					a[i+j+length/2] = u - v + mod
				}
				w = int(int64(w) * int64(wlen) % mod)
			}
		}
	}

	if invert {
		n1 := inverse(n, mod)
		for i := range a {
			a[i] = int(int64(a[i]) * int64(n1) % mod)
		}
	}
}
```

</CodeTabs>

Тут функція `inverse` обчислює обернений елемент за модулем (див. [Обернений елемент за модулем](module-inverse.md)).
Константи `mod`, `root`, `root_pw` визначають модуль і корінь, а `root_1` — це обернений до `root` за модулем `mod`.

На практиці ця реалізація повільніша за реалізацію з комплексними числами (через величезну кількість операцій за модулем), але має деякі переваги, як-от менше використання пам'яті та відсутність похибок заокруглення.

## Множення з довільним модулем \{#multiplication-with-arbitrary-modulus}

Тут ми хочемо досягти тієї самої мети, що й у попередньому розділі.
Перемножити два многочлени $A(x)$ і $B(x)$ та обчислити коефіцієнти за модулем деякого числа $M$.
Теоретико-числове перетворення працює лише для певних простих чисел.
А як бути у випадку, коли модуль не має потрібного вигляду?

Одним із варіантів було б виконати кілька теоретико-числових перетворень з різними простими числами вигляду $c 2^k + 1$, а потім застосувати [китайську теорему про остачі](chinese-remainder-theorem.md), щоб обчислити остаточні коефіцієнти.

Інший варіант — розподілити кожен із многочленів $A(x)$ і $B(x)$ на два менші многочлени

$$
\begin{align}
A(x) &= A_1(x) + A_2(x) \cdot C \\
B(x) &= B_1(x) + B_2(x) \cdot C
\end{align}
$$

з $C \approx \sqrt{M}$.

Тоді добуток $A(x)$ і $B(x)$ можна подати як:

$$
A(x) \cdot B(x) = A_1(x) \cdot B_1(x) + \left(A_1(x) \cdot B_2(x) + A_2(x) \cdot B_1(x)\right)\cdot C + \left(A_2(x) \cdot B_2(x)\right)\cdot C^2
$$

Многочлени $A_1(x)$, $A_2(x)$, $B_1(x)$ і $B_2(x)$ містять лише коефіцієнти, менші за $\sqrt{M}$, тому коефіцієнти всіх добутків, що з'являються, менші за $M \cdot n$, що зазвичай достатньо мало, щоб обробити це типовими типами з рухомою комою.

Отже, цей підхід вимагає обчислення добутків многочленів із меншими коефіцієнтами (за допомогою звичайних FFT та оберненого FFT), а потім вихідний добуток можна відновити за допомогою модульного додавання та множення за час $O(n)$.

## Застосування \{#applications}

DFT можна використовувати у величезній різноманітності інших задач, які на перший погляд не мають нічого спільного з множенням многочленів.

### Усі можливі суми \{#all-possible-sums}

Нам дано два масиви $a[]$ і $b[]$.
Нам потрібно знайти всі можливі суми $a[i] + b[j]$ і для кожної суми порахувати, як часто вона трапляється.

Наприклад, для $a = [1,~ 2,~ 3]$ і $b = [2,~ 4]$ отримуємо:
суму $3$ можна отримати $1$ способом, суму $4$ також $1$ способом, $5$ — $2$ способами, $6$ — $1$, $7$ — $1$.

Будуємо для масивів $a$ і $b$ два многочлени $A$ і $B$.
Числа масиву виступатимуть як показники степеня в многочлені ($a[i] \Rightarrow x^{a[i]}$); а коефіцієнтом при цьому члені буде те, як часто число трапляється в масиві.

Тоді, перемноживши ці два многочлени за час $O(n \log n)$, ми отримуємо многочлен $C$, де показники степеня скажуть нам, які суми можна отримати, а коефіцієнти — як часто.
Продемонструймо це на прикладі:

$$
(1 x^1 + 1 x^2 + 1 x^3) (1 x^2 + 1 x^4) = 1 x^3 + 1 x^4 + 2 x^5 + 1 x^6 + 1 x^7
$$

### Усі можливі скалярні добутки \{#all-possible-scalar-products}

Нам дано два масиви $a[]$ і $b[]$ довжини $n$.
Нам потрібно обчислити добутки $a$ з кожним циклічним зсувом $b$.

Ми генеруємо два нові масиви розміру $2n$:
розвертаємо $a$ і дописуємо до нього $n$ нулів.
А $b$ просто дописуємо сам до себе.
Коли ми перемножуємо ці два масиви як многочлени й дивимося на коефіцієнти $c[n-1],~ c[n],~ \dots,~ c[2n-2]$ добутку $c$, отримуємо:

$$
c[k] = \sum_{i+j=k} a[i] b[j]
$$

І оскільки всі елементи $a[i] = 0$ при $i \ge n$:

$$
c[k] = \sum_{i=0}^{n-1} a[i] b[k-i]
$$

Легко бачити, що ця сума — це просто скалярний добуток вектора $a$ з $(k - (n - 1))$-м циклічним зсувом $b$ уліво.
Таким чином, ці коефіцієнти є відповіддю на задачу, і ми все ж змогли отримати її за час $O(n \log n)$.
Зауважте, що $c[2n-1]$ також дає нам $n$-й циклічний зсув, але це те саме, що й $0$-й циклічний зсув, тож нам не потрібно враховувати його окремо у нашій відповіді.

### Дві смуги \{#two-stripes}

Нам дано дві булеві смуги (циклічні масиви зі значень $0$ і $1$) $a$ і $b$.
Ми хочемо знайти всі способи прикласти першу смугу до другої так, щоб у жодній позиції $1$ першої смуги не стояла поряд із $1$ другої смуги.

Ця задача насправді не дуже відрізняється від попередньої.
Прикладання двох смуг просто означає, що ми виконуємо циклічний зсув другого масиву, і ми можемо прикласти дві смуги, якщо скалярний добуток двох масивів дорівнює $0$.

### Зіставлення рядків \{#string-matching}

Нам дано два рядки: текст $T$ і взірець $P$, що складаються з малих літер.
Нам потрібно обчислити всі входження взірця в текст.

Ми створюємо многочлен для кожного рядка ($T[i]$ і $P[I]$ — числа між $0$ і $25$, що відповідають $26$ літерам алфавіту):

$$
A(x) = a_0 x^0 + a_1 x^1 + \dots + a_{n-1} x^{n-1}, \quad n = |T|
$$

з

$$
a_i = \cos(\alpha_i) + i \sin(\alpha_i), \quad \alpha_i = \frac{2 \pi T[i]}{26}.
$$

І

$$
B(x) = b_0 x^0 + b_1 x^1 + \dots + b_{m-1} x^{m-1}, \quad m = |P|
$$

з

$$
b_i = \cos(\beta_i) - i \sin(\beta_i), \quad \beta_i = \frac{2 \pi P[m-i-1]}{26}.
$$

Зауважте, що вираз $P[m-i-1]$ явно розвертає взірець.

$(m-1+i)$-ті коефіцієнти добутку двох многочленів $C(x) = A(x) \cdot B(x)$ скажуть нам, чи з'являється взірець у тексті в позиції $i$.

$$
c_{m-1+i} = \sum_{j = 0}^{m-1} a_{i+j} \cdot b_{m-1-j} = \sum_{j=0}^{m-1} \left(\cos(\alpha_{i+j}) + i \sin(\alpha_{i+j})\right) \cdot \left(\cos(\beta_j) - i \sin(\beta_j)\right)
$$

з $\alpha_{i+j} = \frac{2 \pi T[i+j]}{26}$ та $\beta_j = \frac{2 \pi P[j]}{26}$

Якщо є збіг, то $T[i+j] = P[j]$, а отже, $\alpha_{i+j} = \beta_j$.
Це дає (використовуючи основну тригонометричну тотожність):

$$
\begin{align}
c_{m-1+i} &= \sum_{j = 0}^{m-1}  \left(\cos(\alpha_{i+j}) + i \sin(\alpha_{i+j})\right) \cdot \left(\cos(\alpha_{i+j}) - i \sin(\alpha_{i+j})\right) \\
&= \sum_{j = 0}^{m-1} \cos(\alpha_{i+j})^2 + \sin(\alpha_{i+j})^2 = \sum_{j = 0}^{m-1} 1 = m
\end{align}
$$

Якщо збігу немає, то принаймні один символ відрізняється, через що один із добутків $a_{i+1} \cdot b_{m-1-j}$ не дорівнює $1$, що призводить до коефіцієнта $c_{m-1+i} \ne m$.

### Зіставлення рядків із символами підстановки \{#string-matching-with-wildcards}

Це розширення попередньої задачі.
Цього разу ми дозволяємо, щоб взірець містив символ підстановки $\*$, який може зіставитися з будь-якою можливою літерою.
Наприклад, взірець $a*c$ з'являється в тексті $abccaacc$ рівно у трьох позиціях: в індексі $0$, індексі $4$ та індексі $5$.

Ми створюємо точнісінько ті самі многочлени, за винятком того, що встановлюємо $b_i = 0$, якщо $P[m-i-1] = *$.
Якщо $x$ — кількість символів підстановки в $P$, то ми матимемо збіг $P$ у $T$ в індексі $i$, якщо $c_{m-1+i} = m - x$.

## Задачі для практики \{#practice-problems}

- [SPOJ - POLYMUL](http://www.spoj.com/problems/POLYMUL/)
- [SPOJ - MAXMATCH](http://www.spoj.com/problems/MAXMATCH/)
- [SPOJ - ADAMATCH](http://www.spoj.com/problems/ADAMATCH/)
- [Codeforces - Yet Another String Matching Problem](http://codeforces.com/problemset/problem/954/I)
- [Codeforces - Lightsabers (hard)](http://codeforces.com/problemset/problem/958/F3)
- [Codeforces - Running Competition](https://codeforces.com/contest/1398/problem/G)
- [Kattis - A+B Problem](https://open.kattis.com/problems/aplusb)
- [Kattis - K-Inversions](https://open.kattis.com/problems/kinversions)
- [Codeforces - Dasha and cyclic table](http://codeforces.com/contest/754/problem/E)
- [CodeChef - Expected Number of Customers](https://www.codechef.com/COOK112A/problems/MMNN01)
- [CodeChef - Power Sum](https://www.codechef.com/SEPT19A/problems/PSUM)
- [Codeforces - Centroid Probabilities](https://codeforces.com/problemset/problem/1667/E)

## Відеоматеріали \{#video}

- [The Fast Fourier Transform (FFT): Most Ingenious Algorithm Ever? — Reducible](https://www.youtube.com/watch?v=h7apO7q16V0) (28 хв, англійською)
