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
import { DialogService } from 'src/app/services/dialog.service';
@Component({
  selector: 'app-farmlands',
  templateUrl: './farmlands.component.html',
  styleUrls: ['./farmlands.component.scss']
})
export class FarmlandsComponent {
  data: any;
  displayedColumns: string[] = ['name', 'size', 'note','costs', 'edit', 'delete'];
  isAdd = false;
  farmlandForm = new FormGroup({
    size: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    note: new FormControl('', [Validators.required]),
    costs: new FormControl('', [Validators.required]),
  })
  curentId = '';
  editMode = false;

  userID = '';
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
    const q = query(collection(this.firestore, "farmlands"), where("userID", "==", this.userID));

    const querySnapshot = await getDocs(q);
    this.data = [...querySnapshot.docs.map((item) => {
      return { ...item.data(), id: item.id }
    })]
  }
  submit() {
    
    const usersCollection = collection(this.firestore, 'farmlands');
    const userData = {
      costs: this.farmlandForm.get("costs")?.value,
      size: this.farmlandForm.get("size")?.value,
      name: this.farmlandForm.get("name")?.value,
      note: this.farmlandForm.get("note")?.value,
      userID: this.userID,
    };
    addDoc(usersCollection, userData)
      .then(() => {
        this.dialogService.showInfo('Informacja', 'Wysąłno dane').subscribe(result => {
      
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
      const dataToDelete = doc(this.firestore, 'farmlands', id);
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
    this.farmlandForm.patchValue({
      costs: i.costs,
      size: i.size,
      name: i.name,
      note: i.note,
    });
    
    this.curentId = i.id;
  }

  editData() {
    const dataToUpdate = doc(this.firestore, 'farmlands', this.curentId);
    updateDoc(dataToUpdate, {
      costs: this.farmlandForm.get("costs")?.value,
      size: this.farmlandForm.get("size")?.value,
      name: this.farmlandForm.get("name")?.value,
      note: this.farmlandForm.get("note")?.value,
      userID: this.userID,
    })
      .then(() => {
        this.dialogService.showInfo('Informacja',"Dane zaktualizowane").subscribe(result => {
      
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
    this.farmlandForm.patchValue({
      costs:'',
      size: '',
      name: '',
      note: '',
    });
    this.farmlandForm.get('costs')?.setErrors(null);
    this.farmlandForm.get('size')?.setErrors(null);
    this.farmlandForm.get('name')?.setErrors(null);
    this.farmlandForm.get('note')?.setErrors(null);

    this.farmlandForm.get('costs')?.clearValidators();
    this.farmlandForm.get('size')?.clearValidators();
    this.farmlandForm.get('name')?.clearValidators();
    this.farmlandForm.get('note')?.clearValidators();
  }

  isAdds(){
    this.isAdd =!this.isAdd;
    this.resetForm();
    this.editMode = false;
  }
}
