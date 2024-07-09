export class DocAPI {
    path: string="";
method: string = "";
authenticated: boolean=true;

constructor (path: string, method:"GET"|"POST"| "PATCH" | "PUT" |"DELETE", authenticated:boolean) {

    this.path = `/api${path}`;
    this.method = method;
    this.authenticated = authenticated;
}

}