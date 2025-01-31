import { startQuiz } from './quiz.js'

/**
 *
 */
export function initializeTitle () {
  console.log('Initializing title section...')

  const titleDiv = document.getElementById('title')

  titleDiv.innerHTML = `
      <h1>Welcome to the Quiz Game</h1>
      <input type="text" id="nickname" placeholder="Enter your nickname">
      <button id="start-quiz">Start Quiz</button>
    `

  const startButton = document.getElementById('start-quiz')
  startButton.addEventListener('click', () => {
    const nickname = document.getElementById('nickname').value.trim()
    if (nickname) {
      console.log(`Nickname entered: ${nickname}`)
      document.getElementById('quiz').scrollIntoView({ behavior: 'smooth' })
      startQuiz(nickname)
    } else {
      console.log('No nickname entered.')
      alert('Please enter a nickname to start.')
    }
  })
}
