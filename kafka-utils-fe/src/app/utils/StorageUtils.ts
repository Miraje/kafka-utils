function set(key: string, data: any) {
  localStorage.setItem(key, data);
}

function get(key: string) {
  return localStorage.getItem(key);
}

function remove(key: string) {
  return localStorage.removeItem(key);
}

export const StorageUtils = {
  set: set,
  get: get,
  remove: remove,
}
