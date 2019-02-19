import React, {ReactNode} from "react";

export class Spacer extends React.Component<{}, {}> {
  public render(): ReactNode {
    return <div className="spacer"><div className="spacer-divider"/></div> ;
  }
}
