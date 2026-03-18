/* =====================================================
   TUTTY SUCOS - Products Database
   Tabela de Preços Atualizada em 08/12/2025
   ===================================================== */

// --- Regras de Volume por Tabela ---
const PRICING_RULES = {
  minOrderValue: 300.00, // Pedido mínimo R$ 300,00
  unitsPerPack: {
    '300ml': 12,
    '900ml': 6,
    '1.5L': 6,
    '2L': 6,
    '3L': 4,
    'Bag 5L': 1,
    'Galão 5L': 1
  },
  // Volume mínimo (fardos ou unidades) para cada tabela
  volumeTiers: {
    '300ml':    { A: 25, B: 20, C: 15, D: 10, E: 5 },
    '900ml':    { A: 25, B: 20, C: 15, D: 10, E: 5 },
    '1.5L':     { A: 23, B: 18, C: 13, D: 8,  E: 3 },
    '2L':       { A: 23, B: 18, C: 13, D: 8,  E: 3 },
    '3L':       { A: 24, B: 18, C: 12, D: 6,  E: 3 },
    'Bag 5L':   { A: 30, B: 24, C: 18, D: 12, E: 6 },
    'Galão 5L': { A: 30, B: 24, C: 18, D: 12, E: 7 }
  },
  tierLabels: {
    A: 'Atacado Premium',
    B: 'Atacado Plus',
    C: 'Atacado',
    D: 'Semi-Atacado',
    E: 'Varejo B2B'
  }
};

// Helper: calcula preço por litro a partir do preço unitário e volume
function calcPricePerLiter(price, volume) {
  const liters = {
    '300ml': 0.3, '900ml': 0.9, '1.5L': 1.5, '2L': 2,
    '3L': 3, 'Bag 5L': 5, 'Galão 5L': 5
  };
  return +(price / (liters[volume] || 1)).toFixed(2);
}

// Helper: determina tabela de preço baseado no volume do pedido
function getPriceTier(volume, qty) {
  const tiers = PRICING_RULES.volumeTiers[volume];
  if (!tiers) return 'E';
  if (qty >= tiers.A) return 'A';
  if (qty >= tiers.B) return 'B';
  if (qty >= tiers.C) return 'C';
  if (qty >= tiers.D) return 'D';
  return 'E';
}

// Helper: calcula economia percentual entre tabela E e A
function calcSavings(tierA, tierE) {
  return Math.round((1 - tierA / tierE) * 100);
}

const PRODUCTS = [
  // ============================================================
  //  SUCOS INTEGRAIS - Suco de Laranja Integral
  // ============================================================
  {
    id: 1,
    name: "Suco de Laranja Integral",
    line: "integral",
    flavor: "laranja",
    volume: "300ml",
    packaging: "fardo",
    unitsPerPack: 12,
    priceTiers: { A: 4.44, B: 4.66, C: 4.90, D: 5.14, E: 5.40 },
    color: "#FF9800",
    gradient: "linear-gradient(135deg, #FF9800, #F57C00)",
    badges: [],
    operations: ["hotel", "selfservice", "escola", "eventos"],
    description: "Suco de laranja 100% integral em embalagem individual de 300ml. Sem adição de açúcar, conservantes ou corantes. Prático para distribuição em escolas e eventos.",
    specs: {
      modo_preparo: "Pronto para consumo. Servir gelado.",
      rendimento: "12 unidades por fardo",
      armazenamento: "Manter refrigerado entre 0°C e 10°C. Após aberto, consumir em até 3 dias.",
      validade: "90 dias a partir da fabricação"
    },
    yield: { cups200ml: 18, cups300ml: 12, prepTime: "Pronto" },
    isNew: false,
    isLowCal: false
  },
  {
    id: 2,
    name: "Suco de Laranja Integral",
    line: "integral",
    flavor: "laranja",
    volume: "900ml",
    packaging: "fardo",
    unitsPerPack: 6,
    priceTiers: { A: 9.76, B: 10.25, C: 10.76, D: 11.30, E: 11.86 },
    color: "#FF9800",
    gradient: "linear-gradient(135deg, #FF9800, #F57C00)",
    badges: ["bestseller"],
    operations: ["hotel", "selfservice", "escola", "eventos"],
    description: "Suco de laranja 100% integral, sem adição de açúcar, conservantes ou corantes. Extraído de laranjas selecionadas, mantendo todo o sabor e nutrientes da fruta.",
    specs: {
      modo_preparo: "Pronto para consumo. Servir gelado.",
      rendimento: "6 unidades por fardo (5,4L total)",
      armazenamento: "Manter refrigerado entre 0°C e 10°C.",
      validade: "90 dias a partir da fabricação"
    },
    yield: { cups200ml: 27, cups300ml: 18, prepTime: "Pronto" },
    isNew: false,
    isLowCal: false
  },
  {
    id: 3,
    name: "Suco de Laranja Integral",
    line: "integral",
    flavor: "laranja",
    volume: "1.5L",
    packaging: "fardo",
    unitsPerPack: 6,
    priceTiers: { A: 15.36, B: 16.12, C: 16.93, D: 17.78, E: 18.67 },
    color: "#FF9800",
    gradient: "linear-gradient(135deg, #FFB74D, #FF9800)",
    badges: [],
    operations: ["hotel", "selfservice", "eventos"],
    description: "Suco de laranja 100% integral em embalagem de 1,5 litro. Ideal para buffets e serviço de mesa em hotéis e restaurantes.",
    specs: {
      modo_preparo: "Pronto para consumo. Servir gelado.",
      rendimento: "6 unidades por fardo (9L total)",
      armazenamento: "Manter refrigerado entre 0°C e 10°C.",
      validade: "90 dias a partir da fabricação"
    },
    yield: { cups200ml: 45, cups300ml: 30, prepTime: "Pronto" },
    isNew: false,
    isLowCal: false
  },
  {
    id: 4,
    name: "Suco de Laranja Integral",
    line: "integral",
    flavor: "laranja",
    volume: "3L",
    packaging: "fardo",
    unitsPerPack: 4,
    priceTiers: { A: 26.57, B: 27.89, C: 29.29, D: 30.75, E: 32.29 },
    color: "#FF9800",
    gradient: "linear-gradient(135deg, #FFB74D, #FF9800)",
    badges: [],
    operations: ["hotel", "selfservice", "industrial"],
    description: "Suco de laranja 100% integral em embalagem de 3 litros. Excelente para operações de médio volume com qualidade integral.",
    specs: {
      modo_preparo: "Pronto para consumo. Ideal para refresqueiras.",
      rendimento: "4 unidades por fardo (12L total)",
      armazenamento: "Manter refrigerado entre 0°C e 10°C.",
      validade: "90 dias a partir da fabricação"
    },
    yield: { cups200ml: 60, cups300ml: 40, prepTime: "Pronto" },
    isNew: false,
    isLowCal: false
  },
  {
    id: 5,
    name: "Suco de Laranja Integral Bag",
    line: "integral",
    flavor: "laranja",
    volume: "Bag 5L",
    packaging: "unitario",
    unitsPerPack: 1,
    priceTiers: { A: 36.72, B: 38.55, C: 40.48, D: 42.50, E: 44.63 },
    color: "#FF9800",
    gradient: "linear-gradient(135deg, #FFB74D, #FF9800)",
    badges: ["economia"],
    operations: ["hotel", "selfservice", "industrial", "eventos"],
    description: "Suco de laranja integral em Bag de 5 litros. Embalagem econômica, ideal para refresqueiras e dispensers em operações de alto volume.",
    specs: {
      modo_preparo: "Pronto para consumo. Ideal para refresqueiras.",
      rendimento: "5 litros por unidade",
      armazenamento: "Manter refrigerado entre 0°C e 10°C.",
      validade: "60 dias a partir da fabricação"
    },
    yield: { cups200ml: 25, cups300ml: 16, prepTime: "Pronto" },
    isNew: false,
    isLowCal: false
  },
  {
    id: 6,
    name: "Suco de Laranja Integral PET",
    line: "integral",
    flavor: "laranja",
    volume: "Galão 5L",
    packaging: "unitario",
    unitsPerPack: 1,
    priceTiers: { A: 41.50, B: 43.57, C: 45.75, D: 48.04, E: 50.44 },
    color: "#FF9800",
    gradient: "linear-gradient(135deg, #FF9800, #E65100)",
    badges: [],
    operations: ["hotel", "selfservice", "industrial", "eventos"],
    description: "Suco de laranja integral em galão PET de 5 litros. Embalagem robusta para transporte e armazenamento.",
    specs: {
      modo_preparo: "Pronto para consumo. Ideal para refresqueiras.",
      rendimento: "5 litros por unidade",
      armazenamento: "Manter refrigerado entre 0°C e 10°C.",
      validade: "60 dias a partir da fabricação"
    },
    yield: { cups200ml: 25, cups300ml: 16, prepTime: "Pronto" },
    isNew: false,
    isLowCal: false
  },

  // ============================================================
  //  LARANJADA DA ROÇA
  // ============================================================
  {
    id: 7,
    name: "Laranjada da Roça",
    line: "laranjada",
    flavor: "laranja",
    volume: "300ml",
    packaging: "fardo",
    unitsPerPack: 12,
    priceTiers: { A: 4.27, B: 4.49, C: 4.71, D: 4.95, E: 5.19 },
    color: "#FF9800",
    gradient: "linear-gradient(135deg, #FFB74D, #F57C00)",
    badges: [],
    operations: ["hotel", "selfservice", "escola"],
    description: "Laranjada da Roça Tutty em embalagem individual de 300ml. Sabor caseiro e refrescante, pronto para consumo.",
    specs: {
      modo_preparo: "Pronto para consumo. Servir gelado.",
      rendimento: "12 unidades por fardo",
      armazenamento: "Manter em local seco e fresco.",
      validade: "180 dias a partir da fabricação"
    },
    yield: { cups200ml: 18, cups300ml: 12, prepTime: "Pronto" },
    isNew: false,
    isLowCal: false
  },
  {
    id: 8,
    name: "Laranjada da Roça",
    line: "laranjada",
    flavor: "laranja",
    volume: "900ml",
    packaging: "fardo",
    unitsPerPack: 6,
    priceTiers: { A: 8.85, B: 9.29, C: 9.76, D: 10.25, E: 10.76 },
    color: "#FF9800",
    gradient: "linear-gradient(135deg, #FFB74D, #F57C00)",
    badges: ["bestseller"],
    operations: ["hotel", "selfservice", "escola"],
    description: "Laranjada da Roça Tutty, bebida de laranja pronta para consumo. Sabor caseiro e refrescante, opção econômica para operações de grande volume.",
    specs: {
      modo_preparo: "Pronto para consumo. Servir gelado.",
      rendimento: "6 unidades por fardo (5,4L total)",
      armazenamento: "Manter em local seco e fresco.",
      validade: "180 dias a partir da fabricação"
    },
    yield: { cups200ml: 27, cups300ml: 18, prepTime: "Pronto" },
    isNew: false,
    isLowCal: false
  },
  {
    id: 9,
    name: "Laranjada da Roça",
    line: "laranjada",
    flavor: "laranja",
    volume: "1.5L",
    packaging: "fardo",
    unitsPerPack: 6,
    priceTiers: { A: 13.02, B: 13.67, C: 14.35, D: 15.07, E: 15.82 },
    color: "#FF9800",
    gradient: "linear-gradient(135deg, #FFB74D, #F57C00)",
    badges: [],
    operations: ["hotel", "selfservice", "eventos"],
    description: "Laranjada da Roça Tutty em embalagem de 1,5 litro. Ideal para buffets e serviço de mesa.",
    specs: {
      modo_preparo: "Pronto para consumo. Servir gelado.",
      rendimento: "6 unidades por fardo (9L total)",
      armazenamento: "Manter em local seco e fresco.",
      validade: "180 dias a partir da fabricação"
    },
    yield: { cups200ml: 45, cups300ml: 30, prepTime: "Pronto" },
    isNew: false,
    isLowCal: false
  },
  {
    id: 10,
    name: "Laranjada da Roça",
    line: "laranjada",
    flavor: "laranja",
    volume: "2L",
    packaging: "fardo",
    unitsPerPack: 6,
    priceTiers: { A: 15.79, B: 16.58, C: 17.41, D: 18.28, E: 19.20 },
    color: "#FF9800",
    gradient: "linear-gradient(135deg, #FFB74D, #F57C00)",
    badges: [],
    operations: ["hotel", "selfservice", "eventos"],
    description: "Laranjada da Roça Tutty em embalagem de 2 litros. Tamanho família, excelente custo-benefício.",
    specs: {
      modo_preparo: "Pronto para consumo. Servir gelado.",
      rendimento: "6 unidades por fardo (12L total)",
      armazenamento: "Manter em local seco e fresco.",
      validade: "180 dias a partir da fabricação"
    },
    yield: { cups200ml: 60, cups300ml: 40, prepTime: "Pronto" },
    isNew: false,
    isLowCal: false
  },
  {
    id: 11,
    name: "Laranjada da Roça 3L",
    line: "laranjada",
    flavor: "laranja",
    volume: "3L",
    packaging: "fardo",
    unitsPerPack: 4,
    priceTiers: { A: 23.44, B: 24.61, C: 25.84, D: 27.13, E: 28.49 },
    color: "#FF9800",
    gradient: "linear-gradient(135deg, #FFB74D, #F57C00)",
    badges: [],
    operations: ["hotel", "selfservice", "industrial"],
    description: "Laranjada da Roça Tutty em embalagem de 3 litros. Para operações de médio a alto volume.",
    specs: {
      modo_preparo: "Pronto para consumo. Ideal para refresqueiras.",
      rendimento: "4 unidades por fardo (12L total)",
      armazenamento: "Manter em local seco e fresco.",
      validade: "180 dias a partir da fabricação"
    },
    yield: { cups200ml: 60, cups300ml: 40, prepTime: "Pronto" },
    isNew: false,
    isLowCal: false
  },
  {
    id: 12,
    name: "Laranjada da Roça Bag",
    line: "laranjada",
    flavor: "laranja",
    volume: "Bag 5L",
    packaging: "unitario",
    unitsPerPack: 1,
    priceTiers: { A: 30.85, B: 32.39, C: 34.01, D: 35.71, E: 37.49 },
    color: "#FF9800",
    gradient: "linear-gradient(135deg, #FFB74D, #F57C00)",
    badges: ["economia"],
    operations: ["hotel", "selfservice", "industrial"],
    description: "Laranjada da Roça Tutty em Bag de 5 litros. Embalagem econômica para alto volume.",
    specs: {
      modo_preparo: "Pronto para consumo. Ideal para refresqueiras.",
      rendimento: "5 litros por unidade",
      armazenamento: "Manter em local seco e fresco.",
      validade: "180 dias a partir da fabricação"
    },
    yield: { cups200ml: 25, cups300ml: 16, prepTime: "Pronto" },
    isNew: false,
    isLowCal: false
  },
  {
    id: 13,
    name: "Laranjada da Roça PET",
    line: "laranjada",
    flavor: "laranja",
    volume: "Galão 5L",
    packaging: "unitario",
    unitsPerPack: 1,
    priceTiers: { A: 36.13, B: 37.93, C: 39.83, D: 41.82, E: 43.91 },
    color: "#FF9800",
    gradient: "linear-gradient(135deg, #FF9800, #E65100)",
    badges: [],
    operations: ["hotel", "selfservice", "industrial", "eventos"],
    description: "Laranjada da Roça Tutty em galão PET de 5 litros. Embalagem robusta para transporte.",
    specs: {
      modo_preparo: "Pronto para consumo. Ideal para refresqueiras.",
      rendimento: "5 litros por unidade",
      armazenamento: "Manter em local seco e fresco.",
      validade: "180 dias a partir da fabricação"
    },
    yield: { cups200ml: 25, cups300ml: 16, prepTime: "Pronto" },
    isNew: false,
    isLowCal: false
  },

  // ============================================================
  //  NÉCTARES E SUCOS 300ml
  // ============================================================
  {
    id: 14,
    name: "Néctar de Abacaxi com Hortelã",
    line: "nectar",
    flavor: "abacaxi-hortela",
    volume: "300ml",
    packaging: "fardo",
    unitsPerPack: 12,
    priceTiers: { A: 5.67, B: 5.95, C: 6.25, D: 6.56, E: 6.89 },
    color: "#CDDC39",
    gradient: "linear-gradient(135deg, #CDDC39, #8BC34A)",
    badges: ["new"],
    operations: ["hotel", "selfservice", "escola", "eventos"],
    description: "Néctar de abacaxi com hortelã em embalagem individual de 300ml. Combinação tropical refrescante, pronto para consumo.",
    specs: {
      modo_preparo: "Pronto para consumo.",
      rendimento: "12 unidades por fardo",
      armazenamento: "Manter em local seco e fresco.",
      validade: "180 dias a partir da fabricação"
    },
    yield: { cups200ml: 18, cups300ml: 12, prepTime: "Pronto" },
    isNew: true,
    isLowCal: false
  },
  {
    id: 15,
    name: "Néctar de Caju",
    line: "nectar",
    flavor: "caju",
    volume: "300ml",
    packaging: "fardo",
    unitsPerPack: 12,
    priceTiers: { A: 4.06, B: 4.26, C: 4.47, D: 4.70, E: 4.93 },
    color: "#FF5722",
    gradient: "linear-gradient(135deg, #FF5722, #E64A19)",
    badges: [],
    operations: ["hotel", "selfservice", "escola"],
    description: "Néctar de caju em embalagem individual de 300ml. Sabor autêntico do caju nordestino.",
    specs: {
      modo_preparo: "Pronto para consumo.",
      rendimento: "12 unidades por fardo",
      armazenamento: "Manter em local seco e fresco.",
      validade: "180 dias a partir da fabricação"
    },
    yield: { cups200ml: 18, cups300ml: 12, prepTime: "Pronto" },
    isNew: false,
    isLowCal: false
  },
  {
    id: 16,
    name: "Néctar de Goiaba",
    line: "nectar",
    flavor: "goiaba",
    volume: "300ml",
    packaging: "fardo",
    unitsPerPack: 12,
    priceTiers: { A: 3.87, B: 4.07, C: 4.27, D: 4.48, E: 4.71 },
    color: "#E91E63",
    gradient: "linear-gradient(135deg, #F06292, #E91E63)",
    badges: ["bestseller"],
    operations: ["hotel", "selfservice", "escola"],
    description: "Néctar de goiaba em embalagem individual de 300ml. Sabor equilibrado, pronto para servir.",
    specs: {
      modo_preparo: "Pronto para consumo.",
      rendimento: "12 unidades por fardo",
      armazenamento: "Manter em local seco e fresco.",
      validade: "180 dias a partir da fabricação"
    },
    yield: { cups200ml: 18, cups300ml: 12, prepTime: "Pronto" },
    isNew: false,
    isLowCal: false
  },
  {
    id: 17,
    name: "Néctar de Laranja com Acerola",
    line: "nectar",
    flavor: "laranja-acerola",
    volume: "300ml",
    packaging: "fardo",
    unitsPerPack: 12,
    priceTiers: { A: 4.57, B: 4.80, C: 5.04, D: 5.29, E: 5.55 },
    color: "#FF9800",
    gradient: "linear-gradient(135deg, #FF9800, #FF5722)",
    badges: [],
    operations: ["hotel", "selfservice", "escola"],
    description: "Néctar de laranja com acerola em embalagem individual de 300ml. Rico em vitamina C.",
    specs: {
      modo_preparo: "Pronto para consumo.",
      rendimento: "12 unidades por fardo",
      armazenamento: "Manter em local seco e fresco.",
      validade: "180 dias a partir da fabricação"
    },
    yield: { cups200ml: 18, cups300ml: 12, prepTime: "Pronto" },
    isNew: false,
    isLowCal: false
  },
  {
    id: 18,
    name: "Néctar de Limão",
    line: "nectar",
    flavor: "limao",
    volume: "300ml",
    packaging: "fardo",
    unitsPerPack: 12,
    priceTiers: { A: 3.95, B: 4.14, C: 4.35, D: 4.57, E: 4.80 },
    color: "#8BC34A",
    gradient: "linear-gradient(135deg, #8BC34A, #689F38)",
    badges: [],
    operations: ["hotel", "selfservice", "eventos"],
    description: "Néctar de limão em embalagem individual de 300ml. Refrescante e com acidez equilibrada.",
    specs: {
      modo_preparo: "Pronto para consumo.",
      rendimento: "12 unidades por fardo",
      armazenamento: "Manter em local seco e fresco.",
      validade: "180 dias a partir da fabricação"
    },
    yield: { cups200ml: 18, cups300ml: 12, prepTime: "Pronto" },
    isNew: false,
    isLowCal: false
  },
  {
    id: 19,
    name: "Néctar de Maracujá",
    line: "nectar",
    flavor: "maracuja",
    volume: "300ml",
    packaging: "fardo",
    unitsPerPack: 12,
    priceTiers: { A: 4.96, B: 5.20, C: 5.46, D: 5.74, E: 6.03 },
    color: "#FFC107",
    gradient: "linear-gradient(135deg, #FFC107, #FF8F00)",
    badges: [],
    operations: ["hotel", "selfservice", "escola", "eventos"],
    description: "Néctar de maracujá em embalagem individual de 300ml. Sabor autêntico e refrescante.",
    specs: {
      modo_preparo: "Pronto para consumo.",
      rendimento: "12 unidades por fardo",
      armazenamento: "Manter em local seco e fresco.",
      validade: "180 dias a partir da fabricação"
    },
    yield: { cups200ml: 18, cups300ml: 12, prepTime: "Pronto" },
    isNew: false,
    isLowCal: false
  },
  {
    id: 20,
    name: "Néctar de Uva",
    line: "nectar",
    flavor: "uva",
    volume: "300ml",
    packaging: "fardo",
    unitsPerPack: 12,
    priceTiers: { A: 5.29, B: 5.56, C: 5.84, D: 6.13, E: 6.44 },
    color: "#673AB7",
    gradient: "linear-gradient(135deg, #673AB7, #512DA8)",
    badges: ["bestseller"],
    operations: ["hotel", "selfservice", "escola"],
    description: "Néctar de uva em embalagem individual de 300ml. Sabor intenso e equilibrado.",
    specs: {
      modo_preparo: "Pronto para consumo.",
      rendimento: "12 unidades por fardo",
      armazenamento: "Manter em local seco e fresco.",
      validade: "180 dias a partir da fabricação"
    },
    yield: { cups200ml: 18, cups300ml: 12, prepTime: "Pronto" },
    isNew: false,
    isLowCal: false
  },

  // ============================================================
  //  NÉCTARES 900ml
  // ============================================================
  {
    id: 21,
    name: "Néctar de Abacaxi com Hortelã",
    line: "nectar",
    flavor: "abacaxi-hortela",
    volume: "900ml",
    packaging: "fardo",
    unitsPerPack: 6,
    priceTiers: { A: 12.52, B: 13.15, C: 13.80, D: 14.49, E: 15.22 },
    color: "#CDDC39",
    gradient: "linear-gradient(135deg, #CDDC39, #8BC34A)",
    badges: ["new"],
    operations: ["hotel", "selfservice", "eventos"],
    description: "Néctar de abacaxi com hortelã em 900ml. Combinação tropical refrescante para buffets e serviço de mesa.",
    specs: {
      modo_preparo: "Pronto para consumo. Servir gelado.",
      rendimento: "6 unidades por fardo (5,4L total)",
      armazenamento: "Manter em local seco e fresco. Após aberto, refrigerar.",
      validade: "180 dias a partir da fabricação"
    },
    yield: { cups200ml: 27, cups300ml: 18, prepTime: "Pronto" },
    isNew: true,
    isLowCal: false
  },
  {
    id: 22,
    name: "Néctar de Caju",
    line: "nectar",
    flavor: "caju",
    volume: "900ml",
    packaging: "fardo",
    unitsPerPack: 6,
    priceTiers: { A: 8.18, B: 8.59, C: 9.02, D: 9.47, E: 9.94 },
    color: "#FF5722",
    gradient: "linear-gradient(135deg, #FF5722, #E64A19)",
    badges: [],
    operations: ["hotel", "selfservice"],
    description: "Néctar de caju 900ml com polpa selecionada. Sabor característico do caju nordestino com praticidade.",
    specs: {
      modo_preparo: "Pronto para consumo. Servir gelado.",
      rendimento: "6 unidades por fardo (5,4L total)",
      armazenamento: "Manter em local seco e fresco. Após aberto, refrigerar.",
      validade: "180 dias a partir da fabricação"
    },
    yield: { cups200ml: 27, cups300ml: 18, prepTime: "Pronto" },
    isNew: false,
    isLowCal: false
  },
  {
    id: 23,
    name: "Néctar de Goiaba",
    line: "nectar",
    flavor: "goiaba",
    volume: "900ml",
    packaging: "fardo",
    unitsPerPack: 6,
    priceTiers: { A: 7.81, B: 8.20, C: 8.61, D: 9.04, E: 9.49 },
    color: "#E91E63",
    gradient: "linear-gradient(135deg, #E91E63, #C2185B)",
    badges: [],
    operations: ["hotel", "selfservice", "escola"],
    description: "Néctar de goiaba 900ml com polpa de fruta selecionada. Sabor equilibrado e pronto para servir.",
    specs: {
      modo_preparo: "Pronto para consumo. Servir gelado.",
      rendimento: "6 unidades por fardo (5,4L total)",
      armazenamento: "Manter em local seco e fresco. Após aberto, refrigerar.",
      validade: "180 dias a partir da fabricação"
    },
    yield: { cups200ml: 27, cups300ml: 18, prepTime: "Pronto" },
    isNew: false,
    isLowCal: false
  },
  {
    id: 24,
    name: "Néctar de Laranja com Acerola",
    line: "nectar",
    flavor: "laranja-acerola",
    volume: "900ml",
    packaging: "fardo",
    unitsPerPack: 6,
    priceTiers: { A: 9.25, B: 9.72, C: 10.20, D: 10.71, E: 11.25 },
    color: "#FF9800",
    gradient: "linear-gradient(135deg, #FF9800, #FF5722)",
    badges: [],
    operations: ["hotel", "selfservice", "escola"],
    description: "Néctar de laranja com acerola 900ml. Rico em vitamina C, ideal para café da manhã em hotéis.",
    specs: {
      modo_preparo: "Pronto para consumo. Servir gelado.",
      rendimento: "6 unidades por fardo (5,4L total)",
      armazenamento: "Manter em local seco e fresco. Após aberto, refrigerar.",
      validade: "180 dias a partir da fabricação"
    },
    yield: { cups200ml: 27, cups300ml: 18, prepTime: "Pronto" },
    isNew: false,
    isLowCal: false
  },
  {
    id: 25,
    name: "Néctar de Limão",
    line: "nectar",
    flavor: "limao",
    volume: "900ml",
    packaging: "fardo",
    unitsPerPack: 6,
    priceTiers: { A: 7.27, B: 7.63, C: 8.01, D: 8.41, E: 8.83 },
    color: "#8BC34A",
    gradient: "linear-gradient(135deg, #8BC34A, #689F38)",
    badges: [],
    operations: ["hotel", "selfservice", "eventos"],
    description: "Néctar de limão 900ml refrescante, com acidez equilibrada. Ideal para acompanhar refeições.",
    specs: {
      modo_preparo: "Pronto para consumo. Servir gelado.",
      rendimento: "6 unidades por fardo (5,4L total)",
      armazenamento: "Manter em local seco e fresco. Após aberto, refrigerar.",
      validade: "180 dias a partir da fabricação"
    },
    yield: { cups200ml: 27, cups300ml: 18, prepTime: "Pronto" },
    isNew: false,
    isLowCal: false
  },
  {
    id: 26,
    name: "Néctar de Maracujá",
    line: "nectar",
    flavor: "maracuja",
    volume: "900ml",
    packaging: "fardo",
    unitsPerPack: 6,
    priceTiers: { A: 10.22, B: 10.73, C: 11.27, D: 11.83, E: 12.42 },
    color: "#FFC107",
    gradient: "linear-gradient(135deg, #FFC107, #FF8F00)",
    badges: [],
    operations: ["hotel", "selfservice", "escola", "eventos"],
    description: "Néctar de maracujá 900ml com polpa natural. Sabor autêntico e refrescante para buffets.",
    specs: {
      modo_preparo: "Pronto para consumo. Servir gelado.",
      rendimento: "6 unidades por fardo (5,4L total)",
      armazenamento: "Manter em local seco e fresco. Após aberto, refrigerar.",
      validade: "180 dias a partir da fabricação"
    },
    yield: { cups200ml: 27, cups300ml: 18, prepTime: "Pronto" },
    isNew: false,
    isLowCal: false
  },
  {
    id: 27,
    name: "Néctar de Uva",
    line: "nectar",
    flavor: "uva",
    volume: "900ml",
    packaging: "fardo",
    unitsPerPack: 6,
    priceTiers: { A: 11.78, B: 12.36, C: 12.98, D: 13.63, E: 14.31 },
    color: "#673AB7",
    gradient: "linear-gradient(135deg, #673AB7, #512DA8)",
    badges: [],
    operations: ["hotel", "selfservice", "escola"],
    description: "Néctar de uva 900ml com sabor intenso e equilibrado. Opção versátil para diversos tipos de operação.",
    specs: {
      modo_preparo: "Pronto para consumo. Servir gelado.",
      rendimento: "6 unidades por fardo (5,4L total)",
      armazenamento: "Manter em local seco e fresco. Após aberto, refrigerar.",
      validade: "180 dias a partir da fabricação"
    },
    yield: { cups200ml: 27, cups300ml: 18, prepTime: "Pronto" },
    isNew: false,
    isLowCal: false
  },

  // ============================================================
  //  NÉCTARES 1,5L
  // ============================================================
  {
    id: 28,
    name: "Néctar de Abacaxi com Hortelã",
    line: "nectar",
    flavor: "abacaxi-hortela",
    volume: "1.5L",
    packaging: "fardo",
    unitsPerPack: 6,
    priceTiers: { A: 18.54, B: 19.46, C: 20.44, D: 21.46, E: 22.53 },
    color: "#CDDC39",
    gradient: "linear-gradient(135deg, #CDDC39, #8BC34A)",
    badges: [],
    operations: ["hotel", "selfservice", "eventos"],
    description: "Néctar de abacaxi com hortelã 1,5L. Embalagem ideal para buffets e serviço de mesa.",
    specs: {
      modo_preparo: "Pronto para consumo. Servir gelado.",
      rendimento: "6 unidades por fardo (9L total)",
      armazenamento: "Manter em local seco e fresco.",
      validade: "180 dias a partir da fabricação"
    },
    yield: { cups200ml: 45, cups300ml: 30, prepTime: "Pronto" },
    isNew: false,
    isLowCal: false
  },
  {
    id: 29,
    name: "Néctar de Caju",
    line: "nectar",
    flavor: "caju",
    volume: "1.5L",
    packaging: "fardo",
    unitsPerPack: 6,
    priceTiers: { A: 12.07, B: 12.68, C: 13.31, D: 13.98, E: 14.68 },
    color: "#FF5722",
    gradient: "linear-gradient(135deg, #FF5722, #E64A19)",
    badges: [],
    operations: ["hotel", "selfservice"],
    description: "Néctar de caju 1,5L. Sabor nordestino autêntico em embalagem para serviço de mesa.",
    specs: {
      modo_preparo: "Pronto para consumo. Servir gelado.",
      rendimento: "6 unidades por fardo (9L total)",
      armazenamento: "Manter em local seco e fresco.",
      validade: "180 dias a partir da fabricação"
    },
    yield: { cups200ml: 45, cups300ml: 30, prepTime: "Pronto" },
    isNew: false,
    isLowCal: false
  },
  {
    id: 30,
    name: "Néctar de Goiaba",
    line: "nectar",
    flavor: "goiaba",
    volume: "1.5L",
    packaging: "fardo",
    unitsPerPack: 6,
    priceTiers: { A: 11.50, B: 12.08, C: 12.68, D: 13.31, E: 13.98 },
    color: "#E91E63",
    gradient: "linear-gradient(135deg, #E91E63, #C2185B)",
    badges: [],
    operations: ["hotel", "selfservice", "escola"],
    description: "Néctar de goiaba 1,5L. Sabor equilibrado para buffets e serviço de mesa.",
    specs: {
      modo_preparo: "Pronto para consumo. Servir gelado.",
      rendimento: "6 unidades por fardo (9L total)",
      armazenamento: "Manter em local seco e fresco.",
      validade: "180 dias a partir da fabricação"
    },
    yield: { cups200ml: 45, cups300ml: 30, prepTime: "Pronto" },
    isNew: false,
    isLowCal: false
  },
  {
    id: 31,
    name: "Néctar de Limão",
    line: "nectar",
    flavor: "limao",
    volume: "1.5L",
    packaging: "fardo",
    unitsPerPack: 6,
    priceTiers: { A: 10.96, B: 11.51, C: 12.08, D: 12.69, E: 13.32 },
    color: "#8BC34A",
    gradient: "linear-gradient(135deg, #8BC34A, #689F38)",
    badges: [],
    operations: ["hotel", "selfservice", "eventos"],
    description: "Néctar de limão 1,5L. Refrescante e com acidez equilibrada.",
    specs: {
      modo_preparo: "Pronto para consumo. Servir gelado.",
      rendimento: "6 unidades por fardo (9L total)",
      armazenamento: "Manter em local seco e fresco.",
      validade: "180 dias a partir da fabricação"
    },
    yield: { cups200ml: 45, cups300ml: 30, prepTime: "Pronto" },
    isNew: false,
    isLowCal: false
  },
  {
    id: 32,
    name: "Néctar de Laranja com Acerola",
    line: "nectar",
    flavor: "laranja-acerola",
    volume: "1.5L",
    packaging: "fardo",
    unitsPerPack: 6,
    priceTiers: { A: 13.59, B: 14.27, C: 14.98, D: 15.73, E: 16.52 },
    color: "#FF9800",
    gradient: "linear-gradient(135deg, #FF9800, #FF5722)",
    badges: [],
    operations: ["hotel", "selfservice", "escola"],
    description: "Néctar de laranja com acerola 1,5L. Rico em vitamina C para café da manhã.",
    specs: {
      modo_preparo: "Pronto para consumo. Servir gelado.",
      rendimento: "6 unidades por fardo (9L total)",
      armazenamento: "Manter em local seco e fresco.",
      validade: "180 dias a partir da fabricação"
    },
    yield: { cups200ml: 45, cups300ml: 30, prepTime: "Pronto" },
    isNew: false,
    isLowCal: false
  },
  {
    id: 33,
    name: "Néctar de Maracujá",
    line: "nectar",
    flavor: "maracuja",
    volume: "1.5L",
    packaging: "fardo",
    unitsPerPack: 6,
    priceTiers: { A: 15.30, B: 16.07, C: 16.87, D: 17.71, E: 18.60 },
    color: "#FFC107",
    gradient: "linear-gradient(135deg, #FFC107, #FF8F00)",
    badges: [],
    operations: ["hotel", "selfservice", "eventos"],
    description: "Néctar de maracujá 1,5L. Sabor marcante para buffets e eventos.",
    specs: {
      modo_preparo: "Pronto para consumo. Servir gelado.",
      rendimento: "6 unidades por fardo (9L total)",
      armazenamento: "Manter em local seco e fresco.",
      validade: "180 dias a partir da fabricação"
    },
    yield: { cups200ml: 45, cups300ml: 30, prepTime: "Pronto" },
    isNew: false,
    isLowCal: false
  },
  {
    id: 34,
    name: "Néctar de Uva",
    line: "nectar",
    flavor: "uva",
    volume: "1.5L",
    packaging: "fardo",
    unitsPerPack: 6,
    priceTiers: { A: 17.74, B: 18.63, C: 19.56, D: 20.54, E: 21.56 },
    color: "#673AB7",
    gradient: "linear-gradient(135deg, #673AB7, #512DA8)",
    badges: [],
    operations: ["hotel", "selfservice", "escola"],
    description: "Néctar de uva 1,5L. Sabor intenso e equilibrado.",
    specs: {
      modo_preparo: "Pronto para consumo. Servir gelado.",
      rendimento: "6 unidades por fardo (9L total)",
      armazenamento: "Manter em local seco e fresco.",
      validade: "180 dias a partir da fabricação"
    },
    yield: { cups200ml: 45, cups300ml: 30, prepTime: "Pronto" },
    isNew: false,
    isLowCal: false
  },

  // ============================================================
  //  NÉCTARES 2L
  // ============================================================
  {
    id: 35,
    name: "Néctar de Abacaxi com Hortelã",
    line: "nectar",
    flavor: "abacaxi-hortela",
    volume: "2L",
    packaging: "fardo",
    unitsPerPack: 6,
    priceTiers: { A: 23.24, B: 24.41, C: 25.63, D: 26.91, E: 28.25 },
    color: "#CDDC39",
    gradient: "linear-gradient(135deg, #CDDC39, #8BC34A)",
    badges: [],
    operations: ["hotel", "selfservice", "eventos"],
    description: "Néctar de abacaxi com hortelã 2L. Tamanho família, excelente custo-benefício.",
    specs: {
      modo_preparo: "Pronto para consumo. Servir gelado.",
      rendimento: "6 unidades por fardo (12L total)",
      armazenamento: "Manter em local seco e fresco.",
      validade: "180 dias a partir da fabricação"
    },
    yield: { cups200ml: 60, cups300ml: 40, prepTime: "Pronto" },
    isNew: false,
    isLowCal: false
  },
  {
    id: 36,
    name: "Néctar de Laranja com Acerola",
    line: "nectar",
    flavor: "laranja-acerola",
    volume: "2L",
    packaging: "fardo",
    unitsPerPack: 6,
    priceTiers: { A: 16.73, B: 17.56, C: 18.44, D: 19.36, E: 20.33 },
    color: "#FF9800",
    gradient: "linear-gradient(135deg, #FF9800, #FF5722)",
    badges: [],
    operations: ["hotel", "selfservice"],
    description: "Néctar de laranja com acerola 2L. Rico em vitamina C, tamanho família.",
    specs: {
      modo_preparo: "Pronto para consumo. Servir gelado.",
      rendimento: "6 unidades por fardo (12L total)",
      armazenamento: "Manter em local seco e fresco.",
      validade: "180 dias a partir da fabricação"
    },
    yield: { cups200ml: 60, cups300ml: 40, prepTime: "Pronto" },
    isNew: false,
    isLowCal: false
  },
  {
    id: 37,
    name: "Néctar de Maracujá",
    line: "nectar",
    flavor: "maracuja",
    volume: "2L",
    packaging: "fardo",
    unitsPerPack: 6,
    priceTiers: { A: 18.98, B: 19.93, C: 20.93, D: 21.98, E: 23.08 },
    color: "#FFC107",
    gradient: "linear-gradient(135deg, #FFC107, #FF8F00)",
    badges: [],
    operations: ["hotel", "selfservice", "eventos"],
    description: "Néctar de maracujá 2L. Sabor marcante, tamanho família.",
    specs: {
      modo_preparo: "Pronto para consumo. Servir gelado.",
      rendimento: "6 unidades por fardo (12L total)",
      armazenamento: "Manter em local seco e fresco.",
      validade: "180 dias a partir da fabricação"
    },
    yield: { cups200ml: 60, cups300ml: 40, prepTime: "Pronto" },
    isNew: false,
    isLowCal: false
  },
  {
    id: 38,
    name: "Néctar de Uva",
    line: "nectar",
    flavor: "uva",
    volume: "2L",
    packaging: "fardo",
    unitsPerPack: 6,
    priceTiers: { A: 22.10, B: 23.20, C: 24.36, D: 25.58, E: 26.86 },
    color: "#673AB7",
    gradient: "linear-gradient(135deg, #673AB7, #512DA8)",
    badges: [],
    operations: ["hotel", "selfservice"],
    description: "Néctar de uva 2L. Sabor intenso, tamanho família.",
    specs: {
      modo_preparo: "Pronto para consumo. Servir gelado.",
      rendimento: "6 unidades por fardo (12L total)",
      armazenamento: "Manter em local seco e fresco.",
      validade: "180 dias a partir da fabricação"
    },
    yield: { cups200ml: 60, cups300ml: 40, prepTime: "Pronto" },
    isNew: false,
    isLowCal: false
  },

  // ============================================================
  //  NÉCTARES 5L BAG
  // ============================================================
  {
    id: 39,
    name: "Néctar de Abacaxi Bag",
    line: "nectar",
    flavor: "abacaxi",
    volume: "Bag 5L",
    packaging: "unitario",
    unitsPerPack: 1,
    priceTiers: { A: 48.01, B: 50.41, C: 52.93, D: 55.57, E: 58.35 },
    color: "#CDDC39",
    gradient: "linear-gradient(135deg, #CDDC39, #AFB42B)",
    badges: ["economia"],
    operations: ["hotel", "selfservice", "industrial"],
    description: "Néctar de abacaxi em Bag de 5L. Embalagem econômica para refresqueiras e dispensers.",
    specs: {
      modo_preparo: "Pronto para consumo. Ideal para refresqueiras.",
      rendimento: "5 litros por unidade",
      armazenamento: "Manter refrigerado. Após aberto, consumir em até 5 dias.",
      validade: "180 dias a partir da fabricação"
    },
    yield: { cups200ml: 25, cups300ml: 16, prepTime: "Pronto" },
    isNew: false,
    isLowCal: false
  },
  {
    id: 40,
    name: "Néctar de Caju Bag",
    line: "nectar",
    flavor: "caju",
    volume: "Bag 5L",
    packaging: "unitario",
    unitsPerPack: 1,
    priceTiers: { A: 28.39, B: 29.81, C: 31.30, D: 32.86, E: 34.51 },
    color: "#FF5722",
    gradient: "linear-gradient(135deg, #FF5722, #E64A19)",
    badges: ["economia"],
    operations: ["hotel", "selfservice", "industrial"],
    description: "Néctar de caju em Bag de 5L. Economia e praticidade para alto volume.",
    specs: {
      modo_preparo: "Pronto para consumo. Ideal para refresqueiras.",
      rendimento: "5 litros por unidade",
      armazenamento: "Manter refrigerado. Após aberto, consumir em até 5 dias.",
      validade: "180 dias a partir da fabricação"
    },
    yield: { cups200ml: 25, cups300ml: 16, prepTime: "Pronto" },
    isNew: false,
    isLowCal: false
  },
  {
    id: 41,
    name: "Néctar de Goiaba Bag",
    line: "nectar",
    flavor: "goiaba",
    volume: "Bag 5L",
    packaging: "unitario",
    unitsPerPack: 1,
    priceTiers: { A: 26.44, B: 27.77, C: 29.16, D: 30.61, E: 32.14 },
    color: "#E91E63",
    gradient: "linear-gradient(135deg, #E91E63, #C2185B)",
    badges: ["economia"],
    operations: ["hotel", "selfservice", "industrial"],
    description: "Néctar de goiaba em Bag de 5L. Economia e praticidade para alto volume.",
    specs: {
      modo_preparo: "Pronto para consumo. Ideal para refresqueiras.",
      rendimento: "5 litros por unidade",
      armazenamento: "Manter refrigerado. Após aberto, consumir em até 5 dias.",
      validade: "180 dias a partir da fabricação"
    },
    yield: { cups200ml: 25, cups300ml: 16, prepTime: "Pronto" },
    isNew: false,
    isLowCal: false
  },
  {
    id: 42,
    name: "Néctar de Limão Bag",
    line: "nectar",
    flavor: "limao",
    volume: "Bag 5L",
    packaging: "unitario",
    unitsPerPack: 1,
    priceTiers: { A: 25.88, B: 27.18, C: 28.54, D: 29.96, E: 31.46 },
    color: "#8BC34A",
    gradient: "linear-gradient(135deg, #8BC34A, #689F38)",
    badges: ["economia"],
    operations: ["hotel", "selfservice", "industrial"],
    description: "Néctar de limão em Bag de 5L. Refrescante, economia para alto volume.",
    specs: {
      modo_preparo: "Pronto para consumo. Ideal para refresqueiras.",
      rendimento: "5 litros por unidade",
      armazenamento: "Manter refrigerado. Após aberto, consumir em até 5 dias.",
      validade: "180 dias a partir da fabricação"
    },
    yield: { cups200ml: 25, cups300ml: 16, prepTime: "Pronto" },
    isNew: false,
    isLowCal: false
  },
  {
    id: 43,
    name: "Néctar de Manga Bag",
    line: "nectar",
    flavor: "manga",
    volume: "Bag 5L",
    packaging: "unitario",
    unitsPerPack: 1,
    priceTiers: { A: 26.80, B: 28.14, C: 29.55, D: 31.02, E: 32.58 },
    color: "#FF6F00",
    gradient: "linear-gradient(135deg, #FFB300, #FF6F00)",
    badges: ["new", "economia"],
    operations: ["hotel", "selfservice", "industrial"],
    description: "Néctar de manga em Bag de 5L. Sabor tropical exótico com economia.",
    specs: {
      modo_preparo: "Pronto para consumo. Ideal para refresqueiras.",
      rendimento: "5 litros por unidade",
      armazenamento: "Manter refrigerado. Após aberto, consumir em até 5 dias.",
      validade: "180 dias a partir da fabricação"
    },
    yield: { cups200ml: 25, cups300ml: 16, prepTime: "Pronto" },
    isNew: true,
    isLowCal: false
  },
  {
    id: 44,
    name: "Néctar de Maracujá Bag",
    line: "nectar",
    flavor: "maracuja",
    volume: "Bag 5L",
    packaging: "unitario",
    unitsPerPack: 1,
    priceTiers: { A: 35.24, B: 37.01, C: 38.86, D: 40.80, E: 42.84 },
    color: "#FFC107",
    gradient: "linear-gradient(135deg, #FFC107, #FF8F00)",
    badges: ["economia"],
    operations: ["hotel", "selfservice", "industrial", "eventos"],
    description: "Néctar de maracujá em Bag de 5L. Sabor marcante para refresqueiras.",
    specs: {
      modo_preparo: "Pronto para consumo. Ideal para refresqueiras.",
      rendimento: "5 litros por unidade",
      armazenamento: "Manter refrigerado. Após aberto, consumir em até 5 dias.",
      validade: "180 dias a partir da fabricação"
    },
    yield: { cups200ml: 25, cups300ml: 16, prepTime: "Pronto" },
    isNew: false,
    isLowCal: false
  },
  {
    id: 45,
    name: "Néctar de Uva Bag",
    line: "nectar",
    flavor: "uva",
    volume: "Bag 5L",
    packaging: "unitario",
    unitsPerPack: 1,
    priceTiers: { A: 42.63, B: 44.76, C: 47.00, D: 49.35, E: 51.81 },
    color: "#673AB7",
    gradient: "linear-gradient(135deg, #673AB7, #512DA8)",
    badges: ["economia"],
    operations: ["hotel", "selfservice", "industrial"],
    description: "Néctar de uva em Bag de 5L. Sabor intenso para refresqueiras e dispensers.",
    specs: {
      modo_preparo: "Pronto para consumo. Ideal para refresqueiras.",
      rendimento: "5 litros por unidade",
      armazenamento: "Manter refrigerado. Após aberto, consumir em até 5 dias.",
      validade: "180 dias a partir da fabricação"
    },
    yield: { cups200ml: 25, cups300ml: 16, prepTime: "Pronto" },
    isNew: false,
    isLowCal: false
  },

  // ============================================================
  //  NÉCTARES 5L PET (Galão)
  // ============================================================
  {
    id: 46,
    name: "Néctar de Abacaxi PET",
    line: "nectar",
    flavor: "abacaxi",
    volume: "Galão 5L",
    packaging: "unitario",
    unitsPerPack: 1,
    priceTiers: { A: 50.58, B: 53.11, C: 55.77, D: 58.55, E: 61.48 },
    color: "#CDDC39",
    gradient: "linear-gradient(135deg, #CDDC39, #AFB42B)",
    badges: [],
    operations: ["hotel", "selfservice", "industrial"],
    description: "Néctar de abacaxi em galão PET de 5L. Embalagem robusta para transporte.",
    specs: {
      modo_preparo: "Pronto para consumo. Ideal para refresqueiras.",
      rendimento: "5 litros por unidade",
      armazenamento: "Manter refrigerado.",
      validade: "180 dias a partir da fabricação"
    },
    yield: { cups200ml: 25, cups300ml: 16, prepTime: "Pronto" },
    isNew: false,
    isLowCal: false
  },
  {
    id: 47,
    name: "Néctar de Abacaxi com Hortelã PET",
    line: "nectar",
    flavor: "abacaxi-hortela",
    volume: "Galão 5L",
    packaging: "unitario",
    unitsPerPack: 1,
    priceTiers: { A: 49.05, B: 51.50, C: 54.07, D: 56.78, E: 59.62 },
    color: "#CDDC39",
    gradient: "linear-gradient(135deg, #CDDC39, #8BC34A)",
    badges: ["new"],
    operations: ["hotel", "selfservice", "industrial"],
    description: "Néctar de abacaxi com hortelã em galão PET de 5L. Combinação tropical refrescante.",
    specs: {
      modo_preparo: "Pronto para consumo. Ideal para refresqueiras.",
      rendimento: "5 litros por unidade",
      armazenamento: "Manter refrigerado.",
      validade: "180 dias a partir da fabricação"
    },
    yield: { cups200ml: 25, cups300ml: 16, prepTime: "Pronto" },
    isNew: true,
    isLowCal: false
  },
  {
    id: 48,
    name: "Néctar de Caju PET",
    line: "nectar",
    flavor: "caju",
    volume: "Galão 5L",
    packaging: "unitario",
    unitsPerPack: 1,
    priceTiers: { A: 32.97, B: 34.62, C: 36.35, D: 38.17, E: 40.08 },
    color: "#FF5722",
    gradient: "linear-gradient(135deg, #FF5722, #E64A19)",
    badges: [],
    operations: ["hotel", "selfservice", "industrial"],
    description: "Néctar de caju em galão PET de 5L. Sabor nordestino autêntico.",
    specs: {
      modo_preparo: "Pronto para consumo. Ideal para refresqueiras.",
      rendimento: "5 litros por unidade",
      armazenamento: "Manter refrigerado.",
      validade: "180 dias a partir da fabricação"
    },
    yield: { cups200ml: 25, cups300ml: 16, prepTime: "Pronto" },
    isNew: false,
    isLowCal: false
  },
  {
    id: 49,
    name: "Néctar de Goiaba PET",
    line: "nectar",
    flavor: "goiaba",
    volume: "Galão 5L",
    packaging: "unitario",
    unitsPerPack: 1,
    priceTiers: { A: 31.10, B: 32.65, C: 34.29, D: 36.00, E: 37.80 },
    color: "#E91E63",
    gradient: "linear-gradient(135deg, #E91E63, #C2185B)",
    badges: [],
    operations: ["hotel", "selfservice", "industrial"],
    description: "Néctar de goiaba em galão PET de 5L. Para operações de alto volume.",
    specs: {
      modo_preparo: "Pronto para consumo. Ideal para refresqueiras.",
      rendimento: "5 litros por unidade",
      armazenamento: "Manter refrigerado.",
      validade: "180 dias a partir da fabricação"
    },
    yield: { cups200ml: 25, cups300ml: 16, prepTime: "Pronto" },
    isNew: false,
    isLowCal: false
  },
  {
    id: 50,
    name: "Néctar de Laranja com Acerola PET",
    line: "nectar",
    flavor: "laranja-acerola",
    volume: "Galão 5L",
    packaging: "unitario",
    unitsPerPack: 1,
    priceTiers: { A: 36.81, B: 38.65, C: 40.58, D: 42.61, E: 44.74 },
    color: "#FF9800",
    gradient: "linear-gradient(135deg, #FF9800, #FF5722)",
    badges: [],
    operations: ["hotel", "selfservice", "industrial"],
    description: "Néctar de laranja com acerola em galão PET de 5L. Rico em vitamina C.",
    specs: {
      modo_preparo: "Pronto para consumo. Ideal para refresqueiras.",
      rendimento: "5 litros por unidade",
      armazenamento: "Manter refrigerado.",
      validade: "180 dias a partir da fabricação"
    },
    yield: { cups200ml: 25, cups300ml: 16, prepTime: "Pronto" },
    isNew: false,
    isLowCal: false
  },
  {
    id: 51,
    name: "Néctar de Limão PET",
    line: "nectar",
    flavor: "limao",
    volume: "Galão 5L",
    packaging: "unitario",
    unitsPerPack: 1,
    priceTiers: { A: 35.78, B: 37.57, C: 39.45, D: 41.42, E: 43.49 },
    color: "#8BC34A",
    gradient: "linear-gradient(135deg, #8BC34A, #689F38)",
    badges: [],
    operations: ["hotel", "selfservice", "industrial"],
    description: "Néctar de limão em galão PET de 5L. Refrescante para refresqueiras.",
    specs: {
      modo_preparo: "Pronto para consumo. Ideal para refresqueiras.",
      rendimento: "5 litros por unidade",
      armazenamento: "Manter refrigerado.",
      validade: "180 dias a partir da fabricação"
    },
    yield: { cups200ml: 25, cups300ml: 16, prepTime: "Pronto" },
    isNew: false,
    isLowCal: false
  },
  {
    id: 52,
    name: "Néctar de Manga PET",
    line: "nectar",
    flavor: "manga",
    volume: "Galão 5L",
    packaging: "unitario",
    unitsPerPack: 1,
    priceTiers: { A: 31.22, B: 32.79, C: 34.42, D: 36.15, E: 37.95 },
    color: "#FF6F00",
    gradient: "linear-gradient(135deg, #FFB300, #FF6F00)",
    badges: ["new"],
    operations: ["hotel", "selfservice", "industrial"],
    description: "Néctar de manga em galão PET de 5L. Sabor tropical exótico.",
    specs: {
      modo_preparo: "Pronto para consumo. Ideal para refresqueiras.",
      rendimento: "5 litros por unidade",
      armazenamento: "Manter refrigerado.",
      validade: "180 dias a partir da fabricação"
    },
    yield: { cups200ml: 25, cups300ml: 16, prepTime: "Pronto" },
    isNew: true,
    isLowCal: false
  },
  {
    id: 53,
    name: "Néctar de Maracujá PET",
    line: "nectar",
    flavor: "maracuja",
    volume: "Galão 5L",
    packaging: "unitario",
    unitsPerPack: 1,
    priceTiers: { A: 39.79, B: 41.78, C: 43.87, D: 46.06, E: 48.36 },
    color: "#FFC107",
    gradient: "linear-gradient(135deg, #FFC107, #FF8F00)",
    badges: [],
    operations: ["hotel", "selfservice", "industrial", "eventos"],
    description: "Néctar de maracujá em galão PET de 5L. Sabor marcante para operações profissionais.",
    specs: {
      modo_preparo: "Pronto para consumo. Ideal para refresqueiras.",
      rendimento: "5 litros por unidade",
      armazenamento: "Manter refrigerado.",
      validade: "180 dias a partir da fabricação"
    },
    yield: { cups200ml: 25, cups300ml: 16, prepTime: "Pronto" },
    isNew: false,
    isLowCal: false
  },
  {
    id: 54,
    name: "Néctar de Uva PET",
    line: "nectar",
    flavor: "uva",
    volume: "Galão 5L",
    packaging: "unitario",
    unitsPerPack: 1,
    priceTiers: { A: 45.54, B: 47.82, C: 50.21, D: 52.72, E: 55.36 },
    color: "#673AB7",
    gradient: "linear-gradient(135deg, #673AB7, #512DA8)",
    badges: [],
    operations: ["hotel", "selfservice", "industrial"],
    description: "Néctar de uva em galão PET de 5L. Sabor intenso para refresqueiras.",
    specs: {
      modo_preparo: "Pronto para consumo. Ideal para refresqueiras.",
      rendimento: "5 litros por unidade",
      armazenamento: "Manter refrigerado.",
      validade: "180 dias a partir da fabricação"
    },
    yield: { cups200ml: 25, cups300ml: 16, prepTime: "Pronto" },
    isNew: false,
    isLowCal: false
  }
];

// Adiciona campos calculados a cada produto
PRODUCTS.forEach(p => {
  // Preço unitário padrão (Tabela E - menor volume)
  p.price = p.priceTiers.E;
  // Preço por fardo/caixa (Tabela E)
  p.pricePerBox = +(p.priceTiers.E * p.unitsPerPack).toFixed(2);
  // Preço por litro (Tabela E)
  const liters = { '300ml': 0.3, '900ml': 0.9, '1.5L': 1.5, '2L': 2, '3L': 3, 'Bag 5L': 5, 'Galão 5L': 5 };
  p.pricePerLiter = +(p.priceTiers.E / (liters[p.volume] || 1)).toFixed(2);
  // Economia máxima (Tabela A vs E)
  p.maxSavings = Math.round((1 - p.priceTiers.A / p.priceTiers.E) * 100);
  // Preço mínimo (Tabela A)
  p.bestPrice = p.priceTiers.A;
});

// Fruit images by flavor - realistic high-quality photos
const FRUIT_IMAGES = {
  'laranja':         'images/fruits/laranja.png',
  'uva':             'images/fruits/uva.png',
  'goiaba':          'images/fruits/goiaba.png',
  'maracuja':        'images/fruits/maracuja.jpg',
  'abacaxi':         'images/fruits/abacaxi.png',
  'abacaxi-hortela': 'images/fruits/hortela.png',
  'caju':            'images/fruits/caju.jpg',
  'limao':           'images/fruits/limao.png',
  'manga':           'images/fruits/manga.jpg',
  'laranja-acerola': 'images/fruits/acerola.jpg',
  'pessego':         'images/fruits/pessego.jpg'
};

// Legacy product images (bottles) for reference
const PRODUCT_IMAGES = {
  'integral-laranja': 'images/products/suco-integral-laranja.jpg',
  'laranjada-laranja': 'images/products/laranjada-da-roca.jpg',
  'nectar-default': 'images/products/nectar-frutas.jpg',
  'nectar-abacaxi-hortela': 'images/products/nectar-abacaxi-hortela.jpg',
  'nectar-abacaxi': 'images/products/nectar-abacaxi-hortela.jpg',
  'hero-banner-1': 'images/hero/banner1.jpg',
  'hero-banner-2': 'images/hero/banner2.jpg',
  'hero-banner-3': 'images/hero/banner3.webp',
  'bg-integral': 'images/bg/banner-integral.jpg',
  'bg-nectar': 'images/bg/banner-nectar.jpg',
  'logo': 'images/brands/logo.png',
  'logo-footer': 'images/brands/logo-footer.png',
  'company': 'images/brands/company.webp'
};

// Get fruit image by flavor
function getProductImage(product) {
  if (FRUIT_IMAGES[product.flavor]) return FRUIT_IMAGES[product.flavor];
  // Fallback to laranja for integral/laranjada lines
  if (product.line === 'integral' || product.line === 'laranjada') return FRUIT_IMAGES['laranja'];
  return FRUIT_IMAGES['laranja'];
}

// Assign fruit images to all products
PRODUCTS.forEach(p => {
  p.image = getProductImage(p);
});

// Flavor color map for gradient backgrounds
const FLAVOR_COLORS = {
  'laranja':         { primary: '#FF8C00', secondary: '#FF6B00', accent: '#FFA726' },
  'uva':             { primary: '#7B1FA2', secondary: '#4A148C', accent: '#CE93D8' },
  'goiaba':          { primary: '#E91E63', secondary: '#C2185B', accent: '#F48FB1' },
  'maracuja':        { primary: '#FDD835', secondary: '#F9A825', accent: '#FFF176' },
  'abacaxi':         { primary: '#FFB300', secondary: '#FF8F00', accent: '#FFD54F' },
  'abacaxi-hortela': { primary: '#66BB6A', secondary: '#388E3C', accent: '#A5D6A7' },
  'caju':            { primary: '#FF7043', secondary: '#E64A19', accent: '#FFAB91' },
  'limao':           { primary: '#7CB342', secondary: '#558B2F', accent: '#AED581' },
  'manga':           { primary: '#FFB300', secondary: '#FF6F00', accent: '#FFE082' },
  'laranja-acerola': { primary: '#FF5722', secondary: '#D84315', accent: '#FF8A65' }
};

// Line display names
const LINE_NAMES = {
  'integral': 'Suco Integral',
  'laranjada': 'Laranjada da Roça',
  'nectar': 'Néctar'
};

// Flavor display names
const FLAVOR_NAMES = {
  'laranja': 'Laranja',
  'uva': 'Uva',
  'goiaba': 'Goiaba',
  'maracuja': 'Maracujá',
  'abacaxi': 'Abacaxi',
  'abacaxi-hortela': 'Abacaxi c/ Hortelã',
  'caju': 'Caju',
  'limao': 'Limão',
  'manga': 'Manga',
  'laranja-acerola': 'Laranja c/ Acerola'
};

// Volume display names
const VOLUME_NAMES = {
  '300ml': '300ml',
  '900ml': '900ml',
  '1.5L': '1,5L',
  '2L': '2L',
  '3L': '3L',
  'Bag 5L': 'Bag 5L',
  'Galão 5L': 'Galão 5L'
};
