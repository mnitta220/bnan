import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UsageDocPage } from './usage-doc.page';

describe('UsageDocPage', () => {
  let component: UsageDocPage;
  let fixture: ComponentFixture<UsageDocPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsageDocPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UsageDocPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
