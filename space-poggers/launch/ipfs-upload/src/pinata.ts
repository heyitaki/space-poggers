require('dotenv').config();
const key = process.env.REACT_APP_PINATA_KEY;
const secret = process.env.REACT_APP_PINATA_SECRET;

const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const recursive = require('recursive-fs');
const basePathConverter = require('base-path-converter');

export const pinDirectoryToIPFS = (srcDir: string): Promise<any> => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

  //we gather the files from a local directory in this example, but a valid readStream is all that's needed for each file in the directory.
  return recursive.readdirr(srcDir, function (err: any, dirs: any, files: string[]) {
    let data = new FormData();
    files.forEach((file) => {
      //for each file stream, we need to include the correct relative file path
      data.append(`file`, fs.createReadStream(file), {
        filepath: basePathConverter(srcDir, file),
      });
    });

    return axios
      .post(url, data, {
        maxBodyLength: 'Infinity', //this is needed to prevent axios from erroring out with large directories
        headers: {
          'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
          pinata_api_key: key,
          pinata_secret_api_key: secret,
        },
      })
      .catch(function (error: any) {
        console.error('Error pinning dir to IPFS: ', srcDir);
        console.error(error);
      });
  });
};

export const pinFileToIPFS = (filepath: string) => {
  const api = 'https://api.pinata.cloud/pinning/pinFileToIPFS';

  //we gather a local file for this example, but any valid readStream source will work here.
  let data = new FormData();
  data.append('file', fs.createReadStream(filepath));

  return axios
    .post(api, data, {
      maxBodyLength: 'Infinity', //this is needed to prevent axios from erroring out with large files
      headers: {
        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
        pinata_api_key: key,
        pinata_secret_api_key: secret,
      },
    })
    .catch(function (error: any) {
      console.error('Error pinning file to IPFS: ', filepath);
      console.error(error);
    });
};
