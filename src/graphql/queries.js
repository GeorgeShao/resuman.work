/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUploadedFile = /* GraphQL */ `
  query GetUploadedFile($id: ID!) {
    getUploadedFile(id: $id) {
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
export const listUploadedFiles = /* GraphQL */ `
  query ListUploadedFiles(
    $filter: ModelUploadedFileFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUploadedFiles(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        username
        resumeName
        s3URL
        customURL
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const filesByUsername = /* GraphQL */ `
  query FilesByUsername(
    $username: String
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelUploadedFileFilterInput
    $limit: Int
    $nextToken: String
  ) {
    filesByUsername(
      username: $username
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        username
        resumeName
        s3URL
        customURL
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
