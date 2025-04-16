import { fetchOutlineTab } from '@src/course-home/data';
import { TabContainer } from '@src/tab-page';
import * as React from 'react';
import { SYLLABUS_ROUTE } from '../const';
import { Syllabus } from './Syllabus';

export const SyllabusTab = ({ route }: { route: string }) => route === SYLLABUS_ROUTE && (
<TabContainer tab="syllabus" fetch={fetchOutlineTab} slice="courseHome">
  <Syllabus />
</TabContainer>
);
