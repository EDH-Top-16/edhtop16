import React from "react";

import BaseFilter from "./base";
import FilterForm from "@/components/common/forms/filterForm";

export default function Standing(): React.ReactElement {
  return (
    <BaseFilter title={"Standings"} tag={"standing"}>
      {({ handleFilter }: any) => (
        <div className="">
          <FilterForm />
        </div>
      )}
    </BaseFilter>
  );
}
