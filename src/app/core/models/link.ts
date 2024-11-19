export interface Link {
    title : string;
    url : string;
    children? : Link[];
    requiresAuth?: boolean;
    isVisibile? : boolean;
}