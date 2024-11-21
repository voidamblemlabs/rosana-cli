import { Button } from "../.ui/buttons.js";
import { $Layout, $Html } from "rosana";

const aboutPage = $Layout.Linear("fillxy, vcenter");

let title = $Html.P(aboutPage);
title.textContent = "That page dont exist bro";

let btn = Button(aboutPage, "Go To Home Page");
btn.ontouch = () => {
    app.router.navigate("/");
};

export default aboutPage;
