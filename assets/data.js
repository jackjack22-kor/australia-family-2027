/* 여행 원본 데이터. 실제 예약 변경은 화면에서 수정하면 이 원본과 별도로 보존됩니다. */
const TRIP = {
 version: 1, hotelParty:{adults:3,children:1}, holidayRange:{start:'',end:''}, taskOwners:{}, emergency:{number:'000',consulate:'',insurance:''}, title:'우리 가족의 호주 여름', deadline:'2026-11-01', updated:'2026-10-21', fx:900,
 family:'부부 · 중1 아들 · 초3 딸', memberships:'아코르 플래티넘·아코르플러스 부부 각자 / 본보이 플래티넘 / 힐튼 골드 부부 각자',
 plans:{
  1:{start:'2027-01-31',end:'2027-02-14',arrive:'2027-02-01',gc:'2027-02-08',last:'2027-02-13',label:'길게 누리는 여름',risk:'귀국편 날짜 변경과 좌석 확보가 우선입니다.',flight:'출국 직항 확정 · 귀국 날짜 변경 필요'},
  2:{start:'2027-02-06',end:'2027-02-18',arrive:'2027-02-07',gc:'2027-02-13',last:'2027-02-17',label:'설날에 시작하는 여름',risk:'싱가포르 경유 출국편의 요금과 환승 조건을 확인해야 합니다.',flight:'출국 경유편 미구매 · 브리즈번 귀국 확정'}
 },
 hotels:{
  pullman:{name:'풀만 키그랜드 시드니 하버',short:'풀만 키그랜드',city:'sydney',area:'써큘러키',xy:[151.2131,-33.8617],intro:'항구를 거실처럼. 주방과 세탁기가 있는 하버 아파트.',payment:'스테이플러스',cost:{1:[1500000,1500000,'KRW'],2:[2250000,2250000,'KRW']},check:'1BR 기본객실의 4인 등록·조식 운영 방식 확인',rooms:'1실 · 4인 등록 확인 필요',stay:{1:['2027-02-01','2027-02-04'],2:['2027-02-07','2027-02-11']},coupon:{1:'본인 #1 · 3박 중 1박 무료 검토',2:'본인 #1 · 4박 중 1박 무료 검토'}},
  novotel:{name:'노보텔 시드니 온 달링하버',short:'노보텔 달링하버',city:'sydney',area:'달링하버 서쪽',xy:[151.1966,-33.8711],intro:'항구의 하루를 가까이. 두 더블베드에서 함께 머무는 밤.',payment:'스테이플러스',cost:{1:[350000,350000,'KRW']},check:'28㎡ 객실 크기·공사 영향·고층 요청·아동 조식 확인',rooms:'2더블 1실',stay:{1:['2027-02-04','2027-02-06']},coupon:{1:'아내 #1 · 2박 중 1박 무료 검토'}},
  sofitel:{name:'소피텔 시드니 달링하버',short:'소피텔 달링하버',city:'sydney',area:'달링하버 서쪽',xy:[151.1986,-33.8745],intro:'도시의 불빛 위로. 라운지와 항구의 저녁을 기대하는 이틀.',payment:'스테이플러스 부부 각자',cost:{1:[900000,900000,'KRW'],2:[900000,900000,'KRW']},check:'25층 이상·동향·커넥팅 요청. 35층 라운지 4인 이용 조건 확인',rooms:'2실 · 부부 각자 명의',stay:{1:['2027-02-06','2027-02-08'],2:['2027-02-11','2027-02-13']},coupon:{1:'본인 #2 + 아내 #2 · 각 1장',2:'본인 #2 + 아내 #1 · 각 1장'}},
  jw:{name:'JW 메리어트 골드코스트',short:'JW 메리어트',city:'goldcoast',area:'서퍼스 북쪽',xy:[153.428,-27.991],intro:'일정 사이에 라군을. 열대어와 함께 쉬어가는 리조트.',payment:'메리어트 포인트',cost:{},check:'필요 포인트·4인 객실 조건·조식 혜택 확인',rooms:'객실·필요 포인트 미정',stay:{1:['2027-02-08','2027-02-11'],2:['2027-02-13','2027-02-15']},coupon:{}},
  peppers:{name:'페퍼스 소울 서퍼스 파라다이스',short:'페퍼스 소울',city:'goldcoast',area:'서퍼스 해변 앞',xy:[153.431,-28.002],intro:'문을 열면 해변. 두 개의 침실에서 각자의 휴식을.',payment:'아코르플러스 / 스테이플러스',cost:{1:[950,950,'AUD'],2:[475,475,'AUD']},check:'2BR의 스테이플러스 대상 여부·객실 재고·야시장 운영일 확인',rooms:'2BR 아파트',stay:{1:['2027-02-11','2027-02-13'],2:['2027-02-15','2027-02-17']},coupon:{1:'아코르플러스 요금 검토',2:'아내 #2 · 적용 가능 여부 확인'}},
  bne:{name:'브리즈번 공항 호텔 · 풀만 후보',short:'브리즈번 공항 호텔',city:'brisbane',area:'공항',xy:[153.118,-27.384],intro:'아침 비행을 위해 공항 가까이. 마지막 밤은 단순하게.',payment:'유상',cost:{1:[250,350,'AUD'],2:[250,350,'AUD']},check:'4인 1실·셔틀 운영시간·터미널 이동 방법 확인',rooms:'4인 1실 가능 여부 확인',stay:{},coupon:{}},
  sydlast:{name:'시드니 마지막 밤 · 숙소 미정',short:'시드니 마지막 밤',city:'sydney',area:'공항 인근 또는 시내',xy:[151.2063,-33.8826],intro:'다시 항구의 도시로. 국제선 전날 여유를 확보하는 밤.',payment:'유상',cost:{},check:'공항 접근성·4인 객실·국내선 도착시간 확인',rooms:'미정',stay:{},coupon:{}}
 },
 places:{
  opera:{name:'오페라하우스',xy:[151.2153,-33.8568],icon:'opera',tip:'도착일은 외관과 항구 산책부터 가볍게.'}, garden:{name:'보타닉가든',xy:[151.2178,-33.8645],icon:'leaf',tip:'한낮 햇볕을 피해 물과 모자를 챙깁니다.'},
  quay:{name:'써큘러키',xy:[151.2097,-33.8598],icon:'ferry',tip:'페리 출발 부두와 운항시간을 확인합니다.'}, rocks:{name:'더 록스',xy:[151.2078,-33.8588],icon:'home',tip:'돌길 골목을 걷고 저녁 식사를 연결합니다.'},
  taronga:{name:'타롱가 동물원',xy:[151.2411,-33.8433],icon:'animal',tip:'써큘러키에서 페리 약 12분. 실제 시간표 확인.'}, blue:{name:'블루마운틴·페더데일',xy:[150.312,-33.715],icon:'mountain',tip:'아침 7시 전후 픽업 예상. 투어 확정 후 갱신.'},
  aquarium:{name:'시라이프 수족관',xy:[151.2027,-33.8695],icon:'fish',tip:'실내 일정으로 더위나 비를 피하기 좋습니다.'}, maritime:{name:'해양박물관',xy:[151.1988,-33.8686],icon:'anchor',tip:'수족관과 묶어 달링하버 동선을 줄입니다.'},
  bondi:{name:'본다이 해변',xy:[151.2743,-33.8915],icon:'wave',tip:'도심에서 버스 약 40분 추정. 귀가 시간에 여유.'}, china:{name:'차이나타운',xy:[151.204,-33.8784],icon:'lantern',tip:'춘절 행사 날짜·장소는 공식 발표 후 확인.'},
  qvb:{name:'QVB·웨스트필드',xy:[151.2067,-33.8718],icon:'bag',tip:'쇼핑은 가족별 자유시간과 만날 장소를 정합니다.'}, cruise:{name:'하버 크루즈',xy:[151.2097,-33.8598],icon:'ferry',tip:'출항 부두·시간·식사 포함 여부 확인.'}, play:{name:'달링쿼터 놀이터',xy:[151.2022,-33.8764],icon:'play',tip:'아이들이 쉬어가는 시간을 일정에 남깁니다.'},
  lagoon:{name:'JW 라군',xy:[153.428,-27.991],icon:'fish',tip:'이동일 오후는 리조트에서 여유 있게.'}, movie:{type:'themepark',heightRestriction:'',childNote:'',name:'무비월드',xy:[153.313,-27.907],icon:'coaster',tip:'오픈 시간·놀이기구 신장 제한·교통 확인.'}, sea:{type:'themepark',heightRestriction:'',childNote:'',name:'씨월드',xy:[153.426,-27.957],icon:'fish',tip:'공연 시간에 맞춰 관람 순서를 잡습니다.'}, wet:{type:'themepark',heightRestriction:'',childNote:'',name:'웻앤와일드',xy:[153.315,-27.910],icon:'wave',tip:'무비월드와 선택 일정. 다일권 조건 확인.'},
  surfers:{name:'서퍼스 파라다이스 해변',xy:[153.431,-28.002],icon:'wave',tip:'수영은 깃발 사이에서. 해변 여유 시간을 확보.'}, currumbin:{name:'커럼빈 또는 벌리 헤즈',xy:[153.489,-28.137],icon:'animal',tip:'두 곳 중 가족 컨디션에 맞춰 선택합니다.'}, market:{name:'에스플러네이드 야시장',xy:[153.431,-28.002],icon:'bag',tip:'운영 여부·시간은 출발 전에 재확인.'},
  southbank:{name:'사우스뱅크·시티캣',xy:[153.023,-27.480],icon:'ferry',tip:'물놀이 후 젖은 짐을 정리하고 공항 호텔로.'}, domestic:{name:'국내선 이동',xy:[153.505,-28.164],icon:'plane',tip:'수하물 포함 요금과 공항 이동 시간을 비교합니다.'}, airport:{name:'국제선 출국',xy:[153.118,-27.384],icon:'plane',tip:'브리즈번은 08:40 출발 예정. 체크인 마감 확인.'}
 },
 days:{
  1:[
   ['01-31','인천','출발하는 밤','20:00 OZ601 인천 출발','flight',[], '출국 시간 확정',{slots:{},localBudget:{food:'',tickets:'',tour:''},rainPlan:''}],
   ['02-01','시드니','항구에서 여름을 시작합니다','08:20 도착 · 우버XL로 써큘러키','pullman',['opera','garden'],'도착일은 가볍게',{slots:{},localBudget:{food:'',tickets:'',tour:''},rainPlan:''}],
   ['02-02','시드니','페리 타고 동물원으로','타롱가 동물원 · 저녁 더 록스','pullman',['quay','taronga','rocks'],'페리 이동',{slots:{},localBudget:{food:'',tickets:'',tour:''},rainPlan:''}],
   ['02-03','근교','푸른 산으로 떠나는 하루','블루마운틴 + 페더데일 하루 투어','pullman',['blue'],'7시 전후 픽업 추정',{slots:{},localBudget:{food:'',tickets:'',tour:''},rainPlan:''}],
   ['02-04','시드니','달링하버로 동네를 옮깁니다','노보텔 이동 · 수족관·해양박물관','novotel',['aquarium','maritime'],'호텔 이동',{slots:{},localBudget:{food:'',tickets:'',tour:''},rainPlan:''}],
   ['02-05','시드니','해변의 낮, 춘절의 저녁','본다이 · 차이나타운 행사 검토','novotel',['bondi','china'],'설 전날',{slots:{},localBudget:{food:'',tickets:'',tour:''},rainPlan:''}],
   ['02-06','시드니','설날을 항구의 불빛과 함께','소피텔 이동 · 라운지·춘절 행사 검토','sofitel',['china'],'설날 · 호텔 이동',{slots:{},localBudget:{food:'',tickets:'',tour:''},rainPlan:''}],
   ['02-07','시드니','도시를 걷고 바다를 봅니다','QVB·웨스트필드 · 하버 크루즈','sofitel',['qvb','cruise'],'시드니 마지막 낮',{slots:{},localBudget:{food:'',tickets:'',tour:''},rainPlan:''}],
   ['02-08','골드코스트','라군이 기다리는 곳으로','국내선 이동 · 우버XL · JW 라군','jw',['domestic','lagoon'],'국내선 미예약',{slots:{},localBudget:{food:'',tickets:'',tour:''},rainPlan:''}],
   ['02-09','골드코스트','영화 속 하루','무비월드','jw',['movie'],'테마파크',{slots:{},localBudget:{food:'',tickets:'',tour:''},rainPlan:''}],
   ['02-10','골드코스트','물과 함께 보내는 하루','씨월드 또는 웻앤와일드','jw',['sea','wet'],'선택 일정',{slots:{},localBudget:{food:'',tickets:'',tour:''},rainPlan:''}],
   ['02-11','골드코스트','해변 앞 우리 집','페퍼스 이동 · 서퍼스 · 커럼빈 또는 벌리 헤즈','peppers',['surfers','currumbin'],'호텔 이동',{slots:{},localBudget:{food:'',tickets:'',tour:''},rainPlan:''}],
   ['02-12','골드코스트','서두르지 않는 해변의 하루','해변 · 저녁 에스플러네이드 야시장 검토','peppers',['surfers','market'],'금요일 야시장 확인',{slots:{},localBudget:{food:'',tickets:'',tour:''},rainPlan:''}],
   ['02-13','브리즈번','마지막 도시의 물가','우버XL 이동 · 사우스뱅크·시티캣','bne',['southbank'],'공항 호텔 1박',{slots:{},localBudget:{food:'',tickets:'',tour:''},rainPlan:''}],
   ['02-14','귀국','여름을 담아 집으로','08:40 KE408 → 18:05 인천','none',['airport'],'해당 날짜 좌석 확보 필요',{slots:{},localBudget:{food:'',tickets:'',tour:''},rainPlan:''}]
  ],
  2:[
   ['02-06','인천','설날, 여행을 시작합니다','인천 → 싱가포르 → 시드니','flight',[],'시간·항공사 미정',{slots:{},localBudget:{food:'',tickets:'',tour:''},rainPlan:''}],
   ['02-07','시드니','항구에서 만나는 여름','도착 후 오페라하우스·보타닉가든','pullman',['opera','garden'],'도착시간 미정',{slots:{},localBudget:{food:'',tickets:'',tour:''},rainPlan:''}],
   ['02-08','시드니','페리 타고 동물원으로','타롱가 · 저녁 더 록스','pullman',['quay','taronga','rocks'],'페리 이동',{slots:{},localBudget:{food:'',tickets:'',tour:''},rainPlan:''}],
   ['02-09','근교','푸른 산으로 떠나는 하루','블루마운틴 + 페더데일 하루 투어','pullman',['blue'],'픽업시간 확인',{slots:{},localBudget:{food:'',tickets:'',tour:''},rainPlan:''}],
   ['02-10','시드니','본다이의 바람, 하버의 저녁','본다이 해변 · 하버 크루즈','pullman',['bondi','cruise'],'해변·크루즈',{slots:{},localBudget:{food:'',tickets:'',tour:''},rainPlan:''}],
   ['02-11','시드니','달링하버의 불빛 속으로','소피텔 이동 · 시라이프 · 춘절 행사 검토','sofitel',['aquarium','china'],'호텔 이동',{slots:{},localBudget:{food:'',tickets:'',tour:''},rainPlan:''}],
   ['02-12','시드니','쇼핑과 아이들의 자유시간','QVB·웨스트필드 · 달링쿼터 놀이터','sofitel',['qvb','play'],'시드니 마지막 낮',{slots:{},localBudget:{food:'',tickets:'',tour:''},rainPlan:''}],
   ['02-13','골드코스트','도시를 떠나 라군으로','국내선 이동 · JW 라군','jw',['domestic','lagoon'],'국내선 미예약',{slots:{},localBudget:{food:'',tickets:'',tour:''},rainPlan:''}],
   ['02-14','골드코스트','영화 속 밸런타인데이','무비월드','jw',['movie'],'할인 블랙아웃 확인',{slots:{},localBudget:{food:'',tickets:'',tour:''},rainPlan:''}],
   ['02-15','골드코스트','해변 앞 우리 집','페퍼스 이동 · 씨월드','peppers',['sea'],'호텔 이동',{slots:{},localBudget:{food:'',tickets:'',tour:''},rainPlan:''}],
   ['02-16','골드코스트','파도에 맞춰 쉬어갑니다','해변 · 커럼빈 또는 벌리 헤즈','peppers',['surfers','currumbin'],'선택 일정',{slots:{},localBudget:{food:'',tickets:'',tour:''},rainPlan:''}],
   ['02-17','브리즈번','마지막 도시의 물가','사우스뱅크 물놀이 · 시티캣','bne',['southbank'],'공항 호텔 1박',{slots:{},localBudget:{food:'',tickets:'',tour:''},rainPlan:''}],
   ['02-18','귀국','여름을 담아 집으로','08:40 KE408 → 18:05 인천','none',['airport'],'이코노미 발권 완료',{slots:{},localBudget:{food:'',tickets:'',tour:''},rainPlan:''}]
  ]
 },
 flights:[
  {id:'oz-eco',name:'아시아나 OZ601',from:'ICN',to:'SYD',date:'2027-01-31',time:'20:00 → 다음 날 08:20',seat:'이코노미 · A380 · 4인',status:'확정',ref:'',cost:'131,250마일 + 1,459,000원',kind:'out',plans:[1]},
  {id:'oz-biz',name:'아시아나 OZ601',from:'ICN',to:'SYD',date:'2027-01-31',time:'20:00 → 다음 날 08:20',seat:'비즈니스 · 4인 대기',status:'대기',cost:'확약 시 공제·추가금 확인',kind:'out',plans:[1]},
  {id:'ke13',name:'대한항공 KE408',from:'BNE',to:'ICN',date:'2027-02-13',time:'08:40 → 18:05',seat:'비즈니스 대기',status:'대기',cost:'이코노미 좌석 별도 확인',kind:'back',plans:[1]},
  {id:'ke14',name:'대한항공 KE408',from:'BNE',to:'ICN',date:'2027-02-14',time:'08:40 → 18:05',seat:'비즈니스 대기',status:'대기',cost:'이코노미 좌석 별도 확인',kind:'back',plans:[1]},
  {id:'ke18',name:'대한항공 KE408',from:'BNE',to:'ICN',date:'2027-02-18',time:'08:40 → 18:05',seat:'이코노미 · 4인',status:'확정',cost:'140,000마일 + 약 1,100,000원',kind:'back',plans:[2]},
  {id:'ke18-biz',name:'대한항공 KE408',from:'BNE',to:'ICN',date:'2027-02-18',time:'08:40 → 18:05',seat:'비즈니스 대기',status:'대기',cost:'확약 시 공제·추가금 확인',kind:'back',plans:[2]},
  {id:'sin-out',name:'싱가포르 경유 출국편',from:'ICN',to:'SYD',date:'2027-02-06',time:'경유 SIN · 시간 미정',seat:'이코노미 · 4인',status:'미예약',cost:'유상 요금 미정',kind:'out',plans:[2]},
  {id:'domestic',name:'시드니 → 골드코스트',from:'SYD',to:'OOL',date:'dynamic',time:'시간·항공사 미정',seat:'4인 · 수하물 조건 확인',status:'미예약',cost:'약 AUD 400~700',kind:'domestic',plans:[1,2]},
  {id:'syd-dom',name:'골드코스트 → 시드니',from:'OOL',to:'SYD',date:'last',time:'국제선 전날 이동 계획',seat:'4인 · 별도 발권',status:'미예약',cost:'추가 국내선 요금 미정',kind:'variant',plans:[1,2]},
  {id:'syd-back',name:'시드니 → 인천',from:'SYD',to:'ICN',date:'end',time:'대한항공·아시아나 비교 중',seat:'비즈니스 우선 검토',status:'미예약',cost:'공제 마일·세금·좌석 미정',kind:'variant',plans:[1,2]}
 ],
 tasks:[
  ['ke-change','11월 1일 전','KE408 2/13·14 이코노미 좌석과 변경 수수료 확인','2026-11-01'],['oz-cancel','11월 1일 전','OZ601 취소 수수료·91일 기준 확인','2026-11-01'],['sin-price','11월 1일 전','2안 출국편 4인 요금과 수하물 확인','2026-11-01'],['syd-award','11월 1일 전','시드니 귀국편 좌석·공제 마일 비교','2026-11-01'],['decision','11월 1일 전','여행안·귀국 도시·귀국일 결정','2026-11-01'],
  ['stay','안 확정 직후','스테이플러스 예약'],['pullman-mail','안 확정 직후','풀만 4인 등록·조식 운영 확인'],['sofitel-mail','안 확정 직후','소피텔 25층 이상·동향·커넥팅 요청'],['breakfast','안 확정 직후','스테이플러스 예약의 조식 적용 확인'],['suite','안 확정 직후','수트 나이트 유효기간·병행 조건 확인'],['jw','안 확정 직후','JW 포인트 조회·예약'],['peppers','안 확정 직후','페퍼스 객실·스테이플러스 조건 확인·예약'],['airport-hotel','안 확정 직후','마지막 밤 공항 호텔 예약'],['domestic','안 확정 직후','국내선 예약·수하물 확인'],['biz-split','안 확정 직후','비즈니스 일부 확약 시 가족 좌석 배분 원칙 결정'],['sin-transfer','안 확정 직후','2안이면 싱가포르 환승 조건 확인'],
  ['eta','출발 1개월 전','호주 ETA 4인 신청'],['passport','출발 1개월 전','여권 유효기간 확인'],['insurance','출발 1개월 전','여행자 보험 가입'],['tour','출발 1개월 전','투어·테마파크 예매'],
  ['school-application','출발 1개월 전','학교 일정 확인·교외체험학습 신청'],['arrival-declaration','출발 1개월 전','입국신고서·식품 신고 확인'],['offline-map','출발 1개월 전','오프라인 지도 저장'],['passport-copy','출발 1개월 전','여권 사본 보관'],
  ['adapter','짐','I타입 어댑터'],['sun','짐','수영복·선크림·모자'],['food','짐','육류 성분 식품 등 입국 신고 대상 확인'],['opal','짐','어린이 오팔카드 현지 구매']
 ],
 rules:[['조식','아코르 플래티넘은 아시아태평양에서 회원과 같은 방 투숙객 조식. 2실은 부부 각자 명의 예약. 호텔·요금별 적용을 예약 전 확인합니다.'],['스테이플러스','최소 2박 중 1박 무료, 기본객실, 숙박 1회 1장. 같은 호텔 연속 사용 제한. 부부 각자 명의 2실 동시 사용 가능 여부와 최신 약관 확인. 총 4장 배분을 관리합니다.'],['업그레이드','수트 나이트는 스테이플러스와 병행 불가, 새 예약 시 적용. 유효기간과 최신 조건 확인.'],['식음료','음식 30%·음료 15% 할인. 2월 14일 블랙아웃 가능. 호텔별·이벤트별 확인 필요.']],
 transport:[['시드니','공항 → 써큘러키 우버XL 약 AUD 60~80. 도심은 페리·라이트레일·메트로. 어른 신용카드 태그, 아이 어린이 오팔카드 계획.'],['골드코스트','트램 50센트는 제공 정보로 재확인. 테마파크는 우버X 하루 약 AUD 60~100 또는 트램 + TX7 버스 검토. 3일 이상 이용 시 다일권 비교.'],['브리즈번 이동','우버XL 약 AUD 230~300 추정. 사우스뱅크를 들른다면 짐·이동 구간·추가요금을 확인합니다.'],['렌터카','공항 픽업·편도 반납 5일 AUD 909.58 견적은 제외. 탬버린 마운틴 등 근교 방문일에만 서퍼스 시내 영업소 1일 대여 검토.']],
 season:['설날 2027년 2월 6일. 춘절 행사는 제공 계획이며 실제 2027 운영 일정 발표 후 확인합니다.','2월 14일 밸런타인데이. 식음료 할인 제외일 여부를 확인합니다.','제공된 BTS 시드니 2/20~21 공연 정보는 미검증입니다. 두 여행안 모두 해당 날짜 전 출국합니다.']
};
