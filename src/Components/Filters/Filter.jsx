import "./Filter.css";

export default function Filter({ locations, value, onChange, onClear }) {
  return (
    <div className="job-filter">
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">All Locations</option>
        {locations.map((location) => (
          <option key={location} value={location}>
            {location}
          </option>
        ))}
      </select>

      <button type="button" onClick={onClear}>
        Clear
      </button>
    </div>
  );
}
