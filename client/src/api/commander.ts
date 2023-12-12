import axios from "axios";
import { Commanders, CommandersType } from "../utils/types/commanders";
import { AllFilters, AllFiltersType } from "../utils/types/filters";

export async function getCommanders(
  filters: AllFiltersType,
): Promise<CommandersType> {
  // Validate the filters using schema
  const v = AllFilters.safeParse(filters);
  if (!v.success) throw new Error("Invalid filters");

  const res = await axios.post<AllFiltersType>(
    "http://localhost:8000/api/v2/commanders",
    filters,
    { timeout: 10000 },
  );

  // Validate the response using schema
  // const v = TCommanders.schemas.commanders.safeParse(res.data);
  // if (!v.success) throw new Error("Invalid response");

  return Commanders.parse(res.data);
}
