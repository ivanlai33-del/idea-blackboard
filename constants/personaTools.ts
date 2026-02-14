
export interface MagicTool {
    id: string;
    icon: string;
    label: string;
    prompt: string;
    description: string;
}

export interface LumosWidget {
    id: string;
    icon: string;
    label: string;
    type: 'timer' | 'randomizer' | 'counter' | 'checklist' | 'link' | 'sound' | 'action';
    actionPayload?: any;
}

export interface TipEntry {
    zh: string;
    en: string;
}

// ... existing widget maps ...
const MYSTIC_WIDGETS: LumosWidget[] = [
    { id: 'daily_tarot', icon: '🃏', label: '每日一抽', type: 'randomizer' },
    { id: 'meditation_bell', icon: '🔔', label: '冥想正念鈴', type: 'sound' }
];

const STRATEGIST_WIDGETS: LumosWidget[] = [
    { id: 'decision_coin', icon: '🪙', label: '決策硬幣', type: 'randomizer' },
    { id: 'deadline_countdown', icon: '⏳', label: '專案倒數', type: 'timer' }
];

const CREATOR_WIDGETS: LumosWidget[] = [
    { id: 'color_palette', icon: '🎨', label: '靈感色票', type: 'randomizer' },
    { id: 'pomodoro', icon: '🍅', label: '創意番茄鐘', type: 'timer' }
];

const SCHOLAR_WIDGETS: LumosWidget[] = [
    { id: 'focus_noise', icon: '🎧', label: '專注白噪音', type: 'sound' },
    { id: 'flash_card_mode', icon: '📇', label: '閃卡遮罩', type: 'checklist' }
];

const EXECUTOR_WIDGETS: LumosWidget[] = [
    { id: 'priority_check', icon: '✅', label: '優先級清單', type: 'checklist' },
    { id: 'progress_tracker', icon: '📊', label: '進度追蹤', type: 'counter' }
];

const STOCK_TRADER_WIDGETS: LumosWidget[] = [
    { id: 'stock_chart', icon: '📈', label: '即時走勢圖', type: 'action', actionPayload: 'set_type_stock' },
    ...EXECUTOR_WIDGETS
];

const NURTURER_WIDGETS: LumosWidget[] = [
    { id: 'breath_guide', icon: '🌬️', label: '呼吸引導', type: 'timer' },
    { id: 'water_tracker', icon: '💧', label: '喝水計數', type: 'counter' }
];

const ESSENTIAL_WIDGETS: LumosWidget[] = [
    { id: 'simple_calc', icon: '🧮', label: '計算機', type: 'link' },
    { id: 'simple_timer', icon: '⏲️', label: '計時器', type: 'timer' }
];

export const PERSONA_WIDGET_MAP: Record<string, LumosWidget[]> = {
    '命理算命師': MYSTIC_WIDGETS,
    '塔羅占卜師': MYSTIC_WIDGETS,
    '占星諮詢師': MYSTIC_WIDGETS,
    '人類圖分析': MYSTIC_WIDGETS,
    '經營者範本': STRATEGIST_WIDGETS,
    '產品經理': STRATEGIST_WIDGETS,
    '上班族範本': STRATEGIST_WIDGETS,
    '一人公司': STRATEGIST_WIDGETS,
    '小生意': STRATEGIST_WIDGETS,
    '電商經營': STRATEGIST_WIDGETS,
    '課程經營': STRATEGIST_WIDGETS,
    '小攤商': STRATEGIST_WIDGETS,
    '劇本創作': CREATOR_WIDGETS,
    '短影音創作者': CREATOR_WIDGETS,
    '社群小編': CREATOR_WIDGETS,
    'UI 介面設計': CREATOR_WIDGETS,
    'Podcast 主播': CREATOR_WIDGETS,
    '小說家': CREATOR_WIDGETS,
    '學術': SCHOLAR_WIDGETS,
    '正念練習': NURTURER_WIDGETS,
    '家庭管家': NURTURER_WIDGETS
};

export const GET_WIDGETS_FOR_PERSONA = (persona: string): LumosWidget[] => {
    return PERSONA_WIDGET_MAP[persona] || ESSENTIAL_WIDGETS;
};

// ... existing magic tools ...
const THE_MYSTIC_TOOLS: MagicTool[] = [
    { id: 'energy_read', icon: '🔮', label: '能量流動解讀', description: '感知文字中的情緒起伏', prompt: '你是一位高維度的靈性能量解讀者...' }
];
const THE_STRATEGIST_TOOLS: MagicTool[] = [
    { id: 'mvp_action', icon: '🚀', label: 'MVP 行動清單', description: '轉化為明日可執行的步驟', prompt: '你是一位精實創業教練...' }
];
const THE_CREATOR_TOOLS: MagicTool[] = [
    { id: 'inspiration_burst', icon: '✨', label: '靈感爆發', description: '發散生成 5 個創意', prompt: '你是一位擁有無限腦洞的創意總監...' }
];
const THE_SCHOLAR_TOOLS: MagicTool[] = [
    { id: 'feynman_explain', icon: '🧠', label: '費曼學習法', description: '用最簡單的話解釋', prompt: '你是一位擅長化繁為簡的物理學家...' }
];
const THE_EXECUTOR_TOOLS: MagicTool[] = [
    { id: 'sop_maker', icon: '📋', label: 'SOP 自動化', description: '轉化為標準流程', prompt: '你是一位流程優化專家...' }
];
const THE_NURTURER_TOOLS: MagicTool[] = [
    { id: 'emotion_transform', icon: '🌿', label: '情緒轉化', description: '將焦慮轉為感恩', prompt: '你是一位溫柔的心理療癒師...' }
];
const THE_ESSENTIAL_AURA_TOOLS: MagicTool[] = [
    { id: 'smart_summary', icon: '📝', label: '智能摘要', description: '濃縮核心重點', prompt: '你是一位精確的編輯...' }
];

export const PERSONA_CATEGORY_MAP: Record<string, MagicTool[]> = {
    '命理算命師': THE_MYSTIC_TOOLS,
    '產品經理': THE_STRATEGIST_TOOLS,
    'UI 介面設計': THE_CREATOR_TOOLS,
    '學術': THE_SCHOLAR_TOOLS,
    '正念練習': THE_NURTURER_TOOLS
};

export const GET_TOOLS_FOR_PERSONA = (persona: string): MagicTool[] => {
    return PERSONA_CATEGORY_MAP[persona] || THE_ESSENTIAL_AURA_TOOLS;
};

// ======================================
// Aura 隨身貼士 (METAPHYSICAL CHEATSHEETS)
// 多語系結構 & 大規模擴充 (每項主題 25+ 則)
// ======================================

export const METAPHYSICAL_CHEATSHEETS: Record<string, TipEntry[]> = {
    '感恩與積極': [
        { zh: '💡 感恩日記：每天睡前寫下三件值得感謝的小事，重塑大腦迴路。', en: '💡 Gratitude Journal: List 3 small things you\'re thankful for before bed to rewire your brain.' },
        { zh: '💡 積極語句：向鏡子裡的自己說：「我已經準備好迎接美好的一天。」', en: '💡 Positive Affirmation: Tell yourself in the mirror: "I am ready for a beautiful day."' },
        { zh: '💡 小確幸：閉上眼感受陽光灑在皮膚上的溫度，感恩這一刻的溫暖。', en: '💡 Small Glitters: Feel the sun on your skin; be grateful for this warmth.' },
        { zh: '💡 善良傳遞：今天試著稱讚一個陌生人，善意會像漣漪般擴散。', en: '💡 Ripple Effect: Compliment a stranger today; kindness spreads like ripples.' },
        { zh: '💡 身體感恩：感謝雙腳帶你行走，感謝雙手讓你創造。', en: '💡 Body Gratitude: Thank your feet for walking and your hands for creating.' },
        { zh: '💡 呼吸之禮：呼吸是免費的，也是最神聖的禮物。', en: '💡 Gift of Breath: Breathing is free, and it’s the most sacred gift.' },
        { zh: '💡 失敗的收穫：感恩這個錯誤，它教給了你最寶貴的一課。', en: '💡 Harvest from Failure: Be grateful for mistakes; they teach the best lessons.' },
        { zh: '💡 水之恩惠：喝每一口水時，默默感謝它帶來的生命力。', en: '💡 Fluid Grace: Thank every sip of water for the life force it brings.' },
        { zh: '💡 寂靜時刻：感恩這安靜的五分鐘，讓靈魂得以休憩。', en: '💡 Silence: Be grateful for 5 quiet minutes to let your soul rest.' },
        { zh: '💡 連結感恩：感謝那些支持你、愛你的人，讓他們知道你的心意。', en: '💡 Loving Links: Thank those who support you; let them feel your heart.' },
        { zh: '💡 晨間祈福：醒來的第一個念頭：「謝謝我還活著。」', en: '💡 Morning Blessing: First thought upon waking: "Thank you for being alive."' },
        { zh: '💡 平衡心態：不論發生什麼，相信宇宙有最好的安排。', en: '💡 Balanced Mind: Whatever happens, trust that the universe has the best plan.' },
        { zh: '💡 感官覺察：感謝耳邊的音樂、鼻尖的香氣、指尖的觸感。', en: '💡 Sensory Wake: Thank the music, the scent, and the touch around you.' },
        { zh: '💡 同理心：感恩我有能力去感受他人的痛苦，這使我完整。', en: '💡 Empathy: Be grateful for the ability to feel others\' pain; it makes you whole.' },
        { zh: '💡 內在力量：我的內心充滿陽光，足以照亮陰影。', en: '💡 Inner Light: My heart is full of sun, enough to light up shadows.' },
        { zh: '💡 成長機會：今天的挑戰是明日成長的肥料。', en: '💡 Growth Space: Today’s challenge is the fertilizer for tomorrow’s growth.' },
        { zh: '💡 資源感恩：感謝遮風避雨的家，感謝手中的工具。', en: '💡 Resourceful: Thank the home for shelter and the tools in your hands.' },
        { zh: '💡 簡單生活：不需要更多，我已擁有一切所需。', en: '💡 Simple Abundance: Need no more; I have everything I need.' },
        { zh: '💡 勇氣肯定：我有勇氣面對未知，並從中學習。', en: '💡 Courageous: I have the courage to face the unknown and learn.' },
        { zh: '💡 美學覺察：世界不缺美，缺的是發現美的眼睛。', en: '💡 Aesthetic Soul: The world lacks no beauty, only the eyes to see it.' },
        { zh: '💡 釋放過去：感恩過去的經歷，但不再讓它束縛我的現在。', en: '💡 Letting Go: Be grateful for the past, but don\'t let it bind your present.' },
        { zh: '💡 未來信心：我對未來充滿期待，每一步都是轉機。', en: '💡 Future Faith: I look forward to the future; every step is a turning point.' },
        { zh: '💡 獨處之美：感恩我可以與自己平靜相處。', en: '💡 Beautiful Solitude: Grateful I can exist peacefully with myself.' },
        { zh: '💡 創意流動：感謝靈感女神今天的造訪。', en: '💡 Creative Flow: Thank the muse for visiting me today.' },
        { zh: '💡 完善自己：我每天都在變得比昨天更好一點。', en: '💡 Self-Polishing: I am getting a little better every single day.' }
    ],
    '斷捨離': [
        { zh: '💡 空間斷捨離：清空桌面，心靈也會跟著開闊。', en: '💡 Spatial Declutter: Clear your desk, and your mind will follow.' },
        { zh: '💡 資訊過濾：關掉多餘的通知，找回主動選擇的能力。', en: '💡 Content Filter: Mute extra notifications; reclaim your power of choice.' },
        { zh: '💡 情感放手：不再執著於無法改變的過去，只為當下而活。', en: '💡 Emotional Release: Stop clinging to the unchangeable past; live for now.' },
        { zh: '💡 購物停看聽：購買前問自己：這是需要，還是想要？', en: '💡 Stop and Think: Before buying, ask: Is it a need or a want?' },
        { zh: '💡 關係簡化：遠離消耗你的人，親近滋養你的人。', en: '💡 Sync Circles: Distance from drainers; stay close to nurturers.' },
        { zh: '💡 數位排毒：每天刪除 10 張沒用的照片，清空電子壓力。', en: '💡 Digital Detox: Delete 10 unneeded photos a day to clear e-stress.' },
        { zh: '💡 極簡衣櫥：留下那些讓你感到怦然心動的衣物。', en: '💡 Minimalist Closet: Keep only the clothes that spark joy.' },
        { zh: '💡 目標斷捨離：同時追逐兩隻兔子，一隻也追不到。專注一個。', en: '💡 Focus Core: Chasing two rabbits catches none. Focus on one.' },
        { zh: '💡 文字精華：練習用最少的字，說最清楚的事。', en: '💡 Text Polish: Practice saying most with least words.' },
        { zh: '💡 拒絕的勇氣：學會說「不」，是在保護你的時間與能量。', en: '💡 Courage to Say No: Saying "No" protects your time and energy.' },
        { zh: '💡 書籍流通：讀完的書如果不再翻閱，就送給需要的人吧。', en: '💡 Circulate Books: Give read books to others if they won’t be opened again.' },
        { zh: '💡 負評免疫：別人的評價是別人的事，與你無關。', en: '💡 Negative Immunity: Others\' opinions are their business, not yours.' },
        { zh: '💡 儀式化丟棄：感謝舊物陪你走過的時光，然後輕輕告別。', en: '💡 Ritual Toss: Thank old items for their time, then say goodbye.' },
        { zh: '💡 零雜物習慣：每買進一樣新東西，就丟掉兩件舊東西。', en: '💡 One-in, Two-out: For every new item, say goodbye to two old ones.' },
        { zh: '💡 工作流簡化：移除那個繁瑣但沒效率的步驟。', en: '💡 Workflow Trim: Remove that tedious but inefficient step.' },
        { zh: '💡 完美主義捨棄：完成勝過完美。放下無謂的糾結。', en: '💡 Abandon Perfectionism: Done is better than perfect. Let it go.' },
        { zh: '💡 回憶輕量化：重要的回憶在腦海，不在那張舊收據裡。', en: '💡 Memory Light: Real memories are in your mind, not old receipts.' },
        { zh: '💡 雜訊隔离：這一個小時，只聽一種聲音。', en: '💡 Noise Isolation: This hour, listen to only one sound.' },
        { zh: '💡 決策排空：如果是「可能可以」，那就是「不行」。', en: '💡 Decision Vacancy: If it’s a "maybe," it’s a "no."' },
        { zh: '💡 分鐘法則：如果一件事兩分鐘內能做完，立刻做，不要積壓。', en: '💡 2-Minute Rule: If it takes <2 mins, do it now. Don\'t stack it.' },
        { zh: '💡 桌面歸零：每天下班前，把電腦與實體桌面清空。', en: '💡 Desktop Reset: Clear your physical and digital desk before EOD.' },
        { zh: '💡 自責釋放：原諒那個不完美的自己，那是成長的必要。', en: '💡 Release Regret: Forgive your imperfect self; it’s vital for growth.' },
        { zh: '💡 期待斷捨離：不再為了滿足他人的期待而活。', en: '💡 Cease Expectations: Stop living just to meet others\' expectations.' },
        { zh: '💡 深度呼吸：吐氣時，想像你在排出所有的雜念。', en: '💡 Deep Exhale: Visualize expelling all cluttered thoughts.' },
        { zh: '💡 靈魂斷捨離：放下「我必須一直很有用」的焦慮。', en: '💡 Soul Declutter: Drop the anxiety of "I must always be useful."' }
    ],
    '番茄鐘與正念': [
        { zh: '🍅 專注 25 分鐘：給大腦一個純淨的深度工作區。', en: '🍅 Focus 25 Mins: Give your brain a pure deep-work zone.' },
        { zh: '🧘 正念 5 分鐘：閉上眼，感受空氣流過鼻尖的溫度。', en: '🧘 Mindfulness 5 Mins: Close eyes; feel the air passing your nose.' },
        { zh: '🍅 心流節奏：像海浪一樣，有高峰工作，也要有低谷休憩。', en: '🍅 Flow Rhythm: Like waves, have peak work and trough rest.' },
        { zh: '🧘 觀察想法：想法像浮雲，看著它飄過，但不跟著它走。', en: '🧘 Observe Thoughts: Thoughts are clouds; watch them pass, don\'t follow.' },
        { zh: '🍅 抵制誘惑：這 25 分鐘裡，不點開任何通訊軟體。', en: '🍅 Resisting Temp: No messaging apps for these 25 minutes.' },
        { zh: '🧘 全身細部掃描：從頭頂到腳趾，慢慢放鬆每一吋肌肉。', en: '🧘 Body Scan: From head to toe, slowly relax every inch of muscle.' },
        { zh: '🍅 高效番茄：把大任務切成小塊，每 25 分鐘解決一塊。', en: '🍅 High-Eff Tomato: Slice big tasks; solve one every 25 mins.' },
        { zh: '🧘 感受支撐：感受椅子對身體的支撐，你現在很安全。', en: '🧘 Feel Support: Feel the chair supporting you; you are safe now.' },
        { zh: '🍅 休息儀式：站起來走走，不要只是切換到另一個螢幕。', en: '🍅 Rest Ritual: Walk around; don\'t just switch to another screen.' },
        { zh: '🧘 聲音覺察：注意到背景的微小聲音，但不加以評判。', en: '🧘 Sound Wake: Notice tiny background sounds without judgment.' },
        { zh: '🍅 戰勝拖延：先坐下來做 5 分鐘，動力就會自己來找你。', en: '🍅 Defeat Procrast: Just sit for 5 mins; momentum will find you.' },
        { zh: '🧘 感恩呼吸：每一次呼吸都在帶領你回到當下。', en: '🧘 Breath Gratitude: Every breath leads you back to the Now.' },
        { zh: '🍅 深度專注：在這個 25 分鐘裡，你是這件事的主宰。', en: '🍅 Deep Focus: For these 25 mins, you are the master of this task.' },
        { zh: '🧘 手部放鬆：甩甩手腕，釋放長期打字的緊繃感。', en: '🧘 Hand Release: Shake your wrists; release typing tension.' },
        { zh: '🍅 番茄日誌：紀錄你完成的數量，這會給你巨大的成就感。', en: '🍅 Tomato Log: Track your finished cycles for a sense of pride.' },
        { zh: '🧘 內在中心：不論外在多混亂，這裡永遠有一個平靜的中心。', en: '🧘 Inner Center: However chaotic outside, there\'s a calm center here.' },
        { zh: '🍅 智慧休息：閉目養神 5 分鐘，比滑 5 分鐘手機更有用。', en: '🍅 Wisdom Rest: 5 mins of closed eyes beats 5 mins of scrolling.' },
        { zh: '🧘 視覺放鬆：運用 20-20-20 法則，看一看遠方的綠意。', en: '🧘 Vision Soft: Use 20-20-20 rule; look at distant greenery.' },
        { zh: '🍅 零碎時間：不要等大塊時間，現在就啟動一個番茄。', en: '🍅 Fragment Power: Don\'t wait for big blocks; start a cycle now.' },
        { zh: '🧘 情緒天氣：觀察內在情緒的變化，接受它的陰晴圓缺。', en: '🧘 Emotion Weather: Watch inner moods; accept their ups and downs.' },
        { zh: '🍅 持之以恆：番茄鐘不是為了壓榨，而是為了長久。', en: '🍅 Consistency: Pomodoro is for longevity, not for squeezing.' },
        { zh: '🧘 觸覺感知：感受雙足觸碰地板的踏實感。', en: '🧘 Grounding: Feel the solid contact of feet on the floor.' },
        { zh: '🍅 獎勵機制：完成四個番茄後，給自己一個長一點的休息。', en: '🍅 Rewards: After 4 cycles, give yourself a longer break.' },
        { zh: '🧘 溫柔對待：如果分心了，沒關係，溫柔地帶回呼吸即可。', en: '🧘 Gentle Return: If distracted, it\'s okay; gently return to breath.' },
        { zh: '🍅 專注的力量：簡單，但極其強大。', en: '🍅 Power of Focus: Simple, yet extremely powerful.' }
    ],
    '生活': [
        { zh: '💡 費曼技巧：選主題 -> 假裝教別人 -> 卡住回頭讀 -> 簡化語言。', en: '💡 Feynman Tech: Pick a topic -> Teach a child -> Review gaps -> Simplify.' },
        { zh: '💡 SQ3R：Survey, Question, Read, Recite, Review。', en: '💡 SQ3R: Survey, Question, Read, Recite, Review.' },
        { zh: '💡 第一性原理：回歸事物最基本的真理，重新推導。', en: '💡 First Principles: Strip to core truths; re-derive from there.' },
        { zh: '💡 80/20法則：80%的產出源自20%的關鍵投入。', en: '💡 80/20 Rule: 80% of output comes from 20% of key inputs.' },
        { zh: '💡 MVP思維：先求有(可行)，再求好(完美)。', en: '💡 MVP Thinking: Make it work (viable) before making it perfect.' }
    ]
};
