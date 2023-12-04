import { expect, it } from 'vitest';
import { createAppointmentEntity } from '../utils/tests/create-appointment-entity';
import { Appointment } from './appointment';

it('should create an appointment', () => {
  const appointment = createAppointmentEntity({});

  expect(appointment).toBeInstanceOf(Appointment);
});

it('should not create an appointment with endsAt less that startsAt', () => {
  const error = new Error('endsAt date is invalid');

  expect(() => {
    createAppointmentEntity({ addMinutesInEnd: 0 });
  }).toThrowError(error);
});

it('should not create an appointment with endsAt equal to startsAt', () => {
  const error = new Error('endsAt date is invalid');

  expect(() => {
    createAppointmentEntity({ addMinutesInEnd: 5 });
  }).toThrowError(error);
});

it('should not create an appointment when durationInMinutes is greater that endsAt - startsAt', () => {
  const error = new Error('durationInMinutes is different of endsAt - startAt');

  expect(() => {
    createAppointmentEntity({ durationInMinutes: 40 });
  }).toThrowError(error);
});

it('should not create an appointment when durationInMinutes is less that endsAt - startsAt', () => {
  const error = new Error('durationInMinutes is different of endsAt - startAt');

  expect(() => {
    createAppointmentEntity({ durationInMinutes: 20 });
  }).toThrowError(error);
});
