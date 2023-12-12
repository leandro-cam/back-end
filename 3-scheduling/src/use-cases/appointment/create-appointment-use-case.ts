import { Appointment, AppointmentProps } from '../../entities/appointment';
import { IDateLibrary } from '../../libraries/protocols/date-library-interface';
import { IAppointmentRepository } from '../../repositories/protocols/appointment-repository-interface';

export class CreateAppointmentUseCase {
  constructor(
    private dateLibrary: IDateLibrary,
    private appointmentRepository: IAppointmentRepository,
  ) {}

  async execute(appointmentProps: AppointmentProps): Promise<Appointment> {
    const appointment = new Appointment(this.dateLibrary, appointmentProps);
    const scheduledAppointment =
      await this.appointmentRepository.findOneAppointmentByBarberAndDate(
        this.dateLibrary,
        appointment.barber.id,
        appointment.startsAt,
      );

    if (scheduledAppointment) {
      throw new Error('This time is already scheduled');
    }

    await this.appointmentRepository.create(appointment);

    return appointment;
  }
}
