# 호주 2027 여행 현황판

배포: https://jackjack22-kor.github.io/australia-family-2027/#cover

## 사용
상단 칩에서 여행안·귀국 도시·조기 귀국을 선택합니다. 하단 탭은 한눈에 / 여행안 비교 / 일정·지도 / 예약·경비 / 준비입니다. 날짜 카드를 누르면 하루 상세가 열리고, 날짜 스트립은 그 안에서 가로로 스크롤합니다.

예약·메모·현지 예산·우천 일정·담당자·비상 연락처는 화면에서 편집합니다. 다른 기기와 자동 동기화하지 않습니다. 관리의 데이터 백업과 가져오기로 옮길 수 있습니다. noindex는 검색 노출 억제 요청이며 접근 제한이나 비공개 기능은 아닙니다.

## 배포 파일과 호환성
단일 index.html 안에 CSS·JS·TRIP·표지 사진을 포함합니다. Leaflet 1.9.4(cdnjs), Pretendard 1.3.9(jsDelivr)만 버전을 고정해 외부에서 읽습니다. 지도 타일은 OpenStreetMap이며 네트워크가 필요합니다. 라이브러리·타일 로드 실패 시 지도 영역을 숨기고 장소 목록을 유지합니다. 저장한 HTML 사본에서는 메모와 비상정보 등 핵심 내용을 오프라인에서 볼 수 있습니다.

localStorage 키는 family-australia-atlas-v1, 백업 형식은 australia-atlas/version 1을 유지합니다. 기존 호텔·항공 예약 키, done.ID, day.DATE.note, general.note 및 cost 키를 변경하지 않았습니다. derive 함수 원본도 변경하지 않았습니다. 새 값은 기존 day./general. 문자열 레코드 영역에 추가하므로 마이그레이션 없이 읽습니다. 계획별 현지 예산은 실제 같은 날짜의 기록을 공유합니다.

## TRIP 수정 위치
- plans: 여행안과 출발·도착·귀국일
- days[1], days[2]: 기존 배열의 0~6번 필드는 그대로입니다. 7번 객체는 선택 확장 정보입니다.
- days[plan][row][7].slots: 오전/오후/저녁을 키로 사용합니다. 값은 장소 ID 배열 또는 직접 적은 일정 문자열입니다. 비어 있으면 기존 places 순서대로 표시합니다. 시간대를 임의 배정하지 않습니다.
- 같은 확장 객체의 localBudget: food / tickets / tour (AUD 금액 또는 빈 문자열). 빈칸은 미정, 0은 명시적인 0원입니다.
- rainPlan: 우천 대체 일정. 빈칸이면 본문에서 숨깁니다.
- hotels: 숙박 후보·가격·좌표. hotelParty는 요청한 호텔 검색 인원 기준 {adults:3,children:1}입니다. 각 호텔의 실제 아동 요금 정책 확정을 의미하지 않습니다.
- places: 명소. type:'themepark'이면 heightRestriction / childNote를 지원합니다. type:'food'인 식당을 해당 날짜 places에 넣으면 '근처 식사'에 표시합니다. 식당 데이터는 새로 만들지 않았습니다.
- holidayRange: start/end 모두 빈칸입니다. 연휴 시작·종료일을 YYYY-MM-DD로 채우면 비교 타임라인에 음영을 표시합니다. 설날 2/6 마커는 기존 제공 날짜를 사용합니다.
- taskOwners: 준비항목 ID별 아빠/엄마/아들/딸/함께. 빈 값은 미정입니다.
- emergency: 긴급번호 000, consulate / insurance는 빈 문자열입니다.

## 화면 입력 레코드
- 담당자: general.owner.TASK_ID
- 현지 예산: day.YYYY-MM-DD.budget.food / tickets / tour
- 우천 일정: day.YYYY-MM-DD.rainPlan
- 아이 정보: general.park.PLACE_ID.height / note
- 연락처: general.emergency.consulate / insurance
- 마일 가정: general.mile.oz / ke. 비어 있으면 원화 환산을 표시하지 않습니다.

## 비용 기준
확정 비용은 기존 OZ601 실결제 1,459,000원 및 사용자가 입력한 해당 시나리오의 실제 결제 기록입니다. KE408의 약 110만원은 추정으로 구분합니다. 추정 범위는 비교에서 중간값을 사용합니다. 미정 비용·포인트는 0원 확정으로 간주하지 않습니다. 1박당 비용은 입력된 확정+추정 합계를 체류 박수로 나눕니다. 현지 예산은 입력된 AUD 금액만 합산합니다.

## 사용자가 채울 항목
1. 일자별 식비·입장료·투어비 (AUD)
2. 우천 대체 일정, 오전/오후/저녁 배치
3. 무비월드·씨월드·웻앤와일드 키 제한과 아이 메모
4. 주시드니 총영사관·여행자보험 연락처
5. 식당 후보의 이름·위치·관련 날짜
6. 준비항목 담당자, 실제 연휴 범위
7. 선택 사항: OZ/KE 원/마일 가정
8. 기존 미정 항공권·국내선·숙소·JW 포인트·운영 시간·예약번호

가격·운영시간·식당·연락처를 추가로 추정하지 않았습니다. 공개 원본에는 실제 예약번호와 사용자 스냅샷을 넣지 않습니다.

## 검증
390 / 768 / 1440px에서 5개 화면·하루 상세·공통 모달의 scrollWidth와 clientWidth 일치를 확인했습니다. 표시 텍스트 최소 12px, 조작 요소 최소 44×44px를 측정했습니다. 본문 Unsplash 출처와 OpenStreetMap 저작권 표시는 인라인 링크 예외입니다. 라이트·다크 실제 텍스트 대비 검사에서 4.5:1 미만은 없었습니다.

기존 v1 저장 데이터를 새 앱 실행 전에 넣은 VM 테스트에서 날짜·가족 메모, 숙소 상태, 항공 예약번호, 체크리스트, 환율이 유지됐습니다. 실제 브라우저에서 입력·저장·새로고침도 확인했습니다. 파일 선택 기반 복원 시험은 Chrome 확장 파일 접근 권한 제한으로 실행하지 못했습니다. 이 제한을 저장 데이터 호환성 통과와 혼동하지 않습니다.

표지 사진: Caleb / Unsplash https://unsplash.com/photos/JmuyB_LibRo
Leaflet: https://leafletjs.com/ , OpenStreetMap: https://www.openstreetmap.org/copyright
