import { useEffect, useRef, useState } from 'react'

const operations = [
  { key: 'addition', label: 'Soma', symbol: '+' },
  { key: 'subtraction', label: 'Subtração', symbol: '-' },
  { key: 'multiplication', label: 'Multiplicação', symbol: 'x' },
  { key: 'division', label: 'Divisão', symbol: '/' },
]

const levels = [
  { key: 'nube', label: 'Nube', min: 1, max: 10 },
  { key: 'pro', label: 'Pro', min: 5, max: 30 },
]

const totalRoundsPerLevel = 10

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function shuffleList(list) {
  const shuffled = [...list]

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = randomNumber(0, index)
    ;[shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]]
  }

  return shuffled
}

function createWrongAnswer(correctAnswer) {
  let candidate = correctAnswer + randomNumber(-10, 10)

  while (candidate === correctAnswer || candidate < 0) {
    candidate = correctAnswer + randomNumber(-10, 10)
  }

  return candidate
}

function createQuestion(selectedOperations, levelKey) {
  const operation = selectedOperations[randomNumber(0, selectedOperations.length - 1)]
  const level = levels.find((item) => item.key === levelKey) ?? levels[0]
  let num1 = randomNumber(level.min, level.max)
  let num2 = randomNumber(level.min, level.max)
  let answer = 0
  const symbol = operations.find((item) => item.key === operation)?.symbol ?? '+'

  if (operation === 'addition') {
    answer = num1 + num2
  }

  if (operation === 'subtraction') {
    if (num2 > num1) {
      ;[num1, num2] = [num2, num1]
    }
    answer = num1 - num2
  }

  if (operation === 'multiplication') {
    answer = num1 * num2
  }

  if (operation === 'division') {
    answer = randomNumber(level.min, Math.max(level.min + 1, Math.floor(level.max / 2)))
    num2 = randomNumber(level.min, Math.max(level.min + 1, Math.floor(level.max / 2)))
    num1 = answer * num2
  }

  return { num1, num2, symbol, answer }
}

function createAnswerOptions(correctAnswer) {
  const options = [correctAnswer]

  while (options.length < 4) {
    const wrongAnswer = createWrongAnswer(correctAnswer)

    if (!options.includes(wrongAnswer)) {
      options.push(wrongAnswer)
    }
  }

  return shuffleList(options).map((value) => ({
    value,
    status: 'idle',
  }))
}

function MathGame() {
  const timeoutRef = useRef(null)

  const [selectedOperations, setSelectedOperations] = useState([])
  const [selectedLevel, setSelectedLevel] = useState('nube')
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [answerOptions, setAnswerOptions] = useState([])
  const [message, setMessage] = useState('')
  const [gameStarted, setGameStarted] = useState(false)
  const [answeredQuestion, setAnsweredQuestion] = useState(false)
  const [feedbackImage, setFeedbackImage] = useState('')
  const [gameFinished, setGameFinished] = useState(false)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  function clearScheduledQuestion() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  function resetBoard() {
    setCurrentQuestion(null)
    setAnswerOptions([])
    setAnsweredQuestion(false)
    setFeedbackImage('')
  }

  function finishGame(finalScore) {
    clearScheduledQuestion()
    setGameFinished(true)
    setGameStarted(false)
    resetBoard()
    setMessage(
      `Fim da partida! Você fez ${finalScore} ponto(s) no nível ${selectedLevel === 'nube' ? 'Nube' : 'Pro'}.`,
    )
  }

  function toggleOperation(operationKey) {
    clearScheduledQuestion()

    setSelectedOperations((currentOperations) => {
      const isSelected = currentOperations.includes(operationKey)
      const nextOperations = isSelected
        ? currentOperations.filter((item) => item !== operationKey)
        : [...currentOperations, operationKey]

      if (!gameStarted && !gameFinished) {
        setMessage(
          nextOperations.length === 0
            ? 'Selecione uma ou mais operações, escolha o nível e clique em Começar.'
            : '',
        )
      }

      return nextOperations
    })

    if (gameStarted || gameFinished) {
      setGameStarted(false)
      setGameFinished(false)
      setRound(0)
      setScore(0)
      resetBoard()
      setMessage('Configuração alterada. Clique em Começar para iniciar uma nova partida.')
    }
  }

  function selectLevel(levelKey) {
    clearScheduledQuestion()
    setSelectedLevel(levelKey)

    if (gameStarted || gameFinished) {
      setGameStarted(false)
      setGameFinished(false)
      setRound(0)
      setScore(0)
      resetBoard()
      setMessage('Nível alterado. Clique em Começar para iniciar uma nova partida.')
    }
  }

  function startRound() {
    clearScheduledQuestion()

    if (selectedOperations.length === 0) {
      setGameStarted(false)
      setGameFinished(false)
      resetBoard()
      setMessage('Selecione uma ou mais operações, escolha o nível e clique em Começar.')
      return
    }

    const nextRound = gameFinished || !gameStarted ? 1 : round + 1

    if (gameFinished || !gameStarted) {
      setScore(0)
      setGameFinished(false)
    }

    if (nextRound > totalRoundsPerLevel) {
      finishGame(score)
      return
    }

    const nextQuestion = createQuestion(selectedOperations, selectedLevel)

    setCurrentQuestion(nextQuestion)
    setAnswerOptions(createAnswerOptions(nextQuestion.answer))
    setFeedbackImage('')
    setMessage('')
    setGameStarted(true)
    setAnsweredQuestion(false)
    setRound(nextRound)
  }

  function handleAnswer(selectedAnswer) {
    if (!gameStarted || !currentQuestion) {
      setMessage('Escolha as operações, o nível e clique em Começar.')
      return
    }

    if (answeredQuestion) {
      setMessage('Clique em Próxima pergunta para continuar.')
      return
    }

    const isCorrect = selectedAnswer === currentQuestion.answer

    setAnsweredQuestion(true)
    setAnswerOptions((currentOptions) =>
      currentOptions.map((option) => {
        if (option.value === currentQuestion.answer) {
          return { ...option, status: 'correct' }
        }

        if (option.value === selectedAnswer && !isCorrect) {
          return { ...option, status: 'wrong' }
        }

        return option
      }),
    )

    if (isCorrect) {
      const nextScore = score + 1
      setScore(nextScore)
      setFeedbackImage('success')
      setMessage('Resposta correta! Você ganhou 1 ponto.')

      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null

        if (round >= totalRoundsPerLevel) {
          finishGame(nextScore)
          return
        }

        startRound()
      }, 2200)

      return
    }

    setFeedbackImage('error')
    setMessage(`Resposta incorreta. A resposta certa era ${currentQuestion.answer}.`)
  }

  return (
    <section className="game-panel math-game container-fluid px-0">
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

      <section className="controls math-controls">
        <p className="operation-title">Escolha o nível:</p>
        <div className="row g-2 level-list math-level-list">
          {levels.map((level) => (
            <div key={level.key} className="col-12 col-md-6">
              <button
                type="button"
                className={`app-button level-option ${selectedLevel === level.key ? 'active' : ''}`}
                onClick={() => selectLevel(level.key)}
              >
                {level.label}
              </button>
            </div>
          ))}
        </div>

        <p className="operation-title">Escolha as operações:</p>
        <div className="row g-2 operation-list math-operation-list">
          {operations.map((operation) => (
            <div key={operation.key} className="col-12 col-md-6 col-xl-3">
              <button
                type="button"
                className={`app-button operation-option ${
                  selectedOperations.includes(operation.key) ? 'active' : ''
                }`}
                onClick={() => toggleOperation(operation.key)}
              >
                {operation.label}
              </button>
            </div>
          ))}
        </div>

        <div className="math-help-strip">
          <span>1. Escolha o nível.</span>
          <span>2. Marque as operações.</span>
          <span>3. Clique em Começar.</span>
        </div>
      </section>

      <section className="row g-3 scoreboard math-scoreboard">
        <div className="col-6">
          <div className="math-stat-card">
            <span>Pontos</span>
            <strong>{score}</strong>
          </div>
        </div>
        <div className="col-6">
          <div className="math-stat-card">
            <span>Rodada</span>
            <strong>{round}/{totalRoundsPerLevel}</strong>
          </div>
        </div>
      </section>

      <section className="question-box math-question-box">
        <div className="question-display">
          {currentQuestion ? (
            <>
              <span className="question-number">{currentQuestion.num1}</span>
              <span className="question-symbol">{currentQuestion.symbol}</span>
              <span className="question-number">{currentQuestion.num2}</span>
              <span className="question-symbol">= ?</span>
            </>
          ) : (
            <span className="question-symbol">
              {gameFinished
                ? `Partida encerrada no nível ${selectedLevel === 'nube' ? 'Nube' : 'Pro'}.`
                : selectedOperations.length === 0
                  ? 'Escolha as operações, o nível e clique em Começar.'
                  : 'Tudo pronto! Clique em Começar para iniciar.'}
            </span>
          )}
        </div>

        <div className="row g-2 answer-options math-answer-grid">
          {answerOptions.map((option) => (
            <div key={option.value} className="col-12 col-md-6">
              <button
                type="button"
                className={`app-button answer-option ${option.status !== 'idle' ? option.status : ''}`}
                onClick={() => handleAnswer(option.value)}
                disabled={answeredQuestion}
              >
                {option.value}
              </button>
            </div>
          ))}
        </div>

        <div className="row g-2 buttons math-actions">
          <div className="col-12 col-lg-4 mx-auto">
            <button className="app-button primary-action" type="button" onClick={startRound}>
              {gameFinished ? 'Jogar novamente' : gameStarted ? 'Próxima pergunta' : 'Começar'}
            </button>
          </div>
        </div>

        <p className="message">{message}</p>
      </section>
    </section>
  )
}

export default MathGame
