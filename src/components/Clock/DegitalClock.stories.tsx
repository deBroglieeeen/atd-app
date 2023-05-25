import { DigitalClock } from './DigitalClock'
import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof DigitalClock> = {
  title: 'components/common/DigitalClock',
  component: DigitalClock,
}

export default meta
type Story = StoryObj<typeof DigitalClock>

export const Default: Story = {}
