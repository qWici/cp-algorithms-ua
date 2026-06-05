# Перевірка перетину двох відрізків

Задано два відрізки $(a, b)$ і $(c, d)$.
Потрібно перевірити, чи вони перетинаються.
Звісно, можна знайти їхній перетин і перевірити, чи він не порожній, але для відрізків з цілочисловими координатами цього не вдасться зробити в цілих числах.
Підхід, описаний тут, працює в цілих числах.

:::tip[Коли підходить цей алгоритм?]
- Потрібно перевірити перетин саме **однієї пари** відрізків, а не знайти перетин серед $n$ відрізків? *(якщо ні → [Пошук пари відрізків, що перетинаються](intersecting_segments.md))*
- Координати кінців цілочислові й важлива точна відповідь без <Term tip="Дробові числа (тип double) у комп'ютері зберігаються наближено, тому обчислення з ними накопичують крихітні неточності — це й називають похибкою рухомої коми. Робота в цілих числах дозволяє її уникнути.">похибок із рухомою комою</Term>?
- Достатньо факту «перетинаються чи ні», а не координат самої точки перетину? *(якщо ні → [Точка перетину прямих](lines-intersection.md))*
:::

## Алгоритм \{#algorithm}

Спершу розглянемо випадок, коли відрізки лежать на одній прямій.
У цьому випадку достатньо перевірити, чи перетинаються їхні <Term tip="Проєкція відрізка на вісь — це його «тінь» на цій осі, тобто проміжок значень відповідної координати. Перевіряємо окремо тіні на горизонтальній і вертикальній осях.">проєкції</Term> на $Ox$ і $Oy$.
В іншому випадку точки $a$ і $b$ не повинні <Term tip="Якщо обидва кінці одного відрізка опиняються з одного боку від прямої, на якій лежить інший відрізок, то перетину бути не може. Для перетину кінці мають розташовуватися по різні боки.">лежати по один бік</Term> від прямої $(c, d)$, а точки $c$ і $d$ не повинні лежати по один бік від прямої $(a, b)$.
Це можна перевірити за допомогою кількох <Term tip="Знак векторного добутку показує, з якого боку від прямої лежить точка: для точок з різних боків знаки будуть протилежними.">векторних добутків</Term>.

## Реалізація \{#implementation}

Наведений алгоритм реалізовано для цілочислових точок. Звісно, його легко змінити, щоб він працював із числами з рухомою комою (double).

<CodeTabs>

```cpp
struct pt {
    long long x, y;
    pt() {}
    pt(long long _x, long long _y) : x(_x), y(_y) {}
    pt operator-(const pt& p) const { return pt(x - p.x, y - p.y); }
    long long cross(const pt& p) const { return x * p.y - y * p.x; }
    long long cross(const pt& a, const pt& b) const { return (a - *this).cross(b - *this); }
};

int sgn(const long long& x) { return x >= 0 ? x ? 1 : 0 : -1; }

bool inter1(long long a, long long b, long long c, long long d) {
    if (a > b)
        swap(a, b);
    if (c > d)
        swap(c, d);
    return max(a, c) <= min(b, d);
}

bool check_inter(const pt& a, const pt& b, const pt& c, const pt& d) {
    if (c.cross(a, d) == 0 && c.cross(b, d) == 0)
        return inter1(a.x, b.x, c.x, d.x) && inter1(a.y, b.y, c.y, d.y);
    return sgn(a.cross(b, c)) != sgn(a.cross(b, d)) &&
           sgn(c.cross(d, a)) != sgn(c.cross(d, b));
}
```

```python
from dataclasses import dataclass


@dataclass
class Pt:
    x: int
    y: int

    def __sub__(self, p: "Pt") -> "Pt":
        return Pt(self.x - p.x, self.y - p.y)

    # векторний добуток двох векторів
    def cross(self, p: "Pt") -> int:
        return self.x * p.y - self.y * p.x

    # векторний добуток векторів (a - self) і (b - self)
    def cross3(self, a: "Pt", b: "Pt") -> int:
        return (a - self).cross(b - self)


def sgn(x: int) -> int:
    return 1 if x > 0 else (0 if x == 0 else -1)


# перевірка перетину проєкцій відрізків [a, b] і [c, d] на одну вісь
def inter1(a: int, b: int, c: int, d: int) -> bool:
    if a > b:
        a, b = b, a
    if c > d:
        c, d = d, c
    return max(a, c) <= min(b, d)


def check_inter(a: Pt, b: Pt, c: Pt, d: Pt) -> bool:
    # колінеарний випадок: усі чотири точки на одній прямій
    if c.cross3(a, d) == 0 and c.cross3(b, d) == 0:
        return inter1(a.x, b.x, c.x, d.x) and inter1(a.y, b.y, c.y, d.y)
    return (sgn(a.cross3(b, c)) != sgn(a.cross3(b, d)) and
            sgn(c.cross3(d, a)) != sgn(c.cross3(d, b)))
```

```typescript
// у JavaScript координати краще тримати як bigint,
// щоб уникнути переповнення при множенні великих координат
class Pt {
    constructor(public x: bigint, public y: bigint) {}

    sub(p: Pt): Pt {
        return new Pt(this.x - p.x, this.y - p.y);
    }

    // векторний добуток двох векторів
    cross(p: Pt): bigint {
        return this.x * p.y - this.y * p.x;
    }

    // векторний добуток векторів (a - this) і (b - this)
    cross3(a: Pt, b: Pt): bigint {
        return a.sub(this).cross(b.sub(this));
    }
}

function sgn(x: bigint): number {
    return x > 0n ? 1 : x === 0n ? 0 : -1;
}

// перевірка перетину проєкцій відрізків [a, b] і [c, d] на одну вісь
function inter1(a: bigint, b: bigint, c: bigint, d: bigint): boolean {
    if (a > b) [a, b] = [b, a];
    if (c > d) [c, d] = [d, c];
    const lo = a > c ? a : c;
    const hi = b < d ? b : d;
    return lo <= hi;
}

function checkInter(a: Pt, b: Pt, c: Pt, d: Pt): boolean {
    // колінеарний випадок: усі чотири точки на одній прямій
    if (c.cross3(a, d) === 0n && c.cross3(b, d) === 0n) {
        return inter1(a.x, b.x, c.x, d.x) && inter1(a.y, b.y, c.y, d.y);
    }
    return sgn(a.cross3(b, c)) !== sgn(a.cross3(b, d)) &&
           sgn(c.cross3(d, a)) !== sgn(c.cross3(d, b));
}
```

```go
package main

type Pt struct {
	x, y int64
}

func (p Pt) sub(q Pt) Pt {
	return Pt{p.x - q.x, p.y - q.y}
}

// векторний добуток двох векторів
func (p Pt) cross(q Pt) int64 {
	return p.x*q.y - p.y*q.x
}

// векторний добуток векторів (a - p) і (b - p)
func (p Pt) cross3(a, b Pt) int64 {
	return a.sub(p).cross(b.sub(p))
}

func sgn(x int64) int {
	if x > 0 {
		return 1
	}
	if x == 0 {
		return 0
	}
	return -1
}

// перевірка перетину проєкцій відрізків [a, b] і [c, d] на одну вісь
func inter1(a, b, c, d int64) bool {
	if a > b {
		a, b = b, a
	}
	if c > d {
		c, d = d, c
	}
	lo, hi := a, b
	if c > lo {
		lo = c
	}
	if d < hi {
		hi = d
	}
	return lo <= hi
}

func checkInter(a, b, c, d Pt) bool {
	// колінеарний випадок: усі чотири точки на одній прямій
	if c.cross3(a, d) == 0 && c.cross3(b, d) == 0 {
		return inter1(a.x, b.x, c.x, d.x) && inter1(a.y, b.y, c.y, d.y)
	}
	return sgn(a.cross3(b, c)) != sgn(a.cross3(b, d)) &&
		sgn(c.cross3(d, a)) != sgn(c.cross3(d, b))
}
```

</CodeTabs>

## Відеоматеріали \{#video}

<YouTubeEmbed id="bbTqI0oqL5U" title="Check if two line segments intersect — Techdose" />
