# Алгоритм Рабіна–Карпа для пошуку рядка

Цей алгоритм ґрунтується на ідеї хешування, тож якщо ви не знайомі з хешуванням рядків, зверніться до статті [хешування рядків](string-hashing.md).
 
Цей алгоритм запропонували Рабін і Карп у 1987 році.

Задача: дано два рядки — взірець $s$ і текст $t$. Потрібно визначити, чи трапляється взірець у тексті, і якщо так, то перелічити всі його входження за час $O(|s| + |t|)$.

Алгоритм: обчислюємо хеш для взірця $s$.
Обчислюємо значення хешів для всіх префіксів тексту $t$.
Тепер ми можемо порівняти підрядок довжини $|s|$ зі взірцем $s$ за сталий час, використовуючи обчислені хеші.
Отже, порівнюємо кожен підрядок довжини $|s|$ зі взірцем. Загалом це займе час $O(|t|)$.
Тому остаточна складність алгоритму становить $O(|t| + |s|)$: $O(|s|)$ потрібно для обчислення хешу взірця, а $O(|t|)$ — для порівняння кожного підрядка довжини $|s|$ зі взірцем.

## Реалізація \{#implementation}

<CodeTabs>

```cpp
vector<int> rabin_karp(string const& s, string const& t) {
    const int p = 31; 
    const int m = 1e9 + 9;
    int S = s.size(), T = t.size();

    vector<long long> p_pow(max(S, T)); 
    p_pow[0] = 1; 
    for (int i = 1; i < (int)p_pow.size(); i++) 
        p_pow[i] = (p_pow[i-1] * p) % m;

    vector<long long> h(T + 1, 0); 
    for (int i = 0; i < T; i++)
        h[i+1] = (h[i] + (t[i] - 'a' + 1) * p_pow[i]) % m; 
    long long h_s = 0; 
    for (int i = 0; i < S; i++) 
        h_s = (h_s + (s[i] - 'a' + 1) * p_pow[i]) % m; 

    vector<int> occurrences;
    for (int i = 0; i + S - 1 < T; i++) {
        long long cur_h = (h[i+S] + m - h[i]) % m;
        if (cur_h == h_s * p_pow[i] % m)
            occurrences.push_back(i);
    }
    return occurrences;
}
```

```python
def rabin_karp(s: str, t: str) -> list[int]:
    p = 31
    m = 10**9 + 9
    S, T = len(s), len(t)

    # Степені p за модулем m; у Python int необмеженої точності, переповнення немає
    p_pow = [1] * max(S, T)
    for i in range(1, len(p_pow)):
        p_pow[i] = p_pow[i - 1] * p % m

    # Префіксні хеші тексту: h[i] — хеш t[0..i-1]
    h = [0] * (T + 1)
    for i in range(T):
        h[i + 1] = (h[i] + (ord(t[i]) - ord('a') + 1) * p_pow[i]) % m

    # Хеш взірця
    h_s = 0
    for i in range(S):
        h_s = (h_s + (ord(s[i]) - ord('a') + 1) * p_pow[i]) % m

    occurrences = []
    for i in range(T - S + 1):
        cur_h = (h[i + S] + m - h[i]) % m
        if cur_h == h_s * p_pow[i] % m:
            occurrences.append(i)
    return occurrences
```

```typescript
function rabinKarp(s: string, t: string): number[] {
  // УВАГА: добутки за модулем 1e9+9 перевищують Number.MAX_SAFE_INTEGER
  // (2^53), тому обчислення виконуємо через BigInt, інакше хеші будуть хибні.
  const p = 31n;
  const m = 1000000009n;
  const S = s.length;
  const T = t.length;
  const a = "a".charCodeAt(0);

  // Степені p за модулем m
  const pPow: bigint[] = new Array(Math.max(S, T)).fill(1n);
  for (let i = 1; i < pPow.length; i++) {
    pPow[i] = (pPow[i - 1] * p) % m;
  }

  // Префіксні хеші тексту: h[i] — хеш t[0..i-1]
  const h: bigint[] = new Array(T + 1).fill(0n);
  for (let i = 0; i < T; i++) {
    const c = BigInt(t.charCodeAt(i) - a + 1);
    h[i + 1] = (h[i] + c * pPow[i]) % m;
  }

  // Хеш взірця
  let hS = 0n;
  for (let i = 0; i < S; i++) {
    const c = BigInt(s.charCodeAt(i) - a + 1);
    hS = (hS + c * pPow[i]) % m;
  }

  const occurrences: number[] = [];
  for (let i = 0; i + S - 1 < T; i++) {
    const curH = (h[i + S] + m - h[i]) % m;
    if (curH === (hS * pPow[i]) % m) {
      occurrences.push(i);
    }
  }
  return occurrences;
}
```

```go
func rabinKarp(s, t string) []int {
    const p = 31
    const m = 1e9 + 9
    S, T := len(s), len(t)

    // Степені p за модулем m; int64 вистачає, бо m < 2^30, а добуток < 2^60
    n := S
    if T > n {
        n = T
    }
    pPow := make([]int64, n)
    pPow[0] = 1
    for i := 1; i < len(pPow); i++ {
        pPow[i] = pPow[i-1] * p % m
    }

    // Префіксні хеші тексту: h[i] — хеш t[0..i-1]
    h := make([]int64, T+1)
    for i := 0; i < T; i++ {
        h[i+1] = (h[i] + int64(t[i]-'a'+1)*pPow[i]) % m
    }

    // Хеш взірця
    var hS int64
    for i := 0; i < S; i++ {
        hS = (hS + int64(s[i]-'a'+1)*pPow[i]) % m
    }

    occurrences := []int{}
    for i := 0; i+S-1 < T; i++ {
        curH := (h[i+S] + m - h[i]) % m
        if curH == hS*pPow[i]%m {
            occurrences = append(occurrences, i)
        }
    }
    return occurrences
}
```

</CodeTabs>

## Задачі для практики \{#practice-problems}

* [SPOJ - Pattern Find](http://www.spoj.com/problems/NAJPF/)
* [Codeforces - Good Substrings](http://codeforces.com/problemset/problem/271/D)
* [Codeforces - Palindromic characteristics](https://codeforces.com/problemset/problem/835/D)
* [Leetcode - Longest Duplicate Substring](https://leetcode.com/problems/longest-duplicate-substring/)
