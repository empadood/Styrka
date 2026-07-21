import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Input } from "./Input";

const meta = {
  title: "Primitives/Input",
  component: Input,
  argTypes: {
    size: { control: "select", options: ["small", "medium", "large"] },
  },
  args: {
    value: 100,
    onChange: () => {},
  },
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return <Input {...args} value={value} onChange={setValue} />;
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = { args: { size: "small" } };
export const Medium: Story = { args: { size: "medium" } };
export const Large: Story = { args: { size: "large" } };
