import { ReactComponent } from "./component";
import Header, { IHeaderProps } from "./components/header";
import Table, { ITableProp } from "./components/table";
import { generateLetterByNumber } from "./helpers/letterGenerator";
import { React } from "./react";
import { ReactNode } from "./types";


export interface CellInfo {
    tableId: string,
    columnTag: string,
    rowTag: string,
    value: string
}

interface IAppState {
    elements: Array<CellInfo>,
    selectedid: number | null
}


class App extends ReactComponent<{}, IAppState>{


    columnCount = 60;
    rowCount = 20;

    private buildElements() {
        let elements: CellInfo[] = [];
        for (let columnTag = 0; columnTag < this.columnCount; columnTag++) {
            for (let rowTag = 0; rowTag < this.rowCount ; rowTag++) {
                elements.push({
                    tableId: generateLetterByNumber(columnTag) +(rowTag + 1).toString(),
                    columnTag: columnTag.toString(),
                    rowTag: rowTag.toString(),
                    value: ''
                })
            }
        }
        return elements;
    }

    state: IAppState = {
        elements: this.buildElements(),
        selectedid: null,
    }

    setValue = (value: string) => {
        if (this.state.selectedid != null) {
            this.setState((state) => ({
                ...state,
                elements: [
                    ...state.elements.slice(0, state.selectedid),
                    {
                        ...state.elements[state.selectedid],
                        value: value
                    },
                    ...state.elements.slice(state.selectedid + 1, state.elements.length)
                ]
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
                        value: this.state.selectedid != null ? this.state.elements[this.state.selectedid].value : '',
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