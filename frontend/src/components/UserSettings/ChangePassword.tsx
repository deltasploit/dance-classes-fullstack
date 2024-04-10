import React from 'react'
import {
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  useColorModeValue,
} from '@chakra-ui/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useMutation } from 'react-query'

import { ApiError, UpdatePassword, UsersService } from '../../client'
import useCustomToast from '../../hooks/useCustomToast'

interface UpdatePasswordForm extends UpdatePassword {
  confirm_password: string
}

const ChangePassword: React.FC = () => {
  const color = useColorModeValue('inherit', 'ui.white')
  const showToast = useCustomToast()
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePasswordForm>({
    mode: 'onBlur',
    criteriaMode: 'all',
  })

  const UpdatePassword = async (data: UpdatePassword) => {
    await UsersService.updatePasswordMe({ requestBody: data })
  }

  const mutation = useMutation(UpdatePassword, {
    onSuccess: () => {
      showToast('Éxito!', 'Contraseña actualizada.', 'success')
      reset()
    },
    onError: (err: ApiError) => {
      const errDetail = err.body.detail
      showToast('Algo anduvo mal.', `${errDetail}`, 'error')
    },
  })

  const onSubmit: SubmitHandler<UpdatePasswordForm> = async (data) => {
    mutation.mutate(data)
  }

  return (
    <>
      <Container maxW="full" as="form" onSubmit={handleSubmit(onSubmit)}>
        <Heading size="sm" py={4}>
          Cambiar contraseña
        </Heading>
        <Box w={{ sm: 'full', md: '50%' }}>
          <FormControl isRequired isInvalid={!!errors.current_password}>
            <FormLabel color={color} htmlFor="current_password">
              Contraseña actual
            </FormLabel>
            <Input
              id="current_password"
              {...register('current_password')}
              placeholder="Contraseña"
              type="password"
            />
            {errors.current_password && (
              <FormErrorMessage>
                {errors.current_password.message}
              </FormErrorMessage>
            )}
          </FormControl>
          <FormControl mt={4} isRequired isInvalid={!!errors.new_password}>
            <FormLabel htmlFor="password">Nueva contraseña</FormLabel>
            <Input
              id="password"
              {...register('new_password', {
                required: 'Campo requerido',
                minLength: {
                  value: 8,
                  message: 'La contraseña debe tener 8 caracteres o más',
                },
              })}
              placeholder="Contraseña"
              type="password"
            />
            {errors.new_password && (
              <FormErrorMessage>{errors.new_password.message}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl mt={4} isRequired isInvalid={!!errors.confirm_password}>
            <FormLabel htmlFor="confirm_password">Confirmar nueva contraseña</FormLabel>
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
              <FormErrorMessage>
                {errors.confirm_password.message}
              </FormErrorMessage>
            )}
          </FormControl>
          <Button
            variant="primary"
            mt={4}
            type="submit"
            isLoading={isSubmitting}
          >
            Guardar
          </Button>
        </Box>
      </Container>
    </>
  )
}
export default ChangePassword
