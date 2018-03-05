import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaInfoComponent } from './area-info.component';

describe('AreaInfoComponent', () => {
  let component: AreaInfoComponent;
  let fixture: ComponentFixture<AreaInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
