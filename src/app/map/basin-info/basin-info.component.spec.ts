import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasinInfoComponent } from './basin-info.component';

describe('BasinInfoComponent', () => {
  let component: BasinInfoComponent;
  let fixture: ComponentFixture<BasinInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasinInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasinInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
