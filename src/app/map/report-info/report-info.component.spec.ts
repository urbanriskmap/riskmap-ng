import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportInfoComponent } from './report-info.component';

describe('ReportInfoComponent', () => {
  let component: ReportInfoComponent;
  let fixture: ComponentFixture<ReportInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
