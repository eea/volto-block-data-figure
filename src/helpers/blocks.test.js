import { setImageSize } from './blocks';

jest.mock('@eeacms/volto-block-data-figure/helpers', () => ({
  isInternalContentURL: jest.fn((url) => true),
}));

describe('setImageSize', () => {
  it('returns expected image scale URL when an image properties are passed', () => {
    const image = {
      '@id': 'http://localhost:3000/image',
      image: {
        download: 'http://localhost:3000/image/@@images/image.png',
        width: 400,
        height: 400,
        scales: {
          preview: {
            download: 'http://localhost:3000/image/@@images/image-400.png',
            width: 400,
            height: 400,
          },
        },
      },
    };
    const expectedUrlObj = {
      download: 'http://localhost:3000/image/@@images/image-400.png',
      width: 400,
      height: 400,
    };

    expect(setImageSize(image, image.image, 'm')).toEqual(expectedUrlObj);
  });
});
