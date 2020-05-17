import React from 'react';
import ReactDOM from 'react-dom';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

import TabGroup from '../src/components/TabGroup';

afterEach(cleanup);

test('renders without crashing', () => {
  const name = 'test';
  const tabs = ['test1', 'test2'];

  const div = document.createElement('div');
  ReactDOM.render(<TabGroup name={name} tabs={tabs} />, div);
});

test('renders tab group', () => {
  const name = 'test';
  const tabs = ['test1', 'test2'];

  const { getAllByRole, getByText } = render(
    <TabGroup name={name} tabs={tabs} />
  );

  expect(getByText(name)).toBeInTheDocument();

  const buttons = getAllByRole('button');
  expect(buttons.length).toEqual(3);
  buttons.forEach((button) => expect(button).toBeInTheDocument());

  const items = getAllByRole('listitem');
  items.forEach((item, index) => {
    expect(item).toBeInTheDocument();
    expect(item).toHaveTextContent(tabs[index]);
  });
});
