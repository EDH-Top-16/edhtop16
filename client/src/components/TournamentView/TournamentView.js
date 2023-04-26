import { useEffect, useMemo, useState } from "react";
import { createSearchParams, useNavigate, useParams } from "react-router-dom";
import { RxCaretSort, RxChevronDown } from "react-icons/rx";
import axios from "axios";

import Banner from "../Banner/Banner";
import Entry from "../Entry";
import { getTournaments, getCommanders, sortCommanders } from "../../data/Commanders";
import { defaultFormat } from "moment";
import moment from "moment";
import { compressObject, insertIntoObject } from "../../utils";

const TERMS = [
  {
    name: "Tournament Size",
    tag: "size",
    isTourneyFilter: true,
    cond: [
      { $gte: `is greater than (\u2265)`, type: "number" },
      { $eq: `is equal to (=)`, type: "number" },
      { $lte: `is less than (\u2264)`, type: "number" },
    ],
  },
  {
    name: "Tournament Date",
    tag: "dateCreated",
    isTourneyFilter: true,
    cond: [
      { $gte: `is after (\u2265)`, type: "date" },
      { $eq: `is (=)`, type: "date" },
      { $lte: `is before (\u2264)`, type: "date" },
    ],
  },
]

export default function TournamentView() {
  const defaultFilters = {tourney_filter: {
    size: { $gte: 64 },
    dateCreated: { $gte: moment().subtract(1, "year").unix() },
  },
};

  const loadFilters = useMemo(() => {
    const params = new URLSearchParams(window.location.search)

    let generated_filters = {
    }
    params.forEach((val, key) => {
      generated_filters = insertIntoObject(generated_filters, key.split('__'), val)
    })

    return Object.entries(generated_filters).length > 0 ? generated_filters : defaultFilters;
  }, [])

  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState(loadFilters);
  const [allFilters, setAllFilters] = useState(loadFilters);
  const [sort, setSort] = useState("dateCreated");
  const [toggled, setToggled] = useState(false);

  let params = useParams();

  function getFilters(data) {
    setFilters(data);
  }

  useEffect(() => {
    // console.log(filters, colors);
    let newFilters = {...filters}

    if (newFilters != allFilters) {
      setAllFilters(newFilters);


      navigate({
        search: `${createSearchParams(compressObject(newFilters))}`
      }, {replace: true})
    }
  }, [filters]);

  function getFilters(data) {
    setFilters(data);
  }

  useEffect(() => {
    getTournaments(allFilters.tourney_filter).then((data) =>{
      const sortedTournaments = sortCommanders(data, sort, toggled);
      setTournaments(sortedTournaments);
      setIsLoading(false);
      console.log("asdf", tournaments);
    });
  }, [allFilters]);

  useEffect(() => {
    const sortedTournaments = sortCommanders(tournaments, sort, toggled);
    setTournaments(sortedTournaments);
    setIsLoading(false);
    console.log("asdf", tournaments);
  }, [sort, toggled]);

  return (
    <div className="flex flex-col flex-grow overflow-auto">
      <Banner
      title={'View Tournaments'}
      enableFilters={true}
      getFilters={getFilters}
      allFilters={allFilters}
      defaultFilters={defaultFilters}
      terms={TERMS}
      enablecolors={false}
      backEnabled
    />

      <div className="w-11/12 ml-auto mr-0 h-screen flex flex-col justify-center items-center text-lightText dark:text-text">
        <h1 className="text-4xl font-bold text-center">Tournament View</h1>
        <p className="text-center text-2xl">
          This page is not yet implemented, but will be in the future!
        </p>
      </div>
    </div>
  );
}
