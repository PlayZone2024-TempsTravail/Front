import { Component } from '@angular/core';
import { Link } from '../../core/models/link';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
    links: Link[] = [
        { title: 'Accueil', url: '/accueil' },
        {
            title: 'Pointage',
            url: '/pointage',
            children: [
                { title: 'Mon calendrier', url: '/pointage/mon-calendrier' },
                { title: 'Pointages employés', url: '/pointage/liste-des-pointages' },
            ],
            isVisibile: false,
        },
        {
            title: 'Budget',
            url: '/projet',
            children: [
                { title: 'Budget', url: '/projet/budget' },
                { title: 'Rapport', url: '/projet/rapport' },
                { title: 'Projet', url: '/projet/projet' },
            ],
            isVisibile: false,
        },
        {
            title: 'Gestion',
            url: '/gestion',
            children: [
                { title: 'Liste utilisateurs', url: '/gestion/utilisateurs' },
                { title: 'Liste projets', url: '/gestion/projets' },
            ],
            isVisibile: false,
        },
    ];


    toggleIsVisible(link: Link) {
      for (let l of this.links) {
          if (l !== link) {l.isVisibile = false;
          }
      }
      link.isVisibile = !link.isVisibile;
  }
}
