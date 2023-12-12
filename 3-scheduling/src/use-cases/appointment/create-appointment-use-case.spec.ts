import { beforeEach, expect, it } from 'vitest';
import { Appointment } from '../../entities/appointment';
import { dateLibraryDateFns } from '../../libraries/implementations/date-library-date-fns';
import { InMemoryAppointmentRepository } from '../../repositories/in-memory/in-memory-appointment-repository';
import { createAppointmentProps } from '../../utils/tests/create-appointment-props';
import { CreateAppointmentUseCase } from './create-appointment-use-case';

let createAppointmentUseCase: CreateAppointmentUseCase;

beforeEach(() => {
  createAppointmentUseCase = new CreateAppointmentUseCase(
    dateLibraryDateFns,
    new InMemoryAppointmentRepository(),
  );
});

it('should not create appointment when passed time is equal to time already scheduled', async () => {
  const appointmentProps = createAppointmentProps({});
  const error = new Error('This time is already scheduled');

  await createAppointmentUseCase.execute(appointmentProps);

  await expect(
    createAppointmentUseCase.execute(appointmentProps),
  ).rejects.toThrowError(error);
});

it('should not create appointment when passed time starts in time already scheduled of the barber', async () => {
  const error = new Error('This time is already scheduled');

  await createAppointmentUseCase.execute(createAppointmentProps({}));

  await expect(
    createAppointmentUseCase.execute(createAppointmentProps({})),
  ).rejects.toThrowError(error);
});

it('should create appointment when passed time is valid', async () => {
  expect(
    await createAppointmentUseCase.execute(createAppointmentProps({})),
  ).toBeInstanceOf(Appointment);
});

it('should create appointment when has two os more barbers and the switched not has that time already scheduled', async () => {
  await createAppointmentUseCase.execute(createAppointmentProps({}));

  expect(
    await createAppointmentUseCase.execute(
      createAppointmentProps({ barberId: '2' }),
    ),
  ).toBeInstanceOf(Appointment);
});

it('should create appointment when it starts in the end of other appointment', async () => {
  await createAppointmentUseCase.execute(createAppointmentProps({}));

  expect(
    await createAppointmentUseCase.execute(
      createAppointmentProps({
        customerName: 'Fred',
        addMinutesInStart: 35,
        addMinutesInEnd: 65,
      }),
    ),
  ).toBeInstanceOf(Appointment);
});

it('should create appointment when it ends in the start of other appointment', async () => {
  await createAppointmentUseCase.execute(
    createAppointmentProps({
      customerName: 'Fred',
      addMinutesInStart: 35,
      addMinutesInEnd: 65,
    }),
  );

  expect(
    await createAppointmentUseCase.execute(createAppointmentProps({})),
  ).toBeInstanceOf(Appointment);
});
