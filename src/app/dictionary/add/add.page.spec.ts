import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';


import { AddPage } from './add.page';

describe('AddPage', () => {
  let component: AddPage;
  let fixture: ComponentFixture<AddPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddPage],
    }).compileComponents();

    fixture = TestBed.createComponent(AddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
