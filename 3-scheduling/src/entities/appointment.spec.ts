import { addMinutes } from 'date-fns';
import { expect, it } from 'vitest';
import { Appointment, AppointmentProps } from './appointment';

it('should create an appointment', () => {
  const props: AppointmentProps = {
    customer: 'John Doe',
    startsAt: addMinutes(new Date(), 5),
    endsAt: addMinutes(new Date(), 35),
    durationInMinutes: 30,
  };
  const appointment = new Appointment(props);

  expect(appointment).toBeInstanceOf(Appointment);
});

it('should not create an appointment with endsAt less that startsAt', () => {
  const startsAt = addMinutes(new Date(), 5);
  const endsAt = new Date();
  const error = new Error('endsAt date is invalid');

  expect(() => {
    new Appointment({
      customer: 'John Doe',
      startsAt,
      endsAt,
      durationInMinutes: 30,
    });
  }).toThrowError(error);
});

it('should not create an appointment with endsAt equal to startsAt', () => {
  const startsAt = addMinutes(new Date(), 5);
  const endsAt = startsAt;
  const error = new Error('endsAt date is invalid');

  expect(() => {
    new Appointment({
      customer: 'John Doe',
      startsAt,
      endsAt,
      durationInMinutes: 30,
    });
  }).toThrowError(error);
});

it('should not create an appointment when durationInMinutes is greater that endsAt - startsAt', () => {
  const startsAt = addMinutes(new Date(), 5);
  const endsAt = addMinutes(new Date(), 35);
  const error = new Error('durationInMinutes is different of endsAt - startAt');

  expect(() => {
    new Appointment({
      customer: 'John Doe',
      startsAt,
      endsAt,
      durationInMinutes: 40,
    });
  }).toThrowError(error);
});

it('should not create an appointment when durationInMinutes is less that endsAt - startsAt', () => {
  const startsAt = addMinutes(new Date(), 5);
  const endsAt = addMinutes(new Date(), 35);
  const error = new Error('durationInMinutes is different of endsAt - startAt');

  expect(() => {
    new Appointment({
      customer: 'John Doe',
      startsAt,
      endsAt,
      durationInMinutes: 20,
    });
  }).toThrowError(error);
});
