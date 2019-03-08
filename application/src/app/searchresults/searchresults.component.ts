import { Component, OnInit } from '@angular/core';
import { MopidyService } from '../mopidy.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-searchresults',
  templateUrl: './searchresults.component.html',
  styleUrls: ['./searchresults.component.css']
})
export class SearchresultsComponent implements OnInit {

  constructor(public mopidy: MopidyService, private snackbar: MatSnackBar) { }

  ngOnInit() {
  }

  enqueueTrack(track: any) {
    this.mopidy.enqueueUri(track.uri).then(() => {
      this.mopidy.refresh();
      this.mopidy.searchQuery$.next();
    });
    this.snackbar.open('Added ' + track.name,
      undefined,
      {
        duration: 10000,
        verticalPosition: 'top',
        horizontalPosition: 'left'
      });
  }
}
