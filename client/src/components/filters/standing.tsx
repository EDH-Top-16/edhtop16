import React from "react";

import BaseFilter from "./base";
import Select from "@/components/common/inputs/select";

export default function Standing(): React.ReactElement {
  return (
    <BaseFilter title={"Standings"} tag={"standing"}>
      {({ handleFilter }: any) => (
        <div className="">
          <Select name="standing" id="standing" onChange={handleFilter}>
            <option value="all">All</option>
            <option value="1">1st</option>
          </Select>
        </div>
      )}
    </BaseFilter>
  );
}
