import axios from 'axios'
import * as cheerio from 'cheerio'

/**
 * Scrapes the availability of Peter, Paul, and Mary.
 * @param {string} calendarUrl - The URL of the calendar page.
 * @returns {string[]} - Array of days when all three are available.
 */
export async function scrapeCalendar(calendarUrl) {
  console.log('Starting calendar scraping at:', calendarUrl);
  try {
    // Fetch the main calendar page to determine links to individual availability pages
    const response = await axios.get(calendarUrl);
    console.log('Fetched calendar page successfully.');

    const $ = cheerio.load(response.data);

    // Determine the links for each person's availability page
    const people = ['peter', 'paul', 'mary'];
    const availabilityData = {};

    for (const person of people) {
      const personLink = new URL(`${person}.html`, calendarUrl).toString();
      console.log(`\nFetching availability for ${person} at:`, personLink);

      availabilityData[person] = await getAvailability(personLink);
      console.log(`${person} Availability:`, availabilityData[person]);
    }

    // Find common available days
    const { peter, paul, mary } = availabilityData;
    const availableDays = peter.filter(day => paul.includes(day) && mary.includes(day));

    console.log('\nCommon Available Days:', availableDays);

    return availableDays;
  } catch (error) {
    console.error('Error scraping calendar:', error.message);
    throw error;
  }
}

/**
 * Fetches and extracts availability for a specific person.
 * @param {string} personUrl - The URL of the person's availability page.
 * @returns {string[]} - Array of available days.
 */
async function getAvailability(personUrl) {
  try {
    const response = await axios.get(personUrl);
    const $ = cheerio.load(response.data);

    // Extract days from table header
    const days = $('table thead th')
      .map((_, el) => $(el).text().trim())
      .get();

    console.log(`Days found:`, days);

    // Extract availability statuses
    const statuses = $('table tbody tr td')
      .map((_, el) => $(el).text().trim().toLowerCase())
      .get();

    console.log(`Statuses found:`, statuses);

    if (days.length !== statuses.length) {
      console.warn(`Warning: Days and statuses count mismatch in ${personUrl}`);
    }

    // Return days where status is "ok" (case-insensitive)
    const availableDays = days.filter((_, i) => statuses[i] === 'ok');

    console.log(`Availability:`, availableDays);
    return availableDays;
  } catch (error) {
    console.error(`Error fetching availability for ${personUrl}:`, error.message);
    return [];
  }
}
