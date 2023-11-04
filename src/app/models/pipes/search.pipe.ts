import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(appointments: any[], searchTerm: string): any[] {
    if (!appointments) return [];
    if (!searchTerm) return appointments;

    searchTerm = searchTerm.toLowerCase();

    return appointments.filter(appointment => {
      const doctorName = appointment.doctor?.fullName;
      return doctorName && doctorName.toLowerCase().includes(searchTerm);
    });
  }

}
