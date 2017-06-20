import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { TranslateService } from '@ngx-translate/core';
import { locale } from 'devextreme/localization';

import { ConfigOptions } from './config.model';

@Injectable()
export class ConfigService {

  private config: Object = {};

  constructor(
    private http: Http,
    private translate?: TranslateService
  ) {
    if (this.translate) {
      locale(this.translate.getBrowserLang());
      this.translate.setDefaultLang(this.translate.getBrowserLang());
    }
  }

  /**
   * Use to get the data found in config file
   */
  public getConfig(key: string): any {
    return this.config[key] || undefined;
  }

  public useLang(lang: string) {
    locale(lang);

    if (this.translate) {
      this.translate.use(lang);
    }
  }

  /**
   * This method loads "[path]" to get all config's variables
   */
  public load(options: ConfigOptions) {
    if (options.default) {
      this.config = options.default;
    }
    if (!options.path) {
      return true;
    }

    return new Promise((resolve, reject) => {
      this.http.get(options.path).map(res => res.json()).catch((error: any): any => {
        console.log(`Configuration file ${options.path} could not be read`);
        resolve(true);
        return Observable.throw(error.json().error || 'Server error');
      }).subscribe((configResponse) => {
        Object.assign(this.config, configResponse);
        resolve(true);
      });
    });
  }
}
