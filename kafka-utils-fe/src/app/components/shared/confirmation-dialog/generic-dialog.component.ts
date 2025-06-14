import {Component, inject} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogModule} from "@angular/material/dialog";

export interface GenericDialogData {
  header: string;
  title?: string;
  message: string;
  positiveLabel?: string;
  negativeLabel?: string;
}

@Component({
  selector: 'app-generic-dialog',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './generic-dialog.component.html',
  standalone: true,
  styleUrl: './generic-dialog.component.scss'
})
export class GenericDialogComponent {
  data: GenericDialogData = inject(MAT_DIALOG_DATA);
}
