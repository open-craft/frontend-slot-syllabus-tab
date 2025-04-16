import classNames from 'classnames';
import * as React from 'react';
import {
  generatePath, Link, useMatch, useParams,
} from 'react-router-dom';
import { useIntl } from '@edx/frontend-platform/i18n';
import { SYLLABUS_ROUTE } from '../const';
import messages from '../messages';

export const SyllabusTabLink = () => {
  const intl = useIntl();
  const match = useMatch(SYLLABUS_ROUTE);
  const { courseId } = useParams();
  return courseId && (
    <Link
      key="syllabus"
      className={classNames('nav-item flex-shrink-0 nav-link', { active: !!match })}
      to={generatePath(SYLLABUS_ROUTE, { courseId })}
    >
      {intl.formatMessage(messages.syllabusTitle)}
    </Link>
  );
};
