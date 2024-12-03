export interface Appointment {
    workTime?: WorkTime;
    idWorktime?: number;
    start: string;
    end: string;
    isOnSite: boolean;
    categoryId: number;
    project_Id?: number;
    user_Id: number;
    date: Date;
  }
  
  export interface WorkTime {
    idWorktimeCategory: number;
    abreviation: string;
    color: string;
  } 
  
  export interface WorkTimeCategory {
    idWorktimeCategory: number;
    abreviation: string;
    color: `#${string}`;
  }

  export interface CompteurWorktimeCategory {
    category: string;
    counter: number;
    max: number;
    difference: number;
  }
  