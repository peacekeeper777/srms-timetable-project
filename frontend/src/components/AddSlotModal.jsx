export default function AddSlotModal({
  availableData = { teachers: [], rooms: [] },
  form = {},
  onChange,
  onClose,
  onSubmit,
}) {
  const teachers = availableData.teachers || [];
  const rooms = availableData.rooms || [];

  return (
    <div className="modal">
      <form className="modal-content" onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="teacher">Teacher</label>
          <select
            id="teacher"
            name="teacher"
            value={form.teacher || ""}
            onChange={onChange}
            className="form-control"
          >
            <option value="">Select Available Teacher</option>
            {teachers.map((teacher) => (
              <option key={teacher} value={teacher}>
                {teacher}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="room">Room</label>
          <select
            id="room"
            name="room"
            value={form.room || ""}
            onChange={onChange}
            className="form-control"
          >
            <option value="">Select Available Room</option>
            {rooms.map((room) => (
              <option key={room} value={room}>
                {room}
              </option>
            ))}
          </select>
        </div>

        <div className="modal-actions">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit">Save Slot</button>
        </div>
      </form>
    </div>
  );
}
