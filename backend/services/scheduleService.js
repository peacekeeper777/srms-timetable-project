const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const PERIODS = [1, 2, 3, 4, 5, 6];

function generateTimetable(subjects, teachers) {
  const slots = [];
  const teacherBookings = {};
  const classBookings = new Set();
  const conflicts = [];

  teachers.forEach((teacher) => {
    teacherBookings[teacher._id.toString()] = new Set(
      (teacher.unavailableSlots || []).map((slot) => `${slot.day}-${slot.period}`)
    );
  });

  for (const subject of subjects) {
    const teacher = teachers.find((teacherItem) => {
      if (subject.teacher && teacherItem._id.toString() === subject.teacher?.toString()) return true;
      return subject.teacherName && teacherItem.name?.toLowerCase() === subject.teacherName.toLowerCase();
    });

    let assigned = 0;
    const needed = subject.hoursPerWeek || 3;

    for (const day of DAYS) {
      if (assigned >= needed) break;

      for (const period of PERIODS) {
        if (assigned >= needed) break;

        const slotKey = `${day}-${period}`;
        const teacherId = teacher?._id?.toString();

        if (classBookings.has(slotKey)) continue;
        if (teacherId && teacherBookings[teacherId]?.has(slotKey)) continue;

        slots.push({
          day,
          period,
          subject: subject.name,
          teacher: teacher?.name || subject.teacherName || "TBA",
          room: subject.requiresLab ? "Lab-1" : `Room-${period}0${assigned + 1}`,
        });

        if (teacherId) teacherBookings[teacherId].add(slotKey);
        classBookings.add(slotKey);
        assigned++;
      }
    }

    if (assigned < needed) {
      conflicts.push(
        `Could only assign ${assigned}/${needed} slots for ${subject.name}. Add more free periods or reduce weekly hours.`
      );
    }
  }

  return { slots, conflicts };
}

module.exports = { generateTimetable };
