import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';
import { Define } from './common/define';
import { BnanService } from './common/bnan.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  @Input()
  set showCurrent(p: boolean) {}

  get showCurrent() {
    return this.bs.showCurrent;
  }

  @Input()
  set currentName(name: string) {}

  get currentName() {
    return this.bs.currentName;
  }

  @Input()
  set selectedIndex(idx: number) {
    this.bs.selectedIndex = idx;
  }

  get selectedIndex() {
    return this.bs.selectedIndex;
  }

  @Input()
  get disableZoomUp(): boolean {
    return this.bs.disableZoomUp;
  }

  @Input()
  get disableZoomDown(): boolean {
    return this.bs.disableZoomDown;
  }

  constructor(
    private platform: Platform,
    private router: Router,
    private bs: BnanService
  ) {
    this.initializeApp();

    const options = {
      requestTrackingAuthorization: false,
    };
  }

  initializeApp() {
    this.platform.ready().then(() => {
      SplashScreen.hide();
    });
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit() {}

  menuClick(idx: number) {
    switch (idx) {
      case Define.PG_LIST:
        this.router.navigate(['/doc-list']);
        break;
      case Define.PG_VIEW:
        this.router.navigate(['/doc-view']);
        break;
      case Define.PG_USAGE:
        this.router.navigate(['/usage']);
        break;
      case Define.PG_USAGE_LIST:
        this.router.navigate(['/usage-list']);
        break;
      case Define.PG_USAGE_DOC:
        this.router.navigate(['/usage-doc']);
        break;
      case Define.PG_USAGE_VIEW:
        this.router.navigate(['/usage-view']);
        break;
      case Define.PG_ABOUT:
        this.router.navigate(['/about']);
        break;
      default:
        this.router.navigate(['/doc-list']);
    }
  }

  zoomText(val: number) {
    this.bs.zoomText(val);
  }
}
