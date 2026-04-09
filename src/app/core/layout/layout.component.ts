import { RouterOutlet } from '@angular/router';
import { TOOGLE_SIDEBAR } from './layout.animation';
import { ToastModule } from 'primeng/toast';
import { MenuItem } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from '../template/header/header.component';
import { SideMenuComponent } from '../template/side-menu/side-menu.component';
import { FooterComponent } from '../template/footer/footer.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    HeaderComponent,
    SideMenuComponent,
    FooterComponent,
    RouterOutlet,
    ToastModule,
    ConfirmDialogModule,
    BreadcrumbModule,
  ],
  providers: [],
  animations: [TOOGLE_SIDEBAR],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit {
  items!: MenuItem[];

  breadcumbs: MenuItem[] = [{ label: 'Pagina Inicial' }];

  breadcumbsHome!: MenuItem;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.items = [
      {
        label: 'Alugueis',
        icon: 'fa fa-car fa-lg',
        routerLink: '/alugueis',
        command: () => {
          this.breadcumbs = [{ label: 'ALUGUEIS' }];
        },
      },
      {
        label: 'Relatórios',
        icon: 'fa fa-file-text fa-lg',
        routerLink: '/relatorios',
        command: () => {
          this.breadcumbs = [{ label: 'RELATÓRIOS' }];
        },
      },
    ];

    if (this.router.url.includes('relatorios')) {
      this.breadcumbs = [{ label: 'RELATÓRIOS' }];
    } else {
      this.breadcumbs = [{ label: 'ALUGUEIS' }];
    }
  }

  isOpenMenu: boolean = true;

  exibirMenu(value: boolean) {
    this.isOpenMenu = value;
  }

  hasOpen(): string {
    return this.isOpenMenu ? 'open' : 'closed';
  }
}
