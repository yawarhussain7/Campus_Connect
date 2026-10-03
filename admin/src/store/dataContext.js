import { createContext, useContext } from "react";

/** Provided by DataProvider and consumed through useData. */
export const DataContext = createContext(null);

export function useData() {
  const context = useContext(DataContext);

  if (!context) {
    throw new Error("useData must be used inside a DataProvider");
  }

  return context;
}
