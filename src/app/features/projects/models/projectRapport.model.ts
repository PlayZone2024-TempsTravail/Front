

// model pour le get short projet
export interface ShortProject {
    idProject:number;
    isActive : boolean;
    name: string;

}
// model pour le getlebele

export interface LebeleTree {
    key: string,
    label: string,
    children: children[],
}

export interface children{
    key: string,
    label: string,
}

// model pour le post

export interface RapportToDb {
    dateStart: Date,
    dateEnd: Date,
    projects: number[],
    libelles: number[],

}


