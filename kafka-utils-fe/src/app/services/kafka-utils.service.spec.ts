import { TestBed } from '@angular/core/testing';

import { KafkaUtilsService } from './kafka-utils.service';

describe('KafkaUtilsService', () => {
  let service: KafkaUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KafkaUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
