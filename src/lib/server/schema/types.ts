import {subMonths} from 'date-fns';
import {TopdeckTournamentRound, TopdeckTournamentTable} from '../topdeck';
import {builder} from './builder';

export const SortDirection = builder.enumType('SortDirection', {
  values: ['ASC', 'DESC'] as const,
});

export const TimePeriod = builder.enumType('TimePeriod', {
  values: [
    'ONE_MONTH',
    'THREE_MONTHS',
    'SIX_MONTHS',
    'ONE_YEAR',
    'ALL_TIME',
    'POST_BAN',
  ] as const,
});

export type TimePeriodType =
  | 'ONE_MONTH'
  | 'THREE_MONTHS'
  | 'SIX_MONTHS'
  | 'ONE_YEAR'
  | 'ALL_TIME'
  | 'POST_BAN';

export function minDateFromTimePeriod(
  timePeriod: TimePeriodType | string | null | undefined,
): Date {
  switch (timePeriod) {
    case 'ONE_YEAR':
      return subMonths(new Date(), 12);
    case 'SIX_MONTHS':
      return subMonths(new Date(), 6);
    case 'THREE_MONTHS':
      return subMonths(new Date(), 3);
    case 'ONE_MONTH':
      return subMonths(new Date(), 1);
    case 'POST_BAN':
      return new Date('2024-09-23');
    case 'ALL_TIME':
    default:
      return new Date(0);
  }
}

export const TopdeckTournamentRoundType = builder.objectRef<
  TopdeckTournamentRound & {TID: string}
>('TopdeckTournamentRound');

export const TopdeckTournamentTableType = builder.objectRef<
  TopdeckTournamentTable & {TID: string; roundName: string}
>('TopdeckTournamentTable');

export const TournamentBreakdownGroupType = builder.objectRef<{
  commanderId: number;
  topCuts: number;
  entries: number;
  conversionRate: number;
}>('TournamentBreakdownGroup');
