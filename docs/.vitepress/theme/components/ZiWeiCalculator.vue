<template>
  <div class="ziwei-calculator">
    <div class="input-section card">
      <h3 class="section-title">🔮 紫微斗数排盘及十年运势分析</h3>
      <div class="form-grid">
        <div class="form-item">
          <label>阳历生日</label>
          <input type="date" v-model="birthDate" />
        </div>
        <div class="form-item">
          <label>出生时辰</label>
          <select v-model="birthTime">
            <option v-for="(name, index) in timeNames" :key="index" :value="index">
              {{ name }} ({{ 2 * index }}:00 - {{ 2 * index + 1 }}:59)
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
      <button @click="calculate" class="calc-btn" :disabled="loading">
        {{ loading ? '计算中...' : '立即排盘' }}
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
          <span class="info-text">{{ result.displayDate }} {{ timeNames[birthTime] }}时生</span>
        </div>
        <div class="summary-grid">
          <div class="summary-item">
            <div class="label">生肖</div>
            <div class="value">{{ result.zodiac }}</div>
          </div>
          <div class="summary-item">
            <div class="label">星座</div>
            <div class="value">{{ result.sign }}</div>
          </div>
          <div class="summary-item">
            <div class="label">命宫主星</div>
            <div class="value primary-stars">{{ result.soulPalaceStars }}</div>
          </div>
        </div>
      </div>

      <!-- 十年运势 -->
      <div class="fortune-section">
        <div class="fortune-card past card">
          <div class="card-tag">上个大限 (回顾过去)</div>
          <div v-if="pastDecade" class="fortune-content">
            <div class="decade-info">
              <span class="age-range">{{ pastDecade.range[0] }} - {{ pastDecade.range[1] }} 岁</span>
              <span class="palace-name">{{ pastDecade.palaceName }}</span>
            </div>
            <div class="stars-row">
              <span v-for="star in pastDecade.stars" :key="star" class="star-badge">{{ star }}</span>
            </div>
            <p class="interpretation">{{ pastDecade.desc }}</p>
          </div>
          <div v-else class="empty-state">尚在起始运势</div>
        </div>

        <div class="fortune-card current card highlight">
          <div class="card-tag">本大限 (当前运势)</div>
          <div v-if="currentDecade" class="fortune-content">
            <div class="decade-info">
              <span class="age-range">{{ currentDecade.range[0] }} - {{ currentDecade.range[1] }} 岁</span>
              <span class="palace-name">{{ currentDecade.palaceName }}</span>
            </div>
            <div class="stars-row">
              <span v-for="star in currentDecade.stars" :key="star" class="star-badge highlight">{{ star }}</span>
            </div>
            <p class="interpretation">{{ currentDecade.desc }}</p>
          </div>
        </div>

        <div class="fortune-card future card">
          <div class="card-tag">下个大限 (未来展望)</div>
          <div v-if="futureDecade" class="fortune-content">
            <div class="decade-info">
              <span class="age-range">{{ futureDecade.range[0] }} - {{ futureDecade.range[1] }} 岁</span>
              <span class="palace-name">{{ futureDecade.palaceName }}</span>
            </div>
            <div class="stars-row">
              <span v-for="star in futureDecade.stars" :key="star" class="star-badge">{{ star }}</span>
            </div>
            <p class="interpretation">{{ futureDecade.desc }}</p>
          </div>
          <div v-else class="empty-state">暂未到达</div>
        </div>
      </div>

      <p class="disclaimer">⚠️ 注：以上分析基于传统紫微斗数安星算法，仅供参考，不作为生活决策依据。</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const birthDate = ref('1990-01-01');
const birthTime = ref(0);
const gender = ref('male');
const result = ref(null);
const loading = ref(false);
const errorMsg = ref(null);

const pastDecade = ref(null);
const currentDecade = ref(null);
const futureDecade = ref(null);

// Store astro object
let astroModule = null;

onMounted(async () => {
  // Dynamic import to ensure it's loaded in browser context
  try {
    const iztro = await import('iztro');
    astroModule = iztro.astro;
  } catch (e) {
    console.error('Failed to load iztro:', e);
    errorMsg.value = '系统组件加载失败，请刷新页面重试。';
  }
});

const timeNames = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

const starInterpretations = {
  '紫微': '名望与事业的巅峰期，易得贵人提拔，地位显著提升。',
  '天府': '物质财富稳健积累期，利于理财与房产，生活富足。',
  '武曲': '实干求财阶段，行动力极强，虽劳心劳力但回报丰厚。',
  '天相': '和谐平衡期，适合从事协调、咨询工作，人缘极佳。',
  '太阳': '事业名声大振，活力四射，适合向外拓展和公众事务。',
  '太阴': '情感与财运并进，心思细腻，生活品位提升，利于女性。',
  '贪狼': '充满变数与机遇，社交活动增多，适合创意与破局。',
  '巨门': '沟通交流为主，利于技术研发或学术，谨防口舌之争。',
  '廉贞': '竞争与突破并存，野心与创造力迸发，事業易有大跨越。',
  '天同': '安逸享乐期，心态平和，利于團隊協作及情感修復。',
  '天梁': '福德庇佑阶段，遇难呈祥，适合處理傳統事務或公益。',
  '天机': '智慧與計劃齊飛，思路敏捷，適合跨界嘗試及策劃工作。',
  '七杀': '開拓進取期，生活節奏加快，雖有波動但極具開創性。',
  '破军': '轉折與革新期，主動尋求變化，容易打破舊有僵局。'
};

const getInterpretation = (stars) => {
  if (!stars || stars.length === 0) return '此阶段运势相对平稳，适合潜心学习或沉淀积累。';
  const matched = stars.find(s => starInterpretations[s]);
  return matched ? starInterpretations[matched] : '星象汇聚，运势充满变数，宜稳扎稳打，寻找新的突破点。';
};

const calculate = () => {
  errorMsg.value = null;
  result.value = null;
  pastDecade.value = null;
  currentDecade.value = null;
  futureDecade.value = null;
  
  if (!astroModule) {
    errorMsg.value = '系统加载中，请稍等片刻再试。';
    return;
  }

  loading.value = true;

  try {
    const solarDateStr = birthDate.value;
    const timeIndex = parseInt(birthTime.value, 10);
    const genderStr = gender.value;

    console.log('[ZiWei] Input:', solarDateStr, timeIndex, genderStr);
    
    const board = astroModule.bySolar(solarDateStr, timeIndex, genderStr, true);
    
    console.log('[ZiWei] Board loaded:', board ? 'OK' : 'NULL');

    if (!board || !board.palaces) {
      throw new Error('排盘数据生成失败');
    }

    const nowYear = new Date().getFullYear();
    const birthYear = parseInt(solarDateStr.split('-')[0], 10);
    const currentAge = nowYear - birthYear + 1;

    console.log('[ZiWei] Age:', currentAge);

    // Get all decade ranges
    const allDecades = board.palaces.map(p => ({
      range: p.decadal ? p.decadal.range : [0, 0],
      palaceName: p.name || '未知',
      stars: p.majorStars ? p.majorStars.map(s => s.name) : []
    })).sort((a, b) => a.range[0] - b.range[0]);

    console.log('[ZiWei] Decades:', allDecades.map(d => d.range));

    // Find current decade
    let currentIdx = -1;
    for (let i = 0; i < allDecades.length; i++) {
      if (currentAge >= allDecades[i].range[0] && currentAge <= allDecades[i].range[1]) {
        currentIdx = i;
        break;
      }
    }

    console.log('[ZiWei] Current Index:', currentIdx);

    if (currentIdx === -1) {
      // Default to first decade if not found
      currentIdx = 0;
    }

    if (currentIdx > 0) {
      pastDecade.value = {
        ...allDecades[currentIdx - 1],
        desc: getInterpretation(allDecades[currentIdx - 1].stars)
      };
    }

    currentDecade.value = {
      ...allDecades[currentIdx],
      desc: getInterpretation(allDecades[currentIdx].stars)
    };

    if (currentIdx < allDecades.length - 1) {
      futureDecade.value = {
        ...allDecades[currentIdx + 1],
        desc: getInterpretation(allDecades[currentIdx + 1].stars)
      };
    }

    // Get soul palace stars
    const soulPalace = board.palaces.find(p => p.name === '命宫') || board.palaces[0];
    const soulPalaceStars = soulPalace && soulPalace.majorStars 
      ? soulPalace.majorStars.map(s => s.name).join(' ') 
      : '无主星';

    result.value = {
      displayDate: solarDateStr,
      zodiac: board.zodiac || '未知',
      sign: board.sign || '未知',
      soulPalaceStars
    };

  } catch (e) {
    console.error('[ZiWei] Error:', e);
    errorMsg.value = '排盘失败：' + (e.message || '未知错误');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.ziwei-calculator {
  margin: 2rem 0;
  color: var(--vp-c-text-1);
}

.card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.error-box {
  background: #fef2f2;
  border-color: #fecaca;
  color: #dc2626;
}

.section-title {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: var(--vp-c-brand-1);
  font-size: 1.4rem;
  text-align: center;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-item label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.form-item input, .form-item select {
  width: 100%;
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.radio-group {
  display: flex;
  gap: 1.5rem;
  padding: 0.5rem 0;
}

.calc-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, var(--vp-c-brand-1) 0%, #a855f7 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.calc-btn:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(99, 102, 241, 0.4);
}

.calc-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.board-header {
  border-left: 5px solid var(--vp-c-brand-1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 1.2rem;
}

.badge {
  background: var(--vp-c-brand-1);
  color: white;
  padding: 2px 10px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
}

.info-text { font-weight: 600; font-size: 1.05rem; }

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  text-align: center;
}

.label { font-size: 0.75rem; color: var(--vp-c-text-2); margin-bottom: 6px; }
.value { font-weight: bold; font-size: 1.15rem; }
.primary-stars { color: var(--vp-c-brand-1); }

.fortune-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.2rem;
}

.fortune-card {
  position: relative;
  overflow: hidden;
}

.highlight {
  border: 2px solid var(--vp-c-brand-1) !important;
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.15) !important;
}

.card-tag {
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: 800;
  color: var(--vp-c-brand-1);
  margin-bottom: 1rem;
  letter-spacing: 0.05em;
}

.decade-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
}

.age-range { font-weight: 700; font-size: 1.25rem; }
.palace-name { color: var(--vp-c-text-2); font-weight: 500; }

.stars-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 1rem;
}

.star-badge {
  background: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  padding: 3px 10px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
}

.star-badge.highlight {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

.interpretation {
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--vp-c-text-2);
}

.disclaimer {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  text-align: center;
  margin-top: 2rem;
  font-style: italic;
}

.empty-state {
  text-align: center;
  color: var(--vp-c-text-3);
  padding: 2rem 1rem;
  font-size: 0.9rem;
}

@media (max-width: 640px) {
  .summary-grid { grid-template-columns: 1fr; }
  .fortune-section { grid-template-columns: 1fr; }
}
</style>
