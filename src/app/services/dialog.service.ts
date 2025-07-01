import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DialogComponent, DialogData } from '../components/dialog/dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  openDialog(data: DialogData): Observable<boolean> {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: 'auto',
      maxWidth: '90vw',
      data: data,
      disableClose: false,
      autoFocus: true
    });

    return dialogRef.afterClosed();
  }

  showInfo(title: string, message: string, confirmText: string = 'OK'): Observable<boolean> {
    return this.openDialog({
      title,
      message,
      confirmText,
      type: 'info'
    });
  }

  showWarning(title: string, message: string, confirmText: string = 'OK'): Observable<boolean> {
    return this.openDialog({
      title,
      message,
      confirmText,
      type: 'warning'
    });
  }

  showError(title: string, message: string, confirmText: string = 'OK'): Observable<boolean> {
    return this.openDialog({
      title,
      message,
      confirmText,
      type: 'error'
    });
  }

  showSuccess(title: string, message: string, confirmText: string = 'OK'): Observable<boolean> {
    return this.openDialog({
      title,
      message,
      confirmText,
      type: 'success'
    });
  }

  showConfirm(title: string, message: string, confirmText: string = 'Tak', cancelText: string = 'Nie'): Observable<boolean> {
    return this.openDialog({
      title,
      message,
      confirmText,
      cancelText,
      type: 'warning'
    });
  }
}