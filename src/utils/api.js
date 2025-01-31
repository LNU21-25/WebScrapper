import { Question } from '../objects/question.js'

export class API {
  static baseURL = 'https://courselab.lnu.se/quiz/question/1'
  constructor () {
    this.currentURL = API.baseURL
  }

  async fetchQuestion () {
    try {
      const response = await fetch(this.currentURL)
      const data = await response.json()
      console.log('Fetched question:', data)
      return this.buildQuestionObject(data)
    } catch (error) {
      console.error('Error fetching question:', error)
      throw new Error('Failed to fetch question.')
    }
  }

  async submitAnswer (answer, nextURL) {
    try {
      const response = await fetch(nextURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer })
      })
      const data = await response.json()
      console.log('Answer submitted, response:', data)
      return data
    } catch (error) {
      console.error('Error submitting answer:', error)
      throw new Error('Failed to submit answer.')
    }
  }

  buildQuestionObject (data) {
    return new Question(data)
  }
}
