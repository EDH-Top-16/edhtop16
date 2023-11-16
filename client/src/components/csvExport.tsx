import React, { useContext } from "react";
import { StreamParser } from "@json2csv/plainjs";
import { saveAs } from "file-saver";
import moment from "moment";
import { FilterContext } from "../context/filter";
import { AllFiltersType } from "../utils/types/filters";
import { getCommanders } from "../api/commander";

const ExportCSVButton = (): JSX.Element => {
  const { filters } = useContext(FilterContext);

  return (
    <button className="filter-btn" onClick={() => downloadDecksAsCsv(filters)}>
      Export to CSV
    </button>
  );
};

const downloadDecksAsCsv = async (filters: AllFiltersType) => {
  const opts = {};
  const asyncOpts = {};
  const parser = new StreamParser(opts, asyncOpts);

  let csv = "";
  parser.onData = (chunk) => (csv += chunk.toString());
  parser.onEnd = () => {
    const blob = new Blob([csv], { type: "text/csv" });
    saveAs(
      blob,
      `edhtop16-export-${moment().format("YYYY-MM-DD_HH-mm-ss")}.csv`,
    );
  };
  parser.onError = (err) => console.error(err);

  const commanders = getCommanders(filters).then((data) => {
    Object.entries(data).forEach(([key, value]) => {
      parser.pushLine({ name: key, ...value });
    });

    parser.end();
  });
};

export default ExportCSVButton;
