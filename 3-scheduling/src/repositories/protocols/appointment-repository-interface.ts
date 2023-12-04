import { Appointment } from '../../entities/appointment';
import { IDateLibrary } from '../../libraries/protocols/date-library-interface';

export interface IAppointmentRepository {
  create(appointment: Appointment): Promise<void>;

  findOverlappingAppointment(
    startsAt: Date,
    endsAt: Date,
    dateLibrary: IDateLibrary,
  ): Promise<Appointment | null>;
}
