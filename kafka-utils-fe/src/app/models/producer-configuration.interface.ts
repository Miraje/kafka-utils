import {FormControl, FormGroup} from "@angular/forms";
import {Configuration} from "models/configuration.interface";

export interface ProducerConfigurationForm {
  id: FormControl<string>;
  name: FormControl<string>;
  apiKey: FormControl<string>;
  bootstrapServers: FormControl<string>;
  topicName: FormControl<string>;
  apiSecret: FormControl<string>
  messageKey: FormControl<string>
  messageValue: FormControl<string>
}

export interface ProducerConfiguration extends Configuration {
  name: string,
  topicName: string,
  apiKey: string,
  apiSecret: string,
  bootstrapServers: string,
}

export function fromFormToProducerConfiguration(form: FormGroup<ProducerConfigurationForm>): ProducerConfiguration {
  return {
    id: form.controls.id.value ?? Date.now().toString(16) + Math.random().toString(16),
    name: form.controls.name.value,
    topicName: form.controls.topicName.value,
    apiKey: form.controls.apiKey.value,
    apiSecret: form.controls.apiSecret.value,
    bootstrapServers: form.controls.bootstrapServers.value,
  }
}

export function updateFormFromToProducerConfiguration(form: FormGroup<ProducerConfigurationForm>, configuration: ProducerConfiguration) {
  form.controls.id.setValue(configuration?.id)
  form.controls.name.setValue(configuration?.name);
  form.controls.topicName.setValue(configuration?.topicName);
  form.controls.apiKey.setValue(configuration?.apiKey);
  form.controls.apiSecret.setValue(configuration?.apiSecret);
  form.controls.bootstrapServers.setValue(configuration?.bootstrapServers);
}
