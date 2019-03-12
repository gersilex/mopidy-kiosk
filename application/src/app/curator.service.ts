import { TlTrack, Result } from './tl-track';
import { MopidyService } from './mopidy.service';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

class Rule {
  public readonly name: string;
  private readonly enabled = true;
  public violated$ = new Subject<boolean>();
  public readonly message: string;
  private timerID: any;
  public readonly intervalSeconds: number;

  constructor(name: string, intervalSeconds: number, callback: any) {
    this.name = name;
    console.log('Starting rule', this);

    this.intervalSeconds = intervalSeconds;
    if (intervalSeconds > 0) {
      this.timerID = setInterval(callback, intervalSeconds * 1000);
    }
    setTimeout(callback);
  }
}

class TracklistSizeRule extends Rule {
  maximumSize = 200;

  message = 'Tracklist reached maximum number of songs (' + this.maximumSize + ') in queue';

  constructor(private mopidy: MopidyService) {
    super('Tracklist Size', 10, () => {
      this.mopidy.post('core.tracklist.get_length', {}).then((data: { result: number }) => {
        this.violated$.next(data.result >= this.maximumSize ? true : false);
      });
    });
  }
}

class DefaultRadioStationRule extends Rule {
  uri = 'http://prem2.di.fm:80/futurebass_hi?' + environment.apiKeys.DiFmPremium;
  message = 'Default radio station will play until you add more songs to the tracklist';

  private track: TlTrack;

  constructor(private mopidy: MopidyService) {
    super('Default Radio Stream', 60, () => {
      // Get tracks excluding the default radio station
      this.mopidy.post('core.tracklist.get_tl_tracks').then((tracklist: { result: [TlTrack] }) => {
        const userTracks = tracklist.result.filter(track => track.track.uri !== this.uri);
        const containsDefaultRadioStationUri = tracklist.result.find(track => track.track.uri === this.uri);

        if (userTracks.length <= 1) {
          // only one or no user songs in tracklist
          this.violated$.next(true);
          if (!containsDefaultRadioStationUri) {
            this.mopidy.enqueueUri(this.uri);
          }
        } else {
          // at least 2 user songs in tracklist
          this.violated$.next(false);
          if (this.track.track.uri === this.uri) {
            // Skip the radio track if it is playing right now
            // Using 'next' on a stream is broken because of a gstreamer update
            // see https://discourse.mopidy.com/t/frustrating-playback-glitchy/2484
            // branch release-2.2 of Mopidy works fine (09-03-2019)
            this.mopidy.post('core.playback.next');
          } else {
            // Remove the radio track from the tracklist if it is not playing right now
            this.mopidy.post('core.tracklist.remove', { uri: [this.uri] });
          }
        }
      });
    });

    this.mopidy.track$.subscribe(data => {
      this.track = data.result;
    });
  }
}

class PlaybackStateRule extends Rule {
  constructor(private mopidy: MopidyService) {
    super('Playback Status', 4, () => {
      this.mopidy.post('core.playback.get_state').then((state: { result: string }) => {
        if (state.result === 'stopped') {
          mopidy.post('core.playback.play');
        }
      });
    });
  }
}

class TracklistSettingsRule extends Rule {
  constructor(private mopidy: MopidyService) {
    super('Tracklist Settings', 43, () => {
      this.mopidy.post('core.tracklist.set_consume', { value: true });
      this.mopidy.post('core.tracklist.set_random', { value: false });
      this.mopidy.post('core.tracklist.set_single', { value: false });
      this.mopidy.post('core.tracklist.set_repeat', { value: false });
    });
  }
}

class EnqueueBackoffRule extends Rule {
  backoff: number;
  backoffFactor = 3;

  message = 'New songs can be added after a delay to prevent spamming';
  lastAction: number;
  percentLeft$ = new Subject<number>();
  isDefaultRadioStationPlaying: boolean;

  constructor(private mopidy: MopidyService, private curator: CuratorService) {
    super('Enqueue Backoff', 1, () => {
      if (this.isDefaultRadioStationPlaying) { return; }

      let timeLeft = (this.lastAction + this.backoff) - Date.now();
      if (timeLeft < 0) { timeLeft = 0; }
      this.violated$.next(timeLeft > 0);
      this.percentLeft$.next((timeLeft / this.backoff) * 100);
    });

    this.curator.defaultRadioStationRule.violated$.subscribe(bool => {
      this.isDefaultRadioStationPlaying = bool;
    });

    this.mopidy.enqueueAction$.subscribe(() => {
      this.lastAction = Date.now();
    });

    this.mopidy.playlist$.subscribe((result: Result) => {
      this.backoff = result.result.length + Math.pow(result.result.length, this.backoffFactor);
      if (this.backoff < 20_000) { this.backoff = 20_000; }
    });
  }
}

@Injectable({
  providedIn: 'root'
})
export class CuratorService {
  public rules = new Array<Rule>();

  public readonly tracklistSizeRule = new TracklistSizeRule(this.mopidy);
  public readonly defaultRadioStationRule = new DefaultRadioStationRule(this.mopidy);
  public readonly playbackStateRule = new PlaybackStateRule(this.mopidy);
  public readonly tracklistSettingsRule = new TracklistSettingsRule(this.mopidy);
  public enqueueBackoffRule = new EnqueueBackoffRule(this.mopidy, this);

  constructor(private mopidy: MopidyService) {
    // Add rules that display messages here
    this.rules.push(this.tracklistSizeRule);
    this.rules.push(this.defaultRadioStationRule);
    this.rules.push(this.enqueueBackoffRule);
  }
}

