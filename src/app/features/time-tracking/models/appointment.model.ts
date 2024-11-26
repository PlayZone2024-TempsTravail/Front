export interface Appointment{
    id: number;
    date: Date;
    WorkTime: WorkTimeCategory;
    startTime: string;
    endTime: string;
}

export interface WorkTime {
    name: string;
    color: string;
}

export interface WorkTimeCategory {
    name: string;
    color: `#${string}`;
}