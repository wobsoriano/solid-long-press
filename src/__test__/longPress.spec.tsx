import { render, fireEvent, screen, cleanup } from 'solid-testing-library';
import { describe, afterEach, expect, test, vi } from 'vitest';
import { longPress as longPressDirective } from '../index';

const longPress = longPressDirective;

const App = () => {
  const onLongPressStart = () => {
    console.log('long press triggered');
  };

  const onLongPressStop = () => {
    console.log('long press stopped');
  };

  return (
    <>
      <button
        use:longPress={300}
        oncapture:LongPressStart={onLongPressStart}
        oncapture:LongPressStop={onLongPressStop}
      >
        Click and Hold for 300ms
      </button>
    </>
  );
};

describe('Using Long Press Directive', () => {
  vi.useFakeTimers();

  afterEach(() => {
    vi.clearAllTimers();
    cleanup();
  });

  test('success', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    render(App);

    fireEvent.pointerDown(screen.getByRole('button'));

    vi.advanceTimersByTime(300);

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('long press triggered'));

    document.dispatchEvent(new Event('pointerup'));

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('long press stopped'));

    expect(consoleSpy).toHaveBeenCalledTimes(2);
  });

  test('cancel', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    render(App);

    fireEvent.pointerDown(screen.getByRole('button'));

    vi.advanceTimersByTime(299);

    expect(consoleSpy).not.toHaveBeenCalled();

    document.dispatchEvent(new Event('pointerup'));

    expect(consoleSpy).not.toHaveBeenCalled();
  });
});
