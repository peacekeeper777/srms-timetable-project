export default function SlotCell({ existingData, onAssign }) {
  return (
    <div className={`p-4 border min-h-[100px] ${existingData ? "bg-blue-50" : "bg-white hover:bg-gray-50"}`}>
      {existingData ? (
        <div>
          <h4 className="font-bold text-blue-800">{existingData.subject}</h4>
          <p className="text-xs text-gray-600">
            {existingData.teacher} | {existingData.room}
          </p>
        </div>
      ) : (
        <button type="button" className="text-gray-300 text-sm hover:text-blue-500" onClick={onAssign}>
          + Assign
        </button>
      )}
    </div>
  );
}
