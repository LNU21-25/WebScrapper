import axios from 'axios'
import * as cheerio from 'cheerio'
import { CookieJar } from 'tough-cookie'
import { wrapper } from 'axios-cookiejar-support'

/**
 * Logs into the restaurant website and scrapes available booking times.
 * @param {string} restaurantUrl - The URL of the restaurant page.
 * @param {string[]} availableDays - Array of available days.
 * @returns {object} - Available booking times.
 */
export async function scrapeRestaurant (restaurantUrl, availableDays) {
  console.log('restaurantUrl:', restaurantUrl)
  try {
    const jar = new CookieJar()
    const client = wrapper(axios.create({ jar }))

    // Log in to the restaurant website
    console.log('Logging into the restaurant website...')
    await client.post(`${restaurantUrl}/login`, {
      username: 'zeke',
      password: 'coys'
    })

    // Fetch the bookings page
    console.log('Fetching bookings...')
    const response = await client.get(`${restaurantUrl}login/booking`)
    const $ = cheerio.load(response.data)

    const bookings = {}

    // Loop through available days and extract booking times
    availableDays.forEach(day => {
      const dayBookings = $(`div#${day.toLowerCase()} .booking`).map((i, el) => {
        const time = $(el).find('.time').text().trim()
        const isAvailable = !$(el).hasClass('booked')
        return { time, isAvailable }
      }).get()

      bookings[day] = dayBookings.filter(booking => booking.isAvailable)
    })

    return bookings
  } catch (error) {
    console.error('Error scraping restaurant:', error.message)
    throw error
  }
}
