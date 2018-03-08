import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { ENV } from '@app/env';

import { AppModule } from './app.module';

// for froala
import * as $ from 'jquery';
window['$'] = $;
window['jQuery'] = $;

if (ENV.mode === 'Production') {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
