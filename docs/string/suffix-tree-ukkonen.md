# Суфіксне дерево. Алгоритм Укконена

*Ця стаття є заготовкою й не містить детального опису. За описом алгоритму звертайтеся до інших джерел, наприклад до книги [Algorithms on Strings, Trees, and Sequences](https://www.cs.cmu.edu/afs/cs/project/pscico-guyb/realworld/www/slidesF06/cmuonly/gusfield.pdf) Дена Ґасфілда (Dan Gusfield).*

Цей алгоритм будує суфіксне дерево для заданого рядка $s$ довжини $n$ за час $O(n\log(k))$), де $k$ — розмір алфавіту (якщо вважати $k$ константою, асимптотика стає лінійною).

На вхід алгоритму подаються рядок $s$ та його довжина $n$, які передаються як глобальні змінні.

Головна функція `build_tree` будує суфіксне дерево. Воно зберігається у вигляді масиву структур `node`, де `node[0]` — це корінь дерева.

Щоб спростити код, ребра зберігаються в тих самих структурах: для кожної вершини її структура `node` містить інформацію про ребро між нею та її батьком. Загалом кожна `node` зберігає таку інформацію:

* `(l, r)` — ліва і права межі підрядка `s[l..r-1]`, що відповідає ребру до цієї вершини,
* `par` — батьківська вершина,
* `link` — суфіксне посилання,
* `next` — список ребер, що виходять із цієї вершини.

<CodeTabs>

```cpp
string s;
int n;
 
struct node {
	int l, r, par, link;
	map<char,int> next;
 
	node (int l=0, int r=0, int par=-1)
		: l(l), r(r), par(par), link(-1) {}
	int len()  {  return r - l;  }
	int &get (char c) {
		if (!next.count(c))  next[c] = -1;
		return next[c];
	}
};
node t[MAXN];
int sz;
 
struct state {
	int v, pos;
	state (int v, int pos) : v(v), pos(pos)  {}
};
state ptr (0, 0);
 
state go (state st, int l, int r) {
	while (l < r)
		if (st.pos == t[st.v].len()) {
			st = state (t[st.v].get( s[l] ), 0);
			if (st.v == -1)  return st;
		}
		else {
			if (s[ t[st.v].l + st.pos ] != s[l])
				return state (-1, -1);
			if (r-l < t[st.v].len() - st.pos)
				return state (st.v, st.pos + r-l);
			l += t[st.v].len() - st.pos;
			st.pos = t[st.v].len();
		}
	return st;
}
 
int split (state st) {
	if (st.pos == t[st.v].len())
		return st.v;
	if (st.pos == 0)
		return t[st.v].par;
	node v = t[st.v];
	int id = sz++;
	t[id] = node (v.l, v.l+st.pos, v.par);
	t[v.par].get( s[v.l] ) = id;
	t[id].get( s[v.l+st.pos] ) = st.v;
	t[st.v].par = id;
	t[st.v].l += st.pos;
	return id;
}
 
int get_link (int v) {
	if (t[v].link != -1)  return t[v].link;
	if (t[v].par == -1)  return 0;
	int to = get_link (t[v].par);
	return t[v].link = split (go (state(to,t[to].len()), t[v].l + (t[v].par==0), t[v].r));
}
 
void tree_extend (int pos) {
	for(;;) {
		state nptr = go (ptr, pos, pos+1);
		if (nptr.v != -1) {
			ptr = nptr;
			return;
		}
 
		int mid = split (ptr);
		int leaf = sz++;
		t[leaf] = node (pos, n, mid);
		t[mid].get( s[pos] ) = leaf;
 
		ptr.v = get_link (mid);
		ptr.pos = t[ptr.v].len();
		if (!mid)  break;
	}
}
 
void build_tree() {
	sz = 1;
	for (int i=0; i<n; ++i)
		tree_extend (i);
}
```

```python
# Вхідний рядок і його довжина — глобальні змінні
s = ""
n = 0


class Node:
    def __init__(self, l=0, r=0, par=-1):
        self.l = l            # ліва і права межі підрядка s[l..r-1]
        self.r = r
        self.par = par        # батьківська вершина
        self.link = -1        # суфіксне посилання
        self.next = {}        # переходи: символ -> індекс вершини

    def len(self):
        return self.r - self.l

    def get(self, c):
        # Аналог int& get(char c): повертаємо перехід (-1 якщо немає)
        return self.next.get(c, -1)


t = []   # масив вершин
sz = 0


class State:
    def __init__(self, v, pos):
        self.v = v
        self.pos = pos


ptr = State(0, 0)


def go(st, l, r):
    while l < r:
        if st.pos == t[st.v].len():
            st = State(t[st.v].get(s[l]), 0)
            if st.v == -1:
                return st
        else:
            if s[t[st.v].l + st.pos] != s[l]:
                return State(-1, -1)
            if r - l < t[st.v].len() - st.pos:
                return State(st.v, st.pos + r - l)
            l += t[st.v].len() - st.pos
            st.pos = t[st.v].len()
    return st


def split(st):
    global sz
    if st.pos == t[st.v].len():
        return st.v
    if st.pos == 0:
        return t[st.v].par
    v = t[st.v]
    id_ = sz
    sz += 1
    t[id_] = Node(v.l, v.l + st.pos, v.par)
    t[v.par].next[s[v.l]] = id_
    t[id_].next[s[v.l + st.pos]] = st.v
    t[st.v].par = id_
    t[st.v].l += st.pos
    return id_


def get_link(v):
    if t[v].link != -1:
        return t[v].link
    if t[v].par == -1:
        return 0
    to = get_link(t[v].par)
    # +1 до лівої межі, якщо батько — корінь
    t[v].link = split(go(State(to, t[to].len()),
                        t[v].l + (1 if t[v].par == 0 else 0), t[v].r))
    return t[v].link


def tree_extend(pos):
    global ptr, sz
    while True:
        nptr = go(ptr, pos, pos + 1)
        if nptr.v != -1:
            ptr = nptr
            return

        mid = split(ptr)
        leaf = sz
        sz += 1
        t[leaf] = Node(pos, n, mid)
        t[mid].next[s[pos]] = leaf

        ptr.v = get_link(mid)
        ptr.pos = t[ptr.v].len()
        if not mid:
            break


def build_tree():
    global sz, t, ptr
    sz = 1
    # вершин у суфіксному дереві не більше 2*n
    t = [Node() for _ in range(2 * n + 5)]
    ptr = State(0, 0)
    for i in range(n):
        tree_extend(i)
```

```typescript
// Вхідний рядок і його довжина — глобальні змінні
let s = "";
let n = 0;

class Node {
  l: number;
  r: number;
  par: number;
  link: number;
  next: Map<string, number>; // переходи: символ -> індекс вершини

  constructor(l = 0, r = 0, par = -1) {
    this.l = l; // ліва і права межі підрядка s[l..r-1]
    this.r = r;
    this.par = par; // батьківська вершина
    this.link = -1; // суфіксне посилання
    this.next = new Map();
  }

  len(): number {
    return this.r - this.l;
  }

  get(c: string): number {
    // Повертаємо перехід за символом (-1 якщо немає)
    return this.next.has(c) ? this.next.get(c)! : -1;
  }
}

let t: Node[] = [];
let sz = 0;

class State {
  v: number;
  pos: number;
  constructor(v: number, pos: number) {
    this.v = v;
    this.pos = pos;
  }
}

let ptr = new State(0, 0);

function go(st: State, l: number, r: number): State {
  while (l < r) {
    if (st.pos === t[st.v].len()) {
      st = new State(t[st.v].get(s[l]), 0);
      if (st.v === -1) return st;
    } else {
      if (s[t[st.v].l + st.pos] !== s[l]) return new State(-1, -1);
      if (r - l < t[st.v].len() - st.pos) return new State(st.v, st.pos + r - l);
      l += t[st.v].len() - st.pos;
      st.pos = t[st.v].len();
    }
  }
  return st;
}

function split(st: State): number {
  if (st.pos === t[st.v].len()) return st.v;
  if (st.pos === 0) return t[st.v].par;
  const v = t[st.v];
  const id = sz++;
  t[id] = new Node(v.l, v.l + st.pos, v.par);
  t[v.par].next.set(s[v.l], id);
  t[id].next.set(s[v.l + st.pos], st.v);
  t[st.v].par = id;
  t[st.v].l += st.pos;
  return id;
}

function getLink(v: number): number {
  if (t[v].link !== -1) return t[v].link;
  if (t[v].par === -1) return 0;
  const to = getLink(t[v].par);
  // +1 до лівої межі, якщо батько — корінь
  t[v].link = split(
    go(new State(to, t[to].len()), t[v].l + (t[v].par === 0 ? 1 : 0), t[v].r),
  );
  return t[v].link;
}

function treeExtend(pos: number): void {
  for (;;) {
    const nptr = go(ptr, pos, pos + 1);
    if (nptr.v !== -1) {
      ptr = nptr;
      return;
    }

    const mid = split(ptr);
    const leaf = sz++;
    t[leaf] = new Node(pos, n, mid);
    t[mid].next.set(s[pos], leaf);

    ptr.v = getLink(mid);
    ptr.pos = t[ptr.v].len();
    if (!mid) break;
  }
}

function buildTree(): void {
  sz = 1;
  // вершин у суфіксному дереві не більше 2*n
  t = [];
  for (let i = 0; i < 2 * n + 5; ++i) t.push(new Node());
  ptr = new State(0, 0);
  for (let i = 0; i < n; ++i) treeExtend(i);
}
```

```go
// Вхідний рядок і його довжина — глобальні змінні
var s string
var n int

type node struct {
	l, r, par, link int
	next            map[byte]int // переходи: символ -> індекс вершини
}

func newNode(l, r, par int) node {
	return node{l: l, r: r, par: par, link: -1, next: map[byte]int{}}
}

func (nd node) length() int { return nd.r - nd.l } // аналог len()

func (nd *node) get(c byte) int { // повертаємо перехід (-1 якщо немає)
	if v, ok := nd.next[c]; ok {
		return v
	}
	return -1
}

var t []node
var sz int

type state struct {
	v, pos int
}

var ptr = state{0, 0}

func goState(st state, l, r int) state {
	for l < r {
		if st.pos == t[st.v].length() {
			st = state{t[st.v].get(s[l]), 0}
			if st.v == -1 {
				return st
			}
		} else {
			if s[t[st.v].l+st.pos] != s[l] {
				return state{-1, -1}
			}
			if r-l < t[st.v].length()-st.pos {
				return state{st.v, st.pos + r - l}
			}
			l += t[st.v].length() - st.pos
			st.pos = t[st.v].length()
		}
	}
	return st
}

func split(st state) int {
	if st.pos == t[st.v].length() {
		return st.v
	}
	if st.pos == 0 {
		return t[st.v].par
	}
	v := t[st.v]
	id := sz
	sz++
	t[id] = newNode(v.l, v.l+st.pos, v.par)
	t[v.par].next[s[v.l]] = id
	t[id].next[s[v.l+st.pos]] = st.v
	t[st.v].par = id
	t[st.v].l += st.pos
	return id
}

func getLink(v int) int {
	if t[v].link != -1 {
		return t[v].link
	}
	if t[v].par == -1 {
		return 0
	}
	to := getLink(t[v].par)
	// +1 до лівої межі, якщо батько — корінь
	extra := 0
	if t[v].par == 0 {
		extra = 1
	}
	t[v].link = split(goState(state{to, t[to].length()}, t[v].l+extra, t[v].r))
	return t[v].link
}

func treeExtend(pos int) {
	for {
		nptr := goState(ptr, pos, pos+1)
		if nptr.v != -1 {
			ptr = nptr
			return
		}

		mid := split(ptr)
		leaf := sz
		sz++
		t[leaf] = newNode(pos, n, mid)
		t[mid].next[s[pos]] = leaf

		ptr.v = getLink(mid)
		ptr.pos = t[ptr.v].length()
		if mid == 0 {
			break
		}
	}
}

func buildTree() {
	sz = 1
	// вершин у суфіксному дереві не більше 2*n
	t = make([]node, 2*n+5)
	for i := range t {
		t[i] = newNode(0, 0, -1)
	}
	ptr = state{0, 0}
	for i := 0; i < n; i++ {
		treeExtend(i)
	}
}
```

</CodeTabs>

## Стиснена реалізація \{#compressed-implementation}

Цю стиснену реалізацію запропонував [freopen](http://codeforces.com/profile/freopen).

<CodeTabs>

```cpp
const int N=1000000,INF=1000000000;
string a;
int t[N][26],l[N],r[N],p[N],s[N],tv,tp,ts,la;
 
void ukkadd (int c) {
	suff:;
	if (r[tv]<tp) {
		if (t[tv][c]==-1) { t[tv][c]=ts;  l[ts]=la;
			p[ts++]=tv;  tv=s[tv];  tp=r[tv]+1;  goto suff; }
		tv=t[tv][c]; tp=l[tv];
	}
	if (tp==-1 || c==a[tp]-'a') tp++; else {
		l[ts+1]=la;  p[ts+1]=ts;
		l[ts]=l[tv];  r[ts]=tp-1;  p[ts]=p[tv];  t[ts][c]=ts+1;  t[ts][a[tp]-'a']=tv;
		l[tv]=tp;  p[tv]=ts;  t[p[ts]][a[l[ts]]-'a']=ts;  ts+=2;
		tv=s[p[ts-2]];  tp=l[ts-2];
		while (tp<=r[ts-2]) {  tv=t[tv][a[tp]-'a'];  tp+=r[tv]-l[tv]+1;}
		if (tp==r[ts-2]+1)  s[ts-2]=tv;  else s[ts-2]=ts; 
		tp=r[tv]-(tp-r[ts-2])+2;  goto suff;
	}
}
 
void build() {
	ts=2;
	tv=0;
	tp=0;
	fill(r,r+N,(int)a.size()-1);
	s[0]=1;
	l[0]=-1;
	r[0]=-1;
	l[1]=-1;
	r[1]=-1;
	memset (t, -1, sizeof t);
	fill(t[1],t[1]+26,0);
	for (la=0; la<(int)a.size(); ++la)
		ukkadd (a[la]-'a');
}
```

```python
N = 1000000
INF = 1000000000

a = ""
# масив переходів t[вершина][літера], межі l/r, батько p, суфіксне посилання s
t = []
l = [0] * N
r = [0] * N
p = [0] * N
s = [0] * N
tv = tp = ts = la = 0


def ukkadd(c):
    global tv, tp, ts
    while True:  # мітка suff: — повертаємося сюди при переході до суфікса
        if r[tv] < tp:
            if t[tv][c] == -1:
                t[tv][c] = ts
                l[ts] = la
                p[ts] = tv
                ts += 1
                tv = s[tv]
                tp = r[tv] + 1
                continue  # goto suff
            tv = t[tv][c]
            tp = l[tv]
        if tp == -1 or c == ord(a[tp]) - ord('a'):
            tp += 1
            return
        l[ts + 1] = la
        p[ts + 1] = ts
        l[ts] = l[tv]
        r[ts] = tp - 1
        p[ts] = p[tv]
        t[ts][c] = ts + 1
        t[ts][ord(a[tp]) - ord('a')] = tv
        l[tv] = tp
        p[tv] = ts
        t[p[ts]][ord(a[l[ts]]) - ord('a')] = ts
        ts += 2
        tv = s[p[ts - 2]]
        tp = l[ts - 2]
        while tp <= r[ts - 2]:
            tv = t[tv][ord(a[tp]) - ord('a')]
            tp += r[tv] - l[tv] + 1
        if tp == r[ts - 2] + 1:
            s[ts - 2] = tv
        else:
            s[ts - 2] = ts
        tp = r[tv] - (tp - r[ts - 2]) + 2
        # goto suff


def build():
    global tv, tp, ts, la, t
    ts = 2
    tv = 0
    tp = 0
    # масив переходів виділяємо під фактичний розмір (у C++ це статичний t[N][26])
    t = [[-1] * 26 for _ in range(N)]
    for i in range(N):
        r[i] = len(a) - 1
    s[0] = 1
    l[0] = -1
    r[0] = -1
    l[1] = -1
    r[1] = -1
    for j in range(26):
        t[1][j] = 0
    for la in range(len(a)):
        ukkadd(ord(a[la]) - ord('a'))
```

```typescript
const N = 1000000;
const INF = 1000000000;

let a = "";
// масив переходів t[вершина][літера], межі l/r, батько p, суфіксне посилання s
let t: number[][] = [];
let l: number[] = new Array(N).fill(0);
let r: number[] = new Array(N).fill(0);
let p: number[] = new Array(N).fill(0);
let s: number[] = new Array(N).fill(0);
let tv = 0,
  tp = 0,
  ts = 0,
  la = 0;

const A = "a".charCodeAt(0);

function ukkadd(c: number): void {
  for (;;) {
    // мітка suff: — повертаємося сюди при переході до суфікса
    if (r[tv] < tp) {
      if (t[tv][c] === -1) {
        t[tv][c] = ts;
        l[ts] = la;
        p[ts++] = tv;
        tv = s[tv];
        tp = r[tv] + 1;
        continue; // goto suff
      }
      tv = t[tv][c];
      tp = l[tv];
    }
    if (tp === -1 || c === a.charCodeAt(tp) - A) {
      tp++;
      return;
    }
    l[ts + 1] = la;
    p[ts + 1] = ts;
    l[ts] = l[tv];
    r[ts] = tp - 1;
    p[ts] = p[tv];
    t[ts][c] = ts + 1;
    t[ts][a.charCodeAt(tp) - A] = tv;
    l[tv] = tp;
    p[tv] = ts;
    t[p[ts]][a.charCodeAt(l[ts]) - A] = ts;
    ts += 2;
    tv = s[p[ts - 2]];
    tp = l[ts - 2];
    while (tp <= r[ts - 2]) {
      tv = t[tv][a.charCodeAt(tp) - A];
      tp += r[tv] - l[tv] + 1;
    }
    if (tp === r[ts - 2] + 1) s[ts - 2] = tv;
    else s[ts - 2] = ts;
    tp = r[tv] - (tp - r[ts - 2]) + 2;
    // goto suff
  }
}

function build(): void {
  ts = 2;
  tv = 0;
  tp = 0;
  // масив переходів виділяємо під фактичний розмір (у C++ це статичний t[N][26])
  t = Array.from({ length: N }, () => new Array(26).fill(-1));
  for (let i = 0; i < N; ++i) r[i] = a.length - 1;
  s[0] = 1;
  l[0] = -1;
  r[0] = -1;
  l[1] = -1;
  r[1] = -1;
  for (let j = 0; j < 26; ++j) t[1][j] = 0;
  for (la = 0; la < a.length; ++la) ukkadd(a.charCodeAt(la) - A);
}
```

```go
const N = 1000000
const INF = 1000000000

var a string

// масив переходів t[вершина][літера], межі l/r, батько p, суфіксне посилання s
var (
	t              [][]int
	l, r, p, s     = make([]int, N), make([]int, N), make([]int, N), make([]int, N)
	tv, tp, ts, la int
)

func ukkadd(c int) {
	for { // мітка suff: — повертаємося сюди при переході до суфікса
		if r[tv] < tp {
			if t[tv][c] == -1 {
				t[tv][c] = ts
				l[ts] = la
				p[ts] = tv
				ts++
				tv = s[tv]
				tp = r[tv] + 1
				continue // goto suff
			}
			tv = t[tv][c]
			tp = l[tv]
		}
		if tp == -1 || c == int(a[tp])-'a' {
			tp++
			return
		}
		l[ts+1] = la
		p[ts+1] = ts
		l[ts] = l[tv]
		r[ts] = tp - 1
		p[ts] = p[tv]
		t[ts][c] = ts + 1
		t[ts][int(a[tp])-'a'] = tv
		l[tv] = tp
		p[tv] = ts
		t[p[ts]][int(a[l[ts]])-'a'] = ts
		ts += 2
		tv = s[p[ts-2]]
		tp = l[ts-2]
		for tp <= r[ts-2] {
			tv = t[tv][int(a[tp])-'a']
			tp += r[tv] - l[tv] + 1
		}
		if tp == r[ts-2]+1 {
			s[ts-2] = tv
		} else {
			s[ts-2] = ts
		}
		tp = r[tv] - (tp - r[ts-2]) + 2
		// goto suff
	}
}

func build() {
	ts = 2
	tv = 0
	tp = 0
	// масив переходів виділяємо під фактичний розмір (у C++ це статичний t[N][26])
	t = make([][]int, N)
	for i := range t {
		t[i] = make([]int, 26)
		for j := range t[i] {
			t[i][j] = -1
		}
	}
	for i := 0; i < N; i++ {
		r[i] = len(a) - 1
	}
	s[0] = 1
	l[0] = -1
	r[0] = -1
	l[1] = -1
	r[1] = -1
	for j := 0; j < 26; j++ {
		t[1][j] = 0
	}
	for la = 0; la < len(a); la++ {
		ukkadd(int(a[la]) - 'a')
	}
}
```

</CodeTabs>

Той самий код із коментарями:

<CodeTabs>

```cpp
const int N=1000000,    // максимально можлива кількість вершин у суфіксному дереві
	INF=1000000000; // константа нескінченності
string a;       // вхідний рядок, для якого будується суфіксне дерево
int t[N][26],   // масив переходів (стан, літера)
	l[N],   // ліва...
	r[N],   // ...та права межі підрядка a, що відповідає вхідному ребру
	p[N],   // батько вершини
	s[N],   // суфіксне посилання
	tv,     // вершина поточного суфікса (якщо ми посеред ребра, то нижня вершина ребра)
	tp,     // позиція в рядку, що відповідає позиції на ребрі (між l[tv] і r[tv] включно)
	ts,     // кількість вершин
	la;     // поточний символ у рядку
 
void ukkadd(int c) { // додати символ s до дерева
	suff:;      // сюди ми повертатимемося після кожного переходу до суфікса (і знову додаватимемо символ)
	if (r[tv]<tp) { // перевіряємо, чи ми ще в межах поточного ребра
		// якщо ні, знаходимо наступне ребро. Якщо його не існує, створюємо листок і додаємо його до дерева
		if (t[tv][c]==-1) {t[tv][c]=ts;l[ts]=la;p[ts++]=tv;tv=s[tv];tp=r[tv]+1;goto suff;}
		tv=t[tv][c];tp=l[tv];
	} // інакше просто переходимо до наступного ребра
	if (tp==-1 || c==a[tp]-'a')
		tp++; // якщо літера на ребрі дорівнює c, спускаємося цим ребром
	else { 
		// інакше розбиваємо ребро на два із серединою у вершині ts
		l[ts]=l[tv];r[ts]=tp-1;p[ts]=p[tv];t[ts][a[tp]-'a']=tv;
		// додаємо листок ts+1. Він відповідає переходу через c.
		t[ts][c]=ts+1;l[ts+1]=la;p[ts+1]=ts;
		// оновлюємо інформацію про поточну вершину — не забуваємо позначити ts як батька tv
		l[tv]=tp;p[tv]=ts;t[p[ts]][a[l[ts]]-'a']=ts;ts+=2;
		// готуємося до спуску
		// tp позначатиме, де ми перебуваємо в поточному суфіксі
		tv=s[p[ts-2]];tp=l[ts-2];
		// поки поточний суфікс не вичерпано, спускаємося
		while (tp<=r[ts-2]) {tv=t[tv][a[tp]-'a'];tp+=r[tv]-l[tv]+1;}
		// якщо ми у вершині, додаємо до неї суфіксне посилання, інакше додаємо посилання до ts
		// (ts ми створимо на наступній ітерації).
		if (tp==r[ts-2]+1) s[ts-2]=tv; else s[ts-2]=ts; 
		// додаємо tp до нового ребра й повертаємося, щоб додати літеру до суфікса
		tp=r[tv]-(tp-r[ts-2])+2;goto suff;
	}
}
 
void build() {
	ts=2;
	tv=0;
	tp=0;
	fill(r,r+N,(int)a.size()-1);
	// ініціалізуємо дані для кореня дерева
	s[0]=1;
	l[0]=-1;
	r[0]=-1;
	l[1]=-1;
	r[1]=-1;
	memset (t, -1, sizeof t);
	fill(t[1],t[1]+26,0);
	// додаємо текст до дерева, літера за літерою
	for (la=0; la<(int)a.size(); ++la)
		ukkadd (a[la]-'a');
}
```

```python
N = 1000000        # максимально можлива кількість вершин у суфіксному дереві
INF = 1000000000   # константа нескінченності

a = ""             # вхідний рядок, для якого будується суфіксне дерево
t = []             # масив переходів (стан, літера)
l = [0] * N        # ліва...
r = [0] * N        # ...та права межі підрядка a, що відповідає вхідному ребру
p = [0] * N        # батько вершини
s = [0] * N        # суфіксне посилання
tv = 0             # вершина поточного суфікса (якщо посеред ребра — нижня вершина ребра)
tp = 0             # позиція в рядку, що відповідає позиції на ребрі (між l[tv] і r[tv] включно)
ts = 0             # кількість вершин
la = 0             # поточний символ у рядку


def ukkadd(c):     # додати символ c до дерева
    global tv, tp, ts
    while True:    # сюди ми повертатимемося після кожного переходу до суфікса (і знову додаватимемо символ)
        if r[tv] < tp:  # перевіряємо, чи ми ще в межах поточного ребра
            # якщо ні, знаходимо наступне ребро. Якщо його немає, створюємо листок і додаємо його до дерева
            if t[tv][c] == -1:
                t[tv][c] = ts
                l[ts] = la
                p[ts] = tv
                ts += 1
                tv = s[tv]
                tp = r[tv] + 1
                continue  # goto suff
            tv = t[tv][c]
            tp = l[tv]
        # інакше просто переходимо до наступного ребра
        if tp == -1 or c == ord(a[tp]) - ord('a'):
            tp += 1  # якщо літера на ребрі дорівнює c, спускаємося цим ребром
            return
        # інакше розбиваємо ребро на два із серединою у вершині ts
        l[ts] = l[tv]
        r[ts] = tp - 1
        p[ts] = p[tv]
        t[ts][ord(a[tp]) - ord('a')] = tv
        # додаємо листок ts+1. Він відповідає переходу через c.
        t[ts][c] = ts + 1
        l[ts + 1] = la
        p[ts + 1] = ts
        # оновлюємо інформацію про поточну вершину — не забуваємо позначити ts як батька tv
        l[tv] = tp
        p[tv] = ts
        t[p[ts]][ord(a[l[ts]]) - ord('a')] = ts
        ts += 2
        # готуємося до спуску; tp позначатиме, де ми перебуваємо в поточному суфіксі
        tv = s[p[ts - 2]]
        tp = l[ts - 2]
        # поки поточний суфікс не вичерпано, спускаємося
        while tp <= r[ts - 2]:
            tv = t[tv][ord(a[tp]) - ord('a')]
            tp += r[tv] - l[tv] + 1
        # якщо ми у вершині, додаємо до неї суфіксне посилання, інакше додаємо посилання до ts
        # (ts ми створимо на наступній ітерації).
        if tp == r[ts - 2] + 1:
            s[ts - 2] = tv
        else:
            s[ts - 2] = ts
        # додаємо tp до нового ребра й повертаємося, щоб додати літеру до суфікса
        tp = r[tv] - (tp - r[ts - 2]) + 2
        # goto suff


def build():
    global tv, tp, ts, la, t
    ts = 2
    tv = 0
    tp = 0
    t = [[-1] * 26 for _ in range(N)]
    for i in range(N):
        r[i] = len(a) - 1
    # ініціалізуємо дані для кореня дерева
    s[0] = 1
    l[0] = -1
    r[0] = -1
    l[1] = -1
    r[1] = -1
    for j in range(26):
        t[1][j] = 0
    # додаємо текст до дерева, літера за літерою
    for la in range(len(a)):
        ukkadd(ord(a[la]) - ord('a'))
```

```typescript
const N = 1000000; // максимально можлива кількість вершин у суфіксному дереві
const INF = 1000000000; // константа нескінченності

let a = ""; // вхідний рядок, для якого будується суфіксне дерево
let t: number[][] = []; // масив переходів (стан, літера)
let l: number[] = new Array(N).fill(0); // ліва...
let r: number[] = new Array(N).fill(0); // ...та права межі підрядка a, що відповідає вхідному ребру
let p: number[] = new Array(N).fill(0); // батько вершини
let s: number[] = new Array(N).fill(0); // суфіксне посилання
let tv = 0; // вершина поточного суфікса (якщо посеред ребра — нижня вершина ребра)
let tp = 0; // позиція в рядку, що відповідає позиції на ребрі (між l[tv] і r[tv] включно)
let ts = 0; // кількість вершин
let la = 0; // поточний символ у рядку

const A = "a".charCodeAt(0);

function ukkadd(c: number): void {
  // додати символ c до дерева
  for (;;) {
    // сюди ми повертатимемося після кожного переходу до суфікса (і знову додаватимемо символ)
    if (r[tv] < tp) {
      // перевіряємо, чи ми ще в межах поточного ребра
      // якщо ні, знаходимо наступне ребро. Якщо його немає, створюємо листок і додаємо його до дерева
      if (t[tv][c] === -1) {
        t[tv][c] = ts;
        l[ts] = la;
        p[ts++] = tv;
        tv = s[tv];
        tp = r[tv] + 1;
        continue; // goto suff
      }
      tv = t[tv][c];
      tp = l[tv];
    }
    // інакше просто переходимо до наступного ребра
    if (tp === -1 || c === a.charCodeAt(tp) - A) {
      tp++; // якщо літера на ребрі дорівнює c, спускаємося цим ребром
      return;
    }
    // інакше розбиваємо ребро на два із серединою у вершині ts
    l[ts] = l[tv];
    r[ts] = tp - 1;
    p[ts] = p[tv];
    t[ts][a.charCodeAt(tp) - A] = tv;
    // додаємо листок ts+1. Він відповідає переходу через c.
    t[ts][c] = ts + 1;
    l[ts + 1] = la;
    p[ts + 1] = ts;
    // оновлюємо інформацію про поточну вершину — не забуваємо позначити ts як батька tv
    l[tv] = tp;
    p[tv] = ts;
    t[p[ts]][a.charCodeAt(l[ts]) - A] = ts;
    ts += 2;
    // готуємося до спуску; tp позначатиме, де ми перебуваємо в поточному суфіксі
    tv = s[p[ts - 2]];
    tp = l[ts - 2];
    // поки поточний суфікс не вичерпано, спускаємося
    while (tp <= r[ts - 2]) {
      tv = t[tv][a.charCodeAt(tp) - A];
      tp += r[tv] - l[tv] + 1;
    }
    // якщо ми у вершині, додаємо до неї суфіксне посилання, інакше додаємо посилання до ts
    // (ts ми створимо на наступній ітерації).
    if (tp === r[ts - 2] + 1) s[ts - 2] = tv;
    else s[ts - 2] = ts;
    // додаємо tp до нового ребра й повертаємося, щоб додати літеру до суфікса
    tp = r[tv] - (tp - r[ts - 2]) + 2;
    // goto suff
  }
}

function build(): void {
  ts = 2;
  tv = 0;
  tp = 0;
  t = Array.from({ length: N }, () => new Array(26).fill(-1));
  for (let i = 0; i < N; ++i) r[i] = a.length - 1;
  // ініціалізуємо дані для кореня дерева
  s[0] = 1;
  l[0] = -1;
  r[0] = -1;
  l[1] = -1;
  r[1] = -1;
  for (let j = 0; j < 26; ++j) t[1][j] = 0;
  // додаємо текст до дерева, літера за літерою
  for (la = 0; la < a.length; ++la) ukkadd(a.charCodeAt(la) - A);
}
```

```go
const N = 1000000        // максимально можлива кількість вершин у суфіксному дереві
const INF = 1000000000   // константа нескінченності

var a string // вхідний рядок, для якого будується суфіксне дерево

var (
	t [][]int // масив переходів (стан, літера)
	// l — ліва, r — права межі підрядка a, що відповідає вхідному ребру; p — батько; s — суфіксне посилання
	l, r, p, s     = make([]int, N), make([]int, N), make([]int, N), make([]int, N)
	tv             int // вершина поточного суфікса (якщо посеред ребра — нижня вершина ребра)
	tp             int // позиція в рядку, що відповідає позиції на ребрі (між l[tv] і r[tv] включно)
	ts             int // кількість вершин
	la             int // поточний символ у рядку
)

func ukkadd(c int) { // додати символ c до дерева
	for { // сюди ми повертатимемося після кожного переходу до суфікса (і знову додаватимемо символ)
		if r[tv] < tp { // перевіряємо, чи ми ще в межах поточного ребра
			// якщо ні, знаходимо наступне ребро. Якщо його немає, створюємо листок і додаємо його до дерева
			if t[tv][c] == -1 {
				t[tv][c] = ts
				l[ts] = la
				p[ts] = tv
				ts++
				tv = s[tv]
				tp = r[tv] + 1
				continue // goto suff
			}
			tv = t[tv][c]
			tp = l[tv]
		}
		// інакше просто переходимо до наступного ребра
		if tp == -1 || c == int(a[tp])-'a' {
			tp++ // якщо літера на ребрі дорівнює c, спускаємося цим ребром
			return
		}
		// інакше розбиваємо ребро на два із серединою у вершині ts
		l[ts] = l[tv]
		r[ts] = tp - 1
		p[ts] = p[tv]
		t[ts][int(a[tp])-'a'] = tv
		// додаємо листок ts+1. Він відповідає переходу через c.
		t[ts][c] = ts + 1
		l[ts+1] = la
		p[ts+1] = ts
		// оновлюємо інформацію про поточну вершину — не забуваємо позначити ts як батька tv
		l[tv] = tp
		p[tv] = ts
		t[p[ts]][int(a[l[ts]])-'a'] = ts
		ts += 2
		// готуємося до спуску; tp позначатиме, де ми перебуваємо в поточному суфіксі
		tv = s[p[ts-2]]
		tp = l[ts-2]
		// поки поточний суфікс не вичерпано, спускаємося
		for tp <= r[ts-2] {
			tv = t[tv][int(a[tp])-'a']
			tp += r[tv] - l[tv] + 1
		}
		// якщо ми у вершині, додаємо до неї суфіксне посилання, інакше додаємо посилання до ts
		// (ts ми створимо на наступній ітерації).
		if tp == r[ts-2]+1 {
			s[ts-2] = tv
		} else {
			s[ts-2] = ts
		}
		// додаємо tp до нового ребра й повертаємося, щоб додати літеру до суфікса
		tp = r[tv] - (tp - r[ts-2]) + 2
		// goto suff
	}
}

func build() {
	ts = 2
	tv = 0
	tp = 0
	t = make([][]int, N)
	for i := range t {
		t[i] = make([]int, 26)
		for j := range t[i] {
			t[i][j] = -1
		}
	}
	for i := 0; i < N; i++ {
		r[i] = len(a) - 1
	}
	// ініціалізуємо дані для кореня дерева
	s[0] = 1
	l[0] = -1
	r[0] = -1
	l[1] = -1
	r[1] = -1
	for j := 0; j < 26; j++ {
		t[1][j] = 0
	}
	// додаємо текст до дерева, літера за літерою
	for la = 0; la < len(a); la++ {
		ukkadd(int(a[la]) - 'a')
	}
}
```

</CodeTabs>

## Задачі для практики \{#practice-problems}

* [UVA 10679 - I Love Strings!!!](http://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=1620)

## Відеоматеріали \{#video}

- [Suffix Tree using Ukkonen's algorithm — Tushar Roy - Coding Made Simple](https://www.youtube.com/watch?v=aPRqocoBsFQ) (76 хв, англійською)
