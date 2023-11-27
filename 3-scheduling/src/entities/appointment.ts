import { differenceInMinutes } from 'date-fns';

export interface AppointmentProps {
  customer: string;
  startsAt: Date;
  endsAt: Date;
  durationInMinutes: number;
}

export class Appointment {
  constructor(private props: AppointmentProps) {
    this.props = props;

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
    const calculatedDurationInMinutes = differenceInMinutes(
      this.props.endsAt,
      this.props.startsAt,
    );

    if (calculatedDurationInMinutes !== durationInMinutes) {
      throw new Error('durationInMinutes is different of endsAt - startAt');
    }

    this.props.durationInMinutes = durationInMinutes;
  }
}
