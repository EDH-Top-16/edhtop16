"use client";
import _ from "lodash";
import { useEffect, useContext, useState } from "react";
import { getCommanders } from "@/api/commander";

import { enabledFilters, defaultFilters } from "@/constants/defaultFilters";
import { FilterContext } from "@/context/filter";

export default function CommandersPage(): {} {
  // Get the filters from the context
  const { filters, setFilters, setEnabled } = useContext(FilterContext);

  // const [commanders, setCommanders] = useState<string[]>([]);

  // Set the default filters for the commanders view
  useEffect(() => {
    setEnabled(enabledFilters.commanders);
    setFilters(defaultFilters.commanders);
  }, []);

  // Fetch the commanders
  useEffect(() => {
    if (_.isEmpty(filters)) return; // If filters is empty, don't fetch

    (async () => {
      const res = await getCommanders(filters);
      console.log(filters, res?.data ?? {});
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
