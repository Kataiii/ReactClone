import { React } from "./react";
import { renderDOM, applyUpdate } from "./render";
import { ReactComponent } from "./component";
import { ReactNode } from "./types";
import App from "./App";


renderDOM('root', React.createComponent({
    component: App,
    props: {},
    key: 'root'
}))

