import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { CommentsService } from '../services/comments.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, FormsModule ], 
  templateUrl: './pokemon-detail.page.html',
  styleUrls: ['./pokemon-detail.page.scss'],
})
export class PokemonDetailPage implements OnInit {
  pokemon: any;
  comment: string = '';
  comments: { comment: string, createdAt: Date }[] = [];

  constructor(private route: ActivatedRoute, private http: HttpClient, private commentsService: CommentsService) { }

  ngOnInit() {
    const name = this.route.snapshot.paramMap.get('name');
    this.http.get(`https://pokeapi.co/api/v2/pokemon/${name}`).subscribe(async data => {
      this.pokemon = data;
      this.comments = await this.commentsService.getCommentsByPokemon(name!);
    });
  }

  async saveComment() {
    if (this.pokemon?.name && this.comment.trim()) {
      await this.commentsService.saveComment(this.pokemon.name, this.comment);
      this.comments = await this.commentsService.getCommentsByPokemon(this.pokemon.name);
      this.comment = '';
    }
  }
}