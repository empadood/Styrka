import "./TextField.scss";

import { useEffect, useRef, useState } from "react";

type Props = {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  size?: "small" | "medium" | "large";
};

export const TextField = ({ value, onChange, placeholder, size = "medium" }: Props) => {
  const [text, setText] = useState(value);
  const lastEmitted = useRef(value);

  useEffect(() => {
    if (value !== lastEmitted.current) {
      lastEmitted.current = value;
      setText(value);
    }
  }, [value]);

  const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setText(raw);
    lastEmitted.current = raw;
    onChange(raw);
  };

  return (
    <input
      className={`textfield textfield--${size}`}
      value={text}
      onChange={onValueChange}
      placeholder={placeholder}
      type="text"
    />
  );
};
