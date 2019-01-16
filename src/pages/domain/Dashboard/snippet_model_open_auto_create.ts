export const modelOpenAutoCreateSnippet = `
domain.models()
  .openAutoCreate({
    collection: "my-collection",
    ephemeral: true,
    data: {
      "string": "test value",
      "number": 10,
      "boolean": true,
      "array": [
        "Apples",
        "Bananas",
        "Pears",
        "Orange"
      ],
      "object": {
        "key1": "value1",
        "key2": "value2",
        "key3": "value3",
        "key4": "value4"
      }
    }
  })
  .then((model) => {
    console.log("model open");
    // use the model
  })
  .catch((error) => {
    console.log("Could not open the model", error);
  });`.trim();
