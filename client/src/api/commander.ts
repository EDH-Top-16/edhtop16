import { AxiosResponse } from "axios";
import { redirect } from "next/navigation";

import api from "./api";
import * as TFilters from "@/utils/types/filters";
import * as TCommanders from "@/utils/types/commanders";

export async function getCommanders(filters: TFilters.AllFiltersType) {
  // Validate the filters using schema
  const v = TFilters.schemas.allFilters.safeParse(filters);
  if (!v.success) throw new Error("Invalid filters");

  let res: AxiosResponse<TCommanders.CommandersType>;
  try {
    res = await api.post<TFilters.AllFiltersType>(
      "http://localhost:8000/api/commanders",
      filters,
      {},
      10000,
    );

    // Validate the response using schema
    // const v = TCommanders.schemas.commanders.safeParse(res.data);
    // if (!v.success) throw new Error("Invalid response");
  } catch (e) {
    // Do something with the error
  }

  return res;
}
