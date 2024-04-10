import {
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Text,
} from '@chakra-ui/react'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useMutation } from 'react-query'

import { ApiError, LoginService, NewPassword } from '../client'
import { isLoggedIn } from '../hooks/useAuth'
import useCustomToast from '../hooks/useCustomToast'

interface NewPasswordForm extends NewPassword {
  confirm_password: string
}

export const Route = createFileRoute('/reset-password')({
  component: ResetPassword,
  beforeLoad: async () => {
    if (isLoggedIn()) {
      throw redirect({
        to: '/',
      })
    }
  },
})

function ResetPassword() {
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm<NewPasswordForm>({
    mode: 'onBlur',
    criteriaMode: 'all',
    defaultValues: {
      new_password: '',
    },
  })
  const showToast = useCustomToast()
  const navigate = useNavigate()

  const resetPassword = async (data: NewPassword) => {
    const token = new URLSearchParams(window.location.search).get('token')
    await LoginService.resetPassword({
      requestBody: { new_password: data.new_password, token: token! },
    })
  }

  const mutation = useMutation(resetPassword, {
    onSuccess: () => {
      showToast('Exito!', 'Contraseña actualizada.', 'success')
      reset()
      navigate({ to: '/login' })
    },
    onError: (err: ApiError) => {
      const errDetail = err.body.detail
      showToast('Algo anduvo mal.', `${errDetail}`, 'error')
    },
  })

  const onSubmit: SubmitHandler<NewPasswordForm> = async (data) => {
    mutation.mutate(data)
  }

  return (
    <Container
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      h="100vh"
      maxW="sm"
      alignItems="stretch"
      justifyContent="center"
      gap={4}
      centerContent
    >
      <Heading size="xl" color="ui.main" textAlign="center" mb={2}>
        Restablecer contraseña
      </Heading>
      <Text textAlign="center">
        Ingresa tu nueva contraseña y confirmá para actualizar tus credenciales.
      </Text>
      <FormControl mt={4} isInvalid={!!errors.new_password}>
        <FormLabel htmlFor="password">Nueva contraseña</FormLabel>
        <Input
          id="password"
          {...register('new_password', {
            required: 'Campo requerido',
            minLength: {
              value: 8,
              message: 'La contraseña debe tener 8 caracteres o mas',
            },
          })}
          placeholder="Contraseña"
          type="password"
        />
        {errors.new_password && (
          <FormErrorMessage>{errors.new_password.message}</FormErrorMessage>
        )}
      </FormControl>
      <FormControl mt={4} isInvalid={!!errors.confirm_password}>
        <FormLabel htmlFor="confirm_password">Confirmar contraseña</FormLabel>
        <Input
          id="confirm_password"
          {...register('confirm_password', {
            required: 'Por favor confirma tu contraseña',
            validate: (value) =>
              value === getValues().new_password ||
              'Las contraseñas no coinciden',
          })}
          placeholder="Contraseña"
          type="password"
        />
        {errors.confirm_password && (
          <FormErrorMessage>{errors.confirm_password.message}</FormErrorMessage>
        )}
      </FormControl>
      <Button
        bg="ui.main"
        color="white"
        _hover={{ opacity: 0.8 }}
        type="submit"
      >
        Restablecer contraseña
      </Button>
    </Container>
  )
}

export default ResetPassword
