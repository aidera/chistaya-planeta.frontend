import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionHintComponent } from './question-hint.component';

describe('QuestionHintComponent', () => {
  let component: QuestionHintComponent;
  let fixture: ComponentFixture<QuestionHintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionHintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionHintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
