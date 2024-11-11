import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private userSource = new BehaviorSubject<any>(null); // Inicializamos con null
  currentUser = this.userSource.asObservable();
  user : string = "";
  constructor() {}

  setUser(user: any) {
    this.userSource.next(user);
    this.user = user;
  }

  getUser()
  {
    return this.user
  }

  getUserNow(): Observable<any> {
    return this.currentUser;

  }

}
