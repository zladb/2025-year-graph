
import { MonthlyData } from './types';

export const MONTH_NAMES = [
  '1월', '2월', '3월', '4월', '5월', '6월', 
  '7월', '8월', '9월', '10월', '11월', '12월'
];

export const INITIAL_REFLECTIONS = [
  { id: '1', name: '새로운 배움', value: false },
  { id: '2', name: '깊은 휴식', value: false },
  { id: '3', name: '뜻밖의 행운', value: false },
  { id: '4', name: '도전과 성장', value: false },
  { id: '5', name: '소중한 만남', value: false },
];

export const INITIAL_DATA: MonthlyData[] = [
  {
    month: 1, score: 65, title: "새로운 시작의 설렘", note: "새해 첫 시작. 운동을 시작했고 조금 힘들지만 뿌듯하다. 작심삼일이 되지 않길.",
    categories: [{ id: '1', name: '새로운 배움', value: true }, { id: '4', name: '도전과 성장', value: true }],
    images: [], achievements: ["헬스장 20일 출석", "독서 2권 완료"],
    frequentPeople: "나 자신", frequentPlaces: "동네 공원",
    gratitude: "건강하게 한 해를 시작할 수 있음에 감사", regret: "초반 열정에 비해 후반에 조금 느슨해짐", improvement: "매일 아침 명상 추가하기"
  },
  {
    month: 2, score: 45, title: "조금은 느려도 괜찮아", note: "명절 연휴로 조금 나태해졌다. 업무 스트레스가 조금 있었지만 가족들과 즐거운 시간.",
    categories: [{ id: '5', name: '소중한 만남', value: true }],
    images: [], achievements: ["가족 여행 다녀옴"],
    frequentPeople: "부모님", frequentPlaces: "강릉 바다",
    gratitude: "가족과 함께 따뜻한 밥 한 끼 먹을 수 있는 시간", regret: "계획했던 자격증 공부를 거의 못 함", improvement: "주말 오전 시간 활용하기"
  },
  {
    month: 3, score: 80, title: "봄바람에 실려온 성취", note: "봄이 오면서 기분이 좋아졌다. 프로젝트 결과가 좋아서 인정을 받았다!",
    categories: [{ id: '4', name: '도전과 성장', value: true }, { id: '3', name: '뜻밖의 행운', value: true }],
    images: [], achievements: ["성과금 수령", "영어 회화 수업 시작"],
    frequentPeople: "팀장님", frequentPlaces: "사무실 창가",
    gratitude: "노력한 만큼 결과가 따라준 프로젝트", regret: "성취에 취해 잠을 너무 줄인 것", improvement: "수면 시간 6시간 확보하기"
  },
  {
    month: 4, score: 70, title: "평화로운 오후의 산책", note: "벚꽃 구경도 가고 산책을 많이 했다. 마음이 평온해진 한 달.",
    categories: [{ id: '2', name: '깊은 휴식', value: true }],
    images: [], achievements: ["주말 등산 성공", "식물 키우기 시작"],
    frequentPeople: "오래된 친구", frequentPlaces: "석촌호수",
    gratitude: "길가에 핀 꽃 한 송이를 감상할 수 있는 마음의 여유", regret: "식단 관리를 전혀 하지 않음", improvement: "일주일에 3번 클린 식단"
  },
  {
    month: 5, score: 55, title: "가족과 함께한 시간", note: "생각보다 지출이 많아 경제적으로 압박이 있었음. 그래도 건강은 좋아짐.",
    categories: [{ id: '2', name: '깊은 휴식', value: true }],
    images: [], achievements: ["건강검진 완료"],
    frequentPeople: "조카", frequentPlaces: "집 앞 마당",
    gratitude: "조카의 맑은 웃음소리", regret: "지갑 사정을 고려하지 않은 충동 구매", improvement: "가계부 작성 다시 시작"
  },
  {
    month: 6, score: 30, title: "잠시 멈춰 서서", note: "번아웃이 온 것 같다. 아무것도 하기 싫고 무기력한 나날들.",
    categories: [{ id: '2', name: '깊은 휴식', value: false }],
    images: [], achievements: [],
    frequentPeople: "강아지", frequentPlaces: "내 방 침대",
    gratitude: "아무것도 하지 않아도 곁을 지켜주는 반려견", regret: "스스로를 너무 몰아붙였던 시간들", improvement: "작은 쉼표를 자주 찍기"
  },
  {
    month: 7, score: 85, title: "푸른 바다와 파도", note: "여름 휴가! 발리로 떠난 여행은 내 인생 최고의 경험이었다.",
    categories: [{ id: '3', name: '뜻밖의 행운', value: true }, { id: '2', name: '깊은 휴식', value: true }],
    images: [], achievements: ["서핑 첫 도전 성공", "인생 사진 남김"],
    frequentPeople: "여행 가이드", frequentPlaces: "발리 우붓",
    gratitude: "새로운 세상을 경험할 수 있는 건강과 기회", regret: "일행과 작은 오해로 잠시 어색했던 순간", improvement: "상대의 마음을 먼저 물어봐 주기"
  },
  {
    month: 8, score: 60, title: "뜨거운 여름의 끝자락", note: "휴가 이후 다시 일상으로. 날씨는 덥지만 다시 힘을 내보는 중.",
    categories: [{ id: '1', name: '새로운 배움', value: true }],
    images: [], achievements: ["블로그 포스팅 10개"],
    frequentPeople: "동료", frequentPlaces: "루프탑 카페",
    gratitude: "지친 오후 건네받은 시원한 아이스커피", regret: "더위 때문에 운동을 자꾸 미룸", improvement: "홈 트레이닝으로 대체하기"
  },
  {
    month: 9, score: 75, title: "가울을 준비하는 마음", note: "선선한 가을 바람과 함께 공부 의지가 불타오름. 사이드 프로젝트 시작.",
    categories: [{ id: '1', name: '새로운 배움', value: true }, { id: '4', name: '도전과 성장', value: true }],
    images: [], achievements: ["리액트 심화 과정 수료"],
    frequentPeople: "스터디 리더", frequentPlaces: "도서관",
    gratitude: "함께 성장하는 스터디원들의 긍정적인 에너지", regret: "사이드 프로젝트 진도가 생각보다 느림", improvement: "주중 코딩 시간 고정하기"
  },
  {
    month: 10, score: 50, title: "바쁜 일상 속의 발견", note: "업무가 너무 몰렸다. 야근의 연속... 건강을 좀 더 챙겨야겠다.",
    categories: [{ id: '4', name: '도전과 성장', value: true }],
    images: [], achievements: ["대규모 프로젝트 출시"],
    frequentPeople: "나 자신", frequentPlaces: "한강 고수부지",
    gratitude: "고된 업무를 무사히 마친 내 인내심", regret: "스트레스를 음식으로 풀려 한 것", improvement: "스트레스 해소용 취미 찾기"
  },
  {
    month: 11, score: 40, title: "우연히 만난 그리움", note: "날씨가 추워지니 마음도 조금 쓸쓸. 옛 친구들과 만나 회포를 풀었다.",
    categories: [{ id: '5', name: '소중한 만남', value: true }],
    images: [], achievements: ["동창회 모임 주최"],
    frequentPeople: "초등학교 친구", frequentPlaces: "오래된 선술집",
    gratitude: "오랜 시간이 지나도 변치 않는 우정", regret: "부정적인 생각에 잠겨있던 며칠", improvement: "하루 3가지 감사 일기 쓰기"
  },
  {
    month: 12, score: 90, title: "마지막 페이지의 선물", note: "한 해를 돌아보니 감사한 일이 많다. 사랑하는 사람과 따뜻한 연말 마무리.",
    categories: [{ id: '3', name: '뜻밖의 행운', value: true }, { id: '5', name: '소중한 만남', value: true }],
    images: [], achievements: ["2025 라이프 그래프 완성!", "사랑하는 사람에게 고백"],
    frequentPeople: "사랑하는 사람", frequentPlaces: "크리스마스 마켓",
    gratitude: "내 곁을 지켜준 수많은 기적 같은 순간들", regret: "좀 더 용기 내지 못했던 몇몇 순간", improvement: "내년엔 더 솔직하게 표현하기"
  }
];

export const EMOTIONAL_COLORS = {
  low: '#38BDF8',  // Sky 400
  mid: '#A78BFA',  // Violet 400
  high: '#FB7185'  // Rose 400
};

export const getScoreColor = (score: number) => {
  if (score > 70) return EMOTIONAL_COLORS.high;
  if (score > 40) return EMOTIONAL_COLORS.mid;
  return EMOTIONAL_COLORS.low;
};
