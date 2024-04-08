import React from 'react'
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Textarea,
} from '@chakra-ui/react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { useMutation, useQueryClient } from 'react-query'
import { ApiError, PaymentOut, PaymentUpdate, PaymentsService } from '../../client'
import useCustomToast from '../../hooks/useCustomToast'

interface EditPaymentProps {
  payment: PaymentOut
  isOpen: boolean
  onClose: () => void
}

const EditPayment: React.FC<EditPaymentProps> = ({ payment, isOpen, onClose }) => {
  const queryClient = useQueryClient()
  const showToast = useCustomToast()
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors, isDirty },
  } = useForm<PaymentUpdate>({
    // We're no using StudentUpdate model because api receives integers, and frontend sends strings (it's being converted by backend)
    mode: 'onBlur',
    criteriaMode: 'all',
    defaultValues: {
      amount: payment.amount,
      day: payment.day,
      notes: payment.notes || '',
      method: payment.method,
      reason: payment.reason
    },
  })

  const updatePayment = async (data: PaymentUpdate) => {
    await PaymentsService.updatePayment({ id: payment.id, requestBody: data })
  }

  const mutation = useMutation(updatePayment, {
    onSuccess: () => {
      showToast('Success!', 'Pago actualizado satisfactoriamente.', 'success')
      onClose()
    },
    onError: (err: ApiError) => {
      const errDetail = err.body.detail
      showToast('Algo salio mal :(', `${errDetail}`, 'error')
    },
    onSettled: () => {
      queryClient.invalidateQueries('payments')
    },
  })

  const onSubmit: SubmitHandler<PaymentUpdate> = async (data) => {
    mutation.mutate(data)
  }

  const onCancel = () => {
    reset()
    onClose()
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={{ base: 'sm', md: 'md' }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Actualizar alumno</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
          <FormControl isRequired isInvalid={!!errors.amount}>
            <FormLabel htmlFor="amount">Monto</FormLabel>
              <Input
                id="amount"
                {...register('amount', {
                  required: 'Campo requerido.',
                })}
                type="number"
              />
              {errors.amount && (
                <FormErrorMessage>{errors.amount.message}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isRequired isInvalid={!!errors.day}>
              <FormLabel htmlFor="day">Día</FormLabel>
              <Input
                id="title"
                {...register('day', {
                  required: 'Campo requerido.',
                })}
                type="date"
              />
              {errors.day && (
                <FormErrorMessage>{errors.day.message}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isRequired isInvalid={!!errors.method}>
              <FormLabel htmlFor="method">Medio de pago</FormLabel>
              {
                <Select 
                  placeholder='Medio de pago' 
                  {...register('method', {
                    required: 'Campo requerido',
                  })}
                >
                  <option value="mercadopago">Mercadopago</option>
                  <option value="bank_transfer">Transferencia bancaria</option>
                  <option value="cash">Efectivo</option>
                  <option value="other">Otros</option>
                </Select>
              }
              {errors.method && (
                <FormErrorMessage>{errors.method.message}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isRequired isInvalid={!!errors.reason}>
              <FormLabel htmlFor="method">Tipo de cuota</FormLabel>
              {
                <Select 
                  placeholder='Tipo de cuota' 
                  {...register('reason', {
                    required: 'Campo requerido',
                  })}
                >
                  <option value="one_month">Mes completo</option>
                  <option value="half_month">Medio mes</option>
                  <option value="one_lesson">Clase individual</option>
                  <option value="other">Otros</option>
                </Select>
              }
              {errors.reason && (
                <FormErrorMessage>{errors.reason.message}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl mt={4} isInvalid={!!errors.notes}>
                <FormLabel htmlFor="notes">Observaciones</FormLabel>
                <Textarea
                  id="notes"
                  {...register('notes', {})}
                  placeholder="Observaciones"
                />
              {errors.notes && (
                <FormErrorMessage>{errors.notes.message}</FormErrorMessage>
              )}
            </FormControl>
          </ModalBody>
          <ModalFooter gap={3}>
            <Button
              variant="primary"
              type="submit"
              isLoading={isSubmitting}
              isDisabled={!isDirty}
            >
              Guardar
            </Button>
            <Button onClick={onCancel}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default EditPayment
