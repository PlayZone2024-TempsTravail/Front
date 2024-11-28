export interface Appointment {
    WorkTime: WorkTimeCategory;
    id_WorkTime?: number;
    start: Date;
    end: Date;
    isOnSite: boolean;
    category_Id: number;
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