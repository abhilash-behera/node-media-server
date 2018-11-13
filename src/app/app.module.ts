// Angular Natives
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Route } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

// Components
import { AppComponent } from './app.component';
import { CreateMovieComponent } from './create-movie/create-movie.component';

// Services
import {ApiService} from './api.service';

// Material Design
import { MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, 
  MatSnackBarModule, MatButtonModule } from '@angular/material';

// Other External Libraries
import { NgxJsonViewerModule } from 'ngx-json-viewer';



const routes: Route[] = [
  { path: '', component: CreateMovieComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    CreateMovieComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgxJsonViewerModule,
    MatSelectModule,
    HttpClientModule,
    MatSnackBarModule,
    MatButtonModule
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
