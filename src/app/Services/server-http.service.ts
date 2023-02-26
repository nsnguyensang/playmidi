import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError} from 'rxjs/operators';
import { QuizInfoComponent } from '../quiz-info/quiz-info.component';


@Injectable({
  providedIn: 'root'
})

export class ServerHttpService {

  constructor(private httpClient: HttpClient, private router: Router,) { }

  private REST_API_SERVER = 'http://34.101.62.222:9090';
  quizInfo: QuizInfoComponent;

  userLogin(data): Observable<any> {
    const url = `${this.REST_API_SERVER}/user/login`;
    return this.httpClient
      .post<any>(url, data)
      .pipe(catchError(this.handleError));
}

  getProducts(): Observable<any> {
    const customer_id = localStorage.getItem('id')
    const url = `${this.REST_API_SERVER}/user/products?customer_id=${customer_id}`;
    const cc = localStorage.getItem('cookie')
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'check': cc,
      })
    };
    if(cc) {
      return this.httpClient
        .get<any>(url, httpOptions)
        .pipe(catchError(this.handleError));
    }
  }

  getLessons(): Observable<any> {
    const customer_id = localStorage.getItem('id')
    const url = `${this.REST_API_SERVER}/user/lessons?user_id=${customer_id}`;
    const cc = localStorage.getItem('cookie')
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // 'Authorzation': ''
        'check': cc,
      })
    };
    if(cc) {
    return this.httpClient
      .get<any>(url,httpOptions)
      .pipe(catchError(this.handleError));
    }
  }

  getLessonsContent(lesson_id: number): Observable<any> {
    // const lesson_content = "g4,d4,a4s/b4f,c5,d4s/e4f,f4s/g4f,a4,d4,g4s/a4f,b5,b4,d4,g4,d5s/e5f";
    // return lesson_content;
    const customer_id = localStorage.getItem('id')
    // const lesson_id = localStorage.getItem('lesson_id');
    
    
    const url = `${this.REST_API_SERVER}/user/lesson_content?user_id=${customer_id}&lesson_id=${lesson_id}`;
    const cc = localStorage.getItem('cookie')
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // 'Authorzation': ''
        'check': cc,
      })
    };
    if(cc) {
      return this.httpClient
        .get<any>(url,httpOptions)
        .pipe(catchError(this.handleError));
    }
  }

  logoutUser() {
    localStorage.removeItem('cookie')
    this.router.navigate(['/loginForm'])
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
