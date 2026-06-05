import React, {Children, isValidElement, type ReactNode} from 'react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import styles from './styles.module.css';

/**
 * Таби з прикладами коду різними мовами.
 *
 * Використання в MDX (компонент зареєстрований глобально):
 *
 *   <CodeTabs>
 *   ```cpp
 *   ...
 *   ```
 *   ```python
 *   ...
 *   ```
 *   </CodeTabs>
 *
 * - порядок вкладок завжди однаковий: C++ → Python → TypeScript → Go (→ Java)
 * - groupId="prog-lang": вибір мови синхронізується між усіма табами сайту
 *   і зберігається в localStorage (вбудована механіка Docusaurus Tabs)
 * - якщо якоїсь мови ще немає — показуємо підказку, яких прикладів бракує
 */

const LANGS = [
  {value: 'cpp', label: 'C++', classes: ['language-cpp', 'language-c++']},
  {value: 'python', label: 'Python', classes: ['language-python', 'language-py']},
  {value: 'ts', label: 'TypeScript', classes: ['language-typescript', 'language-ts', 'language-tsx']},
  {value: 'go', label: 'Go', classes: ['language-go']},
  {value: 'java', label: 'Java', classes: ['language-java']},
] as const;

// Java показуємо, лише якщо приклад нею є; перші чотири — основний набір сайту
const CORE_LANGS = ['cpp', 'python', 'ts', 'go'] as const;

function langOfNode(node: ReactNode): (typeof LANGS)[number] | null {
  // Фенс ```cpp у MDX стає <pre><code className="language-cpp">…</code></pre>
  if (!isValidElement(node)) return null;
  const code = (node.props as {children?: ReactNode}).children;
  const className: string = isValidElement(code)
    ? ((code.props as {className?: string}).className ?? '')
    : '';
  const classes = className.split(' ');
  return LANGS.find((l) => l.classes.some((c) => classes.includes(c))) ?? null;
}

export default function CodeTabs({children}: {children: ReactNode}): ReactNode {
  const blocks = Children.toArray(children)
    .map((child) => ({lang: langOfNode(child), child}))
    .filter((b) => b.lang !== null) as {lang: (typeof LANGS)[number]; child: ReactNode}[];

  // стабільний порядок мов незалежно від порядку в MDX
  blocks.sort(
    (a, b) =>
      LANGS.findIndex((l) => l.value === a.lang.value) -
      LANGS.findIndex((l) => l.value === b.lang.value),
  );

  if (blocks.length === 0) {
    return children; // не код — рендеримо як є
  }

  const present = new Set(blocks.map((b) => b.lang.value));
  const missing = CORE_LANGS.filter((v) => !present.has(v)).map(
    (v) => LANGS.find((l) => l.value === v)!.label,
  );

  return (
    <div className={styles.codeTabs}>
      <Tabs groupId="prog-lang">
        {blocks.map(({lang, child}) => (
          <TabItem key={lang.value} value={lang.value} label={lang.label}>
            {child}
          </TabItem>
        ))}
      </Tabs>
      {missing.length > 0 && (
        <small className={styles.hint}>
          Приклади мовами {missing.join(', ')} ще в роботі — поки показуємо наявні.
        </small>
      )}
    </div>
  );
}
