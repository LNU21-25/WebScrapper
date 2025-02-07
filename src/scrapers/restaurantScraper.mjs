import axios from 'axios'
import * as cheerio from 'cheerio'
import { CookieJar } from 'tough-cookie'
import { wrapper } from 'axios-cookiejar-support'

/**
 * Performs login to the restaurant website
 * @param {string} loginUrl - The URL to submit login credentials
 * @param {object} credentials - Login credentials
 * @param {object} client - Axios client with cookie jar support
 * @returns {object} - Object containing redirect URL and cookies
 */
async function login (loginUrl, credentials, client) {
  try {
    const loginForm = new URLSearchParams(credentials)

    const response = await client.post(loginUrl, loginForm, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      maxRedirects: 0,
      validateStatus: function (status) {
        return status >= 300 && status < 400 // Only accept redirect status codes
      }
    })

    // Extract redirect URL from location header
    const redirectUrl = response.headers.location

    // Get cookies from the response
    const cookies = response.headers['set-cookie']

    return { redirectUrl, cookies }
  } catch (error) {
    console.error('Login error:', error.message)
    throw error
  }
}

/**
 * Logs into the restaurant website and scrapes available booking times.
 * @param {string} restaurantUrl - The base URL of the restaurant website
 * @returns {object} - Object mapping day names to arrays of available booking slots
 */
export async function scrapeRestaurant (restaurantUrl) {
  try {
    // Setup axios with cookie jar support
    const jar = new CookieJar()
    const client = wrapper(axios.create({ jar }))

    // Load the initial page to get the login form details
    const initialResponse = await client.get(restaurantUrl)
    const $ = cheerio.load(initialResponse.data)

    // Find the login form action
    const loginFormAction = $('form').attr('action')
    const loginUrl = new URL(loginFormAction, restaurantUrl).toString()

    // Prepare login credentials
    const credentials = {
      username: 'zeke',
      password: 'coys'
    }

    // Perform login
    const { redirectUrl, cookies } = await login(loginUrl, credentials, client)

    // Construct full redirect URL
    const fullRedirectUrl = new URL(redirectUrl, restaurantUrl).toString()

    // If there's a redirect URL, follow it
    if (fullRedirectUrl) {
      await client.get(fullRedirectUrl, {
        headers: {
          Cookie: cookies
        }
      })
    }

    // Construct booking URL and fetch booking page
    const bookingUrl = new URL('login/booking', restaurantUrl).toString()

    const bookingResponse = await client.get(bookingUrl)

    // Load booking page HTML
    const $booking = cheerio.load(bookingResponse.data)

    // Mapping of three-letter day abbreviations to full day names
    const dayMapping = {
      fri: 'Friday',
      sat: 'Saturday',
      sun: 'Sunday',
      mon: 'Monday',
      tue: 'Tuesday',
      wed: 'Wednesday',
      thu: 'Thursday'
    }

    const openReservations = {}

    // Select all radio inputs these represent free booking options
    $booking('input[type="radio"]').each((i, el) => {
      const value = $booking(el).attr('value') // e.g., "fri1416"
      if (!value || value.length < 7) return

      // Ensure the slot is free
      const parentText = $booking(el).parent().text().trim().toLowerCase()
      if (!parentText.includes('free')) return

      // Extract the day abbreviation (first three letters) and map it
      const dayAbbrev = value.slice(0, 3).toLowerCase()
      const day = dayMapping[dayAbbrev] || dayAbbrev

      // Extract the start and end times
      const startTime = value.slice(3, 5)
      const endTime = value.slice(5, 7)
      const slot = `${startTime}-${endTime}`

      // Add the slot to the day in our openReservations object
      if (!openReservations[day]) {
        openReservations[day] = []
      }
      openReservations[day].push(slot)
    })

    return openReservations
  } catch (error) {
    console.error('Error scraping restaurant:', error.message)
    throw error
  }
}
