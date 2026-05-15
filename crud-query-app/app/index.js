import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CrudQueryApp from "../src/CrudQueryApp";

const queryClient = new QueryClient();

export default function HomeScreen() {
  return (
    <QueryClientProvider client={queryClient}>
      <CrudQueryApp />
    </QueryClientProvider>
  );
}
