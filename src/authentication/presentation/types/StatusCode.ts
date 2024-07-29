export enum StatusCode {
  OK = 200,
  Created = 201,
  Accepted = 202,
  NoContent = 204,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  InternalServerError = 500,
  NotImplemented = 501,
  BadGateway = 502,
  ServiceUnavailable = 503,
  UnprocessableEntity = 422,
  ERROR_UserDefaults_Empty = 'ERROR_UserDefaults_Empty',
}

export type CustomErrorType = {
  message: string;
  data: null | undefined;
};
