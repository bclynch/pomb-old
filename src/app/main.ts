import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';

//for froala
import * as $ from 'jquery';
window["$"] = $;
window["jQuery"] = $;

platformBrowserDynamic().bootstrapModule(AppModule);
