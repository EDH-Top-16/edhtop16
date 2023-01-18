import React, { useState, useRef, useEffect } from "react";

export default function Searchbar() {
  const inputRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
    // @TODO need to get API endpoint that takes the current input and suggests results
    // fetch(`/api/suggestions?q=${event.target.value}`)
    //   .then((response) => response.json())
    //   .then((data) => setSuggestions(data.suggestions));
    setSuggestions(["Tymna", "Kraum / Tymna", "Thrasios / Tymna"]);
  };

  const handleClickOutside = (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return (
    <div className="text-lg w-full">
      <input
        className="bg-searchbar min-w-full border-0 rounded-xl px-2 w-3/12 outline-none"
        ref={inputRef}
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleChange}
      />
      {suggestions.length > 0 && (
        <ul className="absolute bg-white">
          {suggestions.map((suggestion) => (
            <li key={suggestion}>{suggestion}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
