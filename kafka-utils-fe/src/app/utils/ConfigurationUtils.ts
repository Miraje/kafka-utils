import {StorageUtils} from "utils/StorageUtils";
import {Configuration} from "models/configuration.interface";

function get<T extends Configuration>(key: string): T[] {
  const configurations = StorageUtils.get(key);
  return configurations ? JSON.parse(configurations).sort((a, b) => a.name - b.name) : []
}

function addOrUpdate<T extends Configuration>(configuration: T, key: string): T[] {
  const configurations = get<T>(key);
  const configurationsFiltered = configurations.filter(config => config.id !== configuration.id)

  const newConfigurations = [...configurationsFiltered, configuration]
  StorageUtils.set(key, JSON.stringify(newConfigurations));

  return newConfigurations
}

function remove<T extends Configuration>(configuration: T, key: string): T[] {
  const configurations = get<T>(key);
  const configurationsFiltered = configurations.filter(config => config.id !== configuration.id)

  const newConfigurations = [...configurationsFiltered,]
  StorageUtils.set(key, JSON.stringify(newConfigurations));

  return newConfigurations
}


export const ConfigurationUtils = {
  get: get,
  addOrUpdate: addOrUpdate,
  remove: remove
}
