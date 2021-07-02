import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Resident} from "../model/resident";
import {ResidentService} from "../service/residentService";
import {Observable} from "rxjs";

@Component({
  selector: 'app-home-dialog',
  templateUrl: './home-dialog.component.html',
  styleUrls: ['./home-dialog.component.scss']
})
export class HomeDialogComponent implements OnInit {


  residents$: Observable<Resident[]>;
  formEdit: FormGroup;
  formQuoteAssignee: FormGroup;
  resident: Resident;
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<HomeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) resident: Resident,
    private residentService: ResidentService
  ) {
    this.residents$ = this.residentService.getResidents();
    this.resident = resident;
    this.formEdit = fb.group({
      firstname: [resident.firstname, Validators.required],
      surname: [resident.surname],
      gender: [resident.gender],
      username: [resident.username],
      address: [resident.address],
      quote: [resident.quote],
    });
    this.formQuoteAssignee = fb.group({
      id: [this.residents$]
    })
  }

  ngOnInit(): void {}

  close() {
    this.dialogRef.close();
  }

  save() {
    const residentChanges = this.formEdit.value;
    const residentQuoteAssigned = this.formQuoteAssignee.value;

    this.residentService.updateResident(this.resident.id, residentChanges, residentQuoteAssigned.id)
      .subscribe()
    this.dialogRef.close(residentChanges);

  }
}
