import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UsageListPage } from './usage-list.page';

describe('UsageListPage', () => {
  let component: UsageListPage;
  let fixture: ComponentFixture<UsageListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsageListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UsageListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
