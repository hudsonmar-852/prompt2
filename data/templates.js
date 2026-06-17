window.PROMPT2_TEMPLATES = {
  image: {
    label: 'Image Prompt',
    description: 'Brand-grade image prompt with identity, lighting and scene control.',
    role: 'You are a senior AI image prompt director.',
    starter: 'Create a realistic portrait / product / campaign image prompt.',
    rules: ['Define subject identity, scene, lighting, lens and composition.', 'Use positive constraints and clear visual language.', 'Include output ratio and realism requirements.']
  },
  video: {
    label: 'Video Prompt',
    description: 'Short-form video prompt with action, camera and ending frame logic.',
    role: 'You are a cinematic AI video prompt director.',
    starter: 'Create a short video scene prompt with opening, action and final frame.',
    rules: ['Define duration, subject movement, camera movement and final frame.', 'Keep action physically realistic.', 'Use sequence language: opening, movement, ending.']
  },
  writing: {
    label: 'Writing Prompt',
    description: 'Content prompt for articles, captions, messages and proposals.',
    role: 'You are a senior editor and content strategist.',
    starter: 'Rewrite or create a polished content draft for a clear audience.',
    rules: ['Clarify audience, purpose, tone and structure.', 'Return a clean copy-ready version.', 'Avoid vague claims and filler wording.']
  },
  coding: {
    label: 'GitHub / Coding Task',
    description: 'Convert feature ideas into coding tasks for Codex or GitHub work.',
    role: 'You are a senior frontend engineer and product builder.',
    starter: 'Build a GitHub Pages feature update with clear files, tasks and done criteria.',
    rules: ['Break work into individual implementation tasks.', 'List target files and acceptance criteria.', 'Include version control and commit message suggestions.']
  },
  job: {
    label: 'Job Application',
    description: 'Prompt for cover letter, CV matching and job application automation.',
    role: 'You are a Hong Kong career strategist and senior application writer.',
    starter: 'Create a targeted job application workflow based on CV and job description.',
    rules: ['Match experience to job requirements.', 'Highlight sector strengths and senior stakeholder exposure.', 'Return professional copy-ready output.']
  },
  business: {
    label: 'Business Strategy',
    description: 'Prompt for proposal, workflow, product and automation planning.',
    role: 'You are a business strategy and AI automation consultant.',
    starter: 'Turn a rough business idea into a clear proposal and execution workflow.',
    rules: ['Define objective, audience, offer, process and risk.', 'Provide next actions and success metrics.', 'Keep output practical and decision-friendly.']
  }
};

window.PROMPT2_FEATURES = [
  { key: 'coding', title: 'Prompt Engine', version: 'v3', body: 'Role + Background + Need + Output. Turn rough ideas into structured prompts for ChatGPT, Grok, image models, video tools and Codex.' },
  { key: 'image', title: 'Image Prompt', version: 'v3', body: 'Generate realistic image prompts with identity lock, lighting control and scene consistency.' },
  { key: 'video', title: 'Video Prompt', version: 'v3', body: 'Build short-form video scene prompts with action, camera movement, character behaviour and ending frame logic.' },
  { key: 'business', title: 'Workflow Prompt', version: 'v3', body: 'Convert messy instructions into reusable automation prompts for job search, content batching and AI production.' }
];