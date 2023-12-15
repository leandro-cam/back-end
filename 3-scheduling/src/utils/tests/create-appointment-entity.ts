import { Appointment, AppointmentProps } from '../../entities/appointment';
import { dateLibraryDateFns } from '../../libraries/implementations/date-library-date-fns';

export const createAppointmentEntity = ({
  customerName = 'John',
  customerLastName = 'Doe',
  addMinutesInStart = 5,
  addMinutesInEnd = 35,
  durationInMinutes = 30,
}): Appointment => {
  const appointmentProps: AppointmentProps = {
    id: '0',
    customer: {
      id: '0',
      name: customerName,
      lastName: customerLastName,
      birthYear: new Date('15-05-1995'),
    },
    startsAt: dateLibraryDateFns.addMinutes(new Date(), addMinutesInStart),
    endsAt: dateLibraryDateFns.addMinutes(new Date(), addMinutesInEnd),
    durationInMinutes,
    barbershop: {
      id: '0',
      name: 'Barbershop',
      state: 'Sao Paulo',
      city: 'Sao Paulo',
      neighborhood: 'Avenida Paulista',
      number: '15',
      barbers: [
        {
          id: '1',
          name: 'Jack',
          lastName: 'Friday',
          birthYear: new Date('15-05-1995'),
        },
      ],
    },
    barber: {
      id: '1',
      name: 'Jack',
      lastName: 'Friday',
      birthYear: new Date('15-05-1995'),
    },
  };

  return new Appointment(dateLibraryDateFns, appointmentProps);
};
