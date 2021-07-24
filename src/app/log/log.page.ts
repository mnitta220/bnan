import { Component, Input, OnInit } from "@angular/core";
//import { ToastController } from "@ionic/angular";
import { Clipboard } from '@capacitor/clipboard';
import { BnanService } from "../common/bnan.service";

@Component({
  selector: "app-log",
  templateUrl: "./log.page.html",
  styleUrls: ["./log.page.scss"],
})
export class LogPage implements OnInit {
  constructor(/*private tc: ToastController,*/ private bs: BnanService) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.logs.push("LogPage.ionViewWillEnter");
  }

  @Input()
  get logs() {
    return this.bs.logs;
  }

  clear() {
    this.bs.logs = [];
  }

  copy() {
    let log = "=====\n";
    for (let i = 0; i < this.bs.logs.length; i++) {
      log += this.bs.logs[i] + "\n=====\n";
    }
    Clipboard.write({
      string: log,
    })
      .then(() => window.alert("クリップボードにコピーしました。"))
      //.then(() => this.copyToast())
      .catch((error) => {
        alert(`${error.message}`);
      });
  }

  /*
  async copyToast() {
    window.alert("クリップボードにコピーしました。");

    const toast = await this.tc.create({
      color: "dark",
      message: "クリップボードにコピーしました。",
      duration: 2000,
    });
    toast.present();
  }
  */

  async initialize() {
    const result = window.confirm("データを初期化してもよろしいですか？");

    if (result) {
      await this.bs.dropAll();
      window.alert("データが初期化されました。アプリを終了してください。");
    }
  }
}
