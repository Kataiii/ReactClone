import { CellInfo } from "../App";
import { ReactComponent } from "../component";
import { generateLetterByNumber } from "../helpers/letterGenerator";
import Parser from "../helpers/parser";
import { React } from "../react";
import { ReactNode } from "../types";
import Cell, { ICell } from "../components/cell";

export interface ITableProp {
    elements: Array<CellInfo>,
    initElements: () => void
    setSelected: (index: number) => void,
    setValue: (value: string) => void
}



class Table extends ReactComponent<ITableProp, {}>{

    componentDidMount() {
        this.props.initElements();
    }

    componentDidUpdate() {
        Parser.getInstanse().init(this.props.elements);
    }

    setSelected = (index: number) => {
        return () => this.props.setSelected(index)
    }


    buildLayout = () => {
        const layout: ReactNode[] = [];
        let index = 0;
        const columnCount = Number.parseInt(this.props.elements[this.props.elements.length - 1].columnTag) + 1;
        const rowCount = Number.parseInt(this.props.elements[this.props.elements.length - 1].rowTag) + 1;

        layout.push(React.createElement({
            key: 'initialColumn',
            tagname: 'div',
            className: 'column',
            children: (new Array(rowCount + 1).fill('')).map((item, index) => React.createElement({
                key: `tag${index}`,
                tagname: 'div',
                className: 'tag',
                children: [
                    React.createText({ value: index == 0 ? '' : index.toString() })
                ]
            }))
        }))

        for (let columnIndex = 0; columnIndex < columnCount; columnIndex++) {
            const children: ReactNode[] = [React.createElement({
                key: `${columnIndex}`,
                tagname: 'div',
                className: 'tag',
                children: [
                    React.createText({ value: generateLetterByNumber(columnIndex) })
                ]
            })];
            for (let rowIndex = columnIndex; rowIndex < this.props.elements.length; rowIndex += columnCount) {
                children.push(React.createComponent<ICell>({
                    key: index.toString(),
                    component: Cell,
                    props: {
                        id: rowIndex,
                        value: this.props.elements[rowIndex], //this.props.elements[rowIndex].value,
                        setValue: this.props.setValue,
                        setSelected: this.setSelected(rowIndex)
                    }
                }))
            }
            index++;
            layout.push(React.createElement({
                key: `column-${index}`,
                tagname: 'div',
                className: 'column',
                children: children
            }));
        }

        return layout;
    }


    public render(): ReactNode {
        return React.createElement({
            key: 'table',
            tagname: 'div',
            className: 'table',
            children: this.props.elements.length > 0 ? this.buildLayout() : []
        })
    }
}

export default Table;