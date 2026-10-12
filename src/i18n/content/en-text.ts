import type { ContentOverlay } from './types'

/**
 * Texto em inglês da apresentação, da história, do FAQ, dos termos, dos patamares, das maturidades e dos
 * benchmarks. Mesmos ids e mesma ordem dos arquivos em português (src/presentation, src/guide, src/data).
 */
export const enText: Omit<ContentOverlay, 'skills'> = {
  presentation: {
    'boas-vindas': {
      title: 'Welcome to the AI tree',
      body: [
        'AI Tech Tree & Knowledge shows the evolution of artificial intelligence as a tree of skills.',
        'From the base, classical machine learning, up to the top, theoretical superintelligence.',
      ],
      notes: 'Open with the full screen visible. There is no need to touch anything yet.',
    },
    eixos: {
      title: 'The two axes',
      body: [
        'The columns are the areas: Architectures & Networks, Compute & Hardware, Reasoning & LLMs, Robotics & Embodiment and Alignment & Governance.',
        'The rows are the tiers, from T1 (base) to T5 (top). Each skill sits on the tier of its complexity.',
      ],
      notes: 'The area names are at the top of each column. T1 to T5 appear on the left of each row.',
    },
    hexagono: {
      title: 'How to read a hexagon',
      body: [
        'Each hexagon is a skill. The colored dot is the signature color, the same in all of its replicas.',
        'The badge below shows the maturity: Theoretical, Experimental, Production or Commoditized.',
      ],
      notes: 'Hover over a hexagon to see the corner brackets that highlight it.',
    },
    arestas: {
      title: 'Edges are dependencies',
      body: [
        'The circuit trails link a prerequisite to the skill it unlocks.',
        'The pulse of energy moves from the prerequisite to the unlock. Each link has its own trail, so none overlaps another.',
      ],
      notes: 'Without the trail from a prerequisite, the next skill has no base to stand on.',
    },
    replicas: {
      title: 'Replicas',
      body: [
        'Some skills appear in more than one area. Attention Mechanism is in Architectures and in Reasoning.',
        'The dashed outline marks the replica. Hover over any of them: all the instances light up together.',
      ],
    },
    'abrir-habilidade': {
      title: 'Opening a skill',
      body: [
        'Click a hexagon to open the drawer with its details. The view centers on it, with room left for the drawer.',
        'You can also search by name: press / and type.',
      ],
    },
    'streamline-research': {
      title: 'Streamline and Research',
      body: [
        'The Streamline mode shows the concept and the impact, without jargon.',
        'The Research mode unlocks exact dates, authors, equations and metrics. Switch it at the top right of the drawer.',
      ],
    },
    abas: {
      title: 'The skill tabs',
      body: [
        'Overview, history (sortable by date or by impact), actors and labs, flowchart, relations graph, and sources with benchmarks.',
      ],
    },
    fontes: {
      title: 'Sources and stacked navigation',
      body: [
        'Each source opens a panel over the skill. The path appears at the top: Area > Skill > Paper.',
        'Press ESC to go back one step. On the first sheet, ESC closes the drawer.',
      ],
    },
    'pre-requisitos': {
      title: 'Prerequisites and unlocks',
      body: [
        'In the Graph tab, each prerequisite and each unlock is a button. Clicking it opens the matching skill.',
        'The canvas centers on the new skill automatically.',
      ],
    },
    filtros: {
      title: 'Filters and the ghosting effect',
      body: [
        'In the filter panel, choose an area, a company or a maturity.',
        'What does not match turns gray and faded, and what matches pulses. The geometry of the tree does not change.',
      ],
    },
    empresas: {
      title: 'Filtering by company',
      body: [
        'Filter by company, such as OpenAI, Anthropic or Google DeepMind.',
        'In the drawer, clicking a company opens its sheet, with the skills and models it brings.',
      ],
    },
    'linha-do-tempo': {
      title: 'Timeline',
      body: [
        'Drag the Time Slider in the footer. Technologies later than the chosen date enter the fog.',
        'Here the map is set to 1990: only what came before exists.',
      ],
    },
    benchmarks: {
      title: 'Benchmarks',
      body: [
        'The Benchmark Vault, at the top right, gathers SWE-bench, MMLU-Pro, ARC-AGI and Arena Elo.',
        'When you pick one, the grid highlights the skills it evaluates.',
      ],
      notes: 'The values are only the ones published in the original paper. Current scores are in the official source, and the panel links to it.',
    },
    modelos: {
      title: 'Model layer',
      body: [
        'Turn on Models to see GPT-4o, Claude 3.5 Sonnet, Gemini 2.0 and DeepSeek-R1 orbiting the matching skills.',
      ],
    },
    organizacao: {
      title: 'Organizing the tree',
      body: [
        'Drag any hexagon: the trails are redrawn and the position is saved.',
        'Default returns to the curated layout. Auto-arrange reorders each area to reduce crossings.',
      ],
    },
    encerramento: {
      title: 'Recap',
      body: [
        'Areas in columns, tiers in rows, skills with verified sources, a drawer with stacked navigation, filters, timeline, benchmarks and models.',
        'To explore on your own, use the search (the / key).',
      ],
    },

    // História
    'historia-inicio': {
      title: 'Before anything: the fog',
      body: [
        'This is the history of artificial intelligence, from the beginning to today.',
        'Everything that did not exist yet is in the fog. As the history advances, the Time Slider advances with it and the tree grows.',
      ],
      notes: 'Start with the full screen and let the fog cover almost everything.',
    },
    'historia-1950-turing': {
      title: '1950 · Turing’s question',
      body: [
        'Alan Turing publishes in the journal Mind the question: can machines think?',
        'He proposes an imitation game: an interrogator talks blindly with a machine and with a person. If they cannot tell them apart, the machine may be considered intelligent.',
      ],
    },
    'historia-1956-dartmouth': {
      title: '1956 · The field is born',
      body: [
        'At the Dartmouth summer workshop, researchers such as McCarthy, Minsky and Shannon bring together the idea of studying machines that simulate human intelligence. That is where the name "artificial intelligence" takes hold.',
        'The initial bet is to reason with symbols and logical rules.',
      ],
    },
    'historia-1958-perceptron': {
      title: '1958 · The first neuron that learns',
      body: [
        'Frank Rosenblatt creates the perceptron, a network of a single neuron that learns to separate classes by adjusting its own weights.',
        'A machine appears that learns from examples, instead of following rules written by hand.',
      ],
    },
    'historia-1969-inverno': {
      title: '1969 to 1980 · The AI winter',
      body: [
        'Minsky and Papert show the limits of the single-layer perceptron: it cannot learn the XOR function.',
        'Funding drops and the area cools down. Part of the work continues, quietly, to solve that limit.',
      ],
      notes: 'Show the contrast: the idea did not die, it was waiting for a technique to train deep layers.',
    },
    'historia-1986-backprop': {
      title: '1986 · Training hidden layers',
      body: [
        'Rumelhart, Hinton and Williams publish backpropagation of the error in Nature: the method that calculates how each weight should change to reduce the error, layer by layer.',
        'Now it is possible to train networks with several layers.',
      ],
    },
    'historia-1997-lstm': {
      title: '1997 · Long-term memory',
      body: [
        'Hochreiter and Schmidhuber create the LSTM, a recurrent network with gates that decide what to remember and what to forget.',
        'It keeps information across many steps of a sequence and becomes the standard for text and speech for two decades.',
      ],
    },
    'historia-1998-cnn': {
      title: '1998 · Filters that sweep the image',
      body: [
        'LeCun applies convolutional networks to document recognition, in the LeNet architecture.',
        'The idea of one same filter moving across the whole image, with few parameters, is born here.',
      ],
    },
    'historia-2012-gpu': {
      title: '2007 to 2012 · The graphics card becomes a computer',
      body: [
        'In 2007, NVIDIA launches CUDA, which lets the GPU do general computation and not only graphics.',
        'In 2012, AlexNet trains on two of these GPUs and wins ILSVRC by a wide margin. The deep learning era begins.',
      ],
    },
    'historia-2014-atencao': {
      title: '2014 · The network learns to look',
      body: [
        'Bahdanau, Cho and Bengio let the neural translator look at the right parts of the input sentence for each word it generates.',
        'The attention mechanism is born as a response to a bottleneck: compressing a whole sentence into a single vector.',
      ],
    },
    'historia-2015-jogos': {
      title: '2015 to 2016 · Learning to play',
      body: [
        'DeepMind’s DQN learns Atari games from the pixels, with no written rules.',
        'In 2016, AlphaGo beats Lee Sedol, combining reinforcement learning with search.',
      ],
    },
    'historia-2017-transformer': {
      title: '2017 · Attention only',
      body: [
        'The paper "Attention Is All You Need" replaces recurrence with pure attention. The whole sequence is processed in parallel.',
        'It scales better than recurrent networks, and it is the basis of almost everything that comes after.',
      ],
    },
    'historia-2018-llm': {
      title: '2018 · Pretraining on text',
      body: [
        'GPT-1 and BERT show that pretraining a transformer on large volumes of text produces representations useful for many tasks.',
        'The large language model is born.',
      ],
    },
    'historia-2020-escala': {
      title: '2020 · Predictable scale',
      body: [
        'Kaplan and colleagues show that the error falls predictably when parameters, data and compute are increased.',
        'GPT-3, with 175 billion parameters, becomes the reference. Scaling becomes a plan, not a guess.',
      ],
    },
    'historia-2022-alinhamento': {
      title: '2022 · Aligning with people',
      body: [
        'InstructGPT tunes the model with human preferences, and it starts following instructions instead of only completing text.',
        'Constitutional AI follows the same line, with written principles in place of part of the human evaluations.',
      ],
    },
    'historia-2023-multimodal': {
      title: '2023 · Seeing beyond text',
      body: [
        'GPT-4 and Gemini start to receive images, in addition to text.',
        'These are the multimodal foundation models: they perceive and reason about more than one modality.',
      ],
    },
    'historia-2025-raciocinio': {
      title: '2025 · Reasoning with reinforcement learning',
      body: [
        'DeepSeek-R1 trains long reasoning with reinforcement learning, with open weights.',
        'Turn on the model layer: GPT-4o, Claude 3.5, Gemini 2.0 and DeepSeek-R1 orbit the matching skills.',
      ],
    },
    'historia-hoje-topo': {
      title: 'Today · And the top of the tree?',
      body: [
        'At the top, superintelligence is still theoretical: a system that improves itself.',
        'The debate on governance and control is happening now, before any tier has been reached.',
      ],
      notes: 'Close with the open question for the audience.',
    },
    'historia-fim': {
      title: 'End of the history',
      body: [
        'From 1950 to today: a question, a field, a neuron, a winter, a method, a memory, a vision, an attention, a transformer, a scale and an alignment.',
        'Use the arrows or the outline on the right to revisit any step.',
      ],
    },
  },

  faq: {
    'o-que-e': {
      question: 'What is this tree?',
      answer: [
        'It is a map of the evolution of artificial intelligence. Each hexagon is a skill: a concept, an architecture, a technique or an open problem.',
        'The columns are the areas and the rows are the tiers, from T1 (base, classical machine learning) to T5 (top, theoretical superintelligence).',
      ],
    },
    ponto: {
      question: 'Why does each hexagon have only one colored dot?',
      answer: [
        'The dot is the skill’s signature color: its identity. Each one has its own color, and the replicas use the same one, so you can recognize the skill in another area.',
        'The other signals are the maturity badge, the corner brackets, the focus border and the fog. The five-dot scale appears only in the History tab, as the impact of each milestone.',
      ],
    },
    replica: {
      question: 'What is a replica?',
      answer: [
        'A skill that appears in more than one area. Attention Mechanism, for example, is in Architectures and in Reasoning.',
        'The replica’s outline is dashed. The full data is on the original skill, and the How to use tab points to it.',
      ],
    },
    nevoa: {
      question: 'What is the fog?',
      answer: [
        'When you move the timeline to a year, the skills introduced after it fall into the fog: they stay in their position, but are nearly invisible.',
        'This shows how the tree was formed over time.',
      ],
    },
    foco: {
      question: 'How do focus and the blue border work?',
      answer: [
        'The skill open in the drawer, or the one the presentation step is explaining, gets the blue border. The camera centers on it, in the free area to the left of the drawer.',
        'When you open a prerequisite or an unlock from the Graph tab, the camera moves to the new skill.',
      ],
    },
    organizacao: {
      question: 'How do I save the layout I made?',
      answer: [
        'Drag the hexagons. The position is saved in this browser and comes back when you reopen the page.',
        'Default erases the layout and returns to the curated one. Auto-arrange reorders each area to reduce crossings.',
      ],
    },
    compartilhar: {
      question: 'Can I share a skill?',
      answer: [
        'Yes. When you open a skill, the page address gets the #habilidade fragment followed by its identifier, for example #habilidade=llm.',
        'Anyone who opens that address sees the skill already open and centered.',
      ],
    },
    busca: {
      question: 'How do I search for a skill?',
      answer: [
        'Open the Search button in the top-left panel, or press the / key. Type part of the name; accents do not matter.',
        'Enter opens the first result. Clicking a result opens the skill and centers the tree on it.',
      ],
    },
    atalhos: {
      question: 'What are the keyboard shortcuts?',
      answer: [
        '/ focuses the search. ESC, in the drawer, goes back one sheet; on the first one, it closes the drawer.',
        'The arrow keys move the focus between hexagons, and Tab cycles through hexagons and tabs. Enter or Space opens the selected hexagon.',
        'With the presentation or the History open, the ← and → arrows move between steps.',
      ],
    },
    'apresentacao-historia': {
      question: 'What is the difference between Presentation and History?',
      answer: [
        'Presentation has 17 steps about how to use the system: how to read it, explore it, filter it, and use the time and the models.',
        'History has 19 steps telling the evolution of AI from 1950 to today, and the Time Slider moves along with the story.',
      ],
    },
    abas: {
      question: 'What is in each tab of the drawer?',
      answer: [
        'Overview, History, Actors & Labs, Flowchart, Graph, Sources & Benchmarks and How to use.',
        'The How to use tab explains the open hexagon: what each part of it means for the skill and how to use it, with prerequisites, unlocks, sources and benchmarks.',
      ],
    },
    dados: {
      question: 'Where does the data come from?',
      answer: [
        'From the sources cited in each skill: papers (arXiv and DOI), repositories and reference texts. The links open the original source.',
        'The date of a skill is that of the paper that introduced it, unless noted otherwise.',
      ],
    },
    placares: {
      question: 'Do the benchmarks show current scores?',
      answer: [
        'Yes, with a date. Each benchmark shows the value from the original paper and, when there is one, the current score read on a date, with the page the data came from and the link to the official leaderboard so you can check it.',
        'Scores change, and each value carries the setting it was measured in: numbers from different settings cannot be compared. When the source of a value is an aggregator, the panel says so.',
      ],
    },
    completa: {
      question: 'Does the tree show everything in AI?',
      answer: [
        'No. It is an editorial selection of skills, made to explain the evolution of the field, not a complete catalog.',
      ],
    },
    celular: {
      question: 'Can I use it on a phone?',
      answer: [
        'The current version is designed for computers. On small screens, the header hides some buttons and the drawer takes up the whole screen.',
      ],
    },
    adicionar: {
      question: 'How do I add a new skill?',
      answer: [
        'Add an object to the files in src/data/skills/, in the right area. Then run npm test: the tests check links, colors, sources and the integrity of the tree.',
        'The README has the step-by-step guide.',
      ],
    },
    termos: {
      question: 'What do the terms mean (LLM, AGI, ASI, benchmark, source, Mermaid...)?',
    },
  },

  terms: [
    { term: 'Skill', text: 'A node of the tree: a concept, an architecture, a technique or a problem.' },
    { term: 'Area', text: 'Thematic column of the tree.' },
    { term: 'Tier', text: 'Level of evolution, from T1 to T5. The explanation of each one is in the FAQ.' },
    { term: 'Prerequisite', text: 'What must exist before a skill makes sense.' },
    { term: 'Unlock', text: 'What a skill makes possible after it.' },
    { term: 'Replica', text: 'Another appearance of a skill, in another area. Same color and same data.' },
    { term: 'Signature color', text: 'The unique color of a skill, used on the dot, on the pulse and on the border.' },
    { term: 'Benchmark', text: 'Standardized test to compare AI systems.' },
    { term: 'Source', text: 'Paper: scientific article. Repository: open code and weights. Article: popular science text or encyclopedia.' },
    { term: 'Time Slider', text: 'The timeline control, in the footer.' },
    { term: 'Fog', text: 'A skill later than the year chosen on the Time Slider.' },
    { term: 'Ghosting', text: 'Fading of everything that does not match the filter or the benchmark.' },
    { term: 'LLM', text: 'Large language model: a transformer trained on large volumes of text.' },
    { term: 'AGI', text: 'Artificial general intelligence: able to learn and act across a wide range of tasks, at human level or above.' },
    { term: 'ASI', text: 'Artificial superintelligence: far beyond humans at practically everything. In the app, it is theoretical.' },
    { term: 'Mermaid', text: 'Text language for drawing flowcharts. The diagrams in this tab are made with it.' },
  ],

  tiers: {
    1: {
      explanation: [
        'These are the classical machine learning methods and the mathematical ideas that support everything else: statistics, linear models, decision trees, support vector machines, gradient descent and the artificial neuron itself.',
        'Many of them are already simple and interpretable, and they work well with limited data.',
      ],
      criteria: [
        'Models with few layers, or fundamental ideas that do not depend on deep networks.',
        'They are usually taught as the basics of the field.',
        'They work well with little data and are easy to explain.',
      ],
      position: 'It sits at the base because almost everything else depends on it: without the gradient and the neuron, there is no deep learning.',
    },
    2: {
      explanation: [
        'These are deep neural networks trained for a specific task: recognizing images, translating sentences, transcribing speech, playing a game. The word "narrow" means exactly that: the network is very good at one task and does not generalize to another on its own.',
        'This is where the architectures that dominated the field appeared, such as convolutional networks and attention.',
      ],
      criteria: [
        'Uses networks with many layers, trained by backpropagation and, usually, on GPUs.',
        'Learns representations from many labeled or simulated data.',
        'Performs excellently on one task, but does not transfer well to others without retraining.',
      ],
      position: 'It sits just above the base: it is the first leap that depends on the fundamentals of T1, but it does not generalize yet.',
    },
    3: {
      explanation: [
        'These are the large language models and the systems that use those capabilities to act: they use tools, plan in several steps, search the web and run code. An agent, in this sense, is a system that perceives, decides and acts in sequence to reach a goal.',
        'One same model serves many text tasks, which is a turning point compared with T2. Even so, it makes mistakes and usually needs supervision.',
      ],
      criteria: [
        'Learns a general capability (such as language) and uses it across many different tasks.',
        'Can act: call tools, browse, write and run code, in a decision loop.',
        'Still not reliable without verification on long tasks.',
      ],
      position: 'It sits in the middle of the tree: it depends on the T2 architectures (such as the transformer) and opens the way to the longer reasoning of T4.',
    },
    4: {
      explanation: [
        'These are the systems that approach general intelligence: multimodal models (which understand text, image and audio together), long reasoning, agents that operate across many domains and robots that transfer what they learned to new tasks.',
        'There is no consensus that AGI, general intelligence at human level, has been reached. In the app, this tier marks what is closest to it, and the discussion remains open.',
      ],
      criteria: [
        'Good performance on many different tasks, and transfer between domains.',
        'Combines perception (image, audio) with language and reasoning.',
        'Still with clear limitations, and with public debate on how close it really is to AGI.',
      ],
      position: 'It sits above T3 because it combines the earlier capabilities into general systems. It is the most disputed stretch of the tree.',
      references: [
        'Morris et al., "Levels of AGI for Operationalizing Progress on the Path to AGI" (arXiv:2311.02462, 2023): proposes performance levels for AGI, from emerging to superhuman.',
      ],
    },
    5: {
      explanation: [
        'This is superintelligence: an intelligence that widely surpasses humans in practically every domain, including AI research itself. It does not exist. It is a theoretical scenario, used to think about risks, control and governance before anything like it appears.',
        'The skills on this tier are not products. They are working hypotheses.',
      ],
      criteria: [
        'Theoretical: no implementation exists today.',
        'Usually involves recursive self-improvement, control of very capable systems and the physical limits of computation.',
        'Discussed by safety and governance researchers, not by products.',
      ],
      position: 'It sits at the top: it depends on what is below it, but there is still no consolidated technical path to it.',
      references: [
        'Good, "Speculations Concerning the First Ultraintelligent Machine" (1965): the idea that a machine able to improve itself leads to an intelligence explosion.',
        'Bostrom, "Superintelligence: Paths, Dangers, Strategies" (Oxford University Press, 2014): the classic study of the paths, risks and control of superintelligence.',
      ],
    },
  },

  statuses: {
    theoretical: {
      explanation: [
        'A proposal, a scenario or an argument without a consolidated implementation. It can be a forecast, a thought experiment or a risk analysis.',
        'It serves to think about the path, not to be used today.',
      ],
      recognize: [
        'No system is in use and there is no replicable result.',
        'The reference text is usually a position paper, an analysis or well-founded speculation.',
      ],
    },
    research: {
      explanation: [
        'Active research: there are papers, prototypes and published results, but the technique has not yet been widely adopted in products.',
        'This is where the field is testing ideas, and some of these ideas will still become production.',
      ],
      recognize: [
        'Laboratory results and published benchmarks, with open code or at an early stage.',
        'Still few people use it outside research, and the implementations change a lot from one work to the next.',
      ],
    },
    production: {
      explanation: [
        'In real use, in products and services people use today. The technique has already passed the proof stage and is applied in everyday work.',
        'There are still variants competing with each other, and it has not yet become the basics of the field.',
      ],
      recognize: [
        'Used by well-known products, with mature tools and documentation.',
        'It is still a differentiator for whoever implements it well, and comparisons between approaches are frequent.',
      ],
    },
    commodity: {
      explanation: [
        'Standard technique: available in any library, taught as the basics and used without needing special justification. It stopped being a differentiator and became infrastructure.',
        'An example is gradient descent: almost nobody reinvents it, everyone uses it.',
      ],
      recognize: [
        'Implemented in one line of code in common libraries.',
        'It appears in introductory courses and is no longer the subject of a main paper.',
      ],
    },
  },

  benchmarks: {
    'swe-bench': {
      description: 'Resolving real issues from GitHub repositories, with tests that verify the fix.',
      reference: {
        value: '1.96% resolved (Claude 2, BM25 retrieval)',
        setting: 'BM25 retrieval; with a file oracle, the same model reaches 4.80%',
      },
      current: {
        leader: 'Claude 4.5 Opus (high), mini-SWE-agent harness, bash only',
        value: '76.8%',
        sourceLabel: 'swebench.com (official)',
        note: 'Verified (500 instances), default configuration of the official leaderboard: bash only, with the mini-SWE-agent harness. Entry of 02/17/2026. Next: Gemini 3 Flash and MiniMax M2.5 (75.8%). The 96% figures circulating on other sites use other configurations and are not comparable with this one.',
      },
    },
    'mmlu-pro': {
      description: 'Harder version of MMLU, with 10 answer options and reasoning questions.',
      current: {
        leader: 'Gemini-3.1-Pro (TIGER-Lab), tied with Llama-3.1-Nemotron-70B-Instruct',
        value: '91.16%',
        sourceLabel: 'TIGER-Lab (official)',
        note: 'Official table, sorted by overall score. The first two rows have the same score and the same per-area scores, which suggests a duplicate in the table. Vals.ai measures 92.38% for Claude Fable 5.1, with another methodology.',
      },
    },
    'arc-agi': {
      description: 'Abstraction and reasoning tasks on grids, designed so they cannot be solved by memorization. The current score is for ARC-AGI-2.',
      current: {
        leader: 'GPT-6 Astra (Max), ARC-AGI-2',
        value: '95%',
        sourceLabel: 'ARC Prize (official)',
        note: 'Official table, with the ARC-AGI-2 filter. Model release: 09/02/2026. Next: GPT-6.1 Sol (Max), 94.2%, and Claude Opus 5.5 (High), 93.3%. The 88.06% from Tufa Labs comes from a Kaggle competition with about half of the test data: a different contest.',
      },
    },
    'arc-agi-3': {
      description: 'Turn-based interactive environments, with no instructions or rules: the agent discovers the goal by acting. The score compares its actions with those of a human.',
      reference: {
        value: 'Humans: 100%. Frontier AI: 0.51%',
        setting: 'Launch, 03/25/2026. RHAE score: action efficiency relative to a human',
      },
      current: {
        leader: 'GPT-6 Astra (Max), default configuration · GPT-6 Astra (High), with Provider Adapter',
        value: '62.7% (default) · 99.9% (Provider Adapter)',
        sourceLabel: 'ARC Prize (official)',
        note: 'Official table, with the ARC-AGI-3 filter. Each number is the best score of one configuration. OpenAI announced 99.9% for GPT-6 Astra, which matches the Provider Adapter configuration. Model release: 09/02/2026. Humans: 100%.',
      },
    },
    'arena-elo': {
      description: 'Ranking by human preference in pairwise comparisons, with an Elo score.',
      current: {
        leader: 'gemini-4-argon-high (preliminary), text ranking',
        value: '1525 ±9',
        sourceLabel: 'Arena (arena.ai, official)',
        note: 'Official table read in the browser. Next: claude-opus-5.5-high (1507) and claude-opus-4-6-high (1504). The preliminary score may change.',
      },
    },
    mmlu: {
      description: 'Multiple-choice questions in 57 areas, from high school to graduate level.',
      reference: {
        value: '43.9% (GPT-3 175B, few-shot)',
        setting: 'Few-shot; the result is from Hendrycks et al., not from the GPT-3 paper',
      },
    },
    imagenet: {
      description: 'Image classification into 1000 classes. The annual competition marked the turning point of deep learning.',
      reference: {
        value: '15.3% top-5 error (AlexNet, ILSVRC 2012)',
        setting: 'Second place in the same year: 26.2%',
      },
      current: {
        leader: 'CoCa ViT-G/14 (Google), tuned for ImageNet-1k',
        value: '91.0% top-1',
        sourceLabel: 'Codesota (aggregator)',
        note: 'ImageNet does not keep a current leaderboard. The entry is from 2022 (arxiv.org/abs/2205.01917); the Codesota page was reviewed in March 2026.',
      },
    },
  },
}
