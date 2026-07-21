import type { Meta, StoryObj } from "@storybook/react-vite";

import { PageContainer } from "./PageContainer";

const meta = {
  title: "Primitives/PageContainer",
  component: PageContainer,
  args: {
    children: <div style={{ background: "var(--surface-secondary)" }}>Page content</div>,
  },
} satisfies Meta<typeof PageContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
