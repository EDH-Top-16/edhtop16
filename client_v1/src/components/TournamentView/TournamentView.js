import { useEffect, useMemo, useState } from "react";
import { createSearchParams, useNavigate} from "react-router-dom";
import { RxCaretSort, RxChevronDown } from "react-icons/rx";

import Banner from "../Banner/Banner";
import Entry from "../Entry";
import { getTournaments, sortEntries } from "../../data/Commanders";
import moment from "moment";
import { compressObject, insertIntoObject, toDate } from "../../utils";


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
  {
  name: "Swiss Rounds",
  tag: "swissNum",
  isTourneyFilter: true,
  cond: [
    { $gte: `is greater than (\u2265)`, type: "number" },
    { $eq: `is equal to (=)`, type: "number" },
    { $lte: `is less than (\u2264)`, type: "number" },
  ],
  }
]
/**
 * Takes no params, @returns tournaments
 */
export default function TournamentView() {
  const defaultFilters = {
    tourney_filter: {
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

  function getFilters(data) {
    setFilters(data);
  }

  useEffect(() => {
    let newFilters = { ...filters }

    if (newFilters !== allFilters) {
      setAllFilters(newFilters);


      navigate({
        search: `${createSearchParams(compressObject(newFilters))}`
      }, { replace: true })
    }
  }, [filters]);

  function getFilters(data) {
    setFilters(data);
  }

  /**
 * Changes the sort order
 */
  function handleSort(x) {
    // console.log("sort", x);
    setSort(x);
    if (x === sort) {
      setToggled(!toggled);
    }
  }

  useEffect(() => {
    // Deep copy b/c useState needs a new object
    const tournaments_copy = JSON.parse(JSON.stringify(tournaments));
    const sortedTournaments = sortEntries(tournaments_copy, sort, toggled);
    setTournaments(sortedTournaments);
    setIsLoading(false);
  }
  , [sort, toggled]);

  useEffect(() => {
    getTournaments(allFilters.tourney_filter).then((data) =>{
      const sortedTournaments = sortEntries(data, sort, toggled);
      setTournaments(sortedTournaments);
      setIsLoading(false);
    });
  }, [allFilters]);

  useEffect(() => {
    // console.log("Tournaments Updated", tournaments);
  }, [tournaments]);

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

      <table className="mx-2 md:mx-6 my-2 border-spacing-y-3 border-separate">
        <thead className="hidden md:table-row-group [&>tr>td>p]:cursor-pointer [&>tr>td]:px-4">
          <tr className="text-subtext dark:text-white text-lg ">
            <td className="font-bold">#</td>
            <td>
              <p
                onClick={() => handleSort("tournamentName")}

                className="flex flex-row items-center gap-1 font-bold"
              >
                Name

                {sort === "tournamentName" ? (
                  <RxChevronDown
                    className={`${toggled ? "" : "rotate-180"
                      } transition-all duration-200k`}
                  />
                ) : (
                  <RxCaretSort
                    className={`text-lightText dark:text-text transition-all duration-200k`}
                  />
                )}
              </p>
            </td>
            <td>
              <p
                onClick={() => handleSort("size")}

                className="flex flex-row items-center gap-1 font-bold"
              >
                Size

                {sort === "size" ? (
                  <RxChevronDown
                    className={`${toggled ? "" : "rotate-180"
                      } transition-all duration-200k`}
                  />
                ) : (
                  <RxCaretSort
                    className={`text-lightText dark:text-text transition-all duration-200k`}
                  />
                )}
              </p>
            </td>
            <td>
              <p
                onClick={() => handleSort("dateCreated")}

                className="flex flex-row items-center gap-1 font-bold"
              >
                Date

                {sort === "dateCreated" ? (
                  <RxChevronDown
                    className={`${toggled ? "" : "rotate-180"
                      } transition-all duration-200k`}
                  />
                ) : (
                  <RxCaretSort
                    className={`text-lightText dark:text-text transition-all duration-200k`}
                  />
                )}
              </p>



            </td>
          </tr>
        </thead>
        <tbody className="[&>tr>td>p]:cursor-pointer [&>tr>td]:px-4 md:[&>tr>td]:px-4 [&>tr]:my-3 ">
          {isLoading ? (
            <tr className="text-text text-lg">Loading...</tr>
          ) : (
            tournaments && tournaments.length === 0 ? <div className="w-full flex justify-center items-center text-accent dark:text-text font-bold text-2xl">No data available</div> :
              tournaments.map((tournament, i) => (
                <Entry
                  enableLink
                  slug={"/tournament/" + tournament.TID}
                  rank={i + 1}
                  name={tournament.tournamentName}
                  metadata={[
                    tournament.size,
                    moment(toDate(tournament.dateCreated)).format("MMM D YYYY"),
                  ]}
                  metadata_fields={['size', 'dateCreated']}
                  filters={allFilters}
                />
              ))
          )}
        </tbody>
      </table>
    </div>
  );
}
