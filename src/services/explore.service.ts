import { Injectable } from '@angular/core';

import { APIService } from './api.service';
import { UtilService } from './util.service';

@Injectable()
export class ExploreService {

  //maybe make into JSON
  regions = {
    africa: {
      northern_africa: ['DZ', 'EG', 'EH', 'LY', 'MA', 'SD', 'SS', 'TN'],
      western_africa: ['BF', 'BJ', 'CI', 'CV', 'GH', 'GM', 'GN', 'GW', 'LR', 'ML', 'MR', 'NE', 'NG', 'SH', 'SL', 'SN', 'TG'],
      middle_africa: ['AO', 'CD', 'ZR', 'CF', 'CG', 'CM', 'GA', 'GQ', 'ST', 'TD'],
      eastern_africa: ['BI', 'DJ', 'ER', 'ET', 'KE', 'KM', 'MG', 'MU', 'MW', 'MZ', 'RE', 'RW', 'SC', 'SO', 'TZ', 'UG', 'YT', 'ZM', 'ZW'],
      southern_africa: ['BW', 'LS', 'NA', 'SZ', 'ZA']
    },
    europe: {
      northern_europe: ['GG', 'JE', 'AX', 'DK', 'EE', 'FI', 'FO', 'GB', 'IE', 'IM', 'IS', 'LT', 'LV', 'NO', 'SE', 'SJ'],
      western_europe: ['AT', 'BE', 'CH', 'DE', 'DD', 'FR', 'FX', 'LI', 'LU', 'MC', 'NL'],
      eastern_europe: ['BG', 'BY', 'CZ', 'HU', 'MD', 'PL', 'RO', 'RU', 'SU', 'SK', 'UA'],
      southern_europe: ['AD', 'AL', 'BA', 'ES', 'GI', 'GR', 'HR', 'IT', 'ME', 'MK', 'MT', 'CS', 'RS', 'PT', 'SI', 'SM', 'VA', 'YU']
    },
    americas: {
      north_america: ['BM', 'CA', 'GL', 'PM', 'US'],
      caribbean: ['AG', 'AI', 'AN', 'AW', 'BB', 'BL', 'BS', 'CU', 'DM', 'DO', 'GD', 'GP', 'HT', 'JM', 'KN', 'KY', 'LC', 'MF', 'MQ', 'MS', 'PR', 'TC', 'TT', 'VC', 'VG', 'VI'],
      central_america: ['BZ', 'CR', 'GT', 'HN', 'MX', 'NI', 'PA', 'SV'],
      south_america: ['AR', 'BO', 'BR', 'CL', 'CO', 'EC', 'FK', 'GF', 'GY', 'PE', 'PY', 'SR', 'UY', 'VE']
    },
    asia: {
      central_asia: ['TM', 'TJ', 'KG', 'KZ', 'UZ'],
      eastern_asia: ['CN', 'HK', 'JP', 'KP', 'KR', 'MN', 'MO', 'TW'],
      southern_asia: ['AF', 'BD', 'BT', 'IN', 'IR', 'LK', 'MV', 'NP', 'PK'],
      south_eastern_asia: ['BN', 'ID', 'KH', 'LA', 'MM', 'BU', 'MY', 'PH', 'SG', 'TH', 'TL', 'TP', 'VN'],
      western_asia: ['AE', 'AM', 'AZ', 'BH', 'CY', 'GE', 'IL', 'IQ', 'JO', 'KW', 'LB', 'OM', 'PS', 'QA', 'SA', 'NT', 'SY', 'TR', 'YE', 'YD']
    },
    oceania: {
      australasia: ['AU', 'NF', 'NZ'],
      melanesia: ['FJ', 'NC', 'PG', 'SB', 'VU'],
      micronesia: ['FM', 'GU', 'KI', 'MH', 'MP', 'NR', 'PW'],
      polynesia: ['AS', 'CK', 'NU', 'PF', 'PN', 'TK', 'TO', 'TV', 'WF', 'WS']
    }
  };
  //again nice to put into json
  googleRegionCodes = {
    '002': 'Africa', 
    '015': 'Northern Africa', 
    '011': 'Western Africa', 
    '017': 'Middle Africa', 
    '014': 'Eastern Africa', 
    '018': 'Southern Africa', 
    '150': 'Europe', 
    '154': 'Northern Europe', 
    '155': 'Western Europe', 
    '151': 'Eastern Europe', 
    '039': 'Southern Europe', 
    '019': 'Americas', 
    '021': 'North America', 
    '029': 'Caribbean', 
    '013': 'Central America', 
    '005': 'South America', 
    '142': 'Asia', 
    '143': 'Central Asia', 
    '030': 'Eastern Asia', 
    '034': 'Southern Asia', 
    '035': 'South Eastern Asia', 
    '145': 'Western Asia', 
    '009': 'Oceania', 
    '053': 'Australasia', 
    '054': 'Melanesia', 
    '057': 'Micronesia', 
    '061': 'Polyneisa'
  };

  private countryCodeCache = {};

  regionsArr: { region: string; subregions: string[]; }[] = [];
  countryNameObj = {};
  countryCodeObj = {};
  displayExploreNav: boolean;

  constructor(
    private apiService: APIService,
    private utilService: UtilService
  ) {}

  init() {
    return new Promise<string>((resolve, reject) => {
      this.processRegions();
      this.createCountryObjects().then(() => resolve());
    });
  }

  private processRegions() {
    const self = this;
    Object.keys(this.regions).forEach((region) => {
      let formattedArr = Object.keys(this.regions[region]).map((subregion) => {
        return subregion.split('_').join(' ');
      });
      self.regionsArr.push({ region, subregions: formattedArr});
    });
    console.log(this.regionsArr);
  }

  getGoogleCodeByName(name: string) {
    let countryCode: string;

    Object.keys(this.googleRegionCodes).forEach((code) => {
      if(this.googleRegionCodes[code] === name) countryCode = code;
    });
    return countryCode;
  }

  private createCountryObjects() {
    return new Promise<string>((resolve, reject) => {
      let nameObj = {};
      let codeObj = {};
      this.apiService.getAllCountries().subscribe(
        countries => {
          countries.forEach((country) => {
            //create object with name keys
            nameObj[country.name] = country;

            //create object with code keys
            codeObj[country.alpha2Code] = country;
          });

          this.countryCodeObj = codeObj;
          this.countryNameObj = nameObj;
          console.log('All countries by name: ', this.countryNameObj);
          console.log('All countries by code: ', this.countryCodeObj);
          resolve();
        }
      )
    });
  }

  requestCountryCodes(region: string, subregion?: string) {
    //check cache first
    if(subregion) {
      if(this.countryCodeCache[subregion]) return this.countryCodeCache[subregion];
    } else {
      if(this.countryCodeCache[region]) return this.countryCodeCache[region];
    }

    //geochart likes having country keyword first
    let countryCodeArr: string[][] = [['Country']];
    const self = this;
    if(region === 'all') {
      Object.keys(this.regions).forEach((region) => {
        countryCodeArr = countryCodeArr.concat(this.combineSubregions(region));
      });
    } else {
      countryCodeArr = subregion ? countryCodeArr.concat(this.formatSubregion(this.regions[region][subregion.split(' ').join('_').toLowerCase()])) : countryCodeArr.concat(this.combineSubregions(region.toLowerCase()));
    }
    console.log(countryCodeArr);

    //caching
    if(subregion) {
      this.countryCodeCache[subregion] = countryCodeArr;
    } else {
      this.countryCodeCache[region] = countryCodeArr;
    }
    return countryCodeArr;
  }

  private combineSubregions(region: string) {
    let subregionArr = [];
    Object.keys(this.regions[region]).forEach((subregion) => {
      subregionArr = subregionArr.concat(this.formatSubregion(this.regions[region][subregion]));
    });
    return subregionArr;
  }

  private formatSubregion(arr: string[]) {
    let subregionArr: string[][] = [];
    arr.forEach((code) => {
      if(this.countryCodeObj[code]) subregionArr.push([this.countryCodeObj[code].name]);
    }); 
    return subregionArr;
  }
}