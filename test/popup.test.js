import React from 'react';
import ReactDOM from 'react-dom';
import { render, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import Popup from '../src/components/Popup';

afterEach(cleanup);

test('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Popup />, div);
});

test('displays hello world message', () => {
  const { getByRole } = render(<Popup />);
  expect(getByRole('heading')).toHaveTextContent('Hello world');
});

test('renders button', () => {
  const { getByRole } = render(<Popup />);
  expect(getByRole('button')).toBeInTheDocument();
});

test('triggers onClick handler when button clicked', () => {
  const openMenu = jest.fn();

  const { getByText } = render(
    <button type="button" onClick={openMenu}>
      Open Potato Tab
    </button>
  );

  fireEvent.click(getByText('Open Potato Tab'));
  expect(openMenu).toHaveBeenCalled();
});
