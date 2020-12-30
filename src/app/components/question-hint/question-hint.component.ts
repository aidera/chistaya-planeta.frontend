import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-question-hint',
  templateUrl: './question-hint.component.html',
  styleUrls: ['./question-hint.component.scss']
})
export class QuestionHintComponent implements OnInit {
  @Input() description: string;

  constructor() { }

  ngOnInit(): void {
  }

}
