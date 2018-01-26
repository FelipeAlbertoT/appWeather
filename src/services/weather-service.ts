import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class WeatherService {
    
    private token: string = '3d4b12dc811c54db19b5428bf57ddc01';

    constructor(private _http:HttpClient) {

    }

    buscaPrevisao(id) {
        return this._http.get('http://apiadvisor.climatempo.com.br/api/v1/weather/locale/'+id+'/current?token='+this.token);
    }

    buscaCidades():Observable<any[]> {
        return this._http.get<any[]>('http://apiadvisor.climatempo.com.br/api/v1/locale/city?token='+this.token);
    }
}