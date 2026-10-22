# 호주 2027 가족여행 현황판

4인 가족의 2027년 2월 시드니·골드코스트·브리즈번 여행을 관리하는 모바일 우선 웹 현황판.
- 배포: GitHub Pages, `main` 브랜치 루트 → https://jackjack22-kor.github.io/australia-family-2027/
- 사용자: 저장소 소유자(아빠). 주 사용 환경은 휴대폰 브라우저.
- 이전 구현은 Codex가 Phase 1~4로 진행했고, 이번 리디자인은 Claude Code가 이어받는다.

## 작업 기준 문서
- `design/BRIEF.md` — 리디자인 요구사항 전체(단계, 화면별 명세, 로직 수정, 완료 기준). **작업 전 반드시 읽을 것.**
- `design/tokens.css` — 색·타입·간격 토큰. 화면 코드에 hex를 직접 쓰지 말고 토큰만 사용.
- `design/mockups/*.png` — 390px 기준 확정 시안(보는 모습의 기준).
- `design/mockup-source/*.dc.html` — 시안의 원본 마크업. 인라인 스타일에 정확한 값이 있다. 이 파일은 디자인 툴 전용 포맷이라 그대로 실행되지 않는다. 참고만 할 것.
- `README.md` — 데이터 필드·저장 레코드 키 설명(Codex 작성). 구조가 바뀌면 함께 갱신.

## 현재 구조 (리디자인 시작 시점)
- 루트에 `index.html` 하나(약 495KB, 325줄). CSS 약 42KB가 몇 줄에 압축돼 있고, JS 약 434KB 안에 `TRIP` 원본 데이터와 base64 표지 사진(약 360KB)이 들어 있다.
- Phase별 덧씌우기로 같은 함수가 여러 번 재정의돼 있다(`render`·`prep`·`itinerary` 각 3회, `home`·`compare`·`flights`·`budget`·`costSummary`·`hotelArticle`·`itineraryOverview`·`makeMap` 각 2회). CSS 변수도 여러 번 재선언된다. **마지막 정의가 실제 동작**이다.
- 외부 의존: Leaflet 1.9.4(cdnjs), Pretendard 1.3.9(jsDelivr). 둘 다 버전 고정 유지.

## 절대 지킬 것
1. **저장 데이터 호환**: localStorage 키 `family-australia-atlas-v1`, 백업 형식 `australia-atlas` version 1, README의 레코드 키(`done.ID`, `day.DATE.note`, `general.*`, 호텔·항공 예약 키, cost 키 등)를 바꾸지 않는다. 바꿔야 하면 마이그레이션 코드와 픽스처 테스트를 함께 만든다.
2. **`derive()`의 계산 의미를 바꾸지 않는다.** 로직 수정은 BRIEF의 L 항목 범위에서만 하고, 바꾼 이유를 커밋 메시지에 적는다.
3. **사실을 지어내지 않는다.** 가격·운영시간·식당·연락처·키 제한 등은 새로 만들지 않는다. 시안의 숫자(743만원, 146만원, 159만원, D-10 등)는 예시이고 **반드시 데이터에서 계산**한다.
4. **공개 저장소다.** 실제 예약번호, 사용자 localStorage 스냅샷, 개인 연락처를 커밋하지 않는다. 테스트 픽스처에는 가짜 값만 넣는다.
5. **`git push`는 곧 공개 배포다.** 단계마다 로컬 커밋은 자유롭게 하되, push 전에는 변경 요약과 스크린샷 비교를 보여 주고 사용자 확인을 받는다.
6. 사용자가 편집하는 기능(예약·메모·체크·담당자·예산·백업/가져오기·HTML 사본·인쇄)은 디자인이 바뀌어도 모두 동작해야 한다.

## 검증 루프
- 최초 1회: `npm install` 후 `npx playwright install chromium`
- `npm run check`: 로컬 정적 서버로 390/768/1440px에서 5개 화면 + 하루 상세 + 여행안 시트 + 관리 모달을 찍어 `.shots/`에 저장하고, 가로 오버플로·12px 미만 글자·44px 미만 터치 요소·콘솔 오류를 검사한다. 위반이 있으면 실패.
- `npm run shots`: 실패 처리 없이 스크린샷만.
- `node tools/check.mjs --fixture tools/fixtures/storage.json`: 저장 데이터를 넣은 상태로 점검.
- 점검 스크립트가 쓰는 훅을 마크업에 유지: `data-check="day-open"`(첫 날짜 카드), `data-check="plan-chip"`(여행안 칩), `data-check="manage"`(관리 버튼). 본문 속 인라인 텍스트 링크처럼 44px 예외가 정당한 요소는 `data-check-exempt="tap"`.
- **기준 통과만으로 끝내지 않는다.** `.shots/m390/*.png`를 `design/mockups/*.png`와 직접 열어 비교하고, 위계·간격·카드 모양·색 쓰임이 시안과 다른 점을 스스로 찾아 고친다.

## 작업 방식
- BRIEF의 Phase 순서대로 진행하고, Phase마다 커밋한다. 한 Phase 안에서도 의미 단위로 커밋을 나눈다.
- 새 기능을 덧씌우는 방식(함수 재정의, CSS 재선언)을 쓰지 않는다. 기존 정의를 고친다.
- 환경: Windows(PowerShell). 경로는 `C:\workspace\Australia2027`.
- 커밋 메시지는 한국어로, 무엇을 왜 바꿨는지 한 줄 요약 + 필요하면 본문.
