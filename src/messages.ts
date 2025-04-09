import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  syllabusTitle: {
    id: 'plugins.syllabus.title',
    defaultMessage: 'Syllabus',
    description: 'For use in various places, e.g. the tab title.',
  },
  collapseAll: {
    id: 'plugins.syllabus.collapseAll',
    defaultMessage: 'Collapse all',
    description: 'Label for the button that collapses the course syllabus.',
  },
  expandAll: {
    id: 'plugins.syllabus.expandAll',
    defaultMessage: 'Expand all',
    description: 'Label for the button that expands the course syllabus.',
  },
  print: {
    id: 'plugins.syllabus.print',
    defaultMessage: 'Print',
    description: 'Label for the button that prints the course syllabus.',
  },
});

export default messages;
