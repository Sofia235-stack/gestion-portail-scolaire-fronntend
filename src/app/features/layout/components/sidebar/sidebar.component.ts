import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../core/models';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  roles: string[];
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, MatDividerModule, RouterLink, RouterLinkActive]
})
export class SidebarComponent implements OnInit {
  currentUser: User | null = null;
  menuItems: MenuItem[] = [];

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.initMenuItems();
    });
  }

  private initMenuItems(): void {
    // Menu items communs
    const commonItems: MenuItem[] = [
      {
        label: 'Accueil',
        icon: 'home',
        route: '/',
        roles: ['ADMIN', 'ENSEIGNANT', 'ELEVE', 'PARENT']
      }
    ];
    
    // Menu items pour les administrateurs
    const adminItems: MenuItem[] = [
      {
        label: 'Tableau de bord',
        icon: 'dashboard',
        route: '/admin/dashboard',
        roles: ['ADMIN']
      },
      {
        label: 'Élèves',
        icon: 'school',
        route: '/admin/eleves',
        roles: ['ADMIN']
      },
      {
        label: 'Enseignants',
        icon: 'person',
        route: '/admin/enseignants',
        roles: ['ADMIN']
      },
      {
        label: 'Classes',
        icon: 'groups',
        route: '/admin/classes',
        roles: ['ADMIN']
      },
      {
        label: 'Matières',
        icon: 'book',
        route: '/admin/matieres',
        roles: ['ADMIN']
      }
    ];
    
    // Menu items pour les enseignants
    const enseignantItems: MenuItem[] = [
      {
        label: 'Tableau de bord',
        icon: 'dashboard',
        route: '/enseignant/tableau-bord',
        roles: ['ENSEIGNANT']
      },
      {
        label: 'Mes classes',
        icon: 'groups',
        route: '/enseignant/classes',
        roles: ['ENSEIGNANT']
      },
      {
        label: 'Saisie des notes',
        icon: 'edit',
        route: '/enseignant/notes',
        roles: ['ENSEIGNANT']
      }
    ];
    
    // Menu items pour les élèves et parents
    const eleveParentItems: MenuItem[] = [
      {
        label: 'Portail',
        icon: 'dashboard',
        route: '/eleve-parent/portail',
        roles: ['ELEVE', 'PARENT']
      },
      {
        label: 'Bulletins',
        icon: 'description',
        route: '/eleve-parent/bulletins',
        roles: ['ELEVE', 'PARENT']
      },
      {
        label: 'Notes',
        icon: 'grade',
        route: '/eleve-parent/notes',
        roles: ['ELEVE', 'PARENT']
      }
    ];
    
    // Combiner tous les items de menu
    this.menuItems = [
      ...commonItems,
      ...adminItems,
      ...enseignantItems,
      ...eleveParentItems
    ].filter(item => {
      // Filtrer les items selon le rôle de l'utilisateur
      return this.currentUser && item.roles.includes(this.currentUser.role);
    });
  }
}