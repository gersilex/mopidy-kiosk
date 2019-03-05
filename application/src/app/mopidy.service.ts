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
  JsonRpcUrl = 'http://lindaddy:6680/mopidy/rpc';

  connectionFailure = true;

  track$ = new Subject<Result>();
  playlist$ = new Subject<Result>();

  connect() {
    this.http.post(this.JsonRpcUrl, {
      method: 'core.describe',
      jsonrpc: '2.0',
      params: {},
      id: 1
    }).toPromise().then((data: Result) => {
      this.connectionFailure = false;
      console.log(data);
    }).catch(err => {
      console.error(err);
    });

    // Set up the required tracklist configuration
    this.http.post(this.JsonRpcUrl, {
      method: 'core.tracklist.set_consume',
      jsonrpc: '2.0',
      params: { value: true },
      id: 1
    }).toPromise();
    this.http.post(this.JsonRpcUrl, {
      method: 'core.tracklist.set_random',
      jsonrpc: '2.0',
      params: { value: false },
      id: 1
    }).toPromise();
    this.http.post(this.JsonRpcUrl, {
      method: 'core.tracklist.set_single',
      jsonrpc: '2.0',
      params: { value: false },
      id: 1
    }).toPromise();
    this.http.post(this.JsonRpcUrl, {
      method: 'core.tracklist.set_repeat',
      jsonrpc: '2.0',
      params: { value: false },
      id: 1
    }).toPromise();
  }

  refreshTrack() {
    this.http.post(this.JsonRpcUrl, {
      method: 'core.playback.get_current_tl_track',
      jsonrpc: '2.0',
      params: {},
      id: 1
    }).toPromise().then((data: Result) => {
      this.track$.next(data);
    }).catch(() => {
      this.connectionFailure = true;
    });
  }

  refreshPlaylist() {
    this.http.post(this.JsonRpcUrl, {
      method: 'core.tracklist.get_tl_tracks',
      jsonrpc: '2.0',
      params: {},
      id: 1
    }).toPromise().then((data: Result) => {
      this.playlist$.next(data);
    }).catch(() => {
      this.connectionFailure = true;
    });
  }

  constructor(private http: HttpClient) {
    this.connect();
    this.refreshPlaylist();
    this.refreshTrack();

    setInterval(() => {
      if (this.connectionFailure) {
        this.connect();
      } else {
        this.refreshPlaylist();
        this.refreshTrack();
      }
    }, 2000);
  }
}
