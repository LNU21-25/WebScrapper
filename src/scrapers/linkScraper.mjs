import axios from 'axios'
import * as cheerio from 'cheerio'
import { ensureTrailingSlash } from '../utils/linkUtils.mjs'

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
    let calendarLink = $('a[href*="calendar"]').attr('href')
    let cinemaLink = $('a[href*="cinema"]').attr('href')
    let restaurantLink = $('a[href*="dinner"]').attr('href')

    if (!calendarLink || !cinemaLink || !restaurantLink) {
      throw new Error('One or more required links are missing on the page.')
    }

    // Ensure proper formatting and resolve relative URLs
    calendarLink = new URL(ensureTrailingSlash(calendarLink), startUrl).toString()
    cinemaLink = new URL(ensureTrailingSlash(cinemaLink), startUrl).toString()
    restaurantLink = new URL(ensureTrailingSlash(restaurantLink), startUrl).toString()

    return { calendar: calendarLink, cinema: cinemaLink, restaurant: restaurantLink }
  } catch (error) {
    console.error('Error scraping links:', error.message)
    throw error
  }
}
