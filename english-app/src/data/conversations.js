const conversationGroups = [
  // Group 1
  [
    {
      id: 1,
      english: "Could you say that again, please?",
      korean: "다시 말씀해 주시겠어요?",
      applications: [
        { english: "Could you speak more slowly, please?", korean: "좀 더 천천히 말씀해 주시겠어요?" },
        { english: "I'm sorry, I didn't catch that.", korean: "죄송해요, 못 들었어요." },
        { english: "Could you repeat that one more time?", korean: "한 번 더 반복해 주시겠어요?" },
      ],
    },
    {
      id: 2,
      english: "Can I get the check, please?",
      korean: "계산서 주시겠어요?",
      applications: [
        { english: "We'd like to pay separately.", korean: "따로 계산할게요." },
        { english: "Can we split the bill?", korean: "더치페이 할 수 있을까요?" },
        { english: "Keep the change.", korean: "잔돈은 가지세요." },
      ],
    },
    {
      id: 3,
      english: "How long is the wait?",
      korean: "얼마나 기다려야 하나요?",
      applications: [
        { english: "Is there a waiting list?", korean: "대기 명단이 있나요?" },
        { english: "Can I make a reservation?", korean: "예약할 수 있나요?" },
        { english: "We have a reservation under Kim.", korean: "김 이름으로 예약했어요." },
      ],
    },
    {
      id: 4,
      english: "I'm looking for the restroom.",
      korean: "화장실을 찾고 있어요.",
      applications: [
        { english: "Where is the nearest restroom?", korean: "가장 가까운 화장실이 어디인가요?" },
        { english: "Excuse me, is there a bathroom nearby?", korean: "실례합니다, 근처에 화장실이 있나요?" },
        { english: "Could you point me to the restrooms?", korean: "화장실이 어디인지 알려주시겠어요?" },
      ],
    },
    {
      id: 5,
      english: "What do you recommend?",
      korean: "무엇을 추천하시나요?",
      applications: [
        { english: "What's the most popular dish here?", korean: "여기서 가장 인기 있는 음식은 뭔가요?" },
        { english: "What's your personal favorite?", korean: "개인적으로 가장 좋아하는 것은 뭔가요?" },
        { english: "What's the specialty of this restaurant?", korean: "이 식당의 특선 요리는 뭔가요?" },
      ],
    },
  ],
  // Group 2
  [
    {
      id: 6,
      english: "I'd like to make a complaint.",
      korean: "불만을 제기하고 싶습니다.",
      applications: [
        { english: "This is not what I ordered.", korean: "이건 제가 주문한 게 아니에요." },
        { english: "I'd like to speak to the manager.", korean: "매니저와 이야기하고 싶습니다." },
        { english: "This item is defective.", korean: "이 제품에 결함이 있어요." },
      ],
    },
    {
      id: 7,
      english: "Could you give me a hand?",
      korean: "도와주시겠어요?",
      applications: [
        { english: "Do you mind helping me with this?", korean: "이것 좀 도와주시겠어요?" },
        { english: "I could use some help here.", korean: "여기서 도움이 필요해요." },
        { english: "Would you be able to assist me?", korean: "저를 도와주실 수 있나요?" },
      ],
    },
    {
      id: 8,
      english: "I'm running late.",
      korean: "늦을 것 같아요.",
      applications: [
        { english: "I'll be there in about 10 minutes.", korean: "약 10분 후에 도착할 거예요." },
        { english: "Sorry, I got stuck in traffic.", korean: "죄송해요, 교통 체증에 걸렸어요." },
        { english: "Can we push the meeting back?", korean: "회의를 나중으로 미룰 수 있을까요?" },
      ],
    },
    {
      id: 9,
      english: "It's on me.",
      korean: "제가 낼게요.",
      applications: [
        { english: "Dinner is on me tonight.", korean: "오늘 저녁은 제가 살게요." },
        { english: "Let me treat you.", korean: "제가 한턱 낼게요." },
        { english: "Don't worry about the bill, I've got it.", korean: "계산서 걱정 마세요, 제가 낼게요." },
      ],
    },
    {
      id: 10,
      english: "Could you take a photo of us?",
      korean: "저희 사진 좀 찍어주시겠어요?",
      applications: [
        { english: "Would you mind taking our picture?", korean: "저희 사진 찍어주시겠어요?" },
        { english: "Could you get us all in the shot?", korean: "저희 모두 사진에 담아주시겠어요?" },
        { english: "Can you take one more?", korean: "한 장 더 찍어주시겠어요?" },
      ],
    },
  ],
  // Group 3
  [
    {
      id: 11,
      english: "What time does it open?",
      korean: "몇 시에 문을 여나요?",
      applications: [
        { english: "What are your business hours?", korean: "영업 시간이 어떻게 되나요?" },
        { english: "Are you open on weekends?", korean: "주말에도 문을 여나요?" },
        { english: "What time do you close?", korean: "몇 시에 문을 닫나요?" },
      ],
    },
    {
      id: 12,
      english: "I'll have the same.",
      korean: "저도 같은 걸로 할게요.",
      applications: [
        { english: "Make it two, please.", korean: "두 개로 해주세요." },
        { english: "Same as my friend, please.", korean: "제 친구와 같은 걸로요." },
        { english: "I'll go with that as well.", korean: "저도 그걸로 할게요." },
      ],
    },
    {
      id: 13,
      english: "Can I try this on?",
      korean: "이거 입어볼 수 있을까요?",
      applications: [
        { english: "Where are the fitting rooms?", korean: "탈의실이 어디에 있나요?" },
        { english: "Do you have this in a larger size?", korean: "더 큰 사이즈 있나요?" },
        { english: "This doesn't fit. Do you have a smaller one?", korean: "이게 안 맞아요. 더 작은 거 있나요?" },
      ],
    },
    {
      id: 14,
      english: "Is there a discount?",
      korean: "할인이 있나요?",
      applications: [
        { english: "Do you have any sales going on?", korean: "세일 중인 게 있나요?" },
        { english: "Can I get a student discount?", korean: "학생 할인 받을 수 있나요?" },
        { english: "Is this the best price you can offer?", korean: "이게 최저가인가요?" },
      ],
    },
    {
      id: 15,
      english: "I'd like to return this.",
      korean: "이걸 반품하고 싶어요.",
      applications: [
        { english: "Can I exchange this for a different size?", korean: "다른 사이즈로 교환할 수 있나요?" },
        { english: "I'd like a refund, please.", korean: "환불해 주세요." },
        { english: "This was a gift but it doesn't fit.", korean: "선물 받았는데 맞지 않아요." },
      ],
    },
  ],
];

export default conversationGroups;
