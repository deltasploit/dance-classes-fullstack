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
  Flex
} from '@chakra-ui/react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { LessonsService } from '../../client'
import ActionsMenu from '../../components/Common/ActionsMenu'


export const Route = createFileRoute('/_layout/lessons/$lessonId')({
  loader: async ({ params: { lessonId } }) => LessonsService.readLesson({id: lessonId}),
  notFoundComponent: () => {
    return <p>Clase no encontrada</p>
  },
  component: Lesson,
})


function Lesson() {
  const lesson = Route.useLoaderData()
  return (
    <>
      <Container maxW="full">
        <Heading
          size="lg"
          textAlign={{ base: 'center', md: 'left' }}
          pt={12}
          color={"white"}
        >
          Gestión de clases
        </Heading>
        <Container maxW="full" pt={12}>
          <Card>
            <CardHeader>
              <Flex alignItems='center'>
                <Heading size='md'>Clase #{lesson.id}</Heading>
                <ActionsMenu type={'Lesson'} value={lesson} />
              </Flex>
            </CardHeader>

            <CardBody>
              <Stack divider={<StackDivider />} spacing='4'>
                <Box>
                  <Heading size='sm' textTransform='uppercase'>
                    Grupo
                  </Heading>
                  <Text pt='2' fontSize='sm'>
                    {lesson.group.name}
                    <ActionsMenu type={'Group'} value={lesson.group} style='h'/>
                  </Text>
                </Box>
                <Box>
                  <Heading size='sm' textTransform='uppercase'>
                    Fecha
                  </Heading>
                  <Text pt='2' fontSize='sm'>
                    {lesson.day}
                  </Text>
                </Box>
                <Box>
                  <Heading size='sm' textTransform='uppercase'>
                    Asistentes
                  </Heading>
                  <UnorderedList spacing={1}>
                  {
                    lesson.assistants?.map( ( s ) => (
                      <ListItem fontSize='sm'>
                        {s.full_name}
                        <ActionsMenu type={'Student'} value={s} style='h'/>
                      </ListItem>
                  ))}
                  </UnorderedList>
                </Box>
                <Box>
                  <Button as={Link} to='/lessons/' colorScheme='blue'>Volver a lista de clases</Button>
                </Box>
              </Stack>
            </CardBody>
          </Card>
        </Container>
      </Container>
    </>
  )
}

export default Lesson
