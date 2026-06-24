import "./Heading.css";
type Level = "1" | "2" | "3" | "4" | "5" | "6";
type Props = {
  level?: Level;
  text: string;
};

export const Heading = ({ text, level = "1" }: Props) => {
  const getLevel = (text: string) => {
    const levelMap = {
      "1": <h1 className="heading">{text}</h1>,
      "2": <h2 className="heading">{text}</h2>,
      "3": <h3 className="heading">{text}</h3>,
      "4": <h4 className="heading">{text}</h4>,
      "5": <h5 className="heading">{text}</h5>,
      "6": <h6 className="heading">{text}</h6>,
    };

    return levelMap[level];
  };

  return <>{getLevel(text)}</>;
};
