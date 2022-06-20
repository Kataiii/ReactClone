import { ReactComponent } from "../component";
import { React } from "../react";
import { ReactNode } from "../types";
import Cell, { ICell } from "./cell";

export interface ITableProp {
    elements: Array<string>,
    setSelected: (index: number) => void,
    setValue: (value: string) => void
}

class Table extends ReactComponent<ITableProp, {}>{
    setSelected = (index: number) => {
        return () => this.props.setSelected(index)
    }

    public render(): ReactNode {
        return React.createElement({
            key: 'table',
            tagname: 'div',
            className: 'table',
            children: this.props.elements.map((el, index) => React.createComponent<ICell>({
                key: index.toString(),
                component: Cell,
                props: {
                    id: index,
                    value: el,
                    setValue: this.props.setValue,
                    setSelected: this.setSelected(index)
                }
            }))
        })
    }
}

export default Table;