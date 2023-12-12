export interface IDateLibrary {
  differenceInMinutes(dateLeft: Date, dateRight: Date): number;

  addMinutes(date: Date, amount: number): Date;

  areIntervalsOverlapping(
    intervalLeft: DateLibraryInterval,
    intervalRight: DateLibraryInterval,
    options?: {
      inclusive?: boolean;
    },
  ): boolean;

  isEqual(dateLeft: Date, dateRight: Date): boolean;
}

export type DateLibraryInterval = {
  start: Date;
  end: Date;
};
