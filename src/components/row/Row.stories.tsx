import type { Meta, StoryObj } from "@storybook/react-vite";

import { Row } from "./Row";

const meta = {
  title: "Primitives/Row",
  component: Row,
  argTypes: {
    justify: { control: "select", options: ["start", "between"] },
    align: { control: "select", options: ["center", "start"] },
    gap: { control: "select", options: ["sm", "md"] },
  },
  args: {
    children: (
      <>
        <span>Left</span>
        <span>Right</span>
      </>
    ),
  },
} satisfies Meta<typeof Row>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Between: Story = {};
export const Start: Story = { args: { justify: "start" } };
