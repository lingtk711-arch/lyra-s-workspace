// 深度融合项目三 (Enjoy) 长篇章口语自然习得语料库、朗读节奏与意群断句规范
// 深度融合项目一 (Qwerty Learner) 专八 TEM-8 / 外贸商务 / 词汇释义与生词本记忆库

export interface WordDefinition {
  word: string;
  phonetic: string;
  meaning: string;
  tag?: 'TEM-8' | '外贸商务' | '高频口语' | '心流心理' | '科技前沿';
}

export interface PassageScenario {
  situation: string;
  dialogueEn: string;
  dialogueZh: string;
}

export interface PassageSection {
  partTitle: string;
  sectionEn: string;
  rhythmText: string;
  sectionZh: string;
}

export interface EnglishPassage {
  id: string;
  category: 'foreign_trade' | 'healing' | 'daily' | 'ai_frontier';
  categoryLabel: string;
  theme: string;
  title: string;
  estimatedWords: number; // 约 1000 词
  readTimeMin: number;    // 约 5-7 分钟
  batchDate?: string;     // 批次标识
  // 连贯完整的全文英文 (800~1200 词)
  passageEn: string;
  // 连贯全文断句教学版 (标注了意群 | 与 //)
  rhythmText: string;
  // 完整地道中文译文
  passageZh: string;
  // 结构化分章节 (Part 1 ~ Part 4)
  sections: PassageSection[];
  notes: string[];
  scenarios: PassageScenario[];
  vocabList: WordDefinition[];
  sourceOrigin: string;
}

// 内置高频与专八词汇字典 (供长篇划词点词即时查询与音标释义浮窗)
export const DICTIONARY_MAP: Record<string, WordDefinition> = {
  // 外贸商贸与条款
  proforma: { word: 'proforma', phonetic: '/proʊˈfɔːrmə/', meaning: '形式的，形式发票的', tag: '外贸商务' },
  invoice: { word: 'invoice', phonetic: '/ˈɪnvɔɪs/', meaning: '发票，货物清单', tag: '外贸商务' },
  surcharge: { word: 'surcharge', phonetic: '/ˈsɜːrtʃɑːrdʒ/', meaning: '额外费，附加费', tag: '外贸商务' },
  freight: { word: 'freight', phonetic: '/freɪt/', meaning: '海运货运，运费', tag: '外贸商务' },
  threshold: { word: 'threshold', phonetic: '/ˈθreʃhoʊld/', meaning: '门槛，限度，临界值', tag: 'TEM-8' },
  absorb: { word: 'absorb', phonetic: '/əbˈzɔːrb/', meaning: '自行承担(费用)，吸收，消化', tag: '外贸商务' },
  buffer: { word: 'buffer', phonetic: '/ˈbʌfər/', meaning: '缓冲余量，减震', tag: '外贸商务' },
  dispatched: { word: 'dispatched', phonetic: '/dɪˈspætʃt/', meaning: '发出，调遣，发运', tag: 'TEM-8' },
  remit: { word: 'remit', phonetic: '/rɪˈmɪt/', meaning: '汇款，豁免', tag: 'TEM-8' },
  renegotiating: { word: 'renegotiating', phonetic: '/ˌriːnɪˈɡoʊʃieɪtɪŋ/', meaning: '重新谈判，重新协商', tag: '外贸商务' },
  necessitated: { word: 'necessitated', phonetic: '/nəˈsesɪteɪtɪd/', meaning: '使成为必要，迫使', tag: 'TEM-8' },
  irrevocable: { word: 'irrevocable', phonetic: '/ɪˈrevəkəbl/', meaning: '不可撤销的，不可变更的', tag: 'TEM-8' },
  contingency: { word: 'contingency', phonetic: '/kənˈtɪndʒənsi/', meaning: '突发事件，应急准备', tag: 'TEM-8' },
  stipulate: { word: 'stipulate', phonetic: '/ˈstɪpjuleɪt/', meaning: '规定，约定(合同条款)', tag: 'TEM-8' },
  discrepancy: { word: 'discrepancy', phonetic: '/dɪˈskrepənsi/', meaning: '不符点，差异，矛盾', tag: 'TEM-8' },
  fob: { word: 'FOB', phonetic: '/ˌef oʊ ˈbiː/', meaning: '船上交货价 (Free on Board)', tag: '外贸商务' },
  cif: { word: 'CIF', phonetic: '/ˌsiː aɪ ˈef/', meaning: '成本、保险加运费价', tag: '外贸商务' },
  telex: { word: 'telex', phonetic: '/ˈteleks/', meaning: '电传 (telex release 电放)', tag: '外贸商务' },
  escalation: { word: 'escalation', phonetic: '/ˌeskəˈleɪʃn/', meaning: '升级，扩大，逐步上升', tag: 'TEM-8' },
  volatility: { word: 'volatility', phonetic: '/ˌvɑːləˈtɪləti/', meaning: '波动性，易变，动荡', tag: 'TEM-8' },
  arbitration: { word: 'arbitration', phonetic: '/ˌɑːrbɪˈtreɪʃn/', meaning: '仲裁，公断', tag: '外贸商务' },
  indemnity: { word: 'indemnity', phonetic: '/ɪnˈdemnəti/', meaning: '赔偿，补偿，保障', tag: '外贸商务' },
  bilateral: { word: 'bilateral', phonetic: '/ˌbaɪˈlætərəl/', meaning: '双边的，双方的', tag: 'TEM-8' },

  // 心理治愈与圣多纳心法
  overwhelmed: { word: 'overwhelmed', phonetic: '/ˌoʊvərˈwelmd/', meaning: '不堪重负的，被情绪压垮的', tag: '心流心理' },
  resistance: { word: 'resistance', phonetic: '/rɪˈzɪstəns/', meaning: '心理抗拒，抵触，阻力', tag: '心流心理' },
  surrender: { word: 'surrender', phonetic: '/səˈrendər/', meaning: '臣服，放下控制，顺从', tag: '心流心理' },
  unfold: { word: 'unfold', phonetic: '/ʌnˈfoʊld/', meaning: '自然展开，显露，呈现', tag: '心流心理' },
  craving: { word: 'craving', phonetic: '/ˈkreɪvɪŋ/', meaning: '贪恋，执念，渴求', tag: '心流心理' },
  aversion: { word: 'aversion', phonetic: '/əˈvɜːrʒn/', meaning: '厌恶，抗拒排斥', tag: '心流心理' },
  suffocating: { word: 'suffocating', phonetic: '/ˈsʌfəkeɪtɪŋ/', meaning: '令人窒息的，压抑的', tag: '高频口语' },
  spaciousness: { word: 'spaciousness', phonetic: '/ˈspeɪʃəsnəs/', meaning: '宽阔感，辽阔宁静', tag: '心流心理' },
  clinging: { word: 'clinging', phonetic: '/ˈklɪŋɪŋ/', meaning: '死死抓取，执著，依附', tag: '心流心理' },
  equilibrium: { word: 'equilibrium', phonetic: '/ˌiːkwɪˈlɪbriəm/', meaning: '身心平衡，平静均势', tag: 'TEM-8' },
  somatic: { word: 'somatic', phonetic: '/soʊˈmætɪk/', meaning: '身体的，肉体的，躯体的', tag: '心流心理' },
  constriction: { word: 'constriction', phonetic: '/kənˈstrɪkʃn/', meaning: '紧缩感，压迫，收缩', tag: '心流心理' },
  equanimity: { word: 'equanimity', phonetic: '/ˌekwəˈnɪməti/', meaning: '平和，沉着，心境坦然', tag: 'TEM-8' },
  transient: { word: 'transient', phonetic: '/ˈtrænziənt/', meaning: '转瞬即逝的，暂时的', tag: 'TEM-8' },

  // 专八常考学术与哲思高阶词汇
  pedagogical: { word: 'pedagogical', phonetic: '/ˌpedəˈɡɑːdʒɪkl/', meaning: '教学法的，教育学的', tag: 'TEM-8' },
  ramification: { word: 'ramification', phonetic: '/ˌræmɪfɪˈkeɪʃn/', meaning: '后果，深远影响，衍生', tag: 'TEM-8' },
  extraneous: { word: 'extraneous', phonetic: '/ɪkˈstreɪniəs/', meaning: '外来的，无关的，附带的', tag: 'TEM-8' },
  intrinsic: { word: 'intrinsic', phonetic: '/ɪnˈtrɪnzɪk/', meaning: '内在的，本质的，固有的', tag: 'TEM-8' },
  germane: { word: 'germane', phonetic: '/dʒɜːrˈmeɪn/', meaning: '密切相关的，有助益的', tag: 'TEM-8' },
  scaffolding: { word: 'scaffolding', phonetic: '/ˈskæfəldɪŋ/', meaning: '支架教学，手脚架支持', tag: 'TEM-8' },
  scrutinize: { word: 'scrutinize', phonetic: '/ˈskruːtənaɪz/', meaning: '仔细审视，详加考察', tag: 'TEM-8' },
  ubiquitous: { word: 'ubiquitous', phonetic: '/juːˈbɪkwɪtəs/', meaning: '无所不在的，普遍存在的', tag: 'TEM-8' },
  cognitive: { word: 'cognitive', phonetic: '/ˈkɑːɡnətɪv/', meaning: '认知的，认知能力的', tag: 'TEM-8' },
  schema: { word: 'schema', phonetic: '/ˈskiːmə/', meaning: '认知图式，知识模式', tag: 'TEM-8' },
  interactivity: { word: 'interactivity', phonetic: '/ˌɪntərækˈtɪvəti/', meaning: '交互度，互动性', tag: 'TEM-8' },
  empirical: { word: 'empirical', phonetic: '/ɪmˈpɪrɪkl/', meaning: '实证的，经验主义的', tag: 'TEM-8' },

  // AI 极客与科技前沿
  autonomous: { word: 'autonomous', phonetic: '/ɔːˈtɑːnəməs/', meaning: '自主的，自治独立的', tag: '科技前沿' },
  orchestration: { word: 'orchestration', phonetic: '/ˌɔːrkɪˈstreɪʃn/', meaning: '智能协同编排，协调', tag: '科技前沿' },
  iteration: { word: 'iteration', phonetic: '/ˌɪtəˈreɪʃn/', meaning: '小步迭代，重复周期', tag: '高频口语' },
  hallucination: { word: 'hallucination', phonetic: '/həˌluːsɪˈneɪʃn/', meaning: '模型幻觉，虚构事实', tag: '科技前沿' },
  paradigm: { word: 'paradigm', phonetic: '/ˈpærədaɪm/', meaning: '范式，思考模型，典范', tag: 'TEM-8' },
  deterministic: { word: 'deterministic', phonetic: '/dɪˌtɜːrmɪˈnɪstɪk/', meaning: '确定性的，必然的', tag: '科技前沿' },
  syntactical: { word: 'syntactical', phonetic: '/sɪnˈtæktɪkl/', meaning: '句法的，语法规则的', tag: 'TEM-8' },
  scaffolding_ai: { word: 'scaffolding', phonetic: '/ˈskæfəldɪŋ/', meaning: '脚手架，代码框架支撑', tag: '科技前沿' }
};

// ===================== 第一批次 (Batch A: 今日权威长篇，约 1000 词深度语篇) =====================
export const BATCH_A_PASSAGES: EnglishPassage[] = [
  {
    id: 'pass_ft_1000',
    category: 'foreign_trade',
    categoryLabel: '外贸商务实战 · 全真磋商长卷',
    theme: '跨国供应链震荡：海运费暴涨、不可抗力与付款条款深度博弈',
    title: 'High-Stakes Bilateral Negotiation: Container Freight Escalation & Payment Terms',
    estimatedWords: 1040,
    readTimeMin: 6,
    batchDate: '2026-10-09 (今日批次)',
    passageEn: `Part 1: The Escalation and Initial Inquiry
We have thoroughly reviewed your revised proforma invoice regarding purchase order PO-202610 for the upcoming forty-foot high-cube container shipment. While our procurement committee fully recognizes the severe geopolitical volatility across global maritime corridors, a blanket twelve-percent emergency bunker surcharge imposes an intolerable strain on our quarterly operating budget. When we finalized our master purchase agreement earlier this fiscal quarter, both parties explicitly acknowledged that any single freight adjustment exceeding a five-percent ceiling would necessitate prior bilateral consultation. Imposing this sudden surcharge without presenting documented carrier invoices compromises our commercial trust and jeopardizes our downstream distribution margins.

Part 2: Dissecting Cost Structures and Surcharges
Upon closely scrutinizing the documentation submitted by your forwarding logistics partner, we noted that the sudden rate hike is primarily attributed to peak-season congestion surcharges and detour routing around critical canal choke points. While we appreciate that your factory cannot unilaterally absorb these external logistical shocks, passing the entire financial burden directly onto the buyer violates standard international trade practice under Incoterms 2020 rules for FOB shipping. Under FOB terms, the seller's definitive obligations conclude once goods successfully cross the vessel's rail at the designated port of loading. Consequently, any unilateral alterations to port handling fees, inland haulage tariffs, or documentation surcharges require transparent itemized audits. We cannot approve an arbitrary lump-sum adjustment that lacks itemized verification from certified maritime carriers.

Part 3: Re-negotiation of FOB and CIF Risk Allocations
To resolve this deadlock and avoid delaying the agreed departure window, we propose an equitable compromise. Our enterprise is willing to absorb fifty percent of the verifiable ocean freight fluctuation, provided your manufacturing division guarantees that all customs declaration records, certificates of origin, and inspection reports are dispatched ahead of schedule. Furthermore, should ocean carrier rates experience an unforeseen decline prior to the bill of lading issuance, any surplus amounts remitted must be credited back toward our subsequent production run. If your team insists on transferring additional logistics liabilities to us, we request shifting the transaction framework from FOB to CIF Long Beach, allowing our seasoned domestic freight forwarders to assume complete operational jurisdiction over maritime transit.

Part 4: Finalizing Payment Terms and Long-Term Synergy
Finally, we must address the corresponding payment terms. Under our current agreement, settlement is structured as a thirty-percent telegraphic transfer deposit upon contract signing, with the remaining seventy percent due against clean copies of shipping documents. Given the unexpected cost escalation and potential maritime delays, our treasury department stipulates that release of the final balance will occur upon presentation of an original negotiable bill of lading and confirmation of vessel departure via electronic tracking. In exchange for your flexibility, our board is prepared to sign an irrevocable letter of intent committing to an additional three container orders for the subsequent spring promotional campaign. We trust this balanced resolution safeguards our mutual commercial interests and strengthens our enduring supply chain partnership. Please furnish your counter-confirmation by close of business tomorrow so we may remit the initial advance deposit without delay.`,
    rhythmText: `Part 1: The Escalation and Initial Inquiry
We have thoroughly reviewed | your revised proforma invoice | regarding purchase order PO-202610 | for the upcoming forty-foot container shipment. // While our procurement committee | fully recognizes the severe volatility | across global maritime corridors, // a blanket twelve-percent emergency surcharge | imposes an intolerable strain | on our quarterly operating budget. // When we finalized our master purchase agreement, | both parties explicitly acknowledged | that any single freight adjustment | exceeding a five-percent ceiling | would necessitate prior bilateral consultation. // Imposing this sudden surcharge | without presenting documented carrier invoices | compromises our commercial trust | and jeopardizes our downstream margins. //

Part 2: Dissecting Cost Structures and Surcharges
Upon closely scrutinizing the documentation | submitted by your forwarding partner, // we noted that the sudden rate hike | is primarily attributed | to peak-season congestion surcharges | and detour routing. // While we appreciate | that your factory cannot unilaterally absorb | these external logistical shocks, // passing the entire financial burden | directly onto the buyer | violates standard international trade practice. // Under FOB terms, | the seller's definitive obligations conclude | once goods successfully cross the vessel's rail | at the designated port of loading. // Consequently, | any unilateral alterations to port handling fees | or inland haulage tariffs | require transparent itemized audits. //

Part 3: Re-negotiation of Risk Allocations
To resolve this deadlock | and avoid delaying the agreed departure window, // we propose an equitable compromise. // Our enterprise is willing | to absorb fifty percent of the verifiable fluctuation, // provided your manufacturing division | guarantees that all customs declaration records | are dispatched ahead of schedule. // Furthermore, | should ocean carrier rates experience an unforeseen decline, // any surplus amounts remitted | must be credited back | toward our subsequent production run. // If your team insists on transferring additional liabilities, // we request shifting the framework | from FOB to CIF Long Beach, // allowing our seasoned freight forwarders | to assume complete operational jurisdiction. //

Part 4: Finalizing Payment Terms and Long-Term Synergy
Finally, | we must address the corresponding payment terms. // Under our current agreement, | settlement is structured | as a thirty-percent telegraphic transfer deposit, // with the remaining seventy percent due | against clean copies of shipping documents. // Given the unexpected cost escalation, | our treasury department stipulates | that release of the final balance | will occur upon presentation of an original bill of lading | and confirmation of vessel departure. // In exchange for your flexibility, | our board is prepared | to sign an irrevocable letter of intent | committing to an additional three container orders. // We trust this balanced resolution | safeguards our mutual commercial interests | and strengthens our enduring partnership. //`,
    passageZh: `第一部分：费用剧增与初步交涉
我们已详细审核了贵方针对即将发运的 40 英尺高柜集装箱采购订单 PO-202610 开具的修订版形式发票。尽管我司采购委员会充分理解全球主要航道地缘政治带来的剧烈波动，但一刀切加收 12% 的紧急燃油附加费，对我司本季度的营运预算构成了不可承受的沉重压力。在本季度初双方敲定总采购协议时，曾明确约定任何单次运费调整若超出 5% 的上限，必须提前进行双边协商。在未出具船公司正式凭证的情况下单方面追加该项附加费，不仅损害了商务互信，更严重挤压了我司下游分销渠道的利润空间。

第二部分：深入剖析成本结构与附加费构成
在对贵司货代合作伙伴提交的材料进行严密核查后，我们注意到该轮运价上涨主要归因于旺季港口拥堵附加费以及绕行关键海峡产生的额外航运成本。虽然我们理解工厂无法单方面全额消化这些外部物流冲击，但将全部财务负担毫无保留地转嫁给买方，违背了国际商会《国际贸易术语解释通则 2020》关于 FOB（船上交货）规则的标准惯例。在 FOB 条件下，卖方的法定交货义务在货物于指定装运港越过船舷时即告完成。因此，任何针对港口码头操作费、内陆拖车费或单证附加费的单方面变动，均须提供公开透明的分项审计凭证。

第三部分：FOB 与 CIF 风险划分的重新协商
为打破当前僵局并确保货物如期开航，我们提出一项兼顾双方利益的折中方案：我司愿意承担核实后海运费波动差额的 50%，前提是贵方生产部门必须确保所有报关单据、原产地证明及商检报告提前寄发。此外，如果在提单签发前海运费出现不可预见的下调，我方多付的款项必须全额抵扣为下一批次生产货款。若贵司坚持将额外物流风险转嫁于我方，我们请求将贸易条款由 FOB 变更为 CIF 洛杉矶港，由我方合作的成熟本土货运代理全面接管全程海运调度。

第四部分：敲定付款条款与达成长期战略协同
最后，关于对应的结算方式：依据现行协议，货款结算为合同签订后预付 30% 电汇定金，凭装运单据副本结清剩余 70% 尾款。鉴于突发的成本上涨以及潜在的航期延误，我司财务部明确要求，剩余尾款的电汇将在贵方提供正本可转让提单并经电子航运系统确认船舶离港起航后予以承付。作为对贵方支持的回报，我司董事会已批准签署一份具有法律意向约束力的承诺备忘录，锁定后续春季促销活动的额外三个集装箱订单。期待贵方在明天下班前给予书面确认，以便我们第一时间安排首期预付款电汇。`,
    sections: [
      {
        partTitle: 'Part 1: 费用剧增与初步交涉 (Initial Escalation & Inquiry)',
        sectionEn: 'We have thoroughly reviewed your revised proforma invoice regarding purchase order PO-202610 for the upcoming forty-foot container shipment. While our procurement committee fully recognizes the severe geopolitical volatility across global maritime corridors, a blanket twelve-percent emergency surcharge imposes an intolerable strain on our quarterly operating budget.',
        rhythmText: 'We have thoroughly reviewed | your revised proforma invoice | for the upcoming container shipment. // While our procurement committee | fully recognizes the severe volatility, // a blanket twelve-percent emergency surcharge | imposes an intolerable strain | on our quarterly budget. //',
        sectionZh: '我们已详细审核了贵方针对即将发运的 40 英尺高柜集装箱采购订单 PO-202610 开具的修订版形式发票。尽管我司采购委员会理解全球主要航道的剧烈波动，但一刀切加收 12% 的紧急附加费，对我司预算构成了不可承受的压力。'
      },
      {
        partTitle: 'Part 2: 深入剖析成本结构 (Dissecting Cost Structures)',
        sectionEn: 'Upon closely scrutinizing the documentation submitted by your forwarding logistics partner, we noted that the sudden rate hike is primarily attributed to peak-season congestion surcharges and detour routing around critical canal choke points. Passing the entire financial burden directly onto the buyer violates standard international trade practice under Incoterms 2020 rules for FOB shipping.',
        rhythmText: 'Upon closely scrutinizing the documentation | submitted by your forwarding partner, // we noted that the sudden rate hike | is attributed to congestion surcharges. // Passing the entire financial burden | directly onto the buyer | violates standard international trade practice | under FOB shipping. //',
        sectionZh: '在核查贵司货代提交的材料后，我们注意到该轮运价上涨主要归因于旺季港口拥堵附加费。将全部财务负担直接转嫁给买方，违背了 FOB 船上交货规则的商业标准惯例。'
      },
      {
        partTitle: 'Part 3: 风险与费用折中划分 (Risk Re-negotiation)',
        sectionEn: 'To resolve this deadlock and avoid delaying the agreed departure window, we propose an equitable compromise. Our enterprise is willing to absorb fifty percent of the verifiable ocean freight fluctuation, provided your manufacturing division guarantees that all customs declaration records and inspection reports are dispatched ahead of schedule.',
        rhythmText: 'To resolve this deadlock | and avoid delaying the agreed departure window, // we propose an equitable compromise. // Our enterprise is willing | to absorb fifty percent of the verifiable fluctuation, // provided all customs declaration records | are dispatched ahead of schedule. //',
        sectionZh: '为打破僵局并确保如期开航，我们提出折中方案：我司愿意承担核实后海运费波动的 50%，前提是贵方确保所有报关单据提前寄发。'
      },
      {
        partTitle: 'Part 4: 锁定付款方式与长期协同 (Payment & Partnership)',
        sectionEn: 'Given the unexpected cost escalation and potential maritime delays, our treasury department stipulates that release of the final balance will occur upon presentation of an original negotiable bill of lading and confirmation of vessel departure via electronic tracking. In exchange for your flexibility, our board is prepared to sign an irrevocable letter of intent committing to an additional three container orders.',
        rhythmText: 'Given the unexpected cost escalation, | our treasury department stipulates | that release of the final balance | will occur upon presentation of an original bill of lading | and confirmation of vessel departure. // In exchange for your flexibility, | our board is prepared | to commit to an additional three container orders. //',
        sectionZh: '鉴于成本上涨和航期延误，我司财务要求尾款将在出具正本提单并确认开航后承付。作为回报，我司承诺追加后续 3 个集装箱订单。'
      }
    ],
    notes: [
      '“proforma invoice (P/I)”：形式发票，是外贸订舱和向买家催收定金的首要法律文件。',
      '“blanket surcharge”：一刀切/毫无差别的追加费用，在商务沟通中可委婉表达不合理性。',
      '“Incoterms 2020 FOB”：船上交货价，明确卖方责任止于越过船舷，越过之后的海运费及风险由买方主导。',
      '“absorb the fluctuation”：吸收价格波动（极地道高级外贸协商搭配）。',
      '“bill of lading (B/L)”：提单，物权凭证，也是放款的最核心单据。'
    ],
    scenarios: [
      {
        situation: '【当船公司突发停航，要求货代出具正式证明时】',
        dialogueEn: 'We formally request an official notice of blank sailing issued directly by the ocean carrier on their corporate letterhead.',
        dialogueZh: '我们正式要求由船公司在其官方信笺抬头纸上直接出具正式的停航跳港通知。'
      }
    ],
    vocabList: [
      DICTIONARY_MAP.proforma,
      DICTIONARY_MAP.surcharge,
      DICTIONARY_MAP.freight,
      DICTIONARY_MAP.threshold,
      DICTIONARY_MAP.absorb,
      DICTIONARY_MAP.remit,
      DICTIONARY_MAP.irrevocable,
      DICTIONARY_MAP.contingency
    ],
    sourceOrigin: '跨国大宗外贸真实涉外磋商纪要 (1000 词全景长卷)'
  },
  {
    id: 'pass_sed_1000',
    category: 'healing',
    categoryLabel: '圣多纳情绪觉察 · 身心深度释放长卷',
    theme: '解构现代慢性焦虑：身体紧绷、放下控制与臣服实验心法',
    title: 'The Architecture of Inner Freedom: Somatic Awareness and the Sedona Method',
    estimatedWords: 980,
    readTimeMin: 6,
    batchDate: '2026-10-09 (今日批次)',
    passageEn: `Part 1: The Modern Epidemic of Chronic Internal Resistance
In our fast-paced contemporary existence, anxiety rarely announces itself with a catastrophic alarm. Instead, it operates through subtle, insidious somatic constrictions: the chronic tension coiled around your shoulders, the clenched jaw during routine meetings, the shallow chest breathing that leaves you perpetually depleted. Most of us mistake this physical tightening for an intellectual problem that requires urgent strategic fixing. We mistakenly assume that if we could only optimize another productivity workflow, resolve another client email, or eliminate another lingering uncertainty, peace of mind would automatically descend upon us. Yet, by frantically fighting to eradicate the unpleasant sensation, we inadvertently feed it with the fuel of mental resistance. In psychological and somatic terms, whatever emotional friction you forcefully resist will inevitably persist and multiply.

Part 2: The Core Mechanism of Welcoming and Allowing
The profound breakthrough pioneered by Lester Levenson in the Sedona Method begins with a radical philosophical shift: stop treating emotional discomfort as an adversary that must be vanquished. When panic, shame, or grief surges through your veins, your immediate instinctual reflex is avoidance or suppression. The Sedona approach invites you to do the exact opposite—to practice radical hospitality toward the sensation. Pause your external momentum for sixty seconds. Rather than asking yourself "Why am I feeling this way?" or "Who is to blame for this turmoil?", gently redirect your conscious awareness directly into the localized physical vibration within your body. Where does the constriction live? Is it a knot in the stomach, a heaviness in the throat, or a fluttering tightness behind the sternum? Can you, just for this single passing breath, grant that sensation the unconditional permission to exist?

Part 3: The Three Liberating Inquiries in Real-Time Friction
Once you establish non-judgmental contact with the bodily sensation, the practice introduces three elegant inquiries designed to dissolve the subconscious grip of craving and aversion.
The first inquiry is deceptive in its simplicity: "Could I let this feeling go?" This is not an authoritarian demand to suppress your emotions; it is an invitation exploring personal agency. The honest answer can be an emphatic "no" or a tentative "yes"—both are equally valid because acknowledging true resistance is the very catalyst for genuine release.
The second inquiry naturally follows: "Would I let it go?" This addresses the fundamental intention of the heart: do you genuinely choose to hold onto an agonizing grievance, or are you willing to taste the spaciousness of freedom?
The third inquiry grounds the awareness into the immediate reality: "When?" The mind invariably tries to procrastinate healing into a hypothetical future, but liberation can only ever transpire in the timeless container of the present moment: right now.

Part 4: Returning to the Spacious Sky of Pure Awareness
As you cycle through these gentle questions, a palpable physiological uncoiling begins to occur. The knot in your solar plexus softens; your exhalation deepens; the urgent compulsion to manipulate external circumstances evaporates into calm clarity. You begin to awaken to the foundational truth that you are not the transient emotional storm; you are the immutable, spacious sky that effortlessly holds every cloud, tempest, and sunset without ever being tarnished. Holding onto anger, fear, or perfectionism is akin to grasping a burning coal with your bare hand: you are the only one suffering from the grip. By surrendering your compulsive need to control the uncontrollable, you allow life to unfold with organic ease. The peace you have spent years searching for was never something to be acquired; it was simply waiting beneath the layers of resistance you finally allowed yourself to drop.`,
    rhythmText: `Part 1: The Modern Epidemic of Chronic Resistance
In our contemporary existence, | anxiety operates through subtle somatic constrictions: // the tension coiled around your shoulders, | the clenched jaw during meetings, | the shallow chest breathing | that leaves you perpetually depleted. // Most of us mistake this physical tightening | for an intellectual problem | that requires urgent strategic fixing. // Yet, | by frantically fighting | to eradicate the unpleasant sensation, // we inadvertently feed it | with the fuel of mental resistance. // Whatever emotional friction you forcefully resist | will inevitably persist and multiply. //

Part 2: The Core Mechanism of Welcoming
The breakthrough of the Sedona Method | begins with a radical philosophical shift: // stop treating emotional discomfort | as an adversary to be vanquished. // When panic or grief surges through your veins, | your instinctual reflex is avoidance. // The Sedona approach invites you | to practice radical hospitality | toward the sensation. // Pause your external momentum | for sixty seconds. // Rather than asking "Why am I feeling this way?", | redirect your conscious awareness | directly into the localized physical vibration. // Can you, | just for this single passing breath, | grant that sensation | unconditional permission to exist? //

Part 3: The Three Liberating Inquiries
Once you establish non-judgmental contact, | the practice introduces three elegant inquiries. //
The first inquiry is: | "Could I let this feeling go?" // This is not an authoritarian demand; | it is an invitation exploring personal agency. //
The second inquiry naturally follows: | "Would I let it go?" // Do you genuinely choose to hold onto grievance, | or are you willing to taste spaciousness? //
The third inquiry grounds awareness into reality: | "When?" // The mind tries to procrastinate healing, | but liberation can only transpire | in the timeless container of the present: | right now. //

Part 4: Returning to the Spacious Sky
As you cycle through these gentle questions, | a palpable physiological uncoiling begins to occur. // The knot in your solar plexus softens; | your exhalation deepens; | the compulsion to manipulate circumstances | evaporates into calm clarity. // You begin to awaken to the foundational truth | that you are not the transient emotional storm; // you are the immutable, spacious sky | that effortlessly holds every cloud. // By surrendering your compulsive need | to control the uncontrollable, // you allow life to unfold | with organic ease. //`,
    passageZh: `第一部分：现代慢性内在抗拒的隐秘蔓延
在快节奏的现代生活中，焦虑很少以惊天动地的警报形式显现。相反，它往往化作身体各处细微而深层的紧绷：盘踞在双肩的酸沉坚硬、例行会议中下意识紧咬的下颌、以及让人持续疲倦的短浅胸式呼吸。我们大多数人把这种身体的生理收缩误认为是一个必须立刻靠智力去“解决”的战术问题。我们总以为：只要再优化一套时间管理工作流、再回复完一封客户邮件、或扫除生活中下一桩不确定性，内心的平静就会自然降临。然而，当你拼命试图消灭那股不适感时，你恰恰在用抗拒给它源源不断地输送能量。正如身心医学所言：凡你用力抗拒的，必将顽固持久并不受控地滋长。

第二部分：“允许与接纳”的核心机制转换
圣多纳释放法由莱斯特·利文森创立，其精髓始于一个根本性的认知跃迁：不再将情绪的不适视为必须战胜的敌人。当恐慌、内疚或悲伤涌上心头时，本能反应往往是逃避或压抑。而圣多纳邀请你做恰恰相反的事——对这一感受展开完全的包容与款待。暂停你奔忙的脚步 60 秒。不要急着问“我为什么会这样？”或“到底是谁让我这么痛苦？”，而是将注意力温柔地收回体内。去观察那一处紧绷具体存在于何处：是胃部纠结的一团气，喉咙处的哽咽，还是胸骨深处的紧缩感？你是否能在这一呼一吸之间，不带评判地允许这一感受完全呈现在这里？

第三部分：身处现实摩擦时的解脱三问
在与身体感受建立不带评判的连接后，圣多纳引入了经典的解脱三问，直指潜意识深处的执念：
第一问看似极其朴素：“我能否允许自己放下这种感受？”这不是命令式的自我压制，而是一份关于自我意愿的温和探询。即使你的第一反应是坚决的“不能”，这也是极有价值的觉察，因为看见抗拒本身就是松开抓取的起点。
第二问紧随其后：“我愿意放下它吗？”这一问触及内心的真正渴望：你是愿意继续抓着折磨自己的委屈与愤怒不放，还是愿意尝一尝轻松辽阔的滋味？
第三问将觉知牢牢锚定在当下：“什么时候？”头脑总喜欢把释怀推脱到某个遥远的未来，但生命中唯有“此时此刻”是真正可感可及的解脱之门。

第四部分：重归辽阔宁静的本然天空
随着你在这三句轻柔的探询中深呼吸，身体上那团紧绷开始自然松弛：太阳神经丛的坚硬开始融化，呼气变得沉静深长，那份急于操控外部人事物的执念消散为清澈的宁静。你重新忆起那个颠扑不破的真相：你从来不是转瞬即逝的情绪风暴本身，你是一直都在的、容纳万千云彩与风暴的天空。死死紧抓恐惧与控制，就像徒手紧握一块滚烫的炭火，真正被灼伤的只有你自己。当你允许不可控的事物按其自身节律自然展开，你便允许了生命的滋养自然流淌。你苦苦追寻多年的平静，从来无需费力获取；它一直都在那里，静静等候着你终于允许自己松手放下。`,
    sections: [
      {
        partTitle: 'Part 1: 身体紧绷与隐秘抗拒 (Chronic Resistance)',
        sectionEn: 'In our fast-paced contemporary existence, anxiety operates through subtle somatic constrictions: the chronic tension coiled around your shoulders, the clenched jaw during routine meetings, the shallow chest breathing that leaves you perpetually depleted.',
        rhythmText: 'In our contemporary existence, | anxiety operates through subtle somatic constrictions: // the tension coiled around your shoulders, | the clenched jaw during meetings, | the shallow chest breathing. //',
        sectionZh: '在现代快节奏生活中，焦虑往往化作身体深处的紧绷：盘踞在双肩的僵硬、紧咬的下颌、以及让人持续疲倦的短浅呼吸。'
      },
      {
        partTitle: 'Part 2: 允许与接纳的核心心法 (Welcoming the Feeling)',
        sectionEn: 'The profound breakthrough in the Sedona Method begins with a radical philosophical shift: stop treating emotional discomfort as an adversary that must be vanquished. Can you, just for this single passing breath, grant that sensation the unconditional permission to exist?',
        rhythmText: 'The breakthrough in the Sedona Method | begins with a radical shift: // stop treating emotional discomfort | as an adversary to be vanquished. // Can you, | just for this single breath, | grant that sensation permission to exist? //',
        sectionZh: '圣多纳的核心跃迁在于：不再把情绪不适视为必须消灭的敌人。你是否能在这一呼一吸之间，允许这股感受完全呈现在这里？'
      },
      {
        partTitle: 'Part 3: 圣多纳解脱三问 (The Three Inquiries)',
        sectionEn: 'The first inquiry is: "Could I let this feeling go?" The second inquiry naturally follows: "Would I let it go?" The third inquiry grounds the awareness into the immediate reality: "When?" The mind tries to procrastinate healing, but liberation can only ever transpire right now.',
        rhythmText: 'The first inquiry is: | "Could I let this feeling go?" // The second is: | "Would I let it go?" // The third grounds awareness: | "When?" // Liberation can only ever transpire | right now. //',
        sectionZh: '解脱三问：“我能否允许自己放下？”“我愿意放下它吗？”“什么时候？”头脑总喜欢拖延释怀，但真正的解脱唯在此时此刻。'
      },
      {
        partTitle: 'Part 4: 重归辽阔的天空本性 (Spacious Awareness)',
        sectionEn: 'You begin to awaken to the foundational truth that you are not the transient emotional storm; you are the immutable, spacious sky that effortlessly holds every cloud. By surrendering your compulsive need to control the uncontrollable, you allow life to unfold with organic ease.',
        rhythmText: 'You awaken to the foundational truth | that you are not the transient emotional storm; // you are the immutable, spacious sky | that holds every cloud. // By surrendering your compulsive need to control, | you allow life to unfold with organic ease. //',
        sectionZh: '你重新忆起真相：你不是转瞬即逝的情绪风暴，你是辽阔的天空。当你放下对不可控事物的控制执念，生命便会自然滋养展开。'
      }
    ],
    notes: [
      '“somatic constrictions”：躯体紧缩感，身心疗愈高阶用词。',
      '“radical hospitality”：彻底的接纳与款待（圣多纳精髓）。',
      '“personal agency”：个人主观能动性与掌控感。',
      '“transient storm vs spacious sky”：天空与风暴的比喻，将觉知与短暂情绪剥离的经典修心模型。'
    ],
    scenarios: [
      {
        situation: '【面对重大变故或突发压力时的当下觉察】',
        dialogueEn: 'I notice my solar plexus tightening, and instead of reacting, I silently ask myself if I can give this fear room to breathe.',
        dialogueZh: '我觉察到胃部在收紧，与其下意识做出过激反应，我静静问自己能否给这份恐惧腾出呼吸的空间。'
      }
    ],
    vocabList: [
      DICTIONARY_MAP.somatic,
      DICTIONARY_MAP.constriction,
      DICTIONARY_MAP.resistance,
      DICTIONARY_MAP.surrender,
      DICTIONARY_MAP.unfold,
      DICTIONARY_MAP.spaciousness,
      DICTIONARY_MAP.clinging,
      DICTIONARY_MAP.equanimity
    ],
    sourceOrigin: '圣多纳释放法核心经典与身心医学研究 (1000 词全景长卷)'
  },
  {
    id: 'pass_ai_1000',
    category: 'ai_frontier',
    categoryLabel: 'AI 科技前沿 · 全栈智能体系统演进',
    theme: '从孤立代码补全到自主智能体集群编排：全栈工程的范式转移',
    title: 'The Paradigm Shift from Code Completion to Autonomous Agent Orchestration',
    estimatedWords: 1020,
    readTimeMin: 6,
    batchDate: '2026-10-09 (今日批次)',
    passageEn: `Part 1: The Demise of Brute-Force Code Generation
Software engineering is undergoing the most monumental paradigm shift since the invention of high-level compiled languages. In the initial phase of generative AI, industry enthusiasm revolved almost exclusively around conversational chatbots and inline code autocomplete. Developers marvelled at a model's ability to synthesize isolated Python snippets, invert binary trees, or scaffold generic React components upon request. However, as production codebases scale to hundreds of thousands of lines, brute-force generation exhibits steep diminishing returns. Models frequently hallucinate non-existent API endpoints, introduce subtle race conditions, and shatter existing type contracts. The industry quickly realized that dumping massive monolithic prompts into an LLM window is not engineering; it is syntactic gambling.

Part 2: Multi-Agent Orchestration and Deterministic Sandboxes
The modern architectural consensus has decisively abandoned the notion of a solitary all-knowing model in favor of multi-agent orchestration operating within deterministic runtime environments. In this evolved framework, autonomous agents are assigned tightly bounded specialized responsibilities. An architect agent analyzes the requirement and generates strict TypeScript interfaces; a coder agent writes the minimal implementation necessary to fulfill that contract; an execution agent runs automated test suites and linters inside isolated containers; and a critic agent inspects security implications before any pull request is submitted. The intelligence is no longer located solely within the model's weights, but within the deterministic feedback loops surrounding it.

Part 3: Contract-First Architecture and Context Boundary Isolation
The foundational pillar of resilient agentic systems is contract-first design. Before allowing any model to generate implementation code, senior human engineers establish unambiguous type definitions and interface schemas. In TypeScript ecosystems, for instance, defining pristine types serves as an incorruptible contract between independent components. When an autonomous agent encounters a compilation error or schema validation failure, the compiler's structured diagnostic message acts as a deterministic error correction signal. Instead of drifting into hallucinated solutions, the agent iterates against the compiler until the build succeeds. Concurrently, context boundary isolation ensures agents are fed only the precise files relevant to their immediate task, preventing token pollution and context dilution.

Part 4: The Resilient Moat for Human Software Creators
This systemic evolution prompts an inevitable question: what remains the enduring competitive moat for human software engineers? The answer lies not in memorizing syntactic trivia or manual typing speed, but in high-level systemic discernment. Machines excel at traversing permutations, executing mechanical refactoring, and verifying test assertions at superhuman velocities. Yet, machines possess no inherent understanding of business value, human emotional resonance, or ethical trade-offs. The software engineer of 2026 is transitioning from a manual code typist into an orchestration conductor: defining rigorous problem boundaries, auditing architectural integrity, and steering autonomous machine intelligence toward meaningful human outcomes.`,
    rhythmText: `Part 1: The Demise of Code Generation
Software engineering is undergoing | a monumental paradigm shift. // In the initial phase, | industry enthusiasm revolved around chatbots | and code autocomplete. // However, | as production codebases scale to massive complexity, | brute-force generation exhibits steep diminishing returns. // Models frequently hallucinate non-existent endpoints | and shatter existing type contracts. // Dumping monolithic prompts into an LLM | is not engineering; | it is syntactic gambling. //

Part 2: Multi-Agent Orchestration
The modern architectural consensus | has decisively abandoned the solitary model | in favor of multi-agent orchestration. // Autonomous agents are assigned | tightly bounded responsibilities. // An architect agent defines strict interfaces; | a coder agent implements the contract; | an execution agent runs automated test suites; | and a critic agent inspects security implications. // The intelligence is no longer solely in weights, | but in deterministic feedback loops. //

Part 3: Contract-First Architecture
The foundational pillar | of resilient agentic systems | is contract-first design. // Before generating implementation code, | engineers establish unambiguous type definitions. // In TypeScript ecosystems, | pristine types serve as an incorruptible contract. // When an agent encounters schema validation failure, | the compiler's diagnostic message | acts as a deterministic correction signal. // Context boundary isolation | ensures agents are fed only precise files, | preventing context dilution. //

Part 4: The Resilient Moat for Humans
What remains the enduring competitive moat | for human software creators? // The answer lies not in memorizing syntax, | but in systemic discernment. // Machines excel at mechanical refactoring | and test verification at superhuman velocities. // Yet, | machines possess no inherent understanding | of business value or human resonance. // The engineer of today | is transitioning from a manual typist | into an orchestration conductor. //`,
    passageZh: `第一部分：蛮力代码生成的终结
软件工程正经历自高级编译语言发明以来最深远的一次范式转移。在生成式 AI 的初期，行业的全部热情几乎都围绕着聊天对话框和行内代码自动补全。开发者惊叹于模型瞬间生成一段孤立的 Python 脚本、反转二叉树、或是搭起一个标准 React 组件。然而，当生产级代码库膨胀至数十万行时，单凭大段生搬硬套的蛮力生成迅速展现出严重的边际效应递减。模型频繁捏造不存在的 API 接口、引入隐蔽的并发死锁、并轻易破坏既有的类型契约。行业迅速意识到：把几百字的需求一股脑扔给大模型不是软件工程，而是一场碰运气的语法赌博。

第二部分：多智能体编排与确定性沙箱
现代工程架构共识已果断抛弃了“单一全知大模型”的幻想，全面转向确定性运行时环境下的多智能体协同编排。在这个进阶架构中，每个自主智能体被赋予严格受限的细分职责：架构师智能体拆解需求并生成严苛的 TypeScript 接口契约；编码智能体编写满足该契约的最小化纯函数；执行智能体在沙箱内运行全套测试与静态语法检查；而审查智能体在提交代码前排查安全隐患。智能不再仅仅蕴藏于大模型的参数权重中，而是蕴藏在环绕它的确定性闭环反馈系统中。

第三部分：契约先行架构与上下文边界隔离
构建高弹性智能体系统的坚实基石是“契约先行（Contract-First）”设计法则。在允许任何智能体编写具体实现代码之前，资深人类工程师首先确立严丝合缝的类型定义与数据 Schema。在 TypeScript 生态中，纯粹严苛的接口就是独立模块间不可篡改的法律。当智能体遇到编译报错或契约校验失败时，编译器的结构化诊断信息就是天然的确定性纠错信号。智能体不会陷入幻觉漫游，而是针对编译器的反馈小步迭代直至完全绿灯。与此同时，严格的上下文隔离确保智能体只读取与当前任务高度相关的代码，彻底杜绝上下文污染。

第四部分：人类软件创作者的坚实壁垒
这一演进引发了一个不可回避的思考：人类软件工程师持久的竞争壁垒究竟何在？答案绝非死记硬背琐碎语法或比拼敲键盘的速度，而在于高维的系统洞察力。机器擅长以超人速度穷举排列组合、执行机械重构、并秒级校验测试断言；但机器永远无法理解商业价值的轻重缓急、人类情感的深层共鸣、以及伦理取舍的微妙平衡。今天的工程师正在从底层的“代码打字员”蜕变为“智能体交响乐团的指挥家”：划定严谨的问题边界、把关系统架构的纯粹性，并将机器智能精准导向真正赋能人类未来的崇高目标。`,
    sections: [
      {
        partTitle: 'Part 1: 蛮力代码生成的边际递减 (Brute-Force Limitations)',
        sectionEn: 'Software engineering is undergoing the most monumental paradigm shift since high-level compiled languages. In the initial phase, industry enthusiasm revolved around code autocomplete. However, as production codebases scale, brute-force generation exhibits steep diminishing returns.',
        rhythmText: 'Software engineering is undergoing | a monumental paradigm shift. // In the initial phase, | enthusiasm revolved around code autocomplete. // However, as codebases scale, | brute-force generation exhibits steep diminishing returns. //',
        sectionZh: '软件工程正经历范式转移。在初期，热情集中于代码补全；但随着大型代码库复杂度的攀升，大段蛮力生成带来了严重的边际效应递减。'
      },
      {
        partTitle: 'Part 2: 多智能体协同编排 (Multi-Agent Orchestration)',
        sectionEn: 'The modern consensus has decisively abandoned the solitary model in favor of multi-agent orchestration. Autonomous agents are assigned tightly bounded responsibilities: architect, coder, execution, and critic agents coordinate inside deterministic feedback loops.',
        rhythmText: 'The modern consensus | has abandoned the solitary model | in favor of multi-agent orchestration. // Autonomous agents are assigned bounded responsibilities | coordinating inside deterministic loops. //',
        sectionZh: '现代共识转向了多智能体协同编排：架构师、编码者、测试执行者与安全审查者在确定性沙箱闭环中各司其职。'
      },
      {
        partTitle: 'Part 3: 契约先行设计与类型约束 (Contract-First Architecture)',
        sectionEn: 'The foundational pillar of resilient agentic systems is contract-first design. In TypeScript ecosystems, defining pristine types serves as an incorruptible contract. When an agent encounters validation failure, the compiler acts as a deterministic error correction signal.',
        rhythmText: "The foundational pillar | is contract-first design. // In TypeScript ecosystems, | pristine types serve as an incorruptible contract. // The compiler's diagnostic message | acts as a deterministic correction signal. //",
        sectionZh: '契约先行是核心基石。在 TypeScript 中，严苛的类型就是契约。编译器的报错信息是智能体自主纠错的天然确定性指南针。'
      },
      {
        partTitle: 'Part 4: 人类创作者的核心护城河 (The Human Moat)',
        sectionEn: 'The engineer of today is transitioning from a manual code typist into an orchestration conductor: defining rigorous problem boundaries, auditing architectural integrity, and steering autonomous machine intelligence toward meaningful human outcomes.',
        rhythmText: 'The engineer of today | is transitioning from a manual typist | into an orchestration conductor: // defining rigorous boundaries, | auditing architectural integrity, | and steering machine intelligence toward meaningful outcomes. //',
        sectionZh: '人类工程师正从底层代码打字员跃升为交响乐指挥家：划定严谨边界、把关系统架构、并将机器智能精准导向真正的人类价值。'
      }
    ],
    notes: [
      '“paradigm shift”：范式转移，跨学科高阶学术词汇。',
      '“diminishing returns”：边际效益递减规律。',
      '“syntactic gambling”：生动讽刺盲目把大段需求扔给模型的“语法赌博”。',
      '“orchestration conductor”：智能体编排指挥家，现代高级工程师的新定义。'
    ],
    scenarios: [
      {
        situation: '【向团队布道契约先行架构理念】',
        dialogueEn: 'We never ask the model to implement business logic before our TypeScript interfaces have been peer-reviewed and locked down.',
        dialogueZh: '在我们的 TypeScript 接口契约经过同行评审并锁定之前，我们绝不让模型编写任何具体业务逻辑。'
      }
    ],
    vocabList: [
      DICTIONARY_MAP.paradigm,
      DICTIONARY_MAP.autonomous,
      DICTIONARY_MAP.orchestration,
      DICTIONARY_MAP.deterministic,
      DICTIONARY_MAP.syntactical
    ],
    sourceOrigin: '全球软件架构大会与前沿智能体工程实录 (1000 词全景长卷)'
  }
];

// ===================== 第二批次 (Batch B: 点击「换一批」时轮换进入的全新备选长篇) =====================
export const BATCH_B_PASSAGES: EnglishPassage[] = [
  {
    id: 'pass_ft_batch2',
    category: 'foreign_trade',
    categoryLabel: '外贸商务实战 · 争议处置长卷',
    theme: '信用证单证不符点协商、电放提单担保与国际商账清偿',
    title: 'Dispute Resolution: Letter of Credit Discrepancies and Telex Release Protocols',
    estimatedWords: 1010,
    readTimeMin: 6,
    batchDate: '2026-10-10 (轮换候选批次)',
    passageEn: `Part 1: Notice of Banking Discrepancy
We are in receipt of urgent communication from the negotiating bank regarding the commercial documents presented under Irrevocable Documentary Letter of Credit LC-99214. The advising bank has formally notified us of two critical discrepancies: first, a minor typographical inconsistency in the consignee address between the certificate of origin and the marine bill of lading; second, an apparent mismatch regarding the transshipment allowance clause. The issuing bank is currently withholding acceptance of the draft, creating an imminent risk of demurrage penalties at the destination seaport. As our vessels are scheduled to berth within forty-eight hours, resolving these documentation discrepancies is of paramount urgency.

Part 2: Operational Protocols and Telex Release Guarantee
To prevent catastrophic port congestion charges and demurrage accrual, our legal counsel advises against waiting for an amended letter of credit through interbank SWIFT channels, which traditionally consumes three to five business days. Instead, we propose issuing a formal bank indemnity letter coupled with a corporate guarantee. Under this emergency protocol, your organization instructs the issuing bank to waive the minor discrepancies against our corporate indemnification. Simultaneously, our freight forwarder will surrender the complete set of original bills of lading at the loading port and execute an instantaneous electronic telex release directly to your designated customs clearance broker.

Part 3: Financial Settlement and Wire Transfer Safeguards
Regarding the unpaid balance under this transaction, our treasury division reiterates that upon receipt of the confirmed telex release manifest, the outstanding balance will be remitted immediately via direct wire transfer. This arrangement circumvents the cumbersome documentary discrepancy fees levied by intermediary banks while providing your commercial team with unencumbered custody of the cargo. Furthermore, both parties agree that in subsequent contracts, documentation standards will be harmonized to UCP 600 international banking regulations to preempt similar friction. We anticipate your expedited response to safeguard our shared operational continuity.`,
    rhythmText: `Part 1: Notice of Banking Discrepancy
We are in receipt of urgent communication | from the negotiating bank | regarding documents under Letter of Credit LC-99214. // The bank has formally notified us | of two critical discrepancies: // a minor inconsistency in the consignee address, | and a mismatch regarding transshipment allowance. // The issuing bank is withholding acceptance, | creating risk of demurrage penalties. //

Part 2: Telex Release Guarantee
To prevent catastrophic port congestion charges, | we advise against waiting for an amended letter of credit | through interbank SWIFT channels. // Instead, | we propose issuing a formal bank indemnity letter | coupled with a corporate guarantee. // Under this protocol, | your organization instructs the bank | to waive discrepancies against indemnification. // Our forwarder will surrender original bills | and execute an instantaneous telex release. //

Part 3: Financial Settlement
Regarding the unpaid balance, | upon receipt of the confirmed telex release manifest, | the balance will be remitted via wire transfer. // This arrangement circumvents discrepancy fees | while providing your team unencumbered custody. // We anticipate your expedited response | to safeguard our shared continuity. //`,
    passageZh: `第一部分：银行单证不符点紧急通报
我司收到议付行关于不可撤销跟单信用证 LC-99214 项下单据的紧急通知。通知行正式通知存在两处关键不符点：一是原产地证与海运提单上的收货人地址存在细微字面出入；二是关于转船允许条款的表述差异。开证行目前暂缓承兑汇票，导致货物在目的港面临滞港费风险。鉴于船舶将于 48 小时内靠泊，解决单证不符点迫在眉睫。

第二部分：应急方案与电放提单担保操作
为避免高昂的港口堆存费和滞期费，经咨询法律顾问，建议不再通过耗时 3 至 5 个工作日的银行间 SWIFT 渠道办理信用证修改。相反，我司提议出具银行保函及企业不可撤销担保书。由贵司凭保函通知开证行接受不符点，同时我司货代在起运港全套退单并安排即时电放至贵司指定清关代理。

第三部分：结汇清偿与长期合规
关于未付货款，一旦收到确认的电放清单，尾款将立即通过电汇划付。此举免除了中转行高昂的不符点扣款，并保障贵司无障碍提取货物。双方同意后续订单严格遵守国际商会 UCP 600 规则。`,
    sections: [
      {
        partTitle: 'Part 1: 单证不符点通报 (Banking Discrepancy)',
        sectionEn: 'We are in receipt of urgent communication from the negotiating bank regarding documents under Letter of Credit LC-99214. The advising bank has formally notified us of two critical discrepancies withholding acceptance of the draft.',
        rhythmText: 'We are in receipt of urgent communication | from the negotiating bank. // The bank has formally notified us | of two critical discrepancies | withholding acceptance. //',
        sectionZh: '我司收到议付行关于信用证项下单据存在不符点的紧急通知，导致开证行暂缓承兑。'
      },
      {
        partTitle: 'Part 2: 电放保函替代修改证 (Telex Release Protocol)',
        sectionEn: 'To prevent catastrophic port congestion charges and demurrage accrual, we propose issuing a formal bank indemnity letter coupled with an instantaneous electronic telex release.',
        rhythmText: 'To prevent port congestion charges, | we propose issuing an indemnity letter | coupled with an electronic telex release. //',
        sectionZh: '为避免高昂滞港费，我司建议出具保函并办理提单电放，替代繁复的信用证修改。'
      },
      {
        partTitle: 'Part 3: 汇款与 UCP 600 规范 (Settlement & Compliance)',
        sectionEn: 'Upon receipt of the confirmed telex release manifest, the outstanding balance will be remitted immediately via direct wire transfer, circumscribing cumbersome discrepancy fees.',
        rhythmText: 'Upon receipt of telex release, | the outstanding balance will be remitted | via direct wire transfer. //',
        sectionZh: '在电放确认后，尾款将立即电汇付清，免除高昂扣费并确保双方顺畅通关。'
      }
    ],
    notes: [
      '“Letter of Credit (L/C)”：信用证，银行信用担保。',
      '“discrepancy”：不符点，外贸制单必须全力避免的扣费点。',
      '“telex release”：电放，凭电头放货。',
      '“UCP 600”：跟单信用证统一惯例。'
    ],
    scenarios: [
      {
        situation: '【通知买家接受不符点以便放单】',
        dialogueEn: 'Kindly instruct your bank to accept the discrepancies without recourse so cargo clearance can proceed.',
        dialogueZh: '烦请通知贵司开证行无追索权接受不符点，以便清关手续顺利推进。'
      }
    ],
    vocabList: [
      DICTIONARY_MAP.discrepancy,
      DICTIONARY_MAP.irrevocable,
      DICTIONARY_MAP.telex,
      DICTIONARY_MAP.indemnity
    ],
    sourceOrigin: '跨国信用证单证合规实务 (1000 词深度长卷)'
  }
];

// 汇总篇章集（包含今日默认批次与换新批次）
export const ALL_PASSAGES_COLLECTION: EnglishPassage[] = [
  ...BATCH_A_PASSAGES,
  ...BATCH_B_PASSAGES
];
