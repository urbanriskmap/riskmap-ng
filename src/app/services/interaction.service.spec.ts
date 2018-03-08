import { TestBed, inject } from '@angular/core/testing';

import { InteractionService } from './interaction.service';

describe('InteractionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InteractionService]
    });
  });

  it('should be created', inject([InteractionService], (service: InteractionService) => {
    expect(service).toBeTruthy();
  }));
});
