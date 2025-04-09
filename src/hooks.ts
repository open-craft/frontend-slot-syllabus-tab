import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient, getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { useEffect, useMemo, useState } from 'react';
import { type BlockResponse, type UsageId } from './types';

const processBlockData = (blockData: BlockResponse) => {
  const data = { ...blockData };
  const domParser = new DOMParser();
  const pruneBlocks: UsageId[] = [];
  Object.keys(data.blocks).forEach((blockId) => {
    const block = data.blocks[blockId];
    if (block.type === 'html') {
      const links = domParser.parseFromString(block?.student_view_data?.html, 'text/html').getElementsByTagName('a');
      block.links = Array.from(links).map(link => ({
        text: link.innerText,
        href: link.href,
      })).filter(link => link.href.startsWith('http'));
      if (block.links.length === 0) {
        pruneBlocks.push(blockId);
      }
    }
    if (!['course', 'chapter', 'sequential', 'vertical', 'html'].includes(block.type)) {
      pruneBlocks.push(blockId);
    }
    pruneBlocks.forEach(pruneId => {
      delete data.blocks[pruneId];
    });
  });
  return data;
};

const getCourseBlocksUrl = (courseId: string) => {
  const { username } = getAuthenticatedUser();
  const url = new URL(`${getConfig().LMS_BASE_URL}/api/courses/v1/blocks/`);
  url.searchParams.append('course_id', courseId);
  url.searchParams.append('depth', 'all');
  url.searchParams.append('requested_fields', 'children,format,due,student_view_data');
  url.searchParams.append('student_view_data', 'video,html,problem');
  url.searchParams.append('username', username);
  return url.toString();
};

export const useBlockData = (courseId?: string) => {
  const [blockData, setBlockData] = useState<BlockResponse | null>(null);
  useEffect(() => {
    (async () => {
      if (courseId === undefined) { return; }
      const { data } = await getAuthenticatedHttpClient().get(getCourseBlocksUrl(courseId));
      setBlockData(processBlockData(data));
    })();
  }, [courseId]);
  return blockData;
};

export const usePanels = () => {
  const [openPanels, setOpenPanels] = useState<{ [key: string]: boolean }>({});
  const allOpen = useMemo<boolean>(() => Object.values(openPanels).every(openState => openState), [openPanels]);
  const toggleAll = () => {
    setOpenPanels(Object.fromEntries(Object.keys(openPanels).map(blockId => [blockId, !allOpen])));
  };
  const togglePanel = (panelId: string) => {
    setOpenPanels({
      ...openPanels,
      [panelId]: !openPanels[panelId],
    });
  };
  const isPanelOpen = (panelId: string) => openPanels[panelId] ?? false;
  return {
    setOpenPanels,
    isPanelOpen,
    toggleAll,
    togglePanel,
    allOpen,
  };
};
