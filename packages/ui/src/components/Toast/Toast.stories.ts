import type { Meta, StoryObj } from '@storybook/vue3'
import { ToastContainer } from '.'
import { useToast } from './useToast'

const meta: Meta<typeof ToastContainer> = {
  title: 'Components/Toast',
  component: ToastContainer,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ToastContainer>

// ── Interactive playground ───────────────────────────────────────────────────

export const Playground: Story = {
  render: () => ({
    components: { ToastContainer },
    setup() {
      const toast = useToast()
      toast.dismissAll()

      function showSuccess() {
        toast.show({
          title: 'Changes saved',
          body: 'Your profile has been updated successfully.',
          color: 'success',
          icon: 'save',
        })
      }

      function showError() {
        toast.show({
          title: 'Something went wrong',
          body: 'Could not save your changes. Please try again.',
          color: 'danger',
          closable: true,
        })
      }

      function showWarning() {
        toast.show({
          title: 'Unsaved changes',
          body: 'You have unsaved changes that will be lost.',
          color: 'warning',
          icon: 'home',
        })
      }

      function showInfo() {
        toast.show({
          title: 'New update available',
          color: 'primary',
        })
      }

      function showNeutral() {
        toast.show({
          title: 'Processing…',
          body: 'Your request is being handled.',
          color: 'neutral',
        })
      }

      return { showSuccess, showError, showWarning, showInfo, showNeutral }
    },
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 8px;">
        <button @click="showSuccess">Success toast</button>
        <button @click="showError">Error toast (closable)</button>
        <button @click="showWarning">Warning toast</button>
        <button @click="showInfo">Info toast</button>
        <button @click="showNeutral">Neutral toast</button>
      </div>
      <ToastContainer />
    `,
  }),
}

// ── Positions ────────────────────────────────────────────────────────────────

export const Positions: Story = {
  render: () => ({
    components: { ToastContainer },
    setup() {
      const toast = useToast()
      toast.dismissAll()

      function showInCorner(position: string) {
        toast.show({
          title: `Toast in ${position}`,
          body: 'This toast was placed in a specific corner.',
          color: 'primary',
          position: position as any,
          duration: 8000,
        })
      }

      return { showInCorner }
    },
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 8px;">
        <button @click="showInCorner('top-left')">Top Left</button>
        <button @click="showInCorner('top-right')">Top Right</button>
        <button @click="showInCorner('bottom-left')">Bottom Left</button>
        <button @click="showInCorner('bottom-right')">Bottom Right</button>
      </div>
      <ToastContainer />
    `,
  }),
}

// ── Colors ───────────────────────────────────────────────────────────────────

export const Colors: Story = {
  render: () => ({
    components: { ToastContainer },
    setup() {
      const toast = useToast()
      toast.dismissAll()

      function showAll() {
        const colors = ['primary', 'danger', 'success', 'warning', 'neutral'] as const
        colors.forEach((color, i) => {
          setTimeout(() => {
            toast.show({
              title: `${color.charAt(0).toUpperCase() + color.slice(1)} toast`,
              body: `This is a ${color} colored toast notification.`,
              color,
              closable: true,
            })
          }, i * 150)
        })
      }

      return { showAll }
    },
    template: `
      <button @click="showAll">Show all colors</button>
      <ToastContainer />
    `,
  }),
}

// ── Closable vs Auto-dismiss ─────────────────────────────────────────────────

export const ClosableVsAutoDismiss: Story = {
  render: () => ({
    components: { ToastContainer },
    setup() {
      const toast = useToast()
      toast.dismissAll()

      function showClosable() {
        toast.show({
          title: 'Closable toast',
          body: 'This will stay until you dismiss it with the X button.',
          color: 'danger',
          closable: true,
        })
      }

      function showAutoDismiss() {
        toast.show({
          title: 'Auto-dismiss toast',
          body: 'This will disappear in 3 seconds.',
          color: 'success',
          duration: 3000,
        })
      }

      return { showClosable, showAutoDismiss }
    },
    template: `
      <div style="display: flex; gap: 8px;">
        <button @click="showClosable">Closable</button>
        <button @click="showAutoDismiss">Auto-dismiss (3s)</button>
      </div>
      <ToastContainer />
    `,
  }),
}

// ── With Icons ───────────────────────────────────────────────────────────────

export const WithIcons: Story = {
  render: () => ({
    components: { ToastContainer },
    setup() {
      const toast = useToast()
      toast.dismissAll()

      function showWithIcon(icon: string) {
        toast.show({
          title: `Toast with ${icon} icon`,
          body: 'Icons appear in the header next to the title.',
          icon: icon as any,
          color: 'primary',
          closable: true,
        })
      }

      return { showWithIcon }
    },
    template: `
      <div style="display: flex; gap: 8px;">
        <button @click="showWithIcon('home')">Home icon</button>
        <button @click="showWithIcon('save')">Save icon</button>
        <button @click="showWithIcon('trash')">Trash icon</button>
      </div>
      <ToastContainer />
    `,
  }),
}

// ── Stacking ─────────────────────────────────────────────────────────────────

export const Stacking: Story = {
  render: () => ({
    components: { ToastContainer },
    setup() {
      const toast = useToast()
      toast.dismissAll()
      let count = 0

      function addToast() {
        count++
        toast.show({
          title: `Toast #${count}`,
          body: 'Newest toasts appear on top of the stack.',
          color: (['primary', 'danger', 'success', 'warning', 'neutral'] as const)[count % 5],
          closable: true,
        })
      }

      return { addToast }
    },
    template: `
      <button @click="addToast">Add toast</button>
      <ToastContainer />
    `,
  }),
}
