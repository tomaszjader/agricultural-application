import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  addDoc,
  Firestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc, query, where
} from '@angular/fire/firestore'
import { AuthenticationService } from 'src/app/services/authentication.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent {
  displayedColumns: string[] = ['label', 'timeStamp', 'edit', 'delete'];
  notificationForm = new FormGroup({
    label: new FormControl('', [Validators.required]),
    timeStamp: new FormControl('', [Validators.required]),
  });
  editMode = false;
  curentId = '';
  userID = '';
  data:any;
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
    const q = query(collection(this.firestore, "notifications"), where("userID", "==", this.userID));

    const querySnapshot = await getDocs(q);
    this.data = [...querySnapshot.docs.map((item) => {
      return { ...item.data(), id: item.id }
    })]
  }

  submit() {
    console.log(this.data)
    const usersCollection = collection(this.firestore, 'notifications');
    const userData = {
      label: this.notificationForm.get("label")?.value,
      timeStamp: this.notificationForm.get("timeStamp")?.value,
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
    const dataToDelete = doc(this.firestore, 'notifications', id);
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
    this.notificationForm.patchValue({
      label: i.label,
      timeStamp: i.timeStamp,
    });
    
    this.curentId = i.id;
  }

  editData() {
    const dataToUpdate = doc(this.firestore, 'notifications', this.curentId);
    updateDoc(dataToUpdate, {
      label: this.notificationForm.get("label")?.value,
      name: this.notificationForm.get("timeStamp")?.value,
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
    this.notificationForm.patchValue({
      label: '',
      timeStamp: '',
    });
    this.notificationForm.get('label')?.setErrors(null);
    this.notificationForm.get('timeStamp')?.setErrors(null);
  }
}
