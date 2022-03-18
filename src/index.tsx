import { onCleanup, onMount } from 'solid-js';

interface LongPressHTMLElement extends HTMLElement {
  $_long_press_pointerdown_handler: () => void;
  dataset: {
    longPressTimeoutId: string;
  };
}

declare module 'solid-js' {
  namespace JSX {
    interface Directives {
      longPress?: number | true;
    }
    interface CustomCaptureEvents {
      LongPressStart?: () => void;
      LongPressStop?: () => void;
    }
  }
}

const longPressStop = new CustomEvent('LongPressStop');
const longPressStart = new CustomEvent('LongPressStart');

export function longPress(el: LongPressHTMLElement, value: () => number) {
  el.dataset.longPressTimeoutId = '0';
  const duration = value();
  let eventStarted = false;

  const onpointerup = () => {
    clearTimeout(parseInt(el.dataset.longPressTimeoutId));
    if (eventStarted) {
      eventStarted = false;
      el.dispatchEvent(longPressStop);
    }
    document.removeEventListener('pointerup', onpointerup);
  };

  const onpointerdown = () => {
    document.addEventListener('pointerup', onpointerup);
    window.addEventListener('touchmove', onscroll);
    window.addEventListener('wheel', onscroll);

    const timeout = setTimeout(
      () => {
        eventStarted = true;
        el.dispatchEvent(longPressStart);
      },
      typeof duration === 'boolean' || typeof duration === 'undefined' ? 300 : duration,
    );

    el.dataset.longPressTimeoutId = timeout.toString();
  };

  const onscroll = () => {
    clearTimeout(parseInt(el.dataset.longPressTimeoutId));
    document.removeEventListener('pointerup', onpointerup);
    window.removeEventListener('touchmove', onscroll);
    window.removeEventListener('wheel', onscroll);
  };

  onMount(() => {
    el.$_long_press_pointerdown_handler = onpointerdown;
    el.addEventListener('pointerdown', onpointerdown);
  });

  onCleanup(() => {
    clearTimeout(parseInt(el.dataset.longPressTimeoutId));
    el.removeEventListener('pointerdown', el.$_long_press_pointerdown_handler);
  });
}

export default longPress;
