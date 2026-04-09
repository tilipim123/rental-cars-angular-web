import { Component, OnInit } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    AvatarModule,
    CommonModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  username = 'Usuário';
  initialsName!: string;

  ngOnInit(): void {
    this.getInitials(this.username);
  }

  // Função para extrair iniciais
  getInitials(fullName: string) {
    let initials = '';
    if (fullName) {
      const namesArray = fullName.split(' ');
      if (namesArray.length > 0) {
        initials += namesArray[0].charAt(0);
      }
      if (namesArray.length > 1) {
        initials += namesArray[namesArray.length - 1].charAt(0);
      }
    }
    this.initialsName = initials.toUpperCase();
  }
}
