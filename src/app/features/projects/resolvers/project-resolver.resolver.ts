import { ResolveFn } from '@angular/router';
import {ProjectService} from '../services/project.service';
import {inject} from '@angular/core';
import {Project} from '../models/project.model';
import {Observable} from 'rxjs';

export const projectResolverResolver: ResolveFn<Observable<Project[]>> = (route, state) => {
  const projectService : ProjectService = inject(ProjectService);
  return projectService.getAllProjects();

};
