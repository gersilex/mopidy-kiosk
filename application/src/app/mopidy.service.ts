import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface Result {
  result: object;
  error: object;
}

@Injectable({
  providedIn: 'root'
})


export class MopidyService {
  JsonRpcUrl = 'http://lindaddy:6680/mopidy/rpc';

  connectionFailure = true;

  searchQuery$ = new Subject<string>();
  track$ = new Subject<Result>();
  playlist$ = new Subject<Result>();
  searchResults$ = new Subject<Result>();

  post(method: string, params = {}) {
    return this.http.post(this.JsonRpcUrl, {
      method,
      jsonrpc: '2.0',
      params,
      id: 1
    }).toPromise();
  }

  connect() {
    this.post('core.describe', {}).then((data: Result) => {
      console.log('Mopidy API', data);
      this.connectionFailure = false;
      this.refresh();
      this.post('core.tracklist.set_consume', { value: true });
      this.post('core.tracklist.set_random', { value: false });
      this.post('core.tracklist.set_single', { value: false });
      this.post('core.tracklist.set_repeat', { value: false });
    }).catch(err => {
      console.error(err);
    });

  }

  refresh() {
    this.post('core.playback.get_current_tl_track').then((data: Result) => {
      this.track$.next(data);
      console.log(data);

    }).catch(() => {
      this.connectionFailure = true;
    });
    this.post('core.tracklist.get_tl_tracks').then((data: Result) => {
      this.playlist$.next(data);
    }).catch(() => {
      this.connectionFailure = true;
    });
  }

  searchContainsAny(query: string) {
    if (query === undefined) {
      return;
    }
    if (query === '') {
      return;
    }
    this.post('core.library.search', {
      query: { any: [query] }
    }).then((data: Result) => {
      this.searchResults$.next(data);
    }).catch((err) => {
      this.connectionFailure = true;
      console.error(err);
    });
  }

  enqueueUri(uri: string) {
    return this.post('core.tracklist.add', { uri });
  }

  constructor(private http: HttpClient) {
    this.connect();

    setInterval(() => {
      if (this.connectionFailure) {
        this.connect();
      } else {
        this.refresh();
      }
    }, 10000);

    this.searchQuery$
      .pipe(debounceTime(1000))
      .pipe(distinctUntilChanged())
      .subscribe(query => {
        this.searchContainsAny(query);
      });
  }
}
