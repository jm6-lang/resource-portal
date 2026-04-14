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

    <div v-if="result" class="result-section">
      <!-- 核心看板 -->
      <div class="board-header card">
        <div class="user-info">
          <span class="badge">{{ gender === 'male' ? '乾造' : '坤造' }}</span>
          <span class="info-text">{{ birthDate }} {{ timeNames[birthTime] }}时生</span>
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
            <div class="value primary-stars">{{ getMainStars(result.palaces[result.meIndex]) }}</div>
          </div>
        </div>
      </div>

      <!-- 十年运势 -->
      <div class="fortune-section">
        <div class="fortune-card past card">
          <div class="card-tag">前十年运势 (上个大限)</div>
          <div v-if="pastDecade" class="fortune-content">
            <div class="decade-info">
              <span class="age-range">{{ pastDecade.range[0] }} - {{ pastDecade.range[1] }} 岁</span>
              <span class="palace-name">{{ pastDecade.palace.name }}</span>
            </div>
            <div class="stars-row">
              <span v-for="star in pastDecade.stars" :key="star" class="star-badge">{{ star }}</span>
            </div>
            <p class="interpretation">{{ pastDecade.desc }}</p>
          </div>
          <div v-else class="empty-state">尚无记录</div>
        </div>

        <div class="fortune-card current card highlight">
          <div class="card-tag">当前十年运势 (本大限)</div>
          <div v-if="currentDecade" class="fortune-content">
            <div class="decade-info">
              <span class="age-range">{{ currentDecade.range[0] }} - {{ currentDecade.range[1] }} 岁</span>
              <span class="palace-name">{{ currentDecade.palace.name }}</span>
            </div>
            <div class="stars-row">
              <span v-for="star in currentDecade.stars" :key="star" class="star-badge highlight">{{ star }}</span>
            </div>
            <p class="interpretation">{{ currentDecade.desc }}</p>
          </div>
        </div>

        <div class="fortune-card future card">
          <div class="card-tag">未来十年运势 (下个大限)</div>
          <div v-if="futureDecade" class="fortune-content">
            <div class="decade-info">
              <span class="age-range">{{ futureDecade.range[0] }} - {{ futureDecade.range[1] }} 岁</span>
              <span class="palace-name">{{ futureDecade.palace.name }}</span>
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
import { ref } from 'vue';
import { astro } from 'iztro';

const birthDate = ref('1990-01-01');
const birthTime = ref(0);
const gender = ref('male');
const result = ref(null);
const loading = ref(false);

const pastDecade = ref(null);
const currentDecade = ref(null);
const futureDecade = ref(null);

const timeNames = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

const starInterpretations = {
  '紫微': '此阶段利于事业攀升，易得长辈或贵人相助，名声渐起。',
  '天府': '财运稳健，理财投资易有收获，生活安逸，适合积累。',
  '武曲': '求财动力强，凡事亲力亲为，虽辛苦但收获颇丰。',
  '天相': '人际关系和谐，适合辅助性质的工作，平稳中求发展。',
  '太阳': '充满朝气，利于向外拓展名气，男性贵人助力大。',
  '太阴': '情感细腻，财源来自于稳定工作，注意女性亲属关系。',
  '贪狼': '机会较多，社交活动频繁，适合创意与交际类事务。',
  '巨门': '利于口才、技术或学术研究，需注意言语纠纷。',
  '廉贞': '野心勃勃，竞争心强，事业易有大的突破和变动。',
  '天同': '福气较好，心态平和，适合守成或团队协作。',
  '天梁': '遇难呈祥，易得长辈关照，适合处理法律或传统事务。',
  '天机': '头脑灵活，计划多变，适合脑力劳动和新领域探索。',
  '七杀': '敢打敢拼，事业面临大的开创机会，波动中前行。',
  '破军': '破旧立新，人生面临重大转型，需谨慎应对变局。'
};

const getMainStars = (palace) => {
  if (!palace || !palace.majorStars) return '无主星';
  return palace.majorStars.map(s => s.name).join(' ');
};

const getInterpretation = (stars) => {
  if (stars.length === 0) return '此阶段运势平稳，适合潜心学习。';
  const matched = stars.find(s => starInterpretations[s]);
  return matched ? starInterpretations[matched] : '星象汇聚，运势多变，宜稳中求进。';
};

const calculate = () => {
  loading.value = true;
  result.value = null;
  
  setTimeout(() => {
    try {
      const board = astro.bySolar(birthDate.value, birthTime.value, gender.value, true);
      const nowYear = new Date().getFullYear();
      
      // Find current decade
      const decadePalace = board.palaces.find(p => p.decades[0] <= (nowYear - board.birthYear) && p.decades[1] >= (nowYear - board.birthYear));
      const decadeIdx = board.palaces.indexOf(decadePalace);
      
      // Iztro's decades mapping is complex, let's simplify for the "past/future" request
      // We'll iterate all palaces and find the sequence of decades
      const allDecades = board.palaces.map(p => ({
        range: p.decades,
        palace: p,
        stars: p.majorStars.map(s => s.name)
      })).sort((a, b) => a.range[0] - b.range[0]);

      const currentIdx = allDecades.findIndex(d => d.range[0] <= (nowYear - board.birthYear) && d.range[1] >= (nowYear - board.birthYear));

      pastDecade.value = currentIdx > 0 ? {
        ...allDecades[currentIdx - 1],
        desc: getInterpretation(allDecades[currentIdx - 1].stars)
      } : null;

      currentDecade.value = {
        ...allDecades[currentIdx],
        desc: getInterpretation(allDecades[currentIdx].stars)
      };

      futureDecade.value = currentIdx < allDecades.length - 1 ? {
        ...allDecades[currentIdx + 1],
        desc: getInterpretation(allDecades[currentIdx + 1].stars)
      } : null;

      result.value = {
        zodiac: board.zodiac,
        sign: board.sign,
        palaces: board.palaces,
        meIndex: board.meIndex,
        birthYear: board.birthYear
      };
    } catch (e) {
      console.error(e);
      alert('排盘失败，请检查日期输入是否正确。');
    } finally {
      loading.value = false;
    }
  }, 600);
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
  transition: transform 0.3s ease;
}

.section-title {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: var(--vp-c-brand-1);
  font-size: 1.4rem;
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

/* Result Styles */
.board-header {
  border-left: 5px solid var(--vp-c-brand-1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 1rem;
}

.badge {
  background: var(--vp-c-brand-1);
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
}

.info-text { font-weight: bold; }

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  text-align: center;
}

.label { font-size: 0.75rem; color: var(--vp-c-text-2); margin-bottom: 4px; }
.value { font-weight: bold; font-size: 1.1rem; }
.primary-stars { color: var(--vp-c-brand-1); }

.fortune-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.fortune-card {
  position: relative;
  overflow: hidden;
}

.highlight {
  border: 2px solid var(--vp-c-brand-1) !important;
  transform: scale(1.02);
}

.card-tag {
  font-size: 0.7rem;
  text-transform: uppercase;
  font-weight: 800;
  color: var(--vp-c-brand-1);
  margin-bottom: 1rem;
}

.decade-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
}

.age-range { font-weight: bold; font-size: 1.2rem; }
.palace-name { color: var(--vp-c-text-2); }

.stars-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 1rem;
}

.star-badge {
  background: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.85rem;
}

.star-badge.highlight {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

.interpretation {
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

.disclaimer {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  text-align: center;
  margin-top: 2rem;
}

.empty-state {
  text-align: center;
  color: var(--vp-c-text-3);
  padding: 1rem;
}

@media (max-width: 640px) {
  .summary-grid { grid-template-columns: 1fr; }
  .highlight { transform: none; }
}
</style>
