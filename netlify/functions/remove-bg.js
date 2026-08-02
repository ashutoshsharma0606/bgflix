```javascript
const axios = require("axios");
const FormData = require("form-data");

exports.handler = async (event) => {

  try {

    const { image } =
      JSON.parse(event.body);

    const form =
      new FormData();

    form.append(
      "image_file_b64",
      image
    );

    form.append(
      "size",
      "auto"
    );

    const response =
      await axios.post(
        "https://api.remove.bg/v1.0/removebg",
        form,
        {
          headers: {
            ...form.getHeaders(),
            "X-Api-Key":
            process.env.REMOVE_BG_API_KEY
          },
          responseType:
          "arraybuffer"
        }
      );

    const result =
      Buffer.from(
        response.data
      ).toString(
        "base64"
      );

    return {

      statusCode: 200,

      body: JSON.stringify({

        image:
        `data:image/png;base64,${result}`

      })

    };

  } catch (error) {

    console.error(error);

    return {

      statusCode: 500,

      body: JSON.stringify({

        error:
        "Failed to remove background"

      })

    };

  }

};
```
