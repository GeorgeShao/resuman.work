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
import { filesByUsername } from "../../graphql/queries";
import {
  createUploadedFile as createUploadedFileMutation,
  deleteUploadedFile as deleteUploadedFileMutation,
} from "../../graphql/mutations";

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

  const [removeDialogIsOpen, setRemoveDialogIsOpen] = React.useState(false)
  const onRemoveDialogClose = () => setRemoveDialogIsOpen(false)
  const removeDialogCancelRef = React.useRef()
  const [removeButtonIsDisabled, setRemoveButtonIsDisabled] = useState(true);

  const toast = useToast();

  useEffect(() => {
    fetchPDF();
  }, [props.username]);

  useEffect(() => {
    try {
      if (formData.customURL && formData.resumeName && uploadedPDF) {
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
    } else {
      setRemoveButtonIsDisabled(true);
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
    if (!formData.customURL || !formData.resumeName || !uploadedPDF) return;
    formData.username = props.username;
    formData.s3URL = props.username + "/" + uploadedPDF.name;
    await API.graphql({
      query: createUploadedFileMutation,
      variables: { input: formData },
    });
    const s3URL = await Storage.get(formData.s3URL);
    formData.s3URL = s3URL;
    setPDF([...PDF, formData]);
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
    setFormData(initialFormState);
    setUploadedPDF();
    onOpen();
  }

  async function closeAddModal() {
    if (formData.customURL && formData.resumeName && uploadedPDF) {
      await setSaveButtonIsDisabled(true);
      await Storage.put(props.username + "/" + uploadedPDF.name, uploadedPDF);
      await createUploadedFile();
      onClose();
      toastHelper("Resume saved", "success");
      fetchPDF();
    } else {
      toastHelper("Resume not saved", "error", "Empty fields present");
    }
  }

  async function closeDeleteModal() {
    await deletepdf();
    await setSelectedPDF(0);
    onRemoveDialogClose();
  }

  return (
    <Container textAlign="left" mb={8} pl={8} pr={8} maxW="7xl">

      <Button ml="2" onClick={openAddModal} _hover={{ bg: "brand.light" }}>
        Add
      </Button>
      <Button ml="2" onClick={() => setRemoveDialogIsOpen(true)} _hover={{ bg: "brand.light" }} isDisabled={removeButtonIsDisabled}>
        Delete
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add a new resume</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Resume name</FormLabel>
              <Input
                placeholder="John Smith Software Dev Resume"
                onChange={(e) =>
                  setFormData({ ...formData, resumeName: e.target.value })
                }
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>
                Custom link - resuman.work/[your_custom_link_here]
              </FormLabel>
              <Input
                placeholder="johnsmith_software_resume"
                onChange={(e) =>
                  setFormData({ ...formData, customURL: e.target.value })
                }
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Upload a file</FormLabel>
              <Input type="file" onChange={onChange} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              onClick={closeAddModal}
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
              <Td>{pdf.customURL}</Td>
              <Td>
                <Link href={pdf.s3URL} isExternal>
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
