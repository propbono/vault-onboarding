'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  onboardingSchema,
  type OnboardingFormData,
} from '@/lib/schemas/onboarding'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useEffect, useState } from 'react'
import { useValidateCorporationNumber } from '@/lib/queries'

export const OnboardingForm = () => {
  const [corpNumberToValidate, setCorpNumberToValidate] = useState('')

  const { data: validationResult, isLoading: validationIsLoading } =
    useValidateCorporationNumber(corpNumberToValidate)

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '+1',
      corporationNumber: '',
    },
    mode: 'onBlur',
  })

  useEffect(() => {
    if (validationResult) {
      if (!validationResult.valid) {
        console.log('validationResult - invalid')
        form.setError(
          'corporationNumber',
          {
            type: 'manual',
            message: validationResult.message,
          },
          {
            shouldFocus: true,
          }
        )
      } else {
        console.log('validationResult - valid')
        form.clearErrors('corporationNumber')
      }
    }
  }, [validationResult, form])

  const onSubmit = (data: OnboardingFormData) => {
    console.log(data)
    // Handle form submission
  }

  console.log('FORM ERRORS', form.formState.errors)

  return (
    <div className="container mx-auto">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="text-center font-bold text-2xl">
            Onboarding Form
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-4 sm:flex-row">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <div className="h-3">
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <div className="h-3">
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <div className="h-3">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <div className="relative">
                <FormField
                  control={form.control}
                  name="corporationNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Corporation Number</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onBlur={() => {
                            if (field.value) {
                              setCorpNumberToValidate(field.value)
                            }
                          }}
                        />
                      </FormControl>
                      <div className="h-3">
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                {validationIsLoading && (
                  <div className="absolute right-1/2 top-1/2 -translate-y-1/2">
                    <span className="animate-spin">⌛</span>
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
