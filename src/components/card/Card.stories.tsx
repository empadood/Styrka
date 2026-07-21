import type { Meta, StoryObj } from "@storybook/react-vite";

import { Card } from "./Card";

const meta = {
  title: "Primitives/Card",
  component: Card,
  argTypes: {
    padding: { control: "select", options: ["sm", "md", "lg"] },
    tone: { control: "select", options: ["surface", "primary"] },
    as: { control: "select", options: ["div", "li"] },
  },
  args: {
    children: "Card content",
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = {
  args: { padding: "sm" },
};

export const Medium: Story = {
  args: { padding: "md" },
};

export const Primary: Story = {
  args: { tone: "primary" },
};
