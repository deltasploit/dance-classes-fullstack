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
} from '@chakra-ui/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'

import { ApiError, GroupCreate, GroupsService } from '../../client'
import useCustomToast from '../../hooks/useCustomToast'

interface AddGroupProps {
  isOpen: boolean
  onClose: () => void
}

const AddGroup: React.FC<AddGroupProps> = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient()
  const showToast = useCustomToast()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GroupCreate>({
    mode: 'onBlur',
    criteriaMode: 'all',
    defaultValues: {
      name: '',
      description: ''
    },
  })

  const addGroup = async (data: GroupCreate) => {
    await GroupsService.createGroup({ requestBody: data })
  }

  const mutation = useMutation(addGroup, {
    onSuccess: () => {
      showToast('Success!', 'Grupo creado satisfactoriamente.', 'success')
      reset()
      onClose()
    },
    onError: (err: ApiError) => {
      const errDetail = err.body.detail
      showToast('Algo anduvo mal :(', `${errDetail}`, 'error')
    },
    onSettled: () => {
      queryClient.invalidateQueries('groups')
    },
  })

  const onSubmit: SubmitHandler<GroupCreate> = (data) => {
    console.log(data);
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
          <ModalHeader>Nuevo grupo</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isRequired isInvalid={!!errors.name}>
              <FormLabel htmlFor="name">Nombre</FormLabel>
              <Input
                id="name"
                {...register('name', {
                  required: 'Campo requerido.',
                })}
                placeholder="Nombre"
                type="text"
              />
              {errors.name && (
                <FormErrorMessage>{errors.name.message}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl mt={4}>
              <FormLabel htmlFor="description">Descripción</FormLabel>
              <Input
                id="description"
                {...register('description')}
                placeholder="Descripción"
                type="text"
              />
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

export default AddGroup
