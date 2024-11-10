import { $LinearLayout } from "rosana";
import { outlinedButton } from "./.ui/buttons.js";
import { navigationBar } from "./.ui/navigation.js";

const aboutPage = $LinearLayout("fillxy, top");

navigationBar(aboutPage);

let contentLayout = $LinearLayout("fillxy, vcenter");
aboutPage.addChild(contentLayout);

let btn = outlinedButton(contentLayout, "Go To User Page");
btn.on("click", () => {
    app.router.navigate("/user/:id", { id: "JohhySins" });
});

export default aboutPage;
