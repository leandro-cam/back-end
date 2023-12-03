import { it, expect } from 'vitest';
import { InMemoryAppointmentRepository } from '../../repositories/in-memory/in-memory-appointment-repository';
import { CreateAppointmentUseCase } from './create-appointment-use-case';
import { Appointment, AppointmentProps } from '../../entities/appointment';
import { addMinutes } from 'date-fns';

it('should not create appointment when passed time is equal to time already scheduled', async () => {
  const createAppointmentUseCase = new CreateAppointmentUseCase(
    new InMemoryAppointmentRepository(),
  );
  const appointmentProps: AppointmentProps = {
    customer: 'John Doe',
    startsAt: addMinutes(new Date(), 5),
    endsAt: addMinutes(new Date(), 35),
    durationInMinutes: 30,
  };
  const error = new Error('This time is already scheduled');

  await createAppointmentUseCase.execute(appointmentProps);

  await expect(
    createAppointmentUseCase.execute(appointmentProps),
  ).rejects.toThrowError(error);
});

it('should not create appointment when passed time starts in time already scheduled', async () => {
  const createAppointmentUseCase = new CreateAppointmentUseCase(
    new InMemoryAppointmentRepository(),
  );
  const appointmentProps: AppointmentProps = {
    customer: 'John Doe',
    startsAt: addMinutes(new Date(), 5),
    endsAt: addMinutes(new Date(), 35),
    durationInMinutes: 30,
  };
  const error = new Error('This time is already scheduled');

  await createAppointmentUseCase.execute(appointmentProps);

  appointmentProps.startsAt = addMinutes(new Date(), 15);
  appointmentProps.endsAt = addMinutes(new Date(), 45);

  await expect(
    createAppointmentUseCase.execute(appointmentProps),
  ).rejects.toThrowError(error);
});

it('should not create appointment when passed time ends in time already scheduled', async () => {
  const createAppointmentUseCase = new CreateAppointmentUseCase(
    new InMemoryAppointmentRepository(),
  );
  const appointmentProps: AppointmentProps = {
    customer: 'John Doe',
    startsAt: addMinutes(new Date(), 15),
    endsAt: addMinutes(new Date(), 45),
    durationInMinutes: 30,
  };
  const error = new Error('This time is already scheduled');

  await createAppointmentUseCase.execute(appointmentProps);

  appointmentProps.startsAt = addMinutes(new Date(), 5);
  appointmentProps.endsAt = addMinutes(new Date(), 35);

  await expect(
    createAppointmentUseCase.execute(appointmentProps),
  ).rejects.toThrowError(error);
});

it('should create appointment when passed time is valid', async () => {
  const createAppointmentUseCase = new CreateAppointmentUseCase(
    new InMemoryAppointmentRepository(),
  );
  const appointmentProps: AppointmentProps = {
    customer: 'John Doe',
    startsAt: addMinutes(new Date(), 5),
    endsAt: addMinutes(new Date(), 35),
    durationInMinutes: 30,
  };

  expect(
    await createAppointmentUseCase.execute(appointmentProps),
  ).toBeInstanceOf(Appointment);
});

it('should create appointment when it starts in the end of other appointment', async () => {
  const createAppointmentUseCase = new CreateAppointmentUseCase(
    new InMemoryAppointmentRepository(),
  );

  await createAppointmentUseCase.execute({
    customer: 'John Doe',
    startsAt: addMinutes(new Date(), 5),
    endsAt: addMinutes(new Date(), 35),
    durationInMinutes: 30,
  });

  expect(
    await createAppointmentUseCase.execute({
      customer: 'Fred Doe',
      startsAt: addMinutes(new Date(), 35),
      endsAt: addMinutes(new Date(), 65),
      durationInMinutes: 30,
    }),
  ).toBeInstanceOf(Appointment);
});

it('should create appointment when it ends in the start of other appointment', async () => {
  const createAppointmentUseCase = new CreateAppointmentUseCase(
    new InMemoryAppointmentRepository(),
  );

  await createAppointmentUseCase.execute({
    customer: 'Fred Doe',
    startsAt: addMinutes(new Date(), 35),
    endsAt: addMinutes(new Date(), 65),
    durationInMinutes: 30,
  });

  expect(
    await createAppointmentUseCase.execute({
      customer: 'John Doe',
      startsAt: addMinutes(new Date(), 5),
      endsAt: addMinutes(new Date(), 35),
      durationInMinutes: 30,
    }),
  ).toBeInstanceOf(Appointment);
});
