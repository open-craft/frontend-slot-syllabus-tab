import { DIRECT_PLUGIN, PLUGIN_OPERATIONS } from '@openedx/frontend-plugin-framework';

import { SyllabusTab } from './components/SyllabusTab';
import { SyllabusTabLink } from './components/SyllabusTabLink';
import { SYLLABUS_ROUTE } from './const';

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
