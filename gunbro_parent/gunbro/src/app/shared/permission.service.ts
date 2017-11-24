import { Injectable } from '@angular/core';
@Injectable()
export class PermissionsService {

  private permissions: any = {}

  constructor() { }

  setPermissions(permissions: any) : void {
    this.permissions = permissions;
  }

  canCurrentUser(permission: string) : boolean {
    return (permission in this.permissions);
  }

}