import { useState, useMemo, useEffect, useCallback } from 'react'
import { TEAMS, POINTS_BY_PLACE, MODALITIES } from './data/teams'
import './App.css'

const INTRO_DISMISSED_KEY = 'econo-intro-dismissed'
const SCENARIOS_STORAGE_KEY = 'econo-scenarios-v1'
const TEAM_NAMES = Object.keys(TEAMS)
const DEFAULT_GROUP_A = TEAM_NAMES.slice(0, 4)
const DEFAULT_GROUP_B = TEAM_NAMES.slice(4, 8)

const SPECIAL_MODALITIES = [
  { id: 'jj', name: 'JJ', fullName: 'Jiu-Jitsu', type: 'jiuJitsu' },
  { id: 'rug', name: 'RUG', fullName: 'Rugby', type: 'rugby' },
  { id: 'xad', name: 'XAD', fullName: 'Xadrez', type: 'xadrez' },
  { id: 'ntm', name: 'NTM', fullName: 'Natação Masculina', type: 'xadrez'},
  { id: 'ntf', name: 'NTF', fullName: 'Natação Feminina', type: 'xadrez'},
]

const ALL_MODALITIES = [...MODALITIES.map((m) => ({ ...m, type: 'singleElimination' })), ...SPECIAL_MODALITIES]

const getTeam = (name) => TEAMS[name]

const createEmptySingleElimState = () => ({})

const getGroupMatches = (teams, group) => {
  const matches = []
  for (let i = 0; i < teams.length; i += 1) {
    for (let j = i + 1; j < teams.length; j += 1) {
      matches.push({
        id: `${group}-${teams[i]}-${teams[j]}`,
        group,
        home: teams[i],
        away: teams[j],
        result: '',
        homeTries: '',
        awayTries: '',
      })
    }
  }
  return matches
}

const createDefaultStateForModality = (modality) => {
  if (modality.type === 'singleElimination') return createEmptySingleElimState()
  if (modality.type === 'jiuJitsu') {
    return {
      matches: getGroupMatches(TEAM_NAMES, 'JJ').map((m) => ({ ...m, result: '' })),
      touched: false,
    }
  }
  if (modality.type === 'rugby') {
    return {
      groupA: DEFAULT_GROUP_A,
      groupB: DEFAULT_GROUP_B,
      matches: [...getGroupMatches(DEFAULT_GROUP_A, 'A'), ...getGroupMatches(DEFAULT_GROUP_B, 'B')],
      finalWinner: '',
      thirdWinner: '',
    }
  }
  if (modality.type === 'xadrez') {
    return {
      ranking: TEAM_NAMES.map((teamName) => ({ teamName })),
      touched: false,
    }
  }
  return {}
}

const createEmptyAppState = () => {
  const initial = {}
  ALL_MODALITIES.forEach((m) => { initial[m.id] = createDefaultStateForModality(m) })
  return initial
}

const readSavedScenarios = () => {
  try {
    const raw = localStorage.getItem(SCENARIOS_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((item) => item && typeof item.name === 'string' && item.modalityState)
  } catch {
    return []
  }
}

function IntroModal({ onClose }) {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="intro-overlay" onClick={handleBackdropClick} role="dialog" aria-modal="true" aria-labelledby="intro-title">
      <div className="intro-modal">
        <button type="button" className="intro-close" onClick={onClose} aria-label="Fechar">×</button>
        <h2 id="intro-title">Como funciona</h2>
        <div className="intro-content">
          <p>Este simulador permite registrar os resultados das modalidades do ECONO 2026 e acompanhar o ranking geral.</p>
          <p><strong>Chaveamento:</strong> modalidades tradicionais usam quartas, semis e final. Clique no logo do vencedor para avançar.</p>
          <p><strong>Jiu-Jitsu:</strong> todos contra todos, com seleção de vencedor pelas fotinhas (sem empate).</p>
          <p><strong>Rugby:</strong> fase de grupos com fotinhas dos times e empate no meio; depois final e disputa de 3º.</p>
          <p><strong>Xadrez:</strong> ranking em blocos arrastáveis (arraste para ordenar do 1º ao 8º).</p>
          <p><strong>Reiniciar</strong> zera todos os resultados.</p>
        </div>
        <p className="intro-hint">Clique fora ou no × para fechar</p>
      </div>
    </div>
  )
}

function MatchCard({ team1, team2, winner, onSelectWinner }) {
  const t1 = getTeam(team1)
  const t2 = getTeam(team2)
  const is1Winner = winner === team1
  const is2Winner = winner === team2

  return (
    <div className="match-card">
      <div className="match-teams">
        <button type="button" className={`team-slot logo-only ${is1Winner ? 'winner' : ''}`} onClick={() => onSelectWinner(team1)} title={team1}>
          <img src={t1?.logo} alt="" className={`team-logo ${t1?.logoClass || ''}`} />
        </button>
        <span className="vs">×</span>
        <button type="button" className={`team-slot logo-only ${is2Winner ? 'winner' : ''}`} onClick={() => onSelectWinner(team2)} title={team2}>
          <img src={t2?.logo} alt="" className={`team-logo ${t2?.logoClass || ''}`} />
        </button>
      </div>
    </div>
  )
}

function ThirdFourthDisplay({ third, fourth }) {
  const t3 = getTeam(third)
  const t4 = getTeam(fourth)
  return (
    <div className="mini-match logo-row third-fourth">
      <div className="place-slot" title={third}>
        <span className="place-label">3º</span>
        <img src={t3?.logo} alt="" className={`team-logo ${t3?.logoClass || ''}`} />
      </div>
      <div className="place-slot" title={fourth}>
        <span className="place-label">4º</span>
        <img src={t4?.logo} alt="" className={`team-logo ${t4?.logoClass || ''}`} />
      </div>
    </div>
  )
}

function SingleElimBracket({ modality, state, onUpdate }) {
  const { left, right } = modality
  const { qf1, qf2, qf3, qf4, sf1, sf2, final: finalWinner } = state

  const sf1Teams = useMemo(() => (qf1 && qf2 ? [qf1, qf2] : [null, null]), [qf1, qf2])
  const sf2Teams = useMemo(() => (qf3 && qf4 ? [qf3, qf4] : [null, null]), [qf3, qf4])
  const finalTeams = useMemo(() => (sf1 && sf2 ? [sf1, sf2] : [null, null]), [sf1, sf2])

  const thirdAndFourth = useMemo(() => {
    if (!sf1 || !sf2 || !finalWinner || !sf1Teams[0] || !sf1Teams[1] || !sf2Teams[0] || !sf2Teams[1]) return null
    const leftLoser = sf1 === sf1Teams[0] ? sf1Teams[1] : sf1Teams[0]
    const rightLoser = sf2 === sf2Teams[0] ? sf2Teams[1] : sf2Teams[0]
    return finalWinner === sf1
      ? { third: leftLoser, fourth: rightLoser }
      : { third: rightLoser, fourth: leftLoser }
  }, [sf1, sf2, finalWinner, sf1Teams, sf2Teams])

  return (
    <div className="bracket-horizontal">
      <div className="bracket-column quartas-col">
        <MatchCard team1={left[0][0]} team2={left[0][1]} winner={qf1} onSelectWinner={(w) => onUpdate('qf1', w)} />
        <MatchCard team1={left[1][0]} team2={left[1][1]} winner={qf2} onSelectWinner={(w) => onUpdate('qf2', w)} />
      </div>
      <div className="bracket-arrow">→</div>
      <div className="bracket-column semi-col">
        {sf1Teams[0] && sf1Teams[1]
          ? <MatchCard team1={sf1Teams[0]} team2={sf1Teams[1]} winner={sf1} onSelectWinner={(w) => onUpdate('sf1', w)} />
          : <div className="advance-slot empty"><span className="trophy">🏆</span></div>}
      </div>
      <div className="bracket-arrow">→</div>
      <div className="bracket-column final-col">
        {finalTeams[0] && finalTeams[1]
          ? <MatchCard team1={finalTeams[0]} team2={finalTeams[1]} winner={finalWinner} onSelectWinner={(w) => onUpdate('final', w)} />
          : <div className="advance-slot empty large"><span className="trophy">🏆</span></div>}
        <div className="third-place">
          {thirdAndFourth ? <ThirdFourthDisplay third={thirdAndFourth.third} fourth={thirdAndFourth.fourth} /> : <span className="waiting">—</span>}
        </div>
      </div>
      <div className="bracket-arrow">←</div>
      <div className="bracket-column semi-col">
        {sf2Teams[0] && sf2Teams[1]
          ? <MatchCard team1={sf2Teams[0]} team2={sf2Teams[1]} winner={sf2} onSelectWinner={(w) => onUpdate('sf2', w)} />
          : <div className="advance-slot empty"><span className="trophy">🏆</span></div>}
      </div>
      <div className="bracket-arrow">←</div>
      <div className="bracket-column quartas-col">
        <MatchCard team1={right[0][0]} team2={right[0][1]} winner={qf3} onSelectWinner={(w) => onUpdate('qf3', w)} />
        <MatchCard team1={right[1][0]} team2={right[1][1]} winner={qf4} onSelectWinner={(w) => onUpdate('qf4', w)} />
      </div>
    </div>
  )
}

function RugbyEditor({ state, onUpdateMatch, onSetFinals }) {
  const groupA = computeRugbyGroupTable(state, 'A')
  const groupB = computeRugbyGroupTable(state, 'B')
  const finalTeams = groupA[0] && groupB[0] ? [groupA[0].teamName, groupB[0].teamName] : [null, null]
  const thirdTeams = groupA[1] && groupB[1] ? [groupA[1].teamName, groupB[1].teamName] : [null, null]

  return (
    <div className="ranking-panel special-panel">
      <h3>Fase de grupos</h3>
      <div className="rugby-grid compact">
        {state.matches.map((m) => (
          <div key={m.id} className="rugby-card" title={`Grupo ${m.group}: ${m.home} x ${m.away}`}>
            <div className="rugby-picks">
              <button
                type="button"
                className={`pick-logo ${m.result === 'home' ? 'active' : ''}`}
                title={`${m.home} vence`}
                onClick={() => onUpdateMatch(m.id, { result: m.result === 'home' ? '' : 'home' })}
              >
                <img src={getTeam(m.home)?.logo} alt={m.home} className={`team-logo ${getTeam(m.home)?.logoClass || ''}`} />
              </button>
              <button
                type="button"
                className={`pick-draw ${m.result === 'draw' ? 'active' : ''}`}
                title="Empate"
                onClick={() => onUpdateMatch(m.id, { result: m.result === 'draw' ? '' : 'draw' })}
              >
                =
              </button>
              <button
                type="button"
                className={`pick-logo ${m.result === 'away' ? 'active' : ''}`}
                title={`${m.away} vence`}
                onClick={() => onUpdateMatch(m.id, { result: m.result === 'away' ? '' : 'away' })}
              >
                <img src={getTeam(m.away)?.logo} alt={m.away} className={`team-logo ${getTeam(m.away)?.logoClass || ''}`} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="rugby-finals">
        <h4>Final</h4>
        {finalTeams[0] && finalTeams[1] ? (
          <MatchCard team1={finalTeams[0]} team2={finalTeams[1]} winner={state.finalWinner} onSelectWinner={(w) => onSetFinals('finalWinner', w)} />
        ) : <p className="ranking-hint">Complete os grupos para gerar a final.</p>}
        <h4>Disputa de 3º</h4>
        {thirdTeams[0] && thirdTeams[1] ? (
          <MatchCard team1={thirdTeams[0]} team2={thirdTeams[1]} winner={state.thirdWinner} onSelectWinner={(w) => onSetFinals('thirdWinner', w)} />
        ) : <p className="ranking-hint">Complete os grupos para gerar a disputa de 3º.</p>}
      </div>
    </div>
  )
}

function JiuJitsuEditor({ state, onUpdateMatch }) {
  return (
    <div className="ranking-panel special-panel">
      <h3>Todos contra todos</h3>
      <div className="jj-grid">
        {state.matches.map((m) => (
          <div key={m.id} className="jj-card" title={`${m.home} x ${m.away}`}>
            <div className="rugby-picks jj-picks">
              <button
                type="button"
                className={`pick-logo ${m.result === 'home' ? 'active' : ''}`}
                title={`${m.home} vence`}
                onClick={() => onUpdateMatch(m.id, { result: m.result === 'home' ? '' : 'home' })}
              >
                <img src={getTeam(m.home)?.logo} alt={m.home} className={`team-logo ${getTeam(m.home)?.logoClass || ''}`} />
              </button>
              <span className="pick-vs">x</span>
              <button
                type="button"
                className={`pick-logo ${m.result === 'away' ? 'active' : ''}`}
                title={`${m.away} vence`}
                onClick={() => onUpdateMatch(m.id, { result: m.result === 'away' ? '' : 'away' })}
              >
                <img src={getTeam(m.away)?.logo} alt={m.away} className={`team-logo ${getTeam(m.away)?.logoClass || ''}`} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function XadrezEditor({ state, onStartDrag, onDropAt, draggingTeam }) {
  return (
    <div className="ranking-panel special-panel">
      <h3>Ranking em blocos</h3>
      <p className="ranking-desc">Segure e arraste as equipes para ordenar do 1º ao 8º.</p>
      <div className="xadrez-grid blocks">
        {state.ranking.map((row, idx) => (
          <div
            key={row.teamName}
            className={`xadrez-row block ${draggingTeam === row.teamName ? 'dragging' : ''}`}
            draggable
            onDragStart={() => onStartDrag(row.teamName)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDropAt(idx)}
            title="Arraste para reordenar"
          >
            <span>{idx + 1}º</span>
            <span>{row.teamName}</span>
            <span className="drag-handle">≡</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function computeSingleElimStandings(state, modality) {
  const { left, right } = modality
  const { qf1, qf2, qf3, qf4, sf1, sf2, final: finalWinner } = state
  if (!finalWinner || !sf1 || !sf2) return []

  const runnerUp = [sf1, sf2].find((t) => t !== finalWinner)
  if (!runnerUp) return []

  const leftLoser = sf1 === qf1 ? qf2 : qf1
  const rightLoser = sf2 === qf3 ? qf4 : qf3
  const third = finalWinner === sf1 ? leftLoser : rightLoser
  const fourth = finalWinner === sf1 ? rightLoser : leftLoser

  const placed = { 1: finalWinner, 2: runnerUp, 3: third, 4: fourth }
  const finalPlaceByTeam = { [finalWinner]: 1, [runnerUp]: 2, [third]: 3, [fourth]: 4 }

  const qfMatches = [
    [left[0][0], left[0][1], qf1],
    [left[1][0], left[1][1], qf2],
    [right[0][0], right[0][1], qf3],
    [right[1][0], right[1][1], qf4],
  ]

  const qfLosers = qfMatches.map(([t1, t2, w]) => ({ loser: w === t1 ? t2 : t1, by: w }))
  qfLosers.sort((a, b) => (finalPlaceByTeam[a.by] ?? 99) - (finalPlaceByTeam[b.by] ?? 99))
  qfLosers.forEach((row, i) => { placed[5 + i] = row.loser })

  return Object.entries(placed).map(([place, teamName]) => ({ place: Number(place), teamName, points: POINTS_BY_PLACE[Number(place)] || 0 }))
}

function computeJiuJitsuStandings(state) {
  if (!state?.touched) return []
  const matches = state.matches || []
  if (!matches.length || matches.some((m) => !m.result)) return []

  const table = {}
  TEAM_NAMES.forEach((t) => { table[t] = { teamName: t, wins: 0 } })
  matches.forEach((m) => {
    if (!m.result) return
    if (m.result === 'home') table[m.home].wins += 1
    if (m.result === 'away') table[m.away].wins += 1
  })
  const sorted = Object.values(table).sort((a, b) => b.wins - a.wins)
  return sorted.map((row, i) => ({ place: i + 1, teamName: row.teamName, points: POINTS_BY_PLACE[i + 1] || 0 }))
}

function computeRugbyGroupTable(state, group) {
  const teams = group === 'A' ? state.groupA : state.groupB
  const table = {}
  teams.forEach((t) => { table[t] = { teamName: t, pts: 0, saldo: 0 } })

  state.matches.filter((m) => m.group === group).forEach((m) => {
    if (!m.result) return
    if (m.result === 'home') table[m.home].pts += 3
    if (m.result === 'away') table[m.away].pts += 3
    if (m.result === 'draw') {
      table[m.home].pts += 1
      table[m.away].pts += 1
    }
    const ht = Number(m.homeTries || 0)
    const at = Number(m.awayTries || 0)
    table[m.home].saldo += ht - at
    table[m.away].saldo += at - ht
  })

  return Object.values(table).sort((a, b) => b.pts - a.pts || b.saldo - a.saldo)
}

function computeRugbyStandings(state) {
  const groupA = computeRugbyGroupTable(state, 'A')
  const groupB = computeRugbyGroupTable(state, 'B')
  if (!groupA[0] || !groupB[0] || !groupA[1] || !groupB[1] || !state.finalWinner || !state.thirdWinner) return []

  const finalistA = groupA[0].teamName
  const finalistB = groupB[0].teamName
  const thirdA = groupA[1].teamName
  const thirdB = groupB[1].teamName

  const runnerUp = state.finalWinner === finalistA ? finalistB : finalistA
  const fourth = state.thirdWinner === thirdA ? thirdB : thirdA

  const placed = [state.finalWinner, runnerUp, state.thirdWinner, fourth, groupA[2]?.teamName, groupB[2]?.teamName, groupA[3]?.teamName, groupB[3]?.teamName].filter(Boolean)
  return placed.map((teamName, i) => ({ place: i + 1, teamName, points: POINTS_BY_PLACE[i + 1] || 0 }))
}

function computeXadrezStandings(state) {
  if (!state?.touched) return []
  return (state.ranking || []).map((r, i) => ({ place: i + 1, teamName: r.teamName, points: POINTS_BY_PLACE[i + 1] || 0 }))
}

function computeStandings(modality, state) {
  if (!modality) return []
  if (modality.type === 'singleElimination') return computeSingleElimStandings(state, modality)
  if (modality.type === 'jiuJitsu') return computeJiuJitsuStandings(state)
  if (modality.type === 'rugby') return computeRugbyStandings(state)
  if (modality.type === 'xadrez') return computeXadrezStandings(state)
  return []
}

function GlobalRanking({ modalityState }) {
  const globalStandings = useMemo(() => {
    const pointsByTeam = {}
    TEAM_NAMES.forEach((name) => { pointsByTeam[name] = 0 })
    ALL_MODALITIES.forEach((mod) => {
      const standings = computeStandings(mod, modalityState[mod.id] || createDefaultStateForModality(mod))
      standings.forEach((s) => { pointsByTeam[s.teamName] = (pointsByTeam[s.teamName] || 0) + s.points })
    })

    return Object.entries(pointsByTeam)
      .map(([name, points]) => ({ team: getTeam(name), points }))
      .sort((a, b) => b.points - a.points)
      .map((s, i) => ({ ...s, place: i + 1 }))
  }, [modalityState])

  return (
    <div className="ranking-panel">
      <h3>Ranking geral</h3>
      <p className="ranking-desc">Soma dos pontos em todas as modalidades</p>
      <table>
        <thead>
          <tr><th>#</th><th>Faculdade</th><th>Pts</th></tr>
        </thead>
        <tbody>
          {globalStandings.map((s, i) => (
            <tr key={s.team.id} className={i < 3 ? `top-${i + 1}` : ''}>
              <td>{s.place}º</td>
              <td><img src={s.team.logo} alt="" className={`rank-logo ${s.team.logoClass || ''}`} />{s.team.name}</td>
              <td>{s.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function App() {
  const [activeModality, setActiveModality] = useState(ALL_MODALITIES[0].id)
  const [modalityState, setModalityState] = useState(() => createEmptyAppState())
  const [showIntro, setShowIntro] = useState(() => !sessionStorage.getItem(INTRO_DISMISSED_KEY))
  const [savedScenarios, setSavedScenarios] = useState(() => readSavedScenarios())
  const [scenarioName, setScenarioName] = useState('')
  const [selectedScenarioId, setSelectedScenarioId] = useState('')

  const closeIntro = useCallback(() => {
    setShowIntro(false)
    sessionStorage.setItem(INTRO_DISMISSED_KEY, '1')
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => { if (showIntro && e.key === 'Escape') closeIntro() }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showIntro, closeIntro])

  const modality = ALL_MODALITIES.find((m) => m.id === activeModality)
  const state = modalityState[activeModality] || createDefaultStateForModality(modality)

  const handleSingleElimUpdate = (key, value, categoryId = null) => {
    setModalityState((prev) => {
      const curModality = prev[activeModality] || createDefaultStateForModality(modality)
      const cur = categoryId ? (curModality.categories?.[categoryId] || {}) : curModality
      const next = { ...cur, [key]: value }
      if (key === 'qf1' || key === 'qf2') { delete next.sf1; delete next.final }
      if (key === 'qf3' || key === 'qf4') { delete next.sf2; delete next.final }
      if (key === 'sf1' || key === 'sf2') delete next.final

      if (!categoryId) return { ...prev, [activeModality]: next }
      return {
        ...prev,
        [activeModality]: {
          ...curModality,
          categories: { ...curModality.categories, [categoryId]: next },
        },
      }
    })
  }

  const handleRugbyMatchUpdate = (matchId, patch) => {
    setModalityState((prev) => ({
      ...prev,
      [activeModality]: {
        ...prev[activeModality],
        matches: prev[activeModality].matches.map((m) => (m.id === matchId ? { ...m, ...patch } : m)),
        touched: true,
      },
    }))
  }

  const [draggingTeam, setDraggingTeam] = useState('')

  const handleXadrezDropAt = (targetIdx) => {
    if (!draggingTeam) return
    setModalityState((prev) => {
      const ranking = [...prev[activeModality].ranking]
      const fromIdx = ranking.findIndex((r) => r.teamName === draggingTeam)
      if (fromIdx < 0 || fromIdx === targetIdx) return prev
      const [moved] = ranking.splice(fromIdx, 1)
      ranking.splice(targetIdx, 0, moved)
      return { ...prev, [activeModality]: { ...prev[activeModality], ranking, touched: true } }
    })
    setDraggingTeam('')
  }

  const handleReset = () => {
    setModalityState(createEmptyAppState())
  }

  const persistScenarios = (nextScenarios) => {
    setSavedScenarios(nextScenarios)
    localStorage.setItem(SCENARIOS_STORAGE_KEY, JSON.stringify(nextScenarios))
  }

  const handleSaveScenario = () => {
    const cleanName = scenarioName.trim()
    const now = Date.now()
    const selectedScenario = savedScenarios.find((s) => s.id === selectedScenarioId) || null

    // Se um cenário estiver selecionado, salva por cima dele.
    if (selectedScenario) {
      const updated = {
        ...selectedScenario,
        name: cleanName || selectedScenario.name,
        modalityState,
        updatedAt: now,
      }
      const next = savedScenarios.map((s) => (s.id === selectedScenario.id ? updated : s))
      persistScenarios(next)
      setSelectedScenarioId(updated.id)
      setScenarioName('')
      return
    }

    // Sem cenário selecionado: cria novo (ou atualiza por nome, para evitar duplicados).
    if (!cleanName) return
    const existingIdx = savedScenarios.findIndex((s) => s.name.toLowerCase() === cleanName.toLowerCase())
    const record = { id: existingIdx >= 0 ? savedScenarios[existingIdx].id : `sc-${now}`, name: cleanName, modalityState, updatedAt: now }
    const next = existingIdx >= 0 ? savedScenarios.map((s, i) => (i === existingIdx ? record : s)) : [record, ...savedScenarios]
    persistScenarios(next)
    setSelectedScenarioId(record.id)
    setScenarioName('')
  }

  const handleLoadScenario = () => {
    const selected = savedScenarios.find((s) => s.id === selectedScenarioId)
    if (!selected) return
    setModalityState(selected.modalityState)
  }

  const handleDeleteScenario = () => {
    if (!selectedScenarioId) return
    const next = savedScenarios.filter((s) => s.id !== selectedScenarioId)
    persistScenarios(next)
    setModalityState(createEmptyAppState())
    setSelectedScenarioId('')
  }

  const champion = useMemo(() => {
    const pointsByTeam = {}
    TEAM_NAMES.forEach((name) => { pointsByTeam[name] = 0 })
    ALL_MODALITIES.forEach((mod) => {
      const standings = computeStandings(mod, modalityState[mod.id] || {})
      standings.forEach((s) => { pointsByTeam[s.teamName] = (pointsByTeam[s.teamName] || 0) + s.points })
    })
    const entries = Object.entries(pointsByTeam).sort((a, b) => b[1] - a[1])
    return entries[0]?.[1] > 0 ? entries[0][0] : null
  }, [modalityState])

  return (
    <div className="app">
      {showIntro && <IntroModal onClose={closeIntro} />}
      <header className="header">
        <div className="header-inner">
          <div className="logo"><img src="/econologo.png" alt="ECONO 2026" className="logo-img" /></div>
          <div className="header-center">
            <p className="subtitle">Controle de resultados</p>
            <div className="champion-badge">Campeão atual do ranking: <strong>{champion || '—'}</strong></div>
            <a
              href="https://github.com/jhonatanrlp"
              className="creator-link"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub — Jhonatan Ramos"
            >
              <svg className="creator-github" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                />
              </svg>
              <span>Criado por Jhonatan Ramos</span>
            </a>
          </div>
          <button type="button" className="btn-reset" onClick={handleReset}>Reiniciar</button>
        </div>
      </header>

      <div className="layout">
        <aside className="nav-sidebar" aria-label="Modalidades">
          <span className="nav-sidebar-label">Modalidades</span>
          <nav className="modality-nav">
            {ALL_MODALITIES.map((m) => (
              <button key={m.id} type="button" className={`modality-pill ${activeModality === m.id ? 'active' : ''}`} onClick={() => setActiveModality(m.id)} title={m.fullName}>
                <span className="pill-code">{m.name}</span>
                <span className="pill-full">{m.fullName}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="main">
          <div className="main-inner">
            <h1 className="page-title">{modality.fullName}</h1>
            <div className="scenario-bar">
              <input
                type="text"
                className="scenario-input"
                placeholder="Nome do cenario (ex: realista)"
                value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
              />
              <button type="button" className="scenario-btn" onClick={handleSaveScenario}>Salvar</button>
              <select className="scenario-select" value={selectedScenarioId} onChange={(e) => setSelectedScenarioId(e.target.value)}>
                <option value="">Cenarios salvos</option>
                {savedScenarios.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <button type="button" className="scenario-btn" onClick={handleLoadScenario} disabled={!selectedScenarioId}>Carregar</button>
              <button type="button" className="scenario-btn danger" onClick={handleDeleteScenario} disabled={!selectedScenarioId}>Excluir</button>
            </div>
            <div className="bracket-wrapper">
              {modality.type === 'singleElimination' && (
                <SingleElimBracket modality={modality} state={state} onUpdate={handleSingleElimUpdate} />
              )}
              {modality.type === 'jiuJitsu' && <JiuJitsuEditor state={state} onUpdateMatch={handleRugbyMatchUpdate} />}
              {modality.type === 'rugby' && (
                <RugbyEditor
                  state={state}
                  onUpdateMatch={handleRugbyMatchUpdate}
                  onSetFinals={(key, value) => setModalityState((prev) => ({ ...prev, [activeModality]: { ...prev[activeModality], [key]: value } }))}
                />
              )}
              {modality.type === 'xadrez' && (
                <XadrezEditor
                  state={state}
                  draggingTeam={draggingTeam}
                  onStartDrag={setDraggingTeam}
                  onDropAt={handleXadrezDropAt}
                />
              )}
            </div>
            <div className="ranking-section">
              <GlobalRanking modalityState={modalityState} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
