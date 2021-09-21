import { Injectable } from "@angular/core";
import { Device } from '@capacitor/device';
import { Storage } from '@capacitor/storage';
import { Define } from "./define";
import { Setting } from "./setting";
import { AppDatabase, IDoc, Doc, Contents } from "./idb";
import { DocViewPage } from "../doc-view/doc-view.page";

const SETTING_KEY = "bnan";

@Injectable({
  providedIn: "root",
})
export class BnanService {
  selectedIndex = 0;
  wasm: any;
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
  mode = Define.KURO_ALL;
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

  constructor() { }

  async getSetting() {
    //console.log("***getSetting");
    try {
      // wasm疎通確認
      this.wasm = import("bnanw");
      let r = (await this.wasm).ping(100);

      if (r != 101) {
        throw Error("wasm.ping returns: " + r);
      }
    } catch (e) {
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
        (await this.wasm).load_font();
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

      (await this.wasm).set_doc(
        this.setting.curDoc.id,
        this.setting.curDoc.title,
        this.setting.curDoc.vertical,
        this.setting.curDoc.fontSize,
        this.setting.curDoc.current
      );

      let cons = await this._idb.contents
        .where({ docId: this.setting.curDoc.id, ver: this.setting.curDoc.ver })
        .sortBy("seq");

      this.curText = "";
      let first = true;

      for (let c of cons) {
        (await this.wasm).set_source(c.seq, c.text);

        if (first) {
          first = false;
        } else {
          this.curText += "\n";
        }

        this.curText += c.text;
      }

      (await this.wasm).build_box();

      this.setting.curDoc.dt = AppDatabase.getDt();
      this.tab = Define.TAB_TEXT;
      this.mode = Define.KURO_ALL;

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

      (await this.wasm).set_doc(
        doc.id,
        doc.title,
        doc.vertical,
        doc.fontSize,
        -1
      );

      let seq = 0;

      for (let l of lines) {
        con = new Contents(doc.id, 0, seq, l);
        await this._idb.contents.add(con);
        (await this.wasm).set_source(seq, con.text);
        seq++;
      }

      this.setting.curDoc = doc;
      this.curText = text;
      this.tab = Define.TAB_TEXT;
      this.mode = Define.KURO_ALL;

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

      (await this.wasm).set_doc(
        this.setting.curDoc.id,
        title,
        vertical,
        fontSize,
        this.setting.curDoc.current
      );

      if (this._idb == null) {
        this._idb = new AppDatabase();
      }

      let seq = 0;

      for (let l of lines) {
        con = new Contents(this.setting.curDoc.id, newVer, seq, l);
        await this._idb.contents.add(con);
        (await this.wasm).set_source(seq, con.text);
        seq++;
      }

      this.setting.curDoc.ver = newVer;
      this.setting.curDoc.title = title;
      this.setting.curDoc.vertical = vertical;
      this.setting.curDoc.fontSize = fontSize;
      this.setting.curDoc.dt = AppDatabase.getDt();
      this.curText = text;
      this.tab = Define.TAB_TEXT;
      this.mode = Define.KURO_ALL;

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
      this.curText = "";
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
