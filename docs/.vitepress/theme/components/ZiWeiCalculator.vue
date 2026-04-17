<template>
  <div class="ziwei-calculator">
    <div class="input-section card">
      <h3 class="section-title">🔮 紫微斗数排盘及十年运势分析</h3>
      <div class="form-grid">
        <div class="form-item">
          <label>农历生日</label>
          <div class="lunar-inputs">
            <select v-model="lunarYear">
              <option v-for="y in years" :key="y" :value="y">{{ y }}年</option>
            </select>
            <select v-model="lunarMonth">
              <option v-for="(m, i) in monthNames" :key="i" :value="i+1">{{ m }}</option>
            </select>
            <select v-model="lunarDay">
              <option v-for="(d, i) in dayNames" :key="i" :value="i+1">{{ d }}</option>
            </select>
            <label style="margin-top:8px"><input type="checkbox" v-model="isLeapMonth" /> 闰月</label>
          </div>
        </div>
        <div class="form-item">
          <label>出生时辰</label>
          <select v-model="birthTime">
            <option v-for="(name, index) in timeNames" :key="index" :value="index">
              {{ name }}时 ({{ 2*index }}:00 - {{ 2*index+1 }}:59)
            </option>
          </select>
        </div>
        <div class="form-item">
          <label>性别</label>
          <div class="radio-group">
            <label><input type="radio" value="male" v-model="gender" /> 男</label>
            <label><input type="radio" value="female" v-model="gender" /> 女</label>
          </div>
        </div>
      </div>
      <button @click="calculate" class="calc-btn" :disabled="loading || !isReady">
        {{ loading ? '推算中...' : (!isReady ? '加载中...' : '开始推算') }}
      </button>
    </div>

    <div v-if="errorMsg" class="error-box card">
      <p>❌ {{ errorMsg }}</p>
    </div>

    <div v-if="result" class="result-section">
      <!-- 核心看板 -->
      <div class="board-header card">
        <div class="user-info">
          <span class="badge">{{ gender === 'male' ? '乾造' : '坤造' }}</span>
          <span class="info-text">{{ result.lunarDate }} {{ timeNames[birthTime] }}时</span>
        </div>
        <div class="summary-grid">
          <div class="summary-item">
            <div class="label">阳历</div>
            <div class="value">{{ result.solarDate }}</div>
          </div>
          <div class="summary-item">
            <div class="label">生肖</div>
            <div class="value">{{ result.zodiac }}</div>
          </div>
          <div class="summary-item">
            <div class="label">命宫主星</div>
            <div class="value primary-stars">{{ result.soulPalaceStars }}</div>
          </div>
        </div>
      </div>

      <!-- 命宫十二宫分布 -->
      <div class="palaces-overview card">
        <h4 class="section-subtitle">📊 命宫十二宫分布</h4>
        <div class="palaces-grid">
          <div v-for="palace in result.allPalaces" :key="palace.name" class="palace-chip" :class="{ 'highlight-palace': palace.name === '命宫' }">
            <span class="palace-name">{{ palace.name }}</span>
            <span class="palace-stars">{{ palace.stars }}</span>
          </div>
        </div>
      </div>

      <!-- 十年运势详解 -->
      <div class="fortune-section">
        <div class="fortune-card past card">
          <div class="card-tag">📈 上个大限 ({{ pastDecade.range[0] }}-{{ pastDecade.range[1] }}岁)</div>
          <div class="fortune-content">
            <div class="decade-header">
              <span class="palace-name">行限宫位：{{ pastDecade.palaceName }}</span>
            </div>
            <div class="stars-row">
              <span v-for="star in pastDecade.stars" :key="star" class="star-badge">{{ star }}</span>
            </div>
            <div class="interpretation">
              <h5>📖 运势详解</h5>
              <p>{{ pastDecade.desc }}</p>
              <div class="fortune-aspects">
                <div class="aspect"><span class="label">财运</span><span class="value">{{ pastDecade.fortune.money }}</span></div>
                <div class="aspect"><span class="label">事业</span><span class="value">{{ pastDecade.fortune.career }}</span></div>
                <div class="aspect"><span class="label">感情</span><span class="value">{{ pastDecade.fortune.love }}</span></div>
                <div class="aspect"><span class="label">健康</span><span class="value">{{ pastDecade.fortune.health }}</span></div>
              </div>
            </div>
          </div>
        </div>

        <div class="fortune-card current card highlight">
          <div class="card-tag">⭐ 本大限 ({{ currentDecade.range[0] }}-{{ currentDecade.range[1] }}岁) - 当前运势</div>
          <div class="fortune-content">
            <div class="decade-header">
              <span class="palace-name">行限宫位：{{ currentDecade.palaceName }}</span>
            </div>
            <div class="stars-row">
              <span v-for="star in currentDecade.stars" :key="star" class="star-badge highlight">{{ star }}</span>
            </div>
            <div class="interpretation">
              <h5>📖 运势详解</h5>
              <p>{{ currentDecade.desc }}</p>
              <div class="fortune-aspects">
                <div class="aspect"><span class="label">财运</span><span class="value highlight">{{ currentDecade.fortune.money }}</span></div>
                <div class="aspect"><span class="label">事业</span><span class="value highlight">{{ currentDecade.fortune.career }}</span></div>
                <div class="aspect"><span class="label">感情</span><span class="value highlight">{{ currentDecade.fortune.love }}</span></div>
                <div class="aspect"><span class="label">健康</span><span class="value highlight">{{ currentDecade.fortune.health }}</span></div>
              </div>
              <div class="opportunities">
                <h5>🎯 运势建议</h5>
                <ul>
                  <li v-for="tip in currentDecade.tips" :key="tip">{{ tip }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="fortune-card future card">
          <div class="card-tag">🔮 下个大限 ({{ futureDecade.range[0] }}-{{ futureDecade.range[1] }}岁)</div>
          <div class="fortune-content">
            <div class="decade-header">
              <span class="palace-name">行限宫位：{{ futureDecade.palaceName }}</span>
            </div>
            <div class="stars-row">
              <span v-for="star in futureDecade.stars" :key="star" class="star-badge">{{ star }}</span>
            </div>
            <div class="interpretation">
              <h5>📖 运势详解</h5>
              <p>{{ futureDecade.desc }}</p>
              <div class="fortune-aspects">
                <div class="aspect"><span class="label">财运</span><span class="value">{{ futureDecade.fortune.money }}</span></div>
                <div class="aspect"><span class="label">事业</span><span class="value">{{ futureDecade.fortune.career }}</span></div>
                <div class="aspect"><span class="label">感情</span><span class="value">{{ futureDecade.fortune.love }}</span></div>
                <div class="aspect"><span class="label">健康</span><span class="value">{{ futureDecade.fortune.health }}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p class="disclaimer">⚠️ 注：以上分析基于传统紫微斗数安星算法，仅供参考学术研究，不作为生活决策依据。</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const currentYear = new Date().getFullYear();
const years = computed(() => {
  const arr = [];
  for (let y = 1940; y <= currentYear; y++) arr.push(y);
  return arr;
});
const monthNames = ['正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '冬月', '腊月'];
const dayNames = computed(() => {
  const arr = ['初一','初二','初三','初四','初五','初六','初七','初八','初九','初十',
    '十一','十二','十三','十四','十五','十六','十七','十八','十九','二十',
    '廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十'];
  return arr;
});

const lunarYear = ref(1990);
const lunarMonth = ref(1);
const lunarDay = ref(1);
const isLeapMonth = ref(false);
const birthTime = ref(0);
const gender = ref('male');
const result = ref(null);
const loading = ref(false);
const errorMsg = ref(null);
const isReady = ref(false);

const pastDecade = ref(null);
const currentDecade = ref(null);
const futureDecade = ref(null);

const timeNames = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

onMounted(() => {
  const checkIztro = setInterval(() => {
    if (typeof window.iztro !== 'undefined' && window.iztro.astro) {
      isReady.value = true;
      clearInterval(checkIztro);
    }
  }, 200);
  setTimeout(() => clearInterval(checkIztro), 5000);
});

// 详细星曜解读库
const starDetails = {
  '紫微': { 
    desc: '紫微星是帝王之星，代表尊贵、权力与地位。此星入命宫者多具领导才能，易得贵人相助，名望显赫。',
    fortune: { money: '理财有道，偏财运佳', career: '事业晋升，名利双收', love: '感情稳定，受人瞩目', health: '身心康泰' },
    tips: ['发挥领导才能，积极拓展人脉', '注意谦逊，避免过于强势']
  },
  '天府': { 
    desc: '天府星为库禄之星，主财帛、房产。善于理财，物质生活充裕，宜从事金融、地产相关行业。',
    fortune: { money: '财源广进，储蓄丰厚', career: '稳定发展，薪资提升', love: '感情和谐，生活美满', health: '体质良好' },
    tips: ['把握投资机会，稳健理财', '适度享受，注重生活品质']
  },
  '武曲': { 
    desc: '武曲星为财帛星，主刚毅、果断。适合从事金融、技术、工程等需要决断力的行业。',
    fortune: { money: '求财积极，收益丰厚', career: '竞争晋升，实干兴业', love: '理性对待，勿过强势', health: '注意心脏健康' },
    tips: ['主动争取，把握发展机遇', '学会柔刚并济']
  },
  '天相': { 
    desc: '天相星为印星，主协调、辅助。善于协调关系，适合从事服务、管理、咨询类工作。',
    fortune: { money: '收入稳定，理财保守', career: '协调能力强，晋升有望', love: '人缘佳，感情顺利', health: '注意肠胃保养' },
    tips: ['发挥协调特长，建立好人脉', '保持中立，避免卷入纷争']
  },
  '太阳': { 
    desc: '太阳星为官禄星，主光明、博爱。事业心强，适合公众事务、政治、演艺等外向型工作。',
    fortune: { money: '财来自有方，光明磊落', career: '声名远播，仕途得意', love: '热情主动，桃花旺盛', health: '注意肝火旺盛' },
    tips: ['扩大影响力，把握展示机会', '控制脾气，戒骄戒躁']
  },
  '太阴': { 
    desc: '太阴星为财星，主温柔、细腻。情感丰富，适合艺术、文职、服务行业，女性运势尤佳。',
    fortune: { money: '正财稳定，偏财运好', career: '稳定工作，适宜文艺', love: '感情丰富，异性缘佳', health: '注意妇科调养' },
    tips: ['发挥细腻特长，从事文艺创作', '保持乐观心态']
  },
  '贪狼': { 
    desc: '贪狼星为欲望之星，主交际、创意。善于社交，欲望强烈，适合销售、公关、创意行业。',
    fortune: { money: '财来财去，波动较大', career: '多向发展，创意无限', love: '桃花不断，热情奔放', health: '注意肝肾保养' },
    tips: ['控制欲望，避免过度投机', '培养专注力']
  },
  '巨门': { 
    desc: '巨门星为是非之星，主口才、学术。善于表达，适合教育、学术、法律、咨询行业。',
    fortune: { money: '财来自口，舌灿莲花', career: '学术有成，口碑载道', love: '注意口舌之争', health: '注意肠道健康' },
    tips: ['发挥口才优势，从事教育咨询', '谨言慎行，避免是非']
  },
  '廉贞': { 
    desc: '廉贞星为官禄星，主竞争、刚烈。事业心强，好胜心切，适合竞争激烈的行业。',
    fortune: { money: '竞争求财，利益心重', career: '竞争心强，易获成功', love: '热情主动，注意三角恋', health: '注意心脏血压' },
    tips: ['化竞争为动力，正当争取', '控制脾气，避免冲突']
  },
  '天同': { 
    desc: '天同星为福星，主享乐、平和。心境开朗，适合悠闲行业，服务业、艺术类尤佳。',
    fortune: { money: '福报深厚，财来自在', career: '平稳发展，乐天知命', love: '随缘自在，感情稳定', health: '身心愉悦' },
    tips: ['保持乐天心态，享受生活', '适度进取，莫过于安逸']
  },
  '天梁': { 
    desc: '天梁星为荫星，主逢凶化吉、慈善。心地善良，常遇贵人，适合传统行业、医疗、教育。',
    fortune: { money: '财来自有，遇难呈祥', career: '稳定发展，贵人扶持', love: '忠贞不渝，感情稳定', health: '注意肝胆' },
    tips: ['多行善事，积累福报', '发挥经验优势']
  },
  '天机': { 
    desc: '天机星为智慧星，主策划、变动。头脑灵活，思维敏捷，适合策划、咨询、创新行业。',
    fortune: { money: '财运波动，策划生财', career: '多谋少成，适宜智囊', love: '变动较多，勿挑剔', health: '注意神经系统' },
    tips: ['发挥智谋，三思后行', '避免投机取巧']
  },
  '七杀': { 
    desc: '七杀星为将星，主开创、变动。果断勇敢，适合创业、投资、冒险行业。',
    fortune: { money: '大起大落，敢于投资', career: '开疆拓土，创业佳', love: '刚烈过旺，注意调和', health: '注意手术意外' },
    tips: ['勇于开拓，把握发展先机', '注意安全，避免冲动']
  },
  '破军': { 
    desc: '破军星为耗星，主破旧立新。先破后成，适合改革、创新、破坏性创造行业。',
    fortune: { money: '先破后立，置之死地', career: '改革创新，另辟蹊径', love: '波折不断，第六感强', health: '注意血光之灾' },
    tips: ['破釜沉舟，敢于改变', '注意安全，谨言慎行']
  }
};

const getStarDetails = (stars) => {
  if (!stars || stars.length === 0) {
    return {
      desc: '此宫位无主星坐守，运势相对平稳，需看辅星配合。',
      fortune: { money: '平稳普通', career: '按部就班', love: '顺其自然', health: '注意调养' },
      tips: ['保持平常心，稳步前进']
    };
  }
  const mainStar = stars[0];
  return starDetails[mainStar] || {
    desc: `${mainStar}坐守，命运独特，需综合分析。`,
    fortune: { money: '因人而异', career: '看具体组合', love: '看桃花运', health: '具体分析' },
    tips: ['详细分析命盘，全面把握']
  };
};

const calculate = () => {
  errorMsg.value = null;
  result.value = null;
  pastDecade.value = null;
  currentDecade.value = null;
  futureDecade.value = null;
  
  if (!isReady.value) {
    errorMsg.value = '系统加载中，请稍等片刻再试。';
    return;
  }

  loading.value = true;

  try {
    const astroModule = window.iztro.astro;
    const year = parseInt(lunarYear.value);
    const month = parseInt(lunarMonth.value);
    const day = parseInt(lunarDay.value);
    const timeIndex = parseInt(birthTime.value, 10);
    const genderStr = gender.value;
    const leap = isLeapMonth.value;

    // 使用 iztro 需要的字符串格式 'YYYY-M-D'
    const lunarDateStr = `${year}-${month}-${day}`;
    console.log('[ZiWei] Lunar Input:', lunarDateStr, timeIndex, genderStr, leap);
    
    const board = astroModule.byLunar(lunarDateStr, timeIndex, genderStr, leap, true);
    console.log('[ZiWei] Board:', board);

    if (!board || !board.palaces) {
      throw new Error('排盘数据生成失败');
    }

    // 获取所有宫位信息
    const allPalaces = board.palaces.map(p => ({
      name: p.name || '未知',
      stars: p.majorStars ? p.majorStars.map(s => s.name).join('、') : '无'
    }));

    // 计算年龄
    const nowYear = new Date().getFullYear();
    const currentAge = nowYear - year + 1;

    // 获取大限信息
    const allDecades = board.palaces.map(p => ({
      range: p.decadal ? p.decadal.range : [0, 0],
      palaceName: p.name || '未知',
      stars: p.majorStars ? p.majorStars.map(s => s.name) : []
    })).sort((a, b) => a.range[0] - b.range[0]);

    // 找到当前大限
    let currentIdx = -1;
    for (let i = 0; i < allDecades.length; i++) {
      if (currentAge >= allDecades[i].range[0] && currentAge <= allDecades[i].range[1]) {
        currentIdx = i;
        break;
      }
    }

    if (currentIdx === -1) currentIdx = 0;

    // 构建运势数据
    const buildDecadeData = (decadeData) => {
      const details = getStarDetails(decadeData.stars);
      return {
        range: decadeData.range,
        palaceName: decadeData.palaceName,
        stars: decadeData.stars,
        desc: details.desc,
        fortune: details.fortune,
        tips: details.tips
      };
    };

    if (currentIdx > 0) {
      pastDecade.value = buildDecadeData(allDecades[currentIdx - 1]);
    }

    currentDecade.value = buildDecadeData(allDecades[currentIdx]);

    if (currentIdx < allDecades.length - 1) {
      futureDecade.value = buildDecadeData(allDecades[currentIdx + 1]);
    }

    // 命宫主星
    const soulPalace = board.palaces.find(p => p.name === '命宫') || board.palaces[0];
    const soulPalaceStars = soulPalace && soulPalace.majorStars 
      ? soulPalace.majorStars.map(s => s.name).join('、') 
      : '无主星';

    result.value = {
      lunarDate: `${year}年${monthNames[month-1]}${dayNames[day-1]}`,
      solarDate: board.solarDate,
      zodiac: board.zodiac || '未知',
      soulPalaceStars,
      allPalaces
    };

  } catch (e) {
    console.error('[ZiWei] Error:', e);
    errorMsg.value = '推算失败：' + (e.message || '未知错误');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.ziwei-calculator { margin: 2rem 0; color: var(--vp-c-text-1); font-family: "PingFang SC", "Microsoft YaHei", sans-serif; }
.card { background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider); border-radius: 16px; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
.error-box { background: #fef2f2; border-color: #fecaca; color: #dc2626; padding: 1rem; border-radius: 12px; }
.section-title { margin-top: 0; margin-bottom: 1.5rem; color: var(--vp-c-brand-1); font-size: 1.5rem; text-align: center; font-weight: bold; }
.section-subtitle { margin: 0 0 1rem 0; font-size: 1.1rem; color: var(--vp-c-brand-1); }
.form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 1.5rem; }
.form-item label { display: block; font-weight: bold; margin-bottom: 0.5rem; font-size: 0.9rem; }
.lunar-inputs { display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center; }
.lunar-inputs select { padding: 0.5rem; border-radius: 6px; border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg); color: var(--vp-c-text-1); min-width: 70px; }
.form-item input[type="checkbox"] { margin-right: 4px; }
.form-item select { width: 100%; padding: 0.8rem; border-radius: 8px; border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg); color: var(--vp-c-text-1); }
.radio-group { display: flex; gap: 1.5rem; padding: 0.5rem 0; }
.calc-btn { width: 100%; padding: 1rem; background: linear-gradient(135deg, var(--vp-c-brand-1) 0%, #a855f7 100%); color: white; border: none; border-radius: 12px; font-weight: bold; cursor: pointer; transition: all 0.3s ease; font-size: 1.1rem; }
.calc-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-2px); box-shadow: 0 6px 15px rgba(99, 102, 241, 0.4); }
.calc-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.board-header { border-left: 5px solid var(--vp-c-brand-1); background: linear-gradient(135deg, var(--vp-c-bg-soft) 0%, rgba(99,102,241,0.1) 100%); }
.user-info { display: flex; align-items: center; gap: 10px; margin-bottom: 1.2rem; flex-wrap: wrap; }
.badge { background: var(--vp-c-brand-1); color: white; padding: 4px 12px; border-radius: 4px; font-size: 0.85rem; font-weight: bold; }
.info-text { font-weight: 600; font-size: 1.1rem; }
.summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; text-align: center; }
.label { font-size: 0.8rem; color: var(--vp-c-text-2); margin-bottom: 4px; }
.value { font-weight: bold; font-size: 1.1rem; }
.primary-stars { color: var(--vp-c-brand-1); font-size: 1rem; }

.palaces-overview { background: var(--vp-c-bg); }
.palaces-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 0.5rem; }
.palace-chip { display: flex; flex-direction: column; padding: 0.5rem; background: var(--vp-c-bg-soft); border-radius: 8px; border: 1px solid var(--vp-c-divider); font-size: 0.8rem; }
.palace-chip.highlight-palace { border-color: var(--vp-c-brand-1); background: var(--vp-c-brand-soft); }
.palace-name { font-weight: bold; color: var(--vp-c-brand-1); }
.palace-stars { font-size: 0.7rem; color: var(--vp-c-text-2); margin-top: 2px; }

.fortune-section { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.2rem; }
.fortune-card { position: relative; overflow: hidden; }
.fortune-card.highlight { border: 2px solid var(--vp-c-brand-1); box-shadow: 0 8px 25px rgba(99,102,241,0.2); transform: scale(1.01); }
.card-tag { font-size: 0.8rem; font-weight: 800; color: var(--vp-c-brand-1); margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--vp-c-divider); }
.decade-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem; }
.palace-name { color: var(--vp-c-text-2); font-weight: 500; }
.stars-row { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 1rem; }
.star-badge { background: var(--vp-c-bg-alt); border: 1px solid var(--vp-c-divider); padding: 3px 8px; border-radius: 6px; font-size: 0.8rem; }
.star-badge.highlight { background: var(--vp-c-brand-soft); color: var(--vp-c-brand-1); border-color: var(--vp-c-brand-1); }

.interpretation h5 { margin: 0.8rem 0 0.5rem 0; font-size: 0.95rem; color: var(--vp-c-text-1); }
.interpretation p { font-size: 0.9rem; line-height: 1.7; color: var(--vp-c-text-2); margin: 0 0 1rem 0; }
.fortune-aspects { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem; background: var(--vp-c-bg); padding: 0.8rem; border-radius: 8px; }
.aspect { display: flex; justify-content: space-between; font-size: 0.8rem; }
.aspect .label { color: var(--vp-c-text-2); }
.aspect .value { font-weight: bold; color: var(--vp-c-text-1); }
.aspect .value.highlight { color: var(--vp-c-brand-1); }

.opportunities { margin-top: 1rem; padding: 0.8rem; background: linear-gradient(135deg, rgba(99,102,241,0.05) 0%, rgba(168,85,247,0.05) 100%); border-radius: 8px; }
.opportunities h5 { margin: 0 0 0.5rem 0; font-size: 0.9rem; color: var(--vp-c-brand-1); }
.opportunities ul { margin: 0; padding-left: 1.2rem; font-size: 0.85rem; color: var(--vp-c-text-2); }
.opportunities li { margin-bottom: 0.3rem; line-height: 1.5; }

.disclaimer { font-size: 0.75rem; color: var(--vp-c-text-3); text-align: center; margin-top: 2rem; font-style: italic; }
.empty-state { text-align: center; color: var(--vp-c-text-3); padding: 2rem 1rem; }

@media (max-width: 640px) { 
  .summary-grid { grid-template-columns: 1fr; } 
  .fortune-section { grid-template-columns: 1fr; }
  .fortune-card.highlight { transform: none; }
}
</style>
