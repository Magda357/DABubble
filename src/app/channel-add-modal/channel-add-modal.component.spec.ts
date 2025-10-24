import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChannelAddModalComponent } from './channel-add-modal.component';

describe('ChannelAddModalComponent', () => {
  let component: ChannelAddModalComponent;
  let fixture: ComponentFixture<ChannelAddModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChannelAddModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChannelAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
