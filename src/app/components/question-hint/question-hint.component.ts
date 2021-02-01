import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-question-hint',
  templateUrl: './question-hint.component.html',
  styleUrls: ['./question-hint.component.scss'],
})
export class QuestionHintComponent {
  @Input() description: string;
}
