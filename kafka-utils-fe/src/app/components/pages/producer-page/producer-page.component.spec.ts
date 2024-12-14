import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProducerPageComponent } from './producer-page.component';

describe('ProducerPageComponent', () => {
  let component: ProducerPageComponent;
  let fixture: ComponentFixture<ProducerPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProducerPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProducerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
