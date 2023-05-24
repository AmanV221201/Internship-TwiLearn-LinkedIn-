import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddDoctorComponent } from './add-doctor/add-doctor.component';
import { DataService } from 'src/app/shared/service/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Doctor } from 'src/app/shared/model/doctor';
import { Data } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { DeleteDoctorComponent } from './delete-doctor/delete-doctor.component';


@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.css']
})
export class DoctorComponent implements OnInit{
  doctorsArr  : Doctor[] = [];

  displayedColumns: string[] = ['name','mobile','email','department','action'];
  dataSource!: MatTableDataSource<Doctor>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  
  constructor(
    public dialog : MatDialog,
    private dataApi : DataService,
    private snackBar : MatSnackBar
  ){
      
  }
  ngOnInit(): void {
    this.getAllDoctors();
  }

addDoctor(): void{
  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;
  dialogConfig.data = {
    title : 'Register Doctor',
    buttonName : 'Register',
  }
  const dialogRef = this.dialog.open(AddDoctorComponent,dialogConfig);
  dialogRef.afterClosed().subscribe(data => {
    if(data)
    {
      this.dataApi.addDoctor(data);
      this.openSnackBar("Registration succesfull","Ok");
    }
  })
}

deleteDoctor(row : any): void{
  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = false;
  dialogConfig.autoFocus = true;
  dialogConfig.data = {
    title : 'Delete Doctor',
    doctorName : row.name
  }
  const dialogRef = this.dialog.open(DeleteDoctorComponent,dialogConfig);
  dialogRef.afterClosed().subscribe(data => {
    if(data)
    {
      this.dataApi.deleteDoctor(row.id);
      this.openSnackBar("Deletion succesfull","Ok");
    }
  })
}


editDoctor( row : any): void{
  if(row.id == null || row.name == null){
        return;
  }

  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;
  dialogConfig.data = row;
  dialogConfig.data.title = 'Edit Doctor';
  dialogConfig.data.buttonName = 'update';
  dialogConfig.data.birthdate = row.birthdate.toDate();
  const dialogRef = this.dialog.open(AddDoctorComponent,dialogConfig);
  dialogRef.afterClosed().subscribe(data => {
    if(data)
    {
      this.dataApi.updateDoctor(data);
      this.openSnackBar("Updation succesfull","Ok");
    }
  })
}

getAllDoctors() {
      this.dataApi.getAllDoctors().subscribe(res => {
        this.doctorsArr = res.map((e : any)=>{
          const data = e.payload.doc.data();
          data.id = e.payload.doc.id;
          return data;
        })
        this.dataSource = new MatTableDataSource(this.doctorsArr);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
}
openSnackBar(message: string, action: string) {
  this.snackBar.open(message, action);
}

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();

  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}
viewDoctor(row:any){
      window.open('/dashboard/doctor/'+row.id,'_blank');
}
}


