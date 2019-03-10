import { CuratorService } from './../curator.service';
import { Component, OnInit } from '@angular/core';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  value: number;

  constructor(public curator: CuratorService) { }

  ngOnInit() {
    this.curator.enqueueBackoffRule.percentLeft$
      .pipe(distinctUntilChanged())
      .subscribe(percent => this.value = percent);
  }

}
