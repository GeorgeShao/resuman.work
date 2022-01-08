/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUploadedFile = /* GraphQL */ `
  query GetUploadedFile($id: ID!) {
    getUploadedFile(id: $id) {
      id
      s3URL
      customURL
      description
      createdAt
      updatedAt
    }
  }
`;
export const listUploadedFiles = /* GraphQL */ `
  query ListUploadedFiles(
    $filter: ModelUploadedFileFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUploadedFiles(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        s3URL
        customURL
        description
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
