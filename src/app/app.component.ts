import { Component,ElementRef,ViewChild,HostListener} from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface MovieSearchResult
{
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
  visibleSuggestions: any[] = []; 
  titleControl = new FormControl();

  @ViewChild('searchBox') searchBox!: ElementRef;
  @HostListener('document:click', ['$event'])
  @HostListener('document:keydown.escape')onKeydownHandler() {this.filteredSuggestions = [];}
  @ViewChild('suggestionsContainer', { read: ElementRef }) suggestionsContainer!: ElementRef;

  onFocus() {if (this.suggestions.length) {setTimeout(() => {this.filteredSuggestions = this.suggestions;}, 200);}}
  
  onWheel(event: WheelEvent) 
  {
    event.preventDefault();
    const elementHeight = 237;
    if (event.deltaY < 0) {this.suggestionsContainer.nativeElement.scrollTop -= elementHeight;}
    else {this.suggestionsContainer.nativeElement.scrollTop += elementHeight;    }
  }

  clickout(event: Event)
  {
    if (this.searchBox && this.searchBox.nativeElement.contains(event.target)) {}
    else if (this.suggestionsContainer && !this.suggestionsContainer.nativeElement.contains(event.target)) {this.filteredSuggestions = [];}
  }
  
  constructor(private http: HttpClient) 
  {
    this.titleControl.valueChanges.subscribe((value) => 
    {
      this.http.get<MovieSearchResult>(`http://www.omdbapi.com/?s=${value}&apikey=6984245c`).subscribe((data) => 
      {
        this.suggestions = data.Search || [];
        this.filteredSuggestions = this.filterSuggestions(value);
      });
    });
  }
  filterSuggestions(value: string): any[] {
    const filterValue = value.toLowerCase();
    let filtered = this.suggestions.filter((suggestion) => suggestion.Title.toLowerCase().includes(filterValue));
    return  filtered.length ? filtered : [];
  }

  search() 
  {
    this.http.get(`http://www.omdbapi.com/?t=${this.titleControl.value}&apikey=6984245c`).subscribe((data) => 
    {this.movie = data;if (this.movie.Ratings) {this.reviews = this.movie.Ratings.slice(0, 10).map((rating: { Value: string }) => rating.Value);}});
  }
}