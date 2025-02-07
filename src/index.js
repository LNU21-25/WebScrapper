import { scrapeLinks } from './scrapers/linkScraper.mjs'
import { scrapeCalendar } from './scrapers/calendarScraper.mjs'
import { scrapeCinema } from './scrapers/cinemaScraper.mjs'
import { scrapeRestaurant } from './scrapers/restaurantScraper.mjs'
import { analyzeAndRecommend } from './utils/analysisUtils.mjs'

/**
 * Main entry point for the application.
 * @param {string} startUrl - The starting URL for scraping.
 */
async function main (startUrl) {
  console.log('Scraping links...')
  const links = await scrapeLinks(startUrl)
  console.log('Scraping links...OK\n')

  console.log('Scraping available days...')
  const availableDays = await scrapeCalendar(links.calendar)
  console.log('Scraping available days...OK\n')

  console.log('Scraping showtimes...')
  const showtimes = await scrapeCinema(links.cinema)
  console.log('Scraping showtimes...OK\n')

  console.log('Scraping possible reservations...')
  const reservations = await scrapeRestaurant(links.restaurant)
  console.log('Scraping possible reservations...OK\n')

  console.log('\nRecommendations')
  console.log('===============')
  console.log(analyzeAndRecommend(availableDays, showtimes, reservations))
}

// Get the start URL from command line arguments
const startUrl = process.argv[2]
if (!startUrl) {
  console.error('Please provide a start URL.')
  process.exit(1)
}

main(startUrl).catch(console.error)
