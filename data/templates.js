window.PROMPT2_TEMPLATES = {
  extractor: {
    label: 'Prompt Extractor',
    description: 'Extract usefulPhrase rows from raw prompts and classify into v2 schema.',
    starter: 'Paste a raw image, video, workflow or marketing prompt. Extract every reusable useful phrase into separate records.',
    rules: ['one reusable phrase per row', 'assign category and subcategory', 'add tags, qualityScore, similar, opposite and worksWith']
  },
  image: {
    label: 'Image Prompt Template',
    description: 'Photorealistic image prompt with identity, skin, lighting, lens and composition control.',
    starter: 'Identity locked commercial portrait with warm bronze Asian skin, realistic pores, premium lighting and clean composition.',
    rules: ['start with identity anchor', 'define skin texture and lighting', 'include lens, ratio, environment and quality']
  },
  video: {
    label: 'Video Prompt Template',
    description: 'Short video scene prompt with action, camera movement, timing and ending frame.',
    starter: 'Create a 5-second vertical video with clear opening frame, controlled action flow, slow camera movement and reusable ending frame.',
    rules: ['define start, movement and ending', 'keep scene continuity', 'specify camera motion and timing']
  },
  character: {
    label: 'Character / Face Lock Template',
    description: 'Identity consistency template for recurring character creation.',
    starter: 'Preserve exact facial structure, age, hairstyle, grooming, body proportions, warm bronze Asian skin tone and approachable confident expression.',
    rules: ['identity lock first', 'separate face identity from outfit and scene', 'protect age, facial geometry and body proportions']
  },
  grok: {
    label: 'Grok Positive Prompt',
    description: 'Positive-only prompt format suitable for Grok Imagine.',
    starter: 'Describe exactly what should appear using sharp focus, crisp micro skin texture, natural lighting and stable composition.',
    rules: ['positive constraints only', 'no negative prompt section', 'describe visible desired outcome']
  },
  workflow: {
    label: 'Workflow / Automation Prompt',
    description: 'Turn rough process ideas into reusable automation logic and GitHub records.',
    starter: 'Extract input, classify records, generate output, validate quality, export JSON, archive to GitHub and Google Drive.',
    rules: ['define input and output', 'include validation steps', 'include export and archive logic']
  }
};

window.PROMPT2_FEATURES = [
  { key: 'extractor', title: 'Phrase Extractor', version: 'v2', body: 'Break raw prompts into reusable usefulPhrase records with category, subcategory, tags and qualityScore.' },
  { key: 'image', title: 'Image Intelligence', version: 'v2', body: 'Classify image prompt phrases for identity lock, skin, lighting, camera, lens, style and quality.' },
  { key: 'video', title: 'Video Intelligence', version: 'v2', body: 'Organise action, motion, timing, camera movement, continuity and ending-frame logic.' },
  { key: 'workflow', title: 'Workflow Intelligence', version: 'v2', body: 'Prepare prompt records for GitHub, Google Sheets, JSON export, validation and automation.' }
];