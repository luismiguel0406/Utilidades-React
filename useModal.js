import { useState } from "react";

function useModal() {
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);

  const handleClose = () => {
    setShow(false);
  };
  const handleToogle = () => setShow((show) => !show);

  return [show, handleShow, handleClose, handleToogle];
}

export default useModal;
