import { CuratorService } from './curator.service';
import { MopidyService } from './mopidy.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Mopidy Kiosk';

  constructor(public mopidy: MopidyService, private curator: CuratorService) {
  }
}
