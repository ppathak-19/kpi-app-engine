import { Flex, Modal, Paragraph } from "@dynatrace/strato-components-preview";
import React from "react";

interface InfoModalProps {
  infoModalState: boolean;
  setInfoModalState: (val: boolean) => void;
}

export const InfoModal = ({
  infoModalState,
  setInfoModalState,
}: InfoModalProps) => {
  return (
    <Flex gap={4}>
      <Modal
        title="KPIs and timeframes"
        show={infoModalState}
        onDismiss={() => setInfoModalState(false)}
      >
        <Paragraph>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
          hendrerit sem rhoncus, cursus arcu quis, varius orci. Quisque at ipsum
          justo. Integer dui ante, tincidunt a vestibulum vel, convallis sed
          lacus. Morbi sagittis semper lectus, non fringilla mauris tincidunt
          id. Mauris id ante dolor. Mauris mollis augue in justo vehicula, eu
          maximus nibh congue. Cras iaculis at nisl scelerisque pretium. Class
          aptent taciti sociosqu ad litora torquent per conubia nostra, per
          inceptos himenaeos. Donec malesuada velit eleifend ante accumsan
          auctor. Quisque ullamcorper, orci at varius laoreet, tellus est
          tincidunt lorem, in ornare augue erat et turpis. Pellentesque in justo
          non ipsum dapibus laoreet quis sed turpis. Aliquam eget vestibulum
          tellus. Proin non odio at dui posuere volutpat eget vitae lacus. In ut
          lectus id nunc sollicitudin commodo.
        </Paragraph>
        <br />
        <Paragraph>
          Nunc pretium purus elit, ac semper leo posuere id. Aenean malesuada
          justo at mauris porttitor bibendum. Nunc et lectus facilisis, ornare
          metus nec, congue lectus. Nunc tristique felis nec pulvinar fermentum.
          Pellentesque eu nisl metus. Donec nec odio in lorem laoreet molestie
          eu quis neque. Curabitur vitae mauris eget leo varius fermentum.
          Integer consectetur ultrices nisl non tempor. Proin accumsan lacus non
          lacinia semper. Etiam ut nisl venenatis, aliquet lorem in, porta elit.
          Praesent sit amet mi justo. Nam scelerisque pellentesque sem, vitae
          ornare lorem varius vitae. Cras id sem at lectus cursus bibendum eu id
          elit. Pellentesque imperdiet massa vel scelerisque luctus. Sed
          porttitor ac turpis ac dapibus. Nulla sed eros eleifend velit semper
          hendrerit. Integer magna metus, auctor ut ligula sit amet, hendrerit
          molestie neque. Vestibulum ante ipsum primis in faucibus orci luctus
          et ultrices posuere cubilia curae;
        </Paragraph>
      </Modal>
    </Flex>
  );
};
