import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidePaneComponent } from './side-pane.component';

describe('SidePaneComponent', () => {
  let component: SidePaneComponent;
  let fixture: ComponentFixture<SidePaneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidePaneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidePaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
