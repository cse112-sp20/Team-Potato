import React from 'react';
import ReactDOM from 'react-dom';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

import TabGroup from '../src/components/TabGroup';

// Test 1
test('renders without crashing', () => {
  const tabslist = [
    { name: 'test1', url: 'test1url' },
    { name: 'test2', url: 'test2url' },
  ];

  const div = document.createElement('div');
  ReactDOM.render(<TabGroup name="testgroup" tabs={tabslist} />, div);
});

// Test 2
test('renders tab group correctly', () => {
  const tabslist = [
    { name: 'test1', url: 'test1url' },
    { name: 'test2', url: 'test2url' },
  ];
  const { getByText, getByTestId, getAllByTestId } = render(
    <TabGroup name="testgroup" tabs={tabslist} />
  );

  expect(getByText('testgroup')).toBeInTheDocument();

  expect(getByTestId('focus-button')).toBeInTheDocument();
  expect(getByTestId('delete-button')).toBeInTheDocument();
  expect(getByTestId('edit-button')).toBeInTheDocument();

  const tabs = getAllByTestId('tab-button');
  expect(tabs.length).toEqual(2);
});
