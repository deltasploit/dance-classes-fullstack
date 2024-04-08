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

import { ApiError, PaymentsService } from '../../client'
import ActionsMenu from '../../components/Common/ActionsMenu'
import Navbar from '../../components/Common/Navbar'
import useCustomToast from '../../hooks/useCustomToast'

export const Route = createFileRoute('/_layout/payments')({
  component: Payments,
})

function Payments() {
  const showToast = useCustomToast()
  const {
    data: payments,
    isLoading,
    isError,
    error,
  } = useQuery('payments', () => PaymentsService.readPayments({limit:10}))

  if (isError) {
    const errDetail = (error as ApiError).body?.detail
    showToast('Algo anduvo mal :(.', `${errDetail}`, 'error')
  }

  return (
    <>
      {isLoading ? (
        // TODO: Add skeleton
        <Flex justify="center" align="center" height="100vh" width="full">
          <Spinner size="xl" color="ui.main" />
        </Flex>
      ) : (
        payments && (
          <Container maxW="full">
            <Heading
              size="lg"
              textAlign={{ base: 'center', md: 'left' }}
              pt={12}
            >
              Gestión de pagos
            </Heading>
            <Navbar type={'Payment'} />
            <TableContainer>
              <Table size={{ base: 'sm', md: 'md' }}>
                <Thead>
                  <Tr>
                    <Th>#</Th>
                    <Th>Fecha</Th>
                    <Th>Alumno</Th>
                    <Th>Monto</Th>
                    <Th>Medio de pago</Th>
                    <Th>Observaciones</Th>
                    <Th>Acciones</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {payments.data.map((payment) => (
                    <Tr key={payment.id}>
                      <Td>{payment.id}</Td>
                      <Td>{payment.day}</Td>
                      <Td>#{payment.student.id} - {payment.student.full_name}</Td>
                      <Td>${payment.amount}</Td>
                      <Td>{payment.method}</Td>
                      <Td>{payment.notes}</Td>
                      <Td>
                        <ActionsMenu type={'Payment'} value={payment} />
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

export default Payments
