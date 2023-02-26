import { Component, OnInit } from '@angular/core';
import { Lessons } from '../models/products/lessons';

import { ServerHttpService } from '../Services/server-http.service';


@Component({
  selector: 'app-lession',
  templateUrl: './lession.page.html',
  styleUrls: ['./lession.page.scss'],
})
export class LessionPage implements OnInit {
  public lessons: Lessons[] = [];
  // public lesson_content = "g4,d4,a4s/b4f,c5,d4s/e4f,f4s/g4f,a4,d4,g4s/a4f,b5,b4,d4,g4,d5s/e5f";
  constructor(private serverHttp: ServerHttpService) { }

  ngOnInit() {
    this.serverHttp.getLessons().subscribe((data) =>  {
      this.lessons = data;
      localStorage.setItem('lesson_id',data['lesson_id'])
      // console.log(data.lesson_id)
    });
  }
}
