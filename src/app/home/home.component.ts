import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { Observable } from 'rxjs';
import {Resident} from "../model/resident";
import {ResidentService} from "../service/residentService";
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {HomeDialogComponent} from "../home-dialog/home-dialog.component";
import {filter, tap} from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  residents$!: Observable<Resident[]>;

  constructor(private residentService: ResidentService,
              private dialog: MatDialog) { }

   private residentChanged = new EventEmitter();

  ngOnInit(): void {
    this.loadResidents();
  }

  loadResidents() {
    this.residents$ = this.residentService.getResidents();
  }

  onSearch(residentName: string) {
    this.residents$ = this.residentService.searchResidents(residentName);
  }

  editResidentDialog(resident: Resident) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';

    dialogConfig.data = resident;

    const dialogRef = this.dialog.open(HomeDialogComponent, dialogConfig);
    dialogRef.afterClosed()
      .pipe(
        filter(val => !!val),
        tap(() => this.residentChanged.emit())
      );
  }

}
