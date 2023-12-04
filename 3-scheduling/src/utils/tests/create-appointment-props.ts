import { AppointmentProps } from '../../entities/appointment';
import { dateLibraryDateFns } from '../../libraries/implementations/date-library-date-fns';

export const createAppointmentProps = ({
  customer = 'John Doe',
  addMinutesInStart = 5,
  addMinutesInEnd = 35,
  durationInMinutes = 30,
}): AppointmentProps => {
  return {
    customer: customer,
    startsAt: dateLibraryDateFns.addMinutes(new Date(), addMinutesInStart),
    endsAt: dateLibraryDateFns.addMinutes(new Date(), addMinutesInEnd),
    durationInMinutes,
  } as AppointmentProps;
};
