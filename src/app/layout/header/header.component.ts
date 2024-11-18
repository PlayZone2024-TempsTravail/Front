import { Component } from '@angular/core';
import { Link } from '../../core/models/link';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
    links: Link[] = [
        { title: 'Accueil', url: "/" },
        { title: 'Pointages', url: "/pointages",
            children: [
                { title: 'Calendrier', url: '/pointages/calendrier' },
                { title: 'Pointages employés', url: '/pointages/pointages-employes' },
            ], isVisibile: false
        },
        { title: 'Projet', url: '/projet',
            children: [
                {title: 'Budget', url: '/projet/budget'},
                {title: 'Rapport', url: '/projet/rapport'},
                {title: 'Projet', url: '/projet/projet'},
            ], isVisibile: false
        },
        {title: 'Gestion', url: '/gestion',
            children: [
                {title: 'Utilisateurs', url: '/gestion/utilisateurs'},
                {title: 'Projets', url: '/gestion/projets'},
            ], isVisibile: false
        }
    ];

  toggleIsVisible(link: Link) {
      for (let l of this.links) {
          if (l !== link) {l.isVisibile = false;
          }
      }
      link.isVisibile = !link.isVisibile;
  }
}
