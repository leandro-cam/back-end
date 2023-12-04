import { Appointment, AppointmentProps } from '../../entities/appointment';
import { dateLibraryDateFns } from '../../libraries/implementations/date-library-date-fns';

export const createAppointmentEntity = ({
  customer = 'John Doe',
  addMinutesInStart = 5,
  addMinutesInEnd = 35,
  durationInMinutes = 30,
}): Appointment => {
  const appointmentProps: AppointmentProps = {
    customer: customer,
    startsAt: dateLibraryDateFns.addMinutes(new Date(), addMinutesInStart),
    endsAt: dateLibraryDateFns.addMinutes(new Date(), addMinutesInEnd),
    durationInMinutes,
  };

  return new Appointment(dateLibraryDateFns, appointmentProps);
};
