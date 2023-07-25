"use client";

import { SessionProvider } from "next-auth/react";

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider } from '@chakra-ui/react'

export const NextAuthProvider = ({ children }) => {
  return (<SessionProvider>     <CacheProvider>
    <ChakraProvider>
  {children}
  </ChakraProvider>
  </CacheProvider>
  </SessionProvider>);
};
