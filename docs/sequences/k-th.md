# $K$-та порядкова статистика за $O(N)$

Маємо масив $A$ розміру $N$ і число $K$. Задача полягає в тому, щоб знайти $K$-те за величиною число в масиві, тобто $K$-ту порядкову статистику.

Базова ідея — використати ідею алгоритму швидкого сортування. Насправді сам алгоритм простий, складніше довести, що він працює в середньому за $O(N)$, на відміну від швидкого сортування.

## Реалізація (нерекурсивна) \{#implementation-not-recursive}

<CodeTabs>

```cpp
template <class T>
T order_statistics (std::vector<T> a, unsigned n, unsigned k)
{
    using std::swap;
    for (unsigned l=1, r=n; ; )
    {
        if (r <= l+1)
        {
            // розмір поточної частини дорівнює 1 або 2, тож відповідь легко знайти
            if (r == l+1 && a[r] < a[l])
                swap (a[l], a[r]);
            return a[k];
        }

        // впорядковуємо a[l], a[l+1], a[r]
        unsigned mid = (l + r) >> 1;
        swap (a[mid], a[l+1]);
        if (a[l] > a[r])
            swap (a[l], a[r]);
        if (a[l+1] > a[r])
            swap (a[l+1], a[r]);
        if (a[l] > a[l+1])
            swap (a[l], a[l+1]);

        // виконуємо розбиття
        // бар'єром є a[l + 1], тобто медіана серед a[l], a[l + 1], a[r]
        unsigned
            i = l+1,
            j = r;
        const T
            cur = a[l+1];
        for (;;)
        {
            while (a[++i] < cur) ;
            while (a[--j] > cur) ;
            if (i > j)
                break;
            swap (a[i], a[j]);
        }

        // вставляємо бар'єр
        a[l+1] = a[j];
        a[j] = cur;
        
        // продовжуємо працювати в тій частині, яка має містити шуканий елемент
        if (j >= k)
            r = j-1;
        if (j <= k)
            l = i;
    }
}
```

```python
import random


def order_statistics(a: list[int], k: int) -> int:
    # Повертає k-ту порядкову статистику (0-індексовану) масиву a.
    # Працює зі списком-копією, щоб не псувати вхідні дані.
    a = a[:]
    lo, hi = 0, len(a) - 1
    while True:
        if lo >= hi:
            return a[k]
        # Випадковий бар'єр гарантує середній час O(n)
        pivot = a[random.randint(lo, hi)]
        i, j = lo, hi
        # Розбиття Хоара навколо значення pivot
        while i <= j:
            while a[i] < pivot:
                i += 1
            while a[j] > pivot:
                j -= 1
            if i <= j:
                a[i], a[j] = a[j], a[i]
                i += 1
                j -= 1
        # Спускаємось у ту частину, що містить шуканий елемент
        if k <= j:
            hi = j
        elif k >= i:
            lo = i
        else:
            return a[k]
```

```typescript
// Повертає k-ту порядкову статистику (0-індексовану) масиву a.
// Працює з копією, щоб не псувати вхідні дані.
function orderStatistics(arr: number[], k: number): number {
  const a = arr.slice();
  let lo = 0;
  let hi = a.length - 1;
  while (true) {
    if (lo >= hi) {
      return a[k];
    }
    // Випадковий бар'єр гарантує середній час O(n)
    const pivot = a[lo + Math.floor(Math.random() * (hi - lo + 1))];
    let i = lo;
    let j = hi;
    // Розбиття Хоара навколо значення pivot
    while (i <= j) {
      while (a[i] < pivot) i++;
      while (a[j] > pivot) j--;
      if (i <= j) {
        [a[i], a[j]] = [a[j], a[i]];
        i++;
        j--;
      }
    }
    // Спускаємось у ту частину, що містить шуканий елемент
    if (k <= j) {
      hi = j;
    } else if (k >= i) {
      lo = i;
    } else {
      return a[k];
    }
  }
}
```

```go
import "math/rand"

// orderStatistics повертає k-ту порядкову статистику (0-індексовану) масиву a.
// Працює з копією, щоб не псувати вхідні дані.
func orderStatistics(arr []int, k int) int {
    a := make([]int, len(arr))
    copy(a, arr)
    lo, hi := 0, len(a)-1
    for {
        if lo >= hi {
            return a[k]
        }
        // Випадковий бар'єр гарантує середній час O(n)
        pivot := a[lo+rand.Intn(hi-lo+1)]
        i, j := lo, hi
        // Розбиття Хоара навколо значення pivot
        for i <= j {
            for a[i] < pivot {
                i++
            }
            for a[j] > pivot {
                j--
            }
            if i <= j {
                a[i], a[j] = a[j], a[i]
                i++
                j--
            }
        }
        // Спускаємось у ту частину, що містить шуканий елемент
        if k <= j {
            hi = j
        } else if k >= i {
            lo = i
        } else {
            return a[k]
        }
    }
}
```

</CodeTabs>

## Зауваження \{#notes}
* Наведений вище рандомізований алгоритм називається [швидкий вибір (quickselect)](https://en.wikipedia.org/wiki/Quickselect). Перед його викликом слід випадково перемішати $A$ або використовувати випадковий елемент як бар'єр, щоб він працював коректно. Існують також детерміновані алгоритми, які розв'язують зазначену задачу за лінійний час, наприклад [медіана медіан](https://en.wikipedia.org/wiki/Median_of_medians).
* [std::nth_element](https://en.cppreference.com/w/cpp/algorithm/nth_element) розв'язує це в C++, але реалізація в gcc працює в найгіршому випадку за час $O(n \log n )$.
* Пошук $K$ найменших елементів можна звести до пошуку $K$-го елемента з лінійними додатковими витратами, оскільки це саме ті елементи, що менші за $K$-й.

## Задачі для практики \{#practice-problems}
- [Leetcode: Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/description/)
- [CODECHEF: Median](https://www.codechef.com/problems/CD1IT1)

## Відеоматеріали \{#video}

- [Kth Largest Element in an Array - Quick Select — NeetCode](https://www.youtube.com/watch?v=XEmy13g1Qxc) (19 хв, англійською)
