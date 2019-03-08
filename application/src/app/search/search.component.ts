import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MopidyService } from '../mopidy.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  @ViewChild('search') private searchElement: any;
  constructor(public mopidy: MopidyService) { }

  value: string;
  changed() {
    this.mopidy.searchQuery$.next(this.value);
  }

  ngOnInit(): void {
    this.mopidy.searchQuery$
      .pipe(debounceTime(3 * 60000))
      .pipe(distinctUntilChanged())
      .subscribe(() => {
        this.value = '';
        this.searchElement.nativeElement.blur();
        this.mopidy.searchQuery$.next();
      });
  }
}
