import {Component, inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatActionList, MatListItem} from "@angular/material/list";
import {MatButton, MatIconAnchor} from "@angular/material/button";
import {MatDrawer, MatDrawerContainer, MatDrawerContent} from "@angular/material/sidenav";
import {MatError, MatFormField, MatHint, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {
  fromFormToProducerConfiguration,
  ProducerConfiguration,
  ProducerConfigurationForm,
  updateFormFromToProducerConfiguration
} from "models/producer-configuration.interface";
import {KafkaUtilsService} from "services/kafka-utils.service";
import {JsonUtils} from "utils/JsonUtils";
import {first, tap} from "rxjs";
import {ConfigurationUtils} from "utils/ConfigurationUtils";
import {MatDialog} from "@angular/material/dialog";
import {GenericDialogComponent} from "components/shared/confirmation-dialog/generic-dialog.component";
import {GenericResponse} from "models/generic-response.interface";
import {HttpErrorResponse} from "@angular/common/http";
import {KafkaMetadata} from "models/kafka-metadata.interface";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";

@Component({
  selector: 'app-producer-page',
  standalone: true,
  imports: [
    FormsModule,
    MatActionList,
    MatButton,
    MatDrawer,
    MatDrawerContainer,
    MatDrawerContent,
    MatError,
    MatFormField,
    MatHint,
    MatIcon,
    MatIconAnchor,
    MatInput,
    MatLabel,
    MatListItem,
    MatProgressSpinner,
    ReactiveFormsModule,
    MatSlideToggle,
    CdkTextareaAutosize,
  ],
  templateUrl: './producer-page.component.html',
  styleUrl: './producer-page.component.scss'
})
export class ProducerPageComponent implements OnInit {
  private dialog = inject(MatDialog);
  private _snackBar = inject(MatSnackBar);
  private kafkaUtilsService = inject(KafkaUtilsService);


  private readonly configuration =
    '{\n' +
    '\t"bootstrap.servers": "{{CLUSTER_BOOTSTRAP_SERVER}}",\n' +
    '\t"ssl.endpoint.identification.algorithm": "https",\n' +
    '\t"security.protocol": "SASL_SSL",\n' +
    '\t"sasl.mechanism": "PLAIN",\n' +
    '\t"sasl.jaas.config": "org.apache.kafka.common.security.plain.PlainLoginModule required username=\\"{{API_KEY}}\\" password=\\"{{API_SECRET}}\\";",\n' +
    '\t"key.serializer": "org.apache.kafka.common.serialization.StringSerializer",\n' +
    '\t"value.serializer": "org.apache.kafka.common.serialization.StringSerializer",\n' +
    '\t"enable.auto.commit": "true",\n' +
    '\t"input.topic.name": "{{TOPIC_NAME}}"\n'

  private readonly producerConfigurationKey = 'kakfaUtils.producerConfigurations'

  producerConfigurationsAreVisible = true
  producerConfigurations: ProducerConfiguration[]

  isRequestInProgress = false;
  responseErrors: string[];

  form: FormGroup<ProducerConfigurationForm>;


  constructor() {
    this.newConfiguration()
  }

  ngOnInit(): void {
    this.producerConfigurations = ConfigurationUtils.get(this.producerConfigurationKey)
  }

  newConfiguration() {
    this.form = new FormGroup({
      id: new FormControl(null),
      name: new FormControl(null),
      topicName: new FormControl(null, [Validators.required]),
      apiKey: new FormControl(null, [Validators.required]),
      apiSecret: new FormControl(null, [Validators.required]),
      bootstrapServers: new FormControl(null, [Validators.required]),
      messageKey: new FormControl(null),
      messageValue: new FormControl(null),
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
    const configurationToUpdate = fromFormToProducerConfiguration(this.form)
    this.producerConfigurations = ConfigurationUtils.addOrUpdate(configurationToUpdate, this.producerConfigurationKey)
  }

  deleteConfiguration() {
    const configurationToRemove = fromFormToProducerConfiguration(this.form)
    this.producerConfigurations = ConfigurationUtils.remove(configurationToRemove, this.producerConfigurationKey)
    this.newConfiguration()
  }

  selectConfiguration(configuration: ProducerConfiguration) {
    this.newConfiguration()
    updateFormFromToProducerConfiguration(this.form, configuration)
  }

  produce() {
    this.responseErrors = []

    const messageKey = this.form.controls.messageKey.value
    const messageValue = this.form.controls.messageValue.value

    if (!messageKey && !messageValue) {
      this.dialog.open(GenericDialogComponent, {
        width: '500px',
        data: {
          header: 'Error',
          title: 'Message key and Message value are not defined',
          message: 'At least one of them must be provided!',
          positiveLabel: 'Ok',
        },
      });
      return
    }

    const config = this.configuration
        .replace("{{TOPIC_NAME}}", this.form.controls.topicName.value)
        .replace("{{CLUSTER_BOOTSTRAP_SERVER}}", this.form.controls.bootstrapServers.value)
        .replace("{{API_KEY}}", this.form.controls.apiKey.value)
        .replace("{{API_SECRET}}", this.form.controls.apiSecret.value)
      + (messageKey ? `, \t"input.message.key": "${messageKey}"\n` : "")
      + (messageValue ? `, \t"input.message.value": "${messageValue}"\n` : "")
      + '}';

    if (!JsonUtils.isJson(config)) {
      this.responseErrors = ['Invalid configuration'];
      return;
    }

    if (!messageKey || !messageValue) {
      const dialogRef = this.dialog.open(GenericDialogComponent, {
        width: '500px',
        data: {
          header: 'Just to confirm ...',
          title: messageKey ? 'Message value is not defined' : 'Message key is not defined',
          message: messageKey ? 'This will become a tombstone message.<br/> Do you wish to continue?' : 'Do you wish to continue?',
          negativeLabel: 'Cancel',
          positiveLabel: 'Continue',
        },
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.produceRecord(config)
        }
      });

    } else {
      this.produceRecord(config)
    }
  }

  private produceRecord(config: string) {
    this.isRequestInProgress = true;
    this.kafkaUtilsService
      .produce$(config)
      .pipe(
        first(),
        tap((response) => this.processResponse(response)),
      )
      .subscribe();
  }

  private processResponse(response: GenericResponse<KafkaMetadata>) {
    this.isRequestInProgress = false;

    if (response instanceof HttpErrorResponse) {
      this.responseErrors = [response.message];
      return;
    }

    if (response.errors) {
      this.responseErrors = response.errors.map((error) => error.message);
      return;
    }

    this._snackBar.open('Record produced with success!!!', '🥳', {
      horizontalPosition: "center",
      verticalPosition: "top",
      duration: 5000
    });
  }
}
