import hamburgerIcon from "../assets/hamburger.png";
export const Hamburger = () => {
  return (
    <img
      color="white"
      src={hamburgerIcon}
      alt="hamburger-icon"
      width={24}
      height={24}
      style={{ filter: "invert(100%)", verticalAlign: "middle" }}
    ></img>
  );
};
