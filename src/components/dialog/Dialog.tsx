import "./Dialog.css";

import { type ReactNode, useEffect, useRef } from "react";

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
    if (isOpen && !showing.current) {
      showing.current = true;
      dialoRef.current?.showModal();
    } else if (!isOpen && showing.current) {
      showing.current = false;
      dialoRef.current?.close();
    }
  }, [isOpen]);

  // Fires for every way the native dialog can close — the X/Close buttons
  // below, the Escape key, or the programmatic close() above — so
  // `showing` and `onClose` stay correct regardless of which one happened.
  useEffect(() => {
    const dialogEl = dialoRef.current;
    if (!dialogEl) {
      return;
    }

    const handleClose = () => {
      if (showing.current) {
        showing.current = false;
        onClose();
      }
    };

    dialogEl.addEventListener("close", handleClose);
    return () => dialogEl.removeEventListener("close", handleClose);
  }, [onClose]);

  return (
    <dialog className="dialog" id="modal" ref={dialoRef}>
      <div className="dialog__content">
        <div className="dialog__toolbar">
          <Heading text={title} level="1" />
          <Button onClick={() => dialoRef.current?.close()} label="X" />
        </div>
        <div className="dialog__rendered-content ">{children}</div>
        <Button onClick={() => dialoRef.current?.close()} label="Close" />
      </div>
    </dialog>
  );
};
