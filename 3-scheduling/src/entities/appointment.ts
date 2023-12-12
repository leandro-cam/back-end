import { IDateLibrary } from '../libraries/protocols/date-library-interface';
import { Barbershop } from './barbershop';
import { Person } from './person';

export interface AppointmentProps {
  id: string;
  customer: Person;
  startsAt: Date;
  endsAt: Date;
  durationInMinutes: number;
  barbershop: Barbershop;
  barber: Person;
}

export class Appointment {
  constructor(
    private dateLibrary: IDateLibrary,
    private props: AppointmentProps,
  ) {
    this.startsAt = props.startsAt;
    this.endsAt = props.endsAt;
    this.durationInMinutes = props.durationInMinutes;
  }

  get customer() {
    return this.props.customer;
  }

  get startsAt() {
    return this.props.startsAt;
  }

  set startsAt(startsAt: Date) {
    if (startsAt < new Date()) {
      throw new Error('startsAt date is invalid');
    }

    this.props.startsAt = startsAt;
  }

  get endsAt() {
    return this.props.endsAt;
  }

  set endsAt(endsAt: Date) {
    if (endsAt <= this.props.startsAt) {
      throw new Error('endsAt date is invalid');
    }

    this.props.endsAt = endsAt;
  }

  get durationInMinutes() {
    return this.props.durationInMinutes;
  }

  set durationInMinutes(durationInMinutes: number) {
    const calculatedDurationInMinutes = this.dateLibrary.differenceInMinutes(
      this.props.endsAt,
      this.props.startsAt,
    );

    if (calculatedDurationInMinutes !== durationInMinutes) {
      throw new Error('durationInMinutes is different of endsAt - startAt');
    }

    this.props.durationInMinutes = durationInMinutes;
  }

  get barbershop() {
    return this.props.barbershop;
  }

  get barber() {
    return this.props.barber;
  }
}
