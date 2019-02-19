import React, {ReactNode} from 'react';
import onClickOutside from 'react-onclickoutside';

export interface ContextMenuProps {
  onClose: () => void;
}

class Menu extends React.Component<ContextMenuProps, {}> {

  handleClickOutside() {
    this.props.onClose();
  }

  public render(): ReactNode {
    return (
      <div className="sapphire-menu" onClick={this.props.onClose}>
        {this.props.children}
      </div>
    );
  }
}

export const ContextMenu = onClickOutside(Menu);
