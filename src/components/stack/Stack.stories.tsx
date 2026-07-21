import type { Meta, StoryObj } from "@storybook/react-vite";

import { Card } from "../card/Card";
import { Stack } from "./Stack";

const meta = {
  title: "Primitives/Stack",
  component: Stack,
  argTypes: {
    gap: { control: "select", options: ["xs", "sm", "md"] },
  },
  args: {
    children: (
      <>
        <Card padding="sm">Item one</Card>
        <Card padding="sm">Item two</Card>
        <Card padding="sm">Item three</Card>
      </>
    ),
  },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const LargeGap: Story = { args: { gap: "md" } };
