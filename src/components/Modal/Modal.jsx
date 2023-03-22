import React from "react";
import Modal from "react-bootstrap/Modal";

import "./modal.css";

export const BaseModal = (props) => {
  const { children } = props;
  return (
    <>
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        {children}
      </Modal>
    </>
  );
};
