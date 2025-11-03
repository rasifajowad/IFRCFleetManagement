import { Person, Vehicle } from './types';

export const seed = {
  vehicles: [
    { id: 'v1', name: 'Hilux D-2', plate: 'DHA-11-2345' },
    { id: 'v2', name: 'Land Cruiser LC70', plate: 'DHA-22-7788' },
    { id: 'v3', name: 'Noah Microbus', plate: 'DHA-09-5521' },
  ] as Vehicle[],
  drivers: [
    { id: 'd1', name: 'Selim' },
    { id: 'd2', name: 'Akbar' },
    { id: 'd3', name: 'Rafi' },
  ] as Person[],
  staff: [
    { id: 'u1', name: 'Ahmed' },
    { id: 'u2', name: 'Rahim' },
    { id: 'u3', name: 'Nadia' },
  ] as Person[],
  locations: [
    'Office HQ (Tejgaon)',
    'Warehouse (Savar)',
    'Airport (Hazrat Shahjalal)',
    'Hospital (DMCH)',
    'Branch - Gulshan',
    'Branch - Mirpur',
    'Client Site',
    'Other',
  ],
};

