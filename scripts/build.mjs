// index.html 빌드 스크립트
//
// src/index.template.html (화면 틀) + src/app.jsx (앱 코드) 를 합쳐
// React까지 안에 담긴 index.html 한 파일을 만든다.
// 인터넷 없이 파일만 열어도 동작하고, 브라우저에서 JSX를 변환하지 않아 빨리 뜬다.
//
//   npm run build   → index.html 다시 만들기
//   npm run check   → index.html 이 src/ 와 맞는지만 확인 (다르면 실패)

import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { transform } from 'esbuild';

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(p, 'utf8');

const NOTICE = `<!--
  자동 생성 파일입니다. 직접 고치지 마세요.
  고칠 곳: src/app.jsx (앱 코드), src/index.template.html (화면 틀)
  고친 뒤:  npm install && npm run build
-->`;
const MARKER = '<!-- BUILD:INLINE_SCRIPTS -->';

// <script> 안에 그대로 넣을 수 있게 닫는 태그를 이스케이프
const inlineScript = (code) => `<script>\n${code.replace(/<\/script/gi, '<\\/script')}\n</script>`;

async function build() {
  const template = read(join(root, 'src/index.template.html'));
  if (!template.includes(MARKER)) throw new Error(`템플릿에 ${MARKER} 표시가 없습니다.`);

  const reactVer = require('react/package.json').version;
  const reactDomVer = require('react-dom/package.json').version;
  // UMD 파일은 package exports 에 없어서 패키지 폴더 기준으로 읽는다
  const pkgDir = (name) => dirname(require.resolve(`${name}/package.json`));
  const react = read(join(pkgDir('react'), 'umd/react.production.min.js'));
  const reactDom = read(join(pkgDir('react-dom'), 'umd/react-dom.production.min.js'));

  const { code: app } = await transform(read(join(root, 'src/app.jsx')), {
    loader: 'jsx',
    jsx: 'transform',
    target: 'es2019',
    charset: 'utf8',
    legalComments: 'none',
  });

  const scripts = [
    `<!-- React ${reactVer} / ReactDOM ${reactDomVer} (파일 안에 포함) -->`,
    inlineScript(react),
    inlineScript(reactDom),
    '<!-- 앱 코드 (src/app.jsx 에서 변환) -->',
    inlineScript(`"use strict";\n${app}`),
  ].join('\n');

  // replace 의 $ 패턴 해석을 피하려고 함수로 넘김
  const html = template
    .replace('<!DOCTYPE html>', () => `<!DOCTYPE html>\n${NOTICE}`)
    .replace(MARKER, () => scripts);
  return html;
}

const html = await build();
const out = join(root, 'index.html');

if (process.argv.includes('--check')) {
  let current = '';
  try { current = read(out); } catch {}
  if (current !== html) {
    console.error('index.html 이 src/ 와 다릅니다. index.html 을 직접 고쳤다면 그 내용을 src/ 로 옮기고 npm run build 를 실행하세요.');
    process.exit(1);
  }
  console.log('index.html 이 src/ 와 일치합니다.');
} else {
  writeFileSync(out, html);
  console.log(`index.html 생성 완료 (${(Buffer.byteLength(html) / 1024).toFixed(0)} KB)`);
}
