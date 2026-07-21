import type { Meta, StoryObj } from "@storybook/react-vite";

import { Heading } from "./Heading";

const meta = {
  title: "Primitives/Heading",
  component: Heading,
  argTypes: {
    level: { control: "select", options: ["1", "2", "3"] },
  },
  args: {
    text: "Heading text",
  },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Level1: Story = { args: { level: "1" } };
export const Level2: Story = { args: { level: "2" } };
export const Level3: Story = { args: { level: "3" } };
