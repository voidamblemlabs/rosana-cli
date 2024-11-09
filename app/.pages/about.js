import { $LinearLayout } from "rosana";
import { outlinedButton } from "./.ui/buttons.js";
import { navigationBar } from "./.ui/navigation.js";

export const aboutPage = $LinearLayout("fillxy, top");

navigationBar(aboutPage);

let contentLayout = $LinearLayout("fillxy, vcenter");
aboutPage.addChild(contentLayout);

let btn = outlinedButton(contentLayout, "The About Page");
btn.on("click", () => {
    app.router.navigate("index");
});
