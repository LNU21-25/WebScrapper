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

    // Extract redirect URL
    const redirectUrl = response.headers.location

    // Get cookies
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
    const jar = new CookieJar()
    const client = wrapper(axios.create({ jar }))

    // Load the initial page
    const initialResponse = await client.get(restaurantUrl)
    const $ = cheerio.load(initialResponse.data)

    // Find the login form
    const loginFormAction = $('form').attr('action')
    const loginUrl = new URL(loginFormAction, restaurantUrl).toString()
    const credentials = {
      username: 'zeke',
      password: 'coys'
    }

    // login
    const { redirectUrl, cookies } = await login(loginUrl, credentials, client)

    // redirect URL
    const fullRedirectUrl = new URL(redirectUrl, restaurantUrl).toString()

    if (fullRedirectUrl) {
      await client.get(fullRedirectUrl, {
        headers: {
          Cookie: cookies
        }
      })
    }
    const bookingUrl = new URL('login/booking', restaurantUrl).toString()

    const bookingResponse = await client.get(bookingUrl)

    const $booking = cheerio.load(bookingResponse.data)

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

    // Select all radio inputs
    $booking('input[type="radio"]').each((i, el) => {
      const value = $booking(el).attr('value')
      if (!value || value.length < 7) return
      const parentText = $booking(el).parent().text().trim().toLowerCase()
      if (!parentText.includes('free')) return
      // Extract the day abbreviation
      const dayAbbrev = value.slice(0, 3).toLowerCase()
      const day = dayMapping[dayAbbrev] || dayAbbrev
      // Extract start and end
      const startTime = value.slice(3, 5)
      const endTime = value.slice(5, 7)
      const slot = `${startTime}-${endTime}`
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
