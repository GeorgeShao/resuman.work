import React, { useEffect } from "react";
import { useToast } from "@chakra-ui/react";

import { API, Storage, graphqlOperation } from "aws-amplify";
import "@aws-amplify/pubsub";
import { listUploadedFiles } from "../graphql/queries";

function RedirectPage(props) {
  const { shortlink } = props.match.params;
  const toast = useToast();

  useEffect(() => {
    const fetchTargetURL = async () => {
      console.log("shortlink:", shortlink);

      let filter = {
        customURL: { eq: shortlink.trim().toLowerCase() },
      };

      var fetched_data = await API.graphql(
        graphqlOperation(listUploadedFiles, { filter: filter })
      );
      try {
        const fetched_s3URL =
          fetched_data.data.listUploadedFiles.items[0]["s3URL"];
        const s3URL = await Storage.get(fetched_s3URL);
        window.location.href = s3URL;
        await toast({
          title: "Resume loaded successfully",
          description: `Loaded resume ${shortlink}`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        console.error(error);
        toast({
          title: "Resume not found",
          description: `Please ensure ${shortlink} is the correct link`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };
    fetchTargetURL();
  }, [shortlink, toast]);

  return (
    <p>
      Redirecting...<b>{shortlink}</b>...
    </p>
  );
}

export default RedirectPage;
