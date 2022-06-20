import { ReactComponent } from "./component";
import { React } from "./react";
import { ReactNode } from "./types";

class App extends ReactComponent<{}, {}>{
    public render(): ReactNode {
        return React.createElement({
            tagname: 'div',
            key: 'app',
            children: [
                React.createText({value: 'Привет'})
            ]
        });
    }
}

export default App;