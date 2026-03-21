// Logos em public/ — logoClass: 'large' (maior) | 'rotate' (FGV 180°)
export const TEAMS = {
  Insper: { id: 'insper', name: 'Insper', logo: '/insperlogo.jpg' },
  Mackenzie: { id: 'mackenzie', name: 'Mackenzie', logo: '/economack.jpg' },
  USP: { id: 'usp', name: 'USP', logo: '/usp.jpg' },
  FECAP: { id: 'fecap', name: 'FECAP', logo: '/fecap.jpg', logoClass: 'large' },
  FGV: { id: 'fgv', name: 'FGV', logo: '/fgv.jpg', logoClass: 'rotate' },
  IBMEC: { id: 'ibmec', name: 'IBMEC', logo: '/ibmec.jpg' },
  PUC: { id: 'puc', name: 'PUC', logo: '/puc.png', logoClass: 'large' },
  ESPM: { id: 'espm', name: 'ESPM', logo: '/espm.jpg', logoClass: 'large' },
}

export const POINTS_BY_PLACE = {
  1: 13, 2: 10, 3: 8, 4: 6, 5: 4, 6: 3, 7: 2, 8: 1,
}

export const MODALITIES = [
  { id: 'ff', name: 'FF', fullName: 'Futsal Feminino', left: [['FGV', 'Insper'], ['FECAP', 'Mackenzie']], right: [['PUC', 'USP'], ['ESPM', 'IBMEC']] },
  { id: 'fm', name: 'FM', fullName: 'Futsal Masculino', left: [['Insper', 'USP'], ['ESPM', 'PUC']], right: [['FECAP', 'FGV'], ['Mackenzie', 'IBMEC']] },
  { id: 'fc', name: 'FC', fullName: 'Futebol de Campo', left: [['Insper', 'IBMEC'], ['FECAP', 'ESPM']], right: [['Mackenzie', 'PUC'], ['FGV', 'USP']] },
  { id: 'vf', name: 'VF', fullName: 'Vôlei Feminino', left: [['Insper', 'USP'], ['FGV', 'ESPM']], right: [['Mackenzie', 'FECAP'], ['IBMEC', 'PUC']] },
  { id: 'vm', name: 'VM', fullName: 'Vôlei Masculino', left: [['Insper', 'IBMEC'], ['FECAP', 'FGV']], right: [['Mackenzie', 'USP'], ['ESPM', 'PUC']] },
  { id: 'hf', name: 'HF', fullName: 'Handebol Feminino', left: [['Insper', 'PUC'], ['FECAP', 'IBMEC']], right: [['Mackenzie', 'FGV'], ['USP', 'ESPM']] },
  { id: 'hm', name: 'HM', fullName: 'Handebol Masculino', left: [['FGV', 'Insper'], ['USP', 'ESPM']], right: [['Mackenzie', 'FECAP'], ['PUC', 'IBMEC']] },
  { id: 'bf', name: 'BF', fullName: 'Basquete Feminino', left: [['USP', 'Insper'], ['PUC', 'Mackenzie']], right: [['FECAP', 'ESPM'], ['FGV', 'IBMEC']] },
  { id: 'bm', name: 'BM', fullName: 'Basquete Masculino', left: [['Insper', 'FGV'], ['PUC', 'IBMEC']], right: [['ESPM', 'FECAP'], ['Mackenzie', 'USP']] },
  { id: 'tcf', name: 'TCF', fullName: 'Tênis de Campo Feminino', left: [['Insper', 'USP'], ['Mackenzie', 'ESPM']], right: [['PUC', 'FECAP'], ['FGV', 'IBMEC']] },
  { id: 'tcm', name: 'TCM', fullName: 'Tênis de Campo Masculino', left: [['Insper', 'Mackenzie'], ['PUC', 'IBMEC']], right: [['FGV', 'FECAP'], ['ESPM', 'USP']] },
  { id: 'tmf', name: 'TMF', fullName: 'Tênis de Mesa Feminino', left: [['USP', 'Insper'], ['PUC', 'FGV']], right: [['ESPM', 'IBMEC'], ['Mackenzie', 'FECAP']] },
  { id: 'tmm', name: 'TMM', fullName: 'Tênis de Mesa Masculino', left: [['Insper', 'PUC'], ['USP', 'IBMEC']], right: [['Mackenzie', 'FECAP'], ['ESPM', 'FGV']] },
  { id: 'judo', name: 'JUDO', fullName: 'Judô', left: [['Insper', 'ESPM'], ['FGV', 'FECAP']], right: [['Mackenzie', 'PUC'], ['USP', 'IBMEC']] },
  //{ id: 'rug', name: 'RUG', fullName: 'Rugby', left: [['FGV', 'FECAP'], ['PUC', 'IBMEC']], right: [['Insper', 'USP'], ['Mackenzie', 'ESPM']] },
]
