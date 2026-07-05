import "./Dialog.css";

import { type ReactNode,useEffect, useRef } from "react";

import { Button } from "../button/Button";
import { Heading } from "../text/Heading";
type Props = {
  onClose: () => void;
  isOpen: boolean;
  title: string;
  children: ReactNode;
};
export const Dialog = ({ onClose, children, title, isOpen }: Props) => {
  const dialoRef = useRef<HTMLDialogElement>(null);
  const showing = useRef<boolean>(false);

  useEffect(() => {
    const shouldOpenModal = !showing.current && isOpen;
    console.log(!showing.current && !isOpen);
    if (shouldOpenModal) {
      showing.current = true;
      dialoRef.current?.showModal();
    }
  }, [isOpen]);

  const closeDialog = () => {
    showing.current = false;
    dialoRef.current?.close();
    onClose();
  };

  return (
    <dialog className="dialog" id="modal" ref={dialoRef}>
      <div className="dialog__content">
        <div className="dialog__toolbar">
          <Heading text={title} level="1" />
          <Button onClick={closeDialog} label="X" />
        </div>
        <div className="dialog__rendered-content ">{children}</div>
        <Button onClick={closeDialog} label="Close" />
      </div>
    </dialog>
  );
};
