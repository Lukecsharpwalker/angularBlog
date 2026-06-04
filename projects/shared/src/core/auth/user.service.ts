import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { UserWithRole } from '@shared/core/auth/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly appUser = new BehaviorSubject<UserWithRole | null | undefined>(undefined);

  get appUser$(): Observable<UserWithRole | null> {
    return this.appUser.asObservable().pipe(filter(user => user !== undefined));
  }

  setAppUser(user: UserWithRole | null): void {
    this.appUser.next(user);
  }
}
