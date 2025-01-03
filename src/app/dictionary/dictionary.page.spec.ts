import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';


import { DictionaryPage } from './dictionary.page';

describe('DictionaryPage', () => {
  let component: DictionaryPage;
  let fixture: ComponentFixture<DictionaryPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DictionaryPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DictionaryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
