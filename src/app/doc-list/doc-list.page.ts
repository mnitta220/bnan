import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Define } from '../common/define';
import { BnanService } from '../common/bnan.service';
import { IDoc } from '../common/idb';

@Component({
  selector: 'app-doc-list',
  templateUrl: './doc-list.page.html',
  styleUrls: ['./doc-list.page.scss'],
})
export class DocListPage {
  title = '文書一覧';
  docs: IDoc[] = [];

  constructor(private router: Router, public bs: BnanService) {}

  ionViewWillEnter() {
    try {
      this.bs.selectedIndex = Define.PG_LIST;

      this.bs
        .readDocList()
        .then(() => (this.docs = this.bs.docList))
        .catch((error) => {
          alert(`${error.message}`);
        });
    } catch (e) {
      this.bs.logs.push('DocListPage.ionViewWillEnter Error! ' + e);
      this.router.navigate(['/error']);
    }
  }

  addDoc() {
    //this.bs.setting.curDoc = null;
    this.bs.isNewDoc = true;
    this.router.navigate(['/doc-info']);
  }

  async selectDoc(index: number) {
    //console.log("***selectDoc id=" + this.docs[index].id);
    try {
      this.bs.isNewDoc = false;
      if (this.docs && this.docs[index].id) {
        let id = this.docs[index].id ?? 0;
        await this.bs.setCurrentDoc(id).then(() => {
          this.router.navigate(['/doc-view']);
        });
      }
    } catch (e) {
      this.bs.logs.push('DocListPage.selectDoc Error! ' + e);
      this.router.navigate(['/error']);
    }
  }
}
