import axios from 'axios'
import * as cheerio from 'cheerio'

/**
 * Scrapes the availability of Peter, Paul, and Mary.
 * @param {string} calendarUrl - The URL of the calendar page.
 * @returns {string[]} - Array of days when all three are available.
 */
export async function scrapeCalendar (calendarUrl) {
  try {
    // Fetch calendar page
    const response = await axios.get(calendarUrl)
    const $ = cheerio.load(response.data)

    // find links that represent availability pages
    const peopleLinks = $('a')
      .map((_, el) => $(el).attr('href'))
      .get()
      .filter(href => href)
      .map(href => new URL(href, calendarUrl).toString())

    const availabilityData = {}

    for (const personLink of peopleLinks) {
      try {
        const availability = await getAvailability(personLink)

        const personIdentifier = personLink.split('/').pop().split('.')[0]

        availabilityData[personIdentifier] = availability
      } catch (error) {
        console.error(`Error processing link ${personLink}:`, error.message)
      }
    }

    // Find common available days
    const availableDays = Object.values(availabilityData)
      .reduce((common, current) =>
        common.filter(day => current.includes(day))
      )

    return availableDays
  } catch (error) {
    console.error('Error scraping calendar:', error.message)
    throw error
  }
}

/**
 * Fetches and extracts availability for a specific person.
 * @param {string} personUrl - The URL of the person's availability page.
 * @returns {string[]} - Array of available days.
 */
async function getAvailability (personUrl) {
  try {
    const response = await axios.get(personUrl)
    const $ = cheerio.load(response.data)

    // Extract days from table header
    const days = $('table thead th')
      .map((_, el) => $(el).text().trim())
      .get()

    // Extract availability statuses
    const statuses = $('table tbody tr td')
      .map((_, el) => $(el).text().trim().toLowerCase())
      .get()

    if (days.length !== statuses.length) {
      console.warn(`Warning: Days and statuses count mismatch in ${personUrl}`)
    }

    // Return days where status is "ok"
    const availableDays = days.filter((_, i) => statuses[i] === 'ok')

    return availableDays
  } catch (error) {
    console.error(`Error fetching availability for ${personUrl}:`, error.message)
    return []
  }
}
