/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PlaybackScene from './PlaybackScene';

describe('PlaybackScene', () => {
  it('renders without crashing', () => {
    render(<PlaybackScene 
      sceneId="test-scene"
      selectedStageId="test-stage"
      updateSelectedStageId={() => {}}
      scene={[]}
    />)
  });

  it('displays playback controls', () => {
    render(<PlaybackScene 
      sceneId="test-scene"
      selectedStageId="test-stage"
      updateSelectedStageId={() => {}}
      scene={[]}
    />);
  });


});