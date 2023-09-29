import React from "react";
import Select from "@/components/common/inputs/select";

export default function FilterForm(): React.ReactElement {
  return (
    <form className="flex flex-col">
      <Select>
        <option value="name">Name</option>
        <option value="color">Color</option>
        <option value="type">Type</option>
        <option value="rarity">Rarity</option>
        <option value="set">Set</option>
      </Select>
    </form>
  );
}
