import "./Input.scss";

import { useEffect, useRef, useState } from "react";

type Props = {
  value: number;
  onChange: (val: number) => void;
  size?: "small" | "medium" | "large";
  onBlur?: () => void;
};

const parseNumber = (raw: string): number => parseFloat(raw.replace(",", "."));

export const Input = ({ value, onChange, size = "medium", onBlur: onBlurProp }: Props) => {
  const [text, setText] = useState(String(value));
  const lastEmitted = useRef(value);
  const isFocused = useRef(false);

  useEffect(() => {
    // Ignore external value changes while focused so a parent that rounds/snaps
    // the emitted value on every keystroke (e.g. weight rounding) doesn't clobber
    // what the user is still typing — the snapped value is shown again on blur.
    if (isFocused.current) {
      return;
    }
    if (value !== lastEmitted.current) {
      lastEmitted.current = value;
      setText(String(value));
    }
  }, [value]);

  const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setText(raw);

    const parsed = parseNumber(raw);
    if (!Number.isNaN(parsed)) {
      lastEmitted.current = parsed;
      onChange(parsed);
    }
  };

  const onBlur = () => {
    isFocused.current = false;
    lastEmitted.current = value;
    setText(String(value));
    onBlurProp?.();
  };

  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    isFocused.current = true;
    e.target.select();
  };

  return (
    <input
      className={`input input--${size}`}
      value={text}
      onChange={onValueChange}
      onBlur={onBlur}
      onFocus={onFocus}
      inputMode="decimal"
    />
  );
};
