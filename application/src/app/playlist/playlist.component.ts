import { MopidyService } from './../mopidy.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {

  constructor(private mopidy: MopidyService) { }

  ngOnInit() {
  }

}
