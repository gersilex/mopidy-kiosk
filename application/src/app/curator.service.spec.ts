import { TestBed } from '@angular/core/testing';

import { CuratorService } from './curator.service';

describe('CuratorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CuratorService = TestBed.get(CuratorService);
    expect(service).toBeTruthy();
  });
});
