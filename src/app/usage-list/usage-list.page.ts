import { Component, OnInit } from "@angular/core";
import { Define } from "../common/define";
import { BnanService } from "../common/bnan.service";

@Component({
  selector: "app-usage-list",
  templateUrl: "./usage-list.page.html",
  styleUrls: ["./usage-list.page.scss"],
})
export class UsageListPage implements OnInit {
  constructor(public bs: BnanService) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.bs.selectedIndex = Define.PG_USAGE_LIST;
  }
}
