import { Component, OnInit } from "@angular/core";
import { Define } from "../common/define";
import { BnanService } from "../common/bnan.service";

@Component({
  selector: "app-usage",
  templateUrl: "./usage.page.html",
  styleUrls: ["./usage.page.scss"],
})
export class UsagePage implements OnInit {
  constructor(public bs: BnanService) { }

  ngOnInit() {
    if (this.bs.setting != null) {
      if (this.bs.setting.showUsage == false) {
        this.bs.setting.showUsage = true;
        this.bs.updateSetting();
      }
    }
  }

  ionViewWillEnter() {
    this.bs.selectedIndex = Define.PG_USAGE;
  }
}
