"use client";
import _ from "lodash";
import { useEffect, useContext } from "react";
import { getCommanders } from "@/api/commander";

import { enabledFilters, defaultFilters } from "@/constants/defaultFilters";
import { FilterContext } from "@/context/filter";

export default function CommandersPage(): {} {
  const { filters, setFilters, setEnabled } = useContext(FilterContext);

  useEffect(() => {
    // Set the default filters for the commanders view
    setEnabled(enabledFilters.commanders);
    setFilters(defaultFilters.commanders);
  }, []);

  // Fetch the commanders
  useEffect(() => {
    if (_.isEmpty(filters)) return; // If filters is empty, don't fetch

    (async () => {
      const res = await getCommanders(filters);
      return res?.data ?? {};
    })();
  }, [filters]);

  return (
    <table className="">
      <thead>
        <tr></tr>
      </thead>
      <tbody>
        <tr>
          <td>Commander</td>
        </tr>
      </tbody>
    </table>
  );
}
