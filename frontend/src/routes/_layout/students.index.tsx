import {
  Container,
  Flex,
  Heading,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from 'react-query'

import { ApiError, StudentsService } from '../../client'
import ActionsMenu from '../../components/Common/ActionsMenu'
import Navbar from '../../components/Common/Navbar'
import useCustomToast from '../../hooks/useCustomToast'

export const Route = createFileRoute('/_layout/students/')({
  component: Students,
})

function Students() {
  const showToast = useCustomToast()
  const {
    data: students,
    isLoading,
    isError,
    error,
  } = useQuery('students', () => StudentsService.readStudents({}))
  if (isError) {
    const errDetail = (error as ApiError).body?.detail
    showToast('Omar, algo anduvo mal.', `${errDetail}`, 'error')
  }

  return (
    <>
      {isLoading ? (
        // TODO: Add skeleton
        <Flex justify="center" align="center" height="100vh" width="full">
          <Spinner size="xl" color="ui.main" />
        </Flex>
      ) : (
        students && (
          <Container maxW="full">
            <Heading
              size="lg"
              textAlign={{ base: 'center', md: 'left' }}
              pt={12}
            >
              Gestión de alumnos
            </Heading>
            <Navbar type={'Student'} />
            <TableContainer>
              <Table size={{ base: 'sm', md: 'md' }}>
                <Thead>
                  <Tr>
                    <Th>#</Th>
                    <Th>Nombre</Th>
                    <Th>Acciones</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {students.data.map((stud) => (
                    <Tr key={stud.id}>
                      <Td>{stud.id}</Td>
                      <Td>{stud.full_name}</Td>
                      <Td>
                        <ActionsMenu type={'Student'} value={stud} />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Container>
        )
      )}
    </>
  )
}

export default Students
