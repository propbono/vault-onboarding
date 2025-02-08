import { useQuery } from '@tanstack/react-query'
import { CORPORATION_NUMBER_API_URL } from './constants'

type ValidateCorporationNumberResponse =
  | {
      valid: true
      corporationNumber: string
    }
  | {
      valid: false
      message: string
    }

const validateCorporationNumber = async (
  value: string
): Promise<ValidateCorporationNumberResponse> => {
  const response = await fetch(`${CORPORATION_NUMBER_API_URL}/${value}`)
  return response.json()
}

export const useValidateCorporationNumber = (corpNumberToValidate: string) => {
  return useQuery({
    queryKey: ['corporationNumber', corpNumberToValidate],
    queryFn: () => validateCorporationNumber(corpNumberToValidate),
    enabled: !!corpNumberToValidate,
    staleTime: 1000 * 60 * 5,
  })
}
