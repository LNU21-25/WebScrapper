/**
 * Analyzes scraped data and generates recommendations.
 * @param {string[]} availableDays - Array of available days.
 * @param {Object} showtimes - Movie showtimes for available days.
 * @param {Object} bookings - Restaurant bookings for available days.
 */
export function analyzeAndRecommend(availableDays, showtimes, bookings) {
  // If no available days, notify the user and exit
  if (availableDays.length === 0) {
    console.log('No days are available for all three friends.');
    return;
  }

  // Loop through each available day
  availableDays.forEach(day => {
    const dayShowtimes = showtimes[day] || [];
    const dayBookings = bookings[day] || [];

    // Loop through each movie showtime for the day
    dayShowtimes.forEach(movie => {
      const movieTime = parseTime(movie.time);

      // Loop through each restaurant booking for the day
      dayBookings.forEach(booking => {
        const bookingTime = parseTime(booking.time);

        // Check if the booking is at least 2 hours after the movie
        if (bookingTime - movieTime >= 2 * 60 * 60 * 1000) {
          console.log(
            `* On ${day} the movie "${movie.movie}" starts at ${movie.time} and there is a free table between ${booking.time}-${booking.time + 2}.`
          );
        }
      });
    });
  });
}

/**
 * Parses a time string (e.g., "18:00") into a timestamp.
 * @param {string} timeStr - The time string to parse.
 * @returns {number} - The timestamp in milliseconds.
 */
function parseTime(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0); // Set time to the specified hours and minutes
  return date.getTime(); // Return timestamp in milliseconds
}