import { useMemo, useEffect, useState } from 'react';

const processData = (data) => {
  const domParser = new DOMParser();
  Object.keys(data.blocks).forEach((blockId) => {
    const block = data.blocks[blockId];
    if (block.type === 'html') {
      const links = domParser.parseFromString(block?.student_view_data?.html, 'text/html').getElementsByTagName('a');
      block.links = [...links].map(link => ({
        text: link.innerText,
        href: link.href,
      })).filter(link => link.href.startsWith('http'));
    }
  });
  return data;
};

export const useBlockData = () => {
  const [blockData, setBlockData] = useState(null);
  useEffect(async () => {
    const response = await fetch(
      'http://local.openedx.io:8000/api/courses/v1/blocks/?depth=all&requested_fields=children,format,due,completion&student_view_data=video,discussion,html,problem&username=kshitij&course_id=course-v1%3AOpenedX%2BDemoX%2BDemoCourse&depth=all',
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const data = await response.json();
    setBlockData(processData(data));    
  }, []);
  return blockData;
};

export const usePanels = () => {
  const [openPanels, setOpenPanels] = useState({});
  const allOpen = useMemo(() => Object.values(openPanels).every(openState => openState), [openPanels]);
  const toggleAll = () => {
    setOpenPanels(Object.fromEntries(Object.keys(openPanels).map(blockId => [blockId, !allOpen])));
  };
  const togglePanel = (panelId) => {
    setOpenPanels({
      ...openPanels,
      [panelId]: !openPanels[panelId],
    });
  };
  const isPanelOpen = (panelId) => openPanels[panelId] ?? false;
  return {
    setOpenPanels,
    isPanelOpen,
    toggleAll,
    togglePanel,
    allOpen,
  };
};
