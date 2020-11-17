// required for local dev, actual font will be sourced from inside the html file
import "./assets/fonts/font.scss";
import "@fortawesome/fontawesome-free/css/all.css";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(router);
app.mount("#app");
