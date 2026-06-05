import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Алгоритми для змагального програмування',
  tagline: 'Українською мовою — переклад cp-algorithms.com',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://cp-algorithms.com.ua',
  baseUrl: '/',

  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },

  i18n: {
    defaultLocale: 'uk',
    locales: ['uk'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          // Не зрізати числові префікси імен файлів (01_bfs, 15-puzzle)
          numberPrefixParser: false,
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
          showLastUpdateTime: false,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
        sitemap: {
          changefreq: 'weekly',
        },
      } satisfies Preset.Options,
    ],
  ],

  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.css',
      type: 'text/css',
      crossorigin: 'anonymous',
    },
  ],

  themes: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        // lunr-languages не підтримує 'uk'; модуль 'ru' дає коректну
        // токенізацію кирилиці, тож пошук українською працює.
        // TODO: розглянути Algolia DocSearch після наповнення сайту.
        language: ['en', 'ru'],
        docsRouteBasePath: '/',
        indexBlog: false,
        highlightSearchTermsOnTargetPage: true,
      },
    ],
  ],

  themeConfig: {
    // og:image для соцмереж (1200×630)
    image: 'img/social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'CP-Algorithms UA',
      logo: {
        alt: 'Лого CP-Algorithms UA',
        src: 'img/logo.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Статті',
        },
        {
          href: 'https://cp-algorithms.com',
          label: 'Оригінал (EN)',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Джерела',
          items: [
            {
              label: 'cp-algorithms.com (оригінал)',
              href: 'https://cp-algorithms.com',
            },
          ],
        },
      ],
      copyright: `Контент поширюється за ліцензією CC BY-SA 4.0. Переклад cp-algorithms.com українською.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['cpp', 'java', 'go'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
