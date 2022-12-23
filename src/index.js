/* eslint-disable no-underscore-dangle */
import axios from 'axios';
import probeImageSize from 'probe-image-size';

const AUTH_URL = 'https://api.videomatik.com.br';

// TODO this will be migrated to JSON object instead of
// string in the future so this method can be removed
const _parseVideoRequestJSONFields = (videoRequest) => ({
  ...videoRequest,
  customJSON: (
    typeof videoRequest.customJSON === 'string'
      ? JSON.parse(videoRequest.customJSON)
      : videoRequest.customJSON
  ),
});

export default class VideomatikAPI {
  constructor({
    apiKey,
    host = AUTH_URL,
  }) {
    this.host = host;
    this.apiKey = apiKey;
    this.currentAccessToken = null;

    this.axios = axios.create({
      baseURL: this.host,
      headers: {
        'Content-Type': 'application/json',
        authorization: apiKey,
      },
    });
  }

  async _getRequestData(options) {
    const response = await this.axios(options);
    return response.data;
  }

  //
  // API Access Methods
  //

  /**
   *
   * @param String templateId Id of the Template.
   *  Can be obtained from the URL of the create video page.
   * @param Object options
   * @param boolean options.getImageSizes Default is false.
   *  Get image sizes from images in the custom JSON.
   */
  async getTemplateCustomJSON(templateId, options = { getImageSizes: false }) {
    const customJSON = await this._getRequestData({
      url: `/v1/templates/${templateId}/custom-json`,
    });

    const { getImageSizes } = options;
    const { images } = customJSON;
    if (getImageSizes && Array.isArray(images)) {
      const imageFetchSizesPromises = images.map(async (image) => {
        const { source } = image;
        if (!source) {
          return image;
        }

        const result = await probeImageSize(source);

        return {
          ...image,
          width: result.width,
          height: result.height,
        };
      });

      const imagesWithSizes = await Promise.all(imageFetchSizesPromises);

      customJSON.images = imagesWithSizes;
    }

    return customJSON;
  }

  async getTemplateCompositions(templateId) {
    return this._getRequestData({
      url: `/v1/templates/${templateId}/compositions`,
    });
  }

  async listVideoRequests(paginationOptions) {
    const { limit, offset } = paginationOptions || {};
    const videoRequests = await this._getRequestData({
      url: '/v1/video-requests',
      params: {
        limit,
        offset,
      },
    });

    return videoRequests.map(_parseVideoRequestJSONFields);
  }

  async getOneVideoRequest(id) {
    const videoRequest = await this._getRequestData({
      url: `/v1/video-requests/${id}`,
    });

    return _parseVideoRequestJSONFields(videoRequest);
  }

  async deleteVideoRequest(id) {
    return this._getRequestData({
      url: `/v1/video-requests/${id}`,
      method: 'DELETE',
    });
  }

  async requestNewVideo(videoRequestBody) {
    console.warn('@videomatik/api - WARNING: requestNewVideo method is deprecated, use createVideoRequest instead.');
    return this.createVideoRequest(videoRequestBody);
  }

  async createVideoRequest(videoRequestBody) {
    const videoRequest = await this._getRequestData({
      url: '/v1/video-requests',
      method: 'POST',
      data: videoRequestBody,
    });

    return _parseVideoRequestJSONFields(videoRequest);
  }
}
