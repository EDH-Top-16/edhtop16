import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

import { getCommanderNames, filterNames } from "../../data/Commanders";

/**
 * @TODO make fuzzy search mechanism
 */
export default function Searchbar() {
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (searchTerm !== "") {
      getCommanderNames().then((data) => {
        var filtered = filterNames(data, searchTerm);
        setSuggestions(filtered);
        // setIsLoading(false);
      });
    }
  }, [searchTerm]);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleClickOutside = (event) => {
    if (
      !suggestionsRef.current?.contains(event.target) &&
      !inputRef.current?.contains(event.target)
    ) {
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
    <div className="text-lg w-full md:w-1/3 z-10 relative grow">
      <input
        className={`bg-searchbar border-0 rounded-xl ${document.activeElement === inputRef.current && suggestions.length > 0 ? "rounded-b-none" : ""} py-2 px-4 w-full outline-none transition-all duration-200`}
        ref={inputRef}
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleChange}
      />
      {document.activeElement === inputRef.current ? (
        suggestions.length > 0 && (
          <ul ref={suggestionsRef} className="absolute dark:bg-searchbar bg-nav rounded-b-xl w-full">
            {suggestions.slice(0, 20).map((suggestion) => (
              <Link to={`/commander/${suggestion.replaceAll("/", "+")}`}>
                <li
                  className="px-2 py-1 hover:bg-select dark:text-gray text-white"
                  key={suggestion}
                >
                  {suggestion}
                </li>
              </Link>
            ))}
          </ul>
        )
      ) : (
        <></>
      )}
    </div>
  );
}
