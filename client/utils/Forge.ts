import forge from "node-forge";

function encrypter(data: string, side: "client" | "api") {
  let key: string | undefined;
  if (side === "api") key = Store.session.session.apiPublicKey;
  else key = Store.session.session.keys?.public;

  if (!key) throw "crypto.needKey";

  const max_length = 86;

  if (typeof data === "string" && data.length > max_length) {
    const datas: string[] = [];

    for (let i = 0; i < data.length; i += max_length) {
      const dt = data.slice(i, i + max_length);
      const enc = encrypter(dt, side);
      datas.push(enc as string);
    }

    return datas;
  }

  const publicKeyObj = forge.pki.publicKeyFromPem(key);
  const encrypted = publicKeyObj.encrypt(data);
  return forge.util.encode64(encrypted);
}

function decrypter(data: string): string {
  const key = Store.session.session.keys?.private;
  if (!key) throw "crypto.needKey";

  if (Array.isArray(data)) {
    let datas = "";
    for (const dt of data) datas += decrypter(dt);
    return datas;
  }

  const privateKeyObj = forge.pki.privateKeyFromPem(key);
  const decrypted = privateKeyObj.decrypt(forge.util.decode64(data));

  return decrypted;
}

function generate() {
  const rsaKeyPair = forge.pki.rsa.generateKeyPair({ bits: 2048 });
  const publicKey = forge.pki.publicKeyToPem(rsaKeyPair.publicKey);
  const privateKey = forge.pki.privateKeyToPem(rsaKeyPair.privateKey);
  const keys = { public: publicKey, private: privateKey };

  return keys;
}

export default { encrypter, decrypter, generate };
