import { Injectable } from "@angular/core";
import { Device } from '@capacitor/device';
import { Storage } from '@capacitor/storage';
import { TextZoom, SetOptions } from '@capacitor/text-zoom';
import { Define } from "./define";
import { Setting } from "./setting";
import { AppDatabase, IDoc, Doc, Contents } from "./idb";

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
  logs: string[] = [];
  touchDevice: boolean = false;
  isIos = false;
  isAndroid = false;
  isElectron = false;
  isMac = false;
  isWin = false;
  frWidth: number;
  contents = Define.TAB_TEXT;
  mode = Define.KURO_ALL;
  showCurrent = false;
  currentName = "";
  disableZoomDown = true;
  disableZoomUp = true;

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
      if (info.platform == "ios" || info.platform == "android") {
        if (typeof this.setting.zoom !== "undefined") {
          this.setting.zoom = 1;
        }
        var options: SetOptions = {
          value: this.setting.zoom
        }
        TextZoom.set(options)
        this.disableZoomDown = (this.setting.zoom <= Define.ZOOM_MIN);
        this.disableZoomUp = (this.setting.zoom >= Define.ZOOM_MAX);
      }
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
    if (info.platform == "ios" || info.platform == "android") {
      this.setting.zoom = 1;
      var options: SetOptions = {
        value: this.setting.zoom
      }
      TextZoom.set(options)
      this.disableZoomDown = false;
      this.disableZoomUp = false;
    }

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

      this.setting.curDoc.dt = AppDatabase.getDt();
      this.contents = Define.TAB_TEXT;
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
      this.contents = Define.TAB_TEXT;
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
      this.contents = Define.TAB_TEXT;
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

  zoomText(val: number) {
    if (typeof this.setting.zoom === "undefined") {
      this.setting.zoom = 1;
    }

    this.setting.zoom += val;
    if (this.setting.zoom < Define.ZOOM_MIN) {
      this.setting.zoom = Define.ZOOM_MIN;
    } else if (this.setting.zoom > Define.ZOOM_MAX) {
      this.setting.zoom = Define.ZOOM_MAX;
    }
    var options: SetOptions = {
      value: this.setting.zoom
    }
    TextZoom.set(options)
    console.log("****zoomText value=" + options.value);
    this.disableZoomDown = (this.setting.zoom <= Define.ZOOM_MIN);
    this.disableZoomUp = (this.setting.zoom >= Define.ZOOM_MAX);

    this.updateSetting();
  }
}
