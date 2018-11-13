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
  someObject:any={name:'Abhilash Behera',age:22,gender:'male'};
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
    if(this.createMovieForm){

    }else{
      this.apiService.createMovie('','').subscribe(
        data=>{
          console.log('Create movie response');
        },
        error=>{
          console.log('Error in creating movie: ',error);
        }
      );
    }
  }

}
