import { DIRECT_PLUGIN, PLUGIN_OPERATIONS } from '@openedx/frontend-plugin-framework';
import {
  Button, Collapsible, Icon, SearchField,
} from '@openedx/paragon';
import { Link as LinkIcon } from '@openedx/paragon/icons';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import {
  generatePath, Link, useMatch, useParams,
} from 'react-router-dom';
import { useBlockData, usePanels } from './hooks';
import { fetchOutlineTab } from '@src/course-home/data';
import { TabContainer } from '@src/tab-page';

const SYLLABUS_ROUTE = '/course/:courseId/syllabus';

const filteredBlocks = (rootId, blocks, query) => {
  if (!query) {
    return null;
  }
  const matches = new Set();

  function filterBlocks(blockId) {
    const block = blocks[blockId];
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

const HighlightMatch = ({
  text,
  query,
}) => {
  if (!query) {
    return <div>{text}</div>;
  }

  const parts = text.split(new RegExp(`(${query})`, 'gi'));

  return (
    <div>{parts.map((part, index) => (index % 2 === 1 ? <b>{part}</b> : part))}
    </div>
  );
};

const BlockCollapsible = ({
  block,
  query,
  children,
  isOpen,
  onToggle,
  border = false,
}) => {
  const title = <HighlightMatch query={query} text={block.display_name} />;
  return (
    <Collapsible
      key={block.id}
      title={title}
      className={`p-2 ${border ? '' : 'border-0'}`}
      open={query ? true : isOpen}
      onToggle={onToggle}
    >
      {children}
    </Collapsible>
  );
};

export const Syllabus = () => {
  const {
    isPanelOpen, toggleAll, togglePanel, allOpen, setOpenPanels,
  } = usePanels();
  const blockData = useBlockData();
  const [query, setQuery] = useState('');
  const blocks = blockData?.blocks;
  const rootBlock = blockData?.blocks[blockData.root];
  const matches = filteredBlocks(blockData?.root, blocks, query);
  const iterMatches = (blocks, children, border=false) => (
    blocks?.children?.map(blockId => (!matches || matches.has(blockId)) && (
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
      {rootBlock && iterMatches(rootBlock, (sectionId) => (
        iterMatches(blocks[sectionId], (subsectionId) => (
          iterMatches(blocks[subsectionId], (unitId) => (
            iterMatches(blocks[unitId], (blockId) => (
              <div className="d-flex flex-column" key={blockId}>
                <HighlightMatch key={blockId} text={blocks[blockId].display_name} query={query} />
                {blocks[blockId]?.links?.map(link => (
                  <a
                    className="d-flex ml-2 align-items-center"
                    key={link.href}
                    href={link.href}
                  >
                    <Icon src={LinkIcon} size="xs" className="mr-2" />
                    {link.text}
                  </a>
                ))}
              </div>
            ))
          ))
        ))
      ))}
    </div>
  );
};

const SyllabusTab = ({ route }) => {


  return route === SYLLABUS_ROUTE && (
    <TabContainer tab="syllabus" fetch={fetchOutlineTab} slice="courseHome">
  <Syllabus />
  </TabContainer>


);
}
const SyllabusTabLink = () => {
  const match = useMatch(SYLLABUS_ROUTE);
  return (
    <Link
      key="syllabus"
      className={classNames('nav-item flex-shrink-0 nav-link', { active: !!match })}
      to={generatePath(SYLLABUS_ROUTE, useParams())}
    >
      Syllabus
    </Link>
  );
};

export const PLUGIN_ROUTES = [
  SYLLABUS_ROUTE,
];

export const pluginSlots = {
  course_tab_links_slot: {
    keepDefault: true,
    plugins: [
      {
        op: PLUGIN_OPERATIONS.Insert,
        widget: {
          id: 'syllabus_tab_link',
          type: DIRECT_PLUGIN,
          priority: 100,
          RenderWidget: SyllabusTabLink,
        },
      },
    ],
  },
  course_page_route_slot: {
    keepDefault: true,
    plugins: [
      {
        op: PLUGIN_OPERATIONS.Insert,
        widget: {
          id: 'course_syllabus_tab',
          type: DIRECT_PLUGIN,
          priority: 1,
          RenderWidget: SyllabusTab,
        },
      },
    ],
  },
};
