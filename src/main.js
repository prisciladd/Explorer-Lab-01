import "./css/index.css";
import IMask from 'imask';

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type){
    const colors = {
        visa: ["#436D99", "#2D57F2"],
        mastercard: ["#C69347", "#DF6F29"],
        default: ["black","gray"],
        avanade: ["#EA620D","#FFA825"]
    }

    ccBgColor01.setAttribute("fill", colors[type][0])
    ccBgColor02.setAttribute("fill", colors[type][1])
    ccLogo.setAttribute("src", `cc-${type}.svg`)
}

setCardType("visa")

//globalThis.setCardType = setCardType //disponibilizando a função no escopo global para poder executar via DOM no navegador web

const securityCode = document.querySelector('#security-code')
const securityCodePattern = {
    mask: "0000",
}

const securityCodeMasked = IMask(securityCode,securityCodePattern)


const expirationDate = document.querySelector('#expiration-date')
const expirationDatePattern = {
    mask: "MM{/}YY",
    blocks: {
        MM:{
            mask: IMask.MaskedRange,
            from: 1,
            to: 12
        },
        YY:{
            mask: IMask.MaskedRange,
            from: String(new Date().getFullYear()).slice(2),
            to: String(new Date().getFullYear() + 10).slice(2)
        }
    }
}

const expirationDateMasked = IMask(expirationDate,expirationDatePattern)


const cardNumber = document.querySelector('#card-number')
const cardNumberPattern = {
    mask: [
    {   mask: "0000 0000 0000 0000",
        cardtype: "visa",
        regex: /^4\d{0,15}/,
    },
    
    {   mask: "0000 0000 0000 0000",
        cardtype: "mastercard",
        regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
    },

    {
        mask: "0000 0000 0000 0000",
        cardtype: "default",
    },
    ],

    dispatch: function(appended, dynamicMasked){ //propriedade dispatch roda uma função a cada número digitado, a função recebe como parâmetros a máscara dinâmica criada acima mask[] e o número para adicionar no array[]

        const number = (dynamicMasked.value + appended).replace(/\D/g,"") //adiciona número no array[] ou substitui por vazio"" caso o caractere digitado seja um não número \D

        const foundMask = dynamicMasked.compiledMasks.find(function(item){ //procura (.find) no array através de uma função se o número digitado passa na validação de alguma regex
            return number.match(item.regex) //retorna true caso o número na variável number combine com a regex do item
        })
        console.log(foundMask)

        return foundMask //retorna a mascara encontrada
    },
}

const cardNumberMasked = IMask(cardNumber,cardNumberPattern)


const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", ()=>{
    alert("Cartão adicionado!")
})

document.querySelector("form").addEventListener("submit",(event) =>{
    event.preventDefault()
})

const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () =>{
    const ccHolder = document.querySelector(".cc-holder .value")
    ccHolder.innerText = cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value
})

securityCodeMasked.on("accept", () =>{
    updateSecurityCode(securityCodeMasked.value);
}) //on é igual ao addEventListener

function updateSecurityCode(code){
    const ccSecurity = document.querySelector(".cc-security .value")

    ccSecurity.innerText = code.length === 0 ? "123" : code
}

cardNumberMasked.on("accept", () =>{
    const cardType = cardNumberMasked.masked.currentMask.cardtype
    setCardType(cardType) 
    updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber (number){
    const ccNumber = document.querySelector (".cc-number")
    ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number
}

expirationDateMasked.on ("accept", () =>{
    updateExpirationDate(expirationDateMasked.value)
})

function updateExpirationDate(date){
    const ccExpiration = document.querySelector(".cc-extra .value")
    ccExpiration.innerText = date.length === 0 ? "02/32" : date
}