import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge } from "./Badge";

const meta = {
  title: "Primitives/Badge",
  component: Badge,
  argTypes: {
    tone: { control: "select", options: ["neutral", "primary", "success", "danger"] },
    size: { control: "select", options: ["sm", "md"] },
  },
  args: {
    children: "Badge",
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Neutral: Story = { args: { tone: "neutral" } };
export const Primary: Story = { args: { tone: "primary" } };
export const Success: Story = { args: { tone: "success" } };
export const Danger: Story = { args: { tone: "danger" } };
export const Small: Story = { args: { size: "sm" } };
