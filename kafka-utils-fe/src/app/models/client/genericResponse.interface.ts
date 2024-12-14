export interface GenericResponse<Type> {
  data: Type;
  errors?: GenericError[];
}

export interface GenericError {
  httpCode?: number;
  code: string;
  message: string;
}
