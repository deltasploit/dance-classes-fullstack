import React from 'react'
import { Button, Flex, Icon, useDisclosure } from '@chakra-ui/react'
import { FaPlus } from 'react-icons/fa'

import AddUser from '../Admin/AddUser'
import AddStudent from '../Students/AddStudent'
import AddGroup from '../Groups/AddGroup'
import AddLesson from '../Lessons/AddLesson'
import AddPayment from '../Payments/AddPayment'


interface NavbarProps {
  type: string
}

const Navbar: React.FC<NavbarProps> = ({ type }) => {
  const addUserModal = useDisclosure()
  const addStudentModal = useDisclosure()
  const addGroupModal = useDisclosure()
  const addLessonModal = useDisclosure()
  const addPaymentModal = useDisclosure()

  const addComponents = {
    'User': addUserModal.onOpen,
    'Student': addStudentModal.onOpen,
    'Group': addGroupModal.onOpen,
    'Lesson': addLessonModal.onOpen,
    'Payment': addPaymentModal.onOpen
  }

  const addFieldText: { [key: string]: string | undefined } = {
    'User': 'Nuevo usuario',
    'Student': 'Nuevo alumno',
    'Group': 'Nuevo grupo',
    'Lesson': 'Nueva clase',
    'Payment': 'Registrar pago'
  }
  
  return (
    <>
      <Flex py={8} gap={4}>
        {/* TODO: Complete search functionality */}
        {/* <InputGroup w={{ base: '100%', md: 'auto' }}>
                    <InputLeftElement pointerEvents='none'>
                        <Icon as={FaSearch} color='gray.400' />
                    </InputLeftElement>
                    <Input type='text' placeholder='Search' fontSize={{ base: 'sm', md: 'inherit' }} borderRadius='8px' />
                </InputGroup> */}
        <Button
          variant="primary"
          gap={1}
          fontSize={{ base: 'sm', md: 'inherit' }}
          onClick={addComponents[type as keyof typeof addComponents]}
        >
          <Icon as={FaPlus} />{addFieldText[type]}
        </Button>
        <AddUser isOpen={addUserModal.isOpen} onClose={addUserModal.onClose} />
        <AddStudent isOpen={addStudentModal.isOpen} onClose={addStudentModal.onClose} />
        <AddGroup isOpen={addGroupModal.isOpen} onClose={addGroupModal.onClose} />
        <AddLesson isOpen={addLessonModal.isOpen} onClose={addLessonModal.onClose} />
        <AddPayment isOpen={addPaymentModal.isOpen} onClose={addPaymentModal.onClose} />
      </Flex>
    </>
  )
}

export default Navbar
