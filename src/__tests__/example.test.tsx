import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

describe('Example test', () => {
  it('should work', () => {
    render(<div>Hello Vitest</div>)
    expect(screen.getByText('Hello Vitest')).toBeInTheDocument()
  })
})
