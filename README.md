# Videomatik API

This module provides easy access to Videomatik's API to request and manage video rendering.

# Installation

```bash
npm i --save @videomatik/api
```

# Usage

## Authentication

First, you should get your Videomatik API **Api Key** on your [Account Settings](https://videomatik.com.br/settings/), then
you can start using this project by instantiating the main class.

```javascript
import VideomatikAPI from '@videomatik/api';

const api = new VideomatikAPI({
  apiKey: '< your api key >',
});
```
You can also specify a different API endpoint via the `host` param on the constructor.
After that, you can start calling the API methods.

## Templates

Videomatik is based on templates that can be seen on the platform browsing all templates available to edit. If you have access to private templates they will be available through the API too.
Templates may also have multiple compositions, which are different resolutions of the video. The most commons compositions IDs are `'default'`, usually a Vertical video (1080x1920), and `'feed'`, which is a square video (1080x1080).

## Video Request Concept

You can request videos to be rendered on Videomatik via the API and this request contains the following attributes:
  - **templateId**: ID of the video Template which will be rendered.
  - **customJSON**: A JSON object with all the properties of the video that will be customized on the template. It should be corresponding to the Template. See more information on the `getTemplateCustomJSON` method.
  - **compositionId**: (Optional) ID of the composition of the Template which will be rendered. The default is 'default'.
  - **actions**: (Optional) Actions that should be performed after the video is created. See the Actions section below.

## Custom JSON Concept

The customJSON is an object associated with a video Template with all the attributes you can edit to customize a video using a template. When requesting a customJSON from a template or sending your customized JSON to request a Video, it should have the following attributes:

  - **images**: Array of objects with Images available to edit.
    - Images should contain a `source` attribute which should be a public URL with the image to replace in the video. It should be in JPG or PNG format.
  - **texts**: Array of objects with Texts available to edit.
    - Texts may contain attributes like the text itself, font family, font size, font-weight, color, and more.
  - **shapes**: Array of objects with Shapes available to edit.
    - Shapes have an attribute `color` which is the color of the shape.
  - **colors**: (Optional) Array of objects with Colors available to edit.
  - **toggles**: (Optional) Array of objects with Toggle features available to edit.

Some templates may be available only through the API and their Custom JSON may be different.

# Methods

All client methods are async and return a Promise.

## getTemplateCustomJSON(templateId)

This is the first method you should try. It will take a Template Id (you can get it from the URL when creating a new video on Videomatik) and should return the basic Custom JSON.

You can pass an `options` object with the option `getImageSizes` true to fetch the image sizes. For the best result, send the same image size to the API when replacing images.
You don't need to seed the `width` and `height` back to the API when calling for a new Video Request, these attributes are read-only.

```javascript
const customJSON = await videomatikApi.getTemplateCustomJSON('oferta-varejo-nujyuua', { getImageSizes: true });
console.log(customJSON);

// Return
{
  version: '1',
  images: [
    {
      path: 'assets[0]',
      source: 'https://storage.videomatik.com.br/videomatik-dev/templates/oferta-varejo-nujyuua/assets/oxdh6mre--compressed-png.png',
      width: 900,
      height: 193
    },
    {
      path: 'assets[1]',
      source: 'https://storage.videomatik.com.br/videomatik-dev/templates/oferta-varejo-nujyuua/assets/espykfb8--compressed-png.png',
      width: 500,
      height: 500
    }
  ],
  texts: [
    {
      path: 'assets[3].layers[0].t.d.k[0]',
      fontName: 'Arial-BoldMT',
      fontFamily: 'Arial',
      fontWeight: '700',
      fontStyle: 'Bold',
      fontAscent: 71.5988159179688,
      fontSize: 53,
      lineHeight: 63.6,
      justification: 'CENTER',
      value: 'ou 10x de R$ 99,99',
      fillColor: '#ffffff',
      time: 0,
      hidden: null
    },
    {
      path: 'assets[3].layers[1].t.d.k[0]',
      fontName: 'Arial-BoldMT',
      fontFamily: 'Arial',
      fontWeight: '700',
      fontStyle: 'Bold',
      fontAscent: 71.5988159179688,
      fontSize: 129,
      lineHeight: 154.8,
      justification: 'CENTER',
      value: 'R$ 999,90',
      fillColor: '#ffffff',
      time: 0,
      hidden: null
    },
    {
      path: 'assets[3].layers[3].t.d.k[0]',
      fontName: 'Arial-BoldMT',
      fontFamily: 'Arial',
      fontWeight: '700',
      fontStyle: 'Bold',
      fontAscent: 71.5988159179688,
      fontSize: 31,
      lineHeight: 39,
      justification: 'CENTER',
      value: 'DESCRIÇÃO DO PRODUTO\nDESCRIÇÃO DO PRODUTO\nDESCRIÇÃO DO PRODUTO',
      fillColor: '#000000',
      time: 0,
      hidden: null
    },
    {
      path: 'assets[3].layers[5].t.d.k[0]',
      fontName: 'Arial-BoldMT',
      fontFamily: 'Arial',
      fontWeight: '700',
      fontStyle: 'Bold',
      fontAscent: 71.5988159179688,
      fontSize: 88,
      lineHeight: 98,
      justification: 'CENTER',
      value: 'NOME\nPRODUTO',
      fillColor: '#000000',
      time: 0,
      hidden: null
    },
    {
      path: 'assets[4].layers[2].t.d.k[0]',
      fontName: 'Arial-BoldMT',
      fontFamily: 'Arial',
      fontWeight: '700',
      fontStyle: 'Bold',
      fontAscent: 71.5988159179688,
      fontSize: 134,
      lineHeight: 151,
      justification: 'CENTER',
      value: 'APROVEITE\nAS OFERTAS',
      fillColor: '#ffffff',
      time: 0,
      hidden: null
    }
  ],
  shapes: [
    { path: 'assets[2].layers[2].shapes[0].it[2]', color: '#aa1e0d' },
    { path: 'assets[3].layers[2].shapes[0].it[2]', color: '#aa1e0d' },
    { path: 'assets[3].layers[9].shapes[0].it[2]', color: '#aa1e0d' },
    { path: 'assets[3].layers[10].shapes[0].it[1]', color: '#ffffff' },
    { path: 'assets[3].layers[10].shapes[0].it[2]', color: '#ffffff' },
    { path: 'assets[4].layers[3].shapes[0].it[2]', color: '#aa1e0d' }
  ]
}
```

## getTemplateCompositions(templateId)

Some templates can be rendered in the Vertical or Square format. This method will return an Array of compositions available to render a Template like an example below:

```javascript
[
  { id: 'default', name: 'Vertical', width: 1080, height: 1920 },
  { id: 'feed', name: 'Quadrado', width: 1080, height: 1080 }
]
```

You can use the Composition ID to pass to a Video Request.

## createVideoRequest(videoRequestBody)

Requests a new video to be rendered based on a custom JSON

```javascript
const videoRequestBody = {
  templateId: "my-template-id",
  customJSON: {...},
  compositionId: 'feed' // to render the video in the square resolution
};

const videoRequest = await api.createVideoRequest(videoRequestBody);
// Response Example:
//
// {
//   "lastModified": "2020-01-24T18:08:13.654Z",
//   "userId": "XXXX",
//   "actions": [
//     ...,
//   ],
//   "templateId": "my-template-id",
//   "customJSON": {
//     ...
//   },
//   "renderJob": {
//     "state": "queued",
//     "downloadURL": null
//   },
//   "id": "xxxx"
// }
```

## getOneVideoRequest(id)

Retrieve the status of a already created videoRequest

```javascript
const videoRequest = await api.getOneVideoRequest('<your-video-request-id>');
// Example:
//
// {
//   "lastModified":"2020-01-24T18:08:13.654Z",
//   "userId":"XXXX",
//   "actions":[
//     ...,
//   ],
//   "templateId":"my-template-id",
//   "customJSON":{
//     ...
//   },
//   "renderJob":{
//     "state":"finished",
//     "downloadURL":"https://download-url.com/video.mp4"
//   },
//   "compositionId":"default"
//   "id":"IIIIIIIIIIIIII"
// }
```
### Video Request Status

  The list of possible Video Request Status:

  - **waiting**: The video request was created and is awaiting in queue to be rendered.
    - The downloadURL attribute will return null and it will only change when the video request is finished.
  - **rendering**: The video started rendering and soon will be available for download.
  - **finished**: The video finished rendering successfully and is ready for download.
    - The downloadURL attribute will return a string with the URL to download the video.
  - **error**: An error happened while rendering the video.

## listVideoRequests(paginationOptions)

Retrieve a list of all requested videos so far. `paginationOptions` is an object with two parameters `limit` and `offset` to paginate Video Requests. The maximum `limit` value is `50` and the default is `10`.

```javascript
const videoRequests = await api.listVideoRequests({ limit: 10, offset: 0 });
```

## deleteVideoRequest(id)

Remove a specific video request

```javascript
const { success } = await api.deleteVideoRequest('<your-video-request-id>');
// success === true -> deleted
// success === false -> not deleted
```

# Actions

Actions are called after the video is rendered.
You can set it as an Array of actions, each action is an object with the attribute `type`.

## Webhook

Set the action `type` to `'webhook'` and pass an `url` param with the URL to be called.
When the video is done, the endpoint will be called via a HTTP POST method and the body will be like:
```javascript
{
  "videoRequestId": "id of the request"
}
```

So you can fetch it to get the download URL of the rendered video.

```javascript
videomatikApi.createVideoRequest({
    templateId,
    customJSON,
    actions: [
      {
        type: 'webhook',
        url: 'http://localhost:3000/videoRequestCompleted',
      },
    ],
  });
};
```

## Youtube Upload

To be released in the future. Get in touch for more information.

# Change log

## 1.0.0

- Add `limit` and `offset` to `listVideoRequests` method. Now they are not returning all the video requests.
- Rename `requestNewVideo` method to `createVideoRequest` to a more standard api. The methods have the same attributes but you should see a warning in the console if use the old name.
- Video requests on API now don't return `customJSON` as a JSON Object, they are returned as String and are parsed on the client side.
- Change Template compositions attributes from `id` and `name` to `compositionId` and `displayName`.

### Breaking changes

- For the old API client version the `customJSON` object returned will be now a String because it will not be parsed by the client side. Update to this new version to prevent this behavior.
- If you refer to Template Composition `id` and `name` in your code, you should change it to `compositionId` and `displayName`.
