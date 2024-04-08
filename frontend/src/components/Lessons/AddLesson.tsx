import React, { useState } from 'react'
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
  Select,
  VStack,
} from '@chakra-ui/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'

import { ApiError, GroupOut, GroupsService, LessonsService, StudentOut, StudentsService } from '../../client'
import useCustomToast from '../../hooks/useCustomToast'

interface AddLessonProps {
  group?: GroupOut
  isOpen: boolean
  onClose: () => void
}

interface LessonCreateForm {
  day: string, 
  group_id: number
  assistants: string[]
}

const AddLesson: React.FC<AddLessonProps> = ({ group, isOpen, onClose }) => {
  const queryClient = useQueryClient()
  const showToast = useCustomToast()

  const [selectedGroup, setSelectedGroup] = useState(group ? group.id : 1)
  const { data: students } = useQuery(['students', 'group', selectedGroup], () => StudentsService.readStudents({groupId: selectedGroup}))
  const { data: groups } = useQuery('groups', () => GroupsService.readGroups({}))
  const today = new Date()
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LessonCreateForm>({
    mode: 'onBlur',
    criteriaMode: 'all',
    defaultValues: {
      group_id: selectedGroup,
      day: today.toISOString().split('T')[0],
      assistants: []
    },
  }) 

  const addLesson = async (data: LessonCreateForm) => {
    const assistants = typeof(data.assistants) == "string" ? [parseInt(data.assistants)] : data.assistants.map( s => parseInt(s))

    const payload = {
      group_id: data.group_id,
      assistants: assistants,
      day: data.day
    }
    await LessonsService.createLesson({ requestBody: payload })
  }

  const mutation = useMutation(addLesson, {
    onSuccess: () => {
      showToast('Success!', 'Clase creada satisfactoriamente.', 'success')
      reset()
      onClose()
    },
    onError: (err: ApiError) => {
      const errDetail = err.body.detail
      showToast('Algo anduvo mal :(', `${errDetail}`, 'error')
    },
    onSettled: () => {
      queryClient.invalidateQueries('lessons')
    },
  })

  const onSubmit: SubmitHandler<LessonCreateForm> = (data) => {
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
          <ModalHeader>Nueva clase</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isRequired isInvalid={!!errors.group_id}>
              <FormLabel htmlFor="group_id">Grupo</FormLabel>
              {
                <Select 
                  placeholder='Selecciona el grupo' 
                  {...register('group_id', {
                    required: 'Campo requerido',
                    onChange() {
                      setSelectedGroup(getValues('group_id'))
                    },
                  })}
                >
                  { groups?.data?.map( (g) => (
                    <option value={g.id}>{g.name}</option>
                  ))}
                </Select>
              }
              {errors.group_id && (
                <FormErrorMessage>{errors.group_id.message}</FormErrorMessage>
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
            <FormControl mt={4} isInvalid={!!errors.assistants}>
                <FormLabel htmlFor="assistants">Asistentes</FormLabel>
                <VStack align={'start'}>
                {students &&
                  students.data.map( (assistant: StudentOut)  => (
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

export default AddLesson
