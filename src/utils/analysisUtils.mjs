/**
 * Analyze available days and recommend movie and restaurant combinations
 * @param {Array} availableDays available days for all three people
 * @param {Array} showtimes showtimes for all movies
 * @param {Array} bookings bookings for all restaurants
 * @returns {Array} recommendations for all three people
 */
export function analyzeAndRecommend (availableDays, showtimes, bookings) {
  const recommendations = []

  // Filter showtimes to only include common available days
  const filteredShowtimes = showtimes.filter(combo =>
    combo.every(movie => availableDays.includes(movie.day))
  )

  // Iterate through each showtime combination
  for (const combo of filteredShowtimes) {
    // Skip combinations with multiple movies on different days
    if (new Set(combo.map(m => m.day)).size > 1) continue

    const day = combo[0].day

    // Find movie times in the combination
    const movieTimes = combo.map(m => m.time)
    const movieNames = combo.map(m => m.movie)

    // Check for compatible restaurant reservations
    for (const movieTime of movieTimes) {
      const movieHour = parseInt(movieTime.split(':')[0])

      // Find compatible restaurant slots (minimum 2 hours after movie start)
      const compatibleSlots = bookings[day].filter(slot => {
        const [start] = slot.split('-').map(Number)

        // Check if slot starts at least 2 hours after movie
        return start >= (movieHour + 2)
      })

      // If compatible slots exist, create recommendation
      if (compatibleSlots.length > 0) {
        const slotToUse = compatibleSlots[0]
        recommendations.push(
          `On ${day} the movie "${movieNames[movieTimes.indexOf(movieTime)]}" starts at ${movieTime} and there is a free table between ${slotToUse.replace('-', ':')}.`
        )
      }
    }
  }

  return recommendations
}
