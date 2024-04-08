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
import { ApiError, GroupOut, GroupUpdate, GroupsService } from '../../client'
import useCustomToast from '../../hooks/useCustomToast'

interface EditGroupProps {
  group: GroupOut
  isOpen: boolean
  onClose: () => void
}

const EditGroup: React.FC<EditGroupProps> = ({ group, isOpen, onClose }) => {
  const queryClient = useQueryClient()
  const showToast = useCustomToast()
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors, isDirty },
  } = useForm<GroupUpdate>({
    mode: 'onBlur',
    criteriaMode: 'all',
    defaultValues: group,
  })

  const updateGroup = async (data: GroupUpdate) => {
    await GroupsService.updateGroup({ id: group.id, requestBody: data })
  }

  const mutation = useMutation(updateGroup, {
    onSuccess: () => {
      showToast('Success!', 'Grupo actualizado satisfactoriamente.', 'success')
      onClose()
    },
    onError: (err: ApiError) => {
      const errDetail = err.body.detail
      showToast('Algo salio mal :(', `${errDetail}`, 'error')
    },
    onSettled: () => {
      queryClient.invalidateQueries('groups')
    },
  })

  const onSubmit: SubmitHandler<GroupUpdate> = async (data) => {
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
          <ModalHeader>Actualizar grupo</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isInvalid={!!errors.name}>
              <FormLabel htmlFor="name">Nombre</FormLabel>
              <Input
                id="name"
                {...register('name', {
                  required: 'Campo requerido',
                })}
                type="text"
              />
              {errors.name && (
                <FormErrorMessage>{errors.name.message}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl mt={4}>
              <FormLabel htmlFor="description">Descripcion</FormLabel>
              <Input
                id="description"
                {...register('description')}
                placeholder="Descripcion"
                type="text"
              />
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

export default EditGroup
