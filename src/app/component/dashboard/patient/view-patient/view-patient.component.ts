import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/shared/service/data.service';

@Component({
  selector: 'app-view-patient',
  templateUrl: './view-patient.component.html',
  styleUrls: ['./view-patient.component.css']
})
export class ViewPatientComponent implements OnInit {
  patient_id !: any;
  patientObj !: any;

  constructor(
    private route : ActivatedRoute,
    private dataApi : DataService
  ) {
    this.patient_id = route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.getPatientById();
  }

  getPatientById() {
    this.dataApi.getPatientById(this.patient_id).subscribe(res => {
      this.patientObj = res;
      this.patientObj.addmission_date = this.patientObj.addmission_date.toDate();
      console.log(res);
    })
  }
}