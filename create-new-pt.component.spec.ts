import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewPtComponent } from './create-new-pt.component';

describe('CreateNewPtComponent', () => {
  let component: CreateNewPtComponent;
  let fixture: ComponentFixture<CreateNewPtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateNewPtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewPtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
