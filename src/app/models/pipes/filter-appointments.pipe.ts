import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterAppointments'
})
export class FilterAppointmentsPipe implements PipeTransform {
  transform(appointments: any[], selectedDate: Date): any[] {
    return appointments.filter(appointment => appointment.date === selectedDate);
  }
  
}

