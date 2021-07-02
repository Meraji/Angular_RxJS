import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {Resident} from '../model/resident';
import {ResidentService} from "../service/residentService";
import {MessagesService} from "../messages/messages.service";

describe('ResidentService', () => {

  let residentService: ResidentService,
    httpTestController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ResidentService,
        MessagesService
      ]
    });
    residentService = TestBed.inject(ResidentService);
    httpTestController = TestBed.inject(HttpTestingController);
  });

  it('should update the resident data', () => {
    const changes: Partial<Resident> = {
      firstname: 'Ben',
      surname: 'Meraji',
      gender: 'male',
      username: 'b.meraji',
      address: 'Saarbrücken',
      quote: "This is a task"
    };
    const residentQuoteAssigned = -1;

    residentService.updateResident(1, changes, residentQuoteAssigned)
      .subscribe(resident => {
        expect(resident.firstname).toBe('Ben');
        expect(resident.surname).toBe('Meraji');
      });

    const req = httpTestController.expectOne('http://localhost:3000/residents/1');

    expect(req.request.method).toEqual('PUT');
    expect(req.request.body.firstname)
      .toEqual(changes.firstname);
    expect(req.request.body.surname)
      .toEqual(changes.surname);

  });


});
