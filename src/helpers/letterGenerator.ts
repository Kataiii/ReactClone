export const generateLetterByNumber = (num: number): string => {
    if(num / 26 <1){
        return String.fromCodePoint('A'.codePointAt(0) + num);
    }
    else{
        return String.fromCodePoint('A'.codePointAt(0) + Math.floor(num / 26) -1) + generateLetterByNumber(num % 26);
    }
}