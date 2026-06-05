import MDXComponents from '@theme-original/MDXComponents';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeTabs from '@site/src/components/CodeTabs';
import YouTubeEmbed from '@site/src/components/YouTubeEmbed';

// Tabs/TabItem/CodeTabs/YouTubeEmbed доступні в усіх md-файлах без імпорту —
// приклади коду та секції «Відеоматеріали» покладаються на це.
export default {
  ...MDXComponents,
  Tabs,
  TabItem,
  CodeTabs,
  YouTubeEmbed,
};
