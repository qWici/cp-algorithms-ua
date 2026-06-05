# Довжина об'єднання відрізків

Задано $n$ відрізків на прямій, кожен з яких описано парою координат $(a_{i1}, a_{i2})$.
Нам потрібно знайти довжину їхнього об'єднання.

Наведений нижче алгоритм запропонував Klee у 1977 році.
Він працює за $O(n\log n)$ і доведено, що він асимптотично оптимальний.

## Розв'язок \{#solution}

Зберігаємо в масиві $x$ кінці всіх відрізків, відсортовані за їхніми значеннями.
А додатково зберігаємо, чи це лівий кінець, чи правий кінець відрізка.
Тепер проходимо по масиву, підтримуючи лічильник $c$ наразі відкритих відрізків.
Щоразу, коли поточний елемент є лівим кінцем, ми збільшуємо цей лічильник, а в іншому випадку зменшуємо його.
Щоб обчислити відповідь, ми беремо довжину між двома останніми значеннями $x$, тобто $x_i - x_{i-1}$, щоразу, коли переходимо до нової координати й при цьому наразі відкрито принаймні один відрізок.

## Реалізація \{#implementation}

<CodeTabs>

```cpp
int length_union(const vector<pair<int, int>> &a) {
    int n = a.size();
    vector<pair<int, bool>> x(n*2);
    for (int i = 0; i < n; i++) {
        x[i*2] = {a[i].first, false};
        x[i*2+1] = {a[i].second, true};
    }

    sort(x.begin(), x.end());

    int result = 0;
    int c = 0;
    for (int i = 0; i < n * 2; i++) {
        if (i > 0 && x[i].first > x[i-1].first && c > 0)
            result += x[i].first - x[i-1].first;
        if (x[i].second)
            c--;
        else
            c++;
    }
    return result;
}
```

```python
def length_union(a):
    n = len(a)
    # Кожен кінець: (координата, чи правий кінець).
    # False (лівий) сортується перед True (правий) за рівних координат.
    x = []
    for left, right in a:
        x.append((left, False))
        x.append((right, True))

    x.sort()

    result = 0
    c = 0  # кількість наразі відкритих відрізків
    for i in range(n * 2):
        if i > 0 and x[i][0] > x[i - 1][0] and c > 0:
            result += x[i][0] - x[i - 1][0]
        if x[i][1]:
            c -= 1
        else:
            c += 1
    return result
```

```typescript
function lengthUnion(a: [number, number][]): number {
    const n = a.length;
    // Кожен кінець: [координата, чи правий кінець].
    const x: [number, boolean][] = new Array(n * 2);
    for (let i = 0; i < n; i++) {
        x[i * 2] = [a[i][0], false];
        x[i * 2 + 1] = [a[i][1], true];
    }

    // Сортуємо за координатою; за рівних — лівий (false) перед правим (true).
    x.sort((p, q) => p[0] - q[0] || Number(p[1]) - Number(q[1]));

    let result = 0;
    let c = 0; // кількість наразі відкритих відрізків
    for (let i = 0; i < n * 2; i++) {
        if (i > 0 && x[i][0] > x[i - 1][0] && c > 0)
            result += x[i][0] - x[i - 1][0];
        if (x[i][1])
            c--;
        else
            c++;
    }
    return result;
}
```

```go
func lengthUnion(a [][2]int) int {
    n := len(a)
    // Кожен кінець: координата та прапорець правого кінця.
    type endpoint struct {
        coord int
        right bool
    }
    x := make([]endpoint, n*2)
    for i := 0; i < n; i++ {
        x[i*2] = endpoint{a[i][0], false}
        x[i*2+1] = endpoint{a[i][1], true}
    }

    // Сортуємо за координатою; за рівних — лівий (false) перед правим (true).
    sort.Slice(x, func(i, j int) bool {
        if x[i].coord != x[j].coord {
            return x[i].coord < x[j].coord
        }
        return !x[i].right && x[j].right
    })

    result := 0
    c := 0 // кількість наразі відкритих відрізків
    for i := 0; i < n*2; i++ {
        if i > 0 && x[i].coord > x[i-1].coord && c > 0 {
            result += x[i].coord - x[i-1].coord
        }
        if x[i].right {
            c--
        } else {
            c++
        }
    }
    return result
}
```

</CodeTabs>
