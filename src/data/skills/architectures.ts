import { sig } from '../../lib/color'
import type { SkillSeed } from '../../types/skill'

/** Arquiteturas & Redes (coluna 0). */
export const ARCHITECTURE_SKILLS: SkillSeed[] = [
  {
    id: 'perceptron',
    name: 'Perceptron',
    domain: 'architectures',
    tier: 1,
    gridCoordinates: { col: 0, row: 0 },
    signatureColor: sig(0),
    prerequisites: [],
    metadata: { status: 'commodity', dateIntroduced: '1958', companies: ['Cornell Aeronautical Laboratory'] },
    content: {
      overview:
        'Classificador linear de uma camada: soma ponderada das entradas seguida de um limiar. Aprende ajustando os pesos sempre que erra.',
      impact:
        'É o ancestral de toda rede neural. Mostrou que uma regra simples de aprendizado converge para separadores lineares.',
      history: [
        { year: 1958, event: 'Rosenblatt publica o modelo do perceptron na Psychological Review', importance: 5 },
        { year: 1969, event: 'Minsky e Papert mostram limites do perceptron de uma camada (ex.: XOR)', importance: 4 },
      ],
      actors: [{ name: 'Frank Rosenblatt', role: 'Proponente', org: 'Cornell Aeronautical Laboratory' }],
      equations: [
        { label: 'Saída', expression: 'y = 1 se (w·x + b) > 0, senão 0' },
        { label: 'Atualização', expression: 'w ← w + η (y_real − y) x' },
      ],
      sources: [
        {
          title: 'The perceptron: a probabilistic model for information storage and organization in the brain',
          url: 'https://doi.org/10.1037/h0042519',
          type: 'paper',
          summary: 'Artigo original de Rosenblatt (1958), que define o perceptron e sua regra de aprendizado.',
        },
      ],
    },
  },
  {
    id: 'svm',
    name: 'Support Vector Machine',
    domain: 'architectures',
    tier: 1,
    gridCoordinates: { col: 0, row: 1 },
    signatureColor: sig(1),
    prerequisites: [],
    metadata: { status: 'production', dateIntroduced: '1995', companies: ['AT&T Bell Labs'] },
    content: {
      overview:
        'Encontra o hiperplano que separa as classes com a maior margem possível. Com kernels, separa dados que não são lineares no espaço original.',
      impact:
        'Dominou classificação antes do deep learning e ainda é referência em dados tabulares pequenos e médios.',
      history: [
        { year: 1963, event: 'Vapnik e Lerner propõem o hiperplano de margem máxima', importance: 3 },
        { year: 1995, event: 'Cortes e Vapnik publicam a formulação com margem suave', importance: 5 },
      ],
      actors: [
        { name: 'Corinna Cortes', role: 'Autora', org: 'AT&T Bell Labs' },
        { name: 'Vladimir Vapnik', role: 'Autor', org: 'AT&T Bell Labs' },
      ],
      equations: [{ label: 'Problema primal', expression: 'min ½‖w‖²  sujeito a  yᵢ(w·xᵢ + b) ≥ 1' }],
      sources: [
        {
          title: 'Support-vector networks',
          url: 'https://doi.org/10.1007/BF00994018',
          type: 'paper',
          summary: 'Artigo de Cortes e Vapnik (1995) que apresenta as máquinas de vetores de suporte.',
        },
      ],
    },
  },
  {
    id: 'cnn',
    name: 'Rede Convolucional (CNN)',
    domain: 'architectures',
    tier: 2,
    gridCoordinates: { col: 0, row: 0 },
    signatureColor: sig(2),
    prerequisites: ['perceptron', 'backprop'],
    metadata: { status: 'production', dateIntroduced: '1998', companies: ['AT&T Bell Labs', 'Meta'] },
    content: {
      overview:
        'Aplica filtros aprendidos que varrem a imagem e compartilham pesos entre posições. Isso captura bordas, texturas e formas com poucos parâmetros.',
      impact:
        'Foi a arquitetura que transformou visão computacional. Ainda é base de detecção, segmentação e diversos sistemas de imagem.',
      history: [
        { year: 1989, event: 'LeCun aplica redes convolucionais com backpropagation a reconhecimento de dígitos', importance: 4 },
        { year: 1998, event: 'LeNet-5 é descrito no artigo de referência de reconhecimento de documentos', importance: 5 },
        { year: 2012, event: 'AlexNet vence o ILSVRC e inaugura a era do deep learning em visão', importance: 5 },
      ],
      actors: [{ name: 'Yann LeCun', role: 'Autor do LeNet', org: 'AT&T Labs-Research (na época do artigo)' }],
      equations: [{ label: 'Convolução 2D', expression: 'S(i,j) = Σₘ Σₙ I(i+m, j+n) · K(m,n)' }],
      mermaidDiagram:
        'flowchart LR\n  A["Imagem HxWxC"] --> B["Conv 3x3 + ReLU"]\n  B --> C["Pooling 2x2"]\n  C --> D["Conv + Pooling"]\n  D --> E["Camadas densas"]\n  E --> F["Classes"]',
      sources: [
        {
          title: 'Gradient-based learning applied to document recognition',
          url: 'https://doi.org/10.1109/5.726791',
          type: 'paper',
          summary: 'Artigo de LeCun et al. (1998) que descreve a arquitetura LeNet e o treino por gradiente.',
        },
        {
          title: 'ImageNet classification with deep convolutional neural networks',
          url: 'https://papers.nips.cc/paper/4824-imagenet-classification-with-deep-convolutional-neural-networks',
          type: 'paper',
          summary: 'AlexNet (Krizhevsky, Sutskever e Hinton, 2012), que marca o início do deep learning em visão.',
        },
      ],
    },
  },
  {
    id: 'attention',
    name: 'Attention Mechanism',
    domain: 'architectures',
    tier: 2,
    gridCoordinates: { col: 0, row: 1 },
    signatureColor: sig(3),
    rootEntityId: 'attention',
    prerequisites: ['seq2seq'],
    metadata: { status: 'production', dateIntroduced: '2014-09', companies: ['Mila', 'Google'], modelsAssociated: [] },
    content: {
      overview:
        'Permite que o modelo pondere, para cada saída, quais partes da entrada importam, em vez de comprimir tudo em um vetor fixo.',
      impact:
        'Resolveu o gargalo de traduzir frases longas com um único vetor. Virou o bloco central dos transformers.',
      history: [
        { year: 2014, event: 'Bahdanau, Cho e Bengio aplicam atenção alinhada à tradução neural', importance: 5 },
        { year: 2015, event: 'Luong et al. propõem variações de atenção global e local', importance: 3 },
        { year: 2017, event: 'Transformer generaliza a atenção como único mecanismo de sequência', importance: 5 },
      ],
      actors: [{ name: 'Dzmitry Bahdanau', role: 'Autor', org: 'Jacobs University Bremen (no artigo de 2014)' }],
      equations: [
        { label: 'Peso de alinhamento', expression: 'αᵢⱼ = softmax_j(eᵢⱼ)' },
        { label: 'Vetor de contexto', expression: 'cᵢ = Σⱼ αᵢⱼ · hⱼ' },
      ],
      mermaidDiagram:
        'flowchart LR\n  H["Estados do encoder hⱼ"] --> S["Score eᵢⱼ"]\n  S --> A["α = softmax"]\n  A --> C["Contexto cᵢ = Σ α hⱼ"]\n  C --> Y["Saída yᵢ"]',
      sources: [
        {
          title: 'Neural Machine Translation by Jointly Learning to Align and Translate',
          url: 'https://arxiv.org/abs/1409.0473',
          type: 'paper',
          summary: 'Bahdanau, Cho e Bengio (2014). Introduz a atenção aditiva para tradução neural.',
        },
      ],
    },
  },
  {
    id: 'transformer',
    name: 'Transformer',
    domain: 'architectures',
    tier: 2,
    gridCoordinates: { col: 0, row: 2 },
    signatureColor: sig(4),
    prerequisites: ['attention'],
    metadata: { status: 'production', dateIntroduced: '2017-06', companies: ['Google'] },
    content: {
      overview:
        'Arquitetura só de atenção, sem recorrência. Processa a sequência inteira em paralelo e usa atenção multi-cabeça com codificação posicional.',
      impact:
        'Escalou melhor que as RNNs e é a base de praticamente todos os LLMs, modelos de visão e de áudio atuais.',
      history: [
        { year: 2017, event: 'Vaswani et al. publicam "Attention Is All You Need"', importance: 5 },
        { year: 2018, event: 'BERT e GPT-1 adotam o transformer para pré-treino', importance: 5 },
      ],
      actors: [{ name: 'Ashish Vaswani', role: 'Primeiro autor', org: 'Google' }],
      equations: [
        { label: 'Atenção escalonada', expression: 'Attention(Q,K,V) = softmax(QKᵀ / √dₖ) V' },
      ],
      benchmarks: {
        'WMT 2014 EN→DE · BLEU (Transformer big)': '28,4',
      },
      mermaidDiagram:
        'flowchart TD\n  A["Embedding + codificação posicional"] --> B["Atenção multi-cabeça"]\n  B --> C["Add & Norm"]\n  C --> D["Rede feed-forward"]\n  D --> E["Add & Norm"]\n  E --> F["Saída"]',
      sources: [
        {
          title: 'Attention Is All You Need',
          url: 'https://arxiv.org/abs/1706.03762',
          type: 'paper',
          summary: 'Vaswani et al. (2017). Propõe o transformer. O resultado de 28,4 BLEU está na Tabela 2.',
        },
      ],
    },
  },
  {
    id: 'resnet',
    name: 'ResNet',
    domain: 'architectures',
    tier: 3,
    gridCoordinates: { col: 0, row: 0 },
    signatureColor: sig(5),
    prerequisites: ['cnn'],
    metadata: { status: 'production', dateIntroduced: '2015-12', companies: ['Microsoft'] },
    content: {
      overview:
        'Adiciona conexões de atalho que somam a entrada de um bloco à sua saída. Isso permite treinar redes com centenas de camadas sem degradação.',
      impact:
        'Resolveu o problema de degradação em redes profundas e virou a espinha dorsal de muitas tarefas de visão.',
      history: [
        { year: 2015, event: 'He et al. publicam a ResNet, que vence o ILSVRC 2015', importance: 5 },
        { year: 2016, event: 'Variantes com pré-ativação e blocos de gargalo se tornam padrão', importance: 3 },
      ],
      actors: [{ name: 'Kaiming He', role: 'Primeiro autor', org: 'Microsoft Research' }],
      equations: [{ label: 'Bloco residual', expression: 'y = F(x, {Wᵢ}) + x' }],
      sources: [
        {
          title: 'Deep Residual Learning for Image Recognition',
          url: 'https://arxiv.org/abs/1512.03385',
          type: 'paper',
          summary: 'He et al. (2015). Introduz as conexões residuais.',
        },
      ],
    },
  },
  {
    id: 'vit',
    name: 'Vision Transformer (ViT)',
    domain: 'architectures',
    tier: 3,
    gridCoordinates: { col: 0, row: 1 },
    signatureColor: sig(6),
    prerequisites: ['transformer', 'cnn'],
    metadata: { status: 'production', dateIntroduced: '2020-10', companies: ['Google'] },
    content: {
      overview:
        'Divide a imagem em patches de 16×16, transforma cada um em um token e aplica um transformer padrão. Dispensa convoluções na classificação.',
      impact:
        'Mostrou que o transformer também vence em visão quando há dados suficientes, e unificou arquiteturas de texto e imagem.',
      history: [
        { year: 2020, event: 'Dosovitskiy et al. publicam o ViT no arXiv', importance: 5 },
        { year: 2021, event: 'CLIP usa encoders de imagem e texto para aprendizado contrastivo', importance: 4 },
      ],
      actors: [{ name: 'Alexey Dosovitskiy', role: 'Primeiro autor', org: 'Google Research' }],
      equations: [{ label: 'Entrada de patches', expression: 'z₀ = [x_cls; x_p¹E; …; x_pᴺE] + E_pos' }],
      sources: [
        {
          title: 'An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale',
          url: 'https://arxiv.org/abs/2010.11929',
          type: 'paper',
          summary: 'Dosovitskiy et al. (2020). Aplica transformers puros a patches de imagem.',
        },
      ],
    },
  },
  {
    id: 'diffusion-models',
    name: 'Modelos de Difusão',
    domain: 'architectures',
    tier: 3,
    gridCoordinates: { col: 0, row: 2 },
    signatureColor: sig(7),
    prerequisites: ['cnn'],
    metadata: { status: 'production', dateIntroduced: '2020-06', companies: ['UC Berkeley', 'LMU Munich'] },
    content: {
      overview:
        'Aprende a reverter um processo que adiciona ruído gradualmente. Para gerar, parte de ruído puro e remove o ruído passo a passo.',
      impact:
        'Passaram a dominar a geração de imagens de alta fidelidade. A versão latente é a base dos geradores de imagem populares.',
      history: [
        { year: 2015, event: 'Sohl-Dickstein et al. propõem a difusão como processo de ruído reversível', importance: 3 },
        { year: 2020, event: 'Ho, Jain e Abbeel publicam o DDPM, com qualidade competitiva com GANs', importance: 5 },
        { year: 2022, event: 'Difusão latente (Stable Diffusion) reduz o custo ao treinar no espaço latente', importance: 5 },
      ],
      actors: [
        { name: 'Jonathan Ho', role: 'Autor do DDPM', org: 'UC Berkeley' },
        { name: 'Robin Rombach', role: 'Autor da difusão latente', org: 'LMU Munich' },
      ],
      equations: [{ label: 'Objetivo simplificado', expression: 'L = E‖ε − ε_θ(xₜ, t)‖²' }],
      sources: [
        {
          title: 'Denoising Diffusion Probabilistic Models',
          url: 'https://arxiv.org/abs/2006.11239',
          type: 'paper',
          summary: 'Ho, Jain e Abbeel (2020). Formula o DDPM e o objetivo de predição de ruído.',
        },
        {
          title: 'High-Resolution Image Synthesis with Latent Diffusion Models',
          url: 'https://arxiv.org/abs/2112.10752',
          type: 'paper',
          summary: 'Rombach et al. (2022). Treina a difusão no espaço latente de um autoencoder.',
        },
      ],
    },
  },
  {
    id: 'mamba',
    name: 'Mamba (Modelos de Espaço de Estados)',
    domain: 'architectures',
    tier: 4,
    gridCoordinates: { col: 0, row: 0 },
    signatureColor: sig(8),
    prerequisites: ['transformer'],
    metadata: { status: 'research', dateIntroduced: '2023-12', companies: ['Carnegie Mellon', 'Princeton'] },
    content: {
      overview:
        'Modelo de sequência com espaço de estados seletivo. Tem custo linear no tamanho do contexto, em vez do quadrático da atenção.',
      impact:
        'Propõe uma alternativa ao transformer para contextos muito longos, com inferência mais barata por token.',
      history: [
        { year: 2021, event: 'S4 mostra modelos de espaço de estados eficientes para contextos longos', importance: 3 },
        { year: 2023, event: 'Gu e Dao publicam o Mamba, com seleção dependente da entrada', importance: 5 },
      ],
      actors: [
        { name: 'Albert Gu', role: 'Primeiro autor', org: 'Carnegie Mellon' },
        { name: 'Tri Dao', role: 'Autor', org: 'Princeton' },
      ],
      equations: [
        { label: 'Sistema contínuo', expression: "h'(t) = A h(t) + B x(t);  y(t) = C h(t)" },
      ],
      sources: [
        {
          title: 'Mamba: Linear-Time Sequence Modeling with Selective State Spaces',
          url: 'https://arxiv.org/abs/2312.00752',
          type: 'paper',
          summary: 'Gu e Dao (2023). Introduz a seleção dependente da entrada nos modelos de espaço de estados.',
        },
      ],
    },
  },
  {
    id: 'moe',
    name: 'Mixture of Experts',
    domain: 'architectures',
    tier: 4,
    gridCoordinates: { col: 0, row: 1 },
    signatureColor: sig(9),
    prerequisites: ['transformer'],
    metadata: { status: 'production', dateIntroduced: '2017-01', companies: ['Google'] },
    content: {
      overview:
        'Muitos especialistas na mesma camada e um roteador que escolhe poucos para cada entrada. Aumenta os parâmetros sem aumentar o custo por token.',
      impact:
        'Permite modelos com muitos parâmetros totais e custo de inferência moderado. É uma das formas de escalar sem crescer o compute por token.',
      history: [
        { year: 1991, event: 'Jacobs et al. propõem a mistura adaptativa de especialistas', importance: 3 },
        { year: 2017, event: 'Shazeer et al. aplicam MoE esparso com roteamento top-k em larga escala', importance: 5 },
      ],
      actors: [{ name: 'Noam Shazeer', role: 'Primeiro autor', org: 'Google Brain' }],
      equations: [
        { label: 'Saída', expression: 'y = Σᵢ G(x)ᵢ · Eᵢ(x)' },
        { label: 'Roteamento top-k', expression: 'G(x) = softmax(KeepTopK(x·W_g, k))' },
      ],
      sources: [
        {
          title: 'Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer',
          url: 'https://arxiv.org/abs/1701.06538',
          type: 'paper',
          summary: 'Shazeer et al. (2017). MoE esparso com roteamento aprendido.',
        },
      ],
    },
  },
  {
    id: 'multimodal-fm',
    name: 'Modelos Fundacionais Multimodais',
    domain: 'architectures',
    tier: 4,
    gridCoordinates: { col: 0, row: 2 },
    signatureColor: sig(10),
    prerequisites: ['vit', 'transformer'],
    metadata: {
      status: 'production',
      dateIntroduced: '2023-03',
      companies: ['OpenAI', 'Google DeepMind'],
      modelsAssociated: ['GPT-4', 'Gemini 2.0'],
    },
    content: {
      overview:
        'Modelos únicos que recebem texto, imagem e, em alguns casos, áudio e vídeo, e raciocinam sobre todas essas modalidades juntas.',
      impact:
        'Unifica percepção e linguagem. É o passo que aproxima os modelos de agentes capazes de agir sobre o mundo visual.',
      history: [
        { year: 2021, event: 'CLIP alinha imagem e texto em um espaço comum', importance: 4 },
        { year: 2023, event: 'GPT-4 e Gemini 1.0 aceitam entradas multimodais', importance: 5 },
      ],
      actors: [
        { name: 'Gemini Team', role: 'Relatório técnico', org: 'Google DeepMind' },
        { name: 'OpenAI', role: 'Relatório técnico do GPT-4', org: 'OpenAI' },
      ],
      sources: [
        {
          title: 'Gemini: A Family of Highly Capable Multimodal Models',
          url: 'https://arxiv.org/abs/2312.11805',
          type: 'paper',
          summary: 'Relatório técnico da família Gemini (2023), com modelos multimodais nativos.',
        },
        {
          title: 'GPT-4 Technical Report',
          url: 'https://arxiv.org/abs/2303.08774',
          type: 'paper',
          summary: 'Relatório técnico do GPT-4 (2023), que aceita imagens além de texto.',
        },
      ],
    },
  },
]
