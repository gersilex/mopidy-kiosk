import { Injectable } from '@angular/core';
import { Subject, Observable, Subscriber, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

interface Track {
  result: object;
}

@Injectable({
  providedIn: 'root'
})


export class MopidyService {
  JsonRpcUrl = 'http://lindaddy:6680/mopidy/rpc';

  track$ = new Subject<Track>();

  refreshTrack() {
    this.http.post(this.JsonRpcUrl, {
      method: 'core.playback.get_current_track',
      jsonrpc: '2.0',
      params: {},
      id: 1
    }).toPromise().then((data: Track) => {
      this.track$.next(data);
    });
  }

  constructor(private http: HttpClient) {
    setInterval(() => {
      this.refreshTrack();
    }, 2000);

    this.refreshTrack();
  }
}
