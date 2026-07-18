import "./Input.css";

import { useEffect, useRef, useState } from "react";

type Props = {
  value: number;
  onChange: (val: number) => void;
};

const parseNumber = (raw: string): number => parseFloat(raw.replace(",", "."));

export const Input = ({ value, onChange }: Props) => {
  const [text, setText] = useState(String(value));
  const lastEmitted = useRef(value);

  useEffect(() => {
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
    setText(String(value));
  };

  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <input
      className="input"
      value={text}
      onChange={onValueChange}
      onBlur={onBlur}
      onFocus={onFocus}
      inputMode="decimal"
    />
  );
};
