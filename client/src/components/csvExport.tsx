import { StreamParser } from "@json2csv/plainjs";
import { saveAs } from "file-saver";
import moment from "moment";
import { useCallback } from "react";
import { fetchQuery, graphql, useRelayEnvironment } from "react-relay";
import { csvExport_CommandersQuery } from "../queries/__generated__/csvExport_CommandersQuery.graphql";

const ExportCommandersQuery = graphql`
  query csvExport_CommandersQuery {
    commanders {
      name
      colorID
      wins
      winsSwiss
      winsBracket
      draws
      losses
      lossesSwiss
      lossesBracket
      count
      winRate
      winRateSwiss
      winRateBracket
      topCuts
      conversionRate
      colorID
    }
  }
`;

export function ExportCSVButton() {
  const env = useRelayEnvironment();
  const downloadDecksAsCsv = useCallback(() => {
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

    fetchQuery<csvExport_CommandersQuery>(
      env,
      ExportCommandersQuery,
      {},
    ).subscribe({
      next: ({ commanders }) => {
        for (const row of commanders) parser.pushLine(row);
        parser.end();
      },
    });
  }, [env]);

  return (
    <button className="filter-btn" onClick={() => downloadDecksAsCsv()}>
      Export to CSV
    </button>
  );
}
