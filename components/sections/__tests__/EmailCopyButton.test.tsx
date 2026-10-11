import { render, screen, fireEvent, act } from '@testing-library/react'
import EmailCopyButton from '../EmailCopyButton'

function mockClipboard(resolves: boolean) {
  Object.defineProperty(navigator, 'clipboard', {
    value: {
      writeText: vi.fn().mockImplementation(() =>
        resolves ? Promise.resolve() : Promise.reject(new Error('Permission denied'))
      ),
    },
    configurable: true,
    writable: true,
  })
}

test('does not show Copied when clipboard write fails', async () => {
  mockClipboard(false)
  render(<EmailCopyButton />)

  await act(async () => {
    fireEvent.click(screen.getByRole('button'))
  })

  expect(screen.queryByText('Copied!')).not.toBeInTheDocument()
  expect(screen.getByText('rishukumar.prince@gmail.com')).toBeInTheDocument()
})

test('shows Copied when clipboard write succeeds', async () => {
  mockClipboard(true)
  render(<EmailCopyButton />)

  await act(async () => {
    fireEvent.click(screen.getByRole('button'))
  })

  expect(screen.getByText('Copied!')).toBeInTheDocument()
})
