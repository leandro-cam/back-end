import {
  addMinutes,
  areIntervalsOverlapping,
  differenceInMinutes,
  isEqual,
} from 'date-fns';
import {
  DateLibraryInterval,
  IDateLibrary,
} from '../protocols/date-library-interface';

class DateLibraryDateFns implements IDateLibrary {
  differenceInMinutes(dateLeft: Date, dateRight: Date) {
    return differenceInMinutes(dateLeft, dateRight);
  }

  addMinutes(date: Date, amount: number) {
    return addMinutes(date, amount);
  }

  areIntervalsOverlapping(
    intervalLeft: DateLibraryInterval,
    intervalRight: DateLibraryInterval,
    options?: { inclusive?: boolean },
  ) {
    return areIntervalsOverlapping(intervalLeft, intervalRight, options);
  }

  isEqual(dateLeft: Date, dateRight: Date) {
    return isEqual(dateLeft, dateRight);
  }
}

export const dateLibraryDateFns = new DateLibraryDateFns();
