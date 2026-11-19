# lifestyle

daily tracker — `index.html` 하나로 동작하는 개인 생활 트래커입니다.

## 쓰는 방법

`index.html` 파일을 내려받아 브라우저로 열면 됩니다. React까지 파일 안에 들어 있어서 **인터넷 없이도** 열립니다.
(인터넷이 되면 Pretendard 글꼴을 받아 쓰고, 안 되면 기기 기본 글꼴로 보입니다.)

기록은 브라우저(localStorage)에만 저장되니, Manage → 데이터 관리 → **내보내기**로 가끔 백업해 두세요.

### 휴대폰 홈 화면 앱으로 쓰기

GitHub Pages 주소 **https://gbjh71-ops.github.io/lifestyle/** 로 열면 홈 화면에 앱처럼 설치할 수 있습니다.

- **iPhone (Safari)**: 아래쪽 공유 버튼(□↑) → **홈 화면에 추가**
- **Android (Chrome)**: Manage 탭의 **홈 화면에 설치** 버튼, 또는 메뉴(⋮) → **앱 설치**

설치한 앱은 인터넷 없이도 열리고, 인터넷이 될 때 새 버전으로 자동 업데이트됩니다.
파일로 연 트래커와 웹 주소로 연 앱은 **기록이 따로 저장**되니, 옮길 때는 내보내기 → 가져오기를 쓰세요.

## 고치는 방법

`index.html`은 빌드로 만들어지는 파일이라 **직접 고치지 않습니다.**

| 파일 | 내용 |
|---|---|
| `src/app.jsx` | 앱 코드 (React + JSX) |
| `src/index.template.html` | 화면 틀 (head, 스타일, 글꼴) |
| `src/sw.js` | 홈 화면 앱용 서비스 워커 (빌드 때 버전이 들어가 `sw.js` 생성) |
| `manifest.webmanifest`, `icons/` | 홈 화면 앱 이름과 아이콘 (직접 고쳐도 됨) |
| `scripts/build.mjs` | 위 파일들 + React를 합쳐 `index.html`, `sw.js` 생성 |

```sh
npm install        # 처음 한 번
npm run build      # src/ 를 고친 뒤 index.html 다시 만들기
npm run check      # index.html, sw.js 가 src/ 와 맞는지 확인
```

`src/`를 고쳤다면 `npm run build`로 만든 `index.html`, `sw.js`도 함께 커밋하세요. GitHub의 **Build check**가 둘이 어긋나면 실패로 알려 줍니다.
