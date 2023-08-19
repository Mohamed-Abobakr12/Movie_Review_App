import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

interface MovieSearchResult {
  Search: {
    Title: string;
    Poster: string;
  }[];
}

@Component({
  selector: 'app-root',
  template: `
    <div>
      <mat-form-field>
        <input matInput [formControl]="titleControl" [matAutocomplete]="auto" placeholder="Enter movie title" />
        <mat-autocomplete #auto="matAutocomplete">
          <mat-option *ngFor="let suggestion of filteredSuggestions | async" [value]="suggestion.Title">
            <img [src]="suggestion.Poster" alt="{{ suggestion.Title }} poster" />
            {{ suggestion.Title }}
          </mat-option>
        </mat-autocomplete>
      </mat-form-field>
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
export class AppComponent {
  titleControl = new FormControl();
  title = 'My App';
  suggestions: any[] = [];
  filteredSuggestions: Observable<any[]>;
  movie: any;
  reviews: string[] = [];

  constructor(private http: HttpClient) {
    this.titleControl.valueChanges.subscribe((value) => 
    {
        this.http.get<MovieSearchResult>(`http://www.omdbapi.com/?s=${value}&apikey=6984245c`).subscribe((data) => 
        {
          
          if (data.Search) {this.suggestions = data.Search;} 
          else {console.error('Error: data returned from OMDb API is not in the expected format');}
        });
    });

    this.filteredSuggestions = this.titleControl.valueChanges.pipe(
      startWith(''),
      
      map((value) => this.filterSuggestions(value))
    );
  }

  filterSuggestions(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.suggestions.filter((suggestion) =>
      suggestion.Title.toLowerCase().includes(filterValue)
    );
  }

  search() {
    this.http.get(`http://www.omdbapi.com/?t=${this.titleControl.value}&apikey=6984245c`).subscribe((data) => {
      this.movie = data;
      if (this.movie.Ratings) {
        this.reviews = this.movie.Ratings.slice(0, 10).map((rating: { Value: string }) => rating.Value);
      }
    });
  }
}
