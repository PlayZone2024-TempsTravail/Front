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
  ];

  toggleIsVisible(link: Link) {
    for (let l of this.links) {
        if (l !== link) {
            l.isVisibile = false;
        }
    }
    link.isVisibile = !link.isVisibile;
}
}
