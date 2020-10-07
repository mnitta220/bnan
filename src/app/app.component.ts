import { Component, OnInit, Input } from "@angular/core";
import { Router } from "@angular/router";
import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { Define } from "./common/define";
import { BnanService } from "./common/bnan.service";
import { Plugins } from "@capacitor/core";

const { AdMob } = Plugins;

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
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

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private bs: BnanService
  ) {
    this.initializeApp();

    /* */
    const options = {
      requestTrackingAuthorization: false,
    };

    AdMob.initialize(options);
    /**/
    //AdMob.initialize();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {}

  menuClick(idx: number) {
    //console.log("***menuClick: idx=" + idx);
    switch (idx) {
      case Define.PG_LIST:
        this.router.navigate(["/doc-list"]);
        break;
      case Define.PG_VIEW:
        this.router.navigate(["/doc-view"]);
        break;
      case Define.PG_USAGE:
        this.router.navigate(["/usage"]);
        break;
      case Define.PG_USAGE_LIST:
        this.router.navigate(["/usage-list"]);
        break;
      case Define.PG_USAGE_DOC:
        this.router.navigate(["/usage-doc"]);
        break;
      case Define.PG_USAGE_VIEW:
        this.router.navigate(["/usage-view"]);
        break;
      case Define.PG_UNLOCK:
        this.router.navigate(["/unlock"]);
        break;
      case Define.PG_ABOUT:
        this.router.navigate(["/about"]);
        break;
      default:
        this.router.navigate(["/doc-list"]);
    }
  }
}
