import api from "./api";
import { FiltersType } from "@/constants/allFilters";

export async function getCommanders(filters: FiltersType) {
  try {
    const res = await api.post<FiltersType>(
      "http://localhost:5000/api/req",
      filters,
    );
    return res;
  } catch (e) {
    console.log(e);
  }
}
