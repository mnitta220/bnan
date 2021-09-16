import {
  Component,
  OnInit,
  ViewChild,
  Input,
  ChangeDetectorRef,
} from "@angular/core";
import { Router } from "@angular/router";
import { Define } from "../common/define";
import { BnanService } from "../common/bnan.service";

@Component({
  selector: "app-doc-view",
  templateUrl: "./doc-view.page.html",
  styleUrls: ["./doc-view.page.scss"],
})
export class DocViewPage implements OnInit {
  @ViewChild("cv1") canvas1: any;
  @ViewChild("cv2") canvas2: any;
  @ViewChild("tb1") tb1: any;
  private canvasElement1: any;
  private toolbarElement: any;
  title = "文書";
  wbname = "白板";
  private retryCnt: number;
  private darkMode = false;
  private cheight = 0;

  stF = {
    color: "white",
  };

  /*
  stCv1 = {
    width: "100%",
    height: `${Define.INIT_HEIGHT}px`,
    overflow: "hidden",
    margin: "2px 4px 0 2px",
  };
  */

  constructor(
    private router: Router,
    public changeDetectorRef: ChangeDetectorRef,
    public bs: BnanService
  ) { }

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
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
    this.darkMode = prefersDark.matches;
    this.wbname = this.darkMode ? "黒板" : "白板";
  }

  ionViewWillEnter() {
    try {
      if (this.bs.setting == null || this.bs.setting.curDoc == null) {
        return;
      }

      this.bs.selectedIndex = Define.PG_VIEW;
      this.bs.docViewPage = this;
      this.title = this.bs.setting.curDoc.title;

      this.toolbarElement = this.tb1.nativeElement;
      this.bs.frWidth = this.toolbarElement.getBoundingClientRect().width;
      this.canvasElement1 = this.canvas1.nativeElement;
      let ct = this.canvasElement1.getContext("2d");

      if (!ct) {
        throw new Error("Canvas.getContext failed.");
      }

      this.canvasElement1.width = this.bs.frWidth;
      this.canvasElement1.height = this.bs.setting.height;
      this.bs.styleCanvas.width = `${this.bs.frWidth}px`;
      this.bs.styleCanvas.height = `${this.bs.setting.height}px`;
      this.retryCnt = 0;
      this.draw();
    } catch (e) {
      this.bs.logs.push("DocViewPage.ionViewWillEnter Error! " + e);
      this.router.navigate(["/error"]);
    }
  }

  async draw() {
    try {
      this.toolbarElement = this.tb1.nativeElement;
      this.bs.frWidth = this.toolbarElement.getBoundingClientRect().width;
      this.canvasElement1 = this.canvas1.nativeElement;
      this.canvasElement1.width = this.bs.frWidth;
      this.canvasElement1.height = this.bs.setting.height;
      this.bs.styleCanvas.width = `${this.bs.frWidth}px`;
      this.bs.styleCanvas.height = `${this.bs.setting.height}px`;

      (await this.bs.wasm).draw_doc(
        this.bs.frWidth,
        this.bs.setting.height,
        this.darkMode,
        this.bs.isAndroid
      );

      this.changeDetectorRef.detectChanges();
    } catch (e) {
      if (this.retryCnt < 2) {
        this.retryCnt++;

        setTimeout(() => {
          this.draw();
        }, 800);

        return;
      }

      this.bs.logs.push("DocViewPage.draw Error! " + e);
      this.router.navigate(["/error"]);
    }
  }

  async resize() {
    try {
      this.toolbarElement = this.tb1.nativeElement;
      this.bs.frWidth = this.toolbarElement.getBoundingClientRect().width;
      this.canvasElement1 = this.canvas1.nativeElement;
      this.canvasElement1.width = this.bs.frWidth;

      let height: number;
      if (this.contents == "2") {
        if (this.bs.isIos) {
          height = window.innerHeight - 224;
        } else {
          height = window.innerHeight - 165;
        }

        height -= 8;

        switch (this.bs.setting.zoom) {
          case 0:
            height += 4;
            break;
          case 2:
            height -= 9;
            break;
          case 3:
            height -= 16;
            break;
          case 4:
            height -= 19;
            break;
          case 5:
            height -= 23;
            break;
          case 6:
            height -= 28;
            break;
        }
      } else {
        height = this.bs.setting.height;
      }

      this.canvasElement1.height = height;
      this.bs.styleCanvas.height = `${height}px`;
      this.bs.styleCanvas.width = `${this.bs.frWidth}px`;
      this.cheight = height;

      (await this.bs.wasm).resize(
        this.bs.frWidth,
        height,
        this.darkMode,
      );

      this.changeDetectorRef.detectChanges();
    } catch (e) {
      if (this.retryCnt < 2) {
        this.retryCnt++;

        setTimeout(() => {
          this.resize();
        }, 800);

        return;
      }

      this.bs.logs.push("DocViewPage.resize Error! " + e);
      this.router.navigate(["/error"]);
    }
  }

  contentsChanged() {
    this.contents_change();
  }

  async contents_change() {
    //console.log("***contents_change()");
    try {
      let height: number;
      if (this.contents == "2") {
        if (this.bs.isIos) {
          height = window.innerHeight - 224;
        } else {
          height = window.innerHeight - 165;
        }

        height -= 8;

        switch (this.bs.setting.zoom) {
          case 0:
            height += 4;
            break;
          case 2:
            height -= 9;
            break;
          case 3:
            height -= 16;
            break;
          case 4:
            height -= 19;
            break;
          case 5:
            height -= 23;
            break;
          case 6:
            height -= 28;
            break;
        }
      } else {
        height = this.bs.setting.height;
      }

      this.canvasElement1.height = height;
      this.bs.styleCanvas.height = `${height}px`;

      (await this.bs.wasm).tab_change(parseInt(this.contents), this.bs.frWidth, height, this.darkMode);

      if (this.contents != "2" && height != this.cheight) {
        setTimeout(() => {
          this.resize();
        }, 800);
      }
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
      let canvasPosition = this.canvasElement1.getBoundingClientRect();

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
    try {
      if (this.bs.touchDevice == false) {
        ev.preventDefault();
        this.moving(ev);
      }
    } catch (e) { }
  }

  touchMove(ev) {
    try {
      if (this.bs.touchDevice == true) {
        ev.preventDefault();
        this.moving(ev.touches[0]);
      }
    } catch (e) { }
  }

  async moving(ev) {
    try {
      let canvasPosition = this.canvasElement1.getBoundingClientRect();

      (await this.bs.wasm).touch_move(
        ev.pageX - canvasPosition.x,
        ev.pageY - canvasPosition.y
      );
    } catch (e) { }
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
          (await this.bs.wasm).tool_func(1);
          break;

        case "2": // 1区切り戻る
          (await this.bs.wasm).tool_func(2);
          break;

        case "3": // 1単語進む
          (await this.bs.wasm).tool_func(3);
          break;

        case "4": // 末尾に進む
          (await this.bs.wasm).tool_func(4);
          break;

        case "5": // 先頭に戻る
          (await this.bs.wasm).tool_func(5);
          break;

        case "6": // 次の段・節に進む
          (await this.bs.wasm).tool_func(6);
          break;

        case "7": // 前の段・節に戻る
          (await this.bs.wasm).tool_func(7);
          break;

        case "fp": // 枠拡大
          this.bs.setting.height += 30;
          await this.bs.updateSetting();
          this.retryCnt = 0;
          await this.resize();
          break;

        case "fm": // 枠縮小
          if (this.bs.setting.height > 300) {
            this.bs.setting.height -= 30;
            await this.bs.updateSetting();
            this.retryCnt = 0;
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
      this.bs.isNewDoc = false;
      this.router.navigate(["/doc-info"]);
    } catch (e) {
      this.bs.logs.push("DocViewPage.change Error! " + e);
      this.router.navigate(["/error"]);
    }
  }

  async strokeBack() {
    try {
      (await this.bs.wasm).stroke_back();
    } catch (e) { }
  }

  async strokeClear() {
    try {
      (await this.bs.wasm).stroke_clear();
    } catch (e) { }
  }
}
