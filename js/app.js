const $ = (id) => document.getElementById(id);
const schema = window.PROMPT2_SCHEMA;
let currentRecords = [];
let currentFilter = 'All';

function init() {
  renderCategoryOptions();
  renderFeatures();
  renderCatalogue();
  renderFilters();
  renderHistory();
  renderRecordsOutput();
  bindEvents();
  loadStarter();
}

function bindEvents() {
  $('analyseBtn').addEventListener('click', analysePrompt);
  $('buildBtn').addEventListener('click', buildFinalPrompt);
  $('clearBtn').addEventListener('click', clearAll);
  $('copyAnalysisBtn').addEventListener('click', () => copyText($('analysis').innerText, 'Analysis copied.'));
  $('saveBtn').addEventListener('click', saveRecords);
  $('exportJsonBtn').addEventListener('click', exportJson);
  $('copyJsonBtn').addEventListener('click', () => copyText(JSON.stringify(currentRecords, null, 2), 'JSON copied.'));
  $('copyAllBtn').addEventListener('click', () => copyText(JSON.stringify(getStoredRecords(), null, 2), 'All records copied.'));
  $('resetBtn').addEventListener('click', resetRecords);
}

function renderCategoryOptions() {
  const options = ['Auto', ...Object.keys(schema.categories)];
  $('defaultCategory').innerHTML = options.map((item) => `<option value="${item}">${item}</option>`).join('');
}

function renderFeatures() {
  const grid = document.querySelector('#catalogueGrid');
  if (!grid) return;
}

function renderCatalogue() {
  $('catalogueGrid').innerHTML = Object.entries(schema.categories).map(([category, subs]) => `
    <article class="catalogue-card">
      <h3>${category}</h3>
      <p>${subs.join(' · ')}</p>
    </article>
  `).join('');
}

function renderFilters() {
  const filters = ['All', 'Image', 'Video', 'Character', 'Action', 'Environment', 'Lighting', 'Composition', 'Workflow'];
  $('filters').innerHTML = filters.map((item) => `<button class="btn small filter ${item === currentFilter ? 'active' : ''}" data-filter="${item}">${item}</button>`).join('');
  document.querySelectorAll('.filter').forEach((button) => button.addEventListener('click', () => {
    currentFilter = button.dataset.filter;
    renderFilters();
    renderAnalysis();
  }));
}

function loadStarter() {
  $('promptInput').value = `同一人物（Identity Lock）\n同一五官結構\n自然微笑表情\nNatural Sun-Kissed Tan\nGolden Bronze Skin Tone\nRealistic skin pores and micro texture\nStrong jawline\nDeep-set eyes\nHigh cheekbones\nStraight nose bridge\nShort black hair\nWarm amber directional lighting\nFull-Frame 85mm portrait lens\nShallow depth of field\nLuxury hotel suite ambience\nStatic camera\nSlow cinematic push-in\nExport JSON to GitHub record\nAuto classify prompt phrases into catalogue`;
}

function analysePrompt() {
  const sourcePrompt = $('promptInput').value.trim();
  if (!sourcePrompt) return setStatus('Please paste prompt content first.');
  const lines = sourcePrompt.split(/\n|;|•/).map(cleanPhrase).filter(Boolean);
  currentRecords = lines.map((phrase, index) => createRecord(phrase, sourcePrompt, index));
  renderAnalysis();
  setStatus(`${currentRecords.length} phrase records generated.`);
}

function cleanPhrase(text) {
  return text.replace(/^[-*\d.)\s]+/, '').replace(/\s+/g, ' ').trim();
}

function createRecord(phrase, sourcePrompt, index) {
  const match = classifyPhrase(phrase);
  const now = new Date();
  const platform = $('platform').value === 'Auto' ? match.platform : $('platform').value;
  return {
    id: `PROMPT-${String(Date.now()).slice(-6)}-${String(index + 1).padStart(2, '0')}`,
    date: now.toISOString().slice(0, 10),
    sourcePrompt,
    usefulPhrase: phrase,
    category: match.category,
    subcategory: match.subcategory,
    useCase: match.useCase,
    platform: [platform],
    tags: match.tags,
    qualityScore: match.qualityScore,
    status: 'active',
    language: detectLanguage(phrase),
    identityLock: match.identityLock,
    exampleSegment: match.exampleSegment || phrase,
    relatedPhrases: [],
    usageCount: 0,
    lastUsed: '',
    notes: match.notes,
    similarPhrases: match.similar,
    oppositePhrases: match.opposite,
    worksWith: match.worksWith,
    promptWeight: match.qualityScore >= 5 ? 'high' : match.qualityScore >= 3 ? 'medium' : 'low',
    createdBy: 'Prompt Master v2.0',
    sourceProject: 'prompt2',
    version: schema.version,
    updatedAt: now.toISOString()
  };
}

function classifyPhrase(raw) {
  const p = raw.toLowerCase();
  const forced = $('defaultCategory').value;
  const rules = [
    [/identity|same person|同一人物|face lock|身份|臉/i, 'Character', 'Identity Anchor', 'Identity consistency phrase', ['identity-lock','character','face-lock'], 5, 'strict', ['same facial identity','consistent character','face lock'], ['different person','face drift','identity change'], ['facial structure','same age','expression']],
    [/五官|facial structure|jawline|cheekbone|eyes|nose|hair|mouth|smile|眼|鼻|顴骨|下顎|頭髮|微笑/i, 'Character', 'Face Lock', 'Facial feature control', ['facial-features','identity','portrait'], 5, 'strict', ['facial geometry','feature lock','defined features'], ['altered features','wrong face','face drift'], ['eyes','nose','mouth','jawline']],
    [/skin|tan|bronze|pores|texture|perspiration|膚|毛孔|古銅|汗|光澤/i, 'Image', 'Skin', 'Photorealistic skin rendering', ['skin','photorealistic','warm-bronze'], 5, 'medium', ['warm bronze skin','natural skin texture','micro pores'], ['plastic skin','over-smoothed skin','flat skin'], ['soft lighting','high resolution','subtle sheen']],
    [/light|lighting|amber|golden|shadow|highlight|燈|光|色彩/i, 'Lighting', 'Warm Premium', 'Lighting and colour control', ['lighting','warm-premium','golden-highlight'], 5, 'none', ['warm directional light','soft studio light','golden highlight'], ['flat lighting','harsh flash','cold lighting'], ['skin texture','shadow','camera']],
    [/85mm|lens|camera|depth of field|bokeh|frame|composition|鏡頭|景深|構圖/i, 'Composition', 'Portrait', 'Camera, lens and framing control', ['camera','lens','composition'], 5, 'none', ['portrait lens','shallow depth of field','clean framing'], ['wide-angle distortion','busy background','cropped subject'], ['lighting','portrait','background']],
    [/hotel|office|gym|suite|street|hong kong|background|環境|酒店|健身|街|香港|背景/i, 'Environment', 'Indoor', 'Scene and ambience phrase', ['environment','scene','ambience'], 4, 'none', ['premium ambience','clean background','contextual setting'], ['messy background','wrong environment'], ['lighting','props','composition']],
    [/static camera|push-in|motion|transition|ending|loop|慢|影片|鏡頭運動/i, 'Video', 'Camera Movement', 'Video motion control', ['video','camera-motion','continuity'], 5, 'none', ['slow push-in','steady camera','controlled motion'], ['shaky zoom','random camera movement'], ['ending frame','scene continuity','subject motion']],
    [/export|json|github|classify|catalogue|workflow|automation|archive|匯出|分類|流程|自動/i, 'Workflow', 'GitHub Prompt Builder', 'Automation and archive logic', ['workflow','json','github','automation'], 5, 'none', ['JSON export','database archive','auto classification'], ['temporary draft','lost local input'], ['Google Sheets','localStorage','version history']],
    [/clothing|shirt|suit|sportswear|outfit|衣|西裝|運動服/i, 'Clothing', 'Smart Casual', 'Outfit and styling phrase', ['clothing','styling'], 3, 'none', ['smart casual outfit','sportswear styling'], ['wrong outfit','inconsistent styling'], ['character','environment','pose']],
    [/gesture|pose|action|movement|embrace|walk|run|姿勢|動作|抱|行|跑/i, 'Action', 'Movement', 'Action or pose phrase', ['action','pose','movement'], 4, 'none', ['natural gesture','controlled movement'], ['awkward pose','stiff action'], ['camera','composition','expression']]
  ];
  const found = rules.find(([regex]) => regex.test(p));
  const base = found || [null, forced !== 'Auto' ? forced : 'Image', 'General', 'General reusable prompt phrase', ['general','prompt'], 3, 'none', ['related phrase'], ['conflicting phrase'], ['clear context']];
  return {
    category: forced !== 'Auto' && !found ? forced : base[1],
    subcategory: base[2],
    useCase: base[3],
    tags: base[4],
    qualityScore: base[5],
    identityLock: base[6],
    similar: base[7],
    opposite: base[8],
    worksWith: base[9],
    platform: base[1] === 'Video' ? 'Kling' : base[1] === 'Workflow' ? 'GitHub Prompt Builder' : 'ChatGPT Image',
    notes: `${base[3]}. Best used as a reusable ${base[1]} / ${base[2]} phrase.`,
    exampleSegment: raw
  };
}

function detectLanguage(text) {
  if (/[\u4e00-\u9fff]/.test(text) && /[a-z]/i.test(text)) return 'bilingual';
  if (/[\u4e00-\u9fff]/.test(text)) return 'zh-HK';
  return 'en';
}

function renderAnalysis() {
  const records = currentFilter === 'All' ? currentRecords : currentRecords.filter((r) => r.category === currentFilter || r.subcategory === currentFilter);
  if (!records.length) {
    $('analysis').className = 'analysis empty';
    $('analysis').textContent = currentRecords.length ? 'No records under this filter.' : 'Paste prompt content and click Analyse Now.';
    return;
  }
  $('analysis').className = 'analysis';
  $('analysis').innerHTML = records.map(renderCard).join('');
}

function renderCard(r) {
  const compact = $('detailMode').value === 'Compact';
  const title = $('displayMode').value === 'Chinese' ? translateMeaning(r) : r.usefulPhrase;
  return `<article class="phrase-card">
    <div class="card-head"><h3>${title}</h3><span>${r.qualityScore}/5</span></div>
    <p class="meaning">中文意思：${translateMeaning(r)}</p>
    <div class="meta"><b>${r.category}</b><span>${r.subcategory}</span><span>${r.identityLock}</span></div>
    ${compact ? '' : `<p>${r.notes}</p><dl><dt>Similar</dt><dd>${r.similarPhrases.join(' · ')}</dd><dt>Opposite</dt><dd>${r.oppositePhrases.join(' · ')}</dd><dt>Works With</dt><dd>${r.worksWith.join(' · ')}</dd><dt>Tags</dt><dd>${r.tags.join(', ')}</dd></dl>`}
  </article>`;
}

function translateMeaning(r) {
  const map = {
    'Identity Anchor': '身份鎖定及同一人物控制',
    'Face Lock': '五官結構及面部特徵控制',
    Skin: '膚色、毛孔及真實皮膚質感',
    'Warm Premium': '高級暖色燈光及金色高光',
    Portrait: '人像鏡頭、構圖及景深控制',
    Indoor: '室內場景、背景及環境氛圍',
    'Camera Movement': '影片鏡頭運動及連續性控制',
    'GitHub Prompt Builder': 'GitHub、JSON、分類及自動化歸檔',
    Movement: '姿勢、動作及身體語言',
    'Smart Casual': '服裝、造型及配件控制',
    General: '一般可重用提示詞片語'
  };
  return map[r.subcategory] || map[r.category] || '可重用提示詞片語';
}

function buildFinalPrompt() {
  if (!currentRecords.length) analysePrompt();
  const grouped = schema.builderOrder.map((cat) => [cat, currentRecords.filter((r) => r.category === cat)]).filter(([, list]) => list.length);
  const finalPrompt = grouped.map(([cat, list]) => `${cat}:\n${list.map((r) => `- ${r.exampleSegment}`).join('\n')}`).join('\n\n');
  $('analysis').className = 'analysis';
  $('analysis').innerHTML = `<pre class="output">${finalPrompt}</pre>`;
  setStatus('Final prompt built by v2 visual order.');
}

function saveRecords() {
  if (!currentRecords.length) return setStatus('Nothing to save yet.');
  const stored = getStoredRecords();
  const next = [...currentRecords, ...stored].slice(0, 500);
  localStorage.setItem(schema.storageKey, JSON.stringify(next));
  renderHistory();
  renderRecordsOutput();
  setStatus('Submitted to local records. Export JSON for GitHub / Google Drive archive.');
}

function getStoredRecords() {
  try { return JSON.parse(localStorage.getItem(schema.storageKey)) || []; } catch { return []; }
}

function renderHistory() {
  const records = getStoredRecords().slice(0, 12);
  $('history').innerHTML = records.length ? records.map((r, i) => `<button data-i="${i}">${r.category} · ${r.subcategory}<br><span class="muted">${r.usefulPhrase.slice(0, 78)}</span></button>`).join('') : '<p class="muted">No saved records yet.</p>';
  document.querySelectorAll('#history button').forEach((button) => button.addEventListener('click', () => {
    currentRecords = [getStoredRecords()[button.dataset.i]];
    renderAnalysis();
  }));
}

function renderRecordsOutput() {
  $('recordsOutput').textContent = JSON.stringify(getStoredRecords(), null, 2);
}

function exportJson() {
  const payload = JSON.stringify(currentRecords.length ? currentRecords : getStoredRecords(), null, 2);
  const blob = new Blob([payload], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `prompt2-records-v2-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
  setStatus('Exported JSON.');
}

function resetRecords() {
  localStorage.removeItem(schema.storageKey);
  renderHistory();
  renderRecordsOutput();
  setStatus('Local records reset.');
}

function clearAll() {
  $('title').value = '';
  $('promptInput').value = '';
  currentRecords = [];
  renderAnalysis();
  setStatus('Cleared.');
}

async function copyText(text, message) {
  await navigator.clipboard.writeText(text || '');
  setStatus(message);
}

function setStatus(message) {
  $('status').textContent = message;
}

window.addEventListener('DOMContentLoaded', init);