import { Fragment } from "react";

const AboveMessage = (props) => {
  return (
    <Fragment>
      {props.userData.length > 0 && (
        <div className="app__above_message">
          <b> Provided below are the links problems solved by other users :</b>
        </div>
      )}
    </Fragment>
  );
};
export default AboveMessage;
