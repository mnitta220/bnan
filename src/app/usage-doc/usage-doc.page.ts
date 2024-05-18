import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Define } from '../common/define';
import { BnanService } from '../common/bnan.service';

@Component({
  selector: 'app-usage-doc',
  templateUrl: './usage-doc.page.html',
  styleUrls: ['./usage-doc.page.scss'],
})
export class UsageDocPage {
  constructor(private router: Router, public bs: BnanService) {}

  ionViewWillEnter() {
    try {
      this.bs.selectedIndex = Define.PG_USAGE_DOC;
    } catch (e) {
      this.bs.logs.push('UsageDocPage.ionViewWillEnter Error! ' + e);
      this.router.navigate(['/error']);
    }
  }
}
