import {
  addMinutes,
  areIntervalsOverlapping,
  differenceInMinutes,
} from 'date-fns';
import {
  DateLibraryInterval,
  IDateLibrary,
} from '../protocols/date-library-interface';

class DateLibraryDateFns implements IDateLibrary {
  differenceInMinutes(dateLeft: Date, dateRight: Date): number {
    return differenceInMinutes(dateLeft, dateRight);
  }

  addMinutes(date: Date, amount: number): Date {
    return addMinutes(date, amount);
  }

  areIntervalsOverlapping(
    intervalLeft: DateLibraryInterval,
    intervalRight: DateLibraryInterval,
    options?: { inclusive?: boolean },
  ): boolean {
    return areIntervalsOverlapping(intervalLeft, intervalRight, options);
  }
}

export const dateLibraryDateFns = new DateLibraryDateFns();
