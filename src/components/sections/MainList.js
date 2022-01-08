import React, { useEffect, useState } from 'react'
import { Link, Table, TableCaption, Thead, Tbody, Tfoot, Tr, Th, Td } from "@chakra-ui/react"
import { ExternalLinkIcon } from "@chakra-ui/icons"

import { API, Storage } from 'aws-amplify';
import { listUploadedFiles } from '../../graphql/queries';
import { createUploadedFile as createUploadedFileMutation, deleteUploadedFile as deleteUploadedFileMutation } from '../../graphql/mutations';

const initialFormState = { s3URL: '', customURL: '' }

function MainList() {
  const [PDF, setPDF] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchPDF();
  }, []);

  async function fetchPDF() {
    const apiData = await API.graphql({ query: listUploadedFiles });
    const PDFFromAPI = apiData.data.listUploadedFiles.items;
    await Promise.all(PDFFromAPI.map(async pdf => {
      if (pdf.s3URL) {
        const s3URL = await Storage.get(pdf.s3URL);
        pdf.s3URL = s3URL;
      }
      return pdf;
    }))
    setPDF(apiData.data.listUploadedFiles.items);
  }

  async function createUploadedFile() {
    console.log("beginning")
    if (!formData.s3URL || !formData.customURL) return;
    console.log("initiated", formData)
    await API.graphql({ query: createUploadedFileMutation, variables: { input: formData } });
    const s3URL = await Storage.get(formData.s3URL);
    formData.s3URL = s3URL;
    setPDF([ ...PDF, formData ]);
    setFormData(initialFormState);
    console.log("done")
  }

  async function deletepdf({ id }) {
    const newPDFArray = PDF.filter(pdf => pdf.id !== id);
    setPDF(newPDFArray);
    await API.graphql({ query: deleteUploadedFileMutation, variables: { input: { id } }});
  }

  async function onChange(e) {
    if (!e.target.files[0]) return
    const file = e.target.files[0];
    setFormData({ ...formData, s3URL: file.name });
    await Storage.put(file.name, file);
    fetchPDF();
  }

  return (
    <div>
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
        <TableCaption>Imperial to metric conversion factors</TableCaption>
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
      </Table>
    </div>
  )
}

export default MainList
