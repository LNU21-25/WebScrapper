import axios from 'axios'
import * as cheerio from 'cheerio'

/**
 * Scrapes movie showtimes for the available days.
 * @param {string} cinemaUrl - The URL of the cinema page.
 * @param {string[]} availableDays - Array of available days.
 * @returns {object} - Movie showtimes for the available days.
 */
export async function scrapeCinema (cinemaUrl, availableDays) {
  console.log('cinemaUrl:', cinemaUrl)
  try {
    // Fetch the HTML content of the cinema page
    const response = await axios.get(cinemaUrl)
    const $ = cheerio.load(response.data)

    const showtimes = {}

    // Loop through available days and extract showtimes
    availableDays.forEach(day => {
      const dayShowtimes = $(`div#${day.toLowerCase()} .showtime`).map((i, el) => {
        const movie = $(el).find('.movie').text().trim()
        const time = $(el).find('.time').text().trim()
        const isBooked = $(el).hasClass('booked')
        return { movie, time, isBooked }
      }).get()

      showtimes[day] = dayShowtimes.filter(showtime => !showtime.isBooked)
    })

    return showtimes
  } catch (error) {
    console.error('Error scraping cinema:', error.message)
    throw error
  }
}
