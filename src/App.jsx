import { useState, useMemo } from 'react'
import { TEAMS, POINTS_BY_PLACE, MODALITIES } from './data/teams'
import './App.css'

const getTeam = (name) => TEAMS[name]

function MatchCard({ team1, team2, winner, onSelectWinner }) {
  const t1 = getTeam(team1)
  const t2 = getTeam(team2)
  const is1Winner = winner === team1
  const is2Winner = winner === team2

  const handleClick = (name) => {
    onSelectWinner(name)
  }

  return (
    <div className="match-card">
      <div className="match-teams">
        <button
          type="button"
          className={`team-slot logo-only ${is1Winner ? 'winner' : ''}`}
          onClick={() => handleClick(team1)}
          title={team1}
        >
          <img src={t1?.logo} alt="" className={`team-logo ${t1?.logoClass || ''}`} />
        </button>
        <span className="vs">×</span>
        <button
          type="button"
          className={`team-slot logo-only ${is2Winner ? 'winner' : ''}`}
          onClick={() => handleClick(team2)}
          title={team2}
        >
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

function Bracket({ modality, state, onUpdate }) {
  const { left, right } = modality
  const { qf1, qf2, qf3, qf4, sf1, sf2, final: finalWinner } = state

  const sf1Teams = useMemo(() => {
    if (qf1 && qf2) return [qf1, qf2]
    return [null, null]
  }, [qf1, qf2])

  const sf2Teams = useMemo(() => {
    if (qf3 && qf4) return [qf3, qf4]
    return [null, null]
  }, [qf3, qf4])

  const thirdAndFourth = useMemo(() => {
    if (!sf1 || !sf2 || !finalWinner || !sf1Teams[0] || !sf1Teams[1] || !sf2Teams[0] || !sf2Teams[1]) return null
    const leftLoser = sf1 === sf1Teams[0] ? sf1Teams[1] : sf1Teams[0]
    const rightLoser = sf2 === sf2Teams[0] ? sf2Teams[1] : sf2Teams[0]
    const third = finalWinner === sf1 ? leftLoser : rightLoser
    const fourth = finalWinner === sf1 ? rightLoser : leftLoser
    return { third, fourth }
  }, [sf1, sf2, finalWinner, sf1Teams, sf2Teams])

  const finalTeams = useMemo(() => {
    if (sf1 && sf2) return [sf1, sf2]
    return [null, null]
  }, [sf1, sf2])

  return (
    <div className="bracket-horizontal">
      <div className="bracket-column quartas-col">
        <MatchCard team1={left[0][0]} team2={left[0][1]} winner={qf1} onSelectWinner={(w) => onUpdate('qf1', w)} />
        <MatchCard team1={left[1][0]} team2={left[1][1]} winner={qf2} onSelectWinner={(w) => onUpdate('qf2', w)} />
      </div>
      <div className="bracket-arrow">→</div>
      <div className="bracket-column semi-col">
        {sf1Teams[0] && sf1Teams[1] ? (
          <MatchCard team1={sf1Teams[0]} team2={sf1Teams[1]} winner={sf1} onSelectWinner={(w) => onUpdate('sf1', w)} />
        ) : (
          <div className="advance-slot empty"><span className="trophy">🏆</span></div>
        )}
      </div>
      <div className="bracket-arrow">→</div>
      <div className="bracket-column final-col">
        {finalTeams[0] && finalTeams[1] ? (
          <MatchCard team1={finalTeams[0]} team2={finalTeams[1]} winner={finalWinner} onSelectWinner={(w) => onUpdate('final', w)} />
        ) : (
          <div className="advance-slot empty large"><span className="trophy">🏆</span></div>
        )}
        <div className="third-place">
          {thirdAndFourth ? (
            <ThirdFourthDisplay third={thirdAndFourth.third} fourth={thirdAndFourth.fourth} />
          ) : (
            <span className="waiting">—</span>
          )}
        </div>
      </div>
      <div className="bracket-arrow">←</div>
      <div className="bracket-column semi-col">
        {sf2Teams[0] && sf2Teams[1] ? (
          <MatchCard team1={sf2Teams[0]} team2={sf2Teams[1]} winner={sf2} onSelectWinner={(w) => onUpdate('sf2', w)} />
        ) : (
          <div className="advance-slot empty"><span className="trophy">🏆</span></div>
        )}
      </div>
      <div className="bracket-arrow">←</div>
      <div className="bracket-column quartas-col">
        <MatchCard team1={right[0][0]} team2={right[0][1]} winner={qf3} onSelectWinner={(w) => onUpdate('qf3', w)} />
        <MatchCard team1={right[1][0]} team2={right[1][1]} winner={qf4} onSelectWinner={(w) => onUpdate('qf4', w)} />
      </div>
    </div>
  )
}

function GlobalRanking({ modalityState }) {
  const globalStandings = useMemo(() => {
    const pointsByTeam = {}
    Object.values(TEAMS).forEach((t) => { pointsByTeam[t.name] = 0 })

    MODALITIES.forEach((mod) => {
      const state = modalityState[mod.id] || {}
      const standings = computeModalityStandings(state, mod)
      standings.forEach((s) => {
        pointsByTeam[s.teamName] = (pointsByTeam[s.teamName] || 0) + s.points
      })
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
          <tr>
            <th>#</th>
            <th>Faculdade</th>
            <th>Pts</th>
          </tr>
        </thead>
        <tbody>
          {globalStandings.map((s, i) => (
            <tr key={s.team.id} className={i < 3 ? `top-${i + 1}` : ''}>
              <td>{s.place}º</td>
              <td>
                <img src={s.team.logo} alt="" className={`rank-logo ${s.team.logoClass || ''}`} />
                {s.team.name}
              </td>
              <td>{s.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {globalStandings.every((s) => s.points === 0) && <p className="ranking-hint">Complete os chaveamentos para acumular pontos.</p>}
    </div>
  )
}

/**
 * Não há disputa de 3º lugar: quem perdeu pro campeão na semi fica em 3º,
 * quem perdeu pro vice na semi fica em 4º.
 *
 * 5º–8º: cada perdedor das quartas perdeu para um dos 4 vencedores das quartas,
 * que acabam em 1º–4º. Quem perdeu para o campeão → 5º; para o vice → 6º;
 * para o 3º → 7º; para o 4º → 8º.
 */
function computeModalityStandings(state, modality) {
  const { left, right } = modality
  const { qf1, qf2, qf3, qf4, sf1, sf2, final: finalWinner } = state
  if (!finalWinner) return []
  if (!sf1 || !sf2) return []

  const finalists = [sf1, sf2].filter(Boolean)
  const runnerUp = finalists.find((t) => t !== finalWinner) ?? null
  if (!runnerUp) return []

  const leftLoser = sf1 === qf1 ? qf2 : qf1
  const rightLoser = sf2 === qf3 ? qf4 : qf3
  const third = finalWinner === sf1 ? leftLoser : rightLoser
  const fourth = finalWinner === sf1 ? rightLoser : leftLoser

  const placed = {}
  placed[1] = finalWinner
  placed[2] = runnerUp
  placed[3] = third
  placed[4] = fourth

  const finalPlaceByTeam = {
    [finalWinner]: 1,
    [runnerUp]: 2,
    [third]: 3,
    [fourth]: 4,
  }

  const qfMatches = [
    [left[0][0], left[0][1], qf1],
    [left[1][0], left[1][1], qf2],
    [right[0][0], right[0][1], qf3],
    [right[1][0], right[1][1], qf4],
  ]

  const qfLoserRows = qfMatches.map(([t1, t2, winner]) => ({
    loser: winner === t1 ? t2 : t1,
    eliminatedBy: winner,
  }))

  qfLoserRows.sort((a, b) => {
    const ra = finalPlaceByTeam[a.eliminatedBy] ?? 99
    const rb = finalPlaceByTeam[b.eliminatedBy] ?? 99
    return ra - rb
  })

  qfLoserRows.forEach((row, i) => {
    placed[5 + i] = row.loser
  })

  return Object.entries(placed).map(([place, name]) => ({
    place: parseInt(place, 10),
    teamName: name,
    points: POINTS_BY_PLACE[parseInt(place, 10)],
  }))
}

function App() {
  const [activeModality, setActiveModality] = useState(MODALITIES[0].id)
  const [modalityState, setModalityState] = useState({})

  const modality = MODALITIES.find((m) => m.id === activeModality)
  const state = modalityState[activeModality] || {}

  const handleUpdate = (key, value) => {
    setModalityState((prev) => {
      const cur = prev[activeModality] || {}
      const next = { ...cur, [key]: value }
      if (key === 'qf1' || key === 'qf2') {
        delete next.sf1
        delete next.final
      }
      if (key === 'qf3' || key === 'qf4') {
        delete next.sf2
        delete next.final
      }
      if (key === 'sf1' || key === 'sf2') {
        delete next.final
      }
      return { ...prev, [activeModality]: next }
    })
  }

  const handleReset = () => {
    setModalityState({})
  }

  const champion = useMemo(() => {
    const pointsByTeam = {}
    Object.values(TEAMS).forEach((t) => { pointsByTeam[t.name] = 0 })
    MODALITIES.forEach((mod) => {
      computeModalityStandings(modalityState[mod.id] || {}, mod).forEach((s) => {
        pointsByTeam[s.teamName] = (pointsByTeam[s.teamName] || 0) + s.points
      })
    })
    const entries = Object.entries(pointsByTeam).filter(([, p]) => p > 0).sort((a, b) => b[1] - a[1])
    return entries.length ? entries[0][0] : null
  }, [modalityState])

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <img src="/econologo.png" alt="ECONO 2026" className="logo-img" />
          </div>
          <div className="header-center">
            <p className="subtitle">Controle de resultados</p>
            <div className="champion-badge">
              Campeão atual do ranking: <strong>{champion || '—'}</strong>
            </div>
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
            {MODALITIES.map((m) => (
              <button
                key={m.id}
                type="button"
                className={`modality-pill ${activeModality === m.id ? 'active' : ''}`}
                onClick={() => setActiveModality(m.id)}
                title={m.fullName}
              >
                <span className="pill-code">{m.name}</span>
                <span className="pill-full">{m.fullName}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="main">
          <div className="main-inner">
            <h1 className="page-title">{modality.fullName}</h1>
            <div className="bracket-wrapper">
              <Bracket modality={modality} state={state} onUpdate={handleUpdate} />
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
