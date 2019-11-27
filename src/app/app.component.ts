import { Component, OnInit } from '@angular/core';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'apartamento';

  house: any;
  flat: any;

  places: any = [];

  addMode: boolean;

  constructor(private readonly http: HttpService) {

  }

  ngOnInit() {

    try {
      this.http.genericGet('bairro').subscribe((response) => {
        console.log('GET em /bairros');
        console.log(response);
        this.places = response;
      });
    } catch (httpError) {
      this.places = [
        {id: 1, name: 'Bairro JK'},
        {id: 2, name: 'Nova Gameleira'},
        {id: 3, name: 'Nova Suissa'},
        {id: 4, name: 'Savassi'},
        {id: 5, name: 'Castelo'}
      ];

    }



    this.addMode = false;

    this.house = {
      place: '',
      address: '',
      rooms: '',
      area: '',
      dinning: '',
      extra: '',
      garage: '',
      suites: '',
      hasCloset: false,
      value: 0
    };
    this.flat = {
      place: '',
      address: '',
      rooms: '',
      area: '',
      dinning: '',
      extra: '',
      garage: '',
      suites: '',
      hasCloset: false,
      floor: '',
      condominiumValue: 0,
      hasLobby: false,
      value: 0
    };
  }

  canFinish(isHouse: boolean) {

    if (isHouse) {
      return this.seeAllKeys(this.house);
    } else {
      return this.seeAllKeys(this.flat);
    }
  }

  addNeighboor() {
    this.addMode = true;
  }

  seeAllKeys(obj) {
    const keys = Object.keys(obj);
    let response = true;
    keys.forEach((key) => {
      const value = obj[key];
      if (key !== 'extra') {
        if (key.toLowerCase().includes('value') && value <= 0) {
          response = false;
        }
        if (value < 0 || value === '' || value === undefined  || value === null) {
          response = false;
        }
      }
    });
    return response;
  }

  addPlace(isHouse: boolean) {

    const regionName = isHouse ? this.house.place : this.flat.place;
    let regionId;
    const addressName = isHouse ? this.house.address : this.flat.address;

    if (this.addMode) {
      /*HTTP POST ON BAIRROS*/
      this.http.genericPost('bairro', {name: regionName }, {}).subscribe((regionInfo: any) => {
        console.log('Cadastrar novo bairro');
        regionId = (regionInfo).id;
        this.http.genericPost('endereco', {bairro: regionId, name: addressName }, {}).subscribe((newAddr: any) => {
          console.log('Cadastrar endreço no bairro com id: ' + regionId);
          const addressId = (newAddr).id;
          if (isHouse) {
            this.http.genericPost('casa', {
              endereco: addressId,
              valor_aluguel: this.house.value,
              num_quartos: this.house.rooms,
              num_suites: this.house.suites,
              num_sala_estar: this.house.dinning,
              possui_armarios: this.house.hasCloset,
              vagas_garagem: this.house.garage,
              area: this.house.area,
              descricao: this.house.extra ? this.house.extra : '',
            }, {}).subscribe((response) => {
              console.log('Add house');
              console.log(response);
              this.ngOnInit();
            });
          } else {
            this.http.genericPost('apartamento', {
              endereco: addressId,
              valor_aluguel: this.flat.value,
              num_quartos: this.flat.rooms,
              num_suites: this.flat.suites,
              num_sala_estar: this.flat.dinning,
              vagas_garagem: this.flat.garage,
              possui_armarios: this.flat.hasCloset,
              possui_portaria: this.flat.hasLobby,
              area: this.flat.area,
              descricao: this.flat.extra ? this.flat.extra : '',
              andar: this.flat.floor,
              valor_condominio: this.flat.condominiumValue
            }, {}).subscribe((response) => {
              console.log('Add flat');
              console.log(response);
              this.ngOnInit();
            });
          }
        });

      });
    } else {
      regionId = this.places.find((el) => {
        return el.name === regionName;
      }).id;
      console.log('Cadastrar endreço no bairro com id: ' + regionId);
      this.http.genericPost('endereco', {bairro: regionId, name: addressName }, {}).subscribe((newAddr: any) => {
        console.log('Cadastrar endreço no bairro com id: ' + regionId);
        const addressId = (newAddr).id;
        if (isHouse) {
          this.http.genericPost('casa', {
            endereco: addressId,
            valor_aluguel: this.house.value,
            num_quartos: this.house.rooms,
            num_suites: this.house.suites,
            num_sala_estar: this.house.dinning,
            vagas_garagem: this.house.garage,
            area: this.house.area,
            possui_armarios: this.house.hasCloset,
            descricao: this.house.extra ? this.house.extra : '',
          }, {}).subscribe((response) => {
            console.log('Add house');
            console.log(response);
            this.ngOnInit();
          });
        } else {
          this.http.genericPost('apartamento', {
            endereco: addressId,
            valor_aluguel: this.flat.value,
            num_quartos: this.flat.rooms,
            num_suites: this.flat.suites,
            possui_portaria: this.flat.hasLobby,
            num_sala_estar: this.flat.dinning,
            possui_armarios: this.flat.hasCloset,
            vagas_garagem: this.flat.garage,
            area: this.flat.area,
            descricao: this.flat.extra ? this.flat.extra : '',
            andar: this.flat.floor,
            valor_condominio: this.flat.condominiumValue
          }, {}).subscribe((response) => {
            console.log('Add flat');
            console.log(response);
            this.ngOnInit();
          });
        }
      });

    }


  }




}
