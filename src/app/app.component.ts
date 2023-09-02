import { Component} from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface MovieSearchResult {
  Search: {Title: string;Poster: string;}[];
  Error?: string;
}

@Component({selector: 'app-root',templateUrl: './app.component.html',styleUrls: ['./app.component.css']})

export class AppComponent{
  movie: any;
  title = 'My movie App';
  reviews: string[] = [];
  suggestions: any[] = [];  
  filteredSuggestions: any[] = [];
  titleControl = new FormControl();

  constructor(private http: HttpClient) 
  {
    this.titleControl.valueChanges.subscribe((value) => 
    {
      this.http.get<MovieSearchResult>(`http://www.omdbapi.com/?s=${value}&apikey=6984245c`).subscribe((data) => 
      {if (data.Search) {this.suggestions = data.Search;this.filteredSuggestions = this.filterSuggestions(value);}});
    });
  }

  filterSuggestions(value: string): any[] 
  {
    const filterValue = value.toLowerCase();
    return this.suggestions.filter((suggestion) => suggestion.Title.toLowerCase().includes(filterValue));
  }

  search() 
  {
    this.http.get(`http://www.omdbapi.com/?t=${this.titleControl.value}&apikey=6984245c`).subscribe((data) => 
    {this.movie = data;if (this.movie.Ratings) {this.reviews = this.movie.Ratings.slice(0, 10).map((rating: { Value: string }) => rating.Value);}});
  }
}