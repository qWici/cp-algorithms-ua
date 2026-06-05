import MDXComponents from '@theme-original/MDXComponents';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeTabs from '@site/src/components/CodeTabs';
import YouTubeEmbed from '@site/src/components/YouTubeEmbed';
import Term from '@site/src/components/Term';

// Tabs/TabItem/CodeTabs/YouTubeEmbed/Term доступні в усіх md-файлах без
// імпорту — приклади коду, «Відеоматеріали» та підказки термінів
// покладаються на це.
export default {
  ...MDXComponents,
  Tabs,
  TabItem,
  CodeTabs,
  YouTubeEmbed,
  Term,
};
