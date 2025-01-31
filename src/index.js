import { initializeTitle } from './modules/title.js'
import { initializeQuiz } from './modules/quiz.js'
import { initializeScores, updateLeaderboard } from './modules/scores.js'

console.log('Initializing app...')

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded.')

  // Initialize sections
  initializeTitle()
  initializeQuiz()
  initializeScores()

  // Add navbar scroll functionality
  document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-links a')

    navLinks.forEach(link => {
      link.addEventListener('click', (event) => {
        event.preventDefault() // Prevent default anchor behavior

        const targetPage = event.target.getAttribute('data-page') // Get the data-page attribute
        const targetSection = document.getElementById(targetPage)

        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' })
        } else {
          console.error(`Section with id "${targetPage}" not found.`)
        }
      })
    })
  })
  updateLeaderboard()
})
