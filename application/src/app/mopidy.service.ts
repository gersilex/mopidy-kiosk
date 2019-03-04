import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

interface Result {
  result: object;
}

@Injectable({
  providedIn: 'root'
})


export class MopidyService {
  JsonRpcUrl = 'http://localhost:6680/mopidy/rpc';

  track$ = new Subject<Result>();
  playlist$ = new Subject<Result>();

  describeAPI() {
    this.http.post(this.JsonRpcUrl, {
      method: 'core.describe',
      jsonrpc: '2.0',
      params: {},
      id: 1
    }).toPromise().then((data: Result) => {
      console.log(data);
    });
  }

  refreshTrack() {
    this.http.post(this.JsonRpcUrl, {
      method: 'core.playback.get_current_track',
      jsonrpc: '2.0',
      params: {},
      id: 1
    }).toPromise().then((data: Result) => {
      this.track$.next(data);
    });
  }

  refreshPlaylist() {
    this.http.post(this.JsonRpcUrl, {
      method: 'core.tracklist.get_tracks',
      jsonrpc: '2.0',
      params: {},
      id: 1
    }).toPromise().then((data: Result) => {
      this.playlist$.next(data);
      console.log(data);
    });
  }

  constructor(private http: HttpClient) {
    this.describeAPI();

    this.refreshTrack();
    this.refreshPlaylist();

    setInterval(() => {
      this.refreshTrack();
      this.refreshPlaylist();
    }, 10000);

  }
}
