// import Img from "../Assests/DALL·E 2023-06-22 08.54.27.png";
import { FaCode } from "react-icons/fa";
const Header = (props) => {
  return (
    <div className="app__navbar">
      <span className="leetmate">
        &nbsp;&nbsp;&nbsp;
        {/* <img src={Img} alt="logo" width="30" height="30" /> */}
        <FaCode />
        &nbsp; LEETMATE
      </span>
      <p className="problemCount">
        &nbsp;&nbsp;&nbsp; Problem Count: {props.numberOfProblems}
        &nbsp;&nbsp;&nbsp;
      </p>
    </div>
  );
};
export default Header;
