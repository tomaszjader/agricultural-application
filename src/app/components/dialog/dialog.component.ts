import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'warning' | 'error' | 'success';
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {
constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  getIcon(): string {
    switch (this.data.type) {
      case 'warning': return 'warning';
      case 'error': return 'error';
      case 'success': return 'check_circle';
      default: return 'info';
    }
  }

  getHeaderClass(): string {
    return this.data.type || 'info';
  }

  getButtonClass(): string {
    return this.data.type || 'info';
  }
}
