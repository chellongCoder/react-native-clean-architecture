import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useState,
} from 'react';
import FeedbackPopup from 'src/core/components/popup/FeedbackPopup';
import ReceivedDiamondPopup from 'src/core/components/popup/ReceivedDiamondPopup';

// Define the context type
type PopupModalContextType = {
  show: () => void;
  hide: () => void;
  isShown: boolean;
};

// Create the context
export const PopupModalContext = createContext<PopupModalContextType>({
  show: () => {},
  hide: () => {},
  isShown: false,
});

// Define the provider component
export const PopupModalGlobalProvider = ({children}: PropsWithChildren) => {
  const [isShown, setIsShown] = useState(true);

  const show = useCallback(() => {
    setIsShown(true);
  }, []);

  const hide = useCallback(() => {
    setIsShown(false);
  }, []);

  return (
    <PopupModalContext.Provider value={{show, hide, isShown}}>
      {children}
      <ReceivedDiamondPopup isVisible={false} onClose={hide} />
      <FeedbackPopup
        isVisible={isShown}
        onClose={hide}
        onSubmitFeedback={() => {
          /* handle feedback submission */
          hide()
        }}
      />
      {/* Optionally, you can include the modal component here if it should be global */}
    </PopupModalContext.Provider>
  );
};
