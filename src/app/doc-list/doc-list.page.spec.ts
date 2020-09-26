import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { DocListPage } from "./doc-list.page";

describe("DocListPage", () => {
  let component: DocListPage;
  let fixture: ComponentFixture<DocListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DocListPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(DocListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));
});
