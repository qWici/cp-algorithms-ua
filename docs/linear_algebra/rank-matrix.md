# Знаходження рангу матриці

**Ранг матриці** — це найбільша кількість лінійно незалежних рядків/стовпців матриці. Ранг визначено не лише для квадратних матриць.

Ранг матриці можна також означити як найбільший порядок будь-якого ненульового мінора матриці.

Нехай матриця прямокутна і має розмір $N \times M$.
Зауважимо, що якщо матриця квадратна і її визначник ненульовий, то ранг дорівнює $N$ ($=M$); інакше він буде меншим. Загалом ранг матриці не перевищує $\min (N, M)$.

## Алгоритм \{#algorithm}

Шукати ранг можна за допомогою [методу Гаусса](linear-system-gauss.md). Ми виконуватимемо ті самі операції, що й при розв'язуванні системи чи знаходженні її визначника. Але якщо на якомусь кроці в $i$-му стовпці серед рядків, які ми ще не вибрали, немає жодного з ненульовим елементом, то ми пропускаємо цей крок.
Інакше, якщо на $i$-му кроці ми знайшли рядок з ненульовим елементом у $i$-му стовпці, то ми позначаємо цей рядок як вибраний, збільшуємо ранг на одиницю (спочатку ранг встановлено рівним $0$) і виконуємо звичайні операції віднімання цього рядка від решти.

## Складність \{#complexity}

Цей алгоритм працює за $\mathcal{O}(n^3)$.

## Реалізація \{#implementation}

<CodeTabs>

```cpp
const double EPS = 1E-9;

int compute_rank(vector<vector<double>> A) {
    int n = A.size();
    int m = A[0].size();

    int rank = 0;
    vector<bool> row_selected(n, false);
    for (int i = 0; i < m; ++i) {
        int j;
        for (j = 0; j < n; ++j) {
            if (!row_selected[j] && abs(A[j][i]) > EPS)
                break;
        }

        if (j != n) {
            ++rank;
            row_selected[j] = true;
            for (int p = i + 1; p < m; ++p)
                A[j][p] /= A[j][i];
            for (int k = 0; k < n; ++k) {
                if (k != j && abs(A[k][i]) > EPS) {
                    for (int p = i + 1; p < m; ++p)
                        A[k][p] -= A[j][p] * A[k][i];
                }
            }
        }
    }
    return rank;
}
```

```python
EPS = 1e-9


def compute_rank(A):
    # працюємо з копією, щоб не псувати вхідну матрицю
    A = [row[:] for row in A]
    n = len(A)
    m = len(A[0])

    rank = 0
    row_selected = [False] * n
    for i in range(m):
        # шукаємо ще не вибраний рядок з ненульовим елементом у i-му стовпці
        j = 0
        while j < n:
            if not row_selected[j] and abs(A[j][i]) > EPS:
                break
            j += 1

        if j != n:
            rank += 1
            row_selected[j] = True
            for p in range(i + 1, m):
                A[j][p] /= A[j][i]
            for k in range(n):
                if k != j and abs(A[k][i]) > EPS:
                    for p in range(i + 1, m):
                        A[k][p] -= A[j][p] * A[k][i]
    return rank
```

```typescript
const EPS = 1e-9;

function computeRank(input: number[][]): number {
    // працюємо з копією, щоб не псувати вхідну матрицю
    const A = input.map(row => row.slice());
    const n = A.length;
    const m = A[0].length;

    let rank = 0;
    const rowSelected: boolean[] = new Array(n).fill(false);
    for (let i = 0; i < m; ++i) {
        // шукаємо ще не вибраний рядок з ненульовим елементом у i-му стовпці
        let j = 0;
        for (; j < n; ++j) {
            if (!rowSelected[j] && Math.abs(A[j][i]) > EPS)
                break;
        }

        if (j !== n) {
            ++rank;
            rowSelected[j] = true;
            for (let p = i + 1; p < m; ++p)
                A[j][p] /= A[j][i];
            for (let k = 0; k < n; ++k) {
                if (k !== j && Math.abs(A[k][i]) > EPS) {
                    for (let p = i + 1; p < m; ++p)
                        A[k][p] -= A[j][p] * A[k][i];
                }
            }
        }
    }
    return rank;
}
```

```go
const EPS = 1e-9

func computeRank(input [][]float64) int {
    // працюємо з копією, щоб не псувати вхідну матрицю
    A := make([][]float64, len(input))
    for i := range input {
        A[i] = append([]float64(nil), input[i]...)
    }
    n := len(A)
    m := len(A[0])

    rank := 0
    rowSelected := make([]bool, n)
    for i := 0; i < m; i++ {
        // шукаємо ще не вибраний рядок з ненульовим елементом у i-му стовпці
        j := 0
        for ; j < n; j++ {
            if !rowSelected[j] && math.Abs(A[j][i]) > EPS {
                break
            }
        }

        if j != n {
            rank++
            rowSelected[j] = true
            for p := i + 1; p < m; p++ {
                A[j][p] /= A[j][i]
            }
            for k := 0; k < n; k++ {
                if k != j && math.Abs(A[k][i]) > EPS {
                    for p := i + 1; p < m; p++ {
                        A[k][p] -= A[j][p] * A[k][i]
                    }
                }
            }
        }
    }
    return rank
}
```

</CodeTabs>
## Задачі \{#problems}
 * [TIMUS1041 Nikifor](http://acm.timus.ru/problem.aspx?space=1&num=1041)

## Відеоматеріали \{#video}

<YouTubeEmbed id="Sc7OY62lQ9U" title="The rank of a matrix — Prime Newtons" />
