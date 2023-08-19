import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  template: `
    <div>
      <input [(ngModel)]="title" placeholder="Enter movie title" />
      <button (click)="search()">Search</button>
    </div>
    <div *ngIf="movie">
      <h2>{{ movie.Title }}</h2>
      <img [src]="movie.Poster" alt="{{ movie.Title }} poster" />
      <h3>Top 10 Reviews:</h3>
      <ul>
        <li *ngFor="let review of reviews">{{ review }}</li>
      </ul>
    </div>`,
})

export class AppComponent 
{

  title = '';
  movie: any;
  reviews: string[] = [];
  constructor(private http: HttpClient) {}

  search() 
  {
    this.http.get(`http://www.omdbapi.com/?t=${this.title}&apikey=6984245c`).subscribe((data) => 
    {
      this.movie = data;
      this.reviews = this.movie.Ratings.slice(0, 10).map((rating: { Value: string }) => rating.Value);
    });
  }
}

