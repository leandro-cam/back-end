import { Appointment } from '../../entities/appointment';
import { IAppointmentRepository } from '../protocols/appointment-repository-interface';
import { areIntervalsOverlapping } from 'date-fns';

export class InMemoryAppointmentRepository implements IAppointmentRepository {
  private appointments: Appointment[] = [];

  async create(appointment: Appointment): Promise<void> {
    this.appointments.push(appointment);
  }

  async findOverlappingAppointment(
    startsAt: Date,
    endsAt: Date,
  ): Promise<Appointment | null> {
    const overlappingAppointment = this.appointments.find((appointment) =>
      areIntervalsOverlapping(
        { start: startsAt, end: endsAt },
        { start: appointment.startsAt, end: appointment.endsAt },
        { inclusive: false },
      ),
    );

    return overlappingAppointment || null;
  }
}
