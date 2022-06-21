function isFunction(str: string): boolean {
    let arrLex = ["sin", "cos", "tan", "asin", "acos", "atan", "abs", "round", "ceil", "floor", "log", "exp",
        "sqrt", "max", "min", "random", "sum", "pi", "e"];
    if (arrLex.indexOf(str) === -1) return false;
    return true;
}

function getNumber(tmp: string): number {
    let number: number = Number(tmp);
    //Взятие значения из ячейки
    if (Number.isNaN(number)) number = 5;//Number(document.getElementById(tmp).innerHTML);

    return number;
}

class Lexem {
    public type: string;
    public value?: string | number | undefined;

    constructor(type: string, value?: string | number | undefined) {
        this.type = type;
        this.value = value;
    }
}

function splitIntoLexems(formula: string) {
    let arrLex = [];

    let tmp = "";

    for (let i = 0; i < formula.length; i++) {
        if (/[+\-*\/\^%=(),:]/.test(formula[i])) {
            if (tmp !== "") {
                if (!isFunction(tmp)) arrLex.push(new Lexem("number", getNumber(tmp)));
                else arrLex.push(new Lexem("identifier", tmp));

                tmp = "";
            }

            arrLex.push(new Lexem(formula[i]));
            continue;
        }

        if (formula[i] === " ") continue;
        tmp += formula[i];
    }

    if (tmp != "") arrLex.push(new Lexem("number", getNumber(tmp)));
    arrLex.push({ type: "(end)" });
    return arrLex;
}

function parse(tokens: Lexem[]) {
    let symbols: any = {};

    const symbol = (id: string, lbp?: number | undefined | null, nud?: Function | undefined | null, led?: Function | undefined) => {
        if (!symbols[id]) {
            symbols[id] = {
                lbp: lbp,
                nud: nud,
                led: led
            };
        } else {
            if (nud) symbols[id].nud = nud;
            if (led) symbols[id].led = led;
            if (lbp) symbols[id].lbp = lbp;
        }
    };

    const interpretToken = (token: any) => {
        let F: any = function () { };
        F.prototype = symbols[token.type];
        let sym = new F;
        sym.type = token.type;
        sym.value = token.value;
        return sym;
    };


    symbol(",");
    symbol(")");
    symbol(":");
    symbol("(end)");

    let i = 0,
        token = function () {
            return interpretToken(tokens[i]);
        };
    const advance = function () {
        i++;
        return token();
    };

    const expression = (rbp?: any) => {
        let left, t = token();
        advance();
        left = t.nud(t);
        while (rbp < token().lbp) {
            t = token();
            advance();
            left = t.led(left);
        }
        return left;
    };

    const infix = (id: string, lbp?: number, rbp?: any, led?: Function | null) => {
        rbp = rbp || lbp;
        symbol(id, lbp, null, led ||
            function (left: {}) {
                return {
                    type: id,
                    left: left,
                    right: expression(rbp)
                };
            });
    };
    const prefix = (id: string, rbp?: number, nud?: Function | null | undefined) => {
        symbol(id, null, nud ||
            function () {
                return {
                    type: id,
                    right: expression(rbp)
                };
            });
    };

    prefix("number", 9, function (number: number) {
        return number;
    });
    prefix("identifier", 9, function (name: any) {
        if (token().type === "(") {
            let args = [];
            if (tokens[i + 1].type === ")") advance();
            else {
                do {
                    advance();
                    args.push(expression(2));
                } while (token().type === "," || token().type === ":");
            }
            advance();
            return {
                type: "call",
                args: args,
                name: name.value
            };
        }
        return name;
    });

    prefix("(", 8, function () {
        let value = expression(2);
        advance();
        return value;
    });

    prefix("-", 7);
    infix("^", 6, 5);
    infix("*", 4);
    infix("/", 4);
    infix("%", 4);
    infix("+", 3);
    infix("-", 3);

    let tree = [];
    while (token().type !== "(end)") {
        tree.push(expression(0));
    }
    return tree;
}

function init(parseTree: any) {
    let operators: any = {
        "+": function (a: number, b: number) {
            return a + b;
        },
        "-": function (a: number, b?: number | undefined) {
            if (typeof b === "undefined") return -a;
            return a - b;
        },
        "*": function (a: number, b: number) {
            return a * b;
        },
        "/": function (a: number, b: number) {
            return a / b;
        },
        "%": function (a: number, b: number) {
            return a % b;
        },
        "^": function (a: number, b: number) {
            return Math.pow(a, b);
        }
    };

    let variables: any = {
        pi: Math.PI,
        e: Math.E
    };

    let functions: any = {
        sin: Math.sin,
        cos: Math.cos,
        tan: Math.tan,
        asin: Math.asin,
        acos: Math.acos,
        atan: Math.atan,
        abs: Math.abs,
        round: Math.round,
        ceil: Math.ceil,
        floor: Math.floor,
        log: Math.log,
        exp: Math.exp,
        sqrt: Math.sqrt,
        max: Math.max,
        min: Math.min,
        random: Math.random,
        sum: function (num1: string, num2: string) {
            let res = 0.0;
            if (Number.isNaN(Number(num1)) || Number.isNaN(Number(num2))) {
                let count = Number(num2) - Number(num1);
                for (let i = 0; i < count; i++) res += getNumber(num1 + i);
            }
            //проверка для чисел
            for (let i = Number(num1); i < Number(num2); i++) res += i;
            return res;
        }
    };
    let args: any = {};

    interface Node {
        type: any;
        value: any;
        left: any;
        right: any;
        args: any[];
        name: any;
    }

    let parseNode = function (node: Node): any {
        if (node.type === "number") return node.value;
        else if (operators[node.type]) {
            if (node.left) return operators[node.type](parseNode(node.left), parseNode(node.right));
            return operators[node.type](parseNode(node.right));
        }
        else if (node.type === "identifier") {
            var value = args.hasOwnProperty(node.value) ? args[node.value] : variables[node.value];
            return value;
        }
        else if (node.type === "assign") {
            variables[node.name] = parseNode(node.value);
        }
        else if (node.type === "call") {
            for (var i = 0; i < node.args.length; i++) node.args[i] = parseNode(node.args[i]);
            return functions[node.name].apply(null, node.args);
        }
        else if (node.type === "function") {
            functions[node.name] = function () {
                for (var i = 0; i < node.args.length; i++) {
                    args[node.args[i].value] = arguments[i];
                }
                var ret = parseNode(node.value);
                args = {};
                return ret;
            };
        }
    };

    let res = "";
    for (let i = 0; i < parseTree.length; i++) {
        let value = parseNode(parseTree[i]);
        if (typeof value !== "undefined") res += value + "\n";
    }
    return res;
}

export function parser(formula: string) {
    let res = init(parse(splitIntoLexems(formula)));
    return res;
}