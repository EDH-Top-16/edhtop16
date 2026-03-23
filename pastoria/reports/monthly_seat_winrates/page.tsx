import {page_MonthlySeatWinRateChart$key} from '#genfiles/queries/page_MonthlySeatWinRateChart.graphql';
import {page_MonthlySeatWinRateRow$key} from '#genfiles/queries/page_MonthlySeatWinRateRow.graphql';
import {page_MonthlySeatWinRatesQuery} from '#genfiles/queries/page_MonthlySeatWinRatesQuery.graphql';
import {page_CommanderSearchQuery} from '#genfiles/queries/page_CommanderSearchQuery.graphql';
import {useNavigation} from '#genfiles/router/router';
import {Footer} from '#src/components/footer';
import {Navigation} from '#src/components/navigation';
import {formatPercent} from '#src/lib/client/format';
import {useSearch} from '#src/lib/client/search';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from 'chart.js';
import cn from 'classnames';
import {Suspense, useCallback, useEffect, useRef, useState} from 'react';
import {
  graphql,
  PreloadedQuery,
  useFragment,
  useLazyLoadQuery,
  usePreloadedQuery,
} from 'react-relay/hooks';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
);

export type Queries = {
  monthlySeatWinRatesRef: page_MonthlySeatWinRatesQuery;
};

export default function MonthlySeatWinRatesPageShell({
  queries,
}: PastoriaPageProps<'/reports/monthly_seat_winrates'>) {
  const {commanderName} = queries.monthlySeatWinRatesRef.variables;
  const {replaceRoute} = useNavigation();

  const selectCommander = useCallback(
    (name: string | null) => {
      replaceRoute('/reports/monthly_seat_winrates', {
        commanderName: name,
      });
    },
    [replaceRoute],
  );

  return (
    <>
      <title>Monthly Seat Win Rates — cEDH</title>
      <meta
        name="description"
        content="Monthly breakdown of per-seat win rates and draw rates in competitive EDH tournaments."
      />
      <Navigation searchType="tournament" />

      <div className="mx-auto mt-8 w-full max-w-(--breakpoint-xl) px-6">
        <div className="mb-6">
          <h1 className="font-title text-4xl font-extrabold text-white md:text-5xl">
            Monthly Seat Win Rates
          </h1>
          <p className="mt-2 text-white/60">
            Per-seat win rates and draw rates broken down by month, starting
            from March 2024.
          </p>
        </div>

        <div className="mb-6 flex items-end gap-3">
          <Suspense
            fallback={
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-white/60">
                  Commander
                </span>
                <input
                  disabled
                  placeholder="Loading..."
                  className="w-64 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30"
                />
              </div>
            }
          >
            <CommanderAutocomplete
              value={commanderName ?? null}
              onSelect={selectCommander}
            />
          </Suspense>
        </div>

        <MonthlySeatWinRatesContent queryRef={queries.monthlySeatWinRatesRef} />
      </div>
    </>
  );
}

function MonthlySeatWinRatesContent({
  queryRef,
}: {
  queryRef: PreloadedQuery<page_MonthlySeatWinRatesQuery>;
}) {
  const {monthlySeatWinRates: rows} = usePreloadedQuery(
    graphql`
      query page_MonthlySeatWinRatesQuery($commanderName: String)
      @preloadable
      @throwOnFieldError {
        monthlySeatWinRates(commanderName: $commanderName) {
          id
          ...page_MonthlySeatWinRateRow
          ...page_MonthlySeatWinRateChart
        }
      }
    `,
    queryRef,
  );

  return (
    <>
      <SeatWinRateChart rows={rows} />
      <div className="mb-8 overflow-x-auto rounded-xl bg-black/30">
        <table className="w-full min-w-[640px] tabular-nums">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-3 py-2 text-left text-sm font-medium text-white/60">
                Month
              </th>
              <th className="px-3 py-2 text-right text-sm font-medium text-white/60">
                Sample Size
              </th>
              <th className="px-3 py-2 text-right text-sm font-medium text-white/60">
                Seat 1 WR
              </th>
              <th className="px-3 py-2 text-right text-sm font-medium text-white/60">
                Seat 2 WR
              </th>
              <th className="px-3 py-2 text-right text-sm font-medium text-white/60">
                Seat 3 WR
              </th>
              <th className="px-3 py-2 text-right text-sm font-medium text-white/60">
                Seat 4 WR
              </th>
              <th className="px-3 py-2 text-right text-sm font-medium text-white/60">
                Draw Rate
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <MonthRow key={row.id} row={row} />
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </>
  );
}

function MonthRow({row}: {row: page_MonthlySeatWinRateRow$key}) {
  const data = useFragment(
    graphql`
      fragment page_MonthlySeatWinRateRow on MonthlySeatWinRate
      @throwOnFieldError {
        month
        games
        seatWinRate1
        seatWinRate2
        seatWinRate3
        seatWinRate4
        drawRate
      }
    `,
    row,
  );

  return (
    <tr className="border-b border-white/5 hover:bg-white/5">
      <td className="px-3 py-2 text-sm text-white">
        {formatMonth(data.month)}
      </td>
      <td className="px-3 py-2 text-right text-sm text-white/80">
        {data.games.toLocaleString()}
      </td>
      <td className="px-3 py-2 text-right text-sm text-white/60">
        {formatPercent(data.seatWinRate1)}
      </td>
      <td className="px-3 py-2 text-right text-sm text-white/60">
        {formatPercent(data.seatWinRate2)}
      </td>
      <td className="px-3 py-2 text-right text-sm text-white/60">
        {formatPercent(data.seatWinRate3)}
      </td>
      <td className="px-3 py-2 text-right text-sm text-white/60">
        {formatPercent(data.seatWinRate4)}
      </td>
      <td className="px-3 py-2 text-right text-sm text-white/60">
        {formatPercent(data.drawRate)}
      </td>
    </tr>
  );
}

function SeatWinRateChart({rows}: {rows: page_MonthlySeatWinRateChart$key}) {
  const data = useFragment(
    graphql`
      fragment page_MonthlySeatWinRateChart on MonthlySeatWinRate
      @relay(plural: true)
      @throwOnFieldError {
        month
        seatWinRate1
        seatWinRate2
        seatWinRate3
        seatWinRate4
        drawRate
      }
    `,
    rows,
  );

  const canvasRef = useCallback(
    (canvas: HTMLCanvasElement | null) => {
      if (!canvas) return;

      const labels = data.map((r) => formatMonthShort(r.month));

      const chart = new Chart(canvas, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Seat 1',
              data: data.map((r) => r.seatWinRate1 * 100),
              borderColor: '#f87171',
              backgroundColor: '#f8717133',
              tension: 0.3,
              pointRadius: 3,
            },
            {
              label: 'Seat 2',
              data: data.map((r) => r.seatWinRate2 * 100),
              borderColor: '#60a5fa',
              backgroundColor: '#60a5fa33',
              tension: 0.3,
              pointRadius: 3,
            },
            {
              label: 'Seat 3',
              data: data.map((r) => r.seatWinRate3 * 100),
              borderColor: '#4ade80',
              backgroundColor: '#4ade8033',
              tension: 0.3,
              pointRadius: 3,
            },
            {
              label: 'Seat 4',
              data: data.map((r) => r.seatWinRate4 * 100),
              borderColor: '#facc15',
              backgroundColor: '#facc1533',
              tension: 0.3,
              pointRadius: 3,
            },
            {
              label: 'Draw Rate',
              data: data.map((r) => r.drawRate * 100),
              borderColor: '#a78bfa',
              backgroundColor: '#a78bfa33',
              borderDash: [5, 5],
              tension: 0.3,
              pointRadius: 3,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {color: 'rgba(255,255,255,0.7)'},
            },
            tooltip: {
              callbacks: {
                label: (ctx) =>
                  `${ctx.dataset.label}: ${ctx.parsed.y?.toFixed(2)}%`,
              },
            },
          },
          scales: {
            x: {
              ticks: {color: 'rgba(255,255,255,0.5)'},
              grid: {color: 'rgba(255,255,255,0.05)'},
            },
            y: {
              ticks: {
                color: 'rgba(255,255,255,0.5)',
                callback: (v) => `${v}%`,
              },
              grid: {color: 'rgba(255,255,255,0.05)'},
            },
          },
        },
      });

      return () => chart.destroy();
    },
    [data],
  );

  return (
    <div className="mb-8 rounded-xl bg-black/30 p-4" style={{height: 400}}>
      <canvas ref={canvasRef} />
    </div>
  );
}

function formatMonthShort(yearMonth: string): string {
  const [year, month] = yearMonth.split('-');
  return `${SHORT_MONTH_NAMES[parseInt(month!, 10) - 1]} ${year}`;
}

const SHORT_MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function formatMonth(yearMonth: string): string {
  const [year, month] = yearMonth.split('-');
  return `${MONTH_NAMES[parseInt(month!, 10) - 1]} ${year}`;
}

const MAX_SUGGESTIONS = 10;

function CommanderAutocomplete({
  value,
  onSelect,
}: {
  value: string | null;
  onSelect: (name: string | null) => void;
}) {
  const {searchResults} = useLazyLoadQuery<page_CommanderSearchQuery>(
    graphql`
      query page_CommanderSearchQuery @throwOnFieldError {
        searchResults(types: [COMMANDER]) {
          name
          url
          entries
          topCuts
          metaShare
        }
      }
    `,
    {},
  );

  const [inputValue, setInputValue] = useState(value ?? '');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  // Sync input when the value prop changes (e.g. browser back/forward)
  useEffect(() => {
    setInputValue(value ?? '');
  }, [value]);

  const results = useSearch(searchResults, inputValue);
  const suggestions = results.slice(0, MAX_SUGGESTIONS);
  const suggestionsRef = useRef(suggestions);
  suggestionsRef.current = suggestions;

  const showDropdown =
    isOpen && inputValue.length > 0 && suggestions.length > 0;

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({block: 'nearest'});
    }
  }, [selectedIndex]);

  // Reset index when input changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [inputValue]);

  const handleSelect = useCallback(
    (name: string) => {
      setInputValue(name);
      setIsOpen(false);
      setSelectedIndex(-1);
      onSelect(name);
    },
    [onSelect],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < suggestionsRef.current.length - 1 ? prev + 1 : prev,
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case 'Enter':
          e.preventDefault();
          setSelectedIndex((prev) => {
            const item = suggestionsRef.current[prev];
            if (prev >= 0 && item) {
              handleSelect(item.name);
            }
            return prev;
          });
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          setSelectedIndex(-1);
          break;
      }
    },
    [handleSelect],
  );

  return (
    <div ref={containerRef} className="relative flex items-end gap-3">
      <div className="relative flex flex-col gap-1">
        <label
          htmlFor="commander-filter"
          className="text-sm font-medium text-white/60"
        >
          Commander
        </label>
        <input
          id="commander-filter"
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search commanders..."
          className="w-64 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-white/30"
          role="combobox"
          aria-expanded={showDropdown}
          aria-haspopup="listbox"
          aria-autocomplete="list"
        />
        {showDropdown && (
          <ul
            role="listbox"
            className="absolute top-full z-20 mt-1 max-h-64 w-64 overflow-y-auto rounded-lg border border-white/10 bg-gray-900"
          >
            {suggestions.map((s, i) => (
              <li
                key={s.name}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                role="option"
                aria-selected={selectedIndex === i}
                className={cn(
                  'cursor-pointer px-3 py-2 text-sm',
                  selectedIndex === i
                    ? 'bg-white/10 text-white'
                    : 'text-white/70 hover:bg-white/5 hover:text-white',
                )}
                onMouseDown={() => handleSelect(s.name)}
              >
                <div className="truncate">{s.name}</div>
                {s.metaShare != null && (
                  <div className="text-xs text-white/40">
                    {(s.metaShare * 100).toFixed(1)}% meta
                    {s.entries != null && ` · ${s.entries} entries`}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      {value && (
        <button
          type="button"
          onClick={() => {
            setInputValue('');
            onSelect(null);
          }}
          className="rounded-lg px-3 py-2 text-sm text-white/50 hover:text-white"
        >
          Clear
        </button>
      )}
    </div>
  );
}
