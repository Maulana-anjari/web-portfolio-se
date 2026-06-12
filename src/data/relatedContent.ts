export const PROJECT_TO_POSTS: Record<string, string[]> = {
  "pertamina-llm": ["backend-super-skills-ai-agents", "scaling-backend-node-express"],
  "car-dano": ["cardano-vehicle-immutability", "when-does-problem-need-blockchain"],
  "dchain-blockchain-infrastructure": ["poa-vs-pos-performance-analysis", "web3-government-kemdikbudristek", "blockchain-night-login"],
  "pharmachain": ["interoperable-healthcare-blockchain"],
  "sumbupay": ["when-does-problem-need-blockchain"],
  "aksara-legal-ai": ["tashawwur-fikih-muamalat-ai", "backend-super-skills-ai-agents"],
  "fitted-wardrobe-intelligence": ["backend-super-skills-ai-agents"],
  "pawona-kitchen-companion": ["tashawwur-fikih-muamalat-ai"],
  "technocorner": ["scaling-backend-node-express"],
  "find-it": ["scaling-backend-node-express"],
};

export const POST_TO_PROJECTS: Record<string, string[]> = {};
for (const [project, posts] of Object.entries(PROJECT_TO_POSTS)) {
  for (const post of posts) {
    if (!POST_TO_PROJECTS[post]) POST_TO_PROJECTS[post] = [];
    if (!POST_TO_PROJECTS[post].includes(project)) POST_TO_PROJECTS[post].push(project);
  }
}
