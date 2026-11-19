# lifestyle

daily tracker — `index.html` 하나로 동작하는 개인 생활 트래커입니다.

## 쓰는 방법

`index.html` 파일을 내려받아 브라우저로 열면 됩니다. React까지 파일 안에 들어 있어서 **인터넷 없이도** 열립니다.
(인터넷이 되면 Pretendard 글꼴을 받아 쓰고, 안 되면 기기 기본 글꼴로 보입니다.)

기록은 브라우저(localStorage)에만 저장되니, Manage → 데이터 관리 → **내보내기**로 가끔 백업해 두세요.

## 고치는 방법

`index.html`은 빌드로 만들어지는 파일이라 **직접 고치지 않습니다.**

| 파일 | 내용 |
|---|---|
| `src/app.jsx` | 앱 코드 (React + JSX) |
| `src/index.template.html` | 화면 틀 (head, 스타일, 글꼴) |
| `scripts/build.mjs` | 위 두 파일 + React를 합쳐 `index.html` 생성 |

```sh
npm install        # 처음 한 번
npm run build      # src/ 를 고친 뒤 index.html 다시 만들기
npm run check      # index.html 이 src/ 와 맞는지 확인
```

`src/`를 고쳤다면 `npm run build`로 만든 `index.html`도 함께 커밋하세요. GitHub의 **Build check**가 둘이 어긋나면 실패로 알려 줍니다.
