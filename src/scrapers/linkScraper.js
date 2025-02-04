import axios from 'axios'
import cheerio from 'cheerio'

/**
 * Scrapes links to the calendar, cinema, and restaurant pages.
 * @param {string} startUrl - The starting URL.
 * @returns {object} - Links to the calendar, cinema, and restaurant pages.
 */
export async function scrapeLinks (startUrl) {
  try {
    // Fetch the HTML content of the starting page
    const response = await axios.get(startUrl)
    const $ = cheerio.load(response.data)

    // Extract links using cheerio
    const calendarLink = $('a[href*="calendar"]').attr('href')
    const cinemaLink = $('a[href*="cinema"]').attr('href')
    const restaurantLink = $('a[href*="restaurant"]').attr('href')

    // Construct full URLs using the starting URL as the base
    return {
      calendar: new URL(calendarLink, startUrl).toString(),
      cinema: new URL(cinemaLink, startUrl).toString(),
      restaurant: new URL(restaurantLink, startUrl).toString()
    }
  } catch (error) {
    console.error('Error scraping links:', error.message)
    throw error
  }
}
