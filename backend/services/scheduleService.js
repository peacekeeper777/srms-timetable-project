const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const PERIODS = [1, 2, 3, 4, 5, 6];

/**
 * CSP-based timetable generator
 * Hard constraints:
 *  - No teacher double-booked in same slot
 *  - Teacher unavailable slots respected
 *  - Each subject gets exactly hoursPerWeek slots
 */
function generateTimetable(subjects, teachers) {
  const slots = [];
  const teacherBookings = {}; // teacherId -> Set of "Day-Period"
  const conflicts = [];

  // Init bookings tracker
  teachers.forEach((t) => {
    teacherBookings[t._id.toString()] = new Set(
      (t.unavailableSlots || []).map((s) => `${s.day}-${s.period}`)
    );
  });

  for (const subject of subjects) {
    const teacher = teachers.find(
      (t) => t._id.toString() === subject.teacher?.toString()
    );

    let assigned = 0;
    const needed = subject.hoursPerWeek || 3;

    for (const day of DAYS) {
      if (assigned >= needed) break;
      for (const period of PERIODS) {
        if (assigned >= needed) break;

        const slotKey = `${day}-${period}`;
        const teacherId = teacher?._id?.toString();

        // Check hard constraint: teacher not already booked here
        if (teacherId && teacherBookings[teacherId]?.has(slotKey)) {
          continue; // skip — conflict
        }

        // Assign slot
        slots.push({
          day,
          period,
          subject: subject.name,
          teacher: teacher?.name || "TBA",
          room: subject.requiresLab ? "Lab-1" : `Room-${period}0${assigned + 1}`,
        });

        if (teacherId) teacherBookings[teacherId].add(slotKey);
        assigned++;
      }
    }

    if (assigned < needed) {
      conflicts.push(
        `Could only assign ${assigned}/${needed} slots for ${subject.name} — teacher unavailability conflict`
      );
    }
  }

  return { slots, conflicts };
}

module.exports = { generateTimetable };