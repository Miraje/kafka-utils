import {Component, ElementRef, HostListener, inject, OnInit, ViewChild} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {KafkaRecordComponent} from 'components/shared/kafka-record/kafka-record.component';
import {KafkaUtilsService} from 'services/kafka-utils.service';
import {first, tap} from 'rxjs';
import {KafkaRecord} from 'models/kafka-record.interface';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {GenericResponse} from 'models/generic-response.interface';
import {HttpErrorResponse} from '@angular/common/http';
import {JsonUtils} from 'utils/JsonUtils';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {DatePipe, SlicePipe} from '@angular/common';
import {HighlightUtils} from "utils/HighlightUtils";
import {MatIcon} from "@angular/material/icon";
import {MatDividerModule} from "@angular/material/divider";
import {MatDrawer, MatDrawerContainer, MatDrawerContent} from "@angular/material/sidenav";
import {MatActionList, MatListItem} from "@angular/material/list";
import {
  ConsumerConfiguration,
  ConsumerConfigurationForm,
  fromFormToConsumerConfiguration, updateFormFrommConfiguration
} from "models/consumer-configuration.interface";
import {ConfigurationUtils} from "utils/ConfigurationUtils";
import {MatDialog} from "@angular/material/dialog";
import {GenericDialogComponent} from "components/shared/confirmation-dialog/generic-dialog.component";
import {MatSlideToggle} from "@angular/material/slide-toggle";

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
    MatIcon,
    MatDividerModule,
    ReactiveFormsModule,
    MatDrawer,
    MatDrawerContainer,
    MatDrawerContent,
    MatActionList,
    MatListItem,
    MatSlideToggle,
  ],
})
export class ConsumerPageComponent implements OnInit {
  private dialog = inject(MatDialog);
  private kafkaUtilsService = inject(KafkaUtilsService);

  private readonly configuration =
    '{\n' +
    '\t"bootstrap.servers": "{{CLUSTER_BOOTSTRAP_SERVER}}",\n' +
    '\t"ssl.endpoint.identification.algorithm": "https",\n' +
    '\t"security.protocol": "SASL_SSL",\n' +
    '\t"sasl.mechanism": "PLAIN",\n' +
    '\t"sasl.jaas.config": "org.apache.kafka.common.security.plain.PlainLoginModule required username=\\"{{API_KEY}}\\" password=\\"{{API_SECRET}}\\";",\n' +
    '\t"key.deserializer": "org.apache.kafka.common.serialization.StringDeserializer",\n' +
    '\t"value.deserializer": "org.apache.kafka.common.serialization.StringDeserializer",\n' +
    '\t"max.poll.interval.ms": "300000",\n' +
    '\t"enable.auto.commit": "true",\n' +
    '\t"auto.offset.reset": "earliest",\n' +
    '\t"group.id": "{{CONSUMER_GROUP_NAME}}",\n' +
    '\t"input.topic.name": "{{TOPIC_NAME}}"\n' +
    '}';

  private readonly consumerConfigurationKey = 'kakfaUtils.consumerConfigurations'

  consumerConfigurationsAreVisible = true
  consumerConfigurations: ConsumerConfiguration[]

  form: FormGroup<ConsumerConfigurationForm>;

  searchQuery: string;
  records: KafkaRecord[] = [];
  filteredRecords: KafkaRecord[] = [];
  isRequestInProgress = false;
  responseErrors: string[];

  paginatorFirstValue = 0;
  paginatorLastValue = 20;

  searchBarYPosition: number;
  isSearchBarSticky = false;

  @ViewChild('searchBar') searchBarElementRef: ElementRef;


  constructor() {
    this.newConfiguration()
  }

  ngOnInit(): void {
    this.consumerConfigurations = ConfigurationUtils.get(this.consumerConfigurationKey)
  }

  @HostListener('window:scroll', ['$event'])
  handleScroll() {
    this.isSearchBarSticky = window.scrollY >= this.searchBarYPosition;
  }

  newConfiguration() {
    this.form = new FormGroup({
      id: new FormControl(null),
      name: new FormControl(null),
      topicName: new FormControl(null, [Validators.required]),
      apiKey: new FormControl(null, [Validators.required]),
      apiSecret: new FormControl(null, [Validators.required]),
      bootstrapServers: new FormControl(null, [Validators.required]),
      groupId: new FormControl(null, [Validators.required]),
    })
  }

  saveConfiguration() {
    if (!this.form.controls.name.value) {
      this.dialog.open(GenericDialogComponent, {
        width: '500px',
        data: {
          header: 'Error',
          title: 'A name is required to save the configuration',
          message: 'Define a name before saving the configuration.',
          positiveLabel: 'Ok',
        },
      });
      return
    }
    const configurationToUpdate = fromFormToConsumerConfiguration(this.form)
    this.consumerConfigurations = ConfigurationUtils.addOrUpdate(configurationToUpdate, this.consumerConfigurationKey)
  }

  deleteConfiguration() {
    const configurationToRemove = fromFormToConsumerConfiguration(this.form)
    this.consumerConfigurations = ConfigurationUtils.remove(configurationToRemove, this.consumerConfigurationKey)

    this.newConfiguration()
  }

  selectConfiguration(configuration: ConsumerConfiguration) {
    this.newConfiguration()
    updateFormFrommConfiguration(this.form, configuration)
  }

  consume() {
    this.cleanup(true);

    const config = this.configuration
      .replace("{{TOPIC_NAME}}", this.form.controls.topicName.value)
      .replace("{{CLUSTER_BOOTSTRAP_SERVER}}", this.form.controls.bootstrapServers.value)
      .replace("{{API_KEY}}", this.form.controls.apiKey.value)
      .replace("{{API_SECRET}}", this.form.controls.apiSecret.value)
      .replace("{{CONSUMER_GROUP_NAME}}", this.form.controls.groupId.value)

    if (!JsonUtils.isJson(config)) {
      this.responseErrors = ['Invalid configuration'];
      return;
    }

    this.isRequestInProgress = true;
    this.kafkaUtilsService
      .consume$(config)
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
      setTimeout(() => HighlightUtils.clear(), 50)
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
            this.includes(record.value ?? "", query) ||
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

    setTimeout(() => HighlightUtils.clear(), 50)
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
        const value = record.value?.startsWith('\u0000')
          ? record.value?.substring(5, record.value.length)
          : record.value;
        return {...record, key: key, value: value};
      })
      .sort(({timestampUnixMs: a}, {timestampUnixMs: b}) => (a < b ? -1 : a > b ? 1 : 0))
      .reverse();

    this.filteredRecords = this.records;

    setTimeout(() => this.searchBarYPosition = this.searchBarElementRef.nativeElement.offsetTop, 100)
  }

  private getQueryValue() {
    if (this.searchQuery?.length > 0 && this.records?.length > 0) {
      return this.searchQuery.trim().toLowerCase()
    } else {
      return null
    }
  }

  private includes(toEvaluate: unknown, toContain: string): boolean {
    if (!toEvaluate) return false

    const toEvaluateTmp = toEvaluate.toString().trim().toLowerCase()
    const toContainTmp = toContain.toString().trim().toLowerCase()

    return toEvaluateTmp.includes(toContainTmp)
  }
}
