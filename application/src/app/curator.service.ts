import { MopidyService } from './mopidy.service';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

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
    this.timerID = setInterval(callback, intervalSeconds * 1000);
    setTimeout(callback);
  }
}

class TracklistSizeRule extends Rule {
  maximumSize = 3;
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
  uri = '';
}

@Injectable({
  providedIn: 'root'
})
export class CuratorService {
  public rules = new Array<Rule>();

  public readonly tracklistSizeRule = new TracklistSizeRule(this.mopidy);

  constructor(private mopidy: MopidyService) {
    this.rules.push(this.tracklistSizeRule);
  }
}

