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
import { BsStar, BsStarFill, BsStarHalf, BsFillHeartFill } from 'react-icons/bs';
import { FiShoppingCart } from 'react-icons/fi';
import { BsChatTextFill } from 'react-icons/bs';
import { MdBookmarkAdd, MdBookmarkRemove } from 'react-icons/md';
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



function ProductAddToCart({ getData, wishlist, itemId, photo, title, description, price, owner, userId }) {

  const { isOpen, onOpen, onClose } = useDisclosure()
  console.log(wishlist);
  const navigate = useNavigate();
  const startChat = async () => {
    try {
      const { data } = await axios.post('/api/chat/create', { user1: userId, user2: owner }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("clgToken")}`
        }
      });
      console.log(data);
      navigate(`chat/${data}/${userId}/${owner._id}`, { state: { roomId: data } });
    } catch (error) {
      console.log(error);
    }
  }

  const addToCart = async (itemId) => {
    try {
      await axios.patch('/api/private/addtowishlist', { itemId }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("clgToken")}`
        }
      });
      alert("Item added to wishlist");
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Flex p={50} w="full" alignItems="center" justifyContent="center" style={{ cursor: 'pointer' }}>
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
              label="Chat with the owner"
              bg="white"
              placement={'top'}
              color={'gray.800'}
              fontSize={'1.2em'}>
              <Button onClick={() => {
                startChat();
              }} display={'flex'} >
                <Icon as={BsChatTextFill} h={7} w={7} alignSelf={'center'} />
              </Button>

              {/* <Icon as={BsChatTextFill} h={7} w={7} alignSelf={'center'} /> */}
            </Tooltip>
            <Tooltip
              label="Wishlist"
              bg="white"
              placement={'top'}
              color={'gray.800'}
              fontSize={'1.2em'}>
              <Button onClick={async () => {
                await addToCart(itemId);
                await getData();
              }} display={'flex'} >
                <Icon as={wishlist.includes(itemId) ? MdBookmarkRemove : MdBookmarkAdd} h={7} w={7} alignSelf={'center'} />
              </Button>

              {/* <Icon as={BsChatTextFill} h={7} w={7} alignSelf={'center'} /> */}
            </Tooltip>

          </Flex>

          <Flex justifyContent="space-between" alignContent="center">
            <Box fontSize="2xl" color={useColorModeValue('gray.800', 'white')}>
              <Box as="span" color={'gray.600'} fontSize="lg">
                ₹
              </Box>
              {price}
            </Box>
            <Box
              fontSize="xl"
              fontWeight="semibold"
              as="h4"
              lineHeight="tight"
              isTruncated>
              Owner: {owner.username.split(' ')[0]}
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