import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Subscription }   from 'rxjs';

// import { PianoNote } from '../core/piano-note';
import { QuizService } from 'src/app/Services/quiz.service';
import { QuizStatus } from 'src/app/core/quiz-status.enum';
import { ServerHttpService } from '../Services/server-http.service';
import { Lessons } from '../models/products/lessons';

@Component({
  selector: 'quiz-info',
  templateUrl: './quiz-info.component.html',
  styleUrls: ['./quiz-info.component.css'],
})
export class QuizInfoComponent implements OnInit {
  QuizStatus = QuizStatus; // allows template access to QuizStatus enum
  @Input() correct: number;
  @Input() incorrect: number;
  @Input() total: number;
  @Input() status: QuizStatus;
  @Input() description: string;
  @Output() buttonClicked = new EventEmitter();
  subscription: Subscription;
  message: string;
  lesson_id: number[] = new Array();
  lesson_title: string[] = new Array();
  public lessons: Lessons [] = [];

  constructor(private quizService: QuizService, private serverHttp: ServerHttpService) {
    this.subscription = quizService.quizResult$.subscribe(
      result => {
        if(result.selectedKeyId == result.actualNote.keyId){
          this.message = "\u2714 Correct, well done!";
        }
        else {
          this.message = "\u2718 Incorrect";
        }
    });
  }

  ngOnInit() {
    this.serverHttp.getLessons().subscribe((data) =>  {
      this.lessons = data;
      for(let d of data) {
        this.lesson_id.push(d['lesson_id'])
        this.lesson_title.push(d['lesson_title'])
      }
      // console.log(this.lesson_id)
      // console.log(this.lesson_title)
    });
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }

  handleStartBtnClick(value: string) {
     this.buttonClicked.emit( {button:'start', level:value} );
  }

  handleTryAgainBtnClick() {
     this.buttonClicked.emit( {button:'try-again'} );
     this.message = "";
  }

  public getLessonIdMappingTitle(): Object {
    var result = {};
    this.lesson_title.forEach((key, i) => result[key] = this.lesson_id[i]);
    return result;
  }

}
