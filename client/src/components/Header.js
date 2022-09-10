import React, { useEffect, useState } from "react";
import { Flex, Avatar, AvatarBadge, Text } from "@chakra-ui/react";
import axios from "axios";

const Header = ({otherUser}) => {
  const [username,setUsername]=useState("");
  useEffect(()=>{
    axios.get('/api/private/getdetails',{
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("clgToken")}`
      }
    }).then(({data})=>setUsername(otherUser.username)).catch((err)=>console.log(err));
  },[])
  return (
    <Flex w="100%">
      {/* <Avatar size="lg" name="Dan Abrahmov" src="https://bit.ly/dan-abramov">
        <AvatarBadge boxSize="1.25em" bg="green.500" />
      </Avatar> */}
      <Flex flexDirection="column" mx="5" justify="center">
        <Text fontSize="lg" fontWeight="bold">
          {otherUser.username}
        </Text>
        {/* <Text color="green.500">Online</Text> */}
      </Flex>
    </Flex>
  );
};

export default Header;
