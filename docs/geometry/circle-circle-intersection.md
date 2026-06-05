# Перетин двох кіл

Задано два кола на площині, кожне з яких описане координатами свого центра та радіусом. Знайдіть точки їх перетину (можливі випадки: одна або дві точки, кола не перетинаються або збігаються).

## Розв'язок \{#solution}

Зведемо цю задачу до [задачі про перетин кола та прямої](circle-line-intersection.md).

Без втрати загальності припустимо, що перше коло має центр у початку координат (якщо це не так, ми можемо перенести початок координат у центр першого кола, а під час виведення відповіді відповідно скоригувати координати точок перетину). Маємо систему з двох рівнянь:

$$
x^2+y^2=r_1^2
$$

$$
(x - x_2)^2 + (y - y_2)^2 = r_2^2
$$

Віднімемо перше рівняння від другого, щоб позбутися других степенів змінних:

$$
x^2+y^2=r_1^2
$$

$$
x \cdot (-2x_2) + y \cdot (-2y_2) + (x_2^2+y_2^2+r_1^2-r_2^2) = 0
$$

Отже, ми звели початкову задачу до задачі про знаходження точок перетину першого кола та прямої:

$$
Ax + By + C = 0
$$

$$
\begin{align}
A &= -2x_2 \\
B &= -2y_2 \\
C &= x_2^2+y_2^2+r_1^2-r_2^2
\end{align}
$$

А цю задачу можна розв'язати так, як описано у [відповідній статті](circle-line-intersection.md).

Єдиний вироджений випадок, який нам потрібно розглянути окремо, — це коли центри кіл збігаються. У цьому випадку $x_2=y_2=0$, і рівняння прямої набуде вигляду $C = r_1^2-r_2^2 = 0$. Якщо радіуси кіл однакові, точок перетину нескінченно багато; якщо ж вони різні, перетинів немає.

## Задачі для практики \{#practice-problems}

- [RadarFinder](https://community.topcoder.com/stat?c=problem_statement&pm=7766)
- [Runaway to a shadow - Codeforces Round #357](http://codeforces.com/problemset/problem/681/E)
- [ASC 1 Problem F "Get out!"](http://codeforces.com/gym/100199/problem/F)
- [SPOJ: CIRCINT](http://www.spoj.com/problems/CIRCINT/)
- [UVA - 10301 - Rings and Glue](https://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=1242)
- [Codeforces 933C A Colorful Prospect](https://codeforces.com/problemset/problem/933/C)
- [TIMUS 1429 Biscuits](https://acm.timus.ru/problem.aspx?space=1&num=1429)
