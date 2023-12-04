import { Appointment } from '../../entities/appointment';
import { IDateLibrary } from '../../libraries/protocols/date-library-interface';
import { IAppointmentRepository } from '../protocols/appointment-repository-interface';

export class InMemoryAppointmentRepository implements IAppointmentRepository {
  private appointments: Appointment[] = [];

  async create(appointment: Appointment): Promise<void> {
    this.appointments.push(appointment);
  }

  async findOverlappingAppointment(
    startsAt: Date,
    endsAt: Date,
    dateLibrary: IDateLibrary,
  ): Promise<Appointment | null> {
    const overlappingAppointment = this.appointments.find((appointment) =>
      dateLibrary.areIntervalsOverlapping(
        { start: startsAt, end: endsAt },
        { start: appointment.startsAt, end: appointment.endsAt },
        { inclusive: false },
      ),
    );

    return overlappingAppointment || null;
  }
}
