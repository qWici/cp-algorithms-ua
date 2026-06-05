// Генерує static/robots.txt з url у docusaurus.config.ts,
// щоб посилання на sitemap ніколи не розходилося з конфігом.
// Запускається автоматично перед збіркою (prebuild у package.json).
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const config = readFileSync(join(root, 'docusaurus.config.ts'), 'utf8');
const match = config.match(/^\s*url:\s*'([^']+)'/m);
if (!match) {
  console.error('gen-robots: не знайшов `url:` у docusaurus.config.ts');
  process.exit(1);
}
const siteUrl = match[1].replace(/\/$/, '');

const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

const target = join(root, 'static', 'robots.txt');
writeFileSync(target, robots);
console.log(`gen-robots: static/robots.txt → Sitemap: ${siteUrl}/sitemap.xml`);
