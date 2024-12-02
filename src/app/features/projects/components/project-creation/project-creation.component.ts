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

    constructor(private formService: ProjectCreationForm, private projectService: ProjectService) {
        this.projectForm = this.formService.createForm();
    }

    ngOnInit(): void {}

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
}
