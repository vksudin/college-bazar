import react,{useState} from 'react';
import {
  Badge,
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Link,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import axios from 'axios';
export default function Profilecard({userId,username,email,address,isBlocked,isAdmin}) {
 const [blocked,setBlocked] = useState(isBlocked);
  const toggleBlock = async()=>{
    console.log("ASD")
    try{
        await axios.get(`/api/private/blockuser/${userId}`, {headers:{
              "Content-Type":"application/json",
              "Authorization":`Bearer ${localStorage.getItem("clgToken")}`
          }}).then((data)=>{
            console.log(data.data.message)
            alert(data.data.message);
            setBlocked(!blocked)
        }).catch((error)=>{
            alert("Something went wrong")
        })
    }catch(e){
        console.log(e);
    }
  }
  return (
        <>
        {
isAdmin==false && 
    <Center py={6}>
      <Stack
        borderWidth="1px"
        borderRadius="lg"
        w={{ sm: '100%', md: '540px' }}
        height={{ sm: '476px', md: '20rem' }}
        direction={{ base: 'column', md: 'row' }}
        boxShadow={'2xl'}
        padding={4}>
      
        <Stack
          flex={1}
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          p={1}
          pt={2}>
          <Heading fontSize={'2xl'} fontFamily={'body'}>
            {username}
          </Heading>
          <Text fontWeight={600} color={'gray.500'} size="sm" mb={4}>
            {email}
          </Text>
           <Text
            textAlign={'center'}
          
            px={3}>
            {address}
          </Text>
 

          <Stack
            width={'100%'}
            mt={'2rem'}
            direction={'row'}
            padding={2}
            justifyContent={'space-between'}
            alignItems={'center'}>
    
            <Button
              flex={1}
              fontSize={'sm'}
              rounded={'full'}
              bg={`${blocked==true ?"red.500":"blue.500"}`}
              color={'white'}
              onClick={toggleBlock}
              >
              {blocked==true?"Unblock":"Block"}
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Center>
}</>
  );
}