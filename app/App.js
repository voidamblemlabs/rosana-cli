import { $createApp, $router } from "rosana";

import homePage from "./.pages/index.js";

const routes = [
    { path: "/", component: homePage },
    { path: "/about", component: () => import("./.pages/about.js") },
    { path: "/user/:id", component: () => import("./.pages/user.js") },
];
const router = new $router(routes);

window.app = $createApp(homePage).use(router).mount("#app");
