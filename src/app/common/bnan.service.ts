import { Injectable } from "@angular/core";
import { Device } from '@capacitor/device';
import { Storage } from '@capacitor/storage';
import { Define } from "./define";
import { Setting } from "./setting";
import { WasmManager } from "./wasm-manager";
import { AppDatabase, IDoc, Doc, Contents } from "./idb";
import { DocViewPage } from "../doc-view/doc-view.page";

const SETTING_KEY = "bnan";

@Injectable({
  providedIn: "root",
})
export class BnanService {
  selectedIndex = 0;
  wman: WasmManager;
  setting: Setting = null;
  private _idb: AppDatabase;
  docList: IDoc[] = null;
  curText = "";
  isNewDoc = false;
  logs: string[] = [];
  touchDevice: boolean = false;
  isIos = false;
  isAndroid = false;
  isElectron = false;
  isMac = false;
  isWin = false;
  frWidth: number;
  tab = Define.TAB_TEXT;
  modeText = Define.KURO_ALL;
  modeContent = Define.KURO_ALL;
  showCurrent = false;
  currentName = "";
  disableZoomDown = false;
  disableZoomUp = false;
  styleInput: any;
  styleBtn: any;
  styleToolBtn1: any;
  styleToolBtn2: any;
  styleUsageP: any;
  styleUsageLiA: any;
  styleUsageH1: any;
  styleUsageH2: any;
  styleUsageH3: any;
  styleUsageHr: any;
  styleCanvas = {
    width: "100%",
    height: `${Define.INIT_HEIGHT}px`,
    overflow: "hidden",
    margin: "2px 4px 0 2px",
  };
  docViewPage: DocViewPage;
  retryCount = 0;

  constructor() { }

  async getSetting() {
    //console.log("***getSetting");

    try {
      this.wman = new WasmManager();
      await this.wman.wasmInit();
    } catch (e) {
      console.log(e);
      this.logs.push(e);
      throw Error(
        "この機器は、WebAssemblyに対応していないため、このアプリを使うことができません。"
      );
    }

    if (!window.indexedDB) {
      throw Error(
        "この機器は、IndexedDBに対応していないため、このアプリを使うことができません。"
      );
    }

    let ret = null;

    try {
      ret = await Storage.get({ key: SETTING_KEY });
    } catch (e) { }

    if (ret == null || ret.value == null) {
      await this.initSetting();
    } else {
      this.setting = JSON.parse(ret.value);

      if (this.setting.curDoc != null && this.setting.curDoc.id != -1) {
        this.showCurrent = true;
        this.currentName = this.setting.curDoc.title;
      }

      this._idb = new AppDatabase();

      const info = await Device.getInfo();
      if (this.setting.version < "1.11") {
        this.setting.version = Define.VERSION;
        this.setting.zoom = 1;
        await this.updateSetting();
      }
      this.setFontSize();
    }

    await this.getPlatform();
  }

  async initSetting() {
    //console.log("***initSetting");

    await AppDatabase.deleteDb();
    this._idb = new AppDatabase();
    await this._idb.loadSample();

    this.setting = new Setting();
    this.setting.version = Define.VERSION;
    this.setting.height = Define.INIT_HEIGHT;

    const info = await Device.getInfo();
    this.setting.zoom = 1;
    this.setFontSize();

    await this.updateSetting();
    this.showCurrent = false;
    this.currentName = "";
  }

  async getPlatform() {
    const info = await Device.getInfo();
    this.touchDevice = false;

    switch (info.platform) {
      case "ios":
        this.isIos = true;
        this.touchDevice = true;
        break;

      case "android":
        this.isAndroid = true;
        this.touchDevice = true;

        // Androidの場合、Googleフォントを使用する。
        //(await this.wasm).load_font();
        this.wman.loadFont();
        break;
    }
  }

  async updateSetting() {
    //console.log("***updateSetting");
    await Storage.set({
      key: SETTING_KEY,
      value: JSON.stringify(this.setting),
    });
  }

  async readDocList() {
    //console.log("***readDocList");
    try {
      this.docList = [];

      if (this._idb == null) {
        this._idb = new AppDatabase();
      }

      await this._idb.docs
        .orderBy("dt")
        .reverse()
        .each((doc) => {
          this.docList.push(doc);
        })
        .catch((error) => {
          this.logs.push(error);
          alert(error);
        });
    } catch (e) {
      throw Error(e);
    }
  }

  async getCurText() {
    //console.log("***getCurText1");
    this.curText = '';
    try {
      let cons = await this._idb.contents
        .where({ docId: this.setting.curDoc.id, ver: this.setting.curDoc.ver })
        .sortBy("seq");

      let first = true;

      for (let c of cons) {
        if (first) {
          first = false;
        } else {
          this.curText += "\n";
        }

        this.curText += c.text;
      }
    } catch (e) {
      throw Error(e);
    }
  }

  async setCurrentDoc(id: number) {
    //console.log("***setCurrentDoc1: id=" + id);
    try {
      this.setting.curDoc = null;

      await this._idb.docs
        .where("id")
        .equals(id)
        .first((d) => {
          this.setting.curDoc = new Doc(
            d.title,
            d.ver,
            d.vertical,
            d.fontSize,
            d.current,
            d.dt,
            d.json,
            d.id
          );
        });

      this.wman.setDoc(
        this.setting.curDoc.id,
        this.setting.curDoc.title,
        this.setting.curDoc.vertical,
        this.setting.curDoc.fontSize,
        this.setting.curDoc.current
      );

      let cons = await this._idb.contents
        .where({ docId: this.setting.curDoc.id, ver: this.setting.curDoc.ver })
        .sortBy("seq");

      //this.curText = "";
      //let first = true;
      let isOut = false;
      let step = 0;
      let type = 0;

      for (let c of cons) {
        if (!c.type) {
          c.type = 0;
          for (let i = 0; i < c.text.length; i++) {
            if (c.text.charAt(i) == '#') {
              c.type++;
              if (c.type == 6) {
                break;
              }
            } else {
              break;
            }
          }
          await this._idb.contents.where({
            docId: this.setting.curDoc.id,
            ver: this.setting.curDoc.ver,
            seq: c.seq
          }).modify({ type: c.type });
        }

        isOut = false;
        switch (step) {
          case 0:
            if (c.seq >= this.setting.curDoc.current) {
              isOut = true;
              type = c.type;
              step = 1;
            } else if (c.type > 0) {
              isOut = true;
            }
            break;
          case 1:
            if (c.type > 0) {
              if (type == 0 || c.type <= type) {
                step = 2;
              }
            }
            isOut = true;
            type = c.type;
            break;
          default:
            if (c.type > 0) {
              isOut = true;
            }
            break;
        }
        if (isOut) {
          this.wman.setSource(c.seq, c.text);
        }
      }

      this.setting.curDoc.dt = AppDatabase.getDt();
      this.tab = Define.TAB_TEXT;
      this.modeText = Define.KURO_ALL;
      this.modeContent = Define.KURO_ALL;

      await this._idb.docs.put(this.setting.curDoc).catch((error) => {
        alert(error);
        this.logs.push("idb put error: " + error);
        throw new Error("idb put error!");
      });

      await this.updateSetting();
      this.showCurrent = true;
      this.currentName = this.setting.curDoc.title;
    } catch (e) {
      throw Error(e);
    }
  }

  async newDoc(title: string, text: string, mode: number, fontSize: number) {
    //console.log("***newDoc");
    if (title.length == 0) {
      throw Error("タイトルを入力してください。");
    }
    if (text.length == 0) {
      throw Error("本文を入力してください。");
    }

    try {
      const lines = text.split("\n");
      let doc = new Doc(title, 0, mode, fontSize, -1, AppDatabase.getDt(), "");
      let con: Contents = null;

      if (this._idb == null) {
        this._idb = new AppDatabase();
      }

      await this._idb.docs.add(doc).then((id) => {
        doc.id = id;
      });

      this.wman.setDoc(
        doc.id,
        doc.title,
        doc.vertical,
        doc.fontSize,
        -1
      );

      let seq = 0;
      let isOut = false;
      let step = 0;
      let type = 0;

      for (let l of lines) {
        con = new Contents(doc.id, 0, seq, l);
        await this._idb.contents.add(con);

        isOut = false;
        switch (step) {
          case 0:
            isOut = true;
            type = con.type;
            step = 1;
            break;
          case 1:
            if (con.type > 0) {
              if (type == 0) {
                step = 2;
              } else if (con.type <= type) {
                step = 2;
              }
            }
            isOut = true;
            type = con.type;
            break;
          default:
            if (con.type > 0) {
              isOut = true;
            }
            break;
        }
        if (isOut) {
          this.wman.setSource(con.seq, con.text);
        }
        seq++;
      }

      this.setting.curDoc = doc;
      this.setting.curDoc.current = -1;
      //this.curText = text;
      this.tab = Define.TAB_TEXT;
      this.modeText = Define.KURO_ALL;
      this.modeContent = Define.KURO_ALL;

      await this.updateSetting();
      this.showCurrent = true;
      this.currentName = this.setting.curDoc.title;
    } catch (e) {
      throw Error(e);
    }
  }

  async updateDoc(
    title: string,
    text: string,
    vertical: number,
    fontSize: number
  ) {
    //console.log("***updateDoc");
    if (title.length == 0) {
      throw Error("タイトルを入力してください。");
    }
    if (text.length == 0) {
      throw Error("本文を入力してください。");
    }

    try {
      let oldVer = this.setting.curDoc.ver;
      let newVer = this.setting.curDoc.ver + 1;

      await this._idb.contents
        .where({ docId: this.setting.curDoc.id, ver: newVer })
        .delete();

      const lines = text.split("\n");
      let con: Contents = null;

      this.wman.setDoc(
        this.setting.curDoc.id,
        title,
        vertical,
        fontSize,
        -1
        //this.setting.curDoc.current
      );

      if (this._idb == null) {
        this._idb = new AppDatabase();
      }

      let seq = 0;
      let isOut = false;
      let step = 0;
      let type = 0;

      for (let l of lines) {
        con = new Contents(this.setting.curDoc.id, newVer, seq, l);
        await this._idb.contents.add(con);

        isOut = false;
        switch (step) {
          case 0:
            isOut = true;
            type = con.type;
            step = 1;
            break;
          case 1:
            if (con.type > 0) {
              if (type == 0) {
                step = 2;
              } else if (con.type <= type) {
                step = 2;
              }
            }
            isOut = true;
            type = con.type;
            break;
          default:
            if (con.type > 0) {
              isOut = true;
            }
            break;
        }
        if (isOut) {
          this.wman.setSource(con.seq, con.text);
        }
        seq++;
      }

      this.setting.curDoc.ver = newVer;
      this.setting.curDoc.title = title;
      this.setting.curDoc.vertical = vertical;
      this.setting.curDoc.fontSize = fontSize;
      this.setting.curDoc.dt = AppDatabase.getDt();
      this.setting.curDoc.current = -1;
      //this.curText = text;
      this.tab = Define.TAB_TEXT;
      this.modeText = Define.KURO_ALL;

      await this._idb.docs.put(this.setting.curDoc).catch((error) => {
        alert(error);
        this.logs.push("idb put error: " + error);
        throw new Error("idb put error!");
      });

      await this._idb.contents
        .where({ docId: this.setting.curDoc.id, ver: oldVer })
        .delete();
      this.showCurrent = true;
      this.currentName = this.setting.curDoc.title;
    } catch (e) {
      throw Error(e);
    }
  }

  async deleteDoc() {
    //console.log("***deleteDoc");
    try {
      let con: Contents = null;

      if (this._idb == null) {
        this._idb = new AppDatabase();
      }

      await this._idb.docs.where({ id: this.setting.curDoc.id }).delete();

      await this._idb.contents
        .where({ docId: this.setting.curDoc.id })
        .delete();

      this.setting.curDoc = null;
      //this.curText = "";
      this.showCurrent = false;
      this.currentName = "";

      await this.updateSetting();
    } catch (e) {
      throw Error(e);
    }
  }

  async updateCurrent(current: number) {
    //console.log("***updateCurrent: current=" + current);
    try {
      if (this._idb == null) {
        this._idb = new AppDatabase();
      }

      this.setting.curDoc.current = current;

      await this._idb.docs.put(this.setting.curDoc).catch((error) => {
        alert(error);
        this.logs.push("idb put error: " + error);
        throw new Error("idb put error!");
      });

      this.wman.setSection(
        current
      );

      let cons = await this._idb.contents
        .where({ docId: this.setting.curDoc.id, ver: this.setting.curDoc.ver })
        .sortBy("seq");

      let isOut = false;
      let step = 0;
      let type = 0;

      for (let c of cons) {
        isOut = false;
        switch (step) {
          case 0:
            if (c.seq >= current) {
              isOut = true;
              type = c.type;
              step = 1;
            } else if (c.type > 0) {
              isOut = true;
            }
            break;
          case 1:
            if (c.type == 0) {
              isOut = true;
            } else {
              if (type == 0) {
                step = 2;
              } else if (c.type <= type) {
                step = 2;
              }
              isOut = true;
            }
            type = c.type;
            break;
          default:
            if (c.type > 0) {
              isOut = true;
            }
            break;
        }
        if (isOut) {
          this.wman.setSource(c.seq, c.text);
        }
      }
    } catch (e) {
      throw Error(e);
    }
  }

  async nextSection(isNext: boolean) {
    //console.log("***updateCurrent: current=" + current);
    try {
      if (this._idb == null) {
        this._idb = new AppDatabase();
      }
      let current = -1;
      let step = 0;
      let type = 0;

      let cons = await this._idb.contents
        .where({ docId: this.setting.curDoc.id, ver: this.setting.curDoc.ver })
        .sortBy("seq");

      let idx = this.setting.curDoc.current;
      if (idx == -1) {
        idx = 0;
      }
      if (isNext) {
        for (let i = idx; i < cons.length; i++) {
          const c = cons[i];
          switch (step) {
            case 0:
              if (i == idx) {
                step = 1;
                type = c.type;
              }
              break;
            case 1:
              if (c.type > 0) {
                if (type == 0) {
                  step = 2;
                  current = i;
                } else if (c.type <= type) {
                  step = 2;
                  current = i;
                }
              }
              type = c.type;
              break;
          }
          if (step == 2) {
            break;
          }
        }

        if (current == -1) {
          return;
        }
      } else {
        for (let i = idx; i >= 0; i--) {
          const c = cons[i];
          switch (step) {
            case 0:
              if (i == idx) {
                step = 1;
                type = c.type;
              }
              break;
            case 1:
              if (c.type > 0) {
                if (type == 0) {
                  step = 2;
                  current = i;
                } else if (c.type <= type) {
                  step = 2;
                  current = i;
                }
              }
              type = c.type;
              break;
            case 2:
              if (c.type == 0) {
                step = 3;
              } else {
                if (c.type < type) {
                  current = i;
                }
              }
          }
          if (step == 3) {
            break;
          }
        }

        if (step < 2) {
          current = -1;
        }
      }

      this.setting.curDoc.current = current;

      await this._idb.docs.put(this.setting.curDoc).catch((error) => {
        alert(error);
        this.logs.push("idb put error: " + error);
        throw new Error("idb put error!");
      });

      this.wman.setSection(
        current
      );

      let isOut = false;
      step = 0;
      type = 0;

      for (let c of cons) {
        isOut = false;
        switch (step) {
          case 0:
            if (c.seq >= current) {
              isOut = true;
              type = c.type;
              step = 1;
            } else if (c.type > 0) {
              isOut = true;
            }
            break;
          case 1:
            if (c.type == 0) {
              isOut = true;
            } else {
              if (type == 0) {
                step = 2;
              } else if (c.type <= type) {
                step = 2;
              }
              isOut = true;
            }
            type = c.type;
            break;
          default:
            if (c.type > 0) {
              isOut = true;
            }
            break;
        }

        if (isOut) {
          this.wman.setSource(c.seq, c.text);
        }
      }
    } catch (e) {
      throw Error(e);
    }
  }

  async dropAll() {
    try {
      await AppDatabase.deleteDb();
    } catch (e) { }

    try {
      await Storage.clear();
    } catch (e) { }
  }

  setFontSize() {
    let input = 12;
    let btnTxt = 13;
    let toolBtnTxt1 = 36;
    let toolBtnTxt2 = 28;
    let toolBtnPad1 = 5;
    let toolBtnPad2 = 10;
    let btnHeight = 42;
    let uP = 14;
    let uH2 = 15;
    let uH3 = 14.5;
    let uHrMar = 10;

    switch (this.setting.zoom) {
      case 0:
        input = 11;
        btnTxt = 12;
        btnHeight = 38;
        toolBtnTxt1 = 35;
        toolBtnTxt2 = 27;
        toolBtnPad1 = 5;
        toolBtnPad2 = 10;
        uP = 13;
        uH2 = 14;
        uH3 = 13.5;
        break;
      case 2:
        input = 13;
        btnTxt = 15;
        btnHeight = 45;
        toolBtnTxt1 = 37;
        toolBtnTxt2 = 29;
        toolBtnPad1 = 5;
        toolBtnPad2 = 10;
        uP = 16;
        uH2 = 18;
        uH3 = 17;
        break;
      case 3:
        input = 15;
        btnTxt = 17;
        btnHeight = 49;
        toolBtnTxt1 = 38;
        toolBtnTxt2 = 30;
        toolBtnPad1 = 5;
        toolBtnPad2 = 11;
        uP = 18;
        uH2 = 20;
        uH3 = 19;
        break;
      case 4:
        input = 17;
        btnTxt = 19;
        btnHeight = 51;
        toolBtnTxt1 = 39;
        toolBtnTxt2 = 31;
        toolBtnPad1 = 5;
        toolBtnPad2 = 11;
        uP = 20;
        uH2 = 22;
        uH3 = 21;
        uHrMar = 12;
        break;
      case 5:
        input = 19;
        btnTxt = 21;
        btnHeight = 53;
        toolBtnTxt1 = 40;
        toolBtnTxt2 = 32;
        toolBtnPad1 = 5;
        toolBtnPad2 = 11;
        uP = 22;
        uH2 = 24;
        uH3 = 23;
        uHrMar = 13;
        break;
      case 6:
        input = 21;
        btnTxt = 23;
        btnHeight = 56;
        toolBtnTxt1 = 41;
        toolBtnTxt2 = 33;
        toolBtnPad1 = 5;
        toolBtnPad2 = 11;
        uP = 24;
        uH2 = 26;
        uH3 = 25;
        uHrMar = 14;
        break;
    }

    this.styleInput = {
      "font-size": `${input}pt`
    };
    this.styleBtn = {
      "font-size": `${btnTxt}pt`,
      "height": `${btnHeight}px`
    };
    this.styleToolBtn1 = {
      "font-size": `${toolBtnTxt1}pt`,
      "padding": `${toolBtnPad1}px`,
      "color": "white"
    };
    this.styleToolBtn2 = {
      "font-size": `${toolBtnTxt2}pt`,
      "padding": `${toolBtnPad2}px`,
      "color": "white"
    };
    this.styleUsageP = {
      "font-size": `${uP}pt`,
      "margin": "2px 0 11px 0"
    };
    this.styleUsageLiA = {
      "font-size": `${uP}pt`
    };
    this.styleUsageH1 = {
      "font-size": `${uH2 + 2}pt`,
      "font-weight": "bold",
      "margin": "14px 0 7px 0"
    };
    this.styleUsageH2 = {
      "font-size": `${uH2}pt`,
      "font-weight": "bold",
      "margin": "14px 0 6px 0"
    };
    this.styleUsageH3 = {
      "font-size": `${uH3}pt`,
      "font-weight": "bold",
      "margin": "14px 0 5px 0"
    };
    this.styleUsageHr = {
      "border-bottom": "1px solid gray",
      "margin": `${uHrMar}px 0`,
      "width": "100%"
    };
    this.disableZoomDown = (this.setting.zoom <= Define.ZOOM_MIN);
    this.disableZoomUp = (this.setting.zoom >= Define.ZOOM_MAX);

    if (this.selectedIndex == Define.PG_VIEW && this.docViewPage != null) {
      this.docViewPage.tabChanged();
    }
  }

  async zoomText(val: number) {
    //console.log("***zoomText: this.setting.zoom=" + this.setting.zoom + ", val=" + val);
    if (typeof this.setting.zoom === "undefined") {
      this.setting.zoom = 1;
    }

    if ((val == 1 && this.setting.zoom >= Define.ZOOM_MAX) ||
      (val == -1 && this.setting.zoom <= Define.ZOOM_MIN)) {
      return;
    }
    this.setting.zoom += val;
    this.setFontSize();
    this.disableZoomDown = (this.setting.zoom <= Define.ZOOM_MIN);
    this.disableZoomUp = (this.setting.zoom >= Define.ZOOM_MAX);

    await this.updateSetting();
  }
}
