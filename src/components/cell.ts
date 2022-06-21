import { CellInfo } from "../App";
import { ReactComponent } from "../component";
import Parser from "../helpers/parser";
import { React } from "../react";
import { ReactNode } from "../types";

export interface ICell{
    value: CellInfo
    setValue: (value: string) => void,
    id: number,
    setSelected: () => void
}

class Cell extends ReactComponent<ICell, {}>{


    handleChangeEvent = (e: Event) => {
        e.preventDefault();
        const targetValue = e.currentTarget.value as string;
        if(targetValue.startsWith('<') && targetValue.endsWith('>')){
            const res = Parser.getInstanse().parse(targetValue.slice(1, targetValue.length-1))
            const newValue = Number.isNaN(Number(res)) ? '#НЕЧИСЛО': res;
            this.props.setValue(newValue);
        }
        else{
            this.props.setValue(targetValue);
        }
        
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
                value: this.props.value.value,
                onfocus: this.handleFocusEvent,
                oninput: this.handleChangeEvent
            }
        })
    }

}

export default Cell;