import { ReactComponent } from "../component";
import { React } from "../react";
import { ReactNode } from "../types";

export interface IHeaderProps{
    value: string,
    setValue: (value: string) => void
}

class Header extends ReactComponent<IHeaderProps, {}>{


    setValue = (e: any) => {
        e.preventDefault();
        this.props.setValue(e.target.value)
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
                        onchange: this.setValue
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