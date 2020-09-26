import { TestBed } from "@angular/core/testing";

import { Define } from "./define";
import { BnanService } from "./bnan.service";

describe("BnanService", () => {
  let service: BnanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BnanService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("newDoc1", () => {
    service
      .newDoc(
        "",
        `# 第九章　譬喩で爾前と法華の関係明す

　一切経の語は夢中の語とは/譬えば扇と樹との如し/法華経の寤《うつつ》の心を顕《あらわ》す言《ことば》とは/譬えば月と風との如し、/故に本覚の寤の心の月輪の光は無明の闇を照し/実相|般若《はんにゃ》の智慧の風は妄想の塵を払う`,
        Define.MODE_H
      )
      .then(() => {
        throw new Error("*** normal end.");
      })
      .catch((e) => {
        console.log("***" + e);
      });
  });

  it("newDoc2", () => {
    let result = false;
    service
      .newDoc("aaa", "", Define.MODE_H)
      .then(() => {
        result = true;
      })
      .catch((e) => {
        console.log("***" + e);
      })
      .then(() => {
        console.log("***result=" + result);
        expect(result).toBeFalse();
      });
  });
  /*
  it("newDoc3", () => {
    service.newDoc(
      "三世諸仏総勘文教相廃立",
      `# 第九章　譬喩で爾前と法華の関係明す

　一切経の語は夢中の語とは/譬えば扇と樹との如し/法華経の寤《うつつ》の心を顕《あらわ》す言《ことば》とは/譬えば月と風との如し、/故に本覚の寤の心の月輪の光は無明の闇を照し/実相|般若《はんにゃ》の智慧の風は妄想の塵を払う`,
      Define.MODE_H
    );

    let doc = service.curDoc;
    expect(doc.title).toBe("三世諸仏総勘文教相廃立");
    expect(doc.contents.length).toBe(1);
  });
  */
});
