import { scrapeLinks } from './scrapers/linkScraper.js'
import { scrapeCalendar } from './scrapers/calendarScraper.js'
import { scrapeCinema } from './scrapers/cinemaScraper.js'
import { scrapeRestaurant } from './scrapers/restaurantScraper.js'
import { analyzeAndRecommend } from './utils/analysisUtils.js'

/**
 * Main entry point for the application.
 * @param {string} startUrl - The starting URL for scraping.
 */
async function main (startUrl) {
  console.log('Scraping links...')
  const links = await scrapeLinks(startUrl)
  console.log('Scraping links...OK')

  console.log('Scraping available days...')
  const availableDays = await scrapeCalendar(links.calendar)
  console.log('Scraping available days...OK')

  console.log('Scraping showtimes...')
  const showtimes = await scrapeCinema(links.cinema, availableDays)
  console.log('Scraping showtimes...OK')

  console.log('Scraping possible reservations...')
  const reservations = await scrapeRestaurant(links.restaurant, availableDays)
  console.log('Scraping possible reservations...OK')

  console.log('\nRecommendations')
  console.log('===============')
  analyzeAndRecommend(availableDays, showtimes, reservations)
}

// Get the start URL from command line arguments
const startUrl = process.argv[2]
if (!startUrl) {
  console.error('Please provide a start URL.')
  process.exit(1)
}

main(startUrl).catch(console.error)
