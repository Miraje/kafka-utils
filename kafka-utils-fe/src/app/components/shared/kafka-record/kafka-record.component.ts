import {Component, EventEmitter, Input, Output} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { KafkaRecord } from 'models/kafka-record.interface';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { DatePipe } from '@angular/common';
import { CodeSnippetComponent } from 'components/shared/code-snippet/code-snippet.component';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-kafka-record',
  standalone: true,
  templateUrl: './kafka-record.component.html',
  styleUrl: './kafka-record.component.scss',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    DatePipe,
    CodeSnippetComponent,
    MatDivider,
  ],
})
export class KafkaRecordComponent {
  @Input() record: KafkaRecord;
  @Input() numberOfMessage: number;
  @Input() numberOfTotalMessages: number;

  @Output() showTruncatedToggled = new EventEmitter<boolean>()

  onShowTruncatedToggled(eventValue: boolean) {
    this.showTruncatedToggled.emit(eventValue)
  }
}
