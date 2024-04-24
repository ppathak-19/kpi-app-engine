import {
  type CreateDocumentBody,
  documentsClient,
} from "@dynatrace-sdk/client-document";

type CreateAppDocumentType = {
  data: Blob | Buffer | File | string;
  name: string;
  type: string;
};

export const createAppDocument = ({
  data,
  name,
  type,
}: CreateAppDocumentType) => {
  const document: CreateDocumentBody = {
    name,
    type,
    content: new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    }),
  };

  documentsClient
    .createDocument({ body: document })
    .then((response) => console.log(JSON.stringify(response)));
};

export const getAppDocumentByName = async (name: string) => {
  const myDocs = await documentsClient.listDocuments({
    filter: "name = '" + name + "'",
  });

  console.log({ myDocs });
  return myDocs.documents[0];
};

export const getAppDocumentData = async (id: string) => {
  const documentContent = await documentsClient.downloadDocumentContent({
    id,
  });
  const data = await documentContent.get("text");
  return data;
};
