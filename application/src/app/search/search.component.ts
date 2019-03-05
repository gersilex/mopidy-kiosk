import { Component } from '@angular/core';
import { MopidyService } from '../mopidy.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {

  constructor(public mopidy: MopidyService) { }

}
