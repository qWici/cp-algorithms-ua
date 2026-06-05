# Оптимальний розклад робіт за їхніми дедлайнами та тривалостями

Нехай у нас є набір робіт, і для кожної роботи ми знаємо її дедлайн та тривалість. Виконання роботи не можна перервати до її завершення. Потрібно скласти такий розклад, щоб виконати якнайбільше робіт.

## Розв'язок \{#solving}

Алгоритм розв'язання — **жадібний**. Відсортуймо всі роботи за їхніми дедлайнами та переглядаймо їх у порядку спадання. Також створімо чергу $q$, у яку поступово додаватимемо роботи й діставатимемо ту, що має найменший час виконання (наприклад, можна використати set або priority_queue). Спочатку $q$ порожня.

Нехай ми розглядаємо $i$-ту роботу. Насамперед додаймо її до $q$. Розгляньмо проміжок часу між дедлайном $i$-ї роботи та дедлайном $i-1$-ї роботи. Це відрізок деякої довжини $T$. Діставатимемо роботи з $q$ (у порядку зростання їхньої залишкової тривалості) і виконуватимемо їх, поки весь відрізок $T$ не заповниться. Важливо: якщо в якийсь момент дістану роботу можна виконати лише частково до заповнення відрізка $T$, то виконуємо цю роботу частково настільки, наскільки це можливо, тобто протягом часу $T$, а залишкову частину роботи кладемо назад у $q$.

Після завершення роботи алгоритму ми отримаємо оптимальний розв'язок (або принаймні один з кількох розв'язків). Час роботи алгоритму — $O(n \log n)$.

## Реалізація \{#implementation}

Наведена нижче функція приймає вектор робіт (кожна з яких складається з дедлайну, тривалості та індексу роботи) і обчислює вектор, що містить усі індекси використаних робіт в оптимальному розкладі.
Зверніть увагу, що вам усе ще потрібно відсортувати ці роботи за їхнім дедлайном, якщо ви хочете явно записати план.

<CodeTabs>

```cpp
struct Job {
    int deadline, duration, idx;

    bool operator<(Job o) const {
        return deadline < o.deadline;
    }
};

vector<int> compute_schedule(vector<Job> jobs) {
    sort(jobs.begin(), jobs.end());

    set<pair<int,int>> s;
    vector<int> schedule;
    for (int i = jobs.size()-1; i >= 0; i--) {
        int t = jobs[i].deadline - (i ? jobs[i-1].deadline : 0);
        s.insert(make_pair(jobs[i].duration, jobs[i].idx));
        while (t && !s.empty()) {
            auto it = s.begin();
            if (it->first <= t) {
                t -= it->first;
                schedule.push_back(it->second);
            } else {
                s.insert(make_pair(it->first - t, it->second));
                t = 0;
            }
            s.erase(it);
        }
    }
    return schedule;
}
```

```python
from sortedcontainers import SortedList


def compute_schedule(jobs: list[tuple[int, int, int]]) -> list[int]:
    # jobs: список (дедлайн, тривалість, індекс)
    jobs = sorted(jobs)  # сортуємо за дедлайном (за зростанням)

    # SortedList тримає пари (залишкова тривалість, індекс) у порядку зростання
    s = SortedList()
    schedule: list[int] = []
    for i in range(len(jobs) - 1, -1, -1):
        t = jobs[i][0] - (jobs[i - 1][0] if i else 0)
        s.add((jobs[i][1], jobs[i][2]))
        while t and s:
            duration, idx = s.pop(0)  # робота з найменшою залишковою тривалістю
            if duration <= t:
                t -= duration
                schedule.append(idx)
            else:
                # виконуємо роботу частково, решту кладемо назад у чергу
                s.add((duration - t, idx))
                t = 0
    return schedule
```

```typescript
// jobs: масив [дедлайн, тривалість, індекс]
function computeSchedule(jobs: [number, number, number][]): number[] {
  // сортуємо за дедлайном (за зростанням)
  jobs = [...jobs].sort((a, b) => a[0] - b[0]);

  // s тримаємо відсортованим за зростанням пари [залишкова тривалість, індекс]
  const s: [number, number][] = [];
  const cmp = (a: [number, number], b: [number, number]) =>
    a[0] - b[0] || a[1] - b[1];
  const insert = (x: [number, number]) => {
    let lo = 0,
      hi = s.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cmp(s[mid], x) < 0) lo = mid + 1;
      else hi = mid;
    }
    s.splice(lo, 0, x);
  };

  const schedule: number[] = [];
  for (let i = jobs.length - 1; i >= 0; i--) {
    let t = jobs[i][0] - (i ? jobs[i - 1][0] : 0);
    insert([jobs[i][1], jobs[i][2]]);
    while (t && s.length) {
      const [duration, idx] = s.shift()!; // найменша залишкова тривалість
      if (duration <= t) {
        t -= duration;
        schedule.push(idx);
      } else {
        // виконуємо роботу частково, решту повертаємо в чергу
        insert([duration - t, idx]);
        t = 0;
      }
    }
  }
  return schedule;
}
```

```go
import (
    "sort"
)

// Job: дедлайн, тривалість, індекс
type Job struct {
    Deadline, Duration, Idx int
}

func computeSchedule(jobs []Job) []int {
    // сортуємо за дедлайном (за зростанням)
    sort.Slice(jobs, func(i, j int) bool {
        return jobs[i].Deadline < jobs[j].Deadline
    })

    // s тримаємо відсортованим за зростанням пари (залишкова тривалість, індекс)
    type item struct{ duration, idx int }
    less := func(a, b item) bool {
        if a.duration != b.duration {
            return a.duration < b.duration
        }
        return a.idx < b.idx
    }
    var s []item
    insert := func(x item) {
        pos := sort.Search(len(s), func(k int) bool { return !less(s[k], x) })
        s = append(s, item{})
        copy(s[pos+1:], s[pos:])
        s[pos] = x
    }

    var schedule []int
    for i := len(jobs) - 1; i >= 0; i-- {
        t := jobs[i].Deadline
        if i > 0 {
            t -= jobs[i-1].Deadline
        }
        insert(item{jobs[i].Duration, jobs[i].Idx})
        for t > 0 && len(s) > 0 {
            cur := s[0] // найменша залишкова тривалість
            s = s[1:]
            if cur.duration <= t {
                t -= cur.duration
                schedule = append(schedule, cur.idx)
            } else {
                // виконуємо роботу частково, решту повертаємо в чергу
                insert(item{cur.duration - t, cur.idx})
                t = 0
            }
        }
    }
    return schedule
}
```

</CodeTabs>
