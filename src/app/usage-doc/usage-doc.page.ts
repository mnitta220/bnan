import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Define } from "../common/define";
import { BnanService } from "../common/bnan.service";

@Component({
  selector: "app-usage-doc",
  templateUrl: "./usage-doc.page.html",
  styleUrls: ["./usage-doc.page.scss"],
})
export class UsageDocPage implements OnInit {
  /*
  source = {
    border: "solid 1px #b0b0b0",
    backgroundColor: "#f0f0f0",
    padding: "4px 5px 2px 5px",
    margin: "0 2px 3px 2px",
  };
  */

  constructor(private router: Router, private bs: BnanService) {}

  ngOnInit() {}

  ionViewWillEnter() {
    try {
      this.bs.selectedIndex = Define.PG_USAGE_DOC;
      /*
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

      if (prefersDark.matches) {
        // ダークモード
        this.source.border = "solid 1px #777777";
        this.source.backgroundColor = "#282828";
      } else {
        this.source.border = "solid 1px #b0b0b0";
        this.source.backgroundColor = "#f0f0f0";
      }
      */
    } catch (e) {
      this.bs.logs.push("UsageDocPage.ionViewWillEnter Error! " + e);
      this.router.navigate(["/error"]);
    }
  }
}
