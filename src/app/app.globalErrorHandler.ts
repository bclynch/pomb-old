import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { ErrorService } from '../services/error.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) { }
  handleError(error) {
    // have to manually call the injector with the service name in the execution because we want to make sure this happens first
    const errorService = this.injector.get(ErrorService);
    errorService.handleResponseError(error);

    // IMPORTANT: Rethrow the error otherwise it gets swallowed
    throw error;
  }
}
