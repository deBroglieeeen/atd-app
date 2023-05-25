import { Login } from './Login'
import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof Login> = {
  title: 'components/common/Login',
  component: Login,
}

export default meta
type Story = StoryObj<typeof Login>

export const Default: Story = {}
