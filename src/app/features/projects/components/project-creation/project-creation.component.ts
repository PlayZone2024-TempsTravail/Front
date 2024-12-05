import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ProjectCreationForm } from '../../forms/project-creation.form';
import { ProjectService } from '../../services/project.service';

@Component({
    selector: 'app-project-creation',
    templateUrl: './project-creation.component.html',
    styleUrls: ['./project-creation.component.scss'],
})
export class ProjectCreationComponent implements OnInit {
    projectForm: FormGroup;
    organismes: { id: number, name: string }[] = [];
    chargeProjet: { id: number, name: string }[] = [];
    showAddOrganismeForm = false; // Pour afficher ou masquer le formulaire d'ajout
    newOrganismeName: string = ''; // Le nom du nouvel organisme à ajouter
    newchargeProjet: string = ''; // Le nom du nouveau charge de projet à ajouter


    constructor(
        private formService: ProjectCreationForm,
        private projectService: ProjectService
    ) {
        this.projectForm = this.formService.createForm();
    }

    ngOnInit(): void {
        this.projectService.getAllOrganismes().subscribe({
            next: (response) => {
                this.organismes = response;
            },
            error: (error) => {
                console.error('Error fetching organismes:', error);
            },
        });
    }
    loadChargeProjet(): void {
        this.projectService.getAllChargeProjet().subscribe({
            next: (response) => {
                this.chargeProjet = response;
            },
            error: (error) => {
                console.error('Error fetching chargeProjet:', error);
            },
        });
    }

    loadOrganismes(): void {
        this.projectService.getAllOrganismes().subscribe({
            next: (response) => {
                this.organismes = response;
            },
            error: (error) => {
                console.error('Error fetching organismes:', error);
            },
        });
    }


    onSubmit(): void {
        if (this.projectForm.valid) {
            this.projectService.createProject(this.projectForm.value).subscribe({
                next: (response) => {
                    console.log('Project created successfully:', response);
                    alert('Project created successfully!');
                },
                error: (error) => {
                    console.error('Error creating project:', error);
                    alert('Failed to create the project. Please try again.');
                },
            });
        } else {
            alert('Please fill out all required fields.');
        }
    }

    onOrganismeChange(event: any): void {
        // Si un organisme est sélectionné, assure-toi qu'on cache le formulaire d'ajout.
        if (event.value) {
            this.showAddOrganismeForm = false;
        }
    }

    addOrganisme(): void {
        // Vérifie si un nom d'organisme est fourni.
        if (this.newOrganismeName.trim()) {
            const newOrganisme = { name: this.newOrganismeName };

            // Poste le nouvel organisme vers l'API.
            this.projectService.addOrganisme(newOrganisme).subscribe({
                next: (response) => {
                    console.log('Organisme added successfully:', response);
                    this.organismes.push(response); // Ajouter le nouvel organisme à la liste
                    this.newOrganismeName = ''; // Réinitialiser le champ
                    alert('Organisme ajouté avec succès!');
                },
                error: (error) => {
                    console.error('Error adding organisme:', error);
                    alert('Échec de l\'ajout de l\'organisme.');
                },
            });
        } else {
            alert('Veuillez entrer un nom d\'organisme.');
        }
    }
}
