import { useEffect, useRef, useState } from 'react'

const TOTAL_CHALLENGES = 20

const levels = [
  { key: 'easy', label: 'Facil', min: 0, max: 50, description: 'Numeros de 0 a 50.' },
  { key: 'medium', label: 'Medio', min: 50, max: 500, description: 'Numeros de 50 a 500.' },
  { key: 'hard', label: 'Dificil', min: 500, max: 5000, description: 'Numeros de 500 em diante.' },
]

const pieceDefinitions = [
  {
    key: 'thousand',
    title: 'Milhar',
    image: '/images/jogoMaterialDourado/milhar.png',
    alt: 'Peca de milhar',
    helper: 'Clique para adicionar.',
    singular: 'milhar',
    article: 'o',
    valueLabel: 'Vale 1000',
  },
  {
    key: 'hundred',
    title: 'Centena',
    image: '/images/jogoMaterialDourado/centena.png',
    alt: 'Peca de centena',
    helper: 'Clique para adicionar.',
    singular: 'centena',
    article: 'a',
    valueLabel: 'Vale 100',
  },
  {
    key: 'ten',
    title: 'Dezena',
    image: '/images/jogoMaterialDourado/dezena.png',
    alt: 'Peca de dezena',
    helper: 'Clique para adicionar.',
    singular: 'dezena',
    article: 'a',
    valueLabel: 'Vale 10',
  },
  {
    key: 'unit',
    title: 'Unidade',
    image: '/images/jogoMaterialDourado/unidade.png',
    alt: 'Peca de unidade',
    helper: 'Clique para adicionar.',
    singular: 'unidade',
    article: 'a',
    valueLabel: 'Vale 1',
  },
]

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getLevel(levelKey) {
  return levels.find((level) => level.key === levelKey) ?? levels[0]
}

function randomTarget(levelKey, previousValue) {
  const level = getLevel(levelKey)
  let nextValue = randomNumber(level.min, level.max)

  while (level.min !== level.max && nextValue === previousValue) {
    nextValue = randomNumber(level.min, level.max)
  }

  return nextValue
}

function createChallenge(previousValue, levelKey) {
  const target = randomTarget(levelKey, previousValue)

  return {
    target,
    thousands: Math.floor(target / 1000),
    hundreds: Math.floor((target % 1000) / 100),
    tens: Math.floor((target % 100) / 10),
    units: target % 10,
  }
}

function getPieceDefinition(pieceType) {
  return pieceDefinitions.find((piece) => piece.key === pieceType) ?? pieceDefinitions[0]
}

function formatComposition({ thousands, hundreds, tens, units }) {
  return `${thousands} milhar(es), ${hundreds} centena(s), ${tens} dezena(s) e ${units} unidade(s)`
}

function MaterialDouradoGame() {
  const nextChallengeTimeoutRef = useRef(null)
  const [selectedLevel, setSelectedLevel] = useState(levels[0].key)
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(1)
  const [feedbackImage, setFeedbackImage] = useState('')
  const [message, setMessage] = useState('Escolha o nivel, adicione as pecas e verifique a resposta.')
  const [challenge, setChallenge] = useState(() => createChallenge(undefined, levels[0].key))
  const [placedThousands, setPlacedThousands] = useState(0)
  const [placedHundreds, setPlacedHundreds] = useState(0)
  const [placedTens, setPlacedTens] = useState(0)
  const [placedUnits, setPlacedUnits] = useState(0)
  const [verifiedAnswer, setVerifiedAnswer] = useState(false)
  const [canGoNext, setCanGoNext] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)

  useEffect(() => {
    return () => {
      if (nextChallengeTimeoutRef.current) {
        clearTimeout(nextChallengeTimeoutRef.current)
      }
    }
  }, [])

  function clearScheduledRound() {
    if (nextChallengeTimeoutRef.current) {
      clearTimeout(nextChallengeTimeoutRef.current)
      nextChallengeTimeoutRef.current = null
    }
  }

  function resetBoard() {
    setPlacedThousands(0)
    setPlacedHundreds(0)
    setPlacedTens(0)
    setPlacedUnits(0)
    setFeedbackImage('')
    setVerifiedAnswer(false)
    setCanGoNext(false)
  }

  function restartGame(levelKey = selectedLevel) {
    const nextLevel = getLevel(levelKey)

    clearScheduledRound()
    setSelectedLevel(nextLevel.key)
    setScore(0)
    setRound(1)
    setGameFinished(false)
    setChallenge(createChallenge(undefined, nextLevel.key))
    resetBoard()
    setMessage(`Nivel ${nextLevel.label.toLowerCase()} selecionado. Adicione as pecas para montar o numero.`)
  }

  function selectLevel(levelKey) {
    restartGame(levelKey)
  }

  function startNextChallenge(forceAdvance = false) {
    if ((!forceAdvance && !canGoNext) || gameFinished) {
      return
    }

    clearScheduledRound()
    setRound((currentRound) => currentRound + 1)
    setChallenge((currentChallenge) => createChallenge(currentChallenge.target, selectedLevel))
    resetBoard()
    setMessage('Novo desafio! Adicione as pecas para montar o numero.')
  }

  function clearPieces() {
    if (gameFinished) {
      return
    }

    resetBoard()
    setMessage('As pecas foram limpas. Tente montar o numero novamente.')
  }

  function addPiece(pieceType) {
    if (gameFinished) {
      return
    }

    if (pieceType === 'thousand') {
      if (placedThousands >= 9) {
        setMessage('Voce ja colocou o maximo de milhares neste jogo.')
        return
      }

      setPlacedThousands((currentValue) => currentValue + 1)
      setMessage('Boa! Um milhar foi colocado.')
    }

    if (pieceType === 'hundred') {
      if (placedHundreds >= 9) {
        setMessage('Voce ja colocou o maximo de centenas neste jogo.')
        return
      }

      setPlacedHundreds((currentValue) => currentValue + 1)
      setMessage('Boa! Uma centena foi colocada.')
    }

    if (pieceType === 'ten') {
      if (placedTens >= 9) {
        setMessage('Voce ja colocou o maximo de dezenas neste jogo.')
        return
      }

      setPlacedTens((currentValue) => currentValue + 1)
      setMessage('Boa! Uma dezena foi colocada.')
    }

    if (pieceType === 'unit') {
      if (placedUnits >= 9) {
        setMessage('Voce ja colocou o maximo de unidades neste jogo.')
        return
      }

      setPlacedUnits((currentValue) => currentValue + 1)
      setMessage('Boa! Uma unidade foi colocada.')
    }

    setFeedbackImage('')
    setVerifiedAnswer(false)
    setCanGoNext(false)
  }

  function removePlacedPiece(pieceType) {
    if (gameFinished) {
      return
    }

    if (pieceType === 'thousand') {
      setPlacedThousands((currentValue) => Math.max(0, currentValue - 1))
      setMessage('Um milhar foi removido.')
    }

    if (pieceType === 'hundred') {
      setPlacedHundreds((currentValue) => Math.max(0, currentValue - 1))
      setMessage('Uma centena foi removida.')
    }

    if (pieceType === 'ten') {
      setPlacedTens((currentValue) => Math.max(0, currentValue - 1))
      setMessage('Uma dezena foi removida.')
    }

    if (pieceType === 'unit') {
      setPlacedUnits((currentValue) => Math.max(0, currentValue - 1))
      setMessage('Uma unidade foi removida.')
    }

    setFeedbackImage('')
    setVerifiedAnswer(false)
    setCanGoNext(false)
  }

  function verifyAnswer() {
    if (gameFinished) {
      setMessage('Atividade concluida! Clique em Reiniciar para jogar novamente.')
      return
    }

    if (verifiedAnswer && canGoNext) {
      setMessage('Resposta ja verificada. Aguarde o proximo desafio.')
      return
    }

    const totalValue =
      placedThousands * 1000 + placedHundreds * 100 + placedTens * 10 + placedUnits
    const isCorrect =
      placedThousands === challenge.thousands &&
      placedHundreds === challenge.hundreds &&
      placedTens === challenge.tens &&
      placedUnits === challenge.units

    setVerifiedAnswer(true)

    if (isCorrect) {
      const nextScore = score + 1

      setScore(nextScore)
      setFeedbackImage('success')

      if (round >= TOTAL_CHALLENGES) {
        setGameFinished(true)
        setCanGoNext(false)
        setMessage(
          `Atividade concluida! Voce acertou ${nextScore} de ${TOTAL_CHALLENGES} desafios no nivel ${getLevel(selectedLevel).label.toLowerCase()}.`,
        )
        return
      }

      setCanGoNext(true)
      setMessage(
        `Muito bem! ${challenge.target} = ${challenge.thousands} milhar(es), ${challenge.hundreds} centena(s), ${challenge.tens} dezena(s) e ${challenge.units} unidade(s). Indo para o proximo desafio...`,
      )

      nextChallengeTimeoutRef.current = setTimeout(() => {
        nextChallengeTimeoutRef.current = null
        startNextChallenge(true)
      }, 1800)

      return
    }

    setFeedbackImage('error')
    setCanGoNext(false)
    setMessage(
      `Quase la! Voce montou ${totalValue}. Tente formar ${challenge.target} com ${challenge.thousands} milhar(es), ${challenge.hundreds} centena(s), ${challenge.tens} dezena(s) e ${challenge.units} unidade(s).`,
    )
  }

  const placedValue =
    placedThousands * 1000 + placedHundreds * 100 + placedTens * 10 + placedUnits
  const selectedLevelData = getLevel(selectedLevel)
  const boardIsEmpty =
    placedThousands === 0 && placedHundreds === 0 && placedTens === 0 && placedUnits === 0
  const canVerify = !gameFinished && !boardIsEmpty
  const currentComposition = formatComposition({
    thousands: placedThousands,
    hundreds: placedHundreds,
    tens: placedTens,
    units: placedUnits,
  })

  return (
    <section className="game-panel material-game container-fluid px-0">
      <img
        src="/images/Acertou.png"
        alt="Imagem de acerto"
        className={`side-image ${feedbackImage === 'success' ? 'active' : ''}`}
      />
      <img
        src="/images/Errou.png"
        alt="Imagem de erro"
        className={`side-image ${feedbackImage === 'error' ? 'active' : ''}`}
      />

      <section className="controls material-controls">
        <p className="operation-title">Escolha o nivel:</p>
        <div className="row g-3 material-level-list-row">
          {levels.map((level) => (
            <div key={level.key} className="col-12 col-lg-4">
              <button
                type="button"
                className={`app-button level-option ${selectedLevel === level.key ? 'active' : ''}`}
                onClick={() => selectLevel(level.key)}
              >
                <span className="material-level-name">{level.label}</span>
                <span className="material-level-range">{level.description}</span>
              </button>
            </div>
          ))}
        </div>
        <p className="material-level-description">{selectedLevelData.description}</p>
        <div className="material-help-strip">
          <span>1. Escolha o nivel.</span>
          <span>2. Adicione as pecas.</span>
          <span>3. Verifique a resposta.</span>
        </div>
      </section>

      <section className="row g-3 material-status-row">
        <div className="col-6 col-xl-3">
          <div className="material-stat-card">
            <span>Acertos</span>
            <strong>{score}</strong>
          </div>
        </div>
        <div className="col-6 col-xl-3">
          <div className="material-stat-card">
            <span>Atividade</span>
            <strong>
              {Math.min(round, TOTAL_CHALLENGES)}/{TOTAL_CHALLENGES}
            </strong>
          </div>
        </div>
        <div className="col-6 col-xl-3">
          <div className="material-summary-card">
            <span>Nivel atual</span>
            <strong>{selectedLevelData.label}</strong>
          </div>
        </div>
        <div className="col-6 col-xl-3">
          <div className="material-summary-card material-summary-card-wide">
            <span>Numero montado</span>
            <strong>{placedValue}</strong>
            <small>{currentComposition}</small>
          </div>
        </div>
      </section>

      <section className="row g-3 material-main-row">
        <div className="col-12 col-xl-4">
          <section className="row g-3 material-piece-grid">
            {pieceDefinitions.map((piece) => (
              <div key={piece.key} className="col-6">
                <button
                  type="button"
                  className="material-piece-card material-piece-card-button h-100"
                  onClick={() => addPiece(piece.key)}
                >
                  <span className="material-piece-badge">{piece.valueLabel}</span>
                  <img
                    className="material-piece-image"
                    src={piece.image}
                    alt={piece.alt}
                  />
                  <div className="material-piece-copy">
                    <h3>{piece.title}</h3>
                    <p>{piece.helper}</p>
                  </div>
                </button>
              </div>
            ))}
          </section>
        </div>

        <div className="col-12 col-xl-8">
          <section className="d-flex flex-column gap-3 h-100">
            <section className="material-target-box material-target-box-inline">
              <p className="operation-title">Monte este numero</p>
              <div className="material-target-number">{challenge.target}</div>
              <p className="material-target-hint">
                Clique nas pecas ao lado para montar o numero na area de montagem.
              </p>
            </section>

            <article className="material-zone material-zone-single flex-grow-1">
              <div className="material-zone-header">
                <div>
                  <h3>Area de montagem</h3>
                  <p className="material-zone-subtitle">
                    Adicione as pecas e clique na peca montada para remover, se precisar.
                  </p>
                </div>
                <div className="material-zone-counter">
                  <span>Total montado</span>
                  <strong>{placedValue}</strong>
                </div>
              </div>
              <div
                className="material-dropzone material-dropzone-single"
              >
                {boardIsEmpty ? (
                  <p className="material-empty-text">
                    As pecas adicionadas vao aparecer aqui.
                  </p>
                ) : (
                  <>
                    {Array.from({ length: placedThousands }).map((_, index) => (
                      <button
                      key={`thousand-${index}`}
                      type="button"
                      className="material-placed-button"
                      onClick={() => removePlacedPiece('thousand')}
                    >
                        <img
                          className="material-board-piece material-board-piece-thousand"
                          src="/images/jogoMaterialDourado/milhar.png"
                          alt="Milhar colocado"
                        />
                      </button>
                    ))}
                    {Array.from({ length: placedHundreds }).map((_, index) => (
                      <button
                      key={`hundred-${index}`}
                      type="button"
                      className="material-placed-button"
                      onClick={() => removePlacedPiece('hundred')}
                    >
                        <img
                          className="material-board-piece material-board-piece-hundred"
                          src="/images/jogoMaterialDourado/centena.png"
                          alt="Centena colocada"
                        />
                      </button>
                    ))}
                    {Array.from({ length: placedTens }).map((_, index) => (
                      <button
                      key={`ten-${index}`}
                      type="button"
                      className="material-placed-button"
                      onClick={() => removePlacedPiece('ten')}
                    >
                        <img
                          className="material-board-piece material-board-piece-ten"
                          src="/images/jogoMaterialDourado/dezena.png"
                          alt="Dezena colocada"
                        />
                      </button>
                    ))}
                    {Array.from({ length: placedUnits }).map((_, index) => (
                      <button
                      key={`unit-${index}`}
                      type="button"
                      className="material-placed-button"
                      onClick={() => removePlacedPiece('unit')}
                    >
                        <img
                          className="material-board-piece material-board-piece-unit"
                          src="/images/jogoMaterialDourado/unidade.png"
                          alt="Unidade colocada"
                        />
                      </button>
                    ))}
                  </>
                )}
              </div>
            </article>
          </section>
        </div>
      </section>

      <div className="row g-2 material-actions">
        <div className="col-12 col-md-4">
          <button
            className="app-button primary-action"
            type="button"
            onClick={verifyAnswer}
            disabled={!canVerify}
          >
            Verificar resposta
          </button>
        </div>
        <div className="col-12 col-md-4">
          <button
            className="app-button secondary-action"
            type="button"
            onClick={clearPieces}
            disabled={gameFinished}
          >
            Limpar
          </button>
        </div>
        <div className="col-12 col-md-4">
          <button
            className="app-button secondary-action"
            type="button"
            onClick={() => restartGame()}
          >
            Reiniciar
          </button>
        </div>
      </div>

      <p className={`message ${verifiedAnswer ? 'message-highlight' : ''}`}>{message}</p>
    </section>
  )
}

export default MaterialDouradoGame
