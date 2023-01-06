
const Rijndael = require('rijndael-js');
//const bufferFrom = require('buffer-from')
global.Buffer = global.Buffer || require('buffer').Buffer

const Encrypt = (val, minLength) => {
    return val.length >= minLength;
    // if(val!="")
    // {
    //     return true
    // }
    // else
    // {
    //     return false
    // }
};


const CryptoHandler = (encryptStr) => {
    const cipher = new Rijndael('1234567890abcder', 'cbc');
    // `Rijndael.decrypt(ciphertext, blockSize[, iv]) -> <Array>`
    const plaintext = Buffer.from(cipher.decrypt(new Buffer(encryptStr, 'base64'), 128, '1234567890abcder'));
   // console.log("Decrypted", plaintext.toString());   
    return plaintext.toString()
};

export default CryptoHandler;