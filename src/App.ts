import { ReactComponent } from "./component";
import Header, { IHeaderProps } from "./components/header";
import Table, { ITableProp } from "./components/table";
import { React } from "./react";
import { ReactNode } from "./types";


interface IAppState {
    elements: Array<string>,
    selectedid: number | null
}

class App extends ReactComponent<{}, IAppState>{



    state:IAppState = {
        elements: Array<string>(100).fill(''),
        selectedid: null,
    }

    setValue = (value: string) => {
        if(this.state.selectedid != null){
            this.setState((state) => ({
                ...state,
                elements: [...state.elements.slice(0, state.selectedid), value, ...state.elements.slice(state.selectedid+1, state.elements.length)]
            }))
        }
    }
    
    setSelected = (index: number) => {
        this.setState((state) => ({
            ...state,
            selectedid: index
        }))
    }

    public render(): ReactNode {
        return React.createElement({
            tagname: 'div',
            className: 'app',
            key: 'app',
            children: [
                React.createComponent<IHeaderProps>({
                    key: 'header-c',
                    component: Header,
                    props: {
                        value: this.state.selectedid != null ? this.state.elements[this.state.selectedid] : '',
                        setValue: this.setValue
                    }
                }),
                React.createComponent<ITableProp>({
                    key: 'table-c',
                    component: Table,
                    props: {
                        elements: this.state.elements,
                        setValue: this.setValue,
                        setSelected: this.setSelected
                    }
                })
            ]
        });
    }
}

export default App;