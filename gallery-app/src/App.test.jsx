import { test, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Gallery from './Gallery.jsx';
import { images } from './imageList.js';

// Normal Test Cases
test('renders first image and description correctly', () => {
  render(<Gallery />);
  expect(screen.getByAltText(images[0].description)).toBeInTheDocument();
  expect(screen.getByText(images[0].description)).toBeInTheDocument();
});

test('navigates to next image when "Next" is clicked', () => {
  render(<Gallery />);
  fireEvent.click(screen.getByText(/Next/i));
  expect(screen.getByAltText(images[1].description)).toBeInTheDocument();
});

test('navigates to previous image when "Previous" is clicked', () => {
  render(<Gallery />);
  fireEvent.click(screen.getByText(/Next/i));
  fireEvent.click(screen.getByText(/Previous/i));
  expect(screen.getByAltText(images[0].description)).toBeInTheDocument();
});

// Edge Test Cases
test('Previous button is disabled on first image', () => {
  render(<Gallery />);
  expect(screen.getByText(/Previous/i)).toBeDisabled();
});

test('Next button is disabled on last image', () => {
  render(<Gallery />);
  for (let i = 0; i < images.length - 1; i++) {
    fireEvent.click(screen.getByText(/Next/i));
  }
  expect(screen.getByText(/Next/i)).toBeDisabled();
});

test('does not go beyond last image when clicking Next repeatedly', () => {
  render(<Gallery />);
  for (let i = 0; i < images.length + 2; i++) {
    fireEvent.click(screen.getByText(/Next/i));
  }
  expect(
    screen.getByAltText(images[images.length - 1].description)
  ).toBeInTheDocument();
});
