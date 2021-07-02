import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {tap} from "rxjs/operators";
import { MessagesService } from './messages.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  showMessage = false;
  errors$!: Observable<string[]>;

  constructor(public messageService: MessagesService) {}

  ngOnInit() {
    this.errors$ = this.messageService.error$
      .pipe(
        tap(() => this.showMessage = true)
      );
  }

  onClose() {
    this.showMessage = false;
  }
}
