
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild,TemplateRef, ChangeDetectionStrategy, ChangeDetectorRef, } from '@angular/core';
import { Observable, from, take , map , of} from 'rxjs';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { Subject } from 'rxjs';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { EventColor } from 'calendar-utils';
import { AppointmentDetailsComponent } from './../modals/appointment-details/appointment-details.component';
import { Appointment } from 'src/app/models/appointment';
import { Patient } from 'src/app/models/patient';
import { Doctor } from 'src/app/models/doctor';
import { AppointmentService } from 'src/app/services/appointment/appointment.service';
import { SpringAuthService } from 'src/app/services/authentication/spring-auth.service';
import { Profile } from 'src/app/models/profile';
import { StatusAPT } from 'src/app/enum/status-apt';
import { MatDialog } from '@angular/material/dialog';
/*EVENTS COLOR PALETTE */
const colors: Record<string, EventColor> = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};



@Component({
  selector: 'app-appoitment',
  templateUrl: './appoitment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./appoitment.component.css']
})

export class AppoitmentComponent implements OnInit, AfterViewInit {

  userProfile: Profile | null = {};
  userAppointments: Appointment[] = [];
  refresh = new Subject<void>();
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  locale: string = 'en';

  activeDayIsOpen: boolean = true;

  events$: Observable<CalendarEvent<{ appointment: Appointment }>[]> = new Observable();

constructor(
  private appointmentService:AppointmentService,
  private springAuthService:SpringAuthService,
  private cdr: ChangeDetectorRef,
  private dialog: MatDialog,
  ) {

}
  ngAfterViewInit(): void {
    
  }
  ngOnInit(): void {
    this.springAuthService.getActiveUser()
    .pipe(take(1))
    .subscribe(
      (user) => {
        if (user) {
          this.userProfile = user;
          console.log("this is the user id: " + this.userProfile.id);
          const userId = this.userProfile?.id || 0;
          this.getAppointments(userId);
        }
      },
      (error) => {
        console.error('Error getting active user', error);
      }
  );
}

  //? GETTING THE USER APPOINTMENTS
  getAppointments(userId: number) {
  this.appointmentService.getUserAppointments(userId)
    .subscribe(
      (appointments) => {
        this.userAppointments = appointments;
       // console.log(this.userAppointments.map(appointment => ("reason" + appointment.reason)));
       this.loadAppointments(this.userAppointments);
      },
      (error) => {
        console.error('Error fetching appointments with status PENDING:', error);
      }
    );
}

  // Convert an appointment to a calendar event type
  //! not used yet
  private convertAppointmentToCalendarEvent(appointment: Appointment): CalendarEvent {
    return {
      start: new Date(appointment.date),
      end: new Date(appointment.date), 
      title: appointment.reason,
      color: colors['red'],
      actions: this.actions,
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      meta: { appointment }
    };
  }
  async loadAppointments(userAppointments: Appointment[]) {
    const calendarEvents = userAppointments.map(appointment => this.convertAppointmentToCalendarEvent(appointment));
    this.events$ = of(calendarEvents);
     // Manually trigger change detection
    this.cdr.detectChanges();
    this.events$.subscribe(events => console.log('Events$: ', events));
  }
  //? EVENT ACTIONS
  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa-solid fa-eye"></i>',
      a11yLabel: 'Details',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        const dialogRef = this.dialog.open(AppointmentDetailsComponent, {
          height: '800px',
          width: '600px',
          data: { appointment: event.meta.appointment } ,
        });
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.deleteEvent(event);
        alert('Event delete confirm modal ');
      },
    },
  ];
 
/*
  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors['red'],
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }
*/
//? NEW DELETE EVENT WITH OBSERVABLE
deleteEvent(eventToDelete: CalendarEvent): void {
  this.events$ = this.events$.pipe(
    map(events => events.filter(iEvent => iEvent !== eventToDelete))
  );
}
  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
  changeDay(date: Date) {
    this.viewDate = date;
    this.view = CalendarView.Day;
  }
  dayClicked({
    date,
    events,
  }: {
    date: Date;
    events: CalendarEvent<{ appointment: Appointment }>[];
  }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }
  eventClicked(event: CalendarEvent<{ appointment: Appointment }>): void {
    alert('Event clicked');
  }
}
