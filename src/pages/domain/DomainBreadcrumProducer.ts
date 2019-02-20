import {BreadcrumbsProducer, IBreadcrumbSegment} from "../../stores/BreacrumStore";
import {DomainId} from "../../models/DomainId";

export class DomainBreadcrumbProducer extends BreadcrumbsProducer {
  private readonly _additional: IBreadcrumbSegment[] | undefined;
  private _domain: DomainId;

  constructor(domainId: DomainId, additional?: IBreadcrumbSegment[]) {
    super();
    this._domain = domainId;
    this._additional = additional || [];
  }

  public setDomain(domain: DomainId): void {
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