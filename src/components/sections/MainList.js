import React, { useEffect, useState } from "react";
import "../../App.css";
import {
  Container,
  Link,
  Table,
  TableCaption,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

import { API, Storage, graphqlOperation } from "aws-amplify";
import { filesByUsername, listUploadedFiles } from "../../graphql/queries";
import {
  createUploadedFile as createUploadedFileMutation,
  updateUploadedFile as updateUploadedFileMutation,
  deleteUploadedFile as deleteUploadedFileMutation,
} from "../../graphql/mutations";

import getDateTime from "../../utils/getDateTime";

const initialFormState = {
  resumeName: "",
  s3URL: "",
  customURL: "",
  username: "",
};

function MainList(props) {
  const [PDF, setPDF] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [selectedPDF, setSelectedPDF] = useState(0);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [uploadedPDF, setUploadedPDF] = useState();
  const [saveButtonIsDisabled, setSaveButtonIsDisabled] = useState(true);

  const [onEditMode, setOnEditMode] = useState(false);
  const [editButtonIsDisabled, setEditButtonIsDisabled] = useState(true);

  const [removeDialogIsOpen, setRemoveDialogIsOpen] = React.useState(false);
  const onRemoveDialogClose = () => setRemoveDialogIsOpen(false);
  const removeDialogCancelRef = React.useRef();
  const [removeButtonIsDisabled, setRemoveButtonIsDisabled] = useState(true);

  const toast = useToast();

  const [dateTime, setDateTime] = useState(getDateTime());

  useEffect(() => {
    fetchPDF();
  }, [props.username]);

  useEffect(() => {
    try {
      if (formData.customURL && formData.resumeName && uploadedPDF) {
        setSaveButtonIsDisabled(false);
      } else if (formData.customURL && formData.resumeName && onEditMode) {
        setSaveButtonIsDisabled(false);
      } else {
        setSaveButtonIsDisabled(true);
      }
    } catch (e) {
      console.error(e);
    }
  }, [formData.customURL, formData.resumeName, uploadedPDF]);

  useEffect(() => {
    if (selectedPDF) {
      setRemoveButtonIsDisabled(false);
      setEditButtonIsDisabled(false);
    } else {
      setRemoveButtonIsDisabled(true);
      setEditButtonIsDisabled(true);
    }
  }, [selectedPDF]);

  function toastHelper(title, status, description) {
    toast({
      title: title,
      description: description,
      status: status,
      duration: 3000,
      isClosable: true,
    });
  }

  async function fetchPDF() {
    if (props.username) {
      API.graphql(
        graphqlOperation(filesByUsername, {
          username: props.username,
          sortDirection: "ASC",
        })
      ).then((response) => {
        const PDFFromAPI = response?.data?.filesByUsername?.items;
        Promise.all(
          PDFFromAPI.map(async (pdf) => {
            const s3URL = await Storage.get(pdf.s3URL);
            pdf.s3URL = s3URL;
            return pdf;
          })
        ).then((response) => {
          if (PDFFromAPI) {
            setPDF(PDFFromAPI);
          }
        });
      });
    }
  }

  async function createUploadedFile() {
    formData.username = props.username;
    formData.s3URL =
      props.username +
      "/" +
      uploadedPDF.name.replace(/\.[^/.]+$/, "") +
      dateTime +
      ".pdf";
    await API.graphql({
      query: createUploadedFileMutation,
      variables: { input: formData },
    });
    fetchPDF();
    setFormData(initialFormState);
  }

  async function updateUploadedFile() {
    formData.username = props.username;
    formData.id = selectedPDF;
    if (uploadedPDF) {
      formData.s3URL =
        props.username +
        "/" +
        uploadedPDF.name.replace(/\.[^/.]+$/, "") +
        dateTime +
        ".pdf";
    } else {
      formData.s3URL = undefined;
    }
    await API.graphql({
      query: updateUploadedFileMutation,
      variables: { input: formData },
    });
    fetchPDF();
    setFormData(initialFormState);
  }

  async function deletepdf() {
    const newPDFArray = PDF.filter((pdf) => pdf.id !== selectedPDF);
    setPDF(newPDFArray);
    await API.graphql({
      query: deleteUploadedFileMutation,
      variables: { input: { id: selectedPDF } },
    });
  }

  async function onChange(e) {
    if (!e.target.files[0]) return;
    const file = e.target.files[0];
    setUploadedPDF(file);
  }

  function openAddModal() {
    setOnEditMode(false);
    setFormData(initialFormState);
    setUploadedPDF();
    onOpen();
  }

  async function closeAddModal() {
    formData.customURL = formData.customURL.trim().toLowerCase();
    await setSaveButtonIsDisabled(true);
    await setDateTime(getDateTime());

    if (formData.customURL.length < 7) {
      toastHelper(
        "Custom link too short",
        "error",
        "Custom links must be 7+ characters"
      );
      await setSaveButtonIsDisabled(false);
      return;
    }

    let customURLAlreadyExists = false;
    let filter = {
      customURL: { eq: formData.customURL },
    };
    let fetched_data = await API.graphql(
      graphqlOperation(listUploadedFiles, { filter: filter })
    );
    try {
      let fetched_customURL = fetched_data.data.listUploadedFiles.items[0];
      if (fetched_customURL === undefined) {
        customURLAlreadyExists = false;
      } else {
        customURLAlreadyExists = true;
      }
    } catch (error) {
      customURLAlreadyExists = false;
    }

    if (customURLAlreadyExists) {
      toastHelper("Custom link taken", "error");
      await setSaveButtonIsDisabled(false);
      return;
    }

    if (uploadedPDF.type !== "application/pdf") {
      toastHelper("Invalid file type", "error", "Resumes must be a PDF");
      await setSaveButtonIsDisabled(false);
      return;
    }

    if (uploadedPDF.size > 250000) {
      toastHelper(
        "File too large",
        "error",
        "Resumes must be under 250KB in size"
      );
      await setSaveButtonIsDisabled(false);
      return;
    }

    await Storage.put(
      props.username +
        "/" +
        uploadedPDF.name.replace(/\.[^/.]+$/, "") +
        dateTime +
        ".pdf",
      uploadedPDF,
      {
        contentType: "application/pdf",
        contentDisposition: "inline",
      }
    );
    await createUploadedFile();
    onClose();
    toastHelper("Resume saved", "success");
    fetchPDF();
  }

  async function closeDeleteModal() {
    await deletepdf();
    await setSelectedPDF(0);
    onRemoveDialogClose();
  }

  async function openEditModal() {
    setOnEditMode(true);
    let chosenPDF = PDF.filter((pdf) => pdf.id === selectedPDF)[0];
    setFormData({
      resumeName: chosenPDF.resumeName,
      s3URL: chosenPDF.s3URL,
      customURL: chosenPDF.customURL,
      username: props.username,
    });
    setUploadedPDF();
    onOpen();
  }

  async function closeEditModal() {
    formData.customURL = formData.customURL.trim().toLowerCase();
    await setSaveButtonIsDisabled(true);
    await setDateTime(getDateTime());

    if (formData.customURL.length < 7) {
      toastHelper(
        "Custom link too short",
        "error",
        "Custom links must be 7+ characters"
      );
      await setSaveButtonIsDisabled(false);
      return;
    }

    let customURLAlreadyExists = false;
    let filter = {
      customURL: { eq: formData.customURL },
    };
    let fetched_data = await API.graphql(
      graphqlOperation(listUploadedFiles, { filter: filter })
    );
    try {
      let fetched_customURL = fetched_data.data.listUploadedFiles.items;
      let fetched_relevant_data = fetched_customURL.filter(
        (pdf) => pdf["id"] !== selectedPDF
      );
      if (fetched_relevant_data.length !== 0) {
        customURLAlreadyExists = true;
      }
    } catch (error) {
      customURLAlreadyExists = false;
    }

    if (customURLAlreadyExists) {
      toastHelper("Custom link taken", "error");
      await setSaveButtonIsDisabled(false);
      return;
    }
    if (uploadedPDF) {
      if (uploadedPDF.type !== "application/pdf") {
        toastHelper("Invalid file type", "error", "Resumes must be a PDF");
        await setSaveButtonIsDisabled(false);
        return;
      }
      if (uploadedPDF.size > 250000) {
        toastHelper(
          "File too large",
          "error",
          "Resumes must be under 250KB in size"
        );
        await setSaveButtonIsDisabled(false);
        return;
      }

      await Storage.put(
        props.username +
          "/" +
          uploadedPDF.name.replace(/\.[^/.]+$/, "") +
          dateTime +
          ".pdf",
        uploadedPDF,
        {
          contentType: "application/pdf",
          contentDisposition: "inline",
        }
      );
    }
    await updateUploadedFile();
    onClose();
    toastHelper("Resume saved", "success");
    fetchPDF();
  }

  return (
    <Container textAlign="left" mb={8} pl={8} pr={8} maxW="7xl">
      <Button ml="2" onClick={openAddModal} _hover={{ bg: "brand.light" }}>
        Add
      </Button>
      <Button
        ml="2"
        onClick={() => setRemoveDialogIsOpen(true)}
        _hover={{ bg: "brand.light" }}
        isDisabled={removeButtonIsDisabled}
      >
        Delete
      </Button>
      <Button
        ml="2"
        onClick={openEditModal}
        _hover={{ bg: "brand.light" }}
        isDisabled={editButtonIsDisabled}
      >
        Edit
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {onEditMode ? "Edit resume" : "Add a new resume"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Resume name</FormLabel>
              <Input
                placeholder="John Smith Software Dev Resume"
                value={formData.resumeName}
                onChange={(e) =>
                  setFormData({ ...formData, resumeName: e.target.value })
                }
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Custom link - resuman.work/[custom_link]</FormLabel>
              <Input
                placeholder="johnsmith_dev_resume"
                value={formData.customURL}
                onChange={(e) =>
                  setFormData({ ...formData, customURL: e.target.value })
                }
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>
                Upload a file
                {onEditMode ? " (leave empty to use previous resume)" : ""}
              </FormLabel>
              <Input type="file" onChange={onChange} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              onClick={onEditMode ? closeEditModal : closeAddModal}
              isDisabled={saveButtonIsDisabled}
              bg="brand.light"
              mr={3}
            >
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AlertDialog
        isOpen={removeDialogIsOpen}
        leastDestructiveRef={removeDialogCancelRef}
        onClose={onRemoveDialogClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete resume
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={removeDialogCancelRef} onClick={onRemoveDialogClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={closeDeleteModal} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <Table variant="simple" mb="30">
        <Thead>
          <Tr>
            <Th>NAME</Th>
            <Th>CUSTOM LINK</Th>
            <Th>FILE</Th>
          </Tr>
        </Thead>
        <Tbody>
          {PDF.map((pdf) => (
            <Tr
              key={pdf.id || pdf.s3URL}
              className={
                pdf.id === selectedPDF
                  ? "mainlistitem-active"
                  : "mainlistitem-inactive"
              }
              onClick={() => setSelectedPDF(pdf.id)}
            >
              <Td>{pdf.resumeName}</Td>
              <Td>resuman.work/{pdf.customURL}</Td>
              <Td>
                <Link href={"/" + pdf.customURL} isExternal>
                  View <ExternalLinkIcon mx="2px" />
                </Link>
              </Td>
            </Tr>
          ))}
        </Tbody>
        <TableCaption>Copyright George Shao 2021</TableCaption>
      </Table>
    </Container>
  );
}

export default MainList;
