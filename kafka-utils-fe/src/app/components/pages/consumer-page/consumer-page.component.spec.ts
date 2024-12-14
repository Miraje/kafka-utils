import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumerPageComponent } from 'components/pages';

describe('ConsumerPageComponent', () => {
  let component: ConsumerPageComponent;
  let fixture: ComponentFixture<ConsumerPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsumerPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsumerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
