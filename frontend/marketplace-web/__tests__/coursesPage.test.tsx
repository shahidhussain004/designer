import React from 'react';
import { render, screen } from '@testing-library/react';
import { withAppRouter } from './testUtils';
import '@testing-library/jest-dom';

jest.mock('../lib/courses', () => ({
  getCourses: async () => ({ courses: [], totalCount: 0, page: 0, size: 12 }),
  COURSE_CATEGORIES: [],
  SKILL_LEVELS: [],
}));

describe('Courses Page', () => {
  it('renders empty state when no courses', async () => {
    // lazy-import so module-level code runs after any test setup
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const CoursesPage = require('../app/courses/page').default;
    render(withAppRouter(React.createElement(CoursesPage), { pathname: '/courses' }));
    const emptyText = await screen.findByText(/no courses found/i);
    expect(emptyText).toBeInTheDocument();
  });
});
