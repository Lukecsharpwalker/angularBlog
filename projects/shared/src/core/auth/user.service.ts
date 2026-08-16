import {
  Injectable,
} from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { UserWithRole } from '@shared/core/auth/user.model';
import { Roles } from '@shared/core/auth/roles';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly appUser = new BehaviorSubject<UserWithRole | null | undefined>(undefined);

  get appUser$(): Observable<UserWithRole | null> {
    return this.appUser.asObservable().pipe(filter(user => user !== undefined));
  }

  get userRole$(): Observable<Roles | undefined> {
    return this.appUser.pipe(map(user => user?.app_metadata?.role));
  }

  setAppUser(user: UserWithRole | null): void {
    this.appUser.next(user);
  }
}
