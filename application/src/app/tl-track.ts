export interface Result {
  result: [TlTrack];
  error: object;
}

export interface SingleResult {
  result: TlTrack;
  error: object;
}

export interface TlTrack {
  track: {
    uri: string
  };
}
