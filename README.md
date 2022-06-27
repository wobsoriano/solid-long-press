# solid-long-press

Expose long press event on any element or component.

## Quick start

Install it:

```bash
pnpm add solid-long-press # or npm or yarn
```

Use it:

```tsx
import longPress from 'solid-long-press';

const App = () => {
  const onLongPressStart = () => {
    // triggers after 300ms of mousedown
  };

  const onLongPressStop = () => {
    // triggers on mouseup of document
  };

  return (
    <div>
      <button
        use:longPress={300}
        oncapture:LongPressStart={onLongPressStart}
        oncapture:LongPressStop={onLongPressStop}
      >
        Click and Hold for 300ms
      </button>
    </div>
  );
};
```

## License

MIT
