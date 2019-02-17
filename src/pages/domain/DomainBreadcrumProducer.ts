import {BreadcrumbsProducer, IBreadcrumbSegment} from "../../stores/BreacrumStore";
import {DomainDescriptor} from "../../models/DomainDescriptor";

export class DomainBreadcrumbProducer extends BreadcrumbsProducer {
  private readonly _additional: IBreadcrumbSegment[] | undefined;
  private _domain: DomainDescriptor | null = null;

  constructor(additional?: IBreadcrumbSegment[]) {
    super();
    this._domain = null;
    this._additional = additional;
  }

  public setDomain(domain: DomainDescriptor, ): void {
    this._domain = domain;
  }

  public breadcrumbs(): IBreadcrumbSegment[] {
    const segments = super.breadcrumbs();

    segments.push({
      title: "Domains",
      link: "/domains"
    });

    segments.push({
      title: this._domain!.namespace
    });

    segments.push({
      title: this._domain!.id
    });

    if (this._additional) {
      segments.push(...this._additional);
    }

    return segments;
  }
}