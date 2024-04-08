import React from 'react'
import {
  Button,
  Checkbox,
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
  Textarea,
  VStack
} from '@chakra-ui/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'

import { ApiError, StudentCreate, StudentsService, GroupsService, GroupOut } from '../../client'
import useCustomToast from '../../hooks/useCustomToast'

interface AddStudentProps {
  isOpen: boolean
  onClose: () => void
}

const AddStudent: React.FC<AddStudentProps> = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient()
  const showToast = useCustomToast()
  const { data: groups } = useQuery('groups', () => GroupsService.readGroups({}))  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StudentCreate>({
    mode: 'onBlur',
    criteriaMode: 'all',
    defaultValues: {
      full_name: '',
      city: '',
      responsible_adult_full_name: '',
      responsible_adult_phone_number: '',
      notes: '',
      groups: []
    },
  })
  const addStudent = async (data: StudentCreate) => {
    await StudentsService.createStudent({ requestBody: data })
  }

  const mutation = useMutation(addStudent, {
    onSuccess: () => {
      showToast('Success!', 'Alumno creado satisfactoriamente.', 'success')
      reset()
      onClose()
    },
    onError: (err: ApiError) => {
      const errDetail = err.body.detail
      showToast('Algo anduvo mal :(', `${errDetail}`, 'error')
    },
    onSettled: () => {
      queryClient.invalidateQueries('students')
    },
  })

  const onSubmit: SubmitHandler<StudentCreate> = (data) => {
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
          <ModalHeader>Nuevo alumno</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl mt={4} isRequired isInvalid={!!errors.full_name}>
              <FormLabel htmlFor="full_name">Nombre completo</FormLabel>
              <Input
                id="full_name"
                {...register('full_name', {
                  required: 'Campo requerido.',
                })}
                placeholder="Nombre completo"
                type="text"
              />
              {errors.full_name && (
                <FormErrorMessage>{errors.full_name.message}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl mt={4} isInvalid={!!errors.city}>
              <FormLabel htmlFor="city">Ciudad</FormLabel>
              <Input
                id="city"
                {...register('city', {})}
                placeholder="Ciudad"
                type="text"
              />
              {errors.city && (
                <FormErrorMessage>{errors.city.message}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl mt={4} isInvalid={!!errors.responsible_adult_full_name}>
              <FormLabel htmlFor="responsible_adult_full_name">Adulto responsable</FormLabel>
              <Input
                id="title"
                {...register('responsible_adult_full_name', {})}
                placeholder="Adulto responsable"
                type="text"
              />
              {errors.responsible_adult_full_name && (
                <FormErrorMessage>{errors.responsible_adult_full_name.message}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl mt={4} isInvalid={!!errors.responsible_adult_phone_number}>
              <FormLabel htmlFor="responsible_adult_full_name">Adulto responsable (Teléfono)</FormLabel>
              <Input
                id="responsible_adult_phone_number"
                {...register('responsible_adult_phone_number', {})}
                placeholder="Adulto responsable (teléfono)"
                type="text"
              />
              {errors.responsible_adult_phone_number && (
                <FormErrorMessage>{errors.responsible_adult_phone_number.message}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl mt={4} isInvalid={!!errors.groups}>
                <FormLabel htmlFor="groups">Grupos</FormLabel>
                <VStack align={'start'}>
                {groups &&
                  groups?.data?.map( (group: GroupOut)  => (
                    <Checkbox value={group.id} {...register('groups')}>
                      {group.name}
                    </Checkbox>
                  ))}
                </VStack>
                {errors.groups && (
                  <FormErrorMessage>{errors.groups.message}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl mt={4} isInvalid={!!errors.notes}>
                <FormLabel htmlFor="notes">Observaciones</FormLabel>
                <Textarea
                  id="notes"
                  {...register('notes', {})}
                  placeholder="Observaciones"
                />
              {errors.responsible_adult_phone_number && (
                <FormErrorMessage>{errors.responsible_adult_phone_number.message}</FormErrorMessage>
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

export default AddStudent
