import React from 'react'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'

import { UsersService, StudentsService, GroupsService, LessonsService, PaymentsService } from '../../client'
import useCustomToast from '../../hooks/useCustomToast'

interface DeleteProps {
  type: string
  id: number
  isOpen: boolean
  onClose: () => void
}

const Delete: React.FC<DeleteProps> = ({ type, id, isOpen, onClose }) => {
  const queryClient = useQueryClient()
  const showToast = useCustomToast()
  const cancelRef = React.useRef<HTMLButtonElement | null>(null)
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm()

  const typeNames: { [key: string]: string | undefined } = {
    'User': 'Usuario',
    'Student': 'Alumno',
    'Group': 'Grupo',
    'Lesson': 'Clase',
    'Payment': 'Pago'
  }

  const queryTypes: { [key: string]: string | undefined } = {
    'User': 'users',
    'Student': 'students',
    'Group': 'groups',
    'Lesson': 'lessons',
    'Payment': 'payments'
  }

  const confirmationMessages: { [key: string]: string | undefined } = {
    'User': 'El usuario fue eliminado con éxito',
    'Student': 'El alumno fue eliminado con éxito',
    'Group': 'El grupo fue eliminado con éxito',
    'Lesson': 'La clase fue eliminada con éxito',
    'Payment': 'El pago fue eliminado con éxito'
  }

  const errorMessages: { [key: string]: string | undefined } = {
    'User': 'Ocurrió un error al intentar eliminar el usuario',
    'Student': 'Ocurrió un error al intentar eliminar el alumno',
    'Group': 'Ocurrió un error al intentar eliminar el grupo',
    'Lesson': 'Ocurrió un error al intentar eliminar la clase',
    'Payment': 'Ocurrió un error al intentar eliminar el pago'
  }

  const deleteEntity = async (id: number) => {
    if (type === 'User') {
      await UsersService.deleteUser({ userId: id })
    } else if (type === 'Student') {
      await StudentsService.deleteStudent({ id: id })
    } else if (type === 'Group') {
      await GroupsService.deleteGroup({ id: id })
    } else if (type === 'Lesson') {
      await LessonsService.deleteLesson({ id: id })
    } else if (type === 'Payment') {
      await PaymentsService.deletePayment({ id: id })
    }
     else {
      throw new Error(`Unexpected type: ${type}`)
    }
  }

  const mutation = useMutation(deleteEntity, {
    onSuccess: () => {
      const typeName = typeNames[type];
      if (typeName) {
        showToast(
          'Éxito!',
          `${confirmationMessages[type]?.toLowerCase()}`,
          'success',
        );
      }
      onClose()
    },
    onError: () => {
      showToast(
        'Algo anduvo mal.',
        `Ocurrió un error al intentar eliminar el  ${errorMessages[type]?.toLowerCase()}.`,
        'error',
      )
    },
    onSettled: () => {
      queryClient.invalidateQueries(queryTypes[type])
    },
  })

  const onSubmit = async () => {
    mutation.mutate(id)
  }

  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        onClose={onClose}
        leastDestructiveRef={cancelRef}
        size={{ base: 'sm', md: 'md' }}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent as="form" onSubmit={handleSubmit(onSubmit)}>
            <AlertDialogHeader>Eliminar {typeNames[type]}</AlertDialogHeader>

            <AlertDialogBody>
              {type === 'Student' && (
                <span>
                  Toda la información relacionada al alumno será {' '}
                  <strong>permanentemente eliminada. </strong>
                </span>
              )}
              Estas seguro?
            </AlertDialogBody>

            <AlertDialogFooter gap={3}>
              <Button variant="danger" type="submit" isLoading={isSubmitting}>
                Eliminar
              </Button>
              <Button
                ref={cancelRef}
                onClick={onClose}
                isDisabled={isSubmitting}
              >
                Cancelar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

export default Delete
