import {Component} from '@angular/core';
import { AuthService } from '../../auth/services/auth.services';


@Component({
  selector: 'app-components',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent {
    user: { prenom: string | null, nom: string | null } = { prenom: null, nom: null };

    constructor(private authService: AuthService) {}

    ngOnInit(): void {
        // Récupérer le nom et prénom de l'utilisateur depuis le service
        this.user = this.authService.getUserName();
    }
    notifications = [
        { message: 'Bienvenue sur notre application !', date: new Date() },
        { message: 'N’oubliez pas de personnaliser votre profil !', date: new Date() },
        { message: 'Une mise à jour est disponible. Découvrez les nouveautés !', date: new Date() },
        { message: 'Astuce : Cliquez sur l’icône d’aide pour en savoir plus.', date: new Date() },
        { message: 'Vous avez un nouveau message dans votre boîte.', date: new Date() },
        { message: 'Le soleil brille, mais ici il fait encore mieux ! 🌞', date: new Date() },
        { message: 'Votre session expire bientôt, pensez à sauvegarder.', date: new Date() },
        { message: 'C’est toujours un plaisir de vous revoir !', date: new Date() },
        { message: 'Bienvenue à bord ! N’hésitez pas à explorer toutes les fonctionnalités.', date: new Date() },
        { message: 'Astuce : Activez les notifications pour rester informé(e).', date: new Date() },
        { message: 'Votre équipe vous attend dans la section collaborative.', date: new Date() },
        { message: 'Un événement important approche, consultez le calendrier.', date: new Date() },
        { message: 'Rappel : Les données sont sauvegardées automatiquement.', date: new Date() },
        { message: 'Besoin d’aide ? Contactez notre support via le chat.', date: new Date() },
        { message: 'Votre expérience compte : Laissez-nous un avis.', date: new Date() },
        { message: 'Explorez notre boutique pour des bonus exclusifs.', date: new Date() },
        { message: 'Vous êtes maintenant un utilisateur premium, bravo !', date: new Date() },
        { message: 'Prenez une pause : Il est temps de vous hydrater ! 💧', date: new Date() },
        { message: 'Une nouvelle fonctionnalité a été ajoutée, découvrez-la !', date: new Date() },
        { message: 'Votre tableau de bord est entièrement personnalisable.', date: new Date() },
    ];



    addNotification(newMessage: string) {
        this.notifications.push({
            message: newMessage,
            date: new Date(),
        });
    }
}
