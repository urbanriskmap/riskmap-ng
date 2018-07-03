import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteInfoComponent } from './site-info.component';

describe('SiteInfoComponent', () => {
  let component: SiteInfoComponent;
  let fixture: ComponentFixture<SiteInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
