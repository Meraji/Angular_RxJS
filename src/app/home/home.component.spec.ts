import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import {DebugElement} from '@angular/core';
import { HomeComponent } from './home.component';
import {AppModule} from "../app.module";
import {ResidentService} from "../service/residentService";
import {of} from "rxjs";
import { By } from '@angular/platform-browser';
import {Resident} from "../model/resident";

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let el: DebugElement;
  let residentService: any;
  const fakeResidentObject = [
  {
    "firstname": "Anne",
    "surname": "Krabappel",
    "gender": "",
    "username": "edna.krabappel",
    "address": "82 Evergreen Terrace Springfield",
    "quote": "",
    "id": 1
  },
  {
    "firstname": "Homer",
    "surname": "Simpson",
    "gender": "male",
    "username": "homer.simpson",
    "address": "742 Evergreen Terrace Springfield",
    "quote": "",
    "id": 2
  },
    {
      "firstname": "Marge",
      "surname": "Simpson",
      "gender": "female",
      "username": "marge.simpson",
      "address": "742 Evergreen Terrace Springfield",
      "quote": "Go out on a Tuesday? Who am I, Charlie Sheen?",
      "id": 3
    }
  ] as Resident[];

  beforeEach(async () => {

    const residentServiceSpy = jasmine.createSpyObj('ResidentService',
      ['getResidents', 'searchResidents']);

    TestBed.configureTestingModule({
      imports: [
        AppModule,
      ],
      providers: [
        {provide: ResidentService, useValue: residentServiceSpy}
      ]
    })
    .compileComponents().then(() => {
      fixture = TestBed.createComponent(HomeComponent);
      component = fixture.componentInstance;
      el = fixture.debugElement;
      residentService = TestBed.inject(ResidentService);
    })
  });


  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display residents', () => {

    residentService.getResidents.and.returnValue(of(fakeResidentObject));
    fixture.detectChanges();

    const tiles = el.queryAll(By.css('.mat-card'));
    expect(tiles.length).toBe(fakeResidentObject.length, 'Unexpected not loading the Residents');
  });

  it('should display found resident by search', () => {

    const searchResult = [  {
      "firstname": "Anne",
      "surname": "Krabappel",
      "gender": "",
      "username": "edna.krabappel",
      "address": "82 Evergreen Terrace Springfield",
      "quote": "",
      "id": 1
    }]
    residentService.getResidents.and.returnValue(of(searchResult));
    fixture.detectChanges();

    const notFound = el.queryAll(By.css('.home-panel__no-result'));
    expect(notFound.length).toBe(0, 'Unexpected loading a not found message');

    const tiles = el.queryAll(By.css('.mat-card'));
    expect(tiles.length).toBe(1, 'Unexpected not loading the Residents');
  });

  it('should display a text message if no resident is found by search', () => {
    residentService.searchResidents.and.returnValue(of([]));
    fixture.detectChanges();

    const notFound = el.queryAll(By.css('.home-panel__no-result'));
    expect(notFound.length).toBe(1, 'Unexpected loading the Residents');
  });

});
