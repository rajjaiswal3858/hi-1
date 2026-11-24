/* ===========================================================
   HATCHWORKS AI DATA MODEL
   =========================================================== */

const HW = {
  /* ---- CORE SERVICES ---- */
  coreServices: [
    {
      id: 'ai-strategy',
      label: 'AI Strategy & Roadmap',
      url: '/ai-strategy-roadmap/',
      desc: 'Build a clear, prioritized AI strategy that maps to measurable business outcomes, not pilot purgatory.',
      children: [
        { id: 'ai-transform', label: 'AI Transformation Strategy', desc: 'Enterprise-wide AI vision aligned to P&L impact and time-to-value.' },
        { id: 'ai-empower', label: 'AI Empowerment Training', desc: 'Equip teams to identify and execute on AI opportunities inside their own workflows.' },
        { id: 'ai-agent-strat', label: 'AI Agent Deployment Strategy', desc: 'Identify, prioritize, and sequence agentic use cases with clear ownership and KPIs.' },
        { id: 'mlops-gov', label: 'MLOps & AI Governance Strategy', desc: 'Stand up the operational, risk, and compliance backbone for responsible AI at scale.' }
      ],
      tech: 'OKR mapping · ROI modeling · risk frameworks · org design · maturity assessment',
      painPoints: ['Stuck in pilot purgatory', 'AI investments without ROI', 'No clear AI direction', 'Executive misalignment on AI'],
      searches: ['AI strategy roadmap consulting', 'enterprise AI transformation plan', 'how to scale AI in business', 'AI maturity assessment']
    },
    {
      id: 'ai-software-dev',
      label: 'AI-Powered Software Development',
      url: '/ai-native-product-development-services/',
      desc: 'Ship AI-native products faster, with engineering teams that build with agents and Generative-Driven Development by default.',
      children: [
        { id: 'ai-native-product', label: 'AI-Native Product Experiences', desc: 'Greenfield products designed around generative interfaces, embeddings, and agents from day zero.' },
        { id: 'agentic-dev', label: 'Agentic Software Development', desc: 'Build, integrate, and operate AI agents that take real action inside your stack.' },
        { id: 'app-modernization', label: 'Agentic Application Modernization', desc: 'Refactor and re-platform legacy systems using AI-assisted code analysis and migration.' }
      ],
      tech: 'GenDD · Anthropic Claude · OpenAI · LangGraph · vector DBs · TypeScript · Python · React · cloud-native',
      painPoints: ['Engineering team too slow', 'Legacy systems holding us back', 'Need AI-native product fast', 'Integration complexity'],
      searches: ['generative AI software development company', 'agentic AI development services', 'AI native product engineering', 'modernize legacy app with AI']
    },
    {
      id: 'data-eng',
      label: 'Data Engineering & Analytics',
      url: '/',
      desc: 'Get your data ready for AI. Pipelines, lakehouses, governance, and BI so models have a foundation worth trusting.',
      children: [
        { id: 'data-ready', label: 'Data Readiness & Governance', desc: 'Audit quality, lineage, and access controls so AI initiatives are not blocked by data debt.' },
        { id: 'data-migration', label: 'Data Migration & Modernization', desc: 'Move from legacy warehouses to modern lakehouse architectures with zero-loss cutover.' },
        { id: 'bi-analytics', label: 'Business Intelligence & Analytics', desc: 'Self-serve BI, semantic layers, and embedded analytics for everyone in the business.' },
        { id: 'databricks-impl', label: 'Databricks Implementation', desc: 'End-to-end Databricks Lakehouse delivery as a certified partner.' }
      ],
      tech: 'Databricks · Snowflake · BigQuery · dbt · Airflow · Spark · Delta Lake · Unity Catalog · Looker · Power BI',
      painPoints: ['Data is messy, can\'t deploy AI', 'No single source of truth', 'Hallucinations from bad data', 'Slow analytics turnaround'],
      searches: ['Databricks consulting partner', 'data readiness for AI', 'data migration to lakehouse', 'data governance for generative AI']
    },
    {
      id: 'ai-teams',
      label: 'AI Engineering Teams',
      url: '/forward-deployed-engineers/',
      desc: 'Embedded nearshore AI engineering pods across the US and Latin America, in your timezone, ready to execute on day one.',
      children: [
        { id: 'genai-engineers', label: 'Generative AI Engineers', desc: 'Engineers who ship LLM, RAG, and agent systems to production, not just demos.' },
        { id: 'data-engineers', label: 'Data & ML Engineers', desc: 'Pipeline, MLOps, and platform talent for the long haul.' },
        { id: 'product-pods', label: 'Cross-functional Product Pods', desc: 'Full-stack pods with product, design, and engineering, aligned to outcomes.' },
        { id: 'staff-aug', label: 'Strategic Staff Augmentation', desc: 'Senior individual contributors plugged directly into your existing teams.' }
      ],
      tech: 'Nearshore Latin America · same timezone · vetted senior talent · GenDD-trained',
      painPoints: ['Need AI talent but cannot hire fast', 'Local talent too expensive', 'Offshore timezone friction', 'Lack of senior AI engineers'],
      searches: ['nearshore AI development team', 'hire AI engineers Latin America', 'AI staff augmentation services', 'remote generative AI engineers']
    },
    {
      id: 'agentic-automation',
      label: 'Agentic AI Automation',
      url: '/agentic-ai-automation/',
      desc: 'AI-driven systems that work around the clock. Multi-agent orchestration, integrations, and human-in-the-loop where it matters.',
      children: [
        { id: 'sales-agents', label: 'Sales & Revenue Agents', desc: 'Handle inbound, qualify leads, follow up at scale (47% of sales emails handled by AI for a HatchWorks client).' },
        { id: 'support-agents', label: 'Customer Support Agents', desc: 'Multi-channel deflection grounded in your knowledge base with safe escalation.' },
        { id: 'ops-agents', label: 'Operations & Back-office Agents', desc: 'Claims, onboarding, document workflows, vendor management.' },
        { id: 'eng-agents', label: 'Engineering & DevEx Agents', desc: 'Code review, ticket triage, observability, and internal copilots for engineering teams.' },
        { id: 'agent-orch', label: 'Multi-Agent Orchestration', desc: 'Coordinated specialist agents with shared memory, tools, and guardrails.' }
      ],
      tech: 'LangGraph · CrewAI · OpenAI Assistants · Claude · n8n · Zapier · custom orchestration',
      painPoints: ['Manual processes eating budget', 'Customer support overwhelmed', 'Sales follow-up dropping leads', 'Repetitive ops work'],
      searches: ['agentic AI automation platform', 'AI agent for customer support', 'multi agent orchestration', 'build AI agent for sales']
    }
  ],

  /* ---- ACCELERATORS ---- */
  accelerators: [
    {
      id: 'gendd',
      label: 'Generative-Driven Development™',
      url: '/generative-driven-development/',
      desc: 'HatchWorks\' proprietary methodology that blends AI, agents, and engineering into a repeatable path from idea to production. 20 days of work delivered in under 5.',
      children: [
        { id: 'gendd-overview', label: 'GenDD Overview', desc: 'The operating model: agents, humans, and gates that compress delivery time.' },
        { id: 'gendd-context', label: 'GenDD Context', desc: 'Structured context engineering so agents and humans share the same truth.' },
        { id: 'gendd-pods', label: 'GenDD Pods', desc: 'Cross-functional pods running the methodology end to end.' }
      ],
      tech: 'methodology · agent orchestration · context engineering · CI/CD with AI · 4x velocity, near-zero bugs',
      painPoints: ['Engineering velocity too slow', 'AI tooling chaos', 'Inconsistent code quality with AI', 'Pilots that never ship'],
      searches: ['generative driven development', 'AI software development methodology', 'how to scale AI coding', 'AI engineering operating model']
    },
    {
      id: 'data-readiness',
      label: 'AI Data Readiness Assessment',
      url: '/ai-data-readiness-governance-assessment/',
      desc: 'A focused engagement that surfaces gaps, identifies opportunities, and produces a clear path to prepare your data for AI.',
      children: [
        { id: 'data-audit', label: 'Data Quality Audit', desc: 'Lineage, completeness, and trust scoring across your data estate.' },
        { id: 'gov-framework', label: 'Governance Framework', desc: 'Policy, role, and access design that does not block experimentation.' },
        { id: 'roadmap-output', label: 'Prioritized Roadmap', desc: 'Sequenced workstreams with effort, impact, and dependencies.' }
      ],
      tech: 'Unity Catalog · Collibra · data contracts · lineage tooling · policy automation',
      painPoints: ['Data is messy, can\'t deploy AI', 'Compliance and governance concerns', 'No idea where to start with AI data'],
      searches: ['AI data readiness assessment', 'data governance for AI', 'how to prepare data for generative AI']
    },
    {
      id: 'solution-accel',
      label: 'AI Solution Accelerator',
      url: '/gen-ai-solution-accelerator/',
      desc: 'Validate your highest-value AI use case with a low-risk prototype. From hypothesis to working PoC in weeks, not quarters.',
      children: [
        { id: 'use-case-disc', label: 'Use Case Discovery', desc: 'Structured workshops to identify the right first bet.' },
        { id: 'rapid-poc', label: 'Rapid Proof of Concept', desc: 'Working prototype on real data, ready to demo to stakeholders.' },
        { id: 'scale-plan', label: 'Scale Plan', desc: 'What it takes to move from PoC to production, with cost and risk.' }
      ],
      tech: 'lean experimentation · vibe coding · GenDD micro-pods · real client data sandboxes',
      painPoints: ['Stuck in pilot purgatory', 'Cannot justify AI investment', 'Need quick win to build momentum'],
      searches: ['AI POC to production', 'rapid AI prototype', 'AI use case validation', 'AI solution accelerator']
    },
    {
      id: 'rag',
      label: 'RAG (Retrieval-Augmented Generation)',
      url: '/rag/',
      desc: 'Connect your proprietary data to AI and turn it into your biggest differentiator. Grounded, accurate, audit-ready.',
      children: [
        { id: 'rag-architecture', label: 'RAG Architecture Design', desc: 'Chunking, embeddings, retrieval strategy, and re-ranking tuned to your domain.' },
        { id: 'rag-eval', label: 'RAG Evaluation & QA', desc: 'Faithfulness, relevance, and answer quality scoring with automated regression.' },
        { id: 'rag-ops', label: 'RAG in Production', desc: 'Observability, drift detection, and continuous fine-tuning post-launch.' }
      ],
      tech: 'Pinecone · Weaviate · pgvector · Anthropic Claude · OpenAI · LangChain · LlamaIndex · Ragas',
      painPoints: ['LLM hallucinations', 'AI can\'t answer about our data', 'Need accuracy at enterprise scale', 'Compliance with proprietary info'],
      searches: ['how to implement RAG in production', 'reduce hallucinations LLM', 'enterprise RAG architecture', 'CTO blueprint to RAG']
    },
    {
      id: 'geniq',
      label: 'GenIQ',
      url: '/geniq-ai-for-smarter-software-development/',
      desc: 'The first AI-driven process intelligence platform for software development. See where AI is helping, where it is not, and where to invest next.',
      children: [
        { id: 'dev-telemetry', label: 'Development Telemetry', desc: 'Capture AI usage signals across the full SDLC.' },
        { id: 'ai-impact', label: 'AI Impact Scoring', desc: 'Measure where AI actually accelerates work and where it adds friction.' },
        { id: 'optimization', label: 'Continuous Optimization', desc: 'Recommendations to expand AI usage where it pays off most.' }
      ],
      tech: 'proprietary HatchWorks platform · IDE telemetry · code analytics · AI usage scoring',
      painPoints: ['Can\'t prove AI engineering ROI', 'AI tool sprawl', 'Inconsistent AI adoption across teams'],
      searches: ['AI engineering productivity', 'measure AI coding ROI', 'AI process intelligence', 'AI software development metrics']
    }
  ],

  /* ---- TRAINING & WORKSHOPS ---- */
  training: [
    {
      id: 'team-training',
      label: 'AI Training for Teams',
      url: '/',
      desc: 'Hands-on training so non-technical teams can use AI confidently in their daily workflows. No background required.',
      children: [
        { id: 'prompt-fund', label: 'Prompting Fundamentals', desc: 'How to think with AI, not at it.' },
        { id: 'workflow-build', label: 'Workflow Building', desc: 'Turn manual processes into AI-assisted ones, fast.' },
        { id: 'tool-mastery', label: 'Tool Mastery', desc: 'Claude, GPT, copilots, and how to pick the right one.' }
      ],
      tech: 'live cohorts · async modules · role-specific tracks (marketing, ops, sales, hr)',
      painPoints: ['Team not using AI tools', 'Inconsistent AI adoption', 'Wasted licenses on AI tools'],
      searches: ['AI training for employees', 'corporate AI workshop', 'how to train team on ChatGPT', 'AI literacy program']
    },
    {
      id: 'exec-training',
      label: 'Executive AI Training',
      url: '/',
      desc: 'Strategic AI guidance for leaders. Make the right calls on investment, risk, and competitive positioning.',
      children: [
        { id: 'ai-leadership', label: 'AI Leadership Foundations', desc: 'What every C-suite executive needs to know in 2026.' },
        { id: 'investment-frame', label: 'Investment Decision Frameworks', desc: 'How to evaluate vendors, build vs buy, and AI capex.' },
        { id: 'comp-strategy', label: 'Competitive AI Strategy', desc: 'Where your industry is going and how to lead, not follow.' }
      ],
      tech: 'private executive cohorts · board-ready materials · 1:1 advisory',
      painPoints: ['Executive team needs AI fluency', 'Board pressure on AI strategy', 'Risk of falling behind competitors'],
      searches: ['executive AI training program', 'AI for CEO', 'board level AI strategy', 'C-suite generative AI workshop']
    },
    {
      id: 'roadmap-workshop',
      label: 'AI Roadmap & ROI Workshop',
      url: '/ai-roadmap-roi-workshop/',
      desc: 'Build a clear, ROI-driven plan to turn your AI vision into reality. Walk in with intent, walk out with sequenced bets.',
      children: [
        { id: 'opportunity-mapping', label: 'Opportunity Mapping', desc: 'Identify high-impact use cases across functions.' },
        { id: 'roi-modeling', label: 'ROI Modeling', desc: 'Quantify cost, value, and risk for each bet.' },
        { id: 'roadmap-output-2', label: 'Sequenced Roadmap', desc: 'Phased plan with owners, dependencies, and milestones.' }
      ],
      tech: 'structured workshop format · 2 to 5 day engagement · cross-functional facilitation',
      painPoints: ['Don\'t know where to start', 'AI budget without a plan', 'Too many competing priorities'],
      searches: ['AI roadmap workshop', 'AI ROI calculator', 'AI opportunity assessment', 'enterprise AI planning']
    },
    {
      id: 'gendd-workshop',
      label: 'GenDD Training Workshop',
      url: '/gendd-training-workshop/',
      desc: 'Developer-focused workshop to embed AI and agents across your software lifecycle. Practical, not theoretical.',
      children: [
        { id: 'agent-coding', label: 'Agent-Assisted Coding', desc: 'Claude Code, Cursor, and beyond. Shipping with agents safely.' },
        { id: 'context-eng', label: 'Context Engineering', desc: 'Build the substrate that lets agents actually work in your codebase.' },
        { id: 'gendd-ops', label: 'GenDD Operating Model', desc: 'Adopt HatchWorks\' proven methodology in your own teams.' }
      ],
      tech: 'Claude Code · Cursor · GitHub Copilot · MCP · custom internal tooling',
      painPoints: ['Engineers not adopting AI', 'AI generated code quality concerns', 'No standard for AI-assisted coding'],
      searches: ['Claude Code training', 'AI pair programming workshop', 'agentic coding training', 'how to roll out AI to engineers']
    }
  ],

  /* ---- PARTNERSHIPS ---- */
  partnerships: [
    { id: 'p-databricks', label: 'Databricks', url: '/databricks/', desc: 'Certified Databricks partner for Lakehouse, MLflow, and Unity Catalog deployments.' },
    { id: 'p-google', label: 'Google Cloud', url: '/google-cloud-build-the-intelligence-layer-your-business-runs-on/', desc: 'Google Cloud Select Service Partner for Vertex AI and Gemini-based solutions.' },
    { id: 'p-anthropic', label: 'Anthropic', desc: 'Partner for Claude-powered solutions, Claude Code rollouts, and enterprise agent deployments.' },
    { id: 'p-aws', label: 'AWS', desc: 'AWS solutions for Bedrock, SageMaker, and enterprise data on AWS.' }
  ],

  /* ---- INDUSTRIES ---- */
  industries: [
    {
      id: 'ind-comms',
      label: 'Communications & IoT',
      url: '/communications/',
      desc: 'Telco modernization, OSS/BSS intelligence, fleet and device data, real-time decisioning at the edge.',
      useCases: ['Fleet data to instant answers (Cox2M)', 'Low-altitude airspace intelligence (DronePort)', 'Carrier-grade agent automation', 'IoT predictive maintenance'],
      painPoints: ['Legacy OSS/BSS', 'Drowning in device telemetry', 'Slow service activation'],
      searches: ['AI for telecom', 'IoT data platform consulting', 'OSS BSS modernization AI']
    },
    {
      id: 'ind-tech',
      label: 'Technology',
      url: '/technology/',
      desc: 'SaaS, ISVs, and software companies building AI-native products and modernizing their engineering culture.',
      useCases: ['AI-native product launches', 'Agentic SaaS features', 'Internal copilots for engineering', 'AI-powered onboarding flows'],
      painPoints: ['Competitor shipped AI first', 'Engineering velocity stalling', 'AI features that hallucinate'],
      searches: ['AI for SaaS company', 'add AI to my product', 'generative AI features SaaS']
    },
    {
      id: 'ind-health',
      label: 'Healthcare',
      url: '/healthcare/',
      desc: 'HIPAA-aware AI for payers, providers, and digital health. From clinical operations to patient experience.',
      useCases: ['99% faster client onboarding for specialty pharmacy', 'Clinical knowledge assistants', 'Claims and prior auth automation', 'Patient triage agents'],
      painPoints: ['HIPAA blocking AI rollout', 'Clinical documentation burden', 'Slow prior auth workflows'],
      searches: ['healthcare AI HIPAA compliant', 'AI for medical claims', 'AI clinical assistant', 'pharmacy onboarding automation']
    },
    {
      id: 'ind-finance',
      label: 'Finance',
      url: '/finance/',
      desc: 'Banks, insurers, and fintechs. Risk, fraud, advisory, and operations transformed by AI inside regulated frameworks.',
      useCases: ['Underwriting agents', 'Document intelligence for KYC', 'Wealth advisory copilots', 'Fraud signal aggregation'],
      painPoints: ['Regulatory friction on AI', 'Manual underwriting backlog', 'Customer service in regulated channels'],
      searches: ['AI for banking compliance', 'fintech AI development', 'AI underwriting platform', 'KYC automation generative AI']
    },
    {
      id: 'ind-retail',
      label: 'Retail',
      url: '/retail/',
      desc: 'Merchandising, e-commerce, and store operations supercharged with AI. Personalization, forecasting, and assisted commerce.',
      useCases: ['Demand forecasting', 'AI product discovery', 'Conversational commerce', 'Shrink and inventory intelligence'],
      painPoints: ['Forecast accuracy issues', 'Stale personalization', 'Inventory blind spots'],
      searches: ['AI for retail operations', 'conversational commerce AI', 'demand forecasting machine learning']
    },
    {
      id: 'ind-realestate',
      label: 'Real Estate',
      url: '/real-estate/',
      desc: 'Property tech, brokerage, and asset management modernized by AI. Document automation, valuation, and tenant experience.',
      useCases: ['Lease abstraction agents', 'AVM and valuation copilots', 'Tenant service automation', 'Construction document intelligence'],
      painPoints: ['Lease admin overhead', 'Valuation manual work', 'Tenant service volume'],
      searches: ['AI for real estate', 'lease abstraction AI', 'property tech AI development']
    }
  ],

  /* ---- TOOLS & COURSES ---- */
  tools: [
    { id: 't-agentic-finder', label: 'Agentic Opportunity Finder', url: '/agentic-opportunity-finder/', desc: 'Tool focused specifically on identifying multi-step, agent-friendly automation candidates.' },
    { id: 't-aimc', label: 'AI Masterclass', url: '/aimc/', desc: 'Structured course for teams getting serious about AI capability building.' },
    { id: 't-gpt-course', label: 'Build Your Own GPT', url: '/gpt-course/', desc: 'Hands-on course for building custom GPTs and assistants.' },
    { id: 't-soa', label: 'State of AI 2026', url: '/state-of-ai-2026/', desc: 'HatchWorks\' flagship publication on where AI is actually going in 2026.' },
    { id: 't-gendd-ebook', label: 'GenDD eBook', url: '/gendd-ebook/', desc: 'Deep dive into Generative-Driven Development.' },
    { id: 't-cto-rag', label: 'CTO Blueprint to RAG', url: '/cto-blueprint-rag/', desc: 'Practical CTO guide to deploying production RAG.' },
    { id: 't-talking-ai', label: 'Talking AI Podcast', url: '/talking-ai/', desc: 'HatchWorks podcast on enterprise AI, with leaders shipping AI in production.' }
  ],

  /* ---- KEYWORDS / PAIN POINTS / SEARCHES (FLOATING MODE) ---- */
  // Each entry has: text, type, and recommendedServices (ids referencing nodes above)
  floating: [
    // PAIN POINTS
    { text: 'Stuck in pilot purgatory', type: 'pain', recs: ['ai-strategy', 'solution-accel', 'gendd', 'roadmap-workshop'] },
    { text: 'AI investments without ROI', type: 'pain', recs: ['ai-strategy', 'roadmap-workshop', 'geniq'] },
    { text: 'Data is too messy for AI', type: 'pain', recs: ['data-readiness', 'data-eng', 'rag'] },
    { text: 'LLM hallucinations', type: 'pain', recs: ['rag', 'data-readiness', 'data-eng'] },
    { text: 'Cannot hire AI talent fast', type: 'pain', recs: ['ai-teams', 'team-training'] },
    { text: 'Compliance blocking AI rollout', type: 'pain', recs: ['ai-strategy', 'data-readiness'] },
    { text: 'No idea where to start', type: 'pain', recs: ['t-agentic-finder', 'roadmap-workshop', 'exec-training'] },
    { text: 'Legacy systems holding us back', type: 'pain', recs: ['ai-software-dev', 'data-eng'] },
    { text: 'Manual processes eating budget', type: 'pain', recs: ['agentic-automation', 't-agentic-finder'] },
    { text: 'Engineering team too slow', type: 'pain', recs: ['gendd', 'ai-software-dev', 'gendd-workshop', 'geniq'] },
    { text: 'Customer support overwhelmed', type: 'pain', recs: ['agentic-automation', 'rag'] },
    { text: 'Sales follow-up dropping leads', type: 'pain', recs: ['agentic-automation'] },
    { text: 'AI tool sprawl, no governance', type: 'pain', recs: ['ai-strategy', 'geniq', 'team-training'] },
    { text: 'Board pressure on AI strategy', type: 'pain', recs: ['exec-training', 'ai-strategy', 'roadmap-workshop'] },
    { text: 'Competitor shipped AI first', type: 'pain', recs: ['ai-software-dev', 'solution-accel', 'gendd'] },
    { text: 'Hallucinations on proprietary data', type: 'pain', recs: ['rag', 'data-readiness'] },
    { text: 'AI tools nobody is using', type: 'pain', recs: ['team-training', 'exec-training'] },
    { text: 'Bad code from AI agents', type: 'pain', recs: ['gendd', 'gendd-workshop'] },
    { text: 'No AI engineering ROI proof', type: 'pain', recs: ['geniq', 'gendd'] },
    { text: 'Integration nightmare', type: 'pain', recs: ['ai-software-dev', 'agentic-automation'] },

    // GOOGLE SEARCHES
    { text: 'best AI consulting firm for enterprise', type: 'search', recs: ['ai-strategy', 'ai-software-dev', 'ai-teams'] },
    { text: 'how to implement RAG in production', type: 'search', recs: ['rag', 't-cto-rag'] },
    { text: 'nearshore AI development team', type: 'search', recs: ['ai-teams'] },
    { text: 'agentic AI automation platform', type: 'search', recs: ['agentic-automation', 't-agentic-finder'] },
    { text: 'AI strategy roadmap consulting', type: 'search', recs: ['ai-strategy', 'roadmap-workshop'] },
    { text: 'data readiness for AI', type: 'search', recs: ['data-readiness', 'data-eng'] },
    { text: 'healthcare AI HIPAA compliant', type: 'search', recs: ['ind-health', 'ai-strategy'] },
    { text: 'fintech AI compliance', type: 'search', recs: ['ind-finance', 'ai-strategy'] },
    { text: 'generative AI software development', type: 'search', recs: ['ai-software-dev', 'gendd'] },
    { text: 'AI POC to production', type: 'search', recs: ['solution-accel', 'gendd'] },
    { text: 'Databricks consulting partner', type: 'search', recs: ['data-eng', 'p-databricks'] },
    { text: 'Google Cloud AI partner', type: 'search', recs: ['p-google', 'ai-software-dev'] },
    { text: 'executive AI training program', type: 'search', recs: ['exec-training'] },
    { text: 'MLOps consulting services', type: 'search', recs: ['ai-strategy', 'data-eng'] },
    { text: 'build AI agent for sales', type: 'search', recs: ['agentic-automation'] },
    { text: 'reduce LLM hallucinations', type: 'search', recs: ['rag', 'data-readiness'] },
    { text: 'AI for customer support automation', type: 'search', recs: ['agentic-automation', 'rag'] },
    { text: 'legacy app modernization with AI', type: 'search', recs: ['ai-software-dev', 'data-eng'] },
    { text: 'AI workshop for engineering team', type: 'search', recs: ['gendd-workshop', 'team-training'] },
    { text: 'Claude Code enterprise rollout', type: 'search', recs: ['gendd-workshop', 'p-anthropic'] },
    { text: 'AI opportunity assessment', type: 'search', recs: ['t-agentic-finder', 'roadmap-workshop'] },
    { text: 'AI agent for healthcare claims', type: 'search', recs: ['ind-health', 'agentic-automation'] },
    { text: 'conversational commerce AI', type: 'search', recs: ['ind-retail', 'agentic-automation'] },
    { text: 'lease abstraction AI', type: 'search', recs: ['ind-realestate', 'agentic-automation'] },

    // INDUSTRIES
    { text: 'Communications & IoT', type: 'industry', recs: ['ind-comms', 'agentic-automation', 'data-eng'] },
    { text: 'Technology / SaaS', type: 'industry', recs: ['ind-tech', 'ai-software-dev', 'gendd'] },
    { text: 'Healthcare', type: 'industry', recs: ['ind-health', 'rag', 'agentic-automation'] },
    { text: 'Finance', type: 'industry', recs: ['ind-finance', 'rag', 'agentic-automation'] },
    { text: 'Retail', type: 'industry', recs: ['ind-retail', 'data-eng', 'agentic-automation'] },
    { text: 'Real Estate', type: 'industry', recs: ['ind-realestate', 'agentic-automation'] },

    // TECHNICAL KEYWORDS
    { text: 'RAG', type: 'keyword', recs: ['rag', 't-cto-rag'] },
    { text: 'Multi-agent orchestration', type: 'keyword', recs: ['agentic-automation', 'gendd'] },
    { text: 'Vector databases', type: 'keyword', recs: ['rag', 'data-eng'] },
    { text: 'MLOps', type: 'keyword', recs: ['ai-strategy', 'data-eng'] },
    { text: 'Lakehouse', type: 'keyword', recs: ['data-eng', 'p-databricks'] },
    { text: 'Fine-tuning', type: 'keyword', recs: ['rag', 'ai-software-dev'] },
    { text: 'Claude / Anthropic', type: 'keyword', recs: ['p-anthropic', 'ai-software-dev', 'gendd-workshop'] },
    { text: 'LangGraph', type: 'keyword', recs: ['agentic-automation', 'ai-software-dev'] },
    { text: 'Embeddings', type: 'keyword', recs: ['rag', 'data-eng'] },
    { text: 'AI governance', type: 'keyword', recs: ['ai-strategy', 'data-readiness'] },
    { text: 'Context engineering', type: 'keyword', recs: ['gendd', 'rag', 'gendd-workshop'] },
    { text: 'GenDD methodology', type: 'keyword', recs: ['gendd', 'gendd-workshop', 't-gendd-ebook'] },
    { text: 'Agent guardrails', type: 'keyword', recs: ['agentic-automation', 'ai-strategy'] },
    { text: 'Vibe coding', type: 'keyword', recs: ['gendd-workshop', 'gendd'] },
    { text: 'MCP servers', type: 'keyword', recs: ['agentic-automation', 'gendd-workshop'] },
    { text: 'Databricks Unity Catalog', type: 'keyword', recs: ['p-databricks', 'data-eng'] },
    { text: 'Prompt engineering', type: 'keyword', recs: ['team-training', 'gendd-workshop'] },
    { text: 'AI observability', type: 'keyword', recs: ['ai-strategy', 'agentic-automation'] }
  ],

  /* ---- ALL NODES INDEXED FOR LOOKUP ---- */
  byId: {} // built below
};

/* Build a flat index for fast lookup */
(function buildIndex() {
  const cats = [
    { node: { id: 'core', label: 'Core Services', cat: 'core' }, items: HW.coreServices, cat: 'core' },
    { node: { id: 'accel', label: 'Accelerators', cat: 'accelerator' }, items: HW.accelerators, cat: 'accelerator' },
    { node: { id: 'train', label: 'Training & Workshops', cat: 'training' }, items: HW.training, cat: 'training' },
    { node: { id: 'part', label: 'Partnerships', cat: 'partner' }, items: HW.partnerships, cat: 'partner' },
    { node: { id: 'ind', label: 'Industries', cat: 'industry' }, items: HW.industries, cat: 'industry' },
    { node: { id: 'tools', label: 'Tools & Courses', cat: 'tool' }, items: HW.tools, cat: 'tool' }
  ];
  cats.forEach(c => {
    HW.byId[c.node.id] = { ...c.node, level: 1 };
    c.items.forEach(it => {
      HW.byId[it.id] = { ...it, cat: c.cat, level: 2 };
      if (it.children) {
        it.children.forEach(ch => {
          HW.byId[ch.id] = { ...ch, cat: c.cat, level: 3, parent: it.id };
        });
      }
    });
  });
  HW.byId['hatchworks'] = { id: 'hatchworks', label: 'HatchWorks AI', cat: 'center', level: 0 };
})();

/* ===========================================================
   MIND MAP — D3 FORCE LAYOUT (pill nodes + real logo + icons)
   =========================================================== */

const HW_LOGO_URL = '/assets/wp-content/uploads/2021/04/HatchWorks-AIor.svg';

/* Inline SVG icons for the 6 top-level categories (24×24 viewBox).
   Stroke uses Neural Black so they sit nicely on bright pill fills. */
const CAT_ICONS = {
  core: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0c0f14" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.4"/>
    <rect x="14" y="3" width="7" height="7" rx="1.4"/>
    <rect x="3" y="14" width="7" height="7" rx="1.4"/>
    <rect x="14" y="14" width="7" height="7" rx="1.4"/>
  </svg>`,
  accel: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0c0f14" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M13 2 L4 14 L11 14 L9 22 L20 10 L13 10 Z"/>
  </svg>`,
  train: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0c0f14" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M2 9 L12 4 L22 9 L12 14 Z"/>
    <path d="M6 11 V16 C6 16 9 19 12 19 C15 19 18 16 18 16 V11"/>
  </svg>`,
  part: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0c0f14" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M9 7 a4 4 0 0 0 -4 4 v2 a4 4 0 0 0 4 4"/>
    <path d="M15 7 a4 4 0 0 1 4 4 v2 a4 4 0 0 1 -4 4"/>
    <line x1="8" y1="12" x2="16" y2="12"/>
  </svg>`,
  ind: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0c0f14" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3 21 V9 L10 9 V21"/>
    <path d="M10 21 V3 L17 3 V21"/>
    <path d="M17 12 L21 12 V21 L17 21"/>
    <line x1="6" y1="13" x2="6" y2="13.5"/>
    <line x1="13" y1="8" x2="13" y2="8.5"/>
  </svg>`,
  tools: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0c0f14" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M14.7 6.3 a1 1 0 0 0 0 1.4 L16.6 9.6 L19 7.2 L16.8 5 a1 1 0 0 0 -1.4 0 Z"/>
    <path d="M16.6 9.6 L7 19.2 a1.5 1.5 0 0 1 -2.1 0 L4.8 19.1 a1.5 1.5 0 0 1 0 -2.1 L14.4 7.4"/>
  </svg>`
};

function getCSSVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

const svg = d3.select('#mindmap-svg');
let width = window.innerWidth;
let height = window.innerHeight - document.querySelector('header').offsetHeight;
svg.attr('viewBox', `0 0 ${width} ${height}`);

const gZoom = svg.append('g').attr('class', 'zoom-g');
const gLinks = gZoom.append('g').attr('class', 'links');
const gNodes = gZoom.append('g').attr('class', 'nodes');

const zoom = d3.zoom()
  .scaleExtent([0.3, 3])
  .on('zoom', (event) => {
    gZoom.attr('transform', event.transform);
  });
svg.call(zoom);

/* Defs: soft glow halo for the center */
const defs = svg.append('defs');
const centerGrad = defs.append('radialGradient')
  .attr('id', 'center-grad')
  .attr('cx', '50%').attr('cy', '50%').attr('r', '50%');
centerGrad.append('stop').attr('offset', '0%').attr('stop-color', 'rgba(58, 189, 188, 0.55)');
centerGrad.append('stop').attr('offset', '55%').attr('stop-color', 'rgba(58, 189, 188, 0.12)');
centerGrad.append('stop').attr('offset', '100%').attr('stop-color', 'rgba(58, 189, 188, 0)');

/* Build nodes/links from data */
function buildGraph() {
  const nodes = [];
  const links = [];

  nodes.push({ id: 'hatchworks', label: 'HatchWorks AI', cat: 'center', level: 0 });

  const cats = [
    { id: 'core',  label: 'Core Services',     cat: 'core',        items: HW.coreServices },
    { id: 'accel', label: 'Accelerators',      cat: 'accelerator', items: HW.accelerators },
    { id: 'train', label: 'Training',          cat: 'training',    items: HW.training },
    { id: 'part',  label: 'Partnerships',      cat: 'partner',     items: HW.partnerships },
    { id: 'ind',   label: 'Industries',        cat: 'industry',    items: HW.industries },
    { id: 'tools', label: 'Tools & Courses',   cat: 'tool',        items: HW.tools }
  ];

  cats.forEach(c => {
    nodes.push({ id: c.id, label: c.label, cat: c.cat, level: 1, iconKey: c.id });
    links.push({ source: 'hatchworks', target: c.id, cat: c.cat, strength: 0.9 });

    c.items.forEach(it => {
      nodes.push({ id: it.id, label: it.label, cat: c.cat, level: 2 });
      links.push({ source: c.id, target: it.id, cat: c.cat, strength: 0.55 });

      if (it.children) {
        it.children.forEach(ch => {
          nodes.push({ id: ch.id, label: ch.label, cat: c.cat, level: 3 });
          links.push({ source: it.id, target: ch.id, cat: c.cat, strength: 0.3 });
        });
      }
    });
  });

  return { nodes, links };
}

const graph = buildGraph();

const catColor = {
  center:      getCSSVar('--hw-white'),
  core:        getCSSVar('--cat-core'),
  accelerator: getCSSVar('--cat-accelerator'),
  training:    getCSSVar('--cat-training'),
  partner:     getCSSVar('--cat-partner'),
  industry:    getCSSVar('--cat-industry'),
  tool:        getCSSVar('--cat-tool')
};

/* Soft fill for level 2 pills (15% category color over Neural Black) */
function level2Fill(cat) {
  const c = catColor[cat];
  // Use the color with low alpha for that ghost-fill look
  return c + '22'; // append 22 = ~13% opacity in hex
}
/* Stroke for level 2 pills (mid opacity) */
function level2Stroke(cat) {
  return catColor[cat] + '99';
}

/* ===== Links ===== */
const linkSel = gLinks.selectAll('line')
  .data(graph.links)
  .enter()
  .append('line')
  .attr('class', 'link')
  .attr('stroke', d => catColor[d.cat])
  .attr('stroke-width', d => d.strength > 0.7 ? 1.8 : d.strength > 0.4 ? 1.2 : 0.7);

/* ===== Node groups ===== */
const nodeG = gNodes.selectAll('g.node')
  .data(graph.nodes)
  .enter()
  .append('g')
  .attr('class', d => `node node-level-${d.level}`)
  .on('click', (event, d) => {
    event.stopPropagation();
    openPanel(d.id);
    highlightNeighbors(d.id);
  })
  .on('mouseenter', (event, d) => {
    highlightNeighbors(d.id);
  })
  .on('mouseleave', () => {
    clearHighlight();
  })
  .call(d3.drag()
    .on('start', dragStart)
    .on('drag', dragged)
    .on('end', dragEnd));

/* ----- Center: halo + real logo ----- */
const centerSel = nodeG.filter(d => d.level === 0);
centerSel.append('circle')
  .attr('class', 'center-halo')
  .attr('r', 95)
  .attr('fill', 'url(#center-grad)');
centerSel.append('image')
  .attr('class', 'center-logo')
  .attr('href', HW_LOGO_URL)
  .attr('xlink:href', HW_LOGO_URL) // legacy fallback
  .attr('width', 170)
  .attr('height', 54)
  .attr('x', -85)
  .attr('y', -27)
  .attr('preserveAspectRatio', 'xMidYMid meet');

/* ----- Non-center: pill (rect + optional icon + text) ----- */
const pillSel = nodeG.filter(d => d.level !== 0);

pillSel.append('rect')
  .attr('class', 'pill-bg')
  .attr('rx', d => d.level === 1 ? 22 : (d.level === 2 ? 16 : 13))
  .attr('ry', d => d.level === 1 ? 22 : (d.level === 2 ? 16 : 13))
  .attr('fill', d => {
    if (d.level === 1) return catColor[d.cat];
    if (d.level === 2) return level2Fill(d.cat);
    return 'rgba(12, 15, 20, 0.92)';
  })
  .attr('stroke', d => {
    if (d.level === 1) return catColor[d.cat];
    if (d.level === 2) return level2Stroke(d.cat);
    return catColor[d.cat];
  })
  .attr('stroke-width', d => d.level === 3 ? 1.2 : 1)
  .style('color', d => catColor[d.cat]); // currentColor for hover glow

/* Icon group (Level 1 only) */
pillSel.filter(d => d.level === 1)
  .append('g')
  .attr('class', 'pill-icon')
  .html(d => CAT_ICONS[d.iconKey] || '');

/* Level 2: small colored dot indicator */
pillSel.filter(d => d.level === 2)
  .append('circle')
  .attr('class', 'pill-dot')
  .attr('r', 3.5)
  .attr('fill', d => catColor[d.cat]);

/* Text */
pillSel.append('text')
  .attr('class', 'pill-text')
  .attr('text-anchor', 'middle')
  .attr('dominant-baseline', 'central')
  .attr('font-size', d => d.level === 1 ? 14 : (d.level === 2 ? 11.5 : 10.5))
  .attr('font-weight', d => d.level === 1 ? 600 : (d.level === 2 ? 500 : 500))
  .attr('letter-spacing', d => d.level === 1 ? '0.01em' : '0')
  .attr('fill', d => {
    if (d.level === 1) return getCSSVar('--hw-neural-black');
    if (d.level === 2) return getCSSVar('--hw-white');
    return catColor[d.cat];
  })
  .text(d => d.label);

/* ----- Measure text and size each pill (icon + dot offsets) ----- */
function sizePills() {
  pillSel.each(function(d) {
    const g = d3.select(this);
    const txt = g.select('text').node();
    const bbox = txt.getBBox();
    let padH, padV, iconW = 0, dotW = 0;
    if (d.level === 1) { padH = 18; padV = 11; iconW = 26; }     // icon + gap
    else if (d.level === 2) { padH = 13; padV = 8; dotW = 12; }  // dot + gap
    else { padH = 11; padV = 6; }

    d.pillW = bbox.width + padH * 2 + iconW + dotW;
    d.pillH = bbox.height + padV * 2;

    g.select('rect')
      .attr('x', -d.pillW / 2)
      .attr('y', -d.pillH / 2)
      .attr('width', d.pillW)
      .attr('height', d.pillH);

    if (d.level === 1) {
      // Icon left of text, text shifted right
      g.select('.pill-icon').attr('transform', `translate(${-d.pillW / 2 + padH - 1}, ${-11})`);
      g.select('text').attr('x', iconW / 2);
    } else if (d.level === 2) {
      g.select('.pill-dot').attr('cx', -d.pillW / 2 + padH).attr('cy', 0);
      g.select('text').attr('x', dotW / 2);
    }
  });
}
sizePills();

/* Re-measure once web fonts (Space Grotesk) finish loading,
   so pills hug the final glyph widths and not the fallback. */
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => {
    sizePills();
    // recompute collision footprints
    simulation.force('collide').initialize(simulation.nodes());
    simulation.alpha(0.5).restart();
  });
}

/* Set center collision footprint */
const centerData = graph.nodes.find(n => n.id === 'hatchworks');
centerData.pillW = 200;
centerData.pillH = 110;

/* ===== Force simulation ===== */
const simulation = d3.forceSimulation(graph.nodes)
  .force('link', d3.forceLink(graph.links).id(d => d.id)
    .distance(d => {
      const t = d.target;
      if (t.level === 1) return 230;
      if (t.level === 2) return 115;
      return 60;
    })
    .strength(d => d.strength))
  .force('charge', d3.forceManyBody().strength(d => {
    if (d.level === 0) return -1400;
    if (d.level === 1) return -900;
    if (d.level === 2) return -260;
    return -80;
  }))
  .force('center', d3.forceCenter(width / 2, height / 2))
  .force('collide', d3.forceCollide().radius(d => {
    const w = d.pillW || 40;
    const h = d.pillH || 40;
    // Circumscribed circle of the pill + breathing room
    return Math.sqrt((w / 2) ** 2 + (h / 2) ** 2) + 5;
  }).iterations(3))
  .alpha(1)
  .alphaDecay(0.022);

simulation.on('tick', () => {
  linkSel
    .attr('x1', d => d.source.x)
    .attr('y1', d => d.source.y)
    .attr('x2', d => d.target.x)
    .attr('y2', d => d.target.y);
  nodeG.attr('transform', d => `translate(${d.x}, ${d.y})`);
});

function dragStart(event, d) {
  if (!event.active) simulation.alphaTarget(0.25).restart();
  d.fx = d.x; d.fy = d.y;
}
function dragged(event, d) {
  d.fx = event.x; d.fy = event.y;
}
function dragEnd(event, d) {
  if (!event.active) simulation.alphaTarget(0);
  d.fx = null; d.fy = null;
}

/* ===== Highlight connected nodes ===== */
function highlightNeighbors(nodeId) {
  const connected = new Set([nodeId]);
  graph.links.forEach(l => {
    const s = l.source.id || l.source;
    const t = l.target.id || l.target;
    if (s === nodeId) connected.add(t);
    if (t === nodeId) connected.add(s);
  });
  nodeG.classed('is-dimmed', d => !connected.has(d.id));
  linkSel
    .classed('is-highlighted', l => {
      const s = l.source.id || l.source;
      const t = l.target.id || l.target;
      return s === nodeId || t === nodeId;
    })
    .classed('is-dimmed', l => {
      const s = l.source.id || l.source;
      const t = l.target.id || l.target;
      return !(s === nodeId || t === nodeId);
    });
}
function clearHighlight() {
  nodeG.classed('is-dimmed', false);
  linkSel.classed('is-highlighted', false).classed('is-dimmed', false);
}

svg.on('click', () => clearHighlight());

/* ===== Zoom controls ===== */
document.getElementById('zoom-in').addEventListener('click', () => {
  svg.transition().duration(300).call(zoom.scaleBy, 1.3);
});
document.getElementById('zoom-out').addEventListener('click', () => {
  svg.transition().duration(300).call(zoom.scaleBy, 0.7);
});
document.getElementById('zoom-reset').addEventListener('click', () => {
  svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity);
});

/* ===== Resize ===== */
window.addEventListener('resize', () => {
  width = window.innerWidth;
  height = window.innerHeight - document.querySelector('header').offsetHeight;
  svg.attr('viewBox', `0 0 ${width} ${height}`);
  simulation.force('center', d3.forceCenter(width / 2, height / 2));
  simulation.alpha(0.3).restart();
});


/* ===========================================================
   FLOATING KEYWORDS MODE
   =========================================================== */

const bubbleContainer = document.getElementById('bubble-container');
const bubbles = [];

function initBubbles() {
  bubbleContainer.innerHTML = '';
  bubbles.length = 0;
  const stage = document.getElementById('keyword-stage');
  const w = stage.clientWidth;
  const h = stage.clientHeight;

  HW.floating.forEach((item, i) => {
    const el = document.createElement('div');
    el.className = `bubble type-${item.type}`;
    el.dataset.type = item.type;
    el.textContent = item.text;
    el.addEventListener('click', () => openKeywordPanel(item));

    // Random starting position
    const x = Math.random() * (w - 200) + 100;
    const y = Math.random() * (h - 200) + 100;
    el.style.left = x + 'px';
    el.style.top = y + 'px';

    bubbleContainer.appendChild(el);

    bubbles.push({
      el, item,
      x, y,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      w: 0, h: 0
    });
  });

  // Measure each bubble
  requestAnimationFrame(() => {
    bubbles.forEach(b => {
      b.w = b.el.offsetWidth;
      b.h = b.el.offsetHeight;
    });
  });
}

let bubbleRAF = null;
function animateBubbles() {
  const stage = document.getElementById('keyword-stage');
  const w = stage.clientWidth;
  const h = stage.clientHeight;
  const top = 80; // leave space for filters

  bubbles.forEach(b => {
    if (b.el.classList.contains('is-hidden')) return;
    b.x += b.vx;
    b.y += b.vy;
    if (b.x <= 0)            { b.x = 0; b.vx *= -1; }
    if (b.x + b.w >= w)      { b.x = w - b.w; b.vx *= -1; }
    if (b.y <= top)          { b.y = top; b.vy *= -1; }
    if (b.y + b.h >= h - 60) { b.y = h - 60 - b.h; b.vy *= -1; }
    b.el.style.transform = `translate(${b.x - parseFloat(b.el.style.left)}px, ${b.y - parseFloat(b.el.style.top)}px)`;
  });
  bubbleRAF = requestAnimationFrame(animateBubbles);
}

function stopBubbles() {
  if (bubbleRAF) cancelAnimationFrame(bubbleRAF);
  bubbleRAF = null;
}

/* Filter handling */
document.querySelectorAll('.keyword-filters button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.keyword-filters button').forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    const filter = btn.dataset.filter;
    bubbles.forEach(b => {
      const visible = filter === 'all' || b.item.type === filter;
      b.el.classList.toggle('is-hidden', !visible);
    });
  });
});

/* ===========================================================
   MODE SWITCHING
   =========================================================== */

const btnMindmap = document.getElementById('btn-mindmap');
const btnKeywords = document.getElementById('btn-keywords');
const stageMindmap = document.getElementById('mindmap-stage');
const stageKeywords = document.getElementById('keyword-stage');

function switchMode(mode) {
  if (mode === 'mindmap') {
    btnMindmap.classList.add('is-active');
    btnKeywords.classList.remove('is-active');
    stageMindmap.classList.add('is-active');
    stageKeywords.classList.remove('is-active');
    stopBubbles();
    simulation.alpha(0.3).restart();
  } else {
    btnKeywords.classList.add('is-active');
    btnMindmap.classList.remove('is-active');
    stageKeywords.classList.add('is-active');
    stageMindmap.classList.remove('is-active');
    initBubbles();
    animateBubbles();
  }
}

btnMindmap.addEventListener('click', () => switchMode('mindmap'));
btnKeywords.addEventListener('click', () => switchMode('keywords'));

/* ===========================================================
   DETAIL PANEL
   =========================================================== */

const panel = document.getElementById('panel');
const backdrop = document.getElementById('backdrop');
const panelContent = document.getElementById('panel-content');
const panelCloseBtn = document.getElementById('panel-close-btn');

panelCloseBtn.addEventListener('click', closePanel);
backdrop.addEventListener('click', closePanel);

function closePanel() {
  panel.classList.remove('is-open');
  backdrop.classList.remove('is-open');
  clearHighlight();
}

function openPanel(nodeId) {
  const node = HW.byId[nodeId];
  if (!node) return;
  panelContent.innerHTML = renderNodePanel(node);
  bindPanelLinks();
  panel.classList.add('is-open');
  backdrop.classList.add('is-open');
  panel.scrollTop = 0;
}

function openKeywordPanel(item) {
  panelContent.innerHTML = renderKeywordPanel(item);
  bindPanelLinks();
  panel.classList.add('is-open');
  backdrop.classList.add('is-open');
  panel.scrollTop = 0;
}

function catLabel(cat) {
  return {
    center: 'HatchWorks AI',
    core: 'Core Service',
    accelerator: 'Accelerator',
    training: 'Training & Workshops',
    partner: 'Partnership',
    industry: 'Industry',
    tool: 'Tool & Course'
  }[cat] || 'Service';
}

function catVar(cat) {
  return {
    center: '--hw-teal',
    core: '--cat-core',
    accelerator: '--cat-accelerator',
    training: '--cat-training',
    partner: '--cat-partner',
    industry: '--cat-industry',
    tool: '--cat-tool'
  }[cat] || '--cat-core';
}

function renderNodePanel(node) {
  if (node.id === 'hatchworks') return renderCenterPanel();
  if (node.level === 1) return renderCategoryPanel(node);
  return renderServicePanel(node);
}

function renderCenterPanel() {
  return `
    <span class="panel-tag" style="background: rgba(58,189,188,0.12); color: var(--hw-teal); border: 1px solid rgba(58,189,188,0.3);">
      <span class="swatch" style="background: var(--hw-teal);"></span> HatchWorks AI
    </span>
    <h2>The AI Development Partner</h2>
    <p class="lede">We help enterprises turn AI into ROI by automating high-impact work and building AI-native products grounded in your data. AI is all we do, that is why we deliver outcomes, not pilots.</p>

    <div class="section">
      <h3>What we do</h3>
      <ul class="sub-list">
        <li data-open="core"><strong>5 Core Services</strong>Strategy, software, data, talent, and automation. End-to-end coverage from idea to production.</li>
        <li data-open="accel"><strong>5 Accelerators</strong>GenDD, RAG, Solution Accelerator, Data Readiness, GenIQ. Compressed time-to-value.</li>
        <li data-open="train"><strong>4 Training Programs</strong>From the boardroom to engineering. Build AI fluency at every level.</li>
        <li data-open="ind"><strong>6 Industries</strong>Communications, Tech, Healthcare, Finance, Retail, Real Estate.</li>
        <li data-open="part"><strong>4 Partners</strong>Databricks, Google Cloud, Anthropic, AWS.</li>
      </ul>
    </div>

    <div class="section">
      <h3>Why HatchWorks</h3>
      <ul class="sub-list">
        <li><strong>AI is all we do</strong>Deeper expertise, faster movement, no learning curve.</li>
        <li><strong>Proprietary methodology</strong>Generative-Driven Development (GenDD), from idea to production.</li>
        <li><strong>Nearshore in your timezone</strong>Teams across the US and Latin America.</li>
        <li><strong>Outcome-driven</strong>We measure business impact, not deliverables.</li>
      </ul>
    </div>

    <div class="section">
      <h3>Recognition</h3>
      <div class="pill-grid">
        <span class="pill tech">#1 AI Services Company · Clutch</span>
        <span class="pill tech">Inc. AI Power Partner</span>
        <span class="pill tech">Top AI Strategy 2024–2025</span>
        <span class="pill tech">Global Gen AI Awards</span>
        <span class="pill tech">SOC 2 Type 1</span>
      </div>
    </div>

    <div class="section">
      <div class="cta-row">
        <a class="cta cta-primary" href="/company/contact/" target="_blank" rel="noopener">Get in Touch</a>
        <a class="cta cta-secondary" href="/case-studies/" target="_blank" rel="noopener">Case Studies</a>
      </div>
    </div>
  `;
}

function renderCategoryPanel(node) {
  const items = {
    core: HW.coreServices,
    accelerator: HW.accelerators,
    training: HW.training,
    partner: HW.partnerships,
    industry: HW.industries,
    tool: HW.tools
  }[node.cat] || [];

  const intro = {
    core: 'Put AI to work in your business. Five interlocking services that take you from strategy to running systems.',
    accelerator: 'Pre-built engagements that compress time to value. Drop them into an existing roadmap or start here.',
    training: 'Practical training and workshops designed to accelerate AI adoption across every level of the organization.',
    partner: 'Our partners in AI, data, and cloud. Certified, deep, and integrated into how we deliver.',
    industry: 'We bring AI patterns proven across these industries, with the compliance and operational shape they require.',
    tool: 'Self-serve tools, publications, and courses that surface opportunity or build capability.'
  }[node.cat];

  return `
    <span class="panel-tag" style="background: color-mix(in srgb, var(${catVar(node.cat)}) 14%, transparent); color: var(${catVar(node.cat)}); border: 1px solid color-mix(in srgb, var(${catVar(node.cat)}) 35%, transparent);">
      <span class="swatch" style="background: var(${catVar(node.cat)});"></span> ${catLabel(node.cat)}
    </span>
    <h2>${node.label}</h2>
    <p class="lede">${intro}</p>

    <div class="section">
      <h3>${items.length} ${node.label} in this category</h3>
      <ul class="sub-list">
        ${items.map(it => `
          <li data-open="${it.id}">
            <strong>${it.label}</strong>
            ${it.desc || ''}
          </li>
        `).join('')}
      </ul>
    </div>

    <div class="section">
      <div class="cta-row">
        <a class="cta cta-primary" href="/company/contact/" target="_blank" rel="noopener">Talk to an Expert</a>
      </div>
    </div>
  `;
}

function renderServicePanel(node) {
  const cat = node.cat;
  const isLeaf = node.level === 3;
  const parentNode = isLeaf ? HW.byId[node.parent] : null;
  const effective = isLeaf ? parentNode : node;

  const children = node.children;
  const tech = effective.tech;
  const painPoints = effective.painPoints;
  const searches = effective.searches;
  const useCases = effective.useCases;
  const url = node.url || effective.url;

  return `
    <span class="panel-tag" style="background: color-mix(in srgb, var(${catVar(cat)}) 14%, transparent); color: var(${catVar(cat)}); border: 1px solid color-mix(in srgb, var(${catVar(cat)}) 35%, transparent);">
      <span class="swatch" style="background: var(${catVar(cat)});"></span> ${catLabel(cat)}${isLeaf ? ' · sub-service' : ''}
    </span>
    <h2>${node.label}</h2>
    <p class="lede">${node.desc || effective.desc || ''}</p>

    ${isLeaf && parentNode ? `
      <div class="section">
        <h3>Part of</h3>
        <ul class="sub-list">
          <li data-open="${parentNode.id}"><strong>${parentNode.label}</strong>${parentNode.desc || ''}</li>
        </ul>
      </div>
    ` : ''}

    ${children && children.length ? `
      <div class="section">
        <h3>Sub-services</h3>
        <ul class="sub-list">
          ${children.map(ch => `
            <li data-open="${ch.id}">
              <strong>${ch.label}</strong>
              ${ch.desc || ''}
            </li>
          `).join('')}
        </ul>
      </div>
    ` : ''}

    ${useCases && useCases.length ? `
      <div class="section">
        <h3>Use cases &amp; proof</h3>
        <ul class="sub-list">
          ${useCases.map(u => `<li>${u}</li>`).join('')}
        </ul>
      </div>
    ` : ''}

    ${tech ? `
      <div class="section">
        <h3>Tech &amp; methodology</h3>
        <div class="tech-stack"><span class="key">stack ▸</span> ${tech}</div>
      </div>
    ` : ''}

    ${painPoints && painPoints.length ? `
      <div class="section">
        <h3>Pain points this solves</h3>
        <div class="pill-grid">
          ${painPoints.map(p => `<span class="pill pain">${p}</span>`).join('')}
        </div>
      </div>
    ` : ''}

    ${searches && searches.length ? `
      <div class="section">
        <h3>Clients land here Googling</h3>
        <div class="pill-grid">
          ${searches.map(s => `<span class="pill search">${s}</span>`).join('')}
        </div>
      </div>
    ` : ''}

    <div class="section">
      <div class="cta-row">
        ${url ? `<a class="cta cta-secondary" href="${url}" target="_blank" rel="noopener">View Page</a>` : ''}
        <a class="cta cta-primary" href="/company/contact/" target="_blank" rel="noopener">Talk to us</a>
      </div>
    </div>
  `;
}

function renderKeywordPanel(item) {
  const typeLabel = {
    pain:     'Client Pain Point',
    search:   'Likely Google Search',
    industry: 'Industry Lens',
    keyword:  'Technical Keyword'
  }[item.type];

  const typeColor = {
    pain:     'var(--cat-pain)',
    search:   'var(--cat-search)',
    industry: 'var(--cat-industry)',
    keyword:  'var(--cat-keyword)'
  }[item.type];

  const intro = {
    pain:     'When a client surfaces this pain, here is how HatchWorks responds. Each card maps to a specific service we can deliver.',
    search:   'Clients Googling this phrase are in research mode. These are the exact HatchWorks offerings that match their intent.',
    industry: 'Inside this industry, these are the HatchWorks services and accelerators that most often apply.',
    keyword:  'This is a technical term that signals a specific kind of work. Here is how HatchWorks shows up against it.'
  }[item.type];

  const recs = (item.recs || []).map(id => HW.byId[id]).filter(Boolean);

  return `
    <span class="panel-tag" style="background: color-mix(in srgb, ${typeColor} 14%, transparent); color: ${typeColor}; border: 1px solid color-mix(in srgb, ${typeColor} 40%, transparent);">
      <span class="swatch" style="background: ${typeColor};"></span> ${typeLabel}
    </span>
    <h2>${item.text}</h2>
    <p class="lede">${intro}</p>

    <div class="section">
      <h3>HatchWorks services that map here</h3>
      ${recs.map(r => `
        <div class="recommendation" data-open="${r.id}">
          <div class="rec-cat">${catLabel(r.cat)}</div>
          <h4>${r.label}</h4>
          <p>${r.desc || ''}</p>
          <span class="arrow">→</span>
        </div>
      `).join('')}
    </div>

    <div class="section">
      <h3>How we engage</h3>
      <ul class="sub-list">
        <li><strong>Discovery (1 to 2 weeks)</strong>We map your context, data, and constraints to the right starting point. Often the AI Roadmap & ROI Workshop or AI Solution Accelerator.</li>
        <li><strong>Prove it (4 to 8 weeks)</strong>Working prototype on real data using GenDD. No demos, real software.</li>
        <li><strong>Scale (quarter by quarter)</strong>Production rollout with embedded pods, talent, governance, and observability.</li>
      </ul>
    </div>

    <div class="section">
      <div class="cta-row">
        <a class="cta cta-primary" href="/company/contact/" target="_blank" rel="noopener">Start a Conversation</a>
        <a class="cta cta-secondary" href="/agentic-opportunity-finder/" target="_blank" rel="noopener">Agentic Opportunity Finder</a>
      </div>
    </div>
  `;
}

function bindPanelLinks() {
  panelContent.querySelectorAll('[data-open]').forEach(el => {
    el.addEventListener('click', () => {
      const target = el.dataset.open;
      openPanel(target);
    });
  });
}

/* ===========================================================
   INIT
   =========================================================== */

// Pre-cool the simulation a bit
for (let i = 0; i < 80; i++) simulation.tick();
nodeG.attr('transform', d => `translate(${d.x}, ${d.y})`);
linkSel
  .attr('x1', d => d.source.x).attr('y1', d => d.source.y)
  .attr('x2', d => d.target.x).attr('y2', d => d.target.y);

// Close panel on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closePanel();
});
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":35340,"isReadableSinglePost":false,"hasVimeoEmbed":false,"wordCount":0,"estimatedReadTimeSeconds":0,"isLastPageOfMultiPagePost":false,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before
