import "./Dialog.scss";

import { type LucideIcon, X } from "lucide-react";
import { type ReactNode, useEffect, useRef } from "react";

import { Button } from "../button/Button";
import { Row } from "../row/Row";
import { Heading } from "../text/Heading";

type Props = {
  onClose: () => void;
  isOpen: boolean;
  title: string;
  children: ReactNode;
  closeIcon?: LucideIcon;
  closeAriaLabel?: string;
  actionLabel?: string;
  onAction?: () => void;
  destructiveAction?: {
    label: string;
    onClick: () => void;
    ariaLabel?: string;
  };
};
export const Dialog = ({
  onClose,
  children,
  title,
  isOpen,
  closeIcon = X,
  closeAriaLabel = "Close dialog",
  actionLabel = "Close",
  onAction,
  destructiveAction,
}: Props) => {
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
        <Row justify="between" className="dialog__toolbar">
          <Heading text={title} level="2" />
          <Button
            onClick={() => dialoRef.current?.close()}
            icon={closeIcon}
            size="icon"
            variant="secondary"
            ariaLabel={closeAriaLabel}
          />
        </Row>
        <div className="dialog__rendered-content ">{children}</div>
        <div className="dialog__actions">
          {destructiveAction && (
            <Button
              onClick={destructiveAction.onClick}
              label={destructiveAction.label}
              variant="danger"
              ariaLabel={destructiveAction.ariaLabel}
            />
          )}
          <Button
            onClick={onAction ?? (() => dialoRef.current?.close())}
            label={actionLabel}
            variant="secondary"
          />
        </div>
      </div>
    </dialog>
  );
};
