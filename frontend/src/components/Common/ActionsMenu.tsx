import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from '@chakra-ui/react'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { FiEdit, FiPlus, FiSearch, FiTrash } from 'react-icons/fi'

import EditUser from '../Admin/EditUser'
import EditGroup from '../Groups/EditGroup'
import EditLesson from '../Lessons/EditLesson'
import EditStudent from '../Students/EditStudent'
import Delete from './DeleteAlert'
import { GroupOut, StudentOut, UserOut, LessonOut, PaymentOut } from '../../client'
import AddLesson from '../Lessons/AddLesson'
import { Link } from '@tanstack/react-router'
import { FaChevronCircleRight } from 'react-icons/fa'
import EditPayment from '../Payments/EditPayment'


interface ActionsMenuProps {
  type: string
  style?: string
  value: UserOut | StudentOut | GroupOut | LessonOut | PaymentOut
  disabled?: boolean
}

const ActionsMenu: React.FC<ActionsMenuProps> = ({ style, type, value, disabled }) => {
  const editUserModal = useDisclosure()
  const createClassModal = useDisclosure()
  const deleteModal = useDisclosure()

  const editComponents = {
    'User': <EditUser
      key={value.id}
      user={value as UserOut}
      isOpen={editUserModal.isOpen}
      onClose={editUserModal.onClose}
    />,
    'Student': <EditStudent
      key={value.id}
      student={value as StudentOut}
      isOpen={editUserModal.isOpen}
      onClose={editUserModal.onClose}
    />,
    'Group': <EditGroup
      key={value.id}
      group={value as GroupOut}
      isOpen={editUserModal.isOpen}
      onClose={editUserModal.onClose}
    />,
    'Lesson': <EditLesson
      key={value.id}
      lesson={value as LessonOut}
      isOpen={editUserModal.isOpen}
      onClose={editUserModal.onClose}
    />,
    'Payment': <EditPayment
      key={value.id}
      payment={value as PaymentOut}
      isOpen={editUserModal.isOpen}
      onClose={editUserModal.onClose}
    />
  }

  const typeNames: { [key: string]: string | undefined } = {
    'User': 'Usuario',
    'Student': 'Alumno',
    'Group': 'Grupo',
    'Lesson': 'Clase',
  }

  return (
    <>
      <Menu>
        <MenuButton
          isDisabled={disabled}
          as={Button}
          rightIcon={ style === 'h' ? <FaChevronCircleRight /> : <BsThreeDotsVertical />}
          variant="unstyled"
        ></MenuButton>
        <MenuList>
          {
            type === 'Lesson' && 
            <MenuItem 
              as={Link}
              icon={<FiSearch fontSize="16px" />}
              to='/lessons/$lessonId'
              params={{
                lessonId: value.id
              }}
            >
              Ver
            </MenuItem>
          }
          {
            type === 'Student' && 
            <MenuItem 
              as={Link}
              icon={<FiSearch fontSize="16px" />}
              to='/students/$studentId'
              params={{
                studentId: value.id
              }}
            >
              Ver
            </MenuItem>
          }
          <MenuItem
            onClick={editUserModal.onOpen}
            icon={<FiEdit fontSize="16px" />}
          >
            Editar {typeNames[type]}
          </MenuItem>
          {
            type === 'Group' && 
            <MenuItem
              onClick={createClassModal.onOpen}
              icon={<FiPlus fontSize="16px" />}
            >
              Nueva clase
            </MenuItem>
          }
          <MenuItem
            onClick={deleteModal.onOpen}
            icon={<FiTrash fontSize="16px" />}
            color="ui.danger"
          >
            Eliminar {typeNames[type]}
          </MenuItem>
        </MenuList>
        {editComponents[type as keyof typeof editComponents]}
        {
            type === 'Group' && 
            <AddLesson      
              group={value as GroupOut}
              isOpen={createClassModal.isOpen}
              onClose={createClassModal.onClose}
            />
        } 
        {
            type === 'Lesson' && 
            <AddLesson      
              isOpen={createClassModal.isOpen}
              onClose={createClassModal.onClose}
            />
        }
        <Delete
          type={type}
          id={value.id}
          isOpen={deleteModal.isOpen}
          onClose={deleteModal.onClose}
        />
      </Menu>
    </>
  )
}

export default ActionsMenu
