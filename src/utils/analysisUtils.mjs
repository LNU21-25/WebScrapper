/**
 * Analyze available days and recommend movie and restaurant combinations
 * @param {Array} availableDays available days for all three people
 * @param {Array} showtimes showtimes for all movies
 * @param {Array} bookings bookings for all restaurants
 * @returns {Array} recommendations for all three people
 */
export function analyzeAndRecommend (availableDays, showtimes, bookings) {
  const recommendations = []

  const filteredShowtimes = showtimes.filter(combo =>
    combo.every(movie => availableDays.includes(movie.day))
  )

  for (const combo of filteredShowtimes) {
    if (new Set(combo.map(m => m.day)).size > 1) continue

    const day = combo[0].day
    const movieTimes = combo.map(m => m.time)
    const movieNames = combo.map(m => m.movie)
    for (const movieTime of movieTimes) {
      const movieHour = parseInt(movieTime.split(':')[0])

      // Find compatible restaurant slots
      const compatibleSlots = bookings[day].filter(slot => {
        const [start] = slot.split('-').map(Number)
        return start >= (movieHour + 2)
      })
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
