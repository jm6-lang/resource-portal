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
              <option v-for="(m, i) in lunarMonths" :key="i" :value="i+1">{{ m }}</option>
            </select>
            <select v-model="lunarDay">
              <option v-for="(d, i) in lunarDays" :key="i" :value="i+1">{{ d }}</option>
            </select>
            <label class="leap-checkbox"><input type="checkbox" v-model="isLeapMonth" /> 闰月</label>
          </div>
        </div>
        <div class="form-item">
          <label>出生时辰</label>
          <select v-model="birthTime">
            <option v-for="(name, index) in timeNames" :key="index" :value="index">
              {{ name }} ({{ String(2 * index).padStart(2, '0') }}:00 - {{ String(2 * index + 1).padStart(2, '0') }}:59)
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
      <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>
      <button @click="calculate" class="calc-btn" :disabled="loading">
        {{ loading ? '计算中...' : '立即排盘' }}
      </button>
    </div>

    <div v-if="result" class="result-section">
      <!-- 核心看板 -->
      <div class="board-header card">
        <div class="user-info">
          <span class="badge">{{ gender === 'male' ? '乾造' : '坤造' }}</span>
          <span class="info-text">
            {{ result.solarDate.year }}年{{ result.solarDate.month }}月{{ result.solarDate.day }}日
            {{ timeNames[birthTime] }}时生
          </span>
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

      <!-- 十二宫概览 -->
      <div class="palaces-overview card">
        <h4 class="palaces-title">十二宫星曜</h4>
        <div class="palaces-grid">
          <div
            v-for="palace in result.palaces"
            :key="palace.name"
            class="palace-item"
            :class="{ 'current-palace': palace.isCurrentDecade }"
          >
            <div class="palace-name">{{ palace.name }}</div>
            <div class="palace-stars">
              <span
                v-for="star in palace.stars.slice(0, 4)"
                :key="star"
                class="star-tag"
              >{{ star }}</span>
              <span v-if="palace.stars.length === 0" class="star-empty">无主星</span>
            </div>
            <div class="palace-range">{{ palace.decadeRange }}</div>
          </div>
        </div>
      </div>

      <!-- 十年运势 -->
      <div class="fortune-section">
        <div class="fortune-card past card">
          <div class="card-tag">前一个大限 (回顾过去)</div>
          <div v-if="pastDecade" class="fortune-content">
            <div class="decade-info">
              <span class="age-range">{{ pastDecade.range[0] }} - {{ pastDecade.range[1] }} 岁</span>
              <span class="palace-name">{{ pastDecade.palaceName }}</span>
            </div>
            <div class="stars-row">
              <span v-for="star in pastDecade.stars" :key="star" class="star-badge">{{ star }}</span>
              <span v-if="pastDecade.stars.length === 0" class="star-badge empty">无主星</span>
            </div>
            <p class="interpretation">{{ pastDecade.desc }}</p>
          </div>
          <div v-else class="empty-state">尚在幼年或无上大限</div>
        </div>

        <div class="fortune-card current card highlight">
          <div class="card-tag">当前大限 (正在经历)</div>
          <div v-if="currentDecade" class="fortune-content">
            <div class="decade-info">
              <span class="age-range">{{ currentDecade.range[0] }} - {{ currentDecade.range[1] }} 岁</span>
              <span class="palace-name current-label">{{ currentDecade.palaceName }}</span>
            </div>
            <div class="stars-row">
              <span v-for="star in currentDecade.stars" :key="star" class="star-badge highlight">{{ star }}</span>
              <span v-if="currentDecade.stars.length === 0" class="star-badge empty">无主星</span>
            </div>
            <p class="interpretation">{{ currentDecade.desc }}</p>
          </div>
          <div v-else class="empty-state">当前不在大限范围内</div>
        </div>

        <div class="fortune-card future card">
          <div class="card-tag">下一个大限 (展望未来)</div>
          <div v-if="futureDecade" class="fortune-content">
            <div class="decade-info">
              <span class="age-range">{{ futureDecade.range[0] }} - {{ futureDecade.range[1] }} 岁</span>
              <span class="palace-name">{{ futureDecade.palaceName }}</span>
            </div>
            <div class="stars-row">
              <span v-for="star in futureDecade.stars" :key="star" class="star-badge">{{ star }}</span>
              <span v-if="futureDecade.stars.length === 0" class="star-badge empty">无主星</span>
            </div>
            <p class="interpretation">{{ futureDecade.desc }}</p>
          </div>
          <div v-else class="empty-state">已过人生大限</div>
        </div>
      </div>

      <p class="disclaimer">⚠️ 注：以上分析基于传统紫微斗数安星算法，仅供参考，不作为生活决策依据。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const birthDate = ref('1990-01-01')
const birthTime = ref(0)
const lunarYear = ref(1990)
const lunarMonth = ref(1)
const lunarDay = ref(1)
const isLeapMonth = ref(false)
const gender = ref('male')
const years = Array.from({length: 100}, (_, i) => 1950 + i)
const lunarMonths = ['正月','二月','三月','四月','五月','六月','七月','八月','九月','十月','冬月','腊月']
const lunarDays = (() => {
  const d = []
  for (let i = 1; i <= 30; i++) d.push(i + '日')
  return d
})()
const result = ref<any>(null)
const loading = ref(false)
const errorMsg = ref('')

const pastDecade = ref<any>(null)
const currentDecade = ref<any>(null)
const futureDecade = ref<any>(null)

const timeNames = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']

const starInterpretations = {
  '紫微': '名望与事业的巅峰期，易得贵人提拔，地位显著提升。',
  '天府': '物质财富稳健积累期，利于理财与房产，生活富足。',
  '武曲': '实干求财阶段，行动力极强，虽劳心劳力但回报丰厚。',
  '天相': '和谐平衡期，适合从事协调、咨询工作，人缘极佳。',
  '太阳': '事业名声大振，活力四射，适合向外拓展和公众事务。',
  '太阴': '情感与财运并进，心思细腻，生活品位提升，利于女性。',
  '贪狼': '充满变数与机遇，社交活动增多，适合创意与破局。',
  '巨门': '沟通交流为主，利于技术研发或学术，谨防口舌之争。',
  '廉贞': '竞争与突破并存，野心与创造力迸发，事业易有大跨越。',
  '天同': '安逸享乐期，心态平和，利于团队协作及情感修复。',
  '天梁': '福德庇佑阶段，遇难呈祥，适合处理传统事务或公益。',
  '天机': '智慧与计划齐飞，思路敏捷，适合跨界尝试及策划工作。',
  '七杀': '开拓进取期，生活节奏加快，虽有波动但极具开创性。',
  '破军': '转折与革新期，主动寻求变化，容易打破旧有僵局。',
}

// Load iztro from unpkg CDN — bypasses Vite SSR bundling issue
let _iztroLoaded: any = null
async function loadIztro() {
  if (_iztroLoaded) return _iztroLoaded
  return new Promise((resolve, reject) => {
    const iztroGlobal = (window as any).iztro
    if (iztroGlobal) {
      // Handle both: iztro is a function (UMD) or already an object
      _iztroLoaded = typeof iztroGlobal === 'function' ? iztroGlobal() : iztroGlobal
      resolve(_iztroLoaded)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/iztro@2.5.8/dist/iztro.min.js'
    script.onload = () => {
      const iztroFn = (window as any).iztro
      console.log('[ZiWeiCalculator] iztro loaded, type:', typeof iztroFn)
      _iztroLoaded = typeof iztroFn === 'function' ? iztroFn() : iztroFn
      console.log('[ZiWeiCalculator] iztro module:', !!_iztroLoaded, Object.keys(_iztroLoaded || {}))
      resolve(_iztroLoaded)
    }
    script.onerror = () => reject(new Error('iztro 库加载失败，请检查网络连接'))
    document.head.appendChild(script)
  })
}


const getInterpretation = (stars: any) => {
  if (!stars || stars.length === 0) return '此阶段运势相对平稳，适合潜心学习或沉淀积累。'
  const matched = stars.find(s => starInterpretations[s])
  return matched
    ? starInterpretations[matched]
    : '星象汇聚，运势充满变数，宜稳扎稳打，寻找新的突破点。'
}

const calculate = async () => {
  loading.value = true
  errorMsg.value = ''
  result.value = null
  pastDecade.value = null
  currentDecade.value = null
  futureDecade.value = null

  // Small delay for UX
  await new Promise(r => setTimeout(r, 300))

  try {
    // Load iztro from unpkg CDN (bypasses Vite SSR bundling)
    const iztro = await loadIztro()
    console.log('[ZiWeiCalculator] iztro module keys:', Object.keys(iztro))
    const astroModule = iztro?.astro
    console.log('[ZiWeiCalculator] astro module:', !!astroModule, typeof astroModule?.byLunar)

    if (!astroModule || !astroModule.byLunar) {
      throw new Error('iztro库加载失败，请刷新页面重试')
    }

    // 尝试使用 bySolar (农历日期需转换为阳历)
    // 如果失败则尝试 byLunar
    let board = null
    try {
      // bySolar: (dateString, timeIndex, gender, isReverse?)
      // dateString 格式: "YYYY-MM-DD"
      const dateStr = `${lunarYear.value}-${String(lunarMonth.value).padStart(2, '0')}-${String(lunarDay.value).padStart(2, '0')}`
      console.log('[ZiWeiCalculator] trying bySolar:', dateStr, birthTime.value, gender.value)
      board = astroModule.bySolar(dateStr, birthTime.value, gender.value, true)
      console.log('[ZiWeiCalculator] bySolar result:', board)
    } catch (e) {
      console.log('[ZiWeiCalculator] bySolar failed:', e.message)
      console.log('[ZiWeiCalculator] trying byLunar instead...')
      // byLunar: (year, month, day, leapMonth?, timeIndex, gender, isReverse?)
      board = astroModule.byLunar(lunarYear.value, lunarMonth.value, lunarDay.value, isLeapMonth.value, birthTime.value, gender.value, true)
      console.log('[ZiWeiCalculator] byLunar result:', board)
    }

    console.log('[ZiWeiCalculator] final board:', board)

    if (!board || !board.palaces || board.palaces.length === 0) {
      throw new Error('排盘数据异常，请检查日期格式是否正确')
    }

    // Find soul palace (命宫)
    const soulPalace = board.palaces.find(p => p.name === '命宫') || board.palaces[0]
    const soulPalaceStars = soulPalace?.majorStars?.length
      ? soulPalace.majorStars.map(s => s.name).join('、')
      : '无主星'

    // Build all decades list from all palaces (each palace has one decadal info)
    const currentYear = new Date().getFullYear()
    const age = currentYear - lunarYear.value + 1 // 虚岁

    const allDecades = []
    const currentDecadePalaceIdx = -1

    for (let i = 0; i < board.palaces.length; i++) {
      const palace = board.palaces[i]
      const decadal = palace.decadal
      if (decadal && decadal.range) {
        allDecades.push({
          range: decadal.range,
          palaceName: palace.name,
          stars: palace.majorStars ? palace.majorStars.map(s => s.name) : [],
          palaceIdx: i,
        })
        if (age >= decadal.range[0] && age <= decadal.range[1]) {
          currentDecadePalaceIdx = allDecades.length - 1
        }
      }
    }

    // Sort by age range start
    allDecades.sort((a, b) => a.range[0] - b.range[0])

    // Build palaces overview
    const palacesOverview = board.palaces.map((palace, idx) => {
      const decadal = palace.decadal
      const stars = palace.majorStars ? palace.majorStars.map(s => s.name) : []
      const decadeRange = decadal && decadal.range
        ? `${decadal.range[0]}-${decadal.range[1]}岁`
        : ''
      const isCurrentDecade = decadal && decadal.range
        ? age >= decadal.range[0] && age <= decadal.range[1]
        : false
      return {
        name: palace.name,
        stars,
        decadeRange,
        isCurrentDecade,
      }
    })

    // Set past / current / future
    if (currentDecadePalaceIdx > 0) {
      const prev = allDecades[currentDecadePalaceIdx - 1]
      pastDecade.value = {
        ...prev,
        desc: getInterpretation(prev.stars),
      }
    }

    if (currentDecadePalaceIdx >= 0) {
      const curr = allDecades[currentDecadePalaceIdx]
      currentDecade.value = {
        ...curr,
        desc: getInterpretation(curr.stars),
      }
    } else {
      // Fallback: find the decade that contains current age
      const found = allDecades.find(d => age >= d.range[0] && age <= d.range[1])
      if (found) {
        currentDecade.value = {
          ...found,
          desc: getInterpretation(found.stars),
        }
      }
    }

    if (currentDecadePalaceIdx >= 0 && currentDecadePalaceIdx < allDecades.length - 1) {
      const next = allDecades[currentDecadePalaceIdx + 1]
      futureDecade.value = {
        ...next,
        desc: getInterpretation(next.stars),
      }
    }

    result.value = {
      solarDate: board.solarDate,
      zodiac: board.zodiac,
      sign: board.sign,
      soulPalaceStars,
      palaces: palacesOverview,
    }
  } catch (e) {
    console.error('[ZiWeiCalculator] Calculation error:', e)
    errorMsg.value = `排盘失败：${e.message || '请检查日期输入是否正确'}`
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.ziwei-calculator {
  margin: 2rem 0;
  color: var(--vp-c-text-1);
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
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

.lunar-inputs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.lunar-inputs select {
  width: auto;
  padding: 6px 10px;
  font-size: 0.9rem;
}
.leap-checkbox {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}
.form-item select {
  width: 100%;
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 1rem;
}

.radio-group {
  display: flex;
  gap: 1.5rem;
  padding: 0.5rem 0;
}

.error-msg {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.calc-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, var(--vp-c-brand-1) 0%, #a855f7 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: bold;
  font-size: 1.05rem;
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

/* Result Styles */
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

/* Palaces overview */
.palaces-overview {
  overflow-x: auto;
}

.palaces-title {
  margin: 0 0 1rem;
  font-size: 1rem;
  color: var(--vp-c-text-2);
}

.palaces-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.5rem;
}

.palace-item {
  background: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 0.6rem 0.5rem;
  text-align: center;
  font-size: 0.78rem;
  transition: all 0.2s;
}

.palace-item.current-palace {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.palace-name {
  font-weight: bold;
  margin-bottom: 4px;
  color: var(--vp-c-text-1);
}

.palace-stars {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  justify-content: center;
  margin-bottom: 3px;
}

.star-tag {
  font-size: 0.65rem;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg);
  padding: 1px 3px;
  border-radius: 3px;
}

.star-empty {
  font-size: 0.65rem;
  color: var(--vp-c-text-3);
}

.palace-range {
  font-size: 0.65rem;
  color: var(--vp-c-text-3);
}

/* Fortune Cards */
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
.current-label { color: var(--vp-c-brand-1); font-weight: bold; }

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

.star-badge.empty {
  color: var(--vp-c-text-3);
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

@media (max-width: 768px) {
  .summary-grid { grid-template-columns: 1fr; }
  .fortune-section { grid-template-columns: 1fr; }
  .palaces-grid { grid-template-columns: repeat(4, 1fr); }
}

@media (max-width: 480px) {
  .palaces-grid { grid-template-columns: repeat(3, 1fr); }
}
</style>
