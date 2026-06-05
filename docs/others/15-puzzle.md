# Гра в п'ятнашки (15-puzzle): існування розв'язку

Ця гра відбувається на дошці розміром $4 \times 4$. На дошці розташовано $15$ фішок, пронумерованих від 1 до 15. Одна клітинка лишається порожньою (позначається нулем 0). Потрібно привести дошку до показаного нижче положення, послідовно переміщуючи одну з фішок на вільне місце:

$$
\begin{matrix} 1 & 2 & 3 & 4 \\ 5 & 6 & 7 & 8 \\ 9 & 10 & 11 & 12 \\ 13 & 14 & 15 & 0 \end{matrix}
$$

Гру «15 Puzzle» створив Noyes Chapman у 1880 році.

## Існування розв'язку \{#existence-of-the-solution}

Розглянемо таку задачу: задано положення на дошці, потрібно визначити, чи існує послідовність ходів, яка приводить до розв'язку.

Припустимо, що ми маємо деяке положення на дошці:

$$
\begin{matrix} a_1 & a_2 & a_3 & a_4 \\ a_5 & a_6 & a_7 & a_8 \\ a_9 & a_{10} & a_{11} & a_{12} \\ a_{13} & a_{14} & a_{15} & a_{16} \end{matrix}
$$

де один з елементів дорівнює нулю та позначає порожню клітинку $a_z  = 0$

Розглянемо перестановку:

$$
a_1 a_2 ... a_{z-1} a_{z+1} ... a_{15} a_{16}
$$

тобто перестановку чисел, що відповідає положенню на дошці без нульового елемента

Нехай $N$ — кількість інверсій у цій перестановці (тобто кількість таких елементів $a_i$  та $a_j$, що $i < j$, але $a_i  > a_j$).

Нехай $K$ — індекс рядка, у якому розташований порожній елемент (тобто, за нашою домовленістю, $K = (z - 1) \div \ 4 + 1$).

Тоді **розв'язок існує тоді й лише тоді, коли $N + K$ парне**.

## Реалізація \{#implementation}

Описаний вище алгоритм можна проілюструвати таким програмним кодом:

<CodeTabs>

```cpp
int a[16];
for (int i=0; i<16; ++i)
    cin >> a[i];

int inv = 0;
for (int i=0; i<16; ++i)
    if (a[i])
        for (int j=0; j<i; ++j)
            if (a[j] > a[i])
                ++inv;
for (int i=0; i<16; ++i)
    if (a[i] == 0)
        inv += 1 + i / 4;

puts ((inv & 1) ? "No Solution" : "Solution Exists");
```

```python
a = [int(x) for x in input().split()]  # 16 чисел через пробіл

inv = 0
for i in range(16):
    if a[i]:
        for j in range(i):
            if a[j] > a[i]:
                inv += 1
for i in range(16):
    if a[i] == 0:
        inv += 1 + i // 4

print("No Solution" if inv & 1 else "Solution Exists")
```

```typescript
// a — масив із 16 чисел (зчитаних зі вводу)
let inv = 0;
for (let i = 0; i < 16; ++i)
  if (a[i])
    for (let j = 0; j < i; ++j)
      if (a[j] > a[i])
        ++inv;
for (let i = 0; i < 16; ++i)
  if (a[i] === 0)
    inv += 1 + Math.floor(i / 4);

console.log(inv & 1 ? "No Solution" : "Solution Exists");
```

```go
// a — масив із 16 чисел (зчитаних зі вводу)
inv := 0
for i := 0; i < 16; i++ {
    if a[i] != 0 {
        for j := 0; j < i; j++ {
            if a[j] > a[i] {
                inv++
            }
        }
    }
}
for i := 0; i < 16; i++ {
    if a[i] == 0 {
        inv += 1 + i/4
    }
}

if inv&1 != 0 {
    fmt.Println("No Solution")
} else {
    fmt.Println("Solution Exists")
}
```

</CodeTabs>

## Доведення \{#proof}

У 1879 році Johnson довів, що якщо $N + K$ непарне, то розв'язку не існує, а того ж року Story довів, що всі положення, для яких $N + K$ парне, мають розв'язок.

Однак усі ці доведення були доволі складними.

У 1999 році Archer запропонував значно простіше доведення (його статтю можна завантажити [тут](http://www.cs.cmu.edu/afs/cs/academic/class/15859-f01/www/notes/15-puzzle.pdf)).

## Задачі для практики \{#practice-problems}

* [Hackerrank - N-puzzle](https://www.hackerrank.com/challenges/n-puzzle)

## Відеоматеріали \{#video}

- [Parity of permutations, impossible puzzles and the magical determinant — Mathologer](https://www.youtube.com/watch?v=rUiulWItECQ) (39 хв, англійською)
