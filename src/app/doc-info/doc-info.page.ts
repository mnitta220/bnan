import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Plugins } from "@capacitor/core";
import { Define } from "../common/define";
import { BnanService } from "../common/bnan.service";

const { Clipboard } = Plugins;

@Component({
  selector: "app-doc-info",
  templateUrl: "./doc-info.page.html",
  styleUrls: ["./doc-info.page.scss"],
})
export class DocInfoPage implements OnInit {
  title = "文書";
  name = "";
  text = "";
  sz = "20";
  vertical = "1";
  showDelete = false;

  constructor(private router: Router, private bs: BnanService) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.bs.selectedIndex = Define.PG_LIST;
    this.setDoc();
  }

  setDoc() {
    try {
      if (this.bs.setting.curDoc == null || this.bs.setting.curDoc.id == -1) {
        this.title = "新規文書";
        this.name = "";
        this.text = "";
        this.sz = "20";
        this.vertical = "1";
        this.showDelete = false;
      } else {
        this.title = this.bs.setting.curDoc.title;
        this.name = this.title;
        this.text = this.bs.curText;
        this.sz = "" + this.bs.setting.curDoc.fontSize;
        this.vertical =
          this.bs.setting.curDoc.vertical == Define.MODE_V ? "2" : "1";
        this.showDelete = true;
      }
    } catch (e) {
      this.bs.logs.push("DocInfoPage.setDoc Error! " + e);
      this.router.navigate(["/error"]);
    }
  }

  save() {
    try {
      if (this.name.trim().length == 0) {
        alert("タイトルを入力してください。");
        return;
      }

      if (this.text.trim().length == 0) {
        alert("テキストを入力してください。");
        return;
      }

      this.saveProc().then(() => {
        this.router.navigate(["/doc-view"]);
      });
    } catch (e) {
      this.bs.logs.push("DocInfoPage.save Error! " + e);
      this.router.navigate(["/error"]);
    }
  }

  async saveProc() {
    try {
      if (this.bs.setting.curDoc == null || this.bs.setting.curDoc.id == -1) {
        await this.bs.newDoc(
          this.name,
          this.format(),
          this.vertical == "2" ? Define.MODE_V : Define.MODE_H,
          parseInt(this.sz)
        );
      } else {
        await this.bs.updateDoc(
          this.name,
          this.format(),
          this.vertical == "2" ? Define.MODE_V : Define.MODE_H,
          parseInt(this.sz)
        );
      }
    } catch (e) {
      this.bs.logs.push("DocInfoPage.saveProc Error! " + e);
      this.router.navigate(["/error"]);
    }
  }

  back() {
    this.router.navigate(["/doc-view"]);
  }

  copy() {
    try {
      Clipboard.write({
        string: this.text,
      })
        .then(() => window.alert("クリップボードにコピーしました。"))
        .catch((error) => {
          alert(`${error.message}`);
        });
    } catch (e) {
      this.bs.logs.push("DocInfoPage.copy Error! " + e);
      this.router.navigate(["/error"]);
    }
  }

  paste() {
    try {
      this.pasteText();
    } catch (e) {
      this.bs.logs.push("DocInfoPage.paste Error! " + e);
      this.router.navigate(["/error"]);
    }
  }

  format(): string {
    let newText = "";
    const lines = this.text.split("\n");
    let first = true;

    for (let l of lines) {
      if (first) {
        first = false;
      } else {
        newText += "\n";
      }

      if (l.length == 0 || l == " ") {
      } else {
        newText += l;
      }
    }

    return newText;
  }

  async pasteText() {
    //console.log("***pasteSgf()");
    let result: any;

    try {
      result = await Clipboard.read();

      if (result.type != "text/plain") {
        window.alert("クリップボードにテキストがありません。");
        return;
      }

      this.text = result.value;
    } catch (e) {
      throw new Error(e);
    }
  }

  async delete() {
    try {
      const result = window.confirm("文書を削除してもよろしいですか？");

      if (result == false) {
        return;
      }

      await this.bs.deleteDoc();
      this.router.navigate(["/doc-list"]);
    } catch (e) {
      this.bs.logs.push("DocInfoPage.delete Error! " + e);
      this.router.navigate(["/error"]);
    }
  }

  slash() {
    try {
      let newText = "";
      let addSlash = false;
      let c = "";
      const lines = this.text.split("\n");

      for (let l of lines) {
        if (l.length == 0 || l == " ") {
          newText += "\n";
        } else {
          addSlash = false;
          c = "";

          for (let i = 0; i < l.length; i++) {
            c = l.charAt(i);

            switch (c) {
              case "\n":
              case "\r":
                continue;

              case "/":
                addSlash = false;
                break;

              case "。":
              case "、":
              case "．":
              case "，":
                addSlash = true;
                break;

              default:
                if (addSlash) {
                  newText += "/";
                  addSlash = false;
                }
                break;
            }

            newText += c;
          }

          if (c != "/") {
            newText += "/";
          }

          newText += "\n";
        }
      }

      this.text = newText;
    } catch (e) {
      this.bs.logs.push("DocInfoPage.slash Error! " + e);
      this.router.navigate(["/error"]);
    }
  }
}
