import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ CommonModule, IonicModule, RouterModule, FormsModule ], 
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  pokemons: any[] = [];
  offset = 0;
  limit = 20;
  loading = false;
  searchTerm: string = '';
  searchedPokemon: any = null;
  searching: boolean = false;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadPokemons();
  }

  loadPokemons(event?: any) {
    if (this.loading) return;
    this.loading = true;

    this.http
      .get<any>(`https://pokeapi.co/api/v2/pokemon?offset=${this.offset}&limit=${this.limit}`)
      .subscribe((res) => {
        const requests = res.results.map((pokemon: any) =>
          this.http.get(pokemon.url)
        );

        Promise.all(requests.map((req: import('rxjs').Observable<any>) => req.toPromise())).then((details: any[]) => {
          this.pokemons = [...this.pokemons, ...details];
          this.offset += this.limit;
          this.loading = false;

          if (event) {
            event.target.complete();
          }

          if (res.next === null && event) {
            event.target.disabled = true;
          }
        });
      });
  }

  getImageUrl(pokemon: any): string {
    return pokemon.sprites?.front_default || '';
  }

  searchPokemon() {
    const name = this.searchTerm.trim().toLowerCase();
    if (!name) {
      this.searchedPokemon = null;
      this.searching = false;
      return;
    }
    this.searching = true;
    this.http.get(`https://pokeapi.co/api/v2/pokemon/${name}`).subscribe({
      next: (data) => {
        console.log(data);
        this.searchedPokemon = data;
        this.searching = false;
      },
      error: () => {
        this.searchedPokemon = { notFound: true, name };
        this.searching = false;
      }
    });
  }

}