import axios from 'axios'
import * as cheerio from 'cheerio'

/**
 * Scrapes the availability of Peter, Paul, and Mary.
 * @param {string} calendarUrl - The URL of the calendar page.
 * @returns {string[]} - Array of days when all three are available.
 */
export async function scrapeCalendar(calendarUrl) {
  console.log('calendarUrl:', calendarUrl)
  try {
    // Fetch the HTML content of the calendar page
    const response = await axios.get(calendarUrl)
    const $ = cheerio.load(response.data)

    // Extract availability for each friend
    const peterAvailability = getAvailability($, 'peter.html')

    console.log('Peter:', peterAvailability)
    const paulAvailability = getAvailability($, 'paul.html')
    console.log('Paul:', paulAvailability)
    const maryAvailability = getAvailability($, 'mary.html')
    console.log('Mary:', maryAvailability)

    // Find common available days
    const availableDays = peterAvailability.filter(day =>
      paulAvailability.includes(day) && maryAvailability.includes(day)
    )

    console.log('Available days:', availableDays)

    return availableDays
  } catch (error) {
    console.error('Error scraping calendar:', error.message)
    throw error
  }

  function getAvailability($, name) {
    const days = $('table thead th').map((_, el) => $(el).text().trim()).get();
    const statuses = $(`div#${name} table tbody tr td`) // Select only within this person's section
      .map((_, el) => $(el).text().trim().toLowerCase())
      .get();

    console.log(`${name} days:`, days); // Debugging
    console.log(`${name} statuses:`, statuses); // Debugging

    return days.filter((_, i) => statuses[i] === 'ok');
  }
}


