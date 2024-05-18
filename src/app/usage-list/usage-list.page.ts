import { Component, OnInit } from '@angular/core';
import { Define } from '../common/define';
import { BnanService } from '../common/bnan.service';

@Component({
  selector: 'app-usage-list',
  templateUrl: './usage-list.page.html',
  styleUrls: ['./usage-list.page.scss'],
})
export class UsageListPage {
  constructor(public bs: BnanService) {}

  ionViewWillEnter() {
    this.bs.selectedIndex = Define.PG_USAGE_LIST;
  }
}
