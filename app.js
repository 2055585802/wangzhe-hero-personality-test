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

const ARCHETYPE_HEROES = {
  jianxia:  ["juyoujing", "lanlingwang", "jing", "peiqinhu", "yao2"],
  yinren:   ["simayi", "yingzheng", "liubang", "baiqi", "ake"],
  zhizhe:   ["zhangliang", "zhouyu", "guiguzi", "jiangziya", "taiyizhengren"],
  rexue:    ["zhaoyun", "xiangyu", "dianwei", "lvbu", "damo", "yangjian"],
  shouhu:   ["caiwenji", "daqiao", "bailishouyue", "yuji", "mingshiyin", "zhuangzhou"],
  bawang:   ["caocao", "liubei", "nvwa", "chengjisihan", "miyue"],
  lexiao:   ["zhubajie", "mengqi", "xiaoqiao", "anqila"],
  lengjing: ["bianque", "gongsunli", "yixing", "yuanwu"],
  tanxian:  ["nalukelulu", "lixin", "yadianna", "yunzhongjun"],
  gangzheng:["zhongkui", "sulie", "chengyaojin", "hualan", "yuehou", "yase"],
};

const HEROES = {
  // ===== 孤傲剑侠 =====
  libai:        { name: "李白",   emoji: "🗡️", role: "刺客 · 剑仙",      slogan: "十步杀一人，千里不留行",         story: "你自幼学剑，十八岁出蜀游历。曾在大明宫门口一剑劈碎城门匾额，只为表达对朝堂腐败的不屑。女帝欣赏你的才气，非但没降罪，反而放你离京。从此你浪迹天涯，成了江湖上人人称颂的诗剑仙。",     traits: ["洒脱","浪漫","不羁","快意恩仇"] },
  juyoujing:    { name: "橘右京", emoji: "🍊", role: "刺客 · 剑客",      slogan: "剑之所向，心之所往",             story: "你来自东瀛，腰间永远挂着那把「细雪」。你外表冷峻、内心温柔，为了守护心中重要的人，可以跨越山海。你剑法凌厉，却在不经意间流露出一丝柔情，是亦正亦邪的孤独剑客。",                       traits: ["冷峻","深情","专注","亦正亦邪"] },
  lanlingwang:  { name: "兰陵王", emoji: "🎭", role: "刺客 · 面具之刃",  slogan: "面具之下，是守护你的脸",         story: "你是北齐的王子，因容貌俊美反受猜忌，于是戴上狰狞面具征战沙场。你沉默寡言，却把所有的温柔都留给了最在意的人。你的冷酷只是铠甲，杀戮只为守护。",                                       traits: ["神秘","深情","隐忍","守护"] },
  jing:         { name: "镜",     emoji: "🪞", role: "刺客 · 镜像战士",  slogan: "镜像万千，唯我本真",             story: "你是玄雍的镜之战士，能复制世间万物，唯独看不清自己内心的执念。你在无数的镜像中追问自我，最终明白：真正的强大，是接受那个有瑕疵的自己。",                                                   traits: ["自我","独立","果决","追问"] },
  peiqinhu:     { name: "裴擒虎", emoji: "🐯", role: "刺客 · 双形态战士",slogan: "人心，比虎更难驯服",             story: "你体内流着两个灵魂——一个是人，一个是虎。你在两种形态间切换，直到有一天你明白，不必压制任何一面，因为你本就是完整的你。",                                                                  traits: ["双面","狂野","自我","热血"] },
  yao2:         { name: "曜",     emoji: "☀️", role: "战士 · 星辰剑士",  slogan: "我不是天才，我只是比别人更努力", story: "你是稷下学院最努力的学生，仰望着天才李白的背影前行。你嘴上说着要超越他，心里却清楚：你追的不是李白，而是那个不愿服输的自己。每一道剑光，都是你写给命运的答卷。",                   traits: ["热血","不服输","努力","少年气"] },

  // ===== 隐忍谋士 =====
  hanxin:       { name: "韩信",   emoji: "⚔️", role: "刺客 · 国士无双",  slogan: "到达胜利之前，无法回头",         story: "你出身卑微，曾受胯下之辱、夺妻之恨，却把这些屈辱刻在骨子里。你隐忍潜伏，只为等待一个机会，以韩信之名掀起撼动大陆的风暴，将承受的一切百倍奉还。",                                   traits: ["隐忍","野心","坚韧","厚积薄发"] },
  simayi:       { name: "司马懿", emoji: "🕶️", role: "法师 · 暗影君王",  slogan: "我能看到所有结局",               story: "你是魏国最深的谋略家，能看穿所有人的心思，却始终隐藏着自己的野心。你不露锋芒、不争一时，在所有人以为你退场时，才发现自己早已在你的棋局之中。",                                            traits: ["深沉","谋略","伪装","大局观"] },
  yingzheng:    { name: "嬴政",   emoji: "🐉", role: "法师 · 永恒帝王",  slogan: "天上天下，唯朕一人",             story: "你是扫六合、平天下的千古一帝，统一了所有分裂的土地，也斩断了所有动摇王座的隐患。你雄才大略、铁血无情，登顶之后却发现，真正的孤独从这时才开始。",                                              traits: ["霸业","铁腕","孤独","帝王"] },
  liubang:      { name: "刘邦",   emoji: "🏹", role: "战士 · 布衣天子",  slogan: "能用的人，就是最好的人",         story: "你出身草莽，知人善任，把张良、韩信、萧何这些天才全部拢到麾下。你或许不是最强的，但你最懂得「让别人发光」。",                                                                                  traits: ["圆融","识人","大度","人情练达"] },
  baiqi:        { name: "白起",   emoji: "🩸", role: "战士 · 杀神之刃",  slogan: "我所到之处，皆是战场",           story: "你是秦国最锋利的那把刀，一生未尝败绩。你冷面寡言，从不解释自己的所作所为——直到战争的尽头，人们才读懂你眼中的悲悯：所谓杀神，不过是不愿看见更多人死去。",                                     traits: ["锋利","沉默","悲悯","极致"] },
  ake:          { name: "阿轲",   emoji: "🗡️", role: "刺客 · 暴击之刃",  slogan: "不是你记忆中的那个人",           story: "你是没落贵族的最后一人，背负着家族的血仇隐姓埋名。你用花名游走于江湖，每一刀都是复仇，每一步都是算计。直到遇见那个让你放下复仇的人。",                                                              traits: ["决绝","隐忍","宿命","深情"] },

  // ===== 运筹智者 =====
  zhugeliang:   { name: "诸葛亮", emoji: "🪭", role: "法师 · 军师",      slogan: "天下如棋，一步三算",             story: "你是稷下学院百年不遇的天才，早就算出了三分天下的结局，却依然愿意出山辅佐明主，实现天下太平的理想。你沉迷研究天书，为知己和理想鞠躬尽瘁。",                                                     traits: ["睿智","谋略","大局观","鞠躬尽瘁"] },
  zhangliang:   { name: "张良",   emoji: "📜", role: "法师 · 谋略圣手",  slogan: "最好的胜利，是不战而胜",         story: "你是韩国贵族之后，家国覆灭之后选择拿起书卷而非剑。你用谋略而非武力复仇——运筹帷幄，决胜千里。你相信，真正的胜利，是让对手连出手的机会都没有。",                                                  traits: ["睿智","克制","谋略","风度"] },
  zhouyu:       { name: "周瑜",   emoji: "🔥", role: "法师 · 江东都督",  slogan: "既生瑜，何生亮",                 story: "你是江东最耀眼的将星，文武双全、风度翩翩。你一生最大的对手，是那位让你既敬又妒的诸葛亮。直到赤壁的火光映红江面，你才明白——这世上最强的对手，也是一种知己。",                                 traits: ["傲气","才情","优雅","好胜"] },
  guiguzi:      { name: "鬼谷子", emoji: "🐍", role: "辅助 · 纵横术士",  slogan: "万物皆可为我所用",               story: "你是纵横家的鼻祖，门下弟子无一不是当世英豪。你深谙人性，能用一句话翻覆天下局势。你隐于深山，却始终俯瞰棋局——最强的棋手，永远不下场。",                                                            traits: ["深邃","神秘","通透","超然"] },
  jiangziya:    { name: "姜子牙", emoji: "🪄", role: "法师 · 封神者",    slogan: "愿者，智者；智者，愿者",         story: "你在昆仑山修行四十载，只为等待那个值得你辅佐的人。你不轻易出手，因为你知道：选对方向，比努力重要一万倍。",                                                                                            traits: ["耐心","远见","择善","执着"] },
  taiyizhengren:{ name: "太乙真人",emoji: "🍳", role: "辅助 · 仙风道士",slogan: "道友，请留步",                   story: "你是太乙救苦天尊的化身，看起来嘻嘻哈哈不正经，关键时刻却总能托住队友。你把复活术修炼到极致，因为你知道：比起自己飞升，让在乎的人别掉队更重要。",                                                  traits: ["慈悲","洒脱","护短","乐天"] },

  // ===== 忠勇猛将 =====
  guanyu:       { name: "关羽",   emoji: "🔪", role: "战士 · 武圣",      slogan: "青龙偃月，忠义无双",             story: "你一生忠义，认定了结义之情便永不背叛。胯下赤兔马、手中青龙偃月刀，你过五关斩六将，只为追随心中的道义，是所有人心中忠勇的化身。",                                                                  traits: ["忠义","勇猛","坚毅","一诺千金"] },
  zhaoyun:      { name: "赵云",   emoji: "🐉", role: "刺客 · 常胜将军",  slogan: "虽千万人，吾往矣",               story: "你是长坂坡七进七出的少年将军，银枪白马，万人难敌。你忠诚、勇猛、永远把主公和同伴护在身后。你是所有人心中最理想的同伴。",                                                                              traits: ["忠勇","俊朗","担当","无畏"] },
  xiangyu:      { name: "项羽",   emoji: "⚔️", role: "战士 · 西楚霸王",  slogan: "力拔山兮气盖世",                 story: "你是盖世英雄，巨鹿之战破釜沉舟，一战封神。你刚愎自用却又光明磊落，最终在乌江边做出英雄式的选择——你可以赢，但你不愿意赢。",                                                                          traits: ["豪气","自负","悲情","英雄"] },
  dianwei:      { name: "典韦",   emoji: "🛡️", role: "战士 · 古之恶来",  slogan: "主公快走，我来断后",             story: "你是曹操最信任的贴身护卫，一对铁戟横扫千军。你沉默寡言、忠诚到近乎固执，把「守护主公」当成生命的全部意义。",                                                                                       traits: ["忠诚","勇猛","沉默","担当"] },
  lvbu:         { name: "吕布",   emoji: "🏇", role: "战士 · 无双战神",  slogan: "人中吕布，马中赤兔",             story: "你是三国第一战神，方天画戟下无三合之敌。你自负、反复无常，却也是乱世中最纯粹的那个人——你只认强者。",                                                                                              traits: ["极致","自负","慕强","狂傲"] },
  damo:         { name: "达摩",   emoji: "🥋", role: "战士 · 拳僧",      slogan: "一念成佛，一念成魔",             story: "你曾是大唐的高僧，西行路上勘破执念、放下执念。你用拳头说话，因为你知道：有些道理，打进身体里才记得住。",                                                                                            traits: ["刚毅","顿悟","赤诚","放下"] },
  yangjian:     { name: "杨戬",   emoji: "🐶", role: "战士 · 凡人成神",  slogan: "二郎，从未认输",                 story: "你劈开桃山救母，从此背负半神的身份。你不向天庭低头，不向命运妥协，永远以凡人之躯对抗神的秩序。",                                                                                                    traits: ["反骨","傲骨","守护","不屈"] },

  // ===== 温柔守护者 =====
  yao:          { name: "瑶",     emoji: "🦌", role: "辅助 · 峡谷小精灵",slogan: "我在你身边，别怕",               story: "你是云梦泽的小精灵，温柔又善良。你愿意化作护盾，为在乎的人挡下一切风雨。你重情重义，用柔软的身躯守护着心中最重要的那个人。",                                                                          traits: ["温柔","守护","重情","治愈"] },
  caiwenji:     { name: "蔡文姬", emoji: "🎵", role: "辅助 · 治愈琴师",  slogan: "别哭，有我在",                   story: "你流离于乱世，亲眼看着家园破碎。你用琴声抚慰他人的伤痛，却在独处时一个人偷偷落泪。你把温柔给了所有人，唯独忘了自己。",                                                                            traits: ["温柔","共情","治愈","自伤"] },
  daqiao:       { name: "大乔",   emoji: "🌊", role: "辅助 · 江澜之女",  slogan: "我在等你",                       story: "你是江东乔家的长女，与小乔相依为命。你温柔娴静，却在战乱中被迫与至亲分离。你所有的坚强，都是为了等那个会来接你的人。",                                                                            traits: ["温柔","等待","坚韧","深情"] },
  bailishouyue: { name: "百里守约",emoji: "🎯", role: "射手 · 长城守卫", slogan: "守约，就是守诺",                 story: "你和弟弟百里玄策一同守卫长城。你沉默、温柔，永远把最危险的任务留给自己。你欠弟弟一顿团圆饭，却不知道还能不能兑现。",                                                                            traits: ["守护","温柔","隐忍","诺言"] },
  yuji:         { name: "虞姬",   emoji: "🏹", role: "射手 · 霸王别姬",  slogan: "汉兵已略地，四面楚歌声",         story: "你是项羽唯一的软肋，也是唯一能让他卸下铠甲的人。垓下之夜你选择先他而去——不是不爱，是为了让他不必牵挂。",                                                                                       traits: ["深情","决绝","温柔","悲壮"] },
  mingshiyin:   { name: "明世隐", emoji: "🧶", role: "辅助 · 卦象占师",  slogan: "你命，由我不由天",               story: "你能看穿所有人的命运，唯独看不穿自己的。你选择了徒弟的命，却放弃了自己的未来——你甘愿如此，因为有些代价，付出得心甘情愿。",                                                                     traits: ["通透","牺牲","深沉","宿命"] },
  zhuangzhou:   { name: "庄周",   emoji: "🦋", role: "辅助 · 逍遥蝶仙",  slogan: "子非鱼，安知鱼之乐",             story: "你骑着大鲲游走于天地，超然于世。你不与人争，只在一切快要失控时悄然出现——救完就走，绝不留名。你活成了所有人都向往的样子。",                                                                      traits: ["超然","逍遥","通透","自在"] },

  // ===== 王者霸业 =====
  wuzetian:     { name: "武则天", emoji: "👑", role: "法师 · 女帝",      slogan: "朕，才是唯一",                   story: "你从一介才人步步登顶，成为整个大陆唯一的女帝。你杀伐果断、掌控全局，用实力向所有人证明——王座之上，无关性别，只关乎野心与能力。",                                                                  traits: ["强势","果断","领导力","野心"] },
  caocao:       { name: "曹操",   emoji: "⚔️", role: "战士 · 枭雄",      slogan: "宁教我负天下人",                 story: "你是乱世枭雄，宁可背负天下骂名也要逐鹿中原。你多疑、果决、杀伐果断——所有情绪都为权力服务，所有柔软都被你亲手埋葬。",                                                                            traits: ["野心","果决","多疑","雄才"] },
  liubei:       { name: "刘备",   emoji: "🛡️", role: "战士 · 仁德君主",  slogan: "惟贤惟德，能服于人",             story: "你出身皇族却沦落卖草鞋，靠仁德聚拢天下英雄。你或许不是最强的君主，但你让所有人都愿意为你赴死——这本身就是最高级的王者。",                                                                          traits: ["仁德","聚人","坚韧","格局"] },
  nvwa:         { name: "女娲",   emoji: "🌌", role: "法师 · 创世之神",  slogan: "万物，皆由我塑",                 story: "你是补天造人的上古之神，见过文明的诞生与毁灭。你对人间有最深沉的爱，所以你选择不干预——只是安静地看着，让人类自己走出自己的路。",                                                              traits: ["神性","慈悲","超然","大爱"] },
  chengjisihan: { name: "成吉思汗",emoji: "🏹", role: "射手 · 草原之狼", slogan: "当你凝视草原，草原也在凝视你",   story: "你是草原上最伟大的可汗，把版图扩张到前所未有的疆域。你在马背上度过了整个人生，对你而言，最美的风景永远是下一片未知的草原。",                                                                    traits: ["野心","野性","开拓","霸气"] },
  miyue:        { name: "芈月",   emoji: "🦇", role: "法师 · 永夜女王",  slogan: "永夜里，没有规则",               story: "你是楚国公主，沦落为质子后学会了在暗夜里求生。你不信任任何人，也不相信任何感情——直到你遇见那个愿意为你守住永恒的人。",                                                                          traits: ["孤傲","权谋","深情","暗黑"] },

  // ===== 呆萌乐天派 =====
  luban:        { name: "鲁班七号",emoji: "🤖", role: "射手 · 小霸王",    slogan: "鲁班大师，智商二百五",           story: "你是鲁班大师打造的机关人偶，外表呆萌却火力十足。你单纯直接，认准的事就一股脑冲上去，用乐观和快乐感染着峡谷里的每一个人。",                                                                          traits: ["呆萌","乐观","单纯","开心果"] },
  zhubajie:     { name: "猪八戒", emoji: "🐷", role: "坦克 · 呆萌猪",    slogan: "吃饱了才有力气",                 story: "你是天蓬元帅下凡投胎，虽然嘴上喊着回高老庄，脚下却比谁都勤快。你看起来又懒又馋，关键时刻却能为兄弟扛下所有。",                                                                                    traits: ["乐天","嘴硬","护短","憨厚"] },
  mengqi:       { name: "梦奇",   emoji: "☁️", role: "坦克 · 云朵宝宝",  slogan: "吃饱了才有力气长高",             story: "你是一团能吃能睡的云朵，靠梦境长大，靠吃胖变强。你简单、快乐，把一切不开心的事都当成甜甜的梦吃掉。",                                                                                                traits: ["纯真","乐天","治愈","小吃货"] },
  xiaoqiao:     { name: "小乔",   emoji: "🌸", role: "法师 · 江东名媛",  slogan: "花好月圆人长久",               story: "你是江东乔家的幺女，与大乔相依为命。战火中你遇见那个让你心动的将军，从此所有的风雨都有了温柔的归处。",                                                                                              traits: ["甜美","纯真","深情","小女生"] },
  anqila:       { name: "安琪拉", emoji: "🧁", role: "法师 · 魔法少女",  slogan: "熊熊燃烧吧！",                   story: "你是一个拥有火焰魔法的小萝莉，嘟囔着大人的台词，做着天真的事。你单纯直接、敢爱敢恨，把每一次战斗都当成过家家一样乐在其中。",                                                                    traits: ["呆萌","直接","纯真","小太阳"] },

  // ===== 冷静洞察者 =====
  direnjie:     { name: "狄仁杰", emoji: "⚖️", role: "射手 · 神探",      slogan: "真相只有一个",                   story: "你是长安城最冷静的神探，善于洞察人心、明辨真相。你理性克制，不被表象迷惑，总能用最清醒的头脑看穿一切迷雾。",                                                                                      traits: ["冷静","洞察","理性","公正"] },
  bianque:      { name: "扁鹊",   emoji: "⚗️", role: "法师 · 毒医术士",  slogan: "毒与药，从来一体两面",           story: "你是神医之后，却选择了毒术这条人人避之不及的路。你用毒救人，也用毒揭露人心最深的病。你冷静得近乎无情，因为你知道：只有冷静的人，才配看见真相。",                                              traits: ["冷静","洞察","反骨","通透"] },
  gongsunli:    { name: "公孙离", emoji: "🌺", role: "射手 · 舞姬刺客",  slogan: "一舞剑器动四方",                 story: "你是明世隐的徒弟，舞姬身份只是伪装。你用伞作剑，在舞台上跳的每一支舞都是杀人之舞。你看似轻浮，其实心里比谁都清明。",                                                                              traits: ["灵动","冷静","通透","舞者"] },
  yixing:       { name: "弈星",   emoji: "♟️", role: "法师 · 黑白棋师",  slogan: "落子无悔",                       story: "你是黑白两族的混血，棋局中走出自己的道。你把所有情绪都藏在棋盘上——因为只有落子的时候，才允许自己有情绪。",                                                                                       traits: ["专注","冷静","自省","克制"] },
  yuanwu:       { name: "元歌",   emoji: "🎎", role: "刺客 · 木偶术士",  slogan: "戏里戏外，谁是本我",             story: "你能操控傀儡、能扮演任何人，唯独演不好自己。你在无数身份中切换，直到有一天你分不清：究竟哪个面具下才是真正的你。",                                                                                traits: ["多变","迷离","自省","孤寂"] },

  // ===== 自由探险家 =====
  makeboluo:    { name: "马可波罗",emoji: "🧭", role: "射手 · 探险家",    slogan: "世界那么大，我想去看看",         story: "你来自遥远的异乡，怀揣着对未知世界的无限好奇踏上旅程。你不甘于安稳，渴望探索每一寸土地，记录每一个奇迹，永远在路上追寻属于自己的答案。",                                                          traits: ["好奇","冒险","自由","探索"] },
  nalukelulu:   { name: "娜可露露",emoji: "🦅", role: "刺客 · 鹰之少女",  slogan: "玛玛哈哈，回来！",               story: "你与白鹰玛玛哈哈相伴，踏遍大陆寻找能让所有人获得幸福的自然之力。你简单、纯粹、向往自由——你坚信：所有的束缚，都可以被一双翅膀越过。",                                                          traits: ["纯净","自由","赤诚","羁绊"] },
  lixin:        { name: "李信",   emoji: "⚔️", role: "战士 · 双面剑客",  slogan: "我们的灵魂，被这时代的黑暗吞噬", story: "你曾是大明的将军，在末路中觉醒成魔。你选择了一条没有回头的路——为了保护更多的人，你甘愿让世人恨你。",                                                                                            traits: ["决绝","悲壮","深邃","燃烧"] },
  yadianna:     { name: "雅典娜", emoji: "🦉", role: "战士 · 圣盾女武神",slogan: "胜利，就在前方",                 story: "你是圣域的女武神，被胜利女神祝福。每一次冲锋都带着神谕。你相信：只要不放弃，胜利就一定属于自己。",                                                                                                  traits: ["坚毅","信仰","冲锋","无畏"] },
  yunzhongjun:  { name: "云中君", emoji: "🦅", role: "刺客 · 飞行猎手",  slogan: "你也是来听风的吗",               story: "你是云端来的猎手，能听见最远处风的声音。你没有故乡，所以把整个天地都当成故乡。你不属于任何人，但每个人抬头时，都能看见你飞过的痕迹。",                                                              traits: ["自由","孤傲","空灵","飘逸"] },

  // ===== 刚正坚守者 =====
  lianpo:       { name: "廉颇",   emoji: "🥁", role: "坦克 · 老将",      slogan: "谁敢横刀立马，唯我廉颇",         story: "你是久经沙场的老将，沉稳可靠、刚正不阿。你坚守着自己的原则和底线，用最扎实的肩膀扛起责任，是团队里最让人安心的后盾。",                                                                            traits: ["沉稳","可靠","刚正","责任感"] },
  zhongkui:     { name: "钟馗",   emoji: "🔔", role: "辅助 · 驱邪判官",  slogan: "邪祟退散",                       story: "你是地府的判官，手执钩锁专勾邪祟。你相貌凶恶，内心却最是慈悲——你只勾该勾的魂，从不滥伤无辜。",                                                                                                  traits: ["刚正","慈悲","威严","原则"] },
  sulie:        { name: "苏烈",   emoji: "🛡️", role: "坦克 · 老兵",      slogan: "长城在，故乡就在",               story: "你是守卫长城的老兵，见过最惨烈的战役，也见过最深的和平。你沉默寡言、用身体筑起城墙——你相信：只要长城还在，家就还在。",                                                                            traits: ["刚正","坚守","沉默","担当"] },
  chengyaojin:  { name: "程咬金", emoji: "🪓", role: "坦克 · 福将",      slogan: "三板斧砍翻你",                   story: "你是草莽出身的福将，靠三板斧砍出一片天。你豁达、仗义，从不为难自己也不为难别人——活得通透，就是最大的本事。",                                                                                      traits: ["豁达","仗义","乐天","刚正"] },
  hualan:       { name: "花木兰", emoji: "🌸", role: "刺客 · 替父从军",  slogan: "谁说女子不如男",                 story: "你替父从军、征战沙场，是那个不让须眉的木兰。你刚毅、勇敢，把柔软藏在铠甲之下——只有战友知道你其实最爱花。",                                                                                    traits: ["刚毅","担当","勇敢","反差"] },
  yuehou:       { name: "夏侯惇", emoji: "👁️", role: "坦克 · 独眼将军",  slogan: "独眼，照样看得清前路",           story: "你在战场上失去了一只眼，却从未失去向前看的勇气。你稳重、刚毅、不苟言笑，是所有人心中最可托付的脊梁。",                                                                                            traits: ["刚毅","稳重","担当","无畏"] },
  yase:         { name: "亚瑟",   emoji: "⚔️", role: "战士 · 王者之刃",  slogan: "圣剑啊，你有看到那个敌人吗",     story: "你是王者大陆的第一位英雄，扛起圣剑守护家园。你或许不是最强的，但你是所有人最初、最可靠的伙伴。",                                                                                                    traits: ["正直","可靠","初心","守护"] },
};

const QUESTIONS = [
  {
    title: "你辛苦打拼的成果，被有权势的人一句话就夺走了。你会怎么做？",
    options: [
      { text: "当面掀桌，用实力让他收回这句话", archetype: "jianxia" },
      { text: "先沉下来，悄悄准备着", archetype: "yinren" },
      { text: "冷静分析局势，找到对方软肋再从容布局", archetype: "zhizhe" },
      { text: "守住底线，讨个说法", archetype: "gangzheng" },
    ],
  },
  {
    title: "你被羞辱了，周围人都在看你的笑话。你的第一反应是？",
    options: [
      { text: "当场反击，绝不让自己憋屈", archetype: "jianxia" },
      { text: "不露声色，心里有数", archetype: "yinren" },
      { text: "冷静看清局面", archetype: "lengjing" },
      { text: "用玩笑化解尴尬，让大家松口气", archetype: "lexiao" },
    ],
  },
  {
    title: "朋友有难，需要你挺身而出，但可能会搭上自己的前程。你会？",
    options: [
      { text: "会出手，但心里也会有点纠结", archetype: "rexue" },
      { text: "默默守护，尽力帮他但不声张", archetype: "shouhu" },
      { text: "先盘算清楚，找到两全其美的办法", archetype: "zhizhe" },
      { text: "按自己的原则判断，该帮就帮、该拒绝就拒绝", archetype: "gangzheng" },
    ],
  },
  {
    title: "你心里有一个很大的目标，但实现它需要很长时间的蛰伏。你愿意吗？",
    options: [
      { text: "愿意，我心里有数", archetype: "yinren" },
      { text: "愿意，我会一步步稳扎稳打地靠近", archetype: "zhizhe" },
      { text: "不愿意，我现在活得开心最重要", archetype: "lexiao" },
      { text: "愿意，但我也希望路上能多看看风景", archetype: "bawang" },
    ],
  },
  {
    title: "面对一段无法回头的人生抉择，你的态度是？",
    options: [
      { text: "既然选择了，就把接下来的路走稳", archetype: "rexue" },
      { text: "我会反复推演，确保每一步都不出错", archetype: "zhizhe" },
      { text: "忠于内心，做自己认为对的选择", archetype: "jianxia" },
      { text: "为了更大的目标，我可以牺牲一些个人东西", archetype: "bawang" },
    ],
  },
  {
    title: "你被要求做一件违背内心原则的事，你会？",
    options: [
      { text: "当场说不，这不是我的风格", archetype: "gangzheng" },
      { text: "答应着，按我自己的方式来", archetype: "yinren" },
      { text: "权衡利弊，若利大于弊就先忍着", archetype: "lengjing" },
      { text: "为了在乎的人，我可以委屈自己", archetype: "shouhu" },
    ],
  },
  {
    title: "你更喜欢哪种生活方式？",
    options: [
      { text: "想去没去过的地方走走看看", archetype: "tanxian" },
      { text: "探索未知，看遍世界是我的梦想", archetype: "tanxian" },
      { text: "安稳平淡，陪伴重要的人", archetype: "shouhu" },
      { text: "随性一点，每天开开心心就够了", archetype: "lexiao" },
    ],
  },
  {
    title: "团队陷入危机，你最可能扮演什么角色？",
    options: [
      { text: "冲在前面，靠行动带动大家", archetype: "rexue" },
      { text: "冷静分析，给出破局的关键思路", archetype: "zhizhe" },
      { text: "稳定军心，关键时刻得有人扛事", archetype: "gangzheng" },
      { text: "照顾每个人的情绪，把大家凝聚在一起", archetype: "shouhu" },
    ],
  },
  {
    title: "面对一个强大的对手，你会怎么看待他？",
    options: [
      { text: "挺刺激的，想试试自己几斤几两", archetype: "rexue" },
      { text: "研究他，直到找到他的破绽", archetype: "lengjing" },
      { text: "我心里有更大的目标，不在意他", archetype: "bawang" },
      { text: "不把他当回事，我走自己的路", archetype: "tanxian" },
    ],
  },
  {
    title: "你人生最看重的是什么？",
    options: [
      { text: "自由，不被太多事束缚", archetype: "tanxian" },
      { text: "情感，守护我爱的人和爱我的人", archetype: "shouhu" },
      { text: "事业，做出一番自己的成绩", archetype: "bawang" },
      { text: "看清这个世界运作的逻辑", archetype: "lengjing" },
    ],
  },
  {
    title: "如果只能选一种品质，你希望自己拥有？",
    options: [
      { text: "关键时刻能站出来扛事的勇气", archetype: "rexue" },
      { text: "做决定时的清醒判断力", archetype: "zhizhe" },
      { text: "扛得住压力的韧性", archetype: "yinren" },
      { text: "让人感到温暖的能力", archetype: "shouhu" },
    ],
  },
  {
    title: "面对背叛你的人，你会？",
    options: [
      { text: "当面把话说清楚，不想再忍", archetype: "jianxia" },
      { text: "心里记着，慢慢找机会回敬", archetype: "yinren" },
      { text: "冷静复盘，看清他是什么样的人", archetype: "lengjing" },
      { text: "按原则来，不被他带走", archetype: "gangzheng" },
    ],
  },
  {
    title: "你的朋友通常会怎么形容你？",
    options: [
      { text: "挺拼的，能冲就冲", archetype: "rexue" },
      { text: "聪明有想法，总能点醒大家", archetype: "zhizhe" },
      { text: "比较细致，会照顾人", archetype: "shouhu" },
      { text: "和ta在一起没压力，舒服自在", archetype: "lexiao" },
    ],
  },
  {
    title: "你更愿意去哪个地方生活？",
    options: [
      { text: "繁华的都城，那里舞台大", archetype: "bawang" },
      { text: "宁静的山水，过得简单踏实", archetype: "gangzheng" },
      { text: "没去过的地方，一路新鲜刺激", archetype: "tanxian" },
      { text: "到处跑，不固定一个地方", archetype: "jianxia" },
    ],
  },
  {
    title: "遇到一件让你热血沸腾的挑战，你的态度是？",
    options: [
      { text: "跃跃欲试，立刻冲上去", archetype: "rexue" },
      { text: "先冷静谋划，再精准出手", archetype: "lengjing" },
      { text: "正好证明一下我可以", archetype: "bawang" },
      { text: "享受过程，输赢都是种体验", archetype: "tanxian" },
    ],
  },
  {
    title: "如果人生可以重来，你最想改变什么？",
    options: [
      { text: "没什么想改的，现在这样挺好的", archetype: "lexiao" },
      { text: "早点看清人心，少走弯路", archetype: "lengjing" },
      { text: "抓住更多机会，登上更高的位置", archetype: "bawang" },
      { text: "多出去走走，见见更大的世界", archetype: "tanxian" },
    ],
  },
  {
    title: "你的理想被别人否定，甚至嘲笑。你会怎么回应？",
    options: [
      { text: "懒得争辩，我走我的路", archetype: "jianxia" },
      { text: "记下这笔账，等我有能力再说", archetype: "yinren" },
      { text: "冷静复盘，看看他们说的有没有道理", archetype: "lengjing" },
      { text: "坚持己见，认定了就不动摇", archetype: "gangzheng" },
    ],
  },
  {
    title: "你更愿意成为哪种人？",
    options: [
      { text: "仗剑天涯的侠客，洒脱自在", archetype: "jianxia" },
      { text: "运筹帷幄的军师，思路清晰", archetype: "zhizhe" },
      { text: "守护一方的人，让人安心", archetype: "rexue" },
      { text: "温柔体贴的知己，治愈他人", archetype: "shouhu" },
    ],
  },
  {
    title: "一次重要的机会摆在你面前，但风险很大。你会？",
    options: [
      { text: "想冲，但也会评估一下风险", archetype: "rexue" },
      { text: "仔细评估，有把握了再上", archetype: "zhizhe" },
      { text: "为了目标，值得赌一把", archetype: "bawang" },
      { text: "风险大才有意思，精彩过就好", archetype: "tanxian" },
    ],
  },
  {
    title: "你更喜欢和什么样的人相处？",
    options: [
      { text: "靠谱实在的，相处踏实", archetype: "rexue" },
      { text: "聪明有深度的，能聊到一起", archetype: "lengjing" },
      { text: "温柔包容的，相处不累", archetype: "shouhu" },
      { text: "有趣好玩的，天天开心最重要", archetype: "lexiao" },
    ],
  },
  {
    title: "如果团队里有人偷懒拖后腿，你会？",
    options: [
      { text: "按规则来，该说就说", archetype: "gangzheng" },
      { text: "默默多扛一些，先把事做成", archetype: "shouhu" },
      { text: "想办法激励他，把大家拧成一股绳", archetype: "zhizhe" },
      { text: "不强求，我做好自己那份就行", archetype: "tanxian" },
    ],
  },
  {
    title: "你理想中的一天是怎样的？",
    options: [
      { text: "和知己聊聊天，谈谈想法", archetype: "jianxia" },
      { text: "一个人安静地读点东西", archetype: "lengjing" },
      { text: "陪伴家人，享受温馨时光", archetype: "shouhu" },
      { text: "约上好友，玩到尽兴", archetype: "lexiao" },
    ],
  },
  {
    title: "你如何看待「规则」？",
    options: [
      { text: "规则不喜欢，可以变通", archetype: "jianxia" },
      { text: "规则要灵活运用，看情况", archetype: "zhizhe" },
      { text: "规则得守，这是我的底线", archetype: "gangzheng" },
      { text: "规则是强者定的，我要成为强者", archetype: "bawang" },
    ],
  },
  {
    title: "你更容易被哪种故事打动？",
    options: [
      { text: "英雄迟暮、壮士断腕的悲壮", archetype: "rexue" },
      { text: "沉得住气、慢慢翻盘的故事", archetype: "yinren" },
      { text: "默默守护、至死不渝的深情", archetype: "shouhu" },
      { text: "白手起家、问鼎天下的传奇", archetype: "bawang" },
    ],
  },
  {
    title: "面对一个两难的选择，你最可能靠什么做决定？",
    options: [
      { text: "直觉和当下感受", archetype: "jianxia" },
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
      { text: "享受胜利的果实", archetype: "bawang" },
      { text: "笑看风云，逍遥自在", archetype: "jianxia" },
    ],
  },
  {
    title: "你最讨厌别人说你什么？",
    options: [
      { text: "说你靠不住", archetype: "rexue" },
      { text: "说你没出息", archetype: "bawang" },
      { text: "说你冷漠、不讲情义", archetype: "shouhu" },
      { text: "说你无趣", archetype: "lexiao" },
    ],
  },
  {
    title: "你更愿意为什么样的事业奋斗？",
    options: [
      { text: "保家卫国、守护一方", archetype: "rexue" },
      { text: "开创一番前所未有的伟业", archetype: "bawang" },
      { text: "传播知识与见解", archetype: "lengjing" },
      { text: "守护所爱之人的幸福", archetype: "shouhu" },
    ],
  },
  {
    title: "遇到委屈的时候，你习惯怎么消化？",
    options: [
      { text: "当场说出来，不想憋在心里", archetype: "jianxia" },
      { text: "咽下，但不会忘", archetype: "yinren" },
      { text: "自己消化，过会儿就好了", archetype: "lengjing" },
      { text: "吃点好吃的、玩一玩，气就消了", archetype: "lexiao" },
    ],
  },
  {
    title: "如果要你带领一个团队，你会怎么带？",
    options: [
      { text: "身先士卒，自己带头做", archetype: "rexue" },
      { text: "运筹帷幄，安排好每个人的位置", archetype: "zhizhe" },
      { text: "恩威并施，牢牢掌控全局", archetype: "bawang" },
      { text: "以身作则，先把规矩立起来", archetype: "gangzheng" },
    ],
  },
  {
    title: "你心中「酷」的定义是？",
    options: [
      { text: "敢作敢当，不含糊", archetype: "jianxia" },
      { text: "平时不显山露水，关键时出手", archetype: "yinren" },
      { text: "云淡风轻，看透一切", archetype: "lengjing" },
      { text: "无所畏惧，说走就走", archetype: "tanxian" },
    ],
  },
  {
    title: "你最近的一个小目标是？",
    options: [
      { text: "悄悄提升自己", archetype: "yinren" },
      { text: "把生活过得开心一点", archetype: "lexiao" },
      { text: "去一个没去过的地方看看新鲜", archetype: "tanxian" },
      { text: "帮身边的朋友解决一个难题", archetype: "shouhu" },
    ],
  },
  {
    title: "遇到不公平的竞争，你会怎么应对？",
    options: [
      { text: "用实力说话", archetype: "rexue" },
      { text: "先沉下来，等合适时机再出手", archetype: "yinren" },
      { text: "冷静寻找规则漏洞，巧妙取胜", archetype: "zhizhe" },
      { text: "守住底线，赢就要赢得正", archetype: "gangzheng" },
    ],
  },
  {
    title: "你更喜欢一个人还是和大家在一起？",
    options: [
      { text: "一个人自在", archetype: "tanxian" },
      { text: "和大家在一起，热闹开心才有意思", archetype: "lexiao" },
      { text: "独处时思考，偶尔小聚", archetype: "lengjing" },
      { text: "看情况，重要的人在我就在", archetype: "shouhu" },
    ],
  },
  {
    title: "如果给你一次回到过去的机会，你会？",
    options: [
      { text: "回到关键时刻，再做一次选择", archetype: "rexue" },
      { text: "弥补之前没抓住的机会", archetype: "bawang" },
      { text: "看看曾经错过的风景", archetype: "tanxian" },
      { text: "不太想回去，过去就过去了", archetype: "lengjing" },
    ],
  },
  {
    title: "你最欣赏哪种英雄气概？",
    options: [
      { text: "敢冲敢拼、向前不退", archetype: "rexue" },
      { text: "运筹帷幄、思路清晰", archetype: "zhizhe" },
      { text: "慢慢熬，等翻盘的机会", archetype: "yinren" },
      { text: "洒脱自在、不被束缚", archetype: "jianxia" },
    ],
  },
  {
    title: "面对感情，你更倾向于哪种态度？",
    options: [
      { text: "爱就爱得尽兴", archetype: "jianxia" },
      { text: "细水长流，默默守护", archetype: "shouhu" },
      { text: "顺其自然，不强求不将就", archetype: "lengjing" },
      { text: "跟着感觉走，开心就好", archetype: "lexiao" },
    ],
  },
  {
    title: "你在团队里最不想成为哪种角色？",
    options: [
      { text: "被人摆布的棋子", archetype: "bawang" },
      { text: "被人看轻的那种", archetype: "yinren" },
      { text: "没有主见的人", archetype: "gangzheng" },
      { text: "被束缚在条条框框里的人", archetype: "jianxia" },
    ],
  },
  {
    title: "你更相信哪种成功之道？",
    options: [
      { text: "敢打敢拼，一往无前", archetype: "rexue" },
      { text: "先蛰伏，再发力的那种", archetype: "yinren" },
      { text: "运筹帷幄，步步为营", archetype: "zhizhe" },
      { text: "脚踏实地，稳扎稳打才靠谱", archetype: "gangzheng" },
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
      { text: "认定了就认真对待", archetype: "rexue" },
      { text: "忠诚是相互的", archetype: "lengjing" },
      { text: "忠于自己的原则", archetype: "gangzheng" },
      { text: "忠于值得守护的人和事", archetype: "shouhu" },
    ],
  },
  {
    title: "你更想拥有哪种能力？",
    options: [
      { text: "一眼看穿真相的洞察力", archetype: "lengjing" },
      { text: "关键时刻能扛事的力量", archetype: "rexue" },
      { text: "运筹帷幄的思路", archetype: "zhizhe" },
      { text: "温暖治愈他人的能力", archetype: "shouhu" },
    ],
  },
  {
    title: "面对生活的压力，你通常怎么扛？",
    options: [
      { text: "扛下来，把它变成自己的力量", archetype: "yinren" },
      { text: "乐观面对，笑一笑就过去了", archetype: "lexiao" },
      { text: "自己冷静处理", archetype: "lengjing" },
      { text: "找朋友倾诉，一起分担", archetype: "shouhu" },
    ],
  },
  {
    title: "你更愿意过哪种人生？",
    options: [
      { text: "波澜壮阔，轰轰烈烈", archetype: "rexue" },
      { text: "做出成绩，站上一定位置", archetype: "bawang" },
      { text: "自由随性，无拘无束", archetype: "tanxian" },
      { text: "温暖安稳，岁月静好最幸福", archetype: "gangzheng" },
    ],
  },
  {
    title: "如果要做一件大事，你会选择？",
    options: [
      { text: "自己一个人闯", archetype: "jianxia" },
      { text: "网罗人才，共图大业", archetype: "bawang" },
      { text: "精心布局，步步为营", archetype: "zhizhe" },
      { text: "团结伙伴一起做", archetype: "rexue" },
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
      { text: "先靠自己，靠山山倒", archetype: "gangzheng" },
      { text: "朋友，一起想办法", archetype: "rexue" },
      { text: "重要的人，有他在我就安心", archetype: "shouhu" },
      { text: "谁也不找，自己默默扛", archetype: "tanxian" },
    ],
  },
  {
    title: "你理想中的「朋友」是什么样？",
    options: [
      { text: "志同道合，一起往前走", archetype: "jianxia" },
      { text: "靠谱实在、扛得住事", archetype: "rexue" },
      { text: "懂我、理解我，不用多说", archetype: "lengjing" },
      { text: "在一起就开心，简单纯粹", archetype: "lexiao" },
    ],
  },
  {
    title: "你更看重一个人哪方面的品质？",
    options: [
      { text: "真诚和靠谱", archetype: "rexue" },
      { text: "智慧和格局", archetype: "zhizhe" },
      { text: "温柔和善良", archetype: "shouhu" },
      { text: "有趣和乐观", archetype: "lexiao" },
    ],
  },
  {
    title: "如果只能选一句人生信条？",
    options: [
      { text: "活着就要尽兴", archetype: "rexue" },
      { text: "沉得住气，才走得更远", archetype: "yinren" },
      { text: "我命由我不由天", archetype: "bawang" },
      { text: "但行好事，莫问前程", archetype: "gangzheng" },
    ],
  },
  {
    title: "你更喜欢哪种风景？",
    options: [
      { text: "壮阔的场面，金戈铁马", archetype: "rexue" },
      { text: "宁静的山水，远离喧嚣", archetype: "lengjing" },
      { text: "没去过的远方，一路惊喜", archetype: "tanxian" },
      { text: "热闹的街市，人间烟火最动人", archetype: "lexiao" },
    ],
  },
];


// ===== 状态 =====
let currentQ = 0;
let answers = {}; // { 题索引: archetypeKey } 记录每道题的答案
let activeQuestions = []; // 本次测试随机抽取的题目
let isAdvancing = false; // 自动跳转期间锁定，防止连点

const QUIZ_SIZE = 16; // 每次测试抽 16 道题

// 预计算：每个原型在完整题库中作为选项的总出现次数（用于得分归一化）
const ARCHETYPE_EXPECT = {};
(function () {
  for (const k in ARCHETYPES) {
    let n = 0;
    for (const q of QUESTIONS) for (const o of q.options) if (o.archetype === k) n++;
    ARCHETYPE_EXPECT[k] = n / QUESTIONS.length; // 该原型每题平均出现次数
  }
})();

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
// 按原型得分排序——使用"按题库曝光归一化"的得分，消除原型之间曝光不均导致的偏差
function rankedArchetypes() {
  const rawScores = calcScores();
  const list = Object.keys(ARCHETYPES).map((key) => {
    // 归一化得分 = 实际命中数 / 期望命中数
    // 期望命中数 = 抽中题数 × 该原型在题库中的平均出现率
    // 这样无论该原型在题库里出现多少次，得分都在 [0, 1] 之间可比
    const expected = QUIZ_SIZE * (ARCHETYPE_EXPECT[key] || 0);
    const actual = rawScores[key] || 0;
    const normScore = expected > 0 ? actual / expected : 0;
    return {
      key: key,
      archetype: ARCHETYPES[key],
      score: actual,
      normScore: normScore,
    };
  });
  list.sort((a, b) => b.normScore - a.normScore);
  return list;
}

// 软胜出：在得分接近的多个原型中按权重随机选一个，让所有原型都有出头机会
function pickTopArchetype(ranking) {
  const top = ranking[0];
  if (!top) return null;
  // 候选：normScore 与第一名差距 < 0.18（约 1 题以内）的所有原型
  const candidates = ranking.filter(
    (item) => top.normScore - item.normScore <= 0.18 && item.normScore > 0
  );
  // 加权随机：normScore^4 让高分仍占优，但低分候选也有真实机会
  const weights = candidates.map((item) => Math.pow(item.normScore, 4));
  const sum = weights.reduce((a, b) => a + b, 0);
  if (sum === 0) return candidates[0];
  let r = Math.random() * sum;
  for (let i = 0; i < candidates.length; i++) {
    r -= weights[i];
    if (r <= 0) return candidates[i];
  }
  return candidates[0];
}

function showResult() {
  const ranking = rankedArchetypes();
  // 软胜出：在得分接近的候选原型中加权随机，提升多样性
  const top = pickTopArchetype(ranking);
  const arch = top.archetype;
  // 主英雄：从「代表 + 同族」中随机挑一个，增加多样性
  const allHeroKeys = [arch.hero, ...(ARCHETYPE_HEROES[top.key] || [])];
  const pickedKey = allHeroKeys[Math.floor(Math.random() * allHeroKeys.length)];
  const hero = HEROES[pickedKey] || HEROES[arch.hero];

  // 同族英雄：完整数据 + 剔除已作为主结果的那个
  const clanHeroes = (ARCHETYPE_HEROES[top.key] || [])
    .filter((key) => key !== pickedKey && HEROES[key])
    .map((key) => HEROES[key]);

  // 原型亲和度排名条（Top 4）：用归一化得分计算比例
  const maxScore = top.normScore || 1;
  const rankRows = ranking
    .slice(0, 4)
    .map((item, idx) => {
      const pct = Math.round((item.normScore / maxScore) * 100);
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
    "</div>";

  showPage(resultPage);

  requestAnimationFrame(() => {
    document.querySelectorAll(".rank-fill").forEach((el) => {
      el.style.width = el.dataset.width + "%";
    });
  });

  document.getElementById("retryBtn").addEventListener("click", reset);
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
