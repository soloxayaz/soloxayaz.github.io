import { createContext, useContext } from "react";

export const IntroContext = createContext({
  showIntro: false,
  ready: true,
  completeIntro: () => {},
});

export function useIntro() {
  return useContext(IntroContext);
}
