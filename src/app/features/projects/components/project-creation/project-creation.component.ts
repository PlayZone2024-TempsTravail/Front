import {Component, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ProjectCreationForm} from '../../forms/project-creation.form';
import {ProjectService} from '../../services/project.service';
import {Organisme} from '../../models/project.model';
import {UserInMisson} from '../../models/userProject.model';
import {Router} from '@angular/router';

@Component({
    selector: 'app-project-creation',
    templateUrl: './project-creation.component.html',
    styleUrls: ['./project-creation.component.scss'],
})
export class ProjectCreationComponent implements OnInit {
    projectForm: FormGroup;
    name: string = '';
    organisme: Organisme[] = [];
    usersInMission: UserInMisson[] = [];
    showAddOrganismeForm = false;
    newOrganismeName: string = '';
    isLoading: boolean = false;


    constructor(
        private formService: ProjectCreationForm,
        private projectService: ProjectService,
        private router: Router
    ) {
        this.projectForm = this.formService.createForm();
    }


    ngOnInit(): void {
        this.loadOrganismes();
        this.loadActiveUsers();
    }

    loadActiveUsers(): void {
        this.projectService.getActiveUsers().subscribe({
            next: (response: UserInMisson[]) => {
                this.usersInMission = response
                    .filter(user => user.isActive)
                    .map(user => ({
                        ...user, // Copie toutes les propriétés de UserInMisson
                        label: `${user.nom} ${user.prenom}`, // Ajoute la propriété label
                    }));

                console.log('Utilisateurs actifs :', this.usersInMission);
            },
            error: (error) => {
                console.error('Erreur lors de la récupération des utilisateurs actifs', error);
                alert('Erreur lors du chargement des utilisateurs.');
            },
        });
    }

    loadOrganismes(): void {
        this.projectService.getAllOrganismes().subscribe({
            next: (response: Organisme[]) => {
                this.organisme = response.map(org => ({
                    idOrganisme: org.idOrganisme,
                    name: org.name,
                }));
                console.log('Organismes chargés :', this.organisme);
            },
            error: (error) => {
                console.error('Erreur lors du chargement des organismes :', error);
                alert('Erreur lors du chargement des organismes.');
            },
        });
    }

    onOrganismeChange(event: any): void {
        if (event.value) {
            this.showAddOrganismeForm = false;
        }
    }

    onSubmit(): void {
        if (this.projectForm.valid) {
            // Récupérer les données du formulaire
            const projectData = this.projectForm.value;

            // Retirer le # de la couleur avant d'envoyer à l'API
            const colorWithHash = projectData.color;
            const colorWithoutHash = colorWithHash ? colorWithHash.slice(1).toUpperCase() : null;

            // Remplacer la couleur dans les données envoyées à l'API
            projectData.color = colorWithoutHash;

            // Envoyer les données à l'API
            this.projectService.createProject(projectData).subscribe({
                next: (response) => {
                    console.log('Projet créé avec succès :', response);
                    alert('Projet créé avec succès !');

                    if (response && response.idProject) {
                        const projectId = response.idProject;
                        alert('Projet créé avec succès !');
                       this.router.navigate([`modifier-projet/${response.idProject}`]);
                    } else {
                        alert('Erreur lors de la création du projet.');
                    }
                    this.projectForm.reset();
                },
                error: (error) => {
                    console.error('Erreur lors de la création du projet :', error);
                    alert('Erreur lors de la création du projet.');
                },
            });
        } else {
            alert('Veuillez remplir tous les champs requis.');
        }
    }


    addOrganisme(): void {
        if (this.newOrganismeName.trim()) {
            const newOrganisme = {name: this.newOrganismeName};
            this.projectService.addOrganisme(newOrganisme).subscribe({
                next: (response: Organisme) => {
                    console.log('Organisme ajouté :', response);
                    this.organisme.push(response);
                    this.newOrganismeName = '';
                    alert('Organisme ajouté avec succès.');
                },
                error: (error) => {
                    console.error('Erreur lors de l\'ajout de l\'organisme :', error);
                    alert('Échec de l\'ajout de l\'organisme.');
                },
            });
        } else {
            alert('Veuillez entrer un nom d\'organisme.');
        }
    }

    onNameChange(event: any) {
        this.newOrganismeName = event.target.value;
    }

    onColorChange(event: any) {
        // La couleur récupérée garde le # (format correct pour l'input)
        const selectedColor = event.target.value; // Gardez la couleur avec le #
        this.projectForm.get('color')?.setValue(selectedColor); // Stocke avec le #
    }
}
