export const partners = {
  condeca: {
    label: 'CONDECA',
    description: 'Parceria com a Secretaria de Desenvolvimento Social do Estado de São Paulo, com recursos do Fundo Estadual dos Direitos da Criança e do Adolescente (CONDECA).',
    audience: 'Crianças e adolescentes em situação de vulnerabilidade social ou não, na modalidade futebol de campo.'
  },
  prefeitura: {
    label: 'Prefeitura',
    description: 'Parceria por chamamento público com a Prefeitura Municipal da Estância Turística de Brotas, por intermédio da Secretaria Municipal de Esportes.',
    audience: 'Crianças e adolescentes, com treinos na modalidade futebol de campo.'
  },
  emendas: {
    label: 'Emendas municipais',
    description: 'Projeto realizado pelo Clube Atlético Brotense com repasses de recursos de emendas impositivas municipais.',
    audience: 'Crianças e adolescentes, para a prática da modalidade futebol de campo.'
  }
};

// Informações fornecidas pelo CAB em 22/10/2026. Datas inclusivas.
export const projects = [
  { id: 'espaco-aberto', title: 'Espaço Aberto', partner: 'emendas', agreement: 'Termo de Colaboração nº 010/2026', start: '2026-06-22', end: '2026-12-31' },
  { id: 'virando-o-jogo', title: 'Virando o Jogo', partner: 'condeca', start: '2024-12-06', end: '2025-12-13' },
  { id: 'bola-no-pe', title: 'Bola no Pé', partner: 'emendas', agreement: 'Termo de Colaboração nº 007/2024', start: '2024-06-25', end: '2025-06-25' },
  { id: 'futebol-legal-e-macale', title: 'Futebol Legal é Macale', partner: 'condeca', start: '2023-07-05', end: '2024-05-05' },
  { id: 'macale-girando-a-bola', title: 'Macale Girando a Bola', partner: 'prefeitura', start: '2023-05-19', end: '2024-05-19' },
  { id: 'bola-no-pe-macale', title: 'Bola no Pé Macale', partner: 'condeca', start: '2022-04-29', end: '2023-04-28' },
  { id: 'escola-de-futebol-de-campo-macale', title: 'Escola de Futebol de Campo Macale', partner: 'condeca', start: '2021-03-24', end: '2022-03-23' }
];

export const photos = [
  { id: 'cab-02', title: 'Equipe em campo', category: 'Equipes', alt: 'Equipe do CAB reunida no gramado, com uniformes vermelhos e pretos.', width: 1040, height: 780 },
  { id: 'cab-08', title: 'Conversa no gramado', category: 'Treinos', alt: 'Grupo sentado no gramado durante uma conversa com o treinador.', width: 1280, height: 960 },
  { id: 'cab-11', title: 'Um registro em equipe', category: 'Equipes', alt: 'Equipe de futebol reunida para uma fotografia no campo do clube.', width: 1280, height: 960 },
  { id: 'cab-06', title: 'Juntos pelo futebol', category: 'Equipes', alt: 'Atletas e equipe técnica reunidos lado a lado no gramado.', width: 1080, height: 810 },
  { id: 'cab-04', title: 'Momento de orientação', category: 'Treinos', alt: 'Treinador orientando um grupo de atletas sentado no campo.', width: 1080, height: 1440 },
  { id: 'cab-09', title: 'À beira do campo', category: 'Em campo', alt: 'Atletas uniformizados sentados no banco à beira do campo.', width: 1280, height: 960 },
  { id: 'cab-10', title: 'A bola em jogo', category: 'Em campo', alt: 'Registro de uma jogada de futebol no gramado.', width: 1280, height: 960 },
  { id: 'cab-01', title: 'Encontro no clube', category: 'Equipes', alt: 'Grupo de atletas e adultos reunidos em uma área coberta do clube.', width: 1080, height: 1440 },
  { id: 'cab-07', title: 'Memória das equipes', category: 'Equipes', alt: 'Fotografia do acervo com equipes de futebol reunidas no campo.', width: 1600, height: 1163 },
  { id: 'cab-05', title: 'Um registro do acervo', category: 'Equipes', alt: 'Fotografia do acervo com uma equipe uniformizada no gramado.', width: 1163, height: 1600 },
  { id: 'cab-03', title: 'O campo ao anoitecer', category: 'Estrutura', alt: 'Campo de futebol iluminado por refletores ao anoitecer.', width: 960, height: 1280 }
];

export function normalizeSearch(value) {
  return String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

export function todayISO(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}

export function projectStatus(project, today = todayISO()) {
  if (today < project.start) return 'Previsto';
  return today > project.end ? 'Concluído' : 'Em andamento';
}

export function formatDate(value, long = false) {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'UTC', day: '2-digit', month: long ? 'long' : '2-digit', year: 'numeric'
  }).format(new Date(`${value}T12:00:00Z`));
}

export function filterProjects({ partner = 'todos', status = 'todos', query = '', today = todayISO() } = {}) {
  const term = normalizeSearch(query);
  return projects.filter(project => (partner === 'todos' || project.partner === partner)
    && (status === 'todos' || projectStatus(project, today) === status)
    && normalizeSearch([project.title, project.agreement, partners[project.partner].label, partners[project.partner].description, project.start, project.end].join(' ')).includes(term));
}

export function filterPhotos(category = 'Todas') {
  return photos.filter(photo => category === 'Todas' || photo.category === category);
}
