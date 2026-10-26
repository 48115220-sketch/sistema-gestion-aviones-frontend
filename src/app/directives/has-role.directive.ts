import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Directive({
  selector: '[hasRole]'
})
export class HasRoleDirective implements OnInit {
  private currentRoles: string[] = [];

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private apiService: ApiService
  ) {}

  @Input() set hasRole(roles: string | string[]) {
    this.currentRoles = Array.isArray(roles) ? roles : [roles];
    this.updateView();
  }

  ngOnInit() {
    this.updateView();
  }

  private updateView() {
    this.viewContainer.clear();
    if (this.apiService.tieneRol(this.currentRoles)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
