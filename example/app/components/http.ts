import { Component, Injectable, ChangeDetectionStrategy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, catchError, switchMap } from 'rxjs/operators';
import { State, Action, StateChanges } from 'frontal';

@Injectable()
export class GitHubService {
  getUsers(user: string): Observable<User[]> {
    return this.http
      .get<UserResponse>(`https://api.github.com/search/users?q=${user}`)
      .pipe(map(u => u.items), catchError(_ => of<User[]>()));
  }
  constructor(private http: HttpClient) {}
}

@Component({
  selector: 'frontal-http',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <frontal [itemToString]="userToString" on-change="onChange($event)">
      <ng-template let-value="inputValue" let-isOpen="isOpen" let-highlightedIndex="highlightedIndex" let-selectedItem="selectedItem" let-itemCount="itemCount">
        <label frontalLabel>Select a user:</label>
        <input type="text" frontalInput/>

        <ng-container *ngIf="isOpen">
          <div>
            Users found: {{itemCount}}
          </div>

          <ul frontalList>
            <li *ngFor="let user of users | async; trackBy:trackUserById; let index=index;"
              [class.highlight]="highlightedIndex === index">
              <div frontalItem [value]="user">
                <img [src]="user.avatar_url" width="32"  [style.verticalAlign]="'middle'">
                {{user.login}}
              </div>
            </li>
          </ul>
        </ng-container>

        <h4>Selected user:</h4>
        <pre data-test="selected-item">{{selectedItem | json}}</pre>
      </ng-template>
      </frontal>
  `,
})
export class HttpComponent {
  query = new Subject<string>();
  users: Observable<User[]> = this.query.pipe(
    debounceTime(321),
    distinctUntilChanged(),
    switchMap(query => (query ? this.github.getUsers(query) : of<User[]>())),
    catchError(_ => of<User[]>()),
  );

  constructor(private github: GitHubService) {}

  trackUserById(index: number, user: User) {
    return user.id;
  }

  userToString(user: User) {
    return user.login;
  }

  userToJson(user: User) {
    return JSON.stringify(user);
  }

  onChange(value: string) {
    this.query.next(value);
  }
}

interface User {
  id: number;
  login: string;
  score: number;
  avatar_url: string;
}

interface UserResponse {
  items: User[];
}
