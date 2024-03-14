import { Injectable } from '@angular/core';
import {observable, Observable, Subject} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MessageService {
  private subject = new Subject<any>();


  sendMessage(message: string) {
    console.log("Nous voici")
    this.subject.next({ text: message });
    this.subject.asObservable().subscribe(
      response =>console.log(response)
    )
    console.log(message)
  }
  clearMessages() {
    this.subject.next();
  }
  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
