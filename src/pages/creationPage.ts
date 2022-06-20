import { ReactComponent } from "../component";
import { React } from "../react";
import { ReactNode } from "../types";

export interface IConstraints {
    columns: number,
    rows: number
}

export interface ITableConstraintsProps {
    constraints: IConstraints
    setConstraints: (key: string, value: number) => void,
    setToTable: () => void
}

class CreationPage extends ReactComponent<ITableConstraintsProps, {}>{


    changeConstrainsts = (key: string) => {
        return (e: any) => {
            this.props.setConstraints(key, e.target.value);
        }
    }

    generateTable = (e: Event) => {
        e.preventDefault();
        this.props.setToTable()
    }

    isDisable = () => this.props.constraints.columns <=0 || this.props.constraints.rows <=0;

    public render(): ReactNode {
        return React.createElement({
            key: 'creation-window',
            tagname: 'div',
            className: 'creation',
            children: [
                React.createElement({
                    key: 'creation-form',
                    tagname: 'form',
                    className: 'creation__form',
                    attributes: {
                        onsubmit: this.generateTable
                    },
                    children: [
                        React.createElement({
                            key: 'row-wrapper',
                            tagname: 'div',
                            className: 'form__row',
                            children: [
                                React.createElement({
                                    key: 'label-col',
                                    tagname: 'label',
                                    className: 'input__label',
                                    children: [
                                        React.createText({ value: 'Количество колонн: ' })
                                    ]
                                }),
                                React.createElement({
                                    key: 'input-col',
                                    tagname: 'input',
                                    className: 'creation__input',
                                    attributes: {
                                        value: this.props.constraints.columns,
                                        onchange: this.changeConstrainsts('columns')
                                    }
                                })
                            ]
                        }),
                        React.createElement({
                            key: 'row-wrapper',
                            tagname: 'div',
                            className: 'form__row',
                            children: [
                                React.createElement({
                                    key: 'label-r',
                                    tagname: 'label',
                                    className: 'input__label',
                                    children: [
                                        React.createText({ value: 'Количество рядов: ' })
                                    ]
                                }),
                                React.createElement({
                                    key: 'input-r',
                                    tagname: 'input',
                                    className: 'creation__input',
                                    attributes: {
                                        value: this.props.constraints.rows,
                                        onchange: this.changeConstrainsts('rows')
                                    }
                                })
                            ]
                        }),
                        React.createElement({
                            key: 'submit-btn',
                            tagname: 'button',
                            className: 'creation__submit',
                            attributes:{
                                type: 'submit',
                                disabled: this.isDisable()
                            },
                            children: [
                                React.createText({value: 'Создать'})
                            ]
                        })


                    ]
                })
            ]
        })
    }
}

export default CreationPage;