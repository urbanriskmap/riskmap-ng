import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgreementAndPolicyComponent } from './agreement-and-policy.component';

describe('AgreementAndPolicyComponent', () => {
  let component: AgreementAndPolicyComponent;
  let fixture: ComponentFixture<AgreementAndPolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgreementAndPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgreementAndPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
