import {
  Component,
  OnInit,
  ViewChild,
  Input,
  ChangeDetectorRef,
} from "@angular/core";
import { Router } from "@angular/router";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";
import { Define } from "../common/define";
import { BnanService } from "../common/bnan.service";

@Component({
  selector: "app-doc-view",
  templateUrl: "./doc-view.page.html",
  styleUrls: ["./doc-view.page.scss"],
})
export class DocViewPage implements OnInit {
  @ViewChild("cv1") canvas: any;
  @ViewChild("tb1") toolbar: any;
  private canvasElement: any;
  private toolbarElement: any;
  title = "文書";

  stF = {
    color: "white",
  };

  stCv = {
    width: "100%",
    height: `${Define.INIT_HEIGHT}px`,
    overflow: "hidden",
    margin: "2px 4px 0 2px",
  };

  constructor(
    private router: Router,
    private screenOrientation: ScreenOrientation,
    public changeDetectorRef: ChangeDetectorRef,
    private bs: BnanService
  ) {}

  @Input()
  set contents(contents: string) {
    this.bs.contents = contents;
  }

  get contents() {
    return this.bs.contents;
  }

  @Input()
  set mode(mode: string) {
    this.bs.mode = mode;
  }

  get mode() {
    return this.bs.mode;
  }

  ngOnInit() {
    this.screenOrientation.onChange().subscribe(() => {
      setTimeout(() => {
        this.resize();
      }, 1000);
    });

    this.screenOrientation.unlock();
  }

  ionViewWillEnter() {
    try {
      //console.log("***DocViewPage.ionViewWillEnter1");
      if (this.bs.setting == null || this.bs.setting.curDoc == null) {
        return;
      }

      this.bs.selectedIndex = Define.PG_VIEW;
      this.title = this.bs.setting.curDoc.title;

      this.toolbarElement = this.toolbar.nativeElement;
      this.bs.frWidth = this.toolbarElement.getBoundingClientRect().width;
      this.canvasElement = this.canvas.nativeElement;
      let ct = this.canvasElement.getContext("2d");

      if (!ct) {
        throw new Error("Canvas.getContext failed.");
      }

      this.canvasElement.width = this.bs.frWidth;
      this.canvasElement.height = this.bs.setting.height;
      this.stCv.width = `${this.bs.frWidth}px`;
      this.stCv.height = `${this.bs.setting.height}px`;
      this.draw();
    } catch (e) {
      this.bs.logs.push("DocViewPage.ionViewWillEnter Error! " + e);
      this.router.navigate(["/error"]);
    }
  }

  async draw() {
    try {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
      const darkMode = prefersDark.matches;
      this.toolbarElement = this.toolbar.nativeElement;
      this.bs.frWidth = this.toolbarElement.getBoundingClientRect().width;
      this.canvasElement = this.canvas.nativeElement;
      this.canvasElement.width = this.bs.frWidth;
      this.canvasElement.height = this.bs.setting.height;
      this.stCv.width = `${this.bs.frWidth}px`;
      this.stCv.height = `${this.bs.setting.height}px`;

      (await this.bs.wasm).draw_doc(
        this.bs.frWidth,
        this.bs.setting.height,
        darkMode
      );

      this.changeDetectorRef.detectChanges();
    } catch (e) {
      this.bs.logs.push("DocViewPage.draw Error! " + e);
      this.router.navigate(["/error"]);
    }
  }

  async resize() {
    try {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
      const darkMode = prefersDark.matches;
      this.toolbarElement = this.toolbar.nativeElement;
      this.bs.frWidth = this.toolbarElement.getBoundingClientRect().width;
      this.canvasElement = this.canvas.nativeElement;
      this.canvasElement.width = this.bs.frWidth;
      this.canvasElement.height = this.bs.setting.height;
      this.stCv.width = `${this.bs.frWidth}px`;
      this.stCv.height = `${this.bs.setting.height}px`;

      (await this.bs.wasm).resize(
        this.bs.frWidth,
        this.bs.setting.height,
        darkMode
      );

      this.changeDetectorRef.detectChanges();
    } catch (e) {
      this.bs.logs.push("DocViewPage.resize Error! " + e);
      this.router.navigate(["/error"]);
    }
  }

  contentsChanged() {
    this.contents_change();
  }

  async contents_change() {
    try {
      (await this.bs.wasm).contents_change(this.contents == "0" ? false : true);
    } catch (e) {
      this.bs.logs.push("DocViewPage.contents_change Error! " + e);
      this.router.navigate(["/error"]);
    }
  }

  modeChanged() {
    this.mode_change();
  }

  async mode_change() {
    try {
      (await this.bs.wasm).mode_change(this.mode == "1" ? false : true);
    } catch (e) {
      this.bs.logs.push("DocViewPage.mode_change Error! " + e);
      this.router.navigate(["/error"]);
    }
  }

  mouseDown(ev) {
    if (this.bs.touchDevice == false) {
      this.startDrawing(ev);
    }
  }

  touchStart(ev) {
    if (this.bs.touchDevice == true) {
      this.startDrawing(ev.touches[0]);
    }
  }

  async startDrawing(ev) {
    try {
      let canvasPosition = this.canvasElement.getBoundingClientRect();

      (await this.bs.wasm).touch_start(
        ev.pageX - canvasPosition.x,
        ev.pageY - canvasPosition.y
      );
    } catch (e) {
      this.bs.logs.push("DocViewPage.startDrawing Error! " + e);
      this.router.navigate(["/error"]);
    }
  }

  mouseMove(ev) {
    if (this.bs.touchDevice == false) {
      ev.preventDefault();
      this.moving(ev);
    }
  }

  touchMove(ev) {
    if (this.bs.touchDevice == true) {
      ev.preventDefault();
      this.moving(ev.touches[0]);
    }
  }

  async moving(ev) {
    try {
      let canvasPosition = this.canvasElement.getBoundingClientRect();

      (await this.bs.wasm).touch_move(
        ev.pageX - canvasPosition.x,
        ev.pageY - canvasPosition.y
      );
    } catch (e) {}
  }

  mouseUp(ev) {
    if (this.bs.touchDevice == false) {
      this.endDrawing(ev);
    }
  }

  touchEnd(ev) {
    if (this.bs.touchDevice == true) {
      this.endDrawing(ev.touches[0]);
    }
  }

  async endDrawing(ev) {
    try {
      let r = (await this.bs.wasm).touch_end();

      if (r > -2) {
        // 目次選択
        this.contents = "0";
        this.bs.updateCurrent(r);
      }
    } catch (e) {
      this.bs.logs.push("DocViewPage.endDrawing Error! " + e);
      this.router.navigate(["/error"]);
    }
  }

  pushed(btn: string) {
    try {
      this.btnPushed(btn);
    } catch (e) {
      this.bs.logs.push("DocViewPage.pushed Error! " + e);
      this.router.navigate(["/error"]);
    }
  }

  async btnPushed(btn: string) {
    try {
      switch (btn) {
        case "1": // 1区切り進む
          (await this.bs.wasm).black_step(1);
          break;

        case "2": // 1区切り戻る
          (await this.bs.wasm).black_step(2);
          break;

        case "3": // 1単語進む
          (await this.bs.wasm).black_step(3);
          break;

        case "4": // 末尾に進む
          (await this.bs.wasm).black_step(4);
          break;

        case "5": // 先頭に戻る
          (await this.bs.wasm).black_step(5);
          break;

        case "fp": // 枠拡大
          this.bs.setting.height += 30;
          await this.bs.updateSetting();
          await this.resize();
          break;

        case "fm": // 枠縮小
          if (this.bs.setting.height > 300) {
            this.bs.setting.height -= 30;
            await this.bs.updateSetting();
            await this.resize();
          }
          break;
      }
    } catch (e) {
      this.bs.logs.push("DocViewPage.btnPushed Error! " + e);
      this.router.navigate(["/error"]);
    }
  }

  change() {
    try {
      this.router.navigate(["/doc-info"]);
    } catch (e) {
      this.bs.logs.push("DocViewPage.change Error! " + e);
      this.router.navigate(["/error"]);
    }
  }
}
