import { Address } from './address';
import { Person } from './person';

export class Barbershop {
  id: string;
  name: string;
  address: Address;
  barbers: Person[];
}
