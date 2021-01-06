import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InlineSVGModule } from 'ng-inline-svg';

import { QuestionHintComponent } from './question-hint.component';

describe('QuestionHintComponent', () => {
  let component: QuestionHintComponent;
  let fixture: ComponentFixture<QuestionHintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QuestionHintComponent],
      imports: [HttpClientModule, InlineSVGModule.forRoot(), MatTooltipModule],
    }).compileComponents();
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
