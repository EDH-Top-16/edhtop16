import {subMonths} from 'date-fns';
import {Float, ID, Int} from 'grats';

/** @gqlEnum */
export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

/** @gqlEnum */
export enum TimePeriod {
  THREE_MONTHS = 'THREE_MONTHS',
  SIX_MONTHS = 'SIX_MONTHS',
  ONE_YEAR = 'ONE_YEAR',
  ALL_TIME = 'ALL_TIME',
  POST_BAN = 'POST_BAN',
  ONE_MONTH = 'ONE_MONTH',
}

export function minDateFromTimePeriod(
  timePeriod: TimePeriod | null | undefined,
) {
  return timePeriod === 'ONE_YEAR'
    ? subMonths(new Date(), 12)
    : timePeriod === 'SIX_MONTHS'
      ? subMonths(new Date(), 6)
      : timePeriod === 'THREE_MONTHS'
        ? subMonths(new Date(), 3)
        : timePeriod === 'ONE_MONTH'
          ? subMonths(new Date(), 1)
          : timePeriod === 'POST_BAN'
            ? new Date('2024-09-23')
            : new Date(0);
}
