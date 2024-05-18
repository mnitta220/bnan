import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Device } from '@capacitor/device';
import { Define } from '../common/define';
import { BnanService } from '../common/bnan.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
  version = Define.VERSION;
  device = '';
  os = '';

  constructor(private router: Router, public bs: BnanService) {}

  ngOnInit() {
    this.getDev();
  }

  ionViewWillEnter() {
    this.bs.selectedIndex = Define.PG_ABOUT;
  }

  async getDev() {
    const info = await Device.getInfo();
    this.device = info.model;
    this.os = info.operatingSystem + ' ' + info.osVersion;
  }

  async initialize() {
    try {
      const result = window.confirm(
        'データを初期化してもよろしいですか？（ご自身で登録された文書がすべて削除されます。）'
      );

      if (result && this.bs.setting) {
        await this.bs.initSetting();
        window.alert('データが初期化されました。');
        this.bs.setting.showUsage = true;
        this.bs.updateSetting();
      }
    } catch (e) {
      this.bs.logs.push('AboutPage.initialize Error! ' + e);
      this.router.navigate(['/error']);
    }
  }
}
