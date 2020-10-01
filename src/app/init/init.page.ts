import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { BnanService } from "../common/bnan.service";

@Component({
  selector: "app-init",
  templateUrl: "./init.page.html",
  styleUrls: ["./init.page.scss"],
})
export class InitPage implements OnInit {
  constructor(private router: Router, private bs: BnanService) {}

  ngOnInit() {}

  ionViewWillEnter() {
    try {
      setTimeout(() => {
        this.load().catch((e) => {
          this.bs.logs.push("InitPage.load Error! " + e);
          this.router.navigate(["/error"]);
        });
      }, 1500);
    } catch (e) {
      this.bs.logs.push("InitPage.ngOnInit Error! " + e);
      this.router.navigate(["/error"]);
    }
  }

  async load() {
    try {
      this.bs.logs.push("InitPage.load");
      await this.bs.getSetting();

      if (this.bs.setting.showUsage == false) {
        this.router.navigate(["/usage"]);
      } else if (
        this.bs.setting.curDoc == null ||
        this.bs.setting.curDoc.id == -1
      ) {
        this.router.navigate(["/doc-list"]);
      } else {
        await this.bs.setCurrentDoc(this.bs.setting.curDoc.id);

        if (this.bs.setting.curDoc == null) {
          this.router.navigate(["/doc-list"]);
        } else {
          this.router.navigate(["/doc-view"]);
        }
      }
    } catch (e) {
      this.bs.logs.push("InitPage.load Error! " + e);
      this.router.navigate(["/error"]);
    }
  }
}
