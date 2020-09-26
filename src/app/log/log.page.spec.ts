import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { LogPage } from "./log.page";

describe("LogPage", () => {
  let component: LogPage;
  let fixture: ComponentFixture<LogPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LogPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(LogPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));
});
