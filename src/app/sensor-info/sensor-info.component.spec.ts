import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorInfoComponent } from './sensor-info.component';

describe('SensorInfoComponent', () => {
  let component: SensorInfoComponent;
  let fixture: ComponentFixture<SensorInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SensorInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
