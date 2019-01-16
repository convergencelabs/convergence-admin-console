import {BreadcrumbsProducer, IBreadcrumbSegment} from "../../stores/BreacrumStore";
import {match} from "react-router";

export class DomainBreadcrumbProducer extends BreadcrumbsProducer {
  breadcrumbs(match: match): IBreadcrumbSegment[] {
    const segmenets = super.breadcrumbs(match);
    segmenets.push({
      title: "My Namespace"
    });

    segmenets.push({
      title: "My Domain"
    });

    return segmenets;
  }
}