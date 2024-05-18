import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BnanService } from '../common/bnan.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.page.html',
  styleUrls: ['./error.page.scss'],
})
export class ErrorPage {
  message = '';

  constructor(private router: Router, private bs: BnanService) {}

  ionViewWillEnter() {
    if (this.bs.logs.length > 0) {
      this.message = this.bs.logs[this.bs.logs.length - 1];
      if (this.message.indexOf('undefined') > 0) {
        if (this.bs.retryCount < 3) {
          this.bs.retryCount++;
          this.router.navigate(['/init']);
        }
      }
    } else {
      this.message = '';
    }
  }
}
