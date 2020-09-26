import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { DocInfoPage } from "./doc-info.page";

describe("DocInfoPage", () => {
  let component: DocInfoPage;
  let fixture: ComponentFixture<DocInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DocInfoPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(DocInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));
});
