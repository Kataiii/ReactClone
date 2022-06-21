import { ReactComponent } from "../component";
import Parser from "../helpers/parser";
import { React } from "../react";
import { ReactNode } from "../types";

export interface IHeaderProps{
    value: string,
    setValue: (value: string) => void
}

class Header extends ReactComponent<IHeaderProps, {}>{


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

    public render(): ReactNode {
        return React.createElement({
            key: 'header',
            tagname: 'header',
            className: 'header',
            children: [
                React.createElement({
                    key: 'inputMain',
                    tagname: 'input',
                    className: 'header__input',
                    attributes: {
                        value: this.props.value,
                        oninput: this.handleChangeEvent
                    }
                }),
                React.createElement({
                    key: 'save-btn',
                    tagname: 'button',
                    className: 'header__save-btn',
                    children: [
                        React.createText({value: 'Сохранить'})
                    ]
                })
            ]
        })
    }
}

export default Header;