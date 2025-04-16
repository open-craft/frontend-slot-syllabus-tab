import * as React from 'react';
import { Collapsible } from '@openedx/paragon';
import { type Block } from '../types';
import { HighlightMatch } from './HighlightMatch';

interface BlockCollapsibleProps {
  block: Block;
  query: string;
  children: React.ReactNode[];
  isOpen: boolean;
  onToggle: () => void;
  border?: boolean;
}

export const BlockCollapsible = ({
  block,
  query,
  children,
  isOpen,
  onToggle,
  border = false,
}: BlockCollapsibleProps) => {
  if (!block) { return null; }
  const title = <HighlightMatch query={query} text={block.display_name} />;
  if (children && (children.length === 0 || (children.length === 1 && !children[0]))) {
    return (
      <div className="d-flex flex-column p-2">
        {title}
      </div>
    );
  }
  return (
    <Collapsible
      key={block.id}
      title={title}
      className={`m-0 p-0 ${border ? '' : 'border-0'}`}
      open={query ? true : isOpen}
      onToggle={onToggle}
    >
      {children}
    </Collapsible>
  );
};
