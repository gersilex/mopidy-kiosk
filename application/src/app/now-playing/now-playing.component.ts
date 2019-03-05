import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { MopidyService } from '../mopidy.service';

@Component({
  selector: 'app-now-playing',
  templateUrl: './now-playing.component.html',
  styleUrls: ['./now-playing.component.css']
})
export class NowPlayingComponent {

  constructor(public mopidy: MopidyService) { }
}


