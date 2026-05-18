import { Routes } from '@angular/router';
import { BoxPreviewComponent } from './box-preview/box-preview.component';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'box-preview' },
	{ path: 'box-preview', component: BoxPreviewComponent },
	{ path: '**', redirectTo: 'box-preview' },
];
