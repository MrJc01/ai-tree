import type { ContentOverlay } from './types'

/** Skill texts in English. Same ids and list order as src/data/skills/*.ts. */
export const enContent: ContentOverlay = {
  skills: {
    // Architectures & Networks
    perceptron: {
      overview:
        'Single-layer linear classifier: a weighted sum of the inputs followed by a threshold. It learns by adjusting the weights whenever it makes a mistake.',
      impact:
        'It is the ancestor of every neural network. It showed that a simple learning rule converges to linear separators.',
      history: [
        'Rosenblatt publishes the perceptron model in Psychological Review',
        'Minsky and Papert show the limits of the single-layer perceptron (e.g. XOR)',
      ],
      actors: [{ role: 'Proposer', org: 'Cornell Aeronautical Laboratory' }],
      equations: [
        { label: 'Output', expression: 'y = 1 if (w·x + b) > 0, otherwise 0' },
        { label: 'Update', expression: 'w ← w + η (y_real − y) x' },
      ],
      sources: [
        { summary: 'Rosenblatt’s original paper (1958), which defines the perceptron and its learning rule.' },
      ],
    },
    svm: {
      overview:
        'Finds the hyperplane that separates the classes with the largest possible margin. With kernels, it separates data that is not linear in the original space.',
      impact:
        'It dominated classification before deep learning and is still a reference for small and medium tabular data.',
      history: [
        'Vapnik and Lerner propose the maximum-margin hyperplane',
        'Cortes and Vapnik publish the soft-margin formulation',
      ],
      actors: [
        { role: 'Author', org: 'AT&T Bell Labs' },
        { role: 'Author', org: 'AT&T Bell Labs' },
      ],
      equations: [{ label: 'Primal problem', expression: 'min ½‖w‖²  subject to  yᵢ(w·xᵢ + b) ≥ 1' }],
      sources: [{ summary: 'Cortes and Vapnik (1995), which presents support vector networks.' }],
    },
    cnn: {
      name: 'Convolutional Neural Network (CNN)',
      overview:
        'Applies learned filters that sweep the image and share weights across positions. This captures edges, textures and shapes with few parameters.',
      impact:
        'It was the architecture that transformed computer vision. It is still the basis of detection, segmentation and many image systems.',
      history: [
        'LeCun applies convolutional networks trained with backpropagation to digit recognition',
        'LeNet-5 is described in the reference paper on document recognition',
        'AlexNet wins ILSVRC and starts the deep learning era in vision',
      ],
      actors: [{ role: 'Author of LeNet', org: 'AT&T Labs-Research (at the time of the paper)' }],
      equations: [{ label: '2D convolution', expression: 'S(i,j) = Σₘ Σₙ I(i+m, j+n) · K(m,n)' }],
      mermaid:
        'flowchart LR\n  A["Image HxWxC"] --> B["Conv 3x3 + ReLU"]\n  B --> C["Pooling 2x2"]\n  C --> D["Conv + Pooling"]\n  D --> E["Dense layers"]\n  E --> F["Classes"]',
      sources: [
        { summary: 'LeCun et al. (1998), which describes the LeNet architecture and gradient-based training.' },
        { summary: 'AlexNet (Krizhevsky, Sutskever and Hinton, 2012), which marks the start of deep learning in vision.' },
      ],
    },
    attention: {
      overview:
        'Lets the model weigh, for each output, which parts of the input matter, instead of compressing everything into one fixed vector.',
      impact:
        'It solved the bottleneck of translating long sentences with a single vector. It became the central block of transformers.',
      history: [
        'Bahdanau, Cho and Bengio apply alignment-based attention to neural translation',
        'Luong et al. propose global and local attention variants',
        'The Transformer generalizes attention as the only sequence mechanism',
      ],
      actors: [{ role: 'Author', org: 'Jacobs University Bremen (in the 2014 paper)' }],
      equations: [
        { label: 'Alignment weight', expression: 'αᵢⱼ = softmax_j(eᵢⱼ)' },
        { label: 'Context vector', expression: 'cᵢ = Σⱼ αᵢⱼ · hⱼ' },
      ],
      mermaid:
        'flowchart LR\n  H["Encoder states hⱼ"] --> S["Score eᵢⱼ"]\n  S --> A["α = softmax"]\n  A --> C["Context cᵢ = Σ α hⱼ"]\n  C --> Y["Output yᵢ"]',
      sources: [{ summary: 'Bahdanau, Cho and Bengio (2014). Introduces additive attention for neural translation.' }],
    },
    transformer: {
      overview:
        'Architecture built only from attention, with no recurrence. It processes the whole sequence in parallel and uses multi-head attention with positional encoding.',
      impact:
        'It scales better than RNNs and is the basis of practically all current LLMs, vision models and audio models.',
      history: [
        'Vaswani et al. publish "Attention Is All You Need"',
        'BERT and GPT-1 adopt the transformer for pretraining',
      ],
      actors: [{ role: 'First author', org: 'Google' }],
      equations: [{ label: 'Scaled attention', expression: 'Attention(Q,K,V) = softmax(QKᵀ / √dₖ) V' }],
      benchmarks: {
        'WMT 2014 EN→DE · BLEU (Transformer big)': '28.4',
      },
      mermaid:
        'flowchart TD\n  A["Embedding + positional encoding"] --> B["Multi-head attention"]\n  B --> C["Add & Norm"]\n  C --> D["Feed-forward network"]\n  D --> E["Add & Norm"]\n  E --> F["Output"]',
      sources: [{ summary: 'Vaswani et al. (2017). Proposes the transformer. The 28.4 BLEU result is in Table 2.' }],
    },
    resnet: {
      overview:
        'Adds shortcut connections that sum a block’s input to its output. This makes it possible to train networks with hundreds of layers without degradation.',
      impact:
        'It solved the degradation problem in deep networks and became the backbone of many vision tasks.',
      history: [
        'He et al. publish ResNet, which wins ILSVRC 2015',
        'Pre-activation and bottleneck block variants become standard',
      ],
      actors: [{ role: 'First author', org: 'Microsoft Research' }],
      equations: [{ label: 'Residual block', expression: 'y = F(x, {Wᵢ}) + x' }],
      sources: [{ summary: 'He et al. (2015). Introduces residual connections.' }],
    },
    vit: {
      overview:
        'Splits the image into 16×16 patches, turns each one into a token and applies a standard transformer. It needs no convolutions for classification.',
      impact:
        'It showed that the transformer also wins in vision when there is enough data, and it unified text and image architectures.',
      history: [
        'Dosovitskiy et al. publish ViT on arXiv',
        'CLIP uses image and text encoders for contrastive learning',
      ],
      actors: [{ role: 'First author', org: 'Google Research' }],
      equations: [{ label: 'Patch input', expression: 'z₀ = [x_cls; x_p¹E; …; x_pᴺE] + E_pos' }],
      sources: [{ summary: 'Dosovitskiy et al. (2020). Applies plain transformers to image patches.' }],
    },
    'diffusion-models': {
      name: 'Diffusion Models',
      overview:
        'Learns to reverse a process that gradually adds noise. To generate, it starts from pure noise and removes the noise step by step.',
      impact:
        'They came to dominate high-fidelity image generation. The latent version is the basis of popular image generators.',
      history: [
        'Sohl-Dickstein et al. propose diffusion as a reversible noising process',
        'Ho, Jain and Abbeel publish DDPM, with quality competitive with GANs',
        'Latent diffusion (Stable Diffusion) cuts the cost by training in latent space',
      ],
      actors: [
        { role: 'Author of DDPM', org: 'UC Berkeley' },
        { role: 'Author of latent diffusion', org: 'LMU Munich' },
      ],
      equations: [{ label: 'Simplified objective', expression: 'L = E‖ε − ε_θ(xₜ, t)‖²' }],
      sources: [
        { summary: 'Ho, Jain and Abbeel (2020). Formulates DDPM and the noise prediction objective.' },
        { summary: 'Rombach et al. (2022). Trains diffusion in the latent space of an autoencoder.' },
      ],
    },
    mamba: {
      name: 'Mamba (State Space Models)',
      overview:
        'Sequence model with a selective state space. Its cost grows linearly with the context length, instead of the quadratic cost of attention.',
      impact:
        'It proposes an alternative to the transformer for very long contexts, with cheaper inference per token.',
      history: [
        'S4 shows efficient state space models for long contexts',
        'Gu and Dao publish Mamba, with input-dependent selection',
      ],
      actors: [
        { role: 'First author', org: 'Carnegie Mellon' },
        { role: 'Author', org: 'Princeton' },
      ],
      equations: [{ label: 'Continuous system', expression: "h'(t) = A h(t) + B x(t);  y(t) = C h(t)" }],
      sources: [{ summary: 'Gu and Dao (2023). Introduces input-dependent selection in state space models.' }],
    },
    moe: {
      overview:
        'Many experts in the same layer and a router that picks a few of them for each input. It adds parameters without raising the cost per token.',
      impact:
        'It enables models with many total parameters and moderate inference cost. It is one way to scale without increasing the compute per token.',
      history: [
        'Jacobs et al. propose the adaptive mixture of experts',
        'Shazeer et al. apply sparse MoE with top-k routing at large scale',
      ],
      actors: [{ role: 'First author', org: 'Google Brain' }],
      equations: [
        { label: 'Output', expression: 'y = Σᵢ G(x)ᵢ · Eᵢ(x)' },
        { label: 'Top-k routing', expression: 'G(x) = softmax(KeepTopK(x·W_g, k))' },
      ],
      sources: [{ summary: 'Shazeer et al. (2017). Sparse MoE with learned routing.' }],
    },
    'multimodal-fm': {
      name: 'Multimodal Foundation Models',
      overview:
        'Single models that take text, images and, in some cases, audio and video, and reason over all these modalities together.',
      impact:
        'They unify perception and language. This is the step that brings models closer to agents able to act on the visual world.',
      history: [
        'CLIP aligns images and text in a shared space',
        'GPT-4 and Gemini 1.0 accept multimodal inputs',
      ],
      actors: [
        { role: 'Technical report', org: 'Google DeepMind' },
        { role: 'GPT-4 technical report', org: 'OpenAI' },
      ],
      sources: [
        { summary: 'Technical report of the Gemini family (2023), with natively multimodal models.' },
        { summary: 'GPT-4 technical report (2023), which accepts images as well as text.' },
      ],
    },

    // Compute & Hardware
    sgd: {
      name: 'Stochastic Gradient Descent',
      overview:
        'Updates the parameters with the gradient of a subset of the data at each step, instead of the whole dataset. It reduces the cost per iteration.',
      impact:
        'It made it possible to optimize models with a lot of data. Almost every neural network training is still a variant of it.',
      history: ['Robbins and Monro publish the stochastic approximation method'],
      actors: [
        { role: 'Author', org: 'University of North Carolina (affiliation in the 1951 paper)' },
        { role: 'Author', org: 'University of North Carolina (affiliation in the 1951 paper)' },
      ],
      equations: [{ label: 'Step', expression: 'θₜ₊₁ = θₜ − ηₜ ∇L(θₜ)' }],
      sources: [{ summary: 'Robbins and Monro (1951), the theoretical basis of stochastic updates.' }],
    },
    backprop: {
      name: 'Backpropagation',
      overview:
        'Computes the gradient of the loss with respect to each weight by applying the chain rule backwards through the network.',
      impact:
        'It made it possible to train networks with hidden layers. Without it, modern deep learning would not exist.',
      history: [
        'Linnainmaa describes reverse-mode automatic differentiation in his master\'s thesis (the basis of the method). The priority over backpropagation is debated',
        'Rumelhart, Hinton and Williams popularize backpropagation in Nature',
      ],
      actors: [
        { role: 'Author', org: 'UC San Diego' },
        { role: 'Author', org: 'Carnegie Mellon University' },
      ],
      equations: [{ label: 'Gradient at a layer', expression: '∂L/∂W = δ · aᵀ, with δ = (∂L/∂z) ⊙ σ′(z)' }],
      mermaid:
        'flowchart LR\n  X["Input"] --> F["Forward pass"]\n  F --> L["Loss L"]\n  L --> B["Backward pass: gradients"]\n  B --> U["Weight update"]',
      sources: [{ summary: 'Rumelhart, Hinton and Williams (1986), in Nature. Formalizes the use of backpropagation.' }],
    },
    gpu: {
      name: 'GPUs for Neural Training',
      overview:
        'Processors with thousands of cores for matrix operations in parallel. Multiplying large matrices on a GPU is much faster than on a CPU.',
      impact:
        'It made training deep networks practical. AlexNet was trained on two GTX 580 GPUs.',
      history: [
        'NVIDIA launches CUDA, which exposes the GPU for general-purpose computing',
        'AlexNet trains on two GPUs and wins ILSVRC',
      ],
      actors: [
        { role: 'Lead author of CUDA, with John Nickolls', org: 'NVIDIA' },
        { role: 'CUDA co-author', org: 'NVIDIA' },
      ],
      sources: [{ summary: 'AlexNet describes the training on two GPUs, the historical reference for this node.' }],
    },
    adam: {
      name: 'Adam Optimizer',
      overview:
        'Combines moving averages of the gradient and of its square to adjust the learning rate of each parameter.',
      impact:
        'It is the default optimizer in much of the language and vision models. It works well with little tuning.',
      history: [
        'Kingma and Ba publish Adam on arXiv',
        'AdamW separates weight decay and becomes the standard in transformers',
      ],
      actors: [
        { role: 'First author', org: 'University of Amsterdam' },
        { role: 'Author', org: 'University of Toronto' },
      ],
      equations: [{ label: 'Update', expression: 'θ ← θ − α · m̂ₜ / (√v̂ₜ + ε)' }],
      sources: [{ summary: 'Kingma and Ba (2014). Proposes Adam with adaptive moment estimates.' }],
    },
    'mixed-precision': {
      name: 'Mixed-Precision Training',
      overview:
        'Does most of the computation in half precision (FP16) and keeps a full-precision copy of the weights for stability.',
      impact:
        'It almost doubles the speed and reduces memory without losing quality. Without it, large models would not fit in memory.',
      history: ['Micikevicius et al. (NVIDIA) publish mixed-precision training'],
      actors: [{ role: 'First author (equal contribution with Sharan Narang, Baidu)', org: 'NVIDIA' }],
      sources: [{ summary: 'Micikevicius et al. (2017). Loss scaling and FP32 copies of the weights.' }],
    },
    tpu: {
      name: 'TPU (Tensor Processing Unit)',
      overview:
        'Google’s own accelerator, with systolic matrix multiplication units. Optimized for inference and training of dense networks.',
      impact:
        'It showed that a domain-specific chip can be much more efficient per watt than a general-purpose GPU.',
      history: [
        'Google starts using TPUs internally in production',
        'Jouppi et al. publish the performance analysis of TPU v1 in the datacenter',
      ],
      actors: [{ role: 'First author', org: 'Google' }],
      sources: [{ summary: 'Jouppi et al. (2017), an analysis of TPU v1 in production.' }],
    },
    'scaling-laws': {
      name: 'Scaling Laws',
      overview:
        'Language loss falls as a predictable power law when parameters, data and compute are increased, across many orders of magnitude.',
      impact:
        'It gave a quantitative basis for investing in larger models. It now guides the planning of frontier training runs.',
      history: [
        'Kaplan et al. (OpenAI) publish scaling laws for language models',
        'Chinchilla revises the optimal ratio between parameters and data',
      ],
      actors: [{ role: 'First author', org: 'OpenAI' }],
      equations: [{ label: 'Loss as a function of N', expression: 'L(N) ≈ (N_c / N)^α_N' }],
      sources: [{ summary: 'Kaplan et al. (2020). Power law between loss, parameters, data and compute.' }],
    },
    chinchilla: {
      name: 'Compute-Optimal Training (Chinchilla)',
      overview:
        'For a fixed compute budget, the optimum is to scale parameters and training tokens in the same proportion, instead of favoring a giant model trained on little data.',
      impact:
        'It changed how LLM training is planned: smaller models trained on more data outperform larger models that are undertrained.',
      history: ['Hoffmann et al. (DeepMind) publish Chinchilla, with 70B parameters and 4× more data'],
      actors: [{ role: 'First author', org: 'DeepMind' }],
      equations: [{ label: 'Optimal ratio', expression: 'N_opt ∝ C^a   and   D_opt ∝ C^b   with a ≈ b ≈ 0.5' }],
      benchmarks: {
        'MMLU (average) · Chinchilla 70B': '67.5%',
      },
      sources: [{ summary: 'Hoffmann et al. (2022). Proposes the optimal scaling rule for parameters and tokens.' }],
    },
    'frontier-training': {
      name: 'Frontier Training on Clusters',
      overview:
        'Training runs with tens of thousands of accelerators, coordinated by data, tensor and pipeline parallelism, with recovery from failures.',
      impact:
        'It is where it is decided what can be trained today. Cluster scale has become as important a factor as the algorithm.',
      history: [
        'Gemini is trained on TPUs from several generations, with a public technical report',
        'Meta describes training Llama 3 on clusters of tens of thousands of GPUs',
      ],
      actors: [
        { role: 'Llama 3 technical report', org: 'Meta' },
        { role: 'Gemini technical report', org: 'Google DeepMind' },
      ],
      sources: [
        { summary: 'Technical report of Llama 3 (2024), with details of the training at scale.' },
        { summary: 'Gemini report (2023), with the training on TPUs.' },
      ],
    },
    'zero-distributed': {
      name: 'Distributed Training (ZeRO)',
      overview:
        'Partitions optimizer states, gradients and parameters across the devices, instead of replicating them on each one.',
      impact:
        'It makes it possible to train models that do not fit in the memory of a single GPU, without rewriting the model.',
      history: [
        'Rajbhandari et al. (Microsoft) publish ZeRO',
        'DeepSpeed incorporates ZeRO and releases it as a library',
      ],
      actors: [{ role: 'First author', org: 'Microsoft' }],
      equations: [{ label: 'Memory per parameter (Adam, mixed precision)', expression: '≈ 16 bytes × Ψ (parameters)' }],
      sources: [{ summary: 'Rajbhandari et al. (2019). Partitioning of states to reduce memory per device.' }],
    },
    'physical-limits': {
      name: 'Physical Limits of Computation',
      overview:
        'Every irreversible operation dissipates a minimum amount of energy. Computing beyond a certain point would require more energy than is available.',
      impact:
        'It defines the theoretical ceiling on how much computation a physical superintelligence could use. It is the benchmark for any ASI scenario.',
      history: [
        'Landauer shows that erasing one bit dissipates at least kT ln 2 of energy',
        'Lloyd calculates the ultimate physical limits of computation in Nature',
      ],
      actors: [
        { role: 'Author of the principle', org: 'IBM Research' },
        { role: 'Author of the ultimate limits', org: 'MIT' },
      ],
      equations: [{ label: 'Landauer limit', expression: 'E_min = k_B · T · ln 2' }],
      sources: [
        { summary: 'Lloyd (2000), in Nature. Limits of energy and operations for a computer.' },
        { summary: 'Landauer (1961), in the IBM Journal of Research and Development.' },
      ],
    },

    // Reasoning & LLMs
    'symbolic-ai': {
      name: 'Symbolic AI',
      overview:
        'Represents knowledge with symbols and logical rules, and reasons by search and deduction. It was the dominant approach before statistical learning.',
      impact:
        'It founded the field and remains useful in formal verification, planning and systems with explicit rules.',
      history: [
        'The Dartmouth workshop brings together the founders of the field "artificial intelligence"',
        'Newell and Simon demonstrate the Logic Theorist, which proves theorems',
      ],
      actors: [
        { name: 'John McCarthy', role: 'Organizer of Dartmouth', org: 'Dartmouth College' },
        {
          name: 'Allen Newell and Herbert Simon',
          role: 'Logic Theorist (with Cliff Shaw, of RAND)',
          org: 'RAND Corporation and Carnegie Institute of Technology (CMU)',
        },
      ],
      sources: [{ summary: 'Summary of the 1956 workshop, which gives the field its formal starting point.' }],
    },
    'word-embeddings': {
      name: 'Word Embeddings',
      overview:
        'Represents each word as a dense vector, learned from the context in which it appears. Words with similar meaning end up close together.',
      impact:
        'It replaced sparse representations with dense vectors. It is the input layer of almost all language models before transformers.',
      history: ['Mikolov et al. publish word2vec with skip-gram and CBOW'],
      actors: [{ name: 'Tomas Mikolov', role: 'First author', org: 'Google' }],
      equations: [{ label: 'Skip-gram', expression: 'maximize Σₜ Σ_{−c≤j≤c, j≠0} log p(w_{t+j} | w_t)' }],
      sources: [{ summary: 'Mikolov et al. (2013). Skip-gram and CBOW models for word vectors.' }],
    },
    lstm: {
      overview:
        'Recurrent network with forget, input and output gates that control a cell state. It keeps long-range dependencies without the gradient vanishing.',
      impact:
        'For two decades it was the standard in translation, speech and text generation. It was surpassed at large scale only by transformers.',
      history: [
        'Hochreiter and Schmidhuber publish the LSTM in Neural Computation',
        'Bidirectional LSTMs and encoder-decoders dominate neural translation',
      ],
      actors: [
        { name: 'Sepp Hochreiter', role: 'First author', org: 'TU Munich' },
        { name: 'Jürgen Schmidhuber', role: 'Author', org: 'IDSIA' },
      ],
      equations: [{ label: 'Cell update', expression: 'cₜ = fₜ ⊙ cₜ₋₁ + iₜ ⊙ gₜ' }],
      sources: [{ summary: 'Hochreiter and Schmidhuber (1997), in Neural Computation.' }],
    },
    seq2seq: {
      name: 'Sequence-to-Sequence',
      overview:
        'An encoder reads the input sequence and a decoder generates the output sequence from a context vector.',
      impact:
        'It formalized end-to-end neural translation. The limit of the fixed vector motivated attention.',
      history: ['Sutskever, Vinyals and Le publish sequence-to-sequence neural translation'],
      actors: [{ name: 'Ilya Sutskever', role: 'First author', org: 'Google' }],
      equations: [
        { label: 'Output probability', expression: 'p(y₁…y_T′ | x₁…x_T) = Π_t p(y_t | v, y₁…y_{t−1})' },
      ],
      sources: [{ summary: 'Sutskever et al. (2014). LSTM encoder and LSTM decoder for translation.' }],
    },
    'attention-replica': {
      overview:
        'Same entity as the Architectures column. Here it appears as a reasoning tool over text: alignment weights between tokens.',
      impact:
        'Replica: the details, sources and history are in the original instance, under Architectures & Networks.',
    },
    llm: {
      name: 'Large Language Models (LLM)',
      overview:
        'Transformers trained to predict the next token over enormous corpora. Then tuned to follow instructions and hold conversations.',
      impact:
        'They concentrate knowledge, writing and reasoning in a single model. They are the core of current assistants and agents.',
      history: [
        'OpenAI publishes GPT-1: generative pretraining followed by fine-tuning',
        'Google publishes BERT, with bidirectional pretraining by masking',
        'GPT-3, with 175B parameters, shows in-context learning (few-shot)',
      ],
      actors: [
        { name: 'Alec Radford', role: 'Author of GPT-1', org: 'OpenAI' },
        { name: 'Jacob Devlin', role: 'First author of BERT', org: 'Google' },
        { name: 'Tom Brown', role: 'First author of GPT-3', org: 'OpenAI' },
      ],
      equations: [{ label: 'Language modeling objective', expression: 'L = − Σₜ log p_θ(xₜ | x₍<t₎)' }],
      benchmarks: {
        'MMLU · GPT-3 175B (few-shot)': '43.9%',
        'MMLU · GPT-3 175B (zero-shot)': '37.7%',
      },
      mermaid:
        'flowchart LR\n  P["Pretraining: next token"] --> S["Instruction tuning"]\n  S --> R["Preference alignment"]\n  R --> I["Inference: token by token"]',
      sources: [
        { summary: 'Radford et al. (2018), GPT-1 and generative pretraining followed by fine-tuning.' },
        { summary: 'Devlin et al. (2018). Bidirectional pretraining with masking.' },
        { summary: 'Brown et al. (2020), GPT-3 and the few-shot evaluation.' },
      ],
    },
    'chain-of-thought': {
      name: 'Chain-of-Thought',
      overview:
        'Asks the model to write out the intermediate reasoning steps before the answer. It improves accuracy on problems with many steps.',
      impact:
        'It showed that how you ask matters as much as the size of the model. It became a standard technique and the basis of extended reasoning.',
      history: ['Wei et al. (Google) show gains from chain-of-thought in arithmetic and reasoning'],
      actors: [{ name: 'Jason Wei', role: 'First author', org: 'Google Research' }],
      sources: [{ summary: 'Wei et al. (2022). Examples with reasoning steps in the prompt.' }],
    },
    react: {
      name: 'ReAct (Reasoning + Acting)',
      overview:
        'Interleaves thinking and acting: the model reasons, calls a tool, reads the observation and continues. Each step is text that can be audited.',
      impact:
        'It is the loop pattern of agents that use tools, such as search, code and navigation.',
      history: ['Yao et al. propose ReAct, with actions in environments such as Wikipedia and online shopping'],
      actors: [{ name: 'Shunyu Yao', role: 'First author', org: 'Princeton' }],
      sources: [{ summary: 'Yao et al. (2022). Interleaved thinking and acting in a single prompt.' }],
    },
    'reasoning-rl': {
      name: 'Reinforcement Reasoning (DeepSeek-R1)',
      overview:
        'Trains long reasoning with reinforcement learning and verifiable rewards, such as getting the math or the code right, without relying only on human examples.',
      impact:
        'It showed that reasoning can emerge from RL in a model with open weights. It changed the debate on how to increase capability at inference time.',
      history: ['DeepSeek publishes R1 and the technical report, with open weights'],
      actors: [{ name: 'DeepSeek-AI', role: 'Report authors', org: 'DeepSeek' }],
      sources: [
        { summary: 'Guo et al. (2025). RL with verifiable rewards for reasoning.' },
        { title: 'DeepSeek-R1 on Hugging Face', summary: 'Official page of the model weights.' },
      ],
    },
    'generative-agents': {
      name: 'Generative Agents',
      overview:
        'LLM agents that keep memories, reflect on them and plan the day. In a simulation, 25 characters interact in a believable way.',
      impact:
        'It showed emergent social behavior from an LLM with memory. It is the basis of long-term agent systems.',
      history: ['Park et al. publish the simulation with 25 generative agents'],
      actors: [{ name: 'Joon Sung Park', role: 'First author', org: 'Stanford' }],
      sources: [{ summary: 'Park et al. (2023). Memory, reflection and planning for LLM agents.' }],
    },
    'recursive-self-improvement': {
      name: 'Recursive Self-Improvement',
      overview:
        'A system that improves its own code and its own learning, and uses that improvement to improve again. A cycle that could lead to an intelligence explosion.',
      impact:
        'It is the central mechanism of the ASI scenarios. Today it is a research area and a concern, with no confirmed example of a closed loop.',
      history: [
        'I. J. Good describes the "ultraintelligent machine" that designs better machines',
        'Bostrom popularizes the intelligence explosion scenario',
      ],
      actors: [
        {
          name: 'I. J. Good',
          role: 'Author of the idea (1965)',
          org: 'Trinity College (Oxford) and Atlas Computer Laboratory',
        },
      ],
      sources: [{ summary: 'Summary of the concept and its origin in I. J. Good (1965).' }],
    },

    // Robotics & Embodiment
    kalman: {
      name: 'Kalman Filter',
      overview:
        'Estimates the state of a system from noisy measurements, combining a prediction model with a correction from the measurements.',
      impact:
        'It is used in GPS, inertial navigation and flight control. It is the basis of state estimation in robotics.',
      history: [
        'Kalman publishes the recursive linear filter for prediction and correction',
        'Kalman and Bucy extend the theory to the continuous-time case',
      ],
      actors: [{ name: 'Rudolf E. Kalman', role: 'Author', org: 'Research Institute for Advanced Study, Baltimore' }],
      equations: [{ label: 'Correction', expression: 'x̂ₖ = x̂ₖ⁻ + Kₖ (zₖ − H x̂ₖ⁻)' }],
      sources: [{ summary: 'Kalman (1960), in the Journal of Basic Engineering.' }],
    },
    'deep-rl': {
      name: 'Deep Reinforcement Learning',
      overview:
        'Deep networks estimate values or action policies. The agent learns by trial and error, using rewards from the environment.',
      impact:
        'It played Atari at human level and paved the way for robot control and complex games such as AlphaGo.',
      history: [
        'Mnih et al. (DeepMind) publish DQN for Atari games from pixels',
        'DQN is published in Nature with results on 49 Atari games',
        'AlphaGo beats Lee Sedol, combining RL and tree search',
      ],
      actors: [{ name: 'Volodymyr Mnih', role: 'First author', org: 'DeepMind' }],
      equations: [{ label: 'Deep Q-learning target', expression: 'y = r + γ · maxₐ′ Q(s′, a′; θ⁻)' }],
      mermaid:
        'flowchart LR\n  S["State s"] --> Q["Network Q(s, a; θ)"]\n  Q --> A["ε-greedy action"]\n  A --> E["Environment"]\n  E --> R["Reward r, next state"]\n  R --> B["Replay buffer"]\n  B --> U["Update θ"]\n  U --> Q',
      sources: [
        { summary: 'Mnih et al. (2013). The first DQN to play Atari from pixels.' },
        { summary: 'Mnih et al. (2015), in Nature. Version with 49 games and a target network.' },
      ],
    },
    sim2real: {
      name: 'Simulation-to-Real Transfer',
      overview:
        'Trains control in simulation with random variations of texture, light and physics, so the model works on the real robot without retraining.',
      impact:
        'It lowers the cost of collecting real-world data, which is slow and expensive. It is one of the techniques that has advanced robot manipulation the most.',
      history: ['Tobin et al. (OpenAI) publish domain randomization for transfer'],
      actors: [{ name: 'Josh Tobin', role: 'First author', org: 'OpenAI' }],
      sources: [{ summary: 'Tobin et al. (2017). Randomization of appearance and physics in simulation.' }],
    },
    rt2: {
      name: 'RT-2 (Vision-Language-Action Model)',
      overview:
        'A VLM trained on the web also outputs robot actions as text tokens. The same model answers questions and controls the arm.',
      impact:
        'It showed that web knowledge transfers to physical action. It is a step toward general-purpose robots.',
      history: ['Brohan et al. (Google DeepMind) publish RT-2'],
      actors: [{ name: 'Anthony Brohan', role: 'First author', org: 'Google DeepMind' }],
      sources: [{ summary: 'Brohan et al. (2023). Robot actions represented as language tokens.' }],
    },
    saycan: {
      name: 'SayCan (Language with Affordances)',
      overview:
        'The LLM proposes steps in natural language, and a value function learned with RL measures whether each step is possible in the robot’s current state.',
      impact:
        'It connected language to what the robot can actually do. It kept the planner from choosing impossible actions.',
      history: ['Ahn et al. (Google) show SayCan on kitchen tasks with a real robot'],
      actors: [
        {
          name: 'Michael Ahn',
          role: 'First author on arXiv (in the CoRL version, Brian Ichter)',
          org: 'Google',
        },
      ],
      sources: [{ summary: 'Ahn et al. (2022). Combines language scoring and feasibility scoring.' }],
    },
    'diffusion-policy': {
      name: 'Diffusion Policy',
      overview:
        'Uses a diffusion model to generate sequences of robot actions. It handles multimodal behavior well, such as two valid ways of grasping an object.',
      impact:
        'It greatly improved imitation of human demonstrations in manipulation. It became a reference for visuomotor policies.',
      history: ['Chi et al. publish the diffusion policy for visuomotor control'],
      actors: [{ name: 'Cheng Chi', role: 'First author', org: 'Columbia University' }],
      sources: [{ summary: 'Chi et al. (2023). Generation of action trajectories by diffusion.' }],
    },
    'palm-e': {
      name: 'PaLM-E (Embodied Model)',
      overview:
        'A language model with continuous sensor inputs, such as images and the robot state, integrated with text. It plans and acts in physical environments.',
      impact:
        'It showed transfer between robotics tasks and general reasoning, a step toward general-purpose embodied agents.',
      history: ['Driess et al. (Google) publish PaLM-E, with 562B parameters'],
      actors: [{ name: 'Danny Driess', role: 'First author', org: 'Robotics at Google and TU Berlin' }],
      sources: [{ summary: 'Driess et al. (2023). Multimodal sensor inputs in an LLM.' }],
    },
    gato: {
      name: 'Gato (Generalist Agent)',
      overview:
        'A single transformer that plays Atari, chats, captions images and controls arms, with the same network and the same weights.',
      impact:
        'It tested the limit of a single agent for many tasks. It influenced the debate on the path to AGI.',
      history: ['Reed et al. (DeepMind) present Gato, a generalist agent'],
      actors: [{ name: 'Scott Reed', role: 'First author', org: 'DeepMind' }],
      sources: [{ summary: 'Reed et al. (2022). One transformer for several tasks and modalities.' }],
    },
    'self-replicating-machines': {
      name: 'Self-Replicating Machines',
      overview:
        'Machines that build copies of themselves from raw materials. Von Neumann showed that self-replication is logically possible.',
      impact:
        'It connects robotics and ASI: a system that replicates in the physical world would grow in capability, limited only by matter and energy.',
      history: ['Von Neumann proposes the universal constructor, published posthumously as a book'],
      actors: [{ name: 'John von Neumann', role: 'Author', org: 'IAS Princeton' }],
      sources: [{ summary: 'Summary of von Neumann\'s self-replication theory and of the book published in 1966.' }],
    },

    // Alignment & Governance
    'turing-test': {
      name: 'Turing Test',
      overview:
        'A criterion of intelligence by imitation: a machine is considered intelligent if an interrogator cannot tell its answers apart from those of a human.',
      impact:
        'It is still the cultural reference for "intelligent machine". It also shows why behavioral evaluations are not enough to measure real capability.',
      history: ['Turing publishes "Computing Machinery and Intelligence" in Mind'],
      actors: [{ name: 'Alan Turing', role: 'Author', org: 'University of Manchester' }],
      sources: [{ summary: 'Turing (1950), in Mind. Proposes the imitation game.' }],
    },
    'specification-gaming': {
      name: 'Specification Gaming (Reward Hacking)',
      overview:
        'The agent maximizes the written reward, not the goal the designer had in mind. It finds shortcuts that count as success without completing the task.',
      impact:
        'It is one of the central alignment problems. It shows that specifying the goal well is as hard as optimizing it.',
      history: ['Amodei et al. list concrete AI safety problems, including wrong rewards'],
      actors: [{ name: 'Dario Amodei', role: 'First author', org: 'Google Brain (in the 2016 paper)' }],
      sources: [{ summary: 'Amodei et al. (2016). Wrong rewards, exploration and robustness.' }],
    },
    'model-cards': {
      name: 'Model Cards',
      overview:
        'Standardized document that describes a model: intended use, training data, metrics by subgroup and known limitations.',
      impact:
        'It became a transparency practice adopted by many labs. It makes it easier to compare models and decide whether one fits the use case.',
      history: ['Mitchell et al. publish the model cards format for reporting models'],
      actors: [{ name: 'Margaret Mitchell', role: 'First author', org: 'Google' }],
      sources: [{ summary: 'Mitchell et al. (2019). Reporting format with disaggregated performance.' }],
    },
    rlhf: {
      name: 'RLHF (Learning from Human Preference)',
      overview:
        'Trains a reward model with human comparisons between responses, and uses that model to adjust the policy with RL, with a penalty for drifting away from the original model.',
      impact:
        'It is the technique that turned LMs from text completers into useful assistants. It is the basis of the alignment of current LLMs.',
      history: [
        'Christiano et al. train RL agents with human preferences',
        'InstructGPT applies RLHF to GPT-3, and its outputs are preferred over plain GPT-3',
      ],
      actors: [
        { name: 'Paul Christiano', role: 'First author', org: 'OpenAI' },
        { name: 'Long Ouyang', role: 'First author of InstructGPT', org: 'OpenAI' },
      ],
      equations: [
        { label: 'Preference model', expression: 'P(i ≻ j) = σ(r(i) − r(j))' },
        { label: 'Objective', expression: 'max E[r(x,y)] − β · KL(π ‖ π_ref)' },
      ],
      sources: [
        { summary: 'Christiano et al. (2017). Reward model learned from human comparisons.' },
        { summary: 'Ouyang et al. (2022). InstructGPT, with RLHF applied to LMs.' },
      ],
    },
    'constitutional-ai': {
      name: 'Constitutional AI',
      overview:
        'The model critiques and rewrites its own responses according to a set of written principles, and AI feedback replaces part of the human labels.',
      impact:
        'It reduces the dependence on human annotation for safety, and makes the rules of alignment explicit and auditable.',
      history: ['Bai et al. (Anthropic) publish constitutional AI with AI feedback'],
      actors: [{ name: 'Yuntao Bai', role: 'First author', org: 'Anthropic' }],
      sources: [{ summary: 'Bai et al. (2022). Critique and revision guided by written principles.' }],
    },
    'ai-debate': {
      name: 'AI Debate',
      overview:
        'Two AIs argue about an answer, and a human judge picks the most convincing argument. The idea is that debate helps a human supervise systems more capable than themselves.',
      impact:
        'It proposes scalable oversight: the human does not need to know the answer, only to judge the arguments.',
      history: ['Irving, Christiano and Amodei propose debate as a safety technique'],
      actors: [{ name: 'Geoffrey Irving', role: 'First author', org: 'OpenAI' }],
      sources: [{ summary: 'Irving et al. (2018). Debate protocol for oversight.' }],
    },
    'weak-to-strong': {
      name: 'Weak-to-Strong Generalization',
      overview:
        'A weak model labels the data, and a stronger model is trained on those labels. It tests whether the capability of the strong model can be extracted without high-quality supervision.',
      impact:
        'It is a laboratory for supervising models that surpass their human supervisor, the problem that will come with AGI.',
      history: ['Burns et al. (OpenAI) show partial recovery of the capability of the strong model'],
      actors: [{ name: 'Collin Burns', role: 'First author', org: 'OpenAI' }],
      sources: [{ summary: 'Burns et al. (2023). Weak supervision to extract strong capability.' }],
    },
    interpretability: {
      name: 'Mechanistic Interpretability',
      overview:
        'Looks for circuits and features that implement behaviors inside the network. A feature is a direction in activation space associated with a concept.',
      impact:
        'It makes it possible to audit what the model actually does inside, instead of relying only on its external behavior.',
      history: [
        'Olah et al. publish "Zoom In", the foundation of circuits in neural networks',
        'Anthropic extracts millions of interpretable features from a Claude 3 Sonnet model',
      ],
      actors: [
        { name: 'Chris Olah', role: 'Author', org: 'OpenAI (in the 2020 Zoom In article)' },
        { name: 'Anthropic Interpretability Team', role: 'Authors of Scaling Monosemanticity', org: 'Anthropic' },
      ],
      sources: [
        { summary: 'Olah et al. (2020), in Distill. Defines features and circuits.' },
        { summary: 'Anthropic (2024). Sparse autoencoders with millions of features in a production model.' },
      ],
    },
    'superintelligence-governance': {
      name: 'Superintelligence Governance',
      overview:
        'How to coordinate, limit and distribute the benefits of a system far more intelligent than humans. It involves access control, international oversight and incentives.',
      impact:
        'It defines the political problem of ASI. Without governance, the technical pace can outrun the capacity for collective decision-making.',
      history: ['Bostrom publishes "Superintelligence: Paths, Dangers, Strategies"'],
      actors: [{ name: 'Nick Bostrom', role: 'Author', org: 'Future of Humanity Institute' }],
      sources: [{ summary: 'Summary of Bostrom’s book (2014), which organizes the risks and strategies of ASI.' }],
    },
    'ai-control': {
      name: 'AI Control',
      overview:
        'Assumes that a model may try to sabotage the oversight. Designs protocols, such as monitoring and review by weaker models, that keep safety even in that case.',
      impact:
        'It treats the adversarial scenario as a design premise, not as an unlikely scenario. It is relevant to ASI and to agentic systems.',
      history: ['Greenblatt et al. publish AI control under intentional subversion'],
      actors: [{ name: 'Ryan Greenblatt', role: 'First author', org: 'Redwood Research' }],
      sources: [{ summary: 'Greenblatt et al. (2023). Safety protocols under intentional sabotage.' }],
    },
  },
}
