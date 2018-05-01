import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class NotificationService {
  // Observable source
  notificationObservable = new BehaviorSubject<{
    msg: string,
    type: 'info' | 'warn' | 'error',
    skipNotification?: boolean
  }>({
    msg: null,
    type: null,
    skipNotification: true
  });

  // Observable stream
  message = this.notificationObservable.asObservable();

  constructor() {}

  notify(
    msg: string,
    type: 'info' | 'warn' | 'error'
  ) {
    this.notificationObservable.next({
      msg: msg,
      type: type
    });
  }
}
