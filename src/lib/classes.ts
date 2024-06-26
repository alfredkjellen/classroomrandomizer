
export class Class {
    name: string;
    students: string[];
    id:string;
    
    constructor(name: string, students: string[], id:string = "") {
        this.name = name;
        this.students = students;
        this.id = id;
    }
}

export class Seat {
    student: Student = new Student("");
    isAvailable: boolean;


    constructor(isAvailable: boolean) {
        this.isAvailable = isAvailable;
    }
}

export class Room {
    name: string;
    layout: Seat[][] = [];

    constructor(name: string, layout: Seat[][]) {
        this.name = name;
        this.layout = layout;
    }
}

export class Student {
    name: string;
    isPresent: boolean = true;
    isClicked: boolean = false;

    constructor(name: string = "") {
        this.name = name;
    }
}