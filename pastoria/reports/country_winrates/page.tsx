import {page_CountryWinRatesQuery} from '#genfiles/queries/page_CountryWinRatesQuery.graphql';
import {LoadingIcon} from '#src/components/fallback';
import {Footer} from '#src/components/footer';
import {Navigation} from '#src/components/navigation';
import {formatPercent} from '#src/lib/client/format';
import {scaleSequential} from 'd3-scale';
import {interpolateYlOrRd} from 'd3-scale-chromatic';
import {Suspense, useMemo, useState} from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps';
import {graphql, PreloadedQuery, usePreloadedQuery} from 'react-relay/hooks';

const GEO_URL =
  'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// Map Natural Earth TopoJSON names → country-coder full English names
const TOPO_NAME_OVERRIDES: Record<string, string> = {
  'Dem. Rep. Congo': 'Democratic Republic of the Congo',
  'Central African Rep.': 'Central African Republic',
  'S. Sudan': 'South Sudan',
  'Dominican Rep.': 'Dominican Republic',
  'Solomon Is.': 'Solomon Islands',
  'W. Sahara': 'Western Sahara',
  'Fr. S. Antarctic Lands': 'French Southern Territories',
  'Falkland Is.': 'Falkland Islands',
  'Eq. Guinea': 'Equatorial Guinea',
  eSwatini: 'Eswatini',
  'Bosnia and Herz.': 'Bosnia and Herzegovina',
  'Czech Rep.': 'Czechia',
  'N. Cyprus': 'Northern Cyprus',
  'S. Korea': 'South Korea',
  'N. Korea': 'North Korea',
  Somaliland: 'Somalia',
  'N. Macedonia': 'North Macedonia',
  'Marshall Is.': 'Marshall Islands',
};

function resolveTopoName(topoName: string): string {
  return TOPO_NAME_OVERRIDES[topoName] ?? topoName;
}

type CountryRow = {
  country: string;
  tournaments: number;
  seatWinRate1: number;
  seatWinRate2: number;
  seatWinRate3: number;
  seatWinRate4: number;
  drawRate: number;
};

type SortColumn =
  | 'country'
  | 'tournaments'
  | 'seatWinRate1'
  | 'seatWinRate2'
  | 'seatWinRate3'
  | 'seatWinRate4'
  | 'drawRate';

type SortDir = 'asc' | 'desc';

export type Queries = {
  countryWinRatesQueryRef: page_CountryWinRatesQuery;
};

export default function CountryWinRatesPageShell({
  queries,
}: PastoriaPageProps<'/reports/country_winrates'>) {
  return (
    <>
      <title>Country Win Rates — cEDH</title>
      <meta
        name="description"
        content="See how seat position win rates vary by country in competitive EDH tournaments."
      />
      <Navigation searchType="tournament" />

      <div className="mx-auto mt-8 w-full max-w-(--breakpoint-xl) px-6">
        <div className="mb-6">
          <h1 className="font-title text-4xl font-extrabold text-white md:text-5xl">
            Country Win Rates
          </h1>
          <p className="mt-2 text-white/60">
            Seat position win rates and draw rates by country, based on
            tournament match data.
          </p>
        </div>

        <Suspense fallback={<LoadingIcon />}>
          <CountryWinRatesPage
            countryWinRatesQueryRef={queries.countryWinRatesQueryRef}
          />
        </Suspense>
      </div>
    </>
  );
}

function CountryWinRatesPage({
  countryWinRatesQueryRef,
}: {
  countryWinRatesQueryRef: PreloadedQuery<page_CountryWinRatesQuery>;
}) {
  const data = usePreloadedQuery(
    graphql`
      query page_CountryWinRatesQuery($minTournaments: Int) @preloadable {
        countrySeatWinRates(minTournaments: $minTournaments) {
          country
          tournaments
          seatWinRate1
          seatWinRate2
          seatWinRate3
          seatWinRate4
          drawRate
        }
      }
    `,
    countryWinRatesQueryRef,
  );

  const rows = useMemo(
    () =>
      (data.countrySeatWinRates ?? []).flatMap((row): CountryRow[] => {
        if (
          row.country == null ||
          row.tournaments == null ||
          row.seatWinRate1 == null ||
          row.seatWinRate2 == null ||
          row.seatWinRate3 == null ||
          row.seatWinRate4 == null ||
          row.drawRate == null
        )
          return [];
        return [
          {
            country: row.country,
            tournaments: row.tournaments,
            seatWinRate1: row.seatWinRate1,
            seatWinRate2: row.seatWinRate2,
            seatWinRate3: row.seatWinRate3,
            seatWinRate4: row.seatWinRate4,
            drawRate: row.drawRate,
          },
        ];
      }),
    [data.countrySeatWinRates],
  );
  const dataByCountry = useMemo(() => {
    const map = new Map<string, CountryRow>();
    for (const row of rows) {
      map.set(row.country, row);
    }
    return map;
  }, [rows]);

  return (
    <>
      <ChoroplethMap dataByCountry={dataByCountry} />
      <CountryTable rows={rows} />
      <Footer />
    </>
  );
}

function useColorScale(rows: Iterable<CountryRow>) {
  return useMemo(() => {
    const values: number[] = [];
    for (const row of rows) {
      values.push(row.drawRate);
    }
    if (values.length === 0) return {scale: () => '#1a1a2e', min: 0, max: 0};

    const min = Math.min(...values);
    const max = Math.max(...values);
    const scale = scaleSequential(interpolateYlOrRd).domain([min, max]);
    return {scale, min, max};
  }, [rows]);
}

function ChoroplethMap({
  dataByCountry,
}: {
  dataByCountry: Map<string, CountryRow>;
}) {
  const {scale, min, max} = useColorScale(dataByCountry.values());
  const [tooltip, setTooltip] = useState<{
    name: string;
    row: CountryRow | null;
    x: number;
    y: number;
  } | null>(null);

  return (
    <div className="relative mb-8 overflow-hidden rounded-xl bg-black/30 p-4">
      <ComposableMap
        projection="geoNaturalEarth1"
        projectionConfig={{scale: 160}}
        width={960}
        height={500}
        style={{width: '100%', height: 'auto'}}
      >
        <ZoomableGroup>
          <Geographies geography={GEO_URL}>
            {({geographies}) =>
              geographies.map((geo) => {
                const topoName: string =
                  geo.properties.name ?? geo.properties.NAME ?? '';
                const countryName = resolveTopoName(topoName);
                const row = dataByCountry.get(countryName);
                const fillColor = row ? scale(row.drawRate) : '#1a1a2e';

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fillColor as string}
                    stroke="#0d0d1a"
                    strokeWidth={0.5}
                    style={{
                      default: {outline: 'none'},
                      hover: {outline: 'none', opacity: 0.85},
                      pressed: {outline: 'none'},
                    }}
                    onMouseEnter={(e) => {
                      setTooltip({
                        name: countryName,
                        row: row ?? null,
                        x: e.clientX,
                        y: e.clientY,
                      });
                    }}
                    onMouseMove={(e) => {
                      setTooltip((prev) =>
                        prev ? {...prev, x: e.clientX, y: e.clientY} : null,
                      );
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {tooltip && (
        <div
          className="pointer-events-none fixed z-50 rounded bg-black/90 px-3 py-2 text-sm text-white shadow-lg"
          style={{left: tooltip.x + 12, top: tooltip.y - 28}}
        >
          <div className="font-semibold">{tooltip.name}</div>
          {tooltip.row ? (
            <div className="mt-1 space-y-0.5 text-white/70">
              <div>{tooltip.row.tournaments} tournaments</div>
              <div>Seat 1 WR: {formatPercent(tooltip.row.seatWinRate1)}</div>
              <div>Seat 2 WR: {formatPercent(tooltip.row.seatWinRate2)}</div>
              <div>Seat 3 WR: {formatPercent(tooltip.row.seatWinRate3)}</div>
              <div>Seat 4 WR: {formatPercent(tooltip.row.seatWinRate4)}</div>
              <div>Draw Rate: {formatPercent(tooltip.row.drawRate)}</div>
            </div>
          ) : (
            <div className="text-white/70">No data</div>
          )}
        </div>
      )}

      <ColorLegend min={min} max={max} scale={scale} />
    </div>
  );
}

function ColorLegend({
  min,
  max,
  scale,
}: {
  min: number;
  max: number;
  scale: (n: number) => string;
}) {
  const stops = 10;
  const gradient = useMemo(() => {
    const colors: string[] = [];
    for (let i = 0; i <= stops; i++) {
      const t = min + (i / stops) * (max - min);
      colors.push(scale(t));
    }
    return colors;
  }, [min, max, scale, stops]);

  if (min === max) return null;

  return (
    <div className="mt-4 flex flex-col items-center gap-1">
      <div className="text-xs text-white/60">Draw Rate</div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-white/60">{formatPercent(min)}</span>
        <div
          className="h-3 w-48 rounded"
          style={{
            background: `linear-gradient(to right, ${gradient.join(', ')})`,
          }}
        />
        <span className="text-xs text-white/60">{formatPercent(max)}</span>
      </div>
    </div>
  );
}

function SortHeader({
  col,
  active,
  sortDir,
  onToggle,
  children,
}: {
  col: SortColumn;
  active: boolean;
  sortDir: SortDir;
  onToggle: (col: SortColumn) => void;
  children: React.ReactNode;
}) {
  return (
    <th
      className="cursor-pointer px-3 py-2 text-left text-sm font-medium text-white/60 select-none hover:text-white"
      onClick={() => onToggle(col)}
    >
      {children}
      {active && <span className="ml-1">{sortDir === 'asc' ? '▲' : '▼'}</span>}
    </th>
  );
}

function CountryTable({rows}: {rows: CountryRow[]}) {
  const [sortCol, setSortCol] = useState<SortColumn>('drawRate');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const sorted = useMemo(() => {
    return [...rows].sort((a, b) => {
      let cmp: number;
      if (sortCol === 'country') {
        cmp = a.country.localeCompare(b.country);
      } else {
        cmp = a[sortCol] - b[sortCol];
      }
      return sortDir === 'desc' ? -cmp : cmp;
    });
  }, [rows, sortCol, sortDir]);

  function toggleSort(col: SortColumn) {
    if (sortCol === col) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortCol(col);
      setSortDir(col === 'country' ? 'asc' : 'desc');
    }
  }

  return (
    <div className="mb-8 overflow-x-auto rounded-xl bg-black/30">
      <table className="w-full min-w-[640px]">
        <thead>
          <tr className="border-b border-white/10">
            <SortHeader
              col="country"
              active={sortCol === 'country'}
              sortDir={sortDir}
              onToggle={toggleSort}
            >
              Country
            </SortHeader>
            <SortHeader
              col="tournaments"
              active={sortCol === 'tournaments'}
              sortDir={sortDir}
              onToggle={toggleSort}
            >
              Tournaments
            </SortHeader>
            <SortHeader
              col="seatWinRate1"
              active={sortCol === 'seatWinRate1'}
              sortDir={sortDir}
              onToggle={toggleSort}
            >
              Seat 1 WR
            </SortHeader>
            <SortHeader
              col="seatWinRate2"
              active={sortCol === 'seatWinRate2'}
              sortDir={sortDir}
              onToggle={toggleSort}
            >
              Seat 2 WR
            </SortHeader>
            <SortHeader
              col="seatWinRate3"
              active={sortCol === 'seatWinRate3'}
              sortDir={sortDir}
              onToggle={toggleSort}
            >
              Seat 3 WR
            </SortHeader>
            <SortHeader
              col="seatWinRate4"
              active={sortCol === 'seatWinRate4'}
              sortDir={sortDir}
              onToggle={toggleSort}
            >
              Seat 4 WR
            </SortHeader>
            <SortHeader
              col="drawRate"
              active={sortCol === 'drawRate'}
              sortDir={sortDir}
              onToggle={toggleSort}
            >
              Draw Rate
            </SortHeader>
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            <tr
              key={row.country}
              className="border-b border-white/5 hover:bg-white/5"
            >
              <td className="px-3 py-2 text-sm text-white">{row.country}</td>
              <td className="px-3 py-2 text-sm text-white/80">
                {row.tournaments}
              </td>
              <Cell value={row.seatWinRate1} />
              <Cell value={row.seatWinRate2} />
              <Cell value={row.seatWinRate3} />
              <Cell value={row.seatWinRate4} />
              <Cell value={row.drawRate} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Cell({value}: {value: number}) {
  return (
    <td className="px-3 py-2 text-sm text-white/60">{formatPercent(value)}</td>
  );
}
