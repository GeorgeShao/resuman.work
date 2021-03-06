/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUploadedFile = /* GraphQL */ `
  mutation CreateUploadedFile(
    $input: CreateUploadedFileInput!
    $condition: ModelUploadedFileConditionInput
  ) {
    createUploadedFile(input: $input, condition: $condition) {
      id
      username
      resumeName
      s3URL
      customURL
      createdAt
      updatedAt
    }
  }
`;
export const updateUploadedFile = /* GraphQL */ `
  mutation UpdateUploadedFile(
    $input: UpdateUploadedFileInput!
    $condition: ModelUploadedFileConditionInput
  ) {
    updateUploadedFile(input: $input, condition: $condition) {
      id
      username
      resumeName
      s3URL
      customURL
      createdAt
      updatedAt
    }
  }
`;
export const deleteUploadedFile = /* GraphQL */ `
  mutation DeleteUploadedFile(
    $input: DeleteUploadedFileInput!
    $condition: ModelUploadedFileConditionInput
  ) {
    deleteUploadedFile(input: $input, condition: $condition) {
      id
      username
      resumeName
      s3URL
      customURL
      createdAt
      updatedAt
    }
  }
`;
