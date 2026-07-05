import "./Input.css";
type Props = {
  value: number;
  onChange: (val: number) => void;
};

export const Input = ({ value, onChange }: Props) => {
  const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(+e.target.value);
  };

  return (
    <>
      <input
        className="input"
        value={value}
        onChange={onValueChange}
        inputMode="numeric"
      />
    </>
  );
};
