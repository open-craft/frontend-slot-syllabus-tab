import { Button, Icon, SearchField } from '@openedx/paragon';
import { Link as LinkIcon } from '@openedx/paragon/icons';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  useBlockData, usePanels,
} from '../hooks';
import { type BlockMap, type UsageId } from '../types';
import { BlockCollapsible } from './BlockCollapsible';
import { HighlightMatch } from './HighlightMatch';
import { PrintSyllabus } from './PrintSyllabus';

const filteredBlocks = (
  rootId: UsageId | undefined,
  blocks: BlockMap | null,
  query: string | null,
): Set<UsageId> | null => {
  if (!query || !blocks || !rootId) {
    return null;
  }
  const matches = new Set<UsageId>();

  function filterBlocks(blockId: UsageId) {
    const block = blocks[blockId];
    if (!block) {
      return false;
    }
    let foundMatch = false;
    if (block.display_name.toLowerCase().includes(query.toLowerCase())) {
      matches.add(blockId);
      foundMatch = true;
    }
    if (block.children) {
      const childMatch = block.children.filter(filterBlocks);
      if (childMatch.length > 0) {
        matches.add(blockId);
        foundMatch = true;
      }
    }
    return foundMatch;
  }

  filterBlocks(rootId);

  return matches;
};
export const Syllabus = () => {
  const { courseId } = useParams();
  const blockData = useBlockData(courseId);
  const blocks = blockData?.blocks;
  const rootBlock = blockData?.blocks[blockData.root];
  const {
    isPanelOpen, toggleAll, togglePanel, allOpen, setOpenPanels,
  } = usePanels();
  useEffect(() => {
    if (blocks) {
      setOpenPanels(Object.fromEntries(Object.keys(blocks).map(blockId => [blockId, false])));
    }
  }, [blocks, setOpenPanels]);
  const [query, setQuery] = useState('');
  if (!blockData || !blocks || !rootBlock) {
    return null;
  }
  const matches = filteredBlocks(blockData?.root, blocks, query);
  const iterMatches = (
    block: Block,
    children: (blockId: UsageId) => React.ReactNode,
    border = false,
  ) => (
    block?.children?.map((blockId: UsageId) => (!matches || matches.has(blockId)) && (
    <BlockCollapsible
      query={query}
      block={blockData.blocks[blockId]}
      key={blockId}
      onToggle={() => togglePanel(blockId)}
      isOpen={isPanelOpen(blockId)}
      border={border}
    >
      {children(blockId)}
    </BlockCollapsible>
    ))
  );

  return (
    <div>
      <div className="d-flex justify-content-end mb-2">
        <SearchField value={query} onChange={setQuery} onSubmit={setQuery} />
        <Button variant="outline-primary" size="sm" onClick={() => toggleAll()}>
          {allOpen
            ? 'Collapse all'
            : 'Expand all'}
        </Button>
      </div>
      {rootBlock && iterMatches(rootBlock, (sectionId: UsageId) => (
        iterMatches(blocks[sectionId], (subsectionId: UsageId) => (
          iterMatches(blocks[subsectionId], (unitId: UsageId) => (
            blocks[unitId].children.flatMap((blockId: UsageId) => (
              blocks[blockId]?.links?.map(link => (
                <div className="d-flex flex-column" key={blockId + link.href}>
                  <a
                    className="d-flex ml-2 align-items-center"
                    href={link.href}
                  >
                    <Icon src={LinkIcon} size="xs" className="mr-2" />
                    <HighlightMatch query={query} text={link.text} />
                  </a>
                </div>
              ))
            )).filter(item => !!item)
          ))
        ))
      ), true)}
      {blockData && <PrintSyllabus blockData={blockData} />}
    </div>
  );
};
