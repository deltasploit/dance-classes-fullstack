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
  Textarea
} from '@chakra-ui/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'

import { ApiError, PaymentCreate, StudentsService, PaymentsService } from '../../client'
import useCustomToast from '../../hooks/useCustomToast'

interface AddPaymentProps {
  isOpen: boolean
  onClose: () => void
}

const AddPayment: React.FC<AddPaymentProps> = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient()
  const showToast = useCustomToast()
  const { data: students } = useQuery('students', () => StudentsService.readStudents({}))  
  const today = new Date()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PaymentCreate>({
    mode: 'onBlur',
    criteriaMode: 'all',
    defaultValues: {
      amount: 0,
      day: today.toISOString().split('T')[0],
      notes: '',
      method: 'other',
      reason: 'other'
    },
  })

  const addPayment = async (data: PaymentCreate) => {
    await PaymentsService.createPayment({ requestBody: data })
  }

  const mutation = useMutation(addPayment, {
    onSuccess: () => {
      showToast('Success!', 'Pago registrado satisfactoriamente.', 'success')
      reset()
      onClose()
    },
    onError: (err: ApiError) => {
      const errDetail = err.body.detail
      showToast('Algo anduvo mal :(', `${errDetail}`, 'error')
    },
    onSettled: () => {
      queryClient.invalidateQueries('payments')
    },
  })

  const onSubmit: SubmitHandler<PaymentCreate> = (data) => {
    mutation.mutate(data)
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
          <ModalHeader>Registrar pago</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isRequired isInvalid={!!errors.student_id}>
              <FormLabel htmlFor="student_id">Alumno</FormLabel>
              {
                <Select 
                  placeholder='Selecciona un alumno' 
                  {...register('student_id', {
                    required: 'Campo requerido',
                  })}
                >
                  { students?.data?.map( (s) => (
                    <option value={s.id}>{s.full_name}</option>
                  ))}
                </Select>
              }
              {errors.student_id && (
                <FormErrorMessage>{errors.student_id.message}</FormErrorMessage>
              )}
            </FormControl>
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
            <Button variant="primary" type="submit" isLoading={isSubmitting}>
              Guardar
            </Button>
            <Button onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default AddPayment
