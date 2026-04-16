import { useEffect, useState } from 'react'

const vowels = ['A', 'E', 'I', 'O', 'U']
const vowelSet = new Set(['a', 'e', 'i', 'o', 'u'])

const wordBank = [
  { word: 'CASA', emoji: '🏠', hint: 'Lugar onde moramos' },
  { word: 'BOLA', emoji: '⚽', hint: 'Usamos para brincar e chutar' },
  { word: 'ABELHA', emoji: '🐝', hint: 'Inseto que faz mel' },
  { word: 'GATO', emoji: '🐱', hint: 'Animal de estimação que mia' },
  { word: 'ESCOLA', emoji: '🏫', hint: 'Lugar onde estudamos' },
  { word: 'FOGO', emoji: '🔥', hint: 'É quente e vermelho' },
  { word: 'PIPA', emoji: '🪁', hint: 'Brinquedo que voa no céu' },
  { word: 'LUA', emoji: '🌙', hint: 'Aparece no céu à noite' },
]

function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)]
}

function createRoundData(entry) {
  const letters = entry.word.split('')
  const missingIndexes = letters.reduce((accumulator, letter, index) => {
    if (vowelSet.has(letter.toLowerCase())) {
      accumulator.push(index)
    }

    return accumulator
  }, [])

  return {
    ...entry,
    letters,
    missingIndexes,
    filledLetters: Array(missingIndexes.length).fill(''),
  }
}

function getSlotStatus(letter, expectedLetter) {
  if (!letter) {
    return 'empty'
  }

  return letter === expectedLetter ? 'correct' : 'wrong'
}

function VowelGame() {
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(1)
  const [message, setMessage] = useState('Escolha uma vogal e complete a palavra.')
  const [selectedSlot, setSelectedSlot] = useState(0)
  const [lockedRound, setLockedRound] = useState(false)
  const [feedbackImage, setFeedbackImage] = useState('')
  const [checkedWord, setCheckedWord] = useState(false)
  const [roundData, setRoundData] = useState(() => createRoundData(randomItem(wordBank)))

  const isRoundComplete = roundData.filledLetters.every((letter) => letter !== '')
  const isWordCorrect = roundData.filledLetters.every(
    (letter, index) => letter === roundData.letters[roundData.missingIndexes[index]],
  )

  useEffect(() => {
    function handleKeyDown(event) {
      if (lockedRound) {
        return
      }

      const pressedKey = event.key.toUpperCase()

      if (vowels.includes(pressedKey)) {
        handleVowelInput(pressedKey)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [lockedRound, selectedSlot, roundData])

  function moveToNextSlot(currentSlot, totalSlots) {
    if (totalSlots === 0) {
      return 0
    }

    return currentSlot >= totalSlots - 1 ? currentSlot : currentSlot + 1
  }

  function startNextRound() {
    setRound((currentRound) => currentRound + 1)
    setSelectedSlot(0)
    setLockedRound(false)
    setFeedbackImage('')
    setCheckedWord(false)
    setRoundData(createRoundData(randomItem(wordBank)))
    setMessage('Escolha uma vogal e complete a palavra.')
  }

  function handleVowelInput(vowel) {
    if (lockedRound) {
      return
    }

    setRoundData((currentRoundData) => {
      const nextFilledLetters = [...currentRoundData.filledLetters]
      nextFilledLetters[selectedSlot] = vowel
      return {
        ...currentRoundData,
        filledLetters: nextFilledLetters,
      }
    })

    setSelectedSlot((currentSlot) => moveToNextSlot(currentSlot, roundData.missingIndexes.length))
  }

  function handleCheckWord() {
    setCheckedWord(true)

    if (!isRoundComplete) {
      setFeedbackImage('')
      setMessage('Preencha todos os espaços antes de conferir.')
      return
    }

    if (isWordCorrect) {
      setScore((currentScore) => currentScore + 1)
      setLockedRound(true)
      setFeedbackImage('success')
      setMessage('Muito bem! Você completou a palavra corretamente.')
      return
    }

    setFeedbackImage('error')
    setMessage('Quase lá! Troque as vogais que ficaram erradas e tente novamente.')
  }

  function clearWord() {
    if (lockedRound) {
      return
    }

    setRoundData((currentRoundData) => ({
      ...currentRoundData,
      filledLetters: Array(currentRoundData.missingIndexes.length).fill(''),
    }))
    setSelectedSlot(0)
    setFeedbackImage('')
    setCheckedWord(false)
    setMessage('As vogais foram limpas. Tente novamente.')
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

      <section className="scoreboard">
        <div>
          <span>Acertos</span>
          <strong>{score}</strong>
        </div>
        <div>
          <span>Rodada</span>
          <strong>{round}</strong>
        </div>
      </section>

      <section className="vowel-visual">
        <div className="vowel-emoji" aria-hidden="true">
          {roundData.emoji}
        </div>
        <p className="vowel-hint">{roundData.hint}</p>
      </section>

      <section className="question-box">
        <div className="word-slots">
          {roundData.letters.map((letter, index) => {
            const missingPosition = roundData.missingIndexes.indexOf(index)

            if (missingPosition === -1) {
              return (
                <span key={`${letter}-${index}`} className="letter-tile fixed">
                  {letter}
                </span>
              )
            }

            const filledLetter = roundData.filledLetters[missingPosition]
            const expectedLetter = roundData.letters[index]
            const statusClass = getSlotStatus(filledLetter, expectedLetter)

            return (
              <button
                key={`slot-${index}`}
                type="button"
                className={`letter-tile slot ${selectedSlot === missingPosition ? 'selected' : ''} ${statusClass}`}
                onClick={() => setSelectedSlot(missingPosition)}
                disabled={lockedRound}
              >
                {filledLetter || '_'}
              </button>
            )
          })}
        </div>

        <div className="vowel-options">
          {vowels.map((vowel) => (
            <button
              key={vowel}
              type="button"
              className="app-button vowel-option"
              onClick={() => handleVowelInput(vowel)}
              disabled={lockedRound}
            >
              {vowel}
            </button>
          ))}
        </div>

        <div className="buttons">
          <button className="app-button primary-action" type="button" onClick={handleCheckWord}>
            Conferir palavra
          </button>
          <button className="app-button secondary-action" type="button" onClick={clearWord}>
            Limpar
          </button>
          <button
            className="app-button secondary-action"
            type="button"
            onClick={startNextRound}
            disabled={!checkedWord}
          >
            Próxima palavra
          </button>
        </div>

        <p className="message">{message}</p>
      </section>
    </section>
  )
}

export default VowelGame
