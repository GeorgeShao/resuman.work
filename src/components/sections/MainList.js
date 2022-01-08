import React, { useEffect, useState } from 'react'
import { API, Storage } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
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
      <div style={{marginBottom: 30}}>
        {
          PDF.map(pdf => (
            <div key={pdf.id || pdf.s3URL}>
              <h2>{pdf.s3URL}</h2>
              <p>{pdf.customURL}</p>
              <button onClick={() => deletepdf(pdf)}>Delete pdf</button>
              {
                pdf.s3URL && <img src={pdf.s3URL} style={{width: 400}} />
              }
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default MainList
