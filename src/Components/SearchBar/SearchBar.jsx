import "./SearchBar.css";

export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by job title or company name"
      />
    </div>
  );
}
