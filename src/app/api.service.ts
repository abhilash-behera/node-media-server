import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) { }

  createMovie(path: string, imdbId: string) {
    const body = {
      path: path,
      imdbId: imdbId
    }

    return this.httpClient.post('/createMovie', body).pipe(catchError(this.errorHandler));
  }

  getUnFetchedMoviePaths(){
    return this.httpClient.get('/listUnFetchedMovies').pipe(catchError(this.errorHandler));
  }

  getImdbData(imdbId:string){
    return this.httpClient.get('http://www.omdbapi.com/?i='+imdbId+'&apikey=7c6f180b').pipe(catchError(this.errorHandler));
  }

  errorHandler(errorResponse: HttpErrorResponse) {
    return throwError(errorResponse);
  }
}
