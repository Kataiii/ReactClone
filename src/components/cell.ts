import { ReactComponent } from "../component";
import { React } from "../react";
import { ReactNode } from "../types";

export interface ICell{
    value: string,
    setValue: (value: string) => void,
    id: number,
    setSelected: () => void
}

class Cell extends ReactComponent<ICell, {}>{


    handleChangeEvent = (e: any) => {
        e.preventDefault();
        this.props.setValue(e.target.value);
    }

    handleFocusEvent = (e: Event) => {
        e.preventDefault();
        this.props.setSelected()
    }


    public render(): ReactNode {
        return React.createElement({
            key: this.props.id.toString(),
            tagname: 'input',
            className: 'table__cell',
            attributes:{
                value: this.props.value,
                onchange: this.handleChangeEvent,
                onfocus: this.handleFocusEvent
            }
        })
    }

}

export default Cell;