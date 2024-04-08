import {
  Card,
  Button,
  Container,
  Heading,
  CardHeader,
  Text,
  StackDivider,
  Stack,
  CardBody,
  Box,
  ListItem,
  UnorderedList,
  Flex,
  Spinner
} from '@chakra-ui/react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ApiError, GroupsService, LessonsService, PaymentsService, StudentsService } from '../../client'
import { useQuery } from 'react-query'
import useCustomToast from '../../hooks/useCustomToast'
import ActionsMenu from '../../components/Common/ActionsMenu'


export const Route = createFileRoute('/_layout/students/$studentId')({
  loader: async ({ params: { studentId } }) => StudentsService.readStudent({id: parseInt(studentId)}),
  notFoundComponent: () => {
    return <p>Alumno no encontrado</p>
  },
  component: Student,
})

function Student() {
  const showToast = useCustomToast()
  const student = Route.useLoaderData()
  
  const { 
    data: payments, 
    isLoading: isPaymentLoading, 
    isError: isPaymentError, 
    error: paymentError 
  } = useQuery(['payments', 'student', student.id], () => PaymentsService.readPayments({studentId: student.id}))
  const { 
    data: groups, 
    isLoading: isGroupsLoading, 
    isError: isGroupsError, 
    error: groupsError 
  } = useQuery(['groups', 'student', student.id], () => GroupsService.readGroups({studentId: student.id}))
  const { 
    data: lessons, 
    isLoading: isLessonsLoading, 
    isError: isLessonsError, 
    error: lessonsError 
  } = useQuery(['lessons', 'student', student.id], () => LessonsService.readLessons({studentId: student.id}))

  if (isPaymentError) {
    const errDetail = (paymentError as ApiError).body?.detail
    showToast('Algo anduvo mal.', `${errDetail}`, 'error')
  }
  if (isGroupsError) {
    const errDetail = (groupsError as ApiError).body?.detail
    showToast('Algo anduvo mal.', `${errDetail}`, 'error')
  }
  if (isLessonsError) {
    const errDetail = (lessonsError as ApiError).body?.detail
    showToast('Algo anduvo mal.', `${errDetail}`, 'error')
  }

  return (
    <>
      <Container maxW="full">
        <Heading
          size="lg"
          textAlign={{ base: 'center', md: 'left' }}
          pt={12}
          color={"white"}
        >
          Gestión de alumnos
        </Heading>
        <Container maxW="full" pt={12}>
          <Card>
            <CardHeader>
              <Flex alignItems='center'>
                <Heading size='md'>Alumno #{student.id} - {student.full_name}</Heading>
                <ActionsMenu type={'Student'} value={student}/>
              </Flex>
            </CardHeader>

            <CardBody>
              <Stack divider={<StackDivider />} spacing='4'>
                <Box>
                  <Heading size='sm' textTransform='uppercase'>
                    Alumno
                  </Heading>
                  <Text pt='2' fontSize='sm'>📍 Localidad: {student.city || '-' }</Text>
                  <Text pt='2' fontSize='sm'>👨🏽 Adulto responsable: {student.responsible_adult_full_name || '-' }</Text>
                  <Text pt='2' fontSize='sm'>📞 Tel. responsable: <a href={`tel:+${student.responsible_adult_phone_number}`}>{student.responsible_adult_phone_number || '-' }</a></Text>
                </Box>
                {isGroupsLoading ? (
                  <Box>
                    <Flex justify="center" align="center" height="100vh" width="full">
                      <Spinner size="xl" color="ui.main" />
                    </Flex>
                  </Box>
                ) : (
                  <Box>
                    <Heading size='sm' textTransform='uppercase'>
                      Grupos
                    </Heading>
                    <UnorderedList spacing={1}>
                    {
                      groups?.data && (groups?.data?.map( ( g ) => (
                        <ListItem fontSize='sm'>
                          {g.name} 
                          <ActionsMenu type={'Group'} value={g} style='h' />
                        </ListItem>
                        )
                    ))}
                    </UnorderedList>
                    { groups?.count == 0 && <Text pt={2}>No hay grupos registrados</Text> }
                  </Box>
                )}
                {isLessonsLoading ? (
                  <Box>
                    <Flex justify="center" align="center" height="100vh" width="full">
                      <Spinner size="xl" color="ui.main" />
                    </Flex>
                  </Box>
                ) : (
                  <Box>
                    <Heading size='sm' textTransform='uppercase'>
                      Asistencia a clases
                    </Heading>
                    <UnorderedList spacing={1}>
                    {
                      lessons?.data?.map( ( l ) => (
                        <ListItem fontSize='sm'>
                          { l.day } - { l.group.name } 
                          <ActionsMenu type={'Lesson'} value={l} style='h' />
                        </ListItem>
                      ))
                    }
                    </UnorderedList>
                    { lessons?.count == 0 && <Text pt={2}>No hay clases registradas</Text> }
                  </Box>
                )}
                {isPaymentLoading ? (
                  <Box>
                    // TODO: Add skeleton
                    <Flex justify="center" align="center" height="100vh" width="full">
                      <Spinner size="xl" color="ui.main" />
                    </Flex>
                  </Box>
                ) : (
                  <Box>
                    <Heading size='sm' textTransform='uppercase'>
                      Historial de pagos
                    </Heading>
                    <UnorderedList spacing={1}>
                    {
                    payments?.data?.map( ( p ) => (
                      <ListItem fontSize='sm'>
                        #{p.id} { p.created_at.split('T')[0] } - ${p.amount}
                        <ActionsMenu type={'Payment'} value={p} style='h' />
                      </ListItem>
                    ))}
                    </UnorderedList>
                    { !payments?.data && <Text pt={2}>No hay clases registradas</Text> }
                  </Box>
                )}
                <Box>
                  <Button as={Link} to='/students/' colorScheme='blue'>Volver a alumnos</Button>
                </Box>
              </Stack>
            </CardBody>
          </Card>
        </Container>
      </Container>
    </>
  )
}

export default Student
