import axios from 'axios'
import cheerio from 'cheerio'

/**
 * Scrapes the availability of Peter, Paul, and Mary.
 * @param {string} calendarUrl - The URL of the calendar page.
 * @returns {string[]} - Array of days when all three are available.
 */
export async function scrapeCalendar (calendarUrl) {
  const response = await axios.get(calendarUrl)
  const $ = cheerio.load(response.data)

  // Logic to determine common available days
  // (Example: Check for days marked as "available" for all three friends)
  const availableDays = ['Friday', 'Saturday', 'Sunday'] // Placeholder

  return availableDays
}
