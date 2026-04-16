import { useEffect, useRef, useState } from 'react'

const operations = [
  { key: 'addition', label: 'Soma', symbol: '+' },
  { key: 'subtraction', label: 'Subtração', symbol: '-' },
  { key: 'multiplication', label: 'Multiplicação', symbol: 'x' },
  { key: 'division', label: 'Divisão', symbol: '/' },
]

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

function createQuestion(selectedOperations) {
  const operation = selectedOperations[randomNumber(0, selectedOperations.length - 1)]
  let num1 = randomNumber(1, 10)
  let num2 = randomNumber(1, 10)
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
    answer = num1
    num2 = randomNumber(1, 10)
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
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [answerOptions, setAnswerOptions] = useState([])
  const [message, setMessage] = useState('')
  const [gameStarted, setGameStarted] = useState(false)
  const [answeredQuestion, setAnsweredQuestion] = useState(false)
  const [feedbackImage, setFeedbackImage] = useState('')

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

  function toggleOperation(operationKey) {
    clearScheduledQuestion()

    setSelectedOperations((currentOperations) => {
      const isSelected = currentOperations.includes(operationKey)
      const nextOperations = isSelected
        ? currentOperations.filter((item) => item !== operationKey)
        : [...currentOperations, operationKey]

      if (!gameStarted) {
        setMessage(
          nextOperations.length === 0
            ? 'Selecione uma ou mais operações e clique em Começar.'
            : '',
        )
      }

      return nextOperations
    })

    if (gameStarted) {
      setFeedbackImage('')
      setMessage('')
      setAnsweredQuestion(false)
      setCurrentQuestion(null)
      setAnswerOptions([])
    }
  }

  function startRound() {
    clearScheduledQuestion()

    if (selectedOperations.length === 0) {
      setGameStarted(false)
      setCurrentQuestion(null)
      setAnswerOptions([])
      setMessage('Selecione uma ou mais operações e clique em Começar.')
      return
    }

    const nextQuestion = createQuestion(selectedOperations)

    setCurrentQuestion(nextQuestion)
    setAnswerOptions(createAnswerOptions(nextQuestion.answer))
    setFeedbackImage('')
    setMessage('')
    setGameStarted(true)
    setAnsweredQuestion(false)
    setRound((currentRound) => currentRound + 1)
  }

  function handleAnswer(selectedAnswer) {
    if (!gameStarted || !currentQuestion) {
      setMessage('Escolha as operações e clique em Começar.')
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
      setScore((currentScore) => currentScore + 1)
      setFeedbackImage('success')
      setMessage('Resposta correta! Você ganhou 1 ponto.')

      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null
        startRound()
      }, 2200)

      return
    }

    setFeedbackImage('error')
    setMessage(`Resposta incorreta. A resposta certa era ${currentQuestion.answer}.`)
  }

  return (
    <section className="game-panel">
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

      <section className="controls">
        <p className="operation-title">Escolha as operações:</p>
        <div className="operation-list">
          {operations.map((operation) => (
            <button
              key={operation.key}
              type="button"
              className={`app-button operation-option ${
                selectedOperations.includes(operation.key) ? 'active' : ''
              }`}
              onClick={() => toggleOperation(operation.key)}
            >
              {operation.label}
            </button>
          ))}
        </div>
      </section>

      <section className="scoreboard">
        <div>
          <span>Pontos</span>
          <strong>{score}</strong>
        </div>
        <div>
          <span>Rodada</span>
          <strong>{round}</strong>
        </div>
      </section>

      <section className="question-box">
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
              {selectedOperations.length === 0
                ? 'Escolha as operações e clique em Começar.'
                : 'Tudo pronto! Clique em Começar para iniciar.'}
            </span>
          )}
        </div>

        <div className="answer-options">
          {answerOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`app-button answer-option ${option.status !== 'idle' ? option.status : ''}`}
              onClick={() => handleAnswer(option.value)}
              disabled={answeredQuestion}
            >
              {option.value}
            </button>
          ))}
        </div>

        <div className="buttons">
          <button className="app-button primary-action" type="button" onClick={startRound}>
            {gameStarted ? 'Próxima pergunta' : 'Começar'}
          </button>
        </div>

        <p className="message">{message}</p>
      </section>
    </section>
  )
}

export default MathGame
