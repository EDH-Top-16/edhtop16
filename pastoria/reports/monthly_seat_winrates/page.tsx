import {page_MonthlySeatWinRateChart$key} from '#genfiles/queries/page_MonthlySeatWinRateChart.graphql';
import {page_MonthlySeatWinRateRow$key} from '#genfiles/queries/page_MonthlySeatWinRateRow.graphql';
import {page_MonthlySeatWinRatesQuery} from '#genfiles/queries/page_MonthlySeatWinRatesQuery.graphql';
import {Footer} from '#src/components/footer';
import {Navigation} from '#src/components/navigation';
import {formatPercent} from '#src/lib/client/format';
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
import {useCallback} from 'react';
import {
  graphql,
  PreloadedQuery,
  useFragment,
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
      query page_MonthlySeatWinRatesQuery @preloadable @throwOnFieldError {
        monthlySeatWinRates {
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
