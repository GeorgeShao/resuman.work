import React, { useEffect, useState } from 'react'
import { Container, Link, Table, TableCaption, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react"
import { ExternalLinkIcon } from "@chakra-ui/icons"

import { API, Storage, graphqlOperation } from 'aws-amplify';
import { filesByUsername } from '../../graphql/queries';
import { createUploadedFile as createUploadedFileMutation, deleteUploadedFile as deleteUploadedFileMutation } from '../../graphql/mutations';

const initialFormState = { s3URL: '', customURL: '', username: '' }

function MainList(props) {
  const [PDF, setPDF] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchPDF();
  }, [props.username]);

  async function fetchPDF() {
    if (props.username){
      API.graphql(graphqlOperation(filesByUsername, {
          username: props.username,
          sortDirection: 'ASC'
        }))
        .then((response) => {
          const PDFFromAPI = response?.data?.filesByUsername?.items;
          Promise.all(PDFFromAPI.map(async pdf => {
            const s3URL = await Storage.get(pdf.s3URL);
            pdf.s3URL = s3URL;
            return pdf;
          })).then((response => {
            if (PDFFromAPI) {
              setPDF(PDFFromAPI);
            }
          }))
        })
    }
  }

  async function createUploadedFile() {
    if (!formData.s3URL || !formData.customURL) return;
    formData.username = props.username
    await API.graphql({ query: createUploadedFileMutation, variables: { input: formData } });
    const s3URL = await Storage.get(formData.s3URL);
    formData.s3URL = s3URL;
    setPDF([ ...PDF, formData ]);
    setFormData(initialFormState);
  }

  async function deletepdf({ id }) {
    const newPDFArray = PDF.filter(pdf => pdf.id !== id);
    setPDF(newPDFArray);
    await API.graphql({ query: deleteUploadedFileMutation, variables: { input: { id } }});
  }

  async function onChange(e) {
    if (!e.target.files[0]) return
    const file = e.target.files[0];
    setFormData({ ...formData, s3URL: props.username + "/" + file.name });
    await Storage.put(props.username + "/" + file.name, file);
    fetchPDF();
  }

  return (
    <Container textAlign="left" mb={8} pl={8} pr={8} maxW="7xl">
      {/* <input
        onChange={e => setFormData({ ...formData, 's3URL': e.target.value})}
        placeholder="s3URL"
        value={formData.s3URL}
      /> */}
      <input
        onChange={e => setFormData({ ...formData, 'customURL': e.target.value})}
        placeholder="customURL"
        value={formData.customURL}
      />
      <input
        type="file"
        onChange={onChange}
      />
      <button onClick={createUploadedFile}>Create pdf</button>
      <Table variant="simple" mb="30">
        <Thead>
          <Tr>
            <Th>s3URL</Th>
            <Th>customURL</Th>
            <Th>link</Th>
          </Tr>
        </Thead>
        <Tbody>
          {
            PDF.map(pdf => (
              <Tr key={pdf.id || pdf.s3URL} _hover={{bg: "brand.light"}}>
                <Td>test123</Td>
                <Td>{pdf.customURL}</Td>
                <Td>
                <Link href={pdf.s3URL} isExternal>
                  View <ExternalLinkIcon mx="2px" />
                </Link>
                </Td>
              </Tr>
            ))
          }
        </Tbody>
        <TableCaption>Copyright George Shao 2021</TableCaption>
      </Table>
    </Container>
  )
}

export default MainList
