import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KafkaRecordComponent } from './kafka-record.component';

describe('KafkaRecordComponent', () => {
  let component: KafkaRecordComponent;
  let fixture: ComponentFixture<KafkaRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KafkaRecordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KafkaRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
