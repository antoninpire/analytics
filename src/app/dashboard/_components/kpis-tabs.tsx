import {
  formatMinSec,
  formatNumber,
  formatPercentage,
  kFormatter,
} from "@/lib/utils";

const ALL_KPIS = [
  "visits",
  "pageviews",
  "avg_session_sec",
  "bounce_rate",
] as const;

type KpiTuple = typeof ALL_KPIS;

export type KpiType = KpiTuple[number];

type KpiOption = {
  label: string;
  value: KpiType;
  tooltip: string;
  formatter: (value: number) => string;
};

export const KPI_OPTIONS: KpiOption[] = [
  {
    label: "unique visitors",
    value: "visits",
    tooltip: "visits",
    formatter: formatNumber,
  },
  {
    label: "site pageviews",
    value: "pageviews",
    tooltip: "pageviews",
    formatter: kFormatter,
  },
  {
    label: "avg. visit time",
    value: "avg_session_sec",
    tooltip: "avg. visit time",
    formatter: formatMinSec,
  },
  {
    label: "bounce rate",
    value: "bounce_rate",
    tooltip: "bounce rate",
    formatter: formatPercentage,
  },
];

type KpiTotals = Record<KpiType, number>;

const selectedKpi = "visits";

const totals: KpiTotals = {
  visits: 12,
  pageviews: 123,
  avg_session_sec: 123,
  bounce_rate: 123,
};

export default function KpisTabs() {
  return (
    <div
      role="tablist"
      className="grid grid-cols-2 sm:grid-cols-4 lg:flex lg:flex-wrap rounded-t-xl overflow-hidden -mt-6 -mx-6"
    >
      {KPI_OPTIONS.map(({ label, value, formatter }) => (
        <button
          key={value}
          role="tab"
          aria-selected={selectedKpi === value}
          data-state={value === selectedKpi ? "active" : undefined}
          className="relative cursor-pointer p-6 md:p-9 text-left md:text-center text-secondary hover:bg-primaryLight transition-colors sm:state-active:border-b-4 sm:state-active:border-primary state-active:text-primary sm:mb-2"
          // onClick={() => onChange(value)}
        >
          <div className="flex flex-col gap-2 w-fit md:mx-auto">
            <span className="text-md lg:text-lg lg:leading-6 font-medium truncate capitalize">
              {label}
            </span>
            <span
              className="text-neutral-64 text-left font-normal"
              aria-hidden={true}
            >
              {totals ? formatter(totals[value]) : "-"}
            </span>
          </div>
          <div className="hidden sm:block arrow absolute h-3 w-3 bg-primary -bottom-5" />
        </button>
      ))}
    </div>
  );
}
