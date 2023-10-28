import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import {
  addDoc,
  Firestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc, query, where
} from '@angular/fire/firestore'

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.scss']
})
export class WarehouseComponent {
  data: any;
  displayedColumns: string[] = ['name', 'quantity', 'note', 'edit', 'delete'];
  warehouseForm = new FormGroup({
    quantity: new FormControl('', [Validators.required]),
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
    const q = query(collection(this.firestore, "warehouse"), where("userID", "==", this.userID));

    const querySnapshot = await getDocs(q);
    this.data = [...querySnapshot.docs.map((item) => {
      return { ...item.data(), id: item.id }
    })]
  }
  submit() {
    console.log(this.data)
    const usersCollection = collection(this.firestore, 'warehouse');
    const userData = {
      quantity: this.warehouseForm.get("quantity")?.value,
      name: this.warehouseForm.get("name")?.value,
      note: this.warehouseForm.get("note")?.value,
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
    const dataToDelete = doc(this.firestore, 'warehouse', id);
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
    this.warehouseForm.patchValue({
      quantity: i.quantity,
      name: i.name,
      note: i.note,
    });
    
    this.curentId = i.id;
  }

  editData() {
    const dataToUpdate = doc(this.firestore, 'warehouse', this.curentId);
    updateDoc(dataToUpdate, {
      quantity: this.warehouseForm.get("quantity")?.value,
      name: this.warehouseForm.get("name")?.value,
      note: this.warehouseForm.get("note")?.value,
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
    this.warehouseForm.patchValue({
      quantity: '',
      name: '',
      note: '',
    });
    this.warehouseForm.get('quantity')?.setErrors(null);
    this.warehouseForm.get('name')?.setErrors(null);
    this.warehouseForm.get('note')?.setErrors(null);
  }
}
