import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UsageViewPage } from './usage-view.page';

describe('UsageViewPage', () => {
  let component: UsageViewPage;
  let fixture: ComponentFixture<UsageViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsageViewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UsageViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
