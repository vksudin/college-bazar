import React, { useEffect, useState } from 'react';
import { ReactNode } from 'react';
import {
  Box,
  Flex,
  Avatar,
  Link,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
  FormLabel,
  Input,
  ModalFooter,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

export default function Nav() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate=useNavigate();
  const [username,setUsername]=useState("Guest");

  const initialRef = React.useRef(null)
  const finalRef = React.useRef(null)
  useEffect(()=>{
    if(localStorage.getItem("clgToken")){
      axios.get('/api/private/getdetails',{
        headers:{
          "Content-Type":"application/json",
          "Authorization":`Bearer ${localStorage.getItem("clgToken")}`
        }
      }).then(({data})=>setUsername(data.username)).catch((err)=>console.log(err));
    }
  },[])
  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Box className='nav-header' style={{cursor:"pointer"}} onClick={()=>navigate('/')}>College-Bazar</Box>

          <Flex alignItems={'center'}>
            <Stack direction={'row'} spacing={7}>
              <Button onClick={toggleColorMode}>
                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              </Button>

              <Menu>
                <MenuButton
                  as={Button}
                  rounded={'full'}
                  variant={'link'}
                  cursor={'pointer'}
                  minW={0}>
                  <Avatar
                    size={'sm'}
                    src={'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'}
                  />
                </MenuButton>
                <MenuList alignItems={'center'}>
                  <br />
                  <Center>
                    <Avatar
                      size={'2xl'}
                      src={'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'}
                    />
                  </Center>
                  <br />
                  <Center>
                    <p>{username}</p>
                  </Center>
                  <br />
                  <MenuDivider />
                  {
                    !localStorage.getItem("clgToken")
                    ?
                    <>
                    <MenuItem onClick={()=>{
                      navigate('/login')
                    }}>Login</MenuItem>
                    <MenuItem onClick={()=>{
                      navigate('/register')
                    }}>Register</MenuItem>
                    </>
                    :
                    <MenuItem onClick={()=>{
                      localStorage.removeItem("clgToken");
                      navigate('/login');
                    }}>Logout</MenuItem>

                  }
                </MenuList>
              </Menu>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}