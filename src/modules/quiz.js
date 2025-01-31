import { API } from '../utils/api.js'
import { saveHighScore } from './scores.js'

/**
 * Initializes the quiz section UI.
 */
export function initializeQuiz () {
  console.log('Initializing quiz section...')

  const quizDiv = document.getElementById('quiz')

  quizDiv.innerHTML = `
    <h2>Quiz</h2>
    <div id="question-container"></div>
    <p id="timer"></p>
  `

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const submitButton = document.getElementById('submit-answer')
      if (submitButton) submitButton.click()
    }
  })
}

/**
 * Starts the quiz for the given nickname.
 * @param {string} nickname - The player's nickname.
 */
export function startQuiz (nickname) {
  console.log(`Starting quiz for ${nickname}`)

  const api = new API()
  const questionContainer = document.getElementById('question-container')
  const timerElement = document.getElementById('timer')

  let currentQuestion = null
  let timer = null
  let score = 0 // Initialize score

  console.log('Attempting to load first question...')
  loadQuestion()

  /**
   *
   */
  async function loadQuestion () {
    try {
      currentQuestion = await api.fetchQuestion()
      questionContainer.innerHTML = ''
      questionContainer.appendChild(currentQuestion.renderHTML())

      const submitButton = document.getElementById('submit-answer')
      if (submitButton) {
        submitButton.addEventListener('click', submitAnswer)
      }

      startTimer(currentQuestion.limit)
    } catch (error) {
      console.error('Error loading question:', error)
      questionContainer.textContent =
        'Failed to load the question. Please try again later.'
    }
  }

  /**
   *
   * @param limit
   */
  function startTimer (limit) {
    if (timer) clearInterval(timer)
    let timeRemaining = limit
    timerElement.textContent = `Time remaining: ${timeRemaining}s`

    timer = setInterval(() => {
      timeRemaining--
      timerElement.textContent = `Time remaining: ${timeRemaining}s`

      if (timeRemaining <= 0) {
        clearInterval(timer)
        console.log('Time is up!')
        endGame(false)
      }
    }, 1000)
  }

  /**
   *
   */
  async function submitAnswer () {
    const selectedOption = document.querySelector('input[name="answer"]:checked')
    const textAnswer = document.getElementById('answer')

    const answer = selectedOption
      ? selectedOption.value
      : textAnswer
        ? textAnswer.value.trim()
        : null

    if (!answer) {
      alert('Please provide an answer.')
      console.log('No answer provided.')
      return
    }

    console.log('Submitting answer:', answer)
    clearInterval(timer)

    try {
      const data = await api.submitAnswer(answer, currentQuestion.nextURL)
      const timeRemaining = parseInt(timerElement.textContent.split(' ')[2].slice(0, -1))

      if (data.nextURL) {
        // Correct answer: Update score
        score += timeRemaining * 10
        console.log(`Correct! Score updated: ${score}`)

        api.currentURL = data.nextURL
        loadQuestion()
      } else {
        endGame(true)
      }
    } catch (error) {
      console.error('Error submitting answer:', error)
      endGame(false)
    }
  }

  /**
   *
   * @param success
   */
  function endGame (success) {
    clearInterval(timer)
    const quizContainer = document.getElementById('quiz')

    const messageFail = '❌ Incorrect answer. Game over!'
    const messageSuc = '🎉 Congratulations! You completed the quiz!'

    quizContainer.innerHTML = `
      <h2>Your score: ${score}</h2>
      <h1 id="game-over">${success ? messageSuc : messageFail}</h1>
      <button id="restart-button">Try Again</button>
    `

    // Save score on failure as well
    saveHighScore(nickname, score)

    // Attach restart event listener
    document.getElementById('restart-button').addEventListener('click', restartGame)
  }

  /**
   *
   */
  function restartGame () {
    console.log('Restarting game...')
    const quizDiv = document.getElementById('quiz')
    quizDiv.innerHTML = '' // Clear content
    initializeQuiz() // Re-initialize UI
    startQuiz(nickname) // Restart quiz with the same nickname
  }
}
