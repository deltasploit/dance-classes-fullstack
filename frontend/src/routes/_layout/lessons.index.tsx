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

import { ApiError, LessonsService } from '../../client'
import ActionsMenu from '../../components/Common/ActionsMenu'
import Navbar from '../../components/Common/Navbar'
import useCustomToast from '../../hooks/useCustomToast'


export const Route = createFileRoute('/_layout/lessons/')({
  component: Lessons,
})

function Lessons() {
  const showToast = useCustomToast()
  const {
    data: lessons,
    isLoading,
    isError,
    error,
  } = useQuery('lessons', () => LessonsService.readLessons({}))
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
        lessons && (
          <Container maxW="full">
            <Heading
              size="lg"
              textAlign={{ base: 'center', md: 'left' }}
              pt={12}
            >
              Gestión de clases
            </Heading>
            <Navbar type={'Lesson'} />
            <TableContainer>
              <Table size={{ base: 'sm', md: 'md' }}>
                <Thead>
                  <Tr>
                    <Th>#</Th>
                    <Th>Día</Th>
                    <Th>Grupo</Th>
                    <Th>Acciones</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {lessons.data.map((lesson) => (
                    <Tr key={lesson.id}>
                      <Td>{lesson.id} </Td>
                      <Td>{lesson.day}</Td>
                      <Td>{lesson.group.name}</Td>
                      <Td>
                        <ActionsMenu type={'Lesson'} value={lesson} />
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

export default Lessons
