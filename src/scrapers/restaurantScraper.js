import axios from 'axios'
import { CookieJar } from 'tough-cookie'
import { wrapper } from 'axios-cookiejar-support'

/**
 * Logs into the restaurant website and scrapes available booking times.
 * @param {string} restaurantUrl - The URL of the restaurant page.
 * @param {string[]} availableDays - Array of available days.
 * @returns {object} - Available booking times.
 */
export async function scrapeRestaurant (restaurantUrl, availableDays) {
  const jar = new CookieJar()
  const client = wrapper(axios.create({ jar }))

  // Log in
  await client.post(`${restaurantUrl}/login`, {
    username: 'zeke',
    password: 'coys'
  })

  // Scrape booking times
  const response = await client.get(`${restaurantUrl}/bookings`)
  const bookings = {} // Placeholder for parsed bookings

  // Logic to parse booking times for available days
  return bookings
}
