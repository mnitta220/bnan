import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { DocViewPage } from "./doc-view.page";

describe("DocViewPage", () => {
  let component: DocViewPage;
  let fixture: ComponentFixture<DocViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DocViewPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(DocViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));
});
