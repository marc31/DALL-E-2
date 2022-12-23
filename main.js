import "./style.css";
import Alpine from "alpinejs";
import { Configuration, OpenAIApi } from "openai";

// suggested in the Alpine docs:
// make Alpine on window available for better DX
window.Alpine = Alpine;

document.addEventListener("alpine:init", () => {
  let configuration = null;
  let openai = null;

  Alpine.data("body", () => ({
    nbImage: 0,
    images: [],

    size: "1024x1024",
    apiKey: localStorage.getItem("apiKey") || "",
    prompt: "",
    imageUrl: "",
    error: "",
    showApiKey: false,
    loading: false,

    onload() {
      this.images.push({
        url: this.imageUrl,
        prompt: this.prompt,
      });
      this.nbImage++;
      this.loading = false;
    },

    async fetchImage() {
      if (configuration === null || configuration?.apiKey !== this.apiKey) {
        configuration = new Configuration({
          apiKey: this.apiKey,
        });
        openai = new OpenAIApi(configuration);
      }

      this.loading = true;
      this.error = "";
      try {
        const response = await openai.createImage({
          prompt: this.prompt,
          n: 1,
          size: this.size,
        });
        this.imageUrl = response.data.data[0].url;
      } catch (error) {
        if (error.response) {
          this.error = `Status : ${error.response.status}. Data: ${error.response.data}.`;
        } else {
          this.error = error.message;
        }
        this.imageUrl = null;
        this.loading = false;
      }
    },
  }));
});

Alpine.start();
