import { LayoutComponent } from './core/layout/layout.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '', component: LayoutComponent, children: [
            {
                path: '',
                redirectTo: 'alugueis',
                pathMatch: 'full'
            },
            {
                path: 'alugueis',
                loadComponent: () => import('./feature/alugueis/alugueis.component').then(c => c.AlugueisComponent)
            },
            {
                path: 'relatorios',
                loadComponent: () => import('./feature/relatorios/relatorios.component').then(c => c.RelatoriosComponent)
            }
        ]
    }
];
