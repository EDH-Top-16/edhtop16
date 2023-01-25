import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {getCommanderNames} from "../../data/Commanders";

export default function Searchbar() {
  const inputRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    getCommanderNames().then((data) => {
      // console.log("Data:", data);
      setSuggestions(data);
      // setIsLoading(false);
    });
  }, []);
  console.log("asdf", suggestions);
  const handleChange = (event) => {
    setSearchTerm(event.target.value);
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
      {/* {suggestions.length > 0 && (
        <ul className="absolute bg-white">
          {suggestions.map((suggestion) => (
            <li key={suggestion}>{suggestion}</li>
          ))}
        </ul>
      )} */}
    </div>
  );
}
