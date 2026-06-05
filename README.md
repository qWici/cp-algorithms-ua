# cp-algorithms.com.ua

Український переклад [cp-algorithms.com](https://cp-algorithms.com) — збірки алгоритмів для змагального програмування.

- **162 статті** українською: алгебра, структури даних, ДП, графи, рядки, геометрія, комбінаторика та інше
- **Приклади 4 мовами**: C++ (оригінал) + Python, TypeScript, Go — вибір мови зберігається на всіх сторінках
- Кожен доданий приклад верифікований запуском і звіркою результатів з C++

Сайт на [Docusaurus](https://docusaurus.io/), формули — KaTeX, локальний пошук з підтримкою кирилиці.

## Розробка

```bash
npm install
npm start        # дев-сервер на localhost:3000
```

## Збірка

```bash
npm run build    # prebuild генерує static/robots.txt з url у конфізі
npm run serve    # переглянути продакшн-збірку локально
```

`onBrokenLinks: 'throw'` — збірка падає на битих посиланнях, тож зелена збірка = валідна навігація.

## Структура

- `docs/` — статті (українською, з прикладами в `<CodeTabs>`)
- `src/components/CodeTabs/` — вкладки мов поверх Docusaurus Tabs (`groupId="prog-lang"`, вибір у localStorage)
- `sidebars.ts` — структура розділів
- `GLOSSARY.md` — глосарій термінології перекладу
- `scripts/gen-robots.mjs` — генерація robots.txt (prebuild)

## Ліцензія

Оригінальний контент cp-algorithms.com поширюється за [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/); переклад успадковує цю ліцензію.
