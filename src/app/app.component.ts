import { Component, OnInit, Input } from "@angular/core";
import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { BnanService } from "./common/bnan.service";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent implements OnInit {
  //public selectedIndex = 0;
  public appPages = [
    {
      title: "文書一覧",
      url: "/doc-list",
      icon: "list",
      indent: false,
    },
    {
      title: "使い方",
      url: "/usage",
      icon: "leaf",
      indent: false,
    },
    {
      title: "文書一覧画面",
      url: "/usage-list",
      icon: "leaf",
      indent: true,
    },
    {
      title: "文書登録画面",
      url: "/usage-doc",
      icon: "leaf",
      indent: true,
    },
    {
      title: "文書表示画面",
      url: "/usage-view",
      icon: "leaf",
      indent: true,
    },
    {
      title: "広告の解除",
      url: "/unlock",
      icon: "card",
      indent: false,
    },
    {
      title: "このアプリについて",
      url: "/about",
      icon: "information-circle",
      indent: false,
    },
  ];

  @Input()
  set showCurrent(p: boolean) {}

  get showCurrent() {
    try {
      return this.bs.setting.curDoc != null && this.bs.setting.curDoc.id != -1;
    } catch (e) {
      return false;
    }
  }

  @Input()
  set currentName(name: string) {}

  get currentName() {
    return this.bs.setting.curDoc.title;
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
    private bs: BnanService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    /*
    const path = window.location.pathname.split("folder/")[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(
        (page) => page.title.toLowerCase() === path.toLowerCase()
      );
    }
    */
  }
}
