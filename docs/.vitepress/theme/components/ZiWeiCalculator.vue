</script>

<script setup lang="ts">
import { ref } from 	 'vue'

const birthDate = ref('1990-01-01')
const birthTime = ref(0)
const gender = ref('male')
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
    if ((window as any).iztro) {
      // UMD module exports a function, call it to get the module object
      _iztroLoaded = (window as any).iztro()
      resolve(_iztroLoaded)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/iztro@2.5.8/dist/iztro.min.js'
    script.onload = () => {
      _iztroLoaded = (window as any).iztro()
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
    // Load iztro from local CDN bundle (bypasses Vite SSR bundling issues)
    const astro = await loadIztro()

    const board = astro.bySolar(birthDate.value, birthTime.value, gender.value, true)

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
    const birthYear = parseInt(birthDate.value.substring(0, 4), 10)
    const age = currentYear - birthYear + 1 // 虚岁

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
