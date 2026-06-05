# Обчислення визначника матриці методом Гаусса

Задача: дано матрицю $A$ розміру $N \times N$. Обчислити її визначник.

## Алгоритм \{#algorithm}

Ми використовуємо ідеї [методу Гаусса для розв'язування систем лінійних рівнянь](linear-system-gauss.md)

Ми виконуватимемо ті самі кроки, що й у розв'язуванні систем лінійних рівнянь, за винятком лише ділення поточного рядка на $a_{ij}$. Ці операції не змінюватимуть абсолютне значення визначника матриці. Проте, коли ми міняємо місцями два рядки матриці, знак визначника може змінитися.

Застосувавши метод Гаусса до матриці, ми отримуємо діагональну матрицю, визначник якої — це просто добуток елементів на діагоналі. Знак, як уже зазначалося, можна визначити за кількістю переставлених рядків (якщо вона непарна, то знак визначника слід змінити на протилежний). Отже, ми можемо використати алгоритм Гаусса для обчислення визначника матриці зі складністю $O(N^3)$.

Слід зауважити, що якщо в якийсь момент ми не знаходимо ненульової клітинки в поточному стовпці, алгоритм має зупинитися і повернути 0.

## Реалізація \{#implementation}

<CodeTabs>

```cpp
const double EPS = 1E-9;
int n;
vector < vector<double> > a (n, vector<double> (n));

double det = 1;
for (int i=0; i<n; ++i) {
	int k = i;
	for (int j=i+1; j<n; ++j)
		if (abs (a[j][i]) > abs (a[k][i]))
			k = j;
	if (abs (a[k][i]) < EPS) {
		det = 0;
		break;
	}
	swap (a[i], a[k]);
	if (i != k)
		det = -det;
	det *= a[i][i];
	for (int j=i+1; j<n; ++j)
		a[i][j] /= a[i][i];
	for (int j=0; j<n; ++j)
		if (j != i && abs (a[j][i]) > EPS)
			for (int k=i+1; k<n; ++k)
				a[j][k] -= a[i][k] * a[j][i];
}

cout << det;
```

```python
EPS = 1e-9

def determinant(a: list[list[float]]) -> float:
    n = len(a)
    det = 1.0
    for i in range(n):
        # Шукаємо рядок із найбільшим за модулем елементом у стовпці i
        k = i
        for j in range(i + 1, n):
            if abs(a[j][i]) > abs(a[k][i]):
                k = j
        if abs(a[k][i]) < EPS:
            return 0.0  # стовпець нульовий — матриця вироджена
        a[i], a[k] = a[k], a[i]
        if i != k:
            det = -det  # перестановка рядків змінює знак визначника
        det *= a[i][i]
        for j in range(i + 1, n):
            a[i][j] /= a[i][i]
        for j in range(n):
            if j != i and abs(a[j][i]) > EPS:
                for col in range(i + 1, n):
                    a[j][col] -= a[i][col] * a[j][i]
    return det
```

```typescript
const EPS = 1e-9;

function determinant(a: number[][]): number {
  const n = a.length;
  let det = 1;
  for (let i = 0; i < n; i++) {
    // Шукаємо рядок із найбільшим за модулем елементом у стовпці i
    let k = i;
    for (let j = i + 1; j < n; j++) {
      if (Math.abs(a[j][i]) > Math.abs(a[k][i])) {
        k = j;
      }
    }
    if (Math.abs(a[k][i]) < EPS) {
      return 0; // стовпець нульовий — матриця вироджена
    }
    [a[i], a[k]] = [a[k], a[i]];
    if (i !== k) {
      det = -det; // перестановка рядків змінює знак визначника
    }
    det *= a[i][i];
    for (let j = i + 1; j < n; j++) {
      a[i][j] /= a[i][i];
    }
    for (let j = 0; j < n; j++) {
      if (j !== i && Math.abs(a[j][i]) > EPS) {
        for (let col = i + 1; col < n; col++) {
          a[j][col] -= a[i][col] * a[j][i];
        }
      }
    }
  }
  return det;
}
```

```go
const EPS = 1e-9

func determinant(a [][]float64) float64 {
	n := len(a)
	det := 1.0
	for i := 0; i < n; i++ {
		// Шукаємо рядок із найбільшим за модулем елементом у стовпці i
		k := i
		for j := i + 1; j < n; j++ {
			if math.Abs(a[j][i]) > math.Abs(a[k][i]) {
				k = j
			}
		}
		if math.Abs(a[k][i]) < EPS {
			return 0 // стовпець нульовий — матриця вироджена
		}
		a[i], a[k] = a[k], a[i]
		if i != k {
			det = -det // перестановка рядків змінює знак визначника
		}
		det *= a[i][i]
		for j := i + 1; j < n; j++ {
			a[i][j] /= a[i][i]
		}
		for j := 0; j < n; j++ {
			if j != i && math.Abs(a[j][i]) > EPS {
				for col := i + 1; col < n; col++ {
					a[j][col] -= a[i][col] * a[j][i]
				}
			}
		}
	}
	return det
}
```

</CodeTabs>

## Задачі для практики \{#practice-problems}
* [Codeforces - Wizards and Bets](http://codeforces.com/contest/167/problem/E)
