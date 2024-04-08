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
  VStack,
} from '@chakra-ui/react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { useMutation, useQuery, useQueryClient } from 'react-query'
import { ApiError, GroupsService, StudentOut, StudentsService, GroupOut } from '../../client'
import useCustomToast from '../../hooks/useCustomToast'

interface EditStudentProps {
  student: StudentOut
  isOpen: boolean
  onClose: () => void
}

interface StudentUpdateForm {
  full_name: string, 
  city: string,
  responsible_adult_full_name: string,
  responsible_adult_phone_number: string,
  notes: string,
  groups: string[]
}

const EditStudent: React.FC<EditStudentProps> = ({ student, isOpen, onClose }) => {
  const queryClient = useQueryClient()
  const showToast = useCustomToast()
  const { data: groups } = useQuery('groups', () => GroupsService.readGroups({}))
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors, isDirty },
  } = useForm<StudentUpdateForm>({
    // We're no using StudentUpdate model because api receives integers, and frontend sends strings (it's being converted by backend)
    mode: 'onBlur',
    criteriaMode: 'all',
    defaultValues: {
      full_name: student.full_name,
      city: student.city || '',
      responsible_adult_full_name: student.responsible_adult_full_name || '',
      responsible_adult_phone_number: student.responsible_adult_phone_number || '',
      notes: student.notes || '',
      groups: student.group_links?.map( (g) => g.group_id?.toString() ),
    },
  })

  const updateStudent = async (data: StudentUpdateForm) => {
    const groups = typeof(data.groups) == "string" ? [parseInt(data.groups)] : data.groups.map( g => parseInt(g))
    const payload = {
      full_name: data.full_name,
      city: data.city,
      responsible_adult_full_name: data.responsible_adult_full_name,
      responsible_adult_phone_number: data.responsible_adult_phone_number,
      notes: data.notes,
      groups: groups
    }
    await StudentsService.updateStudent({ id: student.id, requestBody: payload })
  }

  const mutation = useMutation(updateStudent, {
    onSuccess: () => {
      showToast('Success!', 'Alumno actualizado satisfactoriamente.', 'success')
      onClose()
    },
    onError: (err: ApiError) => {
      const errDetail = err.body.detail
      showToast('Algo salio mal :(', `${errDetail}`, 'error')
    },
    onSettled: () => {
      queryClient.invalidateQueries('students')
    },
  })

  const onSubmit: SubmitHandler<StudentUpdateForm> = async (data) => {
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

export default EditStudent
