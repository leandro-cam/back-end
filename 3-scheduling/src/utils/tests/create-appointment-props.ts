import { AppointmentProps } from '../../entities/appointment';
import { dateLibraryDateFns } from '../../libraries/implementations/date-library-date-fns';

export const createAppointmentProps = ({
  customerName = 'John',
  customerLastName = 'Doe',
  addMinutesInStart = 5,
  addMinutesInEnd = 35,
  durationInMinutes = 30,
  barberId = '1',
}): AppointmentProps => {
  return {
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
        {
          id: '2',
          name: 'Bruce',
          lastName: 'Holiday',
          birthYear: new Date('22-07-1988'),
        },
      ],
    },
    barber:
      barberId === '1'
        ? {
            id: '1',
            name: 'Jack',
            lastName: 'Friday',
            birthYear: new Date('15-05-1995'),
          }
        : {
            id: '2',
            name: 'Bruce',
            lastName: 'Holiday',
            birthYear: new Date('22-07-1988'),
          },
  } as AppointmentProps;
};
