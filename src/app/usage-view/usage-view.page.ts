import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Define } from '../common/define';
import { BnanService } from '../common/bnan.service';

@Component({
  selector: 'app-usage-view',
  templateUrl: './usage-view.page.html',
  styleUrls: ['./usage-view.page.scss'],
})
export class UsageViewPage {
  isIos = false;

  constructor(private router: Router, public bs: BnanService) {}

  ionViewWillEnter() {
    this.isIos = this.bs.isIos;
    try {
      this.bs.selectedIndex = Define.PG_USAGE_VIEW;
    } catch (e) {
      this.bs.logs.push('UsageViewPage.ionViewWillEnter Error! ' + e);
      this.router.navigate(['/error']);
    }
  }
}
