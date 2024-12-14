import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumerGroupPageComponent } from './consumer-group-page.component';

describe('ConsumerGroupPageComponent', () => {
  let component: ConsumerGroupPageComponent;
  let fixture: ComponentFixture<ConsumerGroupPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsumerGroupPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsumerGroupPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
