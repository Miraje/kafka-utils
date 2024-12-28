import {Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {KafkaRecordComponent} from 'components/shared/kafka-record/kafka-record.component';
import {KafkaUtilsService} from 'services/kafka-utils.service';
import {first, tap} from 'rxjs';
import {KafkaRecord} from 'models/kafkaRecord.interface';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {GenericResponse} from 'models/genericResponse.interface';
import {HttpErrorResponse} from '@angular/common/http';
import {JsonUtils} from 'utils/JsonUtils';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {DatePipe, SlicePipe} from '@angular/common';
import {HighlightUtils} from "utils/HighlightUtils";

@Component({
  selector: 'app-consumer-page',
  standalone: true,
  templateUrl: './consumer-page.component.html',
  styleUrl: './consumer-page.component.scss',
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule,
    KafkaRecordComponent,
    MatProgressSpinner,
    MatPaginator,
    SlicePipe,
  ],
})
export class ConsumerPageComponent {
  configuration =
    '{\n' +
    '\t"bootstrap.servers": "{{CLUSTER_BOOTSTRAP_SERVER}}",\n' +
    '\t"ssl.endpoint.identification.algorithm": "https",\n' +
    '\t"security.protocol": "SASL_SSL",\n' +
    '\t"sasl.mechanism": "PLAIN",\n' +
    '\t"sasl.jaas.config": "org.apache.kafka.common.security.plain.PlainLoginModule required username=\\"{{API_KEY}}\\" password=\\"{{API_SECRET}}\\";",\n' +
    '\t"key.deserializer": "org.apache.kafka.common.serialization.StringDeserializer",\n' +
    '\t"value.deserializer": "org.apache.kafka.common.serialization.StringDeserializer",\n' +
    '\t"key.serializer": "org.apache.kafka.common.serialization.StringSerializer",\n' +
    '\t"value.serializer": "org.apache.kafka.common.serialization.StringSerializer",\n' +
    '\t"max.poll.interval.ms": "300000",\n' +
    '\t"enable.auto.commit": "true",\n' +
    '\t"auto.offset.reset": "earliest",\n' +
    '\t"application.id": "{{SERVICE_ACCOUNT_NAME}}",\n' +
    '\t"group.id": "{{CONSUMER_GROUP_NAME}}",\n' +
    '\t"input.topic.name": "{{TOPIC_NAME}}"\n' +
    '}';
  searchQuery: string;
  records: KafkaRecord[] = [];
  filteredRecords: KafkaRecord[] = [];
  isRequestInProgress = false;
  responseErrors: string[];

  paginatorFirstValue = 0;
  paginatorLastValue = 20;

  constructor(private kafkaUtilsService: KafkaUtilsService) {
    // Stupid fix due Angular v19 bug
    setTimeout(() => {
      this.configuration = this.configuration + ' '
    },1000)
  }

  consume() {
    this.cleanup(true);

    if (!JsonUtils.isJson(this.configuration)) {
      this.responseErrors = ['Invalid JSON configuration'];
      return;
    }

    this.isRequestInProgress = true;
    this.kafkaUtilsService
      .consume$(this.configuration)
      .pipe(
        first(),
        tap((response) => this.processResponse(response)),
      )
      .subscribe();
  }

  highlightSearch() {
    const query = this.getQueryValue()
    if (query) {
      setTimeout(() => HighlightUtils.highlight(query), 50)
    } else {
      HighlightUtils.clear()
    }
  }

  getPaginatorData(event: PageEvent): PageEvent {
    this.paginatorFirstValue = event.pageIndex * event.pageSize;
    this.paginatorLastValue = this.paginatorFirstValue + event.pageSize;
    this.highlightSearch()
    return event;
  }

  filterRecords() {
    this.cleanup();

    const query = this.getQueryValue()
    if (query) {
      this.filteredRecords = this.records.filter(
        (record) => {
          return this.includes(record.key, query) ||
            this.includes(record.value, query) ||
            this.includes(("Partition: " + record.partition), query) ||
            this.includes(("Offset: " + record.offset), query) ||
            this.includes(new DatePipe("en-US").transform(record.timestamp, "medium"), query)
        }
      )

      this.highlightSearch()
    }
  }

  private cleanup(cleanupRecords = false) {
    if (cleanupRecords) this.records = [];
    this.filteredRecords = this.records;
    this.responseErrors = [];
    this.paginatorFirstValue = 0;
    this.paginatorLastValue = 20;

    HighlightUtils.clear()
  }

  private processResponse(response: GenericResponse<KafkaRecord[]>) {
    this.isRequestInProgress = false;

    if (response instanceof HttpErrorResponse) {
      this.responseErrors = [response.message];
      return;
    }

    if (response.errors) {
      this.responseErrors = response.errors.map((error) => error.message);
      return;
    }

    this.records = response.data
      .map((record) => {
        const key = record.key?.startsWith('\u0000')
          ? record.key.substring(5, record.key.length)
          : record.key;
        const value = record.value.startsWith('\u0000')
          ? record.value.substring(5, record.value.length)
          : record.value;
        return {...record, key: key, value: value};
      })
      .sort(({timestampUnixMs: a}, {timestampUnixMs: b}) => (a < b ? -1 : a > b ? 1 : 0))
      .reverse();

    this.filteredRecords = this.records;
  }

  private getQueryValue() {
    if (this.searchQuery?.length > 0 && this.records?.length > 0) {
      return this.searchQuery.trim().toLowerCase()
    } else {
      return null
    }
  }

  private includes(toEvaluate: any, toContain: string): boolean {
    if (!toEvaluate) return false

    const toEvaluateTmp = toEvaluate.toString().trim().toLowerCase()
    const toContainTmp = toContain.toString().trim().toLowerCase()

    return toEvaluateTmp.includes(toContainTmp)
  }
}
