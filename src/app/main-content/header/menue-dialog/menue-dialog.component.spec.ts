import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenueDialogComponent } from './menue-dialog.component';

describe('MenueDialogComponent', () => {
  let component: MenueDialogComponent;
  let fixture: ComponentFixture<MenueDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenueDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenueDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
