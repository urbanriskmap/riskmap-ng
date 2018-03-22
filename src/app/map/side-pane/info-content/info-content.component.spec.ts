import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoContentComponent } from './info-content.component';

describe('InfoContentComponent', () => {
  let component: InfoContentComponent;
  let fixture: ComponentFixture<InfoContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
