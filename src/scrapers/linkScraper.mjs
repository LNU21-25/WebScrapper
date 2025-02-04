import axios from 'axios'
import * as cheerio from 'cheerio'

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
    console.log('calendarLink:', calendarLink)
    const cinemaLink = $('a[href*="cinema"]').attr('href')
    console.log('cinemaLink:', cinemaLink)
    const restaurantLink = $('a[href*="restaurant"]').attr('href')
    console.log('restaurantLink:', restaurantLink)

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
