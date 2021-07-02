
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {catchError, delay, map, shareReplay, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Resident} from "../model/resident";
import { MessagesService } from '../messages/messages.service';

@Injectable({
    providedIn: 'root'
  }
)

export class ResidentService {

  private readonly residentsUrl = 'http://localhost:3000/residents';
  private subject = new BehaviorSubject<Resident[]>([]);
  residents$: Observable<Resident[]> = this.subject.asObservable();

  constructor(
    private http: HttpClient,
    private message: MessagesService) {
    this.loadAllResidents();
  }

private loadAllResidents() {
  this.http.get<Resident[]>(this.residentsUrl)
    .pipe(
      catchError(err => {
        const message = 'Could not load residents!';
        this.message.showErrors(message);
        return throwError(err);
      }),
      tap(residents => {this.subject.next(residents)})
    ).subscribe();
}

  getResidents(): Observable<Resident[]> {
    return this.residents$;
  }

  searchResidents(residentName: string): Observable<Resident[]> {
    return this.residents$
      .pipe(
        map(r => r.filter(res => res.firstname.concat(' ', res.surname!).trim().toLowerCase().startsWith(residentName.toLowerCase()))),
        shareReplay()
  )
  };

  updateResident(residentId: number, changes: Partial<Resident>, residentQuoteAssigned: number): Observable<any> {

    const residents = this.subject.getValue();
    const indexChangedResident = residents.findIndex(resident => resident.id === residentId);
    const newResident: Resident = {
      ...residents[indexChangedResident],
      ...changes
    };

    const updatedResidents: Resident[] = residents.slice(0);
    updatedResidents[indexChangedResident] = newResident;

    this.subject.next(updatedResidents);

    if(residentQuoteAssigned > -1){
      this.assignQuoteResident(residentQuoteAssigned, updatedResidents[indexChangedResident].quote!)
        .subscribe();
    }

    return  this.http.put(`${this.residentsUrl}/${residentId}`, changes)
        .pipe(
          catchError(
            err => {
              const message = 'Could not update the resident!';
              this.message.showErrors(message);
              return throwError(err);
            }
          ),
          shareReplay()
        );
    }
  assignQuoteResident (residentId: number, quote: string): Observable<any>  {

      const residents = this.subject.getValue();
      const indexQuoteAssignee = residents.findIndex(resident => resident.id === residentId);

      residents[indexQuoteAssignee].quote = quote;
      this.subject.next(residents);

      return this.http.patch(`${this.residentsUrl}/${residentId}`, {quote: quote})
        .pipe(
          catchError(
            err => {
              const message = "Could not update the resident's quote!";
              this.message.showErrors(message);
              return throwError(err);
            }
          ),
          shareReplay()
        );
  }

}
