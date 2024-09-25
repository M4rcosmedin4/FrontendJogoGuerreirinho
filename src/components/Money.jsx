import React from "react"
const Money =({statusPartida})=>{

    const dinheiro = statusPartida?.Dinheiro;

    return(
<h4>{dinheiro}</h4>
    )
}
export default Money