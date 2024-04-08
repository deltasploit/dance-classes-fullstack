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

import { ApiError, GroupsService } from '../../client'
import ActionsMenu from '../../components/Common/ActionsMenu'
import Navbar from '../../components/Common/Navbar'
import useCustomToast from '../../hooks/useCustomToast'

export const Route = createFileRoute('/_layout/groups')({
  component: Groups,
})

function Groups() {
  const showToast = useCustomToast()
  const {
    data: groups,
    isLoading,
    isError,
    error,
  } = useQuery('groups', () => GroupsService.readGroups({}))

  if (isError) {
    const errDetail = (error as ApiError).body?.detail
    showToast('Something went wrong.', `${errDetail}`, 'error')
  }

  return (
    <>
      {isLoading ? (
        // TODO: Add skeleton
        <Flex justify="center" align="center" height="100vh" width="full">
          <Spinner size="xl" color="ui.main" />
        </Flex>
      ) : (
        groups && (
          <Container maxW="full">
            <Heading
              size="lg"
              textAlign={{ base: 'center', md: 'left' }}
              pt={12}
            >
              Gestión de grupos
            </Heading>
            <Navbar type={'Group'} />
            <TableContainer>
              <Table size={{ base: 'sm', md: 'md' }}>
                <Thead>
                  <Tr>
                    <Th>#</Th>
                    <Th>Nombre</Th>
                    <Th>Descripcion</Th>
                    <Th>Acciones</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {groups.data.map((group) => (
                    <Tr key={group.id}>
                      <Td>{group.id}</Td>
                      <Td>{group.name}</Td>
                      <Td>{group.description}</Td>
                      <Td>
                        <ActionsMenu type={'Group'} value={group} />
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

export default Groups
