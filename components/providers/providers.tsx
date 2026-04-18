"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { IconContext } from "@phosphor-icons/react";
import NextTopLoader from "nextjs-toploader";
import { type ReactNode } from "react";
import { getQueryClient } from "@/lib/query-client";

export function Providers({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <IconContext.Provider value={{ weight: "duotone" }}>
        <NextTopLoader color="var(--primary)" height={2} showSpinner={false} />
        {children}
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      </IconContext.Provider>
    </QueryClientProvider>
  );
}
