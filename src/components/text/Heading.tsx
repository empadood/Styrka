import "./Heading.css";
type Level = "1" | "2" | "3" | "4" | "5" | "6";
type Props = {
  level?: Level;
  text: string;
};

export const Heading = ({ text, level = "1" }: Props) => {
  const getLevel = (text: string) => {
    const levelMap = {
      "1": <h1 className="heading heading--1">{text}</h1>,
      "2": <h2 className="heading heading--2">{text}</h2>,
      "3": <h3 className="heading heading--3">{text}</h3>,
      "4": <h4 className="heading heading--4">{text}</h4>,
      "5": <h5 className="heading heading--5">{text}</h5>,
      "6": <h6 className="heading heading--6">{text}</h6>,
    };

    return levelMap[level];
  };

  return <>{getLevel(text)}</>;
};
