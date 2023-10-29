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
  selector: 'app-animals',
  templateUrl: './animals.component.html',
  styleUrls: ['./animals.component.scss']
})
export class AnimalsComponent {
  data: any;
  displayedColumns: string[] = ['name', 'weighs', 'note', 'edit', 'delete'];
  animalForm = new FormGroup({
    weighs: new FormControl('', [Validators.required]),
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
    const q = query(collection(this.firestore, "animals"), where("userID", "==", this.userID));

    const querySnapshot = await getDocs(q);
    this.data = [...querySnapshot.docs.map((item) => {
      return { ...item.data(), id: item.id }
    })]
  }
  submit() {
    console.log(this.data)
    const usersCollection = collection(this.firestore, 'animals');
    const userData = {
      weighs: this.animalForm.get("weighs")?.value,
      name: this.animalForm.get("name")?.value,
      note: this.animalForm.get("note")?.value,
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
    const dataToDelete = doc(this.firestore, 'animals', id);
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
    this.animalForm.patchValue({
      weighs: i.weighs,
      name: i.name,
      note: i.note,
    });
    
    this.curentId = i.id;
  }

  editData() {
    const dataToUpdate = doc(this.firestore, 'animals', this.curentId);
    updateDoc(dataToUpdate, {
      weighs: this.animalForm.get("weighs")?.value,
      name: this.animalForm.get("name")?.value,
      note: this.animalForm.get("note")?.value,
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
    this.animalForm.patchValue({
      weighs: '',
      name: '',
      note: '',
    });
    this.animalForm.get('weighs')?.setErrors(null);
    this.animalForm.get('name')?.setErrors(null);
    this.animalForm.get('note')?.setErrors(null);
  }
}
