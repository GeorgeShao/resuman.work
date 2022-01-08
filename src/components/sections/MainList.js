import React, { useEffect, useState } from 'react'
import { API, Storage } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listUploadedFiles } from '../../graphql/queries';
import { createUploadedFile as createUploadedFileMutation, deleteUploadedFile as deleteUploadedFileMutation } from '../../graphql/mutations';

const initialFormState = { s3URL: '', customURL: '' }

function MainList() {
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    const apiData = await API.graphql({ query: listUploadedFiles });
    setNotes(apiData.data.listUploadedFiles.items);
  }

  async function createUploadedFile() {
    console.log("beginning")
    if (!formData.s3URL || !formData.customURL) return;
    console.log("initiated", formData)
    await API.graphql({ query: createUploadedFileMutation, variables: { input: formData } });
    setNotes([ ...notes, formData ]);
    setFormData(initialFormState);
    console.log("done")
  }

  async function deleteNote({ id }) {
    const newNotesArray = notes.filter(note => note.id !== id);
    setNotes(newNotesArray);
    await API.graphql({ query: deleteUploadedFileMutation, variables: { input: { id } }});
  }
  return (
    <div>
      <input
        onChange={e => setFormData({ ...formData, 's3URL': e.target.value})}
        placeholder="s3URL"
        value={formData.s3URL}
      />
      <input
        onChange={e => setFormData({ ...formData, 'customURL': e.target.value})}
        placeholder="customURL"
        value={formData.customURL}
      />
      <button onClick={createUploadedFile}>Create Note</button>
      <div style={{marginBottom: 30}}>
        {
          notes.map(note => (
            <div key={note.id || note.s3URL}>
              <h2>{note.s3URL}</h2>
              <p>{note.customURL}</p>
              <button onClick={() => deleteNote(note)}>Delete note</button>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default MainList
