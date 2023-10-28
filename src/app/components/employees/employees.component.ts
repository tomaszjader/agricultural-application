import { Component } from '@angular/core';

import {
  addDoc,
  Firestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc, query, where
} from '@angular/fire/firestore'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent {
  data: any;
  displayedColumns: string[] = ['name', 'collected', 'note', 'edit', 'delete'];
  employeeForm = new FormGroup({
    collected: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    note: new FormControl('', [Validators.required]),
  })
  curentId = '';
  editMode = false;

  userID = '';
  constructor(public authService: AuthenticationService,
    public firestore: Firestore,) {
    this.authService.curentUser$
      .pipe(
        map((data: any) => data.uid)
      )
      .subscribe((value) => {
        this.userID = value;
        this.getData();
      });
  }
  async getData() {
    const q = query(collection(this.firestore, "employees"), where("userID", "==", this.userID));

    const querySnapshot = await getDocs(q);
    this.data = [...querySnapshot.docs.map((item) => {
      return { ...item.data(), id: item.id }
    })]
  }
  submit() {
    console.log(this.data)
    const usersCollection = collection(this.firestore, 'employees');
    const userData = {
      collected: this.employeeForm.get("collected")?.value,
      name: this.employeeForm.get("name")?.value,
      note: this.employeeForm.get("note")?.value,
      userID: this.userID,
    };
    addDoc(usersCollection, userData)
      .then(() => {
        alert('Data Sent')
        this.getData();
        this.resetForm()
      })
      .catch((err) => {
        alert(err.message);
      })
  }

  delete(id: string) {
    const dataToDelete = doc(this.firestore, 'employees', id);
    deleteDoc(dataToDelete)
      .then(() => {
        alert('Data Deleted');
        this.getData()
      })
      .catch((err) => {
        alert(err.message)
      })

  }

  edit(i: any) {
    console.log(i);
    this.editMode = true;
    this.employeeForm.patchValue({
      collected: i.collected,
      name: i.name,
      note: i.name,
    });
    
    this.curentId = i.id;
  }

  editData() {
    const dataToUpdate = doc(this.firestore, 'employees', this.curentId);
    updateDoc(dataToUpdate, {
      collected: this.employeeForm.get("collected")?.value,
      name: this.employeeForm.get("name")?.value,
      note: this.employeeForm.get("note")?.value,
      userID: this.userID,
    })
      .then(() => {
        alert('Data updated');
        this.editMode = false;
        this.getData();
        this.resetForm()
      })
      .catch((err) => {
        alert(err.message)
      })
  }

  resetForm(){
    this.employeeForm.patchValue({
      collected: '',
      name: '',
      note: '',
    });
    this.employeeForm.get('collected')?.setErrors(null);
    this.employeeForm.get('name')?.setErrors(null);
    this.employeeForm.get('note')?.setErrors(null);
  }
}
