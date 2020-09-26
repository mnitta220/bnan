import { Component, OnInit } from "@angular/core";
import { BnanService } from "../common/bnan.service";

@Component({
  selector: "app-error",
  templateUrl: "./error.page.html",
  styleUrls: ["./error.page.scss"],
})
export class ErrorPage implements OnInit {
  message = "";

  constructor(private bs: BnanService) {}

  ngOnInit() {}

  ionViewWillEnter() {
    if (this.bs.logs.length > 0) {
      this.message = this.bs.logs[this.bs.logs.length - 1];
    } else {
      this.message = "";
    }
  }
}
