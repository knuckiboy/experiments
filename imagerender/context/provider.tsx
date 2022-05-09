import { createContext, useState } from "react";
import { FormatInput, FormatType } from "../model/Image.model";

export const GlobalContext = createContext<IContext>({}); // you can set a default value inside createContext if you want

type Props = {
  children: React.ReactNode;
};

interface IContext {
  fileInputState?:[File|undefined, React.Dispatch<React.SetStateAction<File|undefined>>],
  imageUrlState?:[string|undefined, React.Dispatch<React.SetStateAction<string|undefined>>],
  formatInputState?:[FormatInput|undefined, React.Dispatch<React.SetStateAction<FormatInput>>],
}

export default function ContextProvider({ children }: Props) {
  const [fileInput, setFileInput] = useState<File>();
  const [imageUrl, setImageUrl] = useState<string>();
  const [formatInput, setFormatInput] = useState<FormatInput>({
    format: FormatType.JPEG,
  });

  return (
    <GlobalContext.Provider
      value={{fileInputState: [fileInput, setFileInput],imageUrlState: [imageUrl, setImageUrl] , formatInputState: [formatInput, setFormatInput]  }}>
      {children}
    </GlobalContext.Provider>
  );
}