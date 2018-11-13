import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-movie',
  templateUrl: './create-movie.component.html',
  styleUrls: ['./create-movie.component.css']
})
export class CreateMovieComponent implements OnInit {
  createMovieForm:FormGroup;
  moviePaths:String[]=[];
  imdbObject:any={data:'Click check and verify the data here'};
  checkButtonDisabled:boolean=false;
  constructor(
    private formBuilder:FormBuilder,
    private apiService:ApiService,
    private matSnackBar:MatSnackBar) { }

  ngOnInit() {
    this.apiService.getUnFetchedMoviePaths().subscribe(
      data=>{
        const d=Object(data);
        if(d.success){
          console.log('Movie paths fetched');
          this.moviePaths=d.data.data;
        }else{
          this.matSnackBar.open(d.data.msg,'Okay',{duration:5000});
        }
      },
      error=>{
        console.log('Error in fetching movie paths: ',error);
        this.matSnackBar.open('Something went wrong. Please try again.','Okay',{duration:5000});
      }
    );

    this.createMovieForm=this.formBuilder.group({
      'path':['',Validators.required],
      'imdbId':['',Validators.required]
    });
  }

  createMovie(){
    const path=this.createMovieForm.value.path;
    const imdbId=this.createMovieForm.value.imdbId;

    if(path&&imdbId){
      console.log('Creating movie');
      this.apiService.createMovie(path,imdbId).subscribe(
        data=>{
          const d=Object(data);
          console.log('Create movie response:',d.data.data);
        },
        error=>{
          console.log('Error in creating movie: ',error);
          this.matSnackBar.open('Something went wrong. Please try again.','Okay',{duration:5000});
        }
      );
    }else{
      console.log('Please fill up the form first');
      this.matSnackBar.open('Please fill all the details first','Okay',{duration:5000});
    }
  }

  getImdbData(){
    if(this.createMovieForm.value.imdbId){
      this.checkButtonDisabled=true;
      this.apiService.getImdbData(this.createMovieForm.value.imdbId).subscribe(
        data=>{
          console.log('Got data from omdb');
          this.imdbObject=Object(data);
          this.checkButtonDisabled=false;
        },
        error=>{
          console.log('Error in fetching data from omdb: ',error);
          this.checkButtonDisabled=false;
          this.matSnackBar.open('Something went wrong. Please try again.','Okay',{duration:5000});
        }
      )
    }else{
      console.log('ImdbId not entered');
      this.matSnackBar.open('Enter IMDB Id and try again','Okay',{duration:5000});
    }
  }

}
