import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { OnboardingForm } from './onboarding-form'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
      },
    },
  })

  const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  TestWrapper.displayName = 'TestWrapper'
  return TestWrapper
}

describe('OnboardingForm', () => {
  it('renders all form fields', () => {
    render(<OnboardingForm />, { wrapper: createWrapper() })

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/corporation number/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
  })

  it('shows correct default values', () => {
    render(<OnboardingForm />, { wrapper: createWrapper() })

    expect(screen.getByLabelText(/phone number/i)).toHaveValue('+1')
    expect(screen.getByLabelText(/first name/i)).toHaveValue('')
    expect(screen.getByLabelText(/last name/i)).toHaveValue('')
    expect(screen.getByLabelText(/corporation number/i)).toHaveValue('')
  })

  it('shows validation errors when form submitted empty', async () => {
    render(<OnboardingForm />, { wrapper: createWrapper() })

    const submitButton = screen.getByRole('button', { name: /submit/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/provide First Name/i)).toBeInTheDocument()
      expect(screen.getByText(/provide Last Name/i)).toBeInTheDocument()
      expect(
        screen.getByText(/Must be a valid Canadian phone number/i)
      ).toBeInTheDocument()
      expect(screen.getByText(/must be exactly 9 digits/i)).toBeInTheDocument()
    })
  })

  it('shows validation errors for empty first name', async () => {
    render(<OnboardingForm />, { wrapper: createWrapper() })

    const firstNameInput = screen.getByLabelText(/first name/i)

    fireEvent.blur(firstNameInput)

    await waitFor(() => {
      expect(screen.getByText(/provide First Name/i)).toBeInTheDocument()
    })
  })

  it('shows validation errors for empty last name', async () => {
    render(<OnboardingForm />, { wrapper: createWrapper() })

    const lastNameInput = screen.getByLabelText(/last name/i)

    fireEvent.blur(lastNameInput)

    await waitFor(() => {
      expect(screen.getByText(/provide Last Name/i)).toBeInTheDocument()
    })
  })

  it('shows validation errors when first name exceed 50 characters', async () => {
    const user = userEvent.setup()
    render(<OnboardingForm />, { wrapper: createWrapper() })

    const longString = 'a'.repeat(51)

    await user.type(screen.getByLabelText(/first name/i), longString)

    fireEvent.blur(screen.getByLabelText(/first name/i))

    await waitFor(() => {
      expect(
        screen.getByText('First name cannot exceed 50 characters')
      ).toBeInTheDocument()
    })
  })

  it('shows validation errors when last name exceed 50 characters', async () => {
    const user = userEvent.setup()
    render(<OnboardingForm />, { wrapper: createWrapper() })

    const longString = 'a'.repeat(51)

    await user.type(screen.getByLabelText(/last name/i), longString)

    fireEvent.blur(screen.getByLabelText(/last name/i))

    await waitFor(() => {
      expect(
        screen.getByText('Last name cannot exceed 50 characters')
      ).toBeInTheDocument()
    })
  })

  it('validates phone number format', async () => {
    const user = userEvent.setup()
    render(<OnboardingForm />, { wrapper: createWrapper() })

    const phoneInput = screen.getByLabelText(/phone number/i)
    await user.clear(phoneInput)
    await user.type(phoneInput, 'invalid')

    fireEvent.blur(phoneInput)

    await waitFor(() => {
      expect(
        screen.getByText(/Must be a valid Canadian phone number/i)
      ).toBeInTheDocument()
    })
  })

  it('validates corporation number format', async () => {
    const user = userEvent.setup()
    render(<OnboardingForm />, { wrapper: createWrapper() })

    const corporationInput = screen.getByLabelText(/corporation number/i)
    await user.type(corporationInput, '12345')

    fireEvent.blur(corporationInput)

    await waitFor(() => {
      expect(
        screen.getByText(/Invalid corporation number/i)
      ).toBeInTheDocument()
    })
  })

  // TODO: Replace console.log spy with a mock function to test form submission
  it('handles form submission with valid data', async () => {
    const user = userEvent.setup()
    const consoleSpy = vi.spyOn(console, 'log')

    render(<OnboardingForm />, { wrapper: createWrapper() })

    await user.type(screen.getByLabelText(/first name/i), 'John')
    await user.type(screen.getByLabelText(/last name/i), 'Doe')
    await user.type(screen.getByLabelText(/phone number/i), '2345678900')
    await user.type(screen.getByLabelText(/corporation number/i), '123456789')

    const submitButton = screen.getByRole('button', { name: /submit/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+12345678900',
        corporationNumber: '123456789',
      })
    })
  })
})
