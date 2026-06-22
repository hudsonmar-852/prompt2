window.PROMPT2_SCHEMA = {
  version: '2.0',
  date: '2026-06-22',
  storageKey: 'prompt2.records.v2',
  fields: ['id','date','sourcePrompt','usefulPhrase','category','subcategory','useCase','platform','tags','qualityScore','status','language','identityLock','exampleSegment','relatedPhrases','usageCount','lastUsed','notes','similarPhrases','oppositePhrases','worksWith','promptWeight','createdBy','sourceProject','version','updatedAt'],
  categories: {
    Image: ['Camera','Lens','Lighting','Composition','Pose','Skin','Color','Style','Quality','Identity Lock','Background','Reference Rules'],
    Video: ['Camera Movement','Motion','Transition','Timing','Scene Continuity','Action Flow','Grok Imagine','Runway','Kling','CapCut'],
    Character: ['Identity Anchor','Face Lock','Body Type','Age','Expression','Outfit','Persona','Relationship'],
    Action: ['Gesture','Movement','Interaction','Performance','Fitness','Dance','Daily Life','Business Scene'],
    Environment: ['Indoor','Outdoor','Hong Kong','Thailand','Office','Gym','Hotel','Street','Stage','Nature'],
    Clothing: ['Formal','Smart Casual','Sportswear','Swimwear','Underwear','Costume','Accessories'],
    Expression: ['Natural Smile','Confident','Relaxed','Seductive','Serious','Candid','Looking Away'],
    Lighting: ['Natural Light','Studio Light','Warm Premium','Soft Directional','Golden Highlight','Dark Neutral'],
    Composition: ['Portrait','Full Body','3/4 Body','Close Up','Wide Shot','16:9','9:16','Outpaint'],
    Style: ['Commercial Portrait','Fitness Editorial','Luxury Hotel','Cinematic Natural','Instagram','YouTube Thumbnail'],
    Workflow: ['ChatGPT','Grok','Stable Diffusion','CapCut','Suno','GitHub Prompt Builder','Automation'],
    Templates: ['Image Prompt Template','Video Prompt Template','Character Template','Face Lock Template','Grok Positive Prompt','Prompt Extractor'],
    Examples: ['Good Prompts','Failed Prompts','Before After','Reference Cases'],
    Database: ['Exports','JSON','CSV','Archive','Backup']
  },
  builderOrder: ['Character','Environment','Action','Lighting','Composition','Image','Style','Workflow'],
  platformRules: {
    'Grok Imagine': 'Positive prompt only. Describe exact visible results. Avoid negative phrasing.',
    'Kling': 'Prioritise scene continuity, timing, action flow and ending frame.',
    'Runway': 'Prioritise motion continuity, camera movement and transition logic.',
    'ChatGPT Image': 'Use clear visual instructions with explicit identity lock rules.',
    'CapCut': 'Focus on sequence, captions, transition timing and music sync.',
    'GitHub Prompt Builder': 'Use JSON-ready reusable phrase blocks.'
  }
};