import {
    Flex,
    Circle,
    Box,
    Image,
    Badge,
    useColorModeValue,
    Icon,
    chakra,
    Tooltip,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
  } from '@chakra-ui/react';
import { CheckIcon,DeleteIcon } from '@chakra-ui/icons'
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
  
  const data = {
    isNew: true,
    imageURL:
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=4600&q=80',
    name: 'Wayfarer Classic',
    price: 4.5,
    rating: 4.2,
    numReviews: 34,
  };
  
 
  
  function ProductAddToCart({photo,title,description,price,owner,userId,id,calling}) {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const navigate=useNavigate();
    const approveItem=async()=>{
      try {
        await axios.get(`/api/private/approveitem/${id}`,{
          headers:{
              "Content-Type":"application/json",
              "Authorization":`Bearer ${localStorage.getItem("clgToken")}`
          }
      });
      await calling();
      alert("Item approved suucessfully!");
       
      } catch (error) {
        console.log(error);
      }
    }


    const deleteItem=async()=>{
      try {
        const {data}=await axios.get(`/api/private/deleteitem/${id}`,{
          headers:{
              "Content-Type":"application/json",
              "Authorization":`Bearer ${localStorage.getItem("clgToken")}`
          }
      });
      await calling();
        alert("Item deleted suucessfully!");
      } catch (error) {
        console.log(error);
      }
    }
    return (
      <Flex p={50} w="full" alignItems="center" justifyContent="center" style={{cursor:'pointer'}}>
        <Box
          bg={useColorModeValue('white', 'gray.800')}
          maxW="sm"
          borderWidth="1px"
          rounded="lg"
          shadow="lg"
          position="relative">
          {data.isNew && (
            <Circle
              size="10px"
              position="absolute"
              top={2}
              right={2}
              bg="red.200"
            />
          )}
  
          <Image
           onClick={onOpen}
            src={photo}
            alt={`Picture of ${title}`}
            roundedTop="lg"
            maxW="sm"
          minW="sm"
          minH="sm"
          maxH="sm"
          />
  
          <Box p="6">
            <Box d="flex" alignItems="baseline">
            </Box>
            <Flex mt="1" justifyContent="space-between" alignContent="center">
              <Box
                fontSize="2xl"
                fontWeight="semibold"
                as="h4"
                lineHeight="tight"
                isTruncated>
                {title}
              </Box>
              <Tooltip
                label="Approve"
                bg="white"
                placement={'top'}
                color={'green.800'}
                fontSize={'1.2em'}>
                <Button onClick={()=>{
                  approveItem();
                }} display={'flex'} >
                  <Icon as={CheckIcon} h={7} w={7} alignSelf={'center'} />
                </Button>    
                  
              </Tooltip>
                     <Tooltip
                label="Delete"
                bg="white"
                placement={'top'}
                color={'red.800'}
                fontSize={'1.2em'}>
                <Button onClick={()=>{
                  deleteItem();
                }} display={'flex'} >
                  <Icon as={DeleteIcon} h={7} w={7} alignSelf={'center'} />
                </Button>    
                  
              </Tooltip>
            </Flex>
  
            <Flex justifyContent="space-between" alignContent="center">
              <Box fontSize="2xl" color={useColorModeValue('gray.800', 'white')}>
                <Box as="span" color={'gray.600'} fontSize="lg">
                ₹ 
                </Box>
                {price}
              </Box>
            </Flex>
          </Box>
        </Box>
        <Modal onClose={onClose} isOpen={isOpen} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{title}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                {description}
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
    );
  }
  
  export default ProductAddToCart;