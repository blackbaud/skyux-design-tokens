import { Component } from '@angular/core';
import { SkyBoxModule } from '@skyux/layout';

@Component({
  selector: 'app-box-preview',
  standalone: true,
  imports: [SkyBoxModule],
  templateUrl: './box-preview.component.html',
  styleUrl: './box-preview.component.css',
})
export class BoxPreviewComponent {}
