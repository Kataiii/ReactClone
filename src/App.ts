import { ReactComponent } from "./component";
import Header, { IHeaderProps } from "./components/header";
import Table, { ITableProp } from "./components/table";
import { generateLetterByNumber } from "./helpers/letterGenerator";
import Parser from "./helpers/parser";
import CreationPage, { IConstraints, ITableConstraintsProps } from "./pages/creationPage";
import { React } from "./react";
import { ReactNode } from "./types";


export interface CellInfo {
    tableId: string,
    columnTag: string,
    rowTag: string,
    value: string
}

interface IAppState {
    constraints: IConstraints
    elements: Array<CellInfo>,
    selectedid: number | null,
    isCreating: boolean
}


class App extends ReactComponent<{}, IAppState>{

    state: IAppState = {
        elements: [],
        selectedid: null,
        constraints: {
            columns: 10,
            rows: 10
        },
        isCreating: true
    }

    private buildElements(columnCount: number, rowCount: number) {
        let elements: CellInfo[] = [];
        for (let columnTag = 0; columnTag < columnCount; columnTag++) {
            for (let rowTag = 0; rowTag < rowCount; rowTag++) {
                elements.push({
                    tableId: generateLetterByNumber(rowTag) + (columnTag + 1).toString(),
                    columnTag: columnTag.toString(),
                    rowTag: rowTag.toString(),
                    value: ''
                })
            }
        }
        return elements;
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

    setConstraints = (key: string, value: number) => {
        this.setState(state => ({
            ...state,
            constraints: {
                ...state.constraints,
                [key]: value
            }
        }));
    }

    setSelected = (index: number) => {
        this.setState((state) => ({
            ...state,
            selectedid: index
        }))
    }

    setToTable = () => this.setState(state => ({ ...state, isCreating: false }));

    initElements = () => {
        this.setState(state => ({
            ...state,
            elements: this.buildElements(state.constraints.columns, state.constraints.rows)
        }))
    }

    parseFormula(formula: string) {
        if (formula[0] === '=') {
            const res = Parser.getInstanse().parse(formula.slice(1, formula.length));
            this.setValue(res);
        }
    }

    public render(): ReactNode {

        return this.state.isCreating
            ? React.createComponent<ITableConstraintsProps>({
                key: 'creation-window-page',
                component: CreationPage,
                props: {
                    setConstraints: this.setConstraints,
                    constraints: this.state.constraints,
                    setToTable: this.setToTable
                }
            })

            : React.createElement({
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
                            initElements: this.initElements,
                            setValue: this.setValue,
                            setSelected: this.setSelected
                        }
                    })
                ]
            });
    }
}

export default App;