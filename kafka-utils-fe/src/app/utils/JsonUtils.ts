function isJson(text: string) {
  try {
    JSON.parse(text);
  } catch (e) {
    return false;
  }
  return true;
}

export const JsonUtils = {
  isJson: isJson
}
