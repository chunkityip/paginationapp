import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { map, startWith, catchError } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ApiResponse } from './interface/api-response';
import { Page } from './interface/page';
import { UserService } from './service/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


//With "strictPropertyInitialization": false, "strictNullChecks": false, the initializer error is gone
export class AppComponent implements OnInit {
  usersState$: Observable<{ appState: string; appData?: ApiResponse<Page>; error?: HttpErrorResponse; }>;
  responseSubject = new BehaviorSubject<ApiResponse<Page>>(null);

  //Define a constrcutor with dependency injection
  constructor(private userSevice: UserService) { }

  ngOnInit(): void {
    this.usersState$ = this.userSevice.users$().pipe(
      map((response: ApiResponse<Page>) => {
        this.responseSubject.next(response);
        console.log(response);
        return ({ appState: 'App_LOADED ', appData: response });
      }
      ),
      startWith({ appState: 'App_LOADING' }),
      catchError((error: HttpErrorResponse) => of({ appState: 'APP_ERROR ', error }))
    )
  }


  gotToPage(name?: string, pageNumber: number = 0): void {
    this.usersState$ = this.userSevice.users$(name , pageNumber).pipe(
      map((response: ApiResponse<Page>) => {
        console.log(response);
        return ({ appState: 'App_LOADED ', appData: response });
      }
      ),
      startWith({ appState: 'App_LOADED' , appDate: this.responseSubject.value }),
      catchError((error: HttpErrorResponse) => of({ appState: 'APP_ERROR ', error }))
    )
  }
}
