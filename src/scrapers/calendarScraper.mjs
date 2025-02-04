import axios from 'axios'
import * as cheerio from 'cheerio'

/**
 * Scrapes the availability of Peter, Paul, and Mary.
 * @param {string} calendarUrl - The URL of the calendar page.
 * @returns {string[]} - Array of days when all three are available.
 */
export async function scrapeCalendar (calendarUrl) {
  try {
    // Fetch the HTML content of the calendar page
    const response = await axios.get(calendarUrl)
    const $ = cheerio.load(response.data)

    // Extract availability for each friend
    const peterAvailability = $('div#peter .day:contains("Available")').map((i, el) => $(el).text().trim()).get()
    const paulAvailability = $('div#paul .day:contains("Available")').map((i, el) => $(el).text().trim()).get()
    const maryAvailability = $('div#mary .day:contains("Available")').map((i, el) => $(el).text().trim()).get()

    // Find common available days
    const availableDays = peterAvailability.filter(day =>
      paulAvailability.includes(day) && maryAvailability.includes(day)
    )

    return availableDays
  } catch (error) {
    console.error('Error scraping calendar:', error.message)
    throw error
  }
}
