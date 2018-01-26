import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { WeatherService } from '../../services/weather-service';
import { Subject } from 'rxjs/Subject';
import { animate, trigger, state, style, transition, query, stagger, keyframes } from '@angular/animations';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  animations: [
    // trigger('flyInOut', [
    //   state('in', style({transform: 'translateX(0)'})),
    //   transition('void => *', [
    //     style({transform: 'translateX(-100%)'}),
    //     animate(100)
    //   ]),
    //   transition('* => void', [
    //     animate(100, style({transform: 'translateX(100%)'}))
    //   ])
    // ]),
    trigger('flyInOut', [
      transition('* => *', [

        query(':enter', style({ opacity: 0 }), {optional: true}),

        query(':enter', stagger('50ms', [
          animate('0.5s ease-in', keyframes([
            style({opacity: 0, transform: 'translateX(-75%)', offset: 0}),
            style({opacity: .7, transform: 'translateX(10px)',  offset: 0.3}),
            style({opacity: .7, transform: 'translateX(-1px)',  offset: 0.5}),
            style({opacity: .7, transform: 'translateX(3px)',  offset: 0.7}),
            style({opacity: 1, transform: 'translateX(0)',     offset: 1.0}),
          ]))]), {optional: true, limit: 10 }),

        query(':leave', stagger('30ms', [
          animate('0.3s ease-in', keyframes([
            style({opacity: 1, transform: 'translateY(0)', offset: 0}),
            style({opacity: .5, transform: 'translateY(35px)',  offset: 0.3}),
            style({opacity: 0, transform: 'translateY(-75%)',     offset: 1.0}),
          ]))]), {optional: true, limit: 8})
      ])
    ])
  ]
})
export class HomePage {

  previsao: any = {data:{}};
  cidades: any[];
  cidadesFiltradas: any[] = [];
  imgPrevisao: string = '';
  animar = true;
  animarClickId = 0;
  animarNegativa = false;
  private filterString:Subject<string> = new Subject<string>();

  constructor(public navCtrl: NavController, private _service:WeatherService) {
    this.buscaPrevisao(3477);
    this._service.buscaCidades()
    .subscribe((result) => {
        this.cidades = result;
    });
  }

  ngOnInit() {
    // this.cidades = this.filterString.switchMap(value => this._service.buscaCidade(value));
    this.filterString
        .debounceTime(400)
        .switchMap(value => this.filtrarCidades(value))
        .subscribe((result) => {
            this.cidades = this.cidades;
        });
    // this.filterString
    //     .debounceTime(400)
    //     .switchMap(value => this.filtrarCidades(value));
  } 

  filtrarCidades(value:string) {
    this.cidadesFiltradas = this.cidades.filter(cidade => {
      if(cidade.name.toLowerCase().indexOf(value.toLowerCase()) != -1)
        return cidade;
    })
    return this.cidadesFiltradas;
  }

  handleFilterChange(ev) {
    this.filterString.next(ev.target.value);
  }

  cidadeClick(id){
    if(this.animarClickId == id){
      this.animarNegativa = true;
    } else {
      this.animarNegativa = false;
      this.animarClickId = id;
    }
    this.buscaPrevisao(id);

  }

  buscaPrevisao(id) {
    this.animar = false;
    this._service.buscaPrevisao(id)
    .subscribe(res => {
        this.previsao = res;
        this.imgPrevisao = './assets/imgs/45px/' + this.previsao.data.icon + '.png'
        console.log(this.previsao);
        this.animar = true;
      });
  }
  
}
