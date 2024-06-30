export interface ApiFetcherParams {
  body?: any;
  url?: string;
  headers?: { [key: string]: any };
  method?: "post" | "get";
  module?: string;
}

type Newable = new (...args: any[]) => any;
export type ApiFetcher = <T = any>(
  params: ApiFetcherParams,
  model?: Newable,
) => Promise<T>;

const fetcher: ApiFetcher = async (params) => {
  function decrypter(obj?: { [key: string]: any }) {
    function _decrypter(datas: any) {
      if (!datas) {
        // ne rien faire
      } else if (Array.isArray(datas)) {
        for (let i = 0; i < datas.length; i++) {
          datas[i] = _decrypter(datas[i]);
        }
      } else if (Object.prototype.toString.call(datas) === "[object Object]") {
        if ("_RSA_ENCODED_" in datas) {
          datas = Forge.decrypter(datas._RSA_ENCODED_);
        } else {
          for (const key in datas) {
            datas[key] = _decrypter(datas[key]);
          }
        }
      }

      return datas;
    }

    return _decrypter(obj);
  }

  function encrypter(obj?: { [key: string]: any }) {
    const _encrypter = (datas: any) => {
      if (!datas) {
        // ne rien faire
      } else if (Array.isArray(datas)) {
        for (let i = 0; i < datas.length; i++) {
          datas[i] = _encrypter(datas[i]);
        }
      } else if (Object.prototype.toString.call(datas) === "[object Object]") {
        if ("_RSA_ENCODED_" in datas) {
          if (Store.session.session.apiPublicKey) {
            datas._RSA_ENCODED_ = Forge.encrypter(datas._RSA_ENCODED_, "api");
          } else {
            datas._RSA_ENCODED_ = null;
          }
        } else {
          for (const key in datas) {
            datas[key] = _encrypter(datas[key]);
          }
        }
      }

      return datas;
    };

    return _encrypter(obj);
  }

  async function fileConvert(obj?: { [key: string]: any }) {
    function getBase64(file: File) {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
          resolve(reader.result as string);
        };
        reader.onerror = function (error) {
          reject(error);
        };
      });
    }

    async function _converter(datas: any) {
      if (!datas) {
        // ne rien faire
      } else if (Array.isArray(datas)) {
        for (let i = 0; i < datas.length; i++) {
          datas[i] = await _converter(datas[i]);
        }
      } else if (datas instanceof File) {
        datas = {
          _FILE_: {
            base64: await getBase64(datas),
            originalname: datas.name,
            size: datas.size,
            mimetype: datas.type,
          },
        };
      } else if (Object.prototype.toString.call(datas) === "[object Object]") {
        for (const key in datas) {
          datas[key] = await _converter(datas[key]);
        }
      }

      return datas;
    }

    return await _converter(obj);
  }

  try {
    params.headers ||= {};
    params.body ||= {};

    if (Store.session.session.id) {
      params.headers.authorization = `Bearer ${Store.session.session.id}`;
    }

    params.body = encrypter(await fileConvert(params.body));

    const _params: { [key: string]: any } = {
      body: params.method === "post" ? params.body : undefined,
      method: params.method || "get",
      headers: params.headers,
      url: params.url || "/",
    };

    let response = await $fetch(_params.url, {
      baseURL: `${import.meta.env.VITE_API_URL}/api`,
      ..._params,
    });

    if (response) response = decrypter(response);

    return response;
  } catch (error: any) {
    if (error.data) {
      Utils.Toast.push({ text: error.data.message, color: "red" });
    }

    if (error.data.message === "session_is_lock") {
      useRouter().replace({ name: "unlock" });
    } else if (
      ["session_is_expired", "session_is_disconnected"].includes(
        error.data.message,
      )
    ) {
      useRouter().replace({ name: "login" });
    }

    throw error;
  }
};

export default { fetch: fetcher };
