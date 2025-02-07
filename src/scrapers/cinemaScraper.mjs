import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * Scrapes all combinations of {day, movie, time} from the cinema page.
 * @param {string} cinemaUrl - The URL of the cinema page.
 * @returns {Array} - Array of objects containing {day, movie, time}.
 */
export async function scrapeCinema(cinemaUrl) {
  try {
    // Fetch the HTML content of the cinema page
    const response = await axios.get(cinemaUrl);
    const $ = cheerio.load(response.data);

    // Extract days and movies from the dropdowns
    const days = $('#day option')
      .map((i, el) => ({
        value: $(el).attr('value'),
        text: $(el).text().trim(),
      }))
      .get()
      .filter(day => day.value); // Remove disabled/placeholder options

    const movies = $('#movie option')
      .map((i, el) => ({
        value: $(el).attr('value'),
        text: $(el).text().trim(),
      }))
      .get()
      .filter(movie => movie.value && movie.text !== '--- Pick a Movie ---'); // Remove disabled/placeholder options

    // Array to store all combinations of {day, movie, time}
    const allCombinations = [];

    // Loop through each day and movie to get available times
    for (const day of days) {
      for (const movie of movies) {
        // Simulate the form submission to get available times
        const fullInfo = await getAvailableTimes(cinemaUrl, day, movie);
        if (fullInfo.length > 0) {
          allCombinations.push(fullInfo);
        }
      }
    }
    const combinations = allCombinations.map(dayGroup =>
      dayGroup.map(({ status, ...rest }) => rest)
    );
    return combinations;
  } catch (error) {
    console.error('Error scraping cinema:', error.message);
    throw error;
  }
}

/**
 * Simulates the form submission to get available times for a specific day and movie.
 * @param {string} cinemaUrl - The base URL of the cinema page.
 * @param {Object} day - The day object with value and text.
 * @param {Object} movie - The movie object with value and text.
 * @returns {Array} - Array of available times.
 */
async function getAvailableTimes(cinemaUrl, day, movie) {
  try {
    // Use axios to post form data
    const response = await axios.get(`${cinemaUrl}/check?day=${day.value}&movie=${movie.value}`);

    const ret = [];
    for (let i = 0; i < response.data.length; i++) {
      ret.push({
        day: day.text,
        movie: movie.text,
        time: response.data[i].time,
        status: response.data[i].status
      });
    }

    return ret.filter(ret => ret.status === 1);
  } catch (error) {
    console.error('Error fetching available times:', error.message);
    return [];
  }
}