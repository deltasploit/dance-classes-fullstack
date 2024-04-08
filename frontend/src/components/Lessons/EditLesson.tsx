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
  VStack
} from '@chakra-ui/react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { useMutation, useQuery, useQueryClient } from 'react-query'
import { ApiError, LessonsService, LessonOut, StudentOut, StudentsService } from '../../client'
import useCustomToast from '../../hooks/useCustomToast'


interface EditLessonProps {
  lesson: LessonOut
  isOpen: boolean
  onClose: () => void
}

interface LessonUpdateForm {
  day: string, 
  assistants: string[]
}

const EditLesson: React.FC<EditLessonProps> = ({ lesson, isOpen, onClose }) => {
  const queryClient = useQueryClient()
  const showToast = useCustomToast()
  const { data: registeredStudents } = useQuery('students', () => StudentsService.readStudents({groupId: lesson.group.id}))
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors, isDirty },
  } = useForm<LessonUpdateForm>({
    // We're no using StudentUpdate model because api receives integers, and frontend sends strings (it's being converted by backend)
    mode: 'onBlur',
    criteriaMode: 'all',
    defaultValues: {
      'day': lesson.day,
      'assistants': lesson.assistants?.map( (g) => g.id?.toString() ),
    },
  })

  const updateLesson = async (data: LessonUpdateForm) => {
    const students = typeof(data.assistants) == "string" ? [parseInt(data.assistants)] : data.assistants.map( g => parseInt(g))
    const payload = {
      day: data.day,
      assistants: students
    }
    await LessonsService.updateLesson({ id: lesson.id, requestBody: payload })
  }

  const mutation = useMutation(updateLesson, {
    onSuccess: () => {
      showToast('Success!', 'Clase actualizada satisfactoriamente.', 'success')
      onClose()
    },
    onError: (err: ApiError) => {
      const errDetail = err.body.detail
      showToast('Algo salio mal :(', `${errDetail}`, 'error')
    },
    onSettled: () => {
      queryClient.invalidateQueries('lessons')
    },
  })

  const onSubmit: SubmitHandler<LessonUpdateForm> = async (data) => {
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
            <FormControl isInvalid={!!errors.day}>
              <FormLabel htmlFor="day">Fecha</FormLabel>
              <Input
                id="day"
                {...register('day', {
                  required: 'La fecha es obligatoria',
                })}
                type="date"
              />
              {errors.day && (
                <FormErrorMessage>{errors.day.message}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl mt={4} isInvalid={!!errors.assistants}>
                <FormLabel htmlFor="assistants">Asistentes</FormLabel>
                <VStack align={'start'}>
                {registeredStudents &&
                  registeredStudents.data.map( (assistant: StudentOut)  => (
                    <Checkbox value={assistant.id} {...register('assistants')}>
                      {assistant.full_name}
                    </Checkbox>
                  ))}
                </VStack>
                {errors.assistants && (
                  <FormErrorMessage>{errors.assistants.message}</FormErrorMessage>
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

export default EditLesson
