import "./Toolbar.css";

import { CircleUserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "../button/Button";
import { Heading } from "../text/Heading";
import { Span } from "../text/Span";

type Props = {
  title: string;
  onShowProfile: () => void;
  onResumeWorkout: () => void;
  hasActiveWorkout?: boolean;
};
export const Toolbar = ({
  title,
  onShowProfile,
  onResumeWorkout,
  hasActiveWorkout = false,
}: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const actionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeMenuOnOutsideClick = (event: MouseEvent) => {
      if (!actionRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", closeMenuOnOutsideClick);

    return () => {
      document.removeEventListener("mousedown", closeMenuOnOutsideClick);
    };
  }, []);

  const showProfile = () => {
    setIsMenuOpen(false);
    onShowProfile();
  };

  const resumeWorkout = () => {
    setIsMenuOpen(false);
    onResumeWorkout();
  };

  return (
    <div className="toolbar">
      <div>
        <Span text="Strength training" size="small" />
        <Heading text={title} level="1" />
      </div>
      <div className="toolbar__action" ref={actionRef}>
        <Button
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
          icon={CircleUserRound}
          size="icon"
          variant="secondary"
          ariaLabel="Open account menu"
          ariaExpanded={isMenuOpen}
        />
        {hasActiveWorkout && (
          <span className="toolbar__active-indicator" aria-hidden="true" />
        )}
        {isMenuOpen && (
          <div className="toolbar__menu" role="menu">
            <button className="toolbar__menu-item" onClick={showProfile} role="menuitem">
              Profile
            </button>
            {hasActiveWorkout && (
              <button
                className="toolbar__menu-item"
                onClick={resumeWorkout}
                role="menuitem"
              >
                Resume workout
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
