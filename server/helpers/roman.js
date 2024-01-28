export default function decimalToRoman(value) { 
    let roman = ["M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"]; 
    let decimal = [1000,900,500,400,100,90,50,40,10,9,5,4,1]; 
    
    if (isNaN(value) || value <= 0 || value >= 4000) return value; 

    let romanNumeral = ""; 
    
    for (let i=0; i<roman.length; i++) { 
        while (value >= decimal[i]) {  
            value -= decimal[i]; 
            romanNumeral += roman[i]; 
        } 
    } 
    
    return romanNumeral; 
}