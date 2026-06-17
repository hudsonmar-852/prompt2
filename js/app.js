const $ = (id) => document.getElementById(id);
const storageKey = 'prompt2.history.v3';

function init() {
  renderTypeOptions();
  renderFeatures();
  renderTemplates();
  renderHistory();
  bindEvents();
  loadTemplate('image', false);
}

function bindEvents() {
  $('type').addEventListener('change', (event) => loadTemplate(event.target.value));
  $('generateBtn').addEventListener('click', generatePrompt);
  $('improveBtn').addEventListener('click', improvePrompt);
  $('clearBtn').addEventListener('click', clearAll);
  $('copyBtn').addEventListener('click', copyOutput);
  $('saveBtn').addEventListener('click', savePrompt);
  $('exportBtn').addEventListener('click', exportPrompt);
  $('markdownBtn').addEventListener('click', copyMarkdown);
}

function renderTypeOptions() {
  $('type').innerHTML = Object.entries(window.PROMPT2_TEMPLATES)
    .map(([key, item]) => `<option value="${key}">${item.label}</option>`)
    .join('');
}

function renderFeatures() {
  $('featureGrid').innerHTML = window.PROMPT2_FEATURES.map((item) => `
    <button class="feature" data-type="${item.key}">
      <h3>${item.title} <span class="muted">${item.version}</span></h3>
      <p>${item.body}</p>
    </button>
  `).join('');
  document.querySelectorAll('.feature').forEach((button) => button.addEventListener('click', () => loadTemplate(button.dataset.type)));
}

function renderTemplates() {
  $('templateGrid').innerHTML = Object.entries(window.PROMPT2_TEMPLATES).map(([key, item]) => `
    <button class="template-card" data-type="${key}">
      <h3>${item.label}</h3>
      <p>${item.description}</p>
    </button>
  `).join('');
  document.querySelectorAll('.template-card').forEach((button) => button.addEventListener('click', () => loadTemplate(button.dataset.type)));
}

function loadTemplate(type, scroll = true) {
  const template = window.PROMPT2_TEMPLATES[type];
  $('type').value = type;
  $('idea').value = template.starter;
  $('include').value = template.rules.join('; ');
  $('avoid').value = 'unclear output, generic wording, unsupported claims, broken formatting';
  setStatus(`${template.label} template loaded.`);
  highlightFeature(type);
  if (scroll) $('builder').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function highlightFeature(type) {
  document.querySelectorAll('.feature').forEach((button) => button.classList.toggle('active', button.dataset.type === type));
}

function generatePrompt() {
  const type = $('type').value;
  const template = window.PROMPT2_TEMPLATES[type];
  const idea = $('idea').value.trim();
  const tone = $('tone').value;
  const format = $('format').value;
  const model = $('model').value.trim();
  const include = $('include').value.trim();
  const avoid = $('avoid').value.trim();

  if (!idea) {
    setStatus('Please add a rough idea first.');
    return;
  }

  const output = `R — Role\n${template.role}\n\nB — Background\nTarget tool: ${model || 'Selected AI tool'}\nPrompt type: ${template.label}\nTone: ${tone}\nContext: ${idea}\n\nN — Need\nTurn the rough idea into a clear, reusable and execution-ready instruction. The result should be specific enough for direct use and structured enough for future reuse.\n\nO — Output\nFormat: ${format}\nReturn the final answer in a clean copy-ready structure.\n\nMust include:\n${include || template.rules.join('; ')}\n\nMust avoid:\n${avoid || 'vague wording and unsupported claims'}\n\nQuality checklist:\n- Clear subject and objective\n- Specific context and constraints\n- Reusable structure\n- Practical output format\n- No unnecessary filler\n\nFinal reusable instruction:\nCreate a ${format.toLowerCase()} for ${model || 'the selected AI tool'} based on this idea: "${idea}". Use a ${tone.toLowerCase()} tone. Include these requirements: ${include || template.rules.join('; ')}. Avoid these issues: ${avoid || 'vague wording and unsupported claims'}. Return only the usable final output.`;

  $('output').textContent = output;
  scorePrompt(output);
  renderTags(type, tone, format);
  setStatus('Converted.');
}

function improvePrompt() {
  if ($('output').textContent.startsWith('Choose a type')) generatePrompt();
  const improved = `${$('output').textContent}\n\nEnhancement Layer:\n- Add one practical example if useful.\n- Add acceptance criteria for checking the result.\n- Keep the final instruction short enough to reuse.\n- Make the output measurable, not just descriptive.`;
  $('output').textContent = improved;
  scorePrompt(improved);
  setStatus('Improved.');
}

async function copyOutput() {
  await navigator.clipboard.writeText($('output').textContent);
  setStatus('Copied.');
}

async function copyMarkdown() {
  await navigator.clipboard.writeText('```text\n' + $('output').textContent + '\n```');
  setStatus('Copied as Markdown.');
}

function savePrompt() {
  const output = $('output').textContent.trim();
  if (!output || output.startsWith('Choose a type')) {
    setStatus('Nothing to save yet.');
    return;
  }
  const history = getHistory();
  history.unshift({ type: $('type').value, output, createdAt: new Date().toISOString() });
  localStorage.setItem(storageKey, JSON.stringify(history.slice(0, 5)));
  renderHistory();
  setStatus('Saved locally.');
}

function getHistory() {
  try { return JSON.parse(localStorage.getItem(storageKey)) || []; }
  catch { return []; }
}

function renderHistory() {
  const history = getHistory();
  $('history').innerHTML = history.length ? history.map((item, index) => `
    <button data-index="${index}">${item.type.toUpperCase()} · ${new Date(item.createdAt).toLocaleString()}<br><span class="muted">${item.output.slice(0, 78)}...</span></button>
  `).join('') : '<p class="muted">No saved prompts yet.</p>';
  document.querySelectorAll('#history button').forEach((button) => {
    button.addEventListener('click', () => {
      const item = getHistory()[button.dataset.index];
      $('output').textContent = item.output;
      $('type').value = item.type;
      scorePrompt(item.output);
      setStatus('Saved item loaded.');
    });
  });
}

function exportPrompt() {
  const blob = new Blob([$('output').textContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `prompt2-${$('type').value}-${Date.now()}.txt`;
  link.click();
  URL.revokeObjectURL(url);
  setStatus('Exported as text file.');
}

function clearAll() {
  ['idea', 'include', 'avoid'].forEach((id) => $(id).value = '');
  $('output').textContent = 'Choose a type, paste your rough idea, then convert.';
  ['clarity','control','reuse','safety'].forEach((id) => $(id).textContent = '0');
  $('tags').innerHTML = '';
  setStatus('Cleared.');
}

function scorePrompt(text) {
  const lengthScore = Math.min(100, Math.round(text.length / 12));
  $('clarity').textContent = Math.min(96, lengthScore);
  $('control').textContent = text.includes('Must include') ? 92 : 70;
  $('reuse').textContent = text.includes('R — Role') ? 95 : 75;
  $('safety').textContent = text.includes('Must avoid') ? 90 : 68;
}

function renderTags(type, tone, format) {
  $('tags').innerHTML = [type, tone, format, 'RBNO', 'v3.0'].map((tag) => `<span class="pill">${tag}</span>`).join('');
}

function setStatus(message) {
  $('status').textContent = message;
}

window.addEventListener('DOMContentLoaded', init);