// ===== 王者荣耀英雄人格测试 =====
// 算法：基于英雄背景故事设计场景抉择题，用户代入作答，
// 每题选项映射到「人格原型」，先锁定原型，再锁定原型内的代表英雄。

// ==================== 人格原型 ====================
// 10 个原型，每个原型：代表英雄 + 同族英雄（性格相近，覆盖更多英雄）
const ARCHETYPES = {
  jianxia: {
    name: "孤傲剑侠",
    keyword: "洒脱 · 不羁 · 快意恩仇",
    hero: "libai",
    desc: "你向往自由，不屑于世俗的条条框框。就像仗剑天涯的剑客，你用实力和浪漫对抗世界，宁可浪迹江湖，也不愿被规则束缚。",
  },
  yinren: {
    name: "隐忍谋士",
    keyword: "隐忍 · 野心 · 厚积薄发",
    hero: "hanxin",
    desc: "你内心藏着巨大的野心，却懂得隐忍与等待。你能吞下暂时的屈辱，只为在关键时刻一击制胜，把曾经承受的一切百倍奉还。",
  },
  zhizhe: {
    name: "运筹智者",
    keyword: "谋略 · 理性 · 大局观",
    hero: "zhugeliang",
    desc: "你习惯用脑子解决问题，凡事三思而后行。你相信谋定而后动，总能在混乱中看清大势，是天生的军师型人物。",
  },
  rexue: {
    name: "忠勇猛将",
    keyword: "忠义 · 勇猛 · 一往无前",
    hero: "guanyu",
    desc: "你重情重义，认定的人和事就会守护到底。你勇猛无畏，遇到困难从不退缩，是那种在关键时刻敢站出来扛事的人。",
  },
  shouhu: {
    name: "温柔守护者",
    keyword: "温柔 · 守护 · 牺牲",
    hero: "yao",
    desc: "你温柔细腻，总是默默守护着身边重要的人。你重感情、有担当，愿意为了在乎的人付出一切，是大家最安心的依靠。",
  },
  bawang: {
    name: "王者霸业",
    keyword: "强势 · 掌控 · 野心",
    hero: "wuzetian",
    desc: "你自信强大，天生就是领导者。你有明确的目标和极强的掌控欲，不甘平庸，注定要在自己的领域里登顶。",
  },
  lexiao: {
    name: "呆萌乐天派",
    keyword: "单纯 · 乐观 · 快乐至上",
    hero: "luban",
    desc: "你单纯直接、乐观向上，是人群里的开心果。你看起来人畜无害，内心却充满能量，用快乐感染着身边的每一个人。",
  },
  lengjing: {
    name: "冷静洞察者",
    keyword: "冷静 · 洞察 · 克制",
    hero: "direnjie",
    desc: "你冷静克制，善于洞察人心和真相。你习惯用理性的眼光看待世界，不轻易表露情绪，却总能一眼看穿问题的本质。",
  },
  tanxian: {
    name: "自由探险家",
    keyword: "漂泊 · 冒险 · 追寻",
    hero: "makeboluo",
    desc: "你向往远方，渴望探索未知的世界。你不甘于安稳平淡的生活，喜欢冒险和挑战，永远在路上追寻属于自己的答案。",
  },
  gangzheng: {
    name: "刚正坚守者",
    keyword: "耿直 · 原则 · 坚守",
    hero: "lianpo",
    desc: "你沉稳可靠、刚正不阿，有自己的原则和底线。你或许不善言辞，但肩膀够硬、扛得住事，是那种越处越值得信赖的人。",
  },
};

// 同族英雄：每个原型下性格相近的英雄（用于结果页「同族」展示 + 覆盖更多英雄）
const ARCHETYPE_HEROES = {
  jianxia: ["libai", "juyoujing", "lanlingwang", "jing"],
  yinren: ["hanxin", "simayi", "yingzheng", "liubang"],
  zhizhe: ["zhugeliang", "zhangliang", "zhouyu", "sima"],
  rexue: ["guanyu", "zhaoyun", "xiangyu", "dianwei", "lvbu"],
  shouhu: ["yao", "caiwenji", "daqiao", "bailishouyue", "yuji"],
  bawang: ["wuzetian", "caocao", "liubei", "nvwa"],
  lexiao: ["luban", "zhubajie", "mengqi", "xiaoqiao"],
  lengjing: ["direnjie", "bianque", "gongsunli", "zhangliang2"],
  tanxian: ["makeboluo", "nalukelulu", "lixin", "shenmengxi"],
  gangzheng: ["lianpo", "zhongkui", "sulie", "chengyaojin", "hualan"],
};

// ==================== 英雄结果库 ====================
// 每个原型有一个代表英雄（主结果），这里存其完整信息
const HEROES = {
  libai: {
    name: "李白", emoji: "🗡️", role: "刺客 · 剑仙",
    bg: "images/libai.png",
    slogan: "十步杀一人，千里不留行",
    story: "你自幼学剑，十八岁出蜀游历。曾在大明宫门口一剑劈碎城门匾额，只为表达对朝堂腐败的不屑。女帝欣赏你的才气，非但没降罪，反而放你离京。从此你浪迹天涯，成了江湖上人人称颂的诗剑仙。",
    traits: ["洒脱", "浪漫", "不羁", "快意恩仇"],
  },
  hanxin: {
    name: "韩信", emoji: "⚔️", role: "刺客 · 国士无双",
    bg: "images/hanxin.png",
    slogan: "到达胜利之前，无法回头",
    story: "你出身卑微，曾受胯下之辱、夺妻之恨，却把这些屈辱刻在骨子里。你隐忍潜伏，只为等待一个机会，以韩信之名掀起撼动大陆的风暴，将承受的一切百倍奉还。",
    traits: ["隐忍", "野心", "坚韧", "厚积薄发"],
  },
  zhugeliang: {
    name: "诸葛亮", emoji: "🪭", role: "法师 · 军师",
    bg: "images/zhugeliang.png",
    slogan: "天下如棋，一步三算",
    story: "你是稷下学院百年不遇的天才，早就算出了三分天下的结局，却依然愿意出山辅佐明主，实现天下太平的理想。你沉迷研究天书，为知己和理想鞠躬尽瘁。",
    traits: ["睿智", "谋略", "大局观", "鞠躬尽瘁"],
  },
  guanyu: {
    name: "关羽", emoji: "🔪", role: "战士 · 武圣",
    bg: "images/guanyu.png",
    slogan: "青龙偃月，忠义无双",
    story: "你一生忠义，认定了结义之情便永不背叛。胯下赤兔马、手中青龙偃月刀，你过五关斩六将，只为追随心中的道义，是所有人心中忠勇的化身。",
    traits: ["忠义", "勇猛", "坚毅", "一诺千金"],
  },
  yao: {
    name: "瑶", emoji: "🦌", role: "辅助 · 峡谷小精灵",
    bg: "images/yao.png",
    slogan: "我在你身边，别怕",
    story: "你是云梦泽的小精灵，温柔又善良。你愿意化作护盾，为在乎的人挡下一切风雨。你重情重义，用柔软的身躯守护着心中最重要的那个人。",
    traits: ["温柔", "守护", "重情", "治愈"],
  },
  wuzetian: {
    name: "武则天", emoji: "👑", role: "法师 · 女帝",
    bg: "images/wuzetian.png",
    slogan: "朕，才是唯一",
    story: "你从一介才人步步登顶，成为整个大陆唯一的女帝。你杀伐果断、掌控全局，用实力向所有人证明——王座之上，无关性别，只关乎野心与能力。",
    traits: ["强势", "果断", "领导力", "野心"],
  },
  luban: {
    name: "鲁班七号", emoji: "🤖", role: "射手 · 小霸王",
    bg: "images/luban.png",
    slogan: "鲁班大师，智商二百五",
    story: "你是鲁班大师打造的机关人偶，外表呆萌却火力十足。你单纯直接，认准的事就一股脑冲上去，用乐观和快乐感染着峡谷里的每一个人。",
    traits: ["呆萌", "乐观", "单纯", "开心果"],
  },
  direnjie: {
    name: "狄仁杰", emoji: "⚖️", role: "射手 · 神探",
    bg: "images/direnjie.png",
    slogan: "真相只有一个",
    story: "你是长安城最冷静的神探，善于洞察人心、明辨真相。你理性克制，不被表象迷惑，总能用最清醒的头脑看穿一切迷雾。",
    traits: ["冷静", "洞察", "理性", "公正"],
  },
  makeboluo: {
    name: "马可波罗", emoji: "🧭", role: "射手 · 探险家",
    bg: "images/makeboluo.png",
    slogan: "世界那么大，我想去看看",
    story: "你来自遥远的异乡，怀揣着对未知世界的无限好奇踏上旅程。你不甘于安稳，渴望探索每一寸土地，记录每一个奇迹，永远在路上追寻属于自己的答案。",
    traits: ["好奇", "冒险", "自由", "探索"],
  },
  lianpo: {
    name: "廉颇", emoji: "🥁", role: "坦克 · 老将",
    bg: "images/lianpo.png",
    slogan: "谁敢横刀立马，唯我廉颇",
    story: "你是久经沙场的老将，沉稳可靠、刚正不阿。你坚守着自己的原则和底线，用最扎实的肩膀扛起责任，是团队里最让人安心的后盾。",
    traits: ["沉稳", "可靠", "刚正", "责任感"],
  },
};

// 同族英雄的展示信息（名字 + emoji，用于结果页「同族英雄」）
const CLAN_HEROES = {
  juyoujing: { name: "橘右京", emoji: "🍊" },
  lanlingwang: { name: "兰陵王", emoji: "🎭" },
  jing: { name: "镜", emoji: "🪞" },
  simayi: { name: "司马懿", emoji: "🕶️" },
  yingzheng: { name: "嬴政", emoji: "🐉" },
  liubang: { name: "刘邦", emoji: "🏹" },
  zhangliang: { name: "张良", emoji: "📜" },
  zhouyu: { name: "周瑜", emoji: "🔥" },
  sima: { name: "司马懿", emoji: "🕶️" },
  zhaoyun: { name: "赵云", emoji: "🐉" },
  xiangyu: { name: "项羽", emoji: "⚔️" },
  dianwei: { name: "典韦", emoji: "🛡️" },
  lvbu: { name: "吕布", emoji: "🏇" },
  caiwenji: { name: "蔡文姬", emoji: "🎵" },
  daqiao: { name: "大乔", emoji: "🌊" },
  bailishouyue: { name: "百里守约", emoji: "🎯" },
  yuji: { name: "虞姬", emoji: "🏹" },
  caocao: { name: "曹操", emoji: "⚔️" },
  liubei: { name: "刘备", emoji: "🛡️" },
  nvwa: { name: "女娲", emoji: "🌌" },
  zhubajie: { name: "猪八戒", emoji: "🐷" },
  mengqi: { name: "梦奇", emoji: "☁️" },
  xiaoqiao: { name: "小乔", emoji: "🌸" },
  bianque: { name: "扁鹊", emoji: "⚗️" },
  gongsunli: { name: "公孙离", emoji: "🌺" },
  zhangliang2: { name: "张良", emoji: "📜" },
  nalukelulu: { name: "娜可露露", emoji: "🦅" },
  lixin: { name: "李信", emoji: "⚔️" },
  shenmengxi: { name: "沈梦溪", emoji: "🐱" },
  zhongkui: { name: "钟馗", emoji: "🔔" },
  sulie: { name: "苏烈", emoji: "🛡️" },
  chengyaojin: { name: "程咬金", emoji: "🪓" },
  hualan: { name: "花木兰", emoji: "🌸" },
};

// ==================== 场景抉择题 ====================
// 每题基于真实英雄背景故事，选项映射到原型
const QUESTIONS = [
  {
    title: "你辛苦打拼的成果，被有权势的人一句话就夺走了。你会怎么做？",
    options: [
      { text: "当面掀桌，用实力让他收回这句话", archetype: "jianxia" },
      { text: "先忍下来，暗中积蓄力量，等待时机百倍奉还", archetype: "yinren" },
      { text: "冷静分析局势，找到对方软肋再从容布局", archetype: "zhizhe" },
      { text: "守住底线，堂堂正正讨个说法", archetype: "gangzheng" },
    ],
  },
  {
    title: "你被羞辱了，周围人都在看你的笑话。你的第一反应是？",
    options: [
      { text: "当场反击，绝不让自己憋屈", archetype: "jianxia" },
      { text: "记住这笔账，总有一天让他们刮目相看", archetype: "yinren" },
      { text: "保持风度，一笑而过，实力才是最好的回应", archetype: "lengjing" },
      { text: "用乐观化解尴尬，转头就忘", archetype: "lexiao" },
    ],
  },
  {
    title: "朋友有难，需要你挺身而出，但可能会搭上自己的前程。你会？",
    options: [
      { text: "义无反顾，兄弟的事就是我的事", archetype: "rexue" },
      { text: "默默守护，尽力帮他但不声张", archetype: "shouhu" },
      { text: "先盘算清楚，找到两全其美的办法", archetype: "zhizhe" },
      { text: "用自己的原则判断，该帮就帮、该拒绝就拒绝", archetype: "gangzheng" },
    ],
  },
  {
    title: "你心里有一个很大的目标，但实现它需要很长时间的蛰伏。你愿意吗？",
    options: [
      { text: "愿意，为了终极目标我可以隐忍一切", archetype: "yinren" },
      { text: "愿意，我会一步步稳扎稳打地靠近", archetype: "zhizhe" },
      { text: "不太愿意，我更享受当下的自由和快乐", archetype: "lexiao" },
      { text: "愿意，我的野心不允许我平庸", archetype: "bawang" },
    ],
  },
  {
    title: "面对一段无法回头的人生抉择，你的态度是？",
    options: [
      { text: "既然选择了，就义无反顾地走下去", archetype: "rexue" },
      { text: "我会反复推演，确保每一步都不出错", archetype: "zhizhe" },
      { text: "忠于内心，做自己认为对的选择", archetype: "jianxia" },
      { text: "为了更大的事业，牺牲个人也在所不惜", archetype: "bawang" },
    ],
  },
  {
    title: "你被要求做一件违背内心原则的事，你会？",
    options: [
      { text: "断然拒绝，我的原则不容妥协", archetype: "gangzheng" },
      { text: "表面答应，暗中按自己的方式行事", archetype: "yinren" },
      { text: "权衡利弊，若利大于弊就先忍着", archetype: "lengjing" },
      { text: "为了在乎的人，我可以委屈自己", archetype: "shouhu" },
    ],
  },
  {
    title: "你更喜欢哪种生活方式？",
    options: [
      { text: "浪迹天涯，无拘无束", archetype: "jianxia" },
      { text: "探索未知，看遍世界的风景", archetype: "tanxian" },
      { text: "安稳平淡，陪伴重要的人", archetype: "shouhu" },
      { text: "快快乐乐，开心最重要", archetype: "lexiao" },
    ],
  },
  {
    title: "团队陷入危机，你最可能扮演什么角色？",
    options: [
      { text: "冲在最前面，用热血点燃大家", archetype: "rexue" },
      { text: "冷静分析，给出破局的关键思路", archetype: "zhizhe" },
      { text: "稳定军心，默默承担最重的担子", archetype: "gangzheng" },
      { text: "照顾每个人的情绪，把大家凝聚在一起", archetype: "shouhu" },
    ],
  },
  {
    title: "面对一个强大的对手，你会怎么看待他？",
    options: [
      { text: "兴奋，正好磨炼我的实力", archetype: "rexue" },
      { text: "研究他，直到找到他的破绽", archetype: "lengjing" },
      { text: "不把他放眼里，我的目标在他之上", archetype: "bawang" },
      { text: "当他是路上的风景，我走我的路", archetype: "tanxian" },
    ],
  },
  {
    title: "你人生最看重的是什么？",
    options: [
      { text: "自由，不被任何事束缚", archetype: "tanxian" },
      { text: "情感，守护我爱的人和爱我的人", archetype: "shouhu" },
      { text: "事业与功名，站上人生的巅峰", archetype: "bawang" },
      { text: "真理与智慧，看透这个世界的本质", archetype: "lengjing" },
    ],
  },
  {
    title: "如果只能选一种品质，你希望自己拥有？",
    options: [
      { text: "无坚不摧的勇气", archetype: "rexue" },
      { text: "深不可测的智慧", archetype: "zhizhe" },
      { text: "百折不挠的坚韧", archetype: "yinren" },
      { text: "温暖人心的善良", archetype: "shouhu" },
    ],
  },
  {
    title: "面对背叛你的人，你会？",
    options: [
      { text: "快意恩仇，当面讨个说法", archetype: "jianxia" },
      { text: "记在心里，用成功让他们后悔", archetype: "yinren" },
      { text: "理性分析，从此敬而远之", archetype: "lengjing" },
      { text: "守住自己的道义，不为所动", archetype: "gangzheng" },
    ],
  },
  {
    title: "你的朋友通常会怎么形容你？",
    options: [
      { text: "热血讲义气，靠得住", archetype: "rexue" },
      { text: "聪明有想法，总能点醒大家", archetype: "zhizhe" },
      { text: "温柔体贴，让人想依赖", archetype: "shouhu" },
      { text: "乐观开朗，走到哪都开心", archetype: "lexiao" },
    ],
  },
  {
    title: "你更愿意去哪个地方生活？",
    options: [
      { text: "繁华的都城，那里有我要征服的舞台", archetype: "bawang" },
      { text: "宁静的山水，与世无争", archetype: "gangzheng" },
      { text: "未知的远方，一路探险", archetype: "tanxian" },
      { text: "江湖四海，走到哪算哪", archetype: "jianxia" },
    ],
  },
  {
    title: "遇到一件让你热血沸腾的挑战，你的态度是？",
    options: [
      { text: "跃跃欲试，立刻冲上去", archetype: "rexue" },
      { text: "先冷静谋划，再精准出手", archetype: "lengjing" },
      { text: "这正是证明我自己的机会", archetype: "bawang" },
      { text: "享受过程，输赢都是一种体验", archetype: "tanxian" },
    ],
  },
  {
    title: "如果人生可以重来，你最想改变什么？",
    options: [
      { text: "没什么想改的，我的人生就是要尽兴", archetype: "lexiao" },
      { text: "早点看清人心，少走弯路", archetype: "lengjing" },
      { text: "抓住更多机会，登上更高的位置", archetype: "bawang" },
      { text: "多出去走走，看看更大的世界", archetype: "tanxian" },
    ],
  },
  {
    title: "你的理想被别人否定，甚至嘲笑。你会怎么回应？",
    options: [
      { text: "懒得争辩，我走我的路，让他们说去", archetype: "jianxia" },
      { text: "用结果证明，等我做到了自然闭嘴", archetype: "yinren" },
      { text: "冷静复盘，看看他们的说法有没有道理", archetype: "lengjing" },
      { text: "坚持己见，我认定的事不会轻易动摇", archetype: "gangzheng" },
    ],
  },
  {
    title: "你更愿意成为哪种人？",
    options: [
      { text: "仗剑天涯的侠客，快意恩仇", archetype: "jianxia" },
      { text: "运筹帷幄的军师，决胜千里", archetype: "zhizhe" },
      { text: "守护一方的英雄，让人安心", archetype: "rexue" },
      { text: "温柔体贴的知己，治愈人心", archetype: "shouhu" },
    ],
  },
  {
    title: "一次重要的机会摆在你面前，但风险很大。你会？",
    options: [
      { text: "梭哈！机会来了就要抓住", archetype: "rexue" },
      { text: "仔细评估，有把握了再上", archetype: "zhizhe" },
      { text: "为了我的野心，值得赌一把", archetype: "bawang" },
      { text: "冒险才有意思，输赢都精彩", archetype: "tanxian" },
    ],
  },
  {
    title: "你更喜欢和什么样的人相处？",
    options: [
      { text: "真诚热血的，在一起痛快", archetype: "rexue" },
      { text: "聪明有深度的，能聊到一起", archetype: "lengjing" },
      { text: "温柔包容的，相处不累", archetype: "shouhu" },
      { text: "有趣好玩的，天天都开心", archetype: "lexiao" },
    ],
  },
  {
    title: "如果团队里有人偷懒拖后腿，你会？",
    options: [
      { text: "直接指出，不留情面", archetype: "gangzheng" },
      { text: "默默多扛一些，先把事做成", archetype: "shouhu" },
      { text: "想办法激励他，把大家拧成一股绳", archetype: "zhizhe" },
      { text: "无所谓，我做好自己那份就行", archetype: "tanxian" },
    ],
  },
  {
    title: "你理想中的一天是怎样的？",
    options: [
      { text: "和知己对饮，谈天说地", archetype: "jianxia" },
      { text: "读一本书，安静地思考", archetype: "lengjing" },
      { text: "陪伴家人，享受温馨时光", archetype: "shouhu" },
      { text: "约上好友，玩个尽兴", archetype: "lexiao" },
    ],
  },
  {
    title: "你如何看待「规则」？",
    options: [
      { text: "规则是用来打破的", archetype: "jianxia" },
      { text: "规则要灵活运用，为我所用", archetype: "zhizhe" },
      { text: "规则必须遵守，这是底线", archetype: "gangzheng" },
      { text: "规则是强者制定的，我要成为强者", archetype: "bawang" },
    ],
  },
  {
    title: "你更容易被哪种故事打动？",
    options: [
      { text: "英雄迟暮、壮士断腕的悲壮", archetype: "rexue" },
      { text: "隐忍多年、一朝翻盘的爽快", archetype: "yinren" },
      { text: "默默守护、至死不渝的深情", archetype: "shouhu" },
      { text: "白手起家、问鼎天下的传奇", archetype: "bawang" },
    ],
  },
  {
    title: "面对一个两难的选择，你最可能靠什么做决定？",
    options: [
      { text: "直觉和热血，跟着心走", archetype: "jianxia" },
      { text: "理性分析，权衡利弊", archetype: "lengjing" },
      { text: "内心的原则和底线", archetype: "gangzheng" },
      { text: "哪个对长远目标更有利", archetype: "zhizhe" },
    ],
  },
  {
    title: "如果有一天你功成名就，你会？",
    options: [
      { text: "继续探索，寻找更大的世界", archetype: "tanxian" },
      { text: "回馈身边那些帮助过我的人", archetype: "shouhu" },
      { text: "享受胜利，让所有人看到我的光芒", archetype: "bawang" },
      { text: "笑看风云，逍遥自在", archetype: "jianxia" },
    ],
  },
  {
    title: "你最讨厌别人说你什么？",
    options: [
      { text: "说你软弱、没骨气", archetype: "rexue" },
      { text: "说你没用、一事无成", archetype: "bawang" },
      { text: "说你冷漠、不讲情义", archetype: "shouhu" },
      { text: "说你无趣、不会玩", archetype: "lexiao" },
    ],
  },
  {
    title: "你更愿意为什么样的事业奋斗？",
    options: [
      { text: "保家卫国、守护一方", archetype: "rexue" },
      { text: "开创一番前所未有的伟业", archetype: "bawang" },
      { text: "传播智慧和真理", archetype: "lengjing" },
      { text: "守护所爱之人的幸福", archetype: "shouhu" },
    ],
  },
  {
    title: "遇到委屈的时候，你习惯怎么消化？",
    options: [
      { text: "当场发泄，绝不憋在心里", archetype: "jianxia" },
      { text: "记在心里，化作前进的动力", archetype: "yinren" },
      { text: "自己消化，过会儿就好了", archetype: "lengjing" },
      { text: "吃点好吃的、玩一玩，就忘了", archetype: "lexiao" },
    ],
  },
  {
    title: "如果要你带领一个团队，你会怎么带？",
    options: [
      { text: "身先士卒，用热血感染大家", archetype: "rexue" },
      { text: "运筹帷幄，安排好每个人的位置", archetype: "zhizhe" },
      { text: "恩威并施，牢牢掌控全局", archetype: "bawang" },
      { text: "以身作则，守住规矩和底线", archetype: "gangzheng" },
    ],
  },
  {
    title: "你心中「酷」的定义是？",
    options: [
      { text: "快意恩仇，敢作敢当", archetype: "jianxia" },
      { text: "深藏不露，一鸣惊人", archetype: "yinren" },
      { text: "云淡风轻，看透一切", archetype: "lengjing" },
      { text: "无所畏惧，说走就走", archetype: "tanxian" },
    ],
  },
  {
    title: "你最近的一个小目标是？",
    options: [
      { text: "学会一个新技能，让自己更强", archetype: "yinren" },
      { text: "把生活过得开开心心", archetype: "lexiao" },
      { text: "去一个没去过的地方看看", archetype: "tanxian" },
      { text: "帮身边的朋友解决一个难题", archetype: "shouhu" },
    ],
  },
  {
    title: "遇到不公平的竞争，你会怎么应对？",
    options: [
      { text: "用实力硬刚，谁怕谁", archetype: "rexue" },
      { text: "先蛰伏，找准机会再翻盘", archetype: "yinren" },
      { text: "冷静寻找规则漏洞，巧妙取胜", archetype: "zhizhe" },
      { text: "守住底线，堂堂正正赢回来", archetype: "gangzheng" },
    ],
  },
  {
    title: "你更喜欢一个人还是和大家在一起？",
    options: [
      { text: "一个人自由自在，无拘无束", archetype: "tanxian" },
      { text: "和大家在一起，热闹开心", archetype: "lexiao" },
      { text: "独处时思考，和知己偶尔小聚", archetype: "lengjing" },
      { text: "看情况，重要的人在我就在", archetype: "shouhu" },
    ],
  },
  {
    title: "如果给你一次回到过去的机会，你会？",
    options: [
      { text: "回到关键时刻，做出更勇敢的选择", archetype: "rexue" },
      { text: "弥补遗憾，抓住错过的机会", archetype: "bawang" },
      { text: "好好看看曾经错过的风景", archetype: "tanxian" },
      { text: "不想回去，过去就让它过去", archetype: "lengjing" },
    ],
  },
  {
    title: "你最欣赏哪种英雄气概？",
    options: [
      { text: "虽千万人吾往矣的勇猛", archetype: "rexue" },
      { text: "运筹帷幄、决胜千里的智慧", archetype: "zhizhe" },
      { text: "忍辱负重、终成大业的坚韧", archetype: "yinren" },
      { text: "快意恩仇、笑傲江湖的洒脱", archetype: "jianxia" },
    ],
  },
  {
    title: "面对感情，你更倾向于哪种态度？",
    options: [
      { text: "轰轰烈烈，爱就爱得尽兴", archetype: "jianxia" },
      { text: "细水长流，默默守护", archetype: "shouhu" },
      { text: "顺其自然，不强求不将就", archetype: "lengjing" },
      { text: "随心而动，开心就好", archetype: "lexiao" },
    ],
  },
  {
    title: "你在团队里最不想成为哪种角色？",
    options: [
      { text: "被人摆布的棋子", archetype: "bawang" },
      { text: "拖后腿的累赘", archetype: "yinren" },
      { text: "没有主见的附和者", archetype: "gangzheng" },
      { text: "被束缚在条条框框里的人", archetype: "jianxia" },
    ],
  },
  {
    title: "你更相信哪种成功之道？",
    options: [
      { text: "敢打敢拼，一往无前", archetype: "rexue" },
      { text: "厚积薄发，谋定后动", archetype: "yinren" },
      { text: "运筹帷幄，步步为营", archetype: "zhizhe" },
      { text: "脚踏实地，稳扎稳打", archetype: "gangzheng" },
    ],
  },
  {
    title: "如果有一天你累了，最想做什么？",
    options: [
      { text: "去一个没人认识的地方走走", archetype: "tanxian" },
      { text: "回到家人朋友身边，好好休息", archetype: "shouhu" },
      { text: "一个人安静地待着", archetype: "lengjing" },
      { text: "找朋友喝酒聊天，痛痛快快", archetype: "lexiao" },
    ],
  },
  {
    title: "你如何看待「忠诚」？",
    options: [
      { text: "认定了就义无反顾，至死不渝", archetype: "rexue" },
      { text: "忠诚是相互的，值得才付出", archetype: "lengjing" },
      { text: "忠于自己的内心和原则", archetype: "gangzheng" },
      { text: "忠于值得守护的人和事", archetype: "shouhu" },
    ],
  },
  {
    title: "你更想拥有哪种能力？",
    options: [
      { text: "一眼看穿真相的洞察力", archetype: "lengjing" },
      { text: "力挽狂澜的勇气和力量", archetype: "rexue" },
      { text: "运筹帷幄的谋略", archetype: "zhizhe" },
      { text: "温暖治愈人心的能力", archetype: "lexiao" },
    ],
  },
  {
    title: "面对生活的压力，你通常怎么扛？",
    options: [
      { text: "化压力为动力，越挫越勇", archetype: "yinren" },
      { text: "乐观面对，笑一笑就过去了", archetype: "lexiao" },
      { text: "自己慢慢消化，冷静处理", archetype: "lengjing" },
      { text: "找朋友倾诉，一起分担", archetype: "shouhu" },
    ],
  },
  {
    title: "你更愿意过哪种人生？",
    options: [
      { text: "波澜壮阔，轰轰烈烈", archetype: "rexue" },
      { text: "功成名就，登顶巅峰", archetype: "bawang" },
      { text: "自由随性，无牵无挂", archetype: "tanxian" },
      { text: "温暖安稳，岁月静好", archetype: "gangzheng" },
    ],
  },
  {
    title: "如果要做一件大事，你会选择？",
    options: [
      { text: "单枪匹马，闯出一片天", archetype: "jianxia" },
      { text: "网罗人才，共图大业", archetype: "bawang" },
      { text: "精心布局，步步为营", archetype: "zhizhe" },
      { text: "团结伙伴，同心协力", archetype: "rexue" },
    ],
  },
  {
    title: "你更讨厌哪种处境？",
    options: [
      { text: "被人看不起、被轻视", archetype: "bawang" },
      { text: "被束缚、失去自由", archetype: "jianxia" },
      { text: "孤独、没有人陪伴", archetype: "shouhu" },
      { text: "无聊、一成不变", archetype: "tanxian" },
    ],
  },
  {
    title: "遇到困难，你最先想到谁？",
    options: [
      { text: "我自己，靠自己最靠谱", archetype: "gangzheng" },
      { text: "朋友，一起想办法", archetype: "rexue" },
      { text: "重要的人，有他在我就安心", archetype: "shouhu" },
      { text: "谁也不找，自己默默扛", archetype: "tanxian" },
    ],
  },
  {
    title: "你理想中的「朋友」是什么样？",
    options: [
      { text: "志同道合，一起仗剑天涯", archetype: "jianxia" },
      { text: "生死与共，肝胆相照", archetype: "rexue" },
      { text: "懂我、理解我，不用多说", archetype: "lengjing" },
      { text: "在一起就开心，简单纯粹", archetype: "lexiao" },
    ],
  },
  {
    title: "你更看重一个人哪方面的品质？",
    options: [
      { text: "真诚和义气", archetype: "rexue" },
      { text: "智慧和格局", archetype: "zhizhe" },
      { text: "温柔和善良", archetype: "shouhu" },
      { text: "有趣和乐观", archetype: "lexiao" },
    ],
  },
  {
    title: "如果只能选一句人生信条？",
    options: [
      { text: "活着就要轰轰烈烈", archetype: "rexue" },
      { text: "君子报仇，十年不晚", archetype: "yinren" },
      { text: "我命由我不由天", archetype: "bawang" },
      { text: "但行好事，莫问前程", archetype: "gangzheng" },
    ],
  },
  {
    title: "你更喜欢哪种风景？",
    options: [
      { text: "壮阔的战场，金戈铁马", archetype: "rexue" },
      { text: "宁静的山水，远离喧嚣", archetype: "lengjing" },
      { text: "未知的远方，一路惊喜", archetype: "tanxian" },
      { text: "热闹的街市，人间烟火", archetype: "lexiao" },
    ],
  },
];

// ===== 状态 =====
let currentQ = 0;
let answers = {}; // { 题索引: archetypeKey } 记录每道题的答案
let activeQuestions = []; // 本次测试随机抽取的题目
let isAdvancing = false; // 自动跳转期间锁定，防止连点

const QUIZ_SIZE = 16; // 每次测试抽 16 道题

// Fisher-Yates 洗牌
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  return a;
}

// 从题库随机抽取 QUIZ_SIZE 道并打乱顺序，同时固定每道题的选项顺序
function pickQuestions() {
  return shuffle(QUESTIONS).slice(0, QUIZ_SIZE).map((q) => ({
    title: q.title,
    options: shuffle(q.options),
  }));
}

// ===== DOM =====
const startPage = document.getElementById("startPage");
const quizPage = document.getElementById("quizPage");
const resultPage = document.getElementById("resultPage");
const progressFill = document.getElementById("progressFill");
const progressNum = document.getElementById("progressNum");
const qTitle = document.getElementById("qTitle");
const optionsEl = document.getElementById("options");
const resultBox = document.getElementById("resultBox");
const prevBtn = document.getElementById("prevBtn");

const TAG_LETTERS = ["A", "B", "C", "D"];

function showPage(page) {
  [startPage, quizPage, resultPage].forEach((p) => p.classList.remove("active"));
  page.classList.add("active");
  window.scrollTo(0, 0);
}

// ===== 答题 =====
function renderQuestion() {
  const q = activeQuestions[currentQ];
  qTitle.textContent = q.title;
  progressFill.style.width = (currentQ / activeQuestions.length) * 100 + "%";
  progressNum.textContent = currentQ + 1 + " / " + activeQuestions.length;

  // 选项顺序已在抽取时固定，直接使用
  const opts = q.options;
  const selected = answers[currentQ];

  optionsEl.innerHTML = "";
  opts.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "option";
    if (opt.archetype === selected) btn.classList.add("selected");
    btn.innerHTML = '<span class="opt-tag">' + TAG_LETTERS[i] + "</span>" + opt.text;
    btn.addEventListener("click", () => selectOption(opt));
    optionsEl.appendChild(btn);
  });

  // 上一题按钮：第一题禁用
  prevBtn.disabled = currentQ === 0;
  prevBtn.classList.toggle("disabled", currentQ === 0);
}

function selectOption(opt) {
  if (isAdvancing) return; // 跳转期间忽略重复点击
  isAdvancing = true;

  answers[currentQ] = opt.archetype;

  // 立即高亮当前选项作为反馈
  const optionBtns = optionsEl.querySelectorAll(".option");
  const selectedIdx = activeQuestions[currentQ].options.findIndex(
    (o) => o.archetype === opt.archetype && o.text === opt.text
  );
  optionBtns.forEach((btn) => btn.classList.remove("selected"));
  if (selectedIdx >= 0) optionBtns[selectedIdx].classList.add("selected");

  // 选中后短暂停顿（让用户看到选中反馈），再自动进入下一题
  setTimeout(() => {
    if (currentQ < activeQuestions.length - 1) {
      currentQ++;
      renderQuestion();
    } else {
      showResult();
    }
    isAdvancing = false;
  }, 200);
}

function goPrev() {
  if (currentQ > 0) {
    currentQ--;
    renderQuestion();
  }
}

// 根据答案统计分数
function calcScores() {
  const sc = {};
  for (const idx in answers) {
    const key = answers[idx];
    sc[key] = (sc[key] || 0) + 1;
  }
  return sc;
}

// ===== 结果匹配 =====
// 按原型得分排序
function rankedArchetypes() {
  const scores = calcScores();
  const list = Object.keys(ARCHETYPES).map((key) => ({
    key: key,
    archetype: ARCHETYPES[key],
    score: scores[key] || 0,
  }));
  list.sort((a, b) => b.score - a.score);
  return list;
}

function showResult() {
  const ranking = rankedArchetypes();
  const top = ranking[0];
  const arch = top.archetype;
  const hero = HEROES[arch.hero];

  // 设置结果页背景为该英雄的专属图
  document.getElementById("resultBg").style.backgroundImage = "url(" + hero.bg + ")";

  // 同族英雄
  const clan = ARCHETYPE_HEROES[top.key] || [];
  const clanHeroes = clan
    .filter((key) => CLAN_HEROES[key])
    .map((key) => CLAN_HEROES[key]);

  // 原型亲和度排名条（Top 4）
  const maxScore = top.score || 1;
  const rankRows = ranking
    .slice(0, 4)
    .map((item, idx) => {
      const pct = Math.round((item.score / maxScore) * 100);
      const medal = ["🥇", "🥈", "🥉", "4"][idx];
      return (
        '<div class="rank-row">' +
        '<span class="rank-medal">' + medal + "</span>" +
        '<div class="rank-body">' +
        '<div class="rank-head"><span class="rank-name">' + item.archetype.name + "</span>" +
        '<span class="rank-score">' + item.score + " 分</span></div>" +
        '<div class="rank-track"><div class="rank-fill" data-width="' + pct + '"></div></div>' +
        "</div>" +
        "</div>"
      );
    })
    .join("");

  const traits = hero.traits.map((t) => '<span class="trait">' + t + "</span>").join("");
  const clanTags = clanHeroes
    .map((h) => '<span class="clan-hero">' + h.emoji + " " + h.name + "</span>")
    .join("");

  resultBox.innerHTML =
    '<div class="result-hero">' + hero.emoji + "</div>" +
    '<div class="result-tag">你的灵魂英雄</div>' +
    '<div class="result-name">' + hero.name + "</div>" +
    '<div class="result-role">' + hero.role + "</div>" +
    '<div class="result-slogan">「' + hero.slogan + "」</div>" +
    '<div class="result-archetype">你的人格原型：' + arch.name + " · " + arch.keyword + "</div>" +
    '<div class="desc-card">' +
    "<h3>人格解析</h3>" +
    "<p>" + arch.desc + "</p>" +
    '<div class="traits">' + traits + "</div>" +
    "</div>" +
    '<div class="story-card">' +
    "<h3>英雄背景故事</h3>" +
    "<p>" + hero.story + "</p>" +
    "</div>" +
    '<div class="clan-box">' +
    "<h3>和你气质相近的英雄</h3>" +
    '<div class="clan-list">' + clanTags + "</div>" +
    "</div>" +
    '<div class="rank-box">' +
    "<h3>你的人格原型 TOP 4</h3>" +
    '<div class="rank-list">' + rankRows + "</div>" +
    "</div>" +
    '<div class="result-actions">' +
    '<button class="btn-primary" id="retryBtn">再测一次</button>' +
    '<button class="btn-secondary" id="shareBtn">下载结果</button>' +
    "</div>";

  showPage(resultPage);

  requestAnimationFrame(() => {
    document.querySelectorAll(".rank-fill").forEach((el) => {
      el.style.width = el.dataset.width + "%";
    });
  });

  document.getElementById("retryBtn").addEventListener("click", reset);
  document.getElementById("shareBtn").addEventListener("click", downloadResult);
}

// 下载结果：用 Canvas 生成一张结果卡片图片（PNG）
function downloadResult() {
  const ranking = rankedArchetypes();
  const top = ranking[0];
  const arch = top.archetype;
  const hero = HEROES[arch.hero];

  const W = 750;
  const H = 1200;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  // 背景
  const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
  bgGrad.addColorStop(0, "#0d1b2a");
  bgGrad.addColorStop(0.5, "#08121e");
  bgGrad.addColorStop(1, "#0d1b2a");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // 顶部金色光晕
  const glow = ctx.createRadialGradient(W / 2, 80, 0, W / 2, 80, 260);
  glow.addColorStop(0, "rgba(245,200,66,0.28)");
  glow.addColorStop(1, "rgba(245,200,66,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // 描边卡片框
  ctx.strokeStyle = "rgba(245,200,66,0.55)";
  ctx.lineWidth = 4;
  ctx.strokeRect(24, 24, W - 48, H - 48);
  ctx.strokeStyle = "rgba(245,200,66,0.2)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(40, 40, W - 80, H - 80);

  let y = 0;

  // 标题
  ctx.textAlign = "center";
  ctx.fillStyle = "#f5c842";
  ctx.font = "bold 40px 'PingFang SC', 'Microsoft YaHei', sans-serif";
  y = 120;
  ctx.fillText("王者荣耀 · 英雄人格测试", W / 2, y);

  ctx.fillStyle = "rgba(234,242,251,0.7)";
  ctx.font = "22px 'PingFang SC', 'Microsoft YaHei', sans-serif";
  ctx.fillText("—— 你的灵魂英雄 ——", W / 2, y + 46);

  // 英雄头像 emoji（圆形光晕）
  ctx.beginPath();
  ctx.arc(W / 2, 300, 80, 0, Math.PI * 2);
  const heroGlow = ctx.createRadialGradient(W / 2, 300, 20, W / 2, 300, 80);
  heroGlow.addColorStop(0, "rgba(245,200,66,0.5)");
  heroGlow.addColorStop(1, "rgba(74,168,255,0.15)");
  ctx.fillStyle = heroGlow;
  ctx.fill();

  ctx.font = "110px 'Segoe UI Emoji', 'Apple Color Emoji', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(hero.emoji, W / 2, 302);

  // 英雄名
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 64px 'PingFang SC', 'Microsoft YaHei', sans-serif";
  y = 440;
  ctx.fillText(hero.name, W / 2, y);

  // 定位
  ctx.fillStyle = "#4aa8ff";
  ctx.font = "30px 'PingFang SC', 'Microsoft YaHei', sans-serif";
  ctx.fillText(hero.role, W / 2, y + 52);

  // 标语
  ctx.fillStyle = "rgba(234,242,251,0.92)";
  ctx.font = "italic 28px 'PingFang SC', 'Microsoft YaHei', sans-serif";
  ctx.fillText("「" + hero.slogan + "」", W / 2, y + 108);

  // 人格原型标签
  ctx.fillStyle = "#f5c842";
  ctx.font = "26px 'PingFang SC', 'Microsoft YaHei', sans-serif";
  ctx.fillText("你的人格原型 · " + arch.name, W / 2, y + 166);
  ctx.fillStyle = "rgba(234,242,251,0.6)";
  ctx.font = "22px 'PingFang SC', 'Microsoft YaHei', sans-serif";
  ctx.fillText(arch.keyword, W / 2, y + 202);

  // 分隔线
  y = 720;
  ctx.strokeStyle = "rgba(245,200,66,0.35)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(120, y);
  ctx.lineTo(W - 120, y);
  ctx.stroke();

  // 背景故事（自动换行）
  ctx.fillStyle = "#f5c842";
  ctx.font = "bold 26px 'PingFang SC', 'Microsoft YaHei', sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("英雄背景故事", 100, y + 56);

  ctx.fillStyle = "rgba(234,242,251,0.92)";
  ctx.font = "24px 'PingFang SC', 'Microsoft YaHei', sans-serif";
  const storyLines = wrapText(ctx, hero.story, W - 200);
  let sy = y + 104;
  storyLines.forEach((line) => {
    ctx.fillText(line, 100, sy);
    sy += 40;
  });

  // 底部引导语
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(234,242,251,0.55)";
  ctx.font = "22px 'PingFang SC', 'Microsoft YaHei', sans-serif";
  ctx.fillText("—— 快来测测你是哪位英雄 ——", W / 2, H - 80);

  // 导出
  canvas.toBlob(function (blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = hero.name + "-人格测试结果.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, "image/png");
}

// 按像素宽度对中文文本自动换行
function wrapText(ctx, text, maxWidth) {
  const lines = [];
  let line = "";
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const test = line + ch;
    if (ctx.measureText(test).width > maxWidth && line !== "") {
      lines.push(line);
      line = ch;
    } else {
      line = test;
    }
  }
  if (line !== "") lines.push(line);
  return lines;
}

function matchHeroKey() {
  const ranking = rankedArchetypes();
  return ranking[0].archetype.hero;
}

function reset() {
  currentQ = 0;
  answers = {};
  activeQuestions = pickQuestions();
  renderQuestion();
  showPage(quizPage);
}

// ===== 启动 =====
document.getElementById("startBtn").addEventListener("click", () => {
  reset();
});
prevBtn.addEventListener("click", goPrev);
// 预抽一组，避免首屏空题
activeQuestions = pickQuestions();
renderQuestion();
