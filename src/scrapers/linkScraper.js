import axios from 'axios'
import cheerio from 'cheerio'

/**
 * Scrapes links to the calendar, cinema, and restaurant pages.
 * @param {string} startUrl - The starting URL.
 * @returns {object} - Links to the calendar, cinema, and restaurant pages.
 */
export async function scrapeLinks (startUrl) {
  const response = await axios.get(startUrl)
  const $ = cheerio.load(response.data)

  const calendarLink = $('a[href*="calendar"]').attr('href')
  const cinemaLink = $('a[href*="cinema"]').attr('href')
  const restaurantLink = $('a[href*="restaurant"]').attr('href')

  return {
    calendar: new URL(calendarLink, startUrl).toString(),
    cinema: new URL(cinemaLink, startUrl).toString(),
    restaurant: new URL(restaurantLink, startUrl).toString()
  }
}
