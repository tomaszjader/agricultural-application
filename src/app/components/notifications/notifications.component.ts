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
import { DialogService } from 'src/app/services/dialog.service';

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
  isAdd = false;
  editMode = false;
  curentId = '';
  userID = '';
  data:any;
  constructor(public authService: AuthenticationService,
    public firestore: Firestore,
    private dialogService: DialogService) {
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
    this.data = querySnapshot.docs.map((item) => {
      const data = item.data();
      
      const { timeStamp, ...rest } = data;
      return { ...rest, timeStamp: timeStamp.replace(/(\d{4})-(\d{2})-(\d{2})T(\d{2}:\d{2})/, "$4 $3.$2.$1"), id: item.id };
    });
  }

  submit() {
    const usersCollection = collection(this.firestore, 'notifications');
    const userData = {
      label: this.notificationForm.get("label")?.value,
      timeStamp: this.notificationForm.get("timeStamp")?.value,
      userID: this.userID,
    };
    addDoc(usersCollection, userData)
      .then(() => {
        this.dialogService.showInfo('Informacja', 'Wysłano dane').subscribe(result => {
    });
        this.getData();
        this.resetForm()
      })
      .catch((err) => {
        this.dialogService.showInfo('Informacja',err.message).subscribe(result => {
    });
      })
  }

  delete(id: string) {
    this.dialogService.showConfirm('Informacja', 'Dane usunięte').subscribe(result => {
      const dataToDelete = doc(this.firestore, 'notifications', id);
      if(result){
        deleteDoc(dataToDelete)
      .then(() => {
        this.dialogService.showInfo('Informacja', 'Dane usunięte').subscribe(result => {
    });
        this.getData()
      })
      .catch((err) => {
        this.dialogService.showInfo('Informacja',err.message).subscribe(result => {

    });
      }
    )}
    });
    

  }

  edit(i: any) {
    this.isAdd = true;
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
        this.dialogService.showInfo('Informacja', "Dane zaktualizowane").subscribe(result => {
    });
        this.editMode = false;
        this.getData();
        this.resetForm()
      })
      .catch((err) => {
        this.dialogService.showInfo('Informacja',err.message).subscribe(result => {
    });
      })
  }

  resetForm(){
    this.notificationForm.patchValue({
      label: '',
      timeStamp: '',
    });
    this.notificationForm.get('label')?.setErrors(null);
    this.notificationForm.get('timeStamp')?.setErrors(null);

    this.notificationForm.get('label')?.clearValidators();
    this.notificationForm.get('timeStamp')?.clearValidators();
  }

  isAdds(){
    this.isAdd =!this.isAdd;
    this.resetForm();
    this.editMode = false;
  }
}
