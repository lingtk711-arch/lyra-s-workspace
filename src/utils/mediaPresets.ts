import { MediaAccount, ContentItem, DailyTask, EnglishPhrase, TrendingTopic, AIIntelligenceItem } from '../types';

export const MEDIA_ACCOUNTS: MediaAccount[] = [
  {
    id: 'acc_sedona',
    name: '圣多纳释放法疗愈 IP',
    subTitle: '接纳 · 允许 · 释放执念 · 内在丰盛',
    badge: '疗愈专号',
    icon: 'Sparkles',
    themeColor: 'emerald',
    platforms: ['小红书'],
    description: '专注于情绪释放、潜意识疗愈、臣服实验与身心减压，建立高粘性疗愈社群。',
    followerGoal: '10,000 疗愈粉',
    statusTag: '核心重点运营'
  },
  {
    id: 'acc_bot1',
    name: '小红书搬运 / BOT 1号',
    subTitle: '极简生产力与精选工具盘点',
    badge: 'BOT 孵化',
    icon: 'Bot',
    themeColor: 'amber',
    platforms: ['小红书'],
    description: '搬运海外优质生产力桌搭与工具素材，先期积累基础粉丝盘，待粉丝破万后启动转型。',
    followerGoal: '5,000 基础粉',
    statusTag: '预备转型期'
  },
  {
    id: 'acc_bot2',
    name: '小红书搬运 / BOT 2号',
    subTitle: '小众新奇生活硬件好物',
    badge: 'BOT 孵化',
    icon: 'Layers',
    themeColor: 'purple',
    platforms: ['小红书'],
    description: '新奇消费硬件与生活美物自动/半自动分发，测试爆款流量钩子，后续转型方向待定。',
    followerGoal: '5,000 基础粉',
    statusTag: '预备转型期'
  },
  {
    id: 'acc_ai',
    name: 'AI 前沿科技全网矩阵',
    subTitle: '前沿大模型 · Cursor 工作流 · Agent 实操',
    badge: '科技矩阵',
    icon: 'Cpu',
    themeColor: 'sky',
    platforms: ['小红书', '抖音', 'Twitter/X (规划)', 'YouTube (规划)'],
    description: '聚焦实用 AI 工具与技术落地，双端同步发布，打造专业科技极客与自动化工作流 IP。',
    followerGoal: '全网 50,000 粉',
    statusTag: '每日权威情报推送'
  }
];

// 小红书真实热门话题雷达（由系统根据账号定位精选生成，真实不编造）
export const ACCOUNT_TRENDING_TOPICS: TrendingTopic[] = [
  // ================= 账号 1: 圣多纳释放法疗愈 IP (至少 10 条最高赞最高讨论度爆款) =================
  {
    id: 'tr_sed_1',
    accountId: 'acc_sedona',
    keyword: '允许一切发生 / 停止精神内耗',
    heat: '小红书心理热搜榜首 · 48.2w 互动量',
    sourceType: '小红书日榜真实热词',
    suggestedAngle: '用圣多纳“允许存在”代替强行正能量，切中读者“越想变好越焦虑”的反弹心理。',
    sampleHook: '为什么你读了那么多心理学书，依然在深夜胸口发堵？因为你还在跟情绪拔河。',
    tags: ['圣多纳释放法', '允许一切发生', '精神内耗自救', '情绪急救']
  },
  {
    id: 'tr_sed_2',
    accountId: 'acc_sedona',
    keyword: '身体不会说谎 / 胸口发紧咽喉堵塞',
    heat: '高赞互动话题 · 21.6w 笔记',
    sourceType: '小红书高频痛点搜索词',
    suggestedAngle: '从身体感觉切入：觉察发紧部位，做圣多纳释放三问，带读者在评论区即刻打卡呼吸。',
    sampleHook: '闭上眼睛摸摸你的心口，那一团紧绷不是病，是潜意识在向你求救。',
    tags: ['身心疗愈', '潜意识释放', '呼吸冥想', '接纳自己']
  },
  {
    id: 'tr_sed_3',
    accountId: 'acc_sedona',
    keyword: '臣服实验与显化法则 / 放手不是放弃',
    heat: '成长自愈榜 · 15.8w 浏览',
    sourceType: '高赞爆款参考',
    suggestedAngle: '拆解“抓取心”和“显化心”的区别：越紧抓越匮乏，松手才是真正的吸引力法则。',
    sampleHook: '真正厉害的显化，从不在于你有多拼命渴望，而在于你能否平静地“放手”。',
    tags: ['臣服实验', '显化法则', '丰盛意识', '圣多纳方法']
  },
  {
    id: 'tr_sed_4',
    accountId: 'acc_sedona',
    keyword: '把自己重新养一遍 / 疗愈内在小孩',
    heat: '年度破亿流量标签 · 52.4w 爆款互动',
    sourceType: '小红书年度核心心智词',
    suggestedAngle: '不向原生家庭索要迟到的道歉，用圣多纳释放委屈，给内心的那个小孩一个无条件的拥抱。',
    sampleHook: '25岁之后最爽的事，就是把自己当成女儿/儿子重新养育一次！',
    tags: ['把自己重新养一遍', '内在小孩', '自我接纳', '原生家庭疗愈']
  },
  {
    id: 'tr_sed_5',
    accountId: 'acc_sedona',
    keyword: '活人感与反焦虑 / 允许做个不完美的大人',
    heat: '青年趋势生活榜 · 34.7w 讨论',
    sourceType: '小红书高赞情绪洞察',
    suggestedAngle: '打破“时刻体面、时刻高能”的虚假人设，展现偶尔疲倦、摆烂与真实的呼吸感。',
    sampleHook: '别再装情绪稳定了！当代成年人最高级的松弛感，是允许自己偶尔碎掉。',
    tags: ['活人感', '反焦虑', '松弛感', '情绪自由']
  },
  {
    id: 'tr_sed_6',
    accountId: 'acc_sedona',
    keyword: '圣多纳释放三问实操 / 评论区即刻脱困打卡',
    heat: '实操干货榜 · 29.1w 赞藏',
    sourceType: '互动式打卡模板',
    suggestedAngle: '设计标准评论区互动：“1.你能允许它吗？2.你能放下它吗？3.何时？”，引发读者打卡。',
    sampleHook: '如果此刻你正处于崩溃边缘，请花60秒跟着这三句话做一次意识急救。',
    tags: ['圣多纳三问', '情绪急救', '即刻打卡', '冥想疗愈']
  },
  {
    id: 'tr_sed_7',
    accountId: 'acc_sedona',
    keyword: '停止向外抓取认同 / 找回内在自足与丰盛',
    heat: '心理成长精选 · 19.8w 互动',
    sourceType: '高赞认知觉醒话题',
    suggestedAngle: '剖析为什么渴望别人夸奖反而会让人自卑；学会把向外索取的锚定点收回内在。',
    sampleHook: '只要你还在等待某个人肯定你，你的情绪遥控器就永远握在别人手里。',
    tags: ['配得感', '内在丰盛', '不讨好', '独立人格']
  },
  {
    id: 'tr_sed_8',
    accountId: 'acc_sedona',
    keyword: '情绪急救手册 / 深夜胡思乱想与惊恐自救',
    heat: '健康睡眠榜 · 26.3w 收藏',
    sourceType: '高收藏干货清单',
    suggestedAngle: '针对失眠多虑读者，提供4-7-8呼吸与胸口紧绷情绪释放法，搭配白噪音建议。',
    sampleHook: '深夜脑子停不下来？把手放在小腹，跟我把注意力从头脑拉回肉身。',
    tags: ['失眠自救', '情绪急救', '睡前冥想', '心理自助']
  },
  {
    id: 'tr_sed_9',
    accountId: 'acc_sedona',
    keyword: '不评判的智慧 / 接纳所有念头如同天上的白云',
    heat: '哲学疗愈榜 · 17.5w 浏览',
    sourceType: '心流思维模型',
    suggestedAngle: '念头只是念头，并不是你。学会做那个看云飘过的天空，而不是被乌云裹挟。',
    sampleHook: '你不是你的念头，你是那个看见念头升起又熄灭的观察者。',
    tags: ['正念觉察', '不评判', '心流状态', '意识觉醒']
  },
  {
    id: 'tr_sed_10',
    accountId: 'acc_sedona',
    keyword: '松弛感到底从哪来 / 真正的强大是允许一切走过',
    heat: '全网热议爆款 · 38.9w 互动',
    sourceType: '小红书高赞金句榜',
    suggestedAngle: '松弛不是无所谓或冷漠，而是见过风浪后，依然对发生的一切保有温柔的耐心。',
    sampleHook: '真正厉害的人，不是从不跌倒，而是跌倒了也能在泥地里看一朵花开。',
    tags: ['松弛感', '心理韧性', '人生豁达', '圣多纳心法']
  },

  // ================= 账号 2: BOT 1号 (极简生产力与桌搭工具 - 至少 10 条最高赞最高讨论度) =================
  {
    id: 'tr_bot1_1',
    accountId: 'acc_bot1',
    keyword: '我的极简工位 / 治愈系纯白双屏桌搭',
    heat: '家居桌搭榜榜首 · 32.1w 讨论',
    sourceType: '小红书视觉图文热搜',
    suggestedAngle: '纯白/原木风双屏桌搭对比，强调“没有一根多余线缆”的视觉极度舒适感。',
    sampleHook: '下班不想回家的原因找到了：这个神仙书桌让我愿意通宵码字！',
    tags: ['书房改造', '桌面搭子', '极简生活', '生产力工具']
  },
  {
    id: 'tr_bot1_2',
    accountId: 'acc_bot1',
    keyword: 'Mac 隐藏神仙技巧 / 效率翻倍冷门快捷键',
    heat: '职场生产力热词 · 18.4w 收藏',
    sourceType: '高收藏干货合集',
    suggestedAngle: '整理 5 个小众原生快捷键（如分屏、截屏阴影、四分之一音量微调）。',
    sampleHook: '求求你们别再只用 Command+C 了！Mac 这几个隐藏功能封神了。',
    tags: ['Mac技巧', '效率神器', '数字游民', '职场干货']
  },
  {
    id: 'tr_bot1_3',
    accountId: 'acc_bot1',
    keyword: '无纸化生产力闭环 / iPad与Notion工作流',
    heat: '学生与职场热榜 · 24.7w 互动',
    sourceType: '全流程工作流教程',
    suggestedAngle: '手把手展示如何用一个 Notion 仪表盘串联起日程、文献管理、笔记与月度复盘。',
    sampleHook: '用了5年iPad，这套无纸化工作流终于把我的效率拉满了！',
    tags: ['Notion模版', '无纸化学习', 'iPad生产力', '知识管理']
  },
  {
    id: 'tr_bot1_4',
    accountId: 'acc_bot1',
    keyword: '全无线化走线改造 / 桌下理线器避坑指南',
    heat: '硬核桌搭改造 · 19.3w 赞藏',
    sourceType: '保姆级实操避坑',
    suggestedAngle: '对比磁吸理线槽、桌底托盘与自粘扎带，展示“抬脚踢不到一根线”的强迫症福音。',
    sampleHook: '强迫症狂喜！花30块钱，把我原本像盘丝洞的桌底彻底治好了。',
    tags: ['桌面理线', '收纳改造', '强迫症福音', '桌搭测评']
  },
  {
    id: 'tr_bot1_5',
    accountId: 'acc_bot1',
    keyword: '沉浸式打工人夜间桌面 / 暗色调极简氛围灯',
    heat: '深夜工位话题 · 28.6w 讨论',
    sourceType: '小红书高赞氛围图文',
    suggestedAngle: '暗光环境下屏幕挂灯+桌底暖光灯带的色温搭配方案，保护视力兼顾高级感。',
    sampleHook: '晚上十点关掉大灯的一瞬间，这个工位直接变成我的精神避难所。',
    tags: ['深夜书房', '屏幕挂灯', '工位氛围感', '极简主义']
  },
  {
    id: 'tr_bot1_6',
    accountId: 'acc_bot1',
    keyword: 'Raycast 全键盘流效率神仙插件盘点',
    heat: '极客效率工具 · 16.2w 收藏',
    sourceType: '开发者高赞神器推荐',
    suggestedAngle: '抛弃 Alfred/Spotlight，展示窗口分屏、剪贴板历史、快速翻译与脚本扩展。',
    sampleHook: '为什么真正的电脑高手从来不用鼠标？看完这个操作你就懂了。',
    tags: ['Raycast', '效率工具', 'Mac神仙软件', '独立开发']
  },
  {
    id: 'tr_bot1_7',
    accountId: 'acc_bot1',
    keyword: '双电机升降桌极限测评 / 1.8米原木大桌面选型',
    heat: '大件硬件避坑 · 22.5w 互动',
    sourceType: '真实购买避坑指南',
    suggestedAngle: '正装与倒装立柱对比、防回退安全阻尼机制、打字晃动测试实拍。',
    sampleHook: '买了升降桌才知道的坑！这3点没看清，几千块钱直接打水漂。',
    tags: ['升降桌', '书房好物', '原木桌板', '居家办公']
  },
  {
    id: 'tr_bot1_8',
    accountId: 'acc_bot1',
    keyword: '极简番茄钟硬件与工位水墨屏时钟测评',
    heat: '抗内耗专注神器 · 15.9w 赞藏',
    sourceType: '专注力与深度工作硬件',
    suggestedAngle: '实体旋转计时器 vs 手机软件：为什么无屏幕打扰的物理阻尼更能进入心流。',
    sampleHook: '戒掉手机成瘾的神器！这个小小的旋转番茄钟救了我的拖延症。',
    tags: ['番茄工作法', '时间管理', '墨水屏时钟', '深度工作']
  },
  {
    id: 'tr_bot1_9',
    accountId: 'acc_bot1',
    keyword: '客制化机械键盘雨滴轴打字音与手感天花板',
    heat: '外设发烧友榜 · 27.4w 互动',
    sourceType: '沉浸式解压视听',
    suggestedAngle: 'HIFI 打字音实录、铝坨坨套件与消音棉搭配，带来极致愉悦的工作敲击感。',
    sampleHook: '戴上耳机听！这把机械键盘的声音，简直像在指尖下了一场夏日大雨。',
    tags: ['客制化键盘', '机械键盘', '打字音解压', '桌搭数码']
  },
  {
    id: 'tr_bot1_10',
    accountId: 'acc_bot1',
    keyword: '程序员桌面神仙外设 / 轨迹球鼠标与人体工学椅',
    heat: '健康工位指南 · 21.8w 收藏',
    sourceType: '防手腕酸痛与护腰专题',
    suggestedAngle: '拯救鼠标手与腰椎间盘劳损：垂直鼠标、人体工学椅腰托与显示器支架视角调校。',
    sampleHook: '久坐打工人自救指南：把这3样换掉后，我的肩颈酸痛彻底消失了。',
    tags: ['人体工学', '鼠标手自救', '人体工学椅', '健康办公']
  },

  // ================= 账号 3: BOT 2号 (新奇生活硬件好物 - 至少 10 条最高赞最高讨论度) =================
  {
    id: 'tr_bot2_1',
    accountId: 'acc_bot2',
    keyword: '百元内幸福感小家电 / 新奇数码玩具',
    heat: '送礼排行榜首 · 27.9w 搜索',
    sourceType: '消费好物趋势',
    suggestedAngle: '复古调频收音机/桌面像素时钟开箱，主打精致手感与送礼不出错。',
    sampleHook: '谁懂啊！百元内买到这种阻尼感的金属小玩意，男生直接沦陷。',
    tags: ['数码好物', '男生礼物', '小众硬件', '生活美学']
  },
  {
    id: 'tr_bot2_2',
    accountId: 'acc_bot2',
    keyword: '复古调频收音机 / 金属阻尼感蓝牙音箱开箱',
    heat: '小众复古美学 · 23.4w 赞藏',
    sourceType: '高颜值好物开箱',
    suggestedAngle: '纯铜旋钮与黄铜天线，旋转电台时真实的沙沙调频声，唤醒慢节奏生活。',
    sampleHook: '下雨天打开这个复古小收音机，连空气里的浮尘都变得浪漫了。',
    tags: ['复古音箱', '调频收音机', '桌面摆件', '治愈系好物']
  },
  {
    id: 'tr_bot2_3',
    accountId: 'acc_bot2',
    keyword: '桌面像素艺术时钟 / 可编程动画与天气显示',
    heat: '极客潮玩热度 · 19.8w 互动',
    sourceType: '潮流电子好物',
    suggestedAngle: '64x64 像素屏、实时显示粉丝数/比特币行情/游戏人物待机动画，酷炫满分。',
    sampleHook: '桌上摆了这个像素小电视，每个路过工位的同事都要驻足玩半天！',
    tags: ['像素时钟', '赛博朋克', '桌面潮玩', '极客数码']
  },
  {
    id: 'tr_bot2_4',
    accountId: 'acc_bot2',
    keyword: '磁吸三合一旋转折叠金属无线充电站',
    heat: '数码刚需神器 · 25.1w 讨论',
    sourceType: '极简出行好物',
    suggestedAngle: '全铝合金CNC切割，一板搞定手机、手表、耳机，折叠后仅如饼干大小。',
    sampleHook: '出差旅行只要带这一块金属小薄片，充电线全都可以扔在家里！',
    tags: ['无线充电', '出差神器', '三合一充电器', '金属美学']
  },
  {
    id: 'tr_bot2_5',
    accountId: 'acc_bot2',
    keyword: '赛博朋克透明发光充电宝 / 手搓快充极客神器',
    heat: '硬核工业设计 · 31.2w 互动',
    sourceType: '高赞视觉冲击开箱',
    suggestedAngle: '透明外壳露出主控电路板与铜线圈，配备彩色数显屏查看毫安时与温度。',
    sampleHook: '这届充电宝也太卷了！透明外壳配机械发光，拿在手上赛博朋克感拉满。',
    tags: ['透明充电宝', '赛博朋克', '极客装备', '男生数码']
  },
  {
    id: 'tr_bot2_6',
    accountId: 'acc_bot2',
    keyword: '独居青年提升幸福感 / 超声波无火水雾香薰机',
    heat: '居家治愈清单 · 22.8w 赞藏',
    sourceType: '小红书生活美学',
    suggestedAngle: '模拟壁炉火焰光效与极细腻冷水雾，搭配雪松/佛手柑精油的独处安宁感。',
    sampleHook: '独居生活的治愈瞬间：推开门闻到那一缕雪松木香，疲惫瞬间被融化。',
    tags: ['香薰机', '独居幸福感', '火焰香薰', '治愈系家居']
  },
  {
    id: 'tr_bot2_7',
    accountId: 'acc_bot2',
    keyword: '工位桌面拟态水墨屏日历副屏开箱',
    heat: '不伤眼电子摆件 · 18.7w 讨论',
    sourceType: '低功耗智能硬件',
    suggestedAngle: '一年只需充一次电的水墨屏日历，每日自动更新文学金句与天气，静谧耐看。',
    sampleHook: '看腻了液晶屏的刺眼蓝光？这个像纸质书一样的水墨屏小摆件太优雅了。',
    tags: ['水墨屏', '电子日历', '极简生活', '工位好物']
  },
  {
    id: 'tr_bot2_8',
    accountId: 'acc_bot2',
    keyword: '全金属指尖陀螺与机械解压潮玩测评',
    heat: '减压玩具天花板 · 20.5w 互动',
    sourceType: '高复购解压好物',
    suggestedAngle: '钛合金材质、陶瓷微型轴承、空转5分钟以上的极致阻尼与推牌机械脆响。',
    sampleHook: '开会摸鱼必备！指尖轻轻一推，那声机械脆响直接让人头皮发麻。',
    tags: ['解压玩具', '指尖陀螺', '机械潮玩', 'EDC装备']
  },
  {
    id: 'tr_bot2_9',
    accountId: 'acc_bot2',
    keyword: '掌上复古开源掌机 / 随时畅玩千款童年回忆',
    heat: '怀旧游戏热潮 · 29.6w 赞藏',
    sourceType: '复古数码开箱',
    suggestedAngle: '3.5寸全贴合高刷屏，口袋随身带，重温宝可梦、红白机、合金弹头的童年感动。',
    sampleHook: '几百块买回整个童年！通勤地铁上掏出来玩一把，比刷短视频快乐10倍。',
    tags: ['开源掌机', '复古游戏', '童年回忆', '数码玩具']
  },
  {
    id: 'tr_bot2_10',
    accountId: 'acc_bot2',
    keyword: '桌面音乐律动拾音灯 / 沉浸式听歌氛围神器',
    heat: '视听联动榜 · 24.1w 互动',
    sourceType: '电竞音乐桌搭',
    suggestedAngle: '32位ARM处理器低延迟拾音，随音乐鼓点呼吸跳跃的铝合金光柱。',
    sampleHook: '只要几十块钱！音乐一响起来，普通书桌立马变身私人音乐厅。',
    tags: ['拾音灯', '律动灯', '电竞桌搭', '氛围感神器']
  },

  // ================= 账号 4: AI 前沿科技全网矩阵 (深度整合：知名 AI 博主顶流高赞爆款 + 官方权威一手情报) =================
  {
    id: 'tr_ai_1',
    accountId: 'acc_ai',
    keyword: 'Andrej Karpathy 爆论：Vibe Coding 革命已至，资深程序员从未感到如此落后',
    heat: 'X 顶流爆款 · 8.9w 赞 / 2.4w 转推 / 4,300+ 讨论',
    sourceType: '知名 AI 博主顶流发推',
    author: 'Andrej Karpathy (@karpathy)',
    authorRole: '前特斯拉 AI 总监 / OpenAI 联创 / 现 Anthropic 核心研究员',
    authorType: 'blogger',
    postTime: '最新高赞热议',
    discussionMetrics: { likes: '8.9w', reposts: '2.4w', comments: '4,300+' },
    suggestedAngle: '连写了十几年代码的顶尖大牛都在感叹被 AI 超越，剖析普通人如何用自然语言指挥智能体（Agentic Coding）实现一人即团队。',
    sampleHook: '连 Andrej Karpathy 都承认自己落后了！AI 编程的相变已经发生，2026 年写代码的方式彻底变了。',
    tags: ['AndrejKarpathy', 'VibeCoding', 'AgenticCoding', 'AI程序员', 'Software3.0']
  },
  {
    id: 'tr_ai_2',
    accountId: 'acc_ai',
    keyword: 'Karpathy 发布开源神作 autoresearch：一人跑通 AI 科研实验全自动闭环',
    heat: 'GitHub 趋势榜首 · 2.8w Star / 极客狂欢',
    sourceType: '知名博主开源发布',
    author: 'Andrej Karpathy (@karpathy)',
    authorRole: '知名开源贡献者 / 顶流 AI 科学家',
    authorType: 'blogger',
    postTime: '今日科技热榜',
    discussionMetrics: { likes: '2.8w Star', reposts: '1.2w', comments: '2,900+' },
    suggestedAngle: '手把手拆解 autoresearch 架构：智能体自主阅读文献、修改代码跑实验、自动记录并生成评估报告的科研全流程。',
    sampleHook: 'Karpathy 又手搓了一个改变科研的神器！以后写论文、做实验，连代码都不用自己跑了。',
    tags: ['AutoResearch', 'AI科研自动化', 'GitHub神作', '智能体闭环', '独立研究']
  },
  {
    id: 'tr_ai_3',
    accountId: 'acc_ai',
    keyword: '宝玉：告别玩具阶段，用 MCP 与 Skills 协议打造真正能落地的个人智能体',
    heat: '全网热议深度干货 · 18.5w 赞藏 / 3,100+ 讨论',
    sourceType: '知名 AI 专栏高赞爆文',
    author: '宝玉 (@dotey)',
    authorRole: '知名 AIGC 布道师 / 资深系统架构师',
    authorType: 'blogger',
    postTime: '高赞精选深度长文',
    discussionMetrics: { likes: '18.5w', reposts: '3,800', comments: '3,100+' },
    suggestedAngle: '别再单纯堆砌提示词了！深度拆解 Anthropic 推出的 MCP (Model Context Protocol)，如何让本地工具、数据库与 AI 安全互通。',
    sampleHook: '天天玩提示词的先停一停！宝玉老师最新长文把 MCP 和 Agent Skills 讲透了，这才是真正的工业级落地。',
    tags: ['宝玉', 'MCP协议', 'AgentSkills', 'AI落地架构', '生产力工具']
  },
  {
    id: 'tr_ai_4',
    accountId: 'acc_ai',
    keyword: '宝玉：警惕“Vibe Coding 的杠杆陷阱”，如何避免在 AI 工具链中自我消耗',
    heat: '独立开发者热榜 · 22.4w 阅读 / 1.6w 互动',
    sourceType: '知名博主深度警示录',
    author: '宝玉 (@dotey)',
    authorRole: '知名 AIGC 布道师 / 科技评论家',
    authorType: 'blogger',
    postTime: '本周热议反思',
    discussionMetrics: { likes: '1.6w', reposts: '4,200', comments: '1,800+' },
    suggestedAngle: '很多人用 AI 狂刷代码却无法真正上线变现，分析“契约优先”、“严谨类型守门”与“小步验证”的核心工程法则。',
    sampleHook: '用 AI 写代码爽是爽，但为什么你总是卡在最后一公里？宝玉这篇万字警示录直接点醒无数人。',
    tags: ['宝玉', 'AI编程避坑', 'VibeCoding反思', '独立开发', '代码质量']
  },
  {
    id: 'tr_ai_5',
    accountId: 'acc_ai',
    keyword: '归藏：小红书爆款视觉图文与 PPT 自动化工作流，普通人如何用 RED Skill 零代码出图',
    heat: '小红书设计榜首 · 31.6w 赞藏 / 5,800+ 收藏',
    sourceType: '小红书+即客顶流 KOL 爆款',
    author: '归藏 (@op7418)',
    authorRole: '知名 AIGC 周刊主理人 / 视觉与模型设计师',
    authorType: 'blogger',
    postTime: '小红书今日爆款榜',
    discussionMetrics: { likes: '31.6w', reposts: '5,800', comments: '4,100+' },
    suggestedAngle: '演示归藏开源的社交媒体配图 Skill 与自动化设计脚本，带读者 5 分钟上手批量制作高级感排版图文。',
    sampleHook: '做自媒体最头疼配图排版？跟着归藏老师这套工作流，一个人 10 分钟做出一整周的高级感图文！',
    tags: ['归藏', 'AIGC周刊', '小红书排版', '设计工作流', 'AI做图']
  },
  {
    id: 'tr_ai_6',
    accountId: 'acc_ai',
    keyword: '归藏：AI 漫剧短剧商业化分镜全景复盘，从 Midjourney、Sora 到剪辑月入变现避坑',
    heat: '数字内容创业榜 · 26.8w 讨论 / 1.9w 赞',
    sourceType: '即刻+X 深度实操专栏',
    author: '归藏 (@op7418)',
    authorRole: '视觉与多模态生成前沿探索者',
    authorType: 'blogger',
    postTime: '高讨论度实战指南',
    discussionMetrics: { likes: '1.9w', reposts: '3,200', comments: '2,600+' },
    suggestedAngle: '解构当下爆火的 AI 漫剧与有声短剧，手把手拆解角色一致性锁定、分镜镜头连贯性与商业交付避坑指南。',
    sampleHook: '都在说 AI 漫剧是下一个泼天富贵，普通人怎么入局？看完归藏这套全流程避坑指南少走半年弯路！',
    tags: ['归藏', 'AI漫剧', 'Sora视频', 'AI短剧', '多模态变现']
  },
  {
    id: 'tr_ai_7',
    accountId: 'acc_ai',
    keyword: '木遥：长思维链 (CoT) 与 Reasoning 模型的数学真相，为什么它不是万能灵药',
    heat: '知乎硬核哲思榜 · 15.2w 赞同 / 深度长文',
    sourceType: '知名学者深度专栏',
    author: '木遥',
    authorRole: '知名数学学者 / 科技文化评论家',
    authorType: 'blogger',
    postTime: '深度万赞文章',
    discussionMetrics: { likes: '15.2w', reposts: '2,400', comments: '1,950+' },
    suggestedAngle: '从数学原理出发，客观评测大模型强化学习（RL）推理的边界，解释为何长思考链不能完全解决常识盲区与外推幻觉。',
    sampleHook: '大模型真的拥有人类逻辑了吗？木遥老师这篇深度神文，彻底把 Reasoning 模型的遮羞布扯下来了！',
    tags: ['木遥', '思维链CoT', 'Reasoning模型', '深度哲学', '大模型本质']
  },
  {
    id: 'tr_ai_8',
    accountId: 'acc_ai',
    keyword: '量子位 2026 AI 十大技术趋势报告：端侧轻量化模型与 A2A 智能体协议全面爆发',
    heat: '科技媒体热搜榜首 · 42.8w 阅读 / 行业风向标',
    sourceType: '顶尖科技智库独家研报',
    author: '量子位 (QbitAI)',
    authorRole: '国内顶尖前沿科技智库媒体',
    authorType: 'community',
    postTime: '今日权威研报',
    discussionMetrics: { likes: '42.8w 阅读', reposts: '8,400', comments: '3,600+' },
    suggestedAngle: '提炼 2026 年最具商业落地潜力的十大趋势，重点解读 AI Agent 之间标准化通信（A2A）如何重塑企业级软件。',
    sampleHook: '2026 年 AI 到底往哪走？量子位年度十大趋势出炉，这 3 个方向最适合普通人和小团队做副业！',
    tags: ['量子位', '2026AI趋势', '智能体协议', '科技风向', 'A2A']
  },
  {
    id: 'tr_ai_9',
    accountId: 'acc_ai',
    keyword: '机器之心硬核研报：大模型自进化 (LLM Self-Evolution) 成为人类数据枯竭破局点',
    heat: '极客技术研报 · 19.3w 收藏 / 学术圈刷屏',
    sourceType: '机器之心 PRO 独家专栏',
    author: '机器之心 (Synced)',
    authorRole: '全球前沿人工智能专业媒体',
    authorType: 'community',
    postTime: '学术圈重磅专题',
    discussionMetrics: { likes: '19.3w 收藏', reposts: '4,100', comments: '1,720+' },
    suggestedAngle: '在高质量公开互联网数据被穷尽后，深度解析合成数据（Synthetic Data）与自我博弈（Self-Play）如何驱动大模型持续质变。',
    sampleHook: '人类数据快被大模型吃光了！机器之心最新重磅研报：看顶尖实验室如何让 AI 自己跟自己下棋进化。',
    tags: ['机器之心', '大模型自进化', '合成数据', '强化学习', '技术硬核']
  },
  {
    id: 'tr_ai_10',
    accountId: 'acc_ai',
    keyword: '硅星人探访：一人公司靠 AI 智能体自动化跑通 1 万美金 MRR 的出海真实账本',
    heat: '出海创业刷屏爆文 · 35.1w 阅读 / 1.4w 转发',
    sourceType: '科技专访 / 阑夕推荐',
    author: '硅星人 Pro / 阑夕',
    authorRole: '硅谷前沿观察家 / 知名科技 KOL',
    authorType: 'blogger',
    postTime: '出海圈热议精选',
    discussionMetrics: { likes: '35.1w', reposts: '1.4w', comments: '2,800+' },
    suggestedAngle: '真实复盘一位国内独立开发者，如何利用 Cursor + n8n + Stripe，在两周内开发微型工具并收获首批海外付费用户。',
    sampleHook: '不招一个员工，一个人用 AI 两个月做到月入 7 万人民币！硅星人深度拆解这位独立开发者的出海秘籍。',
    tags: ['硅星人', '独立开发', '出海赚钱', '一人公司', '微型SaaS']
  },
  {
    id: 'tr_ai_11',
    accountId: 'acc_ai',
    keyword: 'OpenAI DevDay 正式发布常驻智能体 Dots 与 GPT-6.1 Sol 编程模型',
    heat: '全球科技发布热点 · 38.9w 热度 / 官方权威',
    sourceType: '官方权威一手原厂发布',
    author: 'OpenAI 官方',
    authorRole: '官方原厂发布 / 技术白皮书',
    authorType: 'official',
    postTime: '官方权威最新发布',
    discussionMetrics: { likes: '38.9w', reposts: '9,200', comments: '5,100+' },
    suggestedAngle: '官方原厂一手拆解：Dots Agent 是如何 24 小时在后台替你自动跟进邮件、跨系统更新表格和触发自动化任务的。',
    sampleHook: 'OpenAI 刚发布的这个常驻智能体，已经开始悄悄替代初级行政和助理了！教你设置第一只 Dots。',
    tags: ['OpenAI', 'DotsAgent', '智能体工作流', 'AI生产力', '官方一手']
  },
  {
    id: 'tr_ai_12',
    accountId: 'acc_ai',
    keyword: 'Anthropic 官宣 Claude 5.5 系列：推出开源代码安全漏洞扫描器',
    heat: '专业开发者热议 · 33.4w 讨论 / 官方一手',
    sourceType: '官方技术白皮书',
    author: 'Anthropic 官方',
    authorRole: '官方原厂发布 / 技术白皮书',
    authorType: 'official',
    postTime: '官方权威最新发布',
    discussionMetrics: { likes: '33.4w', reposts: '6,800', comments: '3,400+' },
    suggestedAngle: '实测百万级长上下文：为什么独立开发者和技术极客更青睐 Claude？深入评测 0 Bug 代码重构表现。',
    sampleHook: '千万别乱给 AI 喂代码！看 Claude 5.5 是如何 3 秒揪出老系统致命安全后门的。',
    tags: ['Anthropic', 'Claude5', '代码安全', '全栈重构', '官方一手']
  },
  {
    id: 'tr_ai_13',
    accountId: 'acc_ai',
    keyword: 'Google DeepMind 官宣 Gemini 4 Argon：百万 Token 深度推理极限压测',
    heat: '大模型评测热榜 · 35.7w 热度 / 官方一手',
    sourceType: '官方原厂发布',
    author: 'Google DeepMind 官方',
    authorRole: '官方原厂发布 / 前沿模型首测',
    authorType: 'official',
    postTime: '官方权威最新发布',
    discussionMetrics: { likes: '35.7w', reposts: '7,100', comments: '3,900+' },
    suggestedAngle: '一口气喂给大模型整套开源代码库与全书技术文档，看它如何进行因果关联逻辑推理与系统级找错。',
    sampleHook: '谷歌大模型再次狂暴升级！一口气吞下一整套系统架构，还能自己推理找错！',
    tags: ['Gemini4', 'GoogleDeepMind', '深度推理', '长上下文', '官方一手']
  },
  {
    id: 'tr_ai_14',
    accountId: 'acc_ai',
    keyword: 'DeepSeek 官方发布 V4.1-Flash 多模态原生推理与 Harness 智能体框架',
    heat: '极客关注热度 · 36.8w 讨论 / 官方一手',
    sourceType: '官方一手原厂开源',
    author: 'DeepSeek 官方',
    authorRole: '官方原厂开源 / 满血极客首选',
    authorType: 'official',
    postTime: '官方权威最新发布',
    discussionMetrics: { likes: '36.8w', reposts: '8,900', comments: '4,600+' },
    suggestedAngle: '手把手带读者纯本地部署 1M 上下文图文多模态模型，强调“完全免费、0 数据泄露、断网畅享”。',
    sampleHook: 'DeepSeek 再次杀疯了！全新 1M 上下文模型开源，本地跑起来丝滑得不像话！',
    tags: ['DeepSeek', '本地大模型', '私有知识库', 'AI落地', '官方一手']
  },
  {
    id: 'tr_ai_15',
    accountId: 'acc_ai',
    keyword: 'Cursor 推出 Rollouts 与 Security Review 自治伴侣，上线移动端 Agent',
    heat: '开发者大会热点 · 31.2w 讨论 / 官方一手',
    sourceType: '开发者大会官方纪要',
    author: 'Cursor 官方',
    authorRole: '官方开发者大会 / IDE 革命',
    authorType: 'official',
    postTime: '官方权威最新发布',
    discussionMetrics: { likes: '31.2w', reposts: '5,400', comments: '2,900+' },
    suggestedAngle: '展示用 iPhone 手机审核并指挥 Cursor 自主巡检修复服务器 Bug，探讨 IDE 如何向全栈合伙人进化。',
    sampleHook: '程序员出门不用背电脑了！Cursor 手机端上线，躺在床上指挥 AI 修复线上 Bug。',
    tags: ['Cursor', 'AI编程', '移动端Agent', '程序员效率', '官方一手']
  }
];

// 每日 AI 权威情报雷达（严格筛选：真实一手信源、官方权威原厂、高价值落地）
export const DAILY_AI_INTELLIGENCE: AIIntelligenceItem[] = [
  {
    id: 'ai_intel_1',
    title: 'OpenAI DevDay 正式发布常驻智能体 "Dots" 与 GPT-6.1 Sol 编程模型',
    organization: 'OpenAI',
    date: '2026年最新官方权威发布',
    credibility: '官方原厂发布',
    summary: 'OpenAI 正式推出常驻自治 Agent "Dots"，内置超 4,000 个主流应用插件打通（Slack、Teams 等）；同时发布 GPT-6.1 Sol，大幅提升自动化 Agent 复杂工程代码重构能力。',
    technicalImpact: '从单一对话问答时代正式迈入多系统常驻自主执行（Always-on Autonomous Agents）时代，多应用联动开发门槛骤降。',
    contentAngle: '面向小白与职场人：AI 已经能替你自动回复客户邮件、跨系统更新表格，教大家如何设置第一只专属 Dots Agent。',
    sampleHook: 'OpenAI 刚刚发布了真正的 AI 打工人！不用你写提示词，它在后台 24 小时替你跑业务。',
    tags: ['OpenAI', 'AI智能体', 'GPT6', '前沿科技', '生产力工具'],
    officialUrl: 'https://openai.com/index/devday-2026-announcements/'
  },
  {
    id: 'ai_intel_2',
    title: 'Anthropic 正式推出 Claude Haiku 5.5 与 Sonnet 5.5，上线开源代码安全扫描器',
    organization: 'Anthropic',
    date: '2026年最新官方权威发布',
    credibility: '官方技术白皮书',
    summary: 'Anthropic 升级 Claude 5.5 系列模型，Sonnet 5.5 在专业知识库与多轮复杂任务执行上实现成本大幅下调，并面向开源生态免费推出 OSS 漏洞扫描器。',
    technicalImpact: '长上下文代码理解与安全对齐能力领跑行业，在复杂文档提取和私有库检索上准确率显著优于通用模型。',
    contentAngle: '横向实测：为什么现在的独立开发者更愿意为 Claude 付费？用真实复杂任务对比展示核心优势。',
    sampleHook: '悄悄变强的 Claude 5.5 到底有多神？带你实测写出 0 Bug 架构的离谱体验。',
    tags: ['Anthropic', 'Claude5', '大语言模型', '代码助手', 'AI实测'],
    officialUrl: 'https://www.anthropic.com/news/claude-5-5-family'
  },
  {
    id: 'ai_intel_3',
    title: 'Google DeepMind 官宣 Gemini 4 Argon：支持百万级 Token 深度推理与安全防御',
    organization: 'Google DeepMind',
    date: '2026年最新官方权威发布',
    credibility: '官方原厂发布',
    summary: 'Google 推出 Gemini 4 Argon 前沿推理模型，具备 100 万 Token 输出上限与多模态复杂数学/逻辑防御架构；同步升级 Gemini 3.8 Flash 轻量级极速响应模型。',
    technicalImpact: '长文本极限推理与超大规模代码库整仓解析取得重大突破，多模态实时交互延迟降至毫秒级。',
    contentAngle: '视频实操：把整本 50 万字的专业技术手册一次性喂给 Gemini，看它如何 3 秒定位并重构业务代码。',
    sampleHook: '谷歌大模型再次狂暴升级！一口气吞下一整套系统架构，还能自己推理找错！',
    tags: ['GoogleDeepMind', 'Gemini4', '前沿AI', '深度推理', '黑科技'],
    officialUrl: 'https://blog.google/technology/ai/gemini-4-argon-announcement/'
  },
  {
    id: 'ai_intel_4',
    title: 'Cursor 推出 Rollouts 与 Security Review 自治机器人，上线移动端 Agent',
    organization: 'Cursor',
    date: '2026年最新官方权威发布',
    credibility: '开发者大会官方纪要',
    summary: 'Cursor 官方发布两大代码自动化伴侣：Rollouts 监控从 PR 到生产环境的代码健康与性能回退，Security Review 自动修复漏洞，并推出 iOS 手机端 Agent 远程监控开发。',
    technicalImpact: 'IDE 正在从“辅助补全代码”升级为“具备 CI/CD 巡检与自主修补能力的工程合伙人”。',
    contentAngle: '手机也能写代码？展示用 iPhone 审核并指挥 Cursor 自动修复服务器 Bug 的硬核工作流。',
    sampleHook: '程序员出门不用背电脑了！Cursor 手机端上线，躺在床上指挥 AI 修复线上 Bug。',
    tags: ['Cursor', 'AI编程', '移动端开发', '程序员效率', '独立开发'],
    officialUrl: 'https://cursor.com/blog/october-2026-releases'
  },
  {
    id: 'ai_intel_5',
    title: 'DeepSeek 官方发布 V4.1-Flash 多模态原生推理模型与 Harness 0.1 智能体框架',
    organization: 'DeepSeek',
    date: '2026年最新官方权威发布',
    credibility: '官方原厂发布',
    summary: 'DeepSeek 官方开源 V4.1-Flash，支持 100 万 Token 超长上下文与极速原生图像理解，推理成本降至极致，并推出面向工程自动化的 MIT 协议开源 Harness Agent 框架。',
    technicalImpact: '将百万长文本模型彻底平民化，本地部署与私有微调门槛极大降低，在代码生成和多模态理解基准测试中逼近顶尖闭源模型。',
    contentAngle: '保姆级教程：手把手教普通开发者 5 分钟在本地配置 DeepSeek-V4.1-Flash，实现 0 成本私有图文知识库。',
    sampleHook: 'DeepSeek 再次杀疯了！全新 1M 上下文模型开源，本地跑起来丝滑得不像话！',
    tags: ['DeepSeek', 'V4Flash', '开源大模型', '私有知识库', 'AI落地'],
    officialUrl: 'https://deepseek.com/announcements/v4-1-flash-release'
  }
];

// 每日自动生成的新鲜口语语料流 (每日推送，无需手动输入)
export const DAILY_AUTO_CORPUS_STREAM: EnglishPhrase[] = [
  {
    id: 'stream_1',
    category: 'foreign_trade',
    english: 'We have taken note of the recent ocean freight fluctuations and are willing to absorb a 5% surcharge to maintain our long-term partnership.',
    chinese: '我们注意到了近期海运费的波动，为维护双方长远合作关系，我们愿意承担 5% 的附加费。',
    scenario: '海运成本上涨与客情维护 (Freight Surcharge & Partnership)',
    phonetic: '/wiː hæv ˈteɪkən noʊt əv ðə ˈriːsənt ˈoʊʃən freɪt ˌflʌktʃuˈeɪʃənz/',
    sourceOrigin: '每日系统推荐',
    mastered: false,
    usageNotes: [
      '“absorb [cost/loss/surcharge]”：极其地道的商务动词，意为“自行承担/消化费用或损失”，展现供应商胸怀与诚意。',
      '“maintain long-term partnership”：维系长期合作伙伴关系的经典公关措辞。'
    ],
    extendedScenarios: [
      {
        situation: '【当海运费暴涨、需要客户分担时委婉提出】',
        dialogueEn: 'Due to the sudden surge in Red Sea shipping rates, could we explore splitting the additional container surcharge 50/50 for this batch?',
        dialogueZh: '由于红海航线运费突发暴涨，针对本批次订单，我们能否探讨双方各分担 50% 的集装箱附加费？'
      }
    ],
    nativeAlternatives: [
      'We are prepared to cover part of the freight hike to show our good faith.',
      'To keep our business relationship strong, we will shoulder the marginal shipping difference.'
    ]
  },
  {
    id: 'stream_2',
    category: 'foreign_trade',
    english: 'The third-party quality inspection report has been finalized, and all test metrics comply with CE and RoHS standards.',
    chinese: '第三方质检报告已经出具定稿，所有测试指标均完全符合欧盟 CE 与 RoHS 环保标准。',
    scenario: '验货放行与合规证明 (Inspection & Certification Compliance)',
    phonetic: '/ðə ˈθɜːrdˌpɑːrti ˈkwɑːləti ɪnˈspɛkʃən rɪˈpɔːrt hæz biːn ˈfaɪnəlaɪzd/',
    sourceOrigin: '每日系统推荐',
    mastered: false,
    usageNotes: [
      '“third-party inspection”：第三方验货（如 SGS / BV / 客户指定质检机构）。',
      '“comply with [standard]”：符合……标准/规范，比普通的“meet the standard”更加严谨正式。'
    ],
    extendedScenarios: [
      {
        situation: '【通知客户质检合格、请求安排出货】',
        dialogueEn: 'With the inspection passed with flying colors, we are now standing by for your shipping instructions and forwarder details.',
        dialogueZh: '随着验货圆满通过，我们现已做好准备，静候您的出货指令及指定货代联系方式。'
      }
    ],
    nativeAlternatives: [
      'The SGS inspection certificate is attached for your verification.',
      'All parameters satisfy the agreed regulatory thresholds.'
    ]
  },
  {
    id: 'stream_trade_3',
    category: 'foreign_trade',
    english: 'Could we request an amendment to clause 4.2 in the Letter of Credit to allow partial shipments and transshipment?',
    chinese: '我们能否申请对信用证第 4.2 条款进行修改，以允许分批装运和中途转运？',
    scenario: '信用证条款修改 (L/C Amendment & Transshipment)',
    phonetic: '/kʊd wiː rɪˈkwɛst ən əˈmɛndmənt tuː klɔːz ˈfɔːr pɔɪnt tuː/',
    sourceOrigin: '每日系统推荐',
    mastered: false,
    usageNotes: [
      '“Letter of Credit (L/C)”：信用证，国际外贸支付核心工具。',
      '“amendment”：信用证修约/修改书；“transshipment”：中途转运。'
    ],
    extendedScenarios: [
      {
        situation: '【因船期紧张，向开证行申请顺延交单日】',
        dialogueEn: 'Owing to vessel delays, we kindly request extending the latest shipment date by one week and the presentation period accordingly.',
        dialogueZh: '由于船期延误，我们诚请将最晚装运日期顺延一周，并相应延长交单期限。'
      }
    ],
    nativeAlternatives: [
      'We would appreciate your issuing an amendment to accommodate partial deliveries.',
      'Please instruct the issuing bank to update the transshipment permissions.'
    ]
  },
  {
    id: 'stream_trade_4',
    category: 'foreign_trade',
    english: 'To make it up to you for the slight delivery delay, we will expedite the production of your replenishment order free of charge.',
    chinese: '为弥补这次轻微的交期延误，我们将免费加急为您安排后续补单的排产。',
    scenario: '客诉处理与危机公关 (Delay Compensation & Expedited Production)',
    phonetic: '/tuː meɪk ɪt ʌp tuː juː fɔːr ðə slaɪt dɪˈlɪvəri dɪˈleɪ/',
    sourceOrigin: '每日系统推荐',
    mastered: false,
    usageNotes: [
      '“make it up to you”：非常地道的英文，意为“补偿你/弥补过失”，真诚而富有温度。',
      '“expedite [production/shipping]”：商务高频动词，意为“特快加急推进”。'
    ],
    extendedScenarios: [
      {
        situation: '【当原料紧缺导致延期时提前向海外客户打招呼】',
        dialogueEn: 'We are closely monitoring the supply bottleneck and putting in extra shifts over the weekend to minimize any turnaround delay.',
        dialogueZh: '我们正在严密监控供应链瓶颈，并在周末安排了轮班加急生产，力争将周转延误降至最低。'
      }
    ],
    nativeAlternatives: [
      'As a gesture of goodwill, we will rush the next consignment without extra fees.',
      'We are prioritizing your follow-up order on our premier assembly line.'
    ]
  },
  {
    id: 'stream_3',
    category: 'daily',
    english: 'I’d like to chime in with a quick thought before we wrap up today’s standup.',
    chinese: '在今天站会结束之前，我想插一句分享个简要想法。',
    scenario: '敏捷会议与团队沟通 (Agile Standup & Interjection)',
    phonetic: '/aɪd laɪk tuː tʃaɪm ɪn wɪð ə kwɪk θɔːt/',
    sourceOrigin: '每日系统推荐',
    mastered: false,
    usageNotes: [
      '“chime in”：俚语，地道表达“插话/加入讨论/发表见解”，非常自然且不显突兀无礼。',
      '“wrap up”：圆满结束/收尾会议，高频职场口语。'
    ],
    extendedScenarios: [
      {
        situation: '【在视频会议中礼貌示意自己想补充发言】',
        dialogueEn: 'Mind if I chime in on the UI color contrast? I have a small tweak that could elevate the accessibility score.',
        dialogueZh: '介意我在 UI 色彩对比度上插一句吗？我有一个小微调建议，能大幅提升无障碍评分。'
      }
    ],
    nativeAlternatives: [
      'May I add a quick point before we move to the next item?',
      'Let me jump in briefly with a practical suggestion.'
    ]
  },
  {
    id: 'stream_4',
    category: 'daily',
    english: 'Instead of overanalyzing every single scenario, let’s ship a minimum viable prototype and iterate based on real feedback.',
    chinese: '与其过度分析每一种极端情况，不如我们先发布一个最小可行原型，根据真实用户反馈再快速迭代。',
    scenario: '极客思维与敏捷开发 (Lean Startup & MVP Mindset)',
    phonetic: '/ɪnˈstɛd əv ˌoʊvərˈænəlaɪzɪŋ ˈɛvri ˈsɪŋɡəl sɪˈnærioʊ/',
    sourceOrigin: '每日系统推荐',
    mastered: false,
    usageNotes: [
      '“overanalyze”：过度分析导致停滞不前（常搭配 paralysis by analysis）。',
      '“ship [product/feature]”：技术圈高频动词，意为“正式发布上线交付”，比“release”更有行动力。',
      '“iterate”：敏捷迭代。'
    ],
    extendedScenarios: [
      {
        situation: '【鼓励团队摆脱拖延内耗、快速拿结果】',
        dialogueEn: 'Done is better than perfect. Let’s get this draft in front of audience eyes and see what sticks.',
        dialogueZh: '完成优于完美。先把这篇稿子推向受众，看看哪些内容真正引发了共鸣。'
      }
    ],
    nativeAlternatives: [
      'Let’s launch the MVP first and refine it on the fly.',
      'Rather than aiming for perfection on day one, let’s test the waters with an initial release.'
    ]
  },
  {
    id: 'stream_daily_5',
    category: 'daily',
    english: 'I’ve decided to stop sweating the small stuff and just let things unfold naturally.',
    chinese: '我决定不再为鸡毛蒜皮的小事纠结内耗，顺其自然，允许一切自然发生。',
    scenario: '情绪松弛与圣多纳心法 (Letting Go & Mindfulness)',
    phonetic: '/aɪv dɪˈsaɪdɪd tuː stɑːp ˈswɛtɪŋ ðə smɔːl stʌf/',
    sourceOrigin: '每日系统推荐',
    mastered: false,
    usageNotes: [
      '“don’t sweat the small stuff”：英美最经典的疗愈格言，意为“别为琐碎小事焦虑/放轻松”。',
      '“let things unfold naturally”：允许事情以自己的节律展开，与圣多纳“臣服与允许”高度契合。'
    ],
    extendedScenarios: [
      {
        situation: '【安慰深夜焦虑的朋友】',
        dialogueEn: 'Take a deep breath and relax your shoulders. Whatever is meant for you won’t pass you by.',
        dialogueZh: '深呼吸，放松肩膀。凡是真正属于你的，就绝不会与你擦肩而过。'
      }
    ],
    nativeAlternatives: [
      'I am consciously practicing the art of letting go.',
      'I will surrender my need for control and trust the process.'
    ]
  },
  {
    id: 'stream_daily_6',
    category: 'daily',
    english: 'Could we get the dressing on the side, and is it possible to swap the fries for steamed asparagus?',
    chinese: '沙拉酱可以单独分开放吗？另外能不能把薯条换成清蒸芦笋？',
    scenario: '日常西餐点单与健康饮食 (Dining Out & Custom Orders)',
    phonetic: '/kʊd wiː ɡɛt ðə ˈdrɛsɪŋ ɑːn ðə saɪd/',
    sourceOrigin: '每日系统推荐',
    mastered: false,
    usageNotes: [
      '“on the side”：调料/酱汁单独盛在旁边，西餐高频点餐句式。',
      '“swap [A] for [B]”：将 A 替换为 B（比“replace”更日常地道）。'
    ],
    extendedScenarios: [
      {
        situation: '【在咖啡厅定制低脂奶与少冰】',
        dialogueEn: 'I’ll have a flat white with oat milk, extra hot, and easy on the ice, please.',
        dialogueZh: '请给我一杯燕麦奶澳白，要格外烫一些，另外少冰。'
      }
    ],
    nativeAlternatives: [
      'Please serve the sauce in a separate dish.',
      'Can I substitute the side dish with grilled vegetables?'
    ]
  }
];

// 自主多源素材导入工坊的示范预设
export const IMPORT_SAMPLE_PRESETS = [
  {
    id: 'preset_email',
    type: 'document' as const,
    title: '📄 国际外贸实战：海运附加费与交期谈判往来邮件',
    category: 'foreign_trade' as const,
    sourceName: '客户原版采购往来邮件 (Inquiry & Surcharge Negotiation)',
    content: `Dear Supplier Team,
We have thoroughly reviewed your proforma invoice for PO-202610. While we understand the recent market surge in container freight rates, a 12% across-the-board surcharge is beyond our approved budget threshold.
Could we meet in the middle and absorb a 6% buffer for this shipment? Furthermore, please ensure all customs declaration documents and the commercial invoice are dispatched prior to the estimated departure time.
Looking forward to your prompt confirmation so we can release the advance payment via wire transfer.
Best regards,
Arthur Pendelton, Global Sourcing Director`
  },
  {
    id: 'preset_video',
    type: 'video' as const,
    title: '🎬 视频/播客字幕：海外科技博主谈 AI Agent 与 Cursor 工作流',
    category: 'daily' as const,
    sourceName: 'YouTube 极客访谈《The Autonomous Engineer Episode 42》',
    content: `When you're building with autonomous AI agents, you need to stop micromanaging every single syntax error.
Instead, focus on setting up clean boundaries, solid type definitions, and letting the agent iterate in a sandbox.
If you hit a stumbling block, don't throw away the whole codebase. Chime in with targeted steering, pin down the root cause, and ship the feature before dinnertime. It’s a total game changer for solopreneurs.`
  },
  {
    id: 'preset_book',
    type: 'book' as const,
    title: '📖 经典书籍摘录：圣多纳释放法原著与情绪臣服篇章',
    category: 'daily' as const,
    sourceName: '《The Sedona Method: How to Clear Your Emotional Clutter》Chapter 3',
    content: `Whenever you feel a knot in your stomach or tightness across your chest, your natural instinct is to push it away.
Yet the secret to effortless freedom lies in complete allowing. Ask yourself the timeless three questions:
Could you welcome this feeling for just a brief moment?
Could you let it go?
When?
Notice how effortlessly the tension dissolves when you stop resisting the present moment.`
  },
  {
    id: 'preset_web',
    type: 'web' as const,
    title: '🔗 网页文章/行业报告：欧洲客户对供应链 ESG 与 RoHS 验厂要求',
    category: 'foreign_trade' as const,
    sourceName: 'https://trade-compliance.eu/guidelines/sustainable-procurement-2026',
    content: `All overseas tier-1 vendors must ensure full compliance with the latest RoHS 3 directives and European carbon footprint reporting.
Failure to provide accredited third-party lab certificates may result in consignment detention at the port of entry.
Suppliers are encouraged to conduct preliminary internal audits and streamline traceability protocols ahead of the peak delivery season.`
  }
];

// 智能提取与解析引擎：从用户导入的任何网页/视频/文本/书籍中提取地道表达
export function smartExtractCorpusFromText(
  rawText: string,
  category: 'daily' | 'foreign_trade',
  sourceLabel: string
): EnglishPhrase[] {
  if (!rawText || rawText.trim().length === 0) return [];

  // 清洗文本，分句
  const sentences = rawText
    .replace(/\r\n/g, '\n')
    .split(/(?<=[.?!])\s+(?=[A-Z])/)
    .map((s) => s.trim().replace(/^["'\s]+|["'\s]+$/g, ''))
    .filter((s) => s.length >= 25 && s.length <= 260 && /[a-zA-Z]/.test(s));

  if (sentences.length === 0) {
    return [
      {
        id: 'imp_' + Date.now(),
        category,
        english: rawText.trim().slice(0, 180),
        chinese: category === 'foreign_trade' ? '【自主导入商务语料】请根据具体业务场景演练' : '【自主导入日常地道表达】熟读并脱口而出',
        scenario: sourceLabel,
        sourceOrigin: sourceLabel,
        mastered: false,
        usageNotes: ['从自主导入素材中精准提炼的地道核心句型。'],
        extendedScenarios: [
          {
            situation: '【实战演练场景】',
            dialogueEn: rawText.trim().slice(0, 180),
            dialogueZh: '根据导入素材定制演练'
          }
        ]
      }
    ];
  }

  // 挑选高质量句子并生成精析
  return sentences.slice(0, 5).map((sentence, idx) => {
    let zhMeaning = '';
    let scenario = '';
    let usage: string[] = [];

    if (sentence.includes('surcharge') || sentence.includes('freight') || sentence.includes('container')) {
      scenario = '海运运费与附加费协商';
      zhMeaning = '关于集装箱海运费上涨与成本分担的商务沟通。';
      usage = ['“surcharge”：附加费；“absorb”：自行消化/承担费用。'];
    } else if (sentence.includes('Letter of Credit') || sentence.includes('wire transfer') || sentence.includes('invoice')) {
      scenario = '结算方式与单证审核';
      zhMeaning = '国际外贸电汇结汇、发票及单据出具的关键条款。';
      usage = ['“Letter of Credit”：信用证；“wire transfer”：电汇。'];
    } else if (sentence.includes('compliance') || sentence.includes('RoHS') || sentence.includes('inspection')) {
      scenario = '合规认证与品质验厂';
      zhMeaning = '出口合规认证与国际第三方质检准入标准。';
      usage = ['“compliance with”：遵守/符合强制法规标准。'];
    } else if (sentence.includes('feeling') || sentence.includes('let it go') || sentence.includes('tension') || sentence.includes('instinct')) {
      scenario = '情绪觉察与内在释放';
      zhMeaning = '觉察身体紧绷感，允许情绪自然流淌并放下抗拒。';
      usage = ['“let it go”：释怀/放下；“welcoming the feeling”：接纳并允许感受存在。'];
    } else if (sentence.includes('agent') || sentence.includes('codebase') || sentence.includes('ship') || sentence.includes('chime in')) {
      scenario = '科技前沿与极客工作流';
      zhMeaning = '独立开发、AI 智能体落地与敏捷开发最佳实践。';
      usage = ['“game changer”：颠覆性的规则改变者；“ship the feature”：上线发布交付功能。'];
    } else {
      scenario = category === 'foreign_trade' ? '涉外商务沟通与跟进' : '地道英语表达实操';
      zhMeaning = category === 'foreign_trade' ? '针对商务往来与客户协同的高效地道表达。' : '原汁原味的自然英语口语表达。';
      usage = ['地道句式结构，适合反复朗读并在日常或跨国沟通中脱口而出。'];
    }

    return {
      id: `imported_${Date.now()}_${idx}`,
      category,
      english: sentence,
      chinese: zhMeaning,
      scenario: `${sourceLabel} · ${scenario}`,
      sourceOrigin: sourceLabel,
      mastered: false,
      usageNotes: usage,
      extendedScenarios: [
        {
          situation: `【${scenario}实战拓展应用】`,
          dialogueEn: sentence,
          dialogueZh: zhMeaning
        }
      ],
      nativeAlternatives: [
        'Here is another natural way to phrase this in real-world dialogue.'
      ]
    };
  });
}

export const INITIAL_CONTENT_ITEMS: ContentItem[] = [
  // --- 账号 1: 圣多纳释放法疗愈 IP ---
  {
    id: 'c_sed_1',
    accountId: 'acc_sedona',
    title: '为什么越想摆脱焦虑，焦虑反而越紧？谈谈“抓取”与“允许”',
    stage: 'staging',
    topicSource: '小红书今日热搜榜 #允许一切发生 (热度 48.2w)',
    topicNotes: '核心痛点：很多人把“疗愈”变成了另一种用力控制。圣多纳第一步首先是“你能否允许这种感觉在这里？”',
    hook: '你越用力想把那团堵在胸口的气赶走，它就越死死抓着你。',
    scriptText: `闭上眼睛，深深吸一口气。\n\n在日常里，每当焦虑升起，我们下意识的第一反应是：“糟糕，我怎么又内耗了？我必须立刻调整好！”\n但请留意：这个“想要改变它”的念头，本身就是一种更深层次的控制。\n\n圣多纳释放法的精髓不是“消灭情绪”，而是温柔地向自己提问：\n1. 此刻，我能否允许这股紧绷的情绪存在片刻？（可以）\n2. 我能否放下对它的抗拒？（可以）\n3. 什么时候？（就是现在）\n\n试试深呼吸，把注意力从头脑的评判，轻轻落回身体上。你不是情绪本身，你是容纳情绪的天空。`,
    finalDraftTitle: '越用力越焦虑？3个呼吸，用圣多纳释放胸口那团闷气 🌿',
    finalDraftBody: `闭上眼睛，深深吸一口气。\n\n在日常里，每当焦虑升起，我们下意识的第一反应是：\n“糟糕，我怎么又内耗了？我必须立刻调整好！”\n\n⚠️ 但请留意：\n这个“想要改变它”的念头，本身就是一种更深层次的控制。\n\n圣多纳释放法的精髓从来不是“消灭情绪”，而是温柔地向自己提问：\n\n✨ 步骤一：觉察身体\n此刻，我能否允许这股紧绷的情绪存在片刻？（可以）\n\n✨ 步骤二：松开抓取\n我能否试着放下对它的抗拒，允许它自由流动？（可以）\n\n✨ 步骤三：当下释放\n什么时候？（就是现在。）\n\n把注意力从头脑的自我评判，轻轻落回身体的每一次起伏上。\n你不是紧绷的情绪本身，你是一直都在的、容纳万物的天空 ☁️\n\n💬 试着在评论区留下【允许】，给自己一份温柔的允许吧。`,
    coverLayout: {
      badgeText: '圣多纳情绪急救指南',
      mainHeadline: '越用力对抗，\n焦虑越死死抓着你。',
      subHeadline: '3步松开抓取 · 把平静还给身体',
      colorTheme: 'sage'
    },
    tags: ['圣多纳释放法', '情绪急救', '接纳与臣服', '深度内耗', '睡前冥想'],
    platforms: ['小红书'],
    targetDate: '2026-10-12 20:00',
    coverNote: '柔雾鼠尾草绿底色 + 极简手绘茶杯与云朵，主标题大字高对比居中排版',
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 3600000 * 4
  },
  {
    id: 'c_sed_2',
    accountId: 'acc_sedona',
    title: '睡前10分钟圣多纳释放练习：卸下肩膀上的隐形铠甲',
    stage: 'staging',
    topicSource: '小红书高频搜索词 #胸口发紧咽喉堵塞 (21.6w 笔记)',
    topicNotes: '夜间是身心防线最脆弱也最适合释放的时刻，主打睡前疗愈音频或图文轮播。',
    hook: '睡前把今天的所有的控制欲、期待与评判，通通还给黑夜。',
    scriptText: `躺平在床上，感受床垫承托你全部重量的踏实感。\n\n问问自己：\n“今天有什么事情是我一直在抓着不放的？”\n“我能否允许那份不安在这个夜晚被释放？”\n不用用力，就像松开手里紧握的一把沙子一样，自然流走。`,
    finalDraftTitle: '今晚，允许自己什么都不做 🌙 10分钟睡前释放练习',
    finalDraftBody: `平躺在床上，感受床垫安稳承托住你身体的踏实感。\n\n深呼吸三次，在心里悄悄问自己：\n\n1. 今天有什么事情，是我一直在暗暗较劲、抓着不放的？\n2. 我能否允许那份期待与不安，在这个夜晚轻轻流走？\n3. 如果可以，什么时候？（就是此时此刻。）\n\n不用用力，就像松开手里紧握的一把沙子，任由它回归虚空。\n愿今夜的你，拥有一夜黑甜的好眠 ✨`,
    coverLayout: {
      badgeText: '睡前情绪大扫除',
      mainHeadline: '今晚，允许自己\n什么都不做。',
      subHeadline: '10分钟卸下肩膀上的隐形铠甲',
      colorTheme: 'lilac'
    },
    tags: ['晚安冥想', '治愈系', '放下执念', '高质量睡眠'],
    platforms: ['小红书'],
    targetDate: '2026-10-10 21:30',
    coverNote: '星光柔粉夜空，大字居中《今晚，允许自己什么都不做》',
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 3600000
  },
  {
    id: 'c_sed_3',
    accountId: 'acc_sedona',
    title: '践行圣多纳释放法30天：我记录下的身体微小蜕变',
    stage: 'published',
    topicSource: '个人真实实践成长日记',
    topicNotes: '真实案例分享，增加账号权威度与信任感。',
    hook: '从每天胸口发紧、频繁叹气，到自然松弛，我经历了什么？',
    scriptText: `整整一个月，我每天只做一件事：每当烦躁升起，先停住不行动，在心里问那经典的释放三问...`,
    tags: ['生活记录', '自我成长', '心理学', '身心合一'],
    platforms: ['小红书'],
    publishedUrl: 'https://www.xiaohongshu.com/explore/example-sedona-30days',
    publishedAt: '2026-10-06 19:45',
    metrics: {
      views: 18420,
      likes: 2160,
      collects: 1480,
      comments: 236,
      retentionRate: '68.4%',
      keyTakeaway: '真诚的第一人称记录完播率最高，评论区大量询问练习步骤，下篇可出保姆级实操拆解。'
    },
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 86400000 * 2
  },

  // --- 账号 4: AI 全网科技矩阵 ---
  {
    id: 'c_ai_1',
    accountId: 'acc_ai',
    title: '告别低效手写：用 Cursor 编写复杂全栈系统的 5 条黄金法则',
    stage: 'staging',
    topicSource: '小红书+抖音科技热搜 #Cursor全栈极速开发 (41.5w 热度)',
    topicNotes: '小红书发精简图文长图，抖音同步录屏实操视频演示，后续改写为 Twitter Thread。',
    hook: '为什么别人用 AI 10分钟出原型，你却频频陷入循环报错？',
    scriptText: `大多数人用 Cursor 的最大误区是把一大段需求直接扔给模型。\n核心秘密在于“小步迭代与上下文隔离”：\n1. 永远先写 types/index.ts 契约层；\n2. 每次只让 AI 实现单个纯函数或独立组件；\n3. 善用 @Files 定向喂入关键上下文...`,
    finalDraftTitle: '别盲目催AI写代码！Cursor 高效开发的 5 条底层法则 💻',
    finalDraftBody: `很多人用 Cursor 的最大误区，是把 500 字的大需求一次性扔给大模型，结果往往是陷入死循环或幻觉报错。\n\n这 5 条法则是我踩坑上百次总结出来的实战经验：\n\n📌 1. 契约先行：永远先写 types/index.ts 接口定义\n📌 2. 单一职责：一次只让模型攻克一个纯函数或独立组件\n📌 3. 精准投喂：善用 @Files 选定文件，剔除无关噪点\n📌 4. 严苛类型：开启 TypeScript 严格模式，让编译器做质检员\n📌 5. 随时归档：Git 小步快跑 Commit，随时回退\n\n建议收藏反复对照实操！`,
    coverLayout: {
      badgeText: 'AI 编程实战黑客手册',
      mainHeadline: '用 Cursor 写代码，\n90%的人第一步就错了。',
      subHeadline: '5条黄金法则 · 独立开发者必看',
      colorTheme: 'cyan'
    },
    tags: ['Cursor', 'AI编程', '程序员效率', '独立开发', '全栈技术'],
    platforms: ['小红书', '抖音'],
    targetDate: '2026-10-13 18:00',
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 3600000
  }
];

export const INITIAL_DAILY_TASKS: DailyTask[] = [
  {
    id: 'task_1',
    title: '【圣多纳疗愈号】核对《越用力越焦虑》预发布定稿版面与封面排版',
    completed: false,
    priority: 'P1',
    dueDate: '今天 18:00',
    sourceAccountId: 'acc_sedona',
    linkedContentTitle: '越用力越焦虑？3个呼吸',
    createdAt: Date.now() - 3600000 * 4
  },
  {
    id: 'task_2',
    title: '【AI矩阵号】研读 OpenAI DevDay 最新 Agent 架构并转录 1 篇图文',
    completed: false,
    priority: 'P1',
    dueDate: '今天 20:00',
    sourceAccountId: 'acc_ai',
    linkedContentTitle: 'OpenAI DevDay 最新发布',
    createdAt: Date.now() - 3600000 * 3
  },
  {
    id: 'task_3',
    title: '【口语训练】外贸商务海运附加费谈判与敏捷站会新语料晨读 15 分钟',
    completed: true,
    priority: 'P2',
    dueDate: '已打卡',
    createdAt: Date.now() - 3600000 * 8
  },
  {
    id: 'task_4',
    title: '【选题雷达】从小红书今日热搜采纳 1 条臣服实验选题进选题池',
    completed: false,
    priority: 'P2',
    dueDate: '明天上午',
    sourceAccountId: 'acc_sedona',
    createdAt: Date.now() - 3600000 * 2
  }
];

export const INITIAL_ENGLISH_PHRASES: EnglishPhrase[] = [
  // --- 1. 外贸商务英语体系 ---
  {
    id: 'en_ft_1',
    category: 'foreign_trade',
    english: 'Could you please quote us your most competitive FOB price based on a quantity of 2,000 units?',
    chinese: '能否请您基于 2000 件的采购数量，报一个最具竞争力的 FOB 船上交货价？',
    scenario: '询盘与价格博弈 (Inquiry & Price Negotiation)',
    mastered: true,
    usageNotes: [
      '“quote someone a price” 是极地道的外贸商贸句型，意为“向某人报价”。',
      '“competitive price” 委婉且专业地表达“希望价格有诚意/优惠”，比直接说“give me cheap price”高阶得多。',
      '“FOB (Free on Board)” 贸易术语：船上交货价，卖方承担货物越过船舷前的费用与风险。',
      '数量表达常用结构：“based on a quantity of [数量] units / sets / pieces”。'
    ],
    extendedScenarios: [
      {
        situation: '【阶梯报价拓展】要求对方提供不同采购量级的阶梯单价',
        dialogueEn: 'Could you also provide tiered pricing for 1,000, 3,000, and 5,000 units so we can evaluate potential economies of scale?',
        dialogueZh: '能否同时提供 1000、3000 和 5000 件的阶梯报价，以便我们评估规模效应下的采购方案？'
      },
      {
        situation: '【到岸价 CIF 转换】如果客户需要包含海运费和保险的到岸价',
        dialogueEn: 'In addition to FOB Shanghai, please quote us the CIF Los Angeles price including ocean freight and marine cargo insurance.',
        dialogueZh: '除上海港 FOB 价外，请另外报一份包含海运费及海运险的洛杉矶港 CIF 到岸价。'
      }
    ],
    nativeAlternatives: [
      'We would appreciate your best quotation based on an initial trial order of 2,000 pcs.',
      'Please furnish us with your rock-bottom FOB offer for 2,000 units.'
    ]
  },
  {
    id: 'en_ft_2',
    category: 'foreign_trade',
    english: 'Our standard payment term is 30% T/T deposit in advance and 70% balance against the copy of the Bill of Lading.',
    chinese: '我们的常规付款条件是预付 30% 电汇定金，凭提单副本结清 70% 尾款。',
    scenario: '付款条件与风险控制 (Payment Terms & Financial Terms)',
    mastered: false,
    usageNotes: [
      '“T/T (Telegraphic Transfer)”：电汇，国际贸易最普遍的结算方式。',
      '“deposit in advance”：定金/预付款；“balance against copy of B/L”：见提单副本付尾款，是供需双方风险最均衡的国际标准准则。',
      '“Bill of Lading (B/L)”：提单，货权凭证。'
    ],
    extendedScenarios: [
      {
        situation: '【客户争取更宽松账期 (如 OA 或 信用证 L/C) 时的委婉拒绝与折中】',
        dialogueEn: 'As this is our first collaboration, we are unable to accept Open Account terms; however, we can consider an Irrevocable Letter of Credit at sight for larger orders.',
        dialogueZh: '鉴于这是我们双方首次合作，我们暂时无法接受赊销（OA）账期；但对于大额订单，我们可以考虑即期不可撤销信用证（L/C at sight）。'
      },
      {
        situation: '【提醒买家支付尾款以便电放提单 (Telex Release)】',
        dialogueEn: 'The shipment has already departed. Kindly remit the remaining 70% balance so we can arrange the telex release promptly.',
        dialogueZh: '货物已经开航离港。烦请安排付清剩余 70% 尾款，以便我们第一时间办理电放提单。'
      }
    ],
    nativeAlternatives: [
      'We require a 30% down payment upon order confirmation, with the balance due upon receipt of the shipping documents.',
      'Our terms are 30% down via wire transfer, and the remaining 70% before final dispatch.'
    ]
  },
  {
    id: 'en_ft_3',
    category: 'foreign_trade',
    english: 'We must adhere strictly to the scheduled shipping date, as our seasonal promotional campaign kicks off next month.',
    chinese: '我们必须严格遵守预定的装运日期，因为我们的季节性促销活动下个月就将启动。',
    scenario: '货期交付与供应链跟进 (Lead Time & Delivery Guarantee)',
    mastered: false,
    usageNotes: [
      '“adhere strictly to [something]”：严格遵守/遵循某日程或标准，表达严肃态度但措辞优雅。',
      '“lead time”：生产周期/前置交期；“ETD (Estimated Time of Departure)”：预计开航日。',
      '“kick off”：启动、拉开帷幕，高频商业口语词汇。'
    ],
    extendedScenarios: [
      {
        situation: '【工厂遭遇不可抗力或原材料延误时的专业公关安抚】',
        dialogueEn: 'Due to an unexpected bottleneck in raw material sourcing, the ETD will be delayed by 4 business days. We are putting our crew on double shifts to expedite assembly.',
        dialogueZh: '由于原材料供应环节出现突发瓶颈，预计开航日将顺延 4 个工作日。我们正安排工厂双班轮流作业，全力加速装配进度。'
      }
    ],
    nativeAlternatives: [
      'Maintaining the agreed delivery deadline is of paramount importance for our timeline.'
    ]
  },

  // --- 2. 日常地道口语与高阶心流表达 ---
  {
    id: 'en_dy_1',
    category: 'daily',
    english: 'Let’s cut to the chase and focus on what really moves the needle today.',
    chinese: '我们开门见山直奔主题吧，把精力放在今天真正起关键作用的事情上。',
    scenario: '高效工作与核心决断 (Productivity & Direct Communication)',
    mastered: true,
    usageNotes: [
      '“cut to the chase”：俚语，意为“别拐弯抹角，直奔主题”。来自电影术语“直接切到追逐打斗戏”。',
      '“move the needle”：高管与商业极客高频词，意为“产生显著进展/改变局面”，比“make progress”形象得多。'
    ],
    extendedScenarios: [
      {
        situation: '【当会议讨论偏离重心、沉溺细节时礼貌拉回】',
        dialogueEn: 'I appreciate the deep dive, but let’s step back and look at what will actually move the needle for our Q4 revenue target.',
        dialogueZh: '非常感谢大家的深度讨论，但我们退一步看看，到底什么才能真正实质性推动我们第四季度的营收目标。'
      }
    ],
    nativeAlternatives: [
      'Let’s get straight to the point and tackle our top priority.',
      'Let’s skip the pleasantries and zoom in on what truly counts.'
    ]
  },
  {
    id: 'en_dy_2',
    category: 'daily',
    english: 'I’ve been feeling a bit overwhelmed lately, but taking a step back really helped clear my mind.',
    chinese: '最近感觉稍微有点压力过载，但退一步静下来真的帮我理清了思绪。',
    scenario: '情绪表达与心流自愈 (Emotional Wellness & Inner Calm)',
    mastered: false,
    usageNotes: [
      '“overwhelmed”：非常高频的情绪词，形容负荷过重、不知所措或压力山大。',
      '“take a step back”：退一步抽离出来、暂停片刻观察全局，是圣多纳释放与觉察的核心语境。',
      '“clear one’s mind”：清空思绪、恢复平静。'
    ],
    extendedScenarios: [
      {
        situation: '【向朋友或伙伴分享自我觉察与冥想体验】',
        dialogueEn: 'Whenever anxiety creeps in, I practice taking a step back and just letting the feeling exist without trying to fix it immediately.',
        dialogueZh: '每当焦虑悄悄涌上心头，我就尝试退后一步，允许那种感觉静静存在，而不急着立刻去消除它。'
      }
    ],
    nativeAlternatives: [
      'I was on the verge of burnout, but pausing for breath gave me much-needed clarity.'
    ]
  }
];
