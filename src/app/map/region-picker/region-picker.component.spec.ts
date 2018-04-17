import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionPickerComponent } from './region-picker.component';

describe('RegionPickerComponent', () => {
  let component: RegionPickerComponent;
  let fixture: ComponentFixture<RegionPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegionPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegionPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
