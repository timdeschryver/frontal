import { Component, Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError, switchMap, share } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { empty } from 'rxjs/observable/empty';
import { State, Action, StateChanges } from 'frontal';

interface User {
  id: number;
  login: string;
  score: number;
  avatar_url: string;
}

interface UserResponse {
  items: User[];
}

@Injectable()
export class GitHubService {
  getUsers(user: string): Observable<User[]> {
    return this.http.get<UserResponse>(`https://api.github.com/search/users?q=${user}`).pipe(
      map(f =>
        f.items.sort((a, b) => {
          if (a.score < b.score) {
            return -1;
          }
          if (a.score > b.score) {
            return 1;
          }
          return 0;
        }),
      ),
      catchError(_ => empty<User[]>()),
    );
  }
  constructor(private http: HttpClient) {}
}

@Component({
  selector: 'http-simple',
  template: `
    <frontal [itemToString]="userToString" [onChange]="onChange">
      <ng-template let-value="inputValue" let-open="open" let-highlightedIndex="highlightedIndex" let-selectedItem="selectedItem">
        <label frontalLabel>Select your user!</label>
        <input type="text" frontalInput/>

        <ul *ngIf="open" class="menu">
          <li *ngFor="let user of users | async; trackBy:trackUserById; let index=index;"
            [class.highlight]="highlightedIndex === index">
            <div frontalItem [value]="user">
              <img [src]="user.avatar_url" width="32"  [style.verticalAlign]="'middle'">
              {{user.login}}
            </div>
          </li>
        </ul>

        <h4>Selected user:</h4>
        <input type="hidden" id="selected" [value]="userToJson(selectedItem)">
        <pre>{{selectedItem | json}}</pre>
      </ng-template>
      </frontal>
  `,
})
export class HttpComponent implements OnInit {
  users: Observable<User[]>;
  query = new Subject<string>();

  constructor(private github: GitHubService) {}

  ngOnInit() {
    this.users = this.query.pipe(
      debounceTime(321),
      distinctUntilChanged(),
      switchMap(query => (query ? this.github.getUsers(query) : empty<User[]>())),
      catchError(_ => empty<User[]>()),
    );
  }

  trackUserById(index: number, user: User) {
    return user.id;
  }

  userToString(user: User) {
    return user.login;
  }

  userToJson(user: User) {
    return JSON.stringify(user);
  }

  onChange = (value: string) => {
    this.query.next(value);
  };
}
