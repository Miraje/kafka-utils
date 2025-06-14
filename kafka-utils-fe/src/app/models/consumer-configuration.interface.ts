import {FormControl, FormGroup} from "@angular/forms";
import {Configuration} from "models/configuration.interface";

export interface ConsumerConfigurationForm {
  id: FormControl<string>;
  name: FormControl<string>;
  apiKey: FormControl<string>;
  bootstrapServers: FormControl<string>;
  groupId: FormControl<string>;
  topicName: FormControl<string>;
  apiSecret: FormControl<string>
}

export interface ConsumerConfiguration extends Configuration {
  name: string,
  topicName: string,
  apiKey: string,
  apiSecret: string,
  bootstrapServers: string,
  groupId: string,
}

export function fromFormToConsumerConfiguration(form: FormGroup<ConsumerConfigurationForm>): ConsumerConfiguration {
  return {
    id: form.controls.id.value ?? Date.now().toString(16) + Math.random().toString(16),
    name: form.controls.name.value,
    topicName: form.controls.topicName.value,
    apiKey: form.controls.apiKey.value,
    apiSecret: form.controls.apiSecret.value,
    bootstrapServers: form.controls.bootstrapServers.value,
    groupId: form.controls.groupId.value,
  }
}

export function updateFormFrommConfiguration(form: FormGroup<ConsumerConfigurationForm>, configuration: ConsumerConfiguration) {
  form.controls.id.setValue(configuration?.id)
  form.controls.name.setValue(configuration?.name);
  form.controls.topicName.setValue(configuration?.topicName);
  form.controls.apiKey.setValue(configuration?.apiKey);
  form.controls.apiSecret.setValue(configuration?.apiSecret);
  form.controls.bootstrapServers.setValue(configuration?.bootstrapServers);
  form.controls.groupId.setValue(configuration?.groupId);
}
