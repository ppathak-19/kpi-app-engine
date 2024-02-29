import { Flex, Modal } from "@dynatrace/strato-components-preview";
import React from "react";

type KPIModalCommponentProps = {
  open: boolean;
  children?: React.ReactNode;
  onClose: () => void;
  modalTitle: string;
  footer?: React.ReactNode;
};

const KPIModal: React.FC<KPIModalCommponentProps> = (props) => {
  const { open, onClose, children, modalTitle, footer } = props;
  return (
    <Flex gap={4}>
      <Modal title={modalTitle} show={open} onDismiss={onClose} footer={footer}>
        {children}
      </Modal>
    </Flex>
  );
};

export default KPIModal;
