import { Appointment, AppointmentProps } from '../../entities/appointment';
import { IAppointmentRepository } from '../../repositories/protocols/appointment-repository-interface';

export class CreateAppointmentUseCase {
  constructor(private appointmentRepository: IAppointmentRepository) {}

  async execute(appointmentProps: AppointmentProps): Promise<Appointment> {
    const appointment = new Appointment(appointmentProps);
    const overlappingAppointment =
      await this.appointmentRepository.findOverlappingAppointment(
        appointment.startsAt,
        appointment.endsAt,
      );

    if (overlappingAppointment) {
      throw new Error('This time is already scheduled');
    }

    await this.appointmentRepository.create(appointment);

    return appointment;
  }
}
