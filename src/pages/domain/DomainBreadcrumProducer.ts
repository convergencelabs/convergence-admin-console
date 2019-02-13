import {BreadcrumbsProducer, IBreadcrumbSegment} from "../../stores/BreacrumStore";
import {DomainDescriptor} from "../../models/DomainDescriptor";

export class DomainBreadcrumbProducer extends BreadcrumbsProducer {
  private domain: DomainDescriptor | null = null;

  public setDomain(domain: DomainDescriptor): void {
    this.domain = domain;
  }

  public breadcrumbs(): IBreadcrumbSegment[] {
    const segments = super.breadcrumbs();

    segments.push({
      title: "Domains",
      link: "/domains"
    });

    segments.push({
      title: this.domain!.namespace
    });

    segments.push({
      title: this.domain!.id
    });

    return segments;
  }
}