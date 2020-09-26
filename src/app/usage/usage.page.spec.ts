import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { UsagePage } from "./usage.page";

describe("UsagePage", () => {
  let component: UsagePage;
  let fixture: ComponentFixture<UsagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UsagePage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(UsagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));
});
