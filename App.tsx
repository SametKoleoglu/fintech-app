import { View, Text, StatusBar } from "react-native";
import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import RootNavigation from "./src/routes/RootNavigation";
import useCachedResources from "./hooks/useCachedResources";
import { useUserStore } from "./store/useUserStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const App = () => {
  const isLoadingComplete = useCachedResources();
  const queryClient = new QueryClient();

  const { session, user } = useUserStore();

  useEffect(() => {}, [user, session]);

  if (!isLoadingComplete) {
    return null;
  }

  return (
    <Container>
      
      <QueryClientProvider client={queryClient}>
        <RootNavigation />
      </QueryClientProvider>
    </Container>
  );
};

export default App;

const Container = styled(View)`
  flex: 1;
`;
