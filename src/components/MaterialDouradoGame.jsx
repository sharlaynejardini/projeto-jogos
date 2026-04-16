import { useEffect, useRef, useState } from 'react'

const MAX_NUMBER = 50

function randomTarget(previousValue) {
  let nextValue = Math.floor(Math.random() * MAX_NUMBER) + 1

  while (nextValue === previousValue) {
    nextValue = Math.floor(Math.random() * MAX_NUMBER) + 1
  }

  return nextValue
}

function createChallenge(previousValue) {
  const target = randomTarget(previousValue)

  return {
    target,
    tens: Math.floor(target / 10),
    units: target % 10,
  }
}

function MaterialDouradoGame() {
  const nextChallengeTimeoutRef = useRef(null)
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(1)
  const [feedbackImage, setFeedbackImage] = useState('')
  const [message, setMessage] = useState('Arraste as pecas para as areas corretas.')
  const [challenge, setChallenge] = useState(() => createChallenge())
  const [placedTens, setPlacedTens] = useState(0)
  const [placedUnits, setPlacedUnits] = useState(0)
  const [verifiedAnswer, setVerifiedAnswer] = useState(false)
  const [activeDropZone, setActiveDropZone] = useState('')
  const [canGoNext, setCanGoNext] = useState(false)

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
    setPlacedTens(0)
    setPlacedUnits(0)
    setFeedbackImage('')
    setVerifiedAnswer(false)
    setActiveDropZone('')
    setCanGoNext(false)
  }

  function startNextChallenge() {
    clearScheduledRound()
    setRound((currentRound) => currentRound + 1)
    setChallenge((currentChallenge) => createChallenge(currentChallenge.target))
    resetBoard()
    setMessage('Novo desafio! Arraste as pecas para montar o numero.')
  }

  function restartGame() {
    clearScheduledRound()
    setScore(0)
    setRound(1)
    setChallenge(createChallenge())
    resetBoard()
    setMessage('Jogo reiniciado. Arraste dezenas e unidades para o quadro.')
  }

  function clearPieces() {
    resetBoard()
    setMessage('As pecas foram limpas. Tente montar o numero novamente.')
  }

  function handleDragStart(event, pieceType) {
    event.dataTransfer.setData('text/plain', pieceType)
    event.dataTransfer.setData('source', 'palette')
    event.dataTransfer.effectAllowed = 'copy'
    setFeedbackImage('')
    setVerifiedAnswer(false)
    setMessage(
      pieceType === 'ten'
        ? 'Agora solte a dezena na area de montagem.'
        : 'Agora solte a unidade na area de montagem.',
    )
  }

  function handlePlacedDragStart(event, pieceType) {
    event.dataTransfer.setData('text/plain', pieceType)
    event.dataTransfer.setData('source', 'board')
    event.dataTransfer.effectAllowed = 'move'
    setMessage(
      pieceType === 'ten'
        ? 'Arraste a dezena para a area de remover.'
        : 'Arraste a unidade para a area de remover.',
    )
  }

  function handleDragOver(event) {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'
    setActiveDropZone('board')
  }

  function handleDragLeave() {
    setActiveDropZone('')
  }

  function handleDrop(event) {
    event.preventDefault()
    const pieceType = event.dataTransfer.getData('text/plain')
    const source = event.dataTransfer.getData('source')
    setActiveDropZone('')

    if (source === 'board') {
      setMessage('Essa peca ja esta no quadro. Arraste novas pecas da lateral.')
      return
    }

    if (pieceType === 'ten') {
      if (placedTens >= 5) {
        setMessage('Voce ja colocou o maximo de dezenas deste jogo.')
        return
      }

      setPlacedTens((currentValue) => currentValue + 1)
      setMessage('Boa! Uma dezena foi colocada.')
    }

    if (pieceType === 'unit') {
      if (placedUnits >= 9) {
        setMessage('Voce ja colocou o maximo de unidades deste jogo.')
        return
      }

      setPlacedUnits((currentValue) => currentValue + 1)
      setMessage('Boa! Uma unidade foi colocada.')
    }

    setFeedbackImage('')
    setVerifiedAnswer(false)
  }

  function handleRemoveDragOver(event) {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
    setActiveDropZone('remove')
  }

  function handleRemoveDrop(event) {
    event.preventDefault()
    const pieceType = event.dataTransfer.getData('text/plain')
    const source = event.dataTransfer.getData('source')
    setActiveDropZone('')

    if (source !== 'board') {
      setMessage('Arraste para remover apenas as pecas que ja estao no quadro.')
      return
    }

    removePlacedPiece(pieceType)
  }

  function removePlacedPiece(pieceType) {
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
  }

  function verifyAnswer() {
    const totalValue = placedTens * 10 + placedUnits
    const isCorrect = placedTens === challenge.tens && placedUnits === challenge.units

    setVerifiedAnswer(true)

    if (isCorrect) {
      setScore((currentScore) => currentScore + 1)
      setFeedbackImage('success')
      setCanGoNext(true)
      setMessage(
        `Muito bem! ${challenge.target} e igual a ${challenge.tens} dezena(s) e ${challenge.units} unidade(s).`,
      )

      return
    }

    setFeedbackImage('error')
    setMessage(
      `Quase la! Voce montou ${totalValue}. Tente formar ${challenge.target} com ${challenge.tens} dezena(s) e ${challenge.units} unidade(s).`,
    )
  }

  return (
    <section className="game-panel material-game">
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

      <section className="material-top-layout">
        <section className="scoreboard material-scoreboard">
          <div>
            <span>Acertos</span>
            <strong>{score}</strong>
          </div>
          <div>
            <span>Desafio</span>
            <strong>{round}</strong>
          </div>
        </section>

        <section className="material-target-box">
          <p className="operation-title">Monte este numero</p>
          <div className="material-target-number">{challenge.target}</div>
          <p className="material-target-hint">Arraste a barra para dezenas e o cubinho para unidades.</p>
        </section>

        <section className="material-summary">
          <div className="material-summary-card">
            <span>Numero montado</span>
            <strong>{placedTens * 10 + placedUnits}</strong>
          </div>
        </section>
      </section>

      <section className="material-main-layout">
        <section className="material-builder">
          <article className="material-piece-card">
            <img
              className="material-piece-image material-piece-draggable"
              src="/images/jogoMaterialDourado/dezena.png"
              alt="Peca de dezena"
              draggable
              onDragStart={(event) => handleDragStart(event, 'ten')}
            />
            <div className="material-piece-copy">
              <h3>Dezena</h3>
              <p>Arraste para a area de montagem.</p>
            </div>
          </article>

          <article className="material-piece-card">
            <img
              className="material-piece-image material-piece-draggable"
              src="/images/jogoMaterialDourado/unidade.png"
              alt="Peca de unidade"
              draggable
              onDragStart={(event) => handleDragStart(event, 'unit')}
            />
            <div className="material-piece-copy">
              <h3>Unidade</h3>
              <p>Arraste para a area de montagem.</p>
            </div>
          </article>
        </section>

        <section className="material-board">
          <article className="material-zone material-zone-single">
            <h3>Area de montagem</h3>
            <div
              className={`material-dropzone material-dropzone-single ${activeDropZone === 'board' ? 'is-active' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {placedTens === 0 && placedUnits === 0 ? (
                <p className="material-empty-text">Solte aqui as dezenas e as unidades.</p>
              ) : (
                <>
                  {Array.from({ length: placedTens }).map((_, index) => (
                    <button
                      key={`ten-${index}`}
                      type="button"
                      className="material-placed-button"
                      onClick={() => removePlacedPiece('ten')}
                      draggable
                      onDragStart={(event) => handlePlacedDragStart(event, 'ten')}
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
                      draggable
                      onDragStart={(event) => handlePlacedDragStart(event, 'unit')}
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
      </section>

      <section className="material-remove-row">
        <div
          className={`material-remove-zone ${activeDropZone === 'remove' ? 'is-active' : ''}`}
          onDragOver={handleRemoveDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleRemoveDrop}
        >
          Arraste aqui para tirar uma peca do quadro
        </div>
      </section>

      <div className="buttons">
        <button className="app-button primary-action" type="button" onClick={verifyAnswer}>
          Verificar resposta
        </button>
        <button
          className="app-button secondary-action"
          type="button"
          onClick={startNextChallenge}
          disabled={!canGoNext}
        >
          Proximo
        </button>
        <button className="app-button secondary-action" type="button" onClick={clearPieces}>
          Limpar
        </button>
        <button className="app-button secondary-action" type="button" onClick={restartGame}>
          Reiniciar
        </button>
      </div>

      <p className={`message ${verifiedAnswer ? 'message-highlight' : ''}`}>{message}</p>
    </section>
  )
}

export default MaterialDouradoGame
