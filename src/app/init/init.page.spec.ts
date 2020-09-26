import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { InitPage } from "./init.page";

describe("InitPage", () => {
  let component: InitPage;
  let fixture: ComponentFixture<InitPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InitPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(InitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));
});
