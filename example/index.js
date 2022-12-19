// eslint-disable-next-line import/no-unresolved
import VideomatikAPI from '@videomatik/api';

const VIDEOMATIK_API_KEY = '< your api key >';

const authenticateOnVideomatikAPI = () => new VideomatikAPI({
  apiKey: VIDEOMATIK_API_KEY,
});

const createVideoRequest = async (videomatikApi) => {
  const templateId = 'oferta-varejo-nujyuua';

  // Get a Template Custom JSON

  const customJSON = await videomatikApi.getTemplateCustomJSON(templateId, { getImageSizes: true });
  console.log(customJSON.images);

  // Edit the Custom JSON
  customJSON.texts[4].value = 'change text';

  // Send to API
  return videomatikApi.createVideoRequest({
    templateId,
    customJSON,
    compositionId: 'feed',
    actions: [
      {
        type: 'webhook',
        url: 'http://localhost:3000/videoRequestCompleted',
      },
    ],
  });
};

const getVideoRequestStatus = async (videomatikApi, videoRequestId) => {
  const videoRequest = await videomatikApi.getOneVideoRequest(videoRequestId);
  console.log(videoRequest);
};

const listTemplateCompositions = async (videomatikApi) => {
  const templateId = 'oferta-varejo-nujyuua';
  // const templateId = 'template-na-s3-mrfrjes';
  const compositions = await videomatikApi.getTemplateCompositions(templateId);
  console.log('Compositions:');
  console.log(compositions);
};

async function main() {
  // Authenticating
  const videomatikApi = authenticateOnVideomatikAPI();

  // List Template compositions
  await listTemplateCompositions(videomatikApi);

  // Listing requests
  // const videoRequests = await videomatikApi.listVideoRequests({ limit: 2, offset: 0 });

  // Creating new request
  const videoRequest = await createVideoRequest(videomatikApi);
  console.log(videoRequest);

  // Get request status
  const videoRequestId = videoRequest.id;
  await getVideoRequestStatus(videomatikApi, videoRequestId);
}

main();
