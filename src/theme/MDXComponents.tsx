import MDXComponents from '@theme-original/MDXComponents';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeTabs from '@site/src/components/CodeTabs';

// Tabs/TabItem/CodeTabs доступні в усіх md-файлах без імпорту —
// конвертер (scripts/convert.mjs) і приклади коду покладаються на це.
export default {
  ...MDXComponents,
  Tabs,
  TabItem,
  CodeTabs,
};
